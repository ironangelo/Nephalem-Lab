/* Research only. Two actual Diablo III Firebird's Breast snapshots:
 * A (current): Armor 752, INT456 VIT484 Lightning149 Thorns5366 ExplosiveBlast13% Socket3
 * B (after exactly one R): Armor738, INT443 VIT476 Life11% Poison149 PickupRadius1 Socket3
 * Never mutate Android state or the 36,435-candidate list.
 */
import fs from 'node:fs';
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
import {observationAffixFamilies,generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
import {validSeeds,matchesObservation} from '../src/candidate-analysis.js';

const data=await loadGameData(),engine=new UniversalEngine(data,'Wizard'),item=engine.item("Firebird's Breast");
const offered=observationAffixFamilies(engine,item),possible=[376089158,1818121089,2114793458,2928563961,3125153708,3493351128];
const getFamily=(name)=>{const matches=offered.filter(x=>x.toLowerCase()===name.toLowerCase());
  if(matches.length!==1)throw Error('Ambiguous/missing family '+name+': '+JSON.stringify(matches));return matches[0];};
const stat=(name,value)=>{
 const family=getFamily(name),attrs=[...new Set(engine.candidateAffixes(item).filter(a=>affixStem(a.label)===family).flatMap(a=>(a.formulas||[]).map(([id])=>Number(id))))];
 if(attrs.length!==1)throw Error('Ambiguous family '+name+' => '+JSON.stringify(attrs));
 return {stem:family,attr:attrs[0],value};
};
const obs=(entries)=>({itemId:item.id,quality:'normal',lines:entries.map(([name,v])=>stat(name,v))});
const A=obs([['Int',456],['Vit',484],['LightningResist',149],['Thorns',5366],['Skill_Wizard_ExplosiveBlast',13]]);
const B=obs([['Int',443],['Vit',476],['Life',11],['PoisonResist',149],['GoldPickUpRadius',1]]);
console.log('ITEM',JSON.stringify({id:item.id,armor:item.armor,offered:offered.filter(x=>/int|vit|life|poison|gold|explosive|socket|thorns|light/i.test(x))}));
console.log('PRE',JSON.stringify(A),'POST',JSON.stringify(B));
const hypotA=generateRecoveryHypotheses(engine,item,A);
console.log('FIRST_CANDIDATES',possible.length,'HYPOTHESES',hypotA.length);
const reforgeSeeds=new Set(),firstValid=[];
for(const seed of possible){
 const matchingHyps=hypotA.filter(h=>verifyHypothesis(engine,item,seed,h));
 if(!matchingHyps.length)throw Error('Previous candidate seed no longer reproduces original value constraints: '+seed);
 firstValid.push(seed);
 const result=engine.reforge(item,seed);
 const matching=matchesObservation(result,B);
 reforgeSeeds.add(result.seed);
 console.log('PREDICTED',JSON.stringify({
  seed,matchedSourceHypotheses:matchingHyps.length,newSeed:result.seed,
  quality:result.quality,affixFamilies:result.affixes.map(a=>a.stem),
  lines:result.lines.map(x=>({stem:x.stem,value:x.value})),
  fitsExactReforgeResult:matching
 }));
}
console.log('EXACT_MATCHES_FROM_FIRST_SIX',possible.filter(s=>matchesObservation(engine.reforge(item,s),B)).length);
const hypsB=generateRecoveryHypotheses(engine,item,B,{maxHypotheses:128});
console.log('SECOND_HYPOTHESES',hypsB.length);
for(const [i,h] of hypsB.entries())if(i<8)console.log('POST_HYP',i,JSON.stringify(h.constraints),'AFFIXIDS',JSON.stringify(h.affixIds));
const w=(await WebAssembly.instantiate(fs.readFileSync('solver/scan.wasm'))).instance.exports;
const postSeeds=[];
const total=4294967296,batch=6000000;
for(let index=0;index<hypsB.length;index+=32){
 const group=hypsB.slice(index,index+32),all=new Set();
 w.set_pre_steps(item.armor?2:1);w.set_hyp_count(group.length);
 group.forEach((h,j)=>{w.set_hyp_length(j,h.constraints.length);h.constraints.forEach(({m,r},k)=>w.set_hyp_constraint(j,k,m,r));});
 for(let i=0;i<total;i+=batch){
  const count=w.scan_multi(i,Math.min(batch,total-i));
  if(w.was_overflow())throw Error('Solver overflow');
  for(let k=0;k<count;k++)all.add(w.result_at(k)>>>0);
 }
 for(const seed of all)if(group.some(h=>verifyHypothesis(engine,item,seed,h)))postSeeds.push(seed);
}
const post=validSeeds(postSeeds).sort((x,y)=>x-y);
const intersections=post.filter(seed=>reforgeSeeds.has(seed));
console.log('POST_VALUE_CANDIDATES',post.length,JSON.stringify(post.slice(0,50)));
console.log('INTERSECTIONS_PRE_REFORGE_CHILD_SEEDS_VS_POST_VALUES',intersections.length,JSON.stringify(intersections));
console.log('ALL_DONE');
