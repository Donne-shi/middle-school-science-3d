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


def tr(zh: str, en: str, tag: str = "span", attrs: str = "") -> str:
    extra = f" {attrs}" if attrs else ""
    return f'<{tag}{extra} data-zh="{e(zh)}" data-en="{e(en)}">{e(zh)}</{tag}>'


def aria(zh: str, en: str) -> str:
    return f'aria-label="{e(zh)}" data-aria-zh="{e(zh)}" data-aria-en="{e(en)}"'


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
        nav.append(f'<a href="{subject_href}"{attr}>{tr(subject["name"], subject["english"])}</a>')
    return f'''<a class="skip" href="#main">{tr("跳到主要内容", "Skip to main content")}</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="{link(current, 'index.html')}" {aria("牛顿科学探索馆首页", "Newton Science Discovery Center home")}>{tr("牛", "N", attrs='class="brand-mark"')}<span>{tr(CATALOG["title"], CATALOG["title_en"])}{tr("观察 · 操作 · 理解", "OBSERVE · EXPERIMENT · UNDERSTAND", tag="small")}</span></a>
  <div class="header-actions"><nav class="site-nav" {aria("学科导航", "Subject navigation")}>{''.join(nav)}</nav>
  <button class="language-switch" id="language-switch" type="button" aria-label="切换为英文" aria-pressed="false"><span class="language-option language-option-zh" lang="zh-CN">中</span><span class="language-divider" aria-hidden="true">/</span><span class="language-option language-option-en" lang="en">EN</span></button></div>
</div></header>'''


def footer() -> str:
    return '<footer class="site-footer"><div class="container footer-inner">' + tr(CATALOG["title"], CATALOG["title_en"]) + tr("观察 · 操作 · 理解", "Observe · Experiment · Understand") + tr("演示图像与比例以各页面说明为准", "Visual scale and proportions are explained in each lesson") + '</div></footer>'


def page(current: Path, title_zh: str, title_en: str, body: str, active: str | None = None, accent: str = "#197a91") -> None:
    current.parent.mkdir(parents=True, exist_ok=True)
    document = f'''<!doctype html>
<html lang="zh-CN" data-title-zh="{e(title_zh)}" data-title-en="{e(title_en)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#f6f9f8"><meta name="description" content="牛顿科学探索馆：通过交互演示观察科学现象。" data-zh="牛顿科学探索馆：通过交互演示观察科学现象。" data-en="Newton Science Discovery Center: explore science through interactive lessons.">
<title>{e(title_zh)} · {e(CATALOG["title"])}</title>
<link rel="stylesheet" href="{link(current, 'assets/site.css')}"><style>:root {{--accent:{e(accent)}}}</style>
</head><body>{header(current, active)}<main id="main">{body}</main>{footer()}<script src="{link(current, 'assets/site.js')}" defer></script></body></html>
'''
    current.write_text(document, encoding="utf-8")


def home() -> None:
    current = SITE / "index.html"
    cards = []
    for index, subject in enumerate(CATALOG["subjects"], start=1):
        slug = subject["slug"]
        subject_href = link(current, "subjects/" + slug + "/index.html")
        cards.append(f'''<a class="subject-card" style="--accent:{e(subject["accent"])}" href="{subject_href}">
  <div><span class="subject-no">FIELD / {index:02d}</span>{tr(subject["name"], subject["english"], "h3")}<span class="english">{e(subject["english"])}</span>{tr(subject["description"], subject["description_en"], "p")}<span class="card-bottom">{tr(subject["status"], subject["status_en"])} <span aria-hidden="true">↗</span></span></div>
  {motif(slug)}</a>''')
    body = f'''<div class="container"><section class="home-hero" aria-labelledby="home-title"><div>
  <span class="eyebrow eyebrow-line">MIDDLE SCHOOL SCIENCE · 3D ATLAS</span>
  <h1 class="serif" id="home-title">{tr("把科学", "Bring science")}<br>{tr("放到眼前。", "into view.", "em")}</h1>
  {tr("从一颗行星的纹理，到一辆汽车的受力。选择一个学科，亲手旋转、观察，带着问题进入科学的世界。", "From a planet's surface to the forces acting on a car. Choose a subject, explore it yourself, and follow your questions into science.", "p")}
  <div class="hero-note"><a class="text-link" href="{link(current, 'subjects/astronomy/index.html')}">{tr("从天文学开始", "Start with astronomy")} <span class="arrow" aria-hidden="true">→</span></a>{tr("四个学科 · 持续更新", "Four subjects · Growing library", attrs='class="tiny"')}</div>
  </div><div class="scientific-window" role="img" {aria("四个学科围绕科学探索的轨道示意", "Four subjects arranged around a science discovery orbit")}><i class="axis-x"></i><i class="axis-y"></i><i class="orbit"></i><i class="orbit orbit-2"></i><i class="orbit orbit-3"></i><i class="core"></i><i class="plot-node node-a"></i><i class="plot-node node-b"></i><i class="plot-node node-c"></i><i class="plot-node node-d"></i><span class="plot-label label-a">ASTRONOMY</span><span class="plot-label label-b">PHYSICS</span><span class="plot-label label-c">BIOLOGY</span><span class="plot-label label-d">CHEMISTRY</span>{tr("四种探索方式", "FOUR WAYS TO EXPLORE", attrs='class="window-index"')}</div></section>
  <section aria-labelledby="fields-title"><div class="section-heading"><div><span class="eyebrow">CHOOSE A FIELD</span>{tr("四条进入科学的路径", "Four paths into science", "h2", 'id="fields-title"')}</div>{tr("每个学科都可以独立打开；具体演示会随着课程制作逐步加入。", "Open any subject on its own. More interactive lessons will be added as they are completed.", "p")}</div><div class="subject-grid">{''.join(cards)}</div></section></div>'''
    page(current, "首页", "Home", body)


