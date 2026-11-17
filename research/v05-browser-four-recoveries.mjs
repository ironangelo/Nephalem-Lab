/* Additional real-person browser fixture runs; no hidden seed is passed to web UI.
 * Inputs below are literal typed-out screenshot observations from real Switch.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const cases={
 squirt:{
  item:"Squirt's Necklace",
  drop:'Int: 711\nCriticalD: 60\nDamageBonusCold: 20\nGold: 79\nExperience: 200',
  first:{quality:'normal',input:'DamageBonusCold: 19\nInt: 641\nHaste: 7\nCriticalD: 81\nGold: 74\nExperience: 168'},
  expected:'800657787'
 },
 deathwish:{
  item:'Deathwish',
  drop:'Power: 250\nInt: 652\nVit: 726\nHaste: 6\nKillLife: 7904',
  first:{quality:'normal',input:'Power: 253\nInt: 715\nFireD: 1096-1361\nVit: 701\nSplashDamage: 18\nWeaponHitStun1h: 1.6'},
  expected:'46826983'
 },
 breast:{
  item:"Firebird's Breast",
  drop:'Int: 416\nLife: 10\nExperience: 198\nGoldPickUpRadius: 2\nSkill_Wizard_ExplosiveBlast: 11\nSockets: 3',
  first:{quality:'normal',input:'Int: 456\nVit: 484\nLightningResist: 149\nThorns: 5366\nSkill_Wizard_ExplosiveBlast: 13\nSockets: 3'},
  expected:'2645309652'
 },
 zodiac:{
  item:'Obsidian Ring of the Zodiac',
  drop:'CooldownReduction: 7\nHaste: 7\nCriticalChance: 4.5\nResourceCostReduction: 5\nArcaneResist: 144',
  first:{quality:'ancient',input:'CooldownReduction: 5\nHaste: 6\nCriticalChance: 5.5\nResourceCostReduction: 6\nLightningResist: 206'},
  second:{quality:'normal',input:'CooldownReduction: 7\nHaste: 7\nCriticalChance: 5.5\nResourceCostReduction: 7\nPoisonResist: 147'},
  expected:'1805687870'
 }
};
const key=process.env.FIXTURE||'squirt',test=cases[key];
if(!test)throw Error('Unknown fixture '+key);
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--no-sandbox']});
const page=await browser.newPage({viewport:{width:1120,height:850},locale:'es-CL'});
page.setDefaultTimeout(1800000);
page.on('pageerror',e=>console.log('CASE_PAGEERROR',key,e.message));
let started=Date.now();
try{
 await page.goto('http://127.0.0.1:8080/lab-v05.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#db-status')?.textContent.includes('Base cargada'));
 await page.locator('#hero').selectOption({label:'Wizard'});
 await page.locator('#item').fill(test.item);await page.locator('#item').dispatchEvent('change');
 await page.locator('#drop-text').fill(test.drop);await page.locator('#save-drop').click();
 const saved=await page.locator('#drop-status').innerText();
 console.log('V05_CASE_DROP',JSON.stringify({case:key,saved}));
 assert(saved.includes('guardado'),test.item+' original drop must be entered by UI user');
 await page.locator('#reforge-quality').selectOption(test.first.quality);
 await page.locator('#reforge-text').fill(test.first.input);
 await page.locator('#recover').click();
 await page.waitForFunction(()=>{
  const e=document.querySelector('#recovery-status'),t=e?.textContent||'';
  return t.includes('SEED ÚNICA IDENTIFICADA')||t.includes('seeds todavía posibles')||
   e?.classList.contains('error');
 });
 let status=await page.locator('#recovery-status').innerText();
 console.log('V05_CASE_FIRST_R',JSON.stringify({case:key,seconds:(Date.now()-started)/1000,status}));
 if(test.second){
  assert(status.includes('seeds todavía posibles'),test.item+' should request another R if first is ambiguous');
  await page.locator('#reforge-quality').selectOption(test.second.quality);
  await page.locator('#reforge-text').fill(test.second.input);
  await page.locator('#recover').click();
  await page.waitForFunction(()=>document.querySelector('#recovery-status')?.textContent.includes('SEED ÚNICA IDENTIFICADA')||document.querySelector('#recovery-status')?.classList.contains('error'));
  status=await page.locator('#recovery-status').innerText();
  console.log('V05_CASE_SECOND_R',JSON.stringify({case:key,seconds:(Date.now()-started)/1000,status}));
 }
 assert(status.includes('SEED ÚNICA IDENTIFICADA'),test.item+' should recover exactly one current seed');
 assert(status.includes(test.expected),test.item+' must recover the right current seed without injecting it');
 console.log('V05_CASE_FULL_RECOVERY_PASS',JSON.stringify({case:key,expected:test.expected,seconds:(Date.now()-started)/1000}));
}catch(err){
 console.error('V05_CASE_FAIL',key,String(err.stack||err));
 console.log('V05_CASE_DIAGNOSTIC',JSON.stringify({
  drop:await page.locator('#drop-status').innerText().catch(()=>null),
  recovery:await page.locator('#recovery-status').innerText().catch(()=>null)
 }));
 process.exitCode=1;
}finally{await browser.close()}
