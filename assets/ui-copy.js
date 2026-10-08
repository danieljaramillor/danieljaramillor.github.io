(() => {
  const root=document.documentElement;
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.career-link').forEach(a=>a.addEventListener('click',()=>{const row=document.querySelector(a.getAttribute('href'));row.classList.add('is-open');const b=row.querySelector('.part__toggle');if(b){b.setAttribute('aria-expanded','true');b.textContent='−';}if(window.ScrollTrigger)ScrollTrigger.refresh();}));
  function go(target,immediate=false){
    target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
    const offset=target.id==='top'?0:-(document.querySelector('.nav').offsetHeight+18);
    if(window.__lenis)window.__lenis.scrollTo(target,{offset,duration:1.1,immediate});
    else window.scrollTo({top:target.getBoundingClientRect().top+scrollY+offset,behavior:immediate||reduced()?'instant':'smooth'});
  }
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();
    try{history.replaceState(null,'',a.getAttribute('href'));}catch(e){}go(target);
  }));
  let restore=null;try{restore=sessionStorage.getItem('dj-return-section');sessionStorage.removeItem('dj-return-section');}catch(e){}
  if(restore&&restore!=='top'){const ready=document.readyState==='complete'?Promise.resolve():new Promise(r=>addEventListener('load',r,{once:true}));ready.then(()=>setTimeout(()=>{const target=document.getElementById(restore);if(target){window.ScrollTrigger?.refresh();go(target,true);}},3200));}
  const search=document.getElementById('shelfQ'),clear=document.querySelector('.search-clear');
  search.addEventListener('input',()=>{clear.hidden=!search.value;});clear.addEventListener('click',()=>{search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));search.focus();});
  for(const id of ['showcase','picks']){
    const row=document.getElementById(id),buttons=[...document.querySelectorAll(`[data-browse="${id}"]`)];
    const update=()=>buttons.forEach(b=>b.disabled=Number(b.dataset.direction)<0?row.scrollLeft<2:row.scrollLeft>=row.scrollWidth-row.clientWidth-2);
    buttons.forEach(b=>b.addEventListener('click',()=>{const children=row.children,step=children.length>1?children[1].offsetLeft-children[0].offsetLeft:row.clientWidth;const next=Math.round(row.scrollLeft/step)+Number(b.dataset.direction);row.scrollTo({left:Math.max(0,next*step),behavior:reduced()?'instant':'smooth'});}));
    row.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(row);new MutationObserver(update).observe(row,{childList:true});update();
  }
  // Attribute copy and canonical destinations must also track reduced-motion language changes.
  const labels=new Map([['Daniel Jaramillo, back to top','Daniel Jaramillo, volver al inicio'],['Sections','Secciones'],['Language','Idioma'],['Menu','Menú'],['Introduction','Introducción'],['Selected experience','Experiencia seleccionada'],['Sort','Ordenar'],['Elsewhere','Otros enlaces'],['I delete nothing. I archive.','No borro nada. Archivo.']]);
  const attrs=[...document.querySelectorAll('[aria-label]')].map(n=>[n,n.getAttribute('aria-label')]);
  const altEs=['Daniel Jaramillo en Times Square, sosteniendo sus gafas de sol','Página de inicio de PlatApp: contale lo que gastaste y se encarga del resto','Pipmori: un pequeño compañero luminoso junto a su casa, en una colina de noche','Página de inicio de Copiloto: Para que despegues','Nuevo sitio de Raíz & Co.: Rooted in purpose. Built for scale.','Sitio de Coffea Project: café hecho para los muchos'];
  const imgs=[...document.images].map((n,i)=>[n,n.alt,altEs[i]||n.alt]);
  function language(){const es=root.lang==='es';attrs.forEach(([n,en])=>{if(labels.has(en))n.setAttribute('aria-label',es?labels.get(en):en);});imgs.forEach(([n,en,sp])=>n.alt=es?sp:en);
    const description=es?'Daniel Jaramillo ayuda a fundadores a construir productos y la operación que los sostiene. Founder’s Office, liderazgo de producto y asesoría.':'Daniel Jaramillo helps founders build products and the operations behind them. Founder’s Office, product leadership, fractional leadership and advisory.';
    document.querySelector('meta[name="description"]').content=description;document.querySelector('meta[property="og:description"]').content=description;document.querySelector('meta[property="og:title"]').content=document.title;
    document.querySelectorAll('.col').forEach(c=>c.querySelector('button').setAttribute('aria-label',c.dataset.n+' — '+c.querySelector('.col__t').textContent));document.querySelectorAll('.part').forEach(c=>c.querySelector('.part__toggle')?.setAttribute('aria-label',c.querySelector('h3').textContent));
    const data=window.DJ_ESSAYS?.essays||[];const map=new Map();data.forEach(e=>{map.set(e.url,e);if(e.en)map.set(e.en.url,e);});document.querySelectorAll('a[href*="substack.com"]').forEach(a=>{const e=map.get(a.href);if(e)a.href=es?e.url:(e.en?.url||e.url);else if(/substack.com\/?$/.test(a.href))a.href=es?'https://danieljaramillor.substack.com/':'https://danieljaramilloren.substack.com/';});document.querySelectorAll('.col[data-href]').forEach(c=>{const e=map.get(c.dataset.href);if(e)c.dataset.href=es?e.url:(e.en?.url||e.url);});
    document.querySelector('.roast__head').textContent=es?'Perfil de tueste · Coffea':'Roast profile · Coffea';const terms=es?['PUNTO DE RETORNO','PRIMER CRACK','DESCARGA','TEMP. DEL GRANO ── · TASA DE AUMENTO - -']:['TURNING POINT','FIRST CRACK','DROP','BEAN TEMP ── · RATE OF RISE - -'];document.querySelectorAll('.roast__lbl').forEach((n,i)=>n.textContent=terms[i]);
  }
  document.addEventListener('essays-ready',language);
  new MutationObserver(language).observe(root,{attributes:true,attributeFilter:['lang']});language();
})();
