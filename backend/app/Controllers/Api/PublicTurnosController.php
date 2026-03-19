<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use Config\Database;

final class PublicTurnosController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = Database::connect();

        $pendientes = $db->table('clientes')
            ->select([
                'clientes.id',
                'clientes.id as turno',
                'clientes.dni',
                'clientes.nombre',
                'clientes.estado',
                'clientes.fecha_registro',
                'clientes.fecha_asignacion',
                'usuarios.ventanilla as ventanilla',
                'usuarios.nombres as agente',
            ])
            ->join('usuarios', 'usuarios.id = clientes.usuario_id', 'left')
            ->whereIn('clientes.estado', ['Nuevo', 'Asignado'])
            ->orderBy("FIELD(clientes.estado,'Asignado','Nuevo')", '', false)
            ->orderBy('clientes.fecha_registro', 'ASC')
            ->orderBy('clientes.id', 'ASC')
            ->get()
            ->getResultArray();

        $history = $db->table('clientes')
            ->select([
                'clientes.id',
                'clientes.id as turno',
                'clientes.dni',
                'clientes.nombre',
                'clientes.estado',
                'clientes.fecha_registro',
                'clientes.fecha_asignacion',
                'usuarios.ventanilla as ventanilla',
                'usuarios.nombres as agente',
            ])
            ->join('usuarios', 'usuarios.id = clientes.usuario_id', 'left')
            ->whereIn('clientes.estado', ['Atendido', 'No Atendido'])
            ->orderBy('clientes.id', 'DESC')
            ->limit(10)
            ->get()
            ->getResultArray();

        return $this->respond([
            'data' => $pendientes,
            'history' => $history,
        ]);
    }
}
