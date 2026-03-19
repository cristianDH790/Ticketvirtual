<?php

declare(strict_types=1);

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

final class CorsFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if (strtoupper((string) $request->getMethod()) !== 'OPTIONS') {
            return null;
        }

        $response = Services::response();
        return $this->apply($request, $response)->setStatusCode(204);
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $this->apply($request, $response);
    }

    private function apply(RequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $origin = $request->getHeaderLine('Origin');
        $allowedOrigins = trim((string) env('CORS_ALLOWED_ORIGINS', '*'));

        $allowOrigin = '';
        if ($allowedOrigins === '*') {
            // Dev-friendly: echo back Origin when present (works with stricter browsers).
            $allowOrigin = $origin !== '' ? $origin : '*';
        } else {
            $allowed = array_values(array_filter(array_map('trim', explode(',', $allowedOrigins))));
            $allowOrigin = ($origin !== '' && in_array($origin, $allowed, true))
                ? $origin
                : ($allowed[0] ?? '');
        }

        if ($allowOrigin !== '') {
            $response->setHeader('Access-Control-Allow-Origin', $allowOrigin);
        }
        $response->setHeader('Vary', 'Origin');
        $response->setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        $response->setHeader('Access-Control-Allow-Headers', 'X-Authorization, Content-Type, Accept');
        $response->setHeader('Access-Control-Max-Age', '86400');
        return $response;
    }
}
