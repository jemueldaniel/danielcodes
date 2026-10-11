import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const origin = 'https://jemueldaniel.website';
const base = origin + '/apps/api';
let cookie = '';
let started = false;
let checks = 0;
const check=(value,msg)=>{assert.ok(value,msg);checks++;console.log('PASS '+msg)};
async function call(method,path,data){
  const headers = {'accept':'application/json'};
  if(cookie)headers.cookie=cookie;
  if(method==='POST'){headers.origin=origin;headers['content-type']='application/json';headers['x-workform-csrf']='1'}
  const r=await fetch(base+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
  const json=await r.json();
  return {status:r.status,headers:r.headers,json};
}
const op=()=>randomUUID();
try{
  let w=await call('POST','/session',{});check(w.status===201&&w.json.ok,'create real D1 guest workspace');
  cookie=w.headers.get('set-cookie')?.split(';')[0]||'';
  check(cookie.startsWith('__Secure-wf_guest='),'receive secure session cookie (not printed)');
  started=true;
  let unauth=await fetch(base+'/workflows',{headers:{accept:'application/json'},signal:AbortSignal.timeout(15000)});
  check(unauth.status===401,'deny missing guest capability');
  let v=await call('GET','/workflows');check(v.status===200&&Array.isArray(v.json.workflows),'read saved workflows');
  let input={name:'Recruiter HTTP proof '+randomUUID().slice(0,8),input:'Reliable systems create reliable evidence. Evidence should survive an interrupted retry.',steps:['normalize','lowercase','keywords'],operationId:op()};
  let wf=await call('POST','/workflows',input);check(wf.status===201&&!!wf.json.workflow?.id,'save bounded workflow');
  let workflowId=wf.json.workflow.id;
  let wfReplay=await call('POST','/workflows',input);check(wfReplay.json.replayed&&wfReplay.json.workflow?.id===workflowId,'replay workflow save without duplication');
  let runOp=op(),run=await call('POST','/runs',{workflowId,operationId:runOp});check(run.json.run?.status==='succeeded'&&run.json.run?.output?.steps?.length===3,'run real text steps on server');
  let runId=run.json.run.id;
  let replay=await call('POST','/runs',{workflowId,operationId:runOp});check(replay.json.replayed&&replay.json.run?.id===runId,'replay run with same receipt');
  let history=await call('GET','/runs');check(history.json.runs?.some(x=>x.id===runId),'reload saved run history');
  let doc=await call('POST','/documents',{sourceRunId:runId,title:'HTTP workbench imported artifact',operationId:op()});check(doc.status===201&&!!doc.json.document?.id,'import saved run artifact into Lab D1 corpus');
  let documentId=doc.json.document.id;
  let find=await call('GET','/search?q=reliable');check(find.json.results?.some(x=>x.documentId===documentId&&x.passage?.sha256),'search real stored passages with digest');
  let ev=await call('POST','/evaluations',{cases:[{query:'reliable',expectedDocumentId:documentId}],operationId:op()});
  check(ev.json.evaluation?.total===1&&ev.json.evaluation?.passed===1,'persist one passing expected-hit evaluation');
  let es=await call('GET','/evaluations');check(es.json.evaluations?.some(x=>x.id===ev.json.evaluation.id),'read evaluation back after execution');
  let scripts=await fetch(origin+'/apps/workbench/client.js',{signal:AbortSignal.timeout(15000)});
  check(scripts.status===200&&(await scripts.text()).includes('lastMutation'),'new live workbench client source is served');
} catch(e){console.log('FAIL '+e.stack); process.exitCode=1}
finally{
 if(started){try{let reset=await call('POST','/reset',{confirm:'DELETE MY GUEST WORKSPACE'});check(reset.status===200&&reset.json.deleted,'erase ephemeral acceptance workspace');let forbidden=await call('GET','/runs');check(forbidden.status===401,'reset revokes capability');}
 catch(e){console.log('CLEANUP_ERROR '+e.message);process.exitCode=1}}
 console.log('LIVE_CHECKS '+checks+' completed; no cookies or private data printed');
}
