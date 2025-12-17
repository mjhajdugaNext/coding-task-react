# Compliance Accounts UI (Next.js + shadcn/ui)

SSR-first Next.js app that fetches compliance accounts and account-type dictionary, joins and validates them with zod, and renders a sortable table with shadcn/ui + Tailwind. Secrets stay server-side (no build-time baking), and there is a mocked path for tests and local offline work.

## Quick start
1) `cp .env.example .env.local` and set:
   - `SUPABASE_API_KEY` (required at runtime; do **not** commit).
   - `SUPABASE_URL` (optional, defaults to the provided Supabase URL).
   - `MOCK_API=true` if you want to run without hitting the real API (used in tests/E2E).
   - `MONITORING_ENDPOINT` / `NEXT_PUBLIC_MONITORING_URL` if you wire up monitoring.
2) Install deps (includes dev tooling): `NODE_ENV=development npm install`
3) Dev server: `npm run dev` (defaults to http://localhost:3000).

Build & start:
```
npm run build
NODE_ENV=production npm run start
```

## Architecture
- **Framework**: Next.js App Router + React 19. `app/page.tsx` uses `Suspense` to stream a server component that fetches data and hydrates a client table for sorting.
- **Data layer**: `src/lib/data.ts` (server-only) fetches Supabase endpoints with runtime `SUPABASE_API_KEY`, validates with zod, and joins with the account type dictionary. `MOCK_API` short-circuits to fixtures in `src/mocks` for offline/dev and tests. Formatting lives in `src/lib/format.ts`.
- **UI**: shadcn/ui (Tailwind 3) components under `src/components/ui`; Accounts table lives in `src/components/accounts`. Sorting is memoized in the client (`useMemo`) using generic `sortRows` from `src/lib/sort.ts`.
- **Theming**: Tailwind CSS with CSS variables + shadcn tokens (`tailwind.config.ts`, `src/app/globals.css`).
- **Runtime-only secrets**: The Supabase key is read only on the server and never exposed to the client bundle. Dictionary fetch failures fall back to raw IDs so the table still renders.

## Testing
- Unit: `npm run test:unit` (Vitest + Testing Library utils; covers mapping/formatting and sorting).
- E2E: `npm run test:e2e` (Playwright, uses `MOCK_API=true` and starts a dev server). Note: requires ability to bind a local port; in some sandboxes this is blocked—run locally if needed. First-time setup: `npx playwright install --with-deps` to install browsers.
- Mock control for e2e: tests hit `/api/mock-scenario` to set per-test mock data (driven by MSW). The mock API server only runs when `MOCK_API=true`.
- Lint/Typecheck: `npm run lint`, `npm run typecheck`.

## CI
GitHub Actions workflow at `.github/workflows/ci.yml` runs lint → typecheck → unit tests → Playwright (mocked data) → build. Configure secrets in repo settings as needed (e.g., `SUPABASE_API_KEY`, `MONITORING_ENDPOINT`)—they are not required for mocked runs.

## AWS Amplify notes
- Use the Next.js SSR target. Build command: `npm install && npm run build`. Start command: `npm run start`.
- Set `SUPABASE_API_KEY` (and optionally `SUPABASE_URL`, `MONITORING_ENDPOINT`) as Amplify environment variables so they are injected at runtime, not at build time.
- For previews, you can set `MOCK_API=true` to avoid hitting upstream APIs.
- If deploying via GitHub Actions, prefer OIDC to assume an IAM role rather than long-lived keys.

## Key files
- `src/app/page.tsx`, `src/components/accounts/accounts-table-section.tsx`: SSR fetch + streaming + hydration.
- `src/components/accounts/accounts-table.tsx`: Sortable table UI.
- `src/lib/data.ts`, `src/lib/sort.ts`, `src/lib/format.ts`: Fetch, validation, mapping, sorting, formatting.
- `src/mocks/*`: Fixture data for offline/testing.
