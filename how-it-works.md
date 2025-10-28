# Auirah Web App — How It Works

This monorepo hosts the full Auirah experience: a pixel-parity public homepage, an OTP-secured admin console, and the Laravel API that connects them. Use this document to understand the moving parts before you dive into the code.

## High-Level Architecture

- **Public SPA (`apps/web`)** — React + Vite application that recreates the Google-style landing page, handles global search, and routes visitors to the rest of the experience.
- **Admin SPA (`apps/admin`)** — Chakra UI-powered dashboard for authenticated management of tasks and users with OTP login.
- **Laravel API (`api`)** — REST backend that issues OTP codes, aggregates search results, and exposes CRUD for collaborative data.

All network traffic flows through the API (`/api/*`). Both SPAs talk to it via environment-provided `VITE_API_BASE_URL` values, so you can point the apps at any Laravel instance without code changes.

## Repository Layout Cheat Sheet

```
auirah_webapp/
├── apps/
│   ├── web/      # Public React SPA (Vite + React 19)
│   └── admin/    # Admin React SPA (Vite + Chakra UI)
└── api/          # Laravel 12 + Sanctum backend
```

Key entry points:

- `apps/web/src/main.tsx` wires routes (home, search, tasks, notes, music, photos, learn, maps) beneath a shared layout.
- `apps/admin/src/router.tsx` protects dashboard routes with the OTP auth context.
- `api/routes/api.php` maps authentication, search, task, and user endpoints.

## Public Web App (`apps/web`)

- **Layout & theming** — `MainLayout` wraps every route with a header/footer (`apps/web/src/layout/MainLayout.tsx`). `ThemeProvider` persists light/dark mode via `localStorage` and CSS variables (`apps/web/src/context/ThemeContext.tsx` + `apps/web/src/index.css`).
- **Search experience** — `SearchBar` handles keyboard focus (`/` shortcut), voice recognition, and suggestion fetching (`apps/web/src/components/SearchBar.tsx`). All requests go through `apps/web/src/api/search.ts`, which calls the Laravel search endpoints using `apiFetch`.
- **Pages** — Feature pages reuse a `PageLayout` card to present static content while the seed API is offline (`apps/web/src/components/PageLayout.tsx`). `Search.tsx` renders server results via `ResultItem`.
- **Data access** — `apps/web/src/api/client.ts` centralizes fetch logic and automatically prefixes the configured API base URL.

## Admin Dashboard (`apps/admin`)

- **Authentication flow** — `AuthContext` stores the current user/token in `localStorage`, exposes `requestOtp`/`verifyOtp`, and applies bearer headers (`apps/admin/src/context/AuthContext.tsx`).
- **Routing & protection** — `AppRouter` nests the dashboard under `Protected` routes, redirecting anonymous users back to `/login` (`apps/admin/src/router.tsx`).
- **UI shell** — `DashboardLayout` renders the persistent sidebar, header actions, and `Outlet` for nested pages (`apps/admin/src/layout/DashboardLayout.tsx`). Chakra theming is defined in `apps/admin/src/theme.ts`.
- **Data views** — `DashboardPage`, `TasksPage`, and `UsersPage` all hydrate via `apiFetch`, presenting stats and tables backed by the Laravel `/tasks` and `/users` endpoints.

## Laravel API (`api`)

- **OTP auth** — `OtpController` issues 6-digit codes, enforces rate limits, and mints Sanctum tokens once verified (`api/app/Http/Controllers/Api/Auth/OtpController.php`). `AuthenticatedUserController` supports `GET /auth/me` and `POST /auth/logout`.
- **Search pipeline** — `SearchController` aggregates tasks, users, and curated fallbacks, also exposing `/search/suggestions` and `/search/inspirations` (configurable via `api/config/search.php`).
- **Tasks & users** — Controllers enforce role-based abilities (`User::isManager()`), validate request payloads, and return `TaskResource` / `UserResource` JSON (`api/app/Http/Controllers/Api/TaskController.php`, `api/app/Http/Controllers/Api/UserController.php`).
- **Data model** — `Task` and `User` models define casts, relationships, and slug boot logic. Migrations in `api/database/migrations/*.php` create the schema, while `DatabaseSeeder` seeds demo data (owner account + tasks) for local testing.
- **CORS & auth config** — `api/config/cors.php` and `api/config/sanctum.php` whitelist SPA origins using `.env` values like `SANCTUM_STATEFUL_DOMAINS` and `FRONTEND_URLS`.

## Shared Data Flow

1. Visitor searches from the public SPA (`SearchBar` → `fetchSearchResults`).
2. API aggregates matches (`SearchController@index`) and returns normalized results.
3. Admin SPA signs in via OTP (`requestOtp` → `verifyOtp`) to obtain a Sanctum token.
4. Authenticated CRUD requests (tasks/users) include the bearer token, filtered by role abilities.

Both SPAs use similar `apiFetch` helpers, so adding new endpoints typically involves updating the backend route/controller and consuming it through the front-end client.

## Local Development Quickstart

```bash
# Laravel API
cd api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Public SPA
cd ../apps/web
npm install
npm run dev

# Admin SPA (in a new terminal)
cd ../admin
npm install
npm run dev
```

Ensure both SPAs have `VITE_API_BASE_URL=http://127.0.0.1:8000` (or the host where `php artisan serve` is running). Laravel’s `.env` already whitelists `127.0.0.1:5173` and `:5174` for Sanctum.

## When Extending the Platform

- New API features should expose routes in `api/routes/api.php`, add request validation (`app/Http/Requests`), and update resources if response shapes change.
- Front-end additions benefit from the existing layout primitives—add pages under `apps/web/src/pages` or `apps/admin/src/pages` and register them in the relevant router.
- Keep accessibility in mind: the SPAs already use semantic landmarks and focus states; follow those patterns for new components.

With this map you can trace any feature end-to-end, from UI interactions in React down to Laravel’s controllers, models, and database seeds.
