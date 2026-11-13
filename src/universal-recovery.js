/* Generic seed recovery for NORMAL unmodified tooltip values; numerical invert of
   the game item/affix formula bytecode, without assuming a specific item.
   The solver *must* verify all matches by replaying the exact RNG values. */
import {Rng,step} from './universal-engine.js';
const MASK=0xFFFFFFFFn, U=4294967295;
function symbolicFormula(hex){
 const b=Uint8Array.from(hex.match(/../g).map(x=>parseInt(x,16))),dv=new DataView(b.buffer),st=[];
 for(let i=0;i<b.length;i+=8){const op=b[i];if(op===0)break;
  if(op===6)st.push({c:dv.getFloat32(i+4,true),a:0,lo:null,hi:null});
  else if(op===1){const fn=b[i+4];if(fn===4){const hi=st.pop(),lo=st.pop();if(hi.a||lo.a)return null;
   st.push({c:0,a:1,lo:lo.c,hi:hi.c});
  }else return null;}
  else if([0xB,0xC,0xD,0xE].includes(op)){
   const y=st.pop(),x=st.pop();if(!x||!y)return null;
   if(op===0xB||op===0xC){const factor=op===0xB?1:-1;if(x.a&&y.a)return null;st.push({...x,c:x.c+factor*y.c,a:x.a+factor*y.a,lo:x.lo??y.lo,hi:x.hi??y.hi});}
   else if(op===0xD){if(x.a&&y.a)return null;let v=x.a?{...x}:{...y},k=x.a?y.c:x.c;st.push({c:v.c*k,a:v.a*k,lo:v.lo,hi:v.hi});}
   else if(op===0xE){if(y.a||!y.c)return null;st.push({c:x.c/y.c,a:x.a/y.c,lo:x.lo,hi:x.hi});}
  }else return null;
 }
 const res=st.at(-1);if(!res)return null;
 if(res.lo===null&&res.a===0)return res;
 if(res.lo===null||res.hi===null||!Number.isInteger(res.lo)||!Number.isInteger(res.hi)||res.a===0)return null;
 return res;
}
function stem(label){let parts=label.replace(/^(1xx_|21x_|P6_|X1_)/,'').split(' '),out=[];
 for(const part of parts){if(/^\d+(?:\.\d+)?$/.test(part)||/^[IVX]+$/.test(part)||['Secondary','Legendary','Fast','Two-Handed','Ancient','Primal'].includes(part))break;out.push(part)}return out[0]==='Sockets'?'Sockets':out.join(' ');
}
export const observationAffixFamilies=(engine,item)=>[...new Set(engine.candidateAffixes(item).map(a=>stem(a.label)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
function affixCandidates(engine,it,cls,observed,quality){
 const all=engine.candidateAffixes(it),ret=[];
 for(const a of all){if(stem(a.label)!==observed.stem)continue;
  const idx=engine.idIndex.get(a.id),up=engine.variant(idx,quality==='ancient'?2:1);
  const next=engine.affixes[up];if(!ret.some(x=>x.id===next.id))ret.push(next);
 }
 return ret;
}
function matchesObserved(specs,values){if(specs.length!==values.length)return false;
 for(let i=0;i<specs.length;i++)if(specs[i][0]!==values[i].attr)return false;
 return true;
}
function modForFormula(fx,value){const sym=symbolicFormula(fx);if(!sym)return null;
 if(sym.lo===null){return [value,value/100,value/1000].some(v=>Math.abs(v-sym.c)<0.0001)?{skip:true}:null;}
 const mod=sym.hi-sym.lo+1;for(const target of [value,value/100,value/1000]){const raw=(target-sym.c)/sym.a;const rem=Math.round(raw-sym.lo);
 if(Number.isInteger(mod)&&mod>=1&&Number.isFinite(rem)&&Math.abs(raw-sym.lo-rem)<0.0001&&rem>=0&&rem<mod)return {m:mod,r:rem};}
 return null;
}
function sequenceForAffixes(it,selected){return [...it.formulas.map(([attr,fx])=>[attr,fx,'Power']),...selected.flatMap(a=>a.formulas.map(([attr,fx])=>[attr,fx,stem(a.label)]))];}
/**
 * Observations: {quality:'normal',lines:[{stem:'Int',attr:1210,value:423},...]}.
 * Required stats are input with IDs to avoid cross-language confusion.
 * Distinct possible affix tiers/selection orders are enumerated; each numerical
 * hypothesis is tested across a full 32-bit scan, then checked with the simulator.
 */
export function generateRecoveryHypotheses(engine,query,observation,{maxHypotheses=128}={}){
 const it=engine.item(query);if(!it)throw Error('Item not found');
 if(observation.quality!=='normal')throw Error('Initial inverse search currently needs one normal, non-enchanted item. Later Ancient/Primal observations can validate the candidates.');
 const lines=observation.lines.filter(l=>l.stem!=='Sockets'),cls=engine.classFor(it);
 if(!lines.length)throw Error('Enter the numeric affixes of the item');
 const power=lines.filter(l=>l.stem==='Power'),rest=lines.filter(l=>l.stem!=='Power');
 if(power.length!==it.formulas.length)throw Error('Enter every numeric legendary/base power of the item');
 const sets=[];
 for(const l of rest){const options=affixCandidates(engine,it,cls,l,'normal').filter(a=>a.formulas.some(([attr])=>attr===l.attr));
  if(!options.length)throw Error(`Unsupported or inconsistent stat: ${l.stem} / ${l.attr}`);
  sets.push(options);
 }
 const fixedGroups=it.fixed_slot_groups.filter(g=>g!==U),hyp=[];
 function walk(index,selected,seen){
  if(hyp.length>=maxHypotheses)return;
  if(index===sets.length){
   // Item-specific fixed groups are generated first. The remaining primaries precede secondaries.
   const assigned=selected.map((a,i)=>({a,l:rest[i],i}));
   const fixed=[],left=[...assigned];
   for(const group of fixedGroups){const i=left.findIndex(x=>x.a.fixed_group_a===group||x.a.fixed_group_b===group);
    if(i>=0){fixed.push(left.splice(i,1)[0]);continue;}
    // Non-numeric fixed affixes (most commonly a socket) have no tooltip value to enter.
    const option=engine.candidateAffixes(it).filter(a=>a.formulas.length===0&&(a.fixed_group_a===group||a.fixed_group_b===group)&&a.tier<=70).sort((a,b)=>b.tier-a.tier)[0];
    if(!option)return;
    const upgraded=engine.affixes[engine.variant(engine.idIndex.get(option.id),1)];
    fixed.push({a:upgraded,l:{stem:stem(upgraded.label)},i:-1});
   }
   left.sort((a,b)=>((a.a.pick_kind===0?0:a.a.pick_kind===1?1:2)-(b.a.pick_kind===0?0:b.a.pick_kind===1?1:2))||a.i-b.i);
   const ordered=[...fixed,...left],seq=sequenceForAffixes(it,ordered.map(x=>x.a)),vals=[...power,...ordered.flatMap(x=>rest.filter(l=>l.stem===x.l.stem&&x.a.formulas.some(s=>s[0]===l.attr)))];
   // For multiple specs of same affix, match attributes in formula order.
   let n=0,constraints=[];for(const [attr,formula,stemName] of seq){const matched=vals.find((v,i)=>i>=n&&v.attr===attr&&v.stem===stemName);if(!matched)return;
    n=vals.indexOf(matched)+1;const c=modForFormula(formula,Number(matched.value));if(!c)return;if(!c.skip)constraints.push(c);
   }
   if(constraints.length<3)return;
   const key=JSON.stringify(constraints);if(!seen.has(key)){seen.add(key);hyp.push({constraints,affixIds:ordered.map(x=>x.a.id),stats:vals});}
   return;
  }
  for(const a of sets[index]){if(selected.some(x=>x.id===a.id))continue;walk(index+1,[...selected,a],seen);}
 }
 walk(0,[],new Set());
 if(!hyp.length)throw Error('Not enough complete, unmodified numerical rolls to reconstruct a seed for this item. You may need another observation or a more complete tooltip.');
 return hyp;
}
export function verifyHypothesis(engine,query,seed,hyp){const it=engine.item(query),a=hyp.affixIds.map(id=>engine.idIndex.get(id));
 if(a.some(x=>x===undefined))return false;
 const values=engine.values(it,seed,a,false);
 return hyp.stats.length===values.length&&hyp.stats.every((s,i)=>{if(values[i].attr!==s.attr)return false;const actual=values[i].value,want=Number(s.value);return [want,want/100,want/1000].some(v=>Math.abs(actual-v)<(Math.abs(actual)>1000?1.01:0.0001));});
}
