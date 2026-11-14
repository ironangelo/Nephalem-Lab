import fs from 'node:fs';
import {hypothesisList,e,it} from './deathwish-weapon-inversion.mjs';
const obs={power:[{stem:'Power',attr:1293,value:2.53}],groups:[
 {stem:'Int',lines:[{stem:'Int',attr:1210,value:715}]},
 {stem:'FireD',lines:[{stem:'FireD',attr:231,value:1096},{stem:'FireD',attr:222,value:265}]},
 {stem:'Vit',lines:[{stem:'Vit',attr:1211,value:701}]},
 {stem:'SplashDamage',lines:[{stem:'SplashDamage',attr:1355,value:0.18}]},
 {stem:'WeaponHitStun1h',lines:[{stem:'WeaponHitStun1h',attr:1141,value:0.016}]}
]};
const hyps=hypothesisList(obs);const w=(await WebAssembly.instantiate(fs.readFileSync('solver/scan.wasm'))).instance.exports;
const expected=[...obs.power,...obs.groups.flatMap(g=>g.lines)];
for(const nConstraint of [4,3]){
 const matches=new Set();w.set_hyp_count(hyps.length);w.set_pre_steps(it.armor?2:1);
 for(const [i,h]of hyps.entries()){
  w.set_hyp_length(i,nConstraint);
  h.constraints.slice(0,nConstraint).forEach(({m,r},j)=>w.set_hyp_constraint(i,j,m,r));
 }
 for(let b=0;b<4294967296;b+=6000000){
  const n=w.scan_multi(b,Math.min(6000000,4294967296-b));if(w.was_overflow())throw Error('Overflow');
  for(let i=0;i<n;i++)matches.add(w.result_at(i)>>>0);
 }
 const ranked=[];
 for(const seed of matches){
  for(const [index,h]of hyps.entries()){
   const got=e.values(it,seed,h.affixIds.map(id=>e.idIndex.get(id)),false);
   const good=expected.map(x=>got.some(y=>y.stem===x.stem&&y.attr===x.attr&&Math.abs(y.value-x.value)<.00001));
   const score=good.filter(Boolean).length;
   if(score>=4)ranked.push({seed,hypIndex:index,score,good,actual:got.map(x=>[x.stem,x.value]),expected:expected.map(x=>[x.stem,x.value]),affixes:h.affixIds});
  }
 }
 ranked.sort((a,b)=>b.score-a.score||a.seed-b.seed);
 console.log('PARTIAL_DIAGNOSIS',JSON.stringify({firstConstraints:nConstraint,rawCandidates:matches.size,ranked:ranked.slice(0,25)}));
 if(ranked.some(x=>x.score>=6))break;
}
