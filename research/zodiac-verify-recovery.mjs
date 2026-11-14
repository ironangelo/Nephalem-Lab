import {readFileSync,writeFileSync} from 'node:fs';
import {e,it,real,compare} from './zodiac-real-inverse.mjs';
const buffer=readFileSync('/tmp/zodiac-parent-candidates.bin');
if(buffer.length%8)throw Error('Corrupt parent scan');
const matches=[],sample=[];
const frequency=new Map(),secondaryAfterSanctify=new Map(),nextReforgeQuality=new Map(),rOutcomeGroups=new Map(),sOutcomeGroups=new Map();
let count=0,good=0;
for(let pos=0;pos<buffer.length;pos+=8){
 const parent=buffer.readUInt32LE(pos),child=buffer.readUInt32LE(pos+4);count++;
 const r=e.reforge(it,parent);
 if(r.quality!=='ancient'||r.seed!==child||r.draws!==4)continue;
 if(!compare(real,child,r.affixes.map(a=>a.id)))continue;
 good++;
 matches.push({parent,seed:child});
 const ss=e.primalRoll(it,child,'S');
 const sstem=ss.affixes.find(a=>a.kind===1||a.stem==='CCReduction')?.stem||ss.affixes.at(-1)?.stem;
 secondaryAfterSanctify.set(sstem,(secondaryAfterSanctify.get(sstem)||0)+1);
 const skey=JSON.stringify([ss.affixes.map(a=>a.stem),ss.lines.map(x=>[x.stem,x.value])]);
 sOutcomeGroups.set(skey,(sOutcomeGroups.get(skey)||0)+1);
 const rr=e.reforge(it,child);
 nextReforgeQuality.set(rr.quality,(nextReforgeQuality.get(rr.quality)||0)+1);
 const rkey=JSON.stringify([rr.quality,rr.affixes.map(a=>a.stem),rr.lines.map(x=>[x.stem,x.value])]);
 rOutcomeGroups.set(rkey,(rOutcomeGroups.get(rkey)||0)+1);
 if(sample.length<10)sample.push({parent,child,sanctify:{childSeed:ss.seed,secondary:sstem,affixes:ss.affixes.map(x=>x.stem)},reforgeNext:{childSeed:rr.seed,quality:rr.quality,stats:rr.lines.map(z=>[z.stem,z.value])}});
}
writeFileSync('/tmp/zodiac-recovered-candidates.json',JSON.stringify(matches));
const summaryGroups=map=>({outcomes:map.size,uniqueOutcomes:[...map.values()].filter(v=>v===1).length,largestGroup:Math.max(...map.values()),expectedRemaining:good?([...map.values()].reduce((t,v)=>t+v*v,0)/good):null});
console.log('ZODIAC_NEXT_DIAGNOSTIC_INFORMATION',JSON.stringify({singleSanctify:summaryGroups(sOutcomeGroups),singleReforge:summaryGroups(rOutcomeGroups)}));
console.log('ZODIAC_ACTUAL_REFORGE_SUMMARY',JSON.stringify({
 observed:{quality:'ancient',attackSpeed:'.06',criticalChance:'.055',cooldownReduction:'.05',resourceCostReduction:'.06',lightningResist:206},
 scannedLinks:count,exactMatches:good,distinctChildren:new Set(matches.map(m=>m.seed)).size,
 secondaryAfterSanctify:Object.fromEntries(secondaryAfterSanctify),nextReforgeQuality:Object.fromEntries(nextReforgeQuality),sample
}));
if(good===1)console.log('ZODIAC_SEED_RECOVERED_UNIQUE',JSON.stringify(matches[0]));
else console.log('ZODIAC_SEED_AMBIGUOUS',JSON.stringify({remainingStates:good,needAnotherObservation:true}));
