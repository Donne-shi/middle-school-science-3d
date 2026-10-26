#!/usr/bin/env python3
"""Build the static, directly addressable science site with no dependencies."""

from __future__ import annotations

import json
import hashlib
import os
import shutil
import argparse
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
LOCAL_PREVIEW = False
CATALOG = json.loads((ROOT / "content/catalog.json").read_text(encoding="utf-8"))
UPDATES = json.loads((ROOT / "content/updates.json").read_text(encoding="utf-8"))
CSS_VERSION = hashlib.sha256((ROOT / "web/assets/site.css").read_bytes()).hexdigest()[:12]
INTERACTIVE_COUNT = sum(
    1
    for subject in CATALOG["subjects"]
    for topic in subject["topics"]
    for lesson in topic["lessons"]
    if lesson.get("published", False)
) + int((ROOT / "content/demos/nobel-2026/index.html").is_file())


def e(value: object) -> str:
    return escape(str(value), quote=True)


def tr(zh: str, en: str, tag: str = "span", attrs: str = "") -> str:
    extra = f" {attrs}" if attrs else ""
    return f'<{tag}{extra} data-zh="{e(zh)}" data-en="{e(en)}">{e(zh)}</{tag}>'


def aria(zh: str, en: str) -> str:
    return f'aria-label="{e(zh)}" data-aria-zh="{e(zh)}" data-aria-en="{e(en)}"'


def link(current: Path, target: str) -> str:
    relative = Path(os.path.relpath(SITE / target, current.parent)).as_posix()
    # pathlib drops a trailing slash, but COS uses it to resolve index.html.
    if target.endswith("/") and relative not in (".", "") and not relative.endswith("/"):
        relative += "/"
    return relative


def subject_route(slug: str) -> str:
    return f"{slug}/"


def topic_route(subject_slug: str, topic_slug: str) -> str:
    return f"{subject_slug}/{topic_slug}/"


def lesson_route(slug: str) -> str:
    return f"labs/{slug}/"


def route_alias(route: str, target: str, title: str) -> None:
    """Create a short, extension-free URL that hosts the canonical page full-screen."""
    current = SITE / route
    current.parent.mkdir(parents=True, exist_ok=True)
    relative_target = Path(os.path.relpath(SITE / target, current.parent)).as_posix()
    document = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><title>{e(title)} · 牛顿科学探索馆</title>
