'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/xlqxl/node_modules/playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
(async()=>{
 const worker=(await import('./worker.mjs')).default;
 const server=http.createServer(async(req,res)=>{
 try{
 if(req.url==='/assets/portrait.jpg'){res.writeHead(200,{'content-type':'image/jpeg'});res.end(await fs.readFile(path.join(__dirname,'../../assets/portrait.jpg')));return}
 const response=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end(e.stack)}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const remote=process.env.WORKFORM_LIVE_ORIGIN;
 if(remote&&remote!=='https://jemueldaniel.website')throw Error('Only verified domain allowed');
 const origin=remote||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-first-run','--disable-extensions']});
 let count=0;const errors=[];
 function check(value,label){assert.ok(value,label);count++;console.log('PASS',label)}
 const fixture=[
  {step:'plan',kind:'admitted_by_ui',evidence:{toolCount:4}},
  {step:'search',kind:'server',evidence:{documentId:'fake-source-id',passageSha256:'a'.repeat(64),score:1}},
  {step:'workflow.run',kind:'server',evidence:{runId:'12345678-fixture-only-run',workflowRevision:2}},
  {step:'artifact.save',kind:'server',evidence:{artifactId:'87654321-fixture-artifact',sourceRunId:'12345678-fixture-only-run'}},
  {step:'verify',kind:'server_readback',evidence:{runId:'12345678-fixture-only-run',artifactId:'87654321-fixture-artifact',sourceRunId:'12345678-fixture-only-run',contentSha256:'b'.repeat(64),documentRevision:1,verified:true}}
 ];
 try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:820},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/apps/agent/',{waitUntil:'networkidle'});
  check(await page.locator('#agentInspector').isVisible(),'Agent inspector appears at '+width);
  check((await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor))==='rgb(9, 9, 9)','True monochrome dark first visit at '+width);
  check(await page.locator('#agentInspectorCopy').isDisabled(),'No copied proof until verified at '+width);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow at '+width);
  check(await page.locator('.agent-ask-circle').isVisible(),'Lower-left Ask Daniel remains available at '+width);
  check(await page.locator('[aria-modal="true"]').count()===0,'No blocking overlays at '+width);
  await page.locator('#trace').evaluate((e,records)=>{e.textContent=JSON.stringify(records)},fixture);
  await page.waitForFunction(()=>document.getElementById('agentInspectorStages')?.textContent==='4 / 4');
  check(await page.locator('#agentInspectorProof').innerText()==='Verified','Observed real-shaped proof derives visual status at '+width);
  check(await page.locator('#agentInspectorLedger li').count()===5,'All five observed fixture events displayed at '+width);
  check(await page.locator('[data-agent-step][data-state="done"]').count()===4,'Stage markers only follow observed evidence at '+width);
  check(await page.locator('#agentInspectorCopy').isEnabled(),'Copy enabled only with verified receipt at '+width);
  check((await page.locator('#agentInspectorReceipt').innerText()).includes('browser Agent plan is not an atomic'),'Honest proof-scope disclosure at '+width);
  await page.locator('#agentInspectorLedger details').first().locator('summary').click();
  check(await page.locator('#agentInspectorLedger details').first().evaluate(el=>el.open),'Native nonmodal proof disclosure opens at '+width);
  await page.locator('#trace').evaluate(e=>{const x=JSON.parse(e.textContent);x.push({step:'error',kind:'failed_or_unresolved',evidence:'UNKNOWN_TRANSPORT'});e.textContent=JSON.stringify(x)});
  await page.waitForFunction(()=>document.getElementById('agentInspectorProof')?.textContent==='Review');
  check(await page.locator('#agentInspectorCopy').isDisabled(),'Later error disables prior verified copy at '+width);
  await page.locator('#trace').evaluate(e=>{e.textContent=JSON.stringify([{step:'verify',kind:'server_readback',evidence:{runId:'fixture',artifactId:'fixture',sourceRunId:'fixture',contentSha256:'e'.repeat(64),verified:true}}])});
  await page.waitForFunction(()=>document.getElementById('agentInspectorStages')?.textContent==='1 / 4');
  check(await page.locator('[data-agent-step][data-state="done"]').count()===1,'Readback alone cannot fabricate earlier stages at '+width);
  await page.locator('#trace').evaluate(e=>{e.textContent='Workspace revoked and deleted.'});
  await page.waitForFunction(()=>document.getElementById('agentInspectorStages')?.textContent==='0 / 4');
  check(await page.locator('#agentInspectorCopy').isDisabled(),'Reset removes stale receipt at '+width);
  check(await page.locator('#agentInspectorLedger .agent-inspector-empty').count()===1,'Reset clears operation ledger at '+width);
  await context.close();
 }
 check(errors.length===0,'No uncaught JavaScript errors '+JSON.stringify(errors));
 console.log('TOTAL',count,'BROWSER_CHECKS_PASS');
 }finally{await browser.close();await new Promise((r,j)=>server.close(e=>e?j(e):r()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
