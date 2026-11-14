import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true),it=e.item('Deathwish');
if(!it)throw Error('Deathwish not found');
console.log('DEATHWISH_ITEM',JSON.stringify({name:it.name,id:it.id,weapon:it.weapon,armor:it.armor,set:it.set_id,slot_type:it.slot_type,type_chain:it.type_chain,fixed_slot_groups:it.fixed_slot_groups,primary_pick_count:it.primary_pick_count,secondary_pick_count:it.secondary_pick_count,flex_pick_count:it.flex_pick_count,formulas:it.formulas,restricted_class:it.restricted_class,allCandidateCount:e.candidateAffixes(it).length}));
const fs=new Map();
for(const a of e.candidateAffixes(it)){
 const name=affixStem(a.label);const arr=fs.get(name)||[];
 arr.push({id:a.id,weight:e.weight(a,e.classFor(it)),label:a.label,kind:a.pick_kind,fix1:a.fixed_group_a,fix2:a.fixed_group_b,quality:a.quality_mask,range:a.level_range,formulas:a.formulas});
 fs.set(name,arr);
}
console.log('DEATHWISH_FAMILIES',JSON.stringify([...fs].map(([k,a])=>({stem:k,variants:a}))));
for(const seed of [0,1,4016194486,3525123180,3835143639,930643368]){
 for(const op of ['S','R']){
  const r=e.apply(it,seed,op);
  console.log('TEST_ITEM',JSON.stringify({seed,op,quality:r.quality,after:r.seed,draws:r.draws,affixes:r.affixes,lines:r.lines}));
 }
}
