import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true),first=e.item("Firebird's Down");
const starts=[{name:'budget_mystic_resist',path:'CCRSCCSSCR'},{name:'exact_natural_resist',path:'CCCRCSCCCSCCCCR'},{name:'souls_140_5S',path:'SCCSSSCSCRR'},{name:'short_7_steps',path:'SRSSSRR'}];
for(const {name,path} of starts){
 let seed=1745067528,it=first;
 const steps=[];
 for(const [i,op] of [...path].entries()){
  const r=e.apply(it,seed,op);
  steps.push({step:i+1,op,from:seed,quality:r.quality,item:r.item,childSeed:r.seed,affixes:r.affixes.map(x=>x.stem),stats:r.lines.map(x=>[x.stem,x.value])});
  seed=r.seed;it=e.item(r.itemId);
 }
 console.log('FBDOWN_REAL_RECIPE_STEPS',JSON.stringify({name,path,steps}));
}
