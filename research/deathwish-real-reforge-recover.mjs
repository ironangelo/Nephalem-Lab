/* Real Switch2 Deathwish one normal Reforge, 2026-11-14:
 * 2111.9 DPS; Fire 1096-1361 = rolled first 1096 second 265;
 * INT715 VIT701, Chance Stun 1.6%, Area Damage 18%,
 * legendary power 253%.
 * Start drop seed is UNKNOWN: do not feed old drop values into scanner.
 */
import fs from 'node:fs';
import {hypothesisList,compare,e,it} from './deathwish-weapon-inversion.mjs';
const obs={
 power:[{stem:'Power',attr:1293,value:2.53}],
 groups:[
 {stem:'Int',lines:[{stem:'Int',attr:1210,value:715}]},
 {stem:'FireD',lines:[{stem:'FireD',attr:231,value:1096},{stem:'FireD',attr:222,value:265}]},
 {stem:'Vit',lines:[{stem:'Vit',attr:1211,value:701}]},
 {stem:'SplashDamage',lines:[{stem:'SplashDamage',attr:1355,value:0.18}]},
 {stem:'WeaponHitStun1h',lines:[{stem:'WeaponHitStun1h',attr:1141,value:0.016}]}
 ]};
const hyps=hypothesisList(obs);
console.log('REAL_DEATHWISH_REFORGE_INPUT',JSON.stringify({origin:"unknown drop: Kadala or GR",step:"one confirmed R on unchanged Deathwish",quality:"normal",screenshotDPS:2111.9,photoPowerPercent:253,numberOfGroups:obs.groups.length,observed:obs,hypotheses:hyps.length}));
if(hyps.length<1)throw Error('No hypotheses for actual Deathwish R');
const wasm=fs.readFileSync('solver/scan.wasm'),w=(await WebAssembly.instantiate(wasm)).instance.exports;
// Game UI rounds Stun-on-Hit to 1 decimal percent. A raw 0.0156 displays 1.6%.
function matchesDisplayed(stem,got,want){return stem==='WeaponHitStun1h'?Math.round(got*1000)/10===1.6:Math.abs(got-want)<.000001;}
function verifiesRealChild(seed,h){
 const lines=e.values(it,seed,h.affixIds.map(id=>e.idIndex.get(id)),false);
 const expected=[...obs.power,...obs.groups.flatMap(g=>g.lines)];
 return lines.length===expected.length&&expected.every(x=>lines.some(y=>y.attr===x.attr&&y.stem===x.stem&&matchesDisplayed(x.stem,y.value,x.value)));
}
const candidates=new Set(),seenByBatch=[];
for(let offset=0;offset<hyps.length;offset+=32){
 const group=hyps.slice(offset,offset+32),pre=new Set();
 w.set_hyp_count(group.length);
 w.set_pre_steps(it.armor?2:1);
 for(const [i,h]of group.entries()){w.set_hyp_length(i,h.constraints.length-1);h.constraints.slice(0,-1).forEach(({m,r},j)=>w.set_hyp_constraint(i,j,m,r));}
 for(let begin=0;begin<4294967296;begin+=6000000){
  const n=w.scan_multi(begin,Math.min(6000000,4294967296-begin));
  if(w.was_overflow())throw Error('WASM seed buffer overflow; cannot claim exhaustive inverse');
  for(let k=0;k<n;k++)pre.add(w.result_at(k)>>>0);
 }
 let confirmed=0;
 for(const s of pre)if(group.some(h=>verifiesRealChild(s,h))){candidates.add(s);confirmed++;}
 console.log('REAL_DEATHWISH_INVERSE_PROGRESS',JSON.stringify({offset,hypotheses:group.length,raw:pre.size,confirmed,all:candidates.size}));
}
const seeds=[...candidates].sort((a,b)=>a-b);
fs.writeFileSync('/tmp/real-deathwish-child-seeds.txt',seeds.join('\n')+'\n');
fs.writeFileSync('/tmp/real-deathwish-observation.json',JSON.stringify(obs));
console.log('REAL_DEATHWISH_NUMERIC_SEED_CANDIDATES',JSON.stringify({count:seeds.length,all:seeds.slice(0,200),roundedStunPercent:1.6}));
if(!seeds.length)throw Error('No numerical child seed; investigate 1096-1361 damage decomposition or percentage scaling');
