import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const css=read('motion-v16.css'),popup=read('popup-chat.js'),source=read('worker.mjs');
test('V16 motion build is reproducible and synchronized with the first-party popup',()=>{
 assert.match(execFileSync(process.execPath,[fileURLToPath(new URL('build-motion-v16.cjs',import.meta.url)),'--check'],{encoding:'utf8'}),/PASS V16/);
});
test('all added animations preserve visitors with reduced motion',()=>{
 assert.match(css,/@media\s*\(prefers-reduced-motion:no-preference\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/animation:none!important/);
 assert.match(css,/transform:none!important/);
});
test('motion is original local CSS without backdrop, overlays or third-party imports',()=>{
 assert.doesNotMatch(css,/(position:\s*fixed|z-index:\s*\d+|backdrop-filter|@import|https?:\/\/)/i);
 assert.match(css,/hp-app-tile/);
 assert.match(css,/hover:hover/);
 assert.match(css,/pointer:fine/);
});
test('live Worker serves popup source and preserves first-party routes',async()=>{
 const worker=(await import(new URL('worker.mjs',import.meta.url))).default;
 const response=await worker.fetch(new Request('https://workform.invalid/ui-20261011/chat-widget-v9.js'));
 assert.equal(response.status,200);
 const data=await response.text();
 assert.match(data,/WORKFORM_MOTION_V16_BEGIN/);
 assert.match(data,/JD_MOTION_V16_CSS/);
 assert.match(data,/prefers-reduced-motion:reduce/);
 assert.match(data,/aria-modal=\\?"false/);
});
test('V16 leaves product scope limited to style layer and old app interfaces',()=>{
 assert.match(popup,/jd-popup-v9-styles/);
 assert.match(source,/const JD_POPUP_TAG/);
 assert.ok(!css.includes('Daniel Coin')&&!css.includes('fetch('));
});
