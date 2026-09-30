(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------- language ---------------- */
  const ES = window.DJ_ES || {};
  const EN_EXTRA = { 'hero.state.assembled': 'State: assembled' };
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const EN = {};
  nodes.forEach((n) => { if (!(n.dataset.i18n in EN)) EN[n.dataset.i18n] = n.innerHTML; });
  Object.assign(EN, EN_EXTRA);
  const qLang = new URLSearchParams(location.search).get('lang');
  let lang = (qLang === 'es' || qLang === 'en' ? qLang : null) || store.get('dj-lang') || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
  const t = (key) => (lang === 'es' ? ES[key] : EN[key]) ?? EN[key] ?? '';

  function applyLang(next) {
    lang = next === 'es' ? 'es' : 'en';
    root.lang = lang;
    nodes.forEach((n) => { const v = t(n.dataset.i18n); if (v) n.innerHTML = v; });
    document.querySelectorAll('.part__n').forEach((n, i) => { n.textContent = `${lang === 'es' ? 'Pieza' : 'Part'} ${String(i + 1).padStart(2, '0')}`; });
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = lang === 'es' ? 'Daniel Jaramillo — Dame el caos.' : 'Daniel Jaramillo — Give me the mess.';
    renderEssays();
    lastState = null;
    if (hasGsap) ScrollTrigger.refresh();
  }
  document.querySelectorAll('.lang button').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.dataset.lang === lang) return;
      store.set('dj-lang', b.dataset.lang);
      if (window.gsap && !reduce) { const u = new URL(location.href); u.searchParams.set('lang', b.dataset.lang); u.hash = ''; location.href = u.toString(); } else applyLang(b.dataset.lang);
    }));

  /* ---------------- essays (from data/essays.json, synced by a GitHub Action) ---------------- */
  const FEATURED = ['hace-2-anos-hoy', 'no-me-pidan-que-elija', 'diecisiete-escalones'];
  // English titles for the Spanish essays (new essays fall back to their Spanish title)
  const ESSAYS_EN = {
    'que-pena': ['So Sorry', 'On the most expensive word in the language, the small change I dodge it with, and a debt I’ve owed for years'],
    'diecisiete-escalones': ['Seventeen Steps', 'On a coffee ritual that’s never the same, perception as a craft, and everything you climb without counting'],
    'hacer-facil-lo-dificil': ['Making the Hard Look Easy', 'On the process nobody sees, the value nobody measures, and why playing in the subway is sometimes fine'],
    'pantalones-grandes': ['Pants Too Big', 'On the anxiety that lives in the calm, the noise that doesn’t need you, and why being enough doesn’t require doing more'],
    'permiso-para-parar': ['Permission to Stop', 'On the stillness you don’t choose, the noise you do, and what’s left when you switch everything off'],
    'debajo-de-la-roca': ['Under the Rock', 'On attention that doesn’t stretch far enough, the shells you have to shed, and why it’s fine not to carry everything'],
    'bailar-sin-coreografia': ['Dancing Without Choreography', 'On choosing yourself, what it costs, and why the goal isn’t to arrive but to be here'],
    'yo-me-encargo': ['I’ve Got It', 'On expecting nothing, remembering everything, and the shadow left between the two'],
    'opinar-es-gratis': ['Opinions Are Free', 'On the real price of knowing something, experts who aren’t, and why I’d rather be wrong out loud'],
    'no-me-pidan-que-elija': ['Don’t Make Me Choose', 'On generalists, pivots and the structure that lets you do whatever you want'],
    'muy-llevado-de-su-parecer': ['Stubbornly My Own', 'On subcultures, genuine obsessions, and the difference between being absorbed by something and building yourself from within'],
    'la-arquitectura-de-la-acumulacion': ['The Architecture of Accumulation', 'Notes on a year living in the capital (more reflections than notes)'],
    'hace-2-anos-hoy': ['Two Years Ago Today', 'I lost (almost) everything']
  };
  const eTitle = (e) => (lang === 'en' && ESSAYS_EN[e.slug] ? ESSAYS_EN[e.slug][0] : e.title);
  const eSub = (e) => (lang === 'en' && ESSAYS_EN[e.slug] ? ESSAYS_EN[e.slug][1] : e.subtitle);
  const FEATURED_EN = {
    'hace-2-anos-hoy': 'I lost (almost) everything. The Germany story, told in full.',
    'no-me-pidan-que-elija': 'On generalists, pivots, and why problems — not industries — are my unit of measure.',
    'diecisiete-escalones': 'A coffee ritual that is never the same, and perception as a craft.'
  };
  let essays = [];
  const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  function renderEssays() {
    const feat = document.getElementById('featured');
    const list = document.getElementById('essays');
    if (!essays.length) return;
    const total = essays.length;
    feat.replaceChildren();
    list.replaceChildren();
    FEATURED.map((s) => essays.findIndex((e) => e.slug === s)).filter((i) => i > -1).forEach((i) => {
      const e = essays[i];
      const a = el('a', 'feat');
      a.href = e.url;
      a.append(
        el('span', 'feat__meta mono', `${lang === 'es' ? 'Ensayo' : 'Essay'} ${String(total - i).padStart(2, '0')} · ${fmtDate(e.date)}`),
        el('span', 'feat__t', eTitle(e)),
        el('span', 'feat__d', lang === 'es' ? e.subtitle : (FEATURED_EN[e.slug] || eSub(e))),
        el('span', 'feat__go mono', lang === 'es' ? 'Leer ↗' : 'Read (in Spanish) ↗')
      );
      feat.append(a);
    });
    essays.forEach((e, i) => {
      const li = el('li', 'essay');
      const a = el('a');
      a.href = e.url;
      a.append(
        el('span', 'mono', `${lang === 'es' ? 'N.º' : 'No.'} ${String(total - i).padStart(2, '0')}`),
        el('span', 'mono essay__date', fmtDate(e.date)),
        el('span', 'essay__t', eTitle(e)),
        el('span', 'essay__d', eSub(e)),
        el('span', 'mono', '↗')
      );
      li.append(a);
      list.append(li);
    });
    bindTilt(feat.querySelectorAll('.feat'), 5);
  }

  fetch('data/essays.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((d) => { essays = d.essays || []; renderEssays(); if (hasGsap) ScrollTrigger.refresh(); })
    .catch(() => {
      const list = document.getElementById('essays');
      const li = el('li', 'essay');
      const a = el('a');
      a.href = 'https://danieljaramillor.substack.com/archive';
      a.append(el('span', 'essay__t', 'Substack ↗'));
      li.append(a);
      list.append(li);
    });

  /* ---------------- 3D tilt ---------------- */
  function bindTilt(els, max = 7) {
    if (reduce || !window.matchMedia('(hover: hover)').matches) return;
    els.forEach((card) => {
      card.addEventListener('pointermove', (ev) => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(10px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
  /* ---------------- hero: exploded view that assembles itself ---------------- */
  const hero = document.querySelector('.hero');
  const stage = document.getElementById('stage');
  const viewport = document.querySelector('.hero__viewport');
  const layers = [...stage.querySelectorAll('.layer')];
  const stateEl = document.querySelector('.hero__state');
  let fit = 0.8, gap = 150, base = 0.66;
  let mx = 0, my = 0, tmx = 0, tmy = 0, lastState = null;
  const build = { p: reduce ? 1 : 0, spread: reduce ? 1 : 1.9, spin: reduce ? 0 : 1, shake: 0, pulse: 1 };
  const drops = layers.map(() => ({ d: reduce ? 0 : 1, o: reduce ? 1 : 0 }));

  function measure() {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    fit = Math.min(w / 1100, h / 680) * 0.92;
    gap = w < 700 ? 90 : 150;
    base = w < 700 ? 0.92 : 0.6;
  }

  function render() {
    const p = build.p;
    const e = 1 - p;
    mx += (tmx - mx) * 0.06;
    my += (tmy - my) * 0.06;
    const s = fit * (base + (1 - base) * p) * build.pulse;
    const rx = 56 * e - my * 10 * e + my * 6 * p;
    const rz = (-32 + mx * 12) * e - 40 * build.spin * e;
    const ry = mx * 8 * p;
    stage.style.transform = `translateY(${(e * 130 + build.shake).toFixed(1)}px) scale(${s.toFixed(4)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
    layers.forEach((l, i) => {
      l.style.transform = `translateZ(${(i * gap * build.spread * e + drops[i].d * 1600).toFixed(1)}px)`;
      l.style.opacity = drops[i].o.toFixed(3);
    });
    hero.style.setProperty('--p', p.toFixed(3));
    const st = p > 0.97 ? 'hero.state.assembled' : 'hero.state.exploded';
    if (st !== lastState) { lastState = st; stateEl.innerHTML = t(st); }
  }

  measure();
  applyLang(lang);
  window.addEventListener('resize', () => { measure(); render(); });

  if (!hasGsap || reduce) {
    build.p = 1;
    render();
    document.getElementById('replay').hidden = true;
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const desktop = window.matchMedia('(min-width: 1001px)').matches;

  /* smooth scroll */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.085 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : document.querySelector(id);
      if (target === null) return;
      ev.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    }));
  }

  /* scroll progress: construction status */
  gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  /* ---- the build sequence: blueprint draws, layers land one by one, the stack slams together ---- */
  gsap.ticker.add(render);
  const logEl = document.getElementById('log');
  const shock = document.querySelector('.shock');
  const flash = document.querySelector('.flash');
  const markEl = document.querySelector('.type__head mark');
  const bp = document.querySelector('.blueprint');

  function drawBlueprint() {
    const w = bp.clientWidth, h = bp.clientHeight, cx = w / 2, cy = h / 2, step = w < 700 ? 48 : 80;
    let lines = '';
    for (let x = cx % step; x < w; x += step) lines += `<line x1="${x}" y1="${cy}" x2="${x}" y2="${x % (step * 4) < 1 ? 0 : cy}" data-d="${Math.abs(x - cx)}"/><line x1="${x}" y1="${cy}" x2="${x}" y2="${h}" data-d="${Math.abs(x - cx)}"/>`;
    for (let y = cy % step; y < h; y += step) lines += `<line x1="${cx}" y1="${y}" x2="0" y2="${y}" data-d="${Math.abs(y - cy)}"/><line x1="${cx}" y1="${y}" x2="${w}" y2="${y}" data-d="${Math.abs(y - cy)}"/>`;
    bp.setAttribute('viewBox', `0 0 ${w} ${h}`);
    bp.innerHTML = `<g class="bp-grid">${lines}</g><g class="bp-cross"><line x1="${cx - 40}" y1="${cy}" x2="${cx + 40}" y2="${cy}"/><line x1="${cx}" y1="${cy - 40}" x2="${cx}" y2="${cy + 40}"/><circle cx="${cx}" cy="${cy}" r="120"/></g>`;
    bp.querySelectorAll('line, circle').forEach((l) => { const len = l.getTotalLength ? l.getTotalLength() : 2000; l.style.strokeDasharray = len; l.style.strokeDashoffset = len; });
  }

  let intro = null;
  function buildSequence() {
    if (intro) intro.kill();
    drawBlueprint();
    const tags = layers.map((l) => (l.querySelector('.tag') || {}).textContent || '');
    const log = (txt) => () => { logEl.innerHTML = txt; };
    build.p = 0; build.spread = 1.9; build.spin = 1;
    drops.forEach((d) => { d.d = 1; d.o = 0; });
    gsap.set(markEl, { backgroundSize: '0% 100%' });
    gsap.set('.type__tag', { opacity: 0, y: 16 });
    gsap.set(bp, { opacity: 1 });
    gsap.set(shock, { scale: 0, opacity: 0 });
    gsap.set(flash, { opacity: 0 });
    intro = gsap.timeline({ onComplete: () => { logEl.innerHTML = lang === 'es' ? '▸ Obra lista · 5/5 capas <span class="ok">✓</span>' : '▸ Build complete · 5/5 layers <span class="ok">✓</span>'; } });
    intro
      .add(log('▸ DWG DJR-001 · ' + (lang === 'es' ? 'iniciando' : 'initializing')))
      .to(bp.querySelectorAll('.bp-cross *'), { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' })
      .to([...bp.querySelectorAll('.bp-grid line')].sort((a, b) => a.dataset.d - b.dataset.d), { strokeDashoffset: 0, duration: 0.9, ease: 'power3.out', stagger: 0.008 }, 0.15)
      .to(build, { spin: 0.35, duration: 3.4, ease: 'sine.inOut' }, 0.5);
    drops.forEach((d, i) => {
      const at = 0.7 + i * 0.42;
      intro
        .to(d, { o: 1, duration: 0.25, ease: 'none' }, at)
        .to(d, { d: 0, duration: 0.7, ease: 'back.out(1.15)' }, at)
        .add(log(`▸ ${String(i + 1).padStart(2, '0')}/05 &nbsp;${tags[i].replace(/^\d+\s—\s/, '')} <span class="ok">✓</span>`), at + 0.45)
        .fromTo(build, { shake: 0 }, { shake: 7, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at + 0.55);
    });
    intro
      .add(log('▸ ' + (lang === 'es' ? 'ensamblando…' : 'assembling…')), 3.2)
      .to(build, { spin: 0, spread: 1, duration: 0.9, ease: 'power2.inOut' }, 3.0)
      .to(build, { p: 1, duration: 1.15, ease: 'expo.in' }, 3.6)
      .to(bp, { opacity: 0.25, duration: 0.6 }, 4.4)
      .fromTo(flash, { opacity: 0.55 }, { opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, 4.75)
      .fromTo(shock, { scale: 0.2, opacity: 0.9 }, { scale: 7, opacity: 0, duration: 1.3, ease: 'power3.out' }, 4.75)
      .fromTo(build, { pulse: 1.04 }, { pulse: 1, duration: 0.8, ease: 'elastic.out(1, 0.45)' }, 4.75)
      .to(markEl, { backgroundSize: '100% 100%', duration: 0.5, ease: 'power3.inOut' }, 5.1)
      .to('.type__tag', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 5.3)
      .fromTo('.hero__meta, .hero__actions, .hero__hint', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 5.3);
    return intro;
  }
  buildSequence();
  /* impatient visitors: a click, key or scroll fast-forwards the sequence */
  const hurry = () => { if (intro && intro.isActive()) intro.timeScale(4); };
  hero.addEventListener('pointerdown', (ev) => { if (!ev.target.closest('a, button')) hurry(); });
  window.addEventListener('wheel', hurry, { passive: true });
  window.addEventListener('keydown', hurry);
  window.addEventListener('touchmove', hurry, { passive: true });
  window.addEventListener('resize', () => { if (!intro || !intro.isActive()) { drawBlueprint(); gsap.set(bp.querySelectorAll('line, circle'), { strokeDashoffset: 0 }); } });

  document.getElementById('replay').addEventListener('click', () => {
    gsap.timeline()
      .to(build, { p: 0, spread: 1.9, spin: 0.6, duration: 1, ease: 'expo.inOut' })
      .to(drops, { d: 1, o: 0, duration: 0.6, stagger: -0.08, ease: 'power2.in' }, 0.4)
      .add(() => { buildSequence(); });
  });

  hero.addEventListener('pointermove', (ev) => {
    tmx = ev.clientX / window.innerWidth - 0.5;
    tmy = ev.clientY / window.innerHeight - 0.5;
  });
  hero.addEventListener('pointerleave', () => { tmx = 0; tmy = 0; });

  /* leaving the hero: the drawing sinks back into the table */
  gsap.to('.hero__viewport', { yPercent: 18, scale: 0.9, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

  /* stats count up */
  document.querySelectorAll('[data-count]').forEach((n) => {
    const end = +n.dataset.count, pre = n.dataset.prefix || '', suf = n.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: n, start: 'top 88%', once: true },
      onUpdate: () => { n.textContent = pre + Math.round(o.v) + suf; }
    });
  });

  /* split text into letters (kept inside words so lines never break mid-word) */
  const splitChars = (elm) => {
    elm.innerHTML = elm.textContent.trim().split(/\s+/)
      .map((w) => `<span class="word">${[...w].map((c) => `<span class="c">${c}</span>`).join('')}</span>`).join(' ');
    return elm.querySelectorAll('.c');
  };
  const rnd = gsap.utils.random;
  const scatter = { x: () => rnd(-700, 700), y: () => rnd(-420, 420), z: () => rnd(-900, 500), rotationX: () => rnd(-180, 180), rotationY: () => rnd(-180, 180), rotationZ: () => rnd(-90, 90), opacity: 0 };

  /* manifesto: “no borro nada” — every letter falls into place, pinned */
  const manChars = [...document.querySelectorAll('.manifesto__title .chars')].flatMap((c) => [...splitChars(c)]);
  gsap.timeline({
    scrollTrigger: { trigger: '.manifesto__pin', start: 'top top', end: '+=140%', pin: true, scrub: 0.8 }
  })
    .from(manChars, { ...scatter, stagger: { each: 0.02, from: 'random' }, duration: 1, ease: 'power2.out' })
    .from('.manifesto__lede', { opacity: 0, y: 40, duration: 0.4 }, '-=0.2');
  gsap.from('.principle', {
    y: 80, rotateX: -30, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.principles', start: 'top 85%', once: true }
  });

  /* bill of materials: each sheet lands on the pile, the ones below tilt back and dim */
  const parts = gsap.utils.toArray('.part');
  parts.forEach((part, i) => {
    part.style.setProperty('--i', i);
    const next = parts[i + 1];
    if (!next) return;
    gsap.fromTo(part, { scale: 1, y: 0, filter: 'brightness(1)' }, {
      scale: 0.93, y: -10, filter: 'brightness(0.94)', ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true }
    });
  });

  /* builds: a pinned horizontal rail of 3D cards on desktop */
  const builds = document.querySelector('.builds');
  const bench = document.querySelector('.bench');
  const cards = gsap.utils.toArray('.card');
  if (desktop) {
    builds.classList.add('is-rail');
    const dist = () => bench.scrollWidth - window.innerWidth;
    const rail = gsap.to(bench, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: builds, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true }
    });
    cards.forEach((c) => {
      gsap.fromTo(c, { rotateY: -32, z: -260, opacity: 0.35 }, {
        rotateY: 0, z: 0, opacity: 1, ease: 'none',
        scrollTrigger: { containerAnimation: rail, trigger: c, start: 'left right', end: 'left 35%', scrub: true }
      });
    });
  } else {
    bindTilt(cards);
    cards.forEach((c) => gsap.from(c, { y: 80, rotateX: 20, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: c, start: 'top 90%', once: true } }));
  }

  /* coffee: one screen — the roast draws itself, the markers pop, the site slides in */
  const bt = document.querySelector('.roast__bt');
  const len = bt.getTotalLength();
  gsap.set(bt, { strokeDasharray: len, strokeDashoffset: len });
  gsap.timeline({ scrollTrigger: { trigger: '.coffee', start: 'top 60%', once: true } })
    .from('.coffee__copy > *', { y: 40, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' })
    .from('.roast', { rotateX: 60, opacity: 0, duration: 1.1, ease: 'power3.out' }, 0)
    .to(bt, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0.3)
    .from('.roast__ror', { opacity: 0, duration: 1 }, 0.6)
    .from('.roast circle', { scale: 0, transformOrigin: '50% 50%', stagger: 0.45, duration: 0.5, ease: 'back.out(3)' }, 0.9)
    .from('.roast__lbl', { opacity: 0, y: 8, stagger: 0.3, duration: 0.5 }, 1)
    .from('.coffee__shot', { y: 140, rotate: 8, opacity: 0, duration: 1.2, ease: 'power3.out', clearProps: 'transform' }, 1.4);

  /* hire */
  gsap.from('.hire h2', { yPercent: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.hire', start: 'top 75%', once: true } });
  gsap.from('.offers li', { x: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.offers', start: 'top 85%', once: true } });

  /* archive rows slide in */
  ScrollTrigger.batch('.essay', { start: 'top 92%', once: true, onEnter: (els) => gsap.from(els, { x: -40, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' }) });

  /* footer: the mess assembles itself */
  const footChars = [...document.querySelectorAll('.foot__big [data-i18n]')].flatMap((c) => [...splitChars(c)]);
  gsap.from(footChars, { ...scatter, stagger: { each: 0.02, from: 'random' }, ease: 'power2.out', scrollTrigger: { trigger: '.foot', start: 'top 85%', end: 'top 20%', scrub: 0.8 } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
