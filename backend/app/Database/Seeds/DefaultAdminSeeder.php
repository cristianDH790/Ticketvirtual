<?php

declare(strict_types=1);

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

final class DefaultAdminSeeder extends Seeder
{
    public function run(): void
    {
        $login = (string) env('DEFAULT_ADMIN_LOGIN', 'admin');
        $password = (string) env('DEFAULT_ADMIN_PASSWORD', 'admin123');

        $exists = $this->db->table('usuarios')->where('login', $login)->get()->getRowArray();
        if ($exists) {
            return;
        }

        $this->db->table('usuarios')->insert([
            'nombres' => 'Administrador',
            'ventanilla' => null,
            'login' => $login,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'perfil' => 'Admin',
            'fecha_creacion' => date('Y-m-d H:i:s'),
        ]);
    }
}

