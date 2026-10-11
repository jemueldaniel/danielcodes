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
