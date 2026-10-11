'use strict';
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/xlqxl/node_modules/playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const origin='https://jemueldaniel.website';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-first-run','--disable-extensions']});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('dialog',dialog=>dialog.accept());let done=0,connected=false;
 function check(value,label){assert.ok(value,label);done++;console.log('PASS',label)}
 try{
 await page.goto(origin+'/apps/agent/',{waitUntil:'networkidle'});
 check(await page.locator('#agentInspector').isVisible(),'Production V7 inspector actually deployed');
 check(await page.locator('#agentInspectorCopy').isDisabled(),'Cannot copy unverified receipt');
 await page.locator('#connect').click();
 await page.waitForFunction(()=>/Guest session active|Existing guest session verified/.test(document.querySelector('#status')?.textContent),null,{timeout:20000});
 connected=true;
 check((await page.locator('#ids').innerText()).includes('Workspace:'),'Real guest workspace ID obtained');
 await page.locator('#seed').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('saved to D1'),null,{timeout:30000});
 check((await page.locator('#ids').innerText()).includes('Selected source:'),'Real knowledge source stored');
 await page.locator('#query').fill('atomic evidence');
 await page.locator('#execute').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('provenance verified'),null,{timeout:60000});
 check((await page.locator('#agentInspectorStages').innerText())==='4 / 4','All four real API effects observed');
 check((await page.locator('#agentInspectorProof').innerText())==='Verified','D1 readback SHA256 verification shown');
 check(await page.locator('#agentInspectorCopy').isEnabled(),'True verified receipt is copyable');
 const old=await page.locator('#agentInspectorReceipt').innerText();
 check(old.includes('contentSha256')&&old.includes('artifactId'),'Server receipt contains actual artifact ID and digest');
 const stepEvents=await page.locator('#agentInspectorLedger li').count();
 check(stepEvents>=5,'Real server operations displayed in navigable ledger');
 await page.locator('#readback').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('revalidated after readback'),null,{timeout:20000});
 check((await page.locator('#agentInspectorProof').innerText())==='Verified','Independent re-readback remains verified');
 await page.locator('#retry').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('provenance verified'),null,{timeout:60000});
 const replay=await page.locator('#agentInspectorReceipt').innerText();
 const before=JSON.parse(old),after=JSON.parse(replay);
 check(before.runId===after.runId&&before.artifactId===after.artifactId,'Exact intent replay preserves server run and document ID');
 check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Real 390px page has no horizontal overflow');
 check(errors.length===0,'No browser page exceptions in production flow');
 await page.locator('#reset').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('workspace deleted'),null,{timeout:30000});
 connected=false;
 check((await page.locator('#agentInspectorStages').innerText())==='0 / 4','Revocation clears observed proof state');
 check(await page.locator('#agentInspectorCopy').isDisabled(),'Deleted workspace cannot show valid receipt');
 await page.reload({waitUntil:'networkidle'});
 check(await page.locator('#agentInspectorCopy').isDisabled(),'Reload after delete has no stale verified receipt');
 console.log('TOTAL',done,'LIVE_D1_BROWSER_CHECKS_PASS');
 }finally{
  if(connected){try{await page.locator('#reset').click({timeout:2000});await page.waitForTimeout(300)}catch(e){console.error('CLEANUP_NOT_CONFIRMED',e.message)}}
  await context.close();await browser.close();
 }
})().catch(error=>{console.error(error.stack);process.exitCode=1});
