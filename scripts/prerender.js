const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const f=path.resolve(process.argv[2]||'public/index.html');const url='file://'+f;
const b=await chromium.launch();
const live=await b.newPage({viewport:{width:1280,height:900}});await live.goto(url);await live.waitForTimeout(500);
const r=await live.evaluate(()=>{document.querySelectorAll('#f-orig select').forEach(s=>s.value='');
const items=D.map((d,i)=>{const o={'@type':'Organization',name:d.n,description:(K[d.n]?'Known for '+K[d.n]+'. ':'')+'Founded by '+d.who+'. Background: '+d.ped+'.'};
if(d.y)o.foundingDate=String(d.y);if(d.loc&&d.loc!=='n/a')o.location=d.loc;if(W[d.n])o.url=W[d.n][0];
o.founder=d.who.split(/,\s*(?![^()]*\))/).map(x=>x.replace(/\s*\(.*?\)\s*/g,'').replace(/†.*$/,'').trim()).filter(Boolean).map(n=>({'@type':'Person',name:n}));
return {'@type':'ListItem',position:i+1,item:o}});
const upd=document.getElementById('upd').getAttribute('datetime');
return {upd,grid:document.getElementById('grid').innerHTML,cap:document.getElementById('cap-big').innerHTML,ms:document.getElementById('ms-big').innerHTML,
ld:{'@context':'https://schema.org','@graph':[{'@type':'WebSite','@id':'https://softreset.dev/#site',url:'https://softreset.dev/',name:'Soft Reset',inLanguage:'en',author:{'@type':'Person',name:'Nakuto',url:'https://bsky.app/profile/nakuto.eurosky.social'},license:'https://creativecommons.org/licenses/by/4.0/'},
{'@type':'CollectionPage','@id':'https://softreset.dev/#page',url:'https://softreset.dev/',name:document.title,description:document.querySelector('meta[name=description]').content,isPartOf:{'@id':'https://softreset.dev/#site'},dateModified:upd,
mainEntity:{'@type':'ItemList',name:'Game studios founded by industry veterans',numberOfItems:D.length,itemListElement:items}}]}}});
const ctx=await b.newContext({javaScriptEnabled:false});const st=await ctx.newPage();await st.goto(url);
const html=await st.evaluate(r=>{document.getElementById('grid').innerHTML=r.grid;document.getElementById('cap-big').innerHTML=r.cap;document.getElementById('ms-big').innerHTML=r.ms;
let s=document.querySelector('script[type="application/ld+json"]');if(!s){s=document.createElement('script');s.type='application/ld+json';document.head.appendChild(s)}
s.textContent=JSON.stringify(r.ld);return '<!doctype html>'+document.documentElement.outerHTML},r);
await b.close();fs.writeFileSync(f,html);
const sm=path.join(path.dirname(f),'sitemap.xml');if(fs.existsSync(sm))fs.writeFileSync(sm,fs.readFileSync(sm,'utf8').replace(/<lastmod>[^<]*<\/lastmod>/,'<lastmod>'+r.upd+'</lastmod>'));
console.log('prerendered',(r.grid.match(/<article/g)||[]).length,'studios',html.length,'bytes')})();
