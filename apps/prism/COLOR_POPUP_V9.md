# Workform V9 — Natural-color Portrait + Floating Ask Daniel

**Source:** Original first-party popup `apps/prism/popup-chat.js`. The live portrait is the user's original, full-color `assets/portrait.jpg` (640×640); no pixel or face edits. Previously, app styles such as `img{filter:grayscale(1)}` desaturated it. This release overrides the filter across safely managed pages and fixes the Workbench's missing `img-src 'self'` CSP directive.

**New experience:** Compact responsive blue/charcoal floating chatbot, attached to the lower-left portrait button. A click or `/#ask` link opens an accessible, closable **nonmodal** panel with fast actions, recruiter-oriented source links, form, streaming same-origin `/api/chat/stream` responses, cancellation, bounded input/output, keyboard focus and Escape. No third-party assets or public retrieval of private company files. No forced modal backdrop or blocking full-screen overlay. `prefers-reduced-motion` disables animated transitions; printing hides the widget. On the homepage the old embedded assistant is visually hidden, but retained as a fallback if the shared widget fails to load.

**Shared source delivery:** `/ui-20261011/chat-widget-v9.js` is served by the existing Prism Worker, not a new global route. The homepage, 10-app catalog, standalone Agent, Workbench, Evidence and five existing microapps each load exactly the same first-party module. Only the narrow CSP directives needed for portrait and same-origin chat are amended: Workbench `img-src 'self' data:`, Microapps/Evidence `connect-src 'self'`. No D1 schemas, guest API operations, routing, auth or private data change.

**Release hold:** The independent /apps/live/ Workflow/Knowledge and /apps/pay/ presentations had prior safety-denied publication. This commit **does not change those Workers or bypass their holds**; their existing Ask links can navigate to the popup on the homepage. HTML résumé/cover-letter source pages have since been separately qualified and updated through the original portfolio Worker; the PDFs themselves cannot embed a live HTML chatbot.

**Qualification:**
- `node --test apps/prism/*.test.mjs apps/agent/*.test.mjs apps/workbench/*.test.mjs apps/evidence/*.test.mjs apps/pay/*.test.mjs apps/cloud-live/*.test.mjs`.
- `node apps/prism/fullcolor-popup-v9.browser.cjs`: real Microsoft Edge, isolated localhost, 320/390/768/1440, all ten safe independently served pages. Tests include photo filter, avatar image decode/color channels, popup open/close/keyboard/focus, nonmodal small-screen layout, same-page Ask link interception and SSE test responses. Synthetic streamed test responses do **not** qualify production backend.
- Live acceptance must repeat these controls against actual HTTPS and send a bounded real question to `/api/chat/stream` to verify the dynamic endpoint. Report model/stream failures honestly.
- For any release, compare live Worker Git-blob SHA-1 to the pinned previous exact source, preserve binding/settings/route scope, then independently read back the deployed code and confirm 100% traffic before claiming success.

## Public deployment and verified source — October 12, 2026

The personally connected Cloudflare account `thisisdanielsph@gmail.com` remained authoritative. Five narrowly scoped Workers were uploaded only after independently checking each live source blob and empty binding configuration; each has been read back as the exact reviewed GitHub file and serves **100%** of its route traffic:

| Existing Worker | New Git blob SHA-1 | Version |
| --- | --- | --- |
| `jemuel-workform-prism-v2` | `2a93cbc17bbcfb79324a9ee80a92b88220c3dada` | `11514642-0a79-42d1-a85c-02bf5bc9ea0a` |
| `jemuel-workform-microapps-v2` | `d399f4156993e39eaa1ca5ea6f808cc40cade055` | `0cab25ee-85f2-4938-b1d3-e9433ce4f095` |
| `jemuel-workform-agent-public` | `d62953a88d2de4b6e44429c18d27da123ee0dc34` | `e8366845-3021-4716-aa74-b1cebebc56b9` |
| `jemuel-workform-developer-workbench` | `e129ae28445a716c0a380b99e4d1fcd48f8587c8` | `55d70174-58a1-4def-b2f9-a21cee892dda` |
| `jemuel-workform-evidence-mono-v3` | `49f7e0338920c7f607f24f863741d571e7181192` | `c32a3a83-5694-43b4-b1ab-a28405a8d95d` |

The legacy HTML portfolio Worker was separately patched with a **single existing HTML response helper replacement**, not republished in this public code repository (its deployed script includes embedded pre-existing assets and AI routing). Pre-upload source blob `459ddeead9bbef4ee879f13ae79562f14aef1e57`; verified post-upload blob `239375f3b2029deb6bfeaf22dbf24546edfcf768`, Worker version `2436f55d-b1ed-421c-bf07-94298873bad7` at **100%**. Its existing Workers AI binding `AI` and compatibility date `2026-10-06` remained unchanged. The change injects the shared script into `html(x)` responses only; original binary résumé/cover-letter PDFs, portrait asset, chat streaming endpoint, and all non-HTML responses remain untouched.

### Live public acceptance

- **82/82 Node regressions** passed against the exact app sources, including the new popup contract tests.
- **428/428 Microsoft Edge localhost browser checks** passed across 320/390/768/1440px on ten independently managed HTML paths; this suite uses a synthetic SSE fixture, not a live provider.
- **325/325 public HTTPS Edge checks** passed across the same ten paths at 320/390/768/1440px, including loaded natural-color portrait image, nonmodal popup launch, focus, Escape close, popover viewport fit, no horizontal overflow and zero page exceptions.
- **68/68 additional public homepage/catalog Edge checks** passed, including direct `/#ask` opening, reading real native JPEG RGB pixel channels, and one actual backend-streamed chat response.
- **27/27 public legacy HTML source and cross-page chat checks** passed: `/resume/`, `/resume/source`, `/cover-letter/`, `/cover-letter/source` all provide colorful portrait popup; the real `/apps/social/` form also received a complete, substantial streamed response after the legacy Worker patch, demonstrating its existing `AI` binding is functional.

**Remaining scoped exceptions:** `/apps/live/` (Workflow/Knowledge) and `/apps/pay/` retain prior presentation-publication holds and were not modified or bypassed; their old pages currently lack the shared inline popup, despite the functional homepage chatbot. Printable/downloadable PDFs cannot contain working HTML controls. Do not represent the two held routes as already upgraded.
