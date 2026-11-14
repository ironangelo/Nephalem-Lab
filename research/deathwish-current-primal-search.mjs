/*
 * Natural-Primal Deathwish route research. Real game current item:
 * 253% R outcome, full inferred current seed 46826983.
 *
 * Soulstone Firebird Twister priority: Primal max legendary power 325%,
 * ColdD or LightningD high damage, +10% weapon Damage, +10% CDR,
 * +10% DamageVsElite. Original fixed INT can be replaced by Mystic
 * to create 3 of 3 while preserving damage and other natural primaries.
 * For weapon natural Primal, banSocket=true; optional Ramaladni gift later.
 *
 * Operation alphabet only S and R. C unavailable because item not set.
 * P omitted: crafted primal is different from natural primal.
 */
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true),it=e.item('Deathwish');
const START=1326569675,GOOD=['Damage','CooldownReduction','DamageVsElite'];
const allowedDamage=['LightningD'];
const badSeconds=['WeaponHitFear1h','WeaponHitKnockback1h'];
const optionSet=new Map(GOOD.map(s=>[s,e.candidateAffixes(it).filter(a=>affixStem(a.label)===s)]));
console.log('DEATHWISH_TARGET',JSON.stringify({seed:START,item:it.name,desired:GOOD,damageTypes:allowedDamage,possible:Object.fromEntries([...optionSet].map(([s,a])=>[s,a.map(z=>({label:z.label,kind:z.pick_kind,id:z.id}))]))}));
function goal(r){
 if(r.quality!=='primal'||r.itemId!==it.id)return null;
 const stems=r.affixes.map(a=>a.stem),have=new Set(stems);
 if(badSeconds.some(s=>have.has(s)))return null;
 const hit=GOOD.filter(s=>have.has(s)),missing=GOOD.filter(s=>!have.has(s));
 const damage=stems.find(s=>s.endsWith('D')||s==='MinMaxDam')||'none';
 const idealElement=allowedDamage.includes(damage);
 if(!idealElement)return null; // Lightning ONLY (cold/arcane/physical rejected)
 if(!have.has('Int')||hit.length<2)return null;
 if(missing.length!==1||missing[0]!=='CooldownReduction')return null; // require natural Damage+Elite, only CDR for Mystic
 const removing=r.affixes.find(a=>a.stem==='Int');
 if(!removing||removing.kind!==0)return null;
 const otherIndices=r.affixes.filter(a=>a!==removing).map(a=>e.idIndex.get(a.id));
 const legal=optionSet.get(missing[0]).some(a=>{
  const idx=e.idIndex.get(a.id);
  return idx!==undefined&&a.pick_kind===removing.kind&&!e.excluded(idx,otherIndices)&&e.fits(idx,otherIndices);
 });
 if(!legal)return null;
 const power=r.lines.find(x=>x.stem==='Power')?.value;
 return {element:damage,idealElement,missing:missing[0],natural:hit,score:idealElement?2:1,power,
  final:r.lines.map(x=>[x.stem,x.value]),affixes:r.affixes.map(x=>({stem:x.stem,id:x.id,kind:x.kind}))};
}
function material(path){
 const rr=path.split('R').length-1,ss=path.length-rr;
 return {operations:path.length,reforges:rr,crucibles:ss,forgottenSouls:rr*50,bountyMaterialsEachAct:rr*5};
}
class Heap{
 constructor(){this.a=[];}
 push(v){let a=this.a,i=a.length;a.push(v);while(i>0){const p=(i-1)>>1;if(a[p].cost<=v.cost)break;a[i]=a[p];i=p;}a[i]=v;}
 pop(){const a=this.a;if(!a.length)return null;const root=a[0],last=a.pop();if(a.length){let i=0;while(2*i+1<a.length){let c=2*i+1;if(c+1<a.length&&a[c+1].cost<a[c].cost)c++;if(last.cost<=a[c].cost)break;a[i]=a[c];i=c;}a[i]=last;}return root;}
 get size(){return this.a.length;}
}
const MODE=process.env.MODE||'balanced';
const WEIGHTS=MODE==='min-steps'?{R:1,S:1}:MODE==='souls-first'?{R:20,S:1}:{R:9,S:1};
const MAX=2500000,MAX_STEPS=35;
const q=new Heap(),seen=new Map(),best={},samples=[];
q.push({seed:START,path:'',cost:0,r:0,s:0});
let expanded=0,primalCount=0,possibleCount=0,blockedByMax=0;
function bestUpdate(kind,goalInfo,r,next){
 const item={mode:MODE,kind,path:next.path,seed:r.seed,cost:next.cost,materials:material(next.path),goal:goalInfo};
 if(!best[kind]||next.cost<best[kind].cost||(next.cost===best[kind].cost&&next.path.length<best[kind].path.length)){
  best[kind]=item;console.log('DEATHWISH_ROUTE_MATCH',JSON.stringify(item));
 }
}
while(q.size&&expanded<MAX){
 const node=q.pop();
 const prevCost=seen.get(node.seed);
 if(prevCost!==undefined&&prevCost<node.cost)continue;
 expanded++;
 if(node.path.length>=MAX_STEPS)continue;
 for(const op of ['R','S']){
  const rr=node.r+(op==='R'),ss=node.s+(op==='S');
  if(rr>12||ss>35)continue;
  let result=e.apply(it,node.seed,op);
  const path=node.path+op,cost=node.cost+WEIGHTS[op];
  const next={seed:result.seed,path,cost,r:rr,s:ss};
  if(op==='R'&&result.quality==='primal'){
   primalCount++;const gd=goal(result);
   if(gd){
    possibleCount++;
    const kind=gd.idealElement?'strict-element':'valid-element-other';
    bestUpdate(kind,gd,result,next);
    if(!best.any||cost<best.any.cost)bestUpdate('any',gd,result,next);
    if(samples.length<15)samples.push({route:path,seed:result.seed,goal:gd,mat:material(path)});
   }
  }
  const seenCost=seen.get(result.seed);
  if(seenCost!==undefined&&seenCost<=cost)continue;
  seen.set(result.seed,cost);
  q.push(next);
 }
 if(expanded%20000===0)console.log('DEATHWISH_ROUTE_PROGRESS',JSON.stringify({mode:MODE,expanded,queue:q.size,unique:seen.size,primalCount,possibleCount,best:Object.fromEntries(Object.entries(best).map(([k,v])=>[k,{path:v.path,cost:v.cost,element:v.goal.element}]))}));
 // Dijkstra: once we have an ideal path and all queue nodes with lower
 // cost are expanded, the path is minimal among explored bounded states.
 if(best['strict-element']&&q.size&&q.a[0].cost>best['strict-element'].cost)break;
}
console.log('DEATHWISH_ROUTE_SUMMARY',JSON.stringify({mode:MODE,expanded,queue:q.size,primalCount,possibleCount,maxNodes:MAX,maxSteps:MAX_STEPS,weights:WEIGHTS,best,samples}));

for(const [key,b] of Object.entries(best)){
 if(key==='any')continue;
 let s=START;const checkpoints=[];
 for(let i=0;i<b.path.length;i++){
  const op=b.path[i],v=e.apply(it,s,op);s=v.seed;
  checkpoints.push({step:i+1,operation:op,quality:v.quality,seed:s,power:v.lines.find(x=>x.stem==='Power')?.value,
    element:v.affixes.find(x=>x.stem.endsWith('D'))?.stem||v.affixes.find(x=>x.stem==='MinMaxDam')?.stem,
    affixes:v.affixes.map(x=>x.stem),values:v.lines.map(x=>[x.stem,x.value])});
 }
 console.log('CURRENT_DEATHWISH_VERIFIED_ROUTE',JSON.stringify({mode:MODE,key,start:START,ops:b.path,materials:b.materials,goal:b.goal,checkpoints}));
}
