#!/usr/bin/env python3
"""Import the supplied cell atlas into the ignored local Biology preview.

The source embeds third-party microscope photographs. Keep this copy out of
the public site until each photograph's attribution and license are checked.
"""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "preview/demos/biology/cell-atlas/index.html"


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise ValueError(f"{label}: expected one match, found {count}")
    return source.replace(old, new, 1)


def adapt(source: str) -> str:
    style = """<style id="science-site-bridge-style">
.science-back{display:inline-flex;align-items:center;min-height:30px;padding:0 12px;border:1px solid rgba(127,208,207,.45);color:#e5f3f3;background:rgba(5,13,19,.72);font:11px/1.2 -apple-system,BlinkMacSystemFont,\"Noto Sans SC\",sans-serif;letter-spacing:.05em;text-decoration:none;white-space:nowrap}
.science-back:hover,.science-back:focus-visible{border-color:#7fd0cf;color:#fff}
.cover-back{position:fixed;right:clamp(18px,4vw,52px);top:24px;z-index:50;pointer-events:auto}
@media(max-width:640px){.cover-back{top:16px;right:16px}.topmeta .science-back{padding:0 8px;font-size:10px}}
</style>"""
    source = replace_once(source, "</style>\n</head>", "</style>\n" + style + "\n</head>", "bridge style")
    source = replace_once(
        source,
        '<section class="cover" id="cover">',
        '<section class="cover" id="cover">\n  <a class="science-back cover-back" id="coverBack" href="../../../topics/biology/cell-world/index.html">← 返回细胞世界</a>',
        "cover back link",
    )
    source = replace_once(
        source,
        '<div class="topmeta">',
        '<div class="topmeta">\n      <a class="science-back" id="appBack" href="../../../topics/biology/cell-world/index.html">← 细胞世界</a>',
        "app back link",
    )
    bridge = """<script id="science-site-bridge">
(function(){
  var query = new URLSearchParams(window.location.search).get('lang');
  var lang = query === 'en' || query === 'zh' ? query : 'zh';
  if (!query) { try { if (localStorage.getItem('newton-garage-lang') === 'en') lang = 'en'; } catch (_) {} }
  var href = '../../../topics/biology/cell-world/index.html' + (lang === 'en' ? '?lang=en' : '');
  document.getElementById('coverBack').href = href;
  document.getElementById('appBack').href = href;
  document.getElementById('coverBack').textContent = lang === 'en' ? '← Back to Cell World' : '← 返回细胞世界';
  document.getElementById('appBack').textContent = lang === 'en' ? '← Cell World' : '← 细胞世界';
  document.title = (lang === 'en' ? 'Cell Atlas · Newton Science Discovery Center' : '细胞形态图鉴 · 牛顿科学探索馆');
})();
</script>"""
    source = replace_once(source, "</body>", bridge + "\n</body>", "bridge script")
    # The three sections are broad teaching categories, not biological domains.
    source = source.replace("3</b><span>个域 DOMAINS", "3</b><span>大类 CATEGORIES")
    source = source.replace("按「域」排开", "按类别排开")
    source = source.replace("按<b>域 → 类群</b>排列", "按<b>类别 → 类群</b>排列")
    return source


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Original single-file cell atlas HTML")
    args = parser.parse_args()
    source = args.source.expanduser().resolve()
    if not source.is_file():
        raise SystemExit(f"Source file not found: {source}")
    data = source.read_bytes()
    text = data.decode("utf-8")
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(adapt(text), encoding="utf-8")
    print(f"Local Biology preview: {DEST.relative_to(ROOT)}")
    print(f"Source SHA-256: {hashlib.sha256(data).hexdigest()}")


if __name__ == "__main__":
    main()
