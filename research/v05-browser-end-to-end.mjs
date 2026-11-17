/* Real browser end-to-end. No manual current seed is ever injected.
 * Acts like a user: select item, enter original drop values, save, enter
 * REAL Reforge tooltip, ask app to recover, then ask it to SEARCH a recipe.
 * The expected seed/path live only in assertions, never in app data.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
mkdirSync('/tmp/v05-browser-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--no-sandbox']});
const page=await browser.newPage({viewport:{width:1130,height:900},locale:'es-CL'});
page.setDefaultTimeout(1800000);
page.on('console',msg=>{if(['error','warning'].includes(msg.type()))console.log('BROWSER_CONSOLE',msg.type(),msg.text().slice(0,500));});
page.on('pageerror',err=>console.log('BROWSER_PAGEERROR',err.message));
const t0=Date.now();
try{
 await page.goto('http://127.0.0.1:8080/lab-v05.html',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>document.querySelector('#db-status')?.textContent.includes('Base cargada'),{timeout:90000});
 console.log('BROWSER_LOADED',Date.now()-t0);
 await page.locator('#hero').selectOption({label:'Wizard'});
 await page.locator('#item').fill("Firebird's Down");
 await page.locator('#item').dispatchEvent('change');
 await page.locator('#drop-text').fill('Int: 422\nResistAll: 96\nSockets: 2\nSkill_Wizard_SpectralBlade: 15');
 await page.locator('#save-drop').click();
 const dropStatus=await page.locator('#drop-status').innerText();
 console.log('BROWSER_DROP_SAVED',dropStatus);
 assert(dropStatus.includes('guardado'),'Drop must be saved as an observation');
 await page.locator('#reforge-quality').selectOption('normal');
 await page.locator('#reforge-text').fill('Int: 460\nResistAll: 93\nSkill_Wizard_SpectralBlade: 14\nGold: 33\nThorns: 2748\nSockets: 2');
 await page.locator('#recover').click();
 await page.waitForFunction(()=>{
  const el=document.querySelector('#recovery-status');
  return !!el&&(el.textContent.includes('SEED ÚNICA IDENTIFICADA')||el.classList.contains('error'));
 },{timeout:1200000});
 const result=await page.locator('#recovery-status').innerText();
 console.log('BROWSER_REF_ORGE_RECOVERY',JSON.stringify({elapsedSec:(Date.now()-t0)/1000,result}));
 await page.screenshot({path:'/tmp/v05-browser-artifacts/1-seed-recovery.png',fullPage:true});
 assert(result.includes('SEED ÚNICA IDENTIFICADA'),'A unique real Reforge seed is required');
 assert(result.includes('1745067528'),'Must independently recover actual Firebird Down seed');
 await page.locator('#budget-souls').fill('150');
 await page.locator('#budget-crucibles').fill('3');
 await page.locator('#budget-breaths').fill('50');
 await page.locator('#budget-act').fill('10');
 await page.locator('#budget-nodes').fill('1500000');
 await page.locator('#budget-steps').fill('18');
 await page.locator('#plan-route').click();
 await page.waitForFunction(()=>{
  const status=document.querySelector('#recipe-status'),options=document.querySelector('#route-options');
  return !!(status&&options)&&(options.textContent.includes('Ruta calculada')||status.classList.contains('error'));
 },{timeout:1200000});
 const routeStatus=await page.locator('#route-options').innerText();
 const calcStatus=await page.locator('#recipe-status').innerText();
 console.log('BROWSER_PRIMAL_ROUTE',JSON.stringify({elapsedSec:(Date.now()-t0)/1000,status:calcStatus,result:routeStatus}));
 await page.screenshot({path:'/tmp/v05-browser-artifacts/2-real-route.png',fullPage:true});
 assert(routeStatus.includes('CCRSCCSSCR'),'Browser UI must discover the ACTUAL successful path');
 assert(routeStatus.includes('150 Forgotten Souls'),'Match actual budgeted route cost');
 assert.equal(await page.locator('.v05-confirm').count(),10,'Ten predicted game checkpoints');
 const list=await page.locator('.step').allInnerTexts();
 assert(list.at(-1).includes("Firebird's Down")&&list.at(-1).includes('primal'),'Must end on exact natural Primal pants');
 console.log('V05_BROWSER_E2E_SUCCESS',JSON.stringify({seed:'computed',recipe:'computed',cases:['real Firebird Down'],ms:Date.now()-t0}));
}catch(err){
 console.error('V05_BROWSER_E2E_FAILURE',err.stack||err);
 await page.screenshot({path:'/tmp/v05-browser-artifacts/failure.png',fullPage:true}).catch(()=>{});
 console.error('BROWSER_CURRENT',JSON.stringify({drop:await page.locator('#drop-status').innerText().catch(()=>null),seed:await page.locator('#recovery-status').innerText().catch(()=>null),recipe:await page.locator('#recipe-status').innerText().catch(()=>null)}));
 process.exitCode=1;
}finally{await browser.close()}
