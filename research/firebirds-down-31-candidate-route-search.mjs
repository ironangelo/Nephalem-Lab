/*
 Research-only route search for each candidate stored seed of unreforged Firebird's Down.
 S = Sanctify (Angelic Crucible, 0 Souls)
 R = Reforge Legendary (50 Souls, 5 bounty mats EACH act)
 C = Convert Set Item (10 Souls + 10 Death's Breaths, moves to a different set piece)
 Goal: final R to Firebird's Down NATURAL PRIMAL, INT 650, 2 sockets,
       DR +775, VIT +650 (one can be Mystic replacement), secondary any resist.
 The search is bounded and NOT proof of global optimality. Verify first S in Switch
 before attempting ANY predicted recipe from the corresponding candidate seed.
*/
import {readFileSync} from 'node:fs';
import {UniversalEngine,loadGameData} from '../src/universal-engine.js';
const e=new UniversalEngine(await loadGameData(),'Wizard',true),wanted=e.item("Firebird's Down");
const inputs=JSON.parse(readFileSync('research/firebirds-down-original-31-seeds.json','utf8')).candidates;
const shard=Number(process.env.SHARD||0),shards=Number(process.env.SHARDS||8);
const MAX=Number(process.env.MAX_NODES||'130000'),MAX_STEPS=Number(process.env.MAX_STEPS||'25');
const MAXR=7,MAXS=25,MAXC=9;
const mode=process.env.MODE||'balanced';
const weights=mode==='souls-first'?{S:1,R:60,C:12}:mode==='fewest-steps'?{S:1,R:1,C:1}:{S:1,R:12,C:3};
class Heap{constructor(){this.a=[]}push(v){const a=this.a;let i=a.length;a.push(v);while(i>0){let p=(i-1)>>1;if(a[p].score<=v.score)break;a[i]=a[p];i=p}a[i]=v}pop(){const a=this.a;if(!a.length)return null;const res=a[0],last=a.pop();if(a.length){let i=0;while(2*i+1<a.length){let k=2*i+1;if(k+1<a.length&&a[k+1].score<a[k].score)k++;if(last.score<=a[k].score)break;a[i]=a[k];i=k;}a[i]=last;}return res}get size(){return this.a.length}}
function check(r){
 if(r.quality!=='primal'||r.itemId!==wanted.id)return null;
 const have=new Set(r.affixes.map(a=>a.stem));
 if(!have.has('Int')||!have.has('Sockets'))return null;
 const nat=['DR','Vit'].filter(x=>have.has(x));
 if(!nat.length)return null;
 const secondary=r.affixes.filter(a=>a.kind===1).map(a=>a.stem);
 const resists=secondary.filter(s=>/Resist$/.test(s));
 const missing=['DR','Vit'].filter(x=>!have.has(x));
 if(missing.length>1)return null;
 let mystic=null;
 if(missing.length===1){
  const replaceable=r.affixes.filter(a=>a.kind===0&&!['DR','Vit','Int','Sockets'].includes(a.stem));
  if(!replaceable.length)return null;
  // Existing affix can be rerolled to the missing stat in the given slot.
  const ok=e.candidateAffixes(wanted).filter(a=>a.pick_kind===0&&a.label.startsWith(missing[0]+' ')).length>0;
  if(!ok)return null;
  mystic={replace:replaceable[0].stem,with:missing[0]};
 }
 return {tier:!missing.length?(resists.length?'exact+res':'exact'):(resists.length?'mystic+res':'mystic'),
  mystic,resistance:resists,values:r.lines.map(x=>[x.stem,x.value]),affixes:r.affixes.map(a=>a.stem)};
}
const costs=path=>({operations:path.length,reforges:(path.match(/R/g)||[]).length,crucibles:(path.match(/S/g)||[]).length,conversions:(path.match(/C/g)||[]).length,
 forgottenSouls:50*(path.match(/R/g)||[]).length+10*(path.match(/C/g)||[]).length,
 bountiesPerAct:5*(path.match(/R/g)||[]).length,deathBreaths:10*(path.match(/C/g)||[]).length});
for(const entry of inputs.filter((_,i)=>i%shards===shard)){
 const start=entry.firstSanctify.seed;
 const q=new Heap(),seen=new Map(),best={};
 // The first S was/will be the confirmed diagnostic and already consumed.
 q.push({id:wanted.id,seed:start,path:'S',score:weights.S,r:0,s:1,c:0});
 let nodes=0,primal=0,goals=0;
 while(q.size&&nodes<MAX){
  const cur=q.pop(),key=cur.id+':'+cur.seed;
  if((seen.get(key)??Infinity)<cur.score)continue;
  nodes++;if(cur.path.length>=MAX_STEPS)continue;
  const it=e.item(cur.id);
  for(const op of ['S','R','C']){
   if(op==='R'&&cur.r>=MAXR||op==='S'&&cur.s>=MAXS||op==='C'&&(cur.c>=MAXC||!it.set_id))continue;
   let next;
   try{next=e.apply(it,cur.seed,op)}catch{continue}
   const path=cur.path+op,score=cur.score+weights[op];
   if(op==='R'&&next.quality==='primal'){
    primal++;
    const g=check(next);
    if(g){
     goals++;
     const prev=best[g.tier];
     if(!prev||score<prev.score||score===prev.score&&path.length<prev.path.length){
      const result={initialOriginalSeed:entry.seed,afterFirstS:start,mode,tier:g.tier,path,score,finalSeed:next.seed,materials:costs(path),goal:g};
      best[g.tier]=result;
      console.log('FBDOWN_CANDIDATE_ROUTE_MATCH',JSON.stringify(result));
     }
    }
   }
   const k=next.itemId+':'+next.seed;
   if((seen.get(k)??Infinity)<=score)continue;
   seen.set(k,score);
   q.push({id:next.itemId,seed:next.seed,path,score,r:cur.r+(op==='R'),s:cur.s+(op==='S'),c:cur.c+(op==='C')});
  }
  if(best['exact+res']&&q.size&&q.a[0].score>best['exact+res'].score)break;
 }
 console.log('FBDOWN_CANDIDATE_ROUTE_SUMMARY',JSON.stringify({seed:entry.seed,afterFirstS:start,mode,nodes,primal,goals,best}));
}
