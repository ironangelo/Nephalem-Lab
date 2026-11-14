/*
 Research: Obsidian Ring of the Zodiac from a normal, unmodified world/Kadala drop.
 Real original photo (14 Nov 2026): Attack Speed 7%, CHC 4.5%, CDR 7%, RCR 5%,
 Arcane Resistance 144, Ignore Durability Loss. User has not yet transmuted it.
 Objective (Soulstone Firebird Twister): natural Primal, CHC 6%, CDR 8%, RCR 8%,
 1 socket replacing fixed Attack Speed via Mystic, preferably natural CC Reduction
 as secondary. IMPORTANT: no reliable single-photo drop-seed inference established.
*/
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true);
const it=e.item('Obsidian Ring of the Zodiac');if(!it)throw Error('Obsidian item missing');
const c=e.candidateAffixes(it);
const names=[...new Set(c.map(x=>affixStem(x.label)))].sort();
console.log('ZODIAC_AFFIX_MODEL',JSON.stringify({item:{name:it.name,id:it.id,primary_pick_count:it.primary_pick_count,secondary_pick_count:it.secondary_pick_count,fixed_slot_groups:it.fixed_slot_groups,formulas:it.formulas.length},stems:names,groupRules:it.fixed_slot_groups.filter(x=>x!==4294967295).map(g=>({group:g,options:c.filter(x=>x.fixed_group_a===g||x.fixed_group_b===g).map(x=>({label:x.label,kind:x.pick_kind,formulas:x.formulas.length})).slice(0,6)}))}));
let primal=0, primalWithCC=0, samples=[];
for(let start=0;start<35000;start++){
 const res=e.reforge(it,start);
 if(res.quality!=='primal')continue;
 primal++;
 const stems=res.affixes.map(x=>x.stem);
 if(stems.includes('CCReduction'))primalWithCC++;
 if(samples.length<8)samples.push({start,seed:res.seed,quality:res.quality,stems,values:res.lines.map(x=>[x.stem,x.value])});
}
console.log('ZODIAC_PRIMAL_SYNTHETIC',JSON.stringify({tested:35000,primal,primalWithCC,samples}));
for(let start of [1,8,46826983,800657787]){
 const r=e.reforge(it,start),s=e.primalRoll(it,start,'S');
 console.log('ZODIAC_EXAMPLE',JSON.stringify({start,R:{seed:r.seed,quality:r.quality,draws:r.draws,affixes:r.affixes.map(a=>a.stem),values:r.lines.map(x=>[x.stem,x.value])},S:{seed:s.seed,quality:s.quality,affixes:s.affixes.map(a=>a.stem),values:s.lines.map(x=>[x.stem,x.value])}}));
}
