<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Models\ClienteModel;
use CodeIgniter\Database\Exceptions\DatabaseException;
use CodeIgniter\RESTful\ResourceController;
use Config\Database;

final class AgentClientsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $agentId = service('authContext')->userId();
        if (!$agentId) {
            return $this->failUnauthorized('No autenticado.');
        }

        $estado = trim((string) ($this->request->getGet('estado') ?? ''));
        $dni = trim((string) ($this->request->getGet('dni') ?? ''));
        $nombre = trim((string) ($this->request->getGet('nombre') ?? ''));

        $clientes = new ClienteModel();
        $builder = $clientes->where('usuario_id', $agentId);
        if ($estado !== '') {
            $builder = $builder->where('estado', $estado);
        }
        if ($dni !== '') {
            $builder = $builder->like('dni', $dni);
        }
        if ($nombre !== '') {
            $builder = $builder->like('nombre', $nombre);
        }

        $data = $builder
            ->orderBy('fecha_registro', 'ASC')
            ->orderBy('id', 'ASC')
            ->findAll();

        return $this->respond(['data' => $data]);
    }

    public function assign()
    {
        $agentId = service('authContext')->userId();
        if (!$agentId) {
            return $this->failUnauthorized('No autenticado.');
        }

        $db = Database::connect();
        $db->transBegin();

        try {
            $row = $db->query(
                "SELECT * FROM clientes WHERE estado = 'Nuevo' ORDER BY fecha_registro ASC, id ASC LIMIT 1 FOR UPDATE"
            )->getRowArray();

            if (!$row) {
                $db->transCommit();
                return $this->respond(['message' => 'No hay clientes nuevos para asignar.'], 200);
            }

            $now = date('Y-m-d H:i:s');
            $db->table('clientes')
                ->where('id', (int) $row['id'])
                ->update([
                    'usuario_id' => $agentId,
                    'estado' => 'Asignado',
                    'fecha_asignacion' => $now,
                ]);

            $db->transCommit();

            $row['usuario_id'] = $agentId;
            $row['estado'] = 'Asignado';
            $row['fecha_asignacion'] = $now;

            return $this->respond(['data' => $row], 200);
        } catch (DatabaseException $e) {
            $db->transRollback();
            return $this->failServerError('No se pudo asignar el cliente.');
        }
    }

    public function updateStatus(int $id)
    {
        $agentId = service('authContext')->userId();
        if (!$agentId) {
            return $this->failUnauthorized('No autenticado.');
        }

        $payload = $this->request->getJSON(true) ?? [];
        $estado = (string) ($payload['estado'] ?? '');
        if (!in_array($estado, ['Atendido', 'No Atendido'], true)) {
            return $this->failValidationErrors(['estado' => 'Estado inválido.']);
        }

        $clientes = new ClienteModel();
        $cliente = $clientes->find($id);
        if (!$cliente) {
            return $this->failNotFound('Cliente no encontrado.');
        }
        if ((int) ($cliente['usuario_id'] ?? 0) !== (int) $agentId) {
            return $this->failForbidden('Solo el agente asignado puede actualizar el estado.');
        }

        $clientes->update($id, ['estado' => $estado]);
        return $this->respond(['updated' => true]);
    }
}

