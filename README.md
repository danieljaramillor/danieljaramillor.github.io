# danieljaramillor.github.io

Personal site of Daniel Jaramillo — *la arquitectura de la acumulación*.

A static site, no build step. GitHub Pages serves it straight from the repo.

## Structure

- `index.html` — all the page content. English copy lives here.
- `assets/i18n.js` — the Spanish copy, keyed by each element's `data-i18n` attribute.
- `assets/site.css` — styles. Colours are CSS variables at the top.
- `assets/main.js` — language switch, the 3D exploded-view hero, scroll animations, essay list.
- `data/essays.json` — the Substack essays. Don't edit by hand.
- `scripts/fetch_essays.py` + `.github/workflows/substack.yml` — once a week (or on demand from the Actions tab), refresh `data/essays.json` from both Substacks: the Spanish originals at danieljaramillor.substack.com and the English translations at danieljaramilloren.substack.com. Each English post is paired with its Spanish original through the "Originally published in Spanish as…" link at its end, so English readers get English links and Spanish readers get Spanish ones.
- `img/` — photos and project screenshots.

## Editing

- **Change a sentence:** edit it in `index.html` (English) and under the same key in `assets/i18n.js` (Spanish).
- **Add a project:** copy one of the `.card` blocks in the `#builds` section. Cards still waiting on details are marked with `data-todo`.
- **Featured essays:** the `FEATURED` list of slugs near the top of `assets/main.js`.

Motion uses GSAP + ScrollTrigger and Lenis from CDNs. With reduced motion switched on, or if the scripts fail to load, the hero shows fully assembled and the page works as a normal scroll.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Brand

`brand/` holds the DJ. mark: SVG and PNG wordmarks (`dj-mark-light` for dark backgrounds, `dj-mark-dark` for light ones), the square app icon at every size, a maskable icon and `favicon.ico`. The letters are outlines of Archivo at weight 900, so the files need no font installed. Colours: ink `#151515`, night `#111110`, paper `#EDEDE8`, accent `#FF4F00`.
