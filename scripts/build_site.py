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
  <a class="brand" href="{link(current, 'index.html')}" {aria("牛顿科学探索馆首页", "Newton Science Discovery Center home")}><img class="brand-mark" src="{link(current, 'assets/newton-mark.svg')}" width="42" height="42" alt=""><span>{tr(CATALOG["title"], CATALOG["title_en"])}{tr("观察 · 操作 · 理解", "OBSERVE · EXPERIMENT · UNDERSTAND", tag="small")}</span></a>
  <div class="header-actions"><nav class="site-nav" {aria("学科导航", "Subject navigation")}>{''.join(nav)}</nav>
  <button class="language-switch" id="language-switch" type="button" aria-label="切换为英文" aria-pressed="false"><span class="language-option language-option-zh" lang="zh-CN">中</span><span class="language-divider" aria-hidden="true">/</span><span class="language-option language-option-en" lang="en">EN</span></button></div>
</div></header>'''


def footer() -> str:
    return '<footer class="site-footer"><div class="container footer-inner">' + tr(CATALOG["title"], CATALOG["title_en"]) + tr("观察 · 操作 · 理解", "Observe · Experiment · Understand") + tr("演示图像与比例以各页面说明为准", "Visual scale and proportions are explained in each lesson") + '</div></footer>'


def page(current: Path, title_zh: str, title_en: str, body: str, active: str | None = None, accent: str = "#197a91", home_page: bool = False) -> None:
    current.parent.mkdir(parents=True, exist_ok=True)
    document = f'''<!doctype html>
