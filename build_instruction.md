Got it — adding your new requirements now: mobile responsiveness, SVG icon set (no emojis), global search that returns a Google-style list view (plus deep links), and a Chakra-UI powered admin dashboard (React) that talks to a Laravel + MySQL API. Below is the Codex-ready `.md` build spec you asked for.

---

# Auirah Web App — HTML ➜ React Conversion (with Laravel API, Global Search, Chakra Admin)

> **Goal:** Convert the provided single-file HTML into a React app with **pixel-parity UI/UX**, add real pages for Tasks/Notes/Music/Photos/Learn/Maps, implement **global search** (Google-style list view), wire a **Laravel + MySQL** API with **OTP login**, and ship an **Admin Dashboard (React + Chakra UI)** for managing data.
> **Hard constraints:** Keep the existing homepage layout, styles, behaviors, and a11y while making it **mobile-responsive** and replacing emoji icons with **SVG icons** (no emojis).

---

## 0) Success Checklist (Strict) & Acceptance Criteria

### Pixel-Parity & UX

* [ ] **Homepage** matches original HTML visually (spacing, colors, fonts, breakpoints) at **320px / 768px / 1024px / 1440px** widths.
* [ ] **Theme toggle** persists in `localStorage` key `auirah_theme` and toggles `data-theme` on `<html>`.
* [ ] **Search input** supports `/` keyboard focus and suggestion box behavior.
* [ ] **Voice search** degrades gracefully if Web Speech API is unavailable.
* [ ] **Footer** sticks to bottom (no float gaps) on short pages.
* [ ] Replace all emojis in UI with **SVG icons** (Lucide/Heroicons). No emoji characters in interactive elements.

### Routing & Pages

* [ ] Homepage quick links navigate to **internal routes**: `/tasks`, `/notes`, `/music`, `/photos`, `/learn`, `/maps`.
* [ ] Each page renders a basic custom view using the existing CSS (not Chakra) on the public app.
* [ ] **Global search** at `/search?q=` shows a Google-style list view of results (title, snippet, link to detail or page).
* [ ] Search queries can also be initiated from the home search bar (Enter submits to `/search?q=...`).

### Backend, Auth, Admin

* [ ] **Laravel** API with **Sanctum** and **OTP login** for `fiv4lab@gmail.com` as seeded **owner** user.
* [ ] Role-based access: `owner`, `admin`, `family`, `viewer`.
* [ ] **Chakra UI Admin** app authenticates via the API (Sanctum or token) and provides CRUD for Tasks and Users.
* [ ] CORS/CSRF configured so public SPA and Admin SPA can talk to the API.

### Data & APIs

* [ ] MySQL migrations for `users`, `tasks` (+ optional stubs for notes/music/photos).
* [ ] **Global /search** endpoint aggregates across entities and returns normalized results.
* [ ] Robust validation, error handling, and pagination for list endpoints.

### A11y & Perf

* [ ] Maintain aria roles/labels from HTML; ensure keyboard navigation and focus rings.
* [ ] Lighthouse: Performance ≥ 85, Accessibility ≥ 90 on homepage and search page (desktop).

---

## 1) Architecture

```
Public React App (existing CSS)        Admin React App (Chakra UI)
        |                                         |
        +----------------- REST ------------------+
                          Laravel API
                              |
                           MySQL DB
```

* **Public SPA** (React + existing CSS): Homepage parity + feature pages + global search UI.
* **Admin SPA** (React + Chakra): Authenticated dashboard for OTP, tasks, users.
* **Laravel API**: Auth (OTP + Sanctum), RBAC, CRUD, search aggregation.
* **MySQL**: persistent storage.

---

## 2) Repos & Folder Structure

### Monorepo (recommended)

```
auirah/
├── apps/
│   ├── web/                  # Public React app (uses original CSS)
│   └── admin/                # Admin dashboard (React + Chakra UI)
└── api/
    ├── app/                  # Laravel app code
    ├── database/
    ├── routes/
    ├── .env.example
    └── composer.json
```

### Public React App (`apps/web`)

