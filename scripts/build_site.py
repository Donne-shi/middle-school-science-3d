#!/usr/bin/env python3
"""Build the static, directly addressable science site with no dependencies."""

from __future__ import annotations

import json
import os
import shutil
import argparse
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
LOCAL_PREVIEW = False
CATALOG = json.loads((ROOT / "content/catalog.json").read_text(encoding="utf-8"))


def e(value: object) -> str:
    return escape(str(value), quote=True)


def link(current: Path, target: str) -> str:
    return Path(os.path.relpath(SITE / target, current.parent)).as_posix()


def motif(slug: str) -> str:
    common = 'viewBox="0 0 200 200" fill="none" aria-hidden="true"'
    if slug == "astronomy":
        drawing = '<circle cx="100" cy="100" r="23" fill="#d5e9d9"/><circle cx="100" cy="100" r="23" stroke="#9bdce4"/><ellipse cx="100" cy="100" rx="91" ry="49" transform="rotate(-29 100 100)" stroke="#8ed8e3" opacity=".6"/><ellipse cx="100" cy="100" rx="69" ry="82" transform="rotate(38 100 100)" stroke="#8ed8e3" opacity=".27"/><circle cx="178" cy="54" r="7" fill="#8ed8e3"/>'
    elif slug == "physics":
        drawing = '<path d="M25 38H175M100 38V62M48 65C57 132 89 160 100 162C111 160 143 132 152 65" stroke="#ba572e" opacity=".65"/><path d="M100 43L143 143" stroke="#ba572e" stroke-width="2"/><circle cx="143" cy="143" r="17" fill="#f2b985"/><circle cx="100" cy="43" r="4" fill="#ba572e"/>'
    elif slug == "biology":
        drawing = '<path d="M100 20C150 19 184 56 181 105C178 153 144 181 100 180C57 180 20 149 19 101C18 58 52 21 100 20Z" stroke="#a9d9a3" stroke-width="2"/><path d="M66 56C80 46 102 47 118 62C141 62 153 81 148 103C157 128 139 151 115 148C98 159 72 153 64 135C46 121 48 89 66 56Z" stroke="#a9d9a3" opacity=".38"/><circle cx="103" cy="101" r="29" fill="#385d50" stroke="#a9d9a3"/><circle cx="109" cy="97" r="9" fill="#a9d9a3"/><circle cx="57" cy="119" r="7" fill="#a9d9a3" opacity=".6"/><circle cx="144" cy="74" r="6" fill="#a9d9a3" opacity=".6"/>'
    else:
        drawing = '<path d="M41 113L94 69L147 96M94 69L112 145M147 96L112 145" stroke="#8058a5" stroke-width="3" opacity=".7"/><circle cx="41" cy="113" r="18" fill="#e9dbf1" stroke="#8058a5" stroke-width="2"/><circle cx="94" cy="69" r="22" fill="#a884c3"/><circle cx="147" cy="96" r="17" fill="#e9dbf1" stroke="#8058a5" stroke-width="2"/><circle cx="112" cy="145" r="14" fill="#a884c3"/>'
    return f"<svg {common}>{drawing}</svg>"


def header(current: Path, active: str | None = None) -> str:
    nav = []
    for subject in CATALOG["subjects"]:
        attr = ' aria-current="page"' if subject["slug"] == active else ""
        subject_href = link(current, "subjects/" + subject["slug"] + "/index.html")
        nav.append(f'<a href="{subject_href}"{attr}>{e(subject["name"])}</a>')
    return f'''<a class="skip" href="#main">跳到主要内容</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="{link(current, 'index.html')}" aria-label="科学探索馆首页"><span class="brand-mark">科</span><span>科学探索馆<small>SCIENCE IN MOTION</small></span></a>
  <nav class="site-nav" aria-label="学科导航">{''.join(nav)}</nav>
</div></header>'''


def footer() -> str:
    return '<footer class="site-footer"><div class="container footer-inner"><span>中学科学 3D 探索馆</span><span>观察 · 操作 · 理解</span><span>演示图像与比例以各页面说明为准</span></div></footer>'


def page(current: Path, title: str, body: str, active: str | None = None, accent: str = "#197a91", intro: bool = False) -> None:
    current.parent.mkdir(parents=True, exist_ok=True)
    intro_head = '<script>document.documentElement.classList.add("js-intro")</script>' if intro else ""
    intro_body = intro_markup() if intro else ""
    intro_script = f'<script src="{link(current, "assets/site.js")}" defer></script>' if intro else ""
    document = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#f6f9f8"><meta name="description" content="中学科学 3D 探索馆：通过交互演示观察科学现象。">
