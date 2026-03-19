# Backend (CodeIgniter 4.6) - API de Gestión de Colas

## Requisitos
- PHP 8.1+
- Composer
- MySQL 8+

## Instalación
```bash
cd backend
composer install
cp env .env
php spark migrate
php spark db:seed DefaultAdminSeeder
php spark serve
```

## Variables de entorno (mínimas)
- `database.default.*`
- `JWT_SECRET` (string largo y aleatorio)
- `JWT_TTL_SECONDS` (ej. 28800)
- `DEFAULT_ADMIN_LOGIN` y `DEFAULT_ADMIN_PASSWORD` (opcional para el seeder)

## Endpoints principales
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST /api/users` (Admin)
- `GET|PUT|DELETE /api/users/{id}` (Admin)
- `GET /api/clients` (Admin)
- `POST /api/public/clients` (Público - kiosko)
- `GET /api/agent/clients` (Agente)
- `POST /api/agent/assign` (Agente - FIFO)
- `PATCH /api/clients/{id}/status` (Agente asignado)
