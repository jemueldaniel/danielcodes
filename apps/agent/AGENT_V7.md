# Daniel Agent V7 — observed operations and verification inspector

**Implementation:** Additional original monochrome, responsive Agent UI. Preserves the existing D1-backed deterministic guest plan and the four allowed operations. Adds a four-metric observation dashboard, expandable server-event receipts, real-readback receipt, error-aware state, and copy-after-verified behavior. No server changes, new credentials, real LLM calls, MCP service, wallet, proprietary assets, or third-party scripts.

The inspector listens to the existing exact real-client trace via DOM MutationObserver, without rewriting API requests, minting fake trace entries, or claiming the browser plan has an atomic server transaction. The verified receipt is built only from an observed `verify/server_readback` event with an actual 64-character SHA-256 and `verified:true`. Recent errors after verification invalidate the current UI receipt. Readback alone never makes previously unobserved search/run/save steps appear complete. Browser storage is session-local.

Design: dark-first black/white/grey, compact four-stat board, native disclosure events, 320 px accessibility, reduced-motion, visible keyboard focus. A non-blocking circular Ask Daniel link remains on the lower-left.

Qualification: run `node --test apps/agent/agent-v7.test.mjs`. Browser acceptance `node apps/agent/agent-v7.browser.cjs` checks inspector derivation and UX at 320/390/768/1440 using isolated fixtures; set `WORKFORM_LIVE_ORIGIN=https://jemueldaniel.website` only after independently verifying a Cloudflare release to test production. Full real D1 operation qualification must also cover guest session, prep, bounded run, source/citation, readback, replay and cleanup. Do not claim an offline EVM or actual MCP/SDK from this Agent UI.
