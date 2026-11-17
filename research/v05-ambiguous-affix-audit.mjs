import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
for(const name of ['Obsidian Ring of the Zodiac',"Squirt's Necklace",'Deathwish']){
 const it=e.item(name),aff=e.candidateAffixes(it);
 for(const st of ['Haste','CriticalChance','CooldownReduction','ResourceCostReduction','Power']){
  const vals=st==='Power'?it.formulas.map(([attr])=>({id:'fixed',label:st,attrs:[attr]})):aff.filter(a=>affixStem(a.label)===st).map(a=>({id:a.id,label:a.label,attrs:a.formulas.map(x=>x[0]),kind:a.pick_kind,tier:a.tier}));
  const distinct=[...new Set(vals.flatMap(x=>x.attrs))];
  console.log('AMBIGUOUS_AFFIX',JSON.stringify({item:name,stem:st,distinct,variants:vals.slice(0,20)}));
 }
}
