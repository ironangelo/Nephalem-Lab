import {readFileSync,writeFileSync} from 'node:fs';
import {e,it,real,hyps,compare} from './squirts-real-inverse.mjs';
const raw=readFileSync('/tmp/squirts-child-candidates.txt','utf8').trim();
const seeds=[...new Set(raw.split('\n').filter(Boolean).map(x=>Number(x.split(' ')[0])))];
const valid=[];
for(const seed of seeds){
 const witnesses=hyps.map((h,i)=>compare(real,seed,h.affixIds)?i:-1).filter(x=>x>=0);
 if(witnesses.length){valid.push({seed,hypotheses:witnesses});console.log('SQUIRT_CHILD_VALUES_VERIFIED',JSON.stringify({seed,hypotheses:witnesses}));}
}
writeFileSync('/tmp/squirts-valid-child-seeds.txt',valid.map(x=>x.seed).join('\n')+'\n');
console.log('SQUIRT_CHILD_VALUES_FINAL',JSON.stringify({candidates:seeds.length,verified:valid.length,valid}));
