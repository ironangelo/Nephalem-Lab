/* One checked mapping between visible tooltip families and numeric game attributes.
 * Fail closed when the picker cannot disambiguate a multi-attribute family.
 */
import {affixStem} from './universal-engine.js';
export function resolveObservationAttribute(engine,item,family,preferred=null){
 if(!item)throw Error('Choose the actual item before entering its attributes.');
 if(family==='Sockets')return null;
 const formulas=family==='Power'?(item.formulas||[]):
  engine.candidateAffixes(item).filter(a=>affixStem(a.label)===family).flatMap(a=>a.formulas||[]);
 const ids=[...new Set(formulas.map(([id])=>Number(id)))].filter(Number.isInteger);
 if(preferred!==null&&preferred!==''&&ids.includes(Number(preferred)))return Number(preferred);
 if(ids.length===1)return ids[0];
 if(!ids.length)throw Error(`No numerical attribute found for "${family}" on ${item.name}.`);
 throw Error(`"${family}" has several different numeric attributes. This form cannot safely distinguish them yet; choose a simpler item.`);
}
export function requiredOperationQuality(op){
 return {C:'normal',S:'sanctified',P:'crafted'}[op]||null;
}
export function assertObservationQuality(op,quality){
 const required=requiredOperationQuality(op);
 if(required&&quality!==required)throw Error(`${op} must be recorded as ${required}, not ${quality}.`);
 if(!['normal','ancient','primal','sanctified','crafted'].includes(quality))throw Error('Unknown item quality.');
}
