'use strict';
/* Fail-closed generator: preserves original five microapps, pinned EVM and V15 Social source. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname,target=path.join(root,'microapps-worker.mjs'),read=f=>fs.readFileSync(path.join(root,f),'utf8').replace(/\r\n/g,'\n');
const source=fs.readFileSync(target,'utf8').replace(/\r\n/g,'\n');
const panel=read('interface-v17-panel.html'),css=read('interface-v17.css'),addon=read('interface-v17-addon.js');
assert.match(panel,/id="v17TabPanel"/);
assert.match(css,/prefers-reduced-motion:reduce/);
assert.match(addon,/personalInputExcluded:true/);
assert.doesNotMatch(addon,/fetch\(|XMLHttpRequest|WebSocket/);
const start='/* INTERFACE_V17_COMPILED_START */',end='/* INTERFACE_V17_COMPILED_END */';
const code=[
 start,
 'const INTERFACE_V17_PANEL='+JSON.stringify(panel)+';',
 'const INTERFACE_V17_CSS='+JSON.stringify(css)+';',
 'const INTERFACE_V17_ADDON='+JSON.stringify(addon)+';',
 'const INTERFACE_V17_PAGE_ANCHOR='+JSON.stringify('<div class="workspace">')+';',
 "if(PAGES.interface.split(INTERFACE_V17_PAGE_ANCHOR).length!==2)throw Error('INTERFACE_PAGE_ANCHOR_CHANGED');",
 "if(PAGES.interface.split('</head>').length!==2)throw Error('INTERFACE_HEAD_ANCHOR_CHANGED');",
 "if(PAGES.interface.split('</div></main>').length!==2)throw Error('INTERFACE_LEGACY_END_CHANGED');",
 "const INTERFACE_V17_EXTRAS='<details id=\"v17NativeExtras\" class=\"v17-native-extras\"><summary>Native control testbench <span>ADVANCED / ORIGINAL INTERACTIONS ↗</span></summary>';",
 "PAGES.interface=PAGES.interface.replace(INTERFACE_V17_PAGE_ANCHOR,INTERFACE_V17_PANEL+INTERFACE_V17_EXTRAS+INTERFACE_V17_PAGE_ANCHOR).replace('</div></main>','</div></details></main>').replace('Experience the states behind a polished interface.','Daniel Interface Lab').replace('</head>','<style id=\"interface-v17-style\">'+INTERFACE_V17_CSS+'</style></head>');",
 "const INTERFACE_V17_SCRIPT_ANCHOR=\"emit('ready',{mode:'browser-native controls'});\";",
 "if(SCRIPTS.interface.split(INTERFACE_V17_SCRIPT_ANCHOR).length!==2)throw Error('INTERFACE_SCRIPT_ANCHOR_CHANGED');",
 "SCRIPTS.interface=SCRIPTS.interface.replace(\"document.body.style.filter=value?'contrast(1.18)':'none'\",\"document.querySelector('.comp-preview').style.filter=value?'contrast(1.18)':'none'\");",
 "SCRIPTS.interface+='\\n'+INTERFACE_V17_ADDON;",
 end
].join('\n');
let targetSource;
if(source.includes(start)){
 assert.equal(source.split(start).length,2,'Multiple V17 blocks');
 assert.equal(source.split(end).length,2,'Missing or multiple V17 end markers');
 const i=source.indexOf(start),j=source.indexOf(end)+end.length;
 targetSource=source.slice(0,i)+code+source.slice(j);
}else{
 const anchor='const HEADERS=';
 assert.equal(source.split(anchor).length,2,'Worker router changed');
 targetSource=source.replace(anchor,code+'\n\n'+anchor);
}
if(process.argv.includes('--check')){
 assert.equal(source,targetSource,'Generated V17 Worker does not match authored sources');
 console.log('PASS exact V17 generator');
}else{
 fs.writeFileSync(target,targetSource,'utf8');
 console.log('Built V17 Interface Lab source; Worker bytes='+Buffer.byteLength(targetSource));
}
