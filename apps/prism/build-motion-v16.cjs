'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname,popup=path.join(root,'popup-chat.js'),worker=path.join(root,'worker.mjs');
const read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const css=read(path.join(root,'motion-v16.css'));
assert.match(css,/prefers-reduced-motion:reduce/);
assert.doesNotMatch(css,/(backdrop-filter|position:\s*fixed|z-index:\s*\d+)/);
const current=read(popup),existingWorker=read(worker);
const BEGIN='/* WORKFORM_MOTION_V16_BEGIN */',END='/* WORKFORM_MOTION_V16_END */';
const rendered=[BEGIN,'const JD_MOTION_V16_CSS='+JSON.stringify(css)+';',END,''].join('\n');
const start=current.indexOf(BEGIN),stop=current.indexOf(END);
let updated;
if(start>=0){
 assert.ok(stop>start,'V16 end marker missing');
 updated=current.slice(0,start)+rendered+current.slice(stop+END.length+1);
}else{
 const anchor="const style=document.createElement('style');";
 assert.equal(current.split(anchor).length,2,'Popup stylesheet anchor moved');
 updated=current.replace(anchor,rendered+anchor);
}
const oldText="style.textContent=css+'\\n'+brandCSS;";
const newText="style.textContent=css+'\\n'+brandCSS+'\\n'+JD_MOTION_V16_CSS;";
if(updated.includes(oldText)){
 assert.equal(updated.split(oldText).length,2,'Duplicate original CSS injection');
 updated=updated.replace(oldText,newText);
}
assert.equal(updated.split(newText).length,2,'Popup stylesheet injection duplicated/missing');
const prefix='const JD_POPUP_V9=',tag='const JD_POPUP_TAG=';
const wi=existingWorker.indexOf(prefix),we=existingWorker.indexOf(tag,wi);
assert.ok(wi>=0&&we>wi,'Unexpected Prism worker structure');
const currentLiteral=existingWorker.slice(wi+prefix.length,we).trim();
assert.ok(currentLiteral.endsWith(';'),'Invalid popup module literal');
const embedded=JSON.parse(currentLiteral.slice(0,-1));
assert.ok(embedded.replace(/\r\n/g,'\n')===current,'Embedded existing popup differs from reviewed source');
const compiled=existingWorker.slice(0,wi)+prefix+JSON.stringify(updated)+';\n'+existingWorker.slice(we);
assert.ok(compiled.includes('JD_MOTION_V16_CSS'),'V16 missing from Worker');
if(process.argv.includes('--check')){
 assert.equal(current,updated,'Source popup is not generated up to date');
 assert.equal(existingWorker,compiled,'Prism Worker is not generated up to date');
 console.log('PASS V16 CSS + popup + production Prism Worker are exactly reproducible');
}else{
 fs.writeFileSync(popup,updated);
 fs.writeFileSync(worker,compiled);
 console.log('Built Workform V16 original motion into popup and Prism Worker; css bytes='+Buffer.byteLength(css));
}
