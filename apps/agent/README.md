# Daniel Agent — bounded, transparent recruiter demo

Live path intended: https://jemueldaniel.website/apps/agent/

This is an **additive deterministic agent** that executes a fixed four-step plan against the existing D1-backed guest API. It is not an LLM planner and never grants browser, wallet, social, payment, custom code or external network tools. The worker hosts static HTML/JS and has **no binding or database of its own**. The server API remains authoritative for session capabilities, input/output quotas, save/run revision and operation-key replay.

## Exact user journey

1. Create or resume an existing HttpOnly guest workspace; no private corpus or identity information is sent.
2. User explicitly prepares one bounded workflow plus one synthetic text source document; separate operation IDs are preserved in browser tab storage to recover retries.
3. User starts a bounded plan: perform a real lexical search for the chosen source document; require a passage hash; execute saved workflow with a pinned operation ID; import its server run output as an artifact document using another pinned key; verify run/document readback and their matching SHA-256 digest. Each step displays server IDs and actual return evidence.
4. Re-run the exact last plan with identical operation IDs (readback/replay), or Run new with fresh operation IDs. No effect occurs automatically when refreshing the page. Saved run/document survive reload until guest expiry/reset; the orchestration trace remains browser-tab-local and cannot claim a durable server-side Agent execution receipt.
5. Delete guest workspace only by explicit confirmation. API checks reject missing session and mismatched origin.

## Honest limits

This is **not** the full integrated Agent architecture or autonomous AI. No durable single atomic Agent record, cancellation fence spanning the orchestration, human authentication, model call, multi-tool free planning, isolated single-document backend search scope or cross-device execution. A failure between run and document import can leave a saved run without a document; retry reuses the same operation IDs to recover, but this is not a database transaction across both effects.

The underlying guest Workform API currently allows text workflows up to eight operations and bounded documents; this frontend uses one three-step workflow. All sample content is fictional/public, not private employer data. The custom-app suite remains unfinished.

## Acceptance

Run source syntax and route behavior checks. Browser acceptance must verify guest session, sample creation, saved workflow, actual search, run and document import, digest-confirmed provenance, last-intent replay, readback after reload, responsive widths, denial without session and cleanup after the test. An HTTP 200 alone does not establish this end-to-end result.
