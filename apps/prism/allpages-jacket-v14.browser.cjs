'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http'),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||undefined;
(async()=>{
 const [prism,micro,agent,wb,evidence]=await Promise.all([import('./worker.mjs'),import('./microapps-worker.mjs'),import('../agent/worker.mjs'),import('../workbench/worker.mjs'),import('../evidence/monochrome-worker.mjs')]);
 const server=http.createServer(async(req,res)=>{try{
  if(req.url==='/assets/portrait.jpg'){res.writeHead(200,{'content-type':'image/jpeg'});res.end(await fs.readFile(path.join(__dirname,'../../assets/portrait.jpg')));return}
  if(req.url==='/apps/labs/labs.mjs'){res.writeHead(200,{'content-type':'application/javascript'});res.end(await fs.readFile(path.join(__dirname,'../labs/labs.mjs')));return}
  const url=req.url.split('?')[0],w=url==='/'||url==='/apps/'||url.startsWith('/ui-20261011/')?prism.default:url.startsWith('/apps/agent/')?agent.default:url.startsWith('/apps/workbench/')?wb.default:url.startsWith('/apps/evidence/')?evidence.default:micro.default;
  const r=await w.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end(e.stack)}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{}),args:['--no-first-run','--disable-extensions']});
 const routes=['/','/apps/','/apps/agent/','/apps/workbench/','/apps/evidence/','/apps/social/','/apps/code/','/apps/project/','/apps/interface/','/apps/contract/'];let count=0;const errors=[];function check(v,label){assert.ok(v,label);count++;console.log('PASS',label)}
 try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:820},reducedMotion:'reduce'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   const r=await page.goto(origin+route,{waitUntil:'networkidle'});
   check(r.status()===200,'HTTP 200 '+route+' '+width);
   const ui=await page.evaluate(()=>({bg:getComputedStyle(document.body).backgroundColor,theme:document.documentElement.dataset.theme,accent:getComputedStyle(document.documentElement).getPropertyValue('--prism-accent').trim(),surface:getComputedStyle(document.documentElement).getPropertyValue('--surface').trim(),overflow:document.documentElement.scrollWidth>innerWidth+1,brand:!!document.getElementById('jd-popup-v9-styles')}));
   check(ui.bg==='rgb(10, 14, 21)'&&ui.theme==='dark'&&ui.brand,'Shared jacket navy charcoal global background '+route+' '+width+' '+JSON.stringify(ui));
   check(ui.accent==='#bed8ff'&&ui.surface==='#141e2d','Consistent icy-blue and charcoal tokens '+route+' '+width);
   check(!ui.overflow,'No layout overflow '+route+' '+width);
   check(await page.locator('.jd-launcher img').evaluate(img=>img.complete&&img.naturalWidth>0&&getComputedStyle(img).filter==='none'),'Unfiltered original portrait '+route+' '+width);
   check(await page.locator('#jd-popup-v9 .jd-launcher').isVisible(),'Floating nonmodal chat launcher '+route+' '+width);
   await page.locator('.jd-launcher').click();
   check(await page.locator('#jd-popup-v9 .jd-panel').isVisible(),'Working popup '+route+' '+width);
   await page.keyboard.press('Escape');
   check(await page.locator('#jd-popup-v9 .jd-panel').isHidden(),'Keyboard closes popup '+route+' '+width);
  }
  await context.close();
 }
 check(errors.length===0,'No script exceptions: '+JSON.stringify(errors));
 console.log('TOTAL',count,'V14_SITEWIDE_PALETTE_CHECKS_PASS');
 }finally{await browser.close();await new Promise((r,j)=>server.close(e=>e?j(e):r()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
