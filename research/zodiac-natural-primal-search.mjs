/*
 * Seed-verified Zodiac (user-confirmed 2026-11-14):
 * Drop 2279251711 --R Ancient--> 1290971892
 *  --R normal--> 1805687870.
 * Objective natural Primal (last step R), CDR8 Haste7 CHC6 RCR8,
 * then Mystic Haste -> Socket. Prefer natural secondary CCReduction40%.
 * Angelic Crucible S may be used as an intermediate step.
 */
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const START=1805687870;
const e=new UniversalEngine(await loadGameData(),'Wizard',true),it=e.item('Obsidian Ring of the Zodiac');
const expected={CooldownReduction:.08,Haste:.07,CriticalChance:.06,ResourceCostReduction:.08};
const targetNames=Object.keys(expected);
const material=path=>({steps:path.length,reforges:path.split('R').length-1,sanctifies:path.split('S').length-1,
 forgottenSouls:(path.split('R').length-1)*50,bountyEachAct:(path.split('R').length-1)*5,crucibles:path.split('S').length-1});
const mode=process.env.MODE||'balanced';
const weights=mode==='fewest-steps'?{R:1,S:1}:mode==='souls-first'?{R:26,S:1}:mode==='crucible-first'?{R:2,S:9}:{R:9,S:1};
const maxNodes=Number(process.env.MAX_NODES||'800000');
const maxSteps=Number(process.env.MAX_STEPS||'29');
const maxR=Number(process.env.MAX_REFORGES||'8');
const maxS=Number(process.env.MAX_SANCTIFIES||'29');
function check(r){
 if(r.quality!=='primal')return null;
 const has=new Set(r.affixes.map(a=>a.stem));
 if(!targetNames.every(x=>has.has(x)))return null;
 if(targetNames.some(x=>Math.abs((r.lines.find(y=>y.stem===x)?.value??-100)-expected[x])>0.000001))return null;
 const sec=r.affixes.find(a=>!targetNames.includes(a.stem))?.stem||'unknown';
 return {secondary:sec,hasCC:sec==='CCReduction',maxControlReduction:r.lines.find(x=>x.stem==='CCReduction')?.value??null,values:r.lines.map(x=>[x.stem,x.value]),affixes:r.affixes.map(a=>a.stem)};
}
const scout={};let scseed=START;
for(let n=1;n<=4;n++){
 const r=e.primalRoll(it,scseed,'S');scseed=r.seed;
 scout['S'.repeat(n)]={seed:scseed,quality:r.quality,affixes:r.affixes.map(a=>a.stem),values:r.lines.map(x=>[x.stem,x.value])};
}
console.log('ZODIAC_IMMEDIATE_SANCTIFY_OPTIONS',JSON.stringify({start:START,scout}));
class Heap{
 constructor(){this.a=[]}
 push(v){const a=this.a;let i=a.length;a.push(v);while(i>0){let p=(i-1)>>1;if(a[p].cost<=v.cost)break;a[i]=a[p];i=p;}a[i]=v;}
 pop(){let a=this.a;if(!a.length)return null;let v=a[0],last=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let j=i*2+1;if(j+1<a.length&&a[j+1].cost<a[j].cost)j++;if(last.cost<=a[j].cost)break;a[i]=a[j];i=j;}a[i]=last;}return v;}
 get size(){return this.a.length}
}
const heap=new Heap(),seen=new Map(),best={};
heap.push({seed:START,path:'',cost:0,r:0,s:0});
let expanded=0,checkedPrimal=0,goals=0;
while(heap.size&&expanded<maxNodes){
 const cur=heap.pop();if((seen.get(cur.seed)??Infinity)<cur.cost)continue;
 expanded++;if(cur.path.length>=maxSteps)continue;
 for(const op of ['S','R']){
  const nr=cur.r+(op==='R'),ns=cur.s+(op==='S');if(nr>maxR||ns>maxS)continue;
  const result=e.apply(it,cur.seed,op),path=cur.path+op,cost=cur.cost+weights[op];
  if(op==='R'&&result.quality==='primal'){
   checkedPrimal++;
   const goal=check(result);if(goal){
    goals++;
    const key=goal.hasCC?'perfect-secondary':'all-primary';
    const prev=best[key];
    if(!prev||cost<prev.cost||(cost===prev.cost&&path.length<prev.path.length)){
     const obj={mode,key,path,cost,seed:result.seed,materials:material(path),goal};
     best[key]=obj;console.log('ZODIAC_PRIMAL_ROUTE_MATCH',JSON.stringify(obj));
    }
   }
  }
  const p=seen.get(result.seed);
  if(p!==undefined&&p<=cost)continue;
  seen.set(result.seed,cost);
  heap.push({seed:result.seed,path,cost,r:nr,s:ns});
 }
 if(expanded%100000===0)console.log('ZODIAC_PRIMAL_SEARCH_PROGRESS',JSON.stringify({mode,expanded,queue:heap.size,checkedPrimal,goals,best:Object.fromEntries(Object.entries(best).map(([k,b])=>[k,{path:b.path,materials:b.materials}]))}));
 if(best['all-primary']&&best['perfect-secondary']&&heap.size&&heap.a[0].cost>best['perfect-secondary'].cost)break;
}
for(const item of Object.values(best)){
 let seed=START,checkpoints=[];
 for(const [i,op] of [...item.path].entries()){
  const r=e.apply(it,seed,op);seed=r.seed;
  checkpoints.push({step:i+1,op,seed,quality:r.quality,affixes:r.affixes.map(a=>a.stem),values:r.lines.map(y=>[y.stem,y.value])});
 }
 console.log('ZODIAC_PRIMAL_ROUTE_CHECKPOINTS',JSON.stringify({path:item.path,kind:item.key,mode,materials:item.materials,checkpoints}));
}
console.log('ZODIAC_PRIMAL_SEARCH_SUMMARY',JSON.stringify({mode,expanded,queue:heap.size,maxNodes,maxSteps,checkedPrimal,goals,best}));
