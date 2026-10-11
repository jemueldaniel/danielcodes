# Workform V8 — Developer Workbench JSON response explorer

Adds an original, dark-first monochrome product interface to the existing **real same-origin HTTP Workbench**, without changing its fixed API allowlist or guest D1 backend. Interactive API key-path search, copyable JSON paths, observed method/route/client latency/field count, accurate HTTP rejection and `replayed:true` recognition. All displayed fields derive from the genuine existing output JSON through a read-only MutationObserver. The frontend does not simulate HTTP responses or imply a packaged SDK or real protocol-level MCP.

Uses textContent and bounded traversal (64 leaf paths, maximum depth 6), no untrusted HTML injection, no blocking overlays, no third-party dependencies; preserved lower-left Ask Daniel button, focus visibility and reduced-motion. Existing raw JSON remains available.

Tests: `node --test apps/workbench/*.test.mjs`; `node apps/workbench/workbench-v8.browser.cjs` tests 320/390/768/1440 responsive UI with isolated synthetic fixture responses (UI proof only). `node apps/workbench/workbench-v8.live.cjs` qualifies actual production D1 actions only after release verification, with cleanup where possible. Keep Studio/Pay held publication untouched, preserve Cloudflare bindings/settings, and do not claim full SDK/MCP from API-only integration.
