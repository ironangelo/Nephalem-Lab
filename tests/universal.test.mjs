import assert from 'node:assert/strict';
import {affixes as original,U} from '../src/coe-data.js';
import {UniversalEngine} from '../src/universal-engine.js';
import {searchUniversalRoute} from '../src/universal-planner.js';
import {generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
const RING=4214896,AMULET=3929724200,MAIN=3741087369,CRIT=2471587798,SOCKET=2318712709,CDR=715115171,HASTE=810509126,RCR=3308201055,CHD=3038206296,GOLD=4166573967;
function word(op,n=0){const b=Buffer.alloc(8);b.writeUInt8(op,0);if(op===6)b.writeFloatLE(n,4);if(op===1)b.writeUInt8(4,4);return b;}
function formula(lo,hi,div=1){return Buffer.concat([word(6,lo),word(6,hi),word(1),...(div===1?[]:[word(6,div),word(0xe)]),word(0)]).toString('hex');}
const a=[],specFor=(key,range,divisor)=>{
 if(key==='Sockets')return [];
 if(key==='MinMaxDam')return [[214,formula(...range[0])],[212,formula(...range[1])]];
 const attrs={Int:1210,Vit:1211,CriticalChance:253,CriticalD:258,CooldownReduction:210,Haste:203,KillLife:353,PoisonResist:93,LightningResist:93,FireResist:93,ArcaneResist:93,ColdResist:93,PhysicalResist:93,DR:34,HitLife:352,Regen:126,HealthGlobeBonus:86,Gold:50,Experience:77,Thorns:339,ResistAll:96,CCReduction:707,Life:135,ResourceCostReduction:740,SplashDamage:1355};
 return [[attrs[key]??10000,formula(...range,divisor)]];
};
for(const [i,raw] of original.entries()){
 for(let tier=0;tier<3;tier++){
  const range=raw.ranges[tier],id=10000+i*3+tier;
  a.push({id,label:`${raw.key} ${16+tier} Secondary`,base_weight:raw.weight,class_weight:[1,1,1,1,1,1,1],
    level_range:tier===0?[70,70]:[71,80],restricted_class:U,allowed_types:[RING,AMULET],quality_mask:65528,tier:tier===0?(raw.key==='Sockets'?40:70):71,
    upgrades_to:tier===2?U:id+1,fixed_group_a:raw.groupA,fixed_group_b:raw.groupB,
    exclusion_group:U,exclusion_key:U,exclusion_ids:Array(6).fill(U),pick_kind:raw.kind,budget_cost:raw.cost,is_socket:raw.key==='Sockets',is_legacy_socket:false,is_skill:false,
    formulas:range?specFor(raw.key,range,raw.divisor):[]});
 }
}
const item=(name,id,slot,fixed,primary,secondary,formulas)=>({id,name,type_chain:[slot,3554201666],slot_type:slot,armor:false,restricted_class:-1,weapon:false,set_id:0,table_index:id,base_weight:100,class_weight:Array(7).fill(1),fixed_slot_groups:[...fixed,...Array(6-fixed.length).fill(U)],primary_pick_count:primary,secondary_pick_count:secondary,flex_pick_count:0,formulas});
const items=[item('Convention of Elements',417069418,RING,[MAIN,CRIT,SOCKET],1,1,[[1293,formula(150,200,100)]]),
 item('Obsidian Ring of the Zodiac',3108466171,RING,[CDR,HASTE,CRIT,RCR],0,1,[[1215,word(6,1).toString('hex')],[1293,word(6,1).toString('hex')]]),
 item("Squirt's Necklace",1187653737,AMULET,[GOLD,MAIN,CHD],2,1,[[1293,word(6,1).toString('hex')]])];
const d={season:40,classes:['DemonHunter','Barbarian','Wizard','WitchDoctor','Monk','Crusader','Necromancer'],items,affixes:a,slots:[{name:'Ring',pools:{'2':[[0,100],[1,100]]}},{name:'Amulet',pools:{'2':[[2,100]]}}]};
const sim=new UniversalEngine(d,'Wizard');
const coe=sim.reforge('Convention of Elements',3035692732);
assert.equal(coe.seed,4015360194);
assert.equal(coe.lines.find(x=>x.attr===1293)?.value,1.65);
assert.deepEqual(coe.affixes.map(x=>x.stem),['Int','CriticalChance','Sockets','Vit','LightningResist']);
const hypotheses=generateRecoveryHypotheses(sim,'Convention of Elements',{quality:'normal',lines:coe.lines.map(l=>({stem:l.stem,attr:l.attr,value:l.value}))});
assert.ok(hypotheses.length>0);
assert.ok(hypotheses.some(h=>verifyHypothesis(sim,'Convention of Elements',coe.seed,h)));
const zodiac=sim.reforge('Obsidian Ring of the Zodiac',3035692732);
assert.equal(zodiac.item,'Obsidian Ring of the Zodiac');
assert.ok(zodiac.affixes.some(x=>x.stem==='CooldownReduction'));
assert.ok(zodiac.affixes.some(x=>x.stem==='Haste'));
assert.ok(zodiac.affixes.some(x=>x.stem==='ResourceCostReduction'));
assert.ok(zodiac.affixes.every(x=>x.stem!=='Int'));
assert.equal(zodiac.affixes.length,5);
const zodiacHypotheses=generateRecoveryHypotheses(sim,'Obsidian Ring of the Zodiac',{quality:'normal',lines:zodiac.lines.map(l=>({stem:l.stem,attr:l.attr,value:l.value}))});
assert.ok(zodiacHypotheses.some(h=>verifyHypothesis(sim,'Obsidian Ring of the Zodiac',zodiac.seed,h)));
const squirts=sim.reforge("Squirt's Necklace",3035692732);
assert.equal(squirts.item,"Squirt's Necklace");
assert.equal(squirts.affixes.length,6);
assert.ok(squirts.affixes.some(x=>x.stem==='CriticalD'));
assert.notEqual(squirts.seed,zodiac.seed);
const necro=new UniversalEngine(d,'Necromancer');
const necroResult=necro.reforge('Convention of Elements',3035692732);
assert.equal(necroResult.seed,coe.seed);
const plan=searchUniversalRoute(sim,'Convention of Elements',4015360194,{goals:['CriticalChance','CriticalD','CooldownReduction','Sockets'],allowed:['R','S'],maxR:4,maxS:12,maxNodes:45000});
assert.equal(plan.found,true);assert.equal(plan.steps.at(-1).quality,'primal');
console.log('✓ Generic engine: CoE regression, Obsidian Ring of the Zodiac, Squirt\'s Necklace, Wizard & Necromancer, natural primal path');
