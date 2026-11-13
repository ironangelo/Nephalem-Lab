import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {step} from '../src/universal-engine.js';
const wasm=readFileSync(new URL('../solver/scan.wasm',import.meta.url));
function modsFor(seed,armor){
 let x=step((666n<<32n)|BigInt(seed));
 if(armor)x=step(x);
 x=(666n<<32n)|(x&0xffffffffn);
 return [95,51,20,101,17,19].map(m=>{x=step(x);return {m,r:Number(x&0xffffffffn)%m};});
}
test('WASM scans 12 alternate numerical interpretations for armor',async()=>{
 const {instance}=await WebAssembly.instantiate(wasm),w=instance.exports,seed=54321;
 const c=modsFor(seed,true);
 w.set_pre_steps(2);w.set_hyp_count(12);
 for(let h=0;h<12;h++){
  w.set_hyp_length(h,c.length);
  c.forEach(({m,r},i)=>w.set_hyp_constraint(h,i,m,h===9?r:(r+h+1)%m));
 }
 const n=w.scan_multi(0,100000);
 assert.ok(Array.from({length:n},(_,i)=>w.result_at(i)).includes(seed));
 assert.equal(w.was_overflow(),0);
});
test('WASM scans non-armor and compatibility method',async()=>{
 const {instance}=await WebAssembly.instantiate(wasm),w=instance.exports,seed=67890,c=modsFor(seed,false);
 w.set_pre_steps(1);w.set_count(c.length);
 c.forEach(({m,r},i)=>w.set_constraint(i,m,r));
 const n=w.scan(0,100000);
 assert.ok(Array.from({length:n},(_,i)=>w.result_at(i)).includes(seed));
});
test('WASM searches near the end of the complete uint32 seed range',async()=>{
 const {instance}=await WebAssembly.instantiate(wasm),w=instance.exports,seed=4294967000,c=modsFor(seed,true);
 w.set_pre_steps(2);w.set_hyp_count(1);w.set_hyp_length(0,c.length);
 c.forEach(({m,r},i)=>w.set_hyp_constraint(0,i,m,r));
 const n=w.scan_multi(4294966000,1296);
 assert.ok(Array.from({length:n},(_,i)=>w.result_at(i)).includes(seed));
});
