/* Experimental inverse test for the same Firebird's Breast before/after ONE R.
 * Unlike the existing recoverer, enumerate ALL visible-affix orders permitted by
 * fixed slots and primary/secondary pick categories, then intersect via a real R.
 * Does NOT change the user's app or spend any materials.
 */
import fs from 'node:fs';
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
import {generateRecoveryHypotheses,verifyHypothesis,observationAffixFamilies} from '../src/universal-recovery.js';
import {validSeeds,matchesObservation} from '../src/candidate-analysis.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true),it=e.item("Firebird's Breast");
const fams=observationAffixFamilies(e,it);
const get=(family,value)=>{
 if(!fams.includes(family))throw Error('Missing '+family);
 const ids=[...new Set(e.candidateAffixes(it).filter(a=>affixStem(a.label)===family).flatMap(a=>(a.formulas||[]).map(([attr])=>Number(attr))))];
 if(ids.length!==1)throw Error('Ambiguous '+family+': '+JSON.stringify(ids));
 return {stem:family,attr:ids[0],value};
};
const input={quality:'normal',itemId:it.id,lines:[
 get('Int',456),get('Vit',484),get('LightningResist',149),get('Thorns',5366),get('Skill_Wizard_ExplosiveBlast',13)]};
const next={quality:'normal',itemId:it.id,lines:[
 get('Int',443),get('Vit',476),get('Life',11),get('PoisonResist',149),get('GoldPickUpRadius',1)]};
console.log('ITEM',JSON.stringify({id:it.id,fixed:it.fixed_slot_groups,picks:[it.primary_pick_count,it.secondary_pick_count,it.flex_pick_count]}));
const permutations=a=>a.length===1?[a]:a.flatMap((x,i)=>permutations([...a.slice(0,i),...a.slice(i+1)]).map(t=>[x,...t]));
function hypothesisSpace(obs){
 const bykey=new Map(),broken=new Map();
 for(const permutation of permutations(obs.lines)){
  let batch;
  try{batch=generateRecoveryHypotheses(e,it,{...obs,lines:permutation},{maxHypotheses:128});}
  catch(err){const msg=String(err?.message||err);broken.set(msg,(broken.get(msg)||0)+1);continue;}
  for(const h of batch){
   const key=JSON.stringify({constraints:h.constraints,affixIds:h.affixIds});
   if(!bykey.has(key))bykey.set(key,h);
  }
 }
 console.log('HYPOS',obs.lines[0].value,bykey.size,'rejected',JSON.stringify([...broken]));
 return [...bykey.values()];
}
const hyps=hypothesisSpace(input),hypsB=hypothesisSpace(next);
const wasm=fs.readFileSync('solver/scan.wasm');
const w=(await WebAssembly.instantiate(wasm)).instance.exports;
async function scan(hypotheses,tag,tryNext=false){
 const survivors=new Set(),nonmatched=[];
 const total=4294967296,batch=6000000;
 let hits=0,considered=0,quality=0,families=0,exact=0;
 const targetFamilies=next.lines.map(l=>l.stem);
 for(let offset=0;offset<hypotheses.length;offset+=32){
  const group=hypotheses.slice(offset,offset+32),numerical=new Set();
  w.set_hyp_count(group.length);w.set_pre_steps(it.armor?2:1);
  for(const [j,h] of group.entries()){
   w.set_hyp_length(j,h.constraints.length);
   h.constraints.forEach(({m,r},k)=>w.set_hyp_constraint(j,k,m,r));
  }
  for(let begin=0;begin<total;begin+=batch){
   const n=w.scan_multi(begin,Math.min(batch,total-begin));
   if(w.was_overflow())throw Error('Solver overflow: '+tag+' '+begin);
   for(let k=0;k<n;k++)numerical.add(w.result_at(k)>>>0);
  }
  for(const seed of numerical){
   if(survivors.has(seed))continue;
   if(!group.some(h=>verifyHypothesis(e,it,seed,h)))continue;
   survivors.add(seed);
   if(tryNext){
    const after=e.reforge(it,seed);
    considered++;
    if(after.quality===next.quality){
     quality++;
     const visible=new Set([...after.affixes.map(a=>a.stem),...after.lines.map(a=>a.stem)]);
     if(targetFamilies.every(f=>visible.has(f)))families++;
    }
    if(matchesObservation(after,next)){
     exact++;
     console.log('MATCHED_ROUTE',JSON.stringify({seed,childSeed:after.seed,affixes:after.affixes,values:after.lines}));
    }else if(nonmatched.length<10)nonmatched.push({seed,childSeed:after.seed,affixes:after.affixes.map(a=>a.stem),lines:after.lines.map(({stem,value})=>({stem,value}))});
   }
  }
  console.log('GROUP_FINISHED',tag,offset,'/',hypotheses.length,'candidateSeeds',survivors.size,'quality',quality,'families',families,'exact',exact);
 }
 console.log('TOTAL',tag,JSON.stringify({hypotheses:hypotheses.length,seeds:survivors.size,quality,families,exact,samples:nonmatched.slice(0,4)}));
 return survivors;
}
const before=await scan(hyps,'BEFORE456',true);
console.log('BASELINE_SIX_PRESENT',JSON.stringify([376089158,1818121089,2114793458,2928563961,3125153708,3493351128].map(seed=>({seed,present:before.has(seed)}))));
const after=await scan(hypsB,'AFTER443',false);
let transitions=0;
for(const seed of before){
 const result=e.reforge(it,seed);
 if(after.has(result.seed)){
  transitions++;
  console.log('TRANSITION_INTERSECTION',JSON.stringify({seed,newSeed:result.seed,exact:matchesObservation(result,next)}));
 }
}
console.log('SUMMARY',JSON.stringify({sourceCandidates:before.size,destinationCandidates:after.size,transitions}));
