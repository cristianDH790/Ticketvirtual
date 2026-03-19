<?php

declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

final class ClienteModel extends Model
{
    protected $table = 'clientes';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'dni',
        'nombre',
        'fecha_registro',
        'estado',
        'usuario_id',
        'fecha_asignacion',
    ];

    protected $useTimestamps = false;
}

