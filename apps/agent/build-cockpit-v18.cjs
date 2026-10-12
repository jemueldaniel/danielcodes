/* V18 deterministic source assembler. Fail closed on upstream route/DOM changes. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=__dirname,target=path.join(dir,'worker.mjs'),read=p=>fs.readFileSync(path.join(dir,p),'utf8').replace(/\r\n/g,'\n');
const source=read('worker.mjs'),css=read('cockpit-v18.css'),html=read('cockpit-v18.html'),client=read('cockpit-v18.js');
for(const id of ['av18Connect','av18Seed','av18Execute','av18Retry','av18Readback','av18Reset','av18EventList','av18Export'])assert.match(html,new RegExp('id="'+id+'"'));
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(css,/position:\s*fixed|backdrop-filter|@import|https?:\/\//);
assert.doesNotMatch(client,/\bfetch\s*\(|XMLHttpRequest|new WebSocket/);
assert.match(client,/verifiedReadback:true/);
const BEGIN='/* AGENT_V18_COMPILED_BEGIN */',END='/* AGENT_V18_COMPILED_END */';
const resetAnchor="if(!confirm('Delete all data in this temporary guest workspace? This cannot be undone.'))return;";
assert.ok(source.includes(resetAnchor),'Legacy reset confirmation changed');
const guard="if(window.__AGENT_V18_RESET_CONFIRMED__!==true){status('Use the Agent cockpit to confirm deletion inline.');return;}window.__AGENT_V18_RESET_CONFIRMED__=false;";
const patched=[
 BEGIN,
 'const AGENT_V18_HTML='+JSON.stringify(html)+';',
 'const AGENT_V18_CSS='+JSON.stringify('<style id="agent-v18-style">'+css+'</style>')+';',
 'const AGENT_V18_CLIENT='+JSON.stringify(client)+';',
 'const AGENT_V18_CLIENT_CORE=CLIENT.replace('+JSON.stringify(resetAnchor)+','+JSON.stringify(guard)+');',
 "const AGENT_V18_SECTION_ANCHOR='<section class=\"agent-visual-board\"';",
 "const AGENT_V18_END_ANCHOR='</div></main>';",
 "const AGENT_V18_LEGACY_SCRIPT='<script src=\"/apps/agent/inspector.js\" defer></script>';",
 "function agentV18Html(){",
 " let h=agentV7Html();",
 " if(h.split(AGENT_V18_SECTION_ANCHOR).length!==2||h.split(AGENT_V18_END_ANCHOR).length!==2||h.split(AGENT_V18_LEGACY_SCRIPT).length!==2)throw Error('AGENT_V18_BASE_DOM_CHANGED');",
 " h=h.replace('<body>','<body class=\"agent-v18-body\">').replace('Watch a bounded agent execute real tools.','Agent systems with inspectable receipts.');",
 " h=h.replace('</head>',AGENT_V18_CSS+'</head>');",
 " h=h.replace(AGENT_V18_SECTION_ANCHOR,AGENT_V18_HTML+'<details id=\"agentV18Advanced\"><summary>Advanced API plan and raw evidence <small>ORIGINAL OBSERVABLE TOOLS ↗</small></summary>'+AGENT_V18_SECTION_ANCHOR);",
 " h=h.replace(AGENT_V18_END_ANCHOR,'</div></details></main>');",
 " h=h.replace(AGENT_V18_LEGACY_SCRIPT,AGENT_V18_LEGACY_SCRIPT+'<script src=\"/apps/agent/cockpit.js\" defer></script>');",
 " return h;",
 "}",
 END
].join('\n');
let output;
if(source.includes(BEGIN)){
 assert.equal(source.split(BEGIN).length,2,'Multiple V18 starts');
 assert.equal(source.split(END).length,2,'Multiple V18 ends');
 const a=source.indexOf(BEGIN),b=source.indexOf(END)+END.length;
 output=source.slice(0,a)+patched+source.slice(b);
}else{
 const anchor='const JD_POPUP_V9_TAG=';
 assert.equal(source.split(anchor).length,2,'New agent app router changed');
 output=source.replace(anchor,patched+'\n\n'+anchor);
}
if(output.includes("return response(agentV7Html()"))output=output.replace("return response(agentV7Html().replace('</body>',JD_POPUP_V9_TAG+'</body>')","return response(agentV18Html().replace('</body>',JD_POPUP_V9_TAG+'</body>')");
assert.ok(output.includes("return response(agentV18Html()"),'Agent V18 route missing');
if(output.includes("return response(CLIENT,'application/javascript"))output=output.replace("return response(CLIENT,'application/javascript","return response(AGENT_V18_CLIENT_CORE,'application/javascript");
assert.ok(output.includes("return response(AGENT_V18_CLIENT_CORE,'application/javascript"),'Agent client route missing');
const insp="if(u.pathname==='/apps/agent/inspector.js')";
assert.equal(output.split(insp).length,2,'Legacy inspector route changed');
if(!output.includes("if(u.pathname==='/apps/agent/cockpit.js')"))output=output.replace(insp,"if(u.pathname==='/apps/agent/cockpit.js')return response(AGENT_V18_CLIENT,'application/javascript; charset=utf-8','public,max-age=120');"+insp);
if(process.argv.includes('--check')){
 assert.equal(source,output,'Generated V18 worker differs from source modules');
 console.log('PASS V18 exact compiled Agent worker');
}else{
 fs.writeFileSync(target,output);
 console.log('Generated scoped Agent V18 worker '+Buffer.byteLength(output)+' bytes');
}
