import {UniversalEngine,loadGameData,affixStem,Rng,step} from '../src/universal-engine.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard',true);
const item=e.item("Firebird's Eye");
if(!item)throw Error('Firebird Eye not present');
const cls=e.classFor(item);
console.log('ITEM_INFO',JSON.stringify({id:item.id,name:item.name,set_id:item.set_id,slot:item.slot_type,restricted_class:item.restricted_class,hero:d.classes[e.hero],classFor:d.classes[cls],armor:item.armor,weapon:item.weapon,formulas:item.formulas.map(([attr,formula])=>({attr,formula})),fixed:item.fixed_slot_groups,primary_pick_count:item.primary_pick_count,secondary_pick_count:item.secondary_pick_count,flex_pick_count:item.flex_pick_count,quantity:e.candidateAffixes(item).length,setMembers:d.items.filter(x=>x.set_id===item.set_id).map(x=>x.name)}));
const fams=new Map();
for(const a of e.candidateAffixes(item)){
 const stem=affixStem(a.label);
 if(!fams.has(stem))fams.set(stem,[]);
 fams.get(stem).push({id:a.id,label:a.label,kind:a.pick_kind,wt:e.weight(a,cls),tier:a.tier,range:a.level_range,formulas:a.formulas,grp1:a.fixed_group_a,grp2:a.fixed_group_b});
}
for(const k of ["Int","Vit","Experience","MaxArcanePower","MaxArcane","MaxArcanePower2","ArcanePowerOnCrit","CriticalChance","CooldownReduction","ResourceCostReduction","Skill_Wizard_MagicMissile","FireSkillDamage","Damage","MinMaxDam","WeaponDamage","Life","Sockets"]){
 const all=fams.get(k);
 if(all)console.log('FAMILY',JSON.stringify({stem:k,variants:all}));
}
console.log('FULL_FAMILY_LIST',JSON.stringify([...fams].map(([stem,as])=>({stem,count:as.length,attrIds:[...new Set(as.flatMap(a=>a.formulas.map(([id])=>id)))],types:[...new Set(as.map(a=>a.kind))]}))));
const INV=0x8a3e6e0dn,MASK=0xffffffffn,MUL=0x6ac690c5n;
function invert(child){return Number(((BigInt(child)-666n)*INV)&MASK);}
function convertSeed(seed){const x=step((666n<<32n)|BigInt(seed));return Number(x&MASK);}
for(const seed of [0,1,3035692732,3525123180,3835143639,4294967295]){
 const child=convertSeed(seed),calc=invert(child),result=e.convert(item,seed);
 console.log('CONVERT_TEST',JSON.stringify({seed,child,calc,valid:calc===seed,resultItem:result.item,resultChildSeed:result.seed,childMatches:child===result.seed,quality:result.quality,affixStems:result.affixes.map(a=>a.stem),lines:result.lines.map(v=>[v.stem,v.value])}));
 if(calc!==seed||child!==result.seed)throw Error('Mathematical inversion failed');
}
console.log('INVERSE_U32_C_FINISHED');
