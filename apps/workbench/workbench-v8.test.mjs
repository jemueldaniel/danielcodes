import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.mjs';
const get=async path=>worker.fetch(new Request('https://jemueldaniel.website'+path));

test('Workbench V8 renders genuine HTTP JSON explorer and bounded inspectable paths',async()=>{
 const response=await get('/apps/workbench/');
 assert.equal(response.status,200);
 const html=await response.text();
 for(const id of ['wbExplorer','wbExplorerTitle','wbExplorerState','wbExplorerMethod','wbExplorerRoute','wbExplorerLatency','wbExplorerFields','wbExplorerFilter','wbExplorerRows','wbExplorerClear']){
  assert.ok(html.includes('id="'+id+'"'),id);
 }
 assert.match(html,/src="\/apps\/workbench\/explorer.js"/);
 assert.match(html,/SDK and MCP remain unimplemented/);
 assert.match(html,/prefers-reduced-motion:reduce/);
 assert.doesNotMatch(html,/aria-modal="true"/);
 const route=await get('/apps/workbench/explorer.js');
 assert.equal(route.status,200);
 assert.match(route.headers.get('content-type'),/javascript/);
 const source=await route.text();
 assert.doesNotThrow(()=>new Function(source));
 for(const marker of ['MutationObserver(schedule)','JSON.parse(output.textContent)','data.replayed===true','navigator.clipboard.writeText(row.path)','refs.rows.replaceChildren()']){
  assert.ok(source.includes(marker),marker);
 }
});
test('existing Workbench HTTP client and known route security remain intact',async()=>{
 const client=await get('/apps/workbench/client.js');
 assert.equal(client.status,200);
 const js=await client.text();
 assert.match(js,/lastMutation=structuredClone/);
 assert.match(js,/same-origin/);
 const health=await get('/apps/workbench/health');
 assert.equal(health.status,200);
 assert.equal((await get('/apps/workbench/not-allowed')).status,404);
 const reject=await worker.fetch(new Request('https://jemueldaniel.website/apps/workbench/',{method:'POST'}));
 assert.equal(reject.status,405);
});
