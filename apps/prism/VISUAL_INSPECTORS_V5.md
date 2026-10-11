# Workform V5 — Visual Inspector Upgrade

**Status:** publicly released on October 12, 2026 at approximately 05:16 Asia/Manila to the existing narrowly scoped Cloudflare microapps Worker; source remains reviewable on a stacked PR.

## What actually runs

This change makes three of the ten individually routed, browser-local demonstration apps more readable for non-engineer reviewers **without replacing their real deterministic engines**:

| App | Visible interface | Truthful execution |
| --- | --- | --- |
| [Daniel Code Lab](/apps/code/) | Interpreter result, verified/rejected state, 4-stage compiler rail, native expandable machine evidence | Existing bounded lexer, parser, IR and interpreter; invalid source visibly clears the previous result |
| [Daniel Project Workspace](/apps/project/) | Saved file count, selected revision, real line-level diff list, restored-revision status, expandable serialized receipt | Existing browser-tab revision store; Save, Compare and Restore still work and survive same-tab reload |
| [Daniel Interface Lab](/apps/interface/) | Live observed-event counter, distinct event types, most recent event timeline, inline experiment controls | Actual semantic browser input, disclosure, validation and inline focus-panel events; no invented instrumentation |

Presentation is **dark-first, black/white/grey only** with responsive two-column metric cells, desktop four-stage compiler rail, mobile two-column rail, focus visibility and reduced-motion suppression. Full machine-readable evidence remains reachable through native `details/summary` elements, **never a blocking popup**. Existing per-app Ask Daniel shortcut remains available.

The presentation uses additive read-only observers of the engine's existing status/output nodes, rather than mocked or randomly generated numbers. Browser-local results are **not server persistence**, certified accessibility or a full contract/EVM runtime.

## Reproducible tests

From the repository root:

```bash
node --test apps/prism/*.test.mjs apps/pay/*.test.mjs apps/cloud-live/*.test.mjs
```

Optional real browser tests require a locally installed Playwright Core module and Chromium/Edge executable:

```bash
npm install --no-save playwright-core
node apps/prism/visual-inspectors-v5.browser.cjs
```

For locally installed Edge, set `PLAYWRIGHT_EXECUTABLE` to the browser binary; for a nonstandard Playwright module location, set `PLAYWRIGHT_MODULE` to its local module path. Set `WORKFORM_LIVE_ORIGIN=https://jemueldaniel.website` to repeat identical assertions against the public release (otherwise the harness starts an ephemeral localhost server). It always closes both browser and local server. The only accepted remote override is the project’s own domain. It uses **real runtime module bytes**, not a screenshot or mock result.

Verified October 12, 2026: **10/10 new Node contracts**, **54/54 existing scoped Node regressions**, **48/48 localhost browser assertions**, **48/48 independently repeated public HTTPS browser assertions** (320/390/768/1440px for Code, including source errors and focus; Project save/compare/restore/reload; Interface native interactions and focus return). Separate live homepage/gallery/Social/Ask regressions also passed **37/37** and **18/18** after deployment. All were Microsoft Edge real browser checks, not static screenshots.

## Scope and release boundary

- Only the existing `apps/prism/microapps-worker.mjs` five-route presentation Worker and new test files are modified. Its Social and Contract pages are byte-for-byte the existing page templates; no auth, D1, DNS, wallet, real-chain calls or Caster startup IP are modified or copied.
- This source is intended to be reviewed **on top of** `feat/workform-swipe-dark-demos-20261011`. Keep staged pull requests and deployed revisions intact.
- **Do not use this as permission to publish the unrelated Pay/Studio presentation changes** that were held by earlier tool safety controls. Contract Lab remains a qualification-only interface until an actual independently tested offline EVM is available.
- **Released and verified:** Cloudflare account owning the active `jemueldaniel.website` zone, Worker `jemuel-workform-microapps-v2`, deployment ID `54757e8b-ba56-47d2-aae2-ebed9c507efa`, version `4bfd86d8-9d54-4207-986a-bccf1d90cf09` at **100%**, exact deployed blob SHA-1 `0768fce5f948e9b00e6f51984cf9409696b04125` (matches the original publicly committed Worker byte-for-byte). Before upload, previous production SHA `4cdd0f8349df67b03b2a6e028635a14963728a92` was verified against the V4 GitHub branch; account bindings remained zero, compatibility date unchanged, routes preserved. After upload, independent Cloudflare readback matched new SHA, and all 48 live browser assertions passed.
- **Unchanged/honest limits:** this UI release upgrades only Code, Project, and Interface visuals; Social and Contract templates and their scopes are preserved. It does **not** qualify Contract EVM runtime, Pay payments, real auth, or full ten-app backend integration, and does not change the prior safety-held Pay/Studio presentation releases.
