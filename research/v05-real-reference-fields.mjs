import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
for(const [name,parents] of [
 ["Firebird's Down",[2538758317]],
 ["Firebird's Breast",[3525123180,2645309652]],
 ["Squirt's Necklace",[3668729561]],
 ["Deathwish",[1184690904]],
 ["Obsidian Ring of the Zodiac",[2279251711,1290971892]]
]){
 const it=e.item(name);
 for(const parent of parents){
  const r=e.reforge(it,parent);
  console.log('V05_REAL_REFERENCE_FIELDS',JSON.stringify({item:name,parent,seed:r.seed,quality:r.quality,formulaCount:it.formulas.length,
    affixes:r.affixes.map(a=>a.stem),lines:r.lines.map(x=>({stem:x.stem,attr:x.attr,value:x.value,percentDisplay:x.value<1&&x.value>0?Number((x.value*100).toFixed(2)):undefined}))}));
 }
}
