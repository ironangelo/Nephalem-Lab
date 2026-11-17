import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {matchesObservation} from '../src/candidate-analysis.js';
import {generateObservedReforgeHypotheses} from '../src/v05-reforge-hypotheses.js';
import {verifyHypothesis} from '../src/universal-recovery.js';
const {instance}=await WebAssembly.instantiate(readFileSync('solver/scan.wasm'));
const w=instance.exports;
const engine=new UniversalEngine(await loadGameData(),'Wizard',true);
for(const [itemName,parent] of [["Firebird's Down",2538758317],["Firebird's Breast",3525123180],["Squirt's Necklace",3668729561],["Deathwish",1184690904],["Obsidian Ring of the Zodiac",1290971892]]){
 const item=engine.item(itemName),result=engine.reforge(item,parent);
 if(result.quality!=='normal')continue;
 const obs={itemId:item.id,quality:'normal',lines:result.lines.map(x=>({stem:x.stem,attr:x.attr,value:x.value}))};
 const hs=generateObservedReforgeHypotheses(engine,item,obs,{maxHypotheses:512});
 const valueMatch=hs.filter(x=>verifyHypothesis(engine,item,result.seed,x)).length;
 w.set_child_count(1);w.set_child_seed(0,result.seed);w.set_parent_quality(0);
 const count=w.scan_parents(parent,1);
 const hits=Array.from({length:count},(_,i)=>({parent:w.parent_result_at(i)>>>0,child:w.parent_child_at(i)>>>0,draws:w.parent_draws_at(i)}));
 const obsMatched=matchesObservation(result,obs);
 console.log('V05_WASM_PARENT_UNIT',JSON.stringify({item:itemName,parent,child:result.seed,actualDraws:result.draws,count,hits,hs:hs.length,valueMatch,obsMatched}));
 assert(valueMatch>0,'Hypotheses must include actual child seed');
 assert(obsMatched,'Full tooltip must match original engine');
 assert(hits.some(h=>h.parent===parent&&h.child===result.seed&&h.draws===result.draws),'WASM must recover the exact parent, child AND draw count of the actual Reforge');
}
