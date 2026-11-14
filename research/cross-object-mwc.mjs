import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true);
for(const [item,seed,target] of [["Convention of Elements",3035692732,4015360194],["Firebird's Breast",3525123180,2645309652],["Firebird's Breast",2645309652,3835143639]]){
 const result=e.reforge(item,seed);
 console.log('CROSS_OBJECT_REFERENCE',JSON.stringify({item,seed,expectedSeed:target,actualSeed:result.seed,draws:result.draws,quality:result.quality,seedMatches:result.seed===target}));
 if(result.seed!==target)throw Error('Mismatch '+item+' seed '+seed);
}
