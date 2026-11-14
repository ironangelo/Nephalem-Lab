/*
  Obsidian Ring of the Zodiac second REAL Reforge:
  Original drop => R1 Ancient (CDR 5%, Haste 6%, CHC 5.5%, RCR6%, LightningResist206)
                => R2 Normal? (CDR7%, Haste7%, CHC5.5%, RCR7%, PoisonResist147)
  Iterate only 5331 original-seed candidates from independent exhaustive 32bit inversion.
  No further in-game steps until we find a unique stored 32-bit seed.
*/
import {readFileSync,writeFileSync} from 'node:fs';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true),it=e.item('Obsidian Ring of the Zodiac');
const pairs=JSON.parse(readFileSync('research/zodiac-5331-ancient-seed-candidates.json','utf8')).matches;
const obs={CooldownReduction:0.07,Haste:0.07,CriticalChance:0.055,ResourceCostReduction:0.07,PoisonResist:147};
const sorted=Object.keys(obs).sort(),matches=[];
const qualityCounts={},resistCandidates=[];
for(const {parent,seed} of pairs){
 const r=e.reforge(it,seed);
 qualityCounts[r.quality]=(qualityCounts[r.quality]||0)+1;
 const lines=r.lines.filter(x=>x.stem!=='Power');
 if(r.quality!=='normal')continue;
 const stems=lines.map(x=>x.stem).sort();
 if(JSON.stringify(stems)!==JSON.stringify(sorted))continue;
 resistCandidates.push({parent,seed,current:r.seed,vals:Object.fromEntries(lines.map(x=>[x.stem,x.value]))});
 if(lines.every(x=>Math.abs(x.value-obs[x.stem])<.00001)){
  const data={originalBeforeR1:parent,firstRChildSeed:seed,secondRChildSeed:r.seed,quality:r.quality,draws:r.draws,affixes:r.affixes.map(x=>({id:x.id,stem:x.stem})),stats:r.lines.map(x=>[x.stem,x.value])};
  matches.push(data);console.log('ZODIAC_SECOND_REFORGE_EXACT_MATCH',JSON.stringify(data));
 }
}
console.log('ZODIAC_SECOND_REFORGE_MATCH_SUMMARY',JSON.stringify({
 preexistingCandidates:pairs.length,normalQualityCandidates:qualityCounts.normal,
 allQualityCounts:qualityCounts,matchingFamilies:resistCandidates.length,
 matchingAllValues:matches.length,matches
}));
writeFileSync('/tmp/zodiac-second-recovered.json',JSON.stringify(matches,null,2));
if(matches.length!==1)console.log('ZODIAC_SECOND_REFORGE_NEEDS_ADDITIONAL_EVIDENCE',JSON.stringify({matches:matches.length,warning:'Do not invent a single seed'}));
