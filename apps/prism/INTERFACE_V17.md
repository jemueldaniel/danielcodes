# Workform V17 — Daniel Interface Lab: Interaction Engineering Console

This change rebuilds the ninth recruiter-facing mini application as a real browser-local UI systems laboratory, not a static dashboard, fake device emulator or modal preview.

## Genuine functionality

- A differentiated **three-column interface**: constrained device preview, native interaction controls and a measured evidence inspector; collapses to a single column on compact phones. The original native controls are still working in an explicit expandable advanced testbench.
- Three requested CSS viewport widths (320, 390 and 768) without overflow. Displayed **actual** preview and browser widths come from getBoundingClientRect and innerWidth, not invented device dimensions.
- Three original motion modes (Quiet / Precise / Fluid) and scoped Ink / High contrast controls, with deliberate **click-triggered** orbit feedback rather than autoplay animations or gimmicky particle effects. Device and system `prefers-reduced-motion` overrides always win.
- Three keyboard-operable accessible tabs with Left/Right/Home/End navigation and ARIA selections, linked live panel content, a saved preview state, six actual exploration milestones, a local activity trail, and a run counter.
- Measured `>=44px` button dimensions for actual preview controls, visible motion policy and rendered preview width, bounded browser-tab state and an exported JSON evidence record. The JSON excludes user-authored field text, chat messages and private files.
- An inline, cancel-safe two-step reset with Escape support. No fixed backdrop, modal, scroll lock, remote script, account, external API or client-company source.
- V14/V16 full-color avatar, live site monochrome jacket palette, site-wide nonmodal lower-left Ask Daniel and original user-consented theme settings remain untouched.

## Authored source and reproducibility

`interface-v17-panel.html`, `interface-v17.css`, `interface-v17-addon.js` are authored original source. `build-interface-v17.cjs` checks exact fail-closed anchors and generates only the scoped Interface additions to `microapps-worker.mjs`. Run `node apps/prism/build-interface-v17.cjs --check` to verify byte reproducibility. Existing Social, Code, Project and genuine offline EthereumJS Contract implementations are not replaced.

Test source is `interface-v17.test.mjs` (Node) and `interface-v17.browser.cjs` (real installed Microsoft Edge browser; allows `WORKFORM_LIVE_ORIGIN=https://jemueldaniel.website` for explicitly qualified postrelease testing). The existing `visual-inspectors-v5.browser.cjs` now expands the advanced Interface testbench before exercising its unchanged, real controls.

Design inspirations are principles, not copied source: [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Motion accessible animation guidance](https://motion.dev/docs/react-accessibility), and [MIT-licensed Motion Primitives](https://github.com/ibelick/motion-primitives). The implementation is original first-party CSS and JS, avoiding an external animation runtime.

## Verified local Windows / xlq — October 12, 2026

- Full **129/129 Node regressions PASS** (including real isolated D1 API contracts, Social, EVM, original Interface and V17).
- New **188/188 actual Edge V17 checks PASS** at 320,390,768,1440 for real tabs/ARIA keyboard behavior, preview dimensions, motion/off policy, 44px measured buttons, state persistence, safe reset, privacy-preserving export and nonmodal Ask.
- **48/48 existing legacy Edge checks PASS** (Code, Project and original Interface actions, focus movement and inline focus panel).
- **329/329 independent ten-route site-wide Edge overlay/Ask checks PASS** at four widths, with zero unexpected blocking backdrops or uncaught page JavaScript errors.
- Rendered 390px and 1440px full-page screenshots were manually inspected; an activity log that wrapped into a 28px column and excessive legacy page height were corrected before qualification.

## Publication and truth boundaries

These local checks alone are not production acceptance. The existing live microapps Worker must have its prior Git blob, deployment, compatibility settings and bindings independently checked before updating, with exact Github-reviewed bytes, a 100% deploy receipt, and new real HTTPS browser acceptance afterward. The separate Workflow/Knowledge Studio and Pay presentation Workers remain untouched due existing independent publication restrictions. This is an original fictional browser-local design systems demo, not physical mobile-device testing, a comprehensive accessibility audit or proof that all ten Workform applications have complete backends.

## Verified public Cloudflare release — October 12, 2026

- Independent pre-upload readback of the existing `jemuel-workform-microapps-v2` Worker matched the exact earlier production Git blob `08114aa81e99a991be482b830b40a7351f0b8eaa`, **466,663 UTF-8 bytes**, deployment `d487dc1a-0d6e-47a1-9867-3596c62c3e37`, version `8723d6ec-9370-40c6-a9fd-4927045ea81b`, 100%. No bindings; compatibility date `2026-10-11`.
- Authorized personal GitHub branch source commit `804ed7c9e87d3fed4a94865365b98420344b49dc` was the reviewed release source. The new Worker source Git blob `a2dfcc1be376ed18ea141d150f515b2f68d08b68` was independently read back from Cloudflare at **501,158 UTF-8 bytes**, exactly matching the reviewed GitHub blob. No Worker route, compatibility date or bindings changed.
- New Cloudflare deployment `2fbe5db3-fa4a-4730-9436-7a550f8e8e5e`, version `251276bb-495c-4af2-8fc3-0af224b818f7`, at **100%**.
- **Actual public HTTPS** Microsoft Edge checks at `https://jemueldaniel.website`, four widths 320/390/768/1440: new Interface Lab **188/188 PASS** including a downloaded real JSON evidence record, keyboard tab navigation, motion policy and nonmodal Ask; original V5 browser regression **48/48 PASS**; ten-route no-large-blocking-overlays/Ask **329/329 PASS**. No uncaught page errors.
- Full independent pre-release Node regression remained **129/129 PASS**, including genuine offline EthereumJS EVM engine and isolated D1 backend test contracts. Release does not alter previously held Studio and Pay presentation Workers.
- Live boundaries: this is a browser-local original interface systems demo, not physical device automation, native mobile certification, a WCAG audit, or proof of all ten fully built backend systems.
