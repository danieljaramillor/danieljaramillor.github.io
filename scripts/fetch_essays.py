#!/usr/bin/env python3
"""Pull every public post from Daniel's two Substacks into data/essays.json.

- Spanish (the originals): danieljaramillor.substack.com
- English (the translations): danieljaramilloren.substack.com

Each English post is paired with its Spanish original, so the site can show
the English version to English readers and the Spanish one to Spanish readers.
Pairing uses, in order: a link to the Spanish post inside the English body
(every translation ends with "Originally published in Spanish as ..."), then
the known title pairs below. English posts with no Spanish original are kept
separately as `en_only`.

Substack doesn't send CORS headers, so the site can't read the feeds from the
browser. A scheduled GitHub Action runs this instead and commits the result.
"""
import json
import pathlib
import re
import urllib.request

ES = "https://danieljaramillor.substack.com"
EN = "https://danieljaramilloren.substack.com"
OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "essays.json"

# English title → Spanish slug, for posts whose body doesn't link back.
KNOWN_PAIRS = {
    "two years ago today": "hace-2-anos-hoy",
    "the architecture of accumulation": "la-arquitectura-de-la-acumulacion",
    "headstrong": "muy-llevado-de-su-parecer",
    "don't make me choose": "no-me-pidan-que-elija",
    "talk is cheap": "opinar-es-gratis",
    "i'll take care of it": "yo-me-encargo",
    "dancing without choreography": "bailar-sin-coreografia",
    "under the rock": "debajo-de-la-roca",
    "permission to stop": "permiso-para-parar",
    "pants a size too big": "pantalones-grandes",
    "making hard look easy": "hacer-facil-lo-dificil",
    "seventeen steps": "diecisiete-escalones",
    "small change": "que-pena",
}


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (danieljaramillor.github.io)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def archive(pub):
    posts, offset = [], 0
    while True:
        try:
            batch = get(f"{pub}/api/v1/archive?sort=new&offset={offset}&limit=50")
        except Exception as e:  # a publication that's down or empty shouldn't break the other
            print(f"could not read {pub}: {e}")
            return posts
        posts += batch
        offset += len(batch)
        if len(batch) < 50:
            return posts


def public(posts):
    return [p for p in posts if p.get("audience") == "everyone" and p.get("type", "newsletter") == "newsletter"]


def card(p):
    return {
        "title": p["title"].strip(),
        "subtitle": (p.get("subtitle") or "").strip(),
        "date": p["post_date"][:10],
        "url": p["canonical_url"],
        "slug": p["slug"],
        "words": p.get("wordcount"),
    }


def norm(title):
    return re.sub(r"\s+", " ", title.replace("’", "'").strip().lower())


def spanish_slug_for(en_post, es_slugs):
    try:
        body = get(f"{EN}/api/v1/posts/{en_post['slug']}").get("body_html") or ""
    except Exception:
        body = ""
    for slug in re.findall(r"danieljaramillor\.substack\.com/p/([a-z0-9-]+)", body):
        if slug in es_slugs:
            return slug
    slug = KNOWN_PAIRS.get(norm(en_post["title"]))
    return slug if slug in es_slugs else None


def main():
    es_posts = public(archive(ES))
    en_posts = public(archive(EN))
    essays = [card(p) for p in es_posts]
    by_slug = {e["slug"]: e for e in essays}
    for e in essays:
        e["en"] = None

    en_only = []
    for p in en_posts:
        slug = spanish_slug_for(p, by_slug)
        if slug and by_slug[slug]["en"] is None:
            c = card(p)
            by_slug[slug]["en"] = {k: c[k] for k in ("title", "subtitle", "url", "slug", "date")}
        else:
            en_only.append(card(p))

    OUT.parent.mkdir(exist_ok=True)
    data = {"publications": {"es": ES, "en": EN}, "essays": essays, "en_only": en_only}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    paired = sum(1 for e in essays if e["en"])
    print(f"wrote {len(essays)} Spanish essays ({paired} with an English version) and {len(en_only)} English-only posts to {OUT}")


if __name__ == "__main__":
    main()
