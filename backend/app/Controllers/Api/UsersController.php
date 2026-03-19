<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Models\UsuarioModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

final class UsersController extends ResourceController
{
    protected $modelName = UsuarioModel::class;
    protected $format = 'json';

    public function index()
    {
        $perPage = max(1, min(100, (int) ($this->request->getGet('perPage') ?? 20)));
        $page = max(1, (int) ($this->request->getGet('page') ?? 1));
        $login = trim((string) ($this->request->getGet('login') ?? ''));
        $perfil = trim((string) ($this->request->getGet('perfil') ?? ''));

        $builder = $this->model;
        if ($login !== '') {
            $builder = $builder->like('login', $login);
        }
        if ($perfil !== '') {
            $builder = $builder->where('perfil', $perfil);
        }

        $result = $builder
            ->select('id,nombres,ventanilla,login,perfil,fecha_creacion')
            ->orderBy('id', 'DESC')
            ->paginate($perPage, 'default', $page);

        return $this->respond([
            'data' => $result,
            'pager' => [
                'page' => $page,
                'perPage' => $perPage,
                'total' => $this->model->pager?->getTotal('default') ?? 0,
            ],
        ]);
    }

    public function create()
    {
        $payload = $this->request->getJSON(true) ?? [];

        $rules = [
            'nombres' => 'required|min_length[3]|max_length[150]',
            'login' => 'required|min_length[3]|max_length[80]|is_unique[usuarios.login]',
            'password' => 'required|min_length[6]|max_length[200]',
            'perfil' => 'required|in_list[Admin,Agente]',
            'ventanilla' => 'permit_empty|max_length[50]',
        ];

        if (!$this->validateData($payload, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $id = $this->model->insert([
            'nombres' => trim((string) $payload['nombres']),
            'ventanilla' => $payload['ventanilla'] !== '' ? (string) $payload['ventanilla'] : null,
            'login' => trim((string) $payload['login']),
            'password' => password_hash((string) $payload['password'], PASSWORD_DEFAULT),
            'perfil' => (string) $payload['perfil'],
        ], true);

        return $this->respondCreated(['id' => (int) $id]);
    }

    public function show($id = null)
    {
        $user = $this->model
            ->select('id,nombres,ventanilla,login,perfil,fecha_creacion')
            ->find($id);

        if (!$user) {
            return $this->failNotFound('Usuario no encontrado.');
        }

        return $this->respond($user);
    }

    public function update($id = null)
    {
        $payload = $this->request->getJSON(true) ?? [];
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Usuario no encontrado.');
        }

        $rules = [
            'nombres' => 'permit_empty|min_length[3]|max_length[150]',
            'ventanilla' => 'permit_empty|max_length[50]',
            'login' => "permit_empty|min_length[3]|max_length[80]|is_unique[usuarios.login,id,{$id}]",
            'password' => 'permit_empty|min_length[6]|max_length[200]',
            'perfil' => 'permit_empty|in_list[Admin,Agente]',
        ];

        if (!$this->validateData($payload, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [];
        if (array_key_exists('nombres', $payload) && $payload['nombres'] !== '') {
            $data['nombres'] = trim((string) $payload['nombres']);
        }
        if (array_key_exists('login', $payload) && $payload['login'] !== '') {
            $data['login'] = trim((string) $payload['login']);
        }
        if (array_key_exists('perfil', $payload) && $payload['perfil'] !== '') {
            $data['perfil'] = (string) $payload['perfil'];
        }
        if (array_key_exists('ventanilla', $payload)) {
            $ventanilla = (string) $payload['ventanilla'];
            $data['ventanilla'] = trim($ventanilla) === '' ? null : $ventanilla;
        }
        if (isset($payload['password']) && $payload['password'] !== '') {
            $data['password'] = password_hash((string) $payload['password'], PASSWORD_DEFAULT);
        }

        if ($data === []) {
            return $this->respond(['updated' => false], ResponseInterface::HTTP_OK);
        }

        $this->model->update((int) $id, $data);
        return $this->respond(['updated' => true], ResponseInterface::HTTP_OK);
    }

    public function delete($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Usuario no encontrado.');
        }

        $this->model->delete((int) $id);
        return $this->respondDeleted(['deleted' => true]);
    }
}
