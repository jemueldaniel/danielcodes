# Daniel Developer Workbench — live HTTP inspector

This isolated, additive Worker uses no database bindings, secrets, credentials, SDK or MCP server. It is a browser client of the existing **same-origin** `/apps/api/*` guest sandbox and never accepts user-provided URLs or authorization headers. The upstream API remains the authority for session ownership, revisions, quotas and replay. Browser responses are displayed as data, using textContent, never HTML.

## Current scope

- Start or resume an anonymous guest workspace with the existing HttpOnly session cookie.
- Save and list bounded sample workflows, run and read server-persisted outcomes, import a run artifact, lexical-search persisted documents, evaluate an expected top hit and read the saved evaluation history.
- Replay the exact prior mutation operation ID by an explicit user action. Request/response display excludes credentials and Set-Cookie. Distinguish HTTP error from unknown transport result.
- Responsive, keyboard-friendly accessible layout; no third-party scripts, no cross-origin fetches, restrictive CSP, and no automatic data creation.

## Evidence boundary

This is a **real HTTP client**, not a packaged SDK, MCP protocol implementation, or evidence that the other Workform apps are complete. It creates no own backing store; durability depends on the separate D1 guest Worker. The existing guest workspace expires in 24 hours, and only non-sensitive sample data belongs here. The original portfolio and existing Workers are untouched by this new source.

## Manual acceptance

At the intended route `https://jemueldaniel.website/apps/workbench/`: (1) inspect health, (2) create/resume guest, (3) save workflow, (4) run, (5) inspect runs, (6) import output as a Knowledge document, (7) search, (8) evaluate and reload evaluation history, (9) replay exact prior mutation to verify one saved effect, (10) reload and read again, (11) verify 320/390/768/1440 layouts and keyboard focus. None of these checks is claimed passed merely because source exists.
