<?php

declare(strict_types=1);

namespace Config;

final class Modules
{
    /**
     * Whether to enable auto-discovery of modules.
     */
    public bool $enabled = true;

    /**
     * Whether to discover modules in Composer packages.
     */
    public bool $discoverInComposer = true;

    /**
     * List of composer packages to ignore during discovery.
     *
     * @var list<string>
     */
    public array $composerPackages = [];

    /**
     * List of paths to search for modules (relative to ROOTPATH).
     *
     * @var list<string>
     */
    public array $aliases = [
        'PSR4' => APPPATH,
    ];

    /**
     * Indica si se debe ejecutar auto-discovery para un tipo de recurso.
     * Valores comunes: "events", "filters", "routes", "services".
     */
    public function shouldDiscover(string $alias): bool
    {
        return $this->enabled;
    }
}
