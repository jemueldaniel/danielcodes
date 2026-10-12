/* Original V17 bounded Interface Lab enhancement. No network calls, no private source. */
(()=>{
'use strict';
const root=document.getElementById('v17Heading')?.closest('.v17-lab');
if(!root||root.dataset.ready==='true')return;
root.dataset.ready='true';
const find=id=>document.getElementById(id);
const screen=find('v17Device'),feedback=find('v17Feedback'),indicator=find('v17Orbit'),play=find('v17Run');
const KEY='daniel-interface-v17-session';
const widths=['320','390','768'],motions=['quiet','precise','expressive'],themes=['ink','contrast'],tabs=['overview','systems','activity'];
const categories=['viewport','motion','contrast','tab','save','run'];
const descriptions={
 overview:{code:'A / 01',label:'THE LIVE SYSTEM',title:'Designed to respond.',body:'Try a tab, save the work, or run the motion. The inspector records the resulting changes rather than inventing a success state.'},
 systems:{code:'B / 02',label:'THE DESIGN TOKENS',title:'Built to adapt.',body:'Same component, different widths and pacing. Changing controls updates the real preview without replacing the page or blocking input.'},
 activity:{code:'C / 03',label:'THE OBSERVABLE TRACE',title:'Evidence over spectacle.',body:'Every committed action is recorded in this browser tab. Export is inspectable and contains no names, chats or documents.'}
};
const empty=()=>({width:'390',motion:'precise',theme:'ink',tab:'overview',saved:false,runs:0,explored:[],log:[]});
let state=empty(),resetArmed=false;
try {
 const saved=JSON.parse(sessionStorage.getItem(KEY)||'null');
 if(saved&&typeof saved==='object'){
  if(widths.includes(saved.width))state.width=saved.width;
  if(motions.includes(saved.motion))state.motion=saved.motion;
  if(themes.includes(saved.theme))state.theme=saved.theme;
  if(tabs.includes(saved.tab))state.tab=saved.tab;
  state.saved=saved.saved===true;
  state.runs=Number.isSafeInteger(saved.runs)?Math.min(99,Math.max(0,saved.runs)):0;
  if(Array.isArray(saved.explored))state.explored=saved.explored.filter(x=>categories.includes(x)).slice(0,6);
  if(Array.isArray(saved.log))state.log=saved.log.filter(x=>x&&Number.isFinite(x.at)&&x.at>0&&typeof x.action==='string'&&x.action.length<=80).slice(-24).map(x=>({at:x.at,action:x.action}));
 }
}catch{}
let policy=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced-motion':'normal-motion';
const setStatus=t=>{find('v17Status').textContent=t};
const save=()=>{
 try{sessionStorage.setItem(KEY,JSON.stringify(state));return true}
 catch{setStatus('Tab storage is unavailable. The current controls still work, but reload continuity is not guaranteed.');return false}
};
function record(category,label){
 if(category&&!state.explored.includes(category))state.explored.push(category);
 state.log.push({at:Date.now(),action:label.slice(0,80)});
 state.log=state.log.slice(-24);
 const stored=save();
 if(stored)setStatus('Committed: '+label+' · Session only, no network.');
 render();
 try{emit('interface_v17',{action:label,scope:'browser-local'})}catch{}
}
const buttons=selector=>[...root.querySelectorAll(selector)];
function selectTab(id,fromUser=false){
 if(!tabs.includes(id))return;
 state.tab=id;
 buttons('[data-v17-tab]').forEach(button=>{
  const active=button.dataset.v17Tab===id;
  button.setAttribute('aria-selected',String(active));
  button.tabIndex=active?0:-1;
  if(active)find('v17TabPanel').setAttribute('aria-labelledby',button.id);
 });
 const d=descriptions[id];
 find('v17ViewCode').textContent=d.code;
 find('v17ViewLabel').textContent=d.label;
 find('v17ViewTitle').textContent=d.title;
 find('v17ViewBody').textContent=d.body;
 if(fromUser)record('tab','View switched to '+id);
}
function measure(){
 const targets=buttons('#v17Device button');
 const results=targets.map(b=>({label:b.getAttribute('aria-label')||b.textContent.trim(),rect:b.getBoundingClientRect()}));
 const ok=results.filter(x=>x.rect.height>=43.5&&x.rect.width>=43.5).length;
 const actual=Math.round(screen.getBoundingClientRect().width);
 const browser=window.innerWidth;
 find('v17Targets').textContent=ok+' / '+results.length+' ≥44px';
 find('v17Policy').textContent=policy()==='reduced-motion'?'REDUCE':'NORMAL';
 find('v17Rendered').textContent=actual+'px';
 find('v17ActualWidth').textContent=actual+' CSS px';
 find('v17BrowserWidth').textContent=browser+' CSS px';
 return {actual,browser,passes:ok,total:results.length,policy:policy()};
}
function render(){
 screen.dataset.motion=state.motion;screen.dataset.contrast=state.theme;
 screen.style.setProperty('--v17-width',state.width+'px');
 find('v17PreviewWidth').textContent=state.width+' CSS px requested';
 buttons('[data-v17-width]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v17Width===state.width)));
 buttons('[data-v17-motion]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v17Motion===state.motion)));
 buttons('[data-v17-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v17Theme===state.theme)));
 find('v17Save').setAttribute('aria-pressed',String(state.saved));
 find('v17Save').textContent=state.saved?'★':'☆';
 find('v17Save').setAttribute('aria-label',state.saved?'Unsave preview item':'Save preview item');
 find('v17EventCount').textContent=String(state.log.length);
 find('v17ProgressFill').style.width=Math.round(state.explored.length/categories.length*100)+'%';
 find('v17ProgressLabel').textContent=state.explored.length+' / '+categories.length;
 const hist=find('v17History');hist.replaceChildren();
 if(!state.log.length){
  const li=document.createElement('li');li.className='v17-empty';li.textContent='No actions recorded yet. Operate a control to start.';hist.append(li);
 }else{
  state.log.slice(-7).reverse().forEach((event,i)=>{
   const li=document.createElement('li'),num=document.createElement('b'),label=document.createElement('span');
   num.textContent=String(state.log.length-i).padStart(2,'0');label.textContent=event.action;
   li.append(num,label);hist.append(li)
  })
 }
 selectTab(state.tab,false);
 measure();
}
function disarm(){
 if(!resetArmed)return;
 resetArmed=false;find('v17Reset').textContent='Reset demo';
 find('v17Reset').dataset.confirming='false';
}
buttons('[data-v17-width]').forEach(button=>button.addEventListener('click',()=>{
 const v=button.dataset.v17Width;if(v===state.width)return;
 disarm();state.width=v;record('viewport','Viewport '+v+' CSS px');
}));
buttons('[data-v17-motion]').forEach(button=>button.addEventListener('click',()=>{
 const v=button.dataset.v17Motion;if(v===state.motion)return;
 disarm();state.motion=v;record('motion','Motion preference '+v);
}));
buttons('[data-v17-theme]').forEach(button=>button.addEventListener('click',()=>{
 const v=button.dataset.v17Theme;if(v===state.theme)return;
 disarm();state.theme=v;record('contrast','Preview contrast '+v);
}));
const tabButtons=buttons('[data-v17-tab]');
tabButtons.forEach((button,index)=>{
 button.addEventListener('click',()=>{disarm();if(button.dataset.v17Tab!==state.tab)selectTab(button.dataset.v17Tab,true)});
 button.addEventListener('keydown',event=>{
  let next=index;
  if(event.key==='ArrowRight')next=(index+1)%tabButtons.length;
  else if(event.key==='ArrowLeft')next=(index+tabButtons.length-1)%tabButtons.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=tabButtons.length-1;
  else return;
  event.preventDefault();tabButtons[next].focus();disarm();if(state.tab!==tabButtons[next].dataset.v17Tab)selectTab(tabButtons[next].dataset.v17Tab,true)
 })
});
find('v17Save').addEventListener('click',()=>{
 disarm();state.saved=!state.saved;record('save',state.saved?'Saved preview card':'Removed saved preview card');
});
play.addEventListener('click',()=>{
 disarm();state.runs=Math.min(99,state.runs+1);
 indicator.classList.remove('v17-running');play.classList.remove('v17-running');
 void indicator.offsetWidth;
 if(state.motion!=='quiet'&&policy()==='normal-motion'){indicator.classList.add('v17-running');play.classList.add('v17-running')}
 feedback.textContent='Interaction run #'+state.runs+' committed · '+(policy()==='reduced-motion'?'System reduced motion':'Motion '+state.motion)+'.';
 record('run','Executed interaction run '+state.runs);
});
find('v17Measure').addEventListener('click',()=>{
 disarm();const m=measure();
 record(null,'Measured '+m.passes+'/'+m.total+' targets · '+m.actual+'px');
});
find('v17Export').addEventListener('click',()=>{
 disarm();
 try{
  const m=measure();
  const payload={schema:'daniel-interface-browser-evidence-v1',kind:'fictional_public_demo',
   capturedAt:new Date().toISOString(),viewportRequested:Number(state.width),
   actualPreviewWidth:m.actual,browserViewportWidth:m.browser,
   reducedMotion:m.policy==='reduced-motion',motionMode:state.motion,contrastMode:state.theme,
   activeView:state.tab,previewSaved:state.saved,committedRuns:state.runs,
   tapTargetsAtLeast44px:{passing:m.passes,total:m.total},
   categoriesExplored:state.explored.slice(),events:state.log.slice(),personalInputExcluded:true,
   disclaimer:'Client-side measurements and synthetic interactions, not screen-reader or physical-device certification.'};
  const uri=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=uri;a.download='daniel-interface-lab-evidence.json';
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(uri),1700);
  setStatus('Downloaded a bounded, inspectable session record. No user-authored text included.');
 }catch{setStatus('Browser prevented the download. Live component state remains intact.')}
});
find('v17Reset').addEventListener('click',event=>{
 if(!resetArmed){
  event.stopImmediatePropagation();
  resetArmed=true;event.currentTarget.dataset.confirming='true';
  event.currentTarget.textContent='Confirm reset · demo session';
  setStatus('Click Confirm reset to clear only this simulated UI session, or press Escape to cancel.');
  return;
 }
 resetArmed=false;event.currentTarget.dataset.confirming='false';
 event.currentTarget.textContent='Reset demo';
 state=empty();try{sessionStorage.removeItem(KEY)}catch{}
 feedback.textContent='Ready to inspect.';render();setStatus('Simulation reset. Original Interface Lab controls were not affected.');
});
document.addEventListener('click',event=>{
 if(resetArmed&&!find('v17Reset').contains(event.target))disarm();
},true);
document.addEventListener('keydown',event=>{if(event.key==='Escape')disarm()},true);
window.addEventListener('resize',measure,{passive:true});
if('ResizeObserver'in window){try{new ResizeObserver(measure).observe(screen)}catch{}}
const motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');
if(motionQuery?.addEventListener){motionQuery.addEventListener('change',measure)}
render();
})();
