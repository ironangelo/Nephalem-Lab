
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const db=await loadGameData(),eng=new UniversalEngine(db,'Wizard',true),original=eng.item("Firebird's Breast"),startSeed=3835143639;
const reductions=['DefenseMelee','DefenseMissile'],resists=['FireResist','ColdResist','LightningResist','PoisonResist','ArcaneResist','PhysicalResist'];
const desired=['Life','Vit','DR',...reductions,...resists];
const affixOptions=new Map();for(const family of desired)affixOptions.set(family,eng.candidateAffixes(original).filter(a=>affixStem(a.label)===family));
console.log('DB',JSON.stringify({item:original.name,seed:startSeed,affixOptions:Object.fromEntries([...affixOptions].map(([k,v])=>[k,v.length]))}));
function check(stems){
 const got=new Set(stems),life=got.has('Life'),vit=got.has('Vit'),armor=got.has('DR');
 const reduction=reductions.some(a=>got.has(a)),resistance=resists.some(a=>got.has(a));
 const primary=life&&vit?3:life&&armor?2:vit&&armor?1:0;
 return {primary,reduction,resistance,focus:life&&vit&&reduction,complete:life&&vit&&reduction&&resistance,lifevit:life&&vit,
 score:primary*20+(reduction?8:0)+(resistance?4:0)};
}
function options(result){
 const base=result.affixes.map(a=>a.stem);
 const possibilities=[{mystic:null,stems:base,...check(base)}];
 for(let i=0;i<result.affixes.length;i++){
  const old=result.affixes[i];
  if(old.socket||old.stem==='Int'||old.stem==='Sockets')continue;
  const others=result.affixes.filter((_,n)=>n!==i).map(a=>eng.idIndex.get(a.id));
  for(const family of desired){
   if(base.includes(family))continue;
   const legal=affixOptions.get(family).some(a=>a.pick_kind===old.kind&&!eng.excluded(eng.idIndex.get(a.id),others)&&eng.fits(eng.idIndex.get(a.id),others));
   if(!legal)continue;
   const stems=base.slice();stems[i]=family;
   possibilities.push({mystic:{from:old.stem,to:family},stems,...check(stems)});
  }
 }
 possibilities.sort((a,b)=>b.score-a.score||Number(!!a.mystic)-Number(!!b.mystic));
 return {best:possibilities[0],lifevit:possibilities.find(a=>a.lifevit)||null,focus:possibilities.find(a=>a.focus)||null,
 complete:possibilities.find(a=>a.complete)||null};
}
function snapshot(path,result,evals,mode,cost){
 const r=[...path].filter(v=>v==='R').length,c=[...path].filter(v=>v==='C').length,s=[...path].filter(v=>v==='S').length;
 return {mode,path,cost,steps:path.length,materials:{reforges:r,converts:c,crucibles:s,forgottenSouls:50*r+10*c,bountyMaterialEachAct:5*r,deathsBreath:10*c},
 item:result.item,quality:result.quality,seed:result.seed,
 affixes:result.affixes.map(a=>({name:a.stem,kind:a.kind})),
 stats:result.lines.map(a=>({name:a.stem,value:a.value})),...evals};
}
class Heap{
 constructor(){this.arr=[];}
 push(x){let a=this.arr,i=a.length;a.push(x);while(i>0){const p=(i-1)>>1;if(a[p].cost<=x.cost)break;a[i]=a[p];i=p;}a[i]=x;}
 pop(){let a=this.arr;if(!a.length)return null;let v=a[0],last=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let c=i*2+1;if(c+1<a.length&&a[c+1].cost<a[c].cost)c++;if(last.cost<=a[c].cost)break;a[i]=a[c];i=c;}a[i]=last;}return v;}
 get size(){return this.arr.length;}
}
function route(mode,{enabled,maxR,maxS,maxC,maxSteps,maxNodes,weights}){
 let q=new Heap();q.push({item:original.name,seed:startSeed,path:'',r:0,s:0,c:0,cost:0});
 let visited=0,primals=0;const seen=new Map(),best={};
 while(q.size&&visited<maxNodes){
  let n=q.pop(),key=n.item+'/'+n.seed;
  if((seen.get(key)??Infinity)<n.cost)continue;
  visited++;
  if(n.path.length>=maxSteps)continue;
  for(const op of enabled){
   if(op==='R'&&n.r>=maxR||op==='S'&&n.s>=maxS||op==='C'&&n.c>=maxC)continue;
   if(op==='C'&&!eng.item(n.item).set_id)continue;
   let result;try{result=eng.apply(n.item,n.seed,op);}catch(err){console.log('SKIP_ERROR',err.message);continue;}
   const path=n.path+op,cost=n.cost+weights[op];
   if(op==='R'&&result.quality==='primal'&&result.item===original.name){
    primals++;const evaluation=options(result);
    for(const group of ['best','lifevit','focus','complete']){
     let option=evaluation[group];if(!option)continue;
     if(!best[group]||cost<best[group].cost||cost===best[group].cost&&path.length<best[group].steps){
      best[group]=snapshot(path,result,option,mode,cost);
      console.log('MATCH',JSON.stringify({mode,group,path,cost,score:option.score,mystic:option.mystic,materials:best[group].materials,affixes:best[group].affixes}));
     }
    }
   }
   const nk=result.item+'/'+result.seed;
   if((seen.get(nk)??Infinity)<=cost)continue;
   seen.set(nk,cost);
   q.push({item:result.item,seed:result.seed,path,r:n.r+(op==='R'),s:n.s+(op==='S'),c:n.c+(op==='C'),cost});
  }
  if(visited%25000===0)console.log('PROGRESS',JSON.stringify({mode,visited,primals,q:q.size,goals:Object.keys(best)}));
 }
 console.log('FINAL',JSON.stringify({mode,visited,primals,remaining:q.size,best}));
 return best;
}
let cur=startSeed,all=[];
for(let n=1;n<=1500;n++){
 let r=eng.reforge(original,cur);cur=r.seed;
 if(n===1)console.log('NEXT_R',JSON.stringify(snapshot('R',r,options(r).best,'immediate',9)));
 if(r.quality==='primal'){const p='R'.repeat(n);all.push(snapshot(p,r,options(r).best,'straight-reforges',9*n));}
}
console.log('DIRECT_R',JSON.stringify({checked:1500,totalPrimal:all.length,firstPrimal:all[0],bestFirst:all.slice(0,10).map(x=>({R:x.materials.reforges,score:x.score,mystic:x.mystic,affixes:x.affixes}))}));
route('one-reforge-season',{enabled:['S','C','R'],maxR:1,maxS:18,maxC:6,maxSteps:22,maxNodes:65000,weights:{R:12,S:1,C:3}});
route('season-balanced',{enabled:['R','S','C'],maxR:8,maxS:15,maxC:5,maxSteps:21,maxNodes:125000,weights:{R:9,S:1,C:3}});
route('no-crucibles',{enabled:['R','C'],maxR:16,maxS:0,maxC:5,maxSteps:22,maxNodes:65000,weights:{R:9,S:1,C:3}});
console.log('FINISHED_PRIMAL_ROUTE');
