<?php

declare(strict_types=1);

namespace App\Filters;

use App\Common\JwtToken;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Config\Services;
use Throwable;

final class JwtAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = (string) $request->getHeaderLine('X-Authorization');
        if ($authHeader === '' || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->unauthorized('Token no proporcionado.');
        }

        $token = trim(substr($authHeader, 7));
        try {
            $claims = JwtToken::decode($token);
        } catch (Throwable $e) {
            return $this->unauthorized('Token inválido.');
        }

        $roles = is_array($arguments) ? $arguments : [];
        if ($roles !== []) {
            $perfil = (string) ($claims['perfil'] ?? '');
            if ($perfil === '' || !in_array($perfil, $roles, true)) {
                return $this->forbidden('No autorizado para este recurso.');
            }
        }

        service('authContext')->setClaims($claims);
        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return null;
    }

    private function unauthorized(string $message): ResponseInterface
    {
        return Services::response()
            ->setStatusCode(401)
            ->setJSON(['message' => $message]);
    }

    private function forbidden(string $message): ResponseInterface
    {
        return Services::response()
            ->setStatusCode(403)
            ->setJSON(['message' => $message]);
    }
}
