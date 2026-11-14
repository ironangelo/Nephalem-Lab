/* Independent one-Convert-Set-Item source seed recovery proof:
 * simulate a C from a known Firebird's Eye source seed, THROW AWAY the source
 * seed, numerically invert only the target tooltip, reverse the exact MWC
 * 1-draw map, and verify full Convert output from each inferred parent.
 *
 * This is SYNTHETIC test validation; it is NOT the user's unknown Kadala seed.
 */
import fs from "node:fs";
import {UniversalEngine,loadGameData,affixStem} from "../src/universal-engine.js";
import {generateRecoveryHypotheses,verifyHypothesis} from "../src/universal-recovery.js";
import {matchesObservation} from "../src/candidate-analysis.js";
const d=await loadGameData(),e=new UniversalEngine(d,"Wizard",true);
const source=e.item("Firebird's Eye");
const hiddenSeed=3525123180;
const output=e.convert(source,hiddenSeed);
if(output.quality!=="normal")throw Error("Unexpected synthetic quality");
const obs={itemId:output.itemId,quality:"normal",lines:output.lines.map(({stem,attr,value})=>({stem,attr,value}))};
const order=x=>x.length<=1?[x]:x.flatMap((v,i)=>order([...x.slice(0,i),...x.slice(i+1)]).map(p=>[v,...p]));
let permutations=0,discarded=0,hmap=new Map();
for(const p of order(obs.lines.filter(x=>x.stem!=="Power"))){
  permutations++;
  try{
    const h=generateRecoveryHypotheses(e,output.item,{...obs,lines:[...obs.lines.filter(x=>x.stem==="Power"),...p]});
    for(const x of h)hmap.set(JSON.stringify(x.constraints)+"-"+x.affixIds.join(","),x);
  }catch(ex){discarded++;}
}
const hypotheses=[...hmap.values()];
console.log("SYNTHETIC_INPUT",JSON.stringify({source:source.name,target:output.item,quality:output.quality,expectedSeed:output.seed,observedAffixes:output.affixes.map(a=>a.stem),numbers:output.lines.map(a=>[a.stem,a.value]),permutations,discarded,hypotheses:hypotheses.length}));
const w=(await WebAssembly.instantiate(fs.readFileSync("solver/scan.wasm"))).instance.exports;
const solutions=new Set();let nCandidate=0;
for(let idx=0;idx<hypotheses.length;idx+=32){
 let group=hypotheses.slice(idx,idx+32),nums=new Set();
 w.set_hyp_count(group.length);
 w.set_pre_steps(e.item(output.item).armor?2:1);
 group.forEach((h,i)=>{w.set_hyp_length(i,h.constraints.length);h.constraints.forEach(({m,r},j)=>w.set_hyp_constraint(i,j,m,r));});
 const total=4294967296,step=6000000;
 for(let begin=0;begin<total;begin+=step){
  const n=w.scan_multi(begin,Math.min(step,total-begin));
  if(w.was_overflow())throw Error("WASM result overflow");
  for(let i=0;i<n;i++)nums.add(w.result_at(i)>>>0);
 }
 for(const n of nums)if(group.some(h=>verifyHypothesis(e,output.item,n,h)))solutions.add(n);
 console.log("INVERSE_PROGRESS",idx,nums.size,solutions.size);
}
console.log("NUMERIC_SEED_CANDIDATES",JSON.stringify({count:solutions.size,includesActual:solutions.has(output.seed)}));
const M=0xffffffffn,INVERSE=0x8a3e6e0dn;
const matched=[];
for(const nextSeed of solutions){
 const predecessor=Number(((BigInt(nextSeed)-666n)*INVERSE)&M);
 const predicted=e.convert(source,predecessor);
 if(predicted.itemId===obs.itemId&&matchesObservation(predicted,obs)){
  matched.push({predecessor,nextSeed,item:predicted.item,affixes:predicted.affixes.map(a=>a.stem),values:predicted.lines.map(a=>[a.stem,a.value])});
 }
}
console.log("RECOVERED_PARENT_RESULTS",JSON.stringify({matchedCount:matched.length,actualParentRecovered:matched.some(x=>x.predecessor===hiddenSeed),examples:matched.slice(0,20)}));
console.log("EYE_CONVERT_SYNTHETIC_FINISHED");
