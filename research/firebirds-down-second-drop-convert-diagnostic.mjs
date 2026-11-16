// Research: distinguish the OLD unverified original-drop inverse from
// a potential low-cost Convert Set Item diagnostic (10 Forgotten Souls).
// Only tests SYNTHETIC states, no in-game materials used.
// A valid recovery must find the real child seed among computed hypotheses
// and be tested against a second *real* console operation before route advice.
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const from=e.item("Firebird's Down");
for(const start of [1,8,42,46826983,1805687870,2279251711,3942680837,0xFFFFFFFE]){
 const x=e.convert(from,start),to=e.item(x.item);
 const obs={quality:'normal',lines:x.lines.map(l=>({stem:l.stem,attr:l.attr,value:l.value}))};
 let hypothesisCount=0,verifiedCount=0,error=null,foundFirst=-1;
 try{
  const hs=generateRecoveryHypotheses(e,to,obs,{maxHypotheses:4000});
  hypothesisCount=hs.length;
  for(let j=0;j<hs.length;j++)if(verifyHypothesis(e,to,x.seed,hs[j])){verifiedCount++;if(foundFirst===-1)foundFirst=j;}
 }catch(err){error=String(err)}
 console.log('FBDOWN_CONVERT_DIAGNOSTIC',JSON.stringify({
  start,convertedTo:x.item,convertedQuality:x.quality,resultChildSeed:x.seed,draws:x.draws,
  affixes:x.affixes.map(y=>({stem:y.stem,id:y.id})),
  observed:obs.lines.map(l=>[l.stem,l.value,l.attr]),
  hypothesisCount,verifiedCount,firstMatchingHypothesis:foundFirst,error
 }));
}