```
apps/web/
├── src/
│   ├── app/
│   │   ├── routes.tsx
│   │   └── store/ (auth/theme/search contexts)
│   ├── components/
│   │   ├── Header.tsx | Footer.tsx | ThemeToggle.tsx
│   │   ├── SearchBar.tsx | Suggestions.tsx | Icon.tsx
│   │   └── ResultItem.tsx
│   ├── pages/
│   │   ├── Home.tsx         # pixel-parity port of HTML
│   │   ├── Search.tsx
│   │   ├── Tasks.tsx | Notes.tsx | Music.tsx | Photos.tsx | Learn.tsx | Maps.tsx
│   │   └── Auth.tsx
│   ├── api/
│   │   └── client.ts        # axios/fetch with interceptors
│   ├── assets/
│   │   └── icons/           # SVGs (Lucide/Heroicons as components)
│   ├── index.css            # extracted CSS from HTML (unaltered rules)
│   └── main.tsx
├── public/
│   └── index.html
└── package.json
```

### Admin React App (`apps/admin`) (Chakra UI)

```
apps/admin/
├── src/
│   ├── pages/ (Login.tsx, Dashboard.tsx, Users.tsx, Tasks.tsx)
│   ├── components/ (Nav, DataTable, Forms)
│   ├── api/client.ts
│   └── main.tsx
├── public/index.html
└── package.json
```

### Laravel API (`api`)

Standard Laravel structure; notable files:

```
api/
├── app/Http/Controllers/Auth/OtpController.php
├── app/Http/Controllers/TaskController.php
├── app/Http/Controllers/UserController.php
├── app/Models/User.php
├── app/Models/Task.php
├── database/migrations/xxxx_create_users_table.php
├── database/migrations/xxxx_create_tasks_table.php
├── database/seeders/OwnerSeeder.php
├── routes/api.php
└── .env.example
```

---

## 3) Tech & Versions

* **Public SPA:** React 18 + TypeScript, React Router, Axios (or Fetch), **Lucide React** (icons)
* **Admin SPA:** React 18 + TypeScript, **Chakra UI**, React Router
* **API:** Laravel 11, PHP 8.2+, MySQL 8, **Laravel Sanctum**
* **Tooling:** ESLint + Prettier, Vite, PHPUnit, Pest (optional)

---

## 4) Copy-Paste Commands

### Prereqs

* Node 20+, PNPM or Yarn, PHP 8.2+, Composer, MySQL 8.

### Scaffold

```bash
# clone monorepo (or create)
mkdir auirah && cd auirah

# Public app
pnpm create vite apps/web --template react-ts
cd apps/web && pnpm i axios lucide-react react-router-dom && cd ../../

# Admin app
pnpm create vite apps/admin --template react-ts
cd apps/admin && pnpm i @chakra-ui/react @emotion/react @emotion/styled framer-motion axios react-router-dom && cd ../../

# Laravel API
composer create-project laravel/laravel api
cd api
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
cd ..
```

### Run (dev)

```bash
# API
cd api
cp .env.example .env
# set DB_*, MAIL_*, SANCTUM_STATEFUL_DOMAINS, SESSION_DOMAIN, APP_URL
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000

# Public app
cd ../apps/web
cp .env.example .env.local # create and set VITE_API_BASE_URL=http://127.0.0.1:8000
pnpm i
pnpm dev --port 5173

# Admin app
cd ../admin
cp .env.example .env.local # VITE_API_BASE_URL=http://127.0.0.1:8000
pnpm i
pnpm dev --port 5174
```

---

## 5) Data Model

### users

| field      | type                            | notes            |
| ---------- | ------------------------------- | ---------------- |
| id         | bigint pk                       |                  |
| name       | string nullable                 |                  |
| email      | string unique                   |                  |
| role       | enum(owner,admin,family,viewer) | default viewer   |
| password   | string nullable                 | not used for OTP |
| created_at | timestamp                       |                  |
| updated_at | timestamp                       |                  |

### tasks

| field       | type                           | notes           |
| ----------- | ------------------------------ | --------------- |
| id          | bigint pk                      |                 |
| title       | string                         |                 |
| description | text nullable                  |                 |
| status      | enum(pending,in_progress,done) | default pending |
| due_date    | date nullable                  |                 |
| assigned_to | bigint fk->users               | nullable        |
| created_by  | bigint fk->users               |                 |
| created_at  | timestamp                      |                 |
| updated_at  | timestamp                      |                 |

*(Optional stubs)* `notes`, `music_links`, `photos`, `learn_items`, `map_places` with minimal fields to support search.

---

## 6) API Endpoints (Laravel)

> Base URL: `http://<api-host>/api`

### Auth (OTP)

