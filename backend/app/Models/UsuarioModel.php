<?php

declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

final class UsuarioModel extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'nombres',
        'ventanilla',
        'login',
        'password',
        'perfil',
    ];

    protected $useTimestamps = false;
}

