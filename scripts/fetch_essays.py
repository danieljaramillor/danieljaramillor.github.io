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

Substack sometimes refuses requests from GitHub's servers (HTTP 403). The JSON
API is tried first, then the RSS feed; if a publication still can't be read,
the essays already in data/essays.json are kept as they are. A failed fetch
must never empty the archive.

Substack's archive listing can also come back incomplete (for a while after
posts are moved or unpublished), so it is only used to discover posts:
an essay already on file is dropped only when its own page answers 404, and
each English version is confirmed by asking for it directly, on the English
publication first.
"""
import json
import pathlib
import re
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

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


UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json, application/rss+xml, */*"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode()


def get(url):
    return json.loads(fetch(url))


def from_api(pub):
    # Substack caps the page size below what's asked for, so keep paging until a page brings nothing new
    posts, seen, offset = [], set(), 0
    while offset < 2000:
        batch = get(f"{pub}/api/v1/archive?sort=new&offset={offset}&limit=12")
        new = [p for p in batch if p["slug"] not in seen]
        if not new:
            return posts
        posts += new
        seen.update(p["slug"] for p in new)
        offset += len(batch)
    return posts


def from_rss(pub):
    """The RSS feed carries the same posts (without word counts); used when the API is refused."""
    root = ET.fromstring(fetch(f"{pub}/feed"))
    posts = []
    for item in root.iter("item"):
        link = (item.findtext("link") or "").strip()
        slug = link.rstrip("/").rsplit("/p/", 1)[-1]
        posts.append({
            "title": item.findtext("title") or "",
            "subtitle": item.findtext("description") or "",
            "post_date": parsedate_to_datetime(item.findtext("pubDate")).date().isoformat(),
            "canonical_url": link,
            "slug": slug,
            "audience": "everyone",
            "type": "newsletter",
            "body_html": item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded") or "",
        })
    return posts


def archive(pub):
    """Posts of one publication, or None when it can't be read at all."""
    for name, read in (("api", from_api), ("rss", from_rss)):
        try:
            posts = read(pub)
            print(f"read {len(posts)} posts from {pub} ({name})")
            return posts
        except Exception as e:
            print(f"could not read {pub} via {name}: {e}")
    return None


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


def body_of(pub, post):
    if post.get("body_html"):
        return post["body_html"]
    try:
        post["body_html"] = get(f"{pub}/api/v1/posts/{post['slug']}").get("body_html") or ""
    except Exception:
        post["body_html"] = ""
    return post["body_html"]


def spanish_slug_for(en_post, es_slugs):
    slug = KNOWN_PAIRS.get(norm(en_post["title"]))
    if slug in es_slugs:
        return slug
    pub = ES if "danieljaramillor.substack.com" in en_post.get("canonical_url", "") else EN
    body = body_of(pub, en_post)
    for slug in re.findall(r"danieljaramillor\.substack\.com/p/([a-z0-9-]+)", body):
        if slug in es_slugs and slug != en_post["slug"]:
            return slug
    return None


def slugify(title):
    t = title.replace("’", "'").replace("'", "").lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


EN_SLUG = {es: slugify(en) for en, es in KNOWN_PAIRS.items()}


def post(pub, slug):
    """A public post fetched by slug, or None if it isn't (or is no longer) published there."""
    try:
        p = get(f"{pub}/api/v1/posts/{slug}")
    except Exception:
        return None
    if p.get("audience") != "everyone" or pub.split("//")[1] not in (p.get("canonical_url") or ""):
        return None
    return p


def main():
    try:
        old = json.loads(OUT.read_text())
    except Exception:
        old = {}
    old_by_slug = {e["slug"]: e for e in old.get("essays", [])}

    es_raw = archive(ES)
    if not es_raw:
        print("Spanish publication unreadable: keeping the existing data/essays.json untouched.")
        return
    en_raw = archive(EN)

    # English translations may live on the English publication or next to the originals on the Spanish one.
    known = set(old_by_slug)
    es_posts, translations = [], []
    for p in public(es_raw):
        target = KNOWN_PAIRS.get(norm(p["title"]))
        if target and target != p["slug"]:
            translations.append(p)
        elif p["slug"] not in known and "Originally published in Spanish" in body_of(ES, p):
            translations.append(p)
        else:
            es_posts.append(p)

    essays = [card(p) for p in es_posts]
    by_slug = {e["slug"]: e for e in essays}
    # the listing can be partial: keep every essay we already had unless its page is really gone
    for slug, e in old_by_slug.items():
        if slug in by_slug:
            continue
        p = post(ES, slug)
        if p:
            essays.append(card(p))
            by_slug[slug] = essays[-1]
        else:
            print(f"dropping {slug}: no longer published")
    essays.sort(key=lambda e: e["date"], reverse=True)
    for e in essays:
        if not e.get("words") and e["slug"] in old_by_slug:  # the RSS feed has no word counts
            e["words"] = old_by_slug[e["slug"]].get("words")
        e["en"] = None

    # candidate English slugs for each essay: from the listings, from last time, and from the known titles
    cands = {e["slug"]: [] for e in essays}
    en_only = []
    for p in translations + public(en_raw or []):
        slug = spanish_slug_for(p, by_slug)
        if slug:
            cands[slug].append(p["slug"])
        else:
            en_only.append(card(p))
    for e in essays:
        prev = (old_by_slug.get(e["slug"]) or {}).get("en") or {}
        cands[e["slug"]] += [prev.get("slug"), EN_SLUG.get(e["slug"])]
        for pub in (EN, ES):
            found = None
            for c in dict.fromkeys(x for x in cands[e["slug"]] if x and x != e["slug"]):
                found = post(pub, c)
                if found:
                    break
            if found:
                c = card(found)
                e["en"] = {k: c[k] for k in ("title", "subtitle", "url", "slug", "date")}
                break
    if en_raw is None and not any(e["en"] for e in essays):
        print("English versions unreadable: keeping the ones already on file.")
        for e in essays:
            e["en"] = old_by_slug.get(e["slug"], {}).get("en")
        en_only = en_only or old.get("en_only", [])

    OUT.parent.mkdir(exist_ok=True)
    data = {"publications": {"es": ES, "en": EN}, "essays": essays, "en_only": en_only}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    paired = sum(1 for e in essays if e["en"])
    print(f"wrote {len(essays)} Spanish essays ({paired} with an English version) and {len(en_only)} English-only posts to {OUT}")


if __name__ == "__main__":
    main()
