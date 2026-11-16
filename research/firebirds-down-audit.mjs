import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true),it=e.item("Firebird's Down");
if(!it)throw Error("Missing Firebird's Down");
const stems=['Int','LifeRegen','FireResist','Experience','Sockets','Electrocute'];
const a=e.candidateAffixes(it);
console.log('FBDOWN_MODEL',JSON.stringify({name:it.name,id:it.id,slot:it.slot_type,armor:it.armor,restricted:it.restricted_class,level:it.level,primary_pick_count:it.primary_pick_count,secondary_pick_count:it.secondary_pick_count,flex_pick_count:it.flex_pick_count,fixed_slot_groups:it.fixed_slot_groups,formulas:it.formulas,optionCounts:Object.fromEntries(stems.map(stem=>[stem,a.filter(x=>affixStem(x.label)===stem).length]))}));
for(let st of stems){
 console.log('FBDOWN_RELEVANT_AFFIX',JSON.stringify({stem:st,variants:a.filter(x=>affixStem(x.label)===st).map(x=>({id:x.id,label:x.label,tier:x.tier,pick_kind:x.pick_kind,formulas:x.formulas,upgrades_to:x.upgrades_to})).slice(0,30)}));
}
for(let start of [1,8,46826983,1805687870]){
 const r=e.reforge(it,start),s=e.primalRoll(it,start,'S');
 console.log('FBDOWN_EXAMPLE',JSON.stringify({start,R:{quality:r.quality,seed:r.seed,draws:r.draws,affixes:r.affixes.map(x=>({stem:x.stem,id:x.id})),values:r.lines.map(x=>[x.stem,x.value])},S:{quality:s.quality,seed:s.seed,draws:s.draws,affixes:s.affixes.map(x=>({stem:x.stem,id:x.id})),values:s.lines.map(x=>[x.stem,x.value])}}));
}
let matching=0,qualCount={},sockets=new Map();for(let i=0;i<12000;i++){let r=e.reforge(it,i);qualCount[r.quality]=(qualCount[r.quality]||0)+1;sockets.set(r.affixes.find(x=>x.stem==='Sockets')?.id||'none',(sockets.get(r.affixes.find(x=>x.stem==='Sockets')?.id||'none')||0)+1);if(r.affixes.some(x=>x.stem==='LifeRegen')&&r.affixes.some(x=>x.stem==='Electrocute'))matching++}
console.log('FBDOWN_SAMPLING',JSON.stringify({qualCount,withBothLifeAndElectrocute:matching,socketTiers:Object.fromEntries(sockets)}));
