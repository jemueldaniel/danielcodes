'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||undefined;
(async()=>{
 const [micro,prism]=await Promise.all([import('../prism/microapps-worker.mjs'),import('../prism/worker.mjs')]);
 const server=http.createServer(async(req,res)=>{
  try{
   if(req.url==='/assets/portrait.jpg'){res.writeHead(200,{'content-type':'image/jpeg'});res.end(await fs.readFile(path.join(__dirname,'../../assets/portrait.jpg')));return}
   const w=req.url.startsWith('/ui-20261011/')?prism.default:micro.default;
   const r=await w.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
   res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));
  }catch(e){res.writeHead(500);res.end(String(e.stack))}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{}),args:['--no-first-run','--disable-extensions']});
 let count=0;const errors=[],outsides=[];function check(ok,label){assert.ok(ok,label);count++;console.log('PASS',label)}
 try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:840},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('request',req=>{if(!req.url().startsWith(origin))outsides.push(req.url())});
  const resp=await page.goto(origin+'/apps/contract/',{waitUntil:'networkidle'});
  check(resp.status()===200,'Contract UI returns HTTP200 at '+width);
  check(await page.locator('#runSelected').isVisible(),'Distinct EVM control visible '+width);
  check(await page.locator('.scenario').count()===4,'Four distinct scenarios '+width);
  check(await page.locator('#jd-popup-v9 .jd-launcher').isVisible(),'Global Ask Daniel preserved '+width);
  check(await page.locator('#runLabel').innerText()==='IDLE · NOT RUN','No fake initial result '+width);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No mobile overflow '+width);
  await page.locator('#runSelected').click();
  await page.waitForFunction(()=>document.getElementById('runLabel')?.textContent==='REAL EVM · VERIFIED',null,{timeout:15000});
  check(await page.locator('#returnWord').innerText()==='42','Real EVM MUL returns 42 '+width);
  check(await page.locator('#gasUsed').innerText()==='26','Real EVM gas metering '+width);
  check(Number(await page.locator('#stepsCount').innerText())>=8,'Opcode trace is populated '+width);
  check(await page.locator('#copyReceipt').isEnabled(),'Actual receipt copy permitted after execution '+width);
  const data=JSON.parse(await page.locator('#receipt').innerText());
  check(data.passed&&data.returnWord==='42'&&data.metadata===undefined&&data.sha256.length===64,'SHA-256 receipt derived from bytecode '+width);
  await page.locator('[data-case="invariant"]').click();await page.locator('#runSelected').click();
  await page.waitForFunction(()=>document.getElementById('verdict')?.textContent==='PASS',null,{timeout:10000});
  check((await page.locator('#receipt').innerText()).includes('REVERT'),'Actual EVM REVERT qualifies '+width);
  await page.locator('[data-case="gas"]').click();await page.locator('#runSelected').click();
  await page.waitForFunction(()=>document.getElementById('verdict')?.textContent==='PASS',null,{timeout:10000});
  check((await page.locator('#receipt').innerText()).includes('OUT_OF_GAS'),'Real out-of-gas exception qualifies '+width);
  await page.locator('#runAll').click();await page.waitForFunction(()=>document.getElementById('runLabel')?.textContent.includes('4/4 VERIFIED'),null,{timeout:20000});
  check(await page.locator('#runLabel').innerText()==='4/4 VERIFIED OFFLINE CASES','Four EVM executions pass invariant matrix '+width);
  await page.locator('.jd-launcher').click();check(await page.locator('#jd-popup-v9 .jd-panel').isVisible(),'Ask Daniel popup opens '+width);
  await page.keyboard.press('Escape');check(await page.locator('#jd-popup-v9 .jd-panel').isHidden(),'Popup closes via keyboard '+width);
  await context.close();
 }
 check(errors.length===0,'Zero browser JS errors '+JSON.stringify(errors));
 check(outsides.length===0,'All requests remain same-origin, no RPC/CDN calls: '+JSON.stringify(outsides));
 console.log('TOTAL',count,'REAL_BROWSER_CHECKS_PASS');
 }finally{await browser.close();await new Promise((r,j)=>server.close(e=>e?j(e):r()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
