/*
 * Drop-seed hypotheses, isolated research.
 * User's photographed Firebird's Breast states:
 * A (drop) 416 INT, 10% Life, 198 Experience, +2 pickup, 11% Explosive Blast; 668 Armor.
 * B after Reforge 456 INT, 484 Vit, 149 Lightning, 5366 Thorns, 13% Explosive Blast.
 * C after Reforge 443 INT, 476 Vit, 11% Life, 149 Poison, +1 pickup.
 * Inferred persistent seed on A=3525123180; B=2645309652; C=3835143639.
 * Search candidate *stat-value generation* rules; don't assume generated A values = reforge seed.
 */
import {UniversalEngine,loadGameData,affixStem,Rng,step,specsFormula} from '../src/universal-engine.js';
import {generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
import {matchesObservation} from '../src/candidate-analysis.js';
const MASK=0xffffffffn;
const data=await loadGameData(),e=new UniversalEngine(data,'Wizard',true),it=e.item("Firebird's Breast");
const observed=(arr)=>({quality:'normal',itemId:it.id,lines:arr.map(([stem,value])=>{
 const nums=[...new Set(e.candidateAffixes(it).filter(a=>affixStem(a.label)===stem).flatMap(a=>a.formulas.map(([id])=>id)))];
 if(nums.length!==1)throw Error(stem+" ambiguous "+JSON.stringify(nums));
 return {stem,attr:nums[0],value};
})});
const A=observed([['Int',416],['Life',10],['Experience',198],['GoldPickUpRadius',2],['Skill_Wizard_ExplosiveBlast',11]]);
const B=observed([['Int',456],['Vit',484],['LightningResist',149],['Thorns',5366],['Skill_Wizard_ExplosiveBlast',13]]);
const C=observed([['Int',443],['Vit',476],['Life',11],['PoisonResist',149],['GoldPickUpRadius',1]]);
const perm=a=>a.length<=1?[a]:a.flatMap((x,i)=>perm([...a.slice(0,i),...a.slice(i+1)]).map(v=>[x,...v]));
const hypo=(o)=>{const m=new Map();for(const order of perm(o.lines))for(const h of generateRecoveryHypotheses(e,it,{...o,lines:order},{maxHypotheses:128}))m.set(JSON.stringify(h.constraints)+'_'+h.affixIds.join(','),h);return [...m.values()];};
const candidates=hypo(A),seed=3525123180;
console.log('SETUP',JSON.stringify({firstSeed:seed,item:it.name,nHypotheses:candidates.length,
  originalValueCompatible:candidates.filter(h=>verifyHypothesis(e,it,seed,h)).length}));
let best=[];
const match=(actual,expected)=>{
 const val=Number(actual),goal=Number(expected);
 return [goal,goal/100,goal/1000].some(w=>Math.abs(val-w)<0.0001);
};
function check(rows,obs){
 let score=0;
 for(let i=0;i<obs.length;i++){
  const a=rows.find(x=>x.attr===obs[i].attr&&x.stem===obs[i].stem);
  if(a&&match(a.value,obs[i].value))score++;
 }
 return score;
}
function valuesVariant(item,srcSeed,affixIds,{preSteps=2,high=666,reset=true}={}){
 let x=(BigInt(high)<<32n)|BigInt(srcSeed>>>0);
 for(let k=0;k<preSteps;k++)x=step(x);
 const rng=reset?new Rng(Number(x&MASK)):Rng.fromState(x);
 let rows=[];
 for(const [attr,formula] of item.formulas||[])
  rows.push({attr,value:specsFormula(formula,rng),stem:'Power'});
 for(const id of affixIds){
  const idx=e.idIndex.get(id);if(idx===undefined)throw Error('Unknown affix id '+id);
  const a=e.affixes[idx],stem=affixStem(a.label);
  for(const [attr,formula] of a.formulas||[])
   rows.push({attr,value:specsFormula(formula,rng),stem});
 }
 return rows;
}
function inspect(label,srcSeed,high,preSteps,reset){
 let highScore=-1,examples=[];
 for(const h of candidates){
  const rows=valuesVariant(it,srcSeed,h.affixIds,{preSteps,high,reset});
  const score=check(rows,A.lines);
  if(score>highScore){highScore=score;examples=[{affixIds:h.affixIds,rows:rows.map(x=>[x.stem,x.value])}];}
  else if(score===highScore && examples.length<2)examples.push({affixIds:h.affixIds,rows:rows.map(x=>[x.stem,x.value])});
  if(score===A.lines.length){console.log('EXACT_DROP_VALUES',JSON.stringify({label,srcSeed,high,preSteps,reset,rows}));}
 }
 best.push({label,srcSeed,high,preSteps,reset,score:highScore,example:examples[0]});
 return highScore;
}
const before=e.reforge(it,seed),after=e.reforge(it,before.seed);
console.log('CHAIN_CONTROL',JSON.stringify({Bseed:before.seed,Bmatch:matchesObservation(before,B),Cseed:after.seed,Cmatch:matchesObservation(after,C),draws:[before.draws,after.draws]}));
for(const s of [seed,before.seed,after.seed]){
 for(const n of [0,1,2,3,4,5,6,7,8,10,12,16,24,32,48,64,80,96,128]){
  inspect('advance-start-state',s,666,n,true);
  inspect('keep-64bit-state',s,666,n,false);
 }
}
// Test whether an alternate initial high half and initial draw position
// can explain A's exact five values, for the known persistent 32-bit seed.
let maxHighScore=0,highCount=[0,0,0,0,0,0];
for(let high=0;high<4096;high++){
 for(const n of [0,1,2,3]){
  for(const reset of [false,true]){
   const score=inspect('high32-grid',seed,high,n,reset);
   highCount[score]++;
   if(score>maxHighScore)maxHighScore=score;
  }
 }
 if(high%512===0)console.log('GRID_PROGRESS',high);
}
best.sort((a,b)=>b.score-a.score||a.srcSeed-b.srcSeed);
console.log('TOP_HYPOTHESES',JSON.stringify(best.slice(0,24)));
console.log('HI32_SCORE_COUNTS',JSON.stringify({maxHighScore,counts:highCount,total:4096*4*2}));
console.log('REFERENCE_FITS_A',JSON.stringify({seed,valueModelACompatible:candidates.filter(h=>verifyHypothesis(e,it,seed,h)).length,alternativeSeedTestCount:best.length}));
console.log('FINISHED_DROP_RESEARCH');
