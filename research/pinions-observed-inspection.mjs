import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {generateObservedReforgeHypotheses} from '../src/v05-reforge-hypotheses.js';
import {observationAffixFamilies,modForFormula} from '../src/universal-recovery.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const it=e.item("Firebird's Pinions");
console.log('PINIONS_ITEM',JSON.stringify(it));
console.log('PINIONS_FAMILIES',JSON.stringify(observationAffixFamilies(e,it)));
const a=e.candidateAffixes(it);
for(const stem of ['Int','Vit','ResistAll','DR','Gold','HealthGlobeBonus','FireResist','Experience','Skill_Wizard_Hydra','ResourceCostReduction','Power','Life','CooldownReduction']){
 const aff=a.filter(x=>x.label===stem||x.label.startsWith(stem+' '));
 console.log('PINIONS_AFFIX',JSON.stringify({stem,candidates:aff.map(x=>({id:x.id,label:x.label,kind:x.pick_kind,tier:x.tier,formulas:x.formulas,upgrade:x.upgrades_to,quality:x.quality_mask,weight:x.base_weight,fixedA:x.fixed_group_a,fixedB:x.fixed_group_b})).slice(0,15)}));
}
const ob={itemId:it.id,quality:'normal',lines:[]};
const add=(stem,v,formulaIndex=0)=>{
 if(stem==='Power'){const z=it.formulas[formulaIndex];if(!z){console.log('MISSING_POWER',v);return;}ob.lines.push({stem,attr:z[0],value:v});return;}
 const aff=a.find(x=>x.label===stem||x.label.startsWith(stem+' '));
 if(!aff){console.log('MISSING_AFFIX',stem,v);return}
 const idx=e.idIndex.get(aff.id),f=e.affixes[e.variant(idx,1)];
 ob.lines.push({stem,attr:f.formulas[formulaIndex]?.[0],value:v});
};
add('Int',500);add('Vit',478);add('FireResist',144);add('Experience',173);add('Skill_Wizard_Hydra',12);add('Power',8);
console.log('PINIONS_OBSERVATION',JSON.stringify(ob));
try{
 const h=generateObservedReforgeHypotheses(e,it,ob,{maxHypotheses:1024});
 console.log('PINIONS_HYPOTHESES',JSON.stringify({count:h.length,heads:h.slice(0,5)}));
}catch(err){console.log('PINIONS_HYPOTHESES_ERROR',err.stack||String(err));}
const obj=e.reforge(it,2538758317);
console.log('PINIONS_MODEL_REFORGE_EXAMPLE',JSON.stringify({quality:obj.quality,seed:obj.seed,draws:obj.draws,affixes:obj.affixes.map(x=>x.stem),lines:obj.lines}));
