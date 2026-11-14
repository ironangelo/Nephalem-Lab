import {UniversalEngine,loadGameData,CLASSES,niceStem} from './universal-engine.js';
import {observationAffixFamilies,generateRecoveryHypotheses,verifyHypothesis} from './universal-recovery.js';
import {searchUniversalRoute} from './universal-planner.js';
import {validSeeds,advanceCandidates,matchesObservation} from './candidate-analysis.js';
import {parseSocketCount} from './observation-fields.js';
import {resolveObservationAttribute,requiredOperationQuality,assertObservationQuality} from './observation-model.js';
import {loadManifest,seasonRules} from './season.js';
const $=x=>document.querySelector(x),safe=x=>String(x).replace(/[&<>"']/g,a=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[a]));
const words={en:{heading:'Universal Item Lab',intro:'Item-based simulation for all character classes, with seed recovery research and verifiable recipes.',warning:'Experimental: a reconstruction must be unique and a recipe must be checked step by step before spending materials.',setup:'1. Game and item',observe:'3. Recover an existing item seed',observed:'Enter the visible affixes, including socket count (e.g. 3 on a chest). Socket count is saved but is not a numeric seed constraint. Do not enter Mystic-modified rolls as natural.',plan:'2. Target and recipe',planHelp:'Choose target affixes (Ctrl/long press to select several). One legal Mystic swap may complete the recipe.',mode:'Mode',class:'Character class',item:'Item (English database names)',seed:'Current seed if known',add:'+ Add affix',save:'Save observation',search:'Recover seeds',cancel:'Cancel',goals:'Target affixes',mystic:'Allow one Mystic swap',crafted:'Allow crafted primal (ashes)',maxr:'Maximum reforges',maxs:'Maximum sanctifications',next:'Predict next reforge',route:'Find recipe',ready:'Ready',load:'Loading complete D3Recipes database…',none:'Enter an item first.',missing:'Enter a current seed or recover it before planning.',notEnough:'No unique seed: more consecutive observations may be required.',normal:'Normal (not ancient/primal)',ancient:'Ancient',primal:'Primal',sanctified:'Sanctified',quality:'First observation quality',step:'Expected result',result:'Predicted route',source:'Source'},es:{heading:'Laboratorio universal de objetos',intro:'Simulación basada en datos para todas las clases, reconstrucción de seeds y recetas verificables.',warning:'Experimental: exige una seed única y verifica cada paso antes de gastar materiales.',setup:'1. Juego y objeto',observe:'3. Recuperar la seed del objeto',observed:'Ingresa los afijos visibles, incluidos los engarces (por ejemplo, 3 en una pechera). Se guardan, pero su cantidad no identifica la seed. No ingreses atributos modificados en la Mística como naturales.',plan:'2. Objetivo y receta',planHelp:'Elige los afijos objetivo (Ctrl o pulsación larga para varios). La Mística puede reemplazar legalmente uno.',mode:'Modo',class:'Clase',item:'Objeto (nombres de la base en inglés)',seed:'Seed actual, si la conoces',add:'+ Agregar afijo',save:'Guardar observación',search:'Reconstruir seeds',cancel:'Cancelar',goals:'Afijos deseados',mystic:'Permitir un cambio de Mística',crafted:'Permitir primal fabricado (cenizas)',maxr:'Máximo de reforjas',maxs:'Máximo de santificaciones',next:'Predecir próxima reforja',route:'Buscar receta',ready:'Listo',load:'Cargando base completa de D3Recipes…',none:'Elige un objeto primero.',missing:'Ingresa o reconstruye una seed antes de planificar.',notEnough:'Seed no única: podrían hacer falta otras observaciones consecutivas.',normal:'Normal (no ancestral/primal)',ancient:'Ancestral',primal:'Primal',sanctified:'Santificado',quality:'Calidad de primera observación',step:'Resultado esperado',result:'Ruta prevista',source:'Fuente'},pt:{heading:'Laboratório universal de itens',intro:'Simulação para todas as classes, recuperação de sementes e receitas verificáveis.',warning:'Experimental: exija uma semente única e confira cada etapa antes de gastar materiais.',setup:'1. Jogo e item',observe:'3. Recuperar semente do item',observed:'Informe os atributos visíveis, incluindo a quantidade de encaixes (por exemplo, 3 no peitoral). É registrada, mas não identifica a semente. Não use atributos modificados pela Mística como naturais.',plan:'2. Objetivo e receita',planHelp:'Escolha atributos-alvo (Ctrl ou toque longo para vários). Uma troca válida na Mística é permitida.',mode:'Modo',class:'Classe',item:'Item (nomes em inglês)',seed:'Semente atual, se conhecida',add:'+ Adicionar atributo',save:'Salvar observação',search:'Recuperar sementes',cancel:'Cancelar',goals:'Atributos desejados',mystic:'Permitir troca da Mística',crafted:'Permitir primal fabricado (cinzas)',maxr:'Máximo de reforjas',maxs:'Máximo de santificações',next:'Prever próxima reforja',route:'Buscar receita',ready:'Pronto',load:'Carregando base completa do D3Recipes…',none:'Escolha um item primeiro.',missing:'Informe ou recupere uma semente antes de planejar.',notEnough:'Semente não única: outras observações consecutivas podem ser necessárias.',normal:'Normal (não ancestral/primal)',ancient:'Ancestral',primal:'Primal',sanctified:'Santificado',quality:'Qualidade da primeira observação',step:'Resultado esperado',result:'Rota prevista',source:'Fonte'}};
let data,manifest,engine,item=null,rootItemId=null,observations=[],candidates=[],worker=null,analysisWorker=null,lang='en',persistenceError=null;const T=x=>words[lang][x]||words.en[x]||x;
const extraWords={
 en:{aTitle:'4. Candidate analysis · no in-game materials',aHelp:'Keep compatible seeds, compare the possible results of each currently available Cube recipe, and search for a limited shared path. Results are conditional, not guaranteed.',aAction:'Analyze candidates',aBackup:'Prepare backup',aRestore:'Restore backup',aStatus:'No seed candidates saved yet.',aCancel:'Cancel analysis'},
 es:{aTitle:'4. Análisis de seeds candidatas · sin gastar materiales',aHelp:'Guarda las semillas compatibles, compara los resultados de cada receta disponible actualmente y busca una ruta común limitada. Las predicciones son condicionales, no garantizadas.',aAction:'Analizar candidatas',aBackup:'Preparar respaldo',aRestore:'Restaurar respaldo',aStatus:'Aún no hay semillas candidatas guardadas.',aCancel:'Cancelar análisis'},
 pt:{aTitle:'4. Análise de sementes candidatas · sem gastar materiais',aHelp:'Salve as sementes compatíveis, compare as operações disponíveis nesta temporada e procure uma rota comum limitada. Previsões são condicionais, não garantidas.',aAction:'Analisar candidatas',aBackup:'Preparar cópia',aRestore:'Restaurar cópia',aStatus:'Ainda não há sementes candidatas salvas.',aCancel:'Cancelar análise'}
};
const TA=x=>extraWords[lang]?.[x]||extraWords.en[x]||x;
function projectKey(){return `nephalem-universal-v3-${engine?.hero}-${rootItemId??item?.id}`;}
function capturePreferences(){return {mode:$('#mode').value,allowMystic:$('#allow-mystic').checked,allowConvert:$('#allow-convert').checked,maxC:Number($('#max-c').value),allowCrafted:$('#allow-crafted').checked,maxR:Number($('#max-r').value),maxS:Number($('#max-s').value)};}
function restorePreferences(p){if(!p||typeof p!=='object')return;
 if(['seasonal','nonseasonal'].includes(p.mode))$('#mode').value=p.mode;
 for(const [key,id] of [['allowMystic','#allow-mystic'],['allowConvert','#allow-convert'],['allowCrafted','#allow-crafted']])if(typeof p[key]==='boolean')$(id).checked=p[key];
 for(const [key,id,limit] of [['maxC','#max-c',12],['maxR','#max-r',20],['maxS','#max-s',100]])if(Number.isInteger(p[key])&&p[key]>=0&&p[key]<=limit)$(id).value=p[key];
}
function renderCandidateStatus(){
 const el=$('#candidate-status');if(!el)return;
 el.textContent=persistenceError?`WARNING: ${candidates.length} candidates are only in memory; automatic saving failed (${persistenceError}). Use Prepare backup before closing or refreshing.`:(candidates.length?`${candidates.length} compatible seeds stored on this device. Predictions remain unconfirmed until checked in-game.`:TA('aStatus'));
 $('#analyze-candidates').disabled=candidates.length<2;
 $('#backup-candidates').disabled=candidates.length<1;
}

function translate(){const k={heading:'#headline',intro:'#summary',warning:'#important',setup:'#setup-title',observe:'#observe-title',observed:'#observe-help',plan:'#plan-title',planHelp:'#plan-help',mode:'#mode-label',class:'#class-label',item:'#item-label',seed:'#seed-label',add:'#add-stat',save:'#save-observation',search:'#search-seed',cancel:'#cancel-seed',goals:'#goal-label',mystic:'#mystic-label',crafted:'#crafted-label',maxr:'#maxR-label',maxs:'#maxS-label',next:'#preview',route:'#route'};for(const [key,sel]of Object.entries(k))$(sel).textContent=T(key);document.documentElement.lang=lang;
 for(const [key,selector] of Object.entries({aTitle:'#candidate-title',aHelp:'#candidate-help',aAction:'#analyze-candidates',aBackup:'#backup-candidates',aRestore:'#restore-candidates',aCancel:'#cancel-analysis'})){
  const el=$(selector);if(el)el.textContent=TA(key);
 }
 if(item)renderCandidateStatus();
}
function maybeEngine(){item=engine?.item($('#item').value);return item;}
function populate(){if(!data)return;
 const names=data.items.map(i=>i.name).sort((a,b)=>a.localeCompare(b));$('#items').innerHTML=names.map(n=>`<option value="${safe(n)}"></option>`).join('');
 $('#class').innerHTML=data.classes.map((c,i)=>`<option value="${i}" ${i===2?'selected':''}>${safe(c)}</option>`).join('');
 }
function target(){return engine?.item($('#target-item').value)||item;}
function resetGoalFields(goals=[]){
 const t=target();if(!t)return;
 const fam=observationAffixFamilies(engine,t);
 $('#goals').innerHTML=fam.map(x=>`<option value="${safe(x)}" ${goals.includes(x)?'selected':''}>${safe(niceStem(x))}</option>`).join('');
}
function resultSetMembers(){
 if(!item?.set_id)return [];
 return engine.items.filter(x=>x.set_id===item.set_id&&x.id!==item.id).sort((a,b)=>a.name.localeCompare(b.name));
}
function observationItem(){
 return $('#ob-op')?.value==='C'?engine.item($('#ob-result-item')?.value):item;
}
function rebuildObservationFields(){
 $('#base-fields').innerHTML=`<div class="u-toolbar"><label>${T('quality')}<select id="ob-quality">${['normal','ancient','primal','sanctified','crafted'].map(q=>`<option value="${q}">${T(q)}</option>`).join('')}</select></label><label>Operation from previous observation<select id="ob-op"><option value="R">Reforge Legendary</option><option value="S">Sanctify</option><option value="P">Improve Legendary</option><option value="C">Convert Set Item</option></select></label><label id="result-item-box" class="u-hidden">Resulting set piece<select id="ob-result-item"></select></label></div>`;
 const fill=()=>{
  const op=$('#ob-op').value,active=op==='C';
  $('#result-item-box').classList.toggle('u-hidden',!active);
  if(active){const members=resultSetMembers();$('#ob-result-item').innerHTML='<option value="">Select actual set piece from the game</option>'+members.map(i=>`<option value="${i.name.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}">${safe(i.name)}</option>`).join('');}
  $('#ob-quality').value=requiredOperationQuality(op)||'normal';
  $('#ob-quality').disabled=op!=='R';
  $('#stats').replaceChildren();const obj=observationItem();for(const [attr] of obj?.formulas||[])addRow('Power',attr);
 };
 $('#ob-op').addEventListener('change',fill);
 $('#ob-result-item').addEventListener('change',()=>{$('#stats').replaceChildren();for(const [attr] of observationItem()?.formulas||[])addRow('Power',attr);});
 fill();
}
function resetItem(){
 if(analysisWorker){analysisWorker.terminate();analysisWorker=null;}
 const hero=Number($('#class').value)||0;engine=new UniversalEngine(data,hero,true);
 if(!maybeEngine()){$('#source-status').textContent=T('none');return;}
 rootItemId=item.id;
 observations=[];candidates=[];persistenceError=null;let stored=null,legacy=null;
 try{stored=JSON.parse(localStorage.getItem(projectKey())||'null');legacy=JSON.parse(localStorage.getItem('nephalem-universal-example')||'null');}catch{}
 if(stored?.schema===3&&stored.itemId===rootItemId&&stored.hero===hero){
  observations=Array.isArray(stored.observations)?stored.observations:[];
  candidates=validSeeds(stored.candidates||[]);
  if(stored.currentItemId){const active=engine.item(stored.currentItemId);if(active){item=active;$('#item').value=active.name;}}
  $('#seed').value=stored.seed??(candidates.length===1?candidates[0]:'');
  $('#target-item').value=engine.item(stored.targetItemId)?.name||engine.item(rootItemId).name;
  resetGoalFields(stored.goals||[]);
  restorePreferences(stored.preferences);
 }else{
  $('#target-item').value=item.name;
  const defaults=item.name==="Firebird's Pinions"?['Int','Vit','CooldownReduction','ResourceCostReduction']:[];
  resetGoalFields(defaults);
  if(legacy?.item===item.name&&legacy?.hero===hero){observations=legacy.observations||[];$('#seed').value=legacy.seed??'';}
  else $('#seed').value='';
 }
 $('#source-status').textContent=`${item.name} · ID ${item.id} · ${engine.candidateAffixes(item).length} candidate affix records`;
 rebuildObservationFields();renderObs();renderCandidateStatus();$('#candidate-results').textContent='';
}
function addRow(initial='',attrInitial=null){if(!maybeEngine()||!observationItem())return;
 const family=observationAffixFamilies(engine,observationItem());const options=family.map(s=>({key:s,txt:niceStem(s)}));
 const el=document.createElement('div');el.className='u-stat-row';el.innerHTML=`<label>Attribute <select class="u-family"><option value="Power">Legendary power</option>${options.map(x=>`<option value="${safe(x.key)}">${safe(x.txt)}</option>`).join('')}</select></label><label>Value<input class="u-value" type="number" step="any" placeholder="Exact value"></label><button type="button" aria-label="Remove">×</button>`;
 $('#stats').appendChild(el);const select=el.querySelector('select');select.value=initial||options[0]?.key||'Power';
 el.querySelector('button').onclick=()=>el.remove();el.dataset.attr=attrInitial===null?'':String(attrInitial);
  select.onchange=()=>{el.dataset.attr='';};
}
function getFields(){
 const observedItem=observationItem();
 if(!observedItem)throw Error('Select the exact set piece that appeared after conversion.');
 const lines=[];
 for(const el of document.querySelectorAll('.u-stat-row')){
  const family=el.querySelector('select').value,raw=el.querySelector('input').value.trim();
  if(!raw)continue;
  if(family==='Sockets'){
   if(!engine.candidateAffixes(observedItem).some(a=>a.is_socket))throw Error('This item does not support a socket affix.');
   lines.push(parseSocketCount(raw));continue;
  }
  const attr=resolveObservationAttribute(engine,observedItem,family,el.dataset.attr||null);
  lines.push({stem:family,attr,value:Number(raw)});
 }
 return lines;
}
function renderObs(){const el=$('#observations-list');el.innerHTML=observations.map((o,i)=>`<div class="u-dark">${i+1}. ${o.op}, ${o.quality}: ${o.lines.map(x=>`${safe(niceStem(x.stem))} ${x.value}`).join(' · ')}</div>`).join('');}
function season(){return seasonRules(manifest,{mode:$('#mode').value});}
function currentSeed(){const n=$('#seed').value.trim();return n!==''&&Number.isInteger(Number(n))&&Number(n)>=0&&Number(n)<=4294967295?Number(n):null;}
function saveProject(){
 if(!item||!engine)return;
 try{const snapshot={schema:3,item:engine.item(rootItemId)?.name,itemId:rootItemId,currentItemId:item.id,hero:engine.hero,
  targetItemId:target()?.id,goals:[...$('#goals').selectedOptions].map(o=>o.value),preferences:capturePreferences(),
  observations,candidates:validSeeds(candidates),seed:currentSeed(),savedAt:new Date().toISOString()};
  localStorage.setItem(projectKey(),JSON.stringify(snapshot));
  localStorage.setItem('nephalem-last-root-v3',JSON.stringify({rootItemId,hero:engine.hero}));
  localStorage.setItem('nephalem-universal-example',JSON.stringify({item:item.name,hero:engine.hero,observations,seed:currentSeed()}));
  persistenceError=null;
 }catch(e){persistenceError=String(e?.message||e);renderCandidateStatus();}
}
function outputResult(r){return `${r.item} · ${r.quality} · seed ${r.seed}\n${r.lines.map(l=>`${niceStem(l.stem)}: ${Number(l.value.toFixed(6))}`).join(' · ')}${r.affixes.some(a=>a.socket)?' · Socket':''}`;}
function record(){if(!maybeEngine())return;try{const o={op:$('#ob-op').value,quality:$('#ob-quality').value,itemId:observationItem()?.id,lines:getFields()};
 if(!o.lines.length||o.lines.every(l=>l.stem==='Sockets'))throw Error('Enter the actual numerical attributes, not only socket count.');
 assertObservationQuality(o.op,o.quality);
 if(!observations.length&&o.quality!=='normal')throw Error('Initial seed recovery requires a normal, unmodified item.');
  if(o.op==='C'&&o.quality!=='normal')throw Error('Convert Set Item always creates a normal set item.');
  if(o.op==='C'&&!candidates.length)throw Error('Recover the current item seeds before converting it, so the item chain stays connected.');
 if(candidates.length&&observations.length){
  if(!confirm(`This will advance and filter ${candidates.length} stored seeds using operation ${o.op}. Only continue if you ACTUALLY performed that operation in the game.`))return;
  const remaining=advanceCandidates(engine,item,candidates,o.op,o);
  if(!remaining.length){$('#seed-status').textContent='No candidates match this observed result. Original candidates are preserved. Recheck the resulting piece, quality, exact stats and model before proceeding.';return;}
  candidates=remaining;
  $('#seed').value=candidates.length===1?candidates[0]:'';
  $('#seed-status').textContent=`${candidates.length} seeds remain after the verified ${o.op} result. Continue only after checking predictions in game.`;
 }else $('#seed-status').textContent='Observation saved. Recover candidate seeds when ready.';
 observations.push(o);
  if(o.op==='C'&&o.itemId&&o.itemId!==item.id){item=engine.item(o.itemId);$('#item').value=item.name;rebuildObservationFields();}
  renderObs();saveProject();renderCandidateStatus();
 $('#candidate-results').textContent='';
 }catch(e){$('#seed-status').textContent=e.message;}}
function scan(){if(!maybeEngine())return;const first=observations[0];if(!first){$('#seed-status').textContent='Save a complete normal observation first.';return;}
 if(candidates.length){$('#seed-status').textContent=`${candidates.length} candidates already saved. No need to repeat the 32-bit scan; analyze them or enter a genuine next observation.`;return;}
 if(rootItemId!==item.id){$('#seed-status').textContent='The item changed after conversion. Restore the previous candidate list instead of treating this as a new initial object.';return;}
 let hypotheses;try{hypotheses=generateRecoveryHypotheses(engine,item,first);}catch(e){$('#seed-status').textContent=e.message;return;}
 if(hypotheses.length>32){$('#seed-status').textContent=`${hypotheses.length} numerical interpretations; current solver handles at most 32 in one pass. No game action required.`;return;}
 const status=$('#seed-status');
 status.textContent=`Analyzing ${hypotheses.length} possible affix interpretations together. This may take substantial time on a phone; do not change the item in game.`;
 worker=new Worker(new URL('./seed-worker.js',import.meta.url),{type:'module'});
 worker.onmessage=e=>{const d=e.data;
  if(d.type==='progress')status.textContent=`Checking ${hypotheses.length} interpretations: ${(d.checked/d.total*100).toFixed(1)}% · ${d.found} numerical candidates`;
  if(d.type==='complete'){
   const verified=[];
   for(const seed of d.seeds){
    if(!hypotheses.some(hyp=>verifyHypothesis(engine,item,seed,hyp)))continue;
    let s=seed,ok=true;
    for(const o of observations.slice(1)){
     const r=engine.apply(item,s,o.op);
     if(!matchesObservation(r,o)){ok=false;break;}
     s=r.seed;
    }
    if(ok)verified.push({origin:seed,current:s});
   }
   const unique=[...new Set(verified.map(x=>x.current))];candidates=unique;
   if(unique.length===1){$('#seed').value=unique[0];status.textContent=`One compatible seed: ${unique[0]}. Verify a future prediction before using a costly recipe.`;}
   else if(unique.length)status.textContent=`${unique.length} compatible seeds remain; an additional observation would help. Do not spend materials merely to bypass an app error.`;
   else status.textContent='No seed matches all the supplied observations. Check exact values, quality, Mystic edits and item class; do not spend materials.';
   saveProject();renderCandidateStatus();worker.terminate();worker=null;
  }
  if(d.type==='error'){status.textContent=d.message;worker.terminate();worker=null;}
 };
 worker.onerror=e=>{status.textContent=e.message;worker.terminate();worker=null;};
 worker.postMessage({type:'solve',hypotheses:hypotheses.map(h=>h.constraints),armor:!!item.armor});
}
function labelForAction(op){return {S:'Sanctify',R:'Reforge Legendary',C:'Convert Set Item',P:'Improve Legendary (ashes)'}[op]||op;}
function showCandidateAnalysis(data){
 const container=$('#candidate-results');container.replaceChildren();
 const {summary,shared}=data;
 const header=document.createElement('div');header.className='u-notice';
 header.textContent=`Compared ${summary.seedCount} compatible seeds, assuming each is equally plausible. Information scores are estimates, not actual drop probabilities. A recipe changes the item and can be irreversible.`;
 container.appendChild(header);
 for(const result of summary.operations){
  const c=result.cost,block=document.createElement('article');block.className='u-dark';
  const title=document.createElement('h3');title.textContent=`${labelForAction(result.op)} · ${result.outcomeCount} distinguishable visible outcomes`;
  block.appendChild(title);
  const p=document.createElement('p');p.className='u-small';
  p.textContent=`Estimated survivors after observing result: ${result.expectedRemaining} of ${summary.seedCount} (worst: ${result.worstRemaining}). Information gain: ${result.informationBits} bits. Goal-aligned short-route candidates: ${result.nearGoalPaths}/${summary.seedCount} (model-only). Cost: ${c.souls} Forgotten Souls, ${c.actMaterialsEach} materials per act, ${c.crucibles} Angelic Crucibles, ${c.deathBreaths} Death's Breaths, ${c.ashes} ashes.`;
  block.appendChild(p);
  if(result.changesItem){const notice=document.createElement('p');notice.className='u-small';notice.textContent='Converts to a DIFFERENT set piece; two or more conversions may return to the target. Convert never directly creates Ancient/Primal.';block.appendChild(notice);}
  if(result.op==='S'){const notice=document.createElement('p');notice.className='u-small';notice.textContent='Sanctification is seasonal, and the sanctified legendary power is not modeled. A sanctified item is not a natural primal.';block.appendChild(notice);}
  if(summary.goals.length){const hit=document.createElement('p');hit.className='u-small';hit.textContent=`Natural primal satisfying every selected affix family in ONE operation for ${result.potentialNaturalPrimalGoals}/${summary.seedCount} candidate seeds (not necessarily the actual seed). No Mystic substitutions assumed.`;block.appendChild(hit);}
  const top=document.createElement('details');top.innerHTML='<summary>Most common predicted tooltips</summary>';
  for(const group of result.samples){const e=group.example,txt=document.createElement('p');txt.className='u-small';
   txt.textContent=`${group.count} candidates: ${e.item} · ${e.quality} · ${e.affixes.map(a=>niceStem(a.stem)).join(', ')} · ${e.lines.map(l=>`${niceStem(l.stem)} ${Number(l.value.toFixed(3))}`).join(', ')}`;top.appendChild(txt);}
  block.appendChild(top);container.appendChild(block);
 }
 const conclusion=document.createElement('div');conclusion.className='u-notice';
 conclusion.textContent=shared.skipped?`No shared route search was attempted: ${shared.reason}`:shared.found?`A CONDITIONAL common natural-primal path (possibly with set conversions) was found: ${shared.path}. All ${shared.allCandidates} modeled candidates meet the selected affix families at the end. Predictions may have different intermediate results and still need an in-game validation; do not treat as guaranteed.`:`Shared recipe: ${shared.reason}. The app only searched a bounded range; this is not proof no recipe exists.`;
 container.appendChild(conclusion);
 const disclaimer=document.createElement('p');disclaimer.className='u-small';
 disclaimer.textContent=summary.note;container.appendChild(disclaimer);
}
function startCandidateAnalysis(){
 if(!maybeEngine()||analysisWorker)return;
 if(candidates.length<2){$('#candidate-results').textContent='At least two saved seeds are needed for comparison.';return;}
 const selected=[...$('#goals').selectedOptions].map(o=>o.value);
 const rules=season();
 $('#candidate-results').textContent=`Comparing ${candidates.length} candidates without spending in-game materials…`;
 analysisWorker=new Worker(new URL('./candidate-worker.js',import.meta.url),{type:'module'});
 analysisWorker.onmessage=e=>{
  const msg=e.data;
  if(msg.type==='progress')$('#candidate-results').textContent=msg.message;
  if(msg.type==='complete'){showCandidateAnalysis(msg);analysisWorker.terminate();analysisWorker=null;}
  if(msg.type==='error'){$('#candidate-results').textContent=`Analysis failed: ${msg.message}`;analysisWorker.terminate();analysisWorker=null;}
 };
 analysisWorker.onerror=e=>{$('#candidate-results').textContent=e.message;analysisWorker.terminate();analysisWorker=null;};
 analysisWorker.postMessage({type:'analyze',gameData:data,hero:engine.hero,itemId:item.id,
  seeds:validSeeds(candidates),goals:selected,targetItemId:target()?.id,allowed:rules.allowed,
  allowCrafted:$('#allow-crafted').checked,allowConvert:$('#allow-convert').checked&&!!item.set_id});
}
function prepareCandidateBackup(){
 if(!item||!candidates.length)return;
 const backup={schema:3,itemId:rootItemId,currentItemId:item.id,item:engine.item(rootItemId)?.name,hero:engine.hero,
  observations,candidates:validSeeds(candidates),seed:currentSeed(),targetItemId:target()?.id,goals:[...$('#goals').selectedOptions].map(o=>o.value),preferences:capturePreferences()};
 $('#candidate-backup').value=JSON.stringify(backup);
 $('#candidate-results').textContent='Backup prepared below. Copy and save the text elsewhere before uninstalling the app.';
 $('#candidate-backup').focus();$('#candidate-backup').select();
}
function restoreCandidateBackup(){
 try{
  const input=JSON.parse($('#candidate-backup').value);
  if(input.schema!==3||input.itemId!==rootItemId||input.hero!==engine.hero)throw Error('Backup item/class does not match the current selection.');
  if(!Array.isArray(input.observations)||!Array.isArray(input.candidates))throw Error('Invalid observations or candidates.');
  const filtered=validSeeds(input.candidates);
  if(!filtered.length)throw Error('Backup contains no valid seed candidates.');
  if(!input.observations.length)throw Error('Backup has no recorded observations.');
  observations=input.observations;candidates=filtered;
  if(input.currentItemId&&engine.item(input.currentItemId)){item=engine.item(input.currentItemId);$('#item').value=item.name;rebuildObservationFields();}
   if(input.targetItemId&&engine.item(input.targetItemId)){$('#target-item').value=engine.item(input.targetItemId).name;resetGoalFields(input.goals||[]);}
  restorePreferences(input.preferences);
  $('#seed').value=candidates.length===1?candidates[0]:'';
  renderObs();renderCandidateStatus();saveProject();
  $('#candidate-results').textContent=`Restored ${candidates.length} candidates and ${observations.length} observations for ${item.name}.`;
 }catch(e){$('#candidate-results').textContent=`Could not restore backup: ${e.message}`;}
}
function preview(){try{if(!maybeEngine())return;const seed=currentSeed();if(seed===null)throw Error(T('missing'));
 const r=engine.reforge(item,seed);$('#recipe-status').textContent=`Next reforge (simulated)\n${outputResult(r)}`;$('#steps').replaceChildren();
 }catch(e){$('#recipe-status').textContent=e.message;}}
function plan(){try{if(!maybeEngine())return;const seed=currentSeed();if(seed===null)throw Error(T('missing'));
 const s=season();const selected=[...$('#goals').selectedOptions].map(o=>o.value);const allowed=[...s.allowed];
 if($('#allow-crafted').checked)allowed.push('P');if($('#allow-convert').checked&&item.set_id&&item.set_id!==0)allowed.push('C');
 const result=searchUniversalRoute(engine,item,seed,{goals:selected,targetItem:target(),allowed,maxR:Number($('#max-r').value),maxS:Number($('#max-s').value),maxP:$('#allow-crafted').checked?2:0,maxC:$('#allow-convert').checked&&item.set_id?Number($('#max-c').value):0,maxSteps:18,maxNodes:25000,allowMystic:$('#allow-mystic').checked,expectedPrimal:!$('#allow-crafted').checked});
 if(!result.found){$('#recipe-status').textContent=result.reason+' · '+result.visited+' states';$('#steps').replaceChildren();return;}
 $('#recipe-status').textContent=`${T('result')}: ${result.path} · ${result.r} reforges · ${result.c} set conversions · ${result.materials.souls} souls + ${result.materials.deathBreaths} Death's Breaths · ${result.s} crucibles · ${result.p} crafted primal operations · Mystic ${result.mystic||'not needed'}`;
 $('#steps').innerHTML=result.steps.map((r,i)=>`<article class="u-step"><span class="u-tag">${i+1} · ${r.op}</span> <strong>${safe(r.quality)}</strong><p class="u-small">${safe(outputResult(r))}</p><label class="u-check"><input type="checkbox" class="confirm-step"><span>Checked in game</span></label></article>`).join('');
 let halted=false;const checks=[...document.querySelectorAll('.confirm-step')];checks.forEach((c,i)=>c.onchange=()=>{if(halted)return;if(c.checked&&i>0&&!checks[i-1].checked){c.checked=false;return;} });
 }catch(e){$('#recipe-status').textContent=e.message;}}
async function boot(){lang=localStorage.getItem('nephalem-lang')||'en';$('#lang').value=lang;translate();$('#source-status').textContent=T('load');
 try{[data,manifest]=await Promise.all([loadGameData(),loadManifest()]);
  engine=new UniversalEngine(data,2,true);populate();$('#source-status').textContent=`${data.items.length} items · ${data.affixes.length} affixes · D3Recipes season ${data.season}`;
  let previous=null;try{previous=JSON.parse(localStorage.getItem('nephalem-last-root-v3')||'null');}catch{}
  const chosen=engine.item(previous?.rootItemId)||engine.item('Convention of Elements');
  if(chosen){$('#item').value=chosen.name;$('#class').value=String(Number.isInteger(previous?.hero)?previous.hero:2);}resetItem();
 }catch(e){$('#source-status').textContent=`Database error: ${e.message}`;return;}
 $('#item').addEventListener('change',resetItem);$('#class').addEventListener('change',resetItem);
  $('#target-item').addEventListener('change',()=>{resetGoalFields();saveProject();});$('#goals').addEventListener('change',saveProject);
 for(const id of ['#mode','#allow-mystic','#allow-convert','#max-c','#allow-crafted','#max-r','#max-s'])$(id).addEventListener('change',saveProject);
 $('#lang').addEventListener('change',e=>{lang=e.target.value;localStorage.setItem('nephalem-lang',lang);translate();if(item){renderCandidateStatus();}});
 $('#add-stat').onclick=()=>addRow();$('#save-observation').onclick=record;$('#search-seed').onclick=scan;
 $('#cancel-seed').onclick=()=>{worker?.terminate();worker=null;$('#seed-status').textContent='Cancelled';};
 $('#preview').onclick=preview;$('#route').onclick=plan;
 $('#analyze-candidates').onclick=startCandidateAnalysis;
 $('#cancel-analysis').onclick=()=>{if(analysisWorker){analysisWorker.terminate();analysisWorker=null;$('#candidate-results').textContent='Candidate analysis cancelled.';}};
 $('#backup-candidates').onclick=prepareCandidateBackup;
 $('#restore-candidates').onclick=restoreCandidateBackup;
 if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
}
boot();
