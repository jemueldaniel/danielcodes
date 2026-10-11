import {test} from 'node:test';
import assert from 'node:assert/strict';
import prism from './worker.mjs';
import microapps from './microapps-worker.mjs';

const origin='https://jemueldaniel.website';
const html=async(worker,path)=>{const res=await worker.fetch(new Request(origin+path));assert.equal(res.status,200,path);return res.text()};
const ids=s=>[...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const match=(s,pattern,msg)=>assert.match(s,pattern,msg);

test('assistant is inline, navigable, and never a blocking overlay',async()=>{
 const home=await html(prism,'/');
 match(home,/<section class="mono-assistant" id="ask"/);
 match(home,/id="chatPanel" role="region"/);
 assert.doesNotMatch(home,/aria-modal="true"/);
 assert.doesNotMatch(home,/id="chatPanel" role="dialog"/);
 match(home,/\.chat-fab\{display:none!important/);
 match(home,/\.chat-panel\{position:relative!important/);
 match(home,/function openJDChat\(\)/);
 match(home,/class="chat-panel open"/);
 match(home,/aria-controls="chatPanel"/);
 assert.equal(ids(home).length,new Set(ids(home)).size,'unique IDs');
});

test('recruiter actions are real destinations and private materials do not leak',async()=>{
 const home=await html(prism,'/');
 for(const fragment of ['href="/resume"','href="/cover-letter"','href="/apps/"','href="/apps/agent/"','href="/apps/workbench/"','github.com/jemueldaniel/danielworks'])assert.ok(home.includes(fragment),fragment);
 match(home,/<button class="btn mono-main-ask"/);
 assert.equal((home.match(/class="cap case-study"/g)||[]).length,5);
 assert.doesNotMatch(home,/jemueldanieljobs|castractseedprompt|BEGIN PRIVATE KEY/i);
 assert.doesNotMatch(home,/<script[^>]*src="https?:/i);
});

test('source keeps no orphaned or syntactically broken inline scripts',async()=>{
 const home=await html(prism,'/');
 for(const m of home.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
  if(/application\/ld\+json/.test(m[1])||!m[2].trim())continue;
  assert.doesNotThrow(()=>new Function(m[2]));
 }
});

test('monochrome catalog maintains ten independently identified apps',async()=>{
 const catalog=await html(prism,'/apps/');
 match(catalog,/id="workform-mono-v3"/);
 match(catalog,/--bg:#fff/);
 match(catalog,/--fg:#111/);
 assert.equal((catalog.match(/class="card" data-stage/g)||[]).length,10);
 assert.equal((catalog.match(/class="app-art /g)||[]).length,10);
 for(const path of ['/apps/agent/','/apps/live/#workflow','/apps/workbench/','/apps/code/','/apps/project/','/apps/interface/','/apps/social/','/apps/contract/','/apps/pay/'])assert.ok(catalog.includes(path),path);
 assert.equal(ids(catalog).length,new Set(ids(catalog)).size);
});

test('five microapps use grayscale and Interface Lab has inline focus panel, no modal',async()=>{
 for(const slug of ['code','project','interface','social','contract']){
  const page=await html(microapps,'/apps/'+slug+'/');
  match(page,/id="workform-mono-v3"/);
  match(page,/<a class="ask" href="\/\#ask">Ask Daniel/);
  match(page,/position:relative!important/);
  match(page,/prefers-reduced-motion/);
  assert.doesNotMatch(page,/<script[^>]*src="https?:/i);
 }
 const ui=await html(microapps,'/apps/interface/');
 match(ui,/role="region" hidden/);
 assert.doesNotMatch(ui,/<dialog\b/);
 const js=await html(microapps,'/apps/interface/app.js');
 match(js,/inline_panel/);
 assert.doesNotMatch(js,/showModal\(/);
 assert.doesNotThrow(()=>new Function(js));
});
