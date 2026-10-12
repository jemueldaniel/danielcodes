# Workform V16 — original native site-wide motion

## Design and scope

The site remains black, charcoal, ivory and muted icy-navy, dark by default, with the original **full-color** portrait and one permanent circular lower-left nonmodal Ask Daniel launcher. This source adds purposeful motion using native CSS only: compact hero arrival, inertial hover/focus treatment for proof and app cards, subtle three-screen mock interaction, gallery arrow and button press feedback and a quiet Ask Daniel availability beacon. These effects do not add a darkening backdrop, scroll lock, modal, global loader, external animation bundle, unreviewed assets, network calls or unrelated app backends. Motion honors system `prefers-reduced-motion: reduce`, and hover movement applies only when the visitor uses a real fine hover pointer.

Source-of-truth files: `motion-v16.css` and `build-motion-v16.cjs`, which reproducibly compiles the style token into the first-party `popup-chat.js` and existing `worker.mjs`, preserving V14 NLP/source links and the V15 Social release. A small V16 maintenance correction normalizes Windows CRLF during `build-social-v15.cjs --check` without modifying the generated microapps Worker.

## Verification — isolated Windows/Edge, 2026-10-12

- V16 source reproduction `node apps/prism/build-motion-v16.cjs --check`: PASS.
- V15 existing Social source reproduction after CRLF portability repair: PASS; microapps Worker Git blob remains unchanged.
- Full real Node regressions: **123/123 PASS**, including the offline EthereumJS EVM bounded engine and V15 Social.
- Installed Edge V16 actual Worker local browser motion/interactive acceptance: **113/113 PASS** at 320, 390, 768, 1440px on /, /apps/, /apps/social/; actual moving tile on fine pointer, no overlays/overflow, functioning Ask, Escape, reduced-motion suppression, zero page errors.
- Site-wide local 10-route browser overlay/Ask regression: **329/329 PASS** at the same four widths; no blocking overlay/scroll-lock, original color and proper nonmodal Ask.

These local results alone are **not** a claim of a public Cloudflare deployment. Verify the existing live Prism source/version/settings, publish only exact reviewed GitHub bytes, require 100% deployment and rerun public HTTPS browser tests. Existing Studio/Pay presentation restrictions remain untouched; ten cards are not ten production backend attestations.

## Verified public Cloudflare release — October 12, 2026

- Existing Prism Cloudflare Worker `jemuel-workform-prism-v2` was independently preflight-qualified at old Git blob `201201ed6d163dbf661d60836ceb68d0279d1967`, 222,732 bytes, old version `d70ad566-a75a-4639-b621-998950088991` at 100%, empty bindings, compatibility date `2026-10-11`.
- The exact published V16 reviewed GitHub Worker blob `283ef566483cd0c99585c897ba7b7c119d633de1` was uploaded to the **same** Prism Worker (no route/account changes), independently verified by Cloudflare script readback at 225,296 UTF-8 bytes. New deployment `bb8c5c92-3037-45cf-b522-d85701268d4c`, version `6be3f9ec-81b5-448d-b7b2-f43069432b6d`, **100% traffic**, old empty bindings and compatibility date preserved.
- Installed Edge **production HTTPS** acceptance using only `https://jemueldaniel.website`: V16 motion **113/113 PASS** and ten-route no-blocking-overlay/Ask Daniel **329/329 PASS**, four widths 320, 390, 768, 1440. All target responses 200, floating nonmodal assistant opens/closes via Escape without locking page scroll, portrait/JavaScript errors absent, native app gallery effects and reduced-motion CSS verified.
- Cloudflare real deployment, GitHub review and public HTTPS tests do **not** certify every app's backend, native mobile screen-reader quality or interviews. The separate safety-held Studio/Pay presentation routes remain untouched.
