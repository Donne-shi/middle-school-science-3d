#!/usr/bin/env python3
"""Import single-file astronomy demos and adapt their site navigation."""

from __future__ import annotations

import argparse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "preview/demos/solar-system"
PUBLIC_DEST = ROOT / "site/demos/solar-system"
FILES = {
    "index.html": "atlas.html",
    "structure.html": "structure.html",
    "bigbang.html": "bigbang.html",
    "blackhole.html": "blackhole.html",
    "constellations.html": "constellations.html",
    "uranus-fall.html": "uranus-fall.html",
    "earth-to-mars.html": "earth-to-mars.html",
    "moonlanding.html": "moonlanding.html",
    "恒星图鉴.html": "stars.html",
}
PUBLIC_FILES = {
    "structure.html", "bigbang.html", "blackhole.html", "constellations.html",
    "uranus-fall.html", "moonlanding.html", "恒星图鉴.html",
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
            '    const px = pxOf(s.d);\n    const comparisonLabel = b.id === "earth"\n      ? `<b>${T("木星直径约为地球的 11.2 倍", "Jupiter diameter ≈ 11.2 Earths")}</b><span>${T("体积约为 1321 倍", "Volume ≈ 1321 Earths")}</span>`\n      : `<b>${T("直径", "Diameter")} × ${s.d.toFixed(2)}</b><span>${T("体积", "Volume")} × ${s.v >= 100 ? s.v.toLocaleString("en-US") : s.v.toFixed(2)}</span>`;',
            "Earth comparison insertion",
        )
        text = replace_once(
            text,
            '<div class="cmp-label"><b>${T("直径", "Diameter")} × ${s.d.toFixed(2)}</b><span>${T("体积", "Volume")} × ${s.v >= 100 ? s.v.toLocaleString("en-US") : s.v.toFixed(2)}</span></div>',
            '<div class="cmp-label">${comparisonLabel}</div>',
            "Earth comparison label",
        )
        text = text.replace("一次发射，一次点火，然后等 259 天", "从地球启程，沿转移轨道飞行约 259 天")
        text = text.replace('href="恒星图鉴.html"', 'href="stars.html"', 1)
    elif name == "structure.html" or name == "constellations.html":
        text = text.replace('id="back" href="./"', 'id="back" href="../../subjects/astronomy/index.html"', 1)
    elif name == "blackhole.html":
        text = text.replace('id="back" href="太阳系行星图鉴.html"', 'id="back" href="../../subjects/astronomy/index.html"', 1)
    elif name == "dark-universe.html":
        text = text.replace('class="back" href="太阳系行星图鉴.html"', 'class="back" href="../../topics/astronomy/universe/index.html"', 1)
        text = text.replace("返回图鉴 <em>BACK</em>", "返回宇宙专题 <em>BACK TO TOPIC</em>", 1)
        text = text.replace(
            "我们熟悉的原子只占宇宙的 4.9%。剩下的部分既不发光，也不反光——只能从引力与膨胀里“读”出来。",
            "我们熟悉的普通物质只占宇宙质能密度的一小部分。暗物质主要通过引力效应推断；暗能量则与宇宙加速膨胀有关。",
            1,
        )
        text = text.replace(
            "Ordinary atoms are just 4.9% of everything. The rest emits no light and reflects none — we can only read it in gravity and expansion.",
            "Ordinary matter is only a small part of the universe's mass-energy density. Dark matter is inferred mainly through gravity; dark energy is associated with the accelerating expansion of the universe.",
            1,
        )
        text = text.replace(
            "把宇宙的总质能分成 100 份：暗能量约 68 份，暗物质约 27 份，而我们熟悉的原子不到 5 份。",
            "按 ESA/Planck 的近似估计，把宇宙的质能密度分成 100 份：暗能量约 68 份，暗物质约 27 份，普通物质不到 5 份。",
            1,
        )
        text = text.replace(
            "Divide the universe's total mass-energy into 100 parts: about 68 parts dark energy, 27 parts dark matter, and less than 5 parts ordinary atoms.",
            "Using approximate ESA/Planck estimates, divide the universe's mass-energy density into 100 parts: about 68 dark energy, 27 dark matter, and under 5 ordinary matter.",
            1,
        )
        text = replace_once(
            text,
            "</aside>\n</div>\n\n<div class=\"note\">",
            '''<div class="source-credit"><span>数据参考 / DATA · </span><a href="https://www.esa.int/ESA_Multimedia/Images/2013/03/Planck_cosmic_recipe" target="_blank" rel="noopener">ESA · Planck mission (2013)</a><span> · 近似宇宙质能密度 / approximate cosmic mass-energy density</span></div>
</aside>
</div>

<div class="note">''',
            "Planck source citation",
        )
        text = replace_once(
            text,
            "/* ---------- note ---------- */",
            '''.source-credit{margin-top:12px;padding-top:9px;border-top:1px solid var(--line-2);font-size:10px;line-height:1.5;letter-spacing:.04em;color:var(--dim)}
.source-credit a{color:var(--ac);text-decoration:none;pointer-events:auto}
.source-credit a:hover{text-decoration:underline}
@media(max-width:980px){.source-credit{flex:1 1 100%;margin-top:0}}

/* ---------- note ---------- */''',
            "source citation style",
        )
    elif name == "moon-phases-large.html":
        text = text.replace(
            'class="back" href="太阳系行星图鉴.html"',
            'class="back" href="../../topics/astronomy/moon-exploration/index.html"',
            1,
        )
        text = replace_once(
            text,
            "// 返回链接：本地文件时指向图鉴\nconst back = $(\"#back\");\nif (location.protocol !== \"file:\") back.href = \"./\";",
            '''// 返回天文学月球专题。\nconst back = $("#back");\nback.href = "../../topics/astronomy/moon-exploration/index.html";\nconst syncTopicLanguage = () => { back.href = "../../topics/astronomy/moon-exploration/index.html" + (document.documentElement.lang === "en" ? "?lang=en" : ""); };\nsyncTopicLanguage();\n$("#lang").addEventListener("click", () => setTimeout(syncTopicLanguage, 0));''',
            "Moon phases return path",
        )
    elif name == "恒星图鉴.html":
        text = text.replace('id="hubBack" href="./"', 'id="hubBack" href="../../topics/astronomy/stellar-sky/index.html"', 1)
    elif name in {"moonlanding.html", "earth-to-mars.html"}:
        text = text.replace('id="back" href="#"', 'id="back" href="../../subjects/astronomy/index.html"', 1)

    return_labels = {
        "bigbang.html": ('<span data-en="Atlas">返回图鉴</span>', '<span data-en="Astronomy">天文学</span>'),
        "blackhole.html": ('<span data-en="Atlas">返回图鉴</span>', '<span data-en="Astronomy">天文学</span>'),
        "constellations.html": ('<span data-en="Atlas">返回图鉴</span>', '<span data-en="Astronomy">天文学</span>'),
        "structure.html": ('<span data-en="Atlas">返回图鉴</span>', '<span data-en="Astronomy">天文学</span>'),
        "uranus-fall.html": ('<span data-en="Atlas">返回图鉴</span>', '<span data-en="Astronomy">天文学</span>'),
        "earth-to-mars.html": ('<span>返回图鉴</span>', '<span>天文学</span>'),
        "moonlanding.html": ('<span>返回图鉴</span>', '<span>天文学</span>'),
        "恒星图鉴.html": ('aria-label="返回太阳系图鉴" data-en="← Atlas">← 图鉴</a>', 'aria-label="返回天文学" data-en="← Astronomy">← 天文学</a>'),
    }
    if name in return_labels:
        old_label, new_label = return_labels[name]
        if old_label in text:
            text = replace_once(text, old_label, new_label, f"{name} return label")

    position = "left:270px;top:20px" if name == "index.html" else "right:154px;top:26px"
    mobile_position = "left:18px;top:74px" if name == "index.html" else "right:18px;top:76px"
    visual_bridge = ""
    if 'id="back"' not in text and 'id="hubBack"' not in text:
        visual_bridge = f'''<style id="science-site-bridge-style">
.science-site-bridge {{position:fixed;z-index:10000;{position};padding:9px 13px;border:1px solid rgba(180,220,225,.45);border-radius:99px;background:rgba(5,13,19,.87);color:#e5f3f3;font:12px/1.2 -apple-system,BlinkMacSystemFont,"Noto Sans SC",sans-serif;letter-spacing:.04em;text-decoration:none;backdrop-filter:blur(12px)}}
.science-site-bridge:hover,.science-site-bridge:focus-visible {{border-color:#8ed8e3;color:#fff}}
@media(max-width:700px){{.science-site-bridge{{{mobile_position};font-size:11px}}}}
</style><a class="science-site-bridge" href="../../subjects/astronomy/index.html" aria-label="返回天文学">← 天文学</a>'''
    navigation_bridge = '''<script>for(const id of ['back','hubBack']){const el=document.getElementById(id);if(el)el.href='../../subjects/astronomy/index.html';}</script>'''
    return replace_once(text, "</body>", visual_bridge + navigation_bridge + "\n</body>", "course bridge")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Folder containing the author's site/*.html files")
    args = parser.parse_args()
    source = args.source.expanduser().resolve()
    missing = [name for name in FILES if not (source / name).is_file()]
    if missing:
        raise SystemExit(f"Missing source files in {source}: {', '.join(missing)}")
    DEST.mkdir(parents=True, exist_ok=True)
    PUBLIC_DEST.mkdir(parents=True, exist_ok=True)
    for original, output in FILES.items():
        text = (source / original).read_text(encoding="utf-8")
        adapted = adapt(original, text)
        (DEST / output).write_text(adapted, encoding="utf-8")
        if original in PUBLIC_FILES:
            (PUBLIC_DEST / output).write_text(adapted, encoding="utf-8")
        print(f"Local preview: {original} → {output}")
    extra = source.parent / "dark-universe.html"
    optional_count = 0
    if extra.is_file():
        adapted = adapt("dark-universe.html", extra.read_text(encoding="utf-8"))
        for destination in (DEST / "dark-universe.html", PUBLIC_DEST / "dark-universe.html"):
            destination.write_text(adapted, encoding="utf-8")
        optional_count += 1
        print("Imported optional page: dark-universe.html")
    moon_extra = source.parent / "moon-phases-large.html"
    if moon_extra.is_file():
        adapted = adapt("moon-phases-large.html", moon_extra.read_text(encoding="utf-8"))
        for destination in (DEST / "moon-phases-large.html", PUBLIC_DEST / "moon-phases-large.html"):
            destination.write_text(adapted, encoding="utf-8")
        optional_count += 1
        print("Imported optional page: moon-phases-large.html")
    print(f"Prepared {len(PUBLIC_FILES) + optional_count} public pages; image-bearing pages are included when their sources are documented.")


if __name__ == "__main__":
    main()
