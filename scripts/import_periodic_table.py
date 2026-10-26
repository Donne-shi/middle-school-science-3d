#!/usr/bin/env python3
"""Import the standalone bilingual periodic-table lesson without changing its source."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "site/demos/chemistry/periodic-table/index.html"
PREVIEW = ROOT / "preview/demos/chemistry/periodic-table/index.html"
TOPIC = "../../../topics/chemistry/periodic-table/index.html"


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise ValueError(f"{label}: expected one match, found {count}")
    return source.replace(old, new, 1)


def adapt(source: str) -> str:
    credits_path = ROOT / "content/chemistry-periodic-table-credits.json"
    credits = json.loads(credits_path.read_text(encoding="utf-8"))
    # This LANL image has a non-standard attribution-only notice with a dead
    # linked notice URL. Keep the element entry, but do not redistribute it.
    public_credits = [credit for credit in credits if credit["z"] != 94]
    credits_json = json.dumps(public_credits, ensure_ascii=False, separators=(",", ":"))

    element_pattern = re.compile(r'(\{"z":94,.*?"img":)true,("imgData":")[^"]*(")', re.DOTALL)
    source, count = element_pattern.subn(r'\1false,\2\3', source, count=1)
    if count != 1:
        raise ValueError("plutonium sample: expected one embedded image record")

    source, count = re.subn(r"const CREDITS = \[.*?\];", "const CREDITS = " + credits_json + ";", source, count=1, flags=re.DOTALL)
    if count != 1:
        raise ValueError("credits array: expected one source list")

    # Two filenames in the supplied source accidentally include the namespace
    # prefix even though the renderer adds "File:" when building the Commons link.
    bridge_style = '''<style id="science-topic-bridge-style">
.science-topic-back{display:inline-flex;align-items:center;min-height:28px;padding:0 12px;border:1px solid var(--line2);border-radius:99px;background:rgba(255,255,255,.68);color:var(--ink2);font:9px/1.2 var(--mono);letter-spacing:.1em;text-decoration:none;white-space:nowrap;transition:background .2s,border-color .2s,color .2s}
.science-topic-back:hover,.science-topic-back:focus-visible{border-color:var(--green2);background:#fff;color:var(--green)}
.credit-detail{display:block;margin-top:4px;color:var(--muted);font-size:10px;line-height:1.6;white-space:normal}
.credit-detail a{color:var(--green);text-decoration:underline;text-underline-offset:2px}
@media(max-width:860px){.topbar-right{gap:8px}.science-topic-back{padding:0 8px;font-size:8px}.lang button{padding:5px 7px}}
</style>'''
    source = replace_once(source, "</style>\n</head>", "</style>\n" + bridge_style + "\n</head>", "bridge style")
    source = replace_once(
        source,
        '  <div class="topbar-right">',
        f'''  <div class="topbar-right">
    <a class="science-topic-back" id="scienceTopicBack" href="{TOPIC}" data-en="← Chemistry topic">← 化学专题</a>''',
        "chemistry topic return link",
    )
    bridge_script = f'''<script id="science-topic-bridge">
(function(){{
  var back = document.getElementById('scienceTopicBack');
  var base = '{TOPIC}';
  function syncLanguage() {{
    var english = document.documentElement.lang === 'en';
    back.href = base + (english ? '?lang=en' : '');
  }}
  syncLanguage();
  document.querySelectorAll('.lang button').forEach(function(button) {{
    button.addEventListener('click', function() {{ setTimeout(syncLanguage, 0); }});
  }});
}})();
</script>'''
    source = replace_once(
        source,
        """    var list = CREDITS.map(function (c) {
      var f = c.file.replace('File:', '').replace(/ /g, '_');
      return '<li><span class="n">' + nameOf(byZ[c.z]) + ' ' + byZ[c.z].sym + '</span><span class="d" style="text-align:left">' +
        '<a href="https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(f) + '" target="_blank" rel="noopener">' + esc(c.file.replace('File:', '')) + '</a></span></li>';
    }).join('');""",
        """    var list = CREDITS.map(function (c) {
      var f = c.file.replace(/ /g, '_');
      var license = c.licenseUrl
        ? '<a href="' + esc(c.licenseUrl) + '" target="_blank" rel="noopener">' + esc(c.license) + '</a>'
        : '<span>' + esc(c.license) + '</span>';
      return '<li><span class="n">' + nameOf(byZ[c.z]) + ' ' + byZ[c.z].sym + '</span><span class="d" style="text-align:left">' +
        '<a href="' + esc(c.commonsUrl) + '" target="_blank" rel="noopener">' + esc(c.file) + '</a>' +
        '<small class="credit-detail">' + esc(c.author) + ' · ' + license + ' · ' + L('页面展示使用 WebP 格式', 'Displayed as WebP') + '</small></span></li>';
    }).join('');""",
        "render Commons image credits",
    )
    source = replace_once(
        source,
        """L('下列单质照片均来自 Wikimedia Commons，采用公有领域或知识共享（CC BY / CC BY-SA）授权，可自由用于教学。点击文件名可在 Commons 查看原始文件与完整署名信息。',
        'All element photographs below come from Wikimedia Commons under public domain or Creative Commons (CC BY / CC BY-SA) licences and may be used freely for teaching. Click a file name to see the original file and full attribution on Commons.')""",
        """L('图片的许可类型各不相同。此处列出作者、许可和来源页；页面内图像使用 WebP 格式展示。使用或再分发前，请按各自许可要求注明署名、改动和共享方式。',
        'Image licenses vary. Each entry lists its author, license, and source page; images are displayed in WebP format. Follow each license when reusing or redistributing, including attribution, change notices, and share-alike terms.')""",
        "replace general image license claim",
    )
    return replace_once(source, "</body>", bridge_script + "\n</body>", "bridge script")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Original standalone periodic-table HTML")
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
