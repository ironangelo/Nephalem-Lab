/* Recover a post-Reforge numerical value stream from FULL groups of observed
 * affixes, not individual tooltip lines. Weapon elemental/physical damage can
 * have TWO independent numeric formulas inside ONE affix. Tooltip display
 * order is not RNG roll order, so enumerate primary/secondary permutations.
 * All hypotheses still require both 2^32 scans + exact Reforge replay.
 */
import {modForFormula} from './universal-recovery.js';
import {affixStem} from './universal-engine.js';
const U=4294967295;
function permutations(a){
 if(a.length<=1)return [a];
 return a.flatMap((x,i)=>permutations([...a.slice(0,i),...a.slice(i+1)]).map(z=>[x,...z]));
}
export function generateObservedReforgeHypotheses(engine,query,observation,{maxHypotheses=256}={}){
 const it=engine.item(query);
 if(!it)throw Error('Unknown item in Reforge inversion.');
 if(!['normal','ancient'].includes(observation.quality))throw Error('A numeric NORMAL or ANCIENT Reforge result is required.');
 const numeric=observation.lines.filter(l=>l.stem!=='Sockets');
 const power=numeric.filter(x=>x.stem==='Power');
 if(power.length!==it.formulas.length)throw Error('All inherent legendary power values must be supplied.');
 const grouped=new Map();
 for(const l of numeric.filter(x=>x.stem!=='Power')){
  let arr=grouped.get(l.stem);if(!arr)grouped.set(l.stem,arr=[]);
  arr.push(l);
 }
 const observed=[...grouped.entries()].map(([stem,lines])=>({stem,lines}));
 const pool=engine.candidateAffixes(it),groups=[];
 for(const g of observed){
  const ids=new Map();
  for(const a of pool){
   if(affixStem(a.label)!==g.stem)continue;
   const idx=engine.idIndex.get(a.id);
   const fin=engine.affixes[engine.variant(idx,observation.quality==='ancient'?2:1)];
   if(fin.formulas.length!==g.lines.length)continue;
   const formulaAttrs=fin.formulas.map(([attr])=>Number(attr)).sort((a,b)=>a-b);
   const obsAttrs=g.lines.map(x=>Number(x.attr)).sort((a,b)=>a-b);
   if(JSON.stringify(formulaAttrs)!==JSON.stringify(obsAttrs))continue;
   ids.set(fin.id,fin);
  }
  if(!ids.size)throw Error(`No compatible affix group for ${g.stem}: ${g.lines.length} lines.`);
  groups.push([...ids.values()].map(a=>({a,g})));
 }
 const dedup=new Set(),out=[];
 function build(picks){
  const fixed=[],others=[...picks];
  for(const id of it.fixed_slot_groups.filter(x=>x!==U)){
   const pos=others.findIndex(x=>x.a.fixed_group_a===id||x.a.fixed_group_b===id);
   if(pos>=0){fixed.push(others.splice(pos,1)[0]);continue;}
   // Sockets can be a fixed group without a numeric formula.
   const nonNumeric=pool.filter(a=>a.formulas.length===0&&
     (a.fixed_group_a===id||a.fixed_group_b===id)&&a.tier<=70)
     .sort((a,b)=>b.tier-a.tier)[0];
   if(!nonNumeric)return;
   const newAff=engine.affixes[engine.variant(engine.idIndex.get(nonNumeric.id),observation.quality==='ancient'?2:1)];
   fixed.push({a:newAff,g:{stem:affixStem(newAff.label),lines:[]}});
  }
  const prim=others.filter(x=>x.a.pick_kind===0),sec=others.filter(x=>x.a.pick_kind===1);
  // Fail closed if a critical visible group would be ignored.
  if(others.some(x=>x.a.pick_kind!==0&&x.a.pick_kind!==1))return;
  for(const p of permutations(prim))for(const s of permutations(sec)){
   const seq=[...fixed,...p,...s],specs=[
    ...it.formulas.map(([attr,fx],i)=>({attr,fx,stem:'Power',observed:power[i]?.value})),
    ...seq.flatMap(x=>x.a.formulas.map(([attr,fx])=>{
     const line=x.g.lines.find(o=>Number(o.attr)===Number(attr));
     return {attr,fx,stem:x.g.stem,observed:line?.value};
    }))
   ];
   const constraints=[],stats=[];
   let good=true;
   for(const x of specs){
    if(x.observed===undefined){good=false;break}
    const c=modForFormula(x.fx,Number(x.observed));if(!c){good=false;break;}
    if(!c.skip)constraints.push(c);
    stats.push({stem:x.stem,attr:Number(x.attr),value:Number(x.observed)});
   }
   if(!good||constraints.length<3||constraints.length>32)continue;
   const key=JSON.stringify({constraints,ids:seq.map(x=>x.a.id)});
   if(dedup.has(key))continue;dedup.add(key);
   out.push({constraints,affixIds:seq.map(x=>x.a.id),stats});
   if(out.length>=maxHypotheses)return;
  }
 }
 function walk(i,chosen){
  if(out.length>=maxHypotheses)return;
  if(i===groups.length){build(chosen);return;}
  for(const option of groups[i]){
   if(chosen.some(x=>x.a.id===option.a.id))continue;
   walk(i+1,[...chosen,option]);
   if(out.length>=maxHypotheses)return;
  }
 }
 walk(0,[]);
 if(!out.length)throw Error('No valid grouped numeric interpretation. Check weapon damage min/max, percentage rounding, Mystic, and all visible affixes.');
 return out;
}
