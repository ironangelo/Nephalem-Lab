import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {matchesObservation} from '../src/candidate-analysis.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const it=e.item("Firebird's Pinions");
const obs=JSON.parse(readFileSync('/tmp/pinions-r-observation.json','utf8'));
const buf=readFileSync('/tmp/pinions-r-parent-links.bin');
if(buf.length%12!==0)throw Error('Bad pairs file');
const expected=['Int','ResourceCostReduction','Vit','Skill_Wizard_Hydra','FireResist','Experience'].sort();
const diagnostics={rawLinks:buf.length/12,normal:0,seeds:0,affixes:0,allValues:0,draws:0};
const matches=[];
for(let i=0;i<buf.length;i+=12){
 const parent=buf.readUInt32LE(i),child=buf.readUInt32LE(i+4),draws=buf.readUInt32LE(i+8);
 const result=e.reforge(it,parent);
 if(result.quality!=='normal'){diagnostics.normal++;continue}
 if(result.seed!==child){diagnostics.seeds++;continue}
 if(result.draws!==draws){diagnostics.draws++;continue}
 if(JSON.stringify(result.affixes.map(x=>x.stem).sort())!==JSON.stringify(expected)){diagnostics.affixes++;continue}
 // This confirms exact printed numerical values (normal integer, % actual/100).
 if(!matchesObservation(result,obs)){diagnostics.allValues++;continue}
 const exact=obs.lines.every(x=>{
  const actual=result.lines.find(y=>y.attr===x.attr&&y.stem===x.stem);
  if(!actual)return false;
  return [x.value,x.value/100,x.value/1000].some(y=>Math.abs(y-actual.value)<1e-4);
 });
 if(!exact){diagnostics.allValues++;continue}
 const rec={before:parent,now:child,draws,quality:result.quality,affixes:result.affixes.map(x=>x.stem),stats:result.lines.map(x=>[x.stem,x.value])};
 matches.push(rec);
 console.log('PINIONS_REAL_EXACT_MATCH',JSON.stringify(rec));
}
const unique=[...new Map(matches.map(x=>[x.now,x])).values()];
writeFileSync('/tmp/pinions-real-recovery.json',JSON.stringify({matches:unique,diagnostics}));
console.log('PINIONS_RECOVERY_SUMMARY',JSON.stringify({diagnostics,uniqueCurrentSeeds:unique.length,matches:unique}));
if(unique.length===0)throw Error('No recovered seed matches all real observed stats: do not fabricate a route');
if(unique.length>1)console.log('PINIONS_RECOVERY_AMBIGUOUS',JSON.stringify({count:unique.length,note:'Do not claim unique; find next diagnostic action'}));
