/* Check candidate parent seeds from native complete 2^32 MWC inversion.
 * No APK changes, no game actions.
 */
import {UniversalEngine,loadGameData,affixStem,Rng} from '../src/universal-engine.js';
import {observationAffixFamilies,generateRecoveryHypotheses,verifyHypothesis} from '../src/universal-recovery.js';
import {matchesObservation} from '../src/candidate-analysis.js';
const data=await loadGameData(),it=data.items.find(x=>x.name==="Firebird's Breast");
const e=new UniversalEngine(data,'Wizard',true);
const f=observationAffixFamilies(e,it);
const attr=(stem,value)=>{
 const as=e.candidateAffixes(it).filter(x=>affixStem(x.label)===stem);
 const ids=[...new Set(as.flatMap(x=>x.formulas.map(([id])=>id)))];
 if(ids.length!==1)throw Error('Ambiguous family '+stem+JSON.stringify(ids));
 return {stem,attr:ids[0],value};
};
const A={itemId:it.id,quality:'normal',lines:[attr('Int',416),attr('Life',10),attr('Experience',198),attr('GoldPickUpRadius',2),attr('Skill_Wizard_ExplosiveBlast',11)]};
const B={itemId:it.id,quality:'normal',lines:[attr('Int',456),attr('Vit',484),attr('LightningResist',149),attr('Thorns',5366),attr('Skill_Wizard_ExplosiveBlast',13)]};
const C={itemId:it.id,quality:'normal',lines:[attr('Int',443),attr('Vit',476),attr('Life',11),attr('PoisonResist',149),attr('GoldPickUpRadius',1)]};
const perm=a=>a.length===1?[a]:a.flatMap((v,i)=>perm([...a.slice(0,i),...a.slice(i+1)]).map(p=>[v,...p]));
const unique=new Map();
for(const order of perm(A.lines)){for(const h of generateRecoveryHypotheses(e,it,{...A,lines:order}))unique.set(JSON.stringify(h.constraints)+'_'+h.affixIds.join(','),h);}
const hyps=[...unique.values()];
const seeds=[
 [3525123180,6],[19931006,7],[2564475181,7],
 [127087488,8],[3819770718,9],
 [1729604850,1],[1559504401,2],[782944890,3],[3836633569,3],
 [850519733,4],[3708138620,4],[2166340295,11],[650451167,12],[1069071246,12],
 [1261813261,13],[1057645229,14],[1824464330,15],[3515797825,15]
];
console.log('PARAMS',JSON.stringify({item:it.name,id:it.id,restricted_class:it.restricted_class,heroes:data.classes,hypotheses:hyps.length,picks:[it.primary_pick_count,it.secondary_pick_count,it.flex_pick_count]}));
for(const [seed,pureDraws]of seeds){
 const matches=hyps.filter(h=>verifyHypothesis(e,it,seed,h));
 let best=[];
 for(const h of hyps){
  const value=e.values(it,seed,h.affixIds.map(id=>e.idIndex.get(id)),false);
  let count=0,details=[];
  for(const o of A.lines){const actual=value.find(l=>l.attr===o.attr&&l.stem===o.stem);if(actual){const goal=Number(o.value);const ok=[goal,goal/100,goal/1000].some(w=>Math.abs(actual.value-w)<0.001);if(ok)count++;details.push({stem:o.stem,actual:actual.value,expected:o.value,ok});}else details.push({stem:o.stem,missing:true});}
  if(!best.length||count>best[0].count)best=[{count,details,affixes:h.affixIds.map(id=>e.affixes[e.idIndex.get(id)].stem)}];
 }
 const classResult=[];
 for(let i=0;i<data.classes.length;i++){
  const engine=new UniversalEngine(data,i,true),result=engine.reforge(it,seed);
  const matchB=matchesObservation(result,B);
  classResult.push({hero:data.classes[i],draws:result.draws,seed:result.seed,quality:result.quality,matchB,stems:result.affixes.map(x=>x.stem),lines:result.lines.map(({stem,value})=>({stem,value}))});
 }
 console.log('PARENT_CHECK',JSON.stringify({seed,pureDraws,firstValuesHypotheses:matches.length,bestA:best[0],classResult:classResult.filter(v=>v.hero==='Wizard'||v.seed===2645309652||v.matchB)}));
}
const middle=e.reforge(it,2645309652);
console.log('VERIFY_B_TO_C',JSON.stringify({draws:middle.draws,childSeed:middle.seed,matchC:matchesObservation(middle,C),quality:middle.quality}));
