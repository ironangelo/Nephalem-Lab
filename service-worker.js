const CACHE='nephalem-lab-v0.4.1';
const ASSETS=['./','./index.html','./universal.html','./style.css','./manifest.webmanifest','./assets/icon.svg','./src/main.js','./src/engine.js','./src/coe-data.js','./src/i18n.js','./src/planner.js','./src/planner-worker.js','./src/season.js','./src/storage.js','./src/seed-worker.js','./src/universal-engine.js','./src/universal-recovery.js','./src/universal-planner.js','./src/universal-ui.js','./src/candidate-analysis.js','./src/observation-fields.js','./src/observation-model.js','./src/candidate-worker.js','./solver/scan.wasm','./assets/coe-sample-4081.csv'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!=='nephalem-d3-database-v1').map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 if(u.pathname.endsWith('/config/seasons.json')){e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok)return r;throw Error('manifest unavailable')}).catch(()=>caches.match(e.request)));return;}
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){let copy=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,copy));}return r;})));
});
