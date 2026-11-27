const TripDemo = (() => {
  const routes = [
    { id: 'a', name: 'Por el centro', minutes: 44, anchor: [240, 215], defaultPickup: 'central' },
    { id: 'b', name: 'Por el oeste', minutes: 49, anchor: [140, 300], defaultPickup: 'west' },
    { id: 'c', name: 'Recorrido alterno', minutes: 52, anchor: [530, 150], defaultPickup: 'far' },
  ];
  const pickups = [
    { id: 'origin', name: 'Salida en Normandía', x: 90, y: 85, detour: { a: 0, b: 0, c: 0 }, approach: { a: 0, b: 0, c: 0 } },
    { id: 'central', name: 'Punto central', x: 290, y: 260, detour: { a: 4, b: 8, c: 12 }, approach: { a: 15, b: 17, c: 22 } },
    { id: 'west', name: 'Punto del oeste', x: 165, y: 340, detour: { a: 9, b: 3, c: 15 }, approach: { a: 19, b: 12, c: 24 } },
    { id: 'far', name: 'Punto fuera de ruta', x: 560, y: 225, detour: { a: 18, b: 20, c: 10 }, approach: { a: 23, b: 26, c: 19 } },
  ];
  const initial = { role: 'driver', route: 'a', pickup: 'central', departure: '06:00', maxDetour: 10, seats: 2 };
  // Cada recorrido equivale a una oferta fija en el rol de pasajero.
  const offers = {
    a: { departure: '06:00', maxDetour: 10, seats: 2 },
    b: { departure: '06:00', maxDetour: 5, seats: 1 },
    c: { departure: '06:08', maxDetour: 10, seats: 0 },
  };
  const cutoff = 7 * 60;
  const digits = value => String(value).padStart(2, '0');
  const clock = minutes => digits(Math.floor(minutes / 60) % 24) + ':' + digits(minutes % 60);

  function parseTime(value) {
    const match = /^(\d{2}):(\d{2})$/.exec(value || '');
    if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  }

  function passengerTrip(preferences) {
    return { ...preferences, ...offers[preferences.route], role: 'passenger' };
  }

  function evaluate(state) {
    const route = routes.find(item => item.id === state.route);
    const pickup = pickups.find(item => item.id === state.pickup);
    const departure = parseTime(state.departure);
    const readyAt = state.role === 'passenger' && state.readyAt ? parseTime(state.readyAt) : null;
    const seats = Number(state.seats);
    const maxDetour = Number(state.maxDetour);
    if (!route || !pickup || !['driver', 'passenger'].includes(state.role) ||
        departure === null || (state.role === 'passenger' && state.readyAt && readyAt === null) ||
        ![5, 10, 15].includes(maxDetour) || !['0','1','2','3'].includes(String(state.seats))) {
      return { valid: false, ok: false, reasons: ['Completá la hora y las condiciones del ejemplo.'] };
    }

    const detour = pickup.detour[route.id];
    const pickupMinutes = departure + pickup.approach[route.id] + Math.ceil(detour / 2);
    const arrivalMinutes = departure + route.minutes + detour;
    const nextDay = arrivalMinutes >= 24 * 60;
    const reasons = [];
    if (seats === 0) reasons.push('Esta opción se quedó sin cupos.');
    if (detour > maxDetour) reasons.push('Elegí un punto que quede dentro del desvío máximo.');
    if (arrivalMinutes >= cutoff) {
      reasons.push(state.role === 'driver'
        ? 'Adelantá la salida para llegar al campus antes de las siete.'
        : 'Probá otra oferta para llegar al campus antes de las siete.');
    }
    if (readyAt !== null && readyAt > pickupMinutes) reasons.push('La recogida es antes de que estés en el punto.');
    return {
      valid: true, ok: reasons.length === 0, reasons, route, pickup, detour, arrivalMinutes, nextDay,
      arrival: clock(arrivalMinutes),
      pickupTime: clock(pickupMinutes),
      pickupNextDay: pickupMinutes >= 24 * 60,
      spareMinutes: cutoff - arrivalMinutes,
    };
  }

  return { routes, pickups, initial, evaluate, passengerTrip };
})();

