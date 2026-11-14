/* Off-main-thread analysis and filtering keeps Android UI responsive.
 * Filter operations never mutate the stored candidate list until the host commits a verified result.
 */
import {UniversalEngine} from './universal-engine.js';
import {analyzeCandidateActions,findSharedNaturalPrimalRoute,validSeeds,matchesObservation} from './candidate-analysis.js';
self.onmessage=({data})=>{
 if(!['analyze','filter'].includes(data?.type))return;
 try{
  const {gameData,hero,itemId}=data,engine=new UniversalEngine(gameData,hero,true),item=engine.item(itemId);
  if(!item)throw Error('The selected item is not in the game database.');
  if(data.type==='filter'){
   const seeds=validSeeds(data.seeds);
   const {op,observation}=data;
   if(!['R','S','C','P'].includes(op))throw Error('Unsupported game operation.');
   if(!observation||!Array.isArray(observation.lines))throw Error('Invalid observation.');
   const survivors=[],total=seeds.length;
   self.postMessage({type:'progress',message:`Comparing ${total} candidate seeds against the real ${op} result…`});
   for(let i=0;i<total;i++){
    try{
     const result=engine.apply(item,seeds[i],op);
     if(matchesObservation(result,observation))survivors.push(result.seed);
    }catch{}
    if((i+1)%512===0||i+1===total)
     self.postMessage({type:'progress',message:`Verified ${i+1} / ${total} modeled candidates…`});
   }
   self.postMessage({type:'filtered',seeds:validSeeds(survivors),checked:total});
   return;
  }
  const {targetItemId,seeds,allowed,goals,allowConvert,allowCrafted}=data,target=engine.item(targetItemId||itemId);
  if(!target)throw Error('The selected target is not in the game database.');
  self.postMessage({type:'progress',message:'Comparing information gained and possible progress toward the selected target…'});
  const summary=analyzeCandidateActions(engine,item,seeds,{allowed,goals,targetItem:target,allowConvert,allowCrafted});
  self.postMessage({type:'progress',message:'Checking short routes, including Convert Set Item and return-to-target sequences…'});
  const shared=findSharedNaturalPrimalRoute(engine,item,seeds,{allowed,goals,targetItem:target,maxSteps:5,maxNodes:80,allowConvert});
  self.postMessage({type:'complete',summary,shared});
 }catch(e){self.postMessage({type:'error',message:String(e?.message||e)});}
};
