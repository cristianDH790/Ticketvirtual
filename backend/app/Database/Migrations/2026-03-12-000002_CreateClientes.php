<?php

declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use CodeIgniter\Database\RawSql;

final class CreateClientes extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 10,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'dni' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
            ],
            'fecha_registro' => [
                'type' => 'DATETIME',
                'null' => false,
                'default' => new RawSql('CURRENT_TIMESTAMP'),
            ],
            'estado' => [
                'type' => "ENUM('Nuevo','Asignado','Atendido','No Atendido')",
                'default' => 'Nuevo',
            ],
            'usuario_id' => [
                'type' => 'INT',
                'constraint' => 10,
                'unsigned' => true,
                'null' => true,
            ],
            'fecha_asignacion' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('dni', 'ux_clientes_dni');
        $this->forge->addKey(['estado', 'fecha_registro'], false, false, 'ix_clientes_estado_fecha');
        $this->forge->addKey(['usuario_id', 'estado'], false, false, 'ix_clientes_usuario_estado');
        $this->forge->addForeignKey('usuario_id', 'usuarios', 'id', 'CASCADE', 'SET NULL', 'fk_clientes_usuario');

        $this->forge->createTable('clientes', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('clientes', true);
    }
}
