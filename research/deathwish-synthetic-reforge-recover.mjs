/*
 * Synthetic hidden-parent inversion for Deathwish normal Reforge.
 * Known seed used only to manufacture an observation; the search uses
 * only the public tooltip to reconstruct it.
 * This is a validity check for the user's FUTURE real first Reforge.
 */
import fs from 'node:fs';
import {real,makeObs,hypothesisList,compare,e,it} from './deathwish-weapon-inversion.mjs';
const parent=8;const observedR=e.reforge(it,parent);
if(observedR.quality!=='normal'||observedR.draws!==6)throw Error('Need normal 6-draw test');
const obs=makeObs(observedR),hyps=hypothesisList(obs),w=(await WebAssembly.instantiate(fs.readFileSync('solver/scan.wasm'))).instance.exports;
let seeds=new Set();
for(let off=0;off<hyps.length;off+=32){
 const group=hyps.slice(off,off+32),found=new Set();
 w.set_hyp_count(group.length);w.set_pre_steps(it.armor?2:1);
 for(const [i,h]of group.entries()){w.set_hyp_length(i,h.constraints.length);h.constraints.forEach(({m,r},j)=>w.set_hyp_constraint(i,j,m,r));}
 for(let b=0;b<4294967296;b+=6000000){const n=w.scan_multi(b,Math.min(6000000,4294967296-b));if(w.was_overflow())throw Error('Solver overflow');for(let k=0;k<n;k++)found.add(w.result_at(k)>>>0);}
 for(const s of found)if(group.some(h=>compare(obs,s,h.affixIds)))seeds.add(s);
 console.log('REFORGE_SYNTHETIC_NUMERIC_PROGRESS',JSON.stringify({group:off,found:found.size,verified:seeds.size}));
}
const sorted=[...seeds].sort((a,b)=>a-b);
fs.writeFileSync('/tmp/one-reforge-result-seeds.txt',sorted.join('\n')+'\n');
fs.writeFileSync('/tmp/deathwish-test-target.json',JSON.stringify({knownParent:parent,result:observedR}));
console.log('REFORGE_SYNTHETIC_CHILD_SEEDS',JSON.stringify({knownChild:observedR.seed,contained:seeds.has(observedR.seed),count:seeds.size,groupedHypotheses:hyps.length,all:sorted.slice(0,50)}));
if(!seeds.has(observedR.seed))throw Error('Failed to recover known child');
