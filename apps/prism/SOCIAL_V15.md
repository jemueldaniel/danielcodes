# Daniel Social V15 — original relationship and action inspector

This isolated V15 change extends the V14 Workform Social synthetic tab-only demo. It does not import private social source, credentials, website code or assets. Studio, Pay and D1 remain unchanged.

## What runs

- A real two-person directed follow graph derived from saved A-to-B and B-to-A follow edges, not a hard-coded illustration.
- Live post, reply and saved counts computed from existing bounded browser-tab state.
- Last 18 committed actions in sessionStorage (daniel-social-action-proof-v15); rejected changes do not enter the history.
- A JSON evidence export containing only counts, directed edges, action labels and times — never user-authored post or reply bodies.
- An inline two-step reset without overlay or modal. Existing post caps, replies, follow, like, save, creation, deletion, search and filters are preserved.
- A scoped dark jacket/navy/ice-blue responsive graph, focus styling, reduced-motion and 44px action targets.
- First-party lower-left floating Ask Daniel remains independent and closes on Escape.

## Authored files

social-v15-panel.html, social-v15.css and social-v15-addon.js are authored source. build-social-v15.cjs reproducibly injects them into microapps-worker.mjs using exact fail-closed HTML and JS anchors; do not hand-edit generated snippets. Node source tests are social-v15.test.mjs; live Worker fetch browser tests are social-v15.browser.cjs.

## Verified isolated Windows baseline — October 12, 2026

Node: 7/7 PASS. Installed Edge Social: 145/145 PASS across 320, 390, 768, and 1440 pixel layouts. Site-wide nonmodal/overlay audit: 329/329 PASS over ten locally served independent HTML routes at the same four viewport widths. Tests exercise creation, follows, likes, replies, saves, persistence through reload, proof download omitting post text, cancel-safe two-stage reset and Escape, actual state-linked animated graph, respect for reduced-motion, dark theme, absent overflow and a working nonmodal floating Ask Daniel. No uncaught browser page errors. Tests use exact local Worker fetch handlers; **public HTTPS release acceptance remains a separate gate**.

## Truth boundaries

Fictional state lives in the same browser tab, not a public social network. It has no remote accounts, durable backend, cross-user data or cryptographic receipts. A downloaded client JSON record is not tamper-proof attestation. The existing Cloudflare microapps Worker may be published only if the live version/source/settings and new version are independently qualified. The existing safety-held Studio and Pay presentation routes must not be changed or bypassed.


## Verified public release — October 12, 2026

- Existing Cloudflare Worker `jemuel-workform-microapps-v2`, preserved without added bindings, with compatibility date `2026-10-11`. Original production Git source blob `965506fa9f3a8c9bb0f82ede8c6e25dcc001ef1d` was verified before upload; no Studio or Pay Worker modified.
- New GitHub source commit `4928970a461e77eb19d720fce2ae576444bff996`; exact uploaded and read-back source Git blob `08114aa81e99a991be482b830b40a7351f0b8eaa` (**466,663 UTF-8 bytes**). Cloudflare deployment `d487dc1a-0d6e-47a1-9867-3596c62c3e37`, version `8723d6ec-9370-40c6-a9fd-4927045ea81b`, 100% routing.
- Actual public HTTPS Microsoft Edge checks with `WORKFORM_LIVE_ORIGIN=https://jemueldaniel.website`: Social **145/145 PASS**, site-wide blocking overlay/nonmodal/reduced-motion audit **329/329 PASS**, spanning 320, 390, 768 and 1440px. Public runs performed independently after production source/version readback. No uncaught page errors.
- Published release only covers the bounded fictionally scoped Social experience on the existing independent microapps Worker. The 10-app catalog is not proof that ten full backends are complete. The separate Studio and Pay presentation upgrades remain restricted.
