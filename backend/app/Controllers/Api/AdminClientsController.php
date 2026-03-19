<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Models\ClienteModel;
use CodeIgniter\RESTful\ResourceController;
use Config\Database;

final class AdminClientsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $perPage = max(1, min(100, (int) ($this->request->getGet('perPage') ?? 20)));
        $page = max(1, (int) ($this->request->getGet('page') ?? 1));

        $dni = trim((string) ($this->request->getGet('dni') ?? ''));
        $nombre = trim((string) ($this->request->getGet('nombre') ?? ''));
        $estado = trim((string) ($this->request->getGet('estado') ?? ''));

        $db = Database::connect();
        $base = $db->table('clientes c')
            ->join('usuarios u', 'u.id = c.usuario_id', 'left');

        if ($dni !== '') {
            $base->like('c.dni', $dni);
        }
        if ($nombre !== '') {
            $base->like('c.nombre', $nombre);
        }
        if ($estado !== '') {
            $base->where('c.estado', $estado);
        }

        $countRow = (clone $base)->select('COUNT(*) as total', false)->get()->getRowArray();
        $total = (int) ($countRow['total'] ?? 0);

        $result = (clone $base)
            ->select([
                'c.id',
                'c.dni',
                'c.nombre',
                'c.fecha_registro',
                'c.estado',
                'c.fecha_asignacion',
                'u.id as agente_id',
                'u.nombres as agente_nombres',
                'u.ventanilla as agente_ventanilla',
            ])
            ->orderBy('c.fecha_registro', 'ASC')
            ->orderBy('c.id', 'ASC')
            ->get($perPage, ($page - 1) * $perPage)
            ->getResultArray();

        return $this->respond([
            'data' => $result,
            'pager' => [
                'page' => $page,
                'perPage' => $perPage,
                'total' => $total,
            ],
        ]);
    }

    public function assign(int $id)
    {
        $payload = $this->request->getJSON(true) ?? [];
        $agentId = (int) ($payload['usuario_id'] ?? 0);

        if ($agentId <= 0) {
            return $this->failValidationErrors(['usuario_id' => 'El agente es obligatorio.']);
        }

        $db = Database::connect();
        $db->transBegin();

        try {
            $cliente = $db->table('clientes')->where('id', $id)->get()->getRowArray();
            if (!$cliente) {
                $db->transRollback();
                return $this->failNotFound('Cliente no encontrado.');
            }

            if (in_array((string) $cliente['estado'], ['Atendido', 'No Atendido'], true)) {
                $db->transRollback();
                return $this->failValidationErrors(['estado' => 'No se puede reasignar un cliente finalizado.']);
            }

            $agente = $db->table('usuarios')
                ->select('id,nombres,ventanilla,perfil')
                ->where('id', $agentId)
                ->get()
                ->getRowArray();
            if (!$agente || (string) $agente['perfil'] !== 'Agente') {
                $db->transRollback();
                return $this->failValidationErrors(['usuario_id' => 'Agente inválido.']);
            }

            $now = date('Y-m-d H:i:s');
            $db->table('clientes')
                ->where('id', $id)
                ->update([
                    'usuario_id' => $agentId,
                    'estado' => 'Asignado',
                    'fecha_asignacion' => $now,
                ]);

            $db->transCommit();

            return $this->respond([
                'updated' => true,
                'data' => [
                    'id' => (int) $cliente['id'],
                    'dni' => (string) $cliente['dni'],
                    'nombre' => (string) $cliente['nombre'],
                    'fecha_registro' => (string) $cliente['fecha_registro'],
                    'estado' => 'Asignado',
                    'fecha_asignacion' => $now,
                    'agente_id' => (int) $agente['id'],
                    'agente_nombres' => (string) $agente['nombres'],
                    'agente_ventanilla' => $agente['ventanilla'],
                ],
            ]);
        } catch (\Throwable $e) {
            $db->transRollback();
            return $this->failServerError('No se pudo asignar el agente.');
        }
    }
}
