import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
function textContent(){return html;}
test('public evidence page has five named original case studies with explicit claims boundaries',()=>{
 assert.equal((html.match(/class="case" data-category=/g)||[]).length,5);
 assert.match(html,/Recoverable AI workspaces/);
 assert.match(html,/Embedded mini-app interfaces/);
 assert.match(html,/Social and API recovery/);
 assert.match(html,/Compiler and runtime research/);
 assert.match(html,/Interactive systems explorer/);
 assert.match(html,/not evidence of fault-tolerant distributed production infrastructure/);
});
test('all five categories are accessible and case IDs are unique',()=>{
 const caseIds=[...html.matchAll(/<article class="case"[^>]* id="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(caseIds.length,5);assert.equal(new Set(caseIds).size,5);
 const filters=[...html.matchAll(/data-filter="([^"]+)" aria-pressed=/g)].map(x=>x[1]);
 assert.deepEqual(filters,['all','agents','interfaces','reliability','languages']);
 assert.match(html,/id="filter-status" role="status" aria-live="polite"/);
});
test('public proof routes go only to the approved personal repository',()=>{
 const urls=[...html.matchAll(/href="(https?:\/\/[^\"]+)"/g)].map(x=>new URL(x[1]));
 assert.ok(urls.length>=3);
 assert.ok(urls.every(x=>x.hostname==='github.com'&&(x.pathname.startsWith('/jemueldaniel/danielcodes/')||x.pathname==='/jemueldaniel/danielworks')));
 assert.ok(!html.includes('casteragents-ai')&&!html.includes('V5-CHANGES.patch'));
});
test('themes, reduced motion and keyboard focus are implemented without network scripts',()=>{
 assert.match(html,/prefers-reduced-motion:reduce/);
 assert.match(html,/:focus-visible/);
 assert.match(html,/class="skip" href="#main"/);
 assert.match(html,/min-height:44px/);
 assert.ok(!html.includes('<script src='));
 const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(script);assert.doesNotThrow(()=>new Function(script));
});