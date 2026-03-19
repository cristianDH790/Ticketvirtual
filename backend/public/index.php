<?php

declare(strict_types=1);

define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);

chdir(__DIR__);

require FCPATH . '../vendor/autoload.php';
require FCPATH . '../app/Config/Paths.php';

$paths = new Config\Paths();

require rtrim($paths->systemDirectory, '\\/ ') . DIRECTORY_SEPARATOR . 'Boot.php';

exit(CodeIgniter\Boot::bootWeb($paths));
