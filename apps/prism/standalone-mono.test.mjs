import { test } from 'node:test';
import assert from 'node:assert/strict';
import agent from '../agent/worker.mjs';
import workbench from '../workbench/worker.mjs';

const root='https://jemueldaniel.website';
const get=(module,path,method='GET')=>module.fetch(new Request(root+path,{method}));
for(const [name,worker,base] of [['Agent',agent,'/apps/agent'],['Developer Workbench',workbench,'/apps/workbench']]){
 test(name+' monochrome page preserves exact route and truthful scope',async()=>{
   const page=await get(worker,base+'/');assert.equal(page.status,200);
   const html=await page.text();
   assert.match(html,/id="workform-mono-v3"/);
   assert.match(html,/href="\/#ask"/);
   assert.match(html,/--accent:#111/);
   assert.doesNotMatch(html,/<script[^>]*src="https?:\/\//i);
   assert.doesNotMatch(html,/aria-modal="true"/);
 });
 test(name+' original application JS and health route still serve',async()=>{
   const js=await get(worker,base+'/client.js');
   const path=js.status===200?base+'/client.js':base+'/app.js';
   const script=await get(worker,path);assert.equal(script.status,200);
   assert.match(script.headers.get('content-type'),/javascript/i);
   assert.doesNotThrow(()=>new Function(await script.text()));
   const health=await get(worker,base+'/health');assert.equal(health.status,200);
   assert.equal((await health.json()).ok,true);
 });
 test(name+' unknown paths and unsupported mutation methods reject',async()=>{
   assert.equal((await get(worker,base+'/invalid')).status,404);
   assert.equal((await get(worker,base+'/','POST')).status,405);
 });
}
