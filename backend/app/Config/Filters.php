<?php

declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\BaseConfig;

final class Filters extends BaseConfig
{
    /**
     * @var array<string, class-string>
     */
    public array $aliases = [
        'csrf' => \CodeIgniter\Filters\CSRF::class,
        'toolbar' => \CodeIgniter\Filters\DebugToolbar::class,
        'honeypot' => \CodeIgniter\Filters\Honeypot::class,
        'invalidchars' => \CodeIgniter\Filters\InvalidChars::class,
        'secureheaders' => \CodeIgniter\Filters\SecureHeaders::class,
        'cors' => \CodeIgniter\Filters\Cors::class,
        'jwt' => \App\Filters\JwtAuthFilter::class,
    ];

    /**
     * @var array<string, list<string>>
     */
    public array $globals = [
        'before' => ['cors'],
        'after' => ['cors'],
    ];

    /**
     * @var array<string, list<string>>
     */
    public array $methods = [];

    /**
     * @var array<string, list<string>>
     */
    public array $filters = [
        // Extra rule to ensure CORS always applies for /api/*
        'cors' => ['before' => ['api/*'], 'after' => ['api/*']],
    ];
}
