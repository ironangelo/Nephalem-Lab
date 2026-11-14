import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true),it=e.item('Deathwish');
const seen=new Map(),count=120000;
for(let seed=0;seed<count;seed++){
 const s=e.apply(it,seed,'S');
 const key=s.affixes.map(x=>x.stem).join('|');
 seen.set(key,(seen.get(key)||0)+1);
}
const ranked=[...seen.entries()].sort((a,b)=>b[1]-a[1]);
console.log('SANCTIFY_IDENTIFIABILITY',JSON.stringify({trials:count,distinctVisibleAffixFamilyPatterns:seen.size,maxPerPattern:ranked[0],medianHitsPerPattern:ranked[Math.floor(ranked.length/2)][1],avgHits:count/seen.size,collisions:count-seen.size,example:ranked.slice(0,8)}));
const normal=[];
for(let seed=0;seed<1000&&normal.length<7;seed++){
 const r=e.apply(it,seed,'R');if(r.quality==='normal')normal.push({seed,r});
}
for(const {seed,r}of normal){
 let hypotheses=[],error=null;
 try{hypotheses=generateRecoveryHypotheses(e,it,{quality:'normal',lines:r.lines.map(x=>({stem:x.stem,attr:x.attr,value:x.value}))});}catch(ex){error=ex.message;}
 console.log('REFORGE_INVERSE_FEASIBILITY',JSON.stringify({seed,outputSeed:r.seed,
  item:r.item,quality:r.quality,affixes:r.affixes.map(a=>({stem:a.stem,id:a.id,kind:a.kind})),
  lines:r.lines.map(x=>({stem:x.stem,attr:x.attr,value:x.value})),
  hypotheses:hypotheses.length,explainsKnownOutput:hypotheses.some(h=>verifyHypothesis(e,it,r.seed,h)),error}));
}
