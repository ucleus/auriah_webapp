# Auirah Laravel API

This Laravel application backs the Auirah public and admin SPAs. It exposes OTP-authenticated endpoints, aggregates search data,
and persists collaborative entities such as tasks.

## Prerequisites

- PHP 8.2+
- Composer 2.6+
- Node.js (optional for running Laravel Mix/Vite scripts)
- Docker (for the provided MySQL container)

## Local environment

1. Copy the example environment and adjust secrets if required:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Generate an application key (only required the first time):
   ```bash
   php artisan key:generate
   ```

## Database & Docker

The project ships with a lightweight Docker Compose file that provisions MySQL 8 and phpMyAdmin.

```bash
# from the api/ directory
docker compose up -d
```

The default credentials match the `.env` file:

- **Host:** `127.0.0.1`
- **Database:** `auirah`
- **Username:** `root`
- **Password:** `secret`

You can reach phpMyAdmin at [http://127.0.0.1:8081](http://127.0.0.1:8081).

## Running migrations & seeders

```bash
php artisan migrate
php artisan db:seed
```

Seeding will provision the owner account (`fiv4lab@gmail.com`) with the `owner` role and generate a small dataset of family users
and tasks. Update the seeded password (`change-this-password`) before deploying.

## Sanctum & SPA configuration

The `.env` file already includes sensible defaults for running the public (`5173`) and admin (`5174`) SPAs locally. When the
front-end apps are served from different hosts, update the following keys accordingly:

- `SANCTUM_STATEFUL_DOMAINS`
- `SESSION_DOMAIN`
- `FRONTEND_URLS`

## Useful artisan commands

- `php artisan migrate:fresh --seed` — rebuild the schema and seed demo data.
- `php artisan tinker` — interactive REPL for debugging models and relationships.

Refer to `build_instruction.md` at the repository root for the full product roadmap.