if (typeof module !== 'undefined') module.exports = TripDemo;

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const svgNS = 'http://www.w3.org/2000/svg';
  const panelIds = ['route-step', 'pickup-step', 'next-step', 'done-step'];
  const titleIds = ['route-heading', 'pickup-heading', 'review-title', 'done-title'];
  const actionIds = ['route-next', 'next', 'simulate', 'reset'];
  const passengerDefaults = { route: TripDemo.initial.route, pickup: TripDemo.initial.pickup, readyAt: '06:00' };
  let driver = { ...TripDemo.initial };
  let passenger = { ...passengerDefaults };
  let role = 'passenger';
  let step = 0;

  const selection = () => role === 'driver' ? driver : passenger;
  const currentTrip = () => role === 'driver' ? driver : TripDemo.passengerTrip(passenger);
  const placement = (time, nextDay) => time + (nextDay ? ' (+1 día)' : '');
  const seatsLabel = seats => seats === 1 ? '1 cupo' : seats === 0 ? 'Lleno' : seats + ' cupos';

  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  const routeControls = TripDemo.routes.map(route => {
    const button = element('button', '');
    button.type = 'button';
    button.id = 'route-' + route.id;
    const mark = element('span', route.id.toUpperCase(), 'route-mark');
    mark.setAttribute('aria-hidden', 'true');
    const info = element('span', '', 'route-info');
    const detail = element('small', '');
    info.append(element('strong', route.name), detail);
    const availability = element('span', '', 'route-availability');
    button.append(mark, info, availability);
    button.onclick = () => {
      const preferences = selection();
      if (preferences.route === route.id) return;
      preferences.route = route.id;
      preferences.pickup = route.defaultPickup;
      paint();
    };
    $('routes').append(button);
    return { route, button, detail, availability, offer: TripDemo.passengerTrip({ route: route.id }) };
  });

  const pickupControls = TripDemo.pickups.map((item, index) => {
    function choose() {
      if (step >= 2 || (role === 'passenger' && currentTrip().seats === 0)) return;
      selection().pickup = item.id;
      if (step === 0) goTo(1);
      else paint();
    }

    const number = String(index + 1);
    const button = element('button', '');
    button.type = 'button';
    button.id = 'point-' + item.id;
    const marker = element('span', number, 'pickup-mark');
    marker.setAttribute('aria-hidden', 'true');
    button.append(marker, element('span', item.name));
    button.onclick = choose;
    $('pickups').append(button);

    const point = document.createElementNS(svgNS, 'g');
    point.id = 'map-point-' + item.id;
    point.setAttribute('role', 'button');
    point.setAttribute('aria-label', 'Elegir ' + item.name);
    point.setAttribute('class', 'map-point');
    point.setAttribute('transform', 'translate(' + item.x + ' ' + item.y + ')');

    const hitArea = document.createElementNS(svgNS, 'circle');
    hitArea.setAttribute('class', 'point-hit');
    hitArea.setAttribute('r', '43');
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('class', 'point-mark');
    circle.setAttribute('r', '19');
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dy', '.35em');
    label.textContent = number;
    point.append(hitArea, circle, label);

    point.addEventListener('click', choose);
    point.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose();
      }
    });
    $('map-points').append(point);
    return { item, button, point };
  });

  function describeArrival(result) {
    if (!result.ok) return result.reasons.join(' ');
    const margin = result.spareMinutes === 1 ? '1 minuto' : result.spareMinutes + ' minutos';
    if (result.spareMinutes < 5) return 'Queda un margen corto de ' + margin + '. Calculá el tiempo hasta el salón.';
    return 'Quedan ' + margin + ' entre la llegada al campus y las siete.';
  }

  function goTo(nextStep) {
    step = nextStep;
    paint();
    $(titleIds[step]).focus?.();
  }

  function paint() {
    const state = currentTrip();
    const result = TripDemo.evaluate(state);
    const isDriver = role === 'driver';
    const full = !isDriver && state.seats === 0;
    const canChoosePickup = step < 2 && !full;
    const canReview = result.ok && (isDriver || Boolean(passenger.readyAt));
    const shortMargin = result.ok && result.spareMinutes < 5;
    const pickupClock = result.valid ? placement(result.pickupTime, result.pickupNextDay) : '—';
    const arrivalClock = result.valid ? placement(result.arrival, result.nextDay) : '—';

    panelIds.forEach((id, index) => { $(id).hidden = step !== index; });
    actionIds.forEach((id, index) => { $(id).hidden = step !== index; });
    $('back-step').hidden = step === 0 || step === 3;
    $('driver').setAttribute('aria-pressed', String(isDriver));
    $('passenger').setAttribute('aria-pressed', String(!isDriver));

    for (const { route, button, detail, availability, offer } of routeControls) {
      const selected = route.id === state.route;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('route-full', !isDriver && offer.seats === 0);
      $('map-' + route.id).classList.toggle('selected', selected);
      detail.textContent = isDriver ? 'Trayecto sin recogidas' : 'Sale ' + offer.departure + ' · ' + route.minutes + ' min sin desvío';
      availability.textContent = isDriver ? route.minutes + ' min' : seatsLabel(offer.seats);
    }
    for (const { item, button, point } of pickupControls) {
      const selected = String(item.id === state.pickup);
      button.setAttribute('aria-pressed', selected);
      point.setAttribute('aria-pressed', selected);
      point.setAttribute('aria-disabled', String(!canChoosePickup));
      point.setAttribute('tabindex', canChoosePickup ? '0' : '-1');
    }

    $('route-heading').textContent = isDriver ? 'Elegí tu recorrido' : 'Puestos disponibles';
    $('route-count').textContent = isDriver ? TripDemo.routes.length + ' recorridos' : '2 con cupo';
    $('pickup-heading').textContent = isDriver ? '¿Dónde recogés?' : '¿Dónde te recogen?';
    $('pickup-hint').textContent = isDriver
      ? 'Elegí un punto de encuentro y configurá tu oferta.'
      : 'Elegí un punto y la hora a la que podés estar ahí.';
    $('driver-fields').hidden = !isDriver;
    $('passenger-fields').hidden = isDriver;
    $('offer-facts').textContent = 'Recogida a las ' + pickupClock + ' · Máximo ' + state.maxDetour + ' min de desvío';
    $('ready-at').value = passenger.readyAt;
    $('departure').value = driver.departure;
    $('detour').value = String(driver.maxDetour);
    $('seats').value = String(driver.seats);

    $('arrival').textContent = result.valid ? result.arrival : '—';
    $('arrival').classList.toggle('is-late', !result.ok);
    $('arrival-label').textContent = result.nextDay ? 'Llegada al otro día' : 'Llegada al campus';
    $('verdict').textContent = canReview ? (shortMargin ? 'Margen corto' : 'Llegás a tiempo') : 'Ajustá el recorrido';
    $('result').classList.toggle('has-conflict', !canReview);
    $('explanation').textContent = !isDriver && !passenger.readyAt
      ? 'Completá la hora a la que podés estar en el punto.'
      : describeArrival(result);

    $('route-next').firstElementChild.textContent = full ? 'Oferta sin cupos' : (isDriver ? 'Configurar oferta' : 'Elegir recogida');
    $('route-next').disabled = full;
    $('next').textContent = isDriver ? 'Revisar mi oferta' : 'Revisar mi solicitud';
    $('next').disabled = !canReview;
    $('simulate').textContent = isDriver ? 'Simular oferta' : 'Simular solicitud de cupo';
    $('simulate').disabled = !canReview;

    $('review-title').textContent = isDriver ? 'Así quedaría tu oferta' : 'Así quedaría tu solicitud';
    $('summary-pickup').textContent = result.pickup?.name ?? '—';
    $('pickup-time').textContent = pickupClock;
    $('review-arrival').textContent = arrivalClock;
    $('summary-detour').textContent = result.valid ? '+' + result.detour + ' min' : '—';
    $('summary-seats').textContent = String(state.seats);
    $('review-note').textContent = isDriver
      ? 'Revisá el punto de encuentro, la hora y los cupos que querés ofrecer.'
      : 'Estarías pidiendo un puesto. Quien maneja tendría que confirmar la recogida.';
    $('done-title').textContent = isDriver ? 'Oferta ensayada' : 'Solicitud ensayada';
    $('simulation-status').textContent = isDriver
      ? 'En un piloto, podrías recibir una solicitud para este recorrido.'
      : 'En un piloto, el siguiente paso sería esperar la confirmación de quien maneja.';

    const [x, y] = result.route?.anchor ?? [];
    $('pickup-line').setAttribute('d', result.detour ? 'M' + x + ' ' + y + 'L' + result.pickup.x + ' ' + result.pickup.y : '');
  }

  for (const option of ['driver', 'passenger']) {
    $(option).onclick = () => {
      if (role === option) return;
      role = option;
      goTo(0);
    };
  }
  $('departure').oninput = event => {
    driver.departure = event.target.value;
    paint();
  };
  $('detour').onchange = event => {
    driver.maxDetour = Number(event.target.value);
    paint();
  };
  $('seats').onchange = event => {
    driver.seats = Number(event.target.value);
    paint();
  };
  $('ready-at').oninput = event => {
    passenger.readyAt = event.target.value;
    paint();
  };
  $('route-next').onclick = () => {
    if (step === 0 && !$('route-next').disabled) goTo(1);
  };
  $('next').onclick = () => {
    if (step === 1 && !$('next').disabled) goTo(2);
  };
  $('simulate').onclick = () => {
    if (step === 2 && !$('simulate').disabled) goTo(3);
  };
  $('back-step').onclick = () => {
    if (step === 1 || step === 2) goTo(step - 1);
  };
  $('reset').onclick = () => {
    driver = { ...TripDemo.initial };
    passenger = { ...passengerDefaults };
    goTo(0);
  };
  paint();
}
