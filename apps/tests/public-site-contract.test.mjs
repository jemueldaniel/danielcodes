import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// No external dependencies, historical Workform source, or credentials.
const home=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const apps=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const labs=readFileSync(new URL('../labs/index.html',import.meta.url),'utf8');
const pay=readFileSync(new URL('../pay/index.html',import.meta.url),'utf8');
const pages=[['home',home],['catalog',apps],['labs',labs],['fictional-pay',pay]];
const ids=h=>[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);

test('ten planned apps have six accurately labeled browser previews',()=>{
 assert.equal((apps.match(/class="card"/g)||[]).length,10);
 assert.equal((apps.match(/class="tag">Browser preview<\/span>/g)||[]).length,6);
 assert.match(apps,/full suite acceptance are not yet qualified/i);
});

test('six demo entrypoints have corresponding controls',()=>{
 assert.match(apps,/data-open="workflow"/);
 assert.match(apps,/data-open="lab"/);
 assert.ok(apps.includes('href="/apps/pay/"'));
 assert.match(pay,/Fictional Daniel Coins have zero monetary value/);
 for(const app of ['code','interface','project']){
  assert.ok(apps.includes('/apps/labs/#'+app),'Missing catalog link for '+app);
  assert.ok(labs.includes('id="tab-'+app+'"'),'Missing lab tab for '+app);
 }
});

test('homepage retains five case-study limitations and hiring documents',()=>{
 assert.equal((home.match(/class="cap case-study"/g)||[]).length,5);
 assert.equal((home.match(/class="case-limit"/g)||[]).length,5);
 for(const href of ['/resume','/cover-letter','/apps/'])
  assert.ok(home.includes('href="'+href+'"'),'Missing '+href);
});

test('no duplicate HTML IDs or broken same-page links',()=>{
 for(const [name,html] of pages){
  const found=ids(html),unique=new Set(found);
  assert.equal(found.length,unique.size,name+' duplicate ID');
  for(const match of html.matchAll(/\bhref="#([^"]+)"/g))
   assert.ok(unique.has(match[1]),name+' broken fragment #'+match[1]);
 }
});

test('no private job tracker text or remote injected script',()=>{
 for(const [name,html] of pages){
  assert.ok(!/jemueldanieljobs|castractseedprompt/i.test(html),name+' private text');
  assert.ok(!/<script[^>]*\bsrc="https?:/i.test(html),name+' external script');
 }
});


test('Developer Workbench link names real HTTP scope without SDK or MCP claims',()=>{
 const marker=apps.match(/<article class="card"><div class="card-top"><span class="num">06 \/ APIs<\/span>[\s\S]*?<\/article>/)?.[0];
 assert.ok(marker,'API Workbench catalog card');
 assert.match(marker,/Live HTTP inspector/);
 assert.match(marker,/href="\/apps\/workbench\/"/);
 assert.match(marker,/SDK and MCP protocol support are not yet qualified/);
 assert.ok(apps.includes('href="/apps/workbench/"'),'Live HTTP inspector hero link');
});
