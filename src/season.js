/* Seasonal abilities are data, not assumptions about future themes.
 * Fail closed when rules are unknown or manifest verification is stale.
 */
export const fallbackManifest={schema:1,currentSeason:40,verifiedOn:'2026-11-13',staleAfterDays:45,source:'https://news.blizzard.com/en-us/article/24301510/season-40-lights-calling-preview',seasons:{'40':{name:"Light's Calling",sanctify:true}}};
export async function loadManifest(){
 try{const r=await fetch('./config/seasons.json',{cache:'no-store'});if(!r.ok)throw Error(`${r.status}`);const x=await r.json();if(x.schema!==1||!Number.isInteger(x.currentSeason)||!/^\d{4}-\d\d-\d\d$/.test(x.verifiedOn))throw Error('invalid manifest');return x;}catch(e){return fallbackManifest;}
}
export function seasonRules(manifest,{mode='seasonal',season=null,now=new Date()}={}){
 const number=season===null?manifest.currentSeason:Number(season);
 const ageDays=Math.max(0,(now.getTime()-new Date(`${manifest.verifiedOn}T00:00:00Z`).getTime())/86400000);
 const stale=!(ageDays<=(manifest.staleAfterDays??30));
 if(mode==='nonseasonal')return {mode:'nonseasonal',season:null,allowed:['R'],sanctify:false,verified:true,stale:false,reason:'nonseasonal'};
 const entry=manifest.seasons?.[String(number)];
 const verified=!!entry&&!stale&&number===manifest.currentSeason;
 return {mode:'seasonal',season:number,allowed:verified&&entry.sanctify?['R','S']:['R'],sanctify:verified&&entry.sanctify,verified,stale,reason:stale?'stale':!entry?'unknown-season':number!==manifest.currentSeason?'not-current':'verified',source:entry?.source||manifest.source};
}
