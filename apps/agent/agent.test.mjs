import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from './worker.mjs';
const source=readFileSync(new URL('./worker.mjs',import.meta.url),'utf8');
const between=(left,right)=>source.split(left)[1]?.split(right)[0]?.replace(/;\s*$/,'');
const html=JSON.parse(between('const HTML=','\nconst CLIENT='));
const js=JSON.parse(between('const CLIENT=','\nconst HEADERS='));
const get=(path,method='GET')=>worker.fetch(new Request('https://jemueldaniel.website'+path,{method}));
test('live Agent UI and script return correct content',async()=>{
 const h=await get('/apps/agent/');
 assert.equal(h.status,200);assert.match(h.headers.get('content-type'),/text\/html/);assert.match(await h.text(),/Watch a bounded agent execute real tools/);
 const j=await get('/apps/agent/client.js');
 assert.equal(j.status,200);assert.match(j.headers.get('content-type'),/javascript/);assert.match(await j.text(),/sourceDocId/);
});
test('health honestly discloses shared D1, no atomic agent receipt',async()=>{
 const r=await get('/apps/agent/health');assert.equal(r.status,200);
 const obj=await r.json();assert.equal(obj.sharedGuestApi,true);assert.equal(obj.ownDatabaseBinding,false);assert.equal(obj.atomicAgentReceipt,false);
});
test('unknown endpoints fail closed and writes are unsupported',async()=>{
 assert.equal((await get('/apps/agent/undefined')).status,404);
 assert.equal((await get('/apps/agent/','POST')).status,405);
});
test('bounded fixed tools, transparent evidence and cleanup are present',()=>{
 new Function(js);
 assert.match(js,/session\|reset\|workflows/);
 assert.match(js,/sourceRunId/);
 assert.match(js,/ARTIFACT_SHA256_MISMATCH/);
 assert.match(js,/confirm\(/); // reset confirmation is explicit
 assert.ok(js.includes('DELETE MY GUEST WORKSPACE'));
 assert.ok(!/fetch\(\s*['"]https?:\/\//.test(js));
 assert.ok(!/<script[^>]+src=['"]https?:\/\//.test(html));
 assert.match(html,/The orchestration trace is temporary in this browser tab/);
});
test('HTML document ID uniqueness and controls',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);
 for(const key of ['connect','seed','query','execute','retry','readback','reset','status','ids','trace','proof','copy'])assert.ok(ids.includes(key),key);
 assert.match(html,/@media\(max-width:660px\)/);
 assert.match(html,/prefers-reduced-motion/);
});
