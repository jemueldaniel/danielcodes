import {test} from 'node:test';
import assert from 'node:assert/strict';
import prism from './worker.mjs';
import micro from './microapps-worker.mjs';
const domain='https://jemueldaniel.website';
const read=async(w,path)=>{const r=await w.fetch(new Request(domain+path));assert.equal(r.status,200,path);return r.text()};
test('dark first-visit and circular Ask Daniel, without a floating dialog',async()=>{
 const h=await read(prism,'/');
 assert.match(h,/<html lang="en" data-theme="dark">/);
 assert.match(h,/applyTheme\(choice \|\| 'dark'\)/);
 assert.match(h,/id="chatFab"/);
 assert.doesNotMatch(h,/id="chatFab" hidden/);
 assert.match(h,/\.chat-fab,.chat-fab\[hidden\]\{display:flex!important/);
 assert.match(h,/left:max\(14px,env\(safe-area-inset-left/);
 assert.match(h,/id="chatPanel" role="region"/);
 assert.doesNotMatch(h,/aria-modal="true"/);
 assert.match(h,/id="hp-app-slider"/);
 assert.equal((h.match(/class="hp-app-tile /g)||[]).length,10);
 assert.match(h,/scroll-snap-type:x mandatory/);
});
test('catalog is swipeable with exact ten honest cards and filter compatibility',async()=>{
 const h=await read(prism,'/apps/');
 assert.match(h,/<html lang="en" data-theme="dark">/);
 assert.match(h,/id="appGrid" tabindex="0" role="region" aria-roledescription="carousel"/);
 assert.match(h,/id="appPrev"/);assert.match(h,/id="appNext"/);assert.match(h,/id="appPosition"/);
 assert.equal((h.match(/role="group" aria-roledescription="slide"/g)||[]).length,10);
 assert.match(h,/#appGrid\{display:flex!important/);
 assert.match(h,/scroll-snap-type:x mandatory/);
 assert.match(h,/new MutationObserver\(filterChanged\)/);
 assert.match(h,/var storedTheme=localStorage.getItem\('workform-site-theme'\)/);
 assert.match(h,/data-filter="local"/);assert.match(h,/id="appSearch"/);
});
test('five independent apps use dark-first palette and a real Ask link',async()=>{
 for(const path of ['/apps/code/','/apps/project/','/apps/interface/','/apps/social/','/apps/contract/']){
  const h=await read(micro,path);
  assert.match(h,/id="dark-first-mono"/,path);
  assert.match(h,/color-scheme:dark!important/,path);
  assert.match(h,/class="mono-floating-ask" href="\/#ask"/,path);
  assert.match(h,/prefers-reduced-motion/,path);
 }
});
test('social is actionable, honest and entirely synthetic',async()=>{
 const page=await read(micro,'/apps/social/');
 for(const id of ['persona','followToggle','postForm','postText','socialSearch','resetSocial','statPosts','statLikes','statFollowing','feed','feedCounter']){
  assert.ok(page.includes('id="'+id+'"'),id);
 }
 for(const v of ['data-social-mode="all"','data-social-mode="following"','data-social-mode="saved"','role="status"']){
  assert.ok(page.includes(v),v);
 }
 assert.match(page,/No real users, public publishing, backend accounts/);
 const js=await read(micro,'/apps/social/app.js');
 assert.doesNotThrow(()=>new Function(js));
 assert.match(js,/aria-pressed/);assert.match(js,/bookmarks/);
 assert.match(js,/follows/);assert.match(js,/p\.likes|x\.likes/);assert.match(js,/sessionStorage\.setItem/);
 assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|WebSocket|innerHTML\s*=/);
});

test('touch swipe has a bounded fallback that does not override already-scrolled native gestures',async()=>{
 const home=await read(prism,'/'),catalog=await read(prism,'/apps/');
 for(const source of [home,catalog]){
  assert.match(source,/addEventListener\('touchstart'/);
  assert.match(source,/addEventListener\('touchend'/);
  assert.match(source,/passive:true/);
  assert.match(source,/Math\.abs\(track\.scrollLeft-p\.start\)<24/);
 }
});
