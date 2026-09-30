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
  let lang = store.get('dj-lang') || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
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
    b.addEventListener('click', () => { store.set('dj-lang', b.dataset.lang); applyLang(b.dataset.lang); }));

  /* ---------------- essays (from data/essays.json, synced by a GitHub Action) ---------------- */
  const FEATURED = ['hace-2-anos-hoy', 'no-me-pidan-que-elija', 'diecisiete-escalones'];
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
        el('span', 'feat__t', e.title),
        el('span', 'feat__d', lang === 'es' ? e.subtitle : (FEATURED_EN[e.slug] || e.subtitle)),
        el('span', 'feat__go mono', lang === 'es' ? 'Leer ↗' : 'Read (in Spanish) ↗')
      );
      feat.append(a);
    });
    essays.forEach((e, i) => {
      const li = el('li', 'essay');
      const a = el('a');
      a.href = e.url;
      a.append(
        el('span', 'mono', `N.º ${String(total - i).padStart(2, '0')}`),
        el('span', 'mono essay__date', fmtDate(e.date)),
        el('span', 'essay__t', e.title),
        el('span', 'essay__d', e.subtitle),
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
  const build = { p: reduce ? 1 : 0, spread: reduce ? 1 : 1.9, spin: reduce ? 0 : 1 };

  function measure() {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    fit = Math.min(w / 1100, h / 680) * 0.92;
    gap = w < 700 ? 90 : 150;
    base = w < 700 ? 0.92 : 0.66;
  }

  function render() {
    const p = build.p;
    const e = 1 - p;
    mx += (tmx - mx) * 0.06;
    my += (tmy - my) * 0.06;
    const s = fit * (base + (1 - base) * p);
    const rx = 56 * e - my * 10 * e + my * 6 * p;
    const rz = (-32 + mx * 12) * e - 40 * build.spin * e;
    const ry = mx * 8 * p;
    stage.style.transform = `translateY(${(e * 70).toFixed(1)}px) scale(${s.toFixed(4)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
    layers.forEach((l, i) => { l.style.transform = `translateZ(${(i * gap * build.spread * e).toFixed(1)}px)`; });
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

  /* the drawing arrives in pieces, drifts, then snaps together on its own */
  gsap.ticker.add(render);
  function assemble(delay) {
    return gsap.timeline({ delay })
      .to(build, { spin: 0, spread: 1, duration: 1.6, ease: 'power3.out' })
      .to(build, { p: 1, duration: 1.9, ease: 'expo.inOut' }, '+=0.5')
      .fromTo(stage, { filter: 'brightness(1.6)' }, { filter: 'brightness(1)', duration: 0.6, ease: 'power2.out' }, '-=0.15');
  }
  gsap.set(stage, { opacity: 0 });
  gsap.to(stage, { opacity: 1, duration: 0.8, delay: 0.1 });
  assemble(0.2);
  gsap.from('.hero__meta, .hero__foot', { opacity: 0, y: 20, duration: 1, delay: 3.2, stagger: 0.15, ease: 'power2.out' });

  document.getElementById('replay').addEventListener('click', () => {
    gsap.timeline()
      .to(build, { p: 0, spread: 1.9, duration: 1.2, ease: 'expo.inOut' })
      .to(build, { spin: 1, duration: 0.8, ease: 'power2.inOut' }, '<0.3')
      .add(assemble(0.4));
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
