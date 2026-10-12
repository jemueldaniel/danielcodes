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
