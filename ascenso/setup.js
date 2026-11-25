const SetupKits=(()=>{
 const origin='https://danieljaramillor.com/ascenso/';
 const common='Ayudame a dar una primera prueba, con una pregunta concreta y una acción para hoy. Primero preguntame lo mínimo que falte. Separá conocimiento, tiempo y una respuesta que me pueda dar miedo recibir, sin diagnosticarme. Hacé brainstorming de tres opciones pequeñas y comparalas por esfuerzo, reversibilidad y aprendizaje. Elegimos una, definimos qué voy a observar y qué me haría seguir, ajustar o parar. No hagas una lista interminable de ideas. No inventes resultados ni presentes una respuesta simulada como una persona real.';
 const kits={negocio:{name:'ascenso-negocio',focus:'Quiero probar una idea de negocio. Distinguí opinión, uso, beta gratis, compromiso y compra. Una empresa que prueba gratis no valida por sí sola todo el mercado.'},vida:{name:'ascenso-vida',focus:'Quiero intentar algo personal o un hobby. Ayudame a experimentar con lo que ya tengo y evaluar si lo disfruto. No lo conviertas en un negocio ni en una obligación de productividad.'}};
 const tools={mirofish:{name:'MiroFish',url:'https://github.com/666ghj/MiroFish'},tinytroupe:{name:'TinyTroupe',url:'https://github.com/microsoft/TinyTroupe'},oasis:{name:'OASIS',url:'https://github.com/camel-ai/oasis'}};
 function prompt(kit,assistant,mode,goal=''){
  const k=kits[kit];const idea=goal.trim()?'\nMi idea: '+goal.trim():'';const skill=origin+'kits/'+k.name+'/SKILL.md';
  if(mode==='paste')return k.focus+'\n\n'+common+idea+'\n\nLa skill de referencia está en '+skill+'. Si no podés abrir enlaces, estas instrucciones ya alcanzan para empezar. Empezá preguntándome qué quiero averiguar y qué me frena.';
  if(assistant==='codex')return 'Instalá el kit '+k.name+' en ESTE proyecto de Codex. Descargá '+origin+'kit-'+kit+'.zip y consultá su hash en '+origin+'kits/manifest.json. Antes de instalar, comprobá el hash y revisá los archivos: '+k.name+'/SKILL.md, EMPEZAR.txt e instalar_kits.py. No ejecutes código remoto sin revisarlo. El instalador es Python estándar, no usa red ni dependencias. Prepará primero un dry-run para la carpeta de proyecto actual y después instalá en .agents/skills/'+k.name+'/SKILL.md; conservá cualquier versión distinta que ya exista. No modifiques configuración global ni otros proyectos. Confirmá qué archivo quedó instalado. Si este asistente no tiene descargas o terminal, leé '+skill+' y usalo como instrucciones en esta conversación. Después usá $'+k.name+' para ayudarme a empezar.'+idea;
  return 'Creá una skill reutilizable llamada '+k.name+' a partir de estas instrucciones. Si tenés un creador de skills, por ejemplo @skill-creator, usalo; si no, ayudame a usar o guardar estas instrucciones con las opciones que realmente tenga esta cuenta. La skill está publicada en '+skill+' y el paquete se descarga de '+origin+'kit-'+kit+'.zip. No des por hecho que ChatGPT puede instalar un ZIP o ejecutar librerías locales: si no tengo esa función, empecemos en esta conversación con el texto de abajo. Confirmá qué quedó creado y cómo lo puedo volver a usar.\n\n'+k.focus+'\n'+common+idea;
 }
 function toolPrompt(id){const t=tools[id];return 'Quiero preparar '+t.name+' para explorar hipótesis de una idea. Primero leé el README oficial: '+t.url+'. Explicame qué hace, sus límites y los requisitos actuales. Si tenés terminal y autorizaciones, prepará un entorno aislado en la carpeta que elija, descargá el repositorio oficial y seguí su instalación documentada. Antes de ejecutar, revisá los archivos y dependencias. No actives facturación, no pongas claves en el chat y no inventes integraciones disponibles. Si faltan credenciales, indicá cómo configurarlas de forma local y detené solo la parte que las necesita. Confirmá con una comprobación mínima qué quedó instalado. No ejecutes simulaciones de pago ni presentes resultados que no se hayan obtenido. Si no tenés terminal, dejame una guía paso a paso. La salida sintética se usará para preparar preguntas, no como evidencia de usuarios reales.'}
 return {kits,prompt,toolPrompt};
})();
if(typeof module!=='undefined')module.exports=SetupKits;
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);let kit='negocio',assistant='chatgpt',mode='paste',step=0;
 const selectedKit=new URLSearchParams(location.search).get('kit');if(selectedKit==='negocio'||selectedKit==='vida'){kit=selectedKit;step=1}
 const steps=Array.from(document.querySelectorAll('.setup-step'));
 const dots=Array.from(document.querySelectorAll('.wizard-dot'));
 const assistantNames={chatgpt:'ChatGPT',codex:'Codex',otro:'Otro asistente'};
 function moveStep(next,focus=true){
  step=Math.max(0,Math.min(2,next));steps.forEach((el,i)=>{el.hidden=i!==step});
  dots.forEach((el,i)=>{el.classList.toggle('is-active',i===step);el.classList.toggle('is-done',i<step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});
  $('setup-progress').textContent=(step+1)+' de 3 · '+['Tu kit','Tu asistente','Listo para pegar'][step];
  $('setup-back').hidden=step===0;$('setup-next').hidden=step===2;
  if(focus)steps[step].querySelector('h2').focus();
 }
 function primaryMode(){return assistant==='codex'?'install':'paste'}
 function destination(){return assistant==='codex'?'Pegalo en el chat de tu proyecto en Codex.':assistant==='chatgpt'?'Pegalo en una conversación de ChatGPT.':'Pegalo en tu asistente y seguí sus pasos.'}
 function paint(){
  const k=SetupKits.kits[kit];$('business').setAttribute('aria-pressed',String(kit==='negocio'));$('life').setAttribute('aria-pressed',String(kit==='vida'));
  document.querySelectorAll('[data-assistant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.assistant===assistant)));
  $('summary-kit').textContent=kit==='vida'?'Personal y hobbies':'Negocio';$('summary-assistant').textContent=assistantNames[assistant];
  $('prompt').textContent=SetupKits.prompt(kit,assistant,mode);$('zip').href='kit-'+kit+'.zip';$('zip').textContent='Descargar ZIP '+(kit==='vida'?'personal':'de negocio');$('skill').href='kits/'+k.name+'/SKILL.md';
  $('assistant-note').textContent=mode==='paste'?'Este pedido usa el kit como instrucciones en la conversación. No necesitás instalarlo.':assistant==='codex'?'El pedido le indica a Codex cómo revisar e instalar el kit en tu proyecto. Codex te confirma qué quedó preparado.':'Tu asistente puede guardarlo como skill si tiene esa función. Si no, el pedido le permite empezar con las instrucciones en la conversación.';
  $('copy').textContent=assistant==='codex'?'1. Copiar pedido de instalación':'1. Copiar para empezar';$('use-now').textContent=assistant==='codex'?'Copiar para usar sin instalar':'Copiar pedido para guardarlo';$('save-title').textContent=assistant==='codex'?'¿Preferís usarlo sin instalar?':'¿Querés guardarlo para otra vez?';$('next-instructions').textContent=assistant==='codex'?'En el chat del proyecto: pegá el pedido y envialo. Codex te confirmará qué preparó y te ayudará a empezar.':'En el chat: mantené pulsado el cuadro de mensaje, elegí Pegar y tocá Enviar. El asistente te preguntará qué querés probar y qué te frena.';$('status').textContent='';$('open-chatgpt').setAttribute('aria-disabled','true');$('open-chatgpt').tabIndex=-1;$('setup-manual').hidden=true;$('open-chatgpt').hidden=assistant!=='chatgpt';$('paste-where').textContent=destination();
 }
 function readyToOpen(){$('open-chatgpt').removeAttribute('aria-disabled');$('open-chatgpt').removeAttribute('tabindex')}
 async function copy(id,status){const el=$(id);try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(el.textContent);$(status).textContent='Copiado. '+(id==='prompt'?destination()+' Después tocá Enviar.':'Pegalo en tu asistente y envialo.');if(id==='prompt')readyToOpen();}catch{if(id==='prompt'){$('setup-manual').hidden=false;$('setup-manual-text').value=el.textContent;$('setup-manual-text').focus();$('setup-manual-text').select();$(status).textContent='No se pudo copiar automáticamente. Copiá el texto de abajo y tocá «Ya copié el pedido».';}else{let parent=el.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}$(status).textContent='Mantené pulsado el texto del pedido y elegí Copiar.'}}}
 $('setup-manual-ready').onclick=()=>{readyToOpen();$('status').textContent='Abrí tu asistente, pegá el pedido y tocá Enviar.'};
 $('open-chatgpt').onclick=e=>{if($('open-chatgpt').getAttribute('aria-disabled')==='true')e.preventDefault()};
 $('business').onclick=()=>{kit='negocio';mode=primaryMode();paint()};$('life').onclick=()=>{kit='vida';mode=primaryMode();paint()};
 document.querySelectorAll('[data-assistant]').forEach(b=>b.onclick=()=>{assistant=b.dataset.assistant;mode=primaryMode();paint()});
 $('setup-next').onclick=()=>moveStep(step+1);$('setup-back').onclick=()=>moveStep(step-1);$('edit-setup').onclick=()=>moveStep(0);
 $('copy').onclick=()=>{mode=primaryMode();paint();copy('prompt','status')};$('use-now').onclick=()=>{mode=primaryMode()==='install'?'paste':'install';paint();copy('prompt','status')};
 $('tool').onchange=()=>{$('tool-prompt').textContent=SetupKits.toolPrompt($('tool').value);$('tool-status').textContent=''};$('copy-tool').onclick=()=>copy('tool-prompt','tool-status');
 $('tool').onchange();paint();moveStep(step,false);
}
