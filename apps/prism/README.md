# Workform Prism V2 — public portfolio and standalone app showcase

Shipped October 11, 2026 to [jemueldaniel.website](https://jemueldaniel.website/).

This design layer is based on the **actual current public homepage and catalog HTML**. It preserves existing portfolio, résumé, cover letter, case studies, assistant behavior, Cloudflare API routes and unrelated Workers. It prioritizes **Ask Daniel** in the top bar, main hero, and floating assistant, and uses original responsive CSS and ten per-application interface motifs. No proprietary templates or startup files are copied.

## Route / truth matrix

| Application | URL | Qualified scope |
| --- | --- | --- |
| Workflow Studio | /apps/live/#workflow | D1-backed bounded guest workflow |
| Knowledge & Evaluation | /apps/live/#knowledge | D1-backed bounded guest lexical retrieval and evaluation |
| Daniel Agent | /apps/agent/ | Deterministic browser orchestration with real D1 backend effects; not atomic server-agent receipt |
| Daniel Social | /apps/social/ | Tab-only synthetic personas, posts, replies and reactions |
| Daniel Pay | /apps/pay/ | Tab-only fictional non-redeemable ledger; zero financial value |
| Developer Workbench | /apps/workbench/ | Live same-origin HTTP; not a full SDK/MCP protocol implementation |
| Code Lab | /apps/code/ | Real small browser compiler via already published labs.mjs |
| Contract Lab | /apps/contract/ | Qualification-only information; **no EVM execution** |
| Interface Lab | /apps/interface/ | Native browser components and local event trace |
| Project Workspace | /apps/project/ | Bounded session-tab text files, revisions, diffs and restore via labs.mjs |

Four entries are live-API-connected; five are browser-only; the Contract runtime is unqualified. These are not ten production-hardened backends.

## Deployment

Cloudflare Worker `jemuel-workform-prism-v2` serves only exact URL paths `/` and `/apps/`, plus preview `/ui-20261011/*`. Cloudflare Worker `jemuel-workform-microapps-v2` serves exact app paths under `/apps/code/*`, `/apps/project/*`, `/apps/interface/*`, `/apps/social/*`, and `/apps/contract/*`.

All five new pages have unique visual identities and a visible `/#ask` action. The existing D1 guest studio, Agent, HTTP Workbench, browser Pay and Labs Workers remain independent. The exact homepage route uses a **fragment** to open the assistant: query parameters do not match a Cloudflare exact-route pattern unless a wildcard is used. The original domain Worker continues serving other paths. To revert the visual release, remove only the exact homepage/catalog routes and the five new microapp routes—do not reset database state or overwrite old scripts.

## Engineering choices

- Original editorial design, system fonts, precise hairlines, subtle layering, per-app palettes and hover feedback; no external JS, fonts or paid UI dependencies.
- Reduced-motion CSS, keyboard-focus indicators, skip links, semantic native controls and touch-sized targets. These patterns do not prove physical-device or screen-reader certification.
- Each app displays truthful storage and execution scope. User-authored sample text is rendered with `textContent`, never injected as HTML.
- Code/Project apps reuse published bounded local execution/version stores; Social is session-tab only; Contract is a transparent qualification page with **no fabricated transactions**.
- Inspiration only: [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility), [shadcn/ui](https://ui.shadcn.com/), and [Motion](https://motion.dev/). No claim that a portfolio design guarantees a hire.

## Verified and remaining

Source and route checks: Prism 26/26; first standalone Worker 46/46; additional route admission 8/8 after hardening. Live HTTP content readback confirmed `/`, `/apps/`, all five new app HTML routes and four module JS URLs. A browser automation request was blocked; **no fresh Playwright, screen-reader, contrast measurement, mobile-device or all-ten-app acceptance pass is claimed for this design release**.

Outstanding work: full server-backed Social/Pay/Code/Project/Interface integration, offline EVM compiler/runtime security qualification, real SDK/MCP interoperability, durable atomic Agent orchestration, independent privacy/resource hardening, and cross-browser accessibility/performance evidence.

Run `node --test apps/prism/prism.test.mjs` to execute the included Node source tests in an authorized environment. This README itself does not constitute a test pass.