| Method | Path                | Body                                                 | Response                                 |
| -----: | ------------------- | ---------------------------------------------------- | ---------------------------------------- |
|   POST | `/auth/otp/request` | `{ "email": "fiv4lab@gmail.com" }`                   | `204 No Content`                         |
|   POST | `/auth/otp/verify`  | `{ "email": "fiv4lab@gmail.com", "code": "123456" }` | `200 { user, token }` or Sanctum session |
|   POST | `/auth/logout`      | *empty*                                              | `204 No Content`                         |

**Example success (`/auth/otp/verify`):**

```json
{
  "user": {"id":1,"email":"fiv4lab@gmail.com","role":"owner","name":"Sean"},
  "token": "eyJhbGciOi..." 
}
```

### Users (owner/admin)

| Method | Path          | Body                                               | Response                 |
| -----: | ------------- | -------------------------------------------------- | ------------------------ |
|    GET | `/users`      | -                                                  | `200 [User]` (paginated) |
|   POST | `/users`      | `{ "name":"Mom", "email":"...", "role":"family" }` | `201 User`               |
|  PATCH | `/users/{id}` | `{ "name?": "...", "role?": "admin" }`             | `200 User`               |
| DELETE | `/users/{id}` | -                                                  | `204`                    |

### Tasks

| Method | Path          | Body / Query                                                                               | Response                          |
| -----: | ------------- | ------------------------------------------------------------------------------------------ | --------------------------------- |
|    GET | `/tasks`      | `?status=pending&q=trash&assigned_to=2&page=1`                                             | `200 { data:[Task], meta:{...} }` |
|   POST | `/tasks`      | `{ "title":"Wash dishes", "description":"...", "due_date":"2025-10-30", "assigned_to":2 }` | `201 Task`                        |
|  PATCH | `/tasks/{id}` | `{ "status":"done" }`                                                                      | `200 Task`                        |
| DELETE | `/tasks/{id}` | -                                                                                          | `204`                             |

**Task example:**

```json
{
  "id": 7,
  "title": "Clean room",
  "description": "Tidy desk, make bed",
  "status": "pending",
  "due_date": "2025-11-01",
  "assigned_to": 3,
  "created_by": 1,
  "created_at": "2025-10-27T18:00:01Z",
  "updated_at": "2025-10-27T18:00:01Z"
}
```

### Global Search

| Method | Path      | Query                     | Response                                   |
| -----: | --------- | ------------------------- | ------------------------------------------ |
|    GET | `/search` | `?q=wash%20dishes&page=1` | `200 { results:[SearchItem], meta:{...} }` |

**SearchItem shape (normalized):**

```json
{
  "type": "task",            // "task" | "note" | "music" | "photo" | "learn" | "map"
  "id": "task:7",
  "title": "Wash dishes",
  "snippet": "Due tomorrow • assigned to Auriah",
  "url": "/tasks?highlight=7"  // front-end deep link
}
```

> **Note:** implement server-side aggregation: search `tasks.title/description`, `notes.title/body`, etc., merge, sort by recency and relevance, respond paginated.

---

## 7) Auth & RBAC Rules

* **OTP** only; no passwords. Codes expire in 10 min; throttle requests (e.g., 5/min).
* Seed `fiv4lab@gmail.com` as `owner`.
* Roles:

  * `owner`: full access, manage roles.
  * `admin`: CRUD all content, manage users (not owner).
  * `family`: CRUD tasks they created; read household tasks.
  * `viewer`: read-only.

---

## 8) Public SPA Requirements (React + existing CSS)

* **CSS:** Extract the `<style>` block from HTML into `apps/web/src/index.css` unmodified; apply to the React markup.
* **Icons:** Replace emoji buttons with SVG icons using `lucide-react` (e.g., `Menu`, `Mic`, `Search`).
* **Home page:** Port markup to `Home.tsx`; **do not** alter class names unless necessary for React/TSX.
* **Routing:** Quick apps => navigate to internal routes.
* **Search flow:**

  * Submitting from home redirects to `/search?q=...`.
  * `/search` calls `GET /search` and renders a **list view**: title (link), small snippet, type badge.
  * Provide a **“Search in page type”** chip row (Tasks, Notes, etc.) to filter client-side.
* **Mobile:** Ensure responsive parity; verify breakpoints and tap targets ≥ 44px.

---

## 9) Admin SPA Requirements (React + Chakra UI)

* **Login (OTP)**: email → code → session; store token/cookie; protect routes.
* **Users:** table, create/update/delete (role dropdown), search/filter.
* **Tasks:** table + form create/edit; status chips; filters (status, assignee, due).
* **Chakra Components:** `Table`, `FormControl`, `Button`, `Badge`, `Modal`, `UseToast`.