def subject_page(subject: dict) -> None:
    slug = subject["slug"]
    current = SITE / "subjects" / slug / "index.html"
    crumb = f'''<nav class="breadcrumb" {aria("当前位置", "Breadcrumb")}><a href="{link(current, 'index.html')}">{tr(CATALOG["title"], CATALOG["title_en"])}</a><span>/</span>{tr(subject["name"], subject["english"], "strong")}</nav>'''
    hero = f'''<section class="subject-hero"><div><span class="eyebrow eyebrow-line">FIELD / {e(subject["english"])}</span>{tr(subject["name"], subject["english"], "h1")}<span class="english">{e(subject["english"])}</span>{tr(subject["description"], subject["description_en"], "p")}</div><div class="subject-art">{motif(slug)}</div></section>'''
    if subject["topics"]:
        cards = []
        for topic in subject["topics"]:
            href = link(current, f'topics/{slug}/{topic["slug"]}/index.html')
            cards.append(f'''<a class="topic-card" href="{href}">{tr(topic["status"], topic["status_en"], attrs='class="status-pill"')}{tr(topic["name"], topic["english"], "h3")}<span class="english">{e(topic["english"])}</span>{tr(topic["description"], topic["description_en"], "p")}<span class="card-go">{tr("查看专题", "View topic")} <span class="arrow" aria-hidden="true">→</span></span></a>''')
        content = f'''<section aria-labelledby="topic-title"><div class="section-heading"><div><span class="eyebrow">EXPLORE THE TOPICS</span>{tr("选择一个主题", "Choose a topic", "h2", 'id="topic-title"')}</div>{tr("从演示进入，再沿着问题继续观察。", "Start with a lesson and keep exploring through questions.", "p")}</div><div class="topic-list">{''.join(cards)}</div></section>'''
    else:
        content = f'''<section class="empty-state" aria-labelledby="empty-title">{tr("内容筹备中", "Coming soon", attrs='class="status-pill"')}{tr(subject["name"] + "的演示正在制作", subject["english"] + " lessons are in development", "h2", 'id="empty-title"')}{tr("这里将汇集可独立打开的主题和 3D 演示。内容完成并核对后，会逐步加入本学科目录。", "This subject will feature topics and 3D lessons that open independently. They will appear here as each lesson is completed and reviewed.", "p")}<a class="text-link" href="{link(current, 'index.html')}">{tr("返回四学科入口", "Back to all subjects")} <span class="arrow" aria-hidden="true">→</span></a></section>'''
    page(current, subject["name"], subject["english"], f'<div class="container">{crumb}{hero}{content}</div>', slug, subject["accent"])


def topic_page(subject: dict, topic: dict) -> None:
    slug = subject["slug"]
    current = SITE / "topics" / slug / topic["slug"] / "index.html"
    subject_href = link(current, "subjects/" + slug + "/index.html")
    crumb = f'''<nav class="breadcrumb" {aria("当前位置", "Breadcrumb")}><a href="{link(current, 'index.html')}">{tr(CATALOG["title"], CATALOG["title_en"])}</a><span>/</span><a href="{subject_href}">{tr(subject["name"], subject["english"])}</a><span>/</span>{tr(topic["name"], topic["english"], "strong")}</nav>'''
    visual_zh, visual_en = {
        "astronomy": ("一颗恒星 · 八颗行星", "ONE STAR · EIGHT PLANETS"),
        "physics": ("一辆车 · 三条定律", "ONE CAR · THREE LAWS"),
        "biology": ("二十六个标本 · 多样的生命", "26 SPECIMENS · DIVERSITY OF LIFE"),
        "chemistry": ("十二个模型 · 一条发现之路", "TWELVE VIEWS · ONE STORY OF DISCOVERY"),
    }[slug]
    intro = f'''<section class="topic-intro"><div><span class="eyebrow eyebrow-line">TOPIC / {e(topic["english"])}</span>{tr(topic["name"], topic["english"], "h1")}{tr(topic["description"], topic["description_en"], "p")}</div><div class="topic-visual topic-visual-{e(slug)}" aria-hidden="true">{tr(visual_zh, visual_en)}</div></section>'''
    cards = []
    for index, lesson in enumerate(topic["lessons"], start=1):
        if LOCAL_PREVIEW or lesson.get("published", False):
            opening = f'<a class="lesson-card" href="{link(current, lesson["href"])}">'
            closing = '</a>'
            action = tr("打开演示", "Open lesson") + ' <span class="arrow" aria-hidden="true">→</span>'
        else:
            opening = '<article class="lesson-card lesson-card-pending">'
            closing = '</article>'
            action = tr("演示素材核对后开放", "Available after materials review")
        cards.append(f'''{opening}<span class="eyebrow">EXPLORE / {index:02d}</span>{tr(lesson["name"], lesson["english"], "h3")}<span class="english">{e(lesson["english"])}</span>{tr(lesson["description"], lesson["description_en"], "p")}{tr(lesson["interaction"], lesson["interaction_en"], attrs='class="mode"')}<span class="card-go" style="display:flex;margin-top:28px">{action}</span>{closing}''')
    guidance_zh, guidance_en = {
        "astronomy": ("建议先看行星图鉴，再用太阳系结构理解更远的尺度。", "Start with the planet atlas, then use the Solar System structure lesson to explore greater distances."),
        "physics": ("从受力图开始，依次探索牛顿三大定律。", "Start with force diagrams, then explore Newton's three laws in order."),
        "biology": ("先选择一类标本，再旋转、剖切，并对照真实显微图像。", "Choose a specimen, rotate and cut away its model, then compare it with a microscope image."),
        "chemistry": ("从道尔顿模型开始，观察每一次新证据如何改写原子图景。", "Start with Dalton and watch new evidence reshape each atomic model."),
    }[slug]
    section = f'''<section aria-labelledby="lesson-title"><div class="section-heading"><div><span class="eyebrow">INTERACTIVE LESSONS</span>{tr("选择一个演示", "Choose a lesson", "h2", 'id="lesson-title"')}</div>{tr(guidance_zh, guidance_en, "p")}</div><div class="lesson-grid">{''.join(cards)}</div></section>'''
    note_zh, note_en = {
        "astronomy": ("天体尺寸、距离和时间如经过视觉调整，以各演示页的标注为准。", "Visual scales for size, distance, and time are explained in each lesson."),
        "physics": ("汽车模型、力箭头和场景为教学示意；数值及简化条件见演示说明。", "The car, force arrows, and scene are teaching models; see the lesson for values and assumptions."),
        "biology": ("三维形态经过教学简化，标本大小不按同一比例；显微图片的来源与授权仍在核对。", "The 3D models are simplified and not shown at a common scale; image credits and licenses are still under review."),
        "chemistry": ("历史模型体现提出时的认识，轨道图像为教学示意；比例不代表真实原子。", "Historical models reflect ideas of their time; orbital views are teaching illustrations, not literal scale models."),
    }[slug]
    note = '<div class="context-bar">' + tr("适合课堂展示与自主探索", "For classroom and independent exploration") + tr(note_zh, note_en) + '</div>'
    page(current, topic["name"], topic["english"], f'<div class="container">{crumb}{intro}{note}{section}</div>', slug, subject["accent"])


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
