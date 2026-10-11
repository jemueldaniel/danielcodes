import {test} from 'node:test';
import assert from 'node:assert/strict';
import agent from '../agent/worker.mjs';
import workbench from '../workbench/worker.mjs';
const request=path=>new Request('https://jemueldaniel.website'+path);
test('dark Agent UI renders evidence-driven execution stages and retains APIs',async()=>{
 const html=await(await agent.fetch(request('/apps/agent/'))).text();
 for(const id of ['agentCurrentLabel','agent-visual-steps','agent-dark-cockpit'])assert.ok(html.includes(id),id);
 assert.equal((html.match(/data-agent-step="/g)||[]).length,4);
 assert.match(html,/class="agent-ask-circle" href="\/#ask"/);
 assert.match(html,/color-scheme:dark!important/);
 const js=await(await agent.fetch(request('/apps/agent/client.js'))).text();
 assert.match(js,/function updateAgentVisual/);
 assert.match(js,/'verify':4/);
 assert.match(js,/sourceRunId/);
 assert.doesNotThrow(()=>new Function(js));
});
test('dark Developer Workbench shows real HTTP trace instead of only raw JSON',async()=>{
 const html=await(await workbench.fetch(request('/apps/workbench/'))).text();
 for(const id of ['wb-live-strip','wbRequestCount','wbLatestMethod','wbLatestStatus','wbRecent','workbench-dark-stage'])assert.ok(html.includes(id),id);
 assert.match(html,/class="wb-ask-circle" href="\/#ask"/);
 assert.match(html,/color-scheme:dark!important/);
 const js=await(await workbench.fetch(request('/apps/workbench/client.js'))).text();
 assert.match(js,/function drawLiveSummary/);
 assert.match(js,/drawLiveSummary\(name,r.method,r.path,response.status,json\)/);
 assert.doesNotThrow(()=>new Function(js));
});
