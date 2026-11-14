import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {archiveAndClearExperiment,restoreArchivedExperiment} from '../src/experiment-reset.js';
const path='project:Wizard:Firebird',archive='archive:Wizard:Firebird',old='preundo:Wizard:Firebird';
class Storage{
 constructor(obj={}){this.values=new Map(Object.entries(obj));}
 getItem(k){return this.values.get(k)??null;}
 setItem(k,v){this.values.set(k,String(v));}
 removeItem(k){this.values.delete(k);}
}
function snapshot(count=36435,obs=1){return JSON.stringify({
 schema:3,hero:2,itemId:123,observations:Array.from({length:obs},(_,i)=>({op:'R',index:i})),
 candidates:Array.from({length:count},(_,i)=>i+1),
 targetItemId:123,goals:['Int','Vit'],currentItemId:123
});}
const args=(c=36435,o=1)=>({projectKey:path,archiveKey:archive,draftKey:'draft',
 legacyKey:'legacy',hero:2,itemId:123,expectedCandidates:c,expectedObservations:o});
test('safe reset archives and verifies all 36,435 candidates before clearing the current experiment',()=>{
 const initial=snapshot();
 const storage=new Storage({[path]:initial,draft:'typed-data',legacy:'legacy-values'});
 const result=archiveAndClearExperiment(storage,args());
 assert.deepEqual(result,{candidates:36435,observations:1});
 assert.equal(storage.getItem(path),null);
 assert.equal(storage.getItem('draft'),null);
 assert.equal(storage.getItem('legacy'),null);
 assert.equal(storage.getItem(archive),initial);
});
test('reset refuses to clear when saved candidate count does not match live app',()=>{
 const initial=snapshot(17);
 const storage=new Storage({[path]:initial});
 assert.throws(()=>archiveAndClearExperiment(storage,args()),/does not match/);
 assert.equal(storage.getItem(path),initial);
 assert.equal(storage.getItem(archive),null);
});
test('reset refuses to clear any seeds if archive write fails',()=>{
 const initial=snapshot(20,1),storage=new Storage({[path]:initial});
 storage.setItem=(key,val)=>{if(key===archive)throw Error('Quota exceeded');storage.values.set(key,String(val));};
 assert.throws(()=>archiveAndClearExperiment(storage,args(20,1)),/Quota exceeded/);
 assert.equal(storage.getItem(path),initial);
});
test('undo restores original full seed list and first archives any newer project',()=>{
 const original=snapshot(36435,1),newer=snapshot(12,2);
 const storage=new Storage({[archive]:original,[path]:newer});
 const result=restoreArchivedExperiment(storage,{projectKey:path,archiveKey:archive,previousKey:old,hero:2,itemId:123});
 assert.deepEqual(result,{candidates:36435,observations:1});
 assert.equal(storage.getItem(path),original);
 assert.equal(storage.getItem(old),newer);
});
test('undo rejects mismatched item and leaves work untouched',()=>{
 const other=JSON.stringify({...JSON.parse(snapshot(10)),itemId:500}),current=snapshot(30);
 const storage=new Storage({[path]:current,[archive]:other});
 assert.throws(()=>restoreArchivedExperiment(storage,{projectKey:path,archiveKey:archive,previousKey:old,hero:2,itemId:123}),/invalid/);
 assert.equal(storage.getItem(path),current);
});
test('clear, reset and undo controls are present and correctly wired',()=>{
 const page=readFileSync(new URL('../universal.html',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/universal-ui.js',import.meta.url),'utf8');
 for(const id of ['clear-entry','new-experiment','undo-experiment'])assert.ok(page.includes('id="'+id+'"'));
 for(const hook of ['archiveAndClearExperiment(','restoreArchivedExperiment(','resetObservationFields(','startFreshExperiment(','undoFreshExperiment('])assert.ok(ui.includes(hook));
});
