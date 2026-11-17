import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {searchBudgetPrimal} from '../src/v05-budget-planner.js';
import assert from 'node:assert/strict';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const t0=Date.now();
const cases=[
 {name:"Real Firebird's Down",item:"Firebird's Down",seed:1745067528,
  goals:['Int','Vit','DR','Sockets'],resist:true,
  budget:{souls:150,crucibles:3,deathBreaths:50,actMaterialsEach:10},
  expect:'CCRSCCSSCR',nodes:1500000},
 {name:"Real Firebird's Breast",item:"Firebird's Breast",seed:2645309652,
  goals:['Int','Vit','Sockets','DR'],resist:false,
  budget:{souls:300,crucibles:10,deathBreaths:150,actMaterialsEach:30},
  expect:null,nodes:150000}
];
for(const test of cases){
 const started=Date.now();
 const r=searchBudgetPrimal(e,{itemId:e.item(test.item).id,targetItemId:e.item(test.item).id,
  seed:test.seed,goals:test.goals,requireResistance:test.resist,budget:test.budget,
  maxSteps:18,maxNodes:test.nodes,allowMystic:true,allowConvert:true,
  onProgress:x=>console.log('BUDGET_PROGRESS',test.name,x.visited,x.goalsFound)});
 console.log('BUDGET_V05_CASE',JSON.stringify({name:test.name,elapsedMs:Date.now()-started,
  visited:r.visited,goals:r.goalsFound,truncated:r.truncated,
  result:r.best&&{path:r.best.path,materials:r.best.materials,mystic:r.best.goal.mystic,
   quality:r.best.steps.at(-1).quality,final:r.best.steps.at(-1).lines}}));
 if(test.expect){
  assert(r.best,'Expected known real Firebird route as a discoverable result');
  assert.equal(r.best.path,test.expect,'Must discover the same recipe without a hardcoded seed route');
  assert.equal(r.best.steps.at(-1).quality,'primal');
 }
}
console.log('BUDGET_V05_TOTAL_MS',Date.now()-t0);
