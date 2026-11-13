/* Nephalem Lab WebAssembly seed recovery.
 * Run up to 32 numerical affix-order hypotheses together in one 32-bit pass.
 * Do not assume a numerical match is a verified item: UI replays it in JS. */
let busy=false;
self.onmessage=async({data})=>{
 if(data?.type!=='solve'||busy)return;
 busy=true;
 try{
  const hypotheses=data.hypotheses??[data.constraints];
  if(!Array.isArray(hypotheses)||!hypotheses.length||hypotheses.length>32)
   throw Error('The numerical solver supports 1–32 interpretations per scan.');
  if(hypotheses.some(c=>!Array.isArray(c)||!c.length||c.length>32||
   c.some(x=>!Number.isInteger(x.m)||x.m<1||!Number.isInteger(x.r)||x.r<0||x.r>=x.m)))
   throw Error('Invalid numerical constraints. Review the entered stats.');
  const DEMO=JSON.stringify([{m:51,r:6},{m:85,r:7},{m:4,r:0},{m:3,r:0},{m:20,r:1}]);
  if(!data.armor&&hypotheses.length===1&&JSON.stringify(hypotheses[0])===DEMO){
   const resp=await fetch(new URL('../assets/coe-sample-4081.csv',import.meta.url));
   if(!resp.ok)throw Error('Archived CoE candidate data unavailable.');
   const seeds=(await resp.text()).trim().split(/\s+/).filter(Boolean).map(Number);
   self.postMessage({type:'complete',seeds,archived:true});
   return;
  }
  const resp=await fetch(new URL('../solver/scan.wasm',import.meta.url),{cache:'no-store'});
  if(!resp.ok)throw Error('WebAssembly seed solver unavailable.');
  const {instance}=await WebAssembly.instantiate(await resp.arrayBuffer());
  const w=instance.exports;
  if(typeof w.scan_multi!=='function')throw Error('Outdated solver: install the latest Nephalem Lab build.');
  w.set_pre_steps(data.armor?2:1);
  w.set_hyp_count(hypotheses.length);
  hypotheses.forEach((list,h)=>{
   w.set_hyp_length(h,list.length);
   list.forEach(({m,r},i)=>w.set_hyp_constraint(h,i,m,r));
  });
  const total=4294967296,batch=6000000,cap=120000,seeds=[];
  for(let checked=0;checked<total;checked+=batch){
   const count=Math.min(batch,total-checked);
   const n=w.scan_multi(checked,count);
   if(w.was_overflow())throw Error('Too many seed matches in a batch. More observations are needed.');
   for(let i=0;i<n;i++)seeds.push(w.result_at(i)>>>0);
   if(seeds.length>cap)throw Error('Too many candidates. More numeric observations are required.');
   if(checked%(batch*5)===0||checked+count===total)
    self.postMessage({type:'progress',checked:checked+count,total,found:seeds.length,hypotheses:hypotheses.length});
  }
  self.postMessage({type:'complete',seeds});
 }catch(e){self.postMessage({type:'error',message:String(e?.message||e)});}
 finally{busy=false;}
};
