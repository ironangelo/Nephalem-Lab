import {readFileSync,writeFileSync} from 'node:fs';
import {e,it,real,hyps,compare} from './firebirds-down-direct-inverse.mjs';
const log=readFileSync('/tmp/firebirds-down-direct-scan.log','utf8');
const hits=[...log.matchAll(/FBDOWN_VALUE_SEED_MATCH (\d+) hypothesis=(\d+)/g)].map(x=>({seed:Number(x[1]),hypothesis:Number(x[2])}));
const surviving=[];
for(const {seed,hypothesis} of hits){
 const h=hyps[hypothesis];
 if(!compare(real,seed,h.affixIds))continue;
 const sanctified=e.primalRoll(it,seed,'S');
 const reforged=e.reforge(it,seed);
 const obj={seed,hypothesis,originalAffixIds:h.affixIds,firstSanctify:{seed:sanctified.seed,quality:sanctified.quality,affixes:sanctified.affixes.map(x=>x.stem),values:sanctified.lines.map(x=>[x.stem,x.value])},firstReforge:{seed:reforged.seed,quality:reforged.quality,affixes:reforged.affixes.map(x=>x.stem),values:reforged.lines.map(x=>[x.stem,x.value])}};
 surviving.push(obj);
 console.log('FBDOWN_ORIGINAL_DROP_SEED_VALID',JSON.stringify(obj));
}
const dedup=[...new Map(surviving.map(x=>[x.seed,x])).values()];
console.log('FBDOWN_ORIGINAL_DROP_RECOVERY',JSON.stringify({numericHypotheses:hyps.length,numericHits:hits.length,exactAffixRollMatches:surviving.length,uniqueCurrentSeeds:dedup.length,items:dedup}));
writeFileSync('/tmp/firebirds-down-candidates.json',JSON.stringify(dedup,null,2));
