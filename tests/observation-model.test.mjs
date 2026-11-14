import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveObservationAttribute,requiredOperationQuality,assertObservationQuality} from '../src/observation-model.js';
const item={name:"Firebird's Breast",formulas:[[700,'x']],id:4};
const engine={candidateAffixes(){return [
 {label:'Int 70 Primary',formulas:[[1210,'x']]},
 {label:'Life 70 Primary',formulas:[[135,'x']]},
 {label:'Experience 70 Secondary',formulas:[[77,'x']]},
 {label:'Sockets 70 Primary',formulas:[]},
 {label:'MinMaxDam 70 Primary',formulas:[[214,'x'],[212,'x']]}
];}};
test('changing initial default power to another family cannot keep a stale attribute ID',()=>{
 assert.equal(resolveObservationAttribute(engine,item,'Power',700),700);
 assert.equal(resolveObservationAttribute(engine,item,'Int',700),1210);
 assert.equal(resolveObservationAttribute(engine,item,'Life',700),135);
 assert.equal(resolveObservationAttribute(engine,item,'Experience'),77);
 assert.equal(resolveObservationAttribute(engine,item,'Sockets'),null);
});
test('ambiguous and unknown family attributes fail closed',()=>{
 assert.throws(()=>resolveObservationAttribute(engine,item,'MinMaxDam'),/several different numeric attributes/);
 assert.throws(()=>resolveObservationAttribute(engine,item,'Unrecognized'),/No numerical attribute/);
});
test('quality is constrained for conversions, sanctifications and primal improvements',()=>{
 assert.equal(requiredOperationQuality('C'),'normal');
 assert.equal(requiredOperationQuality('S'),'sanctified');
 assert.equal(requiredOperationQuality('P'),'crafted');
 assert.equal(requiredOperationQuality('R'),null);
 assert.doesNotThrow(()=>assertObservationQuality('P','crafted'));
 assert.throws(()=>assertObservationQuality('P','primal'),/must be recorded as crafted/);
 assert.throws(()=>assertObservationQuality('S','normal'),/must be recorded as sanctified/);
 assert.throws(()=>assertObservationQuality('C','primal'),/must be recorded as normal/);
});
