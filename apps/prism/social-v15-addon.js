/* Original, bounded UI extension inside existing Social IIFE. */
const V15_KEY='daniel-social-action-proof-v15';
let v15History=[];
try {
 const read=JSON.parse(sessionStorage.getItem(V15_KEY)||'[]');
 if(Array.isArray(read))v15History=read.filter(x=>x&&Number.isFinite(x.at)&&x.at>0&&typeof x.event==='string'&&x.event.length<=150).slice(-18);
} catch {}
const v15Text=(id,content)=>{
 const node=$(id),next=String(content);
 if(node.textContent===next)return;
 node.textContent=next;
 if(node.matches('strong')&&typeof node.animate==='function'&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
  node.animate([{transform:'translateY(5px) scale(.94)',opacity:.5},{transform:'translateY(0) scale(1)',opacity:1}],{duration:340,easing:'cubic-bezier(.16,1,.3,1)'});
 }
};
function v15Refresh(){
 const ab=state.follows.A.includes('B'),ba=state.follows.B.includes('A');
 const edges=[['edgeAtoB','A → B',ab],['edgeBtoA','B → A',ba]];
 edges.forEach(([id,label,follow])=>{const node=$(id);node.textContent=label+(follow?' · following':' · not following');node.dataset.connected=String(follow)});
 v15Text('v15Edges',Number(ab)+Number(ba));
 v15Text('v15Replies',state.posts.reduce((n,p)=>n+p.comments.length,0));
 v15Text('v15Saves',state.bookmarks.A.length+state.bookmarks.B.length);
 const list=$('v15EventList');list.replaceChildren();
 if(!v15History.length){list.append(el('li','No recorded actions. Like, reply, follow, or post to inspect real state changes.'));return}
 v15History.slice().reverse().forEach(item=>{
   const li=el('li'),date=el('time',new Date(item.at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})),label=el('span',item.event);
   date.dateTime=new Date(item.at).toISOString();li.append(date,label);list.append(li)
 })
}
const v15OriginalRender=render;
render=function(){v15OriginalRender();v15Refresh()};
const v15OriginalMutate=mutate;
mutate=function(fn,message){
 const accepted=v15OriginalMutate(fn,message);
 if(!accepted)return false;
 const record={at:Date.now(),event:(who(active)+': '+message).slice(0,150)};
 v15History.push(record);v15History=v15History.slice(-18);
 try{sessionStorage.setItem(V15_KEY,JSON.stringify(v15History))}catch{v15Text('v15ProofStatus','Action saved; proof log could not persist in this tab.')}
 v15Refresh();return true;
};
$('v15Download').addEventListener('click',()=>{
 try{
  const payload={schema:'daniel-social-tab-proof-v1',scope:'fictional_session_tab',at:new Date().toISOString(),
   activePersona:who(active),summary:{posts:state.posts.length,replies:state.posts.reduce((n,p)=>n+p.comments.length,0),
    likes:state.posts.reduce((n,p)=>n+p.likes.length,0),followEdges:state.follows.A.length+state.follows.B.length,
    saves:state.bookmarks.A.length+state.bookmarks.B.length},
   relationshipEdges:{averyToMorgan:state.follows.A.includes('B'),morganToAvery:state.follows.B.includes('A')},
   actionHistory:v15History.slice(),privatePostBodiesExcluded:true,
   disclaimer:'Browser-local fictional state and timestamps, not server-attested proof of real users or production activity.'};
  const uri=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  const link=el('a');link.href=uri;link.download='daniel-social-tab-proof.json';document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(uri),2000);
  v15Text('v15ProofStatus','Saved bounded JSON receipt. Post and reply bodies are not included.');
 }catch{v15Text('v15ProofStatus','Browser could not generate a file. Your tab state is unchanged.')}
});
$('v15ClearLog').addEventListener('click',()=>{
 try{sessionStorage.removeItem(V15_KEY);v15History=[];v15Refresh();v15Text('v15ProofStatus','Activity log cleared; posts and reactions were preserved.')}
 catch{v15Text('v15ProofStatus','Browser storage denied clearing the action log.')}
});
const v15Reset=$('resetSocial');let v15ResetArmed=false;
v15Reset.addEventListener('click',event=>{
 if(!v15ResetArmed){
  event.stopImmediatePropagation();v15ResetArmed=true;
  v15Reset.dataset.confirming='true';v15Reset.textContent='Confirm reset · all synthetic posts';
  notice('Click Confirm reset to clear this fictional workspace, or continue using another control.');
  return;
 }
 v15ResetArmed=false;v15Reset.dataset.confirming='false';v15Reset.textContent='Reset synthetic workspace';
 try{sessionStorage.removeItem(V15_KEY);v15History=[]}catch{}
 queueMicrotask(v15Refresh);
},true);
function v15DisarmReset(){
 if(!v15ResetArmed)return;
 v15ResetArmed=false;v15Reset.dataset.confirming='false';
 v15Reset.textContent='Reset synthetic workspace';
}
document.addEventListener('click',event=>{
 if(v15ResetArmed&&!v15Reset.contains(event.target))v15DisarmReset();
},true);
document.addEventListener('keydown',event=>{
 if(event.key==='Escape')v15DisarmReset();
},true);
