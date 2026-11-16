/**
 * Cost-aware route search from the ONE real recovered Firebird's Down
 * post-Reforge seed 1745067528. No in-game transformations after this R yet.
 * R=50 Forgotten Souls +5 each-act mats; C=10 Forgotten Souls+10 Death Breath,
 * S=1 Angelic Crucible. Goal: FINAL R normal cubed item -> PRIMAL NATURAL
 * Firebird's Down with INT650, 2 Sockets, Armor775, VIT650, secondary resist.
 * One Mystic fix acceptable as backup. Bounded search, not mathematical proof.
 */
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const wanted=e.item("Firebird's Down"),START=1745067528;
const mode=process.env.MODE||'balanced';
const MAX_NODES=Number(process.env.MAX_NODES||'260000'),MAX_STEPS=Number(process.env.MAX_STEPS||'22');
const MAX_R=Number(process.env.MAX_R||'5'),MAX_C=Number(process.env.MAX_C||'18'),MAX_S=Number(process.env.MAX_S||'10');
const weight={
 'balanced':{R:20,C:4,S:8},
 'fewest-steps':{R:1,C:1,S:1},
 'crucible-scarce':{R:12,C:2,S:35},
 'souls-scarce':{R:50,C:10,S:2},
 'no-crucibles':{R:12,C:2,S:99999},
}[mode];
if(!weight)throw Error('Unknown mode '+mode);
const count=(path,c)=>(path.match(new RegExp(c,'g'))||[]).length;
const materials=path=>({steps:path.length,reforges:count(path,'R'),converts:count(path,'C'),sanctifies:count(path,'S'),souls:count(path,'R')*50+count(path,'C')*10,deathBreaths:count(path,'C')*10,bountyEachAct:count(path,'R')*5,crucibles:count(path,'S')});
class Heap{constructor(){this.a=[];}get size(){return this.a.length;}push(v){let a=this.a,i=a.length;a.push(v);while(i){let p=(i-1)>>1;if(a[p].cost<=v.cost)break;a[i]=a[p];i=p;}a[i]=v;}pop(){let a=this.a;if(!a.length)return null;let v=a[0],last=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let j=i*2+1;if(j+1<a.length&&a[j+1].cost<a[j].cost)j++;if(last.cost<=a[j].cost)break;a[i]=a[j];i=j;}a[i]=last;}return v;}}
function evaluate(r){
 if(r.quality!=='primal'||r.itemId!==wanted.id)return null;
 const aff=r.affixes,has=new Set(aff.map(a=>a.stem));
 const vals=new Map(r.lines.map(x=>[x.stem,x.value]));
 if(!has.has('Int')||!has.has('Sockets')||Math.abs((vals.get('Int')||0)-650)>0.001)return null;
 const found={Vit:has.has('Vit')&&Math.abs((vals.get('Vit')||0)-650)<0.001,DR:has.has('DR')&&Math.abs((vals.get('DR')||0)-775)<0.001};
 const missing=Object.keys(found).filter(k=>!found[k]);
 if(missing.length>1)return null;
 const resist=aff.filter(a=>a.kind===1&&/Resist$/.test(a.stem)).map(a=>a.stem);
 const primaryOther=aff.filter(a=>a.kind===0&&!['Int','Sockets','Vit','DR'].includes(a.stem)).map(a=>a.stem);
 if(missing.length===1&&!primaryOther.length)return null;
 const category=(missing.length===0?'exact':'mystic')+(resist.length?'+resist':'');
 return {category,primaryOther,missing,secondaryResists:resist,finalStats:r.lines.map(x=>({stem:x.stem,value:x.value})),finalAffixes:r.affixes.map(a=>({stem:a.stem,kind:a.kind})),mystic:missing.length?{replace:primaryOther[0],with:missing[0]}:null};
}
const heap=new Heap(),best={},seen=new Map();
const ops=['S','C','R'];
heap.push({itemId:wanted.id,seed:START,path:'',cost:0,r:0,s:0,c:0});
let expanded=0,primalChecked=0,successes=0;
while(heap.size&&expanded<MAX_NODES){
 const q=heap.pop(),key=q.itemId+':'+q.seed;
 if((seen.get(key)??Infinity)<q.cost)continue;
 expanded++;
 if(q.path.length>=MAX_STEPS)continue;
 const item=e.item(q.itemId);
 for(const op of ops){
  if(op==='S'&&(q.s>=MAX_S||mode==='no-crucibles'))continue;
  if(op==='R'&&q.r>=MAX_R)continue;
  if(op==='C'&&(q.c>=MAX_C||!item.set_id))continue;
  let next;try{next=e.apply(item,q.seed,op)}catch{continue}
  let path=q.path+op,score=q.cost+weight[op],r=q.r+(op==='R'),s=q.s+(op==='S'),c=q.c+(op==='C');
  if(op==='R'&&next.quality==='primal'){
   primalChecked++;
   const goal=evaluate(next);
   if(goal){
    successes++;
    const prev=best[goal.category];
    if(!prev||score<prev.score||(score===prev.score&&path.length<prev.path.length)){
     const obj={mode,category:goal.category,path,score,startSeed:START,lastSeed:next.seed,materials:materials(path),goal};
     best[goal.category]=obj;console.log('FBDOWN_ROUTE_FOUND',JSON.stringify(obj));
    }
   }
  }
  const k=next.itemId+':'+next.seed;
  if((seen.get(k)??Infinity)<=score)continue;
  seen.set(k,score);
  heap.push({itemId:next.itemId,seed:next.seed,path,cost:score,r,s,c});
 }
 if(expanded%50000===0)console.log('FBDOWN_ROUTE_PROGRESS',JSON.stringify({mode,expanded,queue:heap.size,primalChecked,successes,best:Object.fromEntries(Object.entries(best).map(([k,x])=>[k,{path:x.path,materials:x.materials}]))}));
 if(best['exact+resist']&&heap.size&&heap.a[0].cost>best['exact+resist'].score)break;
}
for(const obj of Object.values(best)){
 let item=wanted,seed=START;
 const checkpoints=[];
 for(const [i,op] of [...obj.path].entries()){
  const r=e.apply(item,seed,op);
  checkpoints.push({step:i+1,op,item:r.item,quality:r.quality,seed:r.seed,affixes:r.affixes.map(x=>x.stem),values:r.lines.map(x=>[x.stem,x.value])});
  item=e.item(r.itemId);seed=r.seed;
 }
 console.log('FBDOWN_ROUTE_CHECKPOINTS',JSON.stringify({mode,category:obj.category,path:obj.path,materials:obj.materials,checkpoints}));
}
console.log('FBDOWN_ROUTE_SUMMARY',JSON.stringify({mode,expanded,queue:heap.size,primalChecked,successes,MAX_NODES,MAX_STEPS,MAX_R,MAX_C,MAX_S,best}));
