/* Reproducibly add original V15 Social experience without changing other microapps. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname,target=path.join(root,'microapps-worker.mjs');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const source=fs.readFileSync(target,'utf8');
const marker='/* SOCIAL_V15_COMPILED_START */',end='/* SOCIAL_V15_COMPILED_END */';
const panel=read('social-v15-panel.html'),css=read('social-v15.css'),addon=read('social-v15-addon.js');
assert.match(panel,/id="v15EventList"/);
assert.match(css,/@media\(prefers-reduced-motion/);
assert.match(addon,/const v15OriginalMutate=mutate/);
const patch=[marker,
 'const SOCIAL_V15_PANEL='+JSON.stringify(panel)+';',
 'const SOCIAL_V15_CSS='+JSON.stringify(css)+';',
 'const SOCIAL_V15_ADDON='+JSON.stringify(addon)+';',
 "const socialV15End='</div></aside>\\n</div></main>';",
 "if(PAGES.social.split(socialV15End).length!==2)throw Error('SOCIAL_ANCHOR_CHANGED');",
 "PAGES.social=PAGES.social.replace(socialV15End,'</div>'+SOCIAL_V15_PANEL+'</aside>\\n</div></main>').replace('</head>','<style id=\\\"social-v15-theme\\\">'+SOCIAL_V15_CSS+'</style></head>');",
 "const socialV15ScriptTail='render();\\n})();';",
 "if(SCRIPTS.social.split(socialV15ScriptTail).length!==2)throw Error('SOCIAL_SCRIPT_ANCHOR_CHANGED');",
 "SCRIPTS.social=SCRIPTS.social.replace(socialV15ScriptTail,SOCIAL_V15_ADDON+'\\n'+socialV15ScriptTail);",
 end].join('\n');
let output;
if(source.includes(marker)){
 assert.equal(source.split(marker).length,2,'multiple Social V15 starts');
 assert.equal(source.split(end).length,2,'multiple Social V15 ends');
 const start=source.indexOf(marker),stop=source.indexOf(end)+end.length;
 output=source.slice(0,start)+patch+source.slice(stop);
}else{
 const anchor='const HEADERS=';
 assert.equal(source.split(anchor).length,2,'microapps HEADERS anchor changed');
 output=source.replace(anchor,patch+'\n\n'+anchor);
}
if(process.argv.includes('--check')){
 assert.equal(source,output,'Social V15 worker does not match authored source');
 console.log('PASS social-v15 reproducible generated worker');
}else{
 fs.writeFileSync(target,output);
 console.log('Built '+target+', bytes='+Buffer.byteLength(output)+'; original extra apps and EVM unaffected');
}
