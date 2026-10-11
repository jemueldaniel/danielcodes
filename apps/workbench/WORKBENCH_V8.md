# Workform V8 — Developer Workbench JSON response explorer

Adds an original, dark-first monochrome product interface to the existing **real same-origin HTTP Workbench**, without changing its fixed API allowlist or guest D1 backend. Interactive API key-path search, copyable JSON paths, observed method/route/client latency/field count, accurate HTTP rejection and `replayed:true` recognition. All displayed fields derive from the genuine existing output JSON through a read-only MutationObserver. The frontend does not simulate HTTP responses or imply a packaged SDK or real protocol-level MCP.

Uses textContent and bounded traversal (64 leaf paths, maximum depth 6), no untrusted HTML injection, no blocking overlays, no third-party dependencies; preserved lower-left Ask Daniel button, focus visibility and reduced-motion. Existing raw JSON remains available.

Tests: `node --test apps/workbench/*.test.mjs`; `node apps/workbench/workbench-v8.browser.cjs` tests 320/390/768/1440 responsive UI with isolated synthetic fixture responses (UI proof only). `node apps/workbench/workbench-v8.live.cjs` qualifies actual production D1 actions only after release verification, with cleanup where possible. Keep Studio/Pay held publication untouched, preserve Cloudflare bindings/settings, and do not claim full SDK/MCP from API-only integration.

## October 12, 2026 — verified public Cloudflare release and real D1 browser evidence

- Personal Cloudflare account `thisisdanielsph@gmail.com`; existing independent Workbench Worker `jemuel-workform-developer-workbench`. Before upload the Worker source was hash-verified against Git blob `6daf43370131c46b57c044d276e58a4ab8ce0937`.
- Uploaded source Git blob `aac4c9bca15e3065bfe915089eed4cb2f4cb8c82` (33,937 UTF-8 bytes); independent Cloudflare Worker download confirmed the same exact hash after publication. Bindings remain empty, compatibility date unchanged `2026-10-11`, original D1 guest API/route untouched.
- Cloudflare deployment `7887798f-d75a-4474-a675-9b1e9c9e49d1`, version `3fd1f304-8849-43af-8ceb-062e334d8c09`, active **100%**.
- **72/72** complete Node regressions passed, **57/57** real Edge browser UI assertions passed with isolated synthetic JSON fixtures at 320/390/768/1440px; fixtures alone are not backend evidence.
- **14/14 live Microsoft Edge checks passed against the public HTTPS Workbench and real D1 guest API:** session POST, actual workflow save, saved run, document import, lexical search fields, stored evaluation, server-confirmed exact replay, evaluation readback, live JSON field filtering, no 390px overflow/page JavaScript errors, and deletion of the synthetic test workspace (HTTP 200 with `deleted:true`).
- Reproduce actual public test with `node apps/workbench/workbench-v8.live.cjs` (Microsoft Edge + Playwright Core installed); this script uses only the fixed owner domain and attempts guest cleanup in `finally` if an intermediate test fails.

**Truthful scope:** HTTP API operations are genuine. No packaged SDK, full MCP interoperability, real funds, production account identities, full offline EVM or private corporate source is claimed. The existing Studio/Pay publication safety holds were not retried or bypassed.
