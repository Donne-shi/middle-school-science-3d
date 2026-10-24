#!/usr/bin/env python3
"""Import the supplied cell atlas into the ignored local Biology preview.

The source embeds third-party microscope photographs. Keep this copy out of
the public site until each photograph's attribution and license are checked.
"""

from __future__ import annotations

import argparse
import hashlib
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "preview/demos/biology/cell-atlas/index.html"
GALLERY = ROOT / "web/biology/cell-atlas"
IMAGES = (
    "ecoli", "staph", "nostoc", "mycoplasma", "methano", "halo",
    "amoeba", "paramecium", "chlamy", "diatom", "yeast", "penicillium",
    "mesophyll", "onion", "roothair", "rbc", "neuron", "myocyte", "sperm",
    "adipocyte", "neutrophil", "oocyte", "t4", "tmv", "adeno", "sarscov2",
)


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise ValueError(f"{label}: expected one match, found {count}")
    return source.replace(old, new, 1)


def adapt(source: str, with_gallery: bool) -> str:
    style = """<style id="science-site-bridge-style">
.science-back{display:inline-flex;align-items:center;min-height:30px;padding:0 12px;border:1px solid rgba(127,208,207,.45);color:#e5f3f3;background:rgba(5,13,19,.72);font:11px/1.2 -apple-system,BlinkMacSystemFont,\"Noto Sans SC\",sans-serif;letter-spacing:.05em;text-decoration:none;white-space:nowrap}
.science-back:hover,.science-back:focus-visible{border-color:#7fd0cf;color:#fff}
.cover-back{position:fixed;right:clamp(18px,4vw,52px);top:24px;z-index:50;pointer-events:auto}
@media(max-width:640px){.cover-back{top:16px;right:16px}.topmeta .science-back{padding:0 8px;font-size:10px}}
</style>"""
    source = replace_once(source, "</style>\n</head>", "</style>\n" + style + "\n</head>", "bridge style")
    if with_gallery:
        source = replace_once(source, "</head>", '<link rel="stylesheet" href="assets/structure-gallery.css">\n</head>', "gallery stylesheet")
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
    if with_gallery:
        source = replace_once(
            source,
            '        <span id="photoBtnTxt">显微</span>\n      </button>',
            '        <span id="photoBtnTxt">显微</span>\n      </button>\n      <button class="hbtn structure-open" id="structureBtn" type="button" aria-haspopup="dialog">结构图</button>',
            "structure gallery trigger",
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
    gallery = ""
    if with_gallery:
        gallery = '''<div class="structure-viewer" id="structureViewer" role="dialog" aria-modal="true" aria-labelledby="structureTitle" hidden>
  <div class="structure-dialog">
    <header class="structure-head"><div><span class="structure-kicker">CELL ATLAS / STRUCTURE</span><h2 id="structureTitle">内部结构图</h2></div>
      <div class="structure-actions"><button type="button" id="structurePrev" aria-label="上一个标本">←</button><span id="structureCount" aria-live="polite"></span><button type="button" id="structureNext" aria-label="下一个标本">→</button><button type="button" id="structureLang" aria-label="切换说明语言">EN</button><button type="button" id="structureClose" aria-label="关闭结构图">✕</button></div>
    </header>
    <div class="structure-tabs" id="structureTabs" role="tablist" aria-label="标本示意图"></div>
    <div class="structure-main">
      <figure class="structure-figure"><div class="structure-image-wrap" id="structureImageWrap"><img id="structureImage" alt=""><div id="structureMarkers"></div></div><figcaption class="structure-note" id="structureCaption"></figcaption></figure>
      <aside class="structure-side"><h3 id="structureName"></h3><span class="latin" id="structureLatin"></span><p class="structure-intro" id="structureIntro"></p>
        <span class="structure-list-title" id="structureListTitle"></span><div class="structure-list" id="structureList"></div><div class="structure-detail" id="structureDetail" aria-live="polite"></div>
        <div class="structure-source"><span id="structureSourceLabel"></span><a id="structureSource" target="_blank" rel="noopener noreferrer"></a></div>
      </aside>
    </div>
  </div>
</div>
<script src="assets/structure-gallery-data.js"></script>
<script src="assets/structure-gallery.js"></script>'''
    source = replace_once(source, "</body>", bridge + "\n" + gallery + "\n</body>", "bridge script")
    # The three sections are broad teaching categories, not biological domains.
    source = source.replace("3</b><span>个域 DOMAINS", "3</b><span>大类 CATEGORIES")
    source = source.replace("按「域」排开", "按类别排开")
    source = source.replace("按<b>域 → 类群</b>排列", "按<b>类别 → 类群</b>排列")
    # E. coli is typically peritrichous; avoid conflicting text beside the new illustration.
    source = source.replace("一端伸出几根螺旋状的<b>鞭毛</b>", "细胞表面不同位置伸出多根螺旋状的<b>鞭毛</b>")
    source = source.replace("没有膜包裹，附着在细胞膜内侧。", "没有核膜包裹。")
    return source


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Original single-file cell atlas HTML")
    parser.add_argument("--images", type=Path, default=ROOT / "local_assets/cell-atlas", help="Folder containing all 26 generated specimen images")
    args = parser.parse_args()
    source = args.source.expanduser().resolve()
    if not source.is_file():
        raise SystemExit(f"Source file not found: {source}")
    data = source.read_bytes()
    text = data.decode("utf-8")
    image_dir = args.images.expanduser().resolve()
    found = [name for name in IMAGES if (image_dir / f"{name}.png").is_file()]
    if found and len(found) != len(IMAGES):
        raise SystemExit(f"Incomplete gallery in {image_dir}: expected {', '.join(IMAGES)}")
    with_gallery = len(found) == len(IMAGES)
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(adapt(text, with_gallery), encoding="utf-8")
    if with_gallery:
        assets = DEST.parent / "assets"
        assets.mkdir(exist_ok=True)
        shutil.copyfile(GALLERY / "structure-gallery.css", assets / "structure-gallery.css")
        shutil.copyfile(GALLERY / "structure-gallery-data.js", assets / "structure-gallery-data.js")
        shutil.copyfile(GALLERY / "structure-gallery.js", assets / "structure-gallery.js")
        for name in IMAGES:
            shutil.copyfile(image_dir / f"{name}.png", assets / f"structure-{name}.png")
        print(f"Included {len(IMAGES)} local structure illustrations and bilingual labels.")
    else:
        print(f"No local structure illustrations in {image_dir}; imported base atlas only.")
    print(f"Local Biology preview: {DEST.relative_to(ROOT)}")
    print(f"Source SHA-256: {hashlib.sha256(data).hexdigest()}")


if __name__ == "__main__":
    main()
