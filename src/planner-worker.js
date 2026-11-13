import {findRoute} from './planner.js';
self.onmessage=({data})=>{if(data?.type!=='plan')return;try{self.postMessage({type:'planned',result:findRoute(data.seed,data.options)});}catch(e){self.postMessage({type:'error',message:String(e?.message||e)});}};
