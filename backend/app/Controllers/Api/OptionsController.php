<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

final class OptionsController extends ResourceController
{
    public function preflight()
    {
        // Ensure preflight always succeeds even when other filters/configs change.
        $origin = (string) $this->request->getHeaderLine('Origin');
        $allowedOrigins = trim((string) env('CORS_ALLOWED_ORIGINS', '*'));

        $allowOrigin = '';
        if ($allowedOrigins === '*') {
            $allowOrigin = $origin !== '' ? $origin : '*';
        } else {
            $allowed = array_values(array_filter(array_map('trim', explode(',', $allowedOrigins))));
            $allowOrigin = ($origin !== '' && in_array($origin, $allowed, true))
                ? $origin
                : ($allowed[0] ?? '');
        }

        if ($allowOrigin !== '') {
            $this->response->setHeader('Access-Control-Allow-Origin', $allowOrigin);
        }
        $this->response->setHeader('Vary', 'Origin');
        $this->response->setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        $this->response->setHeader(
            'Access-Control-Allow-Headers',
            'X-Authorization, Content-Type, Accept, X-Requested-With',
        );
        $this->response->setHeader('Access-Control-Max-Age', '86400');

        return $this->response->setStatusCode(204);
    }
}
