# Workform V18 — Daniel Agent, source-only cockpit

## Implemented in a separate, isolated source branch

A purpose-built **bounded Agent mission-control interface** for the existing public Daniel Agent product. Three purposeful columns distinguish mission controls, evidence-driven tool progression, and persisted-run/readback receipts. The original four-stage visual monitor, native controls, V7 inspector, raw trace and existing D1 API paths remain accessible inside an optional **Advanced API plan and raw evidence** disclosure. New actions call the original first-party `client.js` controls instead of simulating server state or inventing success.

- **Real scope:** existing same-origin Cloudflare guest API `/apps/api/session`, workflows, documents, D1 lexical search, runs and SHA-256 persisted artifact readback; stable idempotent operation IDs and same-tab replay from existing Agent client are preserved. No arbitrary execution, hidden tool fan-out, LLM calls, external accounts, crypto assets, production company source, or atomic agent receipt claim.
- **Visual progression:** four separate source/search, workflow execution, document persistence and actual readback nodes, each marked **observed** only when a structurally valid event from the original API trace appears. A proof from standalone readback does not fabricate the earlier three operations. Errors and unresolved outcomes prevent an authoritative verified badge.
- **Privacy and evidence:** source IDs, run IDs, artifact IDs, observed passage digest, and SHA-256 readback are displayed in context. Bounded JSON export is disabled until an actual readback; it explicitly says browser-collected, non-atomic, and excludes user-entered query, document body, cookies and credentials.
- **No overlays:** remove the legacy `window.confirm` destructive reset path from the *served generated Agent client*; replace it with a two-click inline reset, Escape and cancel-on-elsewhere interaction. Original old Reset control refuses deletion without the new inline gate. All old D1 reset operations still require a real same-origin API response.
- **Look and feel:** original black/charcoal/navy/white/ice color palette matching Workform, compact responsive visual hierarchy, state-driven acknowledgement animation only when data changes, small-screen progressive stacking, no large blocking backdrop or third-party motion dependencies. System reduced-motion is honored.
- **Ask Daniel:** the existing first-party lower-left circular full-color portrait and cross-page nonmodal Ask Daniel are retained without modification.

## Generated source and checks

Authored: `cockpit-v18.html`, `cockpit-v18.css`, `cockpit-v18.js`, plus fail-closed `build-cockpit-v18.cjs`. This generator injects only scoped presentation and the client reset guard into the existing `apps/agent/worker.mjs`, leaves `apps/cloud-live`, `apps/prism`, EVM/Pay and all live Cloudflare Workers untouched, and verifies exact output via:

`node apps/agent/build-cockpit-v18.cjs --check`

Targeted source+router+reset contract tests: `node --test apps/agent/agent-v18.test.mjs`.

**Verified local Node — 12 October 2026:** 6/6 new V18 tests PASS; 135/135 full codebase Node regressions PASS, including earlier Workflow/Knowledge D1 contract tests, genuine offline pinned EVM, V15 Social, V17 Interface and legacy Agent.

## Publication boundary and blocker

A more extensive real D1/Edge browser acceptance attempt was **blocked by platform safety checks** before execution. Do not rerun that blocked browser operation using another tool, account, route or equivalent workaround. Because the new cockpit has not passed its independent browser acceptance, **do not upload/deploy V18 to Cloudflare** and do not describe it as a public release. The separate locally authored browser harness remains uncommitted and is not a claimed passed test.

The most recent publicly verified version remains the earlier Agent V7 Worker; personal portfolio V16 and microapps V17 remain live independently. Existing enhanced V12 Studio and Pay presentation publication restrictions are respected. This V18 work is a source-only, draft review handoff. Actual deployed-worker source hash preflight, real browser tests, production Cloudflare publication and public HTTPS tests are still outstanding.

This bounded Agent sample is educational and does not establish all ten applications' complete production backend scope, independent professional accessibility certification, or employment results.
