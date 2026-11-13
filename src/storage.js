const KEY='nephalem-lab-v1';
export const SAMPLE_156={quality:'normal',power:156,main:423,critical:4.5,primary:'Haste',primaryValue:5,secondary:'FireResist',secondaryValue:142,op:'R'};
export const SAMPLE_165={quality:'normal',power:165,main:433,critical:4.5,primary:'Vit',primaryValue:425,secondary:'LightningResist',secondaryValue:144,op:'R'};
export const DEFAULT={lang:'en',mode:'seasonal',hero:'Wizard',observations:[],candidates:[],seed:null,goal:'double-crit-cdr',path:null,history:[],solverStatus:'idle'};
export function getSaved(){try{const o=JSON.parse(localStorage.getItem(KEY));if(o&&o.version===1){return {...DEFAULT,...o,lang:['en','es','pt'].includes(o.lang)?o.lang:'en',solverStatus:'idle'};}}catch(e){}return {...DEFAULT};}
export function save(state){try{localStorage.setItem(KEY,JSON.stringify({...state,version:1,path:null,solverStatus:'idle'}));}catch(e){console.warn('Local storage disabled',e);}}
export function exportRecord(state){return JSON.stringify({app:'Nephalem Lab',version:1,date:new Date().toISOString(),language:state.lang,mode:state.mode,hero:state.hero,observations:state.observations,candidates:state.candidates,seed:state.seed,goal:state.goal,history:state.history},null,2);}
