'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/xlqxl/node_modules/playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const routes=['/','/apps/','/apps/agent/','/apps/workbench/','/apps/code/','/apps/project/','/apps/social/','/apps/interface/','/apps/contract/','/apps/evidence/'];
(async()=>{
 const [prism,micro,agent,workbench,evidence]=await Promise.all([import('./worker.mjs'),import('./microapps-worker.mjs'),import('../agent/worker.mjs'),import('../workbench/worker.mjs'),import('../evidence/monochrome-worker.mjs')]);
 const server=http.createServer(async(req,res)=>{
  try{
   const route=req.url.split('?')[0];
   if(route==='/assets/portrait.jpg'){res.writeHead(200,{'content-type':'image/jpeg'});res.end(await fs.readFile(path.join(__dirname,'../../assets/portrait.jpg')));return}
   if(route==='/favicon.ico'){res.writeHead(200,{'content-type':'image/png'});res.end(await fs.readFile(path.join(__dirname,'../../apple-touch-icon.png')));return}
   if(route==='/apps/labs/labs.mjs'){res.writeHead(200,{'content-type':'application/javascript'});res.end(await fs.readFile(path.join(__dirname,'../labs/labs.mjs')));return}
   if(route==='/api/chat/stream'&&req.method==='POST'){let body='';for await(const piece of req)body+=piece;if(!JSON.parse(body).question)throw Error('no question');res.writeHead(200,{'content-type':'text/event-stream','cache-control':'no-store'});res.end('data: '+JSON.stringify({type:'delta',text:'This is a sample public portfolio answer.'})+'\n\n'+'data: '+JSON.stringify({type:'done',evidence:[{area:'Public engineering examples'}]})+'\n\n');return}
   const worker=route.startsWith('/ui-20261011/')||route==='/'||route==='/apps/'?prism.default:route.startsWith('/apps/agent/')?agent.default:route.startsWith('/apps/workbench/')?workbench.default:route.startsWith('/apps/evidence/')?evidence.default:micro.default;
   const r=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
   res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));
  }catch(e){res.writeHead(500);res.end(String(e.stack))}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-first-run','--disable-extensions']});
 let count=0,errors=[];function check(ok,label){assert.ok(ok,label);count++;console.log('PASS',label)}
 try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:820},reducedMotion:'reduce'});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   const response=await page.goto(origin+route,{waitUntil:'networkidle'});
   check(response.status()===200,'Route '+route+' loaded at '+width);
   check(await page.locator('#jd-popup-v9 .jd-launcher').isVisible(),'Portrait chat launcher visible '+route+' '+width);
   check(await page.locator('#jd-popup-v9 .jd-panel').isHidden(),'Popup closed by default '+route+' '+width);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow '+route+' '+width);
   check(await page.locator('#jd-popup-v9 img').first().evaluate(el=>getComputedStyle(el).filter==='none'),'Natural color avatar '+route+' '+width);
   if(route==='/'){
    check(await page.locator('.mono-assistant').isHidden(),'Old embedded chat removed from visual flow '+width);
    check(await page.locator('#chatFab').isHidden(),'No duplicate old launcher '+width);
   }
   await page.locator('#jd-popup-v9 .jd-launcher').click();
   check(await page.locator('#jd-popup-v9 .jd-panel').isVisible(),'Nonmodal popup opens '+route+' '+width);
   check(await page.locator('#jd-popup-v9 textarea').evaluate(el=>document.activeElement===el),'Focus moves to message box '+route+' '+width);
   check(await page.locator('#jd-popup-v9 [aria-modal="false"]').count()===1,'Popup is nonmodal '+route+' '+width);
   const panelBox=await page.locator('#jd-popup-v9 .jd-panel').boundingBox();
   check(Boolean(panelBox&&panelBox.x>=0&&panelBox.x+panelBox.width<=width+1),'Popup fits viewport '+route+' '+width);
   await page.keyboard.press('Escape');
   check(await page.locator('#jd-popup-v9 .jd-panel').isHidden(),'Escape closes chat '+route+' '+width);
   if(route==='/apps/code/'||route==='/apps/agent/'){
    await page.locator('a[href="/#ask"]').first().click();
    check(await page.locator('#jd-popup-v9 .jd-panel').isVisible(),'Existing Ask link opens local popup without navigation '+route+' '+width);
    check(new URL(page.url()).pathname===route,'Ask does not navigate away '+route+' '+width);
    await page.locator('.jd-close').click();
   }
  }
  if(width===390){
   await page.goto(origin+'/apps/workbench/',{waitUntil:'networkidle'});
   await page.locator('.jd-launcher').click();
   await page.locator('#jd-popup-input').fill('What architecture decisions influence your engineering?');
   await page.locator('.jd-send').click();
   await page.waitForFunction(()=>[...document.querySelectorAll('#jd-popup-messages article')].some(x=>x.textContent.includes('This is a sample public portfolio answer.')),{timeout:4000});
   check(await page.locator('#jd-popup-messages').innerText().then(t=>t.includes('This is a sample public portfolio answer.')),'Streaming SSE answer works from app route');
   await page.locator('[data-jd-prompt]').first().click();
   check(await page.locator('#jd-popup-messages .jd-links a[href="/apps/"]').count()>0,'Useful app evidence links appear');
   const px=await page.evaluate(async()=>{let img=document.querySelector('#jd-popup-v9 .jd-launcher img');try{await img.decode()}catch{}let info={natural:[img.naturalWidth,img.naturalHeight],complete:img.complete,src:img.currentSrc};if(img.naturalWidth>0&&img.naturalHeight>0){let cv=document.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;cv.getContext('2d').drawImage(img,0,0);info.colors=[[.16,.16],[.4,.33],[.5,.5]].map(([x,y])=>{let p=cv.getContext('2d').getImageData(Math.floor(img.naturalWidth*x),Math.floor(img.naturalHeight*y),1,1).data;return [p[0],p[1],p[2]]})}return info});
   console.log('OBSERVED_AVATAR_COLOR_CHANNELS',JSON.stringify(px));check(px.natural[0]>0&&px.colors.some(c=>new Set(c).size>1),'Actual portrait bitmap retains original color channels');
  }
  await context.close();
 }
 check(errors.length===0,'Zero uncaught JS errors '+JSON.stringify(errors.slice(0,10)));
 console.log('TOTAL',count,'BROWSER_CHECKS_PASS');
 }finally{await browser.close();await new Promise((r,j)=>server.close(e=>e?j(e):r()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
