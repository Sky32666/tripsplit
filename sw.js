// 旅账 · service worker：离线缓存 + 锁屏推送
const C='lvzhang-v9';
const FILES=['./','index.html','config.js','manifest.webmanifest','icon.svg','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname==='cdn.jsdelivr.net'){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(err){d={title:'旅账',body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'旅账',{body:d.body||'',icon:'icon-180.png',badge:'icon-180.png',tag:d.tag||undefined,renotify:!!d.tag,data:{url:d.url||''}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const rel=(e.notification.data&&e.notification.data.url)||'';
  const url=new URL('./'+rel,self.registration.scope).href;
  e.waitUntil((async()=>{
    const wins=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const w of wins){w.postMessage({open:rel});return w.focus()}
    return self.clients.openWindow(url);
  })());
});
