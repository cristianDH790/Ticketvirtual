<?php

declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\Services as CoreServices;

final class Services extends CoreServices
{
    public static function authContext(bool $getShared = true): \App\Services\AuthContext
    {
        if ($getShared) {
            return static::getSharedInstance('authContext');
        }

        return new \App\Services\AuthContext();
    }
}