<style>html,body{{width:100%;height:100%;margin:0;overflow:hidden;background:#05090b}}iframe{{position:fixed;inset:0;width:100%;height:100%;border:0}}</style></head>
<body><iframe id="destination" title="{e(title)}" allow="fullscreen; autoplay; clipboard-write" allowfullscreen></iframe>
<script>const target={json.dumps(relative_target, ensure_ascii=False)};const query=new URLSearchParams(location.search);const lang=query.get('lang');document.getElementById('destination').src=target+(lang?'?lang='+encodeURIComponent(lang):'');</script></body></html>
'''
    current.write_text(document, encoding="utf-8")


def motif(slug: str) -> str:
    common = 'viewBox="0 0 200 200" fill="none" aria-hidden="true"'
    if slug == "astronomy":
        drawing = '<circle cx="100" cy="100" r="23" fill="#e7ddc3"/><circle cx="100" cy="100" r="23" stroke="#718891"/><ellipse cx="100" cy="100" rx="91" ry="49" transform="rotate(-29 100 100)" stroke="#718891" opacity=".7"/><ellipse cx="100" cy="100" rx="69" ry="82" transform="rotate(38 100 100)" stroke="#718891" opacity=".38"/><circle cx="178" cy="54" r="7" fill="#bd8d54"/>'
    elif slug == "physics":
        drawing = '<path d="M25 38H175M100 38V62M48 65C57 132 89 160 100 162C111 160 143 132 152 65" stroke="#b76443" opacity=".72"/><path d="M100 43L143 143" stroke="#b76443" stroke-width="2"/><circle cx="143" cy="143" r="17" fill="#e4b278" stroke="#b76443"/><circle cx="100" cy="43" r="4" fill="#b76443"/>'
    elif slug == "biology":
        drawing = '<path d="M100 20C150 19 184 56 181 105C178 153 144 181 100 180C57 180 20 149 19 101C18 58 52 21 100 20Z" stroke="#54826b" stroke-width="2"/><path d="M66 56C80 46 102 47 118 62C141 62 153 81 148 103C157 128 139 151 115 148C98 159 72 153 64 135C46 121 48 89 66 56Z" stroke="#54826b" opacity=".55"/><circle cx="103" cy="101" r="29" fill="#dfebd9" stroke="#54826b"/><circle cx="109" cy="97" r="9" fill="#54826b"/><circle cx="57" cy="119" r="7" fill="#85a77d" opacity=".8"/><circle cx="144" cy="74" r="6" fill="#85a77d" opacity=".8"/>'
    else:
        drawing = '<path d="M41 113L94 69L147 96M94 69L112 145M147 96L112 145" stroke="#76658d" stroke-width="3" opacity=".8"/><circle cx="41" cy="113" r="18" fill="#eee7f2" stroke="#76658d" stroke-width="2"/><circle cx="94" cy="69" r="22" fill="#c0b2cf" stroke="#76658d"/><circle cx="147" cy="96" r="17" fill="#eee7f2" stroke="#76658d" stroke-width="2"/><circle cx="112" cy="145" r="14" fill="#c0b2cf" stroke="#76658d"/>'
    return f"<svg {common}>{drawing}</svg>"


def home_illustration(slug: str) -> str:
    """Draw a distinctive, semi-flat editorial illustration for each subject."""
    common = 'viewBox="0 0 320 280" fill="none" aria-hidden="true"'
    if slug == "astronomy":
        art = '''<g stroke="#607e88" stroke-width="1.5" opacity=".65"><ellipse cx="160" cy="144" rx="135" ry="56" transform="rotate(-17 160 144)"/><ellipse cx="160" cy="144" rx="106" ry="83" transform="rotate(24 160 144)"/><ellipse cx="160" cy="144" rx="72" ry="112" transform="rotate(-34 160 144)"/></g>
        <circle cx="160" cy="144" r="32" fill="#efc77d"/><circle cx="151" cy="135" r="9" fill="#f7dfa7" opacity=".8"/><path d="M142 158c11-9 23-12 36-8" stroke="#d89b4f" stroke-width="3" opacity=".7"/>
        <circle cx="43" cy="105" r="10" fill="#75a9c4"/><path d="M37 103c4-4 9-4 13-2" stroke="#d8edf1" stroke-width="2"/><circle cx="251" cy="86" r="15" fill="#d98d69"/><path d="M241 82c7-6 14-6 21-2m-22 10c7-4 14-4 21 0" stroke="#f5d0ad" stroke-width="2" opacity=".85"/><circle cx="95" cy="214" r="13" fill="#bea87f"/><path d="M86 211c6-4 12-4 18-1" stroke="#f0e5c9" stroke-width="2"/><circle cx="271" cy="160" r="7" fill="#aab7b6"/>
        <g fill="#748b91"><circle cx="63" cy="53" r="2"/><circle cx="219" cy="45" r="2"/><circle cx="284" cy="226" r="2"/><circle cx="40" cy="186" r="2"/></g><path d="M74 76l5-10 5 10-5 10z" fill="#c39e61"/>'''
    elif slug == "physics":
        art = '''<path d="M28 218h266" stroke="#89999a" stroke-width="2"/><path d="M48 229h224" stroke="#cfd5ce" stroke-width="7" stroke-linecap="round"/><path d="M67 215c18-43 37-58 60-78" stroke="#b76443" stroke-width="2" stroke-dasharray="4 7" opacity=".72"/>
        <path d="M77 182l44-49" stroke="#536f78" stroke-width="3"/><circle cx="122" cy="132" r="5" fill="#536f78"/><path d="M96 218v-14l16-18h69l25 18v14z" fill="#e9a879" stroke="#a65b41" stroke-width="2"/><path d="M115 187l12-14h42l15 14z" fill="#d8e5e2" stroke="#8d9f9c" stroke-width="2"/><circle cx="119" cy="218" r="12" fill="#324d58"/><circle cx="119" cy="218" r="5" fill="#e5d9c4"/><circle cx="187" cy="218" r="12" fill="#324d58"/><circle cx="187" cy="218" r="5" fill="#e5d9c4"/>
        <path d="M147 168V103" stroke="#bc6847" stroke-width="2.5"/><path d="M147 97l-7 12h14z" fill="#bc6847"/><path d="M205 193h46" stroke="#587985" stroke-width="2.5"/><path d="M257 193l-12-7v14z" fill="#587985"/><path d="M74 168l-15-18m15 18 18-3" stroke="#d3a15f" stroke-width="2"/><circle cx="74" cy="168" r="5" fill="#d3a15f"/>
        <g fill="#7d9191"><circle cx="239" cy="64" r="2"/><circle cx="269" cy="93" r="2"/><circle cx="58" cy="79" r="2"/></g>'''
    elif slug == "biology":
        art = '''<path d="M160 33c66 0 120 44 120 103s-48 111-120 111S40 195 40 136 94 33 160 33z" fill="#e7efdc" stroke="#64896f" stroke-width="5"/><path d="M160 42c60 0 109 40 109 94s-44 101-109 101S51 190 51 136 100 42 160 42z" fill="#f2f3df" stroke="#a4b691" stroke-width="2"/>
        <path d="M110 84c16-14 41-15 57-1 17 15 15 41-1 55-16 15-42 13-55-4-12-15-13-36-1-50z" fill="#d7c3d8" stroke="#8d718f" stroke-width="2"/><circle cx="144" cy="112" r="11" fill="#9b7ca1"/><circle cx="150" cy="105" r="4" fill="#eee2eb"/>
        <g fill="#83ac77" stroke="#547e66" stroke-width="2"><ellipse cx="211" cy="91" rx="22" ry="11" transform="rotate(-25 211 91)"/><ellipse cx="218" cy="170" rx="24" ry="12" transform="rotate(20 218 170)"/><ellipse cx="99" cy="174" rx="22" ry="11" transform="rotate(-20 99 174)"/></g>
        <g stroke="#d9efad" stroke-width="2"><path d="M196 92l25-5m-17 12 18-7m-17 85 27 4m-24 4 20 3m-109-14 23-9m-19 15 19-7"/></g>
        <g fill="#d98c67" stroke="#a86650" stroke-width="2"><ellipse cx="91" cy="111" rx="19" ry="10" transform="rotate(35 91 111)"/><ellipse cx="185" cy="196" rx="18" ry="9" transform="rotate(-20 185 196)"/></g><path d="M80 106c9 7 15 12 21 17m75 68 19-8" stroke="#f7d9b2" stroke-width="2"/>
        <g fill="#c69b5d"><circle cx="76" cy="145" r="4"/><circle cx="179" cy="75" r="4"/><circle cx="247" cy="133" r="4"/><circle cx="133" cy="196" r="4"/></g>'''
    else:
        art = '''<path d="M160 34c54 0 98 44 98 98s-44 98-98 98-98-44-98-98 44-98 98-98z" fill="#ece8f1" stroke="#817092" stroke-width="2"/><ellipse cx="160" cy="132" rx="112" ry="47" transform="rotate(-26 160 132)" stroke="#8a769b" stroke-width="2" opacity=".7"/><ellipse cx="160" cy="132" rx="101" ry="39" transform="rotate(36 160 132)" stroke="#aa8d6b" stroke-width="2" opacity=".66"/>
        <path d="M85 104l62-36 66 35-54 78z" stroke="#718a91" stroke-width="4"/><path d="M85 104l74 77 54-78m-66-35 12 113" stroke="#9a829b" stroke-width="2" opacity=".8"/>
        <circle cx="85" cy="104" r="20" fill="#e7b781" stroke="#9b6d52" stroke-width="2"/><circle cx="147" cy="68" r="25" fill="#8baeb1" stroke="#607f86" stroke-width="2"/><circle cx="213" cy="103" r="19" fill="#c7a6c7" stroke="#826d8c" stroke-width="2"/><circle cx="159" cy="181" r="21" fill="#d9c783" stroke="#99844d" stroke-width="2"/>
        <circle cx="78" cy="97" r="6" fill="#f8e7c9"/><circle cx="139" cy="59" r="7" fill="#d9ebeb"/><circle cx="206" cy="96" r="6" fill="#f2dfef"/><circle cx="152" cy="173" r="6" fill="#f6edc5"/>
        <g fill="#827294"><circle cx="268" cy="69" r="3"/><circle cx="52" cy="194" r="3"/><circle cx="252" cy="213" r="3"/></g>'''
    return f'<svg {common}>{art}</svg>'


def home_art(slug: str, current: Path, alt: str = "") -> str:
    """Use subject-specific semi-flat editorial science illustrations."""
    return home_illustration(slug).replace("<svg ", '<svg class="home-art-image subject-art-svg" ', 1)


def nobel_art() -> str:
    """A minimal, original medal illustration paired with three science symbols."""
    return '''<svg class="nobel-feature-image nobel-art" viewBox="0 0 800 500" role="img" aria-label="诺贝尔奖章与科学主题的极简插画 / Minimal illustration of a science prize medal">
      <rect width="800" height="500" rx="10" fill="#f3f0e7"/>
      <path d="M146 132C112 169 107 239 145 282M163 123C129 168 130 237 163 274M654 132C688 169 693 239 655 282M637 123C671 168 670 237 637 274" fill="none" stroke="#9b8554" stroke-width="2" stroke-linecap="round"/>
      <path d="M145 281l-17 8m34-15-15 13m-3-72-19-5m21-23-17-12m35-29-13-17m494 152 17 8m-34-15 15 13m3-72 19-5m-21-23 17-12m-35-29 13-17" stroke="#9b8554" stroke-width="2" stroke-linecap="round"/>
      <path d="M400 61l-12 25h24z" fill="#bc9d5b"/><path d="M400 86v28" stroke="#bc9d5b" stroke-width="5"/>
      <circle cx="400" cy="231" r="122" fill="#e0c987" stroke="#a98d50" stroke-width="3"/><circle cx="400" cy="231" r="108" fill="none" stroke="#f8efd0" stroke-width="2"/>
      <path d="M428 150c-23 0-43 20-43 45 0 12 5 22 13 30-20 10-35 28-42 51h91c-4-19-15-34-32-44 16-9 27-27 27-46 0-20-5-36-14-46z" fill="#8d7545" opacity=".9"/>
      <path d="M330 339h140l31 66H299z" fill="#d6c182" stroke="#a98d50" stroke-width="2"/><path d="M349 341h102" stroke="#fbf6e7" stroke-width="3"/>
      <g fill="none" stroke="#6e8e91" stroke-width="2"><circle cx="191" cy="383" r="24"/><path d="M191 371v24m-12-12h24"/><path d="M578 384l17-20 17 20-17 20z"/><circle cx="597" cy="384" r="3" fill="#6e8e91"/></g>
      <g fill="#718b81"><circle cx="207" cy="103" r="5"/><circle cx="595" cy="104" r="5"/><circle cx="260" cy="427" r="4"/><circle cx="543" cy="427" r="4"/></g>
      <path d="M208 383h53m279 0h39" stroke="#b7b0a0" stroke-width="1.5" stroke-dasharray="4 7"/>
    </svg>'''


def screenshot_preview(current: Path, image_path: str | None, title_zh: str, title_en: str) -> str:
    """Render a supplied static screenshot; never embed a live lesson as a preview."""
    if not image_path:
        return ""
    return (
        f'<span class="screenshot-preview"><img src="{link(current, image_path)}" '
        f'alt="{e(title_zh)}演示截图 / Screenshot of {e(title_en)}" loading="lazy"></span>'
    )


def header(current: Path, active: str | None = None) -> str:
    nav = []
    for subject in CATALOG["subjects"]:
        attr = ' aria-current="page"' if subject["slug"] == active else ""
        subject_href = link(current, subject_route(subject["slug"]))
        nav.append(f'<a href="{subject_href}"{attr}>{tr(subject["name"], subject["english"])}</a>')
    nav.append(f'<a href="{link(current, "updates/index.html")}">{tr("更新日志", "Changelog")}</a>')
    return f'''<a class="skip" href="#main">{tr("跳到主要内容", "Skip to main content")}</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="{link(current, 'index.html')}" {aria("牛顿科学探索馆首页", "Newton Science Discovery Center home")}><img class="brand-mark" src="{link(current, 'assets/newton-mark.svg')}" width="42" height="42" alt=""><span>{tr(CATALOG["title"], CATALOG["title_en"])}{tr("让学生爱上科学", "INSPIRE A LOVE OF SCIENCE", tag="small")}</span></a>
  <div class="header-actions"><nav class="site-nav" {aria("主导航", "Main navigation")}>{''.join(nav)}</nav>
  <a class="header-total" href="{link(current, 'index.html')}#fields-title" {aria(f"查看 {INTERACTIVE_COUNT} 个互动学习内容", f"Explore {INTERACTIVE_COUNT} interactive learning modules")}><strong>{INTERACTIVE_COUNT}</strong><span>{tr("个互动学习内容", "interactive learning modules")}<small>LEARN · EXPLORE</small></span></a>
  <button class="language-switch" id="language-switch" type="button" aria-label="切换为英文" aria-pressed="false"><span class="language-option language-option-zh" lang="zh-CN">中</span><span class="language-divider" aria-hidden="true">/</span><span class="language-option language-option-en" lang="en">EN</span></button></div>
</div></header>'''


def footer(current: Path) -> str:
    contact = f'''<section class="footer-contact" aria-labelledby="contact-title"><div class="footer-contact-copy"><span class="eyebrow">STAY IN TOUCH</span>{tr("联系我", "Contact me", "h2", 'id="contact-title"')}{tr("欢迎通过微信联系，或访问我的个人网站和公开项目。", "Reach me on WeChat, visit my personal website, or explore the public project.", "p")}<div class="contact-links"><a class="contact-site-link" href="https://mrbigtree.cn/" target="_blank" rel="noopener noreferrer">{tr("个人网站", "Personal website")} <span>mrbigtree.cn ↗</span></a><a class="contact-site-link" href="https://github.com/Donne-shi/middle-school-science-3d" target="_blank" rel="noopener noreferrer">{tr("公开 GitHub 仓库", "Public GitHub repository")} <span>Donne-shi / middle-school-science-3d ↗</span></a></div></div><div class="footer-contact-methods"><figure class="contact-qr"><img src="{link(current, 'assets/contact-wechat.jpg')}" width="671" height="689" loading="lazy" alt="个人微信二维码 / Personal WeChat QR code"><figcaption>{tr("个人微信", "Personal WeChat")}</figcaption></figure><figure class="contact-qr"><img src="{link(current, 'assets/contact-official-account.jpg')}" width="430" height="430" loading="lazy" alt="微信公众号二维码 / Official WeChat account QR code"><figcaption>{tr("微信公众号", "Official WeChat account")}</figcaption></figure></div></section>'''
    return f'<footer class="site-footer"><div class="container">{contact}<div class="footer-inner">{tr(CATALOG["title"], CATALOG["title_en"])}{tr("让学生爱上科学", "Inspire a love of science")}{tr("演示图像与比例以各页面说明为准", "Visual scale and proportions are explained in each lesson")}</div></div></footer>'


def page(current: Path, title_zh: str, title_en: str, body: str, active: str | None = None, accent: str = "#197a91", home_page: bool = False) -> None:
    current.parent.mkdir(parents=True, exist_ok=True)
    document = f'''<!doctype html>
<html lang="zh-CN" data-title-zh="{e(title_zh)}" data-title-en="{e(title_en)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#f6f9f8"><meta name="description" content="牛顿科学探索馆：通过交互演示观察科学现象。" data-zh="牛顿科学探索馆：通过交互演示观察科学现象。" data-en="Newton Science Discovery Center: explore science through interactive lessons.">
<title>{e(title_zh)} · {e(CATALOG["title"])}</title>
<link rel="icon" type="image/svg+xml" href="{link(current, 'assets/newton-mark.svg')}">
<link rel="stylesheet" href="{link(current, 'assets/site.css')}?v={CSS_VERSION}"><style>:root {{--accent:{e(accent)}}}</style>
</head><body{' class="home-page"' if home_page else ''}>{header(current, active)}<main id="main">{body}</main>{footer(current)}<script src="{link(current, 'assets/site.js')}" defer></script></body></html>
'''
    current.write_text(document, encoding="utf-8")


def home() -> None:
    current = SITE / "index.html"
    cards = []
    board = []
    introductions = {
        "astronomy": ("从太阳系进入，再探索宇宙现象、恒星与星空、月相与食，以及人类登月。十一个独立演示已经开放。", "Begin with the Solar System, then explore cosmic phenomena, stars, the night sky, Moon phases and eclipses, and the human Moon landing. Eleven standalone lessons are open."),
        "physics": ("驾驶 3D 汽车观察受力与运动，再用简单机械和电磁实验调节参数，看看规律怎样改变。", "Use a 3D car to explore forces and motion, then adjust simple machines and electricity experiments to see the rules in action."),
        "biology": ("从细胞与人体系统观察生命结构，再沿着线粒体和叶绿体理解呼吸作用与光合作用。", "Explore life through cells and organ systems, then follow respiration and photosynthesis in mitochondria and chloroplasts."),
        "chemistry": ("从早期原子观念走向新的模型，观察证据如何改变人们对原子结构的解释。", "Trace changing models of the atom and see how new evidence reshaped explanations of its structure."),
    }
    card_axes = {
        "astronomy": ("轨道与尺度", "ORBIT & SCALE"),
        "physics": ("力与能量", "FORCE & ENERGY"),
        "biology": ("生命的结构", "LIVING STRUCTURES"),
        "chemistry": ("物质的内部", "INSIDE MATTER"),
    }
    for subject in CATALOG["subjects"]:
        slug = subject["slug"]
        subject_href = link(current, subject_route(slug))
        summary_zh, summary_en = introductions[slug]
        axis_zh, axis_en = card_axes[slug]
        topics = ' / '.join(topic["name"] for topic in subject["topics"])
        topics_en = ' / '.join(topic["english"] for topic in subject["topics"])
        cards.append(f'''<a class="subject-card" style="--accent:{e(subject["accent"])}" href="{subject_href}">
  <div class="subject-card-copy">{tr(axis_zh, axis_en, attrs='class="subject-no"')}{tr(subject["name"], subject["english"], "h3")}{tr(summary_zh, summary_en, "p")}{tr(topics, topics_en, attrs='class="subject-topics"')}<span class="card-bottom">{tr(subject["status"], subject["status_en"])} <span aria-hidden="true">↗</span></span></div>
  {home_art(slug, current)}</a>''')
        board.append(f'''<div class="board-panel board-{e(slug)}" style="--tile-accent:{e(subject["accent"])}">{home_art(slug, current)}{tr(subject["name"], subject["english"], attrs='class="board-panel-label"')}</div>''')
    body = f'''<div class="container"><section class="home-hero" aria-labelledby="home-title"><div class="home-hero-copy">
  <span class="eyebrow eyebrow-line">NEWTON SCIENCE DISCOVERY CENTER</span>
  <h1 class="serif" id="home-title">{tr("把科学，", "Bring science")}<br>{tr("放到眼前。", "into view.", "em")}</h1>
  {tr("那些难以亲眼看到的过程，可以先在这里动手观察：行星怎样排布，力怎样改变运动，细胞怎样工作，原子模型又怎样随证据更新。", "Begin with what is hard to see in person: the arrangement of planets, how forces change motion, how cells work, and how evidence changes models of the atom.", "p", 'class="hero-lead"')}
  {tr("选择一个学科，就能直接看到已开放的演示。你可以旋转模型、调节参数、对照中英文说明；新内容会逐步补充。", "Choose a subject to see its available lessons right away. Rotate models, adjust parameters, and compare Chinese and English explanations; new lessons will be added over time.", "p", 'class="hero-detail"')}
  <div class="hero-actions"><a class="primary-link" href="#fields-title">{tr("选择学科", "Choose a subject")} <span aria-hidden="true">↗</span></a></div>
  </div><div class="discovery-board" role="img" {aria("四个学科的科学观察图板", "A science observation board for four subjects")}><span class="board-kicker">OBSERVE / EXPERIMENT / UNDERSTAND</span><div class="board-grid">{''.join(board)}</div><img class="board-seal" src="{link(current, 'assets/newton-mark.svg')}" width="76" height="76" alt=""></div></section>
  <section class="home-fields" aria-labelledby="fields-title"><div class="section-heading"><div><span class="eyebrow">FOUR SUBJECTS</span>{tr("选择一个学科，开始探索", "Choose a subject to explore", "h2", 'id="fields-title"')}</div>{tr("四个入口都能单独打开。进入学科后，可直接选择已开放的演示。", "Each subject has its own address. Open one to choose from its available lessons.", "p")}</div><div class="subject-grid">{''.join(cards)}</div></section>
  <section class="nobel-feature" aria-labelledby="nobel-title">{nobel_art()}<div class="nobel-feature-copy"><span class="eyebrow">CROSS-DISCIPLINARY / 2026</span>{tr("2026 诺贝尔奖：三项发现，三种观察世界的方式", "2026 Nobel Prizes: three discoveries, three ways to see the world", "h2", 'id="nobel-title"')}{tr("从光控制神经元，到手性分子的自我放大，再到南极冰中的宇宙中微子。切换医学、化学与物理学奖，操作互动模型，循着获奖发现理解背后的科学问题。", "From light-controlled neurons to self-amplifying molecular chirality and cosmic neutrinos detected in Antarctic ice. Switch between the medicine, chemistry, and physics prizes, explore interactive models, and follow the questions behind the discoveries.", "p")}<a href="{link(current, lesson_route('nobel-2026'))}" class="nobel-feature-link">{tr("进入诺贝尔互动实验室", "Explore the Nobel interactive lab")} <span aria-hidden="true">↗</span></a><span class="nobel-feature-meta">PHYSIOLOGY OR MEDICINE · CHEMISTRY · PHYSICS</span></div></section>
  <aside class="home-disclosure" aria-label="图像与资料说明">{tr("本馆部分演示图像由 AI 生成或辅助制作，主要用于教学可视化；局部形态和比例可能不精确。相关科学概念与关键数据已进行资料核对，具体简化范围和引用来源请查看各演示页面。", "Some lesson visuals are AI-generated or AI-assisted teaching aids; details and proportions may not be exact. Related scientific concepts and key data have been checked against sources. See each lesson for its simplifications and references.", "p")}</aside></div>'''
    page(current, "首页", "Home", body, home_page=True)


def subject_page(subject: dict) -> None:
    slug = subject["slug"]
    current = SITE / "subjects" / slug / "index.html"
    crumb = f'''<nav class="breadcrumb" {aria("当前位置", "Breadcrumb")}><a href="{link(current, 'index.html')}">{tr(CATALOG["title"], CATALOG["title_en"])}</a><span>/</span>{tr(subject["name"], subject["english"], "strong")}</nav>'''
    hero = f'''<section class="subject-hero"><div><span class="eyebrow eyebrow-line">FIELD / {e(subject["english"])}</span>{tr(subject["name"], subject["english"], "h1")}<span class="english">{e(subject["english"])}</span>{tr(subject["description"], subject["description_en"], "p")}</div><div class="subject-art">{motif(slug)}</div></section>'''
    lessons = [lesson for topic in subject["topics"] for lesson in topic["lessons"] if lesson.get("published", False)]
    if lessons:
        cards = []
        for index, lesson in enumerate(lessons, start=1):
            href = link(current, lesson_route(lesson["slug"]))
            preview = screenshot_preview(current, lesson.get("screenshot"), lesson["name"], lesson["english"])
            cards.append(f'''<a class="lesson-card" href="{href}">{preview}<span class="eyebrow">LESSON / {index:02d}</span>{tr(lesson["name"], lesson["english"], "h3")}<span class="english">{e(lesson["english"])}</span>{tr(lesson["description"], lesson["description_en"], "p")}{tr(lesson["interaction"], lesson["interaction_en"], attrs='class="mode"')}<span class="card-go" style="display:flex;margin-top:20px">{tr("直接进入演示", "Open lesson now")} <span class="arrow" aria-hidden="true">→</span></span></a>''')
        content = f'''<section aria-labelledby="lesson-title"><div class="section-heading"><div><span class="eyebrow">AVAILABLE LESSONS / {len(lessons):02d}</span>{tr("选择一个演示，开始探索", "Choose a lesson to explore", "h2", 'id="lesson-title"')}</div>{tr("点击卡片即可直接打开演示。", "Select a card to open the lesson directly.", "p")}</div><div class="lesson-grid">{''.join(cards)}</div></section>'''
    else:
        content = f'''<section class="empty-state" aria-labelledby="empty-title">{tr("内容筹备中", "Coming soon", attrs='class="status-pill"')}{tr(subject["name"] + "的演示正在制作", subject["english"] + " lessons are in development", "h2", 'id="empty-title"')}{tr("这里将汇集可独立打开的主题和 3D 演示。内容完成并核对后，会逐步加入本学科目录。", "This subject will feature topics and 3D lessons that open independently. They will appear here as each lesson is completed and reviewed.", "p")}<a class="text-link" href="{link(current, 'index.html')}">{tr("返回四学科入口", "Back to all subjects")} <span class="arrow" aria-hidden="true">→</span></a></section>'''
    page(current, subject["name"], subject["english"], f'<div class="container">{crumb}{hero}{content}</div>', slug, subject["accent"])


def topic_page(subject: dict, topic: dict) -> None:
    slug = subject["slug"]
    current = SITE / "topics" / slug / topic["slug"] / "index.html"
    subject_href = link(current, subject_route(slug))
    crumb = f'''<nav class="breadcrumb" {aria("当前位置", "Breadcrumb")}><a href="{link(current, 'index.html')}">{tr(CATALOG["title"], CATALOG["title_en"])}</a><span>/</span><a href="{subject_href}">{tr(subject["name"], subject["english"])}</a><span>/</span>{tr(topic["name"], topic["english"], "strong")}</nav>'''
    visual_zh, visual_en = {
        "astronomy": ("一颗恒星 · 八颗行星", "ONE STAR · EIGHT PLANETS"),
        "physics": ("一辆车 · 三条定律", "ONE CAR · THREE LAWS"),
        "biology": ("从细胞结构到微生物", "CELLS · BACTERIA · MICROORGANISMS"),
        "chemistry": ("十二个模型 · 一条发现之路", "TWELVE VIEWS · ONE STORY OF DISCOVERY"),
    }[slug]
    if slug == "chemistry" and topic["slug"] == "solutions-acids-bases":
        visual_zh, visual_en = "九个场景 · 从溶液到 pH", "9 SCENES · SOLUTIONS TO pH"
    if slug == "chemistry" and topic["slug"] == "periodic-table":
        visual_zh, visual_en = "118 种元素 · 看见周期律", "118 ELEMENTS · EXPLORE PERIODICITY"
    if slug == "physics" and topic["slug"] == "simple-machines":
        visual_zh, visual_en = "六种机械 · 力与距离", "SIX MACHINES · FORCE & DISTANCE"
    if slug == "physics" and topic["slug"] == "electricity-and-magnetism":
        visual_zh, visual_en = "十三个实验 · 电与磁", "13 EXPERIMENTS · ELECTRICITY & MAGNETISM"
    if slug == "chemistry" and topic["slug"] == "solutions-acids-bases":
        guidance_zh, guidance_en = (
            "从溶液开始，观察分散系与溶解度，再探索酸碱、电离、中和和 pH。",
            "Start with solutions, then explore dispersions, solubility, acids and bases, ionization, neutralization, and pH.",
        )
    if slug == "chemistry" and topic["slug"] == "periodic-table":
        guidance_zh, guidance_en = (
            "先按原子序数浏览整张表，再搜索元素、比较性质或切换 3D 视图；每个元素的照片来源可在页面内查看。",
            "Browse by atomic number, search for an element, compare its properties, or switch to 3D. Image source links are available in the lesson.",
        )
    if slug == "biology" and topic["slug"] == "cell-energy":
        visual_zh, visual_en = "两种细胞器 · 两条能量路径", "TWO ORGANELLES · TWO ENERGY PATHWAYS"
    if slug == "biology" and topic["slug"] == "human-systems":
        visual_zh, visual_en = "九大系统 · 观察人体结构", "NINE SYSTEMS · EXPLORE HUMAN ANATOMY"
    astronomy_visuals = {
        "universe": ("从宇宙早期到黑洞", "EARLY UNIVERSE · BLACK HOLES"),
        "stellar-sky": ("恒星与星座", "STARS · CONSTELLATIONS"),
        "moon-exploration": ("从地球走向月球", "EARTH · MOON"),
    }
    if slug == "astronomy" and topic["slug"] in astronomy_visuals:
        visual_zh, visual_en = astronomy_visuals[topic["slug"]]
    intro = f'''<section class="topic-intro"><div><span class="eyebrow eyebrow-line">TOPIC / {e(topic["english"])}</span>{tr(topic["name"], topic["english"], "h1")}{tr(topic["description"], topic["description_en"], "p")}</div><div class="topic-visual topic-visual-{e(slug)}" aria-hidden="true">{tr(visual_zh, visual_en)}</div></section>'''
    cards = []
    for index, lesson in enumerate(topic["lessons"], start=1):
        if LOCAL_PREVIEW or lesson.get("published", False):
            opening = f'<a class="lesson-card" href="{link(current, lesson_route(lesson["slug"]))}">'
            closing = '</a>'
            action = tr("打开演示", "Open lesson") + ' <span class="arrow" aria-hidden="true">→</span>'
        else:
            opening = '<article class="lesson-card lesson-card-pending">'
            closing = '</article>'
            action = tr("演示素材核对后开放", "Available after materials review")
        preview = screenshot_preview(current, lesson.get("screenshot"), lesson["name"], lesson["english"])
        cards.append(f'''{opening}{preview}<span class="eyebrow">EXPLORE / {index:02d}</span>{tr(lesson["name"], lesson["english"], "h3")}<span class="english">{e(lesson["english"])}</span>{tr(lesson["description"], lesson["description_en"], "p")}{tr(lesson["interaction"], lesson["interaction_en"], attrs='class="mode"')}<span class="card-go" style="display:flex;margin-top:28px">{action}</span>{closing}''')
    guidance_zh, guidance_en = {
        "astronomy": ("建议先看行星图鉴，再用太阳系结构理解更远的尺度。", "Start with the planet atlas, then use the Solar System structure lesson to explore greater distances."),
        "physics": ("从受力图开始，依次探索牛顿三大定律。", "Start with force diagrams, then explore Newton's three laws in order."),
        "biology": ("从植物细胞、动物细胞和微生物中选择一个主题，旋转模型并查看结构说明；有显微图像的页面会同时提供来源信息。", "Choose a plant cell, animal cell, or microorganism. Rotate the model and explore its structures; pages with micrographs include image credits."),
        "chemistry": ("从古希腊原子论出发，沿着关键实验观察原子模型如何改变。", "Start with ancient atomism and follow the experiments that changed atomic models."),
    }[slug]
    if slug == "physics" and topic["slug"] == "simple-machines":
        guidance_zh, guidance_en = (
            "选择一种机械，调节参数，比较力与距离如何变化。",
            "Choose a machine, adjust its parameters, and compare changes in force and distance.",
        )
    if slug == "physics" and topic["slug"] == "electricity-and-magnetism":
        guidance_zh, guidance_en = (
            "从静电开始，逐章观察磁场、电路和电磁感应；调节参数后比较结果。",
            "Start with static electricity, then explore magnetic fields, circuits, and induction. Adjust parameters and compare results.",
        )
    if slug == "biology" and topic["slug"] == "cell-energy":
        guidance_zh, guidance_en = (
            "先观察两种细胞器，再沿着呼吸与光合的步骤追踪物质和能量。",
            "Explore both organelles, then follow matter and energy through respiration and photosynthesis.",
        )
    if slug == "biology" and topic["slug"] == "human-systems":
        guidance_zh, guidance_en = (
            "选择身体系统，旋转和剖切模型，再点选器官查看中英文资料。",
            "Choose a body system, rotate or clip the model, then select organs for bilingual notes.",
        )
    astronomy_guidance = {
        "solar-system": ("从行星图鉴观察天体，再用太阳系结构理解尺度，并体验地火转移与天王星下降。", "Explore the planets, compare Solar System scales, then follow an Earth-to-Mars transfer and a descent through Uranus."),
        "universe": ("沿着宇宙早期的时间线观察，再探索黑洞、暗物质与暗能量。", "Follow the early-universe timeline, then explore black holes, dark matter, and dark energy."),
        "stellar-sky": ("比较恒星的性质，再回到夜空辨认星座。", "Compare star properties, then return to the night sky to identify constellations."),
        "moon-exploration": ("先观察月相与日月食的几何关系，再沿阿波罗 11 号任务探索月面。", "Explore lunar phases and eclipse geometry, then follow Apollo 11 to the lunar surface."),
    }
    if slug == "astronomy":
        guidance_zh, guidance_en = astronomy_guidance[topic["slug"]]
    section = f'''<section aria-labelledby="lesson-title"><div class="section-heading"><div><span class="eyebrow">INTERACTIVE LESSONS</span>{tr("选择一个演示", "Choose a lesson", "h2", 'id="lesson-title"')}</div>{tr(guidance_zh, guidance_en, "p")}</div><div class="lesson-grid">{''.join(cards)}</div></section>'''
    note_zh, note_en = {
        "astronomy": ("天体尺寸、距离和时间如经过视觉调整，以各演示页的标注为准。", "Visual scales for size, distance, and time are explained in each lesson."),
        "physics": ("三维模型、力箭头和场景为教学示意；数值及简化条件见各演示说明。", "The 3D models, force arrows, and scenes are teaching illustrations; see each lesson for values and assumptions."),
        "biology": ("三维形态经过教学简化，不按统一比例；示意图片与显微照片的性质和来源见各演示说明。", "The 3D models are simplified and not shown at a common scale; see each lesson for image type and provenance."),
        "chemistry": ("历史模型体现提出时的认识，轨道图像为教学示意；比例不代表真实原子。", "Historical models reflect ideas of their time; orbital views are teaching illustrations, not literal scale models."),
    }[slug]
    note = '<div class="context-bar">' + tr("适合课堂展示与自主探索", "For classroom and independent exploration") + tr(note_zh, note_en) + '</div>'
    page(current, topic["name"], topic["english"], f'<div class="container">{crumb}{intro}{note}{section}</div>', slug, subject["accent"])


def updates_page() -> None:
    current = SITE / "updates" / "index.html"
    items = []
    for update in UPDATES["entries"]:
        details = "".join(
            f'<a class="update-link" href="{link(current, target["href"])}">{tr(target["label"], target["label_en"])} <span aria-hidden="true">↗</span></a>'
            for target in update.get("links", [])
        )
        items.append(f'''<li class="update-entry"><div class="update-date"><time datetime="{e(update['date'])}">{tr(update['date'], update['date_en'])}</time><span>{tr(update['category'], update['category_en'])}</span></div><div class="update-copy"><span class="eyebrow">{e(update['discipline'])} / {e(update['discipline_en'])}</span><h2>{tr(update['title'], update['title_en'])}</h2><p>{tr(update['summary'], update['summary_en'])}</p><div class="update-links">{details}</div></div></li>''')
    body = f'''<div class="container"><section class="updates-hero"><span class="eyebrow eyebrow-line">RELEASE NOTES / NEWTON SCIENCE DISCOVERY CENTER</span>{tr("更新日志", "Changelog", "h1")}{tr("记录新开放的科学演示、专题扩展与重要改进。", "A record of new science lessons, topic additions, and notable improvements.", "p")}</section><section class="updates-section" aria-labelledby="updates-title"><div class="section-heading"><div><span class="eyebrow">LATEST UPDATES</span>{tr("最近更新", "Recent updates", "h2", 'id="updates-title"')}</div>{tr("持续补充中 · 按日期从新到旧排列", "Updated as the museum grows · newest first", "p")}</div><ol class="update-list">{''.join(items)}</ol></section></div>'''
    page(current, "更新日志", "Changelog", body, accent="#197a91")


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
    shutil.copyfile(ROOT / "web/assets/newton-mark.svg", SITE / "assets/newton-mark.svg")
    shutil.copyfile(ROOT / "web/favicon.ico", SITE / "favicon.ico")
    shutil.copyfile(ROOT / "content/images/contact-wechat.jpg", SITE / "assets/contact-wechat.jpg")
    shutil.copyfile(ROOT / "content/images/contact-official-account.jpg", SITE / "assets/contact-official-account.jpg")
    # Copy every catalog screenshot declared under assets/ from the source image
    # folder. This keeps new lesson previews in sync with the catalog without
    # needing another hard-coded copy entry for each screenshot.
    screenshot_paths = set()
    for subject in CATALOG["subjects"]:
        for topic in subject["topics"]:
            for item in (topic, *topic["lessons"]):
                image_path = item.get("screenshot", "")
                if image_path.startswith("assets/"):
                    screenshot_paths.add(image_path)
    for image_path in sorted(screenshot_paths):
        source = ROOT / "content/images" / Path(image_path).name
        if not source.is_file():
            raise FileNotFoundError(f"Catalog screenshot source missing: {source}")
        destination = SITE / image_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)
    shutil.copytree(ROOT / "content/demos/nobel-2026", SITE / "demos/nobel-2026", dirs_exist_ok=True)
    home()
    updates_page()
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
    for subject in CATALOG["subjects"]:
        subject_slug = subject["slug"]
        route_alias(subject_slug + "/index.html", "subjects/" + subject_slug + "/index.html", subject["name"])
        for topic in subject["topics"]:
            topic_slug = topic["slug"]
            route_alias(subject_slug + "/" + topic_slug + "/index.html", "topics/" + subject_slug + "/" + topic_slug + "/index.html", topic["name"])
            for lesson in topic["lessons"]:
                if lesson.get("published", False):
                    target = lesson["href"]
                    if not (SITE / target).exists():
                        raise FileNotFoundError(f"Short URL target missing: {SITE / target}")
                    route_alias("labs/" + lesson["slug"] + "/index.html", target, lesson["name"])
    route_alias("labs/nobel-2026/index.html", "demos/nobel-2026/index.html", "诺贝尔奖互动实验室")
    print(f"Built four-subject entry and subject topics in {SITE.name}/")


if __name__ == "__main__":
    main()
