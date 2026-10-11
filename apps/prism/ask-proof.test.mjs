import {test} from 'node:test';
import assert from 'node:assert/strict';
import prism from './worker.mjs';

const get=()=>prism.fetch(new Request('https://jemueldaniel.website/'));
test('Ask Daniel contains genuine, bounded, recruiter-facing citations',async()=>{
 const r=await get();assert.equal(r.status,200);
 const html=await r.text();
 for(const route of ['/apps/live/','/apps/agent/','/apps/workbench/','/apps/','/resume','/apps/evidence/'])assert.ok(html.includes(route),route);
 assert.match(html,/const JD_PUBLIC_PROOF=Object\.freeze/);
 assert.match(html,/function verifiedJDAnswer\(question\)/);
 assert.match(html,/function renderJDProofLinks\(target,keys\)/);
 assert.match(html,/class="promptChip" data-q="Where can a recruiter run verified demos and inspect the public source code\?"/);
 assert.match(html,/id="jd-verified-sources"/);
 assert.doesNotMatch(html,/link to publicly available code examples/i);
});
test('verified links are not uncontrolled arbitrary URLs, and preserve existing assistant fallback',async()=>{
 const html=await(await get()).text();
 assert.match(html,/Object\.hasOwn\(JD_PUBLIC_PROOF,k\)/);
 assert.match(html,/noopener noreferrer/);
 assert.match(html,/if\(verified\)\{const direct=addMsg/);
 assert.match(html,/fetch\('\/api\/chat\/stream'/);
 assert.match(html,/role="region"/);
 assert.doesNotMatch(html,/aria-modal="true"/);
 for(const part of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
   if(/application\/ld\+json/.test(part[1])||!part[2].trim())continue;
   assert.doesNotThrow(()=>new Function(part[2]));
 }
});
test('recruiter evidence answer explicitly distinguishes server, browser, and pending contract work',async()=>{
 const html=await(await get()).text();
 for(const statement of ['a test link does not represent employer review','not an atomic Agent run','packaged SDK and MCP pending','offline EVM still unqualified','not automatically in main']){
   assert.ok(html.includes(statement),statement);
 }
});

test('all five case studies expose real, accurately labeled references',async()=>{
 const h=await(await get()).text();
 assert.equal((h.match(/class="case-proof-links"/g)||[]).length,5);
 assert.match(h,/Related public React source/);
 assert.match(h,/Related replay\/fencing reference/);
 assert.match(h,/Related tested Rust pipeline/);
 assert.match(h,/Check prototype limitations/);
 for(const source of [
  'danielworks/blob/main/projects/evidence-workbench/web/App.tsx',
  'danielworks/blob/main/examples/event_outbox/README.md',
  'danielworks/blob/main/projects/bounded-lang/README.md'
 ])assert.ok(h.includes(source),source);
 assert.doesNotMatch(h,/jemueldanieljobs|BEGIN PRIVATE KEY|castractseedprompt/i);
});
