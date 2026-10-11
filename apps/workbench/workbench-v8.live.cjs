'use strict';
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/xlqxl/node_modules/playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const origin='https://jemueldaniel.website';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-first-run','--disable-extensions']});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage();let n=0,connected=false;const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 function check(ok,label){assert.ok(ok,label);n++;console.log('PASS',label)}
 const act=async op=>{
  await page.locator('button[data-op="'+op+'"]').click();
  await page.waitForFunction(()=>/Completed\. Inspect server result and saved IDs\.|Server rejected|Transport or parse outcome unknown/.test(document.getElementById('status')?.textContent||''),null,{timeout:30000});
  const status=await page.locator('#status').innerText();
  if(!status.startsWith('Completed.'))throw Error(op+' outcome: '+status);
 };
 const reset=async()=>{
  return page.evaluate(async()=>{
   const r=await fetch('/apps/api/reset',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json','x-workform-csrf':'1'},body:JSON.stringify({confirm:'DELETE MY GUEST WORKSPACE'})});
   return {status:r.status,json:await r.json()};
  });
 };
 try{
  await page.goto(origin+'/apps/workbench/',{waitUntil:'networkidle'});
  check(await page.locator('#wbExplorer').isVisible(),'Live Workbench V8 explorer deployed');
  await act('session');connected=true;
  check(await page.locator('#wbExplorerMethod').innerText()==='POST','Real session POST method observed');
  check((await page.locator('#wbExplorerRoute').innerText())==='/apps/api/session','Exact guest API route observed');
  await act('save');
  check((await page.locator('#selected').innerText()).includes('Workflow:'),'Server saved a workflow ID');
  await act('run');
  check((await page.locator('#selected').innerText()).includes('Run:'),'Server returned a saved run ID');
  await act('import');
  check((await page.locator('#selected').innerText()).includes('Document:'),'Server returned an imported document ID');
  await act('search');
  check((await page.locator('#wbExplorerRows').innerText()).includes('results'),'Live retrieval response fields enumerated');
  await act('evaluate');
  check(Number(await page.locator('#wbExplorerFields').innerText())>0,'Actual evaluation JSON parsed');
  await act('replay');
  check(await page.locator('#wbExplorerState').innerText()==='SERVER REPLAY CONFIRMED','Server idempotent replay evidence shown');
  await act('evaluations');
  check((await page.locator('#wbExplorerRows').innerText()).includes('evaluations'),'Saved evaluation list read back');
  await page.locator('#wbExplorerFilter').fill('id');
  check(await page.locator('#wbExplorerRows li').count()>=1,'Real JSON field search filters readback');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No 390px overflow');
  check(errors.length===0,'No uncaught live JavaScript errors');
  const deleted=await reset();connected=false;
  check(deleted.status===200&&deleted.json.deleted===true,'Synthetic guest workspace deleted');
  console.log('TOTAL',n,'LIVE_D1_BROWSER_CHECKS_PASS');
 }finally{
  if(connected){try{const result=await reset();console.log('CLEANUP',JSON.stringify(result))}catch(e){console.error('CLEANUP_NOT_CONFIRMED',e.message)}}
  await context.close();await browser.close();
 }
})().catch(e=>{console.error(e.stack);process.exitCode=1});
