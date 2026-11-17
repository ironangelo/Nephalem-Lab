import assert from 'node:assert/strict';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {generateObservedReforgeHypotheses} from '../src/v05-reforge-hypotheses.js';
import {verifyHypothesis} from '../src/universal-recovery.js';
import {searchBudgetPrimal} from '../src/v05-budget-planner.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const fixtures=[
 {name:"Firebird's Breast",start:3835143639,path:'SSSSCSSCCSSR',final:1415768159,
  diagnostic:{before:3525123180,after:2645309652}},
 {name:"Firebird's Down",start:1745067528,path:'CCRSCCSSCR',final:2401341781,
  diagnostic:{before:2538758317,after:1745067528}},
 {name:'Deathwish',start:46826983,path:'SRRSSRSSSSSSSSSSSSSSSRR',final:1326569675,
  diagnostic:{before:1184690904,after:46826983}},
 {name:"Squirt's Necklace",start:800657787,path:'SSSSSRSSRSSSSSSRSSSR',final:142853246,
  diagnostic:{before:3668729561,after:800657787}},
 {name:'Obsidian Ring of the Zodiac',start:1805687870,path:'SRSSRSSRSSR',final:548457781,
  diagnostic:{before:1290971892,after:1805687870}},
 {name:"Firebird's Eye",initialItem:"Firebird's Down",start:930643368,path:'SSSSSRCSCR',final:1980719662}
];
const outcomes=[];
for(const f of fixtures){
 const initial=e.item(f.initialItem||f.name);
 let current=initial,seed=f.start,step=0;
 for(const op of f.path){
  const r=e.apply(current,seed,op);
  current=e.item(r.itemId);seed=r.seed;step++;
  if(step===f.path.length)assert.equal(r.quality,'primal',f.name+' must end on natural Primal');
 }
 assert.equal(seed,f.final,f.name+' final inferred seed mismatch');
 assert.equal(current.name,f.name,f.name+' must return to exact target item');
 let verifiedHyp=null;
 if(f.diagnostic){
  const r=e.reforge(e.item(f.name),f.diagnostic.before);
  assert.equal(r.seed,f.diagnostic.after,f.name+' real diagnostic R transition mismatch');
  assert.equal(r.quality,'normal');
  const obs={quality:'normal',itemId:r.itemId,
    lines:r.lines.map(x=>({stem:x.stem,attr:x.attr,value:x.value}))};
  const hyps=generateObservedReforgeHypotheses(e,e.item(f.name),obs,{maxHypotheses:512});
  assert(hyps.some(h=>verifyHypothesis(e,e.item(f.name),r.seed,h)),f.name+' inverse hypotheses must contain real child state');
  verifiedHyp=hyps.length;
 }
 outcomes.push({name:f.name,steps:f.path.length,final:f.final,diagnosticHypotheses:verifiedHyp,quality:'primal'});
 console.log('V05_REAL_JOURNEY_REGRESSION',JSON.stringify(outcomes.at(-1)));
}
console.log('V05_JOURNEY_SUITE_COMPLETE',JSON.stringify({cases:outcomes.length,allRoutesVerified:true,allDiagnosticModelTests:5,notes:'Deterministic engine regression; full 2^32 user workflow is tested separately in Chromium.'}));
