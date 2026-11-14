import fs from 'node:fs';
import {e,it} from './deathwish-weapon-inversion.mjs';
const {knownParent,result:target}=JSON.parse(fs.readFileSync('/tmp/deathwish-test-target.json','utf8'));
const rows=fs.readFileSync('/tmp/one-reforge-preimages.tsv','utf8').trim().split('\n').map(x=>x.split(',').map(Number));
let survivors=[];
for(const [parent,child]of rows){
 const r=e.reforge(it,parent);
 if(r.quality!=='normal'||r.seed!==child)continue;
 if(r.item===target.item&&r.affixes.map(x=>x.id).join(',')===target.affixes.map(x=>x.id).join(',')&&r.lines.length===target.lines.length&&
  r.lines.every((x,i)=>target.lines[i].attr===x.attr&&Math.abs(target.lines[i].value-x.value)<.0001)){
  survivors.push({parent,child,draws:r.draws});
 }
}
console.log('DEATHWISH_SYNTHETIC_PARENT_RECOVERY',JSON.stringify({numericChildCandidates:fs.readFileSync('/tmp/one-reforge-result-seeds.txt','utf8').trim().split('\n').length,preimageCandidateCount:rows.length,exactParentCount:survivors.length,knownParent,foundOriginal:survivors.some(x=>x.parent===knownParent),survivors}));
if(survivors.length!==1||survivors[0].parent!==knownParent)throw Error('One-Reforge algorithm failed to recover unique known Deathwish parent');
