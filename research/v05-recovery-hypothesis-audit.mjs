import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
for(const [itemName,parent] of [["Firebird's Down",2538758317],["Firebird's Breast",3525123180],["Obsidian Ring of the Zodiac",1290971892],["Deathwish",1184690904]]){
 const item=e.item(itemName),r=e.reforge(item,parent);
 const obs={quality:r.quality,itemId:r.itemId,lines:r.lines.map(x=>({stem:x.stem,attr:x.attr,value:x.value})).concat(r.affixes.filter(a=>a.socket).map(a=>({stem:'Sockets',value:2})))};
 try{const hs=generateRecoveryHypotheses(e,item,obs,{maxHypotheses:10000});console.log('REPLAY_HYPOTHESES',JSON.stringify({itemName,parent,seed:r.seed,quality:r.quality,affixes:r.affixes.map(x=>x.stem),hypCount:hs.length,actualSeedMatched:hs.some(h=>verifyHypothesis(e,item,r.seed,h)),constraints:hs.slice(0,3).map(h=>h.constraints)}));}
 catch(err){console.log('REPLAY_ERROR',JSON.stringify({itemName,parent,quality:r.quality,message:err.message}));}
}
