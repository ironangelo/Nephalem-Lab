import fs from 'node:fs';
import {real,hypothesisList,compare,e,it} from './deathwish-weapon-inversion.mjs';
const h=hypothesisList(real);
const wasm=fs.readFileSync('solver/scan.wasm');
const w=(await WebAssembly.instantiate(wasm)).instance.exports;
let all=new Set(),samples=[];
for(let offset=0;offset<h.length;offset+=32){
 const group=h.slice(offset,offset+32),pre=new Set();
 w.set_hyp_count(group.length);w.set_pre_steps(it.armor?2:1);
 for(const [j,x]of group.entries()){
  w.set_hyp_length(j,x.constraints.length);
  for(const [k,{m,r}]of x.constraints.entries())w.set_hyp_constraint(j,k,m,r);
 }
 const total=4294967296,batch=6000000;
 for(let b=0;b<total;b+=batch){
  const n=w.scan_multi(b,Math.min(batch,total-b));
  if(w.was_overflow())throw Error('Overflow; cannot prove absence');
  for(let k=0;k<n;k++)pre.add(w.result_at(k)>>>0);
 }
 for(const v of pre){
  if(!group.some(x=>compare(real,v,x.affixIds)))continue;
  all.add(v);
  if(samples.length<20)samples.push({seed:v,reforge:e.reforge(it,v)});
 }
 console.log('PHOTO_ONLY_SCAN_PROGRESS',JSON.stringify({hypotheses:group.length,numerical:pre.size,verifiedCandidates:all.size}));
}
console.log('DEATHWISH_DROP_PHOTO_ONLY_INVERSION',JSON.stringify({
 testedAll:4294967296,fullToolTip:{Power:250,Int:652,MinDamage:1166,MaxDamage:1382,Vit:726,AttackSpeed:6,KillLife:7904},
 hypotheses:h.length,
 numericalCompatibleSeeds:all.size,
 sourceItemSeedCertified:false,
 explanation:'Numbers-only inverse applies formula for newly reforged gear, not confirmed original monster/Kadala drops.',
 samples:samples.slice(0,8).map(({seed,reforge:r})=>({seed,simulatedNextR:r.quality,nextSeed:r.seed,stats:r.lines.map(x=>[x.stem,x.value])}))
}));
