const V='ctq-v1', F='ctq-fonts';
const CORE=['./ctq-marcador-celular.html','./ctq-reloj.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==F).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(F).then(async c=>{
      const hit=await c.match(r);
      const net=fetch(r).then(x=>{ if(x.ok) c.put(r,x.clone()); return x; }).catch(()=>hit);
      return hit||net;
    })); return;
  }
  if(u.origin!==location.origin) return;
  e.respondWith(fetch(r).then(x=>{ if(x.ok){const cp=x.clone(); caches.open(V).then(c=>c.put(r,cp));} return x; })
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./ctq-marcador-celular.html'))));
});
