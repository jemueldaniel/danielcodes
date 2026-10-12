# Workform V14 — Jacket monochrome, DanielWorks evidence and source-scoped Ask Daniel

The original full-color portfolio portrait features a **black/charcoal varsity jacket with ivory-white sleeves and trim**. V14 makes those exact visual families the shared theme: deep background `#0a0e15`, Ask Daniel navy `#101827`, layered surfaces `#141e2d`, ivory text `#e5edf8`, and a restrained cool-blue accent `#bed8ff`. A final visual inspection found an older **bronze** `--prism-accent` in the homepage heading and explicitly replaced it with cool blue. No image pixels, masks, logos or portrait files were edited. User-selected light theme stays available as a crisp monochrome variant, while first visits default dark.

## Site-wide architecture

The existing first-party Prism Worker serves one version of `/ui-20261011/chat-widget-v9.js` containing the extra V14 palette and contextual NLP. The script was already injected by preceding verified releases on the homepage, /apps catalog, Agent, Workbench, Evidence, Code, Social, Project, Interface, Contract and HTML résumé/cover-letter source pages. The update changes **one shared source**, not nine disconnected CSS copies. The *original floating circular color-portrait chatbot* stays lower-left, can open/close, supports Escape and accessible focus, and has no opaque page-blocking backdrop.

**Previously denied publication of the /apps/live/ Workflow/Knowledge Studio and /apps/pay/ Pay presentation remains held.** Do not redeploy or route around those Workers to add this CSS; do not falsely claim the floating popup on those two older HTML routes. Printable/downloadable PDFs cannot contain working HTML chat. The independent D1 guest API and the pre-existing Workers AI service are not modified by this UI change.

## DanielWorks added to Workform

A new original evidence explorer is integrated on both the homepage and the ten-app catalog. It contains **8 separately identified public examples** from the separate personal repository [jemueldaniel/danielworks](https://github.com/jemueldaniel/danielworks), pinned to public SHA `d6310035cdec5bf079b80478822efddb08b23fba`:

1. Engineering Proof Gallery
2. Technology Atlas
3. Flow Lab
4. Interface Lab
5. Signal Study (fictional SVG analytics)
6. Bounded Agent Recovery
7. Hybrid Retrieval
8. Atomic Ledger (fictional units only)

The app provides live text search, four discipline filters, real result counts, horizontal swipe/snap, keyboard-arrow and click navigation, visible focus, and **16 working direct links** to matching public source and test files. It does not copy a proprietary project, import private code or claim all eight source examples are deployed server applications.

GitHub `docs/PUBLIC_CAPABILITIES.json` supplies the individual qualification boundaries. The Technology Atlas categorizes 87 entries (52 with public tests, two historical references, 33 source observations); an entry alone is **not proof of production expertise**. The independently executed `danielworks` **335/335 Node model cases passed** at this exact public commit, covering Proof Gallery, Technology Atlas, Flow Lab, Interface Lab and Signal Study. This does not certify every DanielWorks backend or every runtime feature. Unapproved private startup records are never linked.

## Ask Daniel — bounded NLP + real streaming AI

V14 introduces 14 public-topic entries with explicit qualification boundaries and exact pinned links. Casefolded Unicode tokenization (English and some Tagalog-capable Unicode words), source-scoped synonyms, token scoring and limited pronoun-followup resolution improve known-topic answers without inventing model traces. The pinned facts include what is *live, browser-local, historical, unqualified or fictional*. Answers which come from this public registry are explicitly labeled **source-backed navigation**; general unrecognized questions still go to the original first-party `/api/chat/stream` endpoint, labeled **AI-generated, verify references**.

The dialogue stores at most 12 bounded messages in same-origin **sessionStorage**, not on a backend, to preserve the conversation while navigating the website *within one tab*. The new Clear Chat control erases that local context and visible messages. Only a public topic name can contextualize a short ambiguous follow-up sent to the original AI backend; raw chat history is not broadcast to GitHub/Cloudflare or presented as model-native persistent memory. The real streaming AI may still be incomplete or wrong; no training, fine-tuning, semantic vector retrieval or universal NLP correctness is claimed. Visitors should not enter private, medical, financial or confidential material.

Source input is rendered using `textContent`, only pinned allowlisted links are added, existing SSE byte/output limits and Stop button are preserved, and old inline Ask sections are visually hidden when the floating version is available.

## Tests and verification

From `danielcodes` source:

```sh
node --test apps/prism/*.test.mjs apps/agent/*.test.mjs apps/workbench/*.test.mjs apps/evidence/*.test.mjs apps/pay/*.test.mjs apps/cloud-live/*.test.mjs apps/contract-engine/engine.test.mjs
PLAYWRIGHT_MODULE=/path/to/playwright-core PLAYWRIGHT_EXECUTABLE=/path/to/chromium-or-edge node apps/prism/jacket-works-chat-v14.browser.cjs
PLAYWRIGHT_MODULE=/path/to/playwright-core PLAYWRIGHT_EXECUTABLE=/path/to/chromium-or-edge node apps/prism/allpages-jacket-v14.browser.cjs
PLAYWRIGHT_MODULE=/path/to/playwright-core PLAYWRIGHT_EXECUTABLE=/path/to/chromium-or-edge node apps/prism/fullcolor-popup-v9.browser.cjs
```

- **90/90 Node tests** passed on the current isolated V14 checkout (all previous app contracts plus V14 source audits).
- **89/89 real Edge browser V14 checks** passed at 320/390/768/1440: palette CSS tokens, real color avatar, Workform proof explorer source/test links, filtering, keyboard carousel, contextual source-backed chatbot, across-route tab history, Clear Chat, and routed mock SSE response. The streaming fixture is **not** public AI validation.
- **321/321 real Edge site-wide palette checks** passed across ten independently managed and safe routes at those same widths, including checked dark theme background `rgb(10, 14, 21)`, original colorful portrait, no horizontal overflow and usable popup.
- **428/428 earlier real Edge V9 chatbot regression checks** passed on this V14 source, covering the same ten routes and four viewport widths.
- **335/335 independently rerun DanielWorks public model tests** passed from source-pinned `d6310035...`; this covers five original educational UI/interaction models, not the entire public repository.
- Manual rendered mobile screenshot inspection also caught and corrected the remaining bronze Prism headline accent before the final rebuild.

Public Cloudflare publication requires independent before/after source Git blob comparison, unchanged Worker bindings and routes, 100% traffic deployment, and **actual public HTTPS** browser checks. A local browser pass alone is not proof of that release. GitHub PR and public rollout receipts belong below this heading after verification.

## Limitations

Workform remains ten separate demos with mixed completeness and source qualifications; not all are real server account applications. Earlier V11 Project revision explorer and V12 Workflow/Knowledge UI are **local-only** work with separate publication restrictions; this V14 change does not import them or bypass any denied publication. No claim of guaranteed employment, full WCAG certification, hosted DanielWorks examples, or private source authorship rights is made.
