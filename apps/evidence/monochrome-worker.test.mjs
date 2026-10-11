import {test} from 'node:test';
import assert from 'node:assert/strict';
import evidence from './monochrome-worker.mjs';

const origin='https://jemueldaniel.website';
const get=(path,method='GET')=>evidence.fetch(new Request(origin+path,{method}));
test('monochrome evidence page has exactly five proof case studies',async()=>{
 const r=await get('/apps/evidence/');assert.equal(r.status,200);
 const html=await r.text();
 assert.match(html,/id="workform-mono-v3"/);
 assert.match(html,/--accent:#111/);
 assert.equal((html.match(/class="case"/g)||[]).length,5);
 assert.match(html,/href="\/#ask"/);
 assert.match(html,/jemueldaniel\/danielworks/);
 assert.match(html,/href="\/apps\/#workbench"/);
 assert.doesNotMatch(html,/jemueldanieljobs|castractseedprompt|BEGIN PRIVATE KEY/i);
 assert.doesNotMatch(html,/<script[^>]*src="https?:/i);
 for(const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) assert.doesNotThrow(()=>new Function(match[1]));
});
test('read-only, narrow evidence Worker denies mutation and unexpected routes',async()=>{
 const routes=[['/apps/evidence/',200],['/apps/evidence',200],['/apps/evidence/health',200],['/apps/evidence/unknown',404],['/apps/api/health',404]];
 for(const [path,status] of routes)assert.equal((await get(path)).status,status,path);
 assert.equal((await get('/apps/evidence/','POST')).status,405);
 assert.equal((await get('/apps/evidence/','PUT')).status,405);
 const health=await (await get('/apps/evidence/health')).json();
 assert.equal(health.databaseBinding,false);
 assert.equal(health.theme,'monochrome');
});
test('accessible control surfaces retain keyboard-friendly interaction',async()=>{
 const html=await (await get('/apps/evidence/')).text();
 assert.match(html,/id="theme"/);
 assert.match(html,/class="filters"/);
 assert.match(html,/prefers-reduced-motion/);
 assert.match(html,/focus-visible/);
 assert.match(html,/data-filter=/);
});
