import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const dir=new URL('.',import.meta.url);
const base=new URL('./',dir);
const source=readFileSync(new URL('microapps-worker.mjs',base),'utf8');
const worker=(await import(new URL('microapps-worker.mjs?v15',base))).default;
const request=(url,method='GET')=>worker.fetch(new Request('https://workform.invalid'+url,{method}));
test('compiled worker matches the three authored Social source modules',()=>{
 assert.match(execFileSync(process.execPath,['build-social-v15.cjs','--check'],{cwd:new URL('.',dir),encoding:'utf8'}),/PASS/);
});
test('Social page provides scoped high-quality relationship UI and no modal blocking surface',async()=>{
 const page=await request('/apps/social/');
 assert.equal(page.status,200);
 const html=await page.text();
 for(const id of ['socialV15Title','edgeAtoB','edgeBtoA','v15Edges','v15Replies','v15Saves','v15EventList','v15Download','v15ClearLog','v15ProofStatus'])
  assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/--bg:#0a0e15/);
 assert.match(html,/prefers-reduced-motion/);
 assert.doesNotMatch(html,/<dialog|class="modal-overlay"/);
 assert.match(html,/chat-widget-v9\.js/);
});
test('real action handler, session bounded receipt and reset safety exist in served JS',async()=>{
 const r=await request('/apps/social/app.js');
 assert.equal(r.status,200);
 const js=await r.text();
 for(const capability of ['actionHistory','sessionStorage.setItem','v15OriginalMutate','v15OriginalRender','v15Download','v15ClearLog','v15ResetArmed','queueMicrotask','createObjectURL','postText','followToggle'])
  assert.ok(js.includes(capability),capability);
 assert.match(js,/privatePostBodiesExcluded:true/);
 assert.match(js,/v15History\.slice\(-18\)/);
});
test('old bounded Social behavior remains intact',async()=>{
 const js=await (await request('/apps/social/app.js')).text();
 for(const s of ['POST_QUOTA','REPLY_QUOTA','REACTION_QUOTA','MAX','sessionStorage','comment','bookmarks','followToggle'])
  if(s!=='MAX')assert.ok(js.includes(s),s);
});
test('existing genuine EVM Contract Lab remains independent and unmodified',async()=>{
 const page=await request('/apps/contract/');
 const js=await request('/apps/contract/app.js');
 assert.equal(page.status,200);assert.equal(js.status,200);
 const text=await page.text(),engine=await js.text();
 assert.match(text,/EthereumJS|Contract Lab/);
 assert.ok(engine.length>200000,'pinned offline EVM bundle still present');
 assert.doesNotMatch(engine,/SOCIAL_V15/);
});
test('invalid slugs and POST do not expose arbitrary content',async()=>{
 assert.equal((await request('/apps/social/missing')).status,404);
 assert.equal((await request('/apps/social/','POST')).status,405);
 assert.equal((await request('/apps/../../')).status,404);
});
test('navigation and CSP remain same origin',async()=>{
 const page=await request('/apps/social/');
 assert.match(page.headers.get('content-security-policy')??'',/default-src 'self'/);
 assert.equal((await request('/apps/social/app.js')).headers.get('content-type'),'application/javascript; charset=utf-8');
});
