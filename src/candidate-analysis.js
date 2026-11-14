/* Nephalem Lab: ambiguous-seed analysis, goal-aware diagnostics and set routes.
 * Numerical candidates are not proof of a true game seed. All conclusions
 * remain conditional until confirmed with an independent console observation.
 */
import {isSocketLine,validSocketCount} from './observation-fields.js';
const OPS={
 R:{souls:50,actMaterialsEach:5,crucibles:0,deathBreaths:0,ashes:0,weight:9},
 S:{souls:0,actMaterialsEach:0,crucibles:1,deathBreaths:0,ashes:0,weight:1},
 C:{souls:10,actMaterialsEach:0,crucibles:0,deathBreaths:10,ashes:0,weight:3},
 P:{souls:0,actMaterialsEach:0,crucibles:0,deathBreaths:0,ashes:100,weight:30}
};
export function validSeeds(values,{max=10000}={}){
 if(!Array.isArray(values)||values.length>max)throw Error('Invalid candidate list size');
 return [...new Set(values.map(Number))].filter(x=>Number.isInteger(x)&&x>=0&&x<=4294967295);
}
export const operationCosts=op=>({...OPS[op]});
const shownNumber=v=>!Number.isFinite(v)?'unknown':Math.abs(v)<1?Number(v.toFixed(3)):Number(v.toFixed(0));
export function visibleResultSignature(r){
 const affixes=r.affixes.map(a=>`${a.stem}:${a.kind}`).sort();
 const stats=r.lines.map(l=>`${l.attr}:${l.stem}:${shownNumber(l.value)}`).sort();
 return JSON.stringify([r.itemId,r.quality,affixes,stats]);
}
export function matchesObservation(r,o){
 if(!r||!o||r.quality!==o.quality)return false;
 if(o.itemId!==undefined&&o.itemId!==null&&r.itemId!==o.itemId)return false;
 return (o.lines||[]).every(l=>{
  if(isSocketLine(l))return validSocketCount(l.value)&&r.affixes.some(a=>a.socket||a.stem==='Sockets');
  return r.lines.some(v=>v.attr===l.attr&&v.stem===l.stem&&
   [Number(l.value),Number(l.value)/100,Number(l.value)/1000].some(w=>
    Math.abs(v.value-w)<(Math.abs(v.value)>=1?.55:.00051)));
 });
}
export function advanceCandidates(engine,item,seeds,op,observation){
 if(!['R','S','P','C'].includes(op))throw Error('Unsupported operation');
 if(op==='C'&&(!observation.itemId||!engine.item(observation.itemId)))throw Error('Choose the resulting set piece after Convert Set Item.');
 const survivors=[];
 for(const seed of validSeeds(seeds)){
  let r;try{r=engine.apply(item,seed,op);}catch{continue;}
  if(matchesObservation(r,observation))survivors.push(r.seed);
 }
 return validSeeds(survivors);
}
function setSize(engine,item){
 const it=engine.item(item);return it?.set_id?engine.items.filter(x=>x.set_id===it.set_id).length:0;
}
export function allowedDiagnosticOperations(engine,item,seasonAllowed,{allowCrafted=false,allowConvert=true}={}){
 const it=engine.item(item);if(!it)return [];
 const current=Array.isArray(seasonAllowed)?seasonAllowed:[];
 return ['S','R','C','P'].filter(op=>op==='C'?allowConvert&&setSize(engine,it)>=3:
  op==='P'?allowCrafted:current.includes(op));
}
function goalResult(r,targetId,goals){
 return r.itemId===targetId&&r.quality==='primal'&&goals.every(g=>r.affixes.some(a=>a.stem===g));
}
function extraGoalRoute(engine,first,targetId,goals,ops){
 if(!goals.length)return false;
 if(goalResult(first,targetId,goals))return true;
 // This is a short *possibility indicator*, not a prescription or expected success rate.
 const future=first.itemId!==targetId?['C','R']:['R'];
 if(!future.every(x=>ops.includes(x)))return false;
 let state=first;
 try{for(const op of future)state=engine.apply(state.item,state.seed,op);}catch{return false;}
 return goalResult(state,targetId,goals);
}
export function analyzeCandidateActions(engine,item,candidates,{
 allowed=['R'],goals=[],targetItem=item,allowCrafted=false,allowConvert=true}={}){
 const seeds=validSeeds(candidates);if(!seeds.length)throw Error('No candidate seeds to analyze.');
 const current=engine.item(item),target=engine.item(targetItem);
 if(!current||!target)throw Error('Unrecognized current or target item.');
 const operations=allowedDiagnosticOperations(engine,current,allowed,{allowCrafted,allowConvert});
 const outcomes=[];
 for(const op of operations){
  const groups=new Map();let unsupported=0,meeting=0,changed=0,nearGoal=0;
  for(const seed of seeds){
   let result;try{result=engine.apply(current,seed,op);}catch{unsupported++;continue;}
   const key=visibleResultSignature(result),g=groups.get(key);
   if(g)g.size++;else groups.set(key,{size:1,example:result,signature:key});
   if(result.itemId!==current.id)changed++;
   if(goalResult(result,target.id,goals))meeting++;
   if(extraGoalRoute(engine,result,target.id,goals,operations))nearGoal++;
  }
  const buckets=[...groups.values()].sort((a,b)=>b.size-a.size),resolved=seeds.length-unsupported;
  const entropy=resolved?Math.log2(resolved)-buckets.reduce((s,g)=>s+g.size/resolved*Math.log2(g.size),0):0;
  const expected=resolved?buckets.reduce((s,g)=>s+g.size*g.size,0)/resolved:0;
  // Score is a preference metric, *not* a probability or a claim of lowest real material price.
  const goalScore=goals.length?nearGoal/seeds.length:0;
  const informationPerWeight=entropy/OPS[op].weight;
  const preferenceScore=informationPerWeight+2*goalScore;
  outcomes.push({op,cost:operationCosts(op),samples:buckets.slice(0,3).map(g=>({count:g.size,example:g.example})),
   outcomeCount:buckets.length,expectedRemaining:+expected.toFixed(2),worstRemaining:buckets[0]?.size??0,
   informationBits:+entropy.toFixed(3),potentialNaturalPrimalGoals:meeting,nearGoalPaths:nearGoal,
   sameVisibleOutcome:buckets.length===1,changesItem:changed>0,unsupported,
   approximateInformationPerWeight:informationPerWeight,preferenceScore:+preferenceScore.toFixed(4)});
 }
 outcomes.sort((a,b)=>b.preferenceScore-a.preferenceScore||a.cost.weight-b.cost.weight);
 return {seedCount:seeds.length,goals,targetItem:target.name,operations:outcomes,
  note:'Goal-aware preference scores use approximate relative costs and a bounded lookahead. They are NOT success probabilities or proof of correct seeds. A conversion never gives an Ancient/Primal by itself. Seasonal sanctified powers remain unmodeled.'};
}
/* Find ONE fixed recipe that succeeds for every candidate (not a splice of
 * different candidate routes). The path may convert out of the set piece and
 * return, but its LAST result must be the desired exact item and natural primal.
 */
