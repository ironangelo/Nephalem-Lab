/*
 * Squirt's Necklace (Wizard): experimental research with the two original drops photographed 2026-11-14.
 * No stored seed is known for EITHER world/Kadala drop. A real normal Reforge observation
 * is required for identifying the current seed before any route is recommended.
 *
 * First (reserve): INT630 / Life15% / CHD55% / Socket1 / Gold74% / CC-control reduction34%.
 * Second (recommended diagnostic): MinMaxDam80–146 / ColdSkill20% / INT711 /
 * CHD60% / Gold79% / XP200; none enchanted, reportedly dropped by Kadala/GR.
 *
 * Target Soulstone Firebird Twister: natural primal, socket, CHC10%, CHD100%,
 * Fire skill20%, ideally CC duration reduction secondary. One legal Mystic replacement.
 */
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true),it=e.item("Squirt's Necklace");
if(!it)throw Error('Squirt missing from item data');
const c=e.candidateAffixes(it);
const stems=[...new Set(c.map(a=>affixStem(a.label)))].sort();
console.log('SQUIRT_MODEL',JSON.stringify({item:{name:it.name,id:it.id,slot_type:it.slot_type,primary_pick_count:it.primary_pick_count,secondary_pick_count:it.secondary_pick_count,flex_pick_count:it.flex_pick_count,fixed_slot_groups:it.fixed_slot_groups,formulas:it.formulas.length},candidateStems:stems}));
console.log('SQUIRT_OFFENSIVE_AFFIXES',JSON.stringify(c.filter(a=>/Crit|Fire|Socket|Int|Control|Crowd|Damage/i.test(a.label)).map(a=>({label:a.label,stem:affixStem(a.label),pick_kind:a.pick_kind,formulas:a.formulas.length})).slice(0,120)));
for(let start of [1,8,46826983,1326569675]){
 const r=e.reforge(it,start),s=e.primalRoll(it,start,'S');
 console.log('SQUIRT_SYNTHETIC_R',JSON.stringify({start,seed:r.seed,quality:r.quality,affixes:r.affixes.map(a=>a.stem),values:r.lines.map(x=>[x.stem,x.value])}));
 console.log('SQUIRT_SYNTHETIC_S',JSON.stringify({start,seed:s.seed,quality:s.quality,affixes:s.affixes.map(a=>a.stem),values:s.lines.map(x=>[x.stem,x.value])}));
}
