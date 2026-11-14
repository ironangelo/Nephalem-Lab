import fs from 'node:fs';
import {e,it} from './deathwish-weapon-inversion.mjs';
const obs=JSON.parse(fs.readFileSync('/tmp/real-deathwish-observation.json','utf8'));
const data=fs.readFileSync('/tmp/real-deathwish-preimages.tsv','utf8').trim();
const pairs=data?data.split('\n').map(x=>x.split(',').map(Number)):[];
const expectedGroups=new Map(obs.groups.map(x=>[x.stem,x.lines]));
const full=[];
for(const [parent,child]of pairs){
 const r=e.reforge(it,parent);
 if(r.quality!=='normal'||r.seed!==child||r.draws!==6)continue;
 const actualFamilies=r.affixes.map(x=>x.stem);
 if(actualFamilies.length!==expectedGroups.size||actualFamilies.some(x=>!expectedGroups.has(x)))continue;
 if(r.lines.length!==obs.power.length+obs.groups.reduce((s,x)=>s+x.lines.length,0))continue;
 const expected=[...obs.power,...obs.groups.flatMap(x=>x.lines)];
 if(!expected.every(x=>r.lines.some(y=>y.attr===x.attr&&y.stem===x.stem&&Math.abs(y.value-x.value)<0.000001)))continue;
 full.push({originalDropSeed:parent,currentDeathwishSeed:child,quality:r.quality,draws:r.draws,affixes:r.affixes.map(x=>({stem:x.stem,id:x.id,kind:x.kind})),rolledNumbers:r.lines.map(x=>[x.stem,x.value])});
}
const num=fs.readFileSync('/tmp/real-deathwish-child-seeds.txt','utf8').trim();
console.log('REAL_DEATHWISH_PARENT_INFERENCE',JSON.stringify({observed:'real Switch 2 Deathwish one R 253% Fire 1096-1361 INT715 VIT701 Stun1.6 Area18',numericResultSeedCandidates:num?num.split('\n').length:0,preimages:pairs.length,fullExactMatches:full.length,results:full}));
if(full.length===1)console.log('REAL_DEATHWISH_UNIQUE_SEED_FOUND',JSON.stringify(full[0]));
else console.log('REAL_DEATHWISH_NOT_UNIQUE',JSON.stringify({matching:full.length,note:'Need analyze model discrepancy or collect new result without assuming a seed'}));
fs.writeFileSync('/tmp/real-deathwish-inference.json',JSON.stringify({status:full.length===1?'unique':'ambiguous',full}));
