import {test} from 'node:test';
import assert from 'node:assert/strict';
import micro from './microapps-worker.mjs';
import prism from './worker.mjs';
const get=async(worker,path,method='GET')=>worker.fetch(new Request('https://jemueldaniel.website'+path,{method}));

test('Contract Lab is genuine offline EthereumJS EVM with distinct accessible UI',async()=>{
 const r=await get(micro,'/apps/contract/');assert.equal(r.status,200);
 const h=await r.text();
 assert.match(h,/EthereumJS EVM 10\.1\.3/);
 assert.match(h,/Prague ruleset/);
 assert.match(h,/data-app="contract"/);
 assert.match(h,/src="\/apps\/contract\/app.js"/);
 for(const id of ['runSelected','runAll','runStatus','bytecode','returnWord','gasUsed','stepsCount','traceList','receipt','copyReceipt','downloadReceipt','verdict'])assert.ok(h.includes('id="'+id+'"'),id);
 assert.equal((h.match(/data-case="/g)||[]).length,4);
 assert.match(h,/No deployed contract, blockchain state, Solidity compiler/);
 assert.match(h,/src="\/ui-20261011\/chat-widget-v9.js"/);
 assert.match(h,/portrait.jpg/);
 assert.doesNotMatch(h,/aria-modal="true"/);
});
test('exact browser bundle is served only through allowlisted independent contract asset route',async()=>{
 const r=await get(micro,'/apps/contract/app.js');assert.equal(r.status,200);
 assert.match(r.headers.get('content-type'),/application\/javascript/);
 const s=await r.text();assert.ok(s.length>180000,'real bundled EVM module expected');
 assert.ok(s.includes('UNAPPROVED_EVM_SCENARIO'));
 for(const bad of ['/apps/contract/app.js/evil','/apps/contract/admin','/apps/contract/metadata'])assert.equal((await get(micro,bad)).status,404);
 assert.equal((await get(micro,'/apps/contract/', 'POST')).status,405);
 const head=await get(micro,'/apps/contract/','HEAD');assert.equal(head.status,200);assert.equal((await head.text()).length,0);
});
test('homepage app showcase and Ask Daniel report only the newly qualified bounded offline scope',async()=>{
 const home=await(await get(prism,'/')).text();
 const cat=await(await get(prism,'/apps/')).text();
 const popup=await(await get(prism,'/ui-20261011/chat-widget-v9.js')).text();
 assert.match(home,/Contract Lab\. Four real offline EVM scenarios/);
 assert.match(home,/four allowlisted raw bytecode scenarios/);
 assert.match(home,/EthereumJS EVM 10\.1\.3/);
 assert.match(cat,/data-stage="local"/);
 assert.match(cat,/Executable offline EVM/);
 assert.equal((cat.match(/class="card" data-stage="local"/g)||[]).length,6);
 assert.equal((cat.match(/class="card" data-stage="pending"/g)||[]).length,0);
 assert.match(popup,/Contract Lab now executes four actual allowlisted offline bytecode scenarios/);
 assert.doesNotMatch(home,/offline EVM still unqualified/);
 assert.doesNotMatch(cat,/Runtime qualification is pending/);
});
