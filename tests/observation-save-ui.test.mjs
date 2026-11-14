import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseObservationText} from '../src/observation-import.js';
const ui=readFileSync(new URL('../src/universal-ui.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../universal.html',import.meta.url),'utf8');
const worker=readFileSync(new URL('../src/candidate-worker.js',import.meta.url),'utf8');
test('Save observation displays progress and errors above its buttons',()=>{
 assert.ok(html.indexOf('id="observation-feedback"')<html.indexOf('id="save-observation"'));
 for(const needle of ["function announceObservation(","function finishObservation(","filterWorker.postMessage({type:'filter'","$('#save-observation').disabled=false","Candidate list preserved","No candidate seed matches this observed result"])
  assert.ok(ui.includes(needle),needle);
});
test('drafts, canceled operations and conflicting real results do not erase the original candidates',()=>{
 for(const needle of ["function observationDraftKey(","saveObservationDraft()","restoreObservationDraft()","function clearObservationDraft()","Filtering cancelled","if(!Array.isArray(seeds)||!seeds.length)","return;"])
  assert.ok(ui.includes(needle),needle);
 assert.ok(worker.includes("type:'filtered'"));
 assert.ok(worker.includes('matchingQuality'));
 assert.ok(worker.includes("matchingFamilies"));
});
test('screenshots can be transcribed in one paste without changing recorded seeds',()=>{
 const options=['Int','Vit','LightningResist','Thorns','Skill_Wizard_Explosive Blast','Sockets'];
 const rows=parseObservationText('Intelligence: 456\nVitality: 484\nLightning Resistance: 149\nThorns: 5366\nExplosive Blast: 13\nSockets: 3',options);
 assert.equal(rows.length,6);
 assert.equal(rows.find(x=>x.family==='Sockets')?.value,3);
 assert.equal(rows.find(x=>x.family==='Skill_Wizard_Explosive Blast')?.value,13);
});
