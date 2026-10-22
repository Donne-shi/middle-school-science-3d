#!/usr/bin/env python3
"""Check local links across the generated static site, including imported demos."""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


SITE = Path(__file__).resolve().parents[1] / "site"


class Links(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.urls: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in {"a", "link", "script", "img"}:
            return
        data = dict(attrs)
        value = data.get("href") if tag in {"a", "link"} else data.get("src")
        if value:
            self.urls.append(value)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--local", action="store_true", help="Check the ignored local preview")
    args = parser.parse_args()
    site = SITE.parent / "preview" if args.local else SITE
    errors: list[str] = []
    pages = sorted(site.rglob("*.html"))
    for page in pages:
        parser = Links()
        parser.feed(page.read_text(encoding="utf-8"))
        for value in parser.urls:
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            path = unquote(parsed.path)
            target = site / path.lstrip("/") if path.startswith("/") else page.parent / path
            if target.is_dir():
                target /= "index.html"
            if not target.exists():
                errors.append(f"{page.relative_to(site)} → {value}")
    if errors:
        raise SystemExit("Broken local links:\n" + "\n".join(errors))
    print(f"Checked {len(pages)} HTML pages: local links exist.")


if __name__ == "__main__":
    main()
