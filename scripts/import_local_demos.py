#!/usr/bin/env python3
"""Create a local preview from the author's single-file astronomy demos.

Imported HTML may contain assets with unverified provenance. The output is
gitignored and must be audited before any public release.
"""

from __future__ import annotations

import argparse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "preview/demos/solar-system"
FILES = {
    "index.html": "atlas.html",
    "structure.html": "structure.html",
    "bigbang.html": "bigbang.html",
    "blackhole.html": "blackhole.html",
    "constellations.html": "constellations.html",
    "uranus-fall.html": "uranus-fall.html",
}


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise ValueError(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def adapt(name: str, text: str) -> str:
    if name == "index.html":
        text = replace_once(
            text,
            "    const px = pxOf(s.d);",
            '    const px = pxOf(s.d);\n    const comparisonLabel = b.id === "earth"\n      ? "<b>木星直径约为地球的 11.2 倍</b><span>体积约为 1321 倍</span>"\n      : `<b>直径 × ${s.d.toFixed(2)}</b><span>体积 × ${s.v >= 100 ? s.v.toLocaleString("en-US") : s.v.toFixed(2)}</span>`;',
            "Earth comparison insertion",
        )
        text = replace_once(
            text,
            '<div class="cmp-label"><b>直径 × ${s.d.toFixed(2)}</b><span>体积 × ${s.v >= 100 ? s.v.toLocaleString("en-US") : s.v.toFixed(2)}</span></div>',
            '<div class="cmp-label">${comparisonLabel}</div>',
            "Earth comparison label",
        )
        text = text.replace("一次发射，一次点火，然后等 259 天", "从地球启程，沿转移轨道飞行约 259 天")
    elif name == "structure.html" or name == "constellations.html":
        text = text.replace('id="back" href="./"', 'id="back" href="atlas.html"', 1)
    elif name == "blackhole.html":
        text = text.replace('id="back" href="太阳系行星图鉴.html"', 'id="back" href="atlas.html"', 1)

    position = "left:270px;top:20px" if name == "index.html" else "right:154px;top:26px"
    mobile_position = "left:18px;top:74px" if name == "index.html" else "right:18px;top:76px"
    bridge = f'''<style id="science-site-bridge-style">
.science-site-bridge {{position:fixed;z-index:10000;{position};padding:9px 13px;border:1px solid rgba(180,220,225,.45);border-radius:99px;background:rgba(5,13,19,.87);color:#e5f3f3;font:12px/1.2 -apple-system,BlinkMacSystemFont,"Noto Sans SC",sans-serif;letter-spacing:.04em;text-decoration:none;backdrop-filter:blur(12px)}}
.science-site-bridge:hover,.science-site-bridge:focus-visible {{border-color:#8ed8e3;color:#fff}}
@media(max-width:700px){{.science-site-bridge{{{mobile_position};font-size:11px}}}}
</style><a class="science-site-bridge" href="../../topics/astronomy/solar-system/index.html" aria-label="返回太阳系专题">← 太阳系专题</a>
<script>(function(){{var back=document.getElementById('back');if(back)back.href='atlas.html';}})();</script>'''
    return replace_once(text, "</body>", bridge + "\n</body>", "course bridge")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Folder containing the author's site/*.html files")
    args = parser.parse_args()
    source = args.source.expanduser().resolve()
    missing = [name for name in FILES if not (source / name).is_file()]
    if missing:
        raise SystemExit(f"Missing source files in {source}: {', '.join(missing)}")
    DEST.mkdir(parents=True, exist_ok=True)
    for original, output in FILES.items():
        text = (source / original).read_text(encoding="utf-8")
        (DEST / output).write_text(adapt(original, text), encoding="utf-8")
        print(f"Local preview: {original} → {output}")
    print("Imported preview stays local and is ignored by Git.")


if __name__ == "__main__":
    main()
