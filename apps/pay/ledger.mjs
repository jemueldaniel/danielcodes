/**
 * Isolated browser-tab test currency ledger. Never connect to a wallet, RPC,
 * payment processor, token, blockchain, or other account. No real-world value.
 * This module is separately authored public source, not historical Workform code.
 */
const KEY='jemuel-fake-pay-preview-v1';
const INITIAL=1000, MAX_TRANSFERS=120;
function fail(code){throw Object.assign(new Error(code),{code});}
const validAccount=x=>x==='A'||x==='B';
const validId=x=>typeof x==='string'&&/^[A-Za-z][A-Za-z0-9_-]{0,79}$/.test(x);
const fresh=()=>({version:1,balances:{A:{value:INITIAL,version:1},B:{value:INITIAL,version:1}},transfers:[]});
const clone=x=>JSON.parse(JSON.stringify(x));
function verify(state){
 if(!state||typeof state!=='object'||Array.isArray(state)||state.version!==1||!Array.isArray(state.transfers)||state.transfers.length>MAX_TRANSFERS)fail('CORRUPT_LEDGER_STATE');
 if(!state.balances||typeof state.balances!=='object'||Array.isArray(state.balances)||Object.keys(state.balances).sort().join(',')!=='A,B')fail('CORRUPT_LEDGER_STATE');
 const balances={A:{value:INITIAL,version:1},B:{value:INITIAL,version:1}};let seq=0;
 const seen=new Set();
 for(const t of state.transfers){
  if(!t||typeof t!=='object'||!validId(t.opId)||seen.has(t.opId)||!validAccount(t.from)||!validAccount(t.to)||t.from===t.to||!Number.isSafeInteger(t.amount)||t.amount<1||t.amount>2000||t.seq!==++seq||t.sourceVersion!==balances[t.from].version||balances[t.from].value<t.amount)fail('CORRUPT_LEDGER_STATE');
  seen.add(t.opId);
  balances[t.from].value-=t.amount;balances[t.from].version++;
  balances[t.to].value+=t.amount;balances[t.to].version++;
  if(!t.after||JSON.stringify(t.after)!==JSON.stringify(balances))fail('CORRUPT_LEDGER_STATE');
 }
 if(JSON.stringify(state.balances)!==JSON.stringify(balances)||balances.A.value+balances.B.value!==2000)fail('CORRUPT_LEDGER_STATE');
 return {ok:true,fictionalSupply:2000,transfers:state.transfers.length};
}
export function createFictionalLedger(storage){
 if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function'||typeof storage.removeItem!=='function')fail('INVALID_STORAGE');
 let state;
 try{const raw=storage.getItem(KEY);state=raw===null?fresh():JSON.parse(raw);}catch{fail('TAB_STORAGE_UNAVAILABLE_OR_CORRUPT');}
 verify(state);
 function summary(){verify(state);return {disclaimer:'Fictional Daniel Coins have zero monetary value. Browser-tab simulation only. No chain, wallet, crypto or payment.',balances:clone(state.balances),totalTransfers:state.transfers.length,fictionalSupply:2000,serverPersistence:false};}
 function transfer(intent){
  if(!intent||typeof intent!=='object'||Array.isArray(intent)||!validId(intent.opId)||!validAccount(intent.from)||!validAccount(intent.to)||intent.from===intent.to||!Number.isSafeInteger(intent.amount)||intent.amount<1||intent.amount>2000||!Number.isSafeInteger(intent.sourceVersion)||intent.sourceVersion<1)fail('INVALID_TRANSFER');
  const prior=state.transfers.find(t=>t.opId===intent.opId);
  if(prior){if(prior.from!==intent.from||prior.to!==intent.to||prior.amount!==intent.amount||prior.sourceVersion!==intent.sourceVersion)fail('INTENT_CONFLICT');return {ok:true,receipt:clone(prior),replayed:true};}
  if(state.transfers.length>=MAX_TRANSFERS)fail('TRANSFER_LIMIT');
  if(state.balances[intent.from].version!==intent.sourceVersion)fail('STALE_SOURCE_VERSION');
  if(state.balances[intent.from].value<intent.amount)fail('INSUFFICIENT_FICTIONAL_BALANCE');
  const next=clone(state);
  next.balances[intent.from].value-=intent.amount;next.balances[intent.from].version++;
  next.balances[intent.to].value+=intent.amount;next.balances[intent.to].version++;
  const receipt={seq:next.transfers.length+1,opId:intent.opId,from:intent.from,to:intent.to,amount:intent.amount,sourceVersion:intent.sourceVersion,after:clone(next.balances)};
  next.transfers.push(receipt);verify(next);
  try{storage.setItem(KEY,JSON.stringify(next));}catch{fail('TAB_STORAGE_UNAVAILABLE');}
  state=next;return {ok:true,receipt:clone(receipt),replayed:false};
 }
 function history(cursor=null,limit=20){
  if(!Number.isSafeInteger(limit)||limit<1||limit>50)fail('INVALID_PAGE_LIMIT');
  if(cursor!==null&&(!Number.isSafeInteger(cursor)||cursor<1||cursor>MAX_TRANSFERS))fail('INVALID_PAGE_CURSOR');
  const descending=[...state.transfers].reverse().filter(x=>cursor===null||x.seq<cursor);
  const page=descending.slice(0,limit),hasMore=descending.length>limit;
  return {transfers:clone(page),hasMore,nextCursor:hasMore?page.at(-1)?.seq??null:null,totalTransfers:state.transfers.length,disclaimer:summary().disclaimer};
 }
 function clear(){try{storage.removeItem(KEY);}catch{fail('TAB_STORAGE_UNAVAILABLE');}state=fresh();return summary();}
 return Object.freeze({summary,transfer,history,clear,verify:()=>verify(state)});
}