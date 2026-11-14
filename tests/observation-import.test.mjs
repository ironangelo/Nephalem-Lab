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
 assert.throws(()=>parseObservationText('Wrong Affix: 111',families),/Unrecognized attribute/);
 assert.throws(()=>parseObservationText('Intelligence: 456\nIntelligence: 490',families),/Duplicate/);
 assert.throws(()=>parseObservationText('Intelligence',families),/Could not read/);
});

test('recognizes real game-catalog Wizard skill labels without spaces',()=>{
 const actualCatalog=['Int','Vit','LightningResist','Thorns','Skill_Wizard_ExplosiveBlast','Sockets'];
 const values='Intelligence: 456\nVitality: 484\nLightning Resistance: 149\nThorns: 5366\nExplosive Blast: 13\nSockets: 3';
 const result=parseObservationText(values,actualCatalog);
 assert.equal(result.length,6);
 assert.deepEqual(result.find(r=>r.family==='Skill_Wizard_ExplosiveBlast'),{family:'Skill_Wizard_ExplosiveBlast',value:13});
});
test('recognizes shortened Explosive and partially named Wizard skill families',()=>{
 for(const available of [['Skill_Wizard_ExplosiveBlast'],['Skill_Wizard_Explosive Blast'],['Skill_Wizard_Explosive']]){
  const result=parseObservationText('Explosive: 13',available);
  assert.equal(result[0].family,available[0]);
  assert.equal(result[0].value,13);
 }
});
test('does not silently guess a skill when there are several matching family names',()=>{
 assert.throws(()=>parseObservationText('Explosive: 13',['Skill_Wizard_ExplosiveBlast','Skill_Wizard_ExplosiveWave']),/Several Explosive Blast skills/);
});
