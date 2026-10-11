import {test} from 'node:test';import assert from 'node:assert/strict';
import prism from './worker.mjs';import micro from './microapps-worker.mjs';import agent from '../agent/worker.mjs';import wb from '../workbench/worker.mjs';import evidence from '../evidence/monochrome-worker.mjs';
const req=p=>new Request('https://jemueldaniel.website'+p);
const invoke=async(worker,path)=>worker.fetch(req(path));
const scriptPath='/ui-20261011/chat-widget-v9.js';
test('v9 standalone first-party JS serves one cross-app chat experience with full-color portrait',async()=>{
 const response=await invoke(prism,scriptPath);assert.equal(response.status,200);
 assert.match(response.headers.get('content-type'),/application\/javascript/);
 const source=await response.text();assert.doesNotThrow(()=>new Function(source));
 for(const t of ['img, picture img','filter:none!important','window.openJDChat=openChat','window.closeJDChat=closeChat','/api/chat/stream','aria-modal="false"','aria-expanded="false"','/assets/portrait.jpg','parseFrames','role="log"','prefers-reduced-motion:reduce','@media print']){
  assert.ok(source.includes(t),t);
 }
 assert.doesNotMatch(source,/BEGIN PRIVATE KEY|jemueldanieljobs\.txt|castractseedprompt/i);
});
test('homepage and catalog use same popup without shipping permanent embedded chat',async()=>{
 for(const path of ['/','/apps/']){
  const response=await invoke(prism,path);assert.equal(response.status,200);
  const text=await response.text();assert.match(text,/<script src="\/ui-20261011\/chat-widget-v9\.js" defer><\/script>/);
  assert.equal((text.match(/chat-widget-v9\.js/g)||[]).length,1);
 }
});
test('all independently managed public app pages include shared popup script and keep API routes',async()=>{
 const entries=[[agent,'/apps/agent/'],[wb,'/apps/workbench/'],[evidence,'/apps/evidence/'],...['code','social','project','interface','contract'].map(slug=>[micro,'/apps/'+slug+'/'])];
 for(const [worker,path] of entries){
  const response=await invoke(worker,path);assert.equal(response.status,200,path);
  const html=await response.text();assert.ok(html.includes('src="/ui-20261011/chat-widget-v9.js"'),path);
  assert.ok(html.includes('/#ask'),path);
  assert.ok(html.includes('portrait.jpg'),path);
 }
 const api=await invoke(agent,'/apps/agent/client.js');assert.equal(api.status,200);
 const api2=await invoke(wb,'/apps/workbench/client.js');assert.equal(api2.status,200);
 assert.match((await invoke(evidence,'/apps/evidence/')).headers.get('content-security-policy'),/connect-src 'self'/);
});
