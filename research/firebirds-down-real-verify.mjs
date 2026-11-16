import {readFileSync,writeFileSync} from 'node:fs';
import {e,it,hyps} from './firebirds-down-reforge-inverse.mjs';
const buf=readFileSync('/tmp/fbdown-r-parent-links.bin');
if(buf.length%12)throw Error('Corrupt links');
const desired={Int:460,ResistAll:93,Skill_Wizard_SpectralBlade:.14,Gold:.33,Thorns:2748};
const names=['Int','Sockets','ResistAll','Skill_Wizard_SpectralBlade','Gold','Thorns'].sort();
const matches=[];
const diag={rawPairs:buf.length/12,mismatchedQuality:0,mismatchedSeed:0,mismatchedDraws:0,mismatchedNames:0,mismatchedValues:0};
for(let i=0;i<buf.length;i+=12){
 const parent=buf.readUInt32LE(i),child=buf.readUInt32LE(i+4),draws=buf.readUInt32LE(i+8);
 const r=e.reforge(it,parent);
 if(r.quality!=='normal'){diag.mismatchedQuality++;continue;}
 if(r.seed!==child){diag.mismatchedSeed++;continue;}
 if(r.draws!==draws){diag.mismatchedDraws++;continue;}
 if(JSON.stringify(r.affixes.map(a=>a.stem).sort())!==JSON.stringify(names)){diag.mismatchedNames++;continue;}
 const vals=new Map(r.lines.map(l=>[l.stem,l.value]));
 if(Object.entries(desired).some(([k,v])=>!vals.has(k)||Math.abs(vals.get(k)-v)>0.00001)){diag.mismatchedValues++;continue;}
 const entry={preReforgeSeed:parent,nowSeed:child,draws,quality:r.quality,affixes:r.affixes.map(a=>a.stem),values:Object.fromEntries(r.lines.map(l=>[l.stem,l.value]))};
 matches.push(entry);
 console.log('FBDOWN_R_EXACT_MATCH',JSON.stringify(entry));
}
const unique=[...new Map(matches.map(x=>[x.nowSeed,x])).values()];
console.log('FBDOWN_R_RECOVERY_SUMMARY',JSON.stringify({diag,exactMatches:matches.length,uniquePostReforge:unique.length,matches:unique}));
writeFileSync('/tmp/fbdown-r-real-recovered.json',JSON.stringify(unique));
if(unique.length!==1)console.log('FBDOWN_R_STILL_AMBIGUOUS',JSON.stringify({remaining:unique.length,needMoreEvidence:true}));
