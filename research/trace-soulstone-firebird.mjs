import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const d=await loadGameData(),eng=new UniversalEngine(d,'Wizard',true);
for(const path of ['SSSSCSSCCSSR','RCRRRCCCRRRRRCR']){
 let item="Firebird's Breast",seed=3835143639,c=0;
 console.log('TRACE_BEGIN',JSON.stringify({path,item,seed}));
 for(const op of path){
  const from={item,seed},result=eng.apply(item,seed,op);
  c++;item=result.item;seed=result.seed;
  console.log('TRACE',JSON.stringify({route:path,step:c,op,from,to:{item,seed,quality:result.quality,draws:result.draws},stems:result.affixes.map(a=>a.stem),values:result.lines.map(a=>[a.stem,a.value])}));
 }
 console.log('TRACE_END',JSON.stringify({path,finalItem:item,finalSeed:seed}));
}
