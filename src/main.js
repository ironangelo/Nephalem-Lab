import {affixes,freePrimary,secondary,byKey} from './coe-data.js';
import {makeValues,matchObservation,constraintsFromObservation,applyOperation} from './engine.js';
import {getSaved,save,exportRecord,SAMPLE_156,SAMPLE_165} from './storage.js';
import {loadManifest,seasonRules} from './season.js';
import {tr,statName,itemName,numLocale} from './i18n.js';
const $=s=>document.querySelector(s);
const state=getSaved();
let manifest, rules, worker=null, planner=null,route=null,checks=[],mismatchAt=-1;
const t=k=>tr(state.lang,k);
const fmt=(value,max=1)=>Number(value).toLocaleString(numLocale(state.lang),{maximumFractionDigits:max});
const escape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const isPct=k=>byKey[k]?.divisor===100||byKey[k]?.divisor===200;
const visualValue=(key,value)=>key==='Sockets'?'1':key==='MinMaxDam'?Array.isArray(value)?value.map(v=>fmt(v,0)).join(' – '):String(value):isPct(key)?`${fmt(value*100,1)}%`:fmt(value,0);
const statLine=s=>`${statName(state.lang,s.key)}: ${visualValue(s.key,s.value)}`;
const pill=(quality)=>`<span class="step-quality ${quality==='primal'?'primal':''}">${escape(t(quality))}</span>`;
function persist(){save(state)}
function htmlTranslations(){document.documentElement.lang=state.lang;document.querySelectorAll('[data-t]').forEach(el=>{const key=el.dataset.t;if(el.closest('select')&&el.tagName!=='OPTION')return;el.textContent=t(key);});$('#item').options[0].textContent=itemName(state.lang,'Convention of Elements');$('#language').value=state.lang;$('#mode').value=state.mode;$('#hero').value=state.hero;$('#goal').value=state.goal;updateAffixNames();}
function updateAffixNames(){const p=$('#primary-affix'),s=$('#secondary-affix'),oldP=p.value||'Haste',oldS=s.value||'FireResist';
 p.replaceChildren(...freePrimary.map(key=>new Option(statName(state.lang,key),key)));
 s.replaceChildren(...secondary.map(key=>new Option(statName(state.lang,key),key)));
 p.value=freePrimary.includes(oldP)?oldP:'Haste';s.value=secondary.includes(oldS)?oldS:'FireResist';}
function refreshRules(){rules=seasonRules(manifest,{mode:state.mode});const box=$('#season-alert');const pillEl=$('#rules-pill');pillEl.textContent=rules.mode==='nonseasonal'?t('nonseasonal'):rules.verified?`${t('seasonVerified')} · S${rules.season}`:`${t('seasonal')} · S${rules.season}`;
 pillEl.classList.toggle('unverified',!rules.verified);box.classList.toggle('hidden',rules.verified);box.textContent=rules.reason==='nonseasonal'?t('noS'):t('seasonWarn');
 $('#s-cost-wrap').classList.toggle('hidden',!rules.sanctify);$('#max-s-wrap').classList.toggle('hidden',!rules.sanctify);
 if(!rules.sanctify)$('#max-s').value='0';else if($('#max-s').value==='0')$('#max-s').value='24';
 $('#find-route').disabled=state.seed===null;
}
function renderObs(){const container=$('#observations');if(!state.observations.length){container.innerHTML=`<p class="muted">${escape(t('noneYet'))}</p>`;return;}
 container.innerHTML=state.observations.map((o,i)=>`<div class="obs-row"><div><strong><span class="obs-index">${i+1}</span>${escape(o.op)} · ${pill(o.quality)} · ${fmt(o.power,0)}%</strong><p>${fmt(o.main,0)} ${escape(statName(state.lang,'Int'))} · ${fmt(o.critical)}% CHC · ${escape(statName(state.lang,o.primary))} ${fmt(o.primaryValue)} · ${escape(statName(state.lang,o.secondary))} ${fmt(o.secondaryValue)}</p></div><button class="remove-btn" data-index="${i}" aria-label="${escape(t('remove'))}">×</button></div>`).join('');
 container.querySelectorAll('[data-index]').forEach(btn=>btn.addEventListener('click',()=>{state.observations.splice(Number(btn.dataset.index),1);forgetComputed();renderObs();}));}
