import {test} from 'node:test';
import assert from 'node:assert/strict';
import prism from './worker.mjs';
const h=async()=>await(await prism.fetch(new Request('https://jemueldaniel.website/'))).text();
test('all ten demos have real routes and explicit truthful scope',async()=>{
 const html=await h();
 for(const name of ['Workflow Studio','Knowledge &amp; Evaluation Lab','Daniel Agent','Daniel Social','Daniel Pay','Developer Workbench','Code Lab','Contract Lab','Interface Lab','Project Workspace'])assert.ok(html.includes(name),name);
 for(const route of ['/apps/live/#workflow','/apps/live/#knowledge','/apps/agent/','/apps/social/','/apps/pay/','/apps/workbench/','/apps/code/','/apps/contract/','/apps/interface/','/apps/project/'])assert.ok(html.includes(route),route);
 assert.match(html,/Real offline EVM/);assert.match(html,/Fictional ledger/);assert.match(html,/No real assets/);assert.match(html,/SDK or protocol-level MCP/);
 assert.equal((html.match(/id="jdDemoNavigator"/g)||[]).length,1);
 assert.equal((html.match(/id="jdDemoForm"/g)||[]).length,1);
 assert.equal((html.match(/<option value=/g)||[]).length,10);
});
test('navigator is interactive, accessible and protected from HTML injection',async()=>{
 const html=await h();
 assert.match(html,/<label for="jdDemoSelect">/);
 assert.match(html,/id="jdDemoStatus" role="status" aria-live="polite"/);
 assert.match(html,/event.preventDefault\(\)/);
 assert.match(html,/Object.hasOwn\(data,choice.value\)/);
 assert.match(html,/description.textContent=item.name/);
 assert.match(html,/open.focus\(\{preventScroll:true\}\)/);
 assert.match(html,/source.rel='noopener noreferrer'/);
 assert.doesNotMatch(html,/aria-modal="true"/);
 for(const hit of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
  if(!hit[2].trim()||/application\/ld\+json/.test(hit[1]))continue;
  assert.doesNotThrow(()=>new Function(hit[2]));
 }
});
test('catalog and API remain unchanged by homepage navigator',async()=>{
 const catalog=await(await prism.fetch(new Request('https://jemueldaniel.website/apps/'))).text();
 assert.ok(!catalog.includes('jdDemoNavigator'));
 assert.equal((catalog.match(/class="card"/g)||[]).length,10);
 const bad=await prism.fetch(new Request('https://jemueldaniel.website/apps/api/health'));
 assert.equal(bad.status,404);
});
