/*
 * EXHAUSTIVE route-grid enumeration, deterministic seed 46826983.
 * Counts every R/S sequence up to per-mode R,S material budgets.
 * No weighted Dijkstra heuristic, no dedup; disjoint material grid.
 */
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true),item=e.item('Deathwish');
const start=46826983;
const mode=process.env.MODE||'balanced',bounds={
 'souls-min':{maxR:4,maxS:30},
 'short':{maxR:8,maxS:12},
 'balanced':{maxR:6,maxS:18}
}[mode];
if(!bounds)throw Error('invalid mode');
const all=['Damage','CooldownReduction','DamageVsElite'],wantElement=new Set(['ColdD','LightningD']),bad=new Set(['WeaponHitFear1h','WeaponHitKnockback1h']);
const affixes=new Map(all.map(s=>[s,e.candidateAffixes(item).filter(a=>affixStem(a.label)===s)]));
const hits=[],byR={},starts=Date.now();let expansions=0,primal=0,strict=0;
function evaluate(result){
 if(result.quality!=='primal')return null;
 const have=new Set(result.affixes.map(x=>x.stem));
 const desired=all.filter(s=>have.has(s));
 if(desired.length!==2||bad.size&&[...bad].some(x=>have.has(x)))return null;
 const missing=all.find(x=>!have.has(x));
 const old=result.affixes.find(x=>x.stem==='Int');
 if(!old||old.kind!==0)return null;
 const rest=result.affixes.filter(x=>x!==old).map(x=>e.idIndex.get(x.id));
 if(!affixes.get(missing).some(a=>a.pick_kind===old.kind&&!e.excluded(e.idIndex.get(a.id),rest)&&e.fits(e.idIndex.get(a.id),rest)))return null;
 const element=result.affixes.map(x=>x.stem).find(x=>x.endsWith('D')||x==='MinMaxDam');
 return {missing,element,ideal:wantElement.has(element)};
}
const stack=[{seed:start,path:'',r:0,s:0}];
while(stack.length){
 const x=stack.pop();expansions++;
 if(x.r<bounds.maxR){
  const a=e.reforge(item,x.seed);
  const y={seed:a.seed,path:x.path+'R',r:x.r+1,s:x.s};
  if(a.quality==='primal'){
   primal++;
   const g=evaluate(a);
   if(g){
    const row={mode,path:y.path,r:y.r,s:y.s,ops:y.path.length,
     souls:y.r*50,bountyPerAct:y.r*5,finalSeed:a.seed,
     element:g.element,ideal:g.ideal,missing:g.missing,
     affixes:a.affixes.map(z=>z.stem),rolledValues:a.lines.map(z=>[z.stem,z.value])};
    hits.push(row);if(row.ideal)strict++;
    const prev=byR[y.r];
    if(!prev||row.ideal&&!prev.ideal||row.ideal===prev.ideal&&y.s<prev.s)byR[y.r]=row;
    if(hits.length<=50)console.log('GRID_PRIMAL_MATCH',JSON.stringify(row));
   }
  }
  stack.push(y);
 }
 if(x.s<bounds.maxS)stack.push({seed:e.primalRoll(item,x.seed,'S').seed,path:x.path+'S',r:x.r,s:x.s+1});
 if(expansions%100000===0)console.log('GRID_PROGRESS',JSON.stringify({mode,expansions,stack:stack.length,primal,matches:hits.length,strict,seconds:((Date.now()-starts)/1000).toFixed(1)}));
}
const sorted=hits.filter(x=>x.ideal).sort((a,b)=>a.souls-b.souls||a.ops-b.ops||a.s-b.s);
const light=hits.filter(x=>x.ideal&&x.ops<=20).sort((a,b)=>a.souls-b.souls||a.ops-b.ops);
console.log('GRID_FINAL',JSON.stringify({mode,bounds,expansions,primal,matches:hits.length,strict,elapsedSec:((Date.now()-starts)/1000).toFixed(1),bestPerReforges:byR,bestIdealBySouls:sorted.slice(0,30),bestStrictUpTo20:light.slice(0,20)}));
