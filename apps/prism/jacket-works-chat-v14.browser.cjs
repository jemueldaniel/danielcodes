'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE||undefined;
(async()=>{
 const [prism,micro,agent,wb,evidence]=await Promise.all([import('./worker.mjs'),import('./microapps-worker.mjs'),import('../agent/worker.mjs'),import('../workbench/worker.mjs'),import('../evidence/monochrome-worker.mjs')]);
 const server=http.createServer(async(req,res)=>{try{
  if(req.url==='/assets/portrait.jpg'){res.writeHead(200,{'content-type':'image/jpeg'});res.end(await fs.readFile(path.join(__dirname,'../../assets/portrait.jpg')));return}
  if(req.url==='/apps/labs/labs.mjs'){res.writeHead(200,{'content-type':'application/javascript'});res.end(await fs.readFile(path.join(__dirname,'../labs/labs.mjs')));return}
  if(req.url==='/api/chat/stream'&&req.method==='POST'){let raw='';for await(const b of req)raw+=b;const payload=JSON.parse(raw);res.writeHead(200,{'content-type':'text/event-stream','cache-control':'no-store'});res.end('data: '+JSON.stringify({type:'delta',text:'General question answered by the existing streamed assistant test fixture.'})+'\n\n'+'data: '+JSON.stringify({type:'done'})+'\n\n');return}
  const x=req.url.split('?')[0];
  const worker=x==='/'||x==='/apps/'||x.startsWith('/ui-20261011/')?prism.default:x.startsWith('/apps/workbench/')?wb.default:x.startsWith('/apps/agent/')?agent.default:x.startsWith('/apps/evidence/')?evidence.default:micro.default;
  const response=await worker.fetch(new Request('http://127.0.0.1'+req.url,{method:req.method}));
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end(e.stack)}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{}),args:['--no-first-run','--disable-extensions']});
 let count=0;const errs=[];function check(v,label){assert.ok(v,label);count++;console.log('PASS',label)}
 try{
 for(const width of [320,390,768,1440]){
  const ctx=await browser.newContext({viewport:{width,height:820},reducedMotion:'reduce'}),page=await ctx.newPage();page.on('pageerror',e=>errs.push(e.message));
  const response=await page.goto(origin+'/',{waitUntil:'networkidle'});
  check(response.status()===200,'Homepage HTTP200 @ '+width);
  check(await page.locator('#danielworks').isVisible(),'DanielWorks explorer present @ '+width);
  check(await page.locator('#dw14-track .dw14-card').count()===8,'Eight reviewed source cards @ '+width);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow on homepage @ '+width);
  const palette=await page.evaluate(()=>({surface:getComputedStyle(document.documentElement).getPropertyValue('--surface').trim(),background:getComputedStyle(document.body).backgroundColor,theme:document.documentElement.dataset.theme}));
  check(palette.surface==='#141e2d'&&palette.background==='rgb(10, 14, 21)'&&palette.theme==='dark','Dark coat and Ask navy/charcoal tokens @ '+width+' '+JSON.stringify(palette));
  check(await page.locator('#jd-popup-v9 .jd-launcher img').evaluate(img=>img.complete&&img.naturalWidth>0&&getComputedStyle(img).filter==='none'),'Original jacket portrait remains colorful @ '+width);
  await page.locator('#dw14-query').fill('BM25');
  check(await page.locator('#dw14-track .dw14-card:visible').count()===1,'Working source search filter @ '+width);
  check((await page.locator('#dw14-count').innerText()).includes('1 public proof module'),'Results count reflects actual filter @ '+width);
  await page.locator('#dw14-query').fill('');
  await page.locator('[data-dw-filter="frontend"]').click();
  check(await page.locator('#dw14-track .dw14-card:visible').count()===3,'UI category filter identifies three public frontend examples @ '+width);
  await page.locator('[data-dw-filter="all"]').click();
  check(await page.locator('#dw14-track .dw14-card:visible').count()===8,'All filters reset @ '+width);
  await page.locator('#dw14-track').focus();await page.keyboard.press('ArrowRight');
  check((await page.locator('#dw14-track').evaluate(el=>el.scrollLeft))>=0,'Keyboard carousel control @ '+width);
  check(await page.locator('#dw14-track a[href*="test_model.mjs"]').count()>=4,'Real test source links, not inert controls @ '+width);
  await page.locator('#jd-popup-v9 .jd-launcher').click();
  check(await page.locator('#jd-popup-v9 .jd-panel').isVisible(),'Nonmodal Ask opens @ '+width);
  await page.locator('#jd-popup-input').fill('Show me DanielWorks proof and tests');
  await page.locator('.jd-send').click();
  check((await page.locator('#jd-popup-messages').innerText()).includes('separate public engineering-evidence repository'),'Source-scoped portfolio NLP answer @ '+width);
  check((await page.locator('#jd-popup-messages a[href="/#danielworks"]').count())>=1,'NLP answer includes actionable DanielWorks link @ '+width);
  await page.locator('#jd-popup-input').fill('What about its limits?');await page.locator('.jd-send').click();
  check((await page.locator('#jd-popup-messages').innerText()).includes('historical and local test labels'),'Follow-up resolves earlier topic without invented claim @ '+width);
  const stored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('jd-public-chat-v14')));
  check(stored.topic==='danielworks'&&stored.messages.length>=4,'Bounded same-tab topic+dialogue history @ '+width);
  await page.goto(origin+'/apps/',{waitUntil:'networkidle'});
  check(await page.locator('#danielworks').isVisible(),'DanielWorks integrated in app catalog @ '+width);
  await page.locator('.jd-launcher').click();
  check((await page.locator('#jd-popup-messages').innerText()).includes('What about its limits?'),'Conversation continues across pages within tab @ '+width);
  await page.locator('.jd-clear').click();
  check(await page.evaluate(()=>sessionStorage.getItem('jd-public-chat-v14')===null),'Clear chat removes stored history @ '+width);
  check(await page.locator('#jd-popup-messages article').count()===1,'Clear resets visible chat instead of leaving sensitive messages @ '+width);
  await page.locator('#jd-popup-input').fill('Write a tiny haiku on testing');
  await page.locator('.jd-send').click();
  await page.waitForFunction(()=>document.querySelector('#jd-popup-messages article:last-child')?.textContent.includes('General question answered'),null,{timeout:6000});
  check((await page.locator('#jd-popup-messages').innerText()).includes('General question answered'),'Unknown open-ended intent still invokes existing streaming AI route @ '+width);
  await ctx.close();
 }
 check(errs.length===0,'Zero uncaught browser errors '+JSON.stringify(errs));
 console.log('TOTAL',count,'V14_REAL_EDGE_CHECKS_PASS');
 }finally{await browser.close();await new Promise((res,rej)=>server.close(e=>e?rej(e):res()))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
