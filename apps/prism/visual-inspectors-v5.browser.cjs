'use strict';
const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const launch=process.env.PLAYWRIGHT_EXECUTABLE||undefined;
(async()=>{
 const worker=(await import('./microapps-worker.mjs')).default;
 const server=http.createServer(async (req,res)=>{
  try {
   if(req.url==='/apps/labs/labs.mjs'){res.writeHead(200,{'content-type':'application/javascript'});res.end(await fs.readFile(path.join(__dirname,'../labs/labs.mjs')));return}
   if(req.url.startsWith('/favicon.ico')||req.url.startsWith('/assets/')){res.writeHead(404);res.end();return}
   const response=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
   res.writeHead(response.status,Object.fromEntries(response.headers));
   res.end(Buffer.from(await response.arrayBuffer()));
  }catch(e){res.writeHead(500);res.end(e.stack)}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin=process.env.WORKFORM_LIVE_ORIGIN==='https://jemueldaniel.website' ? 'https://jemueldaniel.website' : ('http://127.0.0.1:'+server.address().port);
 const browser=await chromium.launch({headless:true,...(launch?{executablePath:launch}:{}),args:['--no-first-run','--disable-extensions']});
 let count=0,errors=[];
 function verify(value,label){assert.ok(value,label);count++;console.log('PASS',label)}
 try {
  for(const viewport of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width:viewport,height:844},reducedMotion:'reduce'});
   const page=await context.newPage();
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/apps/code/',{waitUntil:'networkidle'});
   await page.waitForTimeout(100);
   verify(await page.locator('#vCodeResult').innerText()==='42','Code runtime produces a real default result at '+viewport);
   verify(await page.locator('#vCodeVerdict').innerText()==='Succeeded','Code visual verdict at '+viewport);
   verify(await page.locator('.visual-inspector__rail li[data-ok="true"]').count()===4,'Code engine stages reflect successful run '+viewport);
   verify(!(await page.locator('.visual-machine-evidence').evaluate(e=>e.open)),'Machine evidence initially hidden without overlay '+viewport);
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal body overflow '+viewport);
   await page.locator('.visual-machine-evidence summary').click();
   verify(await page.locator('#codeOutput').isVisible(),'Native disclosure reveals genuine machine output '+viewport);
   await page.locator('#invalid').click();
   verify(await page.locator('#vCodeVerdict').innerText()==='Rejected','Invalid source visibly rejected at '+viewport);
   verify(await page.locator('#vCodeResult').innerText()==='—','Stale result erased after error '+viewport);
   await context.close();
  }
  {
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/apps/project/',{waitUntil:'networkidle'});
   await page.locator('#saveFile').click();
   verify(await page.locator('#vProjectFiles').innerText()==='1','Project one file saved to tab');
   verify(await page.locator('#vProjectRevision').innerText()==='1','Project first revision counted');
   await page.locator('#fileBody').fill('# Engineering notes\nAn independent second version.');
   await page.locator('#saveFile').click();
   verify(await page.locator('#vProjectRevision').innerText()==='2','Project second revision counted');
   await page.locator('#compareFile').click();
   verify(await page.locator('#vProjectChanges li').count()>=1,'Project visual diff shows actual changes');
   await page.locator('#restoreFile').click();
   verify(await page.locator('#vProjectRevision').innerText()==='3','Project restore is a new revision');
   await page.reload({waitUntil:'networkidle'});
   verify(await page.locator('#vProjectFiles').innerText()==='1','Project revision saved after reload');
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Project no mobile overflow');
   await context.close();
  }
  {
   const context=await browser.newContext({viewport:{width:320,height:690},reducedMotion:'reduce'});
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/apps/interface/',{waitUntil:'networkidle'});
   verify(Number(await page.locator('#vInterfaceEvents').innerText())>=1,'Interface ready event recorded');
   await page.locator('#toggle').click();
   verify(await page.locator('#toggle').getAttribute('aria-pressed')==='true','Interface toggle action real');
   await page.locator('#disclosure summary').click();
   await page.waitForFunction(()=>Number(document.getElementById('vInterfaceEvents')?.textContent)>=3,{timeout:3000});
   verify(Number(await page.locator('#vInterfaceEvents').innerText())>=3,'Interface native interaction telemetry updates');
   await page.locator('#showDialog').click();
   verify(await page.locator('#sampleDialog').isVisible(),'Interface focus panel appears inline');
   verify(await page.evaluate(()=>document.activeElement?.id)==='closeDialog','Focus moves to inline Close button');
   await page.locator('#closeDialog').click();
   verify(!(await page.locator('#sampleDialog').isVisible()),'Inline panel closes without overlay');
   verify(await page.evaluate(()=>document.activeElement?.id)==='showDialog','Focus returned to opener');
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Interface no 320px overflow');
   await context.close();
  }
  verify(errors.length===0,'No uncaught browser errors ('+JSON.stringify(errors)+')');
  console.log('TOTAL',count,'BROWSER_CHECKS_PASS');
 } finally {await browser.close();await new Promise((r,j)=>server.close(e=>e?j(e):r()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