<html lang="zh-CN" data-title-zh="{e(title_zh)}" data-title-en="{e(title_en)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#f6f9f8"><meta name="description" content="牛顿科学探索馆：通过交互演示观察科学现象。" data-zh="牛顿科学探索馆：通过交互演示观察科学现象。" data-en="Newton Science Discovery Center: explore science through interactive lessons.">
<title>{e(title_zh)} · {e(CATALOG["title"])}</title>
<link rel="icon" type="image/svg+xml" href="{link(current, 'assets/newton-mark.svg')}">
<link rel="stylesheet" href="{link(current, 'assets/site.css')}"><style>:root {{--accent:{e(accent)}}}</style>
</head><body{' class="home-page"' if home_page else ''}>{header(current, active)}<main id="main">{body}</main>{footer()}<script src="{link(current, 'assets/site.js')}" defer></script></body></html>
'''
    current.write_text(document, encoding="utf-8")


def home() -> None:
    current = SITE / "index.html"
    cards = []
    board = []
    introductions = {
        "astronomy": ("从太阳系进入，再探索宇宙现象、恒星与星空，以及人类登月。七个独立演示已经开放。", "Begin with the Solar System, then explore cosmic phenomena, stars, the night sky, and the Moon. Seven standalone lessons are open."),
        "physics": ("驾驶 3D 汽车观察受力与运动，再用简单机械和电磁实验调节参数，看看规律怎样改变。", "Use a 3D car to explore forces and motion, then adjust simple machines and electricity experiments to see the rules in action."),
        "biology": ("比较细胞形态与内部结构，并沿着线粒体和叶绿体认识呼吸作用、光合作用中的能量转化。", "Compare cell forms and structures, then follow energy through respiration and photosynthesis in mitochondria and chloroplasts."),
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
        subject_href = link(current, "subjects/" + slug + "/index.html")
        summary_zh, summary_en = introductions[slug]
        axis_zh, axis_en = card_axes[slug]
        topics = ' / '.join(topic["name"] for topic in subject["topics"])
        topics_en = ' / '.join(topic["english"] for topic in subject["topics"])
        cards.append(f'''<a class="subject-card" style="--accent:{e(subject["accent"])}" href="{subject_href}">
  <div>{tr(axis_zh, axis_en, attrs='class="subject-no"')}{tr(subject["name"], subject["english"], "h3")}{tr(summary_zh, summary_en, "p")}{tr(topics, topics_en, attrs='class="subject-topics"')}<span class="card-bottom">{tr(subject["status"], subject["status_en"])} <span aria-hidden="true">↗</span></span></div>
  {motif(slug)}</a>''')
        board.append(f'''<div class="board-panel board-{e(slug)}" style="--tile-accent:{e(subject["accent"])}">{tr(subject["name"], subject["english"], attrs='class="board-panel-label"')}{motif(slug)}</div>''')
    body = f'''<div class="container"><section class="home-hero" aria-labelledby="home-title"><div class="home-hero-copy">
  <span class="eyebrow eyebrow-line">NEWTON SCIENCE DISCOVERY CENTER</span>
  <h1 class="serif" id="home-title">{tr("把科学，", "Bring science")}<br>{tr("放到眼前。", "into view.", "em")}</h1>
  {tr("那些难以亲眼看到的过程，可以先在这里动手观察：行星怎样排布，力怎样改变运动，细胞怎样工作，原子模型又怎样随证据更新。", "Begin with what is hard to see in person: the arrangement of planets, how forces change motion, how cells work, and how evidence changes models of the atom.", "p", 'class="hero-lead"')}
  {tr("选择学科，再进入专题与独立演示。你可以在支持交互的页面中旋转模型、调节参数、对照中英文说明；尚在制作的内容会清楚标注，并逐步补充。", "Choose a subject, then open a topic and its standalone lesson. Where interaction is available, rotate models, adjust parameters, and compare Chinese and English explanations. Lessons still in progress are clearly marked.", "p", 'class="hero-detail"')}
  <div class="hero-actions"><a class="primary-link" href="#fields-title">{tr("选择学科", "Choose a subject")} <span aria-hidden="true">↗</span></a><a class="text-link" href="#how-title">{tr("了解如何探索", "How to explore")} <span class="arrow" aria-hidden="true">→</span></a></div>
  </div><div class="discovery-board" role="img" {aria("四个学科的科学观察图板", "A science observation board for four subjects")}><span class="board-kicker">OBSERVE / EXPERIMENT / UNDERSTAND</span><div class="board-grid">{''.join(board)}</div><img class="board-seal" src="{link(current, 'assets/newton-mark.svg')}" width="76" height="76" alt=""></div></section>
  <section class="home-fields" aria-labelledby="fields-title"><div class="section-heading"><div><span class="eyebrow">FOUR SUBJECTS</span>{tr("选择一个学科，开始探索", "Choose a subject to explore", "h2", 'id="fields-title"')}</div>{tr("四个入口都能单独打开。每个专题会告诉你已开放的演示和仍在制作的内容。", "Each subject has its own address. Its topics show which lessons are ready and which are still in progress.", "p")}</div><div class="subject-grid">{''.join(cards)}</div></section>
  <section class="nobel-feature" aria-labelledby="nobel-title"><div class="nobel-feature-mark" aria-hidden="true">N°26</div><div class="nobel-feature-copy"><span class="eyebrow">CROSS-DISCIPLINARY / 2026</span>{tr("2026 诺贝尔奖：三项发现，三种观察世界的方式", "2026 Nobel Prizes: three discoveries, three ways to see the world", "h2", 'id="nobel-title"')}{tr("从光控制神经元，到手性分子的自我放大，再到南极冰中的宇宙中微子。切换医学、化学与物理学奖，操作互动模型，循着获奖发现理解背后的科学问题。", "From light-controlled neurons to self-amplifying molecular chirality and cosmic neutrinos detected in Antarctic ice. Switch between the medicine, chemistry, and physics prizes, explore interactive models, and follow the questions behind the discoveries.", "p")}<a href="{link(current, 'demos/nobel-2026/index.html')}" class="nobel-feature-link">{tr("进入诺贝尔互动实验室", "Explore the Nobel interactive lab")} <span aria-hidden="true">↗</span></a><span class="nobel-feature-meta">PHYSIOLOGY OR MEDICINE · CHEMISTRY · PHYSICS</span></div></section>
  <section class="home-guide" aria-labelledby="how-title"><div class="guide-heading"><span class="eyebrow">HOW TO EXPLORE</span>{tr("一节科学课，可以这样开始", "A simple way to begin", "h2", 'id="how-title"')}{tr("先提出问题，再动手观察，最后回到原理。", "Start with a question, observe it in action, then return to the explanation.", "p")}</div><ol class="guide-steps"><li><span>01</span>{tr("进入一个专题", "Open a topic", "h3")}{tr("按天文学、物理学、生物学或化学找到感兴趣的内容；专题页会列出可打开的演示。", "Pick astronomy, physics, biology, or chemistry. Each topic page lists its available lessons.", "p")}</li><li><span>02</span>{tr("改变一个条件", "Change one condition", "h3")}{tr("在互动演示中旋转视角、切换状态或调整参数，留意画面、标注与数值怎样一起变化。", "Rotate the view, switch states, or adjust a parameter. Watch how the scene, labels, and values change together.", "p")}</li><li><span>03</span>{tr("用解释检验观察", "Check the explanation", "h3")}{tr("对照文字、示意图与公式，想一想这个模型解释了什么，以及哪些比例和细节经过了简化。", "Compare the notes, diagrams, and formulas. Ask what the model explains and which scales or details have been simplified.", "p")}</li></ol><div class="guide-note">{tr("关于科学图像", "About the visuals", "strong")}{tr("这里的模型用于课堂观察与讨论。天体距离、细胞大小等比例可能为教学而调整；准确范围与素材说明请查看各演示页。", "These models support classroom observation and discussion. Distances, cell sizes, and other scales may be adjusted for teaching; check each lesson for its limits and image credits.", "p")}</div></section></div>'''
    page(current, "首页", "Home", body, home_page=True)


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
    if slug == "physics" and topic["slug"] == "simple-machines":
        visual_zh, visual_en = "六种机械 · 力与距离", "SIX MACHINES · FORCE & DISTANCE"
    if slug == "physics" and topic["slug"] == "electricity-and-magnetism":
        visual_zh, visual_en = "十三个实验 · 电与磁", "13 EXPERIMENTS · ELECTRICITY & MAGNETISM"
    if slug == "biology" and topic["slug"] == "cell-energy":
        visual_zh, visual_en = "两种细胞器 · 两条能量路径", "TWO ORGANELLES · TWO ENERGY PATHWAYS"
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
    astronomy_guidance = {
        "solar-system": ("先观察太阳系结构，再体验天王星下降；行星图鉴与地火转移的贴图待核对。", "Start with Solar System structure and the Uranus descent. Image credits for the planet atlas and Mars transfer are under review."),
        "universe": ("沿着宇宙早期的时间线观察，再探索黑洞附近的示意场景。", "Follow the early-universe timeline, then explore a visual model near a black hole."),
        "stellar-sky": ("比较恒星的性质，再回到夜空辨认星座。", "Compare star properties, then return to the night sky to identify constellations."),
        "moon-exploration": ("沿阿波罗 11 号的任务过程，观察登月环境。", "Follow the Apollo 11 mission and explore the lunar surface."),
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
    shutil.copytree(ROOT / "content/demos/nobel-2026", SITE / "demos/nobel-2026", dirs_exist_ok=True)
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
