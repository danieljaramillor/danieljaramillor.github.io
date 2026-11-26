const SetupKits=(()=>{
 const assistants=typeof AscensoAssistants!=='undefined'?AscensoAssistants:require('./assistants.js');
 const origin='https://danieljaramillor.com/ascenso/';
 const guide=origin+'AGENTS.md';
 const setupGuide='Leé la guía común '+guide+' para consultar las instrucciones y herramientas del kit. Revisá qué admite este asistente y conservá los archivos existentes. No actives cobros ni me pidas claves en el chat.\n\n';
 const bundle={label:'Todos los kits',download:'completo',name:'ascenso-completo'};
 const common='Ayudame a dar una primera prueba, con una pregunta concreta y una acción para hoy. Primero preguntame lo mínimo que falte. Separá conocimiento, tiempo y una respuesta que me pueda dar miedo recibir, sin diagnosticarme. Hacé brainstorming de tres opciones pequeñas y comparalas por esfuerzo, reversibilidad y aprendizaje. Elegimos una, definimos qué voy a observar y qué me haría seguir, ajustar o parar. No hagas una lista interminable de ideas. No inventes resultados ni presentes una respuesta simulada como una persona real.';
 const automationInstructions='Primero revisá las herramientas que este asistente realmente puede usar: correo, calendario, archivos, notas o transcripciones de reuniones, envíos y tareas. Distinguí conectado y comprobado, conectado pero sin permiso suficiente, disponible para conectar y no disponible; no inventes acceso ni confundas una app instalada con una conexión autorizada. Mostrame para qué serviría cada conexión útil y guiame de a una por el proceso nativo de autorización; no me pidas contraseñas ni claves en el chat ni me obligues a conectar todo. Empezá preguntando qué parte de mi rutina quiero revisar y qué fuentes o período autorizo consultar. Si falta una conexión, seguí con ejemplos que yo aporte.\nDespués buscá pequeñas tareas repetidas con evidencia, como preparar mi calendario, rastrear un envío, hacer seguimiento de un correo o recordar compromisos de reuniones. Separá lo observado de tus sugerencias; citá la fuente y su fecha sin copiar información privada innecesaria. Proponé hasta tres automatizaciones: qué tarea resuelven, qué información necesitan, cuándo se ejecutarían, qué entregarían y qué debo revisar yo. No inventes minutos ahorrados: estimá con supuestos visibles y ayudame a medir el tiempo antes y después.\nPara cada opción comprobá qué admite ESTA cuenta: ejecución manual, tarea programada, activación por evento o agente persistente. Una conversación abierta no es un agente que sigue trabajando. Verificá si la ejecución futura puede acceder a esas fuentes, dónde corre, si requiere mi computador encendido y qué límites o costos tiene. No prometas trabajo en segundo plano si no está disponible.\nElegimos una opción y preparás una prueba pequeña sin efectos externos. Antes de activarla, mostrame el pedido exacto, fuentes permitidas, frecuencia o evento, zona horaria, resultado esperado, lugar de entrega, regla para detenerse y cómo pausarla. Pedí mi aprobación para esa activación concreta; revisar conexiones o hacer el diagnóstico no autoriza crear tareas, enviar correos, mover reuniones ni activar pagos. Para seguimientos, empezá por borradores; distinguí compromisos míos de los de otros y verificá fechas. Para envíos, usá estados reales y fecha de consulta, y detené el seguimiento al entregarse o cancelarse. Solo después de la aprobación creá lo que las herramientas permitan y comprobá el identificador, la programación y el resultado de la prueba. Si no podés crearlo, dejá los pasos listos y decí qué falta; no digas que quedó funcionando. Cerrá con una primera acción fácil y una fecha para revisar si me ahorra tiempo.';
 const kits={negocio:{label:'Negocio',download:'de negocio',name:'ascenso-negocio',focus:'Quiero probar una idea de negocio. Distinguí opinión, uso, beta gratis, compromiso y compra. Una empresa que prueba gratis no valida por sí sola todo el mercado.'},vida:{label:'Personal y hobbies',download:'personal',name:'ascenso-vida',focus:'Quiero intentar algo personal o un hobby. Ayudame a experimentar con lo que ya tengo y evaluar si lo disfruto. No lo conviertas en un negocio ni en una obligación de productividad.'},automatizacion:{label:'Automatización',download:'de automatización',name:'ascenso-automatizacion',focus:'Quiero encontrar pequeñas tareas que pueda automatizar para ahorrar tiempo, con las herramientas que tenga conectadas a mi asistente de IA.',instructions:automationInstructions,start:'Empezá con un inventario breve de las conexiones que podés comprobar y preguntame qué rutina quiero revisar.'}};
 const tools={mirofish:{name:'MiroFish',url:'https://github.com/666ghj/MiroFish'},tinytroupe:{name:'TinyTroupe',url:'https://github.com/microsoft/TinyTroupe'},oasis:{name:'OASIS',url:'https://github.com/camel-ai/oasis'}};
 function prompt(kit,assistant,mode,goal=''){
  return setupGuide+(kit==='completo'?completePrompt(assistant,goal):buildPrompt(kit,assistant,mode,goal));
 }
 function completePrompt(assistant,goal){
  const code=assistants.get(assistant).code;
  const setup=code
   ? 'Usá solo este proyecto. Descargá '+origin+'kit-completo.zip y verificá su SHA-256 en '+origin+'kits/manifest.json. Revisá el ZIP y el instalador. Desde la carpeta descomprimida ejecutá python3 instalar_kits.py --kit todos --biblioteca --externas --assistant '+assistant+' --proyecto /ruta/al/proyecto --dry-run. Si los destinos son correctos repetí sin --dry-run. Comprobá qué skills reconoce el asistente. Guiame para preparar las herramientas que sean compatibles, según AGENTS.md y el entorno real.'
   : 'En '+assistants.get(assistant).name+', comprobá qué formas de guardar instrucciones o skills admite mi cuenta y guiame paso a paso. El paquete está en '+origin+'kit-completo.zip. Si requiere adjuntarlo, pedímelo. Prepará las skills y las herramientas compatibles con el entorno de esta cuenta. Si solo tenemos chat, usá las instrucciones disponibles como referencia y guiame para empezar con uno de los kits.';
  return 'Quiero instalar todos los kits de Ascenso. El paquete completo incluye los tres kits, 27 skills y guías para 14 herramientas. '+setup+' Decime qué quedó instalado y qué requiere configuración adicional. Conservá las versiones existentes y verificá cada resultado. Al terminar, preguntame si quiero probar una idea de negocio, empezar un proyecto personal o ahorrar tiempo con una automatización. Para automatizar, primero revisá las conexiones disponibles y prepará una prueba de la rutina elegida. La instalación no autoriza conectar cuentas, activar automatizaciones, enviar mensajes ni publicar.'+(goal.trim()?'\nMi objetivo: '+goal.trim():'');
 }
 function buildPrompt(kit,assistant,mode,goal=''){
  const k=kits[kit]||kits.negocio;const instructions=k.instructions||common;const idea=goal.trim()?'\nMi objetivo: '+goal.trim():'';const skill=origin+'kits/'+k.name+'/SKILL.md';
  if(mode==='paste')return k.focus+'\n\n'+instructions+idea+'\n\nLa skill de referencia está en '+skill+'. Si no podés abrir enlaces, estas instrucciones ya alcanzan para empezar. '+(k.start||'Empezá preguntándome qué quiero averiguar y qué me frena.');
  if(assistant==='codex')return 'Instalá el kit '+k.name+' en ESTE proyecto de Codex. Descargá '+origin+'kit-'+kit+'.zip y consultá su hash en '+origin+'kits/manifest.json. Antes de instalar, comprobá el hash y revisá los archivos: '+k.name+'/SKILL.md, EMPEZAR.txt e instalar_kits.py. No ejecutes código remoto sin revisarlo. El instalador es Python estándar, no usa red ni dependencias. Prepará primero un dry-run para la carpeta de proyecto actual y después instalá en .agents/skills/'+k.name+'/SKILL.md; conservá cualquier versión distinta que ya exista. No modifiques configuración global ni otros proyectos. Confirmá qué archivo quedó instalado. Si este asistente no tiene descargas o terminal, leé '+skill+' y usalo como instrucciones en esta conversación. Después usá $'+k.name+' para ayudarme a empezar.'+idea+'\n\n'+k.focus+'\n'+instructions;
  if(assistant==='claude-code')return 'Instalá el kit '+k.name+' en ESTE proyecto de Claude Code. Descargá '+origin+'kit-'+kit+'.zip y comprobá su hash en '+origin+'kits/manifest.json. Revisá el contenido y extraé el archivo '+k.name+'/SKILL.md. Creá .claude/skills/'+k.name+'/SKILL.md con ese contenido, conservando cualquier versión distinta que exista. No ejecutes instalar_kits.py para esta instalación individual. Esta skill solo necesita texto. No cambies configuración global ni otros proyectos. Comprobá que Claude Code reconoce la skill y explicame cómo usar /'+k.name+'. Si no tenés acceso a archivos o terminal, usá las instrucciones en esta conversación. Confirmá qué quedó instalado, sin inventarlo.'+idea+'\n\n'+k.focus+'\n'+instructions;
  if(assistant==='gemini')return 'Ayudame a guardar este kit como instrucciones reutilizables en Gemini. Revisá las opciones reales de mi cuenta: puede ofrecer Skills o Gems según la cuenta y la transición del producto. Guía oficial: https://support.google.com/gemini/answer/18560919. Prepará el nombre '+k.name+', una descripción y las instrucciones para copiar. Si hace falta que yo use Crear o suba un archivo, guiame paso a paso; no afirmes que lo guardaste solo porque me diste el texto. La referencia está en '+skill+'. Si esa función no está disponible, empezá en esta conversación con estas instrucciones:\n\n'+k.focus+'\n'+instructions+idea;
  if(assistant==='claude')return 'Ayudame a guardar una skill de Claude llamada '+k.name+'. Revisá qué opciones tiene esta cuenta para crear o subir una skill. Usá como referencia '+skill+' y la guía oficial https://support.claude.com/en/articles/12512198-how-to-create-custom-skills. Prepará el SKILL.md y guiame por los pasos que yo deba completar en Claude. No ejecutes el instalador Python del paquete, que está pensado para Codex. No afirmes que quedó guardada si no lo comprobaste. Si no podemos crearla, empecemos con estas instrucciones en la conversación:\n\n'+k.focus+'\n'+instructions+idea;
  if(assistant==='otro')return 'Ayudame a guardar estas instrucciones de una forma reutilizable que este asistente realmente admita, por ejemplo instrucciones de proyecto o un asistente personalizado. No asumas que puede instalar skills, ZIP ni librerías. Si hace falta que yo guarde algo, dame el texto listo y los pasos. Si no hay una opción para guardar, empecemos en esta conversación. Referencia: '+skill+'\n\n'+k.focus+'\n'+instructions+idea;
  return 'Creá una skill reutilizable llamada '+k.name+' a partir de estas instrucciones. Si tenés un creador de skills, por ejemplo @skill-creator, usalo; si no, ayudame a usar o guardar estas instrucciones con las opciones que realmente tenga esta cuenta. La skill está publicada en '+skill+' y el paquete se descarga de '+origin+'kit-'+kit+'.zip. No des por hecho que ChatGPT puede instalar un ZIP o ejecutar librerías locales: si no tengo esa función, empecemos en esta conversación con el texto de abajo. Confirmá qué quedó creado y cómo lo puedo volver a usar.\n\n'+k.focus+'\n'+instructions+idea;
 }
 function toolPrompt(id){const t=tools[id];return setupGuide+'Quiero preparar '+t.name+' para explorar hipótesis de una idea. Primero leé el README oficial: '+t.url+'. Explicame qué hace, sus límites y los requisitos actuales. Si tenés terminal y autorizaciones, prepará un entorno aislado en la carpeta que elija, descargá el repositorio oficial y seguí su instalación documentada. Antes de ejecutar, revisá los archivos y dependencias. No actives facturación, no pongas claves en el chat y no inventes integraciones disponibles. Si faltan credenciales, indicá cómo configurarlas de forma local y detené solo la parte que las necesita. Confirmá con una comprobación mínima qué quedó instalado. No ejecutes simulaciones de pago ni presentes resultados que no se hayan obtenido. Si no tenés terminal, dejame una guía paso a paso. La salida sintética se usará para preparar preguntas, no como evidencia de usuarios reales.'}
 return {kits,bundle,prompt,toolPrompt,assistants:assistants.all};
})();
if(typeof module!=='undefined')module.exports=SetupKits;
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);let kit='negocio',assistant='chatgpt',mode='paste',step=0;
 const query=new URLSearchParams(location.search);
 const selectedKit=query.get('kit');
 if(selectedKit==='completo'||Object.hasOwn(SetupKits.kits,selectedKit)){kit=selectedKit;step=1}
 const steps=Array.from(document.querySelectorAll('.setup-step'));
 const dots=Array.from(document.querySelectorAll('.wizard-dot'));
 const assistantInfo=AscensoAssistants;
 const selectedAssistant=query.get('assistant');
 if(Object.hasOwn(assistantInfo.all,selectedAssistant))assistant=selectedAssistant;
 function primaryMode(){return kit==='completo'?'install':'paste'}
 mode=primaryMode();
 function currentKit(){return kit==='completo'?SetupKits.bundle:SetupKits.kits[kit]}
 function moveStep(next,focus=true){
  step=Math.max(0,Math.min(2,next));
  steps.forEach((el,i)=>{el.hidden=i!==step});
  dots.forEach((el,i)=>{el.classList.toggle('is-active',i===step);el.classList.toggle('is-done',i<step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});
  $('setup-progress').textContent=(step+1)+' de 3 · '+['Tu kit','Tu asistente','Listo para pegar'][step];
  $('setup-back').hidden=step===0;
  $('setup-next').hidden=step===2;
  document.body.classList.toggle('setup-in-progress',step>0);
  if(focus)steps[step].querySelector('h2').focus();
 }
 function destination(){return assistantInfo.get(assistant).destination}
 function paint(){
  const k=currentKit();
  const a=assistantInfo.get(assistant);
  const complete=kit==='completo';
  document.querySelectorAll('[data-kit]').forEach(b=>b.setAttribute('aria-pressed',String(kit===b.dataset.kit)));
  document.querySelectorAll('[data-assistant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.assistant===assistant)));
  $('assistant-context').textContent=complete?'Elegí dónde querés preparar el paquete completo.':'Elegiste el kit «'+k.label+'».';
  $('summary-kit').textContent=k.label;
  $('summary-assistant').textContent=a.name;
  $('prompt').textContent=SetupKits.prompt(kit,assistant,mode);
  $('zip').href='kit-'+kit+'.zip';
  $('zip').textContent='Descargar ZIP '+k.download;
  $('skill').href=complete?'AGENTS.md':'kits/'+k.name+'/SKILL.md';
  $('skill').textContent=complete?'Leer la guía común':'Leer las instrucciones del kit';
  $('save-kit').hidden=complete;
  $('complete-option').hidden=complete;
  $('assistant-note').textContent=mode==='paste'
   ?'Este pedido se usa directamente en la conversación.'
   :'Tu asistente te guiará con la instalación o el guardado que permita tu cuenta.';
  $('copy').textContent=complete?'1. Copiar pedido para instalar todos':'1. Copiar para empezar';
  $('use-now').textContent=a.code?'Copiar pedido de instalación':'Copiar pedido para guardarlo';
  const nextAction=complete
   ?'Tu asistente revisará cómo preparar el paquete completo.'
   :kit==='automatizacion'
    ?'Tu asistente revisará las conexiones disponibles y la rutina que querés simplificar.'
    :'Tu asistente te preguntará qué querés probar.';
  $('next-instructions').textContent='Pegá el pedido y tocá Enviar. '+nextAction;
  $('status').textContent='';
  $('open-chatgpt').setAttribute('aria-disabled','true');
  $('open-chatgpt').tabIndex=-1;
  $('setup-manual').hidden=true;
  $('open-chatgpt').hidden=!a.url;
  $('open-chatgpt').href=a.url||'#';
  $('open-chatgpt').textContent='2. Abrir '+a.name;
  $('open-manual').hidden=!!a.url;
  $('open-manual').textContent='2. '+a.destination;
  $('paste-where').textContent=destination();
 }
 function readyToOpen(){$('open-chatgpt').removeAttribute('aria-disabled');$('open-chatgpt').removeAttribute('tabindex')}
 async function copy(id,status){const el=$(id);try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(el.textContent);$(status).textContent='Copiado. '+(id==='prompt'?destination()+' Después tocá Enviar.':'Pegalo en tu asistente y envialo.');if(id==='prompt')readyToOpen();}catch{if(id==='prompt'){$('setup-manual').hidden=false;$('setup-manual-text').value=el.textContent;$('setup-manual-text').focus();$('setup-manual-text').select();$(status).textContent='No se pudo copiar automáticamente. Copiá el texto de abajo y tocá «Ya copié el pedido».';}else{let parent=el.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}$(status).textContent='Mantené pulsado el texto del pedido y elegí Copiar.'}}}
 $('setup-manual-ready').onclick=()=>{readyToOpen();$('status').textContent='Abrí tu asistente, pegá el pedido y tocá Enviar.'};
 $('open-chatgpt').onclick=e=>{if($('open-chatgpt').getAttribute('aria-disabled')==='true')e.preventDefault()};
 document.querySelectorAll('[data-kit]').forEach(b=>b.onclick=()=>{kit=b.dataset.kit;mode=primaryMode();paint()});
 document.querySelectorAll('[data-assistant]').forEach(b=>b.onclick=()=>{assistant=b.dataset.assistant;mode=primaryMode();paint()});
 function backToChoices(){
  if(kit==='completo'){kit='negocio';mode=primaryMode();paint()}
  moveStep(0);
 }
 $('setup-next').onclick=()=>moveStep(step+1);
 $('setup-back').onclick=()=>step===1?backToChoices():moveStep(step-1);
 $('edit-setup').onclick=backToChoices;
 $('copy').onclick=()=>{mode=primaryMode();paint();copy('prompt','status')};$('use-now').onclick=()=>{mode='install';paint();copy('prompt','status')};
 $('tool').onchange=()=>{$('tool-prompt').textContent=SetupKits.toolPrompt($('tool').value);$('tool-status').textContent=''};$('copy-tool').onclick=()=>copy('tool-prompt','tool-status');
 $('tool').onchange();paint();moveStep(step,false);
}
