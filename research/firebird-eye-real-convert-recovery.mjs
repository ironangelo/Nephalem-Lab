/*
 * REAL user in-game Convert Set Item observation, Nintendo Switch 2.
 * Firebird's Eye from Kadala (unmodified) --ONE C--> Firebird's Down:
 * 704 displayed base Armor, 425 Int, 490 Vit, 148 FireResist,
 * 2621 Thorns, 2 sockets, +10% Magic Missile.
 *
 * DO NOT use original Kadala drop values as inverse constraints.
 * This treats the converted item as ordinary normal-quality generated gear.
 */
import fs from "node:fs";
import {UniversalEngine,loadGameData,affixStem} from "../src/universal-engine.js";
import {generateRecoveryHypotheses,verifyHypothesis} from "../src/universal-recovery.js";
import {matchesObservation} from "../src/candidate-analysis.js";
const d=await loadGameData(),e=new UniversalEngine(d,"Wizard",true);
const src=e.item("Firebird's Eye"),dst=e.item("Firebird's Down");
const stat=(stem,value)=>{
 const all=e.candidateAffixes(dst).filter(a=>affixStem(a.label)===stem);
 const ids=[...new Set(all.flatMap(a=>a.formulas.map(([id])=>id)))];
 if(ids.length!==1)throw Error("Ambiguous or missing affix stem "+stem+" "+JSON.stringify(ids));
 return {stem,attr:ids[0],value};
};
const lines=[stat("Int",425),stat("Vit",490),stat("FireResist",148),stat("Thorns",2621),stat("Skill_Wizard_MagicMissile",10)];
const obs={itemId:dst.id,quality:"normal",lines};
const perms=a=>a.length<2?[a]:a.flatMap((x,i)=>perms([...a.slice(0,i),...a.slice(i+1)]).map(p=>[x,...p]));
const hm=new Map();let failed=0;
for(const order of perms(lines)){
 try{
  const h=generateRecoveryHypotheses(e,dst,{...obs,lines:order},{maxHypotheses:128});
  for(const x of h)hm.set(JSON.stringify(x.constraints)+"-"+x.affixIds.join(","),x);
 }catch(err){failed++;}
}
const hypotheses=[...hm.values()];
console.log("REAL_CONVERT_INPUT",JSON.stringify({
 source:src.name,target:dst.name,sourceItemId:src.id,targetItemId:dst.id,
 itemArmorScreenshot:704,socketsScreenshot:2,obs:lines,failedOrders:failed,
 hypotheses:hypotheses.length,affixCounts:{primaries:dst.primary_pick_count,secondaries:dst.secondary_pick_count,fixed:dst.fixed_slot_groups}
}));
if(hypotheses.length<1)throw Error("No inverse hypotheses for real converted Down");
const w=(await WebAssembly.instantiate(fs.readFileSync("solver/scan.wasm"))).instance.exports;
const potential=new Set(),perGroup=[];
for(let offset=0;offset<hypotheses.length;offset+=32){
 const group=hypotheses.slice(offset,offset+32),numerical=new Set();
 w.set_hyp_count(group.length);
 w.set_pre_steps(dst.armor?2:1);
 for(const [hIndex,h] of group.entries()){
  w.set_hyp_length(hIndex,h.constraints.length);
  for(const [j,{m,r}] of h.constraints.entries())w.set_hyp_constraint(hIndex,j,m,r);
 }
 const limit=4294967296,batch=6000000;
 for(let b=0;b<limit;b+=batch){
  const n=w.scan_multi(b,Math.min(batch,limit-b));
  if(w.was_overflow())throw Error("WASM overflow; cannot certify exhaustive scan");
  for(let i=0;i<n;i++)numerical.add(w.result_at(i)>>>0);
 }
 let verified=0;
 for(const candidate of numerical){
  if(group.some(h=>verifyHypothesis(e,dst,candidate,h))){potential.add(candidate);verified++;}
 }
 perGroup.push({offset,count:group.length,numerical:numerical.size,verified});
 console.log("CANDIDATE_GROUP",JSON.stringify(perGroup.at(-1)));
}
const INV=0x8a3e6e0dn,MASK=0xffffffffn,MULT=0x6ac690c5n;
const parentOf=child=>Number(((BigInt(child)-666n)*INV)&MASK);
const matches=[],near=[];
for(const child of [...potential].sort((a,b)=>a-b)){
 const parent=parentOf(child);
 const r=e.convert(src,parent);
 if(r.seed!==child)throw Error("modular inverse result does not match conversion seed");
 const expectedSet=new Set(lines.map(x=>x.stem)),got=new Set(r.lines.map(x=>x.stem));
 const equalNames=expectedSet.size===got.size&&[...expectedSet].every(x=>got.has(x));
 const allValues=matchesObservation(r,obs);
 const sockets=r.affixes.some(a=>a.stem==="Sockets");
 const isExact=r.itemId===dst.id&&r.quality==="normal"&&allValues&&equalNames&&sockets&&r.lines.length===lines.length;
 const obj={parent,child,item:r.item,quality:r.quality,sockets,stems:r.affixes.map(a=>a.stem),
 lines:r.lines.map(v=>({stem:v.stem,attr:v.attr,value:v.value}))};
 if(isExact)matches.push(obj);
 else if(near.length<20&&r.itemId===dst.id&&r.quality==="normal")near.push(obj);
}
console.log("REAL_CONVERT_RECOVERY",JSON.stringify({
 modelSource:"D3Recipes JS port pinned 49fe284",screenshot:"Firebird's Down, Armor704, INT425 VIT490 FireResist148 Thorns2621 Sockets2 MagicMissile10",
 scannedFullU32:true,hypotheses:hypotheses.length,seedCandidatesForConvertedDown:potential.size,
 oneStepConvertedPreimages:potential.size,fullyMatchingParents:matches.length,
 matches:matches.slice(0,50),near:near.slice(0,6)
}));
if(matches.length===1)console.log("UNIQUE_REAL_KADALA_PARENT",JSON.stringify(matches[0]));
else console.log("NOT_UNIQUELY_RECOVERED",JSON.stringify({count:matches.length,reason:matches.length?"multiple parents":"no complete matches; check RNG model or affixes"}));
console.log("REAL_EYE_CONVERT_SCAN_FINISHED");
