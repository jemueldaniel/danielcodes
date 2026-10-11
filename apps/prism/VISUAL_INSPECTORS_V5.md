# Workform V5 — Visual Inspector Upgrade

**Status:** independently authored source candidate on a review branch; not evidence of a public Cloudflare deployment.

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

For locally installed Edge, set `PLAYWRIGHT_EXECUTABLE` to the browser binary; for a nonstandard Playwright module location, set `PLAYWRIGHT_MODULE` to its local module path. The browser acceptance harness starts an ephemeral localhost server and closes both the server and browser. It uses **real runtime module bytes**, not a screenshot or mock result.

Verified local execution on October 12, 2026: **10/10 new Node contracts**, **54/54 existing scoped Node regressions**, and **48/48 browser acceptance assertions** across 320, 390, 768 and 1440px (Code), as well as Project and Interface exercise/reload/focus tests on compact phones. Separate deployment verification is still required.

## Scope and release boundary

- Only the existing `apps/prism/microapps-worker.mjs` five-route presentation Worker and new test files are modified. Its Social and Contract pages are byte-for-byte the existing page templates; no auth, D1, DNS, wallet, real-chain calls or Caster startup IP are modified or copied.
- This source is intended to be reviewed **on top of** `feat/workform-swipe-dark-demos-20261011`. Keep staged pull requests and deployed revisions intact.
- **Do not use this as permission to publish the unrelated Pay/Studio presentation changes** that were held by earlier tool safety controls. Contract Lab remains a qualification-only interface until an actual independently tested offline EVM is available.
- Public Cloudflare deployment requires verifying current Worker version and routing, then separate real-domain browser readback. Source tests alone do not establish a live release.
