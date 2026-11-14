import {writeFileSync} from 'node:fs';
import {e,it} from './squirts-real-inverse.mjs';
const n=new Set(),qualityCount={};
for(let i=0;i<15000;i++){
 const r=e.reforge(it,i);qualityCount[r.quality]=(qualityCount[r.quality]||0)+1;
 if(r.quality==='normal')n.add(r.draws);
}
const counts=[...n].sort((a,b)=>a-b);
console.log('SQUIRT_NORMAL_R_DRAW_COUNTS',JSON.stringify({drawCounts:counts,qualityCount}));
writeFileSync('/tmp/squirts-normal-draws.txt',counts.join('\n')+'\n');
