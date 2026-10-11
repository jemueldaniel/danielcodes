import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from './extra-worker.mjs';
const root='https://jemueldaniel.website';
const get=(path,method='GET')=>worker.fetch(new Request(root+path,{method}));
for(const [name,paths] of Object.entries({
 studio:['/apps/live/','/apps/mono-studio/'],
 pay:['/apps/pay/','/apps/mono-pay/']
})){
 test(name+' intended and staged pages share the same client-visible design',async()=>{
   const a=await get(paths[0]),b=await get(paths[1]);
   assert.equal(a.status,200);assert.equal(b.status,200);
   assert.equal(await a.text(),await b.text());
   const page=await get(paths[0]),html=await page.text();
   assert.match(html,/id="workform-mono-v3"/);
   assert.match(html,/href="\/#ask"/);
   assert.doesNotMatch(html,/aria-modal="true"/);
   assert.doesNotMatch(html,/<script[^>]+src="https?:/i);
 });
 test(name+' imported code is real and public; unknown methods and routes deny',async()=>{
   const part=name==='studio'?'app.js':'ledger.mjs';
   const script=await get(paths[0]+part);assert.equal(script.status,200);
   const content=await script.text();assert.ok(content.length>2000);
   if(name==='studio'){assert.match(content,/\/apps\/api/);assert.doesNotThrow(()=>new Function(content));}
   else {assert.match(content,/const INITIAL=1000/);assert.match(content,/export \{/);}
   assert.equal((await get(paths[0]+'unknown')).status,404);
   assert.equal((await get(paths[0],'POST')).status,405);
 });
}
test('no duplicate routes or financial claims from presentation Worker',async()=>{
 const p=await get('/apps/pay/');const html=await p.text();
 assert.match(html,/zero monetary value/);
 assert.match(html,/no wallet/i);
 const r=await get('/apps/api/health');assert.equal(r.status,404);
});
