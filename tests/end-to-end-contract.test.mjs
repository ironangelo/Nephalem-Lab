import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {advanceCandidates} from '../src/candidate-analysis.js';
const ui=readFileSync(new URL('../src/universal-ui.js',import.meta.url),'utf8');
test('conversion persists both current piece and original target',()=>{
 for(const t of ['itemId:rootItemId,currentItemId:item.id','targetItemId:target()?.id','preferences:capturePreferences()',"filterWorker.postMessage({type:'filter'",'Original candidates are preserved','restorePreferences(stored.preferences)'])assert.ok(ui.includes(t),t);
 assert.ok(!ui.includes('Set conversion changes the item. Export your candidates'));
});
test('conversion filters and advances numeric seed without rescanning',()=>{
 const source={id:1,name:'Chest'},target={id:2,name:'Gloves'};
 const engine={item(q){return q===2?target:source;},apply(item,seed,op){
  assert.equal(op,'C');
  return {quality:'normal',itemId:seed===5?2:1,seed:seed+101,affixes:[{stem:'Int',kind:0}],lines:[{attr:1210,stem:'Int',value:seed===5?416:300}]};
 }};
 assert.deepEqual(advanceCandidates(engine,source,[3,5,7],'C',{quality:'normal',itemId:2,lines:[{attr:1210,stem:'Int',value:416}]}),[106]);
});
test('candidate diagnostics and preferences have safe UI support',()=>{
 for(const t of ['Select actual set piece from the game','capturePreferences()','restorePreferences(input.preferences)','No shared route search was attempted','assertObservationQuality(o.op,o.quality)'])assert.ok(ui.includes(t),t);
});
