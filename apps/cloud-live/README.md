# Daniel Workflow + Knowledge Studio — server-backed guest sandbox

Public demo: https://jemueldaniel.website/apps/live/

This is a **real, bounded, deterministic** Cloudflare Worker + D1 app with a small API. It is independent of the original portfolio Worker and its preexisting `jemuel-workflow-studio` database. No external AI model, private source corpus, wallet, accounts or blockchain are used.

## What works

- Edit, reorder, save and version up to 10 linear text workflows (8 allowlisted operations each).
- Execute on the server and inspect persisted step outputs, input fingerprints and run receipts. Repeated operation IDs return the persisted result, not another execution.
- Save up to 25 text documents in a private guest session, or import the text output from a previously saved workflow run by its server-side ID.
- Retrieve scored lexical matches with exact source quotations, UTF-16 text offsets, and SHA-256 hashes; run and persist up to 10 evaluation cases per batch.
- HTTP-only SameSite=Strict secure guest cookie (256-bit random capability, SHA-256 stored in D1), same-origin CSRF check, prepared SQL, bounded inputs, quota per guest, data deletion and 24-hour guest expiry.
- No account sign-in; visitors should not enter confidential or personally identifiable material.

## Deployment layout

- Cloudflare Worker: `jemuel-workform-live-v1` (module files `worker.mjs`, `page.mjs`, `client.mjs`). D1 binding name: `DB`. The `page.mjs` and `client.mjs` files are serialized from `page.html` and `client.js`, respectively. The Worker also implements an idempotent scheduled expiry-cleanup handler, but registration of an hourly Cloudflare cron trigger is blocked by missing account `workers.dev` initialization (API error 10063); only lazy new-session cleanup currently runs.
- Scoped production routing: `jemueldaniel.website/apps/api/*` (API) and `/apps/live/*` (UI).
- D1 schema: `schema.sql`. It belongs only to the new guest sandbox. Do **not** execute this SQL against the existing portfolio/workflow D1 database.
- Original homepage Worker, its Workers AI binding and all old `/api/*` routes remain separate. The `apps/*` catalog stays on its own Worker.

## Verifications (11 October 2026)

- `node --test worker.test.mjs`: 7/7 API contract tests against `node:sqlite` with foreign keys enabled.
- Independent real public HTTPS tests from a connected Windows machine: 16/16, including guest sessions, D1 save/readback, workflow -> document -> search -> evaluation, replay, origin rejection, tenant isolation and reset. Ephemeral test data was removed.
- Real Microsoft Edge/Chromium acceptance at 320/390/768/1440 CSS widths: 14/14 app journey checks, and 16/16 public route/catalog/navigation checks. No application JavaScript errors. Cloudflare's optional analytics beacon is intentionally blocked by the app's restrictive CSP.

## Important limits

This does not establish that all ten planned Workform apps are complete. The other six browser-local demos are not backed by this D1 database; Contract Lab still needs pinned offline Solidity/EVM runtime qualification. Guest authorization expires after 24 hours. Database expiry cleanup is currently lazy on each new session; the hourly cron trigger is NOT active because the Cloudflare account lacks a workers.dev subdomain. Bulk backup erasure/retention guarantees are not independently audited. Each mutation is authorized by the guest's browser-bound cookie, not a registered human identity. API cost and per-IP global rate limits need operational monitoring before broad recruitment campaigns.

No private job records, access tokens, customer data or other startup source files are included. Public test source is sanitized and independent of the private v17 Node/SQLite checkpoint.