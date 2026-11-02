// Offline-Cache für die Auslieferung über https. Bei file:// wird er nicht verwendet.
// Neue Version: wird im Hintergrund geladen und wartet, bis die App „Jetzt aktualisieren“ meldet (kein stiller Wechsel).
const C='baubuch-mzh-1.17.0-offline';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./bb-config.js'];
// Netz zuerst für Konfiguration und Startseite, Zwischenspeicher nur offline als Rückfall
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;if(/\/(bb-config\.js|index\.html|datenschutz\.html|nutzung\.html)$|\/$/.test(u.pathname)){e.stopImmediatePropagation();e.respondWith(fetch(e.request,{cache:'no-store'}).then(res=>{if(res.ok){const k=res.clone();caches.open(C).then(c=>c.put(e.request,k));}return res;}).catch(()=>caches.open(C).then(c=>c.match(e.request,{ignoreSearch:true}))));}});

self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))));});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('baubuch-mzh-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;e.respondWith(caches.open(C).then(c=>c.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res;}))));});
