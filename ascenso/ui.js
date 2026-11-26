const FirstTest=(()=>{
 const blocked={aprender:'Me falta aprender algo',tiempo:'No encuentro el tiempo',miedo:'Me incomoda que salga mal o me digan que no','no-se':'Todavía no sé qué me frena'};
 function clean(value,max=1200){return String(value||'').trim().slice(0,max)}
 function normalize(input={}){return {kit:input.kit==='vida'?'vida':'negocio',idea:clean(input.idea),blocker:blocked[input.blocker]?input.blocker:'aprender',blockerDetail:clean(input.blockerDetail,400),time:[15,30,60,120].includes(Number(input.time))?Number(input.time):30,resources:clean(input.resources,400),date:/^\d{4}-\d{2}-\d{2}$/.test(input.date||'')?input.date:'',criterion:clean(input.criterion,600)}}
 function adapt(list,x){
  const result=list.map(o=>({...o}));
  if(x.blocker==='aprender'){
   const learn=result.findIndex(o=>o.id==='learn');if(learn>0)result.unshift(result.splice(learn,1)[0]);
   if(x.kit==='negocio'){result[0].title='Averiguá un dato antes de construir';result[0].action='Nombrá una incertidumbre concreta y prepará cómo contrastarla con una fuente o una persona que conozca el problema.';result[0].learning='Qué dato te falta y si cambia la prueba que harías';}
  }
  if(x.blocker==='tiempo')result.forEach(o=>{o.effort='Un primer bloque de '+Math.min(15,x.time)+' min, dentro de tus '+x.time+' disponibles';o.action='Recortá el alcance a un primer paso. '+o.action;});
  if(x.blocker==='miedo')result.forEach(o=>{o.reversible='Una versión privada que podés corregir o dejar ahí';o.action='Empezá por prepararlo sin prometer nada a nadie. '+o.action;});
  if(x.blocker==='no-se')result[0].action='Anotá primero qué parte no tenés clara. '+result[0].action;
  return result;
 }
 function options(input){const x=normalize(input);const budget=x.time+' min disponibles';
  if(x.kit==='vida')return adapt([
   {id:'try',title:'Probá una versión pequeña',action:'Elegí una primera experiencia de tu idea usando lo que ya tenés.',effort:'Un bloque de '+budget,cost:'Sin compras como primer paso',reversible:'Podés parar después del primer intento',learning:'Si disfrutás hacerlo y qué cambiarías'},
   {id:'learn',title:'Aprendé solo lo que te falta',action:'Nombrá una técnica o dato concreto y probalo en un ejercicio corto.',effort:budget+', con un objetivo acotado',cost:'Recurso que ya tengas a mano',reversible:'No te inscribís a un compromiso largo',learning:'Si ese conocimiento destraba el primer intento'},
   {id:'company',title:'Hacelo en compañía',action:'Prepará una invitación a alguien con quien probar una versión pequeña; vos decidís si la enviás.',effort:'Preparar el plan dentro de '+budget,cost:'Acordar recursos antes de comprar',reversible:'Una experiencia, sin obligación de repetir',learning:'Si compartirlo te ayuda a empezar y disfrutar'}
  ],x);
  return adapt([
   {id:'talk',title:'Conversá antes de construir',action:'Prepará una conversación con alguien que podría tener ese problema.',effort:'Prepararla dentro de '+budget,cost:'Tiempo y un contacto, si lo tenés',reversible:'Sin construir ni cobrar todavía',learning:'Si el problema aparece en su experiencia'},
   {id:'show',title:'Mostrá una primera versión',action:'Hacé un esquema o mockup y definí una tarea neutral para observar con una persona.',effort:budget+' para recortar el primer flujo',cost:'Papel o una herramienta disponible',reversible:'Una versión que puedas corregir',learning:'Si entiende el flujo sin que le dictés los clics'},
   {id:'commit',title:'Pedí un siguiente paso concreto',action:'Prepará una propuesta pequeña y qué compromiso observable te serviría investigar.',effort:'Preparar la propuesta dentro de '+budget,cost:'Definir el alcance antes de prometerlo',reversible:'Una prueba acotada, no todo el negocio',learning:'Qué haría la persona, más allá de decir que le gusta'}
  ],x);
 }
 function prompt(input,selected=0){const x=normalize(input),opts=options(x),o=opts[Math.max(0,Math.min(2,Number(selected)||0))];
  return `Quiero ${x.kit==='vida'?'intentar algo personal o un hobby':'probar una idea de negocio'}: ${x.idea||'[contá tu idea]'}.

Lo que me frena: ${blocked[x.blocker]}.${x.blockerDetail?' '+x.blockerDetail:''}
Hoy cuento con ${x.time} minutos.${x.resources?' Recursos disponibles: '+x.resources+'.':''}

Ayudame a separar lo que necesito aprender, una restricción real de recursos y una respuesta que me cuesta recibir. No asumas que todo es miedo. Haceme hasta tres preguntas útiles.

Hagamos brainstorming de tres pruebas pequeñas: comparalas por tiempo, costo, reversibilidad y aprendizaje. Cuestioná mis supuestos y ayudame a elegir una acción, no una lista infinita de ideas.

La página me propuso este borrador orientativo, que quiero que revisés: ${o.title}. ${o.action} No es una conclusión de investigación ni un plan ya validado.
${x.date?'Quiero hacerlo el '+x.date+'.\n':''}${x.criterion?'Quiero observar: '+x.criterion+'.\n':''}
Dejame una primera acción para hoy, qué voy a observar y qué me haría seguir, ajustar o parar. ${x.kit==='vida'?'No conviertas el hobby en un negocio si no lo pido.':'Distinguí opinión, uso, beta gratuita, compromiso y compra; una prueba no confirma todo el mercado.'} No inventés resultados ni cuentes perfiles sintéticos como personas reales. No contactes a nadie ni publiques por el hecho de preparar este plan.`;
 }
 return {normalize,options,prompt,blockers:blocked};
})();
const BrainstormUI=FirstTest;
if(typeof module!=='undefined')module.exports=FirstTest;
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);let kit='negocio',selected=0,step=0;
 const assistants=AscensoAssistants;
 function currentAssistant(){return assistants.get($('article-assistant').value)}
 function updateAssistant(){const a=currentAssistant(),link=$('copy-open-chatgpt');link.textContent='2. Abrir '+a.name+' ↗';link.href=a.url||'#';link.hidden=!a.url;link.setAttribute('aria-disabled','true');link.tabIndex=-1;$('article-open-manual').hidden=!!a.url;$('article-open-manual').textContent='2. '+a.destination;$('article-paste-guide').textContent=a.code?'En el chat de '+a.name+': pegá el pedido y envialo. El asistente te hará preguntas para empezar.':'En '+a.name+': abrí un chat, mantené pulsado el cuadro de mensaje, elegí Pegar y tocá Enviar. Te hará preguntas para empezar. Si te pide iniciar sesión, entrá y después pegá el pedido.';$('setup-personal').href='setup.html?kit='+kit+'&assistant='+$('article-assistant').value;$('personal-copy-status').textContent='';$('personal-manual').hidden=true}
 const steps=Array.from(document.querySelectorAll('.wizard-step'));
 const dots=Array.from(document.querySelectorAll('.wizard-dot'));
 function moveStep(next,focus=true){
  step=Math.max(0,Math.min(2,next));steps.forEach((el,i)=>{el.hidden=i!==step});
  dots.forEach((el,i)=>{el.classList.toggle('is-active',i===step);el.classList.toggle('is-done',i<step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});
  $('step-status').textContent=(step+1)+' de 3 · '+['Tu idea','Tu bloqueo','Lo que tenés'][step];
  $('wizard-back').hidden=step===0;$('wizard-next').hidden=step===2;$('build-plan').hidden=step!==2;
  if(focus){const legend=steps[step].querySelector('legend');legend.tabIndex=-1;legend.focus()}
 }
 function validIdea(){const el=$('idea');el.setCustomValidity(el.value.trim()?'':'Contá tu idea en una frase para seguir.');return el.reportValidity()}
 $('idea').addEventListener('input',()=>{$('idea').setCustomValidity('')});
 $('wizard-next').onclick=()=>{if(step===0&&!validIdea())return;moveStep(step+1)};
 $('wizard-back').onclick=()=>moveStep(step-1);
 $('edit-answers').onclick=()=>{moveStep(0);$('taller').scrollIntoView({behavior:'auto',block:'start'});$('idea').focus()};
 $('mi-prueba').hidden=true;moveStep(0,false);
 function values(){return FirstTest.normalize({kit,idea:$('idea').value,blocker:$('blocker').value,blockerDetail:$('blocker-detail').value,time:$('available-time').value,resources:$('resources').value,date:$('test-date').value,criterion:$('criterion').value})}
 function text(tag,value,cls){const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el;}
 function paint(){const input=values(),opts=FirstTest.options(input);$('business-kit').setAttribute('aria-pressed',String(kit==='negocio'));$('life-kit').setAttribute('aria-pressed',String(kit==='vida'));$('idea').placeholder=kit==='vida'?'Quiero aprender a hacer pasta sin seguir aplazándolo…':'Quiero probar una idea que ayude a…';$('test-options').replaceChildren();
  opts.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.className='test-option';b.id='test-option-'+i;b.setAttribute('aria-pressed',String(i===selected));b.append(text('span',String(i+1).padStart(2,'0'),'option-number'));const body=document.createElement('div');const heading=text('h4',o.title);body.append(heading);const description=text('p',o.action);description.hidden=i!==selected;body.append(description);const dl=document.createElement('dl');for(const [k,v]of [['Tiempo',o.effort],['Costo',o.cost],['Puedo cambiar de idea',o.reversible],['Qué voy a mirar',o.learning]]){const group=document.createElement('div');group.append(text('dt',k),text('dd',v));dl.append(group)}dl.hidden=i!==selected;body.append(dl);b.setAttribute('aria-label',o.title+(i===selected?'. Elegida. '+o.action:'. Elegir este camino.'));b.append(body);b.onclick=()=>{selected=i;paint();$('test-option-'+i).focus()};$('test-options').append(b)});
  $('personalized-prompt').textContent=FirstTest.prompt(input,selected);const goal=input.idea?'Para «'+input.idea+'»: ':'Tu primer paso: ';$('action-summary').textContent=goal+opts[selected].action+(input.date?' Fecha elegida: '+input.date+'.':' Elegí cuándo lo vas a probar.');$('personal-copy-status').textContent='';$('copy-open-chatgpt').setAttribute('aria-disabled','true');$('copy-open-chatgpt').tabIndex=-1;$('personal-manual').hidden=true;updateAssistant();
 }
 function selectText(el){let parent=el.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}const range=document.createRange();range.selectNodeContents(el);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)}
 function readyToOpen(){ $('copy-open-chatgpt').removeAttribute('aria-disabled');$('copy-open-chatgpt').removeAttribute('tabindex'); }
 async function copyPersonal(){const el=$('personalized-prompt');try{if(!navigator.clipboard)throw Error('Sin portapapeles');await navigator.clipboard.writeText(el.textContent);const a=currentAssistant();$('personal-copy-status').textContent=a.url?'Copiado. Ahora tocá «2. Abrir '+a.name+'», pegá el pedido y tocá Enviar.':'Copiado. '+a.destination+' Después envialo.';readyToOpen();return true}catch{$('personal-manual').hidden=false;$('personal-manual-text').value=el.textContent;$('personal-manual-text').focus();$('personal-manual-text').select();$('personal-copy-status').textContent='No se pudo copiar automáticamente. Copiá el texto de abajo y tocá «Ya copié el pedido».';return false}}
 $('use-chosen-test').onclick=()=>{const el=$('prompt-title');el.tabIndex=-1;el.focus({preventScroll:true});el.closest('aside').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
 $('personal-manual-ready').onclick=()=>{readyToOpen();$('personal-copy-status').textContent=currentAssistant().destination+' Después tocá Enviar.'};
 $('business-kit').onclick=()=>{kit='negocio';selected=0;paint()};$('life-kit').onclick=()=>{kit='vida';selected=0;paint()};for(const id of ['idea','blocker','blocker-detail','available-time','resources','test-date','criterion'])$(id).addEventListener('input',paint);
 $('first-test-form').addEventListener('submit',e=>{e.preventDefault();if(step<2){if(step===0&&!validIdea())return;moveStep(step+1);return}if(!$('idea').value.trim()){moveStep(0);validIdea();return}paint();$('mi-prueba').hidden=false;$('studio-title').tabIndex=-1;$('studio-title').focus({preventScroll:true});$('mi-prueba').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
 $('load-example').onclick=()=>{$('idea').value=kit==='vida'?'Aprender a hacer pasta fresca sin comprar una máquina':'Ayudar a coordinar un viaje de Normandía a Icesi antes de las siete';$('blocker').value=kit==='vida'?'aprender':'no-se';$('resources').value=kit==='vida'?'Una cocina y un rato para una primera cena':'Un esquema de la app y una persona a quien mostrárselo';paint()};
 $('article-assistant').onchange=updateAssistant;
 $('copy-personal-prompt').onclick=()=>copyPersonal();$('copy-open-chatgpt').onclick=e=>{if($('copy-open-chatgpt').getAttribute('aria-disabled')==='true')e.preventDefault()};
 document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const el=$(b.dataset.copy);try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(el.textContent);$('copy-status').textContent='Prompt copiado. Pegalo en tu asistente.';}catch{selectText(el);$('copy-status').textContent='Mantené pulsado el texto y elegí Copiar. En computador, usá Ctrl+C o Cmd+C.';}}));
 function revealHash(){
  const id=location.hash.slice(1);
  if(!id)return;
  const target=document.getElementById(id);
  if(!target)return;
  for(let element=target;element;element=element.parentElement){
   if(element.tagName==='DETAILS')element.open=true;
  }
 }
 window.addEventListener('hashchange',revealHash);revealHash();paint();
}
