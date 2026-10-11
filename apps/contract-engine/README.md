# Daniel Contract Lab V10 — Executable Offline EVM

**Status:** The approved four bounded raw-bytecode scenarios were executed under the pinned EthereumJS EVM 10.1.3 library with Mainnet Prague rules, using a fresh isolated in-memory EVM per invocation. This is a genuine bytecode interpreter, **not** a hand-written calculation, client-side animation, synthetic blockchain result, or deployed Solidity contract.

## Genuine capabilities
- Four **allowlisted** bytecode programs; arbitrary scripts and untrusted bytecode are rejected before EVM instantiation.
- **Arithmetic:** `0x600760060260005260206000f3` returns 256-bit word `42`; 26 gas; 8 observed opcodes.
- **Guarded failure:** `0x60006000fd` triggers real `REVERT`; 6 gas.
- **Conditional:** `0x60001560005260206000f3` returns 256-bit word `1`; 21 gas.
- **Resource admission:** a 5-gas limit triggers genuine out-of-gas; 5 gas.
- UI displays actual returned gas, opcode steps, successful and expected-failure verdicts, branch labels, and copyable/downloadable SHA-256 receipts. Each run is a fresh in-memory EVM with no persistence outside the optional downloaded JSON.

## Safe qualification limits

The scenarios qualify **only** this constrained raw-bytecode subsystem. No Solidity compiler, formal contract security audit, multi-contract state manager, property fuzzing, signed transaction, testnet/mainnet transaction, token transfer, wallet, RPC provider, KZG precompile execution or financial service is implied. All demo inputs are static (max 14 bytes) with a maximum 100,000 gas and 48 displayed opcode events. Running all four requires an explicit click and is sequential.

The EVM implements official Ethereum opcode semantics through `@ethereumjs/evm`, but the tests do not establish correctness of every opcode, EIP or fork-specific feature. The client runs in the browser, not a remote server, and cannot transfer funds.

## Reproduce
```sh
cd apps/contract-engine
npm ci --ignore-scripts
node --test engine.test.mjs
node build.mjs
node browser.cjs # Requires installed browser; use PLAYWRIGHT_EXECUTABLE to point at Edge/Chromium if needed
```

Browser acceptance runs real Microsoft Edge (Playwright Core) at 320, 390, 768, 1440, exercises all four real bytecode scenarios, bytecode/gas/trace/receipt, full-color Ask Daniel, focus/Escape, overflow and zero external network/RPC. The checked-in `bundle.js` must be reproducible from the checked-in package lock, `engine.mjs` and `client.mjs`. Existing shared Cloudflare routing serves it from `/apps/contract/app.js` with the current Worker, no additional Worker or DNS route.

## Open-source dependencies and license boundary

`@ethereumjs/evm@10.1.3` and `@ethereumjs/util@10.1.3` use **MPL-2.0**; `@ethereumjs/common@10.1.3` and `esbuild@0.25.12` use **MIT**. We have not modified upstream source. The exact npm-resolved dependency graph and integrity metadata are pinned in `package-lock.json`. The MPL-2.0 license text is provided in `LICENSES/MPL-2.0.txt`; source form of dependencies is publicly obtainable at the pinned npm packages. The browser bundle is a compiled artifact, not a proprietary replacement for those library source files.

This original portfolio demonstration exposes only fictional, non-financial computation, and remains distinct from any private startup/codebase or user secrets.

## Public release verification — October 12, 2026 (Asia/Manila)

The existing Cloudflare Workers were updated only after exact-source SHA-1 admission against their current live content and their empty binding / `2026-10-11` compatibility setting. Both deploy at **100%** and post-deployment source download matches the reviewed GitHub bytes:

| Existing Worker | Old Git SHA-1 | New Git SHA-1 | Deployment / Version |
| --- | --- | --- | --- |
| `jemuel-workform-microapps-v2` | `d399f4156993e39eaa1ca5ea6f808cc40cade055` | `965506fa9f3a8c9bb0f82ede8c6e25dcc001ef1d` | `8d4056a6-8061-4ae1-b802-bbb247cf935c` / `b7fb425c-f3e9-4a53-8bd8-4f9a829843bc` |
| `jemuel-workform-prism-v2` | `2a93cbc17bbcfb79324a9ee80a92b88220c3dada` | `219a42b60fc405f22e728c77802c49f375a8421f` | `e3b824d3-7f18-4901-bb4d-a52632d19bc0` / `2560b51c-3ecc-4650-b45d-d97fc14c49eb` |

- **87/87 local Node regressions** passed, including approved EthereumJS raw bytecode and qualified route/copy evidence tests.
- **66/66 local Microsoft Edge** browser checks passed at 320/390/768/1440, exercising the real bundled library rather than mocked outputs.
- **66/66 actual public HTTPS Microsoft Edge** checks passed against `https://jemueldaniel.website/apps/contract/` across 320/390/768/1440; verified gas, return data, four-case run, trace, SHA-256 receipt, full-color original portrait, and interactive nonmodal Ask Daniel with keyboard Escape. No uncaught JavaScript errors or unexpected EVM RPC were observed.
- The host platform injected **4 Cloudflare Web Analytics beacon requests** to `static.cloudflareinsights.com` during the public checks. These are not EVM RPCs and were explicitly counted rather than misrepresented as zero external requests.
- The bounded browser bundle is reproducible byte-for-byte (SHA-256 `29ebd94604692f912a652417d0c601d98e23dd7d249ada375bd61ef8aba8629d`). Runtime code is pinned to EthereumJS EVM v10.1.3; the test runner uses pinned Playwright Core 1.64.0 with optional `PLAYWRIGHT_EXECUTABLE`. For public HTTPS replay, set `WORKFORM_LIVE_ORIGIN=https://jemueldaniel.website`; the runner rejects unknown remote origins.

The separate previously held Studio/Pay presentation Workers were not modified or bypassed. Genuine Solidity contract compilation, full multi-contract EVM state, third-party security audit and real blockchain transactions are **not** claimed.