---

## 10) Security & Config

* **Sanctum SPA** mode for cookie auth (set `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, CORS allow for `localhost:5173,5174`).
* **CORS**: Restrict origins to known apps.
* **Validation**: Laravel `FormRequest` for all mutations.
* **Pagination**: default `per_page=20` with caps.

---

## 11) Migrations & Seeders (key snippets)

**Owner seeder (pseudo):**

```php
User::updateOrCreate(
  ['email' => 'fiv4lab@gmail.com'],
  ['role' => 'owner', 'name' => 'Sean']
);
```

**Task status enum:** Use DB enum or string + validation; keep serializer strict.

---

## 12) Testing & CI

* **API**: Feature tests for OTP request/verify, tasks CRUD, role guards, `/search`.
* **Public SPA**: Component tests for `SearchBar`, e2e smoke for `/` → `/search`.
* **Admin SPA**: e2e login + CRUD flows.
* **A11y**: Run `@axe-core/react` (dev) or CI `axe`/`pa11y`.
* **CI steps**:

  * `pnpm -C apps/web lint && pnpm -C apps/web build`
  * `pnpm -C apps/admin lint && pnpm -C apps/admin build`
  * `php -d detect_unicode=0 vendor/bin/phpunit`

---

## 13) Parity Tests (What to Verify)

### Visual

* **Logo** letter colors: A pink, u aqua, i light blue, r hot pink, a yellow, h purple.
* **Header** links typography and spacing; **chip** shows current time; theme toggle handle animates.
* **Search** pill shadow and border match; icons aligned; suggestions dropdown styling matches.
* **Buttons**: “Auirah Search”, “I’m Feeling Inspired” styles and hover states.
* **Footer**: border, left/right link groups, and locale links.

### Functional

* `/` **‘/’ key** focuses search; typing shows suggestions; clicking suggestion triggers search.
* **Voice search**: if supported, fills query and navigates to `/search?q=...`; otherwise shows tooltip and does nothing harmful.
* **Quick links**: navigate internally (no external windows).
* **/search**: shows list view with clickable results and type chips; deep links navigate correctly.
* **Theme persist**: reload keeps theme; `localStorage` key `auirah_theme`.
* **OTP**: request → receive code (use log/mailtrap in dev) → verify → session set; admin and public apps both can auth.
* **Admin CRUD**: create user, assign role, create task, change status, delete task.

---

## 14) Mobile Responsiveness

* Verify at **320px** (iPhone SE) and **375–414px** widths:

  * Header nav collapses gracefully (menu icon opens inline panel or routes remain accessible).
  * Search pill fits; icons not truncated; suggestions are scrollable with proper hit targets.
  * Result list uses single column with adequate spacing; avoid text overflow.

---

## 15) Env Samples

**apps/web/.env.local**

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**apps/admin/.env.local**

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**api/.env**

```
APP_URL=http://127.0.0.1:8000
SESSION_DOMAIN=127.0.0.1
SANCTUM_STATEFUL_DOMAINS=127.0.0.1:5173,127.0.0.1:5174
FRONTEND_URLS=http://127.0.0.1:5173,http://127.0.0.1:5174
DB_DATABASE=auirah
DB_USERNAME=root
DB_PASSWORD=secret
MAIL_MAILER=log
```

---

## 16) Notes on Icons (No Emojis)

* Use **lucide-react**:

  * Menu (`Menu`), Microphone (`Mic`), Search (`Search`), App Grid (`AppWindow`), Sun/Moon for theme if needed.
* Replace character icons in the original HTML with these components.
* Ensure `aria-label` present on icon buttons and `title` attributes for tooltips.

---

## 17) Deployment Hints

* **API (Hostinger Cloud)**: PHP 8.2+, configure `.env`, DB, queue optional. Force HTTPS, set correct CORS origins.
* **Public & Admin SPAs**: Vercel/Netlify; set `VITE_API_BASE_URL` to API HTTPS origin.
* Ensure cookies (if using Sanctum) have correct `SameSite` and domain config.

---

## 18) Stretch (Optional Later)

* Rich editor for Notes, YouTube oEmbed for Music, S3/Cloudinary for Photos, Mapbox for Maps.
* Background indexing for search; highlight terms in snippets.

---

### Done-Definition

* All acceptance items checked; parity tests pass.
* Admin can log in and manage Tasks/Users.
* Public app can search and navigate results.
* Lighthouse/A11y targets met.

---

**End of Spec**