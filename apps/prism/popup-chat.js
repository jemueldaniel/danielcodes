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
const brandCSS="/* Workform V14: original jacket-derived charcoal/ivory + Ask Daniel midnight navy tokens.\n   This layer is loaded with the first-party shared Ask Daniel module on safe HTML routes only.\n   User-selected light theme is retained as a crisp neutral variant; new visits default to dark. */\n:root{\n --jd-ink0:#0a0e15;--jd-ink1:#101827;--jd-ink2:#182335;--jd-ink3:#243650;\n --jd-paper:#f5f5f1;--jd-ivory:#ecece5;--jd-blue:#bfd9ff;\n --jd-border:#40516a;--jd-border-strong:#728eae;--jd-subtext:#c1cbd9;\n --prism-accent:#bed8ff;--prism-charcoal:#121b29;\n --jd-font:Inter,-apple-system,BlinkMacSystemFont,\"Segoe UI\",ui-sans-serif,system-ui,sans-serif;\n}\n:root:not([data-theme=\"light\"]){\n color-scheme:dark;\n --bg:#0a0e15;--card:#131c2a;--surface:#141e2d;--surface2:#1b293b;\n --surface3:#23344b;--ink:#f5f7fc;--fg:#f5f7fc;--ivory:#eeeee8;\n --muted:#bdc8d8;--muted2:#a6b9d0;--line:#71849d;--line2:#34465f;\n --focus:#c7dfff;--soft:#1a2636;--accent:#c5dfff;--inverse:#0d1726;\n --sub:#202e42;--radius:10px;--shadow:0 14px 45px rgba(0,0,0,.38);\n}\n:root[data-theme=\"light\"]{\n color-scheme:light;--bg:#f5f5f1;--surface:#ffffff;--surface2:#eff1f4;\n --surface3:#e5ebf3;--card:#ffffff;--ink:#121a28;--fg:#121a28;\n --ivory:#172337;--muted:#455266;--muted2:#50617b;--line:#6a7e98;\n --line2:#b7c2d0;--focus:#1b3f72;--soft:#e8edf4;--accent:#203e64;\n --inverse:#f8fafc;--sub:#f1f4f8;--radius:10px;--shadow:0 14px 40px rgba(18,28,44,.13);\n}\nhtml:not([data-theme=\"light\"]), html:not([data-theme=\"light\"]) body{\n background-color:#0a0e15!important;color:#f5f7fc;\n}\nhtml:not([data-theme=\"light\"]) body{\n background-image:radial-gradient(ellipse at 85% 0%,rgba(32,54,84,.21),transparent 62%);\n}\nhtml[data-theme=\"light\"],html[data-theme=\"light\"] body{background-color:#f5f5f1;color:#121a28}\nhtml:not([data-theme=\"light\"]) :is(.topbar,.top,.app-topbar,.site-header,.header,.nav-bar){\n background-color:#101827!important;border-color:#354961!important;\n}\nhtml:not([data-theme=\"light\"]) :is(.surface,.card,.cap,.labCard,.interfaceCard,.evidence,.researchMain,.researchSide,.best,.panel,.sidebar,.social-sidebar,.social-center,.social-info-card,.social-profile-card,.visual-inspector,.app-shell,.workspace,.result-section,.agent-inspector,.wb-explorer,.site-card){\n background-color:#141e2d!important;border-color:#3a4e69!important;\n}\nhtml:not([data-theme=\"light\"]) :is(.surface2,.sub,.mock,.out,.code,.step-list li,.step-list,.file-list,.feed,.social-composer,.social-filterbar,.social-tabs,.social-feed-head,.result,.site-stats,.metric,.stat,.tag,.chip){\n border-color:#3d5069!important;\n}\nhtml:not([data-theme=\"light\"]) :is(.btn,.pill,.iconlink,.sourceLink,.promptChip,.filter-button){\n border-color:#587291!important;border-radius:10px;color:#f2f6ff;background-color:#202e42;\n}\nhtml:not([data-theme=\"light\"]) :is(.btn,.pill,.iconlink,.sourceLink,.promptChip,.filter-button):hover{\n border-color:#b3d2fa;background-color:#304764;color:white;\n}\nhtml:not([data-theme=\"light\"]) :is(.btn.primary,.mono-main-ask,.heroActions .primary){\n border-color:#e5eaf1!important;background-color:#e5eaf1!important;color:#0d1828!important;\n}\nhtml:not([data-theme=\"light\"]) :is(.btn.primary,.mono-main-ask,.heroActions .primary):hover{\n background-color:#fff!important;color:#0a1321!important;\n}\nhtml:not([data-theme=\"light\"]) :is(input,textarea,select){\n border-color:#516480!important;\n}\nhtml:not([data-theme=\"light\"]) :is(h1,h2,h3,.role,.eyebrow,.kicker){text-wrap:pretty}\nhtml:not([data-theme=\"light\"]) :is(.tag,.chip,.badge,.status,.microcopy){color:#c7d6e9}\nhtml:not([data-theme=\"light\"]) a:not(#jd-popup-v9 a){text-underline-offset:3px}\nhtml:not([data-theme=\"light\"]) :is(.app-art,.hp-app-visual,.card-top,.app-preview,.app-mock){\n filter:none!important;\n}\n:root :is(.photoFrame img,.photoShell img,.jd-launcher img,.site-mark img,.social-avatar img, .portrait img, img){\n filter:none!important;mix-blend-mode:normal!important;opacity:1!important;\n}\nhtml:not([data-theme=\"light\"]) :is(button,a,input,textarea,select,summary):focus-visible{\n outline:3px solid #c5dcff!important;outline-offset:3px!important;\n}\nbody[data-jd-popup-v9=\"ready\"] :is(.mono-floating-ask,.mono-ask-fab,.floating-ask,.ask-floating,.chatBubble){\n display:none!important;\n}\n@media(min-width:600px){\n html:not([data-theme=\"light\"]) :is(.cap,.card,.labCard,.interfaceCard,.evidence){\n transition:border-color .16s ease,background-color .16s ease,transform .16s ease;\n }\n html:not([data-theme=\"light\"]) :is(.cap,.card,.labCard,.interfaceCard,.evidence):hover{\n border-color:#7099cc!important;\n }\n}\n@media(max-width:600px){\n html,body{max-width:100%;overflow-x:clip}\n :root :is(.surface,.panel,.card,.cap,.labCard,.interfaceCard,.evidence){max-width:100%;min-width:0}\n}\n@media(prefers-reduced-motion:reduce){\n :root *, :root *::before, :root *::after{transition-duration:0s!important;animation-duration:0s!important;scroll-behavior:auto!important}\n}\n\n:root:not([data-theme=\"light\"]) .hero h1 em{color:#c5dfff!important}\n:root:not([data-theme=\"light\"]) :is(.prism-dot,.hero .prism-dot){background:#9bc6ff!important;box-shadow:0 0 0 4px rgba(155,198,255,.18)!important}\n:root:not([data-theme=\"light\"]) :is(.eyebrow,.mono-eyebrow,.hp-app-symbol){color:#aecbf2!important}\n";
/* WORKFORM_MOTION_V16_BEGIN */
const JD_MOTION_V16_CSS="/* Workform V16 — original first-party motion. No overlays, loaders or third-party runtime. */\n:root { --jd-motion-ease:cubic-bezier(.2,.78,.22,1); --jd-motion-quick:180ms; --jd-motion-calm:320ms; }\n@keyframes jd-v16-enter {from{opacity:.35;transform:translate3d(0,10px,0)}to{opacity:1;transform:none}}\n@keyframes jd-v16-beacon {0%,100%{box-shadow:0 0 0 0 rgba(190,216,255,.08)}50%{box-shadow:0 0 0 6px rgba(190,216,255,.13)}}\n@media (prefers-reduced-motion:no-preference) {\n  :is(.hero h1,.hero .role,.hero .eyebrow,.hero .heroActions,.hp-app-top h2,.app-hero h1) {\n    animation:jd-v16-enter 620ms var(--jd-motion-ease) both;\n  }\n  :is(.hp-app-tile,.cap,.card,.labCard,.interfaceCard,.evidence,.proof-card,.app-card) {\n    transition:transform var(--jd-motion-calm) var(--jd-motion-ease),\n      box-shadow var(--jd-motion-calm) var(--jd-motion-ease),\n      border-color var(--jd-motion-quick) ease,background-color var(--jd-motion-quick) ease;\n  }\n  :is(.hp-app-nav button,.btn,.sourceLink,.promptChip,.filter-button,.hp-app-tile .btn) {\n    transition:transform var(--jd-motion-quick) var(--jd-motion-ease),\n      border-color var(--jd-motion-quick),background-color var(--jd-motion-quick),box-shadow var(--jd-motion-quick);\n  }\n  :is(.hp-app-nav button,.btn,.sourceLink,.promptChip,.filter-button):not(:disabled):active {\n    transform:translateY(1px) scale(.97);\n  }\n  .hp-app-screen i {transition:transform var(--jd-motion-calm) var(--jd-motion-ease),opacity var(--jd-motion-calm);}\n  #jd-popup-v9 .jd-launcher:not(:disabled):active {transform:scale(.94);}\n  #jd-popup-v9 .jd-launcher-indicator {animation:jd-v16-beacon 3.7s ease-in-out infinite;}\n}\n@media (prefers-reduced-motion:no-preference) and (hover:hover) and (pointer:fine) {\n  :is(.hp-app-tile,.cap,.card,.labCard,.interfaceCard,.evidence,.proof-card,.app-card):hover {\n    transform:translateY(-4px);\n    box-shadow:0 16px 34px rgba(0,0,0,.26);\n  }\n  :is(.hp-app-tile,.cap,.card,.labCard,.interfaceCard,.evidence,.proof-card,.app-card):focus-within {\n    transform:translateY(-2px);\n  }\n  .hp-app-tile:hover .hp-app-screen i:nth-child(2) {transform:translateY(-3px);}\n  .hp-app-nav button:not(:disabled):hover {transform:translateY(-2px);}\n}\n@media(prefers-reduced-motion:reduce) {\n  :is(.hero h1,.hero .role,.hero .eyebrow,.hero .heroActions,.hp-app-top h2,.app-hero h1,\n    .hp-app-tile,.cap,.card,.labCard,.interfaceCard,.evidence,.proof-card,.app-card,.hp-app-screen i,\n    .hp-app-nav button,.btn,.sourceLink,.promptChip,.filter-button,\n    #jd-popup-v9 .jd-launcher-indicator) {animation:none!important;transition:none!important;transform:none!important;}\n}\n";
/* WORKFORM_MOTION_V16_END */
const style=document.createElement('style');style.id='jd-popup-v9-styles';style.textContent=css+'\n'+brandCSS+'\n'+JD_MOTION_V16_CSS;document.head.appendChild(style);
const chosen=(()=>{try{return localStorage.getItem('danielcodes-theme')}catch{return null}})();if(chosen==='dark'||chosen==='light')document.documentElement.dataset.theme=chosen;else if(document.documentElement.dataset.theme!=='dark')document.documentElement.dataset.theme='dark';
const meta=document.querySelector('meta[name=\"theme-color\"]');if(meta)meta.setAttribute('content',document.documentElement.dataset.theme==='light'?'#f5f5f1':'#101827');
const root=document.createElement('div');root.id='jd-popup-v9';
root.innerHTML=`<button class="jd-launcher" type="button" aria-label="Ask Daniel — open chatbot" aria-expanded="false" aria-controls="jd-popup-panel"><img src="/assets/portrait.jpg" width="52" height="52" alt=""><span class="jd-launcher-indicator" aria-hidden="true"></span></button>
<section class="jd-panel" id="jd-popup-panel" role="dialog" aria-modal="false" aria-labelledby="jd-popup-title" hidden>
<header class="jd-head"><img src="/assets/portrait.jpg" width="41" height="41" alt=""><div class="jd-identity"><strong id="jd-popup-title">Ask Daniel</strong><small>Portfolio AI assistant · public evidence only</small></div><button class="jd-close" type="button" aria-label="Close Ask Daniel chatbot">×</button></header>
<nav class="jd-chips" aria-label="Questions about my work"><button type="button" data-jd-prompt="Where can I try your live applications?">Explore live apps</button><button type="button" data-jd-prompt="Show me DanielWorks public engineering proofs and tests">DanielWorks proof</button><button type="button" data-jd-prompt="What AI and agent systems have you built?">AI engineering</button><button type="button" data-jd-prompt="How can I contact you about a job?">Hire or contact</button></nav>
<div class="jd-messages" id="jd-popup-messages" role="log" aria-label="Ask Daniel conversation" aria-live="polite" aria-relevant="additions text"></div>
<form class="jd-form" id="jd-popup-form"><textarea rows="1" id="jd-popup-input" placeholder="Ask about my work…" aria-label="Your question for Ask Daniel" maxlength="800"></textarea><button class="jd-send" type="submit" aria-label="Send question">↑</button></form>
<footer class="jd-foot"><span>In this tab only · public evidence</span><span style="display:flex;align-items:center;gap:8px"><button type="button" class="jd-clear">Clear chat</button><button type="button" class="jd-stop">Stop answer</button></span></footer></section>`;
document.body.appendChild(root);
document.body.dataset.jdPopupV9='ready';
const launch=root.querySelector('.jd-launcher'),panel=root.querySelector('.jd-panel'),close=root.querySelector('.jd-close'),form=root.querySelector('.jd-form'),input=root.querySelector('textarea'),send=root.querySelector('.jd-send'),log=root.querySelector('.jd-messages'),stop=root.querySelector('.jd-stop'),clear=root.querySelector('.jd-clear');
let opener=null,task=null;
/* V14 bounded portfolio dialogue: deterministic English/Tagalog intent handling,
   pinned PUBLIC source references, same-tab context and explicit qualification bounds.
   General questions still use the existing streamed AI backend. */
