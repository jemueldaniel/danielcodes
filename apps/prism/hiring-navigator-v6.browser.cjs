'use strict';
const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/xlqxl/node_modules/playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
(async()=>{
 const worker=(await import('./worker.mjs')).default;
 const server=http.createServer(async(req,res)=>{
  try{
   if(req.url==='/assets/portrait.jpg'){res.writeHead(200,{'content-type':'image/jpeg'});res.end(await fs.readFile(path.join(__dirname,'../../assets/portrait.jpg')));return}
   const response=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){res.writeHead(500);res.end(error.stack)}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-first-run','--disable-extensions']});
 const ids=['workflow','knowledge','agent','social','pay','workbench','code','contract','interface','project'];
 const routes=['/apps/live/#workflow','/apps/live/#knowledge','/apps/agent/','/apps/social/','/apps/pay/','/apps/workbench/','/apps/code/','/apps/contract/','/apps/interface/','/apps/project/'];
 let pass=0;const errors=[];function check(ok,label){assert.ok(ok,label);pass++;console.log('PASS',label)}
 try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',err=>errors.push(err.message));
  await page.goto(origin+'/',{waitUntil:'networkidle'});
  check(await page.locator('html').getAttribute('data-theme')==='dark','Dark first-visit at '+width);
  check(await page.locator('#jdDemoSelect option').count()===10,'All ten distinct application options at '+width);
  check(await page.locator('#jdDemoName').innerText()==='Workflow Studio','Initial honest preview at '+width);
  check(await page.locator('#chatFab').isVisible(),'Ask Daniel launch button present at '+width);
  const fab=await page.locator('#chatFab').boundingBox();
  check(fab&&fab.x<width/2,'Ask launcher lower-left, not an overlay at '+width);
  await page.locator('#chatFab').click();
  check(await page.evaluate(()=>document.activeElement?.id)==='chatInput','Ask launcher focuses functional input at '+width);
  await page.locator('#jdDemoSelect').selectOption('pay');
  check((await page.locator('#jdDemoMode').innerText()).includes('no real funds'),'Fictional pay disclaimer appears at '+width);
  await page.locator('.jd-demo-nav__submit').click();
  const pay=page.locator('.jd-demo-answer').last();
  check((await pay.locator('p').innerText()).includes('No real assets'),'Pay card honestly describes no real funds at '+width);
  check(await pay.locator('a').first().getAttribute('href')==='/apps/pay/','Pay opens correct demo at '+width);
  check(await page.evaluate(()=>document.activeElement?.getAttribute('href'))==='/apps/pay/','Keyboard focus lands on real pay link at '+width);
  await page.locator('#jdDemoSelect').selectOption('contract');
  check((await page.locator('#jdDemoMode').innerText()).includes('EVM qualification pending'),'Unqualified EVM properly labeled at '+width);
  await page.locator('.jd-demo-nav__submit').click();
  const contract=page.locator('.jd-demo-answer').last();
  check((await contract.locator('p').innerText()).includes('does not yet demonstrate qualified offline EVM'),'Contract no false runtime claim at '+width);
  check(await contract.locator('a').first().getAttribute('href')==='/apps/contract/','Contract opens qualification page at '+width);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal page overflow at '+width);
  check(await page.locator('[aria-modal="true"]').count()===0,'No blocking dialog at '+width);
  if(width===390){
   for(let i=0;i<ids.length;i++){
    await page.locator('#jdDemoSelect').selectOption(ids[i]);
    await page.locator('.jd-demo-nav__submit').click();
    const result=page.locator('.jd-demo-answer').last();
    check(await result.locator('a').first().getAttribute('href')===routes[i],ids[i]+' evidence destination correct');
    const gh=await result.locator('a').last().getAttribute('href');
    check(gh.startsWith('https://github.com/jemueldaniel/danielcodes/'),ids[i]+' links to public reviewed source');
    check((await result.locator('p').innerText()).length>90,ids[i]+' has useful substantive technical scope');
   }
  }
  await context.close();
 }
 check(errors.length===0,'No uncaught JavaScript errors: '+JSON.stringify(errors));
 console.log('TOTAL',pass,'BROWSER_CHECKS_PASS');
 }finally{await browser.close();await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()))}
})().catch(error=>{console.error(error.stack);process.exitCode=1});