import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const read=(f)=>readFileSync(new URL(f,import.meta.url),'utf8');
const worker=(await import(new URL('worker.mjs?v18-node',import.meta.url))).default;
const req=(path,method='GET')=>worker.fetch(new Request('https://workform.invalid'+path,{method}));
test('V18 Agent HTML/CSS/JS is exact reproducible source',()=>{
 const result=execFileSync(process.execPath,[fileURLToPath(new URL('build-cockpit-v18.cjs',import.meta.url)),'--check'],{encoding:'utf8'});
 assert.match(result,/PASS V18 exact compiled/);
});
test('dedicated Agent cockpit exposes meaningful controls, real tool graph and no blocked overlay',async()=>{
 const r=await req('/apps/agent/');assert.equal(r.status,200);
 const html=await r.text();
 for(const id of ['agentV18Root','av18Connect','av18Seed','av18Execute','av18Retry','av18Readback','av18Reset',
  'av18Question','av18EventList','av18ProgressLabel','av18RunId','av18ArtifactId','av18Hash','av18Export',
  'agentV18Advanced','agentInspector','trace','execute','retry','reset','copy']){
  assert.match(html,new RegExp('id="'+id+'"'),id);
 }
 assert.match(html,/aria-label="Four-step evidence carrying operation graph"/);
 assert.match(html,/prefers-reduced-motion:reduce/);
 assert.match(html,/chat-widget-v9\.js/);
 assert.doesNotMatch(read('cockpit-v18.html'),/<dialog|aria-modal="true"|class="modal-overlay"/);
 assert.equal((html.match(/id="agentV18Root"/g)||[]).length,1);
});
test('served app client keeps four genuine D1 operations, stable replay and does not invoke browser confirm',async()=>{
 const r=await req('/apps/agent/client.js');assert.equal(r.status,200);
 const source=await r.text();
 for(const token of ["API='/apps/api/'","runs","documents","workflows","search?q=","crypto.randomUUID",
  "sourceRunId","operationId","crypto.subtle.digest('SHA-256'","'x-workform-csrf'","__AGENT_V18_RESET_CONFIRMED__"]){
   assert.ok(source.includes(token),token);
 }
 assert.doesNotMatch(source,/\bconfirm\s*\(/);
 assert.doesNotMatch(source,/window\.location\.replace/);
});
test('cockpit reads observed strict server events without invented results and exports bounded record',async()=>{
 const r=await req('/apps/agent/cockpit.js');assert.equal(r.status,200);
 const js=await r.text();
 for(const tok of ["MutationObserver","verifiedReadback:true","atomicAgentReceipt:false",
  "contentSha256","passageSha256","sourceRunId","kind==='server_readback'",
  "document.createElement('li')","URL.createObjectURL","query","av18Export","av18Reset"]){
   assert.ok(js.includes(tok),tok);
 }
 assert.doesNotMatch(js,/\bfetch\s*\(|new WebSocket|XMLHttpRequest/);
 assert.match(js,/data:|Blob|application\/json/);
});
test('existing V7 visible inspector remains exact and no unknown methods admit',async()=>{
 const page=await(await req('/apps/agent/')).text();
 assert.match(page,/class="agent-inspector"/);
 assert.match(page,/<ol class="agent-inspector-ledger"/);
 assert.match(page,/id="agentV18Advanced"/);
 assert.equal((await req('/apps/agent/','POST')).status,405);
 assert.equal((await req('/apps/agent/arbitrary')).status,404);
 assert.match((await(await req('/apps/agent/health')).json()).mode,/bounded-http-orchestrator/);
});
test('first-party content policy and CSS accessibility are preserved',async()=>{
 const p=await req('/apps/agent/'),s=await req('/apps/agent/cockpit.js');
 assert.match(p.headers.get('content-security-policy')??'',/default-src 'none'/);
 assert.match(p.headers.get('content-security-policy')??'',/connect-src 'self'/);
 assert.match(s.headers.get('content-type')??'',/application\/javascript/);
 const css=read('cockpit-v18.css');
 assert.match(css,/\@media\(max-width:700px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.doesNotMatch(css,/position:\s*fixed|@import|backdrop-filter/);
});
