/* Simulation in a worker keeps Android responsive while comparing candidates. */
import {UniversalEngine} from './universal-engine.js';
import {analyzeCandidateActions,findSharedNaturalPrimalRoute} from './candidate-analysis.js';
self.onmessage=({data})=>{
 if(data?.type!=='analyze')return;
 try{
  const {gameData,hero,itemId,targetItemId,seeds,allowed,goals,allowConvert,allowCrafted}=data;
  const engine=new UniversalEngine(gameData,hero,true),item=engine.item(itemId),target=engine.item(targetItemId||itemId);
  if(!item||!target)throw Error('The selected item or target is not in the game database.');
  self.postMessage({type:'progress',message:'Comparing information gained and possible progress toward the selected target…'});
  const summary=analyzeCandidateActions(engine,item,seeds,{allowed,goals,targetItem:target,allowConvert,allowCrafted});
  self.postMessage({type:'progress',message:'Checking short routes, including Convert Set Item and return-to-target sequences…'});
  const shared=findSharedNaturalPrimalRoute(engine,item,seeds,{allowed,goals,targetItem:target,maxSteps:5,maxNodes:80,allowConvert});
  self.postMessage({type:'complete',summary,shared});
 }catch(e){self.postMessage({type:'error',message:String(e?.message||e)});}
};