export function findSharedNaturalPrimalRoute(engine,item,candidates,{
 goals=[],targetItem=item,allowed=['R'],maxSteps=5,maxNodes=100,allowConvert=true}={}){
 const seeds=validSeeds(candidates,{max:5000}),start=engine.item(item),target=engine.item(targetItem);
 if(!start||!target)throw Error('Unrecognized current or desired item.');
 if(!goals.length)return {found:false,skipped:true,reason:'Select target affixes to search for a shared path.'};
 const ops=allowedDiagnosticOperations(engine,start,allowed,{allowConvert,allowCrafted:false});
 if(!ops.includes('R'))return {found:false,skipped:true,reason:'No natural primal-producing operation is enabled.'};
 const limitSteps=Math.min(7,Math.max(1,maxSteps)),limitNodes=Math.min(300,Math.max(1,maxNodes));
 const q=[{path:'',cost:0,states:seeds.map(seed=>({item:start.name,seed}))}];let visited=0;
 while(q.length&&visited<limitNodes){
  q.sort((a,b)=>a.cost-b.cost||a.path.length-b.path.length);const node=q.shift();visited++;
  if(node.path.length>=limitSteps)continue;
  for(const op of ops){
   const updated=[];let applicable=true,allGoal=true;
   for(const state of node.states){
    let r;try{r=engine.apply(state.item,state.seed,op);}catch{applicable=false;break;}
    updated.push({item:r.item,seed:r.seed});
    if(!goalResult(r,target.id,goals))allGoal=false;
   }
   if(!applicable)continue;
   const path=node.path+op,cost=node.cost+OPS[op].weight;
   if(op==='R'&&allGoal)return {found:true,path,cost,visited,allCandidates:seeds.length,
    materials:{souls:50*(path.match(/R/g)||[]).length+10*(path.match(/C/g)||[]).length,
     deathBreaths:10*(path.match(/C/g)||[]).length,actMaterialsEach:5*(path.match(/R/g)||[]).length,
     crucibles:(path.match(/S/g)||[]).length},
    caveat:'Conditional model result; candidate seeds and game behavior require independent confirmation.'};
   if(path.length<limitSteps)q.push({path,cost,states:updated});
  }
 }
 return {found:false,visited,limitReached:visited>=limitNodes,maxSteps:limitSteps,maxNodes:limitNodes,
  reason:`No shared fixed recipe for all ${seeds.length} seeds found within ${limitSteps} operations / ${limitNodes} states. This does not prove none exists.`};
}
