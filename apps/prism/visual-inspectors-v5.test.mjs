import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from './microapps-worker.mjs';

const origin='https://jemueldaniel.website';
const targets=[
  {slug:'code',title:'Compiler result dashboard',metrics:['vCodeResult','vCodeVerdict','vCodeState'],source:'executeTinyLanguage',status:'codeStatus'},
  {slug:'project',title:'Project revision dashboard',metrics:['vProjectFiles','vProjectRevision','vProjectChanges'],source:'createProjectStore',status:'projectStatus'},
  {slug:'interface',title:'Accessible interaction telemetry',metrics:['vInterfaceEvents','vInterfaceTypes','vInterfaceTimeline'],source:"'disclosure'",status:'uiStatus'},
];

for (const t of targets) {
 test(t.slug+': rich dark inspector sits above exact expandable execution evidence',async()=>{
   const response=await worker.fetch(new Request(origin+'/apps/'+t.slug+'/'));
   assert.equal(response.status,200);
   assert.match(response.headers.get('content-type'),/text\/html/);
   const html=await response.text();
   assert.match(html,/<html[^>]*data-app="[^"]+"/);
   assert.ok(html.includes('<style id="workform-v5-inspectors">'));
   assert.ok(html.includes(t.title));
   for(const id of t.metrics)assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
   const panelIndex=html.indexOf('class="visual-inspector"'),evidenceIndex=html.indexOf('class="visual-machine-evidence"');
   assert.ok(panelIndex>0&&evidenceIndex>panelIndex,'real visual inspector comes before machine evidence');
   assert.match(html,/<details class="visual-machine-evidence"><summary>View exact machine evidence<\/summary><pre/);
   assert.match(html,new RegExp('id="'+t.status+'"'));
   assert.match(html,/aria-label="Ask Daniel[^"]+"/);
   assert.doesNotMatch(html,/<dialog\b|aria-modal="true"|showModal\(/);
   assert.match(html,/@media\(prefers-reduced-motion:reduce\)/);
   assert.match(html,/background:#090909!important/);
   assert.match(html,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
   assert.doesNotMatch(html,/cdn\.jsdelivr\.net|unpkg\.com|https:\/\/[^"]+\.js/);
 });
 test(t.slug+': UI status derives from existing execution engine and preserves original action code',async()=>{
   const response=await worker.fetch(new Request(origin+'/apps/'+t.slug+'/app.js'));
   assert.equal(response.status,200);
   assert.match(response.headers.get('content-type'),/javascript/);
   const script=await response.text();
   assert.ok(script.includes(t.source),t.source);
   assert.match(script,/new MutationObserver\(render\)/);
   assert.match(script,new RegExp(t.status));
   assert.match(script,/\.textContent=/);
   assert.doesNotMatch(script,/eval\(|new Function\(|innerHTML\s*=/);
 });
 test(t.slug+': scoped router rejects unsupported methods and unexpected descendants',async()=>{
   const post=await worker.fetch(new Request(origin+'/apps/'+t.slug+'/',{method:'POST'}));
   assert.equal(post.status,405);
   const missing=await worker.fetch(new Request(origin+'/apps/'+t.slug+'/admin'));
   assert.equal(missing.status,404);
   const head=await worker.fetch(new Request(origin+'/apps/'+t.slug+'/',{method:'HEAD'}));
   assert.equal(head.status,200);
   assert.equal((await head.text()).length,0);
 });
}
test('other independent apps preserve existing source and truthful contract qualification',async()=>{
 for(const slug of ['social','contract']){
  const resp=await worker.fetch(new Request(origin+'/apps/'+slug+'/'));
  assert.equal(resp.status,200);
  const text=await resp.text();
  assert.doesNotMatch(text,/workform-v5-inspectors/);
  if(slug==='contract'){assert.match(text,/EthereumJS EVM 10.1.3/);assert.match(text,/No deployed contract, blockchain state/)}
 }
});
