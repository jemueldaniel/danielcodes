# Workform V6 — Ask Daniel interactive demo navigator

**Scope:** current homepage presentation only; the ten independently routed demo applications and the guest D1/Cloudflare API are unchanged. The active native inline Ask Daniel stays keyboard-accessible and the portrait launcher remains bottom-left. No modal, overlay, external dependency, or new Worker binding is introduced.

## Recruiter journey

Choose one of ten specific applications in the compact navigator at the top of Ask Daniel. The preview immediately identifies the app's actual execution scope. **Inspect evidence** creates an in-flow evidence card with a live app route and an explicit GitHub source branch link, while moving keyboard focus to the resulting action. Both links are ordinary inspectable anchors rather than opaque vendor integrations.

D1-backed Workflow + Knowledge Studio, API-oriented Agent/Workbench, browser-local Social/Code/Interface/Project/fictional Pay and the not-yet-qualified offline EVM Contract Lab are labeled separately. No fabricated on-chain, social user, finance, SDK or MCP capability is asserted. This is an original interface, not copied from startup/private code.

## Verification

Run `node --test apps/prism/*.test.mjs apps/pay/*.test.mjs apps/cloud-live/*.test.mjs` for Node tests. The new `hiring-navigator-v6.test.mjs` adds three DOM/source contract tests. An additional real-browser Playwright check should select all ten options, verify link destinations and focus on the resulting action, and check 320/390/768/1440px with no overflow or page exceptions.

The previous V5 and Cloudflare deployment must be reconciled before any production publication, including checking that the deployed Worker source hash still corresponds to the reviewed V5 parent. This branch should be reviewed as a stacked PR against V5; do not automatically merge it to main.