function showSeed(){const el=$('#solver-result');
 if(state.seed!==null){el.innerHTML=`<div class="status-label">${escape(t('unique'))}</div><div class="seed-number">${fmt(state.seed,0)}</div><div class="helper">0x${state.seed.toString(16).toUpperCase().padStart(8,'0')} · ${escape(t('ready'))}</div>`;$('#find-route').disabled=false;return;}
 if(state.candidates?.length>1){el.innerHTML=`<div class="status-label">${escape(t('compatible'))}</div><div class="seed-number">${fmt(state.candidates.length,0)}</div><p class="helper">${escape(t('nextNeed'))}</p>`;return;}
 if(state.observations.length)el.innerHTML=`<p class="helper">${escape(t('firstNeed'))}</p>`;else el.innerHTML=`<p class="helper">${escape(t('needSeed'))}</p>`;
 $('#find-route').disabled=true;
}
function forgetComputed(){state.seed=null;state.candidates=[];state.path=null;route=null;checks=[];mismatchAt=-1;$('#plan-result').replaceChildren();showSeed();persist();}
function setSeed(seed){state.seed=seed;state.candidates=[seed];persist();showSeed();}
function obsFromForm(form){const v=Object.fromEntries(new FormData(form));return {quality:v.quality,op:v.op,power:Number(v.power),main:Number(v.main),critical:Number(v.critical),primary:v.primary,primaryValue:Number(v.primaryValue),secondary:v.secondary,secondaryValue:Number(v.secondaryValue)};}
function matchFirst(seed,o){const keys=['Int','CriticalChance','Sockets',o.primary,o.secondary];const v=makeValues(seed,keys,o.quality);return matchObservation({...v,quality:o.quality,keys},o);}
function resolveCandidates(seeds){const observations=state.observations;
 let current=[];for(const s of seeds){let seed=s;if(!matchFirst(seed,observations[0]))continue;
 let matches=true;for(let i=1;i<observations.length;i++){const next=applyOperation(seed,observations[i].op);if(!matchObservation(next,observations[i])){matches=false;break;}seed=next.seed;}
 if(matches)current.push(seed);}
 const dedup=[...new Set(current)];state.candidates=dedup;state.seed=dedup.length===1?dedup[0]:null;
 persist();showSeed();if(dedup.length===0){$('#solver-result').innerHTML=`<p class="helper">${escape(t('none'))}</p>`;}else if(dedup.length>1){$('#solver-result').innerHTML=`<div class="status-label">${escape(t('multiple'))}</div><div class="seed-number">${fmt(dedup.length,0)}</div><p class="helper">${escape(t('nextNeed'))}</p>`;}
}
function setSolving(busy){$('#solve').disabled=busy;$('#cancel').classList.toggle('hidden',!busy);$('#progress').classList.toggle('hidden',!busy);}
async function solve(){if(!state.observations.length){$('#solver-result').textContent=t('firstNeed');return;}
 if(worker)worker.terminate();const original=state.observations[0];let constraints;
 try{constraints=constraintsFromObservation(original);}catch(e){$('#solver-result').textContent=e.message;return;}
 setSolving(true);$('#progress-bar').value=0;$('#progress-label').textContent='0%';
 worker=new Worker(new URL('./seed-worker.js',import.meta.url),{type:'module'});
 worker.onmessage=({data})=>{
  if(data.type==='progress'){const pct=100*data.checked/data.total;$('#progress-bar').value=pct;$('#progress-label').textContent=`${pct.toFixed(1)}% · ${fmt(data.found,0)}`;}
  if(data.type==='complete'){setSolving(false);resolveCandidates(data.seeds);worker.terminate();worker=null;}
  if(data.type==='error'){setSolving(false);$('#solver-result').textContent=data.message;worker.terminate();worker=null;}
 };
 worker.onerror=e=>{setSolving(false);$('#solver-result').textContent=e.message||'Worker error';worker.terminate();worker=null;};
 worker.postMessage({type:'solve',constraints});
}
function renderRoute(){const el=$('#plan-result');if(!route?.found){el.textContent=route?.reason||t('notFound');return;}
 const mats=route.materials;
 el.innerHTML=`<div class="route-summary"><span class="status-label">${escape(t('route'))}</span><span class="path">${escape(route.path)}</span></div>
 <div class="cost-metrics"><span class="metric"><strong>${fmt(mats.souls,0)}</strong><small>${escape(t('souls'))}</small></span><span class="metric"><strong>${fmt(mats.bountiesPerAct,0)}</strong><small>${escape(t('bounties'))}</small></span>${rules.sanctify?`<span class="metric"><strong>${fmt(mats.crucibles,0)}</strong><small>${escape(t('crucibles'))}</small></span>`:''}</div>
 <p class="helper">${escape(t('mystic'))}: <strong>${escape(route.mysticFrom?`${statName(state.lang,route.mysticFrom)} → ${statName(state.lang,route.mysticTo)}`:'—')}</strong></p>
 <h3 style="margin-top:22px">${escape(t('steps'))}</h3><p class="helper">${escape(t('verify'))}</p>
 <div class="steps">${route.steps.map((r,i)=>`<article class="step-row" data-step="${i}" id="step-${i}"><header><div class="step-num">${i+1}. ${r.op==='S'?escape(t('sanctify')):escape(t('reforge'))}</div>${pill(r.quality)}</header><p class="details"><strong>${r.power}%</strong> · ${r.stats.map(statLine).map(escape).join(' · ')} · ${escape(statName(state.lang,'Sockets'))}</p><div class="seed-line">${escape(t('from'))}: ${r.from} · ${escape(t('to'))}: ${r.seed}</div><label><input type="checkbox" data-verify="${i}" ${checks[i]?'checked':''} ${mismatchAt>=0&&i>=mismatchAt?'disabled':''}> <span>${escape(t('check'))}</span></label><button type="button" class="mismatch" data-bad="${i}" ${mismatchAt>=0?'disabled':''}>${escape(t('stop'))}</button></article>`).join('')}</div><div id="stop-banner"></div>`;
 el.querySelectorAll('[data-verify]').forEach(c=>c.onchange=()=>{const i=Number(c.dataset.verify);checks[i]=c.checked; if(c.checked){for(let n=0;n<i;n++)if(!checks[n]){checks[i]=false;c.checked=false;break;}}});
 el.querySelectorAll('[data-bad]').forEach(b=>b.onclick=()=>{mismatchAt=Number(b.dataset.bad);el.querySelectorAll('.step-row').forEach((x,i)=>{if(i>=mismatchAt)x.classList.add('blocked')});el.querySelectorAll('[data-verify]').forEach(x=>x.disabled=true);el.querySelectorAll('[data-bad]').forEach(x=>x.disabled=true);$('#stop-banner').innerHTML=`<p class="stop-alert">${escape(t('stop'))}</p>`;});
}
function doPlan(){if(state.seed===null){$('#plan-result').textContent=t('needSeed');return;}
 if(planner)planner.terminate();$('#find-route').disabled=true;$('#plan-result').textContent=t('planning');
 const opts={goal:state.goal,maxR:Number($('#max-r').value)||5,maxS:rules.sanctify?(Number($('#max-s').value)||0):0,maxSteps:32,reforgeWeight:Number($('#cost-r').value)||9,sanctifyWeight:Number($('#cost-s').value)||1,allowedOperations:rules.allowed,maxNodes:175000};
 planner=new Worker(new URL('./planner-worker.js',import.meta.url),{type:'module'});
 planner.onmessage=({data})=>{if(data.type==='planned'){route=data.result;checks=[];mismatchAt=-1;renderRoute();}else $('#plan-result').textContent=data.message||'Planner error';planner.terminate();planner=null;$('#find-route').disabled=state.seed===null;};
 planner.onerror=e=>{planner.terminate();planner=null;$('#find-route').disabled=false;$('#plan-result').textContent=e.message||'Worker error';};
 planner.postMessage({type:'plan',seed:state.seed,options:opts});}
