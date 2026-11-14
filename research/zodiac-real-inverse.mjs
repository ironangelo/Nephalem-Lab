/*
 * Deathwish normal-weapon numeric inversion with multi-spec elemental
 * damage affixes and fixed groups. RESEARCH ONLY.
 * Corrects an omission in universal-recovery: one affix can have TWO
 * independently rolled numerical stats (MinMaxDam/ColdD/LightningD etc).
 */
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const db=await loadGameData(),e=new UniversalEngine(db,'Wizard',true),it=e.item("Obsidian Ring of the Zodiac");
const U=4294967295;
function symbolicFormula(hex){
 const b=Uint8Array.from(hex.match(/../g).map(x=>parseInt(x,16))),dv=new DataView(b.buffer),st=[];
 for(let i=0;i<b.length;i+=8){const op=b[i];if(op===0)break;
  if(op===6)st.push({c:dv.getFloat32(i+4,true),a:0,lo:null,hi:null});
  else if(op===1){const fn=b[i+4];if(fn===4){const hi=st.pop(),lo=st.pop();if(hi.a||lo.a)return null;st.push({c:0,a:1,lo:lo.c,hi:hi.c});}else return null;}
  else if([0xB,0xC,0xD,0xE].includes(op)){
   const y=st.pop(),x=st.pop();if(!x||!y)return null;
   if(op===0xB||op===0xC){const factor=op===0xB?1:-1;if(x.a&&y.a)return null;st.push({...x,c:x.c+factor*y.c,a:x.a+factor*y.a,lo:x.lo??y.lo,hi:x.hi??y.hi});}
   else if(op===0xD){if(x.a&&y.a)return null;let v=x.a?{...x}:{...y},k=x.a?y.c:x.c;st.push({c:v.c*k,a:v.a*k,lo:v.lo,hi:v.hi});}
   else if(op===0xE){if(y.a||!y.c)return null;st.push({c:x.c/y.c,a:x.a/y.c,lo:x.lo,hi:x.hi});}
  }else return null;
 }
 const res=st.at(-1);if(!res)return null;
 if(res.lo===null&&res.a===0)return res;
 if(res.lo===null||res.hi===null||!Number.isInteger(res.lo)||!Number.isInteger(res.hi)||res.a===0)return null;
 return res;
}
function constraint(fx,value){const s=symbolicFormula(fx);if(!s)return null;
 if(s.lo===null){return [value,value/100,value/1000].some(v=>Math.abs(v-s.c)<0.0001)?{skip:true}:null;}
 const m=s.hi-s.lo+1;for(const goal of [value,value/100,value/1000]){
  const f=(goal-s.c)/s.a,rr=Math.round(f-s.lo);
  if(Number.isInteger(m)&&m>=1&&Number.isFinite(rr)&&Math.abs(f-s.lo-rr)<0.0001&&rr>=0&&rr<m)return {m,r:rr};
 }return null;
}
const perm=a=>a.length<=1?[a]:a.flatMap((x,i)=>perm([...a.slice(0,i),...a.slice(i+1)]).map(v=>[x,...v]));
const original=e.candidateAffixes(it),selectedByStem=new Map();
for(const a of original){
 const idx=e.idIndex.get(a.id),next=e.affixes[e.variant(idx,2)];
 const s=affixStem(a.label),lst=selectedByStem.get(s)||[];
 if(!lst.some(x=>x.id===next.id))lst.push(next);
 selectedByStem.set(s,lst);
}
function makeObs(result){
 const groups=result.affixes.map(a=>({
  stem:a.stem,
  lines:result.lines.filter(l=>l.affixId===a.id).map(l=>({stem:l.stem,attr:l.attr,value:l.value}))
 }));
 return {power:result.lines.filter(x=>x.stem==='Power').map(x=>({stem:'Power',attr:x.attr,value:x.value})),groups};
}
const attrFor=stemName=>{
 const a=original.find(z=>affixStem(z.label)===stemName && z.formulas.length===1);
 if(!a)throw Error('Missing stem '+stemName);
 return a.formulas[0][0];
};
const obsGroup=(stem,value)=>({stem,lines:[{stem,attr:attrFor(stem),value}]});
const real={
 power:it.formulas.map(([attr])=>({stem:'Power',attr,value:1})),
 groups:[
  obsGroup('CooldownReduction',.05),obsGroup('Haste',.06),
  obsGroup('CriticalChance',.055),obsGroup('ResourceCostReduction',.06),
  obsGroup('LightningResist',206)
 ]
};
function hypothesisList(observation){
 const all=[];
 let assignments=[[]];
 for(const g of observation.groups){
  const selected=(selectedByStem.get(g.stem)||[]).filter(a=>
   a.formulas.length===g.lines.length&&a.formulas.every(([id],i)=>g.lines[i].attr===id));
  if(!selected.length)throw Error('No variants for '+g.stem+' '+JSON.stringify(g));
  assignments=assignments.flatMap(items=>selected.map(a=>[...items,{a,g}]));
 }
 for(const picks of assignments){
  const fixed=[],available=[...picks];
  for(const gid of it.fixed_slot_groups.filter(x=>x!==U)){
   const k=available.findIndex(x=>x.a.fixed_group_a===gid||x.a.fixed_group_b===gid);
   if(k<0)throw Error('Missing fixed group '+gid);
   fixed.push(available.splice(k,1)[0]);
  }
  const primaries=available.filter(x=>x.a.pick_kind===0),secondaries=available.filter(x=>x.a.pick_kind===1);
  if(primaries.length!==it.primary_pick_count||secondaries.length!==it.secondary_pick_count||available.length!==primaries.length+secondaries.length)continue;
  for(const p of perm(primaries))for(const s of perm(secondaries)){
   const seq=[...fixed,...p,...s],constraints=[],specs=[
    ...it.formulas.map(([attr,formula],i)=>({attr,formula,want:observation.power[i]?.value,stem:'Power'})),
    ...seq.flatMap(x=>x.a.formulas.map(([attr,formula],i)=>({attr,formula,want:x.g.lines[i].value,stem:x.g.stem})))
   ];
   let valid=true;
   for(const x of specs){if(x.want===undefined){valid=false;break;}const m=constraint(x.formula,x.want);if(!m){valid=false;break;}if(!m.skip)constraints.push(m);}
   if(valid)all.push({constraints,affixIds:seq.map(x=>x.a.id),specs:specs.map(x=>({attr:x.attr,stem:x.stem,value:x.want}))});
  }
 }
 const dedup=new Map();
 for(const h of all)dedup.set(JSON.stringify(h.constraints)+'/'+h.affixIds.join(','),h);
 return [...dedup.values()];
}
const compare=(observed,currentSeed,affixIds)=>{
 const lines=e.values(it,currentSeed,affixIds.map(id=>e.idIndex.get(id)),false);
 const specs=[...observed.power,...observed.groups.flatMap(x=>x.lines)];
 return lines.length===specs.length&&specs.every(s=>
  lines.some(l=>l.attr===s.attr&&l.stem===s.stem&&Math.abs(l.value-s.value)<.0001)
 );
};

import {writeFileSync} from 'node:fs';
const hyps=hypothesisList(real);
console.log('ZODIAC_REAL_OBSERVATION',JSON.stringify(real));
console.log('ZODIAC_NUMERIC_HYPOTHESES',JSON.stringify({count:hyps.length,
 details:hyps.map((h,i)=>({i,constraints:h.constraints,ids:h.affixIds})).slice(0,200)}));
if(!hyps.length)throw Error('NO numeric hypotheses');
const scan=hyps.map((h,i)=>[i+' '+h.constraints.length,...h.constraints.map(c=>c.m+' '+c.r)]).flat().join('\n')+'\n';
writeFileSync('/tmp/zodiac-constraints.txt',hyps.length+'\n'+scan);
writeFileSync('/tmp/zodiac-hypotheses.json',JSON.stringify(hyps));
export {e,it,real,hyps,compare};
