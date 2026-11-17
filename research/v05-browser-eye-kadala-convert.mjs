import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage({viewport:{width:1180,height:900},locale:'es-CL'});
p.setDefaultTimeout(1200000);
const started=Date.now();
p.on('pageerror',e=>console.log('EYE_PAGEERROR',e.message));
try{
 await p.goto('http://127.0.0.1:8080/lab-v05.html',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>document.querySelector('#db-status')?.textContent.includes('Base cargada'));
 await p.locator('#hero').selectOption({label:'Wizard'});
 await p.locator('#item').fill("Firebird's Eye");await p.locator('#item').dispatchEvent('change');
 // Original Kadala drop provides item identity, not a presumed Reforge seed.
 await p.locator('#drop-text').fill('Power: 19\\nInt: 705\nVit: 686\nExperience: 152\nMaxArcanePower: 11\nSkill_Wizard_MagicMissile: 10');
 await p.locator('#save-drop').click();
 console.log('EYE_DROP_STATUS',await p.locator('#drop-status').innerText());
 assert((await p.locator('#drop-status').innerText()).includes('guardado'),'Eye original drop must register');
 await p.locator('#diagnostic-op').selectOption('C');
 await p.locator('#converted-item').fill("Firebird's Down");
 await p.locator('#reforge-text').fill('Int: 425\nVit: 490\nFireResist: 148\nThorns: 2621\nSockets: 2\nSkill_Wizard_MagicMissile: 10');
 await p.locator('#recover').click();
 await p.waitForFunction(()=>{
  let el=document.querySelector('#recovery-status');
  return el?.textContent.includes('SEED ÚNICA IDENTIFICADA')||el?.classList.contains('error');
 });
 const s=await p.locator('#recovery-status').innerText();
 console.log('EYE_CONVERT_RECOVERY',JSON.stringify({seconds:(Date.now()-started)/1000,status:s}));
 assert(s.includes('SEED ÚNICA IDENTIFICADA'),'Real Eye→Down Convert must yield unique seed');
 assert(s.includes('4016194486'),'Recovered predecessor must equal real Kadala Eye input seed');
 assert(s.includes('930643368'),'Recovered current must equal real Down output seed');
 assert.equal(await p.locator('#item').inputValue(),"Firebird's Down",'The app must now plan from converted Down');
 assert.equal(await p.locator('#target-item').inputValue(),"Firebird's Eye",'The goal must remain Eye');
 // Choose exact Soulstone core priorities with a legal single Mystic swap.
 await p.locator('#goals').selectOption(['Int','ArcanePowerOnCrit','CriticalChance']);
 await p.locator('#budget-souls').fill('120');
 await p.locator('#budget-crucibles').fill('6');
 await p.locator('#budget-breaths').fill('20');
 await p.locator('#budget-act').fill('10');
 await p.locator('#budget-steps').fill('18');
 await p.locator('#budget-nodes').fill('1500000');
 await p.locator('#plan-route').click();
 await p.waitForFunction(()=>{
  const status=document.querySelector('#recipe-status'),options=document.querySelector('#route-options');
  return options?.textContent.includes('Ruta calculada')||status?.classList.contains('error');
 });
 const recipe=await p.locator('#route-options').innerText(),status=await p.locator('#recipe-status').innerText();
 console.log('EYE_CONVERT_PRIMAL_ROUTE',JSON.stringify({seconds:(Date.now()-started)/1000,status,recipe}));
 assert(recipe.includes('Ruta calculada'),'App should find a Primal within the actual budget');
 const steps=await p.locator('.step').allInnerTexts();
 assert(steps.at(-1).includes("Firebird's Eye")&&steps.at(-1).includes('primal'),'Final must be natural Primal Eye');
 console.log('EYE_FULL_BROWSER_PASS',JSON.stringify({seed:'computed',route:recipe.split('\n')[0],historyRoute:'SSSSSRCSCR'}));
}catch(e){
 console.error('EYE_FULL_BROWSER_FAIL',e.stack||e);
 console.log('EYE_DEBUG',JSON.stringify({
  drop:await p.locator('#drop-status').innerText().catch(()=>null),
  recovery:await p.locator('#recovery-status').innerText().catch(()=>null),
  recipe:await p.locator('#recipe-status').innerText().catch(()=>null)}));
 process.exitCode=1;
}finally{await b.close()}
