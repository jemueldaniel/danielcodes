import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const worker=(await import(new URL('microapps-worker.mjs?v17',import.meta.url))).default;
const req=(path,method='GET')=>worker.fetch(new Request('https://workform.invalid'+path,{method}));
test('V17 Interface Lab compiled bytes match independent authored HTML CSS JS',()=>{
 assert.match(execFileSync(process.execPath,[fileURLToPath(new URL('build-interface-v17.cjs',import.meta.url)),'--check'],{encoding:'utf8'}),/PASS exact V17 generator/);
});
test('new professional UI has real responsive device stage, scoped inspector, no blocking modal',async()=>{
 const r=await req('/apps/interface/');assert.equal(r.status,200);
 const html=await r.text();
 for(const id of ['v17Heading','v17Device','v17TabPanel','v17TabOverview','v17TabSystems','v17TabActivity',
  'v17Measure','v17Export','v17Reset','v17Targets','v17Rendered','v17Run','v17Save','v17ProgressFill','v17Status']){
  assert.match(html,new RegExp('id="'+id+'"'),id)
 }
 assert.match(html,/interface-v17-style/);
 assert.match(html,/role="tablist"/);assert.match(html,/role="tabpanel"/);
 assert.match(html,/prefers-reduced-motion:reduce/);
 assert.doesNotMatch(read('interface-v17-panel.html'),/<dialog|aria-modal="true"|class="modal-overlay"/);
 assert.match(html,/chat-widget-v9\.js/);
});
test('real state, keyboard tabs, measured tap targets, bounded export and reset exist in served JS',async()=>{
 const r=await req('/apps/interface/app.js');assert.equal(r.status,200);
 const code=await r.text();
 for(const feature of ['ResizeObserver','getBoundingClientRect','sessionStorage','ArrowRight','ArrowLeft','Home','End',
 'aria-selected','v17Export','URL.createObjectURL','personalInputExcluded:true','categoriesExplored',
 'v17Reset','v17ProgressLabel','prefers-reduced-motion','interface_v17']) assert.ok(code.includes(feature),feature);
 assert.match(code,/v17Reset\W/);
 assert.match(code,/document\.querySelector\('\.comp-preview'\)\.style\.filter/);
 assert.doesNotMatch(code,/window\.location\.replace|XMLHttpRequest|new WebSocket/);
});
test('existing original Interface Lab control source and semantics survive',async()=>{
 const code=await(await req('/apps/interface/app.js')).text(),page=await(await req('/apps/interface/')).text();
 for(const old of ['uiOutput','uiStatus','validatedText','toggle','contrast','showDialog','sampleDialog','disclosure']){
  assert.ok(code.includes(old)||page.includes(old),'missing original '+old);
 }
 assert.match(page,/role="region" hidden/);
});
test('other Social and real offline EVM app bundles remain intact',async()=>{
 const social=await req('/apps/social/'),contract=await req('/apps/contract/'),contractJs=await req('/apps/contract/app.js');
 assert.equal(social.status,200);assert.equal(contract.status,200);assert.equal(contractJs.status,200);
 assert.match(await social.text(),/socialV15Title/);
 assert.ok((await contractJs.text()).length>200000,'Genuine EVM bundle remains pinned');
});
test('router content type, security headers and mutation denial remain unchanged',async()=>{
 const page=await req('/apps/interface/'),js=await req('/apps/interface/app.js');
 assert.match(page.headers.get('content-security-policy')??'',/default-src 'self'/);
 assert.match(js.headers.get('content-type')??'',/application\/javascript/);
 assert.equal((await req('/apps/interface/','POST')).status,405);
 assert.equal((await req('/apps/interface/not-a-route')).status,404);
 assert.ok([404,405].includes((await req('/apps/pay/','POST')).status),'Pay mutation remains denied');
});
