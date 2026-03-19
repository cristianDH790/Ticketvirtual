<?php

declare(strict_types=1);

namespace App\Common;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class JwtToken
{
    public static function encode(array $payload): string
    {
        $secret = (string) env('JWT_SECRET');
        $ttl = (int) env('JWT_TTL_SECONDS', 8 * 60 * 60);
        $now = time();

        $claims = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $ttl,
        ]);

        return JWT::encode($claims, $secret, 'HS256');
    }

    public static function decode(string $token): array
    {
        $secret = (string) env('JWT_SECRET');
        $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        return json_decode(json_encode($decoded, JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
    }
}

