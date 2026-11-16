/* Enumerate ALL recipe paths in a limited MATERIAL budget, not arbitrary score.
 * From confirmed current Firebird Down seed = 1745067528, with R/S/C only.
 * MAX_SOULS includes all FUTURE R and C; one real R already happened in-game.
 */
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true);
const wanted=e.item("Firebird's Down"),START=1745067528;
const MAX_S=Number(process.env.MAX_S||2),MAX_SOULS=Number(process.env.MAX_SOULS||150);
const MAX_STEPS=Number(process.env.MAX_STEPS||18),MAX_NODES=Number(process.env.MAX_NODES||'500000');
const MAX_C=Number(process.env.MAX_C||10),MAX_R=Number(process.env.MAX_R||3);
const scores={},solutions=[],counts={visits:0,primal:0,goals:0};
let aborted=false;
const standings={};
const order=(a,b)=>a.souls-b.souls||a.s-b.s||a.path.length-b.path.length;
function checkGoal(result,path,r,c,s,souls){
 if(result.quality!=='primal'||result.itemId!==wanted.id)return;
 counts.primal++;
 const af=result.affixes.map(x=>x.stem),has=new Set(af),vals=new Map(result.lines.map(x=>[x.stem,x.value]));
 if(!has.has('Sockets')||!has.has('Int')||vals.get('Int')!==650)return;
 const missing=['DR','Vit'].filter(x=>!has.has(x));
 if(missing.length>1)return;
 const replacement=result.affixes.filter(x=>x.kind===0&&!['Int','Sockets','DR','Vit'].includes(x.stem));
 if(missing.length===1&&!replacement.length)return;
 const secondary=result.affixes.filter(x=>x.kind===1&&/Resist$/.test(x.stem)).map(x=>x.stem);
 const kind=(missing.length?'mystic':'exact')+(secondary.length?'+resist':'');
 counts.goals++;
 const rec={kind,path,souls,s,c,r,steps:path.length,finalSeed:result.seed,missing,replacement:replacement.map(x=>x.stem),secondary,stats:result.lines.map(x=>[x.stem,x.value])};
 if(!scores[kind]||order(rec,scores[kind])<0){scores[kind]=rec;console.log('FBDOWN_BUDGET_BEST',JSON.stringify(rec))}
}
function dfs(id,seed,path,r,c,s,souls){
 if(++counts.visits>MAX_NODES){aborted=true;return;}
 if(counts.visits%100000===0)console.log('FBDOWN_BUDGET_PROGRESS',JSON.stringify({MAX_S,MAX_SOULS,visits:counts.visits,goals:counts.goals,best:scores}));
 if(path.length>=MAX_STEPS||souls+50>MAX_SOULS)return;
 const it=e.item(id);
 for(const op of ['R','C','S']){
  const ns=s+(op==='S'),nc=c+(op==='C'),nr=r+(op==='R'),money=souls+(op==='C'?10:op==='R'?50:0);
  if(ns>MAX_S||nc>MAX_C||nr>MAX_R||money>MAX_SOULS)continue;
  let next;try{next=e.apply(it,seed,op)}catch{continue}
  const seq=path+op;
  if(op==='R')checkGoal(next,seq,nr,nc,ns,money);
  if(!aborted&&seq.length<MAX_STEPS&&money+50<=MAX_SOULS)dfs(next.itemId,next.seed,seq,nr,nc,ns,money);
  if(aborted)return;
 }
}
dfs(wanted.id,START,'',0,0,0,0);
console.log('FBDOWN_BUDGET_SUMMARY',JSON.stringify({MAX_S,MAX_SOULS,MAX_STEPS,MAX_NODES,counts,aborted,best:scores}));
