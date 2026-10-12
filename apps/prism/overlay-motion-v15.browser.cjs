'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const EDGE=process.env.PLAYWRIGHT_EXECUTABLE||'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ROOT=path.resolve(__dirname,'../..');
(async()=>{
 const [prism,micro,agent,workbench,evidence]=await Promise.all([
  import('./worker.mjs'),import('./microapps-worker.mjs'),import('../agent/worker.mjs'),
  import('../workbench/worker.mjs'),import('../evidence/monochrome-worker.mjs')]);
 const routes=['/','/apps/','/apps/agent/','/apps/workbench/','/apps/evidence/','/apps/social/','/apps/code/','/apps/project/','/apps/interface/','/apps/contract/'];
 const server=http.createServer(async(req,res)=>{try{
  const url=req.url.split('?')[0];
  if(url==='/assets/portrait.jpg'){
   res.writeHead(200,{'content-type':'image/jpeg'});
   res.end(await fs.readFile(path.join(ROOT,'assets/portrait.jpg')));return;
  }
  const worker=url==='/'||url==='/apps/'||url.startsWith('/ui-20261011/')?prism.default
   :url.startsWith('/apps/agent/')?agent.default
   :url.startsWith('/apps/workbench/')?workbench.default
   :url.startsWith('/apps/evidence/')?evidence.default:micro.default;
  const response=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(err){res.writeHead(500);res.end(err.stack)}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const target=process.env.WORKFORM_LIVE_ORIGIN;
 if(target&&target!=='https://jemueldaniel.website')throw Error('Only the approved public origin may be tested');
 const origin=target||('http://127.0.0.1:'+server.address().port);
 const browser=await chromium.launch({headless:true,executablePath:EDGE,args:['--no-first-run','--disable-extensions']});
 let passed=0;const errors=[];
 const check=(condition,label)=>{assert.ok(condition,label);passed++;console.log('PASS',label)};
 try{
  for(const width of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'});
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   for(const route of routes){
    const response=await page.goto(origin+route,{waitUntil:'networkidle'});
    check(response.status()===200,route+' HTTP '+width);
    const initial=await page.evaluate(()=>{
     const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity!==0&&r.width>0&&r.height>0};
     const blockers=[...document.querySelectorAll('body *')].filter(el=>{
      if(el.closest('#jd-popup-v9')||!visible(el))return false;
      const s=getComputedStyle(el),r=el.getBoundingClientRect(),z=parseInt(s.zIndex,10)||0;
      const screenRatio=r.width*r.height/(innerWidth*innerHeight);
      const name=(String(el.className)+' '+el.id).toLowerCase();
      return (s.position==='fixed'&&s.pointerEvents!=='none'&&screenRatio>.18&&z>=5)||
       ((name.includes('backdrop')||name.includes('overlay'))&&screenRatio>.18&&s.pointerEvents!=='none'&&z>=5);
     }).map(el=>el.tagName.toLowerCase()+'#'+el.id+'.'+String(el.className).slice(0,90));
     const modal=[...document.querySelectorAll('dialog[open], [aria-modal="true"]')].filter(visible).length;
     const launch=document.querySelector('#jd-popup-v9 .jd-launcher');
     return {blockers,modal,overflow:document.documentElement.scrollWidth>innerWidth+1,
      launcher:launch&&visible(launch),hiddenPanel:!visible(document.querySelector('#jd-popup-v9 .jd-panel')),
      portrait:launch&&launch.querySelector('img')?.naturalWidth>0,
      bodyOverflow:document.body.style.overflow};
    });
    check(initial.blockers.length===0&&initial.modal===0,'No blocking overlay '+route+' '+width+' '+JSON.stringify(initial.blockers));
    check(!initial.overflow,'No overflow '+route+' '+width);
    check(initial.launcher&&initial.hiddenPanel&&initial.portrait,'Only Ask launcher visible '+route+' '+width);
    await page.locator('#jd-popup-v9 .jd-launcher').click();
    check(await page.locator('#jd-popup-v9 .jd-panel').isVisible(),'Nonmodal Ask opens '+route+' '+width);
    check(await page.locator('#jd-popup-v9 .jd-panel').getAttribute('aria-modal')==='false','Ask not modal '+route+' '+width);
    check(await page.evaluate(old=>document.body.style.overflow===old,initial.bodyOverflow),'Chat does not scroll-lock body '+route+' '+width);
    await page.keyboard.press('Escape');
    check(await page.locator('#jd-popup-v9 .jd-panel').isHidden(),'Ask Escape restores page '+route+' '+width);
    if(route==='/apps/social/'){
     await page.emulateMedia({reducedMotion:'no-preference'});
     check(await page.locator('.social-v15-board').first().evaluate(x=>getComputedStyle(x).animationName.includes('social-v15-appear')),'Social reveal motion active '+width);
     await page.emulateMedia({reducedMotion:'reduce'});
     check(await page.locator('.social-v15-board').first().evaluate(x=>getComputedStyle(x).animationName==='none'),'Reduced motion neutralizes reveal '+width);
    }
   }
   await context.close();
  }
  check(errors.length===0,'Zero uncaught page errors '+JSON.stringify(errors));
  console.log('WORKFORM_V15_NO_OVERLAY_PASS',passed);
 }finally{await browser.close();await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
