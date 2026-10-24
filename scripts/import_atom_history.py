#!/usr/bin/env python3
"""Import the standalone 2400-year atomic-model page without changing its source."""

from __future__ import annotations

import argparse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "site/demos/chemistry/atom-history/index.html"
PREVIEW = ROOT / "preview/demos/chemistry/atom-history/index.html"
TOPIC = "../../../topics/chemistry/atomic-structure/index.html"


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise ValueError(f"{label}: expected one match, found {count}")
    return source.replace(old, new, 1)


def adapt(source: str) -> str:
    bridge_style = '''<style id="science-topic-bridge-style">
.science-topic-back{display:inline-flex;align-items:center;min-height:28px;padding:0 12px;border:1px solid var(--line2);border-radius:99px;background:rgba(255,255,255,.68);color:var(--ink2);font:9px/1.2 var(--mono);letter-spacing:.1em;text-decoration:none;white-space:nowrap;transition:background .2s,border-color .2s,color .2s}
.science-topic-back:hover,.science-topic-back:focus-visible{border-color:var(--fluoro-2);background:#fff;color:var(--fluoro)}
@media(max-width:760px){.topbar-right{gap:8px}.science-topic-back{padding:0 8px;font-size:8px}.lang button{padding:5px 8px}}
</style>'''
    source = replace_once(source, "</style>\n</head>", "</style>\n" + bridge_style + "\n</head>", "bridge style")
    source = replace_once(
        source,
        '<div class="topbar-right">',
        f'''<div class="topbar-right">
    <a class="science-topic-back" id="scienceTopicBack" href="{TOPIC}" data-zh="← 化学专题" data-en="← Chemistry">← 化学专题</a>''',
        "chemistry topic return link",
    )
    bridge_script = f'''<script id="science-topic-bridge">
(function(){{
  var back = document.getElementById('scienceTopicBack');
  var base = '{TOPIC}';
  function syncLanguage() {{
    var lang = document.documentElement.dataset.lang;
    back.href = base + (lang === 'en' ? '?lang=en' : '');
  }}
  syncLanguage();
  document.querySelectorAll('[data-lang-btn]').forEach(function(button) {{
    button.addEventListener('click', function() {{ setTimeout(syncLanguage, 0); }});
  }});
}})();
</script>'''
    return replace_once(source, "</body>", bridge_script + "\n</body>", "bridge script")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Original single-file atomic history HTML")
    args = parser.parse_args()
    source = args.source.expanduser().resolve()
    if not source.is_file():
        raise SystemExit(f"Source file not found: {source}")
    html = adapt(source.read_text(encoding="utf-8"))
    for target in (PUBLIC, PREVIEW):
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8")
        print(f"Imported: {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
