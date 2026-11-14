import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseSocketCount,validSocketCount} from '../src/observation-fields.js';
import {matchesObservation} from '../src/candidate-analysis.js';
test('Firebird\'s Breast accepts the visible count of three sockets',()=>{
 assert.deepEqual(parseSocketCount('3'),{stem:'Sockets',attr:null,value:3,structural:true});
 for(const invalid of ['',0,4,'1.5','bad',null])assert.equal(validSocketCount(invalid),false);
 assert.throws(()=>parseSocketCount(4),/1 to 3/);
});
test('Socket observation verifies affix presence without pretending count is an RNG roll',()=>{
 const normal={quality:'normal',itemId:1,affixes:[{stem:'Sockets',socket:true}],lines:[{attr:1210,stem:'Int',value:416}]};
 const observation={quality:'normal',itemId:1,lines:[{stem:'Int',attr:1210,value:416},parseSocketCount('3')]};
 assert.ok(matchesObservation(normal,observation));
 assert.ok(!matchesObservation({...normal,affixes:[]},observation));
 assert.ok(!matchesObservation({...normal,quality:'ancient'},observation));
});
test('Headings 1 through 4 match their physical order (English, Spanish and Portuguese)',()=>{
 const html=readFileSync(new URL('../universal.html',import.meta.url),'utf8');
 const src=readFileSync(new URL('../src/universal-ui.js',import.meta.url),'utf8');
 const pos=['id="setup-title"','id="plan-title"','id="observe-title"','id="candidate-title"'].map(s=>html.indexOf(s));
 assert.ok(pos.every(i=>i>=0));assert.deepEqual(pos,[...pos].sort((a,b)=>a-b));
 for(const needle of ["plan:'2. Target and recipe'","observe:'3. Recover an existing item seed'","plan:'2. Objetivo y receta'","observe:'3. Recuperar la seed del objeto'","plan:'2. Objetivo e receita'","observe:'3. Recuperar semente do item'"]){
  assert.ok(src.includes(needle),needle);
 }
});
