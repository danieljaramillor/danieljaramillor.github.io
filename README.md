# danieljaramillor.github.io

Personal site of Daniel Jaramillo — *la arquitectura de la acumulación*.

A static site, no build step. GitHub Pages serves it straight from the repo.

## Structure

- `index.html` — all the page content. English copy lives here.
- `assets/i18n.js` — the Spanish copy, keyed by each element's `data-i18n` attribute.
- `assets/site.css` — styles. Colours are CSS variables at the top.
- `assets/main.js` — language switch, the 3D exploded-view hero, scroll animations, essay list.
- `data/essays.json` — the Substack essays. Don't edit by hand.
- `scripts/fetch_essays.py` + `.github/workflows/substack.yml` — refresh `data/essays.json` from danieljaramillor.substack.com every day (or on demand from the Actions tab).
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
