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
  bindTilt(document.querySelectorAll('.card'));

  /* ---------------- hero: exploded view ---------------- */
  const hero = document.querySelector('.hero');
  const stage = document.getElementById('stage');
  const viewport = document.querySelector('.hero__viewport');
  const layers = [...stage.querySelectorAll('.layer')];
  const stateEl = document.querySelector('.hero__state');
  let fit = 0.8, gap = 150, base = 0.66;
  let scrollP = 0, introP = 1, mx = 0, my = 0, tmx = 0, tmy = 0, lastState = null;

  function measure() {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    fit = Math.min(w / 1100, h / 680) * 0.92;
    gap = w < 700 ? 90 : 150;
    base = w < 700 ? 0.92 : 0.66;
  }

  function render() {
    const p = reduce ? 1 : Math.max(scrollP, introP);
    const e = 1 - p;
    mx += (tmx - mx) * 0.08;
    my += (tmy - my) * 0.08;
    const s = fit * (base + (1 - base) * p);
    const rx = 56 * e - my * 10 * e + my * 3 * p;
    const rz = (-32 + mx * 12) * e;
    const ry = mx * 4 * p;
    stage.style.transform = `translateY(${(e * 70).toFixed(1)}px) scale(${s.toFixed(4)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
    layers.forEach((l, i) => { l.style.transform = `translateZ(${(i * gap * e).toFixed(1)}px)`; });
    hero.style.setProperty('--p', p.toFixed(3));
    const st = p > 0.97 ? 'hero.state.assembled' : 'hero.state.exploded';
    if (st !== lastState) { lastState = st; stateEl.innerHTML = t(st); }
  }

  measure();
  applyLang(lang);
  window.addEventListener('resize', () => { measure(); render(); });

  if (!hasGsap || reduce) {
    render();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09 });
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

  /* intro: the flat page comes apart into its layers */
  const intro = { v: window.scrollY > 10 ? 0 : 1 };
  gsap.to(intro, { v: 0, duration: 2.2, delay: 0.35, ease: 'power3.inOut', onUpdate: () => { introP = intro.v; } });
  introP = intro.v;

  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (self) => { scrollP = clamp(self.progress / 0.8); }
  });
  hero.addEventListener('pointermove', (ev) => {
    tmx = ev.clientX / window.innerWidth - 0.5;
    tmy = ev.clientY / window.innerHeight - 0.5;
  });
  gsap.ticker.add(render);

  gsap.from('.hero__meta, .hero__foot', { opacity: 0, y: 20, duration: 1, delay: 1.2, stagger: 0.15, ease: 'power2.out' });

  /* stats count up */
  document.querySelectorAll('[data-count]').forEach((n) => {
    const end = +n.dataset.count, pre = n.dataset.prefix || '', suf = n.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: n, start: 'top 85%', once: true },
      onUpdate: () => { n.textContent = pre + Math.round(o.v) + suf; }
    });
  });

  /* manifesto: words rise into place */
  document.querySelectorAll('.split').forEach((s) => {
    s.innerHTML = s.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  });
  gsap.from('.manifesto__title .w', {
    yPercent: 110, rotateX: -60, opacity: 0, stagger: 0.08, ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top 80%', end: 'top 25%', scrub: 0.6 }
  });
  gsap.from('.principle', {
    y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.principles', start: 'top 85%', once: true }
  });

  /* bill of materials: sheets fold up off the drafting table */
  gsap.utils.toArray('.part').forEach((part) => {
    gsap.fromTo(part, { rotateX: -78, opacity: 0, y: 40 }, {
      rotateX: 0, opacity: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: part, start: 'top 98%', end: 'top 62%', scrub: 0.5 }
    });
  });

  /* builds: cards drop onto the bench */
  gsap.utils.toArray('.card').forEach((c, i) => {
    gsap.from(c, {
      z: -300, rotateX: 25, opacity: 0, duration: 1.1, ease: 'power3.out', delay: (i % 3) * 0.08,
      clearProps: 'transform',
      scrollTrigger: { trigger: c, start: 'top 90%', once: true }
    });
  });

  /* coffee: the roast curve draws itself, the chart tilts up */
  ['.roast__bt', '.roast__ror'].forEach((sel, i) => {
    const path = document.querySelector(sel);
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: i ? '6 6' : len, strokeDashoffset: i ? 0 : len });
    if (!i) gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.coffee', start: 'top 70%', end: 'center 45%', scrub: 0.6 } });
  });
  gsap.from('.roast', { rotateX: 55, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.coffee', start: 'top 85%', end: 'center 55%', scrub: 0.6 } });
  gsap.from('.coffee__shot', { y: 120, opacity: 0, rotateX: 30, duration: 1.2, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.coffee__shot', start: 'top 92%', once: true } });

  /* hire + archive + footer */
  gsap.from('.offers li', { x: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.offers', start: 'top 85%', once: true } });
  gsap.from('.foot__big', { yPercent: 30, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.foot', start: 'top 80%', once: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