function updateLanguage(){htmlTranslations();refreshRules();renderObs();showSeed();if(route)renderRoute();}
function downloadJSON(){const blob=new Blob([exportRecord(state)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`Nephalem-Lab-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),6000);}
async function init(){manifest=await loadManifest();
 $('#language').addEventListener('change',e=>{state.lang=e.target.value;persist();updateLanguage();});
 $('#mode').addEventListener('change',e=>{state.mode=e.target.value;route=null;checks=[];persist();refreshRules();$('#plan-result').replaceChildren();});
 $('#hero').addEventListener('change',e=>{state.hero=e.target.value;forgetComputed();renderObs();});
 $('#goal').addEventListener('change',e=>{state.goal=e.target.value;persist();});
 $('#obs-form').addEventListener('submit',e=>{e.preventDefault();const o=obsFromForm(e.currentTarget);if(state.observations.length===0&&o.quality!=='normal'){alert(t('firstNeed'));return;}state.observations.push(o);forgetComputed();renderObs();});
 $('#load-demo').onclick=()=>{state.hero='Wizard';state.mode='seasonal';state.observations=[SAMPLE_156,SAMPLE_165].map(x=>({...x}));forgetComputed();$('#hero').value='Wizard';$('#mode').value='seasonal';refreshRules();renderObs();$('#solver-result').textContent=t('snapshot')+' · '+t('demoHint');};
 $('#clear').onclick=()=>{state.observations=[];forgetComputed();renderObs();};
 $('#solve').onclick=solve;
 $('#cancel').onclick=()=>{worker?.terminate();worker=null;setSolving(false);};
 $('#apply-seed').onclick=()=>{const n=Number($('#manual-seed').value.trim());if(!Number.isSafeInteger(n)||n<0||n>4294967295){alert(t('invalid'));return;}setSeed(n);};
 $('#find-route').onclick=doPlan;$('#export').onclick=downloadJSON;
 updateLanguage();
 if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
}
init().catch(e=>{$('#solver-result').textContent=`App startup error: ${e.message}`;console.error(e)});
