import {UniversalEngine} from './universal-engine.js';
import {searchBudgetPrimal} from './v05-budget-planner.js';
self.onmessage=({data:d})=>{
 if(d?.type!=='plan')return;
 try{
  const engine=new UniversalEngine(d.gameData,d.hero,true);
  const result=searchBudgetPrimal(engine,{
   itemId:d.itemId,targetItemId:d.targetItemId,seed:d.seed,
   goals:d.goals,budget:d.budget,maxSteps:d.maxSteps,maxNodes:d.maxNodes,
   allowMystic:d.allowMystic,requireResistance:d.requireResistance,
   allowConvert:d.allowConvert,
   onProgress:v=>self.postMessage({type:'progress',...v})
  });
  self.postMessage({type:'complete',...result});
 }catch(err){self.postMessage({type:'error',message:String(err?.message||err)});}
};
