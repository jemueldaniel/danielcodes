/* Original V18 Agent cockpit: renders ONLY observed guest-API evidence. No extra network. */
(()=>{
'use strict';
const root=document.getElementById('agentV18Root');
if(!root||root.dataset.ready==='true')return;
root.dataset.ready='true';
const el=id=>document.getElementById(id),trace=el('trace'),legacyStatus=el('status'),legacyIds=el('ids');
if(!trace||!legacyStatus||!legacyIds)return;
const actions={av18Connect:'connect',av18Seed:'seed',av18Execute:'execute',av18Retry:'retry',av18Readback:'readback',av18Reset:'reset'};
const named={'session':'Guest session','prepare_workflow':'Workflow persisted','prepare_document':'Source imported',
 'plan':'Plan admitted by browser','search':'D1 source retrieved','workflow.run':'Saved workflow executed',
 'artifact.save':'Evidence document saved','verify':'Server readback verified','error':'Review network / input'};
const stageNames=['search','run','artifact','verify'];
const short=value=>{
 const s=typeof value==='string'?value:'';
 return s.length>21?s.slice(0,8)+'…'+s.slice(-8):s||'—';
};
const isHash=value=>typeof value==='string'&&/^[a-f0-9]{64}$/i.test(value);
const isId=value=>typeof value==='string'&&/^[0-9a-f-]{24,60}$/i.test(value);
const parse=()=>{try{
 const found=JSON.parse(trace.textContent);
 return Array.isArray(found)?found.slice(-25).filter(x=>x&&typeof x.step==='string'&&typeof x.kind==='string'&&!Array.isArray(x)):[];
}catch{return[]}};
const stageOf=event=>{
 const e=event.evidence??{};
 if(event.step==='search'&&event.kind==='server'&&isId(e.documentId)&&isHash(e.passageSha256))return 'search';
 if(event.step==='workflow.run'&&event.kind==='server'&&isId(e.runId)&&isHash(e.resultSha256))return 'run';
 if(event.step==='artifact.save'&&event.kind==='server'&&isId(e.artifactId)&&isId(e.sourceRunId))return 'artifact';
 if(event.step==='verify'&&event.kind==='server_readback'&&e.verified===true
  &&isId(e.runId)&&isId(e.artifactId)&&e.sourceRunId===e.runId&&isHash(e.contentSha256))return 'verify';
 return null;
};
const nodes=Object.fromEntries([...root.querySelectorAll('[data-av18-stage]')].map(n=>[n.dataset.av18Stage,n]));
let receipt=null,armed=false,pending=false;
function disarm(){
 armed=false;const b=el('av18Reset');b.dataset.armed='false';b.textContent='Delete guest workspace';
}
function observed(events){
 const steps=new Set(),completed=[];
 for(const event of events){const stage=stageOf(event);if(stage){steps.add(stage);completed.push({stage,event})}}
 const lastError=events.findLastIndex(e=>e.step==='error');
 const lastVerify=events.findLastIndex(e=>stageOf(e)==='verify');
 const verified=lastVerify>=0&&lastVerify>lastError;
 const v=verified?events[lastVerify].evidence:null;
 // Do not treat a readback as proof of the entire agent orchestration.
 const latest=key=>[...events].reverse().find(e=>stageOf(e)===key)?.evidence??null;
 const run=latest('run'),artifact=latest('artifact'),source=latest('search');
 if(v&&(run?.runId&&run.runId!==v.runId||artifact?.artifactId&&artifact.artifactId!==v.artifactId)){
   return {steps,verified:false,v:null,run,artifact,source,problem:true};
 }
 return {steps,verified,v,run,artifact,source,problem: lastError>lastVerify};
}
function updateEvidence(data,events){
 const {steps,verified,v,run,artifact,source,problem}=data;
 stageNames.forEach(stage=>nodes[stage].dataset.state=steps.has(stage)?'observed':'idle');
 const count=steps.size;
 el('av18ProgressFill').style.width=String(count/4*100)+'%';
 el('av18ProgressLabel').textContent=count+' / 4 OBSERVED';
 const state=el('av18LiveState'),verdict=el('av18Verdict');
 state.dataset.state=verified?'verified':problem?'review':events.length?'observing':'idle';
 state.textContent=verified?'READBACK VERIFIED':problem?'NEEDS REVIEW':events.length?'OBSERVING API':'NOT EXECUTED';
 verdict.dataset.state=verified?'verified':problem?'review':'pending';
 el('av18VerdictText').textContent=verified?'Verified D1 readback':problem?'Verification requires review':'Awaiting observed proof';
 el('av18RunId').textContent=short(v?.runId||run?.runId);
 el('av18ArtifactId').textContent=short(v?.artifactId||artifact?.artifactId);
 el('av18Hash').textContent=verified?short(v.contentSha256):'NOT VERIFIED';
 el('av18Source').textContent=short(source?.passageSha256);
 receipt=verified?{
  schema:'daniel-agent-bounded-guest-proof-v1',
  scope:'browser-observed-server-readback',
  atomicAgentReceipt:false,
  verifiedReadback:true,
  runId:v.runId,
  artifactId:v.artifactId,
  sourceRunId:v.sourceRunId,
  contentSha256:v.contentSha256,
  documentRevision:v.documentRevision??null,
  citedPassageSha256:source?.passageSha256??null,
  observedStageCount:count,
  warning:'This is client-exported evidence of an individual persisted guest readback; not a signed server orchestration receipt.'
 }:null;
 el('av18Export').disabled=!receipt;
 if(!receipt)el('av18ExportStatus').textContent=problem?'An unresolved step prevents a verified receipt. Retry the same intent or re-read persisted data.':'Download becomes available after an actual SHA-256 server readback.';
}
function updateEvents(events){
 const list=el('av18EventList');list.replaceChildren();
 el('av18EventCount').textContent=String(events.length).padStart(2,'0');
 if(!events.length){
  const li=document.createElement('li');li.className='av18-empty';
  li.textContent='No tool evidence in this tab yet. Connect and prepare to begin.';
  list.append(li);return
 }
 for(const [i,event] of events.slice(-7).entries()){
  const li=document.createElement('li'),idx=document.createElement('span'),label=document.createElement('strong'),badge=document.createElement('em');
  idx.className='av18-event-index';idx.textContent=String(events.length-Math.min(events.length,7)+i+1).padStart(2,'0');
  label.textContent=Object.hasOwn(named,event.step)?named[event.step]:'Observed tool event';
  badge.textContent=stageOf(event)?'API PROOF':event.step==='error'?'REVIEW':event.kind==='server_saved'?'D1 SAVED':'OBSERVED';
  li.append(idx,label,badge);list.append(li);
 }
}
function syncControls(){
 for(const [id,origin] of Object.entries(actions)){
  const local=el(id),target=el(origin);
  if(!local||!target)continue;
  const disabled=target.disabled===true;
  if(local.disabled!==disabled)local.disabled=disabled;
 }
 const source=legacyIds.textContent,workspace=/Workspace:\s*([^\s]+)/.exec(source)?.[1];
 const hasWorkspace=workspace&&workspace!=='none';
 el('av18Session').textContent=hasWorkspace?'GUEST '+short(workspace):'NOT CONNECTED';
 const statusText=legacyStatus.textContent?.trim()||'Ready to inspect API responses.';
 if(!armed)el('av18OperatorStatus').textContent=statusText.slice(0,240);
}
function render(){
 const events=parse();updateEvidence(observed(events),events);updateEvents(events);syncControls();
}
let queued=false;
function queue(){
 if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render()})
}
const targetIds=['trace','status','ids','proof'];
for(const id of targetIds)new MutationObserver(queue).observe(el(id),{childList:true,characterData:true,subtree:true});
for(const old of Object.values(actions))new MutationObserver(queue).observe(el(old),{attributes:true,attributeFilter:['disabled']});
const oldQuery=el('query'),newQuery=el('av18Question');
newQuery.value=oldQuery.value;
newQuery.addEventListener('input',()=>{
 oldQuery.value=newQuery.value.slice(0,160);
 if(armed)disarm();
});
for(const [id,target] of Object.entries(actions)){
 if(id==='av18Reset')continue;
 el(id).addEventListener('click',()=>{
  if(armed)disarm();
  if(id==='av18Execute'&&newQuery.value.trim()===''){
   el('av18OperatorStatus').textContent='Enter a short, non-confidential source query first.';return;
  }
  if(id==='av18Execute')oldQuery.value=newQuery.value.slice(0,160);
  el(target).click();queue();
 });
}
const oldReset=el('reset'),resetButton=el('av18Reset');
resetButton.addEventListener('click',()=>{
 if(oldReset.disabled||pending)return;
 if(!armed){
  armed=true;resetButton.dataset.armed='true';
  resetButton.textContent='Confirm deleting guest data';
  el('av18OperatorStatus').textContent='Click again to delete this temporary D1 guest workspace, or press Escape to cancel.';
  return;
 }
 disarm();pending=true;
 window.__AGENT_V18_RESET_CONFIRMED__=true;
 oldReset.click();
 queueMicrotask(()=>{pending=false;window.__AGENT_V18_RESET_CONFIRMED__=false;queue()});
});
oldReset.addEventListener('click',()=>{
 if(window.__AGENT_V18_RESET_CONFIRMED__!==true){
  resetButton.focus();
  el('av18OperatorStatus').textContent='For a nonmodal reset, confirm twice using Delete guest workspace in Mission control.';
 }
},true);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&armed){disarm();el('av18OperatorStatus').textContent='Reset canceled. Guest data remains unchanged.'}
},true);
document.addEventListener('click',e=>{
 if(armed&&!resetButton.contains(e.target)){
  disarm();el('av18OperatorStatus').textContent='Reset canceled. Guest data remains unchanged.';
 }
},true);
el('av18Export').addEventListener('click',()=>{
 if(!receipt)return;
 try{
  const body=JSON.stringify(receipt,null,2);
  const url=URL.createObjectURL(new Blob([body],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='daniel-agent-verified-guest-readback.json';
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  el('av18ExportStatus').textContent='Exported bounded guest readback. No source query, cookies, or user-authored document text included.';
 }catch{el('av18ExportStatus').textContent='Download unavailable; observed readback remains on screen.'}
});
render();
})();
