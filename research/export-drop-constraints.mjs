import fs from 'node:fs';
import {UniversalEngine,loadGameData,affixStem} from '../src/universal-engine.js';
import {generateRecoveryHypotheses} from '../src/universal-recovery.js';
const d=await loadGameData(),e=new UniversalEngine(d,'Wizard'),it=e.item("Firebird's Breast");
function stat(stem,value){
 const ids=[...new Set(e.candidateAffixes(it).filter(a=>affixStem(a.label)===stem).flatMap(a=>a.formulas.map(([id])=>id)))];
 if(ids.length!==1)throw Error("ambiguous "+stem);
 return {stem,attr:ids[0],value};
}
const A={quality:'normal',itemId:it.id,lines:[stat('Int',416),stat('Life',10),stat('Experience',198),stat('GoldPickUpRadius',2),stat('Skill_Wizard_ExplosiveBlast',11)]};
const perm=a=>a.length<=1?[a]:a.flatMap((x,i)=>perm([...a.slice(0,i),...a.slice(i+1)]).map(z=>[x,...z]));
const h=new Map();for(const order of perm(A.lines))for(const c of generateRecoveryHypotheses(e,it,{...A,lines:order}))h.set(JSON.stringify(c.constraints)+'_'+c.affixIds.join(','),c);
const list=[...h.values()];
const s=[list.length,...list.flatMap(c=>[c.constraints.length,...c.constraints.flatMap(x=>[x.m,x.r])])].join(' ');
fs.writeFileSync('/tmp/firebird-hypotheses.txt',s+'\n');
fs.writeFileSync('/tmp/firebird-hypotheses.json',JSON.stringify(list));
console.log('DROP_HYPOTHESES_EXPORTED',list.length,JSON.stringify(list.map(h=>h.constraints)));
