import fs from 'node:fs';
import {UniversalEngine,loadGameData,affixStem,Rng,step,specsFormula} from '../src/universal-engine.js';
const data=await loadGameData(),e=new UniversalEngine(data,'Wizard',true),it=e.item("Firebird's Breast"),cls=e.classFor(it);
const h=JSON.parse(fs.readFileSync('/tmp/firebird-hypotheses.json','utf8'));
const P=3525123180,raw=fs.readFileSync('/tmp/firebird-high-hits.tsv','utf8').trim().split('\n');
const MASK=0xffffffffn,pre=[0,1,2,3,1,2,3],reset=[false,false,false,false,true,true,true];
let exact=[],withAffixes=[],byMode=Array.from({length:7},(_,i)=>({mode:i,possible:0,exact:0,affixes:0}));
const wantedFamilies=['Int','Life','Skill_Wizard_ExplosiveBlast','Experience','GoldPickUpRadius','Sockets'].sort().join('|');
function values(high,mode,affixIds){
 let state=(BigInt(high)<<32n)|BigInt(P);
 for(let i=0;i<pre[mode];i++)state=step(state);
 const rng=reset[mode]?new Rng(Number(state&MASK)):Rng.fromState(state);
 const got=[];
 for(const [attr,formula] of it.formulas||[])got.push({stem:'Power',attr,value:specsFormula(formula,rng)});
 for(const id of affixIds){
  const a=e.affixes[e.idIndex.get(id)],stem=affixStem(a.label);
  for(const [attr,formula] of a.formulas)got.push({stem,attr,value:specsFormula(formula,rng)});
 }
 return got;
}
function equal(hyp,lines){
 if(hyp.stats.length!==lines.length)return false;
 return hyp.stats.every((s,i)=>s.stem===lines[i].stem&&s.attr===lines[i].attr&&[Number(s.value),Number(s.value)/100,Number(s.value)/1000].some(v=>Math.abs(v-lines[i].value)<0.0001));
}
function simulateDropAffixes(high){
 const rng=Rng.fromState((BigInt(high)<<32n)|BigInt(P));
 const {affixes}=e._fixed(it,cls,rng,1,false,false);
 rng.draw();
 e._picks(it,cls,rng,affixes,{swaps:1});
 return affixes.map(i=>affixStem(e.affixes[i].label));
}
for(const row of raw){
 const [m,hh,mask0]=row.split(',').map(Number);
 const high=hh>>>0,mask=mask0>>>0;
 byMode[m].possible++;
 for(let hi=0;hi<h.length;hi++){
  if(!(mask & (1<<hi)))continue;
  const generated=values(high,m,h[hi].affixIds);
  if(!equal(h[hi],generated))continue;
  byMode[m].exact++;
  const obj={mode:m,high,affixIds:h[hi].affixIds,generated:generated.map(v=>[v.stem,v.value])};
  if(exact.length<70)exact.push(obj);
  const af=simulateDropAffixes(high).sort().join('|');
  if(af===wantedFamilies){
   byMode[m].affixes++;
   if(withAffixes.length<70)withAffixes.push({...obj,generatedAffixes:af});
  }
 }
}
console.log('FULL_HIGH32_RESULT',JSON.stringify({checkedHighSpace:4294967296,models:byMode}));
console.log('VALUE_MATCH_SAMPLES',JSON.stringify(exact.slice(0,15)));
console.log('VALUE_AND_AFFIX_MATCHES',JSON.stringify(withAffixes.slice(0,60)));
console.log('FINISH_EXHAUSTIVE_DROP');
