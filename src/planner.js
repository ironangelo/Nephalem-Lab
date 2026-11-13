import {applyOperation,hasRequired} from './engine.js';
class Heap{
 constructor(){this.a=[];}
 push(v){const a=this.a;a.push(v);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(a[p].cost<=v.cost)break;a[i]=a[p];i=p;}a[i]=v;}
 pop(){const a=this.a;if(!a.length)return;const v=a[0],last=a.pop();if(a.length){let i=0;while(true){let c=i*2+1;if(c>=a.length)break;if(c+1<a.length&&a[c+1].cost<a[c].cost)c++;if(a[c].cost>=last.cost)break;a[i]=a[c];i=c;}a[i]=last;}return v;}
 get size(){return this.a.length;}
}
/** Dijkstra over the *existing* CoE's seed, using only R and S.
 * Recipe costs are user weights, not probabilities or guarantees.
 * 'S' never terminates the plan because we seek a natural primal.
 */
export function findRoute(seed,{goal='double-crit-cdr',maxR=5,maxS=24,maxSteps=18,maxNodes=250000,reforgeWeight=9,sanctifyWeight=1,allowedOperations=['R']}={}){
 const heap=new Heap();heap.push({seed, cost:0, r:0, s:0, path:'', steps:[]});
 const seen=new Map();let visited=0;
 while(heap.size&&visited<maxNodes){
  const x=heap.pop(),id=`${x.seed}:${x.r}:${x.s}`;
  if((seen.get(id)??Infinity)<x.cost)continue;
  visited++;
  for(const op of ['S','R'].filter(op=>allowedOperations.includes(op))){
   const nr=x.r+(op==='R'?1:0),ns=x.s+(op==='S'?1:0);
   if(nr>maxR||ns>maxS||x.path.length>=maxSteps)continue;
   const result=applyOperation(x.seed,op),cost=x.cost+(op==='R'?reforgeWeight:sanctifyWeight),path=x.path+op;
   const info=op==='R'?hasRequired(result,goal):null;
   if(info)return {found:true,seed,steps:[...x.steps,result],path,cost,reforges:nr,sanctifications:ns,materials:{souls:nr*50,bountiesPerAct:nr*5,crucibles:ns},mystic:info.mystic,mysticFrom:info.mysticFrom,mysticTo:info.mysticTo,nodes:visited};
   const key=`${result.seed}:${nr}:${ns}`;
   if(cost>=(seen.get(key)??Infinity))continue;
   seen.set(key,cost);
   heap.push({seed:result.seed,cost,r:nr,s:ns,path,steps:[...x.steps,result]});
  }
 }
 return {found:false,nodes:visited,reason:visited>=maxNodes?'Se alcanzó el límite computacional. Amplía el rango o cambia los pesos.':'No apareció una receta que cumpla todos los afijos en los límites establecidos.'};
}
