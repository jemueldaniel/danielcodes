# Workform V6 — Ask Daniel interactive demo navigator

**Scope:** current homepage presentation only; the ten independently routed demo applications and the guest D1/Cloudflare API are unchanged. The active native inline Ask Daniel stays keyboard-accessible and the portrait launcher remains bottom-left. No modal, overlay, external dependency, or new Worker binding is introduced.

## Recruiter journey

Choose one of ten specific applications in the compact navigator at the top of Ask Daniel. The preview immediately identifies the app's actual execution scope. **Inspect evidence** creates an in-flow evidence card with a live app route and an explicit GitHub source branch link, while moving keyboard focus to the resulting action. Both links are ordinary inspectable anchors rather than opaque vendor integrations.

D1-backed Workflow + Knowledge Studio, API-oriented Agent/Workbench, browser-local Social/Code/Interface/Project/fictional Pay and the not-yet-qualified offline EVM Contract Lab are labeled separately. No fabricated on-chain, social user, finance, SDK or MCP capability is asserted. This is an original interface, not copied from startup/private code.

## Verification

Run `node --test apps/prism/*.test.mjs apps/pay/*.test.mjs apps/cloud-live/*.test.mjs` for Node tests. The new `hiring-navigator-v6.test.mjs` adds three DOM/source contract tests. An additional real-browser Playwright check should select all ten options, verify link destinations and focus on the resulting action, and check 320/390/768/1440px with no overflow or page exceptions.

The previous V5 and Cloudflare deployment must be reconciled before any production publication, including checking that the deployed Worker source hash still corresponds to the reviewed V5 parent. This branch should be reviewed as a stacked PR against V5; do not automatically merge it to main.

## Verified public release — October 12, 2026 (Asia/Manila)

- Exact authenticated account: personal Cloudflare account of `thisisdanielsph@gmail.com`, active zone `jemueldaniel.website`.
- Existing homepage Worker: `jemuel-workform-prism-v2` (no D1 bindings). Its **previous source** was independently read back as Git blob `d953a20bbc0b12eec9c266f2abbf698154aaa863`; the upload was admitted only if that prior SHA still matched.
- Uploaded source Git blob: `f30ba1bb42b46bcb88ce80015392bc65e27998c5`, with compatibility date unchanged (`2026-10-11`) and no route/D1/API mutation. Cloudflare deployment `530db494-273e-47b1-9c48-08ba4bff84b3`, Worker version `5f07695a-67ea-4c06-a1ef-bc94f0d239a8` at **100%**.
- Independently downloaded production source matched the **exact GitHub blob** after deployment (163,395 UTF-8 bytes). All existing Worker bindings remain empty and date unchanged.
- **67/67 Node regressions passed**, **91/91 Microsoft Edge browser checks passed locally**, and **91/91 browser checks passed against live `https://jemueldaniel.website`** at 320/390/768/1440 px, with no browser JS errors in those tested journeys.
- Reproduce the public-site suite with `set WORKFORM_LIVE_ORIGIN=https://jemueldaniel.website&& node apps/prism/hiring-navigator-v6.browser.cjs` on Windows CMD with Playwright Core + Edge; the harness refuses arbitrary unapproved remote origins.
- The ten app Workers, their APIs, bindings, D1 stores and existing release restrictions remain unchanged. A UI demo link alone is not proof of real payments, actual MCP/SDK operations or a qualified EVM runtime.

This release is intentionally **only the recruiter-facing Ask Daniel interaction layer**, not a claim of ten production-complete autonomous apps. The PR remains a stacked draft, while the tested homepage presentation itself is publicly deployed.