const JD14_TOPICS=Object.freeze([
{id:'danielworks',name:'DanielWorks public engineering library',tags:'danielworks daniel works repository repos github public works examples proof gallery source sourcecode test tested',answer:'DanielWorks is my separate public engineering-evidence repository. Workform now includes a filterable explorer of eight public modules with direct source and test links. The public repository also includes a Technology Atlas and Proof Gallery. These are original education/research implementations; historical and local test labels must not be mistaken for live production deployments.',refs:[['Explore DanielWorks evidence','/#danielworks'],['Public repository','https://github.com/jemueldaniel/danielworks']]},
{id:'atlas',name:'Technology Atlas',tags:'technology atlas 87 technologies languages tech stack frameworks tools skills proficiency language',answer:'The public Technology Atlas indexes 87 technologies across seven disciplines. Its public documentation distinguishes 52 public-tested references, two historical references, and 33 source observations without publicly linked private code. An index entry alone is not proof of expertise or production usage.',refs:[['Atlas source','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/technology_atlas/index.html'],['Atlas model tests','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/technology_atlas/test_model.mjs']]},
{id:'ui',name:'Interface and accessibility engineering',tags:'ui ux interface frontend front end layout responsive accessibility accessible wcag keyboard focus motion button dark light design apple interactive animations touch mobile',answer:'Interface Lab and DanielWorks UI examples provide original browser-local controls, responsive states, keyboard and focus exercises. The new Workform theme uses charcoal/ivory inspired by the portrait jacket plus a consistent navy/blue from Ask Daniel. Those tests show representative user journeys, not complete WCAG or assistive-device certification.',refs:[['Try Interface Lab','/apps/interface/'],['Open DanielWorks UI proof','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/docs/UI_UX_EVIDENCE_MATRIX.md'],['Browse public evidence','/#danielworks']]},
{id:'agent',name:'Bounded agent systems',tags:'agent agents orchestration orchestrator tools tracing trace recovery checkpoint planning autonomous reflex execute operation',answer:'Daniel Agent can run bounded, observable guest API actions and produce server readback evidence. The separate public DanielWorks in-process agent example demonstrates checkpoint/recovery logic. Neither establishes unbounded autonomous model execution, distributed exactly-once effects, or an independently audited production agent.',refs:[['Try bounded Agent','/apps/agent/'],['Agent reference source','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/mcp_agent/runtime.mjs'],['Agent tests','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/mcp_agent/test_runtime.mjs']]},
{id:'studio',name:'Workflow Studio and Knowledge Evaluation Lab',tags:'workflow workflows studio knowledge evaluation evaluate retrieval d1 search corpus passage citation reproducible persistence precision database',answer:'Workflow Studio and Knowledge Lab expose a real isolated guest Cloudflare D1 backend with saved text workflows, document import, lexical retrieval and precision@1 evaluation. The improved five-checkpoint V12 presentation was qualified locally but is not the currently published Studio UI. Guest workspaces expire; do not provide private data.',refs:[['Open live guest Studio','/apps/live/'],['Workform app catalog','/apps/'],['Public backend evidence','https://github.com/jemueldaniel/danielcodes/blob/feat/workform-apps-20261011/apps/cloud-live/README.md']]},
{id:'retrieval',name:'Retrieval and search evaluation',tags:'search rag retrieval bm25 fts5 lexical ranking evaluate precision recall mrr ndcg embeddings knowledge query semantic nlp',answer:'The public DanielWorks retrieval examples use synthetic text to exercise lexical/FTS5 matching, ranking, source hashes and evaluation metrics. Workform Knowledge Lab uses real D1-backed lexical search, not a deployed embedding or semantic model-quality benchmark. The chatbot also uses bounded intent matching for documented topics and streamed AI for broader questions.',refs:[['Try Knowledge Lab','/apps/live/#knowledge'],['Hybrid retrieval source','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/hybrid_search/hybrid.py'],['Ranking test source','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/hybrid_search/test_hybrid.py']]},
{id:'workbench',name:'Developer Workbench API and MCP',tags:'api sdk mcp protocol http workbench backend network requests json inspector endpoints typed tool',answer:'Daniel Developer Workbench performs bounded, same-origin HTTP calls to the real guest API and lets you inspect response fields and replay status. A complete packaged SDK and interoperable protocol-level MCP server have not yet been qualified in Workform; DanielWorks contains separate public MCP reference examples with their own limits.',refs:[['Try Developer Workbench','/apps/workbench/'],['Public MCP example','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/mcp_agent/runtime.mjs'],['HTTP inspection evidence','/apps/evidence/']]},
{id:'contract',name:'Offline EVM Contract Lab',tags:'contract contracts smart solidity evm ethereum bytecode gas blockchain chain revert offline invariant cryptocurrency onchain',answer:'Daniel Contract Lab executes four genuinely interpreted, allowlisted offline EthereumJS EVM 10.1.3 bytecode scenarios with measured gas, return data, REVERT, out-of-gas and SHA-256 receipts. It does not compile arbitrary Solidity, deploy contracts, connect wallets or create testnet or mainnet transactions.',refs:[['Try offline EVM lab','/apps/contract/'],['Reviewed Contract source','https://github.com/jemueldaniel/danielcodes/blob/feat/workform-real-offline-evm-v10-20261012/apps/contract-engine/engine.mjs']]},
{id:'pay',name:'Daniel Pay fictional transactions',tags:'wallet pay payment payments ledger money coins token transfer currency financial crypto balances',answer:'Daniel Pay is a fictional, zero-monetary-value browser demo. It is not a custodial wallet, blockchain bridge, real payment rail or legitimate transferable currency. DanielWorks separately contains an atomic SQLite double-entry journal for fictional units, which is local code, not payment infrastructure.',refs:[['View fictional Pay demo','/apps/pay/'],['Public ledger implementation','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/atomic_ledger/ledger.py']]},
{id:'social',name:'Daniel Social synthetic feed',tags:'social follows follow likes like comment comments replies post posts feed timeline save interaction',answer:'Daniel Social offers browser-tab synthetic personas with local posts, follow/unfollow, likes, replies, saved posts and search filters. It deliberately has no production social account, public publication, or server-backed relationship graph.',refs:[['Try Social demo','/apps/social/'],['Browse evidence','/apps/evidence/']]},
{id:'project',name:'Project Workspace revisions',tags:'project workspace files file revision revisions version history compare diff restore git commit export',answer:'Daniel Project Workspace uses bounded browser-tab version storage, saves immutable text-file revisions, compares line diffs and restores earlier content. The improved visual V11 explorer was tested locally but is not published on the Workform site. It does not write to your computer filesystem or to GitHub.',refs:[['Open deployed Project Workspace','/apps/project/'],['Browse public source','https://github.com/jemueldaniel/danielcodes']]},
{id:'code',name:'Code Lab compiler pipeline',tags:'code compiler lexical lexer parser ast ir vm language interpreter bounded programming',answer:'Code Lab demonstrates a bounded browser-local language pipeline: tokenization, syntax tree, intermediate operations and executable results. It is not a production compiler, general sandbox or native code execution environment.',refs:[['Try Code Lab','/apps/code/'],['Public source references','/apps/evidence/']]},
{id:'security',name:'System correctness and durable jobs',tags:'security secure tenant isolation access authorization replay idempotent signed api auth audit durable job queue lease recovery ledger',answer:'DanielWorks includes public SQLite leases/recovery, signed request verification, tenant policy auditing and an idempotent fictional double-entry ledger. The examples were tested locally and explicitly do not establish production IAM, distributed consensus, payment custody or full security certification.',refs:[['Review signed API source','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/signed_api/signed_api.py'],['Review durable jobs tests','https://github.com/jemueldaniel/danielworks/blob/d6310035cdec5bf079b80478822efddb08b23fba/examples/durable_jobs/test_jobs.py'],['Daniels public source','/#danielworks']]},
{id:'hire',name:'Hiring and professional contact',tags:'hire hiring recruiter recruit interview interviewers career job employment resume cv contact email linkedin offer role',answer:'My portfolio positions me for AI Engineer and Full-Stack Software Engineer opportunities. Recruiters can inspect live demos, check the separate public DanielWorks examples, open the résumé, and contact me. Public tests are not evidence of a specific employer evaluation or an offer.',refs:[['Open résumé','/resume'],['View Workform demos','/apps/'],['Email','mailto:thisisdanielsph@gmail.com?subject=Portfolio%20Interview']]},
]);
const JD14_STOP=new Set('a an and are as at be can do does for from have how i in is it its me my of on or our the their there these this to was what when where which who why will with would you your about tell show please can could should something more explain them that also regarding another we'.split(' '));
const JD14_ALIASES=Object.freeze({portfolio:'danielworks',works:'danielworks',cv:'hire',resume:'hire',job:'hire',recruiter:'hire',employment:'hire',contact:'hire',rag:'retrieval',nlp:'retrieval',mcp:'workbench',typescript:'workbench',agentic:'agent',chatbot:'agent',ethereum:'contract',solidity:'contract',web3:'contract',cryptocurrency:'pay',frontend:'ui',mobile:'ui',a11y:'ui',ux:'ui',vm:'code',compiler:'code',facebook:'social',twitter:'social',github:'danielworks'});
const JD14_CONTEXT_KEY='jd-public-chat-v14',JD14_MAX_HISTORY=12;
function jd14Tokens(raw){
 return String(raw).normalize('NFKC').toLowerCase().replace(/[’]/g,"'").match(/[\p{L}\p{N}]+/gu)?.filter(x=>x.length>1&&!JD14_STOP.has(x)).slice(0,80)||[];
}
function jd14Find(raw,previous){
 const tokens=jd14Tokens(raw),t=new Set(tokens),aliasVotes=new Map();
 for(const tok of tokens){const key=JD14_ALIASES[tok];if(key)aliasVotes.set(key,(aliasVotes.get(key)||0)+2)}
 const scores=JD14_TOPICS.map(topic=>{
  const words=new Set(topic.tags.split(' '));let v=aliasVotes.get(topic.id)||0;
  for(const k of tokens)if(words.has(k))v+=(k===topic.id?5:2);
  const phrase=topic.name.toLowerCase();if(raw.toLowerCase().includes(phrase))v+=6;
  return {topic,v};
 }).sort((a,b)=>b.v-a.v);
 const best=scores[0];
 const depends=/\b(it|its|that|those|their|there|the same|and this|more about|what about|what else|how can i|how does it|can it|why so)\b/i.test(raw);
 if(depends&&previous&&(!best||best.v<4)){const match=JD14_TOPICS.find(x=>x.id===previous);if(match)return match}
 return best&&best.v>=3?best.topic:null;
}
function jd14Context(previous,question){
 if(!previous)return question;
 const topic=JD14_TOPICS.find(x=>x.id===previous);if(!topic)return question;
 if(!/\b(it|that|those|them|its|their|they|what about|how does|limitations|more detail|source|tests)\b/i.test(question))return question;
 const prefix='Context: this portfolio follow-up concerns '+topic.name+'. Only rely on public documented capabilities and stated limits. Question: ';
 return (prefix+question).slice(0,800);
}
const JD14_DIALOGUE={topic:null,messages:[]};
function jd14Restore(){
 try{const raw=JSON.parse(sessionStorage.getItem(JD14_CONTEXT_KEY)||'null');
 if(raw&&Array.isArray(raw.messages)&&raw.messages.length<=JD14_MAX_HISTORY&&raw.messages.every(v=>v&&['user','agent'].includes(v.who)&&typeof v.text==='string'&&v.text.length<=2200)){
  JD14_DIALOGUE.topic=typeof raw.topic==='string'&&JD14_TOPICS.some(x=>x.id===raw.topic)?raw.topic:null;
  JD14_DIALOGUE.messages=raw.messages;
 }}catch{}
}
function jd14Persist(){
 try{sessionStorage.setItem(JD14_CONTEXT_KEY,JSON.stringify({topic:JD14_DIALOGUE.topic,messages:JD14_DIALOGUE.messages.slice(-JD14_MAX_HISTORY)}))}catch{}
}
function jd14Remember(who,txt,refs){
 const fixed=Array.isArray(refs)?refs.filter(x=>Array.isArray(x)&&typeof x[0]==='string'&&typeof x[1]==='string').slice(0,4):[];
 JD14_DIALOGUE.messages.push({who,text:String(txt).slice(0,2200),refs:fixed});
 JD14_DIALOGUE.messages=JD14_DIALOGUE.messages.slice(-JD14_MAX_HISTORY);jd14Persist();
}

