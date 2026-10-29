/* =============================================================================
   疫苗与抗生素 · 应用层
   app.js — 章节路由 / 控制台 / 信息卡 / 播放 / 双语
   ========================================================================== */
(function () {
  "use strict";

  var C = window.CONTENT;
  var E = window.ENGINE;
  var S = window.STAGES;

  var CH = C.chapters;
  var TOTAL = CH.length;

  var state = {
    idx: -1,
    step: 0,
    lang: "zh",
    playing: true,
    progress: 0,
    stage: null,
    onStats: null,
    segValue: {},
    bench: {},
    quiet: false,
    done: {}
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function L(o) {
    if (o == null) return "";
    if (typeof o === "string") return o;
    return state.lang === "zh" ? (o.zh || o.en || "") : (o.en || o.zh || "");
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function fmt(s) {
    return String(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* ============================================================ 学习进度 === */
  var KEY = "vac-abx-course-v1";
  var UNITS = C.units;

  function loadDone() {
    var d = {};
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) d = JSON.parse(raw) || {};
    } catch (e) { d = {}; }
    if (!d || typeof d !== "object") d = {};
    return d;
  }
  function saveDone() {
    try { localStorage.setItem(KEY, JSON.stringify(state.done)); } catch (e) {}
  }
  function updateProgress() {
    var n = CH.filter(function (c) { return state.done[c.id]; }).length;
    $("#progText").textContent = n + " / " + TOTAL;
    $("#progFill").style.width = (n / TOTAL * 100) + "%";
  }

  /* ============================================================ 课程目录 === */
  function buildNav() {
    var nav = $("#chapters");
    nav.innerHTML = "";
    var lastU = -1;
    CH.forEach(function (c, i) {
      if (c.unit !== lastU) {
        lastU = c.unit;
        var u = UNITS[c.unit];
        var h = el("div", "unit-h");
        h.innerHTML = "<b>" + u.no + "</b><span>" + L(u.title) + "</span>";
        nav.appendChild(h);
      }
      var b = el("button", "ch" + (state.done[c.id] ? " done" : ""));
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("data-i", i);
      b.innerHTML =
        '<span class="n">' + c.no + "</span>" +
        '<span class="tl"><span class="t">' + L(c.nav) + "</span></span>" +
        '<span class="dot" aria-hidden="true"></span>';
      b.addEventListener("click", function () { go(i); });
      nav.appendChild(b);
    });
    markNav();
  }

  function markNav() {
    $$(".ch").forEach(function (b) {
      var i = parseInt(b.getAttribute("data-i"), 10);
      var on = i === state.idx;
      b.classList.toggle("on", on);
      b.classList.toggle("done", !!state.done[CH[i].id]);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  /* ============================================================ 讲稿面板 === */
  /* 一讲 = 一串步骤：目标 → 讲解 ①…n → 结论 → 动手 → 自测。
     一次只呈现一步，三维场景随步切换。 */
  var STEP_EX = {
    /* targets：① 病毒 → ② 细菌 → ③ 选择性毒性（不再高亮单个结构） */
    targets: [{ sel: "spike" }, { sel: "wall" }, {}],
    /* train：五个讲解步正好对上五个动画阶段 */
    train: [
      { bench: { phase: 0.02 } }, { bench: { phase: 0.24 } },
      { bench: { phase: 0.52 } }, { bench: { phase: 0.70 } },
      { bench: { phase: 0.90 } }
    ],
    /* types：五种平台，讲到哪一种就切到哪一种 */
    types: [
      { bench: { platform: 0 } }, { bench: { platform: 1 } },
      { bench: { platform: 2 } }, { bench: { platform: 3 } },
      { bench: { platform: 4 } }
    ],
    /* memory：潜伏期 → 初次应答 → 二次应答 → 抗体衰减 */
    memory: [
      { bench: { mode: 0, day: 4 } }, { bench: { mode: 0, day: 18 } },
      { bench: { mode: 1, day: 34 } }, { bench: { mode: 1, day: 55 } }
    ],
    /* abx：五个靶点，镜头逐个对过去（走实验台的分段控件，保证两处状态一致） */
    abx: [
      { bench: { target: "wall" } }, { bench: { target: "p30s" } },
      { bench: { target: "p50s" } }, { bench: { target: "dna" } },
      { bench: { target: "membrane" } }
    ],
    /* herd：R₀ → 门槛 → 卡在门槛上 → 明显低于门槛 */
    herd: [
      { bench: { r0: 3 } }, { bench: { r0: 4, cover: 75 } },
      { bench: { cover: 55 } }, { bench: { cover: 35 } }
    ],
    /* resistance：亚致死浓度 → 中等 → 足量 */
    resistance: [
      {}, {}, { bench: { conc: 22 } }, { bench: { conc: 55 } }, { bench: { conc: 92 } }
    ]
  };

  var STEP_CACHE = {};

  function stepsOf(c) {
    if (STEP_CACHE[c.id]) return STEP_CACHE[c.id];
    var out = [{ k: "goal" }];
    (c.explain || []).forEach(function (s, i) { out.push({ k: "ex", s: s, i: i }); });
    out.push({ k: "key" });
    if (c.task) out.push({ k: "task" });
    if (c.check && c.check.length) out.push({ k: "check" });
    STEP_CACHE[c.id] = out;
    return out;
  }

  function paintLesson(c) {
    $("#capNo").textContent = c.no;
    $("#lsTot").textContent = CH[TOTAL - 1].no;
    $("#capUnit").textContent = UNITS[c.unit].no + " · " + L(UNITS[c.unit].title);
    $("#capTitle").innerHTML = L(c.title);
    $("#capSub").textContent = L(c.sub);
    $("#capLede").textContent = L(c.lede);
    paintStep();
  }

  /* ---------------------------------------------------------- 单步渲染 --- */
  function paintStep() {
    var c = CH[state.idx];
    if (!c) return;
    var list = stepsOf(c);
    state.step = clamp(state.step, 0, list.length - 1);
    var st = list[state.step];

    // 步骤轨：一格一步
    var prog = $("#lsProg");
    if (prog.children.length !== list.length) {
      prog.innerHTML = "";
      for (var i = 0; i < list.length; i++) prog.appendChild(el("i"));
    }
    $$("i", prog).forEach(function (n, i) {
      n.className = i < state.step ? "done" : (i === state.step ? "now" : "");
    });

    // 步骤标签
    var kind = $("#stKind");
    var cls = "st-kind";
    var txt = "";
    if (st.k === "goal") {
      cls += " neutral"; txt = L({ zh: "本讲目标", en: "Aim" });
    } else if (st.k === "ex") {
      txt = L({ zh: "讲解", en: "Explain" }) + " " + (st.i + 1) + " / " + (c.explain || []).length;
    } else if (st.k === "key") {
      cls += " abx"; txt = L({ zh: "本讲结论", en: "Takeaway" });
    } else if (st.k === "task") {
      txt = L({ zh: "动手", en: "Practise" });
    } else {
      cls += " neutral"; txt = L({ zh: "自测", en: "Check" });
    }
    kind.className = cls;
    kind.textContent = txt;
    $("#stNow").textContent = state.step + 1;
    $("#stTot").textContent = list.length;

    // 正文
    var box = $("#stBody");
    box.className = "st-body" + ((st.k === "goal" || st.k === "key") ? " mid" : "");
    box.innerHTML = "";
    box.scrollTop = 0;
    if (st.k === "goal") renderGoal(c, box);
    else if (st.k === "ex") renderExStep(c, st, box);
    else if (st.k === "key") renderKey(c, box);
    else if (st.k === "task") renderTask(c, box);
    else renderCheck(c, box);

    paintFoot();
    applyStageStep(c, st);
  }

  function paintFoot() {
    var c = CH[state.idx];
    if (!c) return;
    var list = stepsOf(c);
    var last = state.step >= list.length - 1;
    var done = !!state.done[c.id];
    var b = $("#lsNext");
    var lab = $("#lsNextLabel");
    var zh, en;

    $("#lsPrev").disabled = state.step <= 0;
    b.classList.toggle("finish", last);

    if (!last) { zh = "下一步"; en = "Next"; }
    else if (!done) { zh = "完成本讲"; en = "Finish"; }
    else if (state.idx >= TOTAL - 1) { zh = "已完成全课"; en = "All done"; }
    else { zh = "下一讲"; en = "Next lesson"; }

    lab.setAttribute("data-zh", zh);
    lab.setAttribute("data-en", en);
    lab.textContent = L({ zh: zh, en: en });
    b.disabled = !!(last && done && state.idx >= TOTAL - 1);
  }

  function stepPrev() {
    if (state.step > 0) { state.step--; paintStep(); }
  }

  function stepNext() {
    var c = CH[state.idx];
    var list = stepsOf(c);
    if (state.step < list.length - 1) { state.step++; paintStep(); return; }
    if (!state.done[c.id]) { markLessonDone(true); return; }
    if (state.idx < TOTAL - 1) go(state.idx + 1);
  }

  /* 每一步对三维场景的动作 */
  function applyStageStep(c, st) {
    // 走到新一讲的第一步时把动画停在起点，别让它在阅读时自己跑完
    if (st && st.k === "goal" && state.stage && state.stage.duration) {
      state.playing = false;
      syncTransport();
      setProgress(0);
      return;
    }

    var d = null;
    if (st && st.k === "ex") {
      var arr = STEP_EX[c.id];
      d = arr && arr[st.i];
    }
    if (!d) return;

    if (d.sel) {
      if (state.stage && state.stage.focus) {
        state.quiet = true;
        state.stage.focus(d.sel);
        state.quiet = false;
      } else {
        E.selectMark(d.sel);
      }
    }
    if (d.bench) {
      Object.keys(d.bench).forEach(function (k) {
        var f = state.bench[k];
        if (typeof f === "function") f(d.bench[k]);
      });
    }
  }

  /* 单元导语只在该单元第一讲的第一步出现 */
  function paintUnitLead(c, box) {
    var u = UNITS[c.unit];
    if (!u || u.range[0] !== state.idx) return;
    var d = el("div", "ls-lead");
    d.innerHTML =
      "<b>" + L({ zh: "单元", en: "Unit" }) + " " + u.no + " · " + L(u.title) + "</b>" +
      "<span>" + L(u.note) + "</span>";
    box.appendChild(d);
  }

  function renderGoal(c, box) {
    paintUnitLead(c, box);
    var g = el("div", "ls-goal");
    g.appendChild(el("p", "st-goal-p", fmt(L(c.goal))));
    var ul = el("ul", "ls-obj");
    (c.objectives || []).forEach(function (o) {
      ul.appendChild(el("li", null, fmt(L(o))));
    });
    g.appendChild(ul);
    box.appendChild(g);
  }

  function renderExStep(c, st, box) {
    box.appendChild(el("h3", "st-h", L(st.s.h)));
    var wrap = el("div");
    String(L(st.s.p)).split("\n\n").forEach(function (p) {
      if (p && p.trim()) wrap.appendChild(el("p", "st-p", fmt(p)));
    });
    box.appendChild(wrap);
  }

  function renderKey(c, box) {
    var k = el("div", "ls-key");
    k.appendChild(el("span", "kt", L({ zh: "本讲结论", en: "Takeaway" })));
    k.appendChild(el("p", null, fmt(L(c.key))));
    box.appendChild(k);

    if (c.terms && c.terms.length) {
      box.appendChild(el("div", "ls-sub-h", L({ zh: "关键术语", en: "Key terms" })));
      var wrap = el("div", "terms");
      var dl = el("dl");
      c.terms.forEach(function (x) {
        var row = el("div");
        row.appendChild(el("dt", null, L(x.t)));
        row.appendChild(el("dd", null, L(x.d)));
        dl.appendChild(row);
      });
      wrap.appendChild(dl);
      box.appendChild(wrap);
    }
  }

  function renderTask(c, box) {
    var t = c.task || {};
    box.appendChild(el("h3", "st-h", L(t.name || { zh: "动手", en: "Practise" })));

    var ol = el("ol", "task-steps");
    (t.steps || []).forEach(function (s) { ol.appendChild(el("li", null, fmt(L(s)))); });
    box.appendChild(ol);

    if (t.expect) {
      var e = el("div", "task-expect");
      e.appendChild(el("span", "xt", L({ zh: "预期观察", en: "What you should see" })));
      e.appendChild(el("p", null, fmt(L(t.expect))));
      box.appendChild(e);
    }

    var b = el("div", "task-bench");
    b.innerHTML = fmt(L({
      zh: "在右侧**实验台**完成这几步，然后按「下一步」进入自测。",
      en: "Run these steps on the **bench** at right, then press Next to check yourself."
    }));
    box.appendChild(b);
  }

  function renderCheck(c, box) {
    var qs = c.check || [];
    var nRight = 0;

    box.appendChild(el("p", "check-lead", L({
      zh: "作答后立即给出解析。全部答对，本讲会自动标记为已完成。",
      en: "Every answer is explained at once. Get them all right and the lesson is marked complete."
    })));

    var sc = el("div", "check-score");

    qs.forEach(function (q, qi) {
      var qd = el("div", "q");
      qd.appendChild(el("div", "qh", "<b>Q" + (qi + 1) + "</b>" + L(q.q)));
      var opts = el("div", "opts");
      q.opts.forEach(function (o, oi) {
        var ob = el("button", "opt");
        ob.type = "button";
        ob.textContent = L(o);
        ob.addEventListener("click", function () {
          if (qd.dataset.done) return;
          qd.dataset.done = "1";
          var right = oi === q.a;
          $$(".opt", opts).forEach(function (x, xi) {
            if (xi === q.a) x.classList.add("right");
            else if (xi === oi) x.classList.add("wrong");
          });
          qd.appendChild(el("div", "fb show", (right ? "✓ " : "→ ") + fmt(L(q.fb))));
          if (right) nRight++;
          var b = $("b", sc);
          if (b) b.textContent = nRight + " / " + qs.length;
          sc.classList.toggle("ok", nRight === qs.length);
          if (nRight === qs.length) markLessonDone(true);
        });
        opts.appendChild(ob);
      });
      qd.appendChild(opts);
      box.appendChild(qd);
    });

    sc.innerHTML = "<span>" + L({ zh: "本讲自测", en: "Lesson check" }) +
      "</span><b>0 / " + qs.length + "</b>";
    box.appendChild(sc);
  }

  function markLessonDone(on) {
    var c = CH[state.idx];
    if (!c) return;
    var had = !!state.done[c.id];
    if (on) state.done[c.id] = 1; else delete state.done[c.id];
    saveDone();
    paintFoot();
    markNav();
    updateProgress();
    if (on && !had) {
      var btn = $("#lsNext");
      btn.classList.add("pulse");
      setTimeout(function () { btn.classList.remove("pulse"); }, 950);
    }
  }

  /* ============================================================ 图例 === */
  function paintLegend(c) {
    var lg = $("#legend");
    lg.innerHTML = "";
    (c.legend || []).forEach(function (it) {
      var s = el("span");
      var i = el("i");
      i.style.color = it.c;
      s.appendChild(i);
      s.appendChild(document.createTextNode(L(it.t)));
      lg.appendChild(s);
    });
    lg.style.display = (c.legend && c.legend.length) ? "flex" : "none";
  }

  /* ============================================================ 控件工具 === */
  function makeBlock(title, valueText) {
    var b = el("div", "ctl");
    var h = el("div", "ctl-h");
    h.appendChild(el("span", "t", title));
    var v = null;
    if (valueText != null) {
      v = el("span", "v", valueText);
      h.appendChild(v);
    }
    b.appendChild(h);
    return { root: b, value: v, head: h };
  }

  function makeSeg(items, current, onPick, opts) {
    opts = opts || {};
    var wrap = el("div", "seg" + (opts.col ? " col" : ""));
    items.forEach(function (it, i) {
      var b = el("button", opts.tone === "abx" ? "abx" : "");
      b.type = "button";
      if (opts.col) {
        b.innerHTML = '<span class="k">' + (it.key || String(i + 1).padStart(2, "0")) + "</span>" +
          '<span><span class="n2">' + L(it.t) + "</span>" +
          (it.sub ? '<span class="sub">' + L(it.sub) + "</span>" : "") + "</span>";
      } else {
        b.textContent = L(it.t);
      }
      b.classList.toggle("on", it.v === current);
      b.addEventListener("click", function () {
        $$("button", wrap).forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        onPick(it.v, i);
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function makeRange(min, max, step, value, onInput, cls) {
    var row = el("div", "range-row");
    var r = el("input");
    r.type = "range";
    r.min = min; r.max = max; r.step = step; r.value = value;
    if (cls) r.className = cls;
    var out = el("span", "v" + (cls ? " " + cls : ""));
    out.style.fontFamily = "var(--mono)";
    out.style.fontSize = "10px";
    out.style.minWidth = "36px";
    out.style.textAlign = "right";
    out.style.color = cls === "abx" ? "var(--abx)" : "var(--vac)";
    out.textContent = value;
    r.addEventListener("input", function () {
      var v = parseFloat(r.value);
      var ret = onInput(v);
      out.textContent = (ret != null) ? ret : v;
    });
    row.appendChild(r);
    row.appendChild(out);
    return { root: row, input: r, out: out };
  }

  function makeBtn(label, onClick, cls) {
    var b = el("button", "act" + (cls ? " " + cls : ""));
    b.type = "button";
    b.innerHTML = L(label);
    b.addEventListener("click", function () { onClick(b); });
    return b;
  }

  function makeNote(html) {
    var s = (html && typeof html === "object") ? L(html) : html;
    return el("div", "ctl-note", s);
  }

  function makeReadout(defs) {
    var g = el("div", "readout");
    var map = {};
    defs.forEach(function (d) {
      var box = el("div");
      box.appendChild(el("span", "k", L(d.k)));
      var v = el("span", "v " + (d.cls || ""), "—");
      box.appendChild(v);
      g.appendChild(box);
      map[d.id] = v;
    });
    return { root: g, map: map };
  }

  /* ============================================================ 控制台 === */
  function buildConsole(id) {
    var box = $("#console");
    box.innerHTML = "";
    state.onStats = null;
    state.segValue = {};
    state.bench = {};
    E.emitCard = emitCard;

    var frag = [];

    /* 实验台抬头：与左侧「动手」页签对应 */
    var cur = CH[state.idx];
    if (cur && cur.task) {
      var bh = el("div", "bench-h");
      bh.innerHTML = '<span class="bh-k">' + L({ zh: "实验台", en: "Bench" }) +
        '</span><span class="bh-t">' + L(cur.task.name) + "</span>";
      frag.push(bh);
    }

    if (id === "intro") {
      var b1 = makeBlock("START", null);
      b1.root.appendChild(makeBtn({ zh: "从病原体开始 →", en: "Start with pathogens →" }, function () { go(1); }));
      b1.root.appendChild(makeBtn({ zh: "跳到群体免疫", en: "Jump to herd immunity" }, function () {
        go(7);
      }, "ghost"));
      frag.push(b1.root);
      frag.push(makeNote({
        zh: "本课程共 4 个单元、9 讲。每讲是一条单行线：目标 → 逐步讲解 → 结论 → 动手 → 自测，按「下一步」推进，图和文一起换。拖拽旋转视角，滚轮缩放，点击标记查看结构。",
        en: "Four units, nine lessons. Each is a single track: aim → step-by-step explanation → takeaway → practise → check. Press Next and both the text and the scene move on. Drag to orbit, scroll to zoom, click a marker to inspect."
      }));
    }

    if (id === "targets") {
      var b2 = makeBlock("VIEW", null);
      var anatomy = false;
      var seg = makeSeg([
        { v: 0, t: { zh: "完整", en: "Intact" } },
        { v: 1, t: { zh: "透视解剖", en: "Cutaway" } }
      ], 0, function (v) {
        anatomy = !!v;
        E.onAction && E.onAction("anatomy");
      });
      b2.root.appendChild(seg);
      b2.root.appendChild(makeBtn({ zh: "复位视角", en: "Reset view" }, function () {
        E.onAction && E.onAction("reset");
        E.orbit.ease({ theta: 0, phi: 1.44, radius: 11.4, target: new window.THREE.Vector3(0, 0, 0) });
      }, "ghost"));
      frag.push(b2.root);

      frag.push(makeNote({
        zh: "左：病毒（无细胞结构）。右：细菌（完整细胞）。点击画面上的小圆点，看看抗生素的靶点都长在哪里。",
        en: "Left: a virus — not a cell. Right: a bacterium — a whole cell. Click a marker to see where antibiotics actually strike."
      }));
    }

    if (id === "train") {
      var phases = [
        { v: 0.02, t: { zh: "抗原进入", en: "Antigen enters" } },
        { v: 0.24, t: { zh: "识别", en: "Recognition" } },
        { v: 0.5, t: { zh: "克隆扩增", en: "Clonal expansion" } },
        { v: 0.7, t: { zh: "抗体分泌", en: "Antibody release" } },
        { v: 0.9, t: { zh: "中和与记忆", en: "Neutralisation" } }
      ];
      var b3 = makeBlock("STAGES", null);
      var seg3 = makeSeg(phases, 0.02, function (v) {
        state.playing = false;
        syncTransport();
        setProgress(v);
      }, { col: true });
      b3.root.appendChild(seg3);
      // 讲解步可以驱动动画阶段，同时把分段控件的高亮跟过去
      state.bench.phase = function (v) {
        state.playing = false;
        syncTransport();
        setProgress(v);
        var bs = $$("button", seg3);
        var best = 0;
        bs.forEach(function (b, k) {
          if (Math.abs(phases[k].v - v) < Math.abs(phases[best].v - v)) best = k;
        });
        bs.forEach(function (b, k) { b.classList.toggle("on", k === best); });
      };
      frag.push(b3.root);

      var b3b = makeBlock("PLAYBACK", null);
      b3b.root.appendChild(makeBtn({ zh: "重播全过程", en: "Replay" }, function () {
        setProgress(0);
        state.playing = true;
        syncTransport();
      }));
      frag.push(b3b.root);

      frag.push(makeNote({
        zh: "浆细胞每秒可分泌数千个抗体。记忆 B 细胞不分泌抗体，它们只是留在原地等待——有时等上几十年。",
        en: "A plasma cell secretes thousands of antibodies per second. Memory B cells secrete nothing; they simply wait — sometimes for decades."
      }));
    }

    if (id === "types") {
      var b4 = makeBlock("PLATFORM", null);
      var seg4 = makeSeg(C.vaccineTypes.map(function (t, i) {
        return { v: i, key: t.key, t: { zh: t.zh, en: t.en }, sub: t.short };
      }), 0, function (v) {
        E.onAction && E.onAction("type", v);
        paintTypeSheet(v);
      }, { col: true });
      b4.root.appendChild(seg4);
      state.bench.platform = function (i) {
        $$("button", seg4).forEach(function (b, k) { b.classList.toggle("on", k === i); });
        E.onAction && E.onAction("type", i);
        paintTypeSheet(i);
      };
      frag.push(b4.root);

      var sheet = el("div", "ctl");
      sheet.id = "type-sheet";
      frag.push(sheet);
      setTimeout(function () { paintTypeSheet(0); }, 0);
    }

    if (id === "memory") {
      var b5 = makeBlock("GROUP", null);
      var seg5 = makeSeg([
        { v: 1, t: { zh: "已接种", en: "Vaccinated" } },
        { v: 0, t: { zh: "未接种", en: "Unvaccinated" } }
      ], 1, function (v) {
        E.onAction && E.onAction("mode", !!v);
        dayRange.input.value = 34;
        E.onAction && E.onAction("day", 34);
        dayRange.out.textContent = "34";
      });
      b5.root.appendChild(seg5);
      frag.push(b5.root);

      var b5b = makeBlock("TIMELINE", "0 d");
      var dayRange = makeRange(0, 60, 1, 0, function (v) {
        E.onAction && E.onAction("day", v);
        b5b.value.textContent = Math.round(v) + " d";
      });
      b5b.root.appendChild(dayRange.root);
      state.bench.mode = function (v) {
        // 分段顺序是「已接种 / 未接种」，所以已接种对应第 0 个按钮
        $$("button", seg5).forEach(function (b, k) { b.classList.toggle("on", k === (v ? 0 : 1)); });
        E.onAction && E.onAction("mode", !!v);
      };
      state.bench.day = function (d) {
        dayRange.input.value = d;
        dayRange.out.textContent = Math.round(d) + " d";
        b5b.value.textContent = Math.round(d) + " d";
        E.onAction && E.onAction("day", d);
      };
      frag.push(b5b.root);

      frag.push(makeNote({
        zh: "把时间拖到第 34 天之后：已接种组的抗体在几天内冲天而起，未接种组则要从零开始。",
        en: "Drag past day 34: the vaccinated curve spikes within days, while the naive group must start from zero."
      }));
    }

    if (id === "herd") {
      var b6 = makeBlock("COVERAGE", "60%");
      var cov = makeRange(0, 95, 1, 60, function (v) {
        var p = v / 100;
        b6.value.textContent = Math.round(v) + "%";
        E.onAction && E.onAction("coverage", p);
        return Math.round(v) + "%";
      });
      b6.root.appendChild(cov.root);
      state.bench.cover = function (v) {
        cov.input.value = v;
        cov.out.textContent = Math.round(v) + "%";
        b6.value.textContent = Math.round(v) + "%";
        E.onAction && E.onAction("coverage", v / 100);
      };
      frag.push(b6.root);

      var b6b = makeBlock("R₀", "2.5");
      var r0 = makeRange(1, 8, 0.1, 2.5, function (v) {
        b6b.value.textContent = v.toFixed(1);
        var ret = E.onAction && E.onAction("r0", v);
        return (ret != null ? ret : v.toFixed(1));
      });
      b6b.root.appendChild(r0.root);
      state.bench.r0 = function (v) {
        r0.input.value = v;
        r0.out.textContent = Number(v).toFixed(1);
        b6b.value.textContent = Number(v).toFixed(1);
        E.onAction && E.onAction("r0", v);
      };
      frag.push(b6b.root);

      var b6c = makeBlock("SIMULATION", null);
      b6c.root.appendChild(makeBtn({ zh: "释放一个感染者", en: "Release one case" }, function () {
        E.onAction && E.onAction("release");
      }));
      b6c.root.appendChild(makeBtn({ zh: "重置人群", en: "Reset population" }, function () {
        E.onAction && E.onAction("reset");
      }, "ghost"));

      var ro = makeReadout([
        { id: "cov", k: { zh: "免疫率", en: "Immune" }, cls: "vac" },
        { id: "inf", k: { zh: "累计感染", en: "Infected" }, cls: "path" },
        { id: "gen", k: { zh: "传播代数", en: "Generations" } },
        { id: "st", k: { zh: "传染链", en: "Chain" } }
      ]);
      b6c.root.appendChild(ro.root);
      frag.push(b6c.root);

      state.onStats = function (d) {
        if (!d) return;
        ro.map.cov.innerHTML = d.cov + "<small>%</small>";
        ro.map.inf.textContent = d.inf;
        ro.map.gen.textContent = d.gen;
        ro.map.st.textContent = d.status === "running"
          ? L({ zh: "扩散中", en: "Spreading" })
          : (d.status === "ended"
            ? L({ zh: "已阻断", en: "Contained" })
            : L({ zh: "待释放", en: "Ready" }));
        ro.map.st.className = "v " + (d.status === "ended" ? "vac" : (d.status === "running" ? "path" : ""));
      };

      frag.push(makeNote({
        zh: "门槛 ≈ 1 − 1/R₀。把覆盖率调到门槛以下再释放病毒，看传染链如何穿过整张网。",
        en: "Threshold ≈ 1 − 1/R₀. Drop coverage below it, release a case, and watch the chain cross the whole grid."
      }));
    }

    if (id === "abx") {
      var b7 = makeBlock("TARGET", null);
      var tgtSeg = makeSeg(C.abxTargets.map(function (t, i) {
        return { v: t.id, key: t.key, t: { zh: t.zh, en: t.en }, sub: { zh: t.cls.zh, en: t.cls.en } };
      }), null, function (v) {
        if (E.selectTarget) E.selectTarget(v);
      }, { col: true, tone: "abx" });
      b7.root.appendChild(tgtSeg);

      var det = el("div", "ctl");
      det.innerHTML = defaultAbxNote();

      b7.root.appendChild(makeBtn({ zh: "回到总览", en: "Overview" }, function () {
        E.onAction && E.onAction("overview");
        $$("button", tgtSeg).forEach(function (x) { x.classList.remove("on"); });
        det.innerHTML = defaultAbxNote();
      }, "ghost"));
      frag.push(b7.root);
      frag.push(det);

      var baseEmit = E.emitCard;
      E.emitCard = function (part, tone) {
        baseEmit(part, tone);
        if (!part || !part.lat) return;
        var t = C.abxTargets.filter(function (x) { return x.id === part.id; })[0];
        if (!t) return;
        $$("button", tgtSeg).forEach(function (x, i) {
          x.classList.toggle("on", C.abxTargets[i] && C.abxTargets[i].id === t.id);
        });
        det.innerHTML = mechanismHtml(t);
      };

      // 讲解第几步 → 聚焦第几个靶点（分段控件、详情卡与镜头一起动）
      state.bench.target = function (id) {
        var idx = -1;
        C.abxTargets.forEach(function (t, k) { if (t.id === id) idx = k; });
        $$("button", tgtSeg).forEach(function (b, k) { b.classList.toggle("on", k === idx); });
        if (idx < 0) {
          E.onAction && E.onAction("overview");
          det.innerHTML = defaultAbxNote();
          return;
        }
        if (E.selectTarget) {
          // 由讲稿驱动的选中不弹结构卡，否则会盖住实验台
          state.quiet = true;
          E.selectTarget(id);
          state.quiet = false;
        }
      };

      frag.push(makeNote({
        zh: "五类机制，五个靶点。它们共同的前提是：这些结构在人体细胞里要么不存在，要么长得不一样。",
        en: "Five mechanisms, five targets. All of them share one premise: these structures are absent — or different — in human cells."
      }));
    }

    if (id === "resistance") {
      var b8 = makeBlock("DOSE", "36%");
      var conc = makeRange(0, 100, 1, 36, function (v) {
        b8.value.textContent = Math.round(v) + "%";
        var ret = E.onAction && E.onAction("conc", v / 100);
        return (ret != null ? ret : Math.round(v) + "%");
      }, "abx");
      b8.root.appendChild(conc.root);
      state.bench.conc = function (v) {
        conc.input.value = v;
        conc.out.textContent = Math.round(v) + "%";
        b8.value.textContent = Math.round(v) + "%";
        E.onAction && E.onAction("conc", v / 100);
      };
      frag.push(b8.root);

      var b8b = makeBlock("SELECTION", null);
      b8b.root.appendChild(makeBtn({ zh: "给药一轮", en: "Apply one dose" }, function () {
        E.onAction && E.onAction("dose");
      }, "abx"));
      var autoBtn = makeBtn({ zh: "连续给药", en: "Auto-dose" }, function (b) {
        var on = E.onAction && E.onAction("auto");
        b.classList.toggle("ghost", !on);
        b.innerHTML = on ? L({ zh: "停止连续给药", en: "Stop auto-dose" }) : L({ zh: "连续给药", en: "Auto-dose" });
      }, "ghost");
      b8b.root.appendChild(autoBtn);
      b8b.root.appendChild(makeBtn({ zh: "重新接种菌群", en: "Re-inoculate" }, function () {
        E.onAction && E.onAction("reset");
      }, "ghost"));

      var ro8 = makeReadout([
        { id: "alive", k: { zh: "存活菌落", en: "Survivors" } },
        { id: "mic", k: { zh: "平均耐药度", en: "Mean MIC" }, cls: "abx" },
        { id: "res", k: { zh: "耐药比例", en: "Resistant" }, cls: "path" },
        { id: "round", k: { zh: "给药轮次", en: "Rounds" } }
      ]);
      b8b.root.appendChild(ro8.root);
      b8b.root.appendChild(el("div", "simbar abx", "<i id='res-bar'></i>"));
      var stEl = el("div", "ctl-note", "");
      b8b.root.appendChild(stEl);
      frag.push(b8b.root);

      state.onStats = function (d) {
        if (!d) return;
        ro8.map.alive.textContent = d.alive;
        ro8.map.mic.textContent = d.mic.toFixed(2);
        ro8.map.res.innerHTML = d.res + "<small>%</small>";
        ro8.map.round.textContent = d.round;
        var bar = $("#res-bar");
        if (bar) bar.style.width = d.res + "%";
        if (d.status === "sterile") {
          stEl.style.color = "var(--vac)";
          stEl.innerHTML = L({
            zh: "菌群已被完全杀灭。把浓度调到最低，再重新接种，看看低剂量下会发生什么。",
            en: "The population is wiped out. Drop the dose to its lowest and re-inoculate — watch what a low dose does instead."
          });
        } else if (d.res >= 60) {
          stEl.style.color = "var(--path-2)";
          stEl.innerHTML = L({
            zh: "多数幸存者已具备耐药性——这一轮的选择完成了。",
            en: "Most survivors are now resistant. Selection has done its work."
          });
        } else {
          stEl.style.color = "var(--ink-4)";
          stEl.innerHTML = L({
            zh: "存活者继承母菌的耐药度，并带有微小突变。提高浓度继续选择。",
            en: "Survivors inherit their parent's MIC with small mutations. Raise the dose to keep selecting."
          });
        }
      };

      frag.push(makeNote({
        zh: "初始菌群里就有极少数天然耐药的个体（MIC 较高）。抗生素不制造耐药，它只是把耐药者挑出来，并给它们腾出空间。",
        en: "A few cells are already resistant (higher MIC). Antibiotics do not create resistance — they select it and clear the space around it."
      }));
    }

    if (id === "closing") {
      var b9 = makeBlock("FINAL CHECK · 4", null);
      var quizWrap = el("div", "quiz");
      var answered = 0, correct = 0;

      C.quiz.forEach(function (q, qi) {
        var qd = el("div", "q");
        qd.appendChild(el("div", "qh", "<b>Q" + (qi + 1) + "</b>" + L(q.q)));
        var opts = el("div", "opts");
        q.opts.forEach(function (o, oi) {
          var ob = el("button", "opt");
          ob.type = "button";
          ob.textContent = L(o);
          ob.addEventListener("click", function () {
            if (qd.dataset.done) return;
            qd.dataset.done = "1";
            answered++;
            var ok = oi === q.a;
            if (ok) correct++;
            $$(".opt", opts).forEach(function (x, xi) {
              if (xi === q.a) x.classList.add("right");
              else if (xi === oi) x.classList.add("wrong");
            });
            var fb = el("div", "fb show", (ok ? "✓ " : "→ ") + L(q.fb));
            qd.appendChild(fb);
            score.textContent = correct + " / " + answered;
            if (answered === C.quiz.length) {
              scoreWrap.style.color = correct >= 3 ? "var(--vac-2)" : "var(--abx-2)";
            }
          });
          opts.appendChild(ob);
        });
        qd.appendChild(opts);
        quizWrap.appendChild(qd);
      });

      var scoreWrap = el("div", "ctl-h");
      scoreWrap.style.marginTop = "12px";
      scoreWrap.innerHTML = '<span class="t">SCORE</span>';
      var score = el("span", "v", "0 / 0");
      scoreWrap.appendChild(score);

      b9.root.appendChild(quizWrap);
      b9.root.appendChild(scoreWrap);
      b9.root.appendChild(makeNote({
        zh: "四道题分别对应选择性毒性、群体免疫阈值、疫苗平台与抗生素的靶点。答错的那题，就是该重看的那一讲。",
        en: "The four questions map to selective toxicity, the herd threshold, vaccine platforms and antibiotic targets. Whatever you miss points to the lesson to revisit."
      }));
      b9.root.appendChild(makeBtn({ zh: "回到第一讲", en: "Back to lesson 1" }, function () {
        go(0);
      }, "ghost"));
      frag.push(b9.root);
    }

    frag.forEach(function (n) { box.appendChild(n); });
  }

  function defaultAbxNote() {
    return '<div class="ctl-h"><span class="t">MECHANISM</span><span class="v abx">—</span></div>' +
      "<p style='margin:0;font-size:11.5px;line-height:1.75;color:var(--ink-3)'>" +
      L({ zh: "点击左侧任一靶点，或直接点击细菌上的发光标记。", en: "Pick a target on the left, or click a glowing marker on the bacterium." }) +
      "</p>";
  }

  function mechanismHtml(t) {
    return '<div class="ctl-h"><span class="t">MECHANISM</span><span class="v abx">' + t.key + "</span></div>" +
      "<p style='margin:0;font-size:11.5px;line-height:1.78;color:var(--ink-2)'>" + L(t.desc) + "</p>" +
      "<div style='margin-top:10px;padding-top:9px;border-top:1px solid var(--rule-2);font-size:10.5px;line-height:1.7;color:var(--ink-3)'>" +
      "<b style='color:var(--abx-2);font-weight:500'>" + L(t.drug) + "</b><br>" + L(t.note) + "</div>";
  }

  function paintTypeSheet(i) {
    var sheet = $("#type-sheet");
    if (!sheet) return;
    var t = C.vaccineTypes[i];
    if (!t) return;
    sheet.innerHTML =
      '<div class="ctl-h"><span class="t">PLATFORM ' + t.key + '</span><span class="v">' + L(t.short) + "</span></div>" +
      "<p style='margin:0 0 10px;font-size:11.5px;line-height:1.78;color:var(--ink-2)'>" + L(t.desc) + "</p>" +
      "<div style='display:flex;flex-direction:column;gap:7px;font-size:10.5px;line-height:1.6'>" +
      "<div><span style='color:var(--vac);font-family:var(--mono);font-size:8px;letter-spacing:.08em'>PRO</span><br>" +
      "<span style='color:var(--ink-2)'>" + L(t.pros) + "</span></div>" +
      "<div><span style='color:var(--abx);font-family:var(--mono);font-size:8px;letter-spacing:.08em'>CON</span><br>" +
      "<span style='color:var(--ink-2)'>" + L(t.cons) + "</span></div>" +
      "<div style='border-top:1px solid var(--rule-2);padding-top:7px'>" +
      "<span style='color:var(--ink-4);font-family:var(--mono);font-size:8px;letter-spacing:.08em'>EXAMPLES</span><br>" +
      "<span style='color:var(--ink-3)'>" + L(t.ex) + "</span></div>" +
      "</div>";
  }

  /* ============================================================ 信息卡 === */
  function emitCard(part, tone) {
    if (state.quiet) return;
    var wrap = $("#cardWrap");
    var card = $("#card");
    card.className = "card" + (tone ? " " + tone : "");

    var kvHtml = "";
    if (part.kv) {
      kvHtml = '<div class="kv">' + part.kv.map(function (k) {
        return "<div><dt>" + L(k.k) + "</dt><dd>" + L(k.v) + "</dd></div>";
      }).join("") + "</div>";
    }

    card.innerHTML =
      '<button class="card-x" type="button" aria-label="关闭">×</button>' +
      '<div class="tag">' + (tone === "path" ? "PATHOGEN STRUCTURE" : (tone === "abx" ? "DRUG TARGET" : "STRUCTURE")) + "</div>" +
      "<h3>" + L(part) + "</h3>" +
      '<div class="lat">' + (part.lat || "") + "</div>" +
      "<p>" + L(part.desc) + "</p>" +
      kvHtml;

    $(".card-x", card).addEventListener("click", function () { hideCard(); });
    wrap.classList.add("on");
  }

  function hideCard() {
    $("#cardWrap").classList.remove("on");
  }

  E.emitCard = emitCard;
  E.hideCard = hideCard;
  E.emitStats = function (d) {
    if (d) state.lastStats = d;
    if (state.onStats) state.onStats(d);
  };

  /* ============================================================ 进度条 === */
  function buildTicks() {
    var t = $("#trackTicks");
    t.innerHTML = "";
    CH.forEach(function (c, i) {
      var i2 = el("i");
      i2.style.left = (i / (TOTAL - 1)) * 100 + "%";
      i2.setAttribute("data-i", i);
      t.appendChild(i2);
    });
  }

  function updateTrack() {
    var pct = state.progress * 100;
    $("#trackFill").style.width = pct + "%";
    $("#trackKnob").style.left = pct + "%";
    var tr = $("#track");
    tr.setAttribute("aria-valuenow", Math.round(pct));
  }

  function setProgress(p) {
    state.progress = clamp(p, 0, 1);
    if (state.stage && state.stage.setProgress) state.stage.setProgress(state.progress);
    updateTrack();
  }

  /* ============================================================ 播放控制 === */
  function syncTransport() {
    var tr = $("#transport");
    tr.classList.toggle("paused", !state.playing);
    $("#btnPlay").setAttribute("aria-pressed", state.playing ? "true" : "false");
    $("#btnPlay").setAttribute("aria-label", state.playing ? "暂停 Pause" : "播放 Play");
    E.setPaused(!state.playing);
  }

  function togglePlay() {
    var st = state.stage;
    if (st && st.duration && state.progress >= 0.999) setProgress(0);
    state.playing = !state.playing;
    syncTransport();
  }

  /* ============================================================ 路由 === */
  function go(i, force) {
    i = clamp(i, 0, TOTAL - 1);
    if (i === state.idx && !force) return;

    var c = CH[i];
    state.idx = i;
    state.step = 0;

    var ls = $("#lesson");
    ls.classList.add("out");
    ls.classList.remove("open");

    setTimeout(function () {
      paintLesson(c);
      ls.classList.remove("out");
      ls.scrollTop = 0;
    }, 170);

    buildNav();
    paintLegend(c);

    state.lastStats = null;
    try { state.stage = E.mount(S[c.id]); } catch (err) { state.stage = null; }
    buildConsole(c.id);
    if (state.lastStats && state.onStats) state.onStats(state.lastStats);

    state.progress = 0;
    state.playing = true;
    syncTransport();

    if (state.stage && state.stage.setProgress) state.stage.setProgress(0);
    updateTrack();

    $("#curNo").textContent = c.no;
    $("#totNo").textContent = CH[TOTAL - 1].no;
    $$("#trackTicks i").forEach(function (x, k) { x.classList.toggle("on", k <= i); });
    hideCard();

    var box = $("#console");
    if (box) box.scrollLeft = 0;
  }

  /* ============================================================ 语言 === */
  function applyStaticLang() {
    $$("[data-zh]").forEach(function (e) {
      var v = e.getAttribute(state.lang === "zh" ? "data-zh" : "data-en");
      if (v != null) e.innerHTML = v;
    });
    $$("[data-lang-btn]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang-btn") === state.lang ? "true" : "false");
    });
  }

  function setLang(lang) {
    state.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);
    applyStaticLang();

    // 3D 标注
    var all = C.virusParts.concat(C.bacteriaParts);
    all.forEach(function (p) { E.setMarkLabel(p.id, L(p)); });
    C.abxTargets.forEach(function (p) { E.setMarkLabel(p.id, L(p)); });

    var cur = state.idx;
    var stp = state.step;
    state.idx = -1;
    go(cur === -1 ? 0 : cur, true);
    state.step = stp;
    paintStep();
  }

  /* ============================================================ 初始化 === */
  function boot() {
    // 即便 WebGL 不可用，讲稿与自测也应完整可读
    try { E.init($("#stage")); } catch (err) { if (window.console) console.error("3D init failed", err); }

    state.done = loadDone();
    applyStaticLang();
    updateProgress();

    buildNav();
    buildTicks();
    $("#totNo").textContent = CH[TOTAL - 1].no;

    // 播放条
    $("#btnPrev").addEventListener("click", function () { go(state.idx - 1); });
    $("#btnNext").addEventListener("click", function () { go(state.idx + 1); });
    $("#btnPlay").addEventListener("click", togglePlay);

    // 讲稿面板：单步推进
    $("#lsPrev").addEventListener("click", stepPrev);
    $("#lsNext").addEventListener("click", stepNext);
    $("#lsClose").addEventListener("click", function () {
      $("#lesson").classList.remove("open");
      $("#lesson").scrollTop = 0;
    });

    // 手机上点标题展开／收起讲稿；台面上的控件仍然可用
    ["#capTitle", "#capSub"].forEach(function (sel) {
      var n = $(sel);
      if (!n) return;
      n.addEventListener("click", function () {
        if (window.innerWidth > 900) return;
        $("#lesson").classList.toggle("open");
      });
    });

    var track = $("#track");
    function scrub(e) {
      var r = track.getBoundingClientRect();
      var p = clamp((e.clientX - r.left) / r.width, 0, 1);
      state.playing = false;
      syncTransport();
      setProgress(p);
    }
    track.addEventListener("pointerdown", function (e) {
      track.setPointerCapture(e.pointerId);
      scrub(e);
      track.__drag = true;
    });
    track.addEventListener("pointermove", function (e) {
      if (track.__drag) scrub(e);
    });
    track.addEventListener("pointerup", function () {
      track.__drag = false;
    });

    // 语言
    $$("[data-lang-btn]").forEach(function (b) {
      b.addEventListener("click", function () {
        var l = b.getAttribute("data-lang-btn");
        if (l !== state.lang) setLang(l);
      });
    });

    // 键盘：←/→ 走步骤，Shift+←/→ 换讲，数字键直接跳讲
    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") {
        if (e.shiftKey) go(state.idx + 1); else stepNext();
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") {
        if (e.shiftKey) go(state.idx - 1); else stepPrev();
        e.preventDefault();
      }
      if (e.key === " ") { togglePlay(); e.preventDefault(); }
      if (/^[1-9]$/.test(e.key)) go(parseInt(e.key, 10) - 1);
    });

    // 章节切换后的进度推进
    var last = performance.now();
    function tick(now) {
      var dt = Math.min(0.06, (now - last) / 1000);
      last = now;
      var st = state.stage;
      if (state.playing && st && st.duration && state.progress < 1) {
        setProgress(state.progress + dt / st.duration);
        if (state.progress >= 1) {
          state.playing = false;
          syncTransport();
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    go(0, true);

    setTimeout(function () {
      $("#loader").classList.add("off");
    }, 420);

    // 新章节进场时清掉缓存卡片
    var obs = new MutationObserver(function () { });
    obs.observe($("#console"), { childList: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
