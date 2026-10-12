'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const edge=process.env.PLAYWRIGHT_EXECUTABLE||'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
(async()=>{
 const [prism,micro]=await Promise.all([import('./worker.mjs'),import('./microapps-worker.mjs')]);
 const server=http.createServer(async(req,res)=>{try{
  const name=req.url.split('?')[0];
  if(name==='/assets/portrait.jpg'){
   res.writeHead(200,{'content-type':'image/jpeg'});
   res.end(await fs.readFile(path.resolve(__dirname,'../../assets/portrait.jpg')));return;
  }
  const worker=name==='/'||name==='/apps/'||name.startsWith('/ui-20261011/')?prism.default:micro.default;
  const r=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
  res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end(e.stack)}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const target=process.env.WORKFORM_LIVE_ORIGIN;
 if(target&&target!=='https://jemueldaniel.website')throw Error('Unapproved production origin');
 const origin=target||('http://127.0.0.1:'+server.address().port);
 const browser=await chromium.launch({headless:true,executablePath:edge,args:['--no-first-run','--disable-extensions']});
 let passed=0;const errors=[];const check=(v,label)=>{assert.ok(v,label);passed++;console.log('PASS',label)};
 try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'no-preference'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/','/apps/','/apps/social/']){
   const r=await page.goto(origin+route,{waitUntil:'networkidle'});
   check(r.status()===200,route+' HTTP 200 @'+width);
   check(await page.locator('#jd-popup-v9-styles').evaluate(x=>x.textContent.includes('jd-v16-enter')),'Motion installed in first-party shared UI @'+route+' '+width);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No new overflow @'+route+' '+width);
   check(await page.locator('#jd-popup-v9 .jd-launcher').isVisible(),'Ask Daniel launcher stays accessible @'+route+' '+width);
   check(await page.locator('#jd-popup-v9 .jd-launcher').evaluate(x=>getComputedStyle(x).position==='fixed'),'Launcher remains lower-left fixed @'+route+' '+width);
   await page.locator('#jd-popup-v9 .jd-launcher').click();
   check(await page.locator('#jd-popup-v9 .jd-panel').evaluate(x=>getComputedStyle(x).display!=='none'&&x.getAttribute('aria-modal')==='false'),'Nonmodal Ask interaction @'+route+' '+width);
   await page.keyboard.press('Escape');
   check(await page.locator('#jd-popup-v9 .jd-panel').isHidden(),'Ask Escape closes @'+route+' '+width);
   await page.emulateMedia({reducedMotion:'reduce'});
   check(await page.locator('#jd-popup-v9 .jd-launcher-indicator').evaluate(x=>getComputedStyle(x).animationName==='none'),'Reduced motion turns off beacon @'+route+' '+width);
   await page.emulateMedia({reducedMotion:'no-preference'});
   if(route==='/'){
    check(await page.locator('.hero h1').evaluate(x=>getComputedStyle(x).animationName.includes('jd-v16-enter')),'Hero enters with purposeful motion @'+width);
    const tile=page.locator('.hp-app-tile').first();
    check(await tile.evaluate(x=>getComputedStyle(x).transitionProperty.includes('transform')),'Gallery tiles have tactile transitions @'+width);
    await tile.hover();
    check(await tile.evaluate(x=>getComputedStyle(x).transform!=='none'),'Hover moves tile on hover-capable device @'+width);
    await page.emulateMedia({reducedMotion:'reduce'});
    check(await tile.evaluate(x=>getComputedStyle(x).transform==='none'),'Reduced-motion cancels tile transform @'+width);
   }
  }
  await context.close();
 }
 check(errors.length===0,'No uncaught page errors: '+JSON.stringify(errors));
 console.log('WORKFORM_V16_MOTION_PASS',passed);
 }finally{await browser.close();await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
