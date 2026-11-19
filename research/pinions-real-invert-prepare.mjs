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
const allHypotheses=generateObservedReforgeHypotheses(e,item,observation,{maxHypotheses:1024});
// The first two fixed affixes must be selected at their maximum eligible tier
// by _fixed(), independently of the source RNG seed. An arbitrary low-tier
// candidate is a numeric false positive and should not be scanned.
const fixture=e.reforge(item,2538758317);
if(fixture.quality!=='normal')throw Error('Fixed-slot reference seed not normal');
const fixedIds=fixture.affixes.slice(0,2).map(a=>a.id);
const hypotheses=allHypotheses.filter(h=>h.affixIds[0]===fixedIds[0]&&h.affixIds[1]===fixedIds[1]);
console.log('PINIONS_FIXED_HYPOTHESIS_FILTER',JSON.stringify({all:allHypotheses.length,actual: hypotheses.length,fixedIds}));
if(!hypotheses.length)throw Error('No legal normal fixed-slot hypotheses; do not scan arbitrary tiers');
if(!hypotheses.length)throw Error('No hypotheses compatible with real observed tooltip.');
writeFileSync('/tmp/pinions-r-constraints.txt',[
 String(hypotheses.length),
 ...hypotheses.map((h,i)=>[String(i)+' '+h.constraints.length,...h.constraints.map(x=>x.m+' '+x.r)].join('\n'))
].join('\n')+'\n');
writeFileSync('/tmp/pinions-r-observation.json',JSON.stringify(observation));
writeFileSync('/tmp/pinions-r-hypotheses.json',JSON.stringify(hypotheses));
console.log('PINIONS_CONSTRAINTS_READY',JSON.stringify({hypotheses:hypotheses.length,example:hypotheses[0].constraints,observed:observation.lines}));
