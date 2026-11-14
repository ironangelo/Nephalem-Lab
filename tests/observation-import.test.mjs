import test from 'node:test';
import assert from 'node:assert/strict';
import {parseObservationText} from '../src/observation-import.js';
const families=['Int','Vit','LightningResist','Thorns','Skill_Wizard_Explosive Blast','Sockets'];
test('one-paste import of a full Firebird breastplate reforge',()=>{
 const text='Intelligence: 456\nVitality: 484\nLightning Resistance: 149\nThorns Damage: 5366\nExplosive Blast Damage: 13\nSockets: 3';
 assert.deepEqual(parseObservationText(text,families),[
 {family:'Int',value:456},{family:'Vit',value:484},{family:'LightningResist',value:149},
 {family:'Thorns',value:5366},{family:'Skill_Wizard_Explosive Blast',value:13},{family:'Sockets',value:3}]);
});
test('parser refuses unknown, invalid, duplicate and ambiguous user text',()=>{
 assert.throws(()=>parseObservationText('Wrong Affix: 111',families),/Unknown attribute/);
 assert.throws(()=>parseObservationText('Intelligence: 456\nIntelligence: 490',families),/Duplicate/);
 assert.throws(()=>parseObservationText('Intelligence',families),/Could not read/);
});
