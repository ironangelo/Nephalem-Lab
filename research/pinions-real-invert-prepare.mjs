import {writeFileSync} from 'node:fs';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {generateObservedReforgeHypotheses,} from '../src/v05-reforge-hypotheses.js';
import {matchesObservation} from '../src/candidate-analysis.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true),item=e.item("Firebird's Pinions");
const get=(stem,value)=>{
 const a=e.candidateAffixes(item).find(a=>a.label===stem||a.label.startsWith(stem+' '));
 if(!a)throw Error('Missing affix '+stem);
 const final=e.affixes[e.variant(e.idIndex.get(a.id),1)];
 return {stem,value,attr:final.formulas[0][0]};
};
// No 'Power' - gold RCR is the SECOND permanent/fixed primary affix of Pinions.
const observation={itemId:item.id,quality:'normal',lines:[
 get('Int',500),get('ResourceCostReduction',8),
 get('Vit',478),get('Skill_Wizard_Hydra',12),
 get('FireResist',144),get('Experience',173)
]};
const hypotheses=generateObservedReforgeHypotheses(e,item,observation,{maxHypotheses:1024});
if(!hypotheses.length)throw Error('No hypotheses compatible with real observed tooltip.');
writeFileSync('/tmp/pinions-r-constraints.txt',[
 String(hypotheses.length),
 ...hypotheses.map((h,i)=>[String(i)+' '+h.constraints.length,...h.constraints.map(x=>x.m+' '+x.r)].join('\n'))
].join('\n')+'\n');
writeFileSync('/tmp/pinions-r-observation.json',JSON.stringify(observation));
writeFileSync('/tmp/pinions-r-hypotheses.json',JSON.stringify(hypotheses));
console.log('PINIONS_CONSTRAINTS_READY',JSON.stringify({hypotheses:hypotheses.length,example:hypotheses[0].constraints,observed:observation.lines}));
