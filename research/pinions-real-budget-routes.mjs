import {readFileSync} from 'node:fs';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {searchBudgetPrimal} from '../src/v05-budget-planner.js';
const recovery=JSON.parse(readFileSync('/tmp/pinions-real-recovery.json','utf8'));
if(recovery.matches.length!==1){
 console.log('PINIONS_ROUTE_NOT_SAFE',JSON.stringify({reason:'Current Reforge seed is not unique.',count:recovery.matches.length}));
 process.exit(0);
}
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const item=e.item("Firebird's Pinions"),seed=recovery.matches[0].now;
const costProfile=process.env.COST_PROFILE||'balanced';
const settings={
 cheap:{souls:100,crucibles:2,deathBreaths:20,actMaterialsEach:10,nodes:180000},
 balanced:{souls:150,crucibles:3,deathBreaths:50,actMaterialsEach:15,nodes:450000},
 extra:{souls:250,crucibles:5,deathBreaths:90,actMaterialsEach:25,nodes:650000},
 no_crucibles:{souls:350,crucibles:0,deathBreaths:120,actMaterialsEach:35,nodes:650000},
 no_mystic:{souls:250,crucibles:5,deathBreaths:90,actMaterialsEach:25,nodes:600000},
}[costProfile];
if(!settings)throw Error('Bad cost profile');
const search=[
 {label:'Life15 + resist, one legal Mystic',goals:['Int','ResourceCostReduction','CooldownReduction','Life'],resist:true,mystic:true},
 {label:'Vit650 + resist, one legal Mystic',goals:['Int','ResourceCostReduction','CooldownReduction','Vit'],resist:true,mystic:true},
 {label:'Armor775 + resist, one legal Mystic',goals:['Int','ResourceCostReduction','CooldownReduction','DR'],resist:true,mystic:true},
 {label:'Life15 or Vit650 or Armor775, no forced resist',goals:['Int','ResourceCostReduction','CooldownReduction','Life'],resist:false,mystic:true},
 {label:'All natural (Life+resist), no Mystic',goals:['Int','ResourceCostReduction','CooldownReduction','Life'],resist:true,mystic:false},
];
const results=[];
for(const config of search){
 if(costProfile==='no_mystic'&&config.mystic)continue;
 const r=searchBudgetPrimal(e,{
  itemId:item.id,targetItemId:item.id,seed,goals:config.goals,
  budget:settings,maxSteps:22,maxNodes:settings.nodes,
  allowMystic:config.mystic,requireResistance:config.resist,allowConvert:true
 });
 const summary={label:config.label,goals:config.goals,requireResist:config.resist,allowMystic:config.mystic,
  visited:r.visited,goalsFound:r.goalsFound,truncated:r.truncated,
  best:r.best&&{
   path:r.best.path,materials:r.best.materials,mystic:r.best.goal.mystic,
   secondary:r.best.goal.secondary,lastSeed:r.best.lastSeed,
   lastAffixes:r.best.steps.at(-1).affixes,lastLines:r.best.steps.at(-1).lines,
   steps:r.best.steps.map((v,i)=>({n:i+1,op:v.op,item:v.item,quality:v.quality,seed:v.seed,lines:v.lines}))
  }};
 results.push(summary);
 console.log('PINIONS_ROUTE_OPTION',JSON.stringify({costProfile,...summary}));
}
console.log('PINIONS_ROUTE_SUMMARY',JSON.stringify({costProfile,seed,results:results.map(({label,visited,goalsFound,truncated,best})=>({label,visited,goalsFound,truncated,path:best?.path,materials:best?.materials,mystic:best?.mystic}))}));
