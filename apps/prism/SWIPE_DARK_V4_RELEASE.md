# Workform V4 — dark-first swipeable recruiter showcase

**Release checkpoint:** October 11, 2026, Manila time.  
**Source branch:** `feat/workform-swipe-dark-demos-20261011`; stacked on the Monochrome V3 review branch.  
**Deployed scope:** existing Cloudflare presentation Workers only, not the D1 guest API/schema.

## Verified public changes

| Surface | New behavior | Public proof |
| --- | --- | --- |
| Homepage | Dark-first; ten horizontally swipeable mini app scenes; previous/next, keyboard and touch; circular lower-left Ask Daniel leads to the working inline assistant | [Homepage](https://jemueldaniel.website/) |
| Ten-app catalog | Dark-first; ten snap-scroll application cards; arrow buttons, keyboard navigation, touch gesture fallback, dynamic position, readiness filters and search; circular Ask Daniel | [Catalog](https://jemueldaniel.website/apps/) |
| Daniel Social | Fully original dark synthetic social cockpit with persona switching, follow/unfollow, like/unlike, saved posts, replies, local search, own-post deletion, reset and tab-readback | [Social](https://jemueldaniel.website/apps/social/) |
| Five microapps | Dark-first monochrome across Code, Project, Interface, Social and Contract; individual lower-left Ask Daniel shortcut | [Code](https://jemueldaniel.website/apps/code/), [Project](https://jemueldaniel.website/apps/project/), [Interface](https://jemueldaniel.website/apps/interface/), [Contract](https://jemueldaniel.website/apps/contract/) |
| Daniel Agent | Visible fixed four-step evidence timeline driven by actual existing API log events, with real server-owned run and artifact identity; dark-first, Ask shortcut | [Agent](https://jemueldaniel.website/apps/agent/) |
| Developer Workbench | Dark live request cockpit with count, HTTP status and latest six operation summaries; keeps actual JSON readback, replay and guest API | [Workbench](https://jemueldaniel.website/apps/workbench/) |
| Engineering evidence | Dark-first, monochrome and lower-left Ask shortcut, same read-only case-study filters | [Evidence](https://jemueldaniel.website/apps/evidence/) |

**Dark is the default on first visit**, with saved user preference honored on the homepage/catalog. The new bottom-left Ask controls are deliberately the sole floating UI elements on updated pages: they do not open a screen-blocking overlay or modal, and route to the in-flow assistant on the homepage.

## Genuine execution and capability boundaries

- **Workflow Studio and Knowledge Lab** use the unchanged Cloudflare D1 guest API via `/apps/live/` and `/apps/api/*`; their server data and session authority have not been modified this release.
- **Agent** is a deterministic client-side orchestrator of real API effects; the four-step visual progress is based on actual observed responses, not an independent atomic server-side Agent job.
- **Developer Workbench** exercises real same-origin HTTP operations. Published SDK and genuine protocol-level MCP functionality are not claimed.
- **Social, Code, Project, Interface and Pay** remain local browser-only examples. Synthetic follows/posts/reactions have no public identity, real authentication or cross-device persistence.
- **Contract Lab** remains qualification-only, without executing actual offline EVM scenarios.
- **No private Caster wallet/social/agent startup code or unpublished business content was copied.** Local source was inspected read-only for interaction patterns; this public implementation is original.
- No crypto payment, blockchain signing, wallet connection, financial account or real currency exists in Daniel Pay.

## Daniel Pay — completed source candidate, not published to the live Pay route

The redesigned `apps/pay/index.html` is a more product-like, strictly fictional Daniel Wallet: two source account balances, fixed aggregate test-unit supply, transfer preview, readable activity history and receipt summaries, expandable technical JSON, reset/replay and visible 0-value disclosures. It uses the original public `ledger.mjs` bounded implementation.

**19/19 local Microsoft Edge acceptance checks passed:** 1,000/1,000 opening balances, a simulated 125-unit transfer producing 875/1,125, conserved 2,000 supply, preserved activity after reload, stable idempotent replay with no second debit, reset and four responsive widths. The source is committed and tested.

**Do not assert this design is live.** The prior separate Studio/Pay presentation publication had been explicitly blocked by the connected tool's safety determination; the blocked upload was **not** retried, bypassed or routed through an alternative. Production `/apps/pay/` remains the earlier fictional tab-only UI; production `/apps/live/` remains the earlier D1 guest studio UI. Their palette defaults were not replaced.

## Acceptance performed after public release

- **82/82 Node tests PASS**, 0 failures, exit code 0, from a checked-out V4 branch. Includes D1 Worker contract tests, Prism regressions, swipe/touch fallbacks, Agent/Workbench source verification, synthetic ledger, social app checks, and existing independent demo source contracts.
- **37/37 live Microsoft Edge tests PASS**, covering dark-first homepage/catalog, correctly placed circular Ask controls, horizontal slide interactions, readiness filter/search, **synthesized native touch gesture with scroll advance**, keyboard actions, synthetic Social follow/like/reply/bookmark/search/delete/reset, saved tab state after reload, 320/390/768/1440 layouts and zero unhandled JavaScript errors.
- **18/18 live Edge theme/circular Ask checks PASS**, including shared preference across homepage/catalog and only the requested single fixed Ask element.
- **17/17 live Agent end-to-end checks PASS** after dark cockpit deployment. Includes real D1 guest effects, replay, SHA-256 artifact provenance, reload and ephemeral guest workspace deletion.
- **17/17 live HTTP Workbench end-to-end checks PASS** after dark cockpit deployment, including persisted API operations, replay, retrieval/evaluation, and test workspace deletion.
- **20/20 live Evidence checks PASS** for filters, Ask shortcut, dark computed colors and four responsive widths.
- Read-only **12/12 public routes HTTP 200**, 0 mobile page overflows; **10/12 sample computed grayscale**, with old-colored Studio and Pay as the exceptions.
- Read-only link audit: **25 unique same-origin destinations**, zero broken, missing tested same-page fragment, or unlabeled link; 54 hash routes.
- Six public source files scanned for common private project markers, job tracker names and credential fragments; none matched. That limited scan is not independent source security certification.

## Safety and rollback

The new Cloudflare UI deployments replaced only the existing presentation workers serving the routes listed above, with a verified prior Worker ETag and exact route preflight before upload. **The D1 API Worker, guest D1 database, account credentials and original production domain service remained unchanged.** No new paid resource, trust setting, DNS or private connector data was introduced.

Versions must be freshly re-checked before any rollback, and unrelated newer work must be preserved; don't treat this document as a rehearsed rollback.

## Open engineering gaps

Full server-backed integration for the local demos, true persistent shared Pay/Social/Project storage, independently qualified offline EVM, full SDK/MCP protocol integration, a server-atomic Agent operation, full Safari/Firefox/mobile-device/screen-reader and production-scale privacy/cost audits remain outside this V4 release. A compelling portfolio may support a hiring application but cannot guarantee a recruiter interview or offer.

## Public source and design references

The public original reference work at [jemueldaniel/danielworks](https://github.com/jemueldaniel/danielworks) includes tested React workflow, event-outbox and bounded compiler examples. The interaction system uses native scroll-snap with touch fallback and clear focus/accessible controls; it is informed by [Embla Carousel](https://www.embla-carousel.com/) patterns and composable [shadcn/ui](https://ui.shadcn.com/) conventions, but no copied third-party or proprietary template is included in this Worker code.
