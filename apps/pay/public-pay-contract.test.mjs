import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1]||'';
test('public Pay explicitly disclaims real monetary functionality',()=>{
 for(const text of ['zero monetary value','browser tab','No wallet, blockchain','does not connect to a server database'])assert.ok(html.includes(text),text);
 assert.match(html,/<script type="module">/);assert.ok(script.includes("createFictionalLedger(sessionStorage)"));
 assert.ok(!/https?:\/\/[^\s"']+\/api\/pay/i.test(html),'no external API payments');
});
test('form controls and statuses exist once and support tab-scoped replay',()=>{
 for(const id of ['from','to','amount','transfer-form','replay','reset','balance-a','balance-b','history','older','newer','operation-status'])assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
 assert.ok(script.includes("store.transfer(lastIntent)"));assert.ok(script.includes("store.clear()"));
});
test('no untrusted HTML injection or third-party scripts are added',()=>{
 assert.ok(!/\.innerHTML\s*=/.test(html));assert.ok(!/<script[^>]+src="https?:/i.test(html));
 assert.ok(!/jemueldanieljobs|workform-local.sqlite|castractseedprompt/i.test(html));
});
test('links, labels, and keyboard focus styles are present',()=>{
 for(const href of ['/apps/','/apps/evidence/'])assert.ok(html.includes('href="'+href+'"'));
 assert.match(html,/button:focus-visible/);assert.match(html,/prefers-reduced-motion/);
 assert.ok((html.match(/\<label for=/g)||[]).length>=3);
});
