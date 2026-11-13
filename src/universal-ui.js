import {UniversalEngine,loadGameData,CLASSES,niceStem} from './universal-engine.js';
import {observationAffixFamilies,generateRecoveryHypotheses,verifyHypothesis} from './universal-recovery.js';
import {searchUniversalRoute} from './universal-planner.js';
import {loadManifest,seasonRules} from './season.js';
const $=x=>document.querySelector(x),safe=x=>String(x).replace(/[&<>"']/g,a=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[a]));
const words={en:{heading:'Universal Item Lab',intro:'Item-based simulation for all character classes, with seed recovery research and verifiable recipes.',warning:'Experimental: a reconstruction must be unique and a recipe must be checked step by step before spending materials.',setup:'1. Game and item',observe:'2. Recover an existing item seed',observed:'Enter visible numerical stats, including the legendary power when it has a number. Do not enter Mystic-modified values as natural rolls.',plan:'3. Target and recipe',planHelp:'Choose target affixes (Ctrl/long press to select several). One legal Mystic swap may complete the recipe.',mode:'Mode',class:'Character class',item:'Item (English database names)',seed:'Current seed if known',add:'+ Add affix',save:'Save observation',search:'Recover seeds',cancel:'Cancel',goals:'Target affixes',mystic:'Allow one Mystic swap',crafted:'Allow crafted primal (ashes)',maxr:'Maximum reforges',maxs:'Maximum sanctifications',next:'Predict next reforge',route:'Find recipe',ready:'Ready',load:'Loading complete D3Recipes database…',none:'Enter an item first.',missing:'Enter a current seed or recover it before planning.',notEnough:'No unique seed: more consecutive observations may be required.',normal:'Normal (not ancient/primal)',ancient:'Ancient',primal:'Primal',sanctified:'Sanctified',quality:'First observation quality',step:'Expected result',result:'Predicted route',source:'Source'},es:{heading:'Laboratorio universal de objetos',intro:'Simulación basada en datos para todas las clases, reconstrucción de seeds y recetas verificables.',warning:'Experimental: exige una seed única y verifica cada paso antes de gastar materiales.',setup:'1. Juego y objeto',observe:'2. Recuperar la seed del objeto',observed:'Ingresa los atributos numéricos visibles y el poder legendario si tiene valor. No ingreses valores modificados por la Mística como si fueran originales.',plan:'3. Objetivo y receta',planHelp:'Elige los afijos objetivo (Ctrl o pulsación larga para varios). La Mística puede reemplazar legalmente uno.',mode:'Modo',class:'Clase',item:'Objeto (nombres de la base en inglés)',seed:'Seed actual, si la conoces',add:'+ Agregar afijo',save:'Guardar observación',search:'Reconstruir seeds',cancel:'Cancelar',goals:'Afijos deseados',mystic:'Permitir un cambio de Mística',crafted:'Permitir primal fabricado (cenizas)',maxr:'Máximo de reforjas',maxs:'Máximo de santificaciones',next:'Predecir próxima reforja',route:'Buscar receta',ready:'Listo',load:'Cargando base completa de D3Recipes…',none:'Elige un objeto primero.',missing:'Ingresa o reconstruye una seed antes de planificar.',notEnough:'Seed no única: podrían hacer falta otras observaciones consecutivas.',normal:'Normal (no ancestral/primal)',ancient:'Ancestral',primal:'Primal',sanctified:'Santificado',quality:'Calidad de primera observación',step:'Resultado esperado',result:'Ruta prevista',source:'Fuente'},pt:{heading:'Laboratório universal de itens',intro:'Simulação para todas as classes, recuperação de sementes e receitas verificáveis.',warning:'Experimental: exija uma semente única e confira cada etapa antes de gastar materiais.',setup:'1. Jogo e item',observe:'2. Recuperar semente do item',observed:'Informe os atributos numéricos visíveis e o poder lendário quando numérico. Não use valores alterados pela Mística como se fossem originais.',plan:'3. Objetivo e receita',planHelp:'Escolha atributos-alvo (Ctrl ou toque longo para vários). Uma troca válida na Mística é permitida.',mode:'Modo',class:'Classe',item:'Item (nomes em inglês)',seed:'Semente atual, se conhecida',add:'+ Adicionar atributo',save:'Salvar observação',search:'Recuperar sementes',cancel:'Cancelar',goals:'Atributos desejados',mystic:'Permitir troca da Mística',crafted:'Permitir primal fabricado (cinzas)',maxr:'Máximo de reforjas',maxs:'Máximo de santificações',next:'Prever próxima reforja',route:'Buscar receita',ready:'Pronto',load:'Carregando base completa do D3Recipes…',none:'Escolha um item primeiro.',missing:'Informe ou recupere uma semente antes de planejar.',notEnough:'Semente não única: outras observações consecutivas podem ser necessárias.',normal:'Normal (não ancestral/primal)',ancient:'Ancestral',primal:'Primal',sanctified:'Santificado',quality:'Qualidade da primeira observação',step:'Resultado esperado',result:'Rota prevista',source:'Fonte'}};
let data,manifest,engine,item=null,observations=[],candidates=[],worker=null,lang='en';const T=x=>words[lang][x]||words.en[x]||x;
function translate(){const k={heading:'#headline',intro:'#summary',warning:'#important',setup:'#setup-title',observe:'#observe-title',observed:'#observe-help',plan:'#plan-title',planHelp:'#plan-help',mode:'#mode-label',class:'#class-label',item:'#item-label',seed:'#seed-label',add:'#add-stat',save:'#save-observation',search:'#search-seed',cancel:'#cancel-seed',goals:'#goal-label',mystic:'#mystic-label',crafted:'#crafted-label',maxr:'#maxR-label',maxs:'#maxS-label',next:'#preview',route:'#route'};for(const [key,sel]of Object.entries(k))$(sel).textContent=T(key);document.documentElement.lang=lang;}
function maybeEngine(){item=engine?.item($('#item').value);return item;}
function populate(){if(!data)return;
 const names=data.items.map(i=>i.name).sort((a,b)=>a.localeCompare(b));$('#items').innerHTML=names.map(n=>`<option value="${safe(n)}"></option>`).join('');
 $('#class').innerHTML=data.classes.map((c,i)=>`<option value="${i}" ${i===2?'selected':''}>${safe(c)}</option>`).join('');
 }
function resetItem(){const hero=Number($('#class').value)||0;engine=new UniversalEngine(data,hero,true);
 if(!maybeEngine()){$('#source-status').textContent=T('none');return;}
 $('#source-status').textContent=`${item.name} · ID ${item.id} · ${engine.candidateAffixes(item).length} candidate affix records`;
 observations=[];candidates=[];$('#base-fields').innerHTML='';$('#stats').innerHTML='';$('#goals').innerHTML='';
 let quality=document.createElement('select');quality.id='ob-quality';quality.innerHTML=['normal','ancient','primal','sanctified'].map(q=>`<option value="${q}">${T(q)}</option>`).join('');
 $('#base-fields').innerHTML=`<div class="u-toolbar"><label>${T('quality')}<select id="ob-quality">${quality.innerHTML}</select></label><label>Operation from previous observation<select id="ob-op"><option value="R">Reforge Legendary</option><option value="S">Sanctify</option><option value="P">Improve Legendary</option><option value="C">Convert Set Item</option></select></label></div>`;
 for(const [attr] of item.formulas||[])addRow('Power',attr);
 const families=observationAffixFamilies(engine,item);
 $('#goals').innerHTML=families.map(s=>`<option value="${safe(s)}">${safe(niceStem(s))}</option>`).join('');
 const stored=JSON.parse(localStorage.getItem('nephalem-universal-example')||'null');if(stored?.item===item.name&&stored?.hero===hero){observations=stored.observations||[];$('#seed').value=stored.seed??'';}
 renderObs();
}
function addRow(initial='',attrInitial=null){if(!maybeEngine())return;
 const family=observationAffixFamilies(engine,item);const options=family.map(s=>({key:s,txt:niceStem(s)}));
 const el=document.createElement('div');el.className='u-stat-row';el.innerHTML=`<label>Attribute <select class="u-family"><option value="Power">Legendary power</option>${options.map(x=>`<option value="${safe(x.key)}">${safe(x.txt)}</option>`).join('')}</select></label><label>Value<input class="u-value" type="number" step="any" placeholder="Exact value"></label><button type="button" aria-label="Remove">×</button>`;
 $('#stats').appendChild(el);const select=el.querySelector('select');select.value=initial||options[0]?.key||'Power';
 el.querySelector('button').onclick=()=>el.remove();el.dataset.attr=attrInitial===null?'':String(attrInitial);
}
function getFields(){const lines=[];for(const el of document.querySelectorAll('.u-stat-row')){
 const stem=el.querySelector('select').value,value=Number(el.querySelector('input').value);if(!el.querySelector('input').value.trim())continue;
 let attr=el.dataset.attr?Number(el.dataset.attr):null;
 if(attr===null){const a=engine.candidateAffixes(item).find(a=>a.label.split(' ')[0]===stem||a.label.startsWith(stem+' '));attr=a?.formulas?.[0]?.[0];}
 if(stem==='Power')attr=item.formulas?.[0]?.[0];if(attr===undefined||attr===null)throw Error(`Cannot identify numerical attribute for ${stem}.`);
 lines.push({stem,attr,value});
 }return lines;}
function renderObs(){const el=$('#observations-list');el.innerHTML=observations.map((o,i)=>`<div class="u-dark">${i+1}. ${o.op}, ${o.quality}: ${o.lines.map(x=>`${safe(niceStem(x.stem))} ${x.value}`).join(' · ')}</div>`).join('');}
function season(){return seasonRules(manifest,{mode:$('#mode').value});}
function currentSeed(){const n=$('#seed').value.trim();return n!==''&&Number.isInteger(Number(n))&&Number(n)>=0&&Number(n)<=4294967295?Number(n):null;}
function saveProject(){localStorage.setItem('nephalem-universal-example',JSON.stringify({item:item?.name,hero:engine.hero,observations,seed:currentSeed()}));}
function outputResult(r){return `${r.item} · ${r.quality} · seed ${r.seed}\n${r.lines.map(l=>`${niceStem(l.stem)}: ${Number(l.value.toFixed(6))}`).join(' · ')}${r.affixes.some(a=>a.socket)?' · Socket':''}`;}
function record(){if(!maybeEngine())return;try{const o={op:$('#ob-op').value,quality:$('#ob-quality').value,lines:getFields()};
 if(!o.lines.length)throw Error('No numerical attributes entered');observations.push(o);renderObs();saveProject();$('#seed-status').textContent=`${observations.length} observations saved. Search when you have at least one normal (unmodified) observation.`;
 }catch(e){$('#seed-status').textContent=e.message;}}
function scan(){if(!maybeEngine())return;const first=observations[0];if(!first){$('#seed-status').textContent='Save a complete normal observation first.';return;}
 let hypotheses;try{hypotheses=generateRecoveryHypotheses(engine,item,first);}catch(e){$('#seed-status').textContent=e.message;return;}
 if(hypotheses.length>2){$('#seed-status').textContent=`${hypotheses.length} possible affix order/tier interpretations; scanning all would be expensive. Please enter more complete numeric stats or use known seed.`;return;}
 let i=0,all=[];const status=$('#seed-status');
 const next=()=>{if(i>=hypotheses.length){const uniques=[...new Set(all)];candidates=uniques;
 if(uniques.length===1){let s=uniques[0];for(const o of observations.slice(1)){const r=engine.apply(item,s,o.op);s=r.seed;}
 $('#seed').value=s;status.textContent=`Unique compatible seed: ${s}. Confirm predictions before using materials.`;
 }else status.textContent=`${uniques.length} candidates remain. Record a further operation before spending materials.`;saveProject();return;}
 const hyp=hypotheses[i++];if(hyp.constraints.length>32){status.textContent='Too many formula constraints for this scan build.';return;}
 worker=new Worker(new URL('./seed-worker.js',import.meta.url),{type:'module'});
 worker.onmessage=e=>{const d=e.data;if(d.type==='progress')status.textContent=`Scanning ${i}/${hypotheses.length}: ${(d.checked/d.total*100).toFixed(1)}% · ${d.found} numeric matches`;
  if(d.type==='complete'){const verified=d.seeds.filter(s=>verifyHypothesis(engine,item,s,hyp));for(const seed of verified){let s=seed,ok=true;
   for(const o of observations.slice(1)){const r=engine.apply(item,s,o.op);
    if(r.quality!==o.quality||!o.lines.every(l=>r.lines.some(v=>v.attr===l.attr&&v.stem===l.stem&&Math.abs(v.value-l.value)<1.05))){ok=false;break;}s=r.seed;
   }if(ok)all.push(seed);
  }worker.terminate();worker=null;next();}
  if(d.type==='error'){status.textContent=d.message;worker.terminate();worker=null;}};
 worker.onerror=e=>{status.textContent=e.message;worker.terminate();worker=null;};worker.postMessage({type:'solve',constraints:hyp.constraints});};next();
}
function preview(){try{if(!maybeEngine())return;const seed=currentSeed();if(seed===null)throw Error(T('missing'));
 const r=engine.reforge(item,seed);$('#recipe-status').textContent=`Next reforge (simulated)\n${outputResult(r)}`;$('#steps').replaceChildren();
 }catch(e){$('#recipe-status').textContent=e.message;}}
function plan(){try{if(!maybeEngine())return;const seed=currentSeed();if(seed===null)throw Error(T('missing'));
 const s=season();const selected=[...$('#goals').selectedOptions].map(o=>o.value);const allowed=[...s.allowed];
 if($('#allow-crafted').checked)allowed.push('P');if(item.set_id&&item.set_id!==0)allowed.push('C');
 const result=searchUniversalRoute(engine,item,seed,{goals:selected,allowed,maxR:Number($('#max-r').value),maxS:Number($('#max-s').value),maxP:$('#allow-crafted').checked?2:0,maxC:item.set_id?3:0,maxSteps:18,maxNodes:25000,allowMystic:$('#allow-mystic').checked,expectedPrimal:!$('#allow-crafted').checked});
 if(!result.found){$('#recipe-status').textContent=result.reason+' · '+result.visited+' states';$('#steps').replaceChildren();return;}
 $('#recipe-status').textContent=`${T('result')}: ${result.path} · ${result.r} reforges (${result.materials.souls} souls) · ${result.s} crucibles · ${result.p} crafted primal operations · Mystic ${result.mystic||'not needed'}`;
 $('#steps').innerHTML=result.steps.map((r,i)=>`<article class="u-step"><span class="u-tag">${i+1} · ${r.op}</span> <strong>${safe(r.quality)}</strong><p class="u-small">${safe(outputResult(r))}</p><label class="u-check"><input type="checkbox" class="confirm-step"><span>Checked in game</span></label></article>`).join('');
 let halted=false;const checks=[...document.querySelectorAll('.confirm-step')];checks.forEach((c,i)=>c.onchange=()=>{if(halted)return;if(c.checked&&i>0&&!checks[i-1].checked){c.checked=false;return;} });
 }catch(e){$('#recipe-status').textContent=e.message;}}
async function boot(){lang=localStorage.getItem('nephalem-lang')||'en';$('#lang').value=lang;translate();$('#source-status').textContent=T('load');
 try{[data,manifest]=await Promise.all([loadGameData(),loadManifest()]);
  engine=new UniversalEngine(data,2,true);populate();$('#source-status').textContent=`${data.items.length} items · ${data.affixes.length} affixes · D3Recipes season ${data.season}`;
  $('#item').value='Convention of Elements';resetItem();
 }catch(e){$('#source-status').textContent=`Database error: ${e.message}`;return;}
 $('#item').addEventListener('change',resetItem);$('#class').addEventListener('change',resetItem);
 $('#lang').addEventListener('change',e=>{lang=e.target.value;localStorage.setItem('nephalem-lang',lang);translate();if(item)resetItem();});
 $('#add-stat').onclick=()=>addRow();$('#save-observation').onclick=record;$('#search-seed').onclick=scan;
 $('#cancel-seed').onclick=()=>{worker?.terminate();worker=null;$('#seed-status').textContent='Cancelled';};
 $('#preview').onclick=preview;$('#route').onclick=plan;
 if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
}
boot();
