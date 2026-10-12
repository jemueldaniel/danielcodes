'use strict';
const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
(async()=>{
 const [micro,prism]=await Promise.all([import('./microapps-worker.mjs'),import('./worker.mjs')]);
 const server=http.createServer(async(req,res)=>{try{
  const url=req.url.split('?')[0];
  if(url==='/assets/portrait.jpg'){res.writeHead(200,{'content-type':'image/jpeg'});res.end(await fs.readFile(path.join(__dirname,'../../assets/portrait.jpg')));return}
  const worker=url==='/'||url==='/apps/'||url.startsWith('/ui-20261011/')?prism.default:micro.default;
  const response=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(err){res.writeHead(500);res.end(String(err.stack))}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const live=process.env.WORKFORM_LIVE_ORIGIN;
 if(live&&live!=='https://jemueldaniel.website')throw Error('Only approved public origin allowed');
 const origin=live||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-first-run','--disable-extensions']});
 let passed=0;
 const check=(good,label)=>{assert.ok(good,label);passed++;console.log('PASS '+label)};
 try{
 for(const width of [320,390,768,1440]){
  const ctx=await browser.newContext({viewport:{width,height:900},acceptDownloads:true,reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(origin+'/apps/interface/',{waitUntil:'networkidle'});
  check(response.status()===200,'HTTP 200 '+width);
  if(!live&&process.env.WORKFORM_CAPTURE&&(width===390||width===1440))await page.screenshot({path:path.resolve(__dirname,'../../v17-interface-'+width+'.png'),fullPage:true});
  check(await page.locator('#v17Heading').isVisible(),'Editor heading visible '+width);
  check(await page.locator('#v17Device').isVisible(),'App preview exists '+width);
  check(await page.locator('#v17Measure').isVisible(),'Accessibility inspector exists '+width);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow '+width);
  check((await page.locator('#v17Targets').innerText()).includes('≥44px'),'Real tap measurements '+width);
  check(await page.locator('#v17Policy').innerText()==='REDUCE','System reduced motion detected '+width);
  check(await page.locator('#v17ProgressLabel').innerText()==='0 / 6','No fabricated initial milestones '+width);
  const noBackdrop=await page.evaluate(()=>{
   const found=[...document.querySelectorAll('dialog[open], [aria-modal=true]')].filter(x=>getComputedStyle(x).display!=='none');
   return found.length===0&&document.body.style.overflow!=='hidden';
  });
  check(noBackdrop,'No blocking backdrop '+width);
  // A viewport button changes actual preview dimensions inside the available container.
  await page.locator('[data-v17-width="320"]').click();
  check(await page.locator('#v17PreviewWidth').innerText()==='320 CSS px requested','Width selection works '+width);
  check(await page.locator('[data-v17-width="320"]').getAttribute('aria-pressed')==='true','Viewport ARIA current '+width);
  await page.locator('[data-v17-width="768"]').click();
  check(await page.locator('#v17Device').evaluate(e=>e.getBoundingClientRect().width<=innerWidth),'Wide device gracefully constrained '+width);
  await page.locator('[data-v17-motion="expressive"]').click();
  check(await page.locator('#v17Device').getAttribute('data-motion')==='expressive','Motion preset updates '+width);
  await page.locator('[data-v17-theme="contrast"]').click();
  check(await page.locator('#v17Device').evaluate(e=>getComputedStyle(e).backgroundColor==='rgb(0, 0, 0)'),'High contrast scoped to stage '+width);
  check(await page.evaluate(()=>document.body.style.filter===''),'Portrait and whole body color filter untouched '+width);
  // Real WAI tab keyboard control, aria-selected and linked panel changes.
  await page.locator('#v17TabOverview').focus();
  await page.keyboard.press('ArrowRight');
  check(await page.locator('#v17TabSystems').getAttribute('aria-selected')==='true','Keyboard next tab '+width);
  check(await page.locator('#v17ViewTitle').innerText()==='Built to adapt.','Tab content really changes '+width);
  await page.keyboard.press('End');
  check(await page.locator('#v17TabActivity').getAttribute('aria-selected')==='true','End jumps to final tab '+width);
  check(await page.locator('#v17TabPanel').getAttribute('aria-labelledby')==='v17TabActivity','Panel labelled by current tab '+width);
  await page.locator('#v17Save').click();
  check(await page.locator('#v17Save').getAttribute('aria-pressed')==='true','Save action stores state '+width);
  await page.locator('#v17Run').click();
  check((await page.locator('#v17Feedback').innerText()).includes('run #1'),'Run committed, not a static result '+width);
  check(await page.locator('#v17Orbit').evaluate(el=>getComputedStyle(el).animationName==='none'),'System reduce blocks movement '+width);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('#v17Run').click();
  check(await page.locator('#v17Orbit').evaluate(el=>getComputedStyle(el).animationName.includes('v17-orbit-run')),'Fluid mode plays real orbit movement '+width);
  await page.locator('[data-v17-motion="quiet"]').click();
  await page.locator('#v17Run').click();
  check(await page.locator('#v17Orbit').evaluate(el=>getComputedStyle(el).animationName==='none'),'Quiet mode deliberately disables movement '+width);
  await page.locator('[data-v17-motion="expressive"]').click();
  await page.emulateMedia({reducedMotion:'reduce'});
  check(await page.locator('#v17ProgressLabel').innerText()==='6 / 6','All six milestone categories actually completed '+width);
  const realTargets=(await page.locator('#v17Targets').innerText()).match(/(\d+)\s*\/\s*(\d+)/);
  check(Boolean(realTargets)&&Number(realTargets[1])===Number(realTargets[2])&&Number(realTargets[2])>=5,'Actual 44px targets pass '+width);
  await page.locator('#v17Measure').click();
  check((await page.locator('#v17EventCount').innerText())!=='0','Measurement event recorded '+width);
  // Export must contain real event/state data but no user-supplied text or fabricated grade.
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#v17Export').click();
  const dl=await downloadPromise;
  const body=await fs.readFile(await dl.path(),'utf8'),proof=JSON.parse(body);
  check(dl.suggestedFilename()==='daniel-interface-lab-evidence.json','Named proof JSON downloaded '+width);
  check(proof.schema==='daniel-interface-browser-evidence-v1'&&proof.motionMode==='expressive'&&proof.contrastMode==='contrast','Proof matches actual choices '+width);
  check(proof.categoriesExplored.length===6&&proof.events.length>=6,'Proof reports committed categories and actions '+width);
  check(proof.personalInputExcluded===true&&!body.includes('thisisdanielsph@gmail.com'),'No private visitor input in export '+width);
  await page.reload({waitUntil:'networkidle'});
  check(await page.locator('#v17Save').getAttribute('aria-pressed')==='true','Same-tab save persists reload '+width);
  check(await page.locator('#v17ProgressLabel').innerText()==='6 / 6','Milestone history persists reload '+width);
  check(await page.locator('#v17TabActivity').getAttribute('aria-selected')==='true','Active tab persists reload '+width);
  // Reset is nonmodal, cancellable and isolated from legacy Interface Lab controls.
  await page.locator('#v17Reset').click();
  check((await page.locator('#v17Reset').innerText()).includes('Confirm reset'),'First click arms reset only '+width);
  await page.keyboard.press('Escape');
  check((await page.locator('#v17Reset').innerText())==='Reset demo','Escape cancels reset '+width);
  check(await page.locator('#v17Save').getAttribute('aria-pressed')==='true','Cancelled reset did not wipe state '+width);
  await page.locator('#v17Reset').click();
  await page.locator('#v17Reset').click();
  check(await page.locator('#v17ProgressLabel').innerText()==='0 / 6','Confirmed reset clears only this demo '+width);
  check(await page.locator('#v17Save').getAttribute('aria-pressed')==='false','Reset restored initial state '+width);
  // Original validated toggle/disclosure workflow remains runnable after the new editor.
  await page.locator('#v17NativeExtras>summary').click();
  check(await page.locator('#toggle').isVisible(),'Advanced native controls remain reachable '+width);
  await page.locator('#toggle').click();
  check(await page.locator('#toggle').getAttribute('aria-pressed')==='true','Original native control still works '+width);
  await page.locator('#disclosure summary').click();
  check(await page.locator('#disclosure').evaluate(el=>el.open),'Original disclosure still works '+width);
  // Shared Assistive Ask is nonmodal and does not lock the Interface canvas.
  check(await page.locator('#jd-popup-v9 .jd-launcher').isVisible(),'Floating Ask launcher present '+width);
  await page.locator('#jd-popup-v9 .jd-launcher').click();
  check(await page.locator('#jd-popup-v9 .jd-panel').isVisible(),'Ask popup opens '+width);
  check(await page.locator('#jd-popup-v9 .jd-panel').getAttribute('aria-modal')==='false','Ask is nonmodal '+width);
  await page.keyboard.press('Escape');
  check(await page.locator('#jd-popup-v9 .jd-panel').isHidden(),'Escape closes Ask '+width);
  check(errors.length===0,'No uncaught browser JS errors '+width+': '+JSON.stringify(errors));
  await ctx.close();
 }
 console.log('INTERFACE_V17_EDGE_PASS',passed);
 }finally{await browser.close();await new Promise((done,reject)=>server.close(e=>e?reject(e):done()))}
})().catch(err=>{console.error(err.stack);process.exitCode=1});
