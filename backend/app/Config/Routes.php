<?php

declare(strict_types=1);

namespace Config;

use CodeIgniter\Router\RouteCollection;
use Config\Services;

/** @var RouteCollection $routes */
$routes = Services::routes();

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function (RouteCollection $routes): void {
    // Preflight
    $routes->options('(:any)', 'OptionsController::preflight');

    $routes->post('auth/login', 'AuthController::login');
    $routes->get('auth/me', 'AuthController::me', ['filter' => 'jwt']);

    // Admin
    $routes->resource('users', ['controller' => 'UsersController', 'filter' => 'jwt:Admin']);
    $routes->get('clients', 'AdminClientsController::index', ['filter' => 'jwt:Admin']);
    $routes->patch('admin/clients/(:num)/assign', 'AdminClientsController::assign/$1', ['filter' => 'jwt:Admin']);

    // Agente
    $routes->get('agent/clients', 'AgentClientsController::index', ['filter' => 'jwt:Agente']);
    $routes->post('agent/assign', 'AgentClientsController::assign', ['filter' => 'jwt:Agente']);
    $routes->patch('clients/(:num)/status', 'AgentClientsController::updateStatus/$1', ['filter' => 'jwt:Agente']);

    // Público (kiosko)
    $routes->post('public/clients', 'PublicClientsController::create');
    $routes->get('public/turnos', 'PublicTurnosController::index');


});
