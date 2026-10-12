(()=>{
'use strict';
const root=document.querySelector('#danielworks');if(!root)return;
const buttons=[...root.querySelectorAll('[data-dw-filter]')],cards=[...root.querySelectorAll('.dw14-card')],search=root.querySelector('#dw14-query'),track=root.querySelector('#dw14-track'),count=root.querySelector('#dw14-count');let category='all';
const apply=()=>{
 const term=search.value.trim().toLowerCase().normalize('NFKC').slice(0,90);
 let n=0;for(const card of cards){const kind=card.dataset.dwKind,hay=card.dataset.dwSearch;const show=(category==='all'||kind===category)&&(!term||hay.includes(term));card.hidden=!show;if(show)n++}
 count.textContent=n+' public proof module'+(n===1?'':'s')+' matching';
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dwFilter===category)));
 if(n===0){count.textContent='No public proof modules match. Clear the filter or search.'}
 track.scrollTo({left:0,behavior:'instant'});
};
buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.dwFilter;apply()}));
search.addEventListener('input',apply);
const nav=dir=>{const card=cards.find(c=>!c.hidden),width=card?.getBoundingClientRect().width||280;track.scrollBy({left:dir*(width+14),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};
root.querySelector('#dw14-prev').addEventListener('click',()=>nav(-1));
root.querySelector('#dw14-next').addEventListener('click',()=>nav(1));
track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();nav(event.key==='ArrowRight'?1:-1)}});
apply();
})();