import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runScenario,SCENARIOS} from './engine.mjs';
test('real EthereumJS execution qualifies four allowlisted offline EVM scenarios',async()=>{
 for(const id of Object.keys(SCENARIOS)){
   const r=await runScenario(id);
   console.log(id,'pass',r.passed,'gas',r.gasUsed+'/'+r.gasLimit,'return',r.returnWord,'exception',r.exception,'steps',r.trace.length);
   assert.equal(r.passed,true,JSON.stringify(r));
   assert.ok(r.trace.length>0);
   assert.equal(r.metadata.remoteCalls,0);
 }
});
test('scenario runner blocks arbitrary and untrusted bytecode',async()=>{
 await assert.rejects(runScenario('0x60016002'),/UNAPPROVED_EVM_SCENARIO/);
 await assert.rejects(runScenario('__proto__'),/UNAPPROVED_EVM_SCENARIO/);
});
