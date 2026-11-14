/*
 * Nephalem Lab: generic Diablo III console item simulator.
 * Ported from FNGarvin/d3recipes core/src/sim.rs (2026).
 * Copyright 2026 FNG, reused under the terms in THIRD_PARTY_NOTICES.md.
 * Unlike the initial CoE-only proof, this engine works from item/affix tables.
 * The formulas and item database must match the game's version.
 */
const U=4294967295, MASK=0xFFFFFFFFn, MUL=0x6AC690C5n;
const WILDCARD=0xEA3AD528;
export const CLASSES=['DemonHunter','Barbarian','Wizard','WitchDoctor','Monk','Crusader','Necromancer'];
export const step=x=>(x&MASK)*MUL+(x>>32n);
export class Rng{
 constructor(seed){this.x=(666n<<32n)|BigInt(Number(seed)>>>0);this.n=0;}
 static fromState(x){const r=Object.create(Rng.prototype);r.x=BigInt(x);r.n=0;return r;}
 draw(){this.x=step(this.x);this.n++;return Number(this.x&MASK);}
 get seed(){return Number(this.x&MASK);}
}
function specsFormula(hex,rng){
 const b=Uint8Array.from(hex.match(/../g).map(x=>parseInt(x,16)));const dv=new DataView(b.buffer);
 const stack=[];for(let i=0;i<b.length;i+=8){const op=b[i];if(!op)break;
  if(op===5){stack.push(NaN);i+=32;} // full five-word attribute lookup
  else if(op===6)stack.push(dv.getFloat32(i+4,true));
  else if(op===1){const f=b[i+4];if(f===4){const hi=stack.pop(),lo=stack.pop();
    if(rng){const x=rng.draw();stack.push(Number.isNaN(hi)||Number.isNaN(lo)?NaN:lo+x%(hi-lo+1));}
    else stack.push(hi);
   }else if(f===0){const y=stack.pop(),x=stack.pop();stack.push(Math.min(x,y));}
   else if(f===1){const y=stack.pop(),x=stack.pop();stack.push(Math.max(x,y));}
   else if(f===11){} // function wrapper over attribute lookup
   else throw Error(`Unsupported game formula function ${f}`);
  }else if(op===0x10){stack.push(-stack.pop());}
  else{const y=stack.pop(),x=stack.pop();switch(op){case 0xB:stack.push(x+y);break;case 0xC:stack.push(x-y);break;case 0xD:stack.push(x*y);break;case 0xE:stack.push(x/y);break;default:throw Error(`Unsupported formula opcode ${op}`);}}
 }
 return stack.at(-1)??0;
}
function stem(label){let s=label.replace(/^(1xx_|21x_|P6_|X1_)/,'');const out=[];for(const part of s.split(' ')){
 if(/^\d+(?:\.\d+)?$/.test(part)||/^[IVX]+$/.test(part)||['Secondary','Legendary','Fast','Two-Handed','Ancient','Primal'].includes(part))break;
 out.push(part);
 }return out[0]==='Sockets'?'Sockets':out.join(' ');
}
const ALIASES={Int:'Intelligence',Dex:'Dexterity',Str:'Strength',Vit:'Vitality',CriticalChance:'Critical Hit Chance',CriticalD:'Critical Hit Damage',CooldownReduction:'Cooldown Reduction',Sockets:'Socket',Haste:'Attack Speed',KillLife:'Life after Each Kill',DR:'Armor',HitLife:'Life per Hit',HealthGlobeBonus:'Health Globe Bonus',ResistAll:'All Resistance',ResourceCostReduction:'Resource Cost Reduction'};
export const niceStem=s=>ALIASES[s]||s.replace(/([a-z])([A-Z])/g,'$1 $2');
export const affixStem=stem;
export const loadGameData=async({url='https://raw.githubusercontent.com/FNGarvin/d3recipes/49fe28467db9ebbd096694d1408528b2c9ce5ea3/web/data.json'}={})=>{
 let text;
 try{const r=await fetch(url,{cache:'no-cache'});if(!r.ok)throw Error(`HTTP ${r.status}`);text=await r.text();
  if(globalThis.caches){const c=await caches.open('nephalem-d3-database-v1');await c.put(url,new Response(text,{headers:{'content-type':'application/json'}}));}
 }catch(e){if(globalThis.caches){const c=await caches.open('nephalem-d3-database-v1'),r=await c.match(url);if(r)text=await r.text();}
  if(!text)throw new Error(`Unable to load D3Recipes item database. An internet connection is needed on first use. (${e.message})`);
 }
 const d=JSON.parse(text);if(!Array.isArray(d.items)||!Array.isArray(d.affixes)||d.items.length<500)throw Error('Incomplete data file');
 return d;
};
export class UniversalEngine{
 constructor(data,hero=2,primalEligible=true){
  this.d=data;this.hero=typeof hero==='string'?data.classes.indexOf(hero):hero;this.primalEligible=primalEligible;
  if(this.hero<0||this.hero>=data.classes.length)throw Error('Unsupported class');
  this.items=data.items;this.affixes=data.affixes;
  this.idIndex=new Map(this.affixes.map((a,i)=>[a.id,i]));
  this.itemIndex=new Map(this.items.map((a,i)=>[a.id,i]));
  this.groupMembers=new Map();
  this.affixes.forEach((a,i)=>{for(const gid of new Set([a.fixed_group_a,a.fixed_group_b])){
   if(!this.groupMembers.has(gid))this.groupMembers.set(gid,[]);this.groupMembers.get(gid).push(i);
  }});
  this.wornIds=new Set();for(const slot of data.slots){if(['Ring','Amulet','Helm','Chest','Legs','Cloak','SpiritStone_Monk','VoodooMask','WizardHat'].includes(slot.name)){
   for(const pool of Object.values(slot.pools||{}))for(const [idx] of pool)this.wornIds.add(idx);
  }}
  this.baseCache=new Map();
 }
 item(query){if(typeof query==='object'&&query?.name)return query;
  if(Number.isInteger(query))return this.itemIndex.has(query)?this.items[this.itemIndex.get(query)]:this.items[query];
  return this.items.find(it=>it.name===query);
 }
 classFor(it){return it.restricted_class>=0&&it.restricted_class!==U?it.restricted_class:this.hero;}
 weight(a,cls){return a.base_weight*a.class_weight[cls];}
 types(a,it,wild=false){return a.allowed_types.some(t=>(wild&&t===WILDCARD)||t===it.slot_type||it.type_chain.includes(t));}
 eligible(a,it,cls,{skipLevel=false,skipQuality=false,wild=false,banSocket=false}={}){
  return !a.is_legacy_socket&&!(banSocket&&a.is_socket)&&
   (skipLevel||a.level_range[0]<=70&&a.level_range[1]>=70)&&
   (a.restricted_class===U||a.restricted_class===cls)&&this.types(a,it,wild)&&
   (skipQuality||((a.quality_mask>>>9)&1)===1)&&this.weight(a,cls)>=1;
 }
 excluded(idx,existing){const a=this.affixes[idx];for(const ei of existing){const e=this.affixes[ei];
  let hit=a.fixed_group_a!==U&&(a.fixed_group_a===e.fixed_group_a||a.fixed_group_a===e.fixed_group_b);
  if(a.fixed_group_b!==U&&(a.fixed_group_b===e.fixed_group_b||a.fixed_group_b===e.fixed_group_a))hit=true;
  if(a.exclusion_group===U){if(hit)return true;}
  else if(hit||(e.exclusion_group!==U&&a.exclusion_group!==e.exclusion_group))return true;
 }return false;}
 fits(idx,existing){if(existing.length>=6)return false;
  const a=this.affixes[idx];let cost=a.budget_cost;
  for(const ei of existing){const e=this.affixes[ei];cost+=e.budget_cost;
   if(a.exclusion_key===U){if(e.exclusion_key!==U&&a.exclusion_ids.includes(e.exclusion_key))return false;}
   else if(e.exclusion_ids.includes(a.exclusion_key)||(e.exclusion_key!==U&&a.exclusion_ids.includes(e.exclusion_key)))return false;
  }return cost<4;
 }
 variant(idx,swaps,converge=false){
  for(let i=0;i<(converge?20:swaps);i++){const next=this.idIndex.get(this.affixes[idx].upgrades_to);
   if(next===undefined)break;idx=next;
  }return idx;
 }
 resolve(gid,it,cls,existing,rng,swaps,converge,banSocket){
  for(let wildcard=0;wildcard<3;wildcard++){
   let best=-1,tied=[];
   for(const i of this.groupMembers.get(gid)||[]){const a=this.affixes[i];
    if(a.fixed_group_a!==gid&&a.fixed_group_b!==gid)continue;
    const ok=wildcard===2?(a.restricted_class===U||a.restricted_class===cls)&&this.weight(a,cls)>=1&&!this.excluded(i,existing):
     this.eligible(a,it,cls,{skipLevel:true,skipQuality:true,wild:wildcard===1,banSocket})&&!this.excluded(i,existing);
    if(!ok||a.tier>70)continue;
    if(a.tier>best){best=a.tier;tied=[i];}else if(a.tier===best)tied.push(i);
   }
   if(tied.length){const pick=tied.length===1?tied[0]:tied[rng.draw()%tied.length];return this.variant(pick,swaps,converge);}
  }return null;
 }
 base(it,cls,banSocket=false){const k=`${it.id}:${cls}:${banSocket}`;
  if(!this.baseCache.has(k))this.baseCache.set(k,this.affixes.map((a,i)=>this.eligible(a,it,cls,{banSocket})?i:-1).filter(i=>i!==-1));
  return this.baseCache.get(k);
 }
 _picks(it,cls,rng,existing,{swaps,converge=false,banSocket=false,forceSocket=false,lead=0}={}){
  const kinds=[...Array(lead+it.primary_pick_count).fill(0),...Array(it.secondary_pick_count).fill(1),...Array(it.flex_pick_count).fill(null)];
  kinds.length=Math.min(kinds.length,6-existing.length);
  let socket;
  if(forceSocket&&!existing.some(i=>this.affixes[i].is_socket)){
   const arr=this.affixes.map((a,i)=>a.is_socket&&!a.is_legacy_socket&&a.pick_kind===0&&a.tier<=70&&this.types(a,it)?i:-1).filter(i=>i!==-1);
   socket=arr.reduce((best,i)=>best===undefined||this.affixes[i].tier>this.affixes[best].tier?i:best,undefined);
  }
  for(const kind of kinds){const choices=this.base(it,cls,banSocket).filter(i=>(kind===null||this.affixes[i].pick_kind===kind)&&!this.excluded(i,existing));
   if(!choices.length)continue;
   const total=choices.reduce((sum,i)=>sum+this.weight(this.affixes[i],cls),0);let v=rng.draw()%total;
   let pick=choices.at(-1);for(const i of choices){v-=this.weight(this.affixes[i],cls);if(v<0){pick=i;break;}}
   if(kind===0&&socket!==undefined){existing.push(socket);socket=undefined;continue;}
   const fin=this.variant(pick,swaps,converge);if(this.fits(fin,existing))existing.push(fin);
  }
 }
 _fixed(it,cls,rng,swaps,converge=false,banSocket=false){let unresolved=0,affixes=[];
  for(const gid of it.fixed_slot_groups){if(gid===U)continue;
   const i=this.resolve(gid,it,cls,affixes,rng,swaps,converge,banSocket);
   if(i===null){unresolved++;continue;}if(this.fits(i,affixes))affixes.push(i);
  }return {unresolved,affixes};
 }
 _result(it,op,seed,rng,affixes,ancient,primal,childSeed=rng.seed){return {
  item:it.name,itemId:it.id,hero:this.d.classes[this.hero],op,from:seed,seed:childSeed,draws:rng.n,
  ancient,primal,quality:op==='S'?'sanctified':op==='P'?'crafted':primal?'primal':ancient?'ancient':'normal',
  affixes:affixes.map(i=>({id:this.affixes[i].id,label:this.affixes[i].label,stem:stem(this.affixes[i].label),socket:this.affixes[i].is_socket,kind:this.affixes[i].pick_kind})),
  lines:this.values(it,childSeed,affixes,primal||op==='S'||op==='P')
 };}
 reforge(query,seed){const it=this.item(query);if(!it)throw Error('Unknown item');let rng=new Rng(seed),cls=this.classFor(it);
  const ancient=rng.draw()/4294967296<=.1,primal=ancient&&this.primalEligible&&rng.draw()/4294967296<=.025;
  const swaps=ancient?2:1,extra=it.restricted_class>=0&&it.restricted_class!==this.hero?1:0;
  for(let n=0;n<extra;n++)rng.draw();
  const banSocket=primal&&it.weapon,{unresolved,affixes}=this._fixed(it,cls,rng,swaps,false,banSocket);
  rng.draw();
  this._picks(it,cls,rng,affixes,{swaps,banSocket,forceSocket:primal&&this.wornIds.has(this.items.indexOf(it)),lead:banSocket?unresolved:0});
  return this._result(it,'R',seed,rng,affixes,ancient,primal);
 }
 primalRoll(query,seed,op='P'){
  const it=this.item(query);if(!it)throw Error('Unknown item');const cls=this.classFor(it),rng=new Rng(seed),banSocket=it.weapon;
  if(it.restricted_class>=0&&it.restricted_class!==this.hero)rng.draw();
  const {unresolved,affixes}=this._fixed(it,cls,rng,2,true,banSocket);rng.draw();
  this._picks(it,cls,rng,affixes,{swaps:2,converge:true,banSocket,forceSocket:this.wornIds.has(this.items.indexOf(it)),lead:banSocket?unresolved:0});
  let childSeed=rng.seed;
  if(op==='S'&&affixes.length===6){const prev=new Rng(seed);for(let i=0;i<rng.n-1;i++)prev.draw();childSeed=prev.seed;}
  return this._result(it,op,seed,rng,affixes,true,true,childSeed);
 }
 values(it,seed,affixes,maxed=false){let x=step((666n<<32n)|BigInt(seed>>>0));if(it.armor)x=step(x);
  const rng=maxed?null:new Rng(Number(x&MASK));const lines=[];
  for(const [attr,formula] of it.formulas||[])lines.push({attr,value:specsFormula(formula,rng),affixId:null,stem:'Power'});
  for(const i of affixes){const a=this.affixes[i];for(const [attr,formula] of a.formulas)lines.push({attr,value:specsFormula(formula,rng),affixId:a.id,stem:stem(a.label),label:a.label});}
  return lines;
 }
 convert(query,seed){const it=this.item(query);if(!it)throw Error('Unknown item');if(!it.set_id)throw Error('Convert Set Item requires a set item');
  const cls=this.classFor(it);const pool=this.items.map((x,i)=>x.set_id===it.set_id&&x.id!==it.id?i:-1).filter(x=>x!==-1).sort((a,b)=>this.items[a].table_index-this.items[b].table_index);
  if(pool.length<2)throw Error('This set has fewer than three pieces');
  const total=pool.reduce((s,i)=>s+this.items[i].base_weight*this.items[i].class_weight[cls],0);
  let x=step((666n<<32n)|BigInt(seed)),v=Number(x&MASK)%total,target=pool.at(-1);
  for(const i of pool){v-=this.items[i].base_weight*this.items[i].class_weight[cls];if(v<0){target=i;break;}}
  if(it.restricted_class>=0&&it.restricted_class!==this.hero)x=step(x);
  const t=this.items[target],rng=Rng.fromState(x),fc=this._fixed(t,this.classFor(t),rng,1);rng.draw();this._picks(t,this.classFor(t),rng,fc.affixes,{swaps:1});
  return this._result(t,'C',seed,rng,fc.affixes,false,false,Number(x&MASK));
 }
 candidateAffixes(query){const it=this.item(query),cls=this.classFor(it),groups=it.fixed_slot_groups.filter(g=>g!==U);
  return this.affixes.filter(a=>this.eligible(a,it,cls)||groups.some(g=>(a.fixed_group_a===g||a.fixed_group_b===g)&&a.tier<=70&&a.base_weight*a.class_weight[cls]>0));
 }
 apply(query,seed,op){return op==='R'?this.reforge(query,seed):op==='S'||op==='P'?this.primalRoll(query,seed,op):op==='C'?this.convert(query,seed):(()=>{throw Error('Unknown operation')})();}
}

// Research branch only: expose the bytecode formula evaluator for drop-seed tests.
export {specsFormula};
