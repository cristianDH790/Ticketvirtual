<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Common\JwtToken;
use App\Models\UsuarioModel;
use CodeIgniter\RESTful\ResourceController;
use Throwable;

final class AuthController extends ResourceController
{
    public function login()
    {
        try {
            $payload = $this->request->getJSON(true) ?? [];
        } catch (Throwable $e) {
            return $this->failValidationErrors(['message' => 'JSON inválido.']);
        }
        $login = trim((string) ($payload['login'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($login === '' || $password === '') {
            return $this->failValidationErrors(['message' => 'Login y password son obligatorios.']);
        }

        $users = new UsuarioModel();
        $user = $users->where('login', $login)->first();
        if (!$user || !password_verify($password, (string) $user['password'])) {
            return $this->failUnauthorized('Credenciales inválidas.');
        }

        $token = JwtToken::encode([
            'sub' => (int) $user['id'],
            'perfil' => (string) $user['perfil'],
            'nombres' => (string) $user['nombres'],
            'ventanilla' => $user['ventanilla'],
        ]);

        return $this->respond([
            'token' => $token,
            'user' => [
                'id' => (int) $user['id'],
                'nombres' => (string) $user['nombres'],
                'ventanilla' => $user['ventanilla'],
                'login' => (string) $user['login'],
                'perfil' => (string) $user['perfil'],
            ],
        ]);
    }

    public function me()
    {
        $claims = service('authContext')->claims();
        if ($claims === []) {
            return $this->failUnauthorized('No autenticado.');
        }

        return $this->respond([
            'user' => [
                'id' => (int) ($claims['sub'] ?? 0),
                'perfil' => (string) ($claims['perfil'] ?? ''),
                'nombres' => (string) ($claims['nombres'] ?? ''),
                'ventanilla' => $claims['ventanilla'] ?? null,
            ],
        ]);
    }
}
