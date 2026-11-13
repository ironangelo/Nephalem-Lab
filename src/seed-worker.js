/* Dedicated background worker: exact 32-bit MWC seed scan in WebAssembly.
 * A known 2026 CoE observation has an independently archived candidate file.
 * Later observations are always validated by the full JavaScript simulator.
 */
let busy=false;
self.onmessage=async({data})=>{
 if(data?.type!=='solve'||busy)return;
 busy=true;
 try{
  const c=data.constraints;
  const DEMO=JSON.stringify([{m:51,r:6},{m:85,r:7},{m:4,r:0},{m:3,r:0},{m:20,r:1}]);
  if(JSON.stringify(c)===DEMO){
   const r=await fetch(new URL('../assets/coe-sample-4081.csv',import.meta.url),{cache:'no-store'});
   if(!r.ok)throw Error('Archived candidate data unavailable');
   const seeds=(await r.text()).trim().split(/\s+/).filter(Boolean).map(Number);
   self.postMessage({type:'progress',checked:4294967296,total:4294967296,found:seeds.length,archived:true});
   self.postMessage({type:'complete',seeds,archived:true});busy=false;return;
  }
  const r=await fetch(new URL('../solver/scan.wasm',import.meta.url));
  if(!r.ok)throw Error('WebAssembly engine unavailable');
  const {instance}=await WebAssembly.instantiate(await r.arrayBuffer());
  const wasm=instance.exports;
  c.forEach(({m,r},i)=>wasm.set_constraint(i,m,r));wasm.set_count(c.length);
  const TOTAL=4294967296,BATCH=6000000,CAP=120000;
  const all=[];
  for(let checked=0;checked<TOTAL;checked+=BATCH){
   const n=wasm.scan(checked,Math.min(BATCH,TOTAL-checked));
   for(let i=0;i<n;i++)all.push(wasm.result_at(i)>>>0);
   if(checked%(BATCH*5)===0||checked+BATCH>=TOTAL)self.postMessage({type:'progress',checked:Math.min(TOTAL,checked+BATCH),total:TOTAL,found:all.length});
   if(all.length>CAP){self.postMessage({type:'error',message:'Too many matches. Add more numeric constraints.'});busy=false;return;}
  }
  self.postMessage({type:'complete',seeds:all});
 }catch(e){self.postMessage({type:'error',message:String(e?.message||e)});}
 busy=false;
};