const links={apps:[['Browse 10 apps','/apps/']],evidence:[['Engineering proof','/apps/evidence/'],['DanielWorks proof gallery','/#danielworks'],['Source code','https://github.com/jemueldaniel/danielworks']],hire:[['Résumé','/resume'],['Contact by email','mailto:thisisdanielsph@gmail.com?subject=Engineering%20Portfolio%20Inquiry']]};
function add(who,body,resourceLinks){
 const el=document.createElement('article');el.className='jd-message';el.dataset.who=who;
 const text=document.createElement('p');text.textContent=String(body).slice(0,16000);el.appendChild(text);
 const label=document.createElement('small');if(who==='agent'){label.textContent='Portfolio assistant · verify cited work';el.appendChild(label)}
 if(Array.isArray(resourceLinks)&&resourceLinks.length){const nav=document.createElement('nav');nav.className='jd-links';nav.setAttribute('aria-label','Public portfolio references');
 for(const [title,url] of resourceLinks){const a=document.createElement('a');a.href=url;a.textContent=title+' ↗';if(url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer'}nav.append(a)}el.append(nav)}
 log.append(el);log.scrollTop=log.scrollHeight;return {el,text,label};
}
jd14Restore();
if(JD14_DIALOGUE.messages.length){for(const line of JD14_DIALOGUE.messages)add(line.who,line.text,line.refs);}else add('agent','Hello! I can answer questions about public engineering work, help compare demos and open their actual source or tests. The conversation remains in this tab.',[...links.apps,...links.evidence]);
function openChat(){
 if(!panel.hidden){input.focus({preventScroll:true});return}
 opener=document.activeElement;panel.hidden=false;launch.setAttribute('aria-expanded','true');input.focus({preventScroll:true});
}
function stopTask(){if(!task)return;task.ctl.abort();clearTimeout(task.timer);task=null;send.disabled=false}
function closeChat(){stopTask();panel.hidden=true;launch.setAttribute('aria-expanded','false');const previous=opener;opener=null;if(previous?.isConnected&&typeof previous.focus==='function')previous.focus({preventScroll:true});else launch.focus({preventScroll:true})}
window.openJDChat=openChat;window.closeJDChat=closeChat;window.AskDaniel={open:openChat,close:closeChat};
launch.addEventListener('click',()=>panel.hidden?openChat():closeChat());close.addEventListener('click',closeChat);stop.addEventListener('click',()=>{if(task){stopTask();add('agent','Answer stopped. You can ask another question.')}});clear.addEventListener('click',()=>{stopTask();JD14_DIALOGUE.topic=null;JD14_DIALOGUE.messages=[];try{sessionStorage.removeItem(JD14_CONTEXT_KEY)}catch{}log.replaceChildren();add('agent','This tab conversation was cleared. Ask about public engineering work, tested examples, or hiring.',[...links.apps,...links.evidence]);input.focus({preventScroll:true})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();closeChat()}});
document.addEventListener('click',e=>{
 const target=e.target instanceof Element?e.target.closest('a[href]'):null;if(!target||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0||target.target==='_blank')return;
 let url;try{url=new URL(target.href,location.href)}catch{return}
 if(url.origin===location.origin&&url.pathname==='/'&&url.hash==='#ask'){e.preventDefault();openChat()}
},true);
function quick(q){
 const contextTopic=jd14Find(q,JD14_DIALOGUE.topic);if(contextTopic){JD14_DIALOGUE.topic=contextTopic.id;jd14Persist();return{text:contextTopic.answer,refs:contextTopic.refs,sourceBacked:true}}
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
 stopTask();add('user',q);jd14Remember('user',q);input.value='';
 const known=quick(q);if(known){const answer=add('agent',known.text,known.refs);answer.label.textContent=known.sourceBacked?'Public source-backed navigation · inspect linked qualifications':'Portfolio guide · inspect public source';jd14Remember('agent',known.text,known.refs);return}
 const message=add('agent','Consulting public portfolio evidence…',[...links.apps,...links.evidence]);
 const ctl=new AbortController();const thisTask={ctl,timer:null,finished:false};task=thisTask;send.disabled=true;
 let answer='',bytes=0,buffer='',done=false,reader=null;
 thisTask.timer=setTimeout(()=>ctl.abort('timeout'),22000);
 try{
 const response=await fetch('/api/chat/stream',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:jd14Context(JD14_DIALOGUE.topic,q)}),credentials:'same-origin',signal:ctl.signal});
 if(!response.ok||!response.body)throw Error('The public assistant service did not return a usable response (HTTP '+response.status+').');
 reader=response.body.getReader();const decoder=new TextDecoder();
 const onEvent=event=>{if(!event||!['delta','done','error'].includes(event.type))throw Error('Unexpected response event');
  if(event.type==='delta'){if(typeof event.text!=='string'||answer.length+event.text.length>16000)throw Error('Answer too long');answer+=event.text;message.text.textContent=answer;log.scrollTop=log.scrollHeight}
  else if(event.type==='error')throw Error('The assistant service reported an error');
  else if(event.type==='done'){done=true;thisTask.finished=true;message.label.textContent='Answer completed · verify public references'}
 };
 while(!done){const part=await reader.read();if(part.done){buffer+=decoder.decode();parseFrames(buffer,onEvent,true);break}bytes+=part.value.byteLength;if(bytes>65536)throw Error('Stream limit exceeded');buffer=parseFrames(buffer+decoder.decode(part.value,{stream:true}),onEvent)}
 if(!done)throw Error('Connection ended before the answer was completed');if(task===thisTask){jd14Remember('agent',answer,[...links.apps,...links.evidence]);message.label.textContent='AI-generated answer · verify public references';}
 }catch(error){if(task!==thisTask)return;message.label.textContent='Incomplete response';message.text.textContent=answer||'The assistant is temporarily unavailable. Use the public apps and contact links below.'}
 finally{clearTimeout(thisTask.timer);if(reader){try{reader.cancel()}catch{}}if(task===thisTask){task=null;send.disabled=false}}
}
form.addEventListener('submit',e=>{e.preventDefault();ask(input.value)});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();form.requestSubmit()}});
root.querySelectorAll('[data-jd-prompt]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.jdPrompt)));
if(location.hash==='#ask')openChat();
})();
