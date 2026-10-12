import {test} from 'node:test';import assert from 'node:assert/strict';
import prism from './worker.mjs';
const get=async path=>prism.fetch(new Request('https://jemueldaniel.website'+path));
test('V14 shirt + Ask Daniel colors and bounded NLP are first-party, no stale gold / gray avatar',async()=>{
 const response=await get('/ui-20261011/chat-widget-v9.js');assert.equal(response.status,200);
 const code=await response.text();assert.doesNotThrow(()=>new Function(code));
 for(const marker of ['--jd-ink1:#101827','--jd-paper:#f5f5f1','JD14_TOPICS','jd14Find','jd14Context','jd14Persist','jd14Restore','JD14_CONTEXT_KEY','jd-clear','sessionStorage.removeItem(JD14_CONTEXT_KEY)','window.AskDaniel={open:openChat,close:closeChat}','img, picture img','filter:none!important'])assert.ok(code.includes(marker),marker);
 assert.match(code,/sourceBacked/);
 assert.match(code,/AI-generated answer/);
 assert.match(code,/DanielWorks public engineering library/);
 assert.doesNotMatch(code,/castractseedprompt|jemueldanieljobs|BEGIN PRIVATE KEY/);
});
test('homepage and /apps/ include real pinned public DanielWorks proof modules with interaction, source and tests',async()=>{
 for(const path of ['/','/apps/']){
  const r=await get(path);assert.equal(r.status,200);const html=await r.text();
  assert.match(html,/id="danielworks"/);assert.match(html,/id="dw14-track"/);assert.match(html,/id="dw14-query"/);
  assert.equal((html.match(/class="dw14-card"/g)||[]).length,8);
  assert.match(html,/d6310035cdec5bf079b80478822efddb08b23fba/);
  for(const file of ['examples/proof_gallery/index.html','examples/technology_atlas/index.html','examples/flow_lab/index.html','examples/data_studio/index.html','examples/interface_lab/index.html','examples/mcp_agent/runtime.mjs','examples/hybrid_search/hybrid.py','examples/atomic_ledger/ledger.py'])assert.ok(html.includes(file),file);
  assert.equal((html.match(/class="dw14-card-links"/g)||[]).length,8);
  assert.match(html,/prefers-reduced-motion:reduce/);
  assert.match(html,/src="\/ui-20261011\/danielworks-v14\.js"/);
  assert.match(html,/src="\/ui-20261011\/chat-widget-v9\.js"/);
 }
 const script=await get('/ui-20261011/danielworks-v14.js');assert.equal(script.status,200);
 assert.match(script.headers.get('content-type'),/javascript/);
 const js=await script.text();assert.doesNotThrow(()=>new Function(js));
});
test('no private sources, no arbitrary outbound API and old worker paths stay scoped',async()=>{
 const home=await(await get('/')).text(),catalog=await(await get('/apps/')).text();
 for(const h of [home,catalog]){assert.doesNotMatch(h,/castractseedprompt|BEGIN PRIVATE KEY|jemueldanieljobs/i);assert.doesNotMatch(h,/<script[^>]+src=["']https?:/i);}
 assert.equal((await get('/apps/pay/')).status,404);
 assert.equal((await get('/apps/live/')).status,404);
 assert.equal((await prism.fetch(new Request('https://jemueldaniel.website/',{method:'POST'}))).status,405);
});
