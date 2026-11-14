import test from 'node:test';
import assert from 'node:assert/strict';
import {
 validSeeds,visibleResultSignature,analyzeCandidateActions,findSharedNaturalPrimalRoute,
 allowedDiagnosticOperations,advanceCandidates,matchesObservation
} from '../src/candidate-analysis.js';
const sample={name:'Test Shoulders',id:2,set_id:42};
const engine={
 items:[sample,{name:'Other Set Item',id:3,set_id:42},{name:'Third Set Item',id:4,set_id:42}],
 item(q){return sample;},
 apply(it,seed,op){
  if(op==='S'&&seed===8)throw Error('unavailable for this seed');
  const itemChanged=op==='C';
  return {item:itemChanged?'Other Set Item':sample.name,itemId:itemChanged?3:2,
   quality:op==='R'&&seed===7?'primal':op==='S'?'sanctified':'normal',
   seed:seed+13,affixes:[{stem:'Int',kind:0},{stem:seed%2?'Vit':'CooldownReduction',kind:0}],
   lines:[{attr:1210,stem:'Int',value:650},{attr:1211,stem:'Vit',value:seed%2?500:450}]};
 }
};
test('deduplicates valid u32 candidates and never accepts invalid ones',()=>{
 assert.deepEqual(validSeeds([7,7,8,4294967295,-1,4294967296,'invalid']),[7,8,4294967295]);
});
test('keeps a 36,435-candidate scan and rejects implausibly large arrays',()=>{
 const seeds=Array.from({length:36435},(_,i)=>i+1);
 assert.equal(validSeeds(seeds).length,36435);
 assert.throws(()=>validSeeds(Array.from({length:120001},(_,i)=>i)),/Invalid candidate list size/);
});
test('skips unsafe shared-route enumeration without discarding compatible candidates',()=>{
 const seeds=Array.from({length:36435},(_,i)=>i+1);
 const result=findSharedNaturalPrimalRoute(engine,sample,seeds,{goals:['Int'],allowed:['R']});
 assert.equal(result.skipped,true);
 assert.equal(result.found,false);
 assert.match(result.reason,/36435 candidates/);
});

test('different decimal tooltip numbers never collapse into one visible outcome',()=>{
 const base=engine.apply(sample,7,'R');
 const changed={...base,lines:base.lines.map((x,i)=>i===0?{...x,value:650.5}:x)};
 assert.notEqual(visibleResultSignature(base),visibleResultSignature(changed));
});
test('observed decimals must match closely, not within half a point',()=>{
 const base={quality:'normal',itemId:2,affixes:[],lines:[{attr:100,stem:'Power',value:1.65}]};
 assert.equal(matchesObservation(base,{quality:'normal',itemId:2,lines:[{attr:100,stem:'Power',value:1.65}]}),true);
 assert.equal(matchesObservation(base,{quality:'normal',itemId:2,lines:[{attr:100,stem:'Power',value:1.25}]}),false);
});
test('groups identical visible results regardless of hidden seed',()=>{
 const a=engine.apply(sample,1,'R'),b={...a,seed:99,from:88};
 assert.equal(visibleResultSignature(a),visibleResultSignature(b));
});
test('does not propose sanctify when season disallows it; set conversion flagged destructive',()=>{
 const ops=allowedDiagnosticOperations(engine,sample,['R'],{allowConvert:true});
 assert.deepEqual(ops,['R','C']);
 const r=analyzeCandidateActions(engine,sample,[7,8,9],{allowed:['R'],goals:['Int'],allowConvert:true});
 assert.equal(r.seedCount,3);
 assert.ok(r.operations.some(o=>o.op==='C'&&o.changesItem));
 assert.ok(!r.operations.some(o=>o.op==='S'));
 const s=analyzeCandidateActions(engine,sample,[7,8,9],{allowed:['R','S']});
 assert.equal(s.operations.find(o=>o.op==='S').unsupported,1);
});
test('shared fixed route is distinct from per-seed success',()=>{
 const individual=findSharedNaturalPrimalRoute(engine,sample,[7],{goals:['Int','Vit'],allowed:['R'],maxSteps:1,maxNodes:10});
 assert.equal(individual.found,true);
 const mixed=findSharedNaturalPrimalRoute(engine,sample,[7,9],{goals:['Int','Vit'],allowed:['R'],maxSteps:2,maxNodes:10});
 assert.equal(mixed.found,false);
 assert.match(mixed.reason,/does not prove/);
});
test('filters candidate seeds after an observed next operation',()=>{
 const observation={quality:'primal',lines:[{attr:1210,stem:'Int',value:650},{attr:1211,stem:'Vit',value:500}]};
 assert.deepEqual(advanceCandidates(engine,sample,[7,8,9],'R',observation),[20]);
});

test('conversion observations retain matching seeds and reject wrong set pieces',()=>{
 const seen={itemId:3,quality:'normal',lines:[{attr:1210,stem:'Int',value:650}]};
 assert.deepEqual(advanceCandidates(engine,sample,[7,8,9],'C',seen),[20,21,22]);
 assert.deepEqual(advanceCandidates(engine,sample,[7,8,9],'C',{...seen,itemId:4}),[]);
});
test('set conversion can appear inside a route but cannot be the final primal step',()=>{
 const sequenceEngine={
  items:[{name:'Shoulders',id:2,set_id:42},{name:'Helmet',id:3,set_id:42},{name:'Chest',id:4,set_id:42}],
  item(q){return typeof q==='string'?this.items.find(x=>x.name===q):q;},
  apply(it,seed,op){
   const source=this.item(it),to=op==='C'?(source.id===2?this.items[1]:this.items[0]):source;
   const natural=op==='R'&&to.id===2&&seed===6;
   return {item:to.name,itemId:to.id,seed:seed+3,quality:natural?'primal':'normal',
    affixes:[{stem:'Int',kind:0},{stem:'CooldownReduction',kind:0}],
    lines:[{attr:1210,stem:'Int',value:650}]};
  }
 };
 const result=findSharedNaturalPrimalRoute(sequenceEngine,'Shoulders',[0],{goals:['Int','CooldownReduction'],allowed:['R'],allowConvert:true,maxSteps:3,maxNodes:70});
 assert.equal(result.found,true);
 assert.equal(result.path,'CCR');
 assert.equal(result.materials.souls,70);
 assert.equal(result.materials.deathBreaths,20);
});
