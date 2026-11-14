/* Bounded Dijkstra search from a known object seed. A final natural primal can
 * have at most one missing target family when a legal Mystic swap is available.
 * Runtime season rules must supply the exact allowed operation list. */
export function searchUniversalRoute(engine,query,seed,{
 goals=[],targetItem=query,allowed=['R'],maxR=5,maxS=20,maxP=0,maxC=0,maxSteps=16,maxNodes=20000,
 weights={R:9,S:1,P:30,C:3},allowMystic=true,expectedPrimal=true
}={}){
 const start=engine.item(query),target=engine.item(targetItem);if(!start||!target)throw Error('Current or desired item not in database');
 if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Bad seed');
 const toStem=x=>x.stem;const wanted=[...new Set(goals)].filter(Boolean);
 if(!wanted.length)throw Error('Select at least one target affix');
 const q=[{seed,item:start.name,cost:0,path:'',steps:[],r:0,s:0,p:0,c:0}];const seen=new Map();let visited=0;
 function validate(r){if(r.itemId!==target.id)return null;if(expectedPrimal&&r.quality!=='primal')return null;
  if(!expectedPrimal&&!['primal','crafted'].includes(r.quality))return null;
  const stems=r.affixes.map(toStem),missing=wanted.filter(x=>!stems.includes(x));
  if(!missing.length)return {mystic:null};
  if(!allowMystic||missing.length!==1)return null;
  const candidate=engine.candidateAffixes(r.item).filter(x=>x.label.split(/\s/)[0]===missing[0]);
  if(!candidate.length)return null;
  const excluded=wanted.filter(x=>stems.includes(x));
  for(const a of r.affixes){if(a.socket||excluded.includes(a.stem))continue;
   const old=engine.idIndex.get(a.id),others=r.affixes.filter(x=>x!==a).map(x=>engine.idIndex.get(x.id));
   const available=candidate.some(next=>{const idx=engine.idIndex.get(next.id);return next.pick_kind===a.kind&&!engine.excluded(idx,others)&&engine.fits(idx,others)});
   if(available)return {mystic:`${a.stem} → ${missing[0]}`};
  }
  return null;
 }
 while(q.length&&visited<maxNodes){q.sort((a,b)=>a.cost-b.cost||a.path.length-b.path.length);const node=q.shift();visited++;
  if(node.path.length>=maxSteps)continue;
  for(const op of allowed){if(op==='S'&&node.s>=maxS||op==='R'&&node.r>=maxR||op==='P'&&node.p>=maxP||op==='C'&&node.c>=maxC)continue;
   if(op==='C'&&(!engine.item(node.item).set_id||engine.items.filter(x=>x.set_id===engine.item(node.item).set_id).length<3))continue;
   let r;try{r=engine.apply(node.item,node.seed,op);}catch{continue;}
   const next={...node,seed:r.seed,item:r.item,cost:node.cost+(weights[op]??10),path:node.path+op,steps:[...node.steps,r],
    r:node.r+(op==='R'?1:0),s:node.s+(op==='S'?1:0),p:node.p+(op==='P'?1:0),c:node.c+(op==='C'?1:0)};
   if(op!=='S'&&(op!=='P'||!expectedPrimal)){
    const result=validate(r);if(result)return {found:true,...next,visited,mystic:result.mystic,
     materials:{souls:50*next.r+10*next.c,actMaterials:5*next.r,crucibles:next.s,ashes:100*next.p,deathBreaths:10*next.c}};
   }
   const key=`${next.item}:${next.seed}:${next.r}:${next.s}:${next.p}:${next.c}`;
   if((seen.get(key)??Infinity)<=next.cost)continue;seen.set(key,next.cost);q.push(next);
  }
 }
 return {found:false,visited,reason:visited>=maxNodes?'Search limit reached; no recipe has been confirmed.':'No qualifying recipe found within limits.'};
}
