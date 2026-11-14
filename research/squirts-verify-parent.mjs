import {readFileSync,writeFileSync} from 'node:fs';
import {e,it,real,compare} from './squirts-real-inverse.mjs';
const raw=readFileSync('/tmp/squirts-parent-candidates.txt','utf8').trim();
const candidates=raw.split('\n').filter(Boolean).map(x=>x.split(' ').map(Number));
let valid=[];
for(const [parent,child,draws] of candidates){
 const r=e.reforge(it,parent);
 if(r.quality!=='normal'||r.seed!==child||r.draws!==draws)continue;
 if(!compare(real,child,r.affixes.map(x=>x.id)))continue;
 valid.push({parent,child,draws,quality:r.quality,
  affixes:r.affixes.map(x=>({stem:x.stem,id:x.id})),
  stats:r.lines.map(x=>[x.stem,x.value])});
 console.log('SQUIRT_ACTUAL_REFORGE_MATCH',JSON.stringify(valid.at(-1)));
}
console.log('SQUIRT_REAL_RECOVERY_SUMMARY',JSON.stringify({predecessorCandidates:candidates.length,fullMatches:valid.length,valid}));
writeFileSync('/tmp/squirts-recovered.json',JSON.stringify(valid,null,2));
if(valid.length!==1)console.error('Non-unique or missing seed: do NOT execute further Cube operations without investigating!');
