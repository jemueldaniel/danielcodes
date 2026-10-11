/** Public, browser-local learning samples. No account, backend, wallet, JS eval, network or native file access. */
const WORD=/[A-Za-z_][A-Za-z_0-9]*/y;
const DIGITS=/[0-9]+/y;
function failure(code,offset){throw Object.assign(new Error(code),{code,offset});}
export function tokenize(source){
 if(typeof source!=='string'||source.length>3000)failure('SOURCE_SIZE_LIMIT',0);
 const tokens=[];let p=0;
 while(p<source.length){if(/\s/u.test(source[p])){p++;continue;}
  let hit=null,kind='';WORD.lastIndex=p;DIGITS.lastIndex=p;
  if((hit=WORD.exec(source))){kind=hit[0]==='let'||hit[0]==='return'?'keyword':'identifier';}
  else if((hit=DIGITS.exec(source)))kind='integer';
  else if('=+();'.includes(source[p])){hit=[source[p]];kind='punctuation';}
  else failure('UNEXPECTED_CHARACTER',p);
  tokens.push({kind,value:hit[0],offset:p});p+=hit[0].length;
  if(tokens.length>256)failure('TOKEN_LIMIT',p);
 }
 return tokens;
}
export function executeTinyLanguage(source){
 const tokens=tokenize(source);let i=0,depth=0;const bindings=new Set(),ast=[];
 const peek=()=>tokens[i]||{kind:'eof',value:'EOF',offset:source.length};
 function accept(value){if(peek().value===value){i++;return true;}return false;}
 function expect(value){if(!accept(value))failure('EXPECTED_'+value,peek().offset);}
 function atom(){if(++depth>32)failure('AST_DEPTH_LIMIT',peek().offset);const t=peek();let node;
  if(accept('(')){node=expression();expect(')');}
  else if(t.kind==='integer'){i++;const n=Number(t.value);if(!Number.isSafeInteger(n))failure('UNSAFE_INTEGER',t.offset);node={kind:'constant',value:n};}
  else if(t.kind==='identifier'){i++;if(!bindings.has(t.value))failure('UNBOUND_IDENTIFIER',t.offset);node={kind:'reference',name:t.value};}
  else failure('EXPECTED_EXPRESSION',t.offset);
  depth--;return node;
 }
 function expression(){let left=atom();while(accept('+'))left={kind:'add',left,right:atom()};return left;}
 while(peek().value==='let'){i++;const t=peek();if(t.kind!=='identifier')failure('EXPECTED_IDENTIFIER',t.offset);i++;if(bindings.has(t.value))failure('DUPLICATE_NAME',t.offset);expect('=');const value=expression();expect(';');ast.push({kind:'let',name:t.value,value});bindings.add(t.value);if(bindings.size>32)failure('BINDING_LIMIT',t.offset);}
 expect('return');const resultExpr=expression();expect(';');ast.push({kind:'return',value:resultExpr});if(peek().kind!=='eof')failure('TRAILING_TOKENS',peek().offset);
 const ir=[];function compile(n){if(n.kind==='constant')ir.push({op:'PUSH',value:n.value});else if(n.kind==='reference')ir.push({op:'LOAD',name:n.name});else{compile(n.left);compile(n.right);ir.push({op:'ADD'});}}
 for(const stmt of ast){compile(stmt.value);ir.push(stmt.kind==='let'?{op:'STORE',name:stmt.name}:{op:'RETURN'});}if(ir.length>1000)failure('INSTRUCTION_LIMIT',source.length);
 const mem=Object.create(null),stack=[],trace=[];let result=null;
 for(const op of ir){if(op.op==='PUSH')stack.push(op.value);
  else if(op.op==='LOAD'){if(!Object.hasOwn(mem,op.name))failure('UNBOUND_VARIABLE_AT_RUNTIME',0);stack.push(mem[op.name]);}
  else if(op.op==='ADD'){if(stack.length<2)failure('STACK_UNDERFLOW',0);const b=stack.pop(),a=stack.pop(),n=a+b;if(!Number.isSafeInteger(n))failure('INTEGER_OVERFLOW',0);stack.push(n);}
  else if(op.op==='STORE'){if(stack.length!==1)failure('BAD_STORE_STACK',0);mem[op.name]=stack.pop();}
  else if(op.op==='RETURN'){if(stack.length!==1)failure('BAD_RETURN_STACK',0);result=stack.pop();}
  if(stack.length>64)failure('STACK_LIMIT',0);trace.push({operation:op.op,stack:[...stack]});
 }
 if(result===null)failure('RETURN_REQUIRED',source.length);
 return {execution:'browser-local deterministic grammar, not Solidity or a production compiler',result,tokens,ast,ir,trace};
}
export function validateFileName(name){if(typeof name!=='string'||name.length>90||!(/^[A-Za-z0-9][A-Za-z0-9_/-]*\.txt$/.test(name))||name.includes('..')||name.startsWith('/')||name.includes('\\'))failure('INVALID_VIRTUAL_NAME',0);return name;}
export function lineDiff(a,b){if(typeof a!=='string'||typeof b!=='string')failure('INVALID_CONTENT',0);
 const aa=a.split('\n'),bb=b.split('\n');if(aa.length>500||bb.length>500||aa.length*bb.length>250000)failure('DIFF_TOO_COMPLEX',0);
 const dp=Array.from({length:aa.length+1},()=>new Uint16Array(bb.length+1));
 for(let i=aa.length-1;i>=0;i--)for(let j=bb.length-1;j>=0;j--)dp[i][j]=aa[i]===bb[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
 const out=[];let i=0,j=0;while(i<aa.length||j<bb.length){if(i<aa.length&&j<bb.length&&aa[i]===bb[j]){out.push(' '+aa[i]);i++;j++;}else if(j<bb.length&&(i===aa.length||dp[i][j+1]>=dp[i+1][j]))out.push('+'+bb[j++]);else out.push('-'+aa[i++]);}
 const diff=out.join('\n');if(new TextEncoder().encode(diff).length>65536)failure('DIFF_TOO_LONG',0);return diff;
}
export function createProjectStore(storage){const key='daniel-public-project-preview-v1';let projects={};try{let raw=JSON.parse(storage.getItem(key)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))projects=raw;}catch{}
 function list(){return Object.entries(projects).map(([name,versions])=>({name,revision:Array.isArray(versions)?versions.length:0}));}
 function read(name,rev){validateFileName(name);const v=projects[name];if(!Array.isArray(v)||!v.length)failure('FILE_NOT_FOUND',0);return v[(rev??v.length)-1];}
 function save(name,content,expectedRevision=null){validateFileName(name);if(typeof content!=='string'||new TextEncoder().encode(content).length>12000||content.split('\n').length>500)failure('CONTENT_LIMIT',0);
  const v=projects[name]||[];if(!Array.isArray(v))failure('CORRUPT_VERSION_STATE',0);
  if(expectedRevision!==null&&v.length!==expectedRevision)failure('STALE_REVISION',0);
  if(v.length>=10)failure('VERSION_LIMIT',0);
  if(!v.length&&Object.keys(projects).length>=10)failure('FILE_LIMIT',0);
  const next={...projects,[name]:[...v,content]};
  try{storage.setItem(key,JSON.stringify(next));}catch{failure('TAB_STORAGE_UNAVAILABLE',0);}
  projects=next;return {name,revision:v.length+1,storage:'current browser tab only; not shared or server-backed'};
 }
 function restore(name,revision){const original=read(name,revision);return save(name,original,projects[name].length);}
 function compare(name,from,to){return {name,from,to,diff:lineDiff(read(name,from),read(name,to))};}
 function clear(){storage.removeItem(key);projects={};}
 return Object.freeze({list,read,save,restore,compare,clear});
}