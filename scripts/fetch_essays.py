#!/usr/bin/env python3
"""Import published RSS entries; fail closed and retain history outside feed windows."""
import copy
import html
import json
import pathlib
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from urllib.parse import urlsplit

ES = "https://danieljaramillor.substack.com"
EN = "https://danieljaramilloren.substack.com"
OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "essays.json"
UA = "DanielWebsiteSync/1.0 (+https://danieljaramillor.com)"

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


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml"})
    # No credentials, challenge handling, or alternate endpoints after a denial.
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8")


def parse_feed(text, pub):
    root = ET.fromstring(text)
    if root.tag != "rss" or root.find("channel") is None:
        raise ValueError(f"Invalid RSS from {pub}")
    posts = {}
    for item in root.findall("./channel/item"):
        link = (item.findtext("link") or "").strip()
        url = urlsplit(link)
        if (url.scheme != "https" or url.netloc != urlsplit(pub).netloc
                or not re.fullmatch(r"/p/[a-z0-9-]+", url.path)):
            raise ValueError(f"Unexpected published URL in {pub}: {link}")
        title = html.unescape(item.findtext("title") or "").strip()
        if not title:
            raise ValueError(f"Missing title in {pub}")
        slug = url.path.rsplit("/", 1)[-1]
        posts.setdefault(slug, {
            "title": title,
            "subtitle": html.unescape(item.findtext("description") or "").strip(),
            "date": parsedate_to_datetime(item.findtext("pubDate")).date().isoformat(),
            "url": pub + url.path,
            "slug": slug,
            "words": None,
            "body": item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded") or "",
        })
    if not posts:
        raise ValueError(f"Empty feed from {pub}; refusing to replace existing data")
    return list(posts.values())


def norm(title):
    return re.sub(r"\s+", " ", title.replace("’", "'").strip().lower())


def spanish_slug_for(post, es_slugs):
    # Prefer the explicit original link; known pairs support older translations.
    for slug in re.findall(r"https://danieljaramillor\.substack\.com/p/([a-z0-9-]+)", post["body"]):
        if slug in es_slugs and slug != post["slug"]:
            return slug
    target = KNOWN_PAIRS.get(norm(post["title"]))
    return target if target in es_slugs else None


def card(post):
    return {k: v for k, v in post.items() if k != "body"}


def merge(old, es_posts, en_posts):
    # Feeds are rolling windows, not deletion lists. Never infer removal from absence.
    essays = {e["slug"]: copy.deepcopy(e) for e in old.get("essays", [])}
    translations = []
    for post in es_posts:
        if norm(post["title"]) in KNOWN_PAIRS or "Originally published in Spanish" in post["body"]:
            translations.append(post)
            continue
        previous = essays.get(post["slug"], {})
        essays[post["slug"]] = {**card(post), "words": previous.get("words"), "en": previous.get("en")}
    english = {e["slug"]: copy.deepcopy(e) for e in old.get("en_only", [])}
    for post in translations + en_posts:
        target = spanish_slug_for(post, essays)
        if target:
            essays[target]["en"] = {k: post[k] for k in ("title", "subtitle", "url", "slug", "date")}
            english.pop(post["slug"], None)
        else:
            english[post["slug"]] = card(post)
    paired = {e["en"]["slug"] for e in essays.values() if e.get("en")}
    return {
        "publications": {"es": ES, "en": EN},
        "essays": sorted(essays.values(), key=lambda e: (e["date"], e["slug"]), reverse=True),
        "en_only": sorted((e for slug, e in english.items() if slug not in paired),
                          key=lambda e: (e["date"], e["slug"]), reverse=True),
    }


def main():
    try:
        # A corrupt existing archive must not silently become an empty starting point.
        old = json.loads(OUT.read_text()) if OUT.exists() else {}
        es_posts = parse_feed(fetch(ES + "/feed"), ES)
        en_posts = parse_feed(fetch(EN + "/feed"), EN)
        data = merge(old, es_posts, en_posts)
        OUT.parent.mkdir(exist_ok=True)
        temporary = OUT.with_suffix(".json.tmp")
        temporary.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
        temporary.replace(OUT)
    except Exception as error:
        print(f"Substack sync failed; existing archive unchanged: {error}", file=sys.stderr)
        return 1
    print(f"Synced {len(data['essays'])} Spanish essays and {len(data['en_only'])} English-only posts.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
