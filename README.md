# danieljaramillor.github.io

Personal site of Daniel Jaramillo — *la arquitectura de la acumulación*.

A static site, no build step. GitHub Pages serves it straight from the repo.

## Structure

- `index.html` — all the page content. English copy lives here.
- `assets/i18n.js` — the Spanish copy, keyed by each element's `data-i18n` attribute.
- `assets/site.css` — styles. Colours are CSS variables at the top.
- `assets/main.js` — language switch, the 3D exploded-view hero, scroll animations, essay list.
- `assets/ui-copy.js` — localized accessible labels, internal-link focus, mobile browsing controls, search clearing, and section restoration after a language switch.
- `data/essays.json` — the Substack essays. Don't edit by hand.
- `scripts/fetch_essays.py` + `.github/workflows/substack.yml` — once a week (or on demand from the Actions tab), refresh `data/essays.json` from both Substacks: the Spanish originals at danieljaramillor.substack.com and the English translations at danieljaramilloren.substack.com. Each English post is paired with its Spanish original through the "Originally published in Spanish as…" link at its end, so English readers get English links and Spanish readers get Spanish ones.
- `img/` — photos and project screenshots.

## Substack sync and recovery

The importer reads only each publication's public RSS feed. New English versions
must appear in a feed before they can be paired; it never guesses slugs or reads
individual-post/draft APIs. Explicit Spanish-original links take precedence over
legacy title pairs. Spanish essays without a published translation remain Spanish
links in both language views.

Both feeds must parse successfully before the archive is atomically replaced.
HTTP errors (including 403), timeouts, malformed or empty feeds fail the command
and the scheduled job, leaving the archive untouched. RSS is a rolling window:
previously imported essays, translations and word counts are retained when absent.
This intentionally does not automate deletion/unpublishing; review removals
explicitly when an already imported post is withdrawn. New RSS entries have no
word count; the site's existing estimate applies.

If GitHub's hosted runner is refused, the job cannot guarantee automatic updates.
Do not add proxies, browser impersonation, challenge solvers or credentials. On an
authorized machine where the public feeds are normally accessible, run:

```sh
python3 -m unittest discover -s tests -v
python3 scripts/fetch_essays.py
git diff -- data/essays.json
```

Commit the generated result to a review branch and open a PR. If that request is
also refused, stop and retain the existing archive. No new persistent runner or
credentials are configured. Merging the reviewed PR into `master` publishes via
GitHub Pages and requires deployment approval.

## Editing

- **Change a sentence:** edit it in `index.html` (English) and under the same key in `assets/i18n.js` (Spanish).
- **Add a project:** copy a `.tile` block in `#showcase`, use the appropriate status label, and update the browsing hint in both languages.
- **Featured essays:** the `PICKS` list of slugs near the top of `assets/main.js`.
- **Essay display corrections:** the `display` map in the essay-loading handler in `assets/main.js`. These title/subtitle corrections apply after loading the generated JSON, so the weekly sync cannot overwrite them. Source publications and article URLs stay unchanged.

The hiring section uses orange for the introduction and contact area, with the three hiring paths on the paper background. Keep the original entrance, pillars, project gallery, coffee section, and full essay archive when editing the hiring message.

Motion uses GSAP + ScrollTrigger and Lenis from CDNs. With reduced motion switched on, or if the scripts fail to load, the hero shows fully assembled and the page works as a normal scroll.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Use the HTTP preview rather than opening `index.html` directly: the archive loads `data/essays.json` with `fetch`. Check `?lang=en` and `?lang=es`, mobile navigation, keyboard focus, reduced motion, essay search, and the hiring links before publishing.

## Brand

`brand/` holds the DJ. mark: SVG and PNG wordmarks (`dj-mark-light` for dark backgrounds, `dj-mark-dark` for light ones), the square app icon at every size, a maskable icon and `favicon.ico`. The letters are outlines of Archivo at weight 900, so the files need no font installed. Colours: ink `#151515`, night `#111110`, paper `#EDEDE8`, accent `#FF4F00`.
