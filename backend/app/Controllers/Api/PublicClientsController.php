<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Models\ClienteModel;
use CodeIgniter\RESTful\ResourceController;

final class PublicClientsController extends ResourceController
{
    protected $format = 'json';

    public function create()
    {
        $payload = $this->request->getJSON(true) ?? [];

        $rules = [
            'dni' => 'required|min_length[5]|max_length[20]|is_unique[clientes.dni]',
            'nombre' => 'required|min_length[3]|max_length[150]',
        ];

        if (!$this->validateData($payload, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $clientes = new ClienteModel();
        $id = $clientes->insert([
            'dni' => trim((string) $payload['dni']),
            'nombre' => trim((string) $payload['nombre']),
            'estado' => 'Nuevo',
        ], true);

        return $this->respondCreated([
            'id' => (int) $id,
            'message' => 'Registro exitoso. ¡Gracias por registrarte!',
        ]);
    }
}
