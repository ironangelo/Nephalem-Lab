import fs from 'node:fs';
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
import {matchesObservation} from '../src/candidate-analysis.js';
const data=await loadGameData(),e=new UniversalEngine(data,'Wizard',true),it=e.item("Firebird's Breast");
const stat=(stem,value)=>{
 const ids=[...new Set(e.candidateAffixes(it).filter(a=>affixStem(a.label)===stem).flatMap(a=>a.formulas.map(([id])=>id)))];
 if(ids.length!==1)throw Error('ambiguous '+stem);
 return {stem,attr:ids[0],value};
};
const B={quality:'normal',itemId:it.id,lines:[stat('Int',456),stat('Vit',484),stat('LightningResist',149),stat('Thorns',5366),stat('Skill_Wizard_ExplosiveBlast',13)]};
const raw=fs.readFileSync('/tmp/one-reforge-preimages.tsv','utf8').trim();
const rows=raw?raw.split('\n').map(x=>x.trim().split(',').map(Number)):[];
const full=[],partial=[];
for(const [parent,child]of rows){
 const r=e.reforge(it,parent);
 if(r.seed!==child)throw Error('C scanner does not match model');
 const res={parent,child,quality:r.quality,seed:r.seed,affixes:r.affixes.map(x=>x.stem),values:r.lines.map(x=>[x.stem,x.value])};
 if(matchesObservation(r,B))full.push(res);
 else if(r.quality==='normal')partial.push(res);
}
console.log('ONE_REAL_REFORGE_INVERSE_RESULT',JSON.stringify({possibleParentsFromBStats:rows.length,exactParents:full.length,exact:full.slice(0,50),otherNormal:partial.length}));
console.log('CHECK_EXPECTED_OLD_SEED',JSON.stringify({knownAseed:3525123180,found:full.some(x=>x.parent===3525123180)}));
console.log('SINGLE_REFORGE_RESEARCH_FINISHED');
