import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {searchBudgetPrimal} from '../src/v05-budget-planner.js';
import assert from 'node:assert/strict';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const cases=[
 {name:'Zodiac Soulstone secondary+socket',item:'Obsidian Ring of the Zodiac',seed:1805687870,
  goals:['CooldownReduction','CriticalChance','ResourceCostReduction','Sockets','CCReduction'],
  budget:{souls:200,crucibles:7,deathBreaths:0,actMaterialsEach:20},
  maxSteps:11,maxNodes:100000,expected:'SRSSRSSRSSR',resist:false},
 {name:"Firebird Breast 12-step",item:"Firebird's Breast",seed:3835143639,
  goals:['Int','Vit','Life','Sockets','FireResist'],
  budget:{souls:80,crucibles:8,deathBreaths:30,actMaterialsEach:5},
  maxSteps:12,maxNodes:200000,expected:'SSSSCSSCCSSR',resist:true},
 {name:"Squirt economical 20-step",item:"Squirt's Necklace",seed:800657787,
  goals:['DamageBonusFire','CriticalD','CriticalChance','Sockets'],
  budget:{souls:200,crucibles:16,deathBreaths:0,actMaterialsEach:20},
  maxSteps:20,maxNodes:350000,expected:'SSSSSRSSRSSSSSSRSSSR',resist:false}
];
for(const c of cases){
 const t=Date.now(),it=e.item(c.item);
 const out=searchBudgetPrimal(e,{itemId:it.id,targetItemId:it.id,seed:c.seed,goals:c.goals,
  budget:c.budget,maxSteps:c.maxSteps,maxNodes:c.maxNodes,allowMystic:true,
  requireResistance:c.resist,allowConvert:true});
 console.log('V05_BUDGET_HISTORICAL_COMPARE',JSON.stringify({case:c.name,
  expected:c.expected,got:out.best?.path,spent:out.best?.materials,goal:out.best?.goal,
  visited:out.visited,truncated:out.truncated,seconds:(Date.now()-t)/1000}));
 if(!out.best)throw Error('No valid primal path under historical budget: '+c.name);
 assert.equal(out.best.steps.at(-1).quality,'primal');
 if(out.best.path!==c.expected)console.log('V05_BUDGET_DIFFERENT_VALID_ROUTE',JSON.stringify({case:c.name,actualHistorical:c.expected,found:out.best.path}));
}
