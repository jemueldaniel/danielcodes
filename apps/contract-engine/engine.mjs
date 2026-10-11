import {createEVM} from '@ethereumjs/evm';
import {Common, Hardfork, Mainnet} from '@ethereumjs/common';
import {bytesToHex, hexToBytes} from '@ethereumjs/util';

/** Allowlisted bytecode fixtures only: a real offline EVM interpreter, no RPC/signing/funds. */
export const SCENARIOS=Object.freeze({
  arithmetic: Object.freeze({
    name:'Arithmetic return',
    description:'Push 7 and 6, multiply to 42, write and return the 256-bit word.',
    code:'0x600760060260005260206000f3', gasLimit:100000n,
    expect:'success', returnWord:42n,
  }),
  invariant: Object.freeze({
    name:'Invariant rejection',
    description:'A guard fails and the EVM executes REVERT. No stored result or balance change.',
    code:'0x60006000fd', gasLimit:100000n,
    expect:'revert',
  }),
  condition: Object.freeze({
    name:'Conditional proof',
    description:'ISZERO(0) returns true as a 256-bit word; validate branch arithmetic.',
    code:'0x60001560005260206000f3', gasLimit:100000n,
    expect:'success', returnWord:1n,
  }),
  gas: Object.freeze({
    name:'Gas boundary',
    description:'An intentionally tiny gas limit causes an out-of-gas execution exception.',
    code:'0x600760060260005260206000f3', gasLimit:5n,
    expect:'out-of-gas',
  }),
});

function validHexWord(value){
 if(!(value instanceof Uint8Array)||value.length!==32) return null;
 return BigInt(bytesToHex(value));
}

/** One isolated EVM state per invocation. No wallet, chain RPC, browser persistence or Solidity compilation. */
export async function runScenario(id){
 if(!Object.hasOwn(SCENARIOS,id)) throw new Error('UNAPPROVED_EVM_SCENARIO');
 const fixture=SCENARIOS[id];
 const common=new Common({chain:Mainnet,hardfork:Hardfork.Prague});
 const evm=await createEVM({common});
 const trace=[];
 evm.events.on('step',(event)=>{
  if(trace.length>=48) return;
  const opcode=event?.opcode?.name||'UNKNOWN';
  const pc=Number(event?.pc);
  const gas=typeof event?.gasLeft==='bigint'?event.gasLeft.toString():null;
  const stack=Array.isArray(event?.stack)?event.stack.slice(-3).map(x=>String(x)):null;
  trace.push({pc:Number.isSafeInteger(pc)?pc:null,opcode,gasLeft:gas,stackTop:stack});
 });
 const result=await evm.runCode({code:hexToBytes(fixture.code),gasLimit:fixture.gasLimit});
 const exception=result.exceptionError?.error||result.exceptionError?.message||null;
 const gasUsed=result.executionGasUsed;
 const word=validHexWord(result.returnValue);
 const normalized=String(exception||'').toLowerCase();
 const isRevert=normalized.includes('revert');
 const isOutOfGas=normalized.includes('out of gas')||normalized.includes('out_of_gas')||normalized.includes('outofgas');
 let passed=false;
 if(fixture.expect==='success')passed=!exception&&word===fixture.returnWord;
 if(fixture.expect==='revert')passed=isRevert&&!result.returnValue?.length;
 if(fixture.expect==='out-of-gas')passed=isOutOfGas&&gasUsed<=fixture.gasLimit;
 return {
   id,name:fixture.name,scope:'Pinned EthereumJS EVM 10.1.3 · Prague · offline raw bytecode',
   gasLimit:fixture.gasLimit.toString(),gasUsed:gasUsed.toString(),
   exception,errorClass:exception?isRevert?'REVERT':isOutOfGas?'OUT_OF_GAS':'EVM_EXCEPTION':'NONE',
   returnHex:bytesToHex(result.returnValue),returnWord:word?.toString()??null,
   bytecode:fixture.code,expected:fixture.expect,passed,trace,
   metadata:{interpreter:'@ethereumjs/evm',version:'10.1.3',hardfork:'prague',remoteCalls:0,transactions:0}
 };
}
