# Workform Monochrome V3 — release and evidence ledger

**Date:** 2026-10-11 (Asia/Manila). **Branch:** `feat/workform-monochrome-no-overlays-20261011`, stacked on the existing Prism design draft. This is a public design and sample-app project. It is not a certified production hiring platform.

## Design principles

- **Strict black/white/grayscale** with light and dark neutrals, no metallic/gold accents, no remote font or animation dependencies.
- **No fixed chat overlay.** Ask Daniel is the most prominent control in the header and hero; the original assistant remains an in-flow, labeled region next to links to publicly inspectable proof. Closing and reopening the region preserve keyboard focus.
- **Compact but accessible:** 44 px interactive targets, actual links and actions, visible focus, responsive 320/390/768/1440 px layouts, reduced-motion compliance, compact navigation, bounded tables/results.
- **No fabricated application capability:** four app entries call actual same-origin guest APIs (Workflow, Knowledge, Agent and HTTP Workbench); five are browser-tab examples; Contract Lab remains a non-running EVM specification.
- Only public personal evidence may be linked, including [DanielWorks](https://github.com/jemueldaniel/danielworks). Private company/startup repositories, job correspondence and secrets are not copied.

## Production changes verified

| Public route | Worker | Current result |
| --- | --- | --- |
| `/` and `/apps/` | `jemuel-workform-prism-v2` | **Monochrome V3 live**, inline Ask, no visible overlay |
| `/apps/code/`, `/apps/project/`, `/apps/interface/`, `/apps/social/`, `/apps/contract/` | `jemuel-workform-microapps-v2` | **Monochrome V3 live**; Interface example uses an inline panel instead of a modal |
| `/apps/agent/` | `jemuel-workform-agent-public` | **Monochrome V3 live**, real saved backend effects and replay still working |
| `/apps/workbench/` | `jemuel-workform-developer-workbench` | **Monochrome V3 live**, real HTTP inspector and existing D1 API still working |

No source or deployment change was made to the D1 API Worker `jemuel-workform-live-v1`, its schema, credentials or storage binding. The Cloudflare presentation Workers above have no database bindings. Existing external links, résumé and cover-letter routes are preserved.

## New source not deployed

- `apps/mono/extra-worker.mjs` contains **presentation-only** black-and-white Workflow/Knowledge Studio and fictional Pay pages. It reuses the already published public client modules and points to the **unchanged** `/apps/api/*` backend. Five Node source/route tests passed. The Cloudflare Worker upload was **blocked** by the tool safety gate; no alternate host, tool or bypass was attempted and no routes were changed.
- `apps/evidence/index.html` has a monochrome source upgrade and a direct DanielWorks proof link, with four source tests passing. The live `/apps/evidence/` route has **not** received that new source.
- Production `/apps/live/`, `/apps/pay/` and `/apps/evidence/` therefore **still display an older off-white/colored palette**. They must not be labeled as Monochrome V3 live.

## Acceptance evidence

- Actual Microsoft Edge live-browser UI audit of production homepage, catalog and the five separate microapps: **69/69 checks**, no unhandled page JS errors, tested widths **320, 390, 768, 1440 CSS pixels**, observed grayscale sampled computed colors and **zero visible fixed overlays**. Verified Ask Daniel close/reopen/focus, Code Lab return 42, Project revision save, synthetic Social post, and Interface inline panel.
- Existing bounded Agent journey after visual deployment: **17/17 live Edge checks**, including D1 guest session, search, workflow execution, artifact SHA-256 verification, operation replay, persistence after reload and test-workspace deletion.
- Existing Developer Workbench journey after visual deployment: **17/17 live Edge checks**, including real D1 API writes/readback, evaluation, replay, keyboard, responsive widths, and test-workspace deletion.
- An independent live read-only audit of 12 routes returned HTTP 200 everywhere with no overflow or visible fixed overlays at the tested mobile width. Nine had grayscale sampled computed colors; the three outstanding exceptions are listed above.
- Full Node source tests for the branch passed **65/65** before the evidence-source update. The updated evidence subset passed **4/4** afterward. These counts represent specific commands and are not a broad all-app security certification.

**Unverified:** Safari/Firefox, physical phone, screen readers, full accessibility audit, model answer quality and real Ask Daniel streaming acceptance, cost/per-IP limits, all-app relational persistence, and genuine pinned offline EVM execution. A functional demo does not imply an offer or immediate hiring result.

## Release and restore safety

Earlier deployed Worker version IDs before this design update were recorded as:

- Prism UI: `15fb7670-6a9a-4e13-9991-65c81ba3ffe2`
- Five standalone microapps: `a60f1bba-3a12-4b38-855b-ef2d07156d5e`
- Bounded Agent: `f935fa0c-72fe-4818-b6bd-9eead0f407d0`
- HTTP Workbench: `edea1f8d-f8bb-41e8-8e5a-9737735ebee1`

These are identifiers for review, **not proof of a rehearsed rollback**. Any rollback must check the actual active deployment, preserve unrelated newer changes, and use Cloudflare's supported version/route mechanisms. Do not touch D1 data. Do not force-push `main` or merge this stacked draft as ten complete backend services.

## Design grounding

Original authored components, inspired by [shadcn/ui composition](https://ui.shadcn.com/docs), [Radix's distinction between modal and non-modal](https://www.radix-ui.com/primitives/docs/components/dialog), [Motion reduced-motion guidance](https://motion.dev/docs/react-accessibility), and [Apple button hierarchy and touch targets](https://developer.apple.com/design/human-interface-guidelines/buttons). No third-party visual component code or proprietary portfolio template is copied.
