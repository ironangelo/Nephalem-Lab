import {U,affixes,byKey,fixed,labels} from './coe-data.js';
// Ported from FNGarvin/d3recipes core/src/sim.rs; CoE/INT-class subset.
// MWC computation uses BigInt for exact 64-bit integer arithmetic.
const MUL=0x6AC690C5n, MASK=0xFFFFFFFFn, BASE=666n<<32n;
export const step = x => (x&MASK)*MUL+(x>>32n);
export class Rng {
  constructor(seed){this.x=BASE|BigInt(Number(seed)>>>0);this.n=0;}
  draw(){this.x=step(this.x);this.n++;return Number(this.x&MASK);}
  get seed(){return Number(this.x&MASK);}
}
export function formatValue(key,v){if(key==='Sockets')return '1 engarce';if(key==='MinMaxDam')return `+${v[0]}–${v[1]} daño`;
 const d=byKey[key]?.divisor||1; if(d!==1)return `${Number((v*100).toFixed(4)).toLocaleString('es-CL',{maximumFractionDigits:1})}%`;
 return Number(v).toLocaleString('es-CL');}
function excluded(a,existing){return existing.some(e=>{
  let hit=a.groupA!==U&&(a.groupA===e.groupA||a.groupA===e.groupB);
  if(a.groupB!==U&&(a.groupB===e.groupA||a.groupB===e.groupB))hit=true;
  return hit;
});}
function fits(a,existing){return existing.length<6 && (a.cost+existing.reduce((n,x)=>n+x.cost,0))<4;}
function getAffix(rng,kind,existing){const pool=affixes.filter(a=>a.kind===kind&&!excluded(a,existing));
 const sum=pool.reduce((n,a)=>n+a.weight,0);let v=rng.draw()%sum;
 for(const a of pool){v-=a.weight;if(v<0)return a;} throw Error('No matching affix');}
export function makeValues(seed,keys,quality){const fullMax=quality==='primal'||quality==='sanctified';
 const tier=fullMax?2:quality==='ancient'?2:1;
 const start=step(BASE|BigInt(Number(seed)>>>0));const rng=new Rng(Number(start&MASK));
 function val(key){if(key==='Sockets')return 1;
  const a=byKey[key];if(!a)throw Error(`Unknown affix: ${key}`);
  const range=a.ranges[tier]; if(key==='MinMaxDam')return range.map(([lo,hi])=>fullMax?hi:lo+rng.draw()%(hi-lo+1));
  const [lo,hi]=range;return (fullMax?hi:lo+rng.draw()%(hi-lo+1))/a.divisor;}
 const power=fullMax?200:150+rng.draw()%51;
 return {power,stats:keys.map(key=>({key,value:val(key),label:labels[key]||key}))};}
export function applyOperation(seed,op){if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Seed inválida');if(op!=='R'&&op!=='S')throw Error('Operación no admitida');
 const rng=new Rng(seed);let ancient=op==='S',primal=op==='S';
 if(op==='R'){ancient=rng.draw()/4294967296<=0.1;if(ancient)primal=rng.draw()/4294967296<=0.025;}
 // The three fixed CoE slots (main stat, CHC, socket) have a unique highest-tier member for INT heroes.
 const keys=[...fixed];rng.draw(); // legendary discarded draw
 keys.push(getAffix(rng,0,keys.map(k=>byKey[k])).key);
 keys.push(getAffix(rng,1,keys.map(k=>byKey[k])).key);
 const child=rng.seed;
 const quality=op==='S'?'sanctified':primal?'primal':ancient?'ancient':'normal';
 const values=makeValues(child,keys,quality);
 return {op,from:seed,seed:child,quality,keys,draws:rng.n,...values};}
export function hasRequired(result,goal){if(result.quality!=='primal')return null;
 const req=goal==='double-crit-cdr'?['CriticalChance','CriticalD','CooldownReduction','Sockets']:
 goal==='double-crit-int'?['CriticalChance','CriticalD','Int','Sockets']:
 goal==='cdr-int'?['CriticalChance','CooldownReduction','Int','Sockets']:['CriticalChance','Sockets'];
 const missing=req.filter(k=>!result.keys.includes(k));if(missing.length>1)return null;
 const canSwap=missing.length===1&&result.keys.includes('Int')&&missing[0]!=='Int';
 // For custom goals where Int must remain, only a free rolled affix is interchangeable.
 if(missing.length&&!canSwap)return null;
 return {mystic: missing.length?`Int → ${labels[missing[0]]}`:null,mysticFrom:missing.length?'Int':null,mysticTo:missing.length?missing[0]:null};}
export function normalizedObservation(o){return {...o,power:Number(o.power),main:Number(o.main),critical:Number(o.critical),primaryValue:Number(o.primaryValue),secondaryValue:Number(o.secondaryValue)};}
export function matchObservation(r,o){const t=normalizedObservation(o);
 if(t.quality&&t.quality!=='any'&&r.quality!==t.quality)return false;
 if(t.power!==r.power)return false;
 if(!r.keys.includes(t.primary)||!r.keys.includes(t.secondary))return false;
 const map=Object.fromEntries(r.stats.map(s=>[s.key,s.value]));
 const approx=(key,want)=>{
  const x=map[key];if(!Number.isFinite(x)||!Number.isFinite(want))return false;
  const tolerance=['KillLife','HitLife','HealthGlobeBonus','Regen'].includes(key)?1.1:0.00001;
  return Math.abs(x-want)<=tolerance;
 };
 return approx('Int',t.main)&&approx('CriticalChance',t.critical/100)&&approx(t.primary,t.primaryValue / (byKey[t.primary]?.divisor===100?100:1))&&approx(t.secondary,t.secondaryValue / (byKey[t.secondary]?.divisor===100?100:1));
}
export function constraintsFromObservation(o){const t=normalizedObservation(o);
 // Initial recovery currently requires a normal reforge-produced CoE (five numerical rolls).
 if(t.quality!=='normal')throw Error('La búsqueda inversa inicial solo admite un anillo normal reforjado. Los estados posteriores sí pueden ser ancient/primal/santificados.');
 if(!byKey[t.primary]||!byKey[t.secondary])throw Error('Selecciona afijos compatibles');
 if(byKey[t.primary].kind!==0||byKey[t.secondary].kind!==1)throw Error('Los afijos variable primario/secundario deben corresponder a su categoría');
 const data=[{m:51,r:t.power-150},{m:85,r:t.main-416},{m:4,r:Math.round(t.critical*2)-9}];
 const add=(key,value)=>{const a=byKey[key];const range=a.ranges[1];if(key==='MinMaxDam')throw Error('El primer barrido todavía no admite daño mínimo y máximo (dos tiradas).');
 const [lo,hi]=range;const scaled=Math.round(value*a.divisor/(a.divisor===100?100:1));
 data.push({m:hi-lo+1,r:scaled-lo});};
 add(t.primary,t.primaryValue);add(t.secondary,t.secondaryValue);
 if(data.some(x=>!Number.isInteger(x.r)||x.r<0||x.r>=x.m))throw Error('Algún valor está fuera de los rangos de este CoE normal.');
 return data;
}
export function predictRoute(start,path){let state=start;return [...path].map((op,n)=>{const r=applyOperation(state,op);state=r.seed;return {...r,index:n+1};});}
export function statSummary(r){return [`${r.power}% de poder`,...r.stats.map(s=>`${s.label}: ${formatValue(s.key,s.value)}`)].join(' · ');}
export const gameSource='https://github.com/FNGarvin/d3recipes';
