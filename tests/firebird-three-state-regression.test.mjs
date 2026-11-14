import test from 'node:test';
import assert from 'node:assert/strict';
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
import {generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
import {matchesObservation} from '../src/candidate-analysis.js';
const data=await loadGameData(),engine=new UniversalEngine(data,'Wizard',true),it=engine.item("Firebird's Breast");
const line=(stem,value)=>{
 const ids=[...new Set(engine.candidateAffixes(it).filter(a=>affixStem(a.label)===stem).flatMap(a=>a.formulas.map(([id])=>id)))];
 assert.equal(ids.length,1);
 return {stem,attr:ids[0],value};
};
const observe=(arr)=>({quality:'normal',itemId:it.id,lines:arr.map(([k,v])=>line(k,v))});
const A=observe([['Int',416],['Life',10],['Experience',198],['GoldPickUpRadius',2],['Skill_Wizard_ExplosiveBlast',11]]);
const B=observe([['Int',456],['Vit',484],['LightningResist',149],['Thorns',5366],['Skill_Wizard_ExplosiveBlast',13]]);
const C=observe([['Int',443],['Vit',476],['Life',11],['PoisonResist',149],['GoldPickUpRadius',1]]);
const permute=a=>a.length<2?[a]:a.flatMap((v,i)=>permute([...a.slice(0,i),...a.slice(i+1)]).map(z=>[v,...z]));
test('verified independent Rust-equivalent model reproduces both successive actual reforges',()=>{
 const first=engine.reforge(it,3525123180);
 assert.equal(first.draws,6);
 assert.equal(first.seed,2645309652);
 assert.equal(matchesObservation(first,B),true);
 const second=engine.reforge(it,first.seed);
 assert.equal(second.draws,6);
 assert.equal(second.seed,3835143639);
 assert.equal(matchesObservation(second,C),true);
});
test('numeric inversion of original A DOES NOT include predecessor 3525123180 for ANY valid value-order hypothesis',()=>{
 const unique=new Map();
 for(const order of permute(A.lines)){
  for(const h of generateRecoveryHypotheses(engine,it,{...A,lines:order})){
   unique.set(JSON.stringify(h.constraints)+'_'+h.affixIds.join(','),h);
  }
 }
 assert.equal(unique.size,12);
 assert.equal([...unique.values()].filter(h=>verifyHypothesis(engine,it,3525123180,h)).length,0);
});
