# Week 5 Reviews SPA

A small Vue and TypeScript SPA for the CIS3039 deployment, configuration and
CORS lab. It can use temporary in-browser data or the separately deployed
Reviews API without changing its application use cases.

## Development environment

Use the repository's Dev Container, which selects
`ghcr.io/tpdavison/devops-labs:2026-latest` and Node.js 22. From the repository
root:

```sh
node --version
npm --version
npm ci
npm run type-check
npm run dev
```

Vite reports the local URL, normally `http://localhost:5173`. Build the static
site with `npm run build`; its files are written to `dist/` and can be served
with `npm run preview`.

The recorded compatible baseline is Node 22.23.4, npm 10.9.9, TypeScript 5.9.3,
Vue 3.5.44, Vite 8.3.5 and `vue-tsc` 3.3.13. The backend course examples use
TypeScript 7.0.2; this SPA deliberately retains 5.9.3 because the current
`vue-tsc` release does not support TypeScript 7's package exports.

## Architecture

Source dependencies point towards the application and domain:

```text
Vue components/views/composables ──> application use cases ──> domain rules
                  HTTP adapter ─────> application port ───────> domain types
                  fake adapter ─────> application port ───────> domain types
bootstrap/settings ──> concrete adapters and the provided dependency object
```

- `src/domain/` owns review values and the pure validation factories.
- `src/app/` owns the use cases and the minimal `ReviewService` port they need.
- `src/infra/` maps the HTTP contract or simulates it in memory.
- `src/config/` parses public settings and assembles one adapter.
- `src/composables/`, `src/views/` and `src/components/` own Vue state and UI.
- `src/main.ts` is the bootstrap boundary and provides dependencies to Vue.

The service contract does not promise list order. The presentation sorts reviews
newest first, preserving received order when timestamps tie.

## Choose a review service

Vite exposes `VITE_*` values to browser code. They are public, build-time
configuration—not a place for API keys, Cosmos keys or other secrets. Restart
the development server after changing `.env`. Rebuild and redeploy `dist/` when
changing a deployed site's target.

The app validates explicit modes rather than silently changing adapters.

### Empty fake (default)

```dotenv
VITE_REVIEWS_SERVICE=fake
VITE_USE_SEED_DATA=false
```

### Seeded fake

```dotenv
VITE_REVIEWS_SERVICE=fake
VITE_USE_SEED_DATA=true
```

The fake is process-local browser memory. Added reviews disappear on reload. Its
seed and returned values are copied so mutable `Date` objects do not alter stored
records.

### Deployed HTTP API

```dotenv
VITE_REVIEWS_SERVICE=http
VITE_USE_SEED_DATA=false
VITE_REVIEWS_BASE_URL=https://YOUR_FUNCTION_APP.azurewebsites.net/api
```

The base URL must be an absolute HTTP(S) URL ending at `/api`; the adapter appends
`/reviews`. Do not include `/reviews` twice. The current API contract is:

- `GET /api/reviews` → `{ reviews, totalCount }`
- `POST /api/reviews` → `{ review }`
- expected HTTP 400 validation → `{ issues: [{ field, message }] }`

Unexpected responses and network failures remain operational failures. The app
does not retry POSTs, reveal raw server diagnostics, or fall back to fake data.

## No-cloud demonstrations

These deterministic scripts are demonstrations, not automated tests:

```sh
npm run demo:domain
npm run demo:reviews
```

The domain demo prints a successful value that retains surrounding whitespace,
then issues for a fractional rating and blank text. The reviews demo prints a
successful review with ID `demo-review-1` and timestamp
`2026-01-15T12:00:00.000Z`, followed by a one-item list from the same fake.

## Verify a deployed API and CORS

First verify the deployed Function endpoint independently. Then select HTTP mode,
set its `/api` base URL, restart `npm run dev`, and inspect the browser network
panel. A browser CORS failure is expected until the Function App allows the exact
development origin (scheme, host and port, with no path). CORS permits a browser
origin; it does not authenticate a user.

For static hosting, keep the HTTP settings pointed at the intended test API, run
`npm run build`, upload the contents of `dist/`, and add the hosted site's exact
origin to the Function App's CORS allow-list. Rebuild and upload again whenever a
public target value changes.
