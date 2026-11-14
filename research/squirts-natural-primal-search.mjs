/*
  Search natural Primal Squirt's Necklace routes ONLY from a uniquely recovered
  real normal Reforge seed. Never run on a guessed Kadala/drop initial seed.
  Goal from Soulstone: 100% CHD, Socket, 20% Fire, 10% CHC after one legal
  Mystic on fixed INT. Desired secondary = CCReduction, if economical.
*/
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const START=Number(process.env.START_SEED);
if(!Number.isInteger(START)||START<0||START>4294967295)throw Error('Need confirmed START_SEED from full inverse');
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true),it=e.item("Squirt's Necklace");
const good=['DamageBonusFire','CriticalChance'],names=['Fire-natural','CHC-natural'];
const options=new Map(good.map(stem=>[stem,e.candidateAffixes(it).filter(a=>affixStem(a.label)===stem)]));
const mat=path=>({steps:path.length,reforges:(path.match(/R/g)||[]).length,
 sanctifies:(path.match(/S/g)||[]).length,
 souls:(path.match(/R/g)||[]).length*50,
 bountyEachAct:(path.match(/R/g)||[]).length*5});
function goal(res){
 if(res.quality!=='primal'||res.itemId!==it.id)return null;
 const stems=res.affixes.map(a=>a.stem),have=new Set(stems);
 if(!have.has('Sockets')||!have.has('CriticalD')||!have.has('Int')||!have.has('Gold'))return null;
 const missing=good.filter(x=>!have.has(x));if(missing.length!==1)return null;
 const need=missing[0], old=res.affixes.find(a=>a.stem==='Int');
 if(!old||old.kind!==0)return null;
 const kept=res.affixes.filter(a=>a!==old).map(a=>e.idIndex.get(a.id));
 const legal=options.get(need).some(a=>{
  const i=e.idIndex.get(a.id);return i!==undefined&&a.pick_kind===0&&!e.excluded(i,kept)&&e.fits(i,kept);
 });
 if(!legal)return null;
 // Check that natural Fire and CHC values are maximized by Primal quality.
 const nat=good.find(x=>have.has(x));
 const val=res.lines.find(x=>x.stem===nat)?.value;
 if(nat==='DamageBonusFire'&&Math.abs(val-.2)>.0001)return null;
 if(nat==='CriticalChance'&&Math.abs(val-.1)>.0001)return null;
 return {natural:nat,missing:need,secondaryCC:have.has('CCReduction'),
  power:res.lines.find(x=>x.stem==='Power')?.value,
  affixes:res.affixes.map(a=>a.stem),values:res.lines.map(x=>[x.stem,x.value])};
}
class Heap{constructor(){this.a=[]}
 push(v){let a=this.a,i=a.length;a.push(v);while(i>0){let p=(i-1)>>1;if(a[p].cost<=v.cost)break;a[i]=a[p];i=p;}a[i]=v}
 pop(){let a=this.a;if(!a.length)return null;let root=a[0],last=a.pop();if(a.length){let i=0;while(2*i+1<a.length){let c=i*2+1;if(c+1<a.length&&a[c+1].cost<a[c].cost)c++;if(last.cost<=a[c].cost)break;a[i]=a[c];i=c}a[i]=last;}return root}
 get size(){return this.a.length}}
const mode=process.env.MODE||'balanced';
const W=mode==='fewest-steps'?{R:1,S:1}:mode==='souls-first'?{R:20,S:1}:{R:9,S:1};
const MAX=Number(process.env.MAX_NODES||'1000000'),STEPS=Number(process.env.MAX_STEPS||'28');
const q=new Heap(),seen=new Map(),best={};q.push({seed:START,path:'',cost:0,r:0,s:0});
let expanded=0,primal=0,goals=0;
function record(next,r,g){
 const kind=g.natural+(g.secondaryCC?'-CC':'');
 const item={mode,kind,path:next.path,seed:r.seed,score:next.cost,materials:mat(next.path),goal:g};
 const prev=best[kind];if(!prev||item.score<prev.score||item.score===prev.score&&item.path.length<prev.path.length){
  best[kind]=item;console.log('SQUIRT_ROUTE_MATCH',JSON.stringify(item));
 }
}
while(q.size&&expanded<MAX){
 const n=q.pop();if(seen.has(n.seed)&&seen.get(n.seed)<n.cost)continue;
 expanded++;if(n.path.length>=STEPS)continue;
 for(const op of ['R','S']){
  const rr=n.r+(op==='R'),ss=n.s+(op==='S');
  if(rr>9||ss>29)continue;
  const result=e.apply(it,n.seed,op),path=n.path+op,cost=n.cost+W[op];
  const next={seed:result.seed,path,cost,r:rr,s:ss};
  if(op==='R'&&result.quality==='primal'){
   primal++;const g=goal(result);if(g){goals++;record(next,result,g)}
  }
  const old=seen.get(next.seed);
  if(old!==undefined&&old<=cost)continue;
  seen.set(next.seed,cost);q.push(next);
 }
 if(expanded%100000===0)console.log('SQUIRT_ROUTE_PROGRESS',JSON.stringify({mode,expanded,queue:q.size,primal,goals,solutions:Object.keys(best)}));
 const categories=Object.keys(best);if(categories.some(k=>k.includes('-CC'))&&q.size&&q.a[0].cost>Math.max(...Object.values(best).map(v=>v.score)))break;
 if(categories.some(k=>k.startsWith('DamageBonusFire'))&&categories.some(k=>k.startsWith('CriticalChance'))&&q.size&&q.a[0].cost>Math.max(...Object.values(best).map(v=>v.score)))break;
}
for(const b of Object.values(best)){
 let seed=START;const checkpoints=[];
 for(let i=0;i<b.path.length;i++){
  const r=e.apply(it,seed,b.path[i]);seed=r.seed;
  checkpoints.push({step:i+1,op:b.path[i],seed,quality:r.quality,affixes:r.affixes.map(x=>x.stem),values:r.lines.map(x=>[x.stem,x.value])});
 }
 console.log('SQUIRT_ROUTE_CHECKPOINTS',JSON.stringify({kind:b.kind,path:b.path,start:START,materials:b.materials,checkpoints}));
}
console.log('SQUIRT_ROUTE_SUMMARY',JSON.stringify({mode,initialSeed:START,expanded,primal,goals,maxNodes:MAX,maxSteps:STEPS,best}));
