<?php

declare(strict_types=1);

namespace Config;

final class Paths
{
    public string $systemDirectory;
    public string $appDirectory;
    public string $writableDirectory;
    public string $testsDirectory;
    public string $viewDirectory;

    public function __construct()
    {
        $this->systemDirectory = __DIR__ . '/../../vendor/codeigniter4/framework/system';
        $this->appDirectory = __DIR__ . '/..';
        $this->writableDirectory = __DIR__ . '/../../writable';
        $this->testsDirectory = __DIR__ . '/../../tests';
        $this->viewDirectory = __DIR__ . '/../Views';
    }
}
