# Auirah Web App Monorepo

This repository hosts the React implementations of the Auirah experience:

- **apps/web** – the public-facing single-page app that faithfully ports the original Google-style homepage mockup while adding routing, theme persistence, quick links, autocomplete, and a mock search results view.
- **apps/admin** – a Chakra UI powered admin dashboard with OTP-style login simulation, task overviews, and static CRUD tables ready to wire to a Laravel API.

## Getting started

### Public web app

```bash
cd apps/web
npm install
npm run dev
```

The homepage keeps the original layout, styles, and responsiveness from `auirah_google_style_home_page_single_file.html`, replacing all emoji icons with Lucide icons, supporting `/` to focus the search, local suggestions, and a voice-search toggle that degrades gracefully when the Web Speech API is unavailable.

### Admin dashboard

```bash
cd apps/admin
npm install
npm run dev
```

Use the email `fiv4lab@gmail.com` with the demo OTP `123456` to sign in. Once authenticated you can browse summary widgets, mock task data, and the seeded user list representing the role-based access model from the build spec.

## Next steps

- Provision a Laravel + MySQL API under `api/` (see `build_instruction.md`) to back the OTP workflow, search endpoint, and CRUD operations.
- Replace the static data modules with real API calls once the backend is available.
- Configure `.env` files for both React apps (`VITE_API_BASE_URL`) targeting the Laravel server.

Refer to `build_instruction.md` for the complete feature roadmap, acceptance criteria, and deployment tips.
