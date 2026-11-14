/* Determine current result-item value seeds from one actual Reforge photo,
 * independently of all attributes and numeric candidates of the initial drop.
 */
import fs from 'node:fs';
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
import {generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
import {validSeeds} from '../src/candidate-analysis.js';
const data=await loadGameData(),e=new UniversalEngine(data,'Wizard',true),it=e.item("Firebird's Breast");
const stat=(name,value)=>{
 const ids=[...new Set(e.candidateAffixes(it).filter(a=>affixStem(a.label)===name).flatMap(a=>a.formulas.map(([id])=>id)))];
 if(ids.length!==1)throw Error('Ambiguous '+name+' '+JSON.stringify(ids));
 return {stem:name,attr:ids[0],value};
};
const B={quality:'normal',itemId:it.id,lines:[
 stat('Int',456),stat('Vit',484),stat('LightningResist',149),stat('Thorns',5366),stat('Skill_Wizard_ExplosiveBlast',13)]};
const perm=a=>a.length<=1?[a]:a.flatMap((x,i)=>perm([...a.slice(0,i),...a.slice(i+1)]).map(z=>[x,...z]));
const map=new Map();
for(const p of perm(B.lines))for(const h of generateRecoveryHypotheses(e,it,{...B,lines:p},{maxHypotheses:128}))map.set(JSON.stringify(h.constraints)+'_'+h.affixIds.join(','),h);
const hyps=[...map.values()],seeds=[];
const w=(await WebAssembly.instantiate(fs.readFileSync('solver/scan.wasm'))).instance.exports;
const total=4294967296,batch=6000000;
for(let off=0;off<hyps.length;off+=32){
 const group=hyps.slice(off,off+32),numeric=new Set();
 w.set_hyp_count(group.length);w.set_pre_steps(it.armor?2:1);
 group.forEach((h,i)=>{w.set_hyp_length(i,h.constraints.length);h.constraints.forEach(({m,r},j)=>w.set_hyp_constraint(i,j,m,r));});
 for(let b=0;b<total;b+=batch){
  const n=w.scan_multi(b,Math.min(batch,total-b));
  if(w.was_overflow())throw Error('Scan result overflow at '+b);
  for(let i=0;i<n;i++)numeric.add(w.result_at(i)>>>0);
 }
 for(const seed of numeric)if(group.some(h=>verifyHypothesis(e,it,seed,h)))seeds.push(seed);
}
const output=validSeeds(seeds).sort((a,b)=>a-b);
fs.writeFileSync('/tmp/one-reforge-result-seeds.txt',output.join('\n')+'\n');
console.log('SINGLE_REFORGE_OUTPUT_SEEDS',JSON.stringify({hypotheses:hyps.length,compatibleResultSeeds:output.length,values:output.slice(0,120)}));
if(!output.length)throw Error('No valid seeds for observed B result');
