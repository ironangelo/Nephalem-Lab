import {writeFileSync} from 'node:fs';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
import {generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const start=1,from=e.item("Firebird's Down"),result=e.convert(from,start),it=e.item(result.item);
const observation={quality:'normal',lines:result.lines.filter(l=>l.stem!=='Power').map(l=>({stem:l.stem,attr:l.attr,value:l.value}))};
const hyp=generateRecoveryHypotheses(e,it,observation,{maxHypotheses:4000});
const keep=hyp.filter(h=>h.constraints.length>=3);
const textData=keep.length+' '+(it.armor?1:0)+' '+result.seed+'\n'+keep.flatMap((h,i)=>[i+' '+h.constraints.length,...h.constraints.map(c=>c.m+' '+c.r)]).join('\n')+'\n';
writeFileSync('/tmp/firebird-convert-probe-hypotheses.txt',textData);
writeFileSync('/tmp/firebird-convert-probe-hypotheses.json',JSON.stringify(keep));
console.log('FBDOWN_CONVERT_PROBE_SUMMARY',JSON.stringify({start,result:{item:result.item,seed:result.seed,quality:result.quality},hypotheses:keep.length,
 constraints:keep.map(h=>h.constraints),verifiedAtTrueChild:keep.filter(h=>verifyHypothesis(e,it,result.seed,h)).length}));
