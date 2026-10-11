import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('./index.html',import.meta.url),'utf8');
test('wallet source is truly dark by default but retains optional light theme',()=>{
 assert.match(page,/<html lang="en" data-theme="dark">/);
 assert.match(page,/id="wallet-dark-prototype"/);
 assert.match(page,/color-scheme:dark/);
 assert.match(page,/localStorage.getItem\('danielcodes-theme'\)/);
 assert.match(page,/class="wallet-ask-fab" href="\/#ask"/);
});
test('wallet has real readable activity views instead of only JSON',()=>{
 for(const id of ['walletHeroBalance','walletA','walletB','walletIntegrity','walletActivity','walletReceipt','walletTransferPreview','transfer-form','history','result','balance-a','balance-b','supply','reset','replay']){
  assert.match(page,new RegExp('id="'+id+'"'),id);
 }
 assert.match(page,/Saved test-transfer history/);
 assert.match(page,/Inspect raw ledger entries/);
 assert.match(page,/Replay last transfer/);
 assert.match(page,/role="status"/);
 assert.match(page,/replaceChildren\(\)/);
 assert.match(page,/function updateWalletPreview/);
});
test('wallet retains original bounded fictional transfer engine and disclosure',()=>{
 assert.match(page,/createFictionalLedger/);
 assert.match(page,/store\.transfer\(payload\)/);
 assert.match(page,/store\.transfer\(lastIntent\)/);
 assert.match(page,/Total fictional supply/);
 assert.match(page,/zero monetary value/);
 assert.match(page,/does not connect to a server database/);
 assert.doesNotMatch(page,/wallet\.connect|window\.ethereum|eth_sendTransaction/);
 assert.doesNotMatch(page,/<script[^>]*src="https?:/i);
 const module=page.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
 assert.ok(module,'module code available');
 const imported=module.replace(/^import \{[^}]+\} from '\.\/ledger\.mjs';/m,'');
 assert.doesNotThrow(()=>new Function(imported));
});
