/* The displayed number of sockets is structural tooltip information.
 * It is not a numerical random-roll formula. We record counts but never
 * use them as modular seed constraints.
 */
export function validSocketCount(value){
 const n=Number(value);
 return String(value).trim()!==''&&Number.isInteger(n)&&n>=1&&n<=3;
}
export const isSocketLine=line=>line?.stem==='Sockets';
export function parseSocketCount(value){
 if(!validSocketCount(value))throw Error('Socket count must be an integer from 1 to 3.');
 return {stem:'Sockets',attr:null,value:Number(value),structural:true};
}
