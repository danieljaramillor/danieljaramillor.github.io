const SetupKits=(()=>{
 const assistants=typeof AscensoAssistants!=='undefined'?AscensoAssistants:require('./assistants.js');
 const origin='https://danieljaramillor.com/ascenso/';
 const guide=origin+'AGENTS.md';
 const setupGuide='Leé la guía común '+guide+' para consultar las instrucciones y herramientas del kit. Comprobá el modo o superficie, las herramientas y permisos disponibles; no deduzcas capacidades solo porque el plan sea pago. Si algo no podés comprobarlo, decilo y preguntá solo lo imprescindible. Si solo podés conversar, ayudame con el plan y los pasos manuales; no anuncies instalaciones o automatizaciones. No contrates un plan ni cambies mi modo o permisos sin que yo lo elija. Revisá qué admite este asistente y conservá los archivos existentes. Guardar instrucciones no instala librerías, no conecta cuentas y no activa tareas por sí solo. No actives cobros ni me pidas claves en el chat.\n\n';
 const capabilities={
  chatgpt:{title:'ChatGPT · recomendamos plan pago + Work',detail:'Para delegar el recorrido completo, elegí Work si tu cuenta lo incluye. En Chat podés empezar con la idea y el plan; la instalación y la ejecución dependen de las herramientas disponibles. El plan, la app y los permisos pueden limitar funciones.',url:'https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex',instruction:'En ChatGPT, distinguí Chat de Work. Para preparar archivos, instalar o ejecutar, comprobá si estamos en Work y qué herramientas tiene esta sesión. Si estamos en Chat sin esas capacidades, dejame un plan usable y explicá cómo abrir Work si mi cuenta lo permite; no afirmes que cambiaste de modo. Un plan pago no prueba que esté en Work.'},
  claude:{title:'Claude · Skills y Cowork son rutas distintas',detail:'Skills puede estar disponible incluso en Free si está habilitada la ejecución de código. Para delegar tareas con Cowork hace falta un plan pago compatible y acceso habilitado. Si solo tenés chat, empezá con las instrucciones y guardá lo que permita tu cuenta.',url:'https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile',instruction:'En Claude, separá guardar una skill de delegar una tarea en Cowork. Comprobá ejecución de código para Skills y acceso a Cowork si hace falta trabajar con archivos o herramientas. No asumas que todas las cuentas requieren pagar para guardar una skill ni que pagar habilita todas las funciones.'},
  gemini:{title:'Gemini · verificá Skills, apps y tareas disponibles',detail:'Gemini sigue su propia ruta: no usa el modo Work de ChatGPT. Importá Skills en web o Mac si tu cuenta ofrece la opción; Gems depende de la transición de tu cuenta. Conexiones, tareas programadas y ejecución se comprueban por separado.',url:'https://support.google.com/gemini/answer/18560919?hl=en',instruction:'En Gemini, comprobá Skills o Gems y apps conectadas reales; no busques un modo Work de ChatGPT. Una skill guardada no instala librerías ni habilita todas las herramientas. Si no hay terminal o ejecución compatible, prepará instrucciones y una alternativa manual; no prometas instalar el paquete completo dentro del chat.'},
  'claude-code':{title:'Claude Code · proyecto con archivos y terminal',detail:'Usalo en el proyecto donde quieras guardar las skills. Comprobá acceso, terminal, red y permisos; tu cuenta o forma de autenticación define el uso disponible. Instalar instrucciones no inicia servicios ni configura tus cuentas.',url:'https://code.claude.com/docs/en/skills',instruction:'En Claude Code, comprobá el proyecto, archivos, terminal, red y permisos actuales antes de instalar. No confundas Claude Code con Cowork ni con el modo Work de ChatGPT.'},
  codex:{title:'Codex · proyecto con capacidades comprobadas',detail:'Codex es el recorrido técnico: puede preparar archivos y ejecutar comandos cuando el entorno lo permite. La disponibilidad y el uso dependen del plan, la autenticación y los permisos; no alcanza con copiar el pedido en un chat sin esas herramientas.',url:'https://learn.chatgpt.com/docs/build-skills',instruction:'En Codex, comprobá proyecto, archivos, terminal, red y permisos actuales. Distinguí el entorno del proyecto de un chat que solo puede responder con texto. No deduzcas ejecución persistente ni acceso a APIs a partir de la suscripción.'},
  otro:{title:'Tu asistente · comprobá qué puede hacer',detail:'Podés usar el pedido como instrucciones en una conversación. Para guardar, instalar o automatizar, necesitás funciones compatibles y permisos reales. No hay un plan pago ni un modo Work universal para todas las IAs.',url:'https://danieljaramillor.com/ascenso/AGENTS.md',instruction:'En este asistente, identificá la forma real de guardar instrucciones, acceder a archivos y ejecutar tareas. No asumas Skills, un modo Work, terminal ni conectores. Si solo podés conversar, ayudame con un plan y los pasos que debo hacer yo.'}
 };
 function capability(assistant){return capabilities[Object.hasOwn(capabilities,assistant)?assistant:'otro']}
 const bundle={label:'Todos los kits',download:'completo',name:'ascenso-completo'};
 const common='Ayudame a dar una primera prueba, con una pregunta concreta y una acción para hoy. Primero preguntame lo mínimo que falte. Separá conocimiento, tiempo y una respuesta que me pueda dar miedo recibir, sin diagnosticarme. Hacé brainstorming de tres opciones pequeñas y comparalas por esfuerzo, reversibilidad y aprendizaje. Elegimos una, definimos qué voy a observar y qué me haría seguir, ajustar o parar. No hagas una lista interminable de ideas. No inventes resultados ni presentes una respuesta simulada como una persona real.';
 const automationInstructions='Primero revisá las herramientas que este asistente realmente puede usar: correo, calendario, archivos, notas o transcripciones de reuniones, envíos y tareas. Distinguí conectado y comprobado, conectado pero sin permiso suficiente, disponible para conectar y no disponible; no inventes acceso ni confundas una app instalada con una conexión autorizada. Mostrame para qué serviría cada conexión útil y guiame de a una por el proceso nativo de autorización; no me pidas contraseñas ni claves en el chat ni me obligues a conectar todo. Empezá preguntando qué parte de mi rutina quiero revisar y qué fuentes o período autorizo consultar. Si falta una conexión, seguí con ejemplos que yo aporte.\nDespués buscá pequeñas tareas repetidas con evidencia, como preparar mi calendario, rastrear un envío, hacer seguimiento de un correo o recordar compromisos de reuniones. Separá lo observado de tus sugerencias; citá la fuente y su fecha sin copiar información privada innecesaria. Proponé hasta tres automatizaciones: qué tarea resuelven, qué información necesitan, cuándo se ejecutarían, qué entregarían y qué debo revisar yo. No inventes minutos ahorrados: estimá con supuestos visibles y ayudame a medir el tiempo antes y después.\nPara cada opción comprobá qué admite ESTA cuenta: ejecución manual, tarea programada, activación por evento o agente persistente. Una conversación abierta no es un agente que sigue trabajando. Verificá si la ejecución futura puede acceder a esas fuentes, dónde corre, si requiere mi computador encendido y qué límites o costos tiene. No prometas trabajo en segundo plano si no está disponible.\nElegimos una opción y preparás una prueba pequeña sin efectos externos. Antes de activarla, mostrame el pedido exacto, fuentes permitidas, frecuencia o evento, zona horaria, resultado esperado, lugar de entrega, regla para detenerse y cómo pausarla. Pedí mi aprobación para esa activación concreta; revisar conexiones o hacer el diagnóstico no autoriza crear tareas, enviar correos, mover reuniones ni activar pagos. Para seguimientos, empezá por borradores; distinguí compromisos míos de los de otros y verificá fechas. Para envíos, usá estados reales y fecha de consulta, y detené el seguimiento al entregarse o cancelarse. Solo después de la aprobación creá lo que las herramientas permitan y comprobá el identificador, la programación y el resultado de la prueba. Si no podés crearlo, dejá los pasos listos y decí qué falta; no digas que quedó funcionando. Cerrá con una primera acción fácil y una fecha para revisar si me ahorra tiempo.';
 const kits={negocio:{label:'Negocio',download:'de negocio',name:'ascenso-negocio',focus:'Quiero probar una idea de negocio. Distinguí opinión, uso, beta gratis, compromiso y compra. Una empresa que prueba gratis no valida por sí sola todo el mercado.'},vida:{label:'Personal y hobbies',download:'personal',name:'ascenso-vida',focus:'Quiero intentar algo personal o un hobby. Ayudame a experimentar con lo que ya tengo y evaluar si lo disfruto. No lo conviertas en un negocio ni en una obligación de productividad.'},automatizacion:{label:'Automatización',download:'de automatización',name:'ascenso-automatizacion',focus:'Quiero encontrar pequeñas tareas que pueda automatizar para ahorrar tiempo, con las herramientas que tenga conectadas a mi asistente de IA.',instructions:automationInstructions,start:'Empezá con un inventario breve de las conexiones que podés comprobar y preguntame qué rutina quiero revisar.'}};
 const tools={mirofish:{name:'MiroFish',url:'https://github.com/666ghj/MiroFish'},tinytroupe:{name:'TinyTroupe',url:'https://github.com/microsoft/TinyTroupe'},oasis:{name:'OASIS',url:'https://github.com/camel-ai/oasis'}};
 function prompt(kit,assistant,mode,goal=''){
  kit=kit==='completo'||Object.hasOwn(kits,kit)?kit:'negocio';
  assistant=Object.hasOwn(assistants.all,assistant)?assistant:'otro';
  mode=mode==='install'?'install':'paste';
  goal=typeof goal==='string'?goal:'';
  return setupGuide+capability(assistant).instruction+'\n\n'+(kit==='completo'?completePrompt(assistant,goal):buildPrompt(kit,assistant,mode,goal));
 }
 function completePrompt(assistant,goal){
  const code=assistants.get(assistant).code;
  const setup=code
   ? 'Usá solo este proyecto. Descargá '+origin+'kit-completo.zip y verificá su SHA-256 en '+origin+'kits/manifest.json. Revisá las rutas del ZIP y el instalador antes de ejecutar código. Desde la carpeta descomprimida ejecutá python3 instalar_kits.py --kit todos --biblioteca --externas --assistant '+assistant+' --proyecto /ruta/al/proyecto --dry-run. Reemplazá /ruta/al/proyecto por la ruta absoluta de este proyecto, entre comillas. Si los destinos son correctos repetí sin --dry-run; no sobrescribas versiones diferentes. Comprobá qué skills reconoce el asistente. Si faltan archivos, terminal, red o Python, explicá el paso pendiente y ofrecé usar las instrucciones por conversación. Guiame para preparar las herramientas que sean compatibles, según AGENTS.md y el entorno real.'
   : 'En '+assistants.get(assistant).name+', comprobá qué formas de guardar instrucciones o skills admite mi cuenta y guiame paso a paso. El paquete está en '+origin+'kit-completo.zip. Si no podés descargarlo, pedime que lo descargue desde el setup y lo adjunte, siempre que esta cuenta permita ZIP. Si no permite ZIP, guiame para descomprimirlo en mi dispositivo y adjuntar AGENTS.md y las instrucciones del kit elegido. Prepará únicamente las skills compatibles con el formato real de importación; conservá los recursos de las que los necesiten. Para herramientas que requieran terminal o servicios externos, dejá su preparación pendiente o guiame en un entorno que sí los tenga. No ejecutes el instalador Python para importar skills en una cuenta web.';
  const nativeSetup=assistant==='claude'
   ? ' Si tu cuenta ofrece Personalizar → Skills y tiene ejecución de código habilitada, empezá importando los tres ZIP individuales para Claude desde '+origin+'setup.html?kit=completo&assistant=claude. Cada ZIP importa solo su kit principal: no instala las 27 skills. Para la biblioteca adicional, revisá el paquete completo y guiame para empaquetar e importar cada skill compatible con su carpeta y recursos; no subas el ZIP de proyecto completo como si fuera una sola skill. Activá cada skill guardada y comprobá su uso en un chat.'
   :assistant==='gemini'
    ? ' Si tu cuenta ofrece Personalizar → Skills en Gemini web o Mac, importá los SKILL.md de los tres kits desde '+origin+'setup.html?kit=completo&assistant=gemini. Estas tres importaciones no instalan las 27 skills. Para las demás, revisá el paquete completo y los formatos de archivo que tu cuenta admita; no descartes recursos necesarios. Si todavía permite crear Gems, podés guardar instrucciones ahí; no supongas que esa opción sigue disponible. Guardar una skill no habilita por sí solo otras funciones de Gemini.'
    :assistant==='chatgpt'
     ? ' Si existe @skill-creator en este entorno de ChatGPT, usalo para preparar las skills; no asumas que está disponible en todas las superficies o cuentas. Si no hay guardado compatible, elegimos un kit y lo usamos en la conversación.'
     :'';
  return 'Quiero instalar todos los kits de Ascenso. El paquete completo incluye los tres kits, 27 skills y guías para 14 herramientas. '+setup+nativeSetup+' Si no podés leer AGENTS.md ni el paquete, decilo y dejá la instalación pendiente; podés ayudarme a elegir entre negocio, vida personal y automatización, sin afirmar que cargaste sus skills. Decime por componente qué quedó instalado y comprobado, qué solo se preparó y qué falta. Una descarga o un texto generado no prueba instalación. Al terminar, preguntame si quiero probar una idea de negocio, empezar un proyecto personal o ahorrar tiempo con una automatización. Para automatizar, primero revisá las conexiones disponibles y prepará una prueba de la rutina elegida. La instalación no autoriza conectar cuentas, activar automatizaciones, enviar mensajes ni publicar.'+(goal.trim()?'\nMi objetivo: '+goal.trim():'');
 }
 function buildPrompt(kit,assistant,mode,goal=''){
  const k=kits[kit]||kits.negocio;const instructions=k.instructions||common;const idea=goal.trim()?'\nMi objetivo: '+goal.trim():'';const skill=origin+'kits/'+k.name+'/SKILL.txt';
  if(mode==='paste')return k.focus+'\n\n'+instructions+idea+'\n\nLa skill de referencia está en '+skill+'. Si no podés abrir enlaces, estas instrucciones ya alcanzan para empezar. '+(k.start||'Empezá preguntándome qué quiero averiguar y qué me frena.');
  if(assistant==='codex')return 'Instalá el kit '+k.name+' en ESTE proyecto de Codex. Descargá '+origin+'kit-'+kit+'.zip y consultá su hash en '+origin+'kits/manifest.json. Antes de instalar, comprobá el hash y revisá los archivos: '+k.name+'/SKILL.md, EMPEZAR.txt e instalar_kits.py. No ejecutes código remoto sin revisarlo. El instalador es Python estándar, no usa red ni dependencias. Prepará primero un dry-run para la carpeta de proyecto actual y después instalá en .agents/skills/'+k.name+'/SKILL.md; conservá cualquier versión distinta que ya exista. No modifiques configuración global ni otros proyectos. Confirmá qué archivo quedó instalado. Si este asistente no tiene descargas o terminal, leé '+skill+' y usalo como instrucciones en esta conversación. Después usá $'+k.name+' para ayudarme a empezar.'+idea+'\n\n'+k.focus+'\n'+instructions;
  if(assistant==='claude-code')return 'Instalá el kit '+k.name+' en ESTE proyecto de Claude Code. Descargá '+origin+'kit-'+kit+'.zip y comprobá su hash en '+origin+'kits/manifest.json. Revisá el contenido y extraé el archivo '+k.name+'/SKILL.md. Creá .claude/skills/'+k.name+'/SKILL.md con ese contenido, conservando cualquier versión distinta que exista. No ejecutes instalar_kits.py para esta instalación individual. Esta skill solo necesita texto. No cambies configuración global ni otros proyectos. Comprobá que Claude Code reconoce la skill y explicame cómo usar /'+k.name+'. Si no tenés acceso a archivos o terminal, usá las instrucciones en esta conversación. Confirmá qué quedó instalado, sin inventarlo.'+idea+'\n\n'+k.focus+'\n'+instructions;
  if(assistant==='gemini')return 'Ayudame a guardar este kit como instrucciones reutilizables en Gemini. Revisá las opciones reales de mi cuenta: puede ofrecer Skills o Gems según la cuenta y la transición del producto. Guía oficial: https://support.google.com/gemini/answer/18560919. En Gemini web o Mac, si aparece Personalizar → Skills, guiame para importar el archivo SKILL.md. Si mi cuenta permite crear Gems, prepará el nombre '+k.name+', una descripción y las instrucciones para pegar. Si hace falta que yo use Crear o suba un archivo, guiame paso a paso; no afirmes que lo guardaste solo porque me diste el texto. La referencia está en '+skill+'. Si esa función no está disponible, empezá en esta conversación con estas instrucciones:\n\n'+k.focus+'\n'+instructions+idea;
  if(assistant==='claude')return 'Ayudame a guardar una skill de Claude llamada '+k.name+'. Revisá qué opciones tiene esta cuenta para crear o subir una skill. Usá como referencia '+skill+' y la guía oficial https://support.claude.com/en/articles/12512198-how-to-create-custom-skills. Para subirla, usá el ZIP individual '+origin+'kit-'+kit+'-claude.zip. El ZIP tiene una sola carpeta con SKILL.md. Si la cuenta permite skills y tiene ejecución de código habilitada, guiame para subirlo en Personalizar → Skills, habilitarlo y comprobarlo con un pedido de prueba. No subas el ZIP de proyecto como si fuera este ZIP individual. No ejecutes el instalador Python para esta importación. No afirmes que quedó guardada si no lo comprobaste. Si no podemos crearla, empecemos con estas instrucciones en la conversación:\n\n'+k.focus+'\n'+instructions+idea;
  if(assistant==='otro')return 'Ayudame a guardar estas instrucciones de una forma reutilizable que este asistente realmente admita, por ejemplo instrucciones de proyecto o un asistente personalizado. No asumas que puede instalar skills, ZIP ni librerías. Si hace falta que yo guarde algo, dame el texto listo y los pasos. Si no hay una opción para guardar, empecemos en esta conversación. Referencia: '+skill+'\n\n'+k.focus+'\n'+instructions+idea;
  return 'Creá una skill reutilizable llamada '+k.name+' a partir de estas instrucciones. Si este entorno de ChatGPT ofrece @skill-creator, usalo; si no, ayudame a usar o guardar estas instrucciones con las opciones que realmente tenga esta cuenta. La skill está publicada en '+skill+' y el paquete se descarga de '+origin+'kit-'+kit+'.zip. No des por hecho que ChatGPT puede instalar un ZIP o ejecutar librerías locales: si no tengo esa función, empecemos en esta conversación con el texto de abajo. Confirmá qué quedó creado y cómo lo puedo volver a usar.\n\n'+k.focus+'\n'+instructions+idea;
 }
 function toolPrompt(id){const t=tools[id];return setupGuide+'Quiero preparar '+t.name+' para explorar hipótesis de una idea. Primero leé el README oficial: '+t.url+'. Explicame qué hace, sus límites y los requisitos actuales. Si tenés terminal y autorizaciones, prepará un entorno aislado en la carpeta que elija, descargá el repositorio oficial y seguí su instalación documentada. Antes de ejecutar, revisá los archivos y dependencias. No actives facturación, no pongas claves en el chat y no inventes integraciones disponibles. Si faltan credenciales, indicá cómo configurarlas de forma local y detené solo la parte que las necesita. Confirmá con una comprobación mínima qué quedó instalado. No ejecutes simulaciones de pago ni presentes resultados que no se hayan obtenido. Si no tenés terminal, dejame una guía paso a paso. La salida sintética se usará para preparar preguntas, no como evidencia de usuarios reales.'}
 return {kits,bundle,prompt,toolPrompt,capability,assistants:assistants.all};
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
  $('provider-readiness').hidden=step===0;
  if(focus)steps[step].querySelector('h2').focus();
 }
 function destination(){
  if(assistant==='chatgpt')return kit==='completo'||mode==='install'
   ?'En ChatGPT, elegí Work si tu cuenta lo incluye y pegá el pedido. Si no aparece, usá Chat para preparar un plan.'
   :'Pegalo en ChatGPT. Elegí Work para delegar pasos; si tu sesión solo puede conversar, empezá por el plan.';
  return assistantInfo.get(assistant).destination;
 }
 function paintNativeImport(complete){
  const nativeInstall=$('native-install');
  const claude=assistant==='claude';
  nativeInstall.hidden=!claude&&assistant!=='gemini';
  nativeInstall.open=false;
  if(nativeInstall.hidden)return;

  $('native-install-title').textContent=claude?'Guardar en Claude · ZIP por kit':'Guardar en Gemini · archivo SKILL.md';
  $('native-install-note').textContent=claude
   ?'Si tu cuenta permite skills, revisá que la ejecución de código esté habilitada. En Personalizar → Skills, subí un ZIP por kit, activalo y probalo en un chat. Si no aparece la opción, usá el pedido de conversación.'
   :'Si tu cuenta ofrece Personalizar → Skills, importá el archivo en Gemini web o Mac. Se descarga como SKILL.md; si tu navegador lo guarda como SKILL.txt, renombralo a SKILL.md. Si todavía podés crear Gems, también podés pegar las instrucciones ahí.';
  if(complete)$('native-install-note').textContent+=' Estos tres archivos guardan los kits principales. Para las demás skills, seguí el pedido del paquete completo; no quedan instaladas solo por descargarlo.';
  document.querySelectorAll('[data-import-kit]').forEach(link=>{
   const id=link.dataset.importKit;
   link.closest('li').hidden=!complete&&kit!==id;
   link.href=claude?'kit-'+id+'-claude.zip':'kits/'+SetupKits.kits[id].name+'/SKILL.txt';
   link.download=claude?'':'SKILL.md';
   link.textContent=SetupKits.kits[id].label+(claude?' · ZIP para Claude':' · SKILL.md');
  });
 }
 function paint(){
  const k=currentKit();
  const a=assistantInfo.get(assistant);
  const complete=kit==='completo';
  const readiness=SetupKits.capability(assistant);
  $('provider-readiness-title').textContent=readiness.title;
  $('provider-readiness-detail').textContent=readiness.detail;
  $('provider-readiness-link').href=readiness.url;
  document.querySelectorAll('[data-kit]').forEach(b=>b.setAttribute('aria-pressed',String(kit===b.dataset.kit)));
  document.querySelectorAll('[data-assistant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.assistant===assistant)));
  $('assistant-context').textContent=complete?'Elegí dónde querés preparar el paquete completo.':'Elegiste el kit «'+k.label+'».';
  $('summary-kit').textContent=k.label;
  $('summary-assistant').textContent=a.name;
  $('prompt').textContent=SetupKits.prompt(kit,assistant,mode);
  $('zip').href='kit-'+kit+'.zip';
  $('zip').textContent='Descargar paquete '+k.download+' · ZIP de proyecto';
  $('skill').href=complete?'AGENTS.md':'kits/'+k.name+'/SKILL.txt';
  $('skill').textContent=complete?'Leer la guía común':'Leer las instrucciones del kit';
  $('save-kit').hidden=complete;
  $('complete-option').hidden=complete;
  paintNativeImport(complete);
  $('assistant-note').textContent=mode==='paste'
   ?'Si tu sesión solo puede conversar, recibirás un plan y pasos para hacer vos. Si tiene herramientas, podrá avanzar con lo que autorices. Copiar no guarda ni instala el kit.'
   :'Tu asistente te guiará con el guardado compatible. Descargar un archivo o copiar este pedido no confirma la instalación.';
  $('copy').textContent=complete?'1. Copiar pedido para instalar todos':'1. Copiar para empezar';
  $('use-now').textContent=a.code?'Copiar pedido de instalación':'Copiar pedido para guardarlo';
  const nextAction=complete
   ?'Tu asistente comprobará el modo y las capacidades antes de preparar el paquete completo.'
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
