'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/xlqxl/node_modules/playwright-core');
const URL='https://jemueldaniel.website/apps/workbench/';
const checks=[];
const ck=(yes,msg)=>{assert.ok(yes,msg);checks.push(msg);console.log('PASS '+msg)};
let browser,context,page,guestStarted=false;
async function op(name) {
  await page.locator('button[data-op="'+name+'"]').click({timeout:15000});
  await page.waitForFunction(()=>document.querySelector('#http-status').textContent !== 'Pending' && !document.querySelector('button[data-op=session]').disabled,null,{timeout:20000});
  const http=await page.locator('#http-status').innerText();
  const raw=await page.locator('#output').innerText();
  let data;try{data=JSON.parse(raw)}catch{throw new Error(name+' no JSON '+http+' '+raw.slice(0,130))}
  return {status:Number(http.replace('HTTP ','')),data};
}
(async()=>{
try{
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--no-first-run','--disable-extensions']});
  context=await browser.newContext({viewport:{width:390,height:844},locale:'en-US'});
  page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const res=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:22000});
  ck(res?.status()===200,'real Edge loads live Workbench HTTP 200');
  await page.waitForFunction(()=>document.querySelectorAll('button[data-op]').length>=11,null,{timeout:12000});
  ck(await page.locator('h1').innerText()=== 'Inspect an actual API call. Not a simulated response.','expected live application heading');
  await page.locator('button[data-op=session]').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('#http-status').textContent!=='Pending'&&!document.querySelector('button[data-op=session]').disabled,null,{timeout:20000});
  let session=JSON.parse(await page.locator('#output').innerText());
  ck(session.ok&&session.guestOnly===true,'keyboard starts real D1 guest session');
  guestStarted=true;
  let wf=await op('save');ck(wf.status===201&&!!wf.data.workflow?.id,'mouse saves workflow using real API');
  let run=await op('run');ck(run.status===201&&run.data.run?.status==='succeeded','browser executes saved workflow');
  let runs=await op('runs');ck(runs.data.runs?.some(x=>x.id===run.data.run.id),'browser reads persisted run');
  let doc=await op('import');ck(doc.status===201&&!!doc.data.document?.id,'browser imports saved artifact to Knowledge');
  let search=await op('search');ck(search.status===200&&search.data.results?.some(x=>x.documentId===doc.data.document.id),'browser searches imported document');
  let evalResult=await op('evaluate');ck(evalResult.status===201&&evalResult.data.evaluation?.total===1,'browser persists evaluation');
  let replay=await op('replay');ck(replay.data.replayed===true && replay.data.evaluation?.id===evalResult.data.evaluation.id,'browser retries same mutation without extra effect');
  await page.reload({waitUntil:'domcontentloaded'});
  let evals=await op('evaluations');ck(evals.data.evaluations?.some(x=>x.id===evalResult.data.evaluation.id),'saved evaluation survives live browser reload');
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:844});
    const dims=await page.evaluate(()=>({w:innerWidth,s:document.documentElement.scrollWidth}));
    ck(dims.s<=dims.w+1,'no horizontal page overflow at '+width+'px');
  }
  ck(errors.length===0,'no unhandled application JS errors');
}catch(e){
  console.log('FAIL '+String(e.stack||e));
  process.exitCode=1;
}finally{
 if(page&&guestStarted){
  try{
    let resp=await page.evaluate(async()=>{const r=await fetch('/apps/api/reset',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json','x-workform-csrf':'1'},body:JSON.stringify({confirm:'DELETE MY GUEST WORKSPACE'})});return {status:r.status,json:await r.json()}});
    ck(resp.status===200&&resp.json.deleted===true,'browser acceptance workspace erased');
  }catch(e){console.log('CLEANUP_ERROR '+e.message);process.exitCode=1}
 }
 try{await context?.close();await browser?.close()}catch(e){console.log('BROWSER_CLOSE_ERROR '+e.message);process.exitCode=1}
 console.log('BROWSER_ACCEPTANCE '+checks.length+' PASS, '+(process.exitCode?'FAIL':'CLEAN'));
}
})().catch(e=>{console.log('FATAL '+e.message);process.exitCode=1});
