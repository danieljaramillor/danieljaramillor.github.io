const TripDemo=(()=>{
 const routes=[{id:'a',name:'Recorrido A',detail:'Por el punto central',minutes:44,anchor:[240,215]},{id:'b',name:'Recorrido B',detail:'Por el punto del oeste',minutes:49,anchor:[140,300]},{id:'c',name:'Recorrido C',detail:'Por el punto alterno',minutes:52,anchor:[530,150]}];
 const pickups=[{id:'origin',name:'Normandía · punto de salida',x:90,y:85,detour:{a:0,b:0,c:0}},{id:'central',name:'Punto central · encuentro de ejemplo',x:290,y:260,detour:{a:4,b:8,c:12}},{id:'west',name:'Punto del oeste · encuentro de ejemplo',x:165,y:340,detour:{a:9,b:3,c:15}},{id:'far',name:'Punto fuera del recorrido',x:560,y:225,detour:{a:18,b:20,c:10}}];
 const initial={role:'driver',route:'a',pickup:'central',departure:'06:00',maxDetour:10,seats:2};
 function evaluate(s){
  const route=routes.find(r=>r.id===s.route),pickup=pickups.find(p=>p.id===s.pickup),m=/^(\d{2}):(\d{2})$/.exec(s.departure||'');
  if(!route||!pickup||!['driver','passenger'].includes(s.role)||!m||+m[1]>23||+m[2]>59||![5,10,15].includes(+s.maxDetour)||!Number.isInteger(+s.seats)||+s.seats<0||+s.seats>3)return {valid:false,ok:false,reasons:['Completá la hora y las condiciones del ejemplo.']};
  const detour=pickup.detour[route.id],arrival=+m[1]*60+(+m[2])+route.minutes+detour;
  const reasons=[];if(+s.seats===0)reasons.push('No hay puestos disponibles.');if(detour>+s.maxDetour)reasons.push('El desvío supera lo que acepta el conductor.');if(arrival>=420)reasons.push('Esta combinación no llega antes de las siete.');
  const time=String(Math.floor(arrival/60)).padStart(2,'0')+':'+String(arrival%60).padStart(2,'0');
  return {valid:true,ok:reasons.length===0,arrival:time,arrivalMinutes:arrival,detour,reasons,route,pickup};
 }
 return {routes,pickups,initial,evaluate};
})();
if(typeof module!=='undefined')module.exports=TripDemo;
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);let state={...TripDemo.initial};const ns='http://www.w3.org/2000/svg';
 function button(label,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=action;return b;}
 TripDemo.routes.forEach(r=>{const b=button(r.name,()=>{state.route=r.id;paint()});b.id='route-'+r.id;const small=document.createElement('span');small.textContent=r.detail+' · '+r.minutes+' min de ejemplo';b.append(small);$('routes').append(b)});
 TripDemo.pickups.forEach((p,i)=>{const b=button(p.name,()=>{state.pickup=p.id;paint()});b.id='point-'+p.id;$('pickups').append(b);const group=document.createElementNS(ns,'g');group.id='map-point-'+p.id;group.setAttribute('role','button');group.setAttribute('tabindex','0');group.setAttribute('aria-label','Elegir '+p.name);group.setAttribute('class','map-point');group.setAttribute('transform',`translate(${p.x} ${p.y})`);const circle=document.createElementNS(ns,'circle');circle.setAttribute('r','17');const text=document.createElementNS(ns,'text');text.setAttribute('text-anchor','middle');text.setAttribute('dy','.35em');text.textContent=String(i+1);group.append(circle,text);group.addEventListener('click',()=>{state.pickup=p.id;paint()});group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();state.pickup=p.id;paint()}});$('map-points').append(group)});
 function paint(){
  const result=TripDemo.evaluate(state);
  for(const r of TripDemo.routes){$('route-'+r.id).setAttribute('aria-pressed',String(r.id===state.route));$('map-'+r.id).classList.toggle('selected',r.id===state.route)}
  for(const p of TripDemo.pickups){$('point-'+p.id).setAttribute('aria-pressed',String(p.id===state.pickup));$('map-point-'+p.id).setAttribute('aria-pressed',String(p.id===state.pickup));}
  for(const role of ['driver','passenger'])$(role).setAttribute('aria-pressed',String(state.role===role));
  $('departure').value=state.departure;$('detour').value=String(state.maxDetour);$('seats').value=String(state.seats);
  $('arrival').textContent=result.valid?result.arrival:'--:--';
  $('verdict').textContent=result.ok?'Esta combinación cabe':'Probá otra combinación';$('verdict').className='verdict '+(result.ok?'ok':'no');
  $('explanation').textContent=result.ok?(state.role==='driver'?'Podrías ofrecer este puesto en la prueba.':'Esta opción podría servirte para la prueba.')+' Con estos datos ficticios llegarían antes de las siete.':result.reasons.join(' ');
  $('summary-pickup').textContent=result.pickup?result.pickup.name:'Elegí un punto';$('summary-detour').textContent=result.valid?result.detour+' min de ejemplo':'—';$('summary-seats').textContent=String(state.seats);
  if(result.pickup){const a=result.route.anchor;$('pickup-line').setAttribute('d',`M${a[0]} ${a[1]}L${result.pickup.x} ${result.pickup.y}`)}
  $('next').disabled=!result.ok;$('next-step').hidden=true;
 }
 for(const role of ['driver','passenger'])$(role).onclick=()=>{state.role=role;paint()};
 $('departure').oninput=e=>{state.departure=e.target.value;paint()};$('detour').onchange=e=>{state.maxDetour=Number(e.target.value);paint()};$('seats').onchange=e=>{state.seats=Number(e.target.value);paint()};
 $('next').onclick=()=>{$('next-step').hidden=false;$('next-step').textContent='Para una prueba real: hablar con la otra persona, acordar recogida y condiciones y comprobar el horario. Acá solo estamos ensayando el flujo; no se creó una reserva.'};
 $('reset').onclick=()=>{state={...TripDemo.initial};paint()};paint();
}
