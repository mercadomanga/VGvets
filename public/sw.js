const C='sr-v1';
const O=['https://softreset.dev','https://gh.softreset.dev','https://mirror.softreset.dev'];
const T=4000;

self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));

const ok=r=>r&&r.ok?r:Promise.reject();
const wait=ms=>new Promise((_,j)=>setTimeout(j,ms));
const copy=async r=>new Response(await r.blob(),{status:r.status,headers:{'Content-Type':r.headers.get('Content-Type')||'text/html; charset=utf-8'}});

async function handle(req){
  const u=new URL(req.url);
  const key=u.origin===self.location.origin?u.pathname+u.search:req.url;
  const cache=await caches.open(C);
  const main=fetch(req,{cache:'no-cache'}).then(ok);
  main.then(r=>cache.put(key,r.clone())).catch(()=>{});
  try{return await Promise.race([main,wait(T)])}catch{}
  const alt=O.filter(o=>o!==self.location.origin).map(o=>fetch(o+u.pathname+u.search,{mode:'cors',cache:'no-cache'}).then(ok).then(copy));
  const mir=Promise.any(alt).then(r=>{cache.put(key,r.clone()).catch(()=>{});return r});
  const old=mir.catch(()=>cache.match(key).then(c=>c||Promise.reject()));
  try{return await Promise.any([main,mir,old])}catch{}
  return main;
}

self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  if(new URL(r.url).origin!==self.location.origin)return;
  e.respondWith(handle(r));
});
