/**
 * Isolated Workform recruiter sandbox, Cloudflare Workers + D1.
 * Same-origin guest workspaces only. No accounts, private corpus, LLM, wallet, or native code execution.
 */
import {liveHtml} from './page.mjs';
import {liveJs} from './client.mjs';

const ORIGIN='https://jemueldaniel.website';
const MAX_AGE_SECONDS=24*60*60;
const MAX={workflows:10,runs:100,documents:25,evaluations:40,input:2000,doc:3000,steps:8};
const METHODS=new Set(['GET','POST','PUT','DELETE']);
const OPS=new Set(['normalize','lowercase','keywords','word_count','excerpt','sha256']);
const COOKIE='__Secure-wf_guest';
const common={'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','cache-control':'no-store','x-frame-options':'DENY'};
class Problem extends Error {constructor(status,code){super(code);this.status=status;this.code=code;}}
const fail=(status,code)=>{throw new Problem(status,code)};
const ok=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{...common,'content-type':'application/json; charset=utf-8',...headers}});
const error=(e)=>ok({ok:false,error:e instanceof Problem?e.code:'SERVER_ERROR'},e instanceof Problem?e.status:500);
const sha=async(value)=>{const b=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',b);return Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('')};
const tokens=(s)=>[...String(s).matchAll(/[\p{L}\p{N}]+/gu)].map(m=>({term:m[0].normalize('NFC').toLowerCase(),start:m.index,end:m.index+m[0].length}));
const string=(s,max)=>typeof s==='string'&&s.length<=max?s:fail(422,'INVALID_STRING');
const id=(s)=>typeof s==='string'&&/^[a-f0-9-]{36}$/.test(s)?s:fail(422,'INVALID_ID');
const opId=(s)=>{if(typeof s!=='string'||!/^[a-f0-9-]{36}$/.test(s))fail(422,'INVALID_OPERATION_ID');return s};
const dbOne=async(q,...args)=>await q.bind(...args).first();
const dbAll=async(q,...args)=>(await q.bind(...args).all()).results||[];
const body=async(req)=>{
  if(req.headers.get('content-type')?.split(';')[0]?.trim()!=='application/json')fail(415,'JSON_REQUIRED');
  const n=Number(req.headers.get('content-length')||'0');if(n>10000)fail(413,'BODY_TOO_LARGE');
  const s=await req.text();if(s.length>10000)fail(413,'BODY_TOO_LARGE');
  try{const b=JSON.parse(s);if(!b||Array.isArray(b)||typeof b!=='object')fail(422,'OBJECT_REQUIRED');return b}catch(e){if(e instanceof Problem)throw e;fail(400,'BAD_JSON')}
};
const checkMutation=(req)=>{
  if(req.headers.get('origin')!==ORIGIN||req.headers.get('x-workform-csrf')!=='1')fail(403,'ORIGIN_OR_CSRF_DENIED');
};
const cookie=(req)=>{const h=req.headers.get('cookie')||'';const hit=h.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));return hit?hit.slice(COOKIE.length+1):null};
const requireSession=async(req,env)=>{
  const secret=cookie(req);if(!secret||!/^[A-Za-z0-9_-]{43}$/.test(secret))fail(401,'GUEST_SESSION_REQUIRED');
  const hash=await sha(secret);
  const session=await dbOne(env.DB.prepare('SELECT workspace_id,expires_at FROM guest_sessions WHERE token_hash=?'),hash);
  if(!session||session.expires_at<=Date.now())fail(401,'GUEST_SESSION_EXPIRED');
  return session.workspace_id;
};
const sessionHeaders=secret=>({'set-cookie':`${COOKIE}=${secret}; Path=/apps/; Max-Age=${MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Strict`});
const session=async(req,env)=>{
  const existing=cookie(req);
  if(existing){try{return ok({ok:true,workspaceId:await requireSession(req,env),expiresInHours:24,guestOnly:true})}catch(e){if(!(e instanceof Problem)||e.status!==401)throw e;}}
  // 256-bit random session secret; only its SHA-256 digest is saved in D1.
  const bytes=crypto.getRandomValues(new Uint8Array(32));
  const secret=btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
  const workspaceId=crypto.randomUUID(),now=Date.now();
  // Expired workspace rows are cascaded away when new guests arrive.
  await env.DB.prepare('DELETE FROM guest_sessions WHERE expires_at<?').bind(now).run();
  await env.DB.prepare('INSERT INTO guest_sessions(token_hash,workspace_id,created_at,expires_at) VALUES(?,?,?,?)').bind(await sha(secret),workspaceId,now,now+MAX_AGE_SECONDS*1000).run();
  return ok({ok:true,workspaceId,expiresInHours:24,guestOnly:true},201,sessionHeaders(secret));
};
const validateSteps=(steps)=>{
  if(!Array.isArray(steps)||steps.length<1||steps.length>MAX.steps)fail(422,'STEP_COUNT_LIMIT');
  for(const s of steps){if(typeof s!=='string'||!OPS.has(s))fail(422,'INVALID_STEP')};return steps;
};
const normalizedPayload=async(kind,obj)=>await sha(kind+':'+JSON.stringify(obj));
const workflowRow=r=>({id:r.id,name:r.name,input:r.input_text,steps:JSON.parse(r.steps_json),revision:r.revision,updatedAt:r.updated_at});
const parseWorkflow=async(b)=>{
  const name=string(b.name,80).trim();if(!name)fail(422,'WORKFLOW_NAME_REQUIRED');
  const input=string(b.input,MAX.input);if(!input.trim())fail(422,'WORKFLOW_INPUT_REQUIRED');
  const steps=validateSteps(b.steps);return {name,input,steps};
};
const runGraph=async(input,steps)=>{
  let state=input;const outputs=[];
  for(let i=0;i<steps.length;i++){
    const op=steps[i];let value;
    switch(op){
      case 'normalize':state=state.normalize('NFC').trim().replace(/\s+/gu,' ');value=state;break;
      case 'lowercase':state=state.toLowerCase();value=state;break;
      case 'keywords':{const freq=Object.create(null);for(const {term} of tokens(state))freq[term]=(freq[term]||0)+1;value=Object.entries(freq).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,12).map(([word,count])=>({word,count}));break}
      case 'word_count':value=tokens(state).length;break;
      case 'excerpt':value=state.slice(0,240);break;
      case 'sha256':value=await sha(state);break;
    }
    outputs.push({index:i+1,op,output:value});
  }
  return {normalizedText:state,steps:outputs,artifact:state,contentSha256:await sha(state)};
};
const queryWorkflows=async(env,w)=>dbAll(env.DB.prepare('SELECT id,name,input_text,steps_json,revision,updated_at FROM workflows WHERE workspace_id=? ORDER BY updated_at DESC LIMIT 10'),w);
const workflowGet=async(env,w,workflowId)=>{const r=await dbOne(env.DB.prepare('SELECT * FROM workflows WHERE workspace_id=? AND id=?'),w,workflowId);if(!r)fail(404,'WORKFLOW_NOT_FOUND');return r;};
const count=async(env,table,w)=>{const n=await dbOne(env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE workspace_id=?`),w);return n?.n||0;};
const saveWorkflow=async(req,env,w)=>{
  const b=await body(req), data=await parseWorkflow(b),op=opId(b.operationId),digest=await normalizedPayload('workflow.save',data),now=Date.now();
  if(b.id){const r=await workflowGet(env,w,id(b.id));
    if(r.last_op_key===op){if(r.last_digest!==digest)fail(409,'OPERATION_CONFLICT');return ok({ok:true,workflow:workflowRow(r),replayed:true})}
    if(b.expectedRevision!==r.revision)fail(409,'STALE_WORKFLOW_REVISION');
    const result=await env.DB.prepare('UPDATE workflows SET name=?,input_text=?,steps_json=?,revision=revision+1,last_op_key=?,last_digest=?,updated_at=? WHERE workspace_id=? AND id=? AND revision=?').bind(data.name,data.input,JSON.stringify(data.steps),op,digest,now,w,r.id,r.revision).run();
    if(result.meta?.changes!==1)fail(409,'STALE_WORKFLOW_REVISION');return ok({ok:true,workflow:workflowRow(await workflowGet(env,w,r.id))});
  }
  const existing=await dbOne(env.DB.prepare('SELECT * FROM workflows WHERE workspace_id=? AND last_op_key=?'),w,op);
  if(existing){if(existing.last_digest!==digest)fail(409,'OPERATION_CONFLICT');return ok({ok:true,workflow:workflowRow(existing),replayed:true})}
  if(await count(env,'workflows',w)>=MAX.workflows)fail(429,'WORKFLOW_QUOTA_REACHED');
  const wid=crypto.randomUUID();
  await env.DB.prepare('INSERT INTO workflows(id,workspace_id,name,input_text,steps_json,revision,last_op_key,last_digest,updated_at) VALUES(?,?,?,?,?,1,?,?,?)').bind(wid,w,data.name,data.input,JSON.stringify(data.steps),op,digest,now).run();
  return ok({ok:true,workflow:workflowRow(await workflowGet(env,w,wid))},201);
};
const submitRun=async(req,env,w)=>{
  const b=await body(req),workId=id(b.workflowId),op=opId(b.operationId);const wf=await workflowGet(env,w,workId);
  const dig=await normalizedPayload('run', {workflowId:workId,revision:wf.revision,input:wf.input_text,steps:wf.steps_json});
  const previous=await dbOne(env.DB.prepare('SELECT * FROM runs WHERE workspace_id=? AND op_key=?'),w,op);
  if(previous){if(previous.input_digest!==dig)fail(409,'OPERATION_CONFLICT');return ok({ok:true,run:JSON.parse(previous.result_json),replayed:true})}
  if(await count(env,'runs',w)>=MAX.runs)fail(429,'RUN_QUOTA_REACHED');
  const graph=await runGraph(wf.input_text,validateSteps(JSON.parse(wf.steps_json))),run={id:crypto.randomUUID(),workflowId:workId,workflowRevision:wf.revision,status:'succeeded',output:graph,createdAt:Date.now()};
  await env.DB.prepare('INSERT OR IGNORE INTO runs(id,workspace_id,workflow_id,workflow_revision,op_key,input_digest,result_json,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(run.id,w,workId,wf.revision,op,dig,JSON.stringify(run),run.createdAt).run();
  const current=await dbOne(env.DB.prepare('SELECT input_digest,result_json FROM runs WHERE workspace_id=? AND op_key=?'),w,op);
  if(current.input_digest!==dig)fail(409,'OPERATION_CONFLICT');
  return ok({ok:true,run:JSON.parse(current.result_json),replayed:current.result_json!==JSON.stringify(run)},201);
};
const listRuns=async(env,w)=>{const rows=await dbAll(env.DB.prepare('SELECT id,workflow_id,workflow_revision,created_at FROM runs WHERE workspace_id=? ORDER BY created_at DESC,id DESC LIMIT 100'),w);return ok({ok:true,runs:rows.map(r=>({id:r.id,workflowId:r.workflow_id,workflowRevision:r.workflow_revision,createdAt:r.created_at}))})};
const getRun=async(env,w,rid)=>{const r=await dbOne(env.DB.prepare('SELECT result_json FROM runs WHERE workspace_id=? AND id=?'),w,rid);if(!r)fail(404,'RUN_NOT_FOUND');return ok({ok:true,run:JSON.parse(r.result_json)})};
const documentRow=r=>({id:r.id,title:r.title,revision:r.revision,updatedAt:r.updated_at,sourceRunId:r.source_run_id,bytes:new TextEncoder().encode(r.body).length});
const saveDocument=async(req,env,w)=>{
  const b=await body(req),op=opId(b.operationId);let docTitle,docBody,sourceRunId=null;
  if(b.sourceRunId){const r=await dbOne(env.DB.prepare('SELECT result_json FROM runs WHERE workspace_id=? AND id=?'),w,id(b.sourceRunId));if(!r)fail(404,'RUN_NOT_FOUND');const run=JSON.parse(r.result_json);docTitle=string(b.title||'Workflow artifact',80).trim();docBody=String(run.output.artifact||'');sourceRunId=run.id;}
  else {docTitle=string(b.title,80).trim();docBody=string(b.text,MAX.doc)}
  if(!docTitle||!docBody.trim()||docBody.length>MAX.doc)fail(422,'DOCUMENT_INVALID');
  const digest=await normalizedPayload('doc',{title:docTitle,body:docBody,sourceRunId});
  const old=await dbOne(env.DB.prepare('SELECT * FROM documents WHERE workspace_id=? AND op_key=?'),w,op);
  if(old){if(old.content_digest!==digest)fail(409,'OPERATION_CONFLICT');return ok({ok:true,document:documentRow(old),replayed:true})}
  if(await count(env,'documents',w)>=MAX.documents)fail(429,'DOCUMENT_QUOTA_REACHED');
  const docId=crypto.randomUUID(),now=Date.now();
  await env.DB.prepare('INSERT OR IGNORE INTO documents(id,workspace_id,title,body,revision,source_run_id,op_key,content_digest,updated_at) VALUES(?,?,?,?,1,?,?,?,?)').bind(docId,w,docTitle,docBody,sourceRunId,op,digest,now).run();
  const rr=await dbOne(env.DB.prepare('SELECT * FROM documents WHERE workspace_id=? AND op_key=?'),w,op);if(rr.content_digest!==digest)fail(409,'OPERATION_CONFLICT');return ok({ok:true,document:documentRow(rr)},201);
};
const documents=async(env,w)=>{const rows=await dbAll(env.DB.prepare('SELECT * FROM documents WHERE workspace_id=? ORDER BY updated_at DESC LIMIT 25'),w);return ok({ok:true,documents:rows.map(documentRow)})};
const documentGet=async(env,w,docId)=>{const r=await dbOne(env.DB.prepare('SELECT * FROM documents WHERE workspace_id=? AND id=?'),w,docId);if(!r)fail(404,'DOCUMENT_NOT_FOUND');return ok({ok:true,document:{...documentRow(r),text:r.body}})};
const lexical=async(env,w,q)=>{
  if(typeof q!=='string'||q.trim().length<1||q.length>160)fail(422,'QUERY_INVALID');
  const terms=[...new Set(tokens(q).map(x=>x.term))];if(!terms.length)fail(422,'QUERY_INVALID');
  const docs=await dbAll(env.DB.prepare('SELECT * FROM documents WHERE workspace_id=? ORDER BY updated_at DESC LIMIT 25'),w);
  const results=[];
  for(const d of docs){const occurrences=tokens(d.body);const matches=occurrences.filter(x=>terms.includes(x.term));const distinct=[...new Set(matches.map(x=>x.term))];if(!distinct.length)continue;
    const hit=matches[0];const left=Math.max(0,hit.start-80),right=Math.min(d.body.length,hit.end+120);const excerpt=d.body.slice(left,right);
    results.push({documentId:d.id,title:d.title,revision:d.revision,score:distinct.length*10+matches.length,termsMatched:distinct,passage:{text:excerpt,startUtf16:left,endUtf16:right,matchStartUtf16:hit.start,matchEndUtf16:hit.end,sha256:await sha(excerpt)}});
  }
  results.sort((a,b)=>b.score-a.score||a.documentId.localeCompare(b.documentId));return results;
};
const evaluate=async(req,env,w)=>{
  const b=await body(req),op=opId(b.operationId);
  if(!Array.isArray(b.cases)||b.cases.length<1||b.cases.length>10)fail(422,'EVALUATION_CASE_LIMIT');
  const cases=b.cases.map(c=>({query:string(c.query,160).trim(),expectedDocumentId:id(c.expectedDocumentId)}));
  const digest=await normalizedPayload('evaluation',cases);
  const old=await dbOne(env.DB.prepare('SELECT * FROM evaluations WHERE workspace_id=? AND op_key=?'),w,op);
  if(old){if(old.input_digest!==digest)fail(409,'OPERATION_CONFLICT');return ok({ok:true,evaluation:JSON.parse(old.result_json),replayed:true})}
  if(await count(env,'evaluations',w)>=MAX.evaluations)fail(429,'EVALUATION_QUOTA_REACHED');
  const rowResults=[];for(const c of cases){const expect=await dbOne(env.DB.prepare('SELECT id FROM documents WHERE workspace_id=? AND id=?'),w,c.expectedDocumentId);if(!expect)fail(422,'EVALUATION_EXPECTED_DOCUMENT_MISSING');const ranked=await lexical(env,w,c.query);rowResults.push({query:c.query,expectedDocumentId:c.expectedDocumentId,actualTopId:ranked[0]?.documentId||null,passed:ranked[0]?.documentId===c.expectedDocumentId,topPassageHash:ranked[0]?.passage.sha256||null});}
  const passed=rowResults.filter(c=>c.passed).length,res={id:crypto.randomUUID(),metric:'precision@1',cases:rowResults,total:rowResults.length,passed,accuracy:Math.round(passed*100/rowResults.length),createdAt:Date.now()};
  await env.DB.prepare('INSERT OR IGNORE INTO evaluations(id,workspace_id,op_key,input_digest,result_json,created_at) VALUES(?,?,?,?,?,?)').bind(res.id,w,op,digest,JSON.stringify(res),res.createdAt).run();
  const saved=await dbOne(env.DB.prepare('SELECT input_digest,result_json FROM evaluations WHERE workspace_id=? AND op_key=?'),w,op);if(saved.input_digest!==digest)fail(409,'OPERATION_CONFLICT');return ok({ok:true,evaluation:JSON.parse(saved.result_json)},201);
};
const listEvals=async(env,w)=>{const rows=await dbAll(env.DB.prepare('SELECT result_json FROM evaluations WHERE workspace_id=? ORDER BY created_at DESC LIMIT 40'),w);return ok({ok:true,evaluations:rows.map(r=>JSON.parse(r.result_json))})};
const reset=async(req,env,w)=>{const b=await body(req);if(b.confirm!=='DELETE MY GUEST WORKSPACE')fail(422,'RESET_CONFIRMATION_REQUIRED');const secret=cookie(req);const tokenHash=await sha(secret);await env.DB.prepare('DELETE FROM guest_sessions WHERE workspace_id=? AND token_hash=?').bind(w,tokenHash).run();return ok({ok:true,deleted:true},200,{'set-cookie':`${COOKIE}=; Path=/apps/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`})};
const content=(s,type)=>new Response(s,{status:200,headers:{'content-type':type,'cache-control':'public,max-age=120','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'"}});
export default {async fetch(req,env){try{
  const u=new URL(req.url);if(!u.pathname.startsWith('/apps/'))fail(404,'NOT_FOUND');
  if(!METHODS.has(req.method))fail(405,'METHOD_NOT_ALLOWED');
  if(u.pathname==='/apps/live/'&&req.method==='GET')return content(liveHtml,'text/html; charset=utf-8');
  if(u.pathname==='/apps/live/app.js'&&req.method==='GET')return content(liveJs,'application/javascript; charset=utf-8');
  if(u.pathname==='/apps/api/health'&&req.method==='GET'){
    const check=await dbOne(env.DB.prepare('SELECT COUNT(*) AS n FROM sqlite_master WHERE type=? AND name=?'),'table','guest_sessions');
    return ok({ok:true,service:'workform-public-guest-sandbox',databaseReady:check?.n===1,realPersistence:true,financialValue:'none',version:'1.0'});
  }
  if(!u.pathname.startsWith('/apps/api/'))fail(404,'NOT_FOUND');
  if(req.method!=='GET')checkMutation(req);
  if(u.pathname==='/apps/api/session'&&req.method==='POST')return await session(req,env);
  const w=await requireSession(req,env);
  if(u.pathname==='/apps/api/session'&&req.method==='GET')return ok({ok:true,workspaceId:w,guestOnly:true,expiresInHours:24});
  if(u.pathname==='/apps/api/workflows'&&req.method==='GET')return ok({ok:true,workflows:(await queryWorkflows(env,w)).map(workflowRow)});
  if(u.pathname==='/apps/api/workflows'&&req.method==='POST')return await saveWorkflow(req,env,w);
  if(u.pathname==='/apps/api/runs'&&req.method==='GET')return await listRuns(env,w);
  if(u.pathname==='/apps/api/runs'&&req.method==='POST')return await submitRun(req,env,w);
  if(u.pathname.startsWith('/apps/api/runs/')&&req.method==='GET')return await getRun(env,w,id(u.pathname.split('/').at(-1)));
  if(u.pathname==='/apps/api/documents'&&req.method==='GET')return await documents(env,w);
  if(u.pathname==='/apps/api/documents'&&req.method==='POST')return await saveDocument(req,env,w);
  if(u.pathname.startsWith('/apps/api/documents/')&&req.method==='GET')return await documentGet(env,w,id(u.pathname.split('/').at(-1)));
  if(u.pathname==='/apps/api/search'&&req.method==='GET')return ok({ok:true,query:u.searchParams.get('q')||'',results:await lexical(env,w,u.searchParams.get('q')||'')});
  if(u.pathname==='/apps/api/evaluations'&&req.method==='GET')return await listEvals(env,w);
  if(u.pathname==='/apps/api/evaluations'&&req.method==='POST')return await evaluate(req,env,w);
  if(u.pathname==='/apps/api/reset'&&req.method==='POST')return await reset(req,env,w);
  fail(404,'NOT_FOUND');
}catch(e){return error(e)}}};