<title>{e(title)} · 中学科学 3D 探索馆</title>
<link rel="stylesheet" href="{link(current, 'assets/site.css')}"><style>:root {{--accent:{e(accent)}}}</style>
{intro_head}</head><body>{intro_body}{header(current, active)}<main id="main">{body}</main>{footer()}{intro_script}</body></html>
'''
    current.write_text(document, encoding="utf-8")


def intro_markup() -> str:
    return '''<div class="site-intro" id="site-intro" aria-label="开场动画">
  <div class="intro-sky" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><span class="intro-horizon"></span></div>
  <div class="intro-content"><span class="intro-overline">仰望 · 探索 · 求知</span><p>诸天诉说牠的荣耀！</p><span class="intro-byline">从好奇开始，走进科学。</span></div>
  <button class="intro-skip" id="intro-skip" type="button">跳过开场 <span aria-hidden="true">→</span></button>
</div>'''


def home() -> None:
    current = SITE / "index.html"
    cards = []
    for index, subject in enumerate(CATALOG["subjects"], start=1):
        slug = subject["slug"]
        subject_href = link(current, "subjects/" + slug + "/index.html")
        cards.append(f'''<a class="subject-card" style="--accent:{e(subject["accent"])}" href="{subject_href}">
  <div><span class="subject-no">FIELD / {index:02d}</span><h3>{e(subject["name"])}</h3><span class="english">{e(subject["english"])}</span><p>{e(subject["description"])}</p><span class="card-bottom">{e(subject["status"])}　<span aria-hidden="true">↗</span></span></div>
  {motif(slug)}</a>''')
    body = f'''<div class="container"><section class="home-hero" aria-labelledby="home-title"><div>
  <span class="eyebrow eyebrow-line">MIDDLE SCHOOL SCIENCE · 3D ATLAS</span>
  <h1 class="serif" id="home-title">把科学<br><em>放到眼前。</em></h1>
  <p>从一颗行星的纹理，到一辆汽车的受力。选择一个学科，亲手旋转、观察，带着问题进入科学的世界。</p>
  <div class="hero-note"><a class="text-link" href="{link(current, 'subjects/astronomy/index.html')}">从天文学开始 <span class="arrow" aria-hidden="true">→</span></a><span class="tiny">四个学科 · 持续更新</span><button class="replay-intro" id="replay-intro" type="button">重看开场 ↗</button></div>
  </div><div class="scientific-window" role="img" aria-label="四个学科围绕科学探索的轨道示意"><i class="axis-x"></i><i class="axis-y"></i><i class="orbit"></i><i class="orbit orbit-2"></i><i class="orbit orbit-3"></i><i class="core"></i><i class="plot-node node-a"></i><i class="plot-node node-b"></i><i class="plot-node node-c"></i><i class="plot-node node-d"></i><span class="plot-label label-a">ASTRONOMY</span><span class="plot-label label-b">PHYSICS</span><span class="plot-label label-c">BIOLOGY</span><span class="plot-label label-d">CHEMISTRY</span><span class="window-index">FOUR WAYS TO EXPLORE</span></div></section>
  <section aria-labelledby="fields-title"><div class="section-heading"><div><span class="eyebrow">CHOOSE A FIELD</span><h2 id="fields-title">四条进入科学的路径</h2></div><p>每个学科都可以独立打开；具体演示会随着课程制作逐步加入。</p></div><div class="subject-grid">{''.join(cards)}</div></section></div>'''
    page(current, "首页", body, intro=True)


def subject_page(subject: dict) -> None:
    slug = subject["slug"]
    current = SITE / "subjects" / slug / "index.html"
    crumb = f'''<nav class="breadcrumb" aria-label="当前位置"><a href="{link(current, 'index.html')}">科学探索馆</a><span>/</span><strong>{e(subject["name"])}</strong></nav>'''
    hero = f'''<section class="subject-hero"><div><span class="eyebrow eyebrow-line">FIELD / {e(subject["english"])}</span><h1>{e(subject["name"])}</h1><span class="english">{e(subject["english"])}</span><p>{e(subject["description"])}</p></div><div class="subject-art">{motif(slug)}</div></section>'''
    if subject["topics"]:
        cards = []
        for topic in subject["topics"]:
            href = link(current, f'topics/{slug}/{topic["slug"]}/index.html')
            cards.append(f'''<a class="topic-card" href="{href}"><span class="status-pill">{e(topic["status"])}</span><h3>{e(topic["name"])}</h3><span class="english">{e(topic["english"])}</span><p>{e(topic["description"])}</p><span class="card-go">查看专题 <span class="arrow" aria-hidden="true">→</span></span></a>''')
        content = f'''<section aria-labelledby="topic-title"><div class="section-heading"><div><span class="eyebrow">EXPLORE THE TOPICS</span><h2 id="topic-title">选择一个主题</h2></div><p>从演示进入，再沿着问题继续观察。</p></div><div class="topic-list">{''.join(cards)}</div></section>'''
    else:
        content = f'''<section class="empty-state" aria-labelledby="empty-title"><span class="status-pill">内容筹备中</span><h2 id="empty-title">{e(subject["name"])}的演示正在制作</h2><p>这里将汇集可独立打开的主题和 3D 演示。内容完成并核对后，会逐步加入本学科目录。</p><a class="text-link" href="{link(current, 'index.html')}">返回四学科入口 <span class="arrow" aria-hidden="true">→</span></a></section>'''
    page(current, subject["name"], f'<div class="container">{crumb}{hero}{content}</div>', slug, subject["accent"])


def topic_page(subject: dict, topic: dict) -> None:
    slug = subject["slug"]
    current = SITE / "topics" / slug / topic["slug"] / "index.html"
    subject_href = link(current, "subjects/" + slug + "/index.html")
    crumb = f'''<nav class="breadcrumb" aria-label="当前位置"><a href="{link(current, 'index.html')}">科学探索馆</a><span>/</span><a href="{subject_href}">{e(subject["name"])}</a><span>/</span><strong>{e(topic["name"])}</strong></nav>'''
    visual_label = "ONE STAR · EIGHT PLANETS" if slug == "astronomy" else "ONE CAR · THREE LAWS"
    intro = f'''<section class="topic-intro"><div><span class="eyebrow eyebrow-line">TOPIC / {e(topic["english"])}</span><h1>{e(topic["name"])}</h1><p>{e(topic["description"])}</p></div><div class="topic-visual topic-visual-{e(slug)}" aria-hidden="true"><span>{visual_label}</span></div></section>'''
    cards = []
    for index, lesson in enumerate(topic["lessons"], start=1):
        if LOCAL_PREVIEW or lesson.get("published", False):
            opening = f'<a class="lesson-card" href="{link(current, lesson["href"])}">'
            closing = '</a>'
            action = '打开演示 <span class="arrow" aria-hidden="true">→</span>'
        else:
            opening = '<article class="lesson-card lesson-card-pending">'
            closing = '</article>'
            action = '演示素材核对后开放'
        cards.append(f'''{opening}<span class="eyebrow">EXPLORE / {index:02d}</span><h3>{e(lesson["name"])}</h3><span class="english">{e(lesson["english"])}</span><p>{e(lesson["description"])}</p><span class="mode">{e(lesson["interaction"])}</span><span class="card-go" style="display:flex;margin-top:28px">{action}</span>{closing}''')
    guidance = "建议先看行星图鉴，再用太阳系结构理解更远的尺度。" if slug == "astronomy" else "从受力图开始，依次探索牛顿三大定律。"
    section = f'''<section aria-labelledby="lesson-title"><div class="section-heading"><div><span class="eyebrow">INTERACTIVE LESSONS</span><h2 id="lesson-title">选择一个演示</h2></div><p>{guidance}</p></div><div class="lesson-grid">{''.join(cards)}</div></section>'''
    note_text = "天体尺寸、距离和时间如经过视觉调整，以各演示页的标注为准。" if slug == "astronomy" else "汽车模型、力箭头和场景为教学示意；数值及简化条件见演示说明。"
    note = f'<div class="context-bar"><span>适合课堂展示与自主探索</span><span>{note_text}</span></div>'
    page(current, topic["name"], f'<div class="container">{crumb}{intro}{note}{section}</div>', slug, subject["accent"])


def main() -> None:
    global SITE, LOCAL_PREVIEW
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--local", action="store_true", help="Build an ignored local preview with active demo links")
    args = parser.parse_args()
    LOCAL_PREVIEW = args.local
    SITE = ROOT / ("preview" if LOCAL_PREVIEW else "site")
    SITE.mkdir(exist_ok=True)
    (SITE / "assets").mkdir(exist_ok=True)
    shutil.copyfile(ROOT / "web/assets/site.css", SITE / "assets/site.css")
    shutil.copyfile(ROOT / "web/assets/site.js", SITE / "assets/site.js")
    home()
    for subject in CATALOG["subjects"]:
        subject_page(subject)
        for topic in subject["topics"]:
            topic_page(subject, topic)
            if LOCAL_PREVIEW:
                for lesson in topic["lessons"]:
                    if lesson.get("published", False):
                        source = ROOT / "site" / lesson["href"]
                        if not source.is_file():
                            raise FileNotFoundError(f"Published demo missing: {source}")
                        shutil.copytree(source.parent, SITE / lesson["href"].rsplit("/", 1)[0], dirs_exist_ok=True)
    print(f"Built four-subject entry and subject topics in {SITE.name}/")


if __name__ == "__main__":
    main()
