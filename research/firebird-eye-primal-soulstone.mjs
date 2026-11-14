/*
 * REAL current state: Firebird's Down (from one C on previously untouched
 * Kadala Firebird's Eye); 425 INT, 490 VIT, 148 Fire resist, 2621 Thorns,
 * +10% Magic Missile, 2 sockets, 704 displayed Armor.
 *
 * Complete one-convert inverse: current seed 930643368,
 * original Firebird Eye parent 4016194486 (inferred).
 *
 * Search for NATURAL Primal "Firebird's Eye" with Soulstone console:
 * 4 APoC, CHC, Intelligence (fixed), ideally no fear/knockback on hit.
 * At most one LEGAL Mystic substitution; compare shortest and lower mats.
 */
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true);
const startItem=e.item("Firebird's Down"),target=e.item("Firebird's Eye"),startSeed=930643368;
const required=['ArcanePowerOnCrit','CriticalChance'];
const bad=(stem)=>/fear|knockback/i.test(stem);
const targetOptions=new Map(required.map(stem=>[stem,e.candidateAffixes(target).filter(a=>affixStem(a.label)===stem)]));
console.log('SEARCH_SETUP',JSON.stringify({start:startItem.name,startSeed,target:target.name,required,
  maxedRequired:{ArcanePowerOnCrit:4,CriticalChance:'10%'},targetOptions:Object.fromEntries([...targetOptions].map(([s,a])=>[s,a.map(v=>({id:v.id,kind:v.pick_kind}))]))}));
