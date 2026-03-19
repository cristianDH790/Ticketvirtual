<?php

declare(strict_types=1);

namespace App\Services;

final class AuthContext
{
    /**
     * @var array<string, mixed>|null
     */
    private ?array $claims = null;

    /**
     * @param array<string, mixed> $claims
     */
    public function setClaims(array $claims): void
    {
        $this->claims = $claims;
    }

    /**
     * @return array<string, mixed>
     */
    public function claims(): array
    {
        return $this->claims ?? [];
    }

    public function userId(): ?int
    {
        $sub = $this->claims['sub'] ?? null;
        if ($sub === null) {
            return null;
        }
        return (int) $sub;
    }

    public function perfil(): ?string
    {
        $perfil = $this->claims['perfil'] ?? null;
        return $perfil === null ? null : (string) $perfil;
    }
}

