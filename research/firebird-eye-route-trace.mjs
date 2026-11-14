import assert from 'node:assert/strict';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true);
const generated=e.convert("Firebird's Eye",4016194486);
assert.equal(generated.item,"Firebird's Down");
assert.equal(generated.seed,930643368);
const visible=[['Int',425],['Vit',490],['FireResist',148],['Thorns',2621],['Skill_Wizard_MagicMissile',0.1]];
for(const [stem,val]of visible){
 const line=generated.lines.find(x=>x.stem===stem);
 assert.ok(line&&Math.abs(line.value-val)<.00001,'MISMATCH SOURCE '+stem);
}
console.log('REAL_CONVERSION_REPLAY',JSON.stringify({seedSource:4016194486,source:"Firebird's Eye",seedTarget:generated.seed,target:generated.item,stats:generated.lines.map(x=>[x.stem,x.value])}));
for(const path of ['SSSSSRCSCR','RCSSSRSSR','CCCSSRCCSR']){
 let item="Firebird's Down",seed=930643368;
 for(const [i,op]of [...path].entries()){
  const from={item,seed};
  const r=e.apply(item,seed,op);
  item=r.item;seed=r.seed;
  const out={route:path,index:i+1,op,from,result:{item:r.item,seed:r.seed,quality:r.quality,affixes:r.affixes.map(a=>({stem:a.stem,kind:a.kind})),lines:r.lines.map(v=>({stem:v.stem,value:v.value}))}};
  console.log('EYE_ROUTE_JS',JSON.stringify(out));
 }
}
console.log('EYE_ROUTE_JS_END');