function validMystic(r){
 const original=r.affixes.map(a=>a.stem),have=new Set(original),
  missing=required.filter(s=>!have.has(s)),bads=original.filter(bad),
  rows=r.lines.map(x=>({stem:x.stem,value:x.value}));
 // Source and primary required, Primal quality and no bad secondary.
 if(r.itemId!==target.id||r.quality!=='primal'||!have.has('Int'))return null;
 if(missing.length>1)return null;
 if(!missing.length&&!bads.length)return {quality:'natural primal',change:null,tier:'perfect-priorities',score:2};
 if(missing.length&&bads.length)return null; // one enchant can't fix both
 if(bads.length>1)return null;
 const desired=missing[0]||'Experience';
 for(let i=0;i<r.affixes.length;i++){
  const old=r.affixes[i],others=r.affixes.filter((_,j)=>i!==j);
  if(old.socket||old.stem==='Int'||required.includes(old.stem))continue;
  if(missing.length && old.kind!==0)continue;
  if(bads.length && old.stem!==bads[0])continue;
  if(missing.length){
   const opts=targetOptions.get(desired),rest=others.map(a=>e.idIndex.get(a.id));
   if(opts.some(a=>a.pick_kind===old.kind&&e.idIndex.has(a.id)&&!e.excluded(e.idIndex.get(a.id),rest)&&e.fits(e.idIndex.get(a.id),rest))){
    return {quality:'natural primal',change:{from:old.stem,to:desired,kind:'primary'},tier:'perfect-after-mystic',score:1};
   }
  }else{
   // Both critical primaries are on gear; bad secondary can be replaced by another secondary.
   return {quality:'natural primal',change:{from:old.stem,to:'any useful non-control secondary',kind:'secondary'},tier:'perfect-after-mystic',score:1};
  }
 }
 return null;
}
function material(path){
 const r=[...path].filter(x=>x==='R').length,c=[...path].filter(x=>x==='C').length,s=[...path].filter(x=>x==='S').length;
 return {steps:path.length,reforges:r,converts:c,crucibles:s,
   forgottenSouls:50*r+10*c,deathBreaths:10*c,bountyMaterialsEachAct:5*r};
}
function describe(result,option,path,cost,mode){
 return {mode,path,cost,materials:material(path),item:result.item,seed:result.seed,
  mystic:option.change,quality:result.quality,tier:option.tier,
  affixes:result.affixes.map(x=>({stem:x.stem,kind:x.kind})),
  lines:result.lines.map(({stem,value,attr})=>({stem,attr,value}))};
}
class Heap{
 constructor(){this.a=[];}
 push(x){let a=this.a,i=a.length;a.push(x);while(i>0){let p=(i-1)>>1;if(a[p].cost<=x.cost)break;a[i]=a[p];i=p;}a[i]=x;}
 pop(){const a=this.a;if(!a.length)return null;const v=a[0],last=a.pop();
  if(a.length){let i=0;while((i*2+1)<a.length){let c=i*2+1;if(c+1<a.length&&a[c+1].cost<a[c].cost)c++;if(last.cost<=a[c].cost)break;a[i]=a[c];i=c;}a[i]=last;}return v;}
 get size(){return this.a.length;}
}
function route(mode,{weights,maxNodes=240000,maxSteps=21,maxPrimal=120000}){
 const q=new Heap(),seen=new Map(),found={};
 q.push({seed:startSeed,item:startItem.name,path:'',cost:0});
 let expansions=0,primalCount=0,maxQueue=0;
 const maxT=Object.fromEntries(['R','S','C'].map(k=>[k,0]));
 while(q.size&&expansions<maxNodes){
  const n=q.pop(),k=n.item+'/'+n.seed;
  if((seen.get(k)??Infinity)<n.cost)continue;
  expansions++;
  if(n.path.length>=maxSteps)continue;
  for(const op of ['S','C','R']){
   if(op==='C'&&!e.item(n.item).set_id)continue;
   let r;try{r=e.apply(n.item,n.seed,op);}catch{continue;}
   const path=n.path+op,cost=n.cost+weights[op];
   if(op==='R'&&r.itemId===target.id&&r.quality==='primal'){
    primalCount++;
    const answer=validMystic(r);
    if(answer){
     const level=answer.change?'one-mystic':'no-mystic';
     if(!found[level]||cost<found[level].cost||cost===found[level].cost&&path.length<found[level].path.length){
      found[level]=describe(r,answer,path,cost,mode);
      console.log('ROUTE_GOAL',JSON.stringify(found[level]));
     }
     if(!found.any||cost<found.any.cost||cost===found.any.cost&&path.length<found.any.path.length){
      found.any=describe(r,answer,path,cost,mode);
      console.log('ROUTE_BEST_ANY',JSON.stringify(found.any));
     }
    }
   }
   const nextKey=r.item+'/'+r.seed;
   if((seen.get(nextKey)??Infinity)<=cost)continue;
   seen.set(nextKey,cost);
   q.push({seed:r.seed,item:r.item,path,cost});
  }
  if(q.size>maxQueue)maxQueue=q.size;
  if(expansions%25000===0)console.log('ROUTE_PROGRESS',JSON.stringify({mode,expansions,queue:q.size,primalCount,found:Object.keys(found)}));
  if(found.any&&found['no-mystic']&&expansions>2500)break; // improve options within early frontier
 }
 console.log('ROUTE_SEARCH_DONE',JSON.stringify({mode,expansions,primalCount,queueRemaining:q.size,maxQueue,found}));
 return found;
}
const shortest=route('min-operations',{weights:{R:1,S:1,C:1},maxNodes:240000,maxSteps:14});
const economical=route('weighted-materials',{weights:{R:9,S:1,C:3},maxNodes:260000,maxSteps:20});
const lowCrucibles=route('preserve-crucibles',{weights:{R:9,S:5,C:3},maxNodes:180000,maxSteps:17});
console.log('FINAL_COMPARISON',JSON.stringify({
 shortest:shortest.any,shortestNoMystic:shortest['no-mystic'],
 economical:economical.any,economicalNoMystic:economical['no-mystic'],
 lowCrucibles:lowCrucibles.any
}));
console.log('FIREBIRD_EYE_ROUTE_FINISHED');
