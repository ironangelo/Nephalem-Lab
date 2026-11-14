import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const db=await loadGameData(),e=new UniversalEngine(db,'Wizard',true),target=e.item("Firebird's Breast");
const key0=3835143639,red=new Set(['DefenseMelee','DefenseMissile']),resist=new Set(['FireResist','ColdResist','LightningResist','PoisonResist','ArcaneResist','PhysicalResist']);
const goals=['Life','Vit','DefenseMelee','DefenseMissile','FireResist','ColdResist','LightningResist','PoisonResist','ArcaneResist','PhysicalResist'];
const replace=new Map();for(const stem of goals)replace.set(stem,e.candidateAffixes(target).filter(a=>affixStem(a.label)===stem));
const good=(stems)=>{
 const x=new Set(stems);return x.has('Life')&&x.has('Vit')&&[...red].some(s=>x.has(s))&&[...resist].some(s=>x.has(s));
};
function validates(r){
 const a=r.affixes,base=a.map(x=>x.stem);
 if(good(base))return {mystic:null};
 for(let i=0;i<a.length;i++){
  if(a[i].socket||a[i].stem==='Int'||a[i].stem==='Sockets')continue;
  const rest=a.filter((_,j)=>i!==j).map(x=>e.idIndex.get(x.id));
  for(const stem of goals){
   if(base.includes(stem))continue;
   if(!replace.get(stem).some(x=>x.pick_kind===a[i].kind&&!e.excluded(e.idIndex.get(x.id),rest)&&e.fits(e.idIndex.get(x.id),rest)))continue;
   const mutated=base.slice();mutated[i]=stem;if(good(mutated))return {mystic:{from:a[i].stem,to:stem}};
  }
 }
 return null;
}
const queue=[{item:target.name,seed:key0,path:'',r:0,s:0,c:0}];
const visited=new Set([target.name+'/'+key0]);
let front=0,depth=0,solutions=[],primalTotal=0;
while(front<queue.length&&depth<=13){
 const end=queue.length;let layer=0;
 for(;front<end;front++){
  const x=queue[front];if(x.path.length!==depth)throw Error('Invalid BFS layer');
  if(x.path.length>=13)continue;
  for(const op of ['R','S','C']){
   if(op==='C'&&!e.item(x.item).set_id)continue;
   let rr;try{rr=e.apply(x.item,x.seed,op);}catch{continue;}
   const path=x.path+op;
   if(op==='R'&&rr.quality==='primal'&&rr.item===target.name){
    primalTotal++;
    const q=validates(rr);if(q){
     const o={path,steps:path.length,reforges:x.r+1,converts:x.c,crucibles:x.s,seed:rr.seed,
      mystic:q.mystic,affixes:rr.affixes.map(a=>a.stem),lines:rr.lines.map(a=>({name:a.stem,value:a.value}))};
     solutions.push(o);
     console.log('COMPLETE_MATCH',JSON.stringify(o));
    }
   }
   const nextKey=rr.item+'/'+rr.seed;
   if(visited.has(nextKey))continue;
   visited.add(nextKey);
   queue.push({item:rr.item,seed:rr.seed,path,r:x.r+(op==='R'),s:x.s+(op==='S'),c:x.c+(op==='C')});
   layer++;
  }
 }
 console.log('DEPTH',JSON.stringify({depth,layerSize:end-(depth===0?0:0),newNodes:layer,checked:front,queued:queue.length,primals:primalTotal,strict:solutions.length}));
 if(solutions.length){console.log('SHORTEST_RESULT',JSON.stringify({minOperations:solutions[0].steps,solutions:solutions.slice(0,40)}));break;}
 depth++;
 if(queue.length>1400000){console.log('STOP_MAX_QUEUE');break;}
}
console.log('SHORTEST_SEARCH_END',JSON.stringify({processed:front,remaining:queue.length-front,found:solutions.length}));
