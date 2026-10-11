'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/xlqxl/node_modules/playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
(async()=>{
 const worker=(await import('./worker.mjs')).default;
 const server=http.createServer(async(req,res)=>{
 try{
 if(req.url==='/assets/portrait.jpg'){res.writeHead(200,{'content-type':'image/jpeg'});res.end(await fs.readFile(path.join(__dirname,'../../assets/portrait.jpg')));return}
 const r=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
 res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end(e.stack)}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const remote=process.env.WORKFORM_LIVE_ORIGIN;if(remote&&remote!=='https://jemueldaniel.website')throw Error('Only owner domain allowed');
 const origin=remote||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-first-run','--disable-extensions']});
 let n=0;const errors=[];function pass(ok,label){assert.ok(ok,label);n++;console.log('PASS',label)}
 try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));await page.goto(origin+'/apps/workbench/',{waitUntil:'networkidle'});
  pass(await page.locator('#wbExplorer').isVisible(),'Product JSON explorer available at '+width);
  pass(await page.locator('#wbExplorerState').innerText()==='NO CONFIRMED JSON','No fake response at '+width);
  pass(await page.locator('.wb-ask-circle').isVisible(),'Ask Daniel preserved at '+width);
  pass(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No mobile overflow at '+width);
  pass(await page.locator('[aria-modal="true"]').count()===0,'No obstructive dialog at '+width);
  await page.evaluate(()=>{
   document.getElementById('output').textContent=JSON.stringify({workflow:{id:'test-workflow-id',revision:2},replayed:false,measurements:{latency:17,passed:true}});
   document.getElementById('http-status').textContent='HTTP 200';
   document.getElementById('request-summary').textContent='POST /apps/api/workflows | 18ms client-observed | fixture-id';
  });
  await page.waitForFunction(()=>document.getElementById('wbExplorerMethod')?.textContent==='POST');
  pass(await page.locator('#wbExplorerRoute').innerText()==='/apps/api/workflows','Real-shaped route only when HTTP available '+width);
  pass(await page.locator('#wbExplorerLatency').innerText()==='18 ms','Only observed client latency appears '+width);
  pass(Number(await page.locator('#wbExplorerFields').innerText())>=4,'JSON structure flattened at '+width);
  pass((await page.locator('#wbExplorerRows').innerText()).includes('$.workflow.id'),'Nested field visible at '+width);
  await page.locator('#wbExplorerFilter').fill('revision');
  pass(await page.locator('#wbExplorerRows li').count()===1,'Interactive path search filters actual field at '+width);
  await page.locator('#wbExplorerClear').click();
  pass(Number(await page.locator('#wbExplorerRows li').count())>=4,'Clear filter restores fields at '+width);
  await page.evaluate(()=>{
   document.getElementById('output').textContent=JSON.stringify({run:{id:'same-id'},replayed:true});
   document.getElementById('http-status').textContent='HTTP 200';
   document.getElementById('request-summary').textContent='POST /apps/api/runs | 25ms client-observed | replay';
  });
  await page.waitForFunction(()=>document.getElementById('wbExplorerState')?.textContent==='SERVER REPLAY CONFIRMED');
  pass((await page.locator('#wbExplorerRows').innerText()).includes('$.replayed'),'Actual replayed:true rendered at '+width);
  await page.evaluate(()=>{
   document.getElementById('output').textContent='Unknown transport outcome';
   document.getElementById('http-status').textContent='Unknown';
  });
  await page.waitForFunction(()=>document.getElementById('wbExplorerFields')?.textContent==='0');
  pass(await page.locator('#wbExplorerRoute').innerText()==='—','Stale successful route cleared after unknown outcome at '+width);
  await page.evaluate(()=>{
   document.getElementById('output').textContent=JSON.stringify({answer:'<img src=x onerror=alert(1)>'});
   document.getElementById('http-status').textContent='HTTP 200';
   document.getElementById('request-summary').textContent='GET /apps/api/search | 8ms client-observed | fixture';
  });
  await page.waitForFunction(()=>document.getElementById('wbExplorerFields')?.textContent==='1');
  pass(await page.locator('#wbExplorerRows img').count()===0,'Untrusted JSON rendered as text, no HTML injection at '+width);
  await context.close();
 }
 pass(errors.length===0,'No uncaught browser errors '+JSON.stringify(errors));
 console.log('TOTAL',n,'BROWSER_CHECKS_PASS');
 }finally{await browser.close();await new Promise((r,j)=>server.close(e=>e?j(e):r()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
