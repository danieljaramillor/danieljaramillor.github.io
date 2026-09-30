#!/usr/bin/env python3
"""Pull every public post from Daniel's Substack into data/essays.json.

Substack doesn't send CORS headers, so the site can't read the feed from the
browser. A scheduled GitHub Action runs this instead and commits the result.
"""
import json
import pathlib
import urllib.request

PUB = "https://danieljaramillor.substack.com"
OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "essays.json"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (danieljaramillor.github.io)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def main():
    posts, offset = [], 0
    while True:
        batch = get(f"{PUB}/api/v1/archive?sort=new&offset={offset}&limit=50")
        posts += batch
        offset += len(batch)
        if len(batch) < 50:
            break

    essays = [
        {
            "title": p["title"].strip(),
            "subtitle": (p.get("subtitle") or "").strip(),
            "date": p["post_date"][:10],
            "url": p["canonical_url"],
            "slug": p["slug"],
            "words": p.get("wordcount"),
        }
        for p in posts
        if p.get("audience") == "everyone" and p.get("type", "newsletter") == "newsletter"
    ]
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps({"publication": PUB, "essays": essays}, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {len(essays)} essays to {OUT}")


if __name__ == "__main__":
    main()
