const TripDemo = (() => {
  const times = ['07:00', '07:20', '07:40'];
  const roles = ['driver', 'passenger'];
  function add(entries, time, role) {
    if (!times.includes(time) || !roles.includes(role)) throw new Error('Hora o perfil fuera del ejemplo');
    return [...entries, {id: entries.length + 1, time, role}];
  }
  function matches(entries, time, role) {
    return entries.filter(e => e.time === time && e.role !== role);
  }
  function sample() {
    return add(add(add([], '07:20', 'driver'), '07:20', 'passenger'), '07:40', 'passenger');
  }
  return {add, matches, sample};
})();
if (typeof module !== 'undefined') module.exports = TripDemo;
if (typeof document !== 'undefined') {
  let entries = [];
  const $ = id => document.getElementById(id);
  const name = role => role === 'driver' ? 'Ofrece un puesto' : 'Busca un puesto';
  function paint() {
    const time = $('time').value, role = $('role').value;
    const found = TripDemo.matches(entries, time, role);
    $('match').textContent = found.length
      ? `${found.length} perfil${found.length === 1 ? '' : 'es'} complementario${found.length === 1 ? '' : 's'} a las ${time}. Es una coincidencia de ejemplo.`
      : `No hay un perfil complementario a las ${time}. ¿Probarías otra hora?`;
    $('entries').replaceChildren();
    entries.forEach(e => {
      const li = document.createElement('li');
      li.textContent = `Perfil ficticio ${e.id} · ${e.time} · ${name(e.role)}`;
      $('entries').append(li);
    });
    $('status').textContent = `${entries.length} perfiles ficticios en esta demo. Ninguno se envía ni se guarda.`;
  }
  $('trip-form').addEventListener('submit', e => {
    e.preventDefault(); entries = TripDemo.add(entries, $('time').value, $('role').value); paint();
  });
  $('sample').onclick = () => {entries = TripDemo.sample(); paint();};
  $('reset').onclick = () => {entries = []; paint();};
  $('time').onchange = paint;
  $('role').onchange = paint;
  paint();
}
