import {UniversalEngine,loadGameData,niceStem} from './universal-engine.js';
import {observationAffixFamilies,symbolicFormula} from './universal-recovery.js';
import {parseObservationText} from './observation-import.js';
import {resolveObservationAttribute} from './observation-model.js';
import {matchesObservation} from './candidate-analysis.js';
const $=s=>document.querySelector(s);
let data,engine,drop=null,reforge=null,seed=null,recoverWorker=null,plannerWorker=null,pendingSeeds=null;
const status=(id,text,kind='')=>{
 const el=$(id);el.textContent=text;el.className='status'+(kind?' '+kind:'');
};
const numeric=id=>Number($(id).value);
const unique=x=>[...new Set(x)];
const allGoals=()=>[...$('#goals').selectedOptions].map(x=>x.value);
const item=()=>engine?.item($('#item').value);
const target=()=>engine?.item($('#target-item').value);
function allowedFamilies(it){return observationAffixFamilies(engine,it)}
function observe(text,quality='normal',it=item()){
 if(!it)throw Error('Objeto no encontrado en la base de datos.');
 const families=allowedFamilies(it);
 const extra=[];
 const stripped=String(text).split(/\n/).filter(line=>{
  const m=line.match(/^\s*([\w-]+)\s*[:=]\s*\+?(\d+)\s*[-–]\s*(\d+)\s*$/);
  if(!m)return true;
  const family=m[1],lo=Number(m[2]),hi=Number(m[3]);
  if(hi<lo)throw Error('Rango de daño invertido en '+family);
  const first=engine.candidateAffixes(it).find(a=>
   a.label===family||a.label.startsWith(family+' '));
  if(!first||first.formulas.length!==2)throw Error('No hay un grupo de dos tiradas numéricas para '+family);
  const affix=engine.affixes[engine.variant(engine.idIndex.get(first.id),quality==='ancient'?2:1)];
  extra.push({stem:family,attr:affix.formulas[0][0],value:lo},
    {stem:family,attr:affix.formulas[1][0],value:hi-lo});
  return false;
 }).join('\n');
 const offered=[...families];
 if(it.formulas?.length)offered.push('Power');
 const parsed=stripped.trim()?parseObservationText(stripped,offered):[];
 const fixedPower=it.formulas.map(([attr,formula])=>{
  const fx=symbolicFormula(formula);
  return fx?.lo===null&&fx.a===0?{stem:'Power',attr,value:fx.c}:null;
 });
 const allPowersFixed=it.formulas.length>0&&fixedPower.every(Boolean);
 if(allPowersFixed){
  const supplied=parsed.find(x=>x.family==='Power');
  if(supplied&&!fixedPower.some(x=>Math.abs(x.value-supplied.value)<0.0001))
   throw Error('El valor de poder legendario no coincide con los poderes fijos de este objeto.');
 }else if(it.formulas.length&&!parsed.some(x=>x.family==='Power'))
  throw Error('Ingresa Power: porcentaje del poder legendario (por ejemplo, Power: 253 en Deathwish).');
 if(parsed.filter(x=>x.family!=='Sockets'&&x.family!=='Power').length+extra.length<2)
  throw Error('Registra suficientes atributos numéricos visibles.');
 const lines=parsed.filter(x=>!allPowersFixed||x.family!=='Power').map(x=>({
   stem:x.family,attr:resolveObservationAttribute(engine,it,x.family),value:x.value
 }));
 return {itemId:it.id,quality,lines:[...lines,...extra,...(allPowersFixed?fixedPower:[])]};
}
function resetItem(){
 const it=item();if(!it)return;
 if(!target())$('#target-item').value=it.name;
 const wanted=target()||it;
 const families=allowedFamilies(wanted);
 const defaults=wanted.name==="Firebird's Down"?['Int','Vit','DR','Sockets']:
 wanted.name==='Obsidian Ring of the Zodiac'?['CooldownReduction','Haste','CriticalChance','ResourceCostReduction']:
 wanted.name==='Firebird\'s Breast'?['Int','Vit','Sockets','DR']:[];
 $('#goals').innerHTML=families.map(stem=>`<option value="${stem}" ${defaults.includes(stem)?'selected':''}>${niceStem(stem)}</option>`).join('');
 $('#want-resist').checked=wanted.name==="Firebird's Down";
 $('#allow-convert').checked=!!it.set_id;
 drop=null;reforge=null;seed=null;pendingSeeds=null;
 $('#recover').textContent='Reconstruir seed bidireccional';
 $('#plan-route').disabled=true;
 $('#recipe-steps').replaceChildren();
 $('#route-options').replaceChildren();
 status('#drop-status','Sin drop registrado.');
 status('#recovery-status','Esperando una Reforge real.');
 status('#recipe-status','Primero debemos recuperar una seed única.');
}
function saveDrop(){
 try{
  if(recoverWorker)throw Error('Hay una recuperación en curso.');
  drop=observe($('#drop-text').value);
  reforge=null;seed=null;pendingSeeds=null;
  $('#recover').textContent='Reconstruir seed bidireccional';
  $('#plan-route').disabled=true;
  const named=drop.lines.map(x=>x.stem+':'+x.value).join(' · ');
  status('#drop-status',`Drop de ${item().name} guardado: ${named}.\nPróximo paso: una Reforge real del MISMO objeto. El drop no se usa para inventar un seed de salida.`,'success');
  status('#recovery-status','Esperando el resultado de Reforge; aún no existe una seed confirmada.');
 }catch(err){status('#drop-status','No se guardó el drop: '+err.message,'error')}
}
function recover(){
 if(recoverWorker){status('#recovery-status','La recuperación ya está ejecutándose.');return;}
 try{
  if(!drop)throw Error('Primero registra el drop original.');
  const observed=observe($('#reforge-text').value,$('#reforge-quality').value);
  if(observed.itemId!==drop.itemId)throw Error('La Reforge debe ser sobre el mismo objeto.');
  if(!['normal','ancient'].includes(observed.quality))
   throw Error('Para recuperar una seed necesitamos una Reforge normal o Ancient con valores numéricos, no Primal.');
  if(pendingSeeds&&pendingSeeds.length){
   // Zodiac and some other items need TWO genuine Reforges. Do not run a
   // second 2^32 scan: replay one Reforge for each previously recovered seed.
   const matches=[];
   for(const former of pendingSeeds){
    const result=engine.reforge(item(),former);
    if(matchesObservation(result,observed))matches.push(result.seed);
   }
   const survivors=unique(matches);
   if(!survivors.length){
    status('#recovery-status','La siguiente Reforge ingresada no coincide con ninguna de las '+pendingSeeds.length+' seeds anteriores. Revisa la foto y sus atributos; conservamos todas las candidatas.','error');
    return;
   }
   seed=survivors.length===1?survivors[0]:null;
   pendingSeeds=seed===null?survivors:null;
   $('#plan-route').disabled=seed===null;
   if(seed===null){
    status('#recovery-status',survivors.length+' seeds compatibles después de esta Reforge. Todavía necesitamos otra observación. No se ha inventado ninguna seed.');
   }else{
    $('#recover').textContent='Seed recuperada';
    status('#recovery-status','SEED ÚNICA IDENTIFICADA ✅\nDespués de esta Reforge: '+seed+
     '\nLa reconstrucción previa dejó varias candidatas y la nueva operación real las redujo a una. Ahora podemos buscar recetas.','success');
   }
   return;
  }
  reforge=observed;
  $('#recover').disabled=true;
  status('#recovery-status','Invirtiendo las posibles seeds numéricas y las transiciones reales de Reforge (dos barridos completos de 32 bits)…');
  recoverWorker=new Worker(new URL('./reforge-recovery-worker.js',import.meta.url),{type:'module'});
  recoverWorker.onmessage=e=>{
   const r=e.data;
   if(r.type==='progress'){
    status('#recovery-status',r.message+' — '+(100*(r.checked||0)/(r.total||1)).toFixed(1)+'% · '+r.found+' candidatos.');
   }else if(r.type==='complete'){
    recoverWorker.terminate();recoverWorker=null;$('#recover').disabled=false;
    const uniqueCurr=unique(r.solutions.map(x=>x.current));
    seed=uniqueCurr.length===1?uniqueCurr[0]:null;
    pendingSeeds=seed===null?uniqueCurr:null;
    $('#plan-route').disabled=seed===null;
    if(seed!==null){
     status('#recovery-status','SEED ÚNICA IDENTIFICADA ✅\nOrigen inferido: '+r.solutions[0].parent+
      '\nEstado ACTUAL después de Reforge: '+seed+
      '\nCandidatas numéricas iniciales: '+r.postReforgeNumericCandidates+
      '. Solo una pareja reproduce exactamente la operación del Cubo.','success');
    }else if(pendingSeeds.length){
     $('#recover').textContent='Filtrar usando la siguiente Reforge';
     status('#recovery-status',pendingSeeds.length+' seeds todavía posibles. No hay un resultado único. Guarda esta Reforge, realiza una segunda R real si aceptas su costo, reemplaza el texto por los NUEVOS afijos y pulsa Filtrar. La app reproducirá el resultado para cada candidata, sin repetir el barrido completo.');
    }else{
     status('#recovery-status','Ninguna seed pudo explicar esta Reforge completa. No gastes recursos: revisa los atributos y la clase.','error');
    }
   }else if(r.type==='error'){
    recoverWorker.terminate();recoverWorker=null;$('#recover').disabled=false;seed=null;
    $('#plan-route').disabled=true;status('#recovery-status','Recuperación detenida: '+r.message,'error');
   }
  };
  recoverWorker.onerror=e=>{
   recoverWorker?.terminate();recoverWorker=null;$('#recover').disabled=false;seed=null;
   $('#plan-route').disabled=true;status('#recovery-status','Error de recuperación: '+e.message,'error');
  };
  recoverWorker.postMessage({type:'recover-reforge',gameData:data,hero:engine.hero,itemId:item().id,sourceObservation:drop,observation:reforge});
 }catch(err){status('#recovery-status','No se inició la recuperación: '+err.message,'error');}
}
function budgetOptions(){
 if(seed===null)throw Error('Falta una seed única recuperada.');
 const goals=allGoals();if(!goals.length)throw Error('Selecciona al menos un afijo objetivo.');
 const budget={
  souls:numeric('#budget-souls'),crucibles:numeric('#budget-crucibles'),
  deathBreaths:numeric('#budget-breaths'),actMaterialsEach:numeric('#budget-act')
 };
 if(Object.values(budget).some(x=>!Number.isInteger(x)||x<0))throw Error('Presupuesto inválido.');
 return {budget,goals,seed,hero:engine.hero,itemId:item().id,targetItemId:target().id,
  maxSteps:numeric('#budget-steps'),maxNodes:numeric('#budget-nodes'),
  allowMystic:$('#allow-mystic').checked,requireResistance:$('#want-resist').checked,
  allowConvert:$('#allow-convert').checked};
}
function makeElement(tag,cls='',text=''){
 const x=document.createElement(tag);if(cls)x.className=cls;x.textContent=text;return x;
}
function showRecipe(payload){
 const root=$('#recipe-steps');root.replaceChildren();
 const options=$('#route-options');options.replaceChildren();
 if(!payload.best){
  status('#recipe-status',`No encontramos Primal compatible dentro de este presupuesto. ${payload.visited} estados examinados${payload.truncated?' (límite alcanzado)':''}. No gastes recursos suponiendo que la ruta exista.`,'error');return;
 }
 const b=payload.best,c=b.materials;
 const confirmed=makeElement('div','status success',`Ruta calculada: ${b.path}\n${c.souls} Forgotten Souls · ${c.crucibles} Crucibles · ${c.deathBreaths} Death's Breaths · ${c.actMaterialsEach} materiales por acto · ${c.steps} pasos.\nMystic final: ${b.goal.mystic?b.goal.mystic.replace+' → '+b.goal.mystic.with:'ninguna'}. ${payload.truncated?'Búsqueda acotada; no demuestra mínimo absoluto.':''}\nCada paso es una predicción: detenerse si la Switch muestra algo distinto.`);
 options.appendChild(confirmed);
 status('#recipe-status',`Buscador: ${payload.visited} estados, ${payload.goalsFound} soluciones compatibles, ${payload.truncated?'límite alcanzado':'búsqueda dentro del presupuesto completada'}.`,'success');
 b.steps.forEach((step,i)=>{
  const article=makeElement('article','step');
  const label=makeElement('label','inline');
  const check=document.createElement('input');check.type='checkbox';check.className='v05-confirm';
  check.addEventListener('change',()=>{
   if(check.checked&&i>0&&!root.querySelectorAll('.v05-confirm')[i-1].checked){check.checked=false;alert('Comprueba los pasos en orden.');}
  });
  label.append(check,makeElement('strong','',`${i+1}. ${step.op} · ${step.item} · ${step.quality}`));
  article.append(label);
  article.append(makeElement('p','muted',`Seed prevista: ${step.seed} · ${step.lines.map(x=>x.stem+' '+x.value).join(' / ')}`));
  root.appendChild(article);
 });
}
function plan(){
 if(plannerWorker){status('#recipe-status','Ya se está calculando una receta.');return;}
 try{
  const opts=budgetOptions();
  $('#plan-route').disabled=true;
  status('#recipe-status',`Buscando rutas R/S/C desde la seed recuperada ${opts.seed}. Presupuesto máximo: ${opts.budget.souls} Souls y ${opts.budget.crucibles} Crucibles.`);
  plannerWorker=new Worker(new URL('./v05-budget-worker.js',import.meta.url),{type:'module'});
  plannerWorker.onmessage=e=>{
   const r=e.data;
   if(r.type==='progress'){
    status('#recipe-status',`Evaluando ${r.visited.toLocaleString('es-CL')} estados · ${r.goalsFound} recetas compatibles, sin tocar tu Switch…`);
   }else if(r.type==='complete'){
    plannerWorker.terminate();plannerWorker=null;$('#plan-route').disabled=false;showRecipe(r);
   }else if(r.type==='error'){
    plannerWorker.terminate();plannerWorker=null;$('#plan-route').disabled=false;
    status('#recipe-status','El cálculo se detuvo sin sugerir una receta: '+r.message,'error');
   }
  };
  plannerWorker.onerror=e=>{
   plannerWorker?.terminate();plannerWorker=null;$('#plan-route').disabled=false;
   status('#recipe-status','Error en el planificador: '+e.message,'error');
  };
  plannerWorker.postMessage({type:'plan',gameData:data,...opts});
 }catch(err){status('#recipe-status',err.message,'error')}
}
async function boot(){
 try{
  data=await loadGameData();
  $('#hero').innerHTML=data.classes.map((x,i)=>`<option value="${i}" ${x==='Wizard'?'selected':''}>${x}</option>`).join('');
  $('#item-list').innerHTML=data.items.map(x=>`<option value="${x.name.replaceAll('&','&amp;').replaceAll('"','&quot;')}"></option>`).join('');
  engine=new UniversalEngine(data,Number($('#hero').value),true);
  resetItem();
  status('#db-status',`Base cargada: ${data.items.length} objetos y ${data.affixes.length} afijos; motor de consola listo.`,'success');
  $('#hero').onchange=()=>{engine=new UniversalEngine(data,Number($('#hero').value),true);resetItem()};
  $('#item').onchange=resetItem;$('#target-item').onchange=resetItem;
  $('#save-drop').onclick=saveDrop;$('#recover').onclick=recover;$('#plan-route').onclick=plan;
  $('#cancel-recover').onclick=()=>{recoverWorker?.terminate();recoverWorker=null;$('#recover').disabled=false;status('#recovery-status','Cancelado; el drop y el resultado ingresado permanecen en pantalla.')};
  $('#cancel-plan').onclick=()=>{plannerWorker?.terminate();plannerWorker=null;$('#plan-route').disabled=seed===null;status('#recipe-status','Búsqueda cancelada. No se gastó ningún recurso.')};
 }catch(err){status('#db-status','No se pudo cargar la aplicación: '+err.message,'error')}
}
boot();
