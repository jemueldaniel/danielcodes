import {runScenario,SCENARIOS} from './engine.mjs';
const $=id=>document.getElementById(id);
const buttons=[...document.querySelectorAll('[data-case]')];
const names=Object.keys(SCENARIOS);
const state={selected:'arithmetic',busy:false,last:null,runs:[]};
function status(text,verdict='pending'){$('runStatus').textContent=text;$('runStatus').dataset.verdict=verdict}
function choose(id){
 if(state.busy||!Object.hasOwn(SCENARIOS,id))return;
 state.selected=id;
 for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.case===id));
 const fixture=SCENARIOS[id];
 $('bytecode').textContent=fixture.code;
 $('byteCount').textContent=((fixture.code.length-2)/2)+' BYTES';
 status('Selected '+fixture.name+'. Press Run to execute exact bytecode.');
 state.last=null;resetOutput();
}
function resetOutput(){
 for(const [k,text] of [['gasUsed','—'],['returnWord','—'],['stepsCount','0'],['verdict','Pending'],['runLabel','IDLE · NOT RUN'],['receipt','No receipt until a scenario has actually executed.']])$(k).textContent=text;
 $('gasLimit').textContent='Limit —';$('traceList').replaceChildren();
 const empty=document.createElement('li'),label=document.createElement('span');label.textContent='No execution yet.';empty.append(label);$('traceList').append(empty);
 document.querySelectorAll('[data-phase]').forEach(x=>{x.dataset.ok='false';x.querySelector('span').textContent='Awaiting execution'});
 $('copyReceipt').disabled=true;$('downloadReceipt').disabled=true;
}
function phase(stage,text,ok){const item=document.querySelector('[data-phase="'+stage+'"]');item.dataset.ok=String(ok);item.querySelector('span').textContent=text}
function fillTrace(trace){
 const root=$('traceList');root.replaceChildren();
 for(const row of trace.slice(0,48)){
  const li=document.createElement('li'),left=document.createElement('b'),right=document.createElement('span');
  left.textContent=String(row.pc??'—').padStart(3,'0')+' '+row.opcode;
  right.textContent=row.gasLeft===null?'gas n/a':'gas '+row.gasLeft;
  li.append(left,right);root.append(li);
 }
}
async function sha256(text){
 const bytes=new TextEncoder().encode(text);
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function updateBusy(v){
 state.busy=v;for(const b of [...buttons,$('runSelected'),$('runAll')])b.disabled=v;
}
async function execute(id,{group=false}={}){
 if(!Object.hasOwn(SCENARIOS,id))throw Error('UNAPPROVED_EVM_SCENARIO');
 state.last=null;resetOutput();phase('load','Pinned exact bytecode',true);status('Running pinned bytecode in local isolated EVM…');
 const observed=await runScenario(id);
 const canonical={id:observed.id,hardfork:observed.metadata.hardfork,engine:observed.metadata.interpreter+'@'+observed.metadata.version,bytecode:observed.bytecode,gasLimit:observed.gasLimit,gasUsed:observed.gasUsed,returnHex:observed.returnHex,returnWord:observed.returnWord,errorClass:observed.errorClass,exception:observed.exception,expected:observed.expected,passed:observed.passed,trace:observed.trace};
 const digest=await sha256(JSON.stringify(canonical));
 const receipt={...canonical,sha256:digest,qualifier:'Offline allowlisted EVM raw bytecode execution only; no transaction, contract deployment, RPC or funds'};
 state.last=receipt;state.runs.push({id:receipt.id,passed:receipt.passed,gas:receipt.gasUsed,digest});
 $('gasUsed').textContent=receipt.gasUsed;$('gasLimit').textContent='Limit '+receipt.gasLimit;
 $('returnWord').textContent=receipt.returnWord??(receipt.errorClass==='NONE'?'None':'—');
 $('stepsCount').textContent=String(receipt.trace.length);
 $('verdict').textContent=receipt.passed?'PASS':'FAIL';
 $('runLabel').textContent=receipt.passed?'REAL EVM · VERIFIED':'EXECUTION FAILED · REVIEW';
 $('receipt').textContent=JSON.stringify(receipt,null,2);fillTrace(receipt.trace);
 phase('execute',receipt.errorClass==='NONE'?'Executed in EVM':'Observed '+receipt.errorClass,true);
 phase('verify',receipt.passed?'Matched expected invariant':'Invariant failed',receipt.passed);
 $('copyReceipt').disabled=false;$('downloadReceipt').disabled=false;
 status((receipt.passed?'PASS':'FAIL')+' · '+SCENARIOS[id].name+' · '+receipt.gasUsed+' gas · '+receipt.trace.length+' observed instructions'+(group?' · part of bounded 4-case run':''),receipt.passed?'pass':'fail');
 return receipt;
}
$('runSelected').addEventListener('click',async()=>{
 if(state.busy)return;updateBusy(true);try{await execute(state.selected)}catch(e){resetOutput();$('runLabel').textContent='ERROR · REVIEW';status('EVM failure: '+String(e?.message||e).slice(0,220),'fail')}finally{updateBusy(false)}
});
$('runAll').addEventListener('click',async()=>{
 if(state.busy)return;updateBusy(true);
 let passed=0;try{state.runs=[];for(const id of names){state.selected=id;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===id)));$('bytecode').textContent=SCENARIOS[id].code;$('byteCount').textContent=(SCENARIOS[id].code.length-2)/2+' BYTES';const result=await execute(id,{group:true});if(result.passed)passed++}
 $('runLabel').textContent=passed+'/'+names.length+' VERIFIED OFFLINE CASES';status('Executed '+names.length+' real isolated EVM runs · '+passed+' expected outcomes qualified.',passed===names.length?'pass':'fail');
 }catch(e){status('Run-all stopped: '+String(e?.message||e).slice(0,220),'fail')}finally{updateBusy(false)}
});
for(const b of buttons)b.addEventListener('click',()=>choose(b.dataset.case));
$('copyReceipt').addEventListener('click',async()=>{
 if(!state.last)return;
 try{await navigator.clipboard.writeText(JSON.stringify(state.last,null,2));status('Copied independently inspectable offline EVM receipt.','pass')}
 catch{status('Clipboard unavailable. Select the visible receipt to copy it.');$('receipt').focus()}
});
$('downloadReceipt').addEventListener('click',()=>{
 if(!state.last)return;const payload=new Blob([JSON.stringify(state.last,null,2)],{type:'application/json'}),url=URL.createObjectURL(payload);
 const a=document.createElement('a');a.href=url;a.download='daniel-evm-'+state.last.id+'-receipt.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 status('Downloaded test-only offline receipt. This is not a blockchain transaction.','pass');
});
choose('arithmetic');
