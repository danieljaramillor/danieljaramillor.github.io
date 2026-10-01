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
  // decided in <head> before first paint (URL, then the visitor's own choice, then the device's languages); this is the fallback
  let lang = window.__djLang || (qLang === 'es' || qLang === 'en' ? qLang : null) || store.get('dj-lang') || ((navigator.languages || [navigator.language || '']).map((x) => String(x).slice(0, 2).toLowerCase()).find((x) => x === 'es' || x === 'en') || 'en');
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
  // English titles for the Spanish essays (new essays fall back to their Spanish title)
  const ESSAYS_EN = {
    'que-pena': ['Small Change', 'On the most expensive word in the language, the small change I use to dodge it, and a debt I’ve gone years without paying'],
    'diecisiete-escalones': ['Seventeen Steps', 'On a coffee ritual that’s never the same, perception as a craft, and everything we climb without counting'],
    'hacer-facil-lo-dificil': ['Making Hard Look Easy', 'On the process nobody sees, the value nobody measures, and why sometimes playing in the subway is fine'],
    'pantalones-grandes': ['Pants a Size Too Big', 'On the anxiety that lives in the calm, the noise that doesn’t need you, and why being enough doesn’t require doing more'],
    'permiso-para-parar': ['Permission to Stop', 'On the stillness you don’t choose, the noise you do, and what’s left when you switch everything off'],
    'debajo-de-la-roca': ['Under the Rock', 'On attention that runs short, the shells you have to shed, and why it’s okay not to manage everything'],
    'bailar-sin-coreografia': ['Dancing Without Choreography', 'On choosing yourself, what it costs, and why the goal isn’t to arrive but to be here'],
    'yo-me-encargo': ['I’ll Take Care of It', 'On expecting nothing, remembering everything, and the shadow that falls between the two'],
    'opinar-es-gratis': ['Talk Is Cheap', 'On the real price of knowing something, the experts who aren’t, and why I’d rather be wrong out loud'],
    'no-me-pidan-que-elija': ['Don’t Make Me Choose', 'On generalists, pivots, and the structure that lets you do whatever you want'],
    'muy-llevado-de-su-parecer': ['Headstrong', 'On subcultures, genuine obsessions, and the difference between getting absorbed in something and building yourself from the inside'],
    'la-arquitectura-de-la-acumulacion': ['The Architecture of Accumulation', 'Notes on a year of living in the capital (less notes, really, than reflections)'],
    'hace-2-anos-hoy': ['Two Years Ago Today', 'I lost (almost) everything']
  };
  /* one row per essay, in the reader's language: the English post when one exists, otherwise the Spanish original */
  const SUBSTACK = { es: 'https://danieljaramillor.substack.com', en: 'https://danieljaramilloren.substack.com' };
  const view = (e) => {
    if (e.en_only) return { ...e, spanish: false, english: true };
    if (lang === 'en' && e.en) return { slug: e.slug, date: e.date, title: e.en.title, subtitle: e.en.subtitle, url: e.en.url, spanish: false };
    if (lang === 'en') return { slug: e.slug, date: e.date, title: ESSAYS_EN[e.slug] ? ESSAYS_EN[e.slug][0] : e.title, subtitle: ESSAYS_EN[e.slug] ? ESSAYS_EN[e.slug][1] : e.subtitle, url: e.url, spanish: true };
    return { slug: e.slug, date: e.date, title: e.title, subtitle: e.subtitle, url: e.url, spanish: false };
  };
  let essays = [];
  const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* the archive: three picks to start with, then every essay as a plain, searchable index; a thin bar beside each one shows its length */
  const PICKS = [
    ['hace-2-anos-hoy', { en: 'The story', es: 'La historia' }, { en: 'I lost (almost) everything. The Germany story, told in full.', es: 'Lo perdí (casi) todo. La historia de Alemania, completa.' }],
    ['no-me-pidan-que-elija', { en: 'The generalist', es: 'El generalista' }, { en: 'On generalists, pivots, and why problems, not industries, are my unit of measure.', es: 'Sobre generalistas, pivotes y por qué mi unidad de medida son los problemas, no las industrias.' }],
    ['la-arquitectura-de-la-acumulacion', { en: 'The philosophy', es: 'La filosofía' }, { en: 'The essay this whole site is built on: nothing gets deleted, everything becomes foundation.', es: 'El ensayo sobre el que está construida esta página: nada se borra, todo se vuelve cimiento.' }],
  ];
  const shelf = { sort: 'old', q: '' };
  const norm = (x) => (x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const pad = (n) => String(n).padStart(2, '0');
  const L = () => (lang === 'es'
    ? { essays: 'ensayos', none: 'Nada en el archivo con', min: 'min', read: 'Leer', ph: 'Buscá por título o tema', inEs: '', inEn: 'en inglés' }
    : { essays: 'essays', none: 'Nothing in the archive matches', min: 'min', read: 'Read', ph: 'Search by title or theme', inEs: 'in Spanish', inEn: '' });
  const mins = (w) => Math.max(1, Math.round(w / 230));

  function renderEssays() {
    const list = document.getElementById('shelfList');
    if (!list || !essays.length) return;
    const l = L();
    const chron = [...essays].sort((x, y) => (x.date < y.date ? -1 : 1));
    const words = essays.map((e) => e.words || 3500);
    const wMin = Math.min(...words), wMax = Math.max(...words);
    const total = words.reduce((a, b) => a + b, 0);
    document.getElementById('stEssays').textContent = essays.length;
    document.getElementById('stWords').textContent = total.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
    document.getElementById('stHours').textContent = (total / 230 / 60).toFixed(1).replace('.', lang === 'es' ? ',' : '.') + ' h';
    document.getElementById('shelfQ').placeholder = l.ph;

    shelf.items = chron.map((raw, i) => {
      const e = view(raw);
      const w = raw.words || 3500;
      const n = i + 1;
      const note = lang === 'en' && e.spanish ? l.inEs : lang === 'es' && e.english ? l.inEn : '';
      const li = el('li');
      const a = el('a');
      a.href = e.url;
      const tt = el('span');
      const t = el('span', 'li__t', e.title);
      if (note) t.append(el('span', 'mono li__note', note));
      tt.append(t, el('span', 'li__d', e.subtitle));
      const len = el('span', 'mono li__len');
      const bar = el('i', 'li__bar');
      bar.style.setProperty('--len', (w / wMax).toFixed(3)); // how long this one is, against the longest
      len.append(bar, document.createTextNode(`${mins(w)} ${l.min}`));
      a.append(el('span', 'mono li__n', pad(n)), tt, el('span', 'mono li__m', fmtDate(raw.date)), len, el('span', 'mono li__go', '↗'));
      li.append(a);
      const it = { raw, e, li, n, w, hay: norm([raw.title, raw.subtitle, raw.en && raw.en.title, raw.en && raw.en.subtitle, ESSAYS_EN[raw.slug] && ESSAYS_EN[raw.slug].join(' ')].join(' ')) };
      return it;
    });
    place();
    filter();

    // the three picks
    const grid = document.getElementById('picks');
    grid.replaceChildren(...PICKS.map(([slug, tag, pitch]) => {
      const it = shelf.items.find((x) => x.raw.slug === slug);
      if (!it) return null;
      const e = it.e;
      const note = lang === 'en' && e.spanish ? ` · ${l.inEs}` : lang === 'es' && e.english ? ` · ${l.inEn}` : '';
      const a = el('a', 'pick');
      a.href = e.url;
      const top = el('span', 'pick__top');
      top.append(el('span', 'mono pick__tag', tag[lang]), el('span', 'pick__n', pad(it.n)));
      const go = el('span', 'mono pick__go');
      go.append(el('span', null, `${mins(it.w)} ${l.min}${note}`), el('b', null, `${l.read} ↗`));
      a.append(top, el('span', 'pick__t', e.title), el('span', 'pick__d', pitch[lang]), go);
      return a;
    }).filter(Boolean));

    if (hasGsap && !reduce && !shelf.intro) {
      shelf.intro = true;
      gsap.from('.pick', { y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.picks', start: 'top 85%', once: true } });
      gsap.from('.li__bar', { scaleX: 0, transformOrigin: '0 50%', stagger: 0.04, duration: 0.8, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '#shelfList', start: 'top 85%', once: true } });
    }
  }
  function order() {
    const it = [...shelf.items];
    if (shelf.sort === 'new') it.reverse();
    if (shelf.sort === 'long') it.sort((a, b) => b.w - a.w);
    return it;
  }
  function place() {
    document.getElementById('shelfList').replaceChildren(...order().map((it) => it.li));
  }
  function filter() {
    const q = norm(shelf.q.trim());
    let n = 0;
    shelf.items.forEach((it) => { const hit = !q || it.hay.includes(q); it.li.hidden = !hit; if (hit) n++; });
    const l = L();
    document.getElementById('shelfCount').textContent = q ? `${n} / ${shelf.items.length}` : `${shelf.items.length} ${l.essays}`;
    const list = document.getElementById('shelfList');
    list.querySelector('.shelf__empty')?.remove();
    if (!n) { const li = el('li', 'shelf__empty', `${l.none} “${shelf.q.trim()}”.`); list.append(li); }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  const sq = document.getElementById('shelfQ');
  sq.addEventListener('input', () => { shelf.q = sq.value; if (shelf.items) filter(); });
  sq.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' || !shelf.items) return;
    ev.preventDefault();
    const first = order().find((it) => !it.li.hidden);
    if (first) first.li.querySelector('a').focus();
  });
  document.querySelectorAll('.seg--sort button').forEach((b) => b.addEventListener('click', () => {
    if (!shelf.items || shelf.sort === b.dataset.sort) return;
    document.querySelectorAll('.seg--sort button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const before = new Map(shelf.items.map((it) => [it, it.li.getBoundingClientRect().top]));
    shelf.sort = b.dataset.sort;
    place();
    if (reduce) return;
    shelf.items.forEach((it) => { it.li.style.transition = 'none'; it.li.style.translate = `0 ${before.get(it) - it.li.getBoundingClientRect().top}px`; });
    document.getElementById('shelfList').offsetWidth;
    shelf.items.forEach((it) => { it.li.style.transition = 'translate .6s cubic-bezier(.65,0,.25,1)'; it.li.style.translate = '0 0'; });
    setTimeout(() => shelf.items.forEach((it) => { it.li.style.transition = it.li.style.translate = ''; }), 700);
  }));

  /* every essay link on the page (pillar sources, the Germany story) points to the reader's language once a translation exists */
  function relinkEssays() {
    if (lang !== 'en') return;
    const enUrl = {};
    essays.forEach((e) => { if (e.en) enUrl[e.slug] = e.en.url; });
    const swap = (href) => {
      const m = href && href.match(/danieljaramillor\.substack\.com\/p\/([a-z0-9-]+)/);
      return m && enUrl[m[1]];
    };
    document.querySelectorAll('a[href*="danieljaramillor.substack.com/p/"]').forEach((a) => { const u = swap(a.href); if (u) a.href = u; });
    document.querySelectorAll('.col[data-href]').forEach((c) => { const u = swap(c.dataset.href); if (u) c.dataset.href = u; });
  }

  /* the subscribe and Substack links follow the language too */
  document.querySelectorAll('a[href^="https://danieljaramillor.substack.com"]:not([href*="/p/"])').forEach((a) => {
    if (lang === 'en') a.href = a.href.replace(SUBSTACK.es, SUBSTACK.en);
  });

  fetch('data/essays.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((d) => { essays = [...(d.essays || []), ...(d.en_only || []).map((e) => ({ ...e, en_only: true }))]; renderEssays(); relinkEssays(); if (hasGsap) ScrollTrigger.refresh(); })
    .catch(() => {
      const li = el('li', 'shelf__empty');
      const a = el('a', 'btn btn--ink', 'Substack ↗');
      a.href = (lang === 'en' ? SUBSTACK.en : SUBSTACK.es) + '/archive';
      li.append(a);
      document.getElementById('shelfList').append(li);
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
  /* ---------------- mobile menu ---------------- */
  const menu = document.getElementById('menu');
  const menuBtn = document.getElementById('menuBtn');
  const menuLabel = menuBtn.querySelector('span');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuLabel.innerHTML = t(open ? 'menu.close' : 'menu.open') || (open ? 'Close' : 'Menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    if (open && window.gsap && !reduce) {
      gsap.fromTo(menu.querySelectorAll('.menu__links a, .menu__cta'), { y: 70, opacity: 0, rotateX: -40 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' });
    }
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  window.matchMedia('(min-width: 1001px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  /* ---------------- bill of materials: tap to open a part (phones) ---------------- */
  document.querySelectorAll('.part').forEach((part, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'part__toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', (part.querySelector('h3') || {}).textContent || 'Part');
    btn.textContent = '+';
    part.querySelector('.part__t').append(btn);
    const toggle = () => {
      const open = part.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? '−' : '+';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };
    btn.addEventListener('click', (ev) => { ev.stopPropagation(); toggle(); });
    part.addEventListener('click', (ev) => { if (!ev.target.closest('a, button') && window.matchMedia('(max-width: 1000px)').matches) toggle(); });
  });

  /* ---------------- hero: a mess of pieces that assembles itself ---------------- */
  const hero = document.querySelector('.hero');
  const tilesEl = hero.querySelector('.tiles');
  const heroImg = hero.querySelector('.hero__img');
  const linesEl = hero.querySelector('.hero__lines');
  const stateEl = hero.querySelector('.hero__state');
  let lastState = null;
  const COLS = 4, ROWS = 5, IMG_W = 854, IMG_H = 1280;

  // the portrait, cut into tiles that can fly apart and lock back together
  const tiles = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const d = document.createElement('div');
    d.className = 'shard';
    d.dataset.c = c; d.dataset.r = r;
    tilesEl.append(d);
    tiles.push(d);
  }
  function layoutTiles() {
    const w = tilesEl.clientWidth, h = tilesEl.clientHeight;
    if (!w || !h) return;
    const ratio = IMG_W / IMG_H;
    const cw = w / h > ratio ? w : h * ratio;
    const ch = w / h > ratio ? w / ratio : h;
    const ox = (w - cw) * 0.5, oy = (h - ch) * 0.2;
    const tw = w / COLS, th = h / ROWS;
    tiles.forEach((d) => {
      d.style.backgroundSize = `${cw}px ${ch}px`;
      d.style.backgroundPosition = `${ox - d.dataset.c * tw}px ${oy - d.dataset.r * th}px`;
    });
  }

  // construction lines drawn across the whole first screen
  function drawLines() {
    const W = hero.clientWidth, H = hero.clientHeight;
    const photo = hero.querySelector('.hero__photo').getBoundingClientRect();
    const hr = hero.getBoundingClientRect();
    const px = photo.left - hr.left, py = photo.top - hr.top, pw = photo.width, ph = photo.height;
    const top = 76, bottom = H - 64;
    linesEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
    linesEl.innerHTML = [
      `<line x1="0" y1="${top}" x2="${W}" y2="${top}"/>`,
      `<line x1="0" y1="${bottom}" x2="${W}" y2="${bottom}"/>`,
      `<line x1="${px - 14}" y1="0" x2="${px - 14}" y2="${H}"/>`,
      `<line x1="${px + pw + 14}" y1="${top}" x2="${px + pw + 14}" y2="${bottom}"/>`,
      `<line x1="${px}" y1="${py - 14}" x2="${px + pw}" y2="${py - 14}"/>`,
      `<line x1="${px}" y1="${py + ph + 14}" x2="${px + pw}" y2="${py + ph + 14}"/>`,
      `<path d="M${px + pw * 0.2} ${py + ph + 30} L${px + pw} ${py + ph * 0.02}"/>`,
      `<circle class="ln-accent" cx="${px + pw * 0.56}" cy="${py + ph * 0.22}" r="${Math.min(pw, ph) * 0.2}" fill="none"/>`
    ].join('');
    linesEl.querySelectorAll('line, path, circle').forEach((l) => {
      const len = l.getTotalLength();
      l.style.strokeDasharray = len;
      l.dataset.len = len;
    });
  }

  const setState = (key) => { if (key !== lastState) { lastState = key; stateEl.innerHTML = t(key); } };

  applyLang(lang);
  root.classList.remove('lang-pending');

  /* pillars: the beam carries the words of whichever column holds the load.
     scroll moves the load I → VI, the light crosses the temple, and when all six carry, the roof goes on */
  const SEQ = 0.8;          // share of the scroll spent walking the six columns; the rest builds the roof
  const temple = (() => {
    const row = document.querySelector('.colonnade');
    if (!row) return null;
    const wrap = document.querySelector('.temple'), beam = document.querySelector('.beam');
    const cols = [...row.querySelectorAll('.col')];
    const words = [...document.querySelectorAll('.words li')];
    const beamBig = document.querySelector('.beam__big'), beamN = document.querySelector('.beam__n b'), beamT = document.querySelector('.beam__t');
    const beamD = document.querySelector('.beam__d'), beamS = document.querySelector('.beam__src');
    const animate = !!window.gsap && !reduce;
    let idx = -1, goTo = null;
    const write = (c) => {
      beamBig.textContent = beamN.textContent = c.dataset.n;
      beamT.textContent = c.querySelector('.col__t').textContent;
      beamD.textContent = c.querySelector('.col__d').textContent;
      beamS.textContent = c.querySelector('.col__s').textContent;
      beamS.href = c.dataset.href;
    };
    const split = () => {
      beamT.innerHTML = beamT.textContent.trim().split(/\s+/).map((w) => `<span class="word">${[...w].map((ch) => `<span class="c">${ch}</span>`).join('')}</span>`).join(' ');
      return beamT.querySelectorAll('.c');
    };
    /* the beam never changes size: it is as tall as the longest pillar needs, in this language, at this width */
    const lockHeight = () => {
      beam.style.height = 'auto';
      let max = 0;
      cols.forEach((c) => { write(c); max = Math.max(max, beam.offsetHeight); });
      write(cols[Math.max(idx, 0)]);
      if (animate) split();
      beam.style.height = max + 'px';
      wrap.style.setProperty('--beam-h', max + 'px');
      if (window.ScrollTrigger && ScrollTrigger.getAll().length) ScrollTrigger.refresh();
    };
    const open = (i) => {
      if (i === idx) return;
      const first = idx === -1;
      idx = i;
      cols.forEach((c, j) => { c.classList.toggle('is-active', j === i); c.querySelector('.col__btn').setAttribute('aria-pressed', j === i); });
      words.forEach((w, j) => { w.classList.toggle('is-active', j === i); w.classList.toggle('is-done', j < i); });
      if (!animate || first) { write(cols[i]); if (animate) split(); return; }
      gsap.killTweensOf([beam, beamBig, beamD, beamS, '.beam__t .c']);
      gsap.timeline()
        .to(beamT.querySelectorAll('.c'), { yPercent: -110, opacity: 0, stagger: 0.006, duration: 0.2, ease: 'power2.in' })
        .to([beamD, beamS], { y: -14, opacity: 0, duration: 0.18 }, 0)
        .to(beamBig, { xPercent: -30, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0)
        .add(() => { write(cols[i]); gsap.set([beamD, beamS], { y: 18 }); })
        .fromTo(beamBig, { xPercent: 30, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .add(() => gsap.fromTo(split(), { yPercent: 115, rotateX: -80, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.016, duration: 0.55, ease: 'power4.out' }), '<')
        .fromTo(beam, { y: -10 }, { y: 0, duration: 0.5, ease: 'bounce.out' }, '<')
        .to([beamD, beamS], { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: 'power3.out' }, '<+0.15');
    };
    /* p runs 0 → 1 across the pinned scroll */
    const setLoad = (p) => {
      const n = cols.length, seq = Math.min(1, p / SEQ), f = seq * n;
      const lx = -0.08 + seq * 1.16;                        // where the light is, 0 = left edge of the temple
      wrap.style.setProperty('--lx', (lx * 100).toFixed(1) + '%');
      wrap.parentNode.style.setProperty('--seq', seq.toFixed(3));
      cols.forEach((c, j) => {
        const d = (j + 0.5) / n - lx;                       // > 0: the light is to the left, so the right side falls in shadow
        c.style.setProperty('--load', Math.min(1, Math.max(0, f - j)).toFixed(3));
        c.style.setProperty('--sr', Math.min(0.5, Math.max(0.04, d * 1.4)).toFixed(3));
        c.style.setProperty('--sl', Math.min(0.5, Math.max(0.04, -d * 1.4)).toFixed(3));
      });
      open(Math.min(n - 1, Math.floor(f)));
    };
    cols.forEach((c, i) => c.querySelector('.col__btn').addEventListener('click', () => {
      if (goTo) goTo(i);
      else { open(i); cols.forEach((k, j) => k.style.setProperty('--load', j <= i ? 1 : 0)); }
    }));
    /* the roof is sized from the temple: tall enough to matter, small enough to fit once the camera pulls back */
    const roof = document.querySelector('.roof');
    const sizeRoof = () => {
      const h = wrap.offsetHeight, w = wrap.offsetWidth + 28;
      const rh = Math.round(h * 0.38);
      wrap.style.setProperty('--roof-h', rh + 'px');
      wrap.style.setProperty('--roof-fs', Math.round(Math.min(rh * 0.16, (w * 0.6) / (17 * 0.66))) + 'px');
      if (!animate && roof) { roof.style.visibility = 'visible'; wrap.style.marginTop = rh + 12 + 'px'; }
    };
    /* the foundation line is fitted to the full width: one line on desktop, two on phones */
    const found = document.querySelector('.found');
    const fitFound = () => {
      if (!found) return;
      const ghost = found.querySelector('.found__ghost');
      const phone = window.matchMedia('(max-width: 1000px)').matches;
      const r = document.createRange();
      const widthOf = (el) => { r.selectNodeContents(el); return r.getBoundingClientRect().width; };
      const natural = phone ? Math.max(...[...ghost.children].map(widthOf)) : widthOf(ghost);
      const cur = parseFloat(getComputedStyle(found).fontSize);
      if (!natural) return;
      const fs = Math.min(phone ? Math.min(46, window.innerHeight * 0.06) : Math.min(150, window.innerHeight * 0.11), (cur * found.clientWidth * 0.985) / natural);
      found.style.setProperty('--found-fs', fs.toFixed(1) + 'px');
      wrap.style.setProperty('--found-h', found.offsetHeight + 14 + 'px');
    };
    const relayout = () => { fitFound(); lockHeight(); sizeRoof(); };
    relayout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    window.addEventListener('resize', relayout);
    open(0);
    if (!animate) { setLoad(1); open(0); }
    return { split, setLoad, lockHeight, bindScroll(fn) { goTo = fn; } };
  })();
  layoutTiles();
  drawLines();
  window.addEventListener('resize', () => { layoutTiles(); drawLines(); if (!intro || !intro.isActive()) linesEl.querySelectorAll('*').forEach((l) => { l.style.strokeDashoffset = 0; }); });
  let intro = null;
  let exitTl = null;

  if (!hasGsap || reduce) {
    tilesEl.hidden = true;
    root.classList.remove('intro');
    setState('hero.state.assembled');
    document.getElementById('replay').hidden = true;
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const desktop = window.matchMedia('(min-width: 1001px)').matches;

  /* smooth scroll */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.085 });
    window.__lenis = lenis;
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

  /* nav: the link for the section you are in stays lit */
  document.querySelectorAll('.nav__links a').forEach((a) => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, refreshPriority: -1, start: 'top 45%', end: 'bottom 45%', onToggle: (self) => a.classList.toggle('is-here', self.isActive) });
  });

  /* scroll progress: construction status */
  gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  /* split the name into letters */
  const splitChars = (elm) => {
    elm.innerHTML = elm.textContent.trim().split(/\s+/)
      .map((w) => `<span class="word">${[...w].map((c) => `<span class="c">${c}</span>`).join('')}</span>`).join(' ');
    return elm.querySelectorAll('.c');
  };
  const rnd = gsap.utils.random;
  hero.querySelectorAll('.scatter').forEach(splitChars);
  const pieces = [...hero.querySelectorAll('.scatter .c, .piece'), ...tiles];

  // where each piece sits in the mess: flung around the screen, tumbling in 3D
  function mess(el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const vw = window.innerWidth, vh = window.innerHeight;
    return {
      x: rnd(vw * 0.06, vw * 0.94) - cx,
      y: rnd(vh * 0.14, vh * 0.9) - cy,
      z: rnd(-500, 320),
      rotationX: rnd(-70, 70), rotationY: rnd(-80, 80), rotationZ: rnd(-160, 160),
      scale: rnd(0.55, 1.25)
    };
  }

  function runIntro(fromCurrent) {
    if (intro) intro.kill();
    setState('hero.state.exploded');
    const lines = linesEl.querySelectorAll('line, path, circle');
    gsap.set(lines, { strokeDashoffset: (i, l) => l.dataset.len });
    gsap.set(heroImg, { opacity: 0 });
    gsap.set(tiles, { opacity: 1 });
    if (!fromCurrent) {
      pieces.forEach((p) => gsap.set(p, mess(p)));
      gsap.set(hero.querySelector('.hero__head mark'), { backgroundColor: 'rgba(255,79,0,0)' });
    }
    killExit();
    intro = gsap.timeline({ onComplete: () => { setState('hero.state.assembled'); buildExit(); } });
    // the mess drifts for a beat…
    intro.to(pieces, {
      rotationZ: () => '+=' + rnd(-25, 25), rotationY: () => '+=' + rnd(-20, 20), y: () => '+=' + rnd(-24, 24),
      duration: 1.1, ease: 'sine.inOut'
    }, 0);
    // …then everything flies home: tiles lock together first, then the letters, then the rest
    intro.to(tiles, {
      x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1,
      duration: 1.25, ease: 'expo.out', stagger: { each: 0.035, from: 'random' }
    }, 0.9);
    intro.to(hero.querySelectorAll('.scatter .c'), {
      x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1,
      duration: 1.1, ease: 'expo.out', stagger: { each: 0.045, from: 'random' }
    }, 1.05);
    intro.to(hero.querySelectorAll('.piece'), {
      x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1,
      duration: 1.1, ease: 'expo.out', stagger: { each: 0.05, from: 'random' }
    }, 1.2);
    // the drawing snaps into its frame: construction lines race across the page
    intro.to(lines, { strokeDashoffset: 0, duration: 0.9, ease: 'power3.inOut', stagger: 0.06 }, 2.1);
    intro.to(hero.querySelector('.hero__head mark'), { backgroundColor: 'rgba(255,79,0,1)', duration: 0.35, ease: 'power2.out' }, 2.35);
    intro.to(heroImg, { opacity: 1, duration: 0.25 }, 2.3).set(tiles, { opacity: 0 }, 2.56);
    intro.fromTo(hero.querySelector('.hero__grid'), { scale: 1.015 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)', immediateRender: false }, 2.2);
    return intro;
  }
  runIntro(false);
  root.classList.remove('intro');

  // impatient visitors: a click, key or scroll fast-forwards
  const hurry = () => { if (intro && intro.isActive()) intro.timeScale(3.5); };
  hero.addEventListener('pointerdown', (ev) => { if (!ev.target.closest('a, button')) hurry(); });
  window.addEventListener('wheel', hurry, { passive: true });
  window.addEventListener('keydown', hurry);
  window.addEventListener('touchmove', hurry, { passive: true });

  document.getElementById('replay').addEventListener('click', () => {
    if (intro) intro.kill();
    killExit();
    gsap.to(hero.querySelector('.hero__head mark'), { backgroundColor: 'rgba(255,79,0,0)', duration: 0.3 });
    gsap.set(heroImg, { opacity: 0 });
    gsap.set(tiles, { opacity: 1 });
    pieces.forEach((p) => gsap.to(p, { ...mess(p), duration: 0.9, ease: 'power3.in', delay: rnd(0, 0.25) }));
    gsap.delayedCall(1.2, () => runIntro(true));
  });

  /* assembled: a gentle depth parallax under the cursor */
  const photoEl = hero.querySelector('.hero__photo');
  const copyEl = hero.querySelector('.hero__copy');
  hero.addEventListener('pointermove', (ev) => {
    if (intro && intro.isActive()) return;
    const mx = ev.clientX / window.innerWidth - 0.5, my = ev.clientY / window.innerHeight - 0.5;
    gsap.to(photoEl, { rotateY: mx * 8, rotateX: -my * 6, x: mx * 12, duration: 0.8, ease: 'power2.out' });
    gsap.to(copyEl, { x: -mx * 10, y: -my * 6, duration: 0.8, ease: 'power2.out' });
  });
  hero.addEventListener('pointerleave', () => gsap.to([photoEl, copyEl], { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.8 }));

  /* leaving the hero: the page you just watched assemble comes apart again, tied to the scroll */
  function buildExit() {
    killExit();
    const vw = window.innerWidth, vh = window.innerHeight;
    exitTl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.9 } });
    pieces.forEach((p) => {
      const r = p.getBoundingClientRect();
      const dx = r.left + r.width / 2 - vw / 2, dy = r.top + r.height / 2 - vh / 2;
      exitTl.fromTo(p, { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0 }, {
        x: dx * rnd(0.6, 1.5) + rnd(-160, 160), y: dy * rnd(0.4, 1.2) - rnd(80, 380), z: rnd(-400, 700),
        rotationX: rnd(-120, 120), rotationY: rnd(-120, 120), rotationZ: rnd(-140, 140),
        ease: 'power2.in', immediateRender: false
      }, rnd(0, 0.18));
    });
    exitTl.set(heroImg, { opacity: 0 }, 0.002).set(tiles, { opacity: 1 }, 0.002);
    exitTl.to(linesEl, { opacity: 0, ease: 'none' }, 0);
    exitTl.to(hero.querySelector('.hero__photo'), { boxShadow: '0 0 0 rgba(21,21,21,0)', ease: 'none' }, 0);
  }
  function killExit() {
    if (!exitTl) return;
    exitTl.scrollTrigger && exitTl.scrollTrigger.kill();
    exitTl.kill();
    exitTl = null;
    gsap.set(linesEl, { opacity: 1 });
  }

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

  const scatter = { x: () => rnd(-700, 700), y: () => rnd(-420, 420), z: () => rnd(-900, 500), rotationX: () => rnd(-180, 180), rotationY: () => rnd(-180, 180), rotationZ: () => rnd(-90, 90), opacity: 0 };


  /* pillars: the temple builds itself as it arrives — stairs, plinths, columns rise, capitals set, the beam drops.
     then it pins: scrolling pours the load through the columns, the light crosses, and the roof goes on at the end */
  if (temple) {
    const row = document.querySelector('.colonnade');
    gsap.set('.col__shaft', { clipPath: 'inset(100% 0 0 0)' });
    row.classList.add('is-building');
    gsap.timeline({ scrollTrigger: { trigger: '.temple', start: 'top 85%', once: true } })
      .from('.found', { y: 60, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.temple__steps i', { scaleX: 0, stagger: { each: 0.07, from: 'end' }, duration: 0.45, ease: 'power3.out' }, '-=0.3')
      .from('.col__foot', { scaleX: 0, stagger: { each: 0.04, from: 'center' }, duration: 0.3, ease: 'power3.out' }, '-=0.25')
      .to('.col__shaft', { clipPath: 'inset(0% 0 0 0)', stagger: { each: 0.06, from: 'center' }, duration: 0.7, ease: 'power4.out' }, '-=0.1')
      .from('.col__cap', { y: -60, opacity: 0, stagger: { each: 0.04, from: 'center' }, duration: 0.4, ease: 'back.out(2.2)' }, '-=0.4')
      .from(['.temple__cornice', '.beam', '.temple__architrave'], { y: -220, opacity: 0, duration: 0.5, ease: 'power4.in' }, '-=0.1')
      .addLabel('land')
      .add(() => row.classList.remove('is-building'), 'land')
      .fromTo('.col__shaft', { scaleY: 0.93, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' }, 'land')
      .fromTo('.temple', { y: 0 }, { keyframes: [{ y: 6, duration: 0.06 }, { y: -3, duration: 0.08 }, { y: 0, duration: 0.12 }] }, 'land')
      .from('.beam__big', { xPercent: -20, opacity: 0, duration: 0.5, ease: 'power3.out' }, 'land')
      .from(temple.split(), { yPercent: 115, rotateX: -80, opacity: 0, stagger: 0.02, duration: 0.6, ease: 'power4.out' }, 'land+=0.05')
      .from(['.beam__n', '.beam__d', '.beam__src'], { y: 16, opacity: 0, stagger: 0.07, duration: 0.45, ease: 'power3.out' }, 'land+=0.15')
      .from('.col__n, .words li', { opacity: 0, y: 12, stagger: 0.03, duration: 0.35 }, 'land+=0.1');

    const navH = () => (document.querySelector('.nav') || { offsetHeight: 64 }).offsetHeight + 8;
    /* the ending: the camera pulls back, the roof falls from above the screen, the temple takes the hit */
    const wrap = document.querySelector('.temple'), roof = document.querySelector('.roof');
    const dust = Array.from({ length: 34 }, () => {
      const d = document.createElement('i');
      d.className = 'roof__dust';
      d.style.left = rnd(2, 98) + '%';
      d.style.top = '-8px';
      d.style.opacity = 0;
      wrap.appendChild(d);
      return d;
    });
    const PULL = 0.72;               // how far the camera pulls back to make room for the roof
    let roofDown = false, roofTl = null;
    const drop = () => {
      roofDown = true;
      if (roofTl) roofTl.kill();
      roof.style.visibility = 'visible';
      roofTl = gsap.timeline()
        .fromTo(roof, { y: () => -window.innerHeight * 1.1 }, { y: 0, duration: 0.55, ease: 'power4.in' })
        .addLabel('hit')
        .to(roof, { keyframes: [{ y: -22, duration: 0.12, ease: 'power2.out' }, { y: 0, duration: 0.22, ease: 'bounce.out' }] }, 'hit')
        .fromTo(wrap, { x: 0 }, { keyframes: [{ x: -12, y: 12, duration: 0.05 }, { x: 10, y: -5, duration: 0.06 }, { x: -6, y: 4, duration: 0.06 }, { x: 3, y: -1, duration: 0.06 }, { x: 0, y: 0, duration: 0.1 }] }, 'hit')
        .fromTo('.col__shaft', { scaleY: 0.88, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9, ease: 'elastic.out(1, 0.3)' }, 'hit')
        .fromTo('.temple__cornice', { backgroundColor: '#FF4F00' }, { backgroundColor: '#EDEDE8', duration: 1, ease: 'power2.in' }, 'hit')
        .fromTo(dust, { x: 0, y: 0, opacity: 1, rotation: 0, scale: () => rnd(0.4, 1.6) }, { x: () => rnd(-280, 280), y: () => rnd(-160, 30), rotation: () => rnd(-240, 240), opacity: 0, duration: () => rnd(0.6, 1.3), ease: 'power3.out' }, 'hit')
        .fromTo('.found', { y: 0 }, { keyframes: [{ y: 14, duration: 0.05 }, { y: -5, duration: 0.07 }, { y: 0, duration: 0.12 }] }, 'hit')
        .fromTo('.found__fill', { color: '#FF4F00' }, { color: '#EDEDE8', duration: 1.1, ease: 'power2.in' }, 'hit');
    };
    const lift = () => {
      roofDown = false;
      if (roofTl) roofTl.kill();
      roofTl = gsap.to(roof, { y: () => -window.innerHeight * 1.1, duration: 0.45, ease: 'power3.in', onComplete: () => { roof.style.visibility = 'hidden'; } });
    };
    const st = ScrollTrigger.create({
      trigger: '.temple-pin', pin: true, anticipatePin: 1,
      start: () => {
        const pin = document.querySelector('.temple-pin');
        const free = window.innerHeight - navH() - pin.offsetHeight;
        return 'top ' + Math.round(navH() + Math.max(0, free / 2)) + 'px';
      },
      end: () => '+=' + Math.round(window.innerHeight * 4.2),
      scrub: true, invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        temple.setLoad(p);
        const pull = Math.min(1, Math.max(0, (p - SEQ) / 0.07));
        gsap.set(wrap, { scale: 1 - (1 - PULL) * gsap.parseEase('power2.inOut')(pull), transformOrigin: '50% 100%' });
        if (p > SEQ + 0.09 && !roofDown) drop();
        else if (p < SEQ + 0.06 && roofDown) lift();
      }
    });
    temple.bindScroll((i) => {
      const y = st.start + (st.end - st.start) * ((i + 0.5) / 6 * SEQ);
      if (lenis) lenis.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
    });
  }

  /* bill of materials: the spec table prints itself — each rule draws across, then its row slides in */
  const parts = gsap.utils.toArray('.part');
  const bomTl = gsap.timeline({ scrollTrigger: { trigger: '.parts', start: 'top 88%', end: 'top 30%', scrub: 0.5 } });
  bomTl.from('.bom__cols span', { opacity: 0, y: 10, stagger: 0.05, duration: 0.4 }, 0);
  parts.forEach((part, i) => {
    bomTl
      .fromTo(part, { '--line': 0 }, { '--line': 1, duration: 0.6, ease: 'power2.inOut' }, i * 0.18)
      .from(part.children, { y: 26, opacity: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, i * 0.18 + 0.15);
  });

  /* builds: the tiles land on the bench one after another */
  gsap.from('.tile', { y: 70, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.showcase', start: 'top 80%', once: true } });

  /* coffee: one screen — the roast draws itself, the markers pop, the site slides in */
  const bt = document.querySelector('.roast__bt');
  const len = bt.getTotalLength();
  gsap.set(bt, { strokeDasharray: len, strokeDashoffset: len });
  gsap.timeline({ scrollTrigger: { trigger: '.coffee', start: 'top 60%', once: true } })
    .from('.coffee__copy > *', { y: 40, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' })
    .from('.coffee__shot', { y: 120, rotateX: 18, opacity: 0, duration: 1.2, ease: 'power3.out', clearProps: 'transform' }, 0.1)
    .from('.roast', { y: 80, x: -40, rotate: -8, opacity: 0, duration: 1, ease: 'power3.out' }, 0.8)
    .to(bt, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 1.1)
    .from('.roast__ror', { opacity: 0, duration: 1 }, 1.3)
    .from('.roast circle', { scale: 0, transformOrigin: '50% 50%', stagger: 0.4, duration: 0.5, ease: 'back.out(3)' }, 1.5)
    .from('.roast__lbl', { opacity: 0, y: 8, stagger: 0.25, duration: 0.5 }, 1.6);

  /* hire */
  gsap.from('.hire h2', { yPercent: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.hire', start: 'top 75%', once: true } });
  gsap.from('.offers li', { x: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.offers', start: 'top 85%', once: true } });

  /* footer: the mess assembles itself */
  const footChars = [...document.querySelectorAll('.foot__big [data-i18n]')].flatMap((c) => [...splitChars(c)]);
  const footMark = document.querySelector('.foot__big mark');
  gsap.timeline({ scrollTrigger: { trigger: '.foot', start: 'top 85%', end: 'bottom bottom', scrub: 0.6 } })
    .from(footChars, { ...scatter, stagger: { each: 0.02, from: 'random' }, ease: 'power2.out', duration: 1 })
    .fromTo(footMark, { backgroundSize: '0% 77%' }, { backgroundSize: '100% 77%', ease: 'power2.inOut', duration: 0.3 });

  /* every big section title assembles out of a scatter as it arrives (line breaks kept) */
  const splitLines = (elm) => {
    elm.innerHTML = elm.innerHTML.split(/<br\s*\/?>/i).map((line) => {
      const tmp = document.createElement('span'); tmp.innerHTML = line;
      return tmp.textContent.trim().split(/\s+/).map((w) => `<span class="word">${[...w].map((c) => `<span class="c">${c}</span>`).join('')}</span>`).join(' ');
    }).join('<br>');
    return elm.querySelectorAll('.c');
  };
  document.querySelectorAll('.section-head--quiet h2, #archive-title').forEach((h) => {
    const chars = splitLines(h.querySelector('[data-i18n]'));
    gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 55%', scrub: 0.6 } })
      .from(h.querySelector('.sh__idx'), { x: -40, opacity: 0, duration: 0.4 })
      .from(chars, { yPercent: 110, opacity: 0, stagger: 0.012, duration: 0.5, ease: 'power3.out' }, 0.1);
  });
  document.querySelectorAll('.section-head:not(.section-head--quiet) h2, .coffee h2, .hire h2').forEach((h) => {
    const chars = splitLines(h);
    gsap.from(chars, {
      x: () => rnd(-320, 320), y: () => rnd(-220, 220), z: () => rnd(-600, 300),
      rotationX: () => rnd(-120, 120), rotationY: () => rnd(-120, 120), rotationZ: () => rnd(-80, 80), opacity: 0,
      stagger: { each: 0.012, from: 'random' }, ease: 'power3.out',
      scrollTrigger: { trigger: h, start: 'top 95%', end: 'top 50%', scrub: 0.7 }
    });
  });

  /* dark chapters open up like a window: inset rounded panel → full bleed */
  ['.coffee', '.hire'].forEach((sel) => {
    gsap.fromTo(sel, { clipPath: 'inset(7% 5% 0% 5%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: sel, start: 'top bottom', end: 'top 15%', scrub: true }
    });
  });
  if (desktop) gsap.fromTo('.roast', { yPercent: 30 }, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: '.coffee', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* the marquee band: runs with the scroll */
  const band = document.querySelector('.marquee__track');
  if (band) {
    const phrase = `${t('hero.give')} ${t('hero.mess')}`.replace(/<[^>]+>/g, '');
    band.innerHTML = Array.from({ length: 10 }, () => `<span>${phrase}</span><i></i>`).join('');
    gsap.fromTo(band, { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  }

  /* momentum: big type leans with scroll speed, then settles */
  const leaners = gsap.utils.toArray('.section-head:not(.section-head--quiet) h2, .coffee h2, .hire h2, .foot__big, .marquee');
  const leanTo = leaners.map((el) => gsap.quickTo(el, 'skewY', { duration: 0.5, ease: 'power3.out' }));
  let settle = null;
  const lean = (v) => leanTo.forEach((fn) => fn(v));
  if (lenis) lenis.on('scroll', (e) => {
    lean(gsap.utils.clamp(-5, 5, e.velocity * -0.18));
    clearTimeout(settle);
    settle = setTimeout(() => lean(0), 120);
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
