/* Research only: attempt to reconstruct current Firebird's Breast seed from
 * two screenshots, independently of any saved Nephalem Lab candidate list.
 * Runs in GitHub Actions, not shipped to the Android APK.
 */
import fs from 'node:fs';
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
import {observationAffixFamilies,generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
import {validSeeds,matchesObservation} from '../src/candidate-analysis.js';
const data=await loadGameData(),engine=new UniversalEngine(data,'Wizard'),item=engine.item("Firebird's Breast");
if(!item)throw Error('Firebird chest not present in data');
console.log('DATABASE',data.items.length,'items',data.affixes.length,'affixes','item',JSON.stringify({id:item.id,armor:item.armor,formulas:item.formulas,setId:item.set_id}));
const fam=observationAffixFamilies(engine,item);
console.log('FAMILIES',JSON.stringify(fam.filter(x=>/int|vit|life|experience|gold|lightning|thorns|explosive|socket/i.test(x))));
const normalize=x=>String(x).toLowerCase().replace(/[^a-z0-9]/g,'');
function family(alias){
 const target=normalize(alias);
 const exact=fam.filter(s=>normalize(s)===target);
 if(exact.length===1)return exact[0];
 const starts=fam.filter(s=>normalize(s).startsWith(target));
 if(starts.length===1)return starts[0];
 throw Error('Unclear affix family for '+alias+': '+JSON.stringify(exact.length?exact:starts));
}
function stat(name,value){
 const f=family(name);
 const records=engine.candidateAffixes(item).filter(a=>affixStem(a.label)===f);
 const attrs=[...new Set(records.flatMap(a=>(a.formulas||[]).map(([id])=>Number(id))))];
 if(attrs.length!==1)throw Error('Ambiguous game numeric attribute '+name+' -> '+f+': '+JSON.stringify(attrs));
 return {stem:f,attr:attrs[0],value};
}
function observation(rows){
 return {quality:'normal',itemId:item.id,lines:rows.map(([name,v])=>stat(name,v))};
}
const latest=observation([['Int',456],['Vit',484],['LightningResist',149],['Thorns',5366],['Skill_Wizard_ExplosiveBlast',13]]);
let initial;
try{
 initial=observation([['Int',416],['Life',10],['Experience',198],['GoldPickUpRadius',2],['Skill_Wizard_ExplosiveBlast',11]]);
 console.log('FIRST_OBS',JSON.stringify(initial));
}catch(e){console.log('FIRST_OBS_NOT_PARSED',e.message)}
console.log('SECOND_OBS',JSON.stringify(latest));
const specs=generateRecoveryHypotheses(engine,item,latest,{maxHypotheses:128});
console.log('LATEST_HYPOTHESES',specs.length);
for(const [i,h] of specs.entries())if(i<8)console.log('HYP',i,JSON.stringify(h.constraints),'AFFIXIDS',JSON.stringify(h.affixIds));
if(!specs.length)throw Error('No hypotheses generated for second item');
const bytes=fs.readFileSync('solver/scan.wasm');
const {instance}=await WebAssembly.instantiate(bytes),w=instance.exports;
const total=4294967296,batch=6000000,selected=[];
let filtered=0,rawCandidates=0;
for(let offset=0;offset<specs.length;offset+=32){
 const chunk=specs.slice(offset,offset+32);
 w.set_pre_steps(item.armor?2:1);w.set_hyp_count(chunk.length);
 chunk.forEach((h,idx)=>{w.set_hyp_length(idx,h.constraints.length);h.constraints.forEach(({m,r},j)=>w.set_hyp_constraint(idx,j,m,r));});
 const seen=new Set();
 for(let start=0;start<total;start+=batch){
  const num=w.scan_multi(start,Math.min(batch,total-start));
  if(w.was_overflow())throw Error('WASM overflow at '+start);
  for(let i=0;i<num;i++){
   const seed=w.result_at(i)>>>0;rawCandidates++;
   if(!seen.has(seed))seen.add(seed);
  }
  if(start%(batch*120)===0)console.log('PROGRESS',offset,start,'raw',rawCandidates);
 }
 console.log('NUMERICAL_CANDIDATES',offset,seen.size);
 for(const seed of seen){
  if(chunk.some(h=>verifyHypothesis(engine,item,seed,h))){
   filtered++;
   selected.push(seed);
  }
 }
}
const unique=validSeeds(selected).sort((a,b)=>a-b);
console.log('LATEST_VERIFIED_VALUE_SEEDS',unique.length,'RAW',rawCandidates,'CHECKED',filtered);
console.log('LATEST_SEEDS',JSON.stringify(unique.slice(0,2000)));
console.log('FINISHED. Seed list contains value-roll matches only; verify affix selection/transition before trusting.');
