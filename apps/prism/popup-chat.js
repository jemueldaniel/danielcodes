/* Workform V9 — original first-party, nonmodal Ask Daniel popup, shared by safe public routes. */
(()=>{
'use strict';
if(window.__JD_POPUP_V9__)return;
window.__JD_POPUP_V9__=true;
const css=`
/* Allow color photography to exist inside a polished high-contrast dark shell. */
img, picture img, .photoFrame img,.photoShell img,.site-mark img{filter:none!important;opacity:1!important;mix-blend-mode:normal!important}
body[data-jd-popup-v9="ready"] .mono-assistant,
body[data-jd-popup-v9="ready"] #chatFab,
body[data-jd-popup-v9="ready"] .catalog-ask-circle,
body[data-jd-popup-v9="ready"] .agent-ask-circle,
body[data-jd-popup-v9="ready"] .wb-ask-circle,
body[data-jd-popup-v9="ready"] .app-ask-circle,
body[data-jd-popup-v9="ready"] .social-ask-circle,
body[data-jd-popup-v9="ready"] .evidence-ask-circle{display:none!important}
#jd-popup-v9{position:relative;font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f8faff;letter-spacing:normal}
#jd-popup-v9 *{box-sizing:border-box}
#jd-popup-v9 [hidden]{display:none!important}
#jd-popup-v9 button,#jd-popup-v9 textarea{font:inherit;-webkit-tap-highlight-color:transparent}
#jd-popup-v9 button{cursor:pointer;touch-action:manipulation}
#jd-popup-v9 .jd-launcher{position:fixed;left:max(16px,env(safe-area-inset-left,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));width:66px;height:66px;display:grid;place-items:center;border-radius:50%;border:2px solid #f9fbff;background:#101827;padding:5px;box-shadow:0 10px 36px rgba(0,0,0,.55),0 0 0 5px rgba(89,147,255,.12);z-index:2147483000;transition:transform .18s ease,box-shadow .18s ease}
#jd-popup-v9 .jd-launcher:hover{transform:translateY(-3px);box-shadow:0 15px 40px rgba(0,0,0,.65),0 0 0 6px rgba(85,153,255,.2)}
#jd-popup-v9 .jd-launcher img{width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:center;filter:none!important;display:block}
#jd-popup-v9 .jd-launcher-indicator{position:absolute;right:0;bottom:3px;height:14px;width:14px;border-radius:50%;background:#81b5ff;border:3px solid #101827}
#jd-popup-v9 .jd-panel{position:fixed;left:max(16px,env(safe-area-inset-left,0px));bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:min(420px,calc(100vw - 32px));height:min(630px,calc(100dvh - 114px - env(safe-area-inset-top,0px)));min-height:250px;max-height:calc(100dvh - 104px);overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto auto;background:#101318;border:1px solid #4b586e;border-radius:20px;box-shadow:0 20px 90px rgba(0,0,0,.72);color:#f8faff;isolation:isolate;animation:jd-pop-in .17s ease-out}
#jd-popup-v9 .jd-head{display:flex;align-items:center;gap:11px;padding:13px 14px;background:linear-gradient(105deg,#1a2335,#121821);border-bottom:1px solid #303b4e;min-width:0}
#jd-popup-v9 .jd-head>img{width:41px;height:41px;flex:none;border-radius:50%;object-fit:cover;filter:none!important;border:1px solid #b8c6e0}
#jd-popup-v9 .jd-identity{min-width:0;flex:1}
#jd-popup-v9 .jd-identity strong{display:block;font-size:14px;font-weight:780;letter-spacing:-.025em}
#jd-popup-v9 .jd-identity small{display:block;margin-top:2px;font-size:11px;color:#b6c7e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#jd-popup-v9 .jd-close{width:39px;height:39px;display:grid;place-items:center;padding:0;border:1px solid #465570;border-radius:11px;color:#fafaff;background:#1e2839;font-size:24px;line-height:1}
#jd-popup-v9 .jd-chips{display:flex;gap:7px;padding:11px 12px;overflow-x:auto;scrollbar-width:thin;background:#131a24;border-bottom:1px solid #303a4c;min-height:55px}
#jd-popup-v9 .jd-chips button{white-space:nowrap;flex:none;min-height:34px;padding:7px 10px;color:#e7f1ff;border:1px solid #475874;border-radius:10px;background:#202b3e;font-size:11px;font-weight:660}
#jd-popup-v9 .jd-chips button:hover{background:#324868}
#jd-popup-v9 .jd-messages{display:flex;flex-direction:column;gap:12px;min-height:0;overflow:auto;overscroll-behavior:contain;padding:15px 13px 16px;scrollbar-width:thin;background:radial-gradient(ellipse at top right,rgba(46,69,111,.19),transparent 52%),#101318}
#jd-popup-v9 .jd-message{display:flex;flex-direction:column;gap:7px;max-width:94%;font-size:13px;line-height:1.6;overflow-wrap:anywhere;white-space:pre-wrap;border-radius:15px;padding:11px 13px;background:#202838;border:1px solid #35435a;color:#f2f5fc}
#jd-popup-v9 .jd-message[data-who="user"]{align-self:flex-end;background:#335784;border-color:#628cbd;color:white}
#jd-popup-v9 .jd-message[data-who="agent"]{align-self:flex-start}
#jd-popup-v9 .jd-message p{margin:0}
#jd-popup-v9 .jd-message small{color:#b4c3da;font-size:10px}
#jd-popup-v9 .jd-links{display:flex;flex-wrap:wrap;gap:7px}
#jd-popup-v9 .jd-links a{display:inline-flex;align-items:center;min-height:35px;border-radius:9px;border:1px solid #5375a5;color:#e3f1ff;background:#26364d;padding:7px 9px;font:700 11px/1.3 ui-sans-serif,system-ui;text-decoration:none;overflow-wrap:anywhere}
#jd-popup-v9 .jd-links a:hover{background:#38547d;color:white}
#jd-popup-v9 .jd-form{display:grid;grid-template-columns:minmax(0,1fr) 44px;gap:8px;align-items:end;padding:11px 12px;background:#17202c;border-top:1px solid #334055}
#jd-popup-v9 textarea{resize:none;display:block;width:100%;min-height:44px;max-height:110px;max-width:100%;padding:10px 12px;border:1px solid #51617b;border-radius:12px;background:#0e131d;color:#fff;font-size:16px!important;line-height:1.45}
#jd-popup-v9 textarea::placeholder{color:#9aaac1}
#jd-popup-v9 .jd-send{height:44px;width:44px;border-radius:12px;border:1px solid #d4e6ff;color:#0a1830;background:#d4e6ff;font-size:22px;font-weight:800;display:grid;place-items:center;padding:0}
#jd-popup-v9 .jd-send:hover{background:white}
#jd-popup-v9 .jd-send:disabled{opacity:.55;cursor:wait}
#jd-popup-v9 .jd-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;font-size:10px;line-height:1.3;color:#a7bad1;background:#17202c}
#jd-popup-v9 .jd-foot button{border:0;background:transparent;color:#b9d9ff;text-decoration:underline;font:700 10px/1.3 system-ui,sans-serif;padding:5px}
#jd-popup-v9 :is(button,textarea,a):focus-visible{outline:3px solid #9dccff!important;outline-offset:3px!important}
#jd-popup-v9 .jd-launcher:focus-visible{outline:3px solid #9dccff!important;outline-offset:5px!important}
@keyframes jd-pop-in{from{opacity:.25;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}
@media(max-width:550px){#jd-popup-v9 .jd-panel{left:10px;right:10px;width:auto;bottom:calc(87px + env(safe-area-inset-bottom,0px));height:min(640px,calc(100dvh - 102px - env(safe-area-inset-top,0px)));border-radius:16px}#jd-popup-v9 .jd-launcher{left:max(12px,env(safe-area-inset-left,0px));width:62px;height:62px}#jd-popup-v9 .jd-launcher img{width:48px;height:48px}}
@media(prefers-reduced-motion:reduce){#jd-popup-v9 *,#jd-popup-v9 *::before,#jd-popup-v9 *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;transform:none!important}}
@media print{#jd-popup-v9{display:none!important}}
`;
const style=document.createElement('style');style.id='jd-popup-v9-styles';style.textContent=css;document.head.appendChild(style);
const root=document.createElement('div');root.id='jd-popup-v9';
root.innerHTML=`<button class="jd-launcher" type="button" aria-label="Ask Daniel — open chatbot" aria-expanded="false" aria-controls="jd-popup-panel"><img src="/assets/portrait.jpg" width="52" height="52" alt=""><span class="jd-launcher-indicator" aria-hidden="true"></span></button>
<section class="jd-panel" id="jd-popup-panel" role="dialog" aria-modal="false" aria-labelledby="jd-popup-title" hidden>
<header class="jd-head"><img src="/assets/portrait.jpg" width="41" height="41" alt=""><div class="jd-identity"><strong id="jd-popup-title">Ask Daniel</strong><small>Portfolio AI assistant · public evidence only</small></div><button class="jd-close" type="button" aria-label="Close Ask Daniel chatbot">×</button></header>
<nav class="jd-chips" aria-label="Questions about my work"><button type="button" data-jd-prompt="Where can I try your live applications?">Explore live apps</button><button type="button" data-jd-prompt="What AI and agent systems have you built?">AI engineering</button><button type="button" data-jd-prompt="How can I contact you about a job?">Hire or contact</button></nav>
<div class="jd-messages" id="jd-popup-messages" role="log" aria-label="Ask Daniel conversation" aria-live="polite" aria-relevant="additions text"></div>
<form class="jd-form" id="jd-popup-form"><textarea rows="1" id="jd-popup-input" placeholder="Ask about my work…" aria-label="Your question for Ask Daniel" maxlength="800"></textarea><button class="jd-send" type="submit" aria-label="Send question">↑</button></form>
<footer class="jd-foot"><span>Public portfolio only · verify source links</span><button type="button" class="jd-stop">Stop answer</button></footer></section>`;
document.body.appendChild(root);
document.body.dataset.jdPopupV9='ready';
const launch=root.querySelector('.jd-launcher'),panel=root.querySelector('.jd-panel'),close=root.querySelector('.jd-close'),form=root.querySelector('.jd-form'),input=root.querySelector('textarea'),send=root.querySelector('.jd-send'),log=root.querySelector('.jd-messages'),stop=root.querySelector('.jd-stop');
let opener=null,task=null;
const links={apps:[['Browse 10 apps','/apps/']],evidence:[['Engineering proof','/apps/evidence/'],['Source code','https://github.com/jemueldaniel/danielworks']],hire:[['Résumé','/resume'],['Contact by email','mailto:thisisdanielsph@gmail.com?subject=Engineering%20Portfolio%20Inquiry']]};
function add(who,body,resourceLinks){
 const el=document.createElement('article');el.className='jd-message';el.dataset.who=who;
 const text=document.createElement('p');text.textContent=String(body).slice(0,16000);el.appendChild(text);
 const label=document.createElement('small');if(who==='agent'){label.textContent='Portfolio assistant · verify cited work';el.appendChild(label)}
 if(Array.isArray(resourceLinks)&&resourceLinks.length){const nav=document.createElement('nav');nav.className='jd-links';nav.setAttribute('aria-label','Public portfolio references');
 for(const [title,url] of resourceLinks){const a=document.createElement('a');a.href=url;a.textContent=title+' ↗';if(url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer'}nav.append(a)}el.append(nav)}
 log.append(el);log.scrollTop=log.scrollHeight;return {el,text,label};
}
add('agent','Hello! I can explain my engineering work, point you to live demos, and share public source evidence. Ask me anything about this portfolio.',[...links.apps,...links.evidence]);
function openChat(){
 if(!panel.hidden){input.focus({preventScroll:true});return}
 opener=document.activeElement;panel.hidden=false;launch.setAttribute('aria-expanded','true');input.focus({preventScroll:true});
}
function stopTask(){if(!task)return;task.ctl.abort();clearTimeout(task.timer);task=null;send.disabled=false}
function closeChat(){stopTask();panel.hidden=true;launch.setAttribute('aria-expanded','false');const previous=opener;opener=null;if(previous?.isConnected&&typeof previous.focus==='function')previous.focus({preventScroll:true});else launch.focus({preventScroll:true})}
window.openJDChat=openChat;window.closeJDChat=closeChat;window.AskDaniel={open:openChat,close:closeChat};
launch.addEventListener('click',()=>panel.hidden?openChat():closeChat());close.addEventListener('click',closeChat);stop.addEventListener('click',()=>{if(task){stopTask();add('agent','Answer stopped. You can ask another question.')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();closeChat()}});
document.addEventListener('click',e=>{
 const target=e.target instanceof Element?e.target.closest('a[href]'):null;if(!target||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0||target.target==='_blank')return;
 let url;try{url=new URL(target.href,location.href)}catch{return}
 if(url.origin===location.origin&&url.pathname==='/'&&url.hash==='#ask'){e.preventDefault();openChat()}
},true);
function quick(q){
 if(/\b(contract|evm|bytecode|solidity)\b/i.test(q))return{text:'Contract Lab now executes four actual allowlisted offline bytecode scenarios with EthereumJS EVM 10.1.3, returning observed gas, opcode steps, RETURN/REVERT/out-of-gas outcomes and a reproducible SHA-256 receipt. This does not deploy a Solidity contract, access a wallet, or send a blockchain transaction.',refs:[['Run Contract Lab','/apps/contract/'],...links.apps,...links.evidence]};
 if(/contact|hire|job|interview|recruit|resume|résumé/i.test(q))return {text:'For roles in AI engineering or full-stack software, you can review my résumé and contact me directly. My interactive demos and public repositories provide inspectable evidence, not guaranteed employment outcomes.',refs:[...links.hire,...links.evidence]};
 if(/apps|demo|try|run|source|proof|verify/i.test(q))return {text:'Explore all ten independently routed applications. Workflow/Knowledge and bounded Agent/Workbench use real guest API operations; several other demos are browser-local, and Contract Lab runs bounded offline EVM bytecode with no real chain transfers.',refs:[...links.apps,...links.evidence]};
 return null;
}
function parseFrames(buffer,onEvent,final=false){
 const norm=buffer.replace(/\r\n|\r/g,'\n');let fragments=norm.split('\n\n'),tail=fragments.pop();
 if(final&&tail.trim()){fragments.push(tail);tail=''}
 for(const frame of fragments){const lines=frame.split('\n').filter(x=>x.startsWith('data:')||x==='data');if(!lines.length)continue;const str=lines.map(x=>x==='data'?'':x.slice(5).replace(/^ /,'')).join('\n');onEvent(JSON.parse(str))}
 return tail;
}
async function ask(q){
 q=String(q||'').trim().slice(0,800);if(!q)return;
 stopTask();add('user',q);input.value='';
 const known=quick(q);if(known){add('agent',known.text,known.refs);return}
 const message=add('agent','Consulting public portfolio evidence…',[...links.apps,...links.evidence]);
 const ctl=new AbortController();const thisTask={ctl,timer:null,finished:false};task=thisTask;send.disabled=true;
 let answer='',bytes=0,buffer='',done=false,reader=null;
 thisTask.timer=setTimeout(()=>ctl.abort('timeout'),22000);
 try{
 const response=await fetch('/api/chat/stream',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:q}),credentials:'same-origin',signal:ctl.signal});
 if(!response.ok||!response.body)throw Error('The public assistant service did not return a usable response (HTTP '+response.status+').');
 reader=response.body.getReader();const decoder=new TextDecoder();
 const onEvent=event=>{if(!event||!['delta','done','error'].includes(event.type))throw Error('Unexpected response event');
  if(event.type==='delta'){if(typeof event.text!=='string'||answer.length+event.text.length>16000)throw Error('Answer too long');answer+=event.text;message.text.textContent=answer;log.scrollTop=log.scrollHeight}
  else if(event.type==='error')throw Error('The assistant service reported an error');
  else if(event.type==='done'){done=true;thisTask.finished=true;message.label.textContent='Answer completed · verify public references'}
 };
 while(!done){const part=await reader.read();if(part.done){buffer+=decoder.decode();parseFrames(buffer,onEvent,true);break}bytes+=part.value.byteLength;if(bytes>65536)throw Error('Stream limit exceeded');buffer=parseFrames(buffer+decoder.decode(part.value,{stream:true}),onEvent)}
 if(!done)throw Error('Connection ended before the answer was completed');
 }catch(error){if(task!==thisTask)return;message.label.textContent='Incomplete response';message.text.textContent=answer||'The assistant is temporarily unavailable. Use the public apps and contact links below.'}
 finally{clearTimeout(thisTask.timer);if(reader){try{reader.cancel()}catch{}}if(task===thisTask){task=null;send.disabled=false}}
}
form.addEventListener('submit',e=>{e.preventDefault();ask(input.value)});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();form.requestSubmit()}});
root.querySelectorAll('[data-jd-prompt]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.jdPrompt)));
if(location.hash==='#ask')openChat();
})();
