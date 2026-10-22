(function () {
  "use strict";

  /* =========================================================
     01 · Lesson data, state, and small utilities
     ========================================================= */

  const CHAPTERS = [
    { id: "forces", navZh: "受力", navEn: "Forces" },
    { id: "first-law", navZh: "第一定律", navEn: "Law I" },
    { id: "second-law", navZh: "第二定律", navEn: "Law II" },
    { id: "third-law", navZh: "第三定律", navEn: "Law III" },
    { id: "review", navZh: "课堂挑战", navEn: "Check" }
  ];

  const QUIZ = [
    {
      question: {
        zh: "汽车在平直公路上以 60 km/h 匀速行驶。它受到的合力是多少？",
        en: "A car travels at a steady 60 km/h on a straight, level road. What is the net force on it?"
      },
      options: [
        { zh: "合力为零", en: "The net force is zero" },
        { zh: "向前的动力大于阻力", en: "The driving force is greater than resistance" },
        { zh: "汽车不受任何力", en: "No forces act on the car at all" },
        { zh: "合力等于汽车的质量", en: "The net force equals the car's mass" }
      ],
      correct: 0,
      explain: {
        zh: "匀速直线运动表示速度不变，加速度为零，所以合力为零。发动机的动力与空气阻力、滚动阻力恰好平衡。",
        en: "Constant velocity means zero acceleration, so the net force is zero. The engine force is exactly balanced by air drag and rolling resistance."
      }
    },
    {
      question: {
        zh: "一辆 1,200 kg 的小汽车和一辆 1,800 kg 的货车受到同样大小的合力。谁的速度变化更快？",
        en: "A 1,200 kg car and an 1,800 kg van experience the same net force. Which one's velocity changes faster?"
      },
      options: [
        { zh: "小汽车", en: "The car" },
        { zh: "货车", en: "The van" },
        { zh: "两者一样快", en: "They change at the same rate" },
        { zh: "无法判断", en: "It cannot be determined" }
      ],
      correct: 0,
      explain: {
        zh: "由 a = ΣF / m，合力相同时，质量越小，加速度越大，速度变化越快。",
        en: "Since a = ΣF / m, a smaller mass gives a larger acceleration when the net force is the same."
      }
    },
    {
      question: {
        zh: "轮胎向后推地面，地面同时向前推轮胎。这两个力是什么关系？",
        en: "A tire pushes backward on the road; the road pushes forward on the tire. What is the relationship between these two forces?"
      },
      options: [
        { zh: "作用在同一物体上的平衡力", en: "Balanced forces acting on the same object" },
        { zh: "作用力与反作用力，分别作用在两个物体上", en: "An action–reaction pair acting on two different objects" },
        { zh: "大小相等，所以互相抵消", en: "They are equal, so they cancel each other" },
        { zh: "一个是摩擦力，一个是重力", en: "One is friction, the other is gravity" }
      ],
      correct: 1,
      explain: {
        zh: "它们等大、反向、共线、同时出现，但分别作用在「地面」和「轮胎」上，不能相互抵消。",
        en: "They are equal, opposite, collinear, and simultaneous — but they act on the road and the tire separately, so they do not cancel."
      }
    },
    {
      question: {
        zh: "公共汽车突然刹车，站着的乘客为什么会向前倾？",
        en: "Why does a standing passenger lurch forward when a bus brakes suddenly?"
      },
      options: [
        { zh: "有一个向前的力把乘客推了出去", en: "A forward force pushes the passenger" },
        { zh: "乘客的身体保持原来的运动状态，而车减速了", en: "The passenger's body keeps its motion while the bus slows" },
        { zh: "重力突然变大", en: "Gravity suddenly increases" },
        { zh: "车内的空气把人向前吸", en: "Air inside pulls the person forward" }
      ],
      correct: 1,
      explain: {
        zh: "这是惯性：乘客原本随车前进，车减速时，乘客的上半身仍倾向于保持原来的速度，于是相对车厢向前倾。",
        en: "This is inertia: the passenger was moving with the bus. When the bus slows, the passenger's upper body tends to keep its original velocity and leans forward relative to the cabin."
      }
    }
  ];

  const FORCE_COLORS = {
    weight: 0xffc83d,
    normal: 0x4d9dff,
    drive: 0x3fe08c,
    resist: 0xff6247,
    seat: 0xffb34d,
    belt: 0xffb34d,
    action: 0xb190ff,
    reaction: 0x2edbd0,
    net: 0xff9b6e
  };

  const FORCE_CSS = {
    weight: "#ffc83d",
    normal: "#4d9dff",
    drive: "#3fe08c",
    resist: "#ff6247",
    seat: "#ffb34d",
    belt: "#ffb34d",
    action: "#b190ff",
    reaction: "#2edbd0",
    net: "#ff9b6e"
  };

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* Private browsing or a strict file:// context can block storage. */
    }
  }

  function chapterFromUrl() {
    const hash = window.location.hash.replace("#", "").trim();
    const byId = CHAPTERS.findIndex((chapter) => chapter.id === hash);
    if (byId >= 0) return byId;

    const fromQuery = Number(new URLSearchParams(window.location.search).get("chapter"));
    if (Number.isInteger(fromQuery) && fromQuery >= 1 && fromQuery <= CHAPTERS.length) {
      return fromQuery - 1;
    }
    return 0;
  }

  const state = {
    lang: (function () {
      const fromQuery = new URLSearchParams(window.location.search).get("lang");
      if (fromQuery === "en" || fromQuery === "zh") return fromQuery;
      const saved = safeStorageGet("newton-garage-lang");
      if (saved === "en" || saved === "zh") return saved;
      return "zh";
    })(),
    chapter: chapterFromUrl(),
    analysisMode: "cruise",
    ch1Mode: "coast",
    ch3Mode: "drive",
    quizAnswers: [null, null, null, null]
  };

  const sim = {
    analysisT: 0,
    analysisSpeed: 8,
    roadScroll: 0,
    ch1T: 0,
    ch1Running: false,
    ch1Done: false,
    ch1SpeedA: 6,
    ch1SpeedB: 6,
    ch1PosA: -4.4,
    ch1PosB: -4.4,
    coachStarted: false,
    passengerAction: null,
    passengerT: 0,
    passengerSpeed: 0,
    passengerLean: 0,
    law2Force: 4800,
    law2Mass: 1200,
    law2T: 0,
    law2V: 0,
    law2S: 0,
    law2Running: false,
    law2Done: false,
    law3Phase: "idle",
    law3T: 0,
    law3CarAX: -9.4,
    law3CarBX: 6.7,
    law3SpeedA: 4,
    law3SpeedB: 2.5,
    law3DriveSpeed: 0,
    law3Running: false
  };

  const MASS_KG = 1200;
  const GRAVITY = 9.8;
  const WEIGHT_KN = (MASS_KG * GRAVITY) / 1000;
  const FRICTION_N = 1200;

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.prototype.slice.call((root || document).querySelectorAll(selector));

  function L(zh, en) {
    return state.lang === "zh" ? zh : en;
  }

  function other(zh, en) {
    return state.lang === "zh" ? en : zh;
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function fixed(value, digits) {
    return Number(value).toFixed(typeof digits === "number" ? digits : 1);
  }

  function signedFixed(value, digits) {
    const rounded = Number(value).toFixed(typeof digits === "number" ? digits : 1);
    return Number(rounded) > 0 ? "+" + rounded : rounded;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const carSVG = `
    <svg viewBox="0 0 106 58" aria-hidden="true">
      <path d="M8 39c0-4 3-7 7-7l7-1 10-12c2-2 4-3 7-3h19c3 0 6 1 8 3l10 11 12 2c5 1 8 4 8 8v4H8z" fill="currentColor" opacity=".92"/>
      <path d="M28 31h20l-7-10H37zM55 21h11c2 0 4 1 5 2l9 8H55z" fill="#f2ede3" opacity=".8"/>
      <circle cx="28" cy="43" r="8" fill="#171511"/>
      <circle cx="28" cy="43" r="3.4" fill="#f2ede3"/>
      <circle cx="82" cy="43" r="8" fill="#171511"/>
      <circle cx="82" cy="43" r="3.4" fill="#f2ede3"/>
    </svg>`;

  /* =========================================================
     02 · Shared panel fragments
     ========================================================= */

  function segmentedHTML(options, active, action) {
    return (
      `<div class="segmented" role="group" aria-label="${escapeHTML(L("演示选项", "Demo options"))}">` +
      options
        .map((option) => {
          const selected = option.id === active;
          return `<button type="button" data-action="${action}" data-mode="${option.id}" class="${selected ? "is-active" : ""}" aria-pressed="${selected}">${escapeHTML(option.label)}</button>`;
        })
        .join("") +
      "</div>"
    );
  }

  function forceChipHTML(config) {
    const zero = !config.value || Number(config.value) < 0.05;
    const direction = config.direction || "";
    return `
      <span class="force-chip ${config.kind ? "is-" + config.kind : ""} ${config.isRight ? "is-right" : ""} ${zero ? "is-zero" : ""}" style="--force-color:${config.color || FORCE_CSS[config.kind] || "var(--ink)"}">
        <span class="fc-label"><span class="fc-arrow">${direction}</span>${escapeHTML(config.name)}</span>
        <span class="fc-value">${zero ? "0.0" : fixed(config.value, config.digits == null ? 1 : config.digits)}<small>${config.unit || "kN"}</small></span>
      </span>`;
  }

  function forceMapHTML(options) {
    const data = options || {};
    const driveN = data.driveN == null ? 0 : data.driveN;
    const resistN = data.resistN == null ? 0 : data.resistN;
    const netN = driveN - resistN;
    const balanced = Math.abs(netN) < 1;
    const accel = netN / (data.mass || MASS_KG);
    const weight = data.weightKN == null ? WEIGHT_KN : data.weightKN;
    const normal = data.normalKN == null ? weight : data.normalKN;
    const netState = balanced
      ? L("合力为零 · 速度不变", "NET ZERO · CONSTANT VELOCITY")
      : netN > 0
        ? L("合力向前 · 速度增大", "NET FORWARD · SPEEDING UP")
        : L("合力向后 · 速度减小", "NET BACKWARD · SLOWING");

    return `
      <div class="force-map">
        <div class="fm-top">
          ${forceChipHTML({ kind: "normal", name: L("支持力 N", "NORMAL N"), direction: "↑", value: normal })}
        </div>
        <div class="fm-middle">
          ${forceChipHTML({ kind: "resist", name: L("阻力 f", "RESISTANCE f"), direction: "←", value: resistN / 1000 })}
          <div class="fm-car">${carSVG}</div>
          ${forceChipHTML({ kind: "drive", name: L("动力 F", "DRIVE F"), direction: "→", value: driveN / 1000, isRight: true })}
        </div>
        <div class="fm-bottom">
          ${forceChipHTML({ kind: "weight", name: L("重力 W", "WEIGHT W"), direction: "↓", value: weight })}
        </div>
        <div class="fm-net ${balanced ? "is-balanced" : ""}">
          <span>ΣF = <strong>${signedFixed(netN / 1000, 1)} kN</strong></span>
          <span class="fm-net-state">${netState}<br><span style="font-family:var(--font-mono);font-size:8px;font-weight:500;color:var(--faint)">a = ${fixed(accel, 1)} m/s²</span></span>
        </div>
      </div>`;
  }

  function lawCardHTML(label, textZh, textEn, note) {
    const primary = state.lang === "zh" ? textZh : textEn;
    const secondary = state.lang === "zh" ? textEn : textZh;
    return `
      <div class="law-card">
        <span class="law-label">${escapeHTML(label)}</span>
        <p class="law-text">${primary}</p>
        <p class="law-text-en">${secondary}</p>
        ${note ? `<p class="law-note">${note}</p>` : ""}
      </div>`;
  }

  function miniStepsHTML(steps) {
    return `
      <div class="mini-steps">
        ${steps
          .map(
            (step, index) => `
          <div class="mini-step">
            <span class="step-num">${pad2(index + 1)}</span>
            <span class="step-copy"><b>${step.title}</b>${step.copy ? " · " + step.copy : ""}</span>
            <span class="step-tag">${step.tag}</span>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function noteHTML(title, copy) {
    return `
      <div class="note-card">
        <span class="note-title">${escapeHTML(title)}</span>
        <p>${copy}</p>
      </div>`;
  }

  function teacherNotesHTML(items) {
    return `
      <details class="teacher-notes">
        <summary>${L("给老师的课堂提示", "Teacher's notes")}</summary>
        <div class="notes-body">
          <ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>
        </div>
      </details>`;
  }

  function quizScore() {
    return state.quizAnswers.reduce((score, answer, index) => {
      return score + (answer === QUIZ[index].correct ? 1 : 0);
    }, 0);
  }

  /* =========================================================
     03 · Chapter renderers
     ========================================================= */

  function renderForces() {
    const mode = state.analysisMode;
    const configs = {
      rest: {
        driveN: 0,
        resistN: 0,
        speed: 0,
        status: L("静止", "AT REST"),
        modeName: L("静止", "At rest"),
        modeNote: L("没有动力，也没有阻力，合力为零，汽车保持静止。", "No driving force, no resistance. Net force is zero, so the car stays at rest.")
      },
      cruise: {
        driveN: 2400,
        resistN: 2400,
        speed: 8,
        status: L("匀速", "CRUISE"),
        modeName: L("匀速", "Cruise"),
        modeNote: L("动力和阻力大小相等、方向相反，合力为零，速度保持不变。", "Driving force and resistance are equal and opposite. Net force is zero, so velocity stays constant.")
      },
      accelerate: {
        driveN: 4800,
        resistN: 2400,
        speed: 4,
        status: L("加速", "ACCELERATING"),
        modeName: L("加速", "Accelerate"),
        modeNote: L("动力大于阻力，合力向前。合力不为零，速度不断增大。", "Driving force exceeds resistance. A forward net force makes the car speed up.")
      }
    };
    const current = configs[mode] || configs.cruise;

    return `
      <article class="chapter">
        <div class="chapter-kicker"><span>CHAPTER 01</span><em>${L("受力分析 · FORCE ANALYSIS", "FORCE ANALYSIS · 受力分析")}</em></div>
        <h1 class="chapter-title">
          <span class="title-thin">${L("先学会", "See the")}</span>
          <span class="title-accent">${L("看见「力」", "forces first.")}</span>
        </h1>
        <p class="chapter-english">${L("See the forces first.", "先学会看见「力」")}</p>
        <p class="chapter-intro">${L(
          "汽车怎样运动，不取决于某一个力，而取决于所有力的<strong>合力</strong>。先选对象，再按顺序找力、画方向、求合力。",
          "A car's motion depends not on one force, but on the <strong>net force</strong>. Choose the object, find the forces, draw their directions, then add them up."
        )}</p>

        <div class="section-label"><span>${L("实验台", "Experiment bench")}</span><em>FORCE MAP</em></div>
        <section class="experiment-panel">
          <div class="experiment-head">
            <div>
              <span class="experiment-kicker">${L("同一辆车 · 三种状态", "ONE CAR · THREE STATES")}</span>
              <h3>${L("切换运动状态，观察合力", "Switch the motion state. Watch the net force.")}</h3>
            </div>
            <span class="experiment-status"><i></i>${escapeHTML(current.status)}</span>
          </div>
          ${segmentedHTML(
            [
              { id: "rest", label: L("静止", "At rest") },
              { id: "cruise", label: L("匀速", "Cruise") },
              { id: "accelerate", label: L("加速", "Accelerate") }
            ],
            mode,
            "set-analysis"
          )}
          ${forceMapHTML({ driveN: current.driveN, resistN: current.resistN, mass: MASS_KG })}
          <p class="experiment-note">${current.modeNote}</p>
          <div class="launch-meta">
            <span>${L("当前车速", "CAR SPEED")}</span>
            <span class="run-time"><span id="analysisSpeed">${fixed(current.speed, 1)}</span> m/s</span>
          </div>
        </section>

        <div class="section-label"><span>${L("受力分析四步", "Four steps")}</span><em>CHECKLIST</em></div>
        ${miniStepsHTML([
          { title: L("选对象", "Choose the object"), copy: L("只分析汽车", "the car only"), tag: "OBJECT" },
          { title: L("找施力者", "Find the interactions"), copy: L("地球、地面、空气", "Earth, road, air"), tag: "FORCES" },
          { title: L("定正方向", "Choose + direction"), copy: L("向右为正", "right is +"), tag: "AXIS" },
          { title: L("求矢量和", "Add the vectors"), copy: L("ΣF = F − f", "ΣF = F − f"), tag: "NET FORCE" }
        ])}

        ${lawCardHTML(
          L("一条关键规则", "ONE KEY RULE"),
          "合力为零 ⇔ 速度不变；合力不为零 ⇔ 速度改变。",
          "Zero net force ⇔ constant velocity. Non-zero net force ⇔ changing velocity.",
          `<span style="color:var(--accent-deep);font-weight:700">${L("不是“有力就动”，而是“合力改变运动”。", "Motion is not caused by force; a net force changes motion.")}</span>`
        )}

        ${noteHTML(
          L("易错点 · 平衡力不等于作用力与反作用力", "Watch out · Balanced ≠ action–reaction"),
          L(
            "支持力 N 与重力 W 大小相等，是因为汽车竖直方向没有加速度，二力平衡。它们都作用在汽车上；而作用力与反作用力必须分别作用在两个物体上。",
            "The normal force N equals weight W because the car has no vertical acceleration. Both act on the same car. An action–reaction pair, by contrast, always acts on two different objects."
          )
        )}

        ${teacherNotesHTML([
          L("先让学生只说出“汽车受到哪些力”，暂时不判断大小。", "Ask students to list every force first; delay comparing magnitudes."),
          L("切换“匀速”和“加速”，追问：动力变大时，阻力是否也跟着变大？", "Switch from cruise to accelerate and ask whether resistance grows with the driving force."),
          L("用水平与竖直两个方向分别检查：N 与 W 平衡，F 与 f 决定水平方向的运动。", "Check axes separately: N balances W vertically; F and f decide horizontal motion.")
        ])}
      </article>`;
  }

  function coastalExperimentHTML() {
    const running = sim.ch1Running;
    const finished = sim.ch1Done;
    const speedA = running || finished ? sim.ch1SpeedA : 6;
    const speedB = running || finished ? sim.ch1SpeedB : 6;
    return `
      <div class="experiment-head">
        <div>
          <span class="experiment-kicker">${L("双车道对照", "TWO-LANE COMPARISON")}</span>
          <h3>${L("同时释放，谁的速度会变？", "Release both. Whose speed changes?")}</h3>
        </div>
        <span class="experiment-status"><i></i>${running ? L("滑行中", "RUNNING") : finished ? L("滑行结束", "COMPLETE") : L("待释放", "READY")}</span>
      </div>
      <div class="lane-pair">
        <div class="lane-card is-friction">
          <div class="lane-top"><span class="lane-name">${L("车道 A", "Lane A")}</span><span class="lane-mode">${L("有摩擦", "FRICTION")}</span></div>
          <div class="lane-speed"><span id="laneSpeedA">${fixed(speedA, 1)}</span><small>m/s</small></div>
          <div class="lane-note">${L("受到向后的阻力", "Resistance acts backward")}</div>
        </div>
        <div class="lane-card is-ideal">
          <div class="lane-top"><span class="lane-name">${L("车道 B", "Lane B")}</span><span class="lane-mode">${L("理想无摩擦", "IDEAL")}</span></div>
          <div class="lane-speed"><span id="laneSpeedB">${fixed(speedB, 1)}</span><small>m/s</small></div>
          <div class="lane-note">${L("水平方向合力为零", "Zero horizontal net force")}</div>
        </div>
      </div>
      <div class="launch-meta">
        <span>${L("计时", "RUN TIME")}</span>
        <span class="run-time"><span id="coastTimer">${fixed(sim.ch1T, 1)}</span> s</span>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary btn-block" type="button" data-action="ch1-play" id="ch1PlayBtn" ${running ? "disabled" : ""}>
          <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4.5 13 9l-7 4.5z" fill="currentColor"/></svg>
          ${running ? L("两车滑行中…", "Both cars are moving…") : finished ? L("再滑一次", "Run again") : L("同时释放两辆车", "Release both cars")}
        </button>
      </div>
      <p class="experiment-note">${L(
        "两条车道的小车都以 6.0 m/s 出发。有摩擦的车道会给小车一个向后的合力；理想车道的水平合力为零。",
        "Both cars start at 6.0 m/s. The real lane adds a backward net force; the ideal lane has zero horizontal net force."
      )}</p>`;
  }

  function passengerExperimentHTML() {
    const action = sim.passengerAction;
    const running = action && sim.passengerT < (action === "brake" ? 2.7 : 2.5);
    return `
      <div class="experiment-head">
        <div>
          <span class="experiment-kicker">${L("乘客惯性", "PASSENGER INERTIA")}</span>
          <h3>${L("车在动，乘客也在“坚持”原来的运动", "The car moves. The passenger insists on the old motion.")}</h3>
        </div>
        <span class="experiment-status"><i></i><span id="passengerStatusText">${running ? L("演示中", "PLAYING") : action ? L("演示结束", "COMPLETE") : L("待演示", "READY")}</span></span>
      </div>
      <div class="inertia-banner">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 10v6m-4-4h8m-8 9h1.5a2 2 0 0 0 2-2v-1h1.5a2 2 0 0 0 2 2H20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <p><strong>${L("看车窗里的乘客：", "Watch the passenger:")}</strong>${L("车改变速度时，乘客的身体仍想保持原来的速度。", "when the car changes speed, the passenger's body tends to keep its original velocity.")}</p>
      </div>
      <div class="launch-meta">
        <span>${L("此刻车速", "CAR SPEED")}</span>
        <span class="run-time"><span id="passengerSpeed">${fixed(sim.passengerSpeed, 1)}</span> m/s</span>
      </div>
      <div class="btn-row">
        <button class="btn ${action === "start" ? "btn-primary" : "btn-ghost"}" type="button" data-action="ch1-passenger" data-kind="start">${L("突然起步", "Start suddenly")}</button>
        <button class="btn ${action === "brake" ? "btn-accent" : "btn-ghost"}" type="button" data-action="ch1-passenger" data-kind="brake">${L("紧急刹车", "Brake hard")}</button>
      </div>
      <p class="experiment-note">${L(
        "起步时乘客向后靠，刹车时乘客向前倾——不是有“惯性力”在推人，而是人体保持了原来的运动状态。",
        "The passenger leans back when the car starts and forward when it brakes. No mysterious ‘inertia force’ pushes them; their body simply keeps its prior motion."
      )}</p>`;
  }

  function renderFirstLaw() {
    const isCoast = state.ch1Mode === "coast";
    return `
      <article class="chapter">
        <div class="chapter-kicker"><span>CHAPTER 02</span><em>${L("牛顿第一定律 · INERTIA", "NEWTON'S FIRST LAW · INERTIA")}</em></div>
        <h1 class="chapter-title">
          <span class="title-thin">${L("没有合力，", "No net force.")}</span>
          <span class="title-accent">${L("速度就不变。", "No change in motion.")}</span>
        </h1>
        <p class="chapter-english">${L("No net force. No change in motion.", "没有合力，速度就不变。")}</p>
        <p class="chapter-intro">${L(
          "真的需要一直推，车才一直走吗？把摩擦一点点拿掉，答案就出现了：<strong>运动不需要力来维持，力只改变运动。</strong>",
          "Do you really need a continuous push to keep a car moving? Reduce friction and the answer appears: <strong>motion does not need a force to continue — force changes motion.</strong>"
        )}</p>

        <div class="section-label"><span>${L("实验台", "Experiment bench")}</span><em>INERTIA LAB</em></div>
        <section class="experiment-panel">
          ${segmentedHTML(
            [
              { id: "coast", label: L("双车滑行", "Two-lane glide") },
              { id: "passenger", label: L("乘客惯性", "Passenger inertia") }
            ],
            state.ch1Mode,
            "ch1-demo"
          )}
          ${isCoast ? coastalExperimentHTML() : passengerExperimentHTML()}
        </section>

        <div class="section-label"><span>${L("定律原文", "The law")}</span><em>1687 · PRINCIPIA</em></div>
        ${lawCardHTML(
          "NEWTON'S FIRST LAW · 牛顿第一定律",
          "一切物体总保持静止状态或匀速直线运动状态，直到有外力迫使它改变这种状态为止。",
          "Every body continues in its state of rest, or of uniform motion in a straight line, unless compelled to change that state by forces impressed upon it.",
          `<span style="color:var(--accent-deep);font-weight:700">${L("不受力，或所受合力为零。", "No force, or zero net force.")}</span>`
        )}

        <div class="formula-plate">
          <span class="formula-main">ΣF = 0 <span class="f-accent">→</span> <span class="f-accent">v</span> = constant</span>
          <span class="formula-caption"><b>EQUILIBRIUM</b>${L("速度大小和方向都不变", "speed and direction both stay the same")}</span>
        </div>

        <div class="inertia-banner">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h11a4 4 0 0 1 0 8H8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m7 5-3 3 3 3M8 13l-3 3 3 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18.5" cy="12" r="2.4" fill="currentColor"/></svg>
          <p><strong>${L("惯性", "Inertia")}</strong> ${L("是物体保持原来运动状态的性质，只与质量有关。质量越大，惯性越大。", "is an object's tendency to keep its current state of motion. It depends on mass — more mass means more inertia.")}</p>
        </div>

        ${noteHTML(
          L("易错点 · 惯性不是力", "Watch out · Inertia is not a force"),
          L(
            "不能说“物体受到惯性作用”，也不能说“惯性力”。惯性是物体本身的性质，没有方向，也没有施力者。",
            "Never say an object ‘is acted on by inertia’. Inertia is a property of the object itself: it has no direction and no agent."
          )
        )}

        ${teacherNotesHTML([
          L("先预测：两车同时出发，哪一辆先停？再点击释放验证。", "Predict first: which car slows? Then release both cars."),
          L("把“摩擦逐渐减小”与伽利略理想斜面实验联系起来。", "Connect the decreasing friction to Galileo's ideal inclined-plane thought experiment."),
          L("让学生用“人保持原来的运动状态”解释安全带和安全气囊。", "Ask students to explain seat belts and airbags using ‘the body keeps its prior motion’.")
        ])}
      </article>`;
  }

  function renderSecondLaw() {
    const f = sim.law2Force;
    const m = sim.law2Mass;
    const netN = f - FRICTION_N;
    const a = netN / m;
    const vEnd = a * 5;
    const sEnd = 0.5 * a * 25;
    return `
      <article class="chapter">
        <div class="chapter-kicker"><span>CHAPTER 03</span><em>${L("牛顿第二定律 · F = ma", "NEWTON'S SECOND LAW · F = ma")}</em></div>
        <h1 class="chapter-title">
          <span class="title-thin">${L("力越大，", "More force,")}</span>
          <span class="title-accent">${L("变化越快。", "faster change.")}</span>
        </h1>
        <p class="chapter-english">${L("More force, faster change.", "力越大，变化越快。")}</p>
        <p class="chapter-intro">${L(
          "同样一脚油门，空车和满载车的反应完全不同。加速度同时取决于<strong>合力</strong>和<strong>质量</strong>：合力越大，加速度越大；质量越大，加速度越小。",
          "The same throttle feels different in an empty car and a fully loaded one. Acceleration depends on both the <strong>net force</strong> and the <strong>mass</strong>: more force means more acceleration; more mass means less."
        )}</p>

        <div class="section-label"><span>${L("实验台", "Experiment bench")}</span><em>F = ma</em></div>
        <section class="experiment-panel">
          <div class="experiment-head">
            <div>
              <span class="experiment-kicker">${L("动力与质量", "DRIVE FORCE & MASS")}</span>
              <h3>${L("调两个变量，观察加速度", "Change two variables. Watch acceleration.")}</h3>
            </div>
            <span class="experiment-status"><i></i><span id="law2StatusText">${sim.law2Running ? L("运行中", "RUNNING") : sim.law2Done ? L("记录完成", "COMPLETE") : L("可调参数", "LIVE")}</span></span>
          </div>

          <div class="field">
            <div class="field-head">
              <label class="field-label" for="forceSlider">${L("发动机驱动力", "Driving force")} <span>F</span></label>
              <output class="field-value" for="forceSlider"><span id="forceValue">${(f / 1000).toFixed(1)}</span> <small>kN</small></output>
            </div>
            <input id="forceSlider" type="range" min="2000" max="8000" step="100" value="${f}" data-law2="force" aria-label="${escapeHTML(L("驱动力", "Driving force"))}">
            <div class="field-scale"><span>2.0 kN</span><span>8.0 kN</span></div>
          </div>

          <div class="field">
            <div class="field-head">
              <label class="field-label" for="massSlider">${L("汽车总质量", "Total mass")} <span>m</span></label>
              <output class="field-value" for="massSlider"><span id="massValue">${m.toLocaleString("en-US")}</span> <small>kg</small></output>
            </div>
            <input id="massSlider" type="range" min="800" max="2000" step="50" value="${m}" data-law2="mass" aria-label="${escapeHTML(L("汽车总质量", "Total mass"))}">
            <div class="field-scale"><span>800 kg</span><span>2,000 kg</span></div>
          </div>

          <div class="result-board">
            <div class="result-equation">
              <span>ΣF = F<sub>drive</sub> − f =</span>
              <strong id="law2NetEq">${fixed(netN / 1000, 2)} kN</strong>
              <span class="eq-accent">→ a = ΣF / m</span>
            </div>
            <div class="result-stats">
              <div class="result-stat"><span>${L("加速度", "ACCELERATION")}</span><b><span id="law2Accel">${fixed(a, 1)}</span><small>m/s²</small></b></div>
              <div class="result-stat is-hot"><span>${L("5 秒后速度", "SPEED AT 5 s")}</span><b><span id="law2VEnd">${fixed(vEnd, 1)}</span><small>m/s</small></b></div>
              <div class="result-stat"><span>${L("5 秒内路程", "DISTANCE IN 5 s")}</span><b><span id="law2SEnd">${fixed(sEnd, 1)}</span><small>m</small></b></div>
            </div>
          </div>

          <div class="chart-wrap">
            <div class="chart-head"><span>${L("速度—时间图", "VELOCITY–TIME")}</span><b>v / (m·s⁻¹)</b></div>
            <canvas id="vtChart" aria-label="${escapeHTML(L("速度随时间变化的折线图", "Velocity versus time chart"))}"></canvas>
          </div>
          <div class="launch-meta">
            <span>${L("运行时间", "RUN TIME")} <b class="run-time" id="law2Time">${fixed(sim.law2T, 1)} s</b></span>
            <span>${L("此刻速度", "LIVE SPEED")} <b class="run-time" id="law2LiveV">${fixed(sim.law2V, 1)} m/s</b></span>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary btn-block" type="button" data-action="law2-launch" id="law2LaunchBtn">
              <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4.5 13 9l-7 4.5z" fill="currentColor"/></svg>
              ${L("发车并记录 5 秒", "Launch & record 5 seconds")}
            </button>
          </div>
          <p class="experiment-note">${L(
            "阻力固定为 1.2 kN。为了让变量更清楚，这里不考虑轮胎打滑，且质量保持不变。",
            "Resistance is fixed at 1.2 kN. To isolate the variables, tire slip is ignored and mass stays constant during each run."
          )}</p>
        </section>

        <div class="section-label"><span>${L("此刻的受力", "Forces right now")}</span><em>FREE BODY</em></div>
        <div id="law2ForceMap">${forceMapHTML({ driveN: f, resistN: FRICTION_N, mass: m })}</div>

        <div class="section-label"><span>${L("定律原文", "The law")}</span><em>SECOND LAW</em></div>
        ${lawCardHTML(
          "NEWTON'S SECOND LAW · 牛顿第二定律",
          "物体加速度的大小跟它受到的作用力成正比，跟它的质量成反比；加速度的方向跟作用力的方向相同。",
          "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The acceleration is in the direction of the net force.",
          `<span style="color:var(--accent-deep);font-weight:700">${L("这里的力，指物体受到的合力。", "The force here means the net force on the object.")}</span>`
        )}

        <div class="formula-plate">
          <span class="formula-main"><span class="f-accent">ΣF</span> = m · a</span>
          <span class="formula-caption"><b>UNITS</b>N = kg · m/s²<br>1 kN = 1,000 N</span>
        </div>

        ${noteHTML(
          L("想一想 · 速度大不等于合力大", "Think · Fast motion ≠ large net force"),
          L(
            "一辆高速匀速行驶的车，合力为零。加速度描述速度“变化得多快”，而不是速度“有多大”。",
            "A car cruising at high speed has zero net force. Acceleration describes how quickly velocity changes, not how large the velocity is."
          )
        )}

        ${teacherNotesHTML([
          L("把质量翻倍，让学生预测加速度如何变化，再用滑块验证。", "Double the mass, ask for a prediction, then verify with the slider."),
          L("请学生比较两张 v–t 图：斜率就是加速度。", "Compare two v–t graphs: the slope is the acceleration."),
          L("联系生活：满载货车为什么需要更长的刹车距离？", "Connect to everyday life: why does a loaded truck need a longer braking distance?")
        ])}
      </article>`;
  }

  function pairBoardHTML(config) {
    return `
      <div class="pair-board">
        <div class="pair-row">
          <span class="pair-arrow ${config.actionClass || "is-action"}">${config.actionArrow || "←"}</span>
          <span class="pair-copy"><b>${config.actionTitle}</b><small>${config.actionOn}</small></span>
          <span class="pair-value">${config.value}<small>kN</small></span>
        </div>
        <div class="pair-equal-row"><span>=</span>${L("等大 · 反向 · 同时发生", "EQUAL · OPPOSITE · SIMULTANEOUS")}<span>=</span></div>
        <div class="pair-row">
          <span class="pair-arrow ${config.reactionClass || "is-reaction"}">${config.reactionArrow || "→"}</span>
          <span class="pair-copy"><b>${config.reactionTitle}</b><small>${config.reactionOn}</small></span>
          <span class="pair-value">${config.value}<small>kN</small></span>
        </div>
      </div>`;
  }

  function renderThirdLaw() {
    const isDrive = state.ch3Mode === "drive";
    const pair = isDrive
      ? pairBoardHTML({
          actionArrow: "←",
          actionClass: "is-action",
          actionTitle: L("轮胎对地面", "Tire on road"),
          actionOn: L("作用在地面 / ON THE ROAD", "ON THE ROAD / 作用在地面"),
          reactionArrow: "→",
          reactionClass: "is-reaction",
          reactionTitle: L("地面对轮胎", "Road on tire"),
          reactionOn: L("作用在汽车 / ON THE CAR", "ON THE CAR / 作用在汽车"),
          value: "3.0"
        })
      : pairBoardHTML({
          actionArrow: "→",
          actionClass: "is-action",
          actionTitle: L("汽车 A 对汽车 B", "Car A on car B"),
          actionOn: L("作用在 B 上 / ON CAR B", "ON CAR B / 作用在 B 上"),
          reactionArrow: "←",
          reactionClass: "is-reaction",
          reactionTitle: L("汽车 B 对汽车 A", "Car B on car A"),
          reactionOn: L("作用在 A 上 / ON CAR A", "ON CAR A / 作用在 A 上"),
          value: "12.0"
        });

    return `
      <article class="chapter">
        <div class="chapter-kicker"><span>CHAPTER 04</span><em>${L("牛顿第三定律 · ACTION–REACTION", "NEWTON'S THIRD LAW · ACTION–REACTION")}</em></div>
        <h1 class="chapter-title">
          <span class="title-thin">${L("每一个力，", "Every force")}</span>
          <span class="title-accent">${L("都有搭档。", "has a partner.")}</span>
        </h1>
        <p class="chapter-english">${L("Every force has a partner.", "每一个力，都有搭档。")}</p>
        <p class="chapter-intro">${L(
          "汽车为什么能向前走？轮胎把地面向后推，地面同时把轮胎向前推。这对力<strong>大小相等、方向相反</strong>，却分别作用在不同的物体上。",
          "Why can a car move forward? Its tires push the road backward; the road pushes the tires forward. These forces are <strong>equal and opposite</strong>, but they act on different objects."
        )}</p>

        <div class="section-label"><span>${L("实验台", "Experiment bench")}</span><em>FORCE PAIRS</em></div>
        <section class="experiment-panel">
          ${segmentedHTML(
            [
              { id: "drive", label: L("轮胎与地面", "Tire & road") },
              { id: "collision", label: L("两车碰撞", "Two-car collision") }
            ],
            state.ch3Mode,
            "ch3-demo"
          )}
          ${pair}
          <div class="launch-meta">
            <span>${isDrive ? L("起步状态", "LAUNCH STATUS") : L("碰撞阶段", "IMPACT PHASE")}</span>
            <span class="run-time" id="law3Status">${isDrive ? (sim.law3Running ? L("轮胎正在推地", "TIRES PUSHING ROAD") : L("等待起步", "READY TO LAUNCH")) : L("等待碰撞", "READY")}</span>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary btn-block" type="button" data-action="law3-play" id="law3PlayBtn" ${sim.law3Running || (state.ch3Mode === "collision" && ["approach", "contact", "recoil"].includes(sim.law3Phase)) ? "disabled" : ""}>
              <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4.5 13 9l-7 4.5z" fill="currentColor"/></svg>
              ${isDrive ? L(sim.law3Running ? "加速中…" : "起步，观察一对力", sim.law3Running ? "Accelerating…" : "Launch & watch the pair") : L(sim.law3Phase === "done" ? "再碰撞一次" : "释放两车，观察碰撞", sim.law3Phase === "done" ? "Run collision again" : "Release both cars")}
            </button>
          </div>
          <p class="experiment-note">${isDrive
            ? L("注意看：一个箭头指向地面，另一个箭头指向汽车。等大反向，但它们不能相互抵消。", "Watch: one arrow points at the road, the other at the car. Equal and opposite — but they cannot cancel.")
            : L("两车质量不同。碰撞时它们受到的力等大反向，但较轻的车速度变化更大。", "The cars have different masses. At impact they feel equal and opposite forces, but the lighter car's velocity changes more.")}</p>
        </section>

        <div class="section-label"><span>${L("定律原文", "The law")}</span><em>THIRD LAW</em></div>
        ${lawCardHTML(
          "NEWTON'S THIRD LAW · 牛顿第三定律",
          "两个物体之间的作用力和反作用力总是大小相等、方向相反，作用在同一条直线上。",
          "For every action, there is an equal and opposite reaction. The two forces act on different objects, along the same line, at the same time.",
          `<span style="color:var(--accent-deep);font-weight:700">${L("关键词：两个物体、两个力、不能抵消。", "Key words: two objects, two forces, never cancel.")}</span>`
        )}

        <div class="formula-plate">
          <span class="formula-main"><span class="f-accent">F</span><sub>A→B</sub> = −<span class="f-accent">F</span><sub>B→A</sub></span>
          <span class="formula-caption"><b>PAIR</b>${L("同一直线 · 同一性质 · 同时出现", "same line · same type · simultaneous")}</span>
        </div>

        <div class="pair-rules">
          <span class="rule-chip"><i>1</i><span><b>${L("两个物体", "Two objects")}</b><br>${L("作用力与反作用力分别作用在施力物体和受力物体上。", "Each force acts on a different object.")}</span></span>
          <span class="rule-chip"><i>2</i><span><b>${L("大小相等", "Equal size")}</b><br>${L("与物体的质量、运动状态无关，总是等大。", "Independent of mass or motion.")}</span></span>
          <span class="rule-chip"><i>3</i><span><b>${L("方向相反", "Opposite")}</b><br>${L("沿同一条直线，方向恰好相反。", "Along the same line, opposite directions.")}</span></span>
          <span class="rule-chip"><i>4</i><span><b>${L("不能抵消", "No cancellation")}</b><br>${L("因为作用在不同物体上，不能求合力。", "They are on different objects, so they never add to zero.")}</span></span>
        </div>

        <div class="section-label"><span>${L("最容易混淆的地方", "The classic confusion")}</span><em>PAIR VS BALANCE</em></div>
        <table class="compare-table">
          <thead><tr><th>${L("比较", "Compare")}</th><th>${L("作用力与反作用力", "Action–reaction")}</th><th>${L("平衡力", "Balanced forces")}</th></tr></thead>
          <tbody>
            <tr><td>${L("作用对象", "Objects")}</td><td class="is-good">${L("两个不同物体", "Two different objects")}</td><td>${L("同一个物体", "The same object")}</td></tr>
            <tr><td>${L("能否抵消", "Cancel?")}</td><td class="is-good">${L("不能", "No")}</td><td>${L("能，合力为零", "Yes, net force zero")}</td></tr>
            <tr><td>${L("力的性质", "Type")}</td><td>${L("一定相同", "Always the same")}</td><td>${L("可以不同", "May differ")}</td></tr>
            <tr><td>${L("时间关系", "Timing")}</td><td>${L("同时产生、同时消失", "Simultaneous")}</td><td>${L("同时存在即可", "Coexist")}</td></tr>
          </tbody>
        </table>

        ${noteHTML(
          L("关键区别 · 别把搭档当平衡", "Key idea · A pair is not a balance"),
          L(
            "汽车受到的重力和支持力作用在同一辆车上，是平衡力；轮胎对地面的力和地面对轮胎的力作用在两个物体上，是作用力与反作用力。",
            "Weight and normal force both act on the car, so they can balance. The tire-on-road and road-on-tire forces act on two different objects, so they are an action–reaction pair."
          )
        )}

        ${teacherNotesHTML([
          L("让学生用手推墙，感受墙同时推手；讨论“为什么人没有飞出去”。", "Have students push a wall and feel it push back. Discuss why they do not fly away."),
          L("碰撞演示中暂停在接触瞬间，圈出两个力分别作用在谁身上。", "Pause the collision at contact and circle which object each force acts on."),
          L("强调等大反向不等于平衡：作用在不同物体上的力不能相互抵消。", "Stress that equal-and-opposite does not mean balanced when the forces are on different objects.")
        ])}
      </article>`;
  }

  function renderReview() {
    const score = quizScore();
    const answered = state.quizAnswers.filter((value) => value !== null).length;
    const quizHTML = QUIZ.map((item, questionIndex) => {
      const answer = state.quizAnswers[questionIndex];
      const answeredThis = answer !== null;
      return `
        <div class="quiz-card">
          <div class="quiz-index"><span>Q${String(questionIndex + 1).padStart(2, "0")}</span>${answeredThis ? `<i>${answer === item.correct ? L("答对了", "CORRECT") : L("再想想", "REVIEW")}</i>` : `<span>${L("单选题", "MULTIPLE CHOICE")}</span>`}</div>
          <p class="quiz-question">${L(item.question.zh, item.question.en)}</p>
          <div class="quiz-options">
            ${item.options
              .map((option, optionIndex) => {
                const isSelected = answer === optionIndex;
                const isCorrect = answeredThis && optionIndex === item.correct;
                const isWrong = answeredThis && isSelected && optionIndex !== item.correct;
                return `<button type="button" class="quiz-option ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}" data-action="quiz-answer" data-question="${questionIndex}" data-option="${optionIndex}" ${answeredThis ? "disabled" : ""}>
                  <span class="option-letter">${String.fromCharCode(65 + optionIndex)}</span>
                  <span>${L(option.zh, option.en)}</span>
                </button>`;
              })
              .join("")}
          </div>
          ${answeredThis ? `<div class="quiz-feedback">${L(item.explain.zh, item.explain.en)}</div>` : ""}
        </div>`;
    }).join("");

    return `
      <article class="chapter">
        <div class="chapter-kicker"><span>CHAPTER 05</span><em>${L("总结与课堂挑战 · REVIEW", "REVIEW · 总结与课堂挑战")}</em></div>
        <h1 class="chapter-title">
          <span class="title-thin">${L("三条定律，", "Three laws.")}</span>
          <span class="title-accent">${L("一辆汽车。", "One car.")}</span>
        </h1>
        <p class="chapter-english">${L("Three laws. One car.", "三条定律，一辆汽车。")}</p>
        <p class="chapter-intro">${L(
          "同一辆汽车，起步、匀速、刹车、碰撞——每一个瞬间，都能用牛顿定律解释。现在，把三条定律连成一条完整的因果链。",
          "One car — starting, cruising, braking, colliding. Every moment can be explained by Newton's laws. Now connect all three into one causal story."
        )}</p>

        <div class="summary-stack">
          <div class="summary-card">
            <span class="summary-num">01</span>
            <div><h3>${L("惯性 · 没有合力，速度不变", "Inertia · no net force, no change")}</h3><p>${L("静止的继续静止，运动的继续匀速直线运动。", "At rest stays at rest; in motion stays in motion.")}</p></div>
            <span class="summary-formula">ΣF = 0</span>
          </div>
          <div class="summary-card">
            <span class="summary-num">02</span>
            <div><h3>${L("F = ma · 合力产生加速度", "F = ma · net force causes acceleration")}</h3><p>${L("同样的力，质量越大，加速度越小。", "For the same force, more mass means less acceleration.")}</p></div>
            <span class="summary-formula">ΣF = ma</span>
          </div>
          <div class="summary-card">
            <span class="summary-num">03</span>
            <div><h3>${L("作用与反作用 · 力总是成对", "Action–reaction · forces come in pairs")}</h3><p>${L("等大、反向、作用在不同物体上，不能抵消。", "Equal, opposite, on different objects, never cancel.")}</p></div>
            <span class="summary-formula">F₁₂ = −F₂₁</span>
          </div>
        </div>

        <div class="section-label"><span>${L("课堂挑战", "Check your understanding")}</span><em>${answered} / 4</em></div>
        <div class="quiz-wrap">
          <div class="quiz-score"><span>${L("本轮得分", "SCORE THIS ROUND")} · ${answered}/4 ${L("题已作答", "answered")}</span><strong>${score} / 4</strong></div>
          ${quizHTML}
          <button type="button" class="btn btn-ghost quiz-reset" data-action="quiz-reset">${L("重新作答", "Reset quiz")}</button>
        </div>

        ${teacherNotesHTML([
          L("先让学生独立作答，再用 3D 汽车重演题目中的情景。", "Let students answer independently, then replay the scenario with the 3D car."),
          L("追问：如果汽车质量变成两倍，同样的刹车力会产生什么变化？", "Follow up: if mass doubles, how does the same braking force change the motion?"),
          L("结束前提问：为什么说“力不是维持运动的原因”？请用一辆匀速汽车解释。", "Exit question: why is force not the cause of motion? Explain with a cruising car.")
        ])}

        <p class="closing-line">${L("下一站：把这三条定律，带到每一次乘车、每一次刹车、每一次碰撞里。", "Next stop: take these three laws into every ride, every brake, every collision.")}</p>
      </article>`;
  }

  const RENDERERS = [renderForces, renderFirstLaw, renderSecondLaw, renderThirdLaw, renderReview];

  /* =========================================================
     04 · Shell: language, navigation, chapter lifecycle
     ========================================================= */

  const dom = {
    app: $("#app"),
    lesson: $("#lesson"),
    panelScroll: $("#panelScroll"),
    chapterRoot: $("#chapterRoot"),
    chapterNav: $("#chapterNav"),
    langToggle: $("#langToggle"),
    prevBtn: $("#prevBtn"),
    nextBtn: $("#nextBtn"),
    footerCount: $("#footerCount"),
    stage: $("#stage"),
    canvas: $("#stageCanvas"),
    stageLabels: $("#stageLabels"),
    telemetry: $("#telemetry"),
    forceLegend: $("#forceLegend"),
    sceneCode: $("#sceneCode"),
    sceneTitle: $("#sceneTitle"),
    sceneSubtitle: $("#sceneSubtitle"),
    stageWatermark: $("#stageWatermark"),
    presentBtn: $("#presentBtn"),
    stageLangToggle: $("#stageLangToggle"),
    stageToast: $("#stageToast"),
    impactFlash: $("#impactFlash")
  };

  function applyStaticLanguage() {
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.lang = state.lang;
    document.title = L("牛顿车库 · Newton's Garage — 力与运动 3D 互动课堂", "Newton's Garage — A 3D Interactive Lesson on Forces & Motion");
    $$("[data-zh][data-en]").forEach((element) => {
      element.textContent = element.dataset[state.lang];
    });
    $$(".lang-option").forEach((element) => {
      element.classList.toggle("is-active", element.dataset.langOption === state.lang);
    });
    dom.langToggle.setAttribute("aria-label", L("切换为英文", "Switch to Chinese"));
    dom.langToggle.setAttribute("aria-pressed", String(state.lang === "en"));
    if (dom.stageLangToggle) {
      dom.stageLangToggle.setAttribute("aria-label", L("切换为英文", "Switch to Chinese"));
      dom.stageLangToggle.setAttribute("aria-pressed", String(state.lang === "en"));
    }
  }

  function buildNav() {
    dom.chapterNav.innerHTML = CHAPTERS.map((chapter, index) => {
      const active = index === state.chapter;
      const label = L(chapter.navZh, chapter.navEn);
      return `<button class="nav-step ${active ? "is-active" : ""}" type="button" data-action="go-chapter" data-chapter="${index}" ${active ? 'aria-current="page"' : ""} aria-label="${escapeHTML(L("第", "Chapter ") + (index + 1) + L("章：", ": ") + label)}">
        <b>${pad2(index + 1)}</b>
        <span>${escapeHTML(label)}</span>
      </button>`;
    }).join("");
  }

  function updateChrome() {
    const index = state.chapter;
    dom.footerCount.textContent = `${pad2(index + 1)} / ${pad2(CHAPTERS.length)}`;
    dom.stageWatermark.textContent = pad2(index + 1);
    dom.prevBtn.disabled = index === 0;
    dom.nextBtn.disabled = index === CHAPTERS.length - 1;
    dom.nextBtn.querySelector("span").textContent = index === CHAPTERS.length - 1 ? L("已到终点", "Finish") : L("下一章", "Next");
  }

  function renderChapter(options) {
    const settings = options || {};
    const previousScroll = dom.panelScroll.scrollTop;
    dom.chapterRoot.innerHTML = RENDERERS[state.chapter]();
    updateRangeVisuals();
    drawVTChart();
    updatePanelDynamic();
    if (settings.scrollTop) {
      dom.panelScroll.scrollTop = 0;
    } else if (settings.preserveScroll) {
      window.requestAnimationFrame(() => {
        dom.panelScroll.scrollTop = previousScroll;
      });
    }
    applyStaticLanguageExtras();
  }

  function applyStaticLanguageExtras() {
    /* Keep the language switch readable even after the panel is re-rendered. */
    $$(".lang-option").forEach((element) => {
      element.classList.toggle("is-active", element.dataset.langOption === state.lang);
    });
  }

  function updateRangeVisuals() {
    $$('input[type="range"]').forEach((input) => {
      const min = Number(input.min) || 0;
      const max = Number(input.max) || 100;
      const value = Number(input.value);
      const percentage = ((value - min) / (max - min)) * 100;
      input.style.setProperty("--range-fill", `${clamp(percentage, 0, 100)}%`);
    });
  }

  function setChapter(index, options) {
    const settings = options || {};
    if (index < 0 || index >= CHAPTERS.length || (index === state.chapter && !settings.force)) return;
    state.chapter = index;
    resetChapterSimulation(index);
    buildNav();
    updateChrome();
    renderChapter({ scrollTop: true });
    configureChapterScene({ instantCamera: settings.instantCamera !== false });
    if (settings.updateHash !== false) {
      try {
        window.history.replaceState(null, "", "#" + CHAPTERS[index].id);
      } catch (error) {
        window.location.hash = CHAPTERS[index].id;
      }
    }
  }

  function resetChapterSimulation(index) {
    sim.roadScroll = 0;
    if (index === 0) {
      sim.analysisT = 0;
      sim.analysisSpeed = state.analysisMode === "rest" ? 0 : state.analysisMode === "accelerate" ? 4 : 8;
    }
    if (index === 1) {
      sim.ch1T = 0;
      sim.ch1Running = false;
      sim.ch1Done = false;
      sim.ch1SpeedA = 6;
      sim.ch1SpeedB = 6;
      sim.ch1PosA = -4.4;
      sim.ch1PosB = -4.4;
      sim.passengerAction = null;
      sim.passengerT = 0;
      sim.passengerSpeed = 0;
      sim.passengerLean = 0;
    }
    if (index === 2) {
      sim.law2T = 0;
      sim.law2V = 0;
      sim.law2S = 0;
      sim.law2Running = false;
      sim.law2Done = false;
    }
    if (index === 3) {
      sim.law3Phase = "idle";
      sim.law3T = 0;
      sim.law3CarAX = -9.4;
      sim.law3CarBX = 6.7;
      sim.law3SpeedA = 4;
      sim.law3SpeedB = 2.5;
      sim.law3DriveSpeed = 0;
      sim.law3Running = false;
    }
  }

  function setLanguage(lang) {
    if (lang !== "zh" && lang !== "en") return;
    if (lang === state.lang) return;
    state.lang = lang;
    safeStorageSet("newton-garage-lang", lang);
    applyStaticLanguage();
    buildNav();
    updateChrome();
    renderChapter({ preserveScroll: true });
    updateSceneCopy();
    refreshAllLabelLanguage();
    drawVTChart();
    updatePanelDynamic();
  }

  /* =========================================================
     05 · Chapter panel dynamic values
     ========================================================= */

  function updatePanelDynamic() {
    if (state.chapter === 0) {
      const el = $("#analysisSpeed");
      if (el) el.textContent = fixed(sim.analysisSpeed, 1);
    }

    if (state.chapter === 1) {
      const a = $("#laneSpeedA");
      const b = $("#laneSpeedB");
      const timer = $("#coastTimer");
      if (a) a.textContent = fixed(sim.ch1SpeedA, 1);
      if (b) b.textContent = fixed(sim.ch1SpeedB, 1);
      if (timer) timer.textContent = fixed(sim.ch1T, 1);
      const passenger = $("#passengerSpeed");
      if (passenger) passenger.textContent = fixed(sim.passengerSpeed, 1);
      const passengerStatus = $("#passengerStatusText");
      if (passengerStatus && state.ch1Mode === "passenger") {
        const running = sim.passengerAction && sim.passengerT < (sim.passengerAction === "brake" ? 2.7 : 2.5);
        passengerStatus.textContent = running
          ? L("演示中", "PLAYING")
          : sim.passengerAction
            ? L("演示结束", "COMPLETE")
            : L("待演示", "READY");
      }
    }

    if (state.chapter === 2) {
      const f = sim.law2Force;
      const m = sim.law2Mass;
      const netN = f - FRICTION_N;
      const a = netN / m;
      const vEnd = a * 5;
      const sEnd = 0.5 * a * 25;
      const netEq = $("#law2NetEq");
      const accel = $("#law2Accel");
      const vFinal = $("#law2VEnd");
      const sFinal = $("#law2SEnd");
      const time = $("#law2Time");
      const liveV = $("#law2LiveV");
      if (netEq) netEq.textContent = fixed(netN / 1000, 2) + " kN";
      if (accel) accel.textContent = fixed(a, 1);
      if (vFinal) vFinal.textContent = fixed(vEnd, 1);
      if (sFinal) sFinal.textContent = fixed(sEnd, 1);
      if (time) time.textContent = fixed(sim.law2T, 1) + " s";
      if (liveV) liveV.textContent = fixed(sim.law2V, 1) + " m/s";
      drawVTChart();
      const status = $("#law2StatusText");
      if (status) {
        status.textContent = sim.law2Running ? L("运行中", "RUNNING") : sim.law2Done ? L("记录完成", "COMPLETE") : L("可调参数", "LIVE");
      }
      const launch = $("#law2LaunchBtn");
      if (launch) {
        launch.disabled = sim.law2Running;
        launch.innerHTML = sim.law2Running
          ? `<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4.5 13 9l-7 4.5z" fill="currentColor"/></svg>${L("正在记录…", "Recording…")}`
          : sim.law2Done
            ? `<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4.5 13 9l-7 4.5z" fill="currentColor"/></svg>${L("再跑一次", "Run again")}`
            : `<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4.5 13 9l-7 4.5z" fill="currentColor"/></svg>${L("发车并记录 5 秒", "Launch & record 5 seconds")}`;
      }
    }

    if (state.chapter === 3) {
      const status = $("#law3Status");
      if (status) {
        if (state.ch3Mode === "drive") {
          status.textContent = sim.law3Running ? L("轮胎正在推地", "TIRES PUSHING ROAD") : sim.law3DriveSpeed > 0.02 ? L("已起步", "LAUNCHED") : L("等待起步", "READY TO LAUNCH");
        } else {
          status.textContent =
            sim.law3Phase === "approach"
              ? L("接近中", "APPROACHING")
              : sim.law3Phase === "contact"
                ? L("碰撞瞬间", "AT IMPACT")
                : sim.law3Phase === "recoil"
                  ? L("反弹", "REBOUND")
                  : sim.law3Phase === "done"
                    ? L("碰撞完成", "COMPLETE")
                    : L("等待碰撞", "READY");
        }
      }
      const play = $("#law3PlayBtn");
      if (play) {
        const busy = sim.law3Running || (state.ch3Mode === "collision" && ["approach", "contact", "recoil"].includes(sim.law3Phase));
        play.disabled = busy;
        if (state.ch3Mode === "drive") {
          play.innerHTML = `<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4.5 13 9l-7 4.5z" fill="currentColor"/></svg>${sim.law3Running ? L("加速中…", "Accelerating…") : L("起步，观察一对力", "Launch & watch the pair")}`;
        } else {
          play.innerHTML = `<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4.5 13 9l-7 4.5z" fill="currentColor"/></svg>${sim.law3Phase === "done" ? L("再碰撞一次", "Run collision again") : L("释放两车，观察碰撞", "Release both cars")}`;
        }
      }
    }
  }

  function refreshSecondLawForceMap() {
    const holder = $("#law2ForceMap");
    if (holder) {
      holder.innerHTML = forceMapHTML({
        driveN: sim.law2Force,
        resistN: FRICTION_N,
        mass: sim.law2Mass
      });
    }
  }

  function startCoastRun() {
    sim.ch1Running = true;
    sim.ch1Done = false;
    sim.ch1T = 0;
    sim.ch1SpeedA = 6;
    sim.ch1SpeedB = 6;
    sim.ch1PosA = -4.4;
    sim.ch1PosB = -4.4;
    renderChapter({ preserveScroll: true });
    configureChapterScene({ preserveCamera: true });
    updatePanelDynamic();
  }

  function resetCoastRun() {
    sim.ch1Running = false;
    sim.ch1Done = false;
    sim.ch1T = 0;
    sim.ch1SpeedA = 6;
    sim.ch1SpeedB = 6;
    sim.ch1PosA = -4.4;
    sim.ch1PosB = -4.4;
    configureChapterScene({ preserveCamera: true });
    renderChapter({ preserveScroll: true });
  }

  function startPassengerAction(kind) {
    sim.passengerAction = kind;
    sim.passengerT = 0;
    sim.passengerSpeed = kind === "brake" ? 8 : 0;
    sim.passengerLean = 0;
    renderChapter({ preserveScroll: true });
    configureChapterScene({ preserveCamera: true });
    updatePanelDynamic();
  }

  function startLaw2() {
    sim.law2T = 0;
    sim.law2V = 0;
    sim.law2S = 0;
    sim.law2Done = false;
    sim.law2Running = true;
    updatePanelDynamic();
    configureLaw2Forces();
    updateHudValues();
  }

  function resetLaw2Sim() {
    sim.law2T = 0;
    sim.law2V = 0;
    sim.law2S = 0;
    sim.law2Running = false;
    sim.law2Done = false;
  }

  function startLaw3() {
    if (state.ch3Mode === "drive") {
      sim.law3Running = true;
      sim.law3T = 0;
      sim.law3DriveSpeed = 0;
      configureChapterScene({ preserveCamera: true });
      renderChapter({ preserveScroll: true });
    } else {
      sim.law3Phase = "approach";
      sim.law3T = 0;
      sim.law3CarAX = -9.4;
      sim.law3CarBX = 6.7;
      configureChapterScene({ preserveCamera: true });
      setCameraPreset("thirdCrashWide", false);
      renderChapter({ preserveScroll: true });
    }
  }

  function setAnalysisMode(mode) {
    if (!["rest", "cruise", "accelerate"].includes(mode) || mode === state.analysisMode) return;
    state.analysisMode = mode;
    sim.analysisT = 0;
    sim.analysisSpeed = mode === "rest" ? 0 : mode === "accelerate" ? 4 : 8;
    renderChapter({ preserveScroll: true });
    configureChapterScene({ preserveCamera: true });
  }

  function setCh1Mode(mode) {
    if (!["coast", "passenger"].includes(mode) || mode === state.ch1Mode) return;
    state.ch1Mode = mode;
    sim.ch1Running = false;
    sim.ch1Done = false;
    sim.ch1T = 0;
    sim.ch1SpeedA = 6;
    sim.ch1SpeedB = 6;
    sim.passengerAction = null;
    sim.passengerT = 0;
    sim.passengerSpeed = 0;
    sim.passengerLean = 0;
    renderChapter({ preserveScroll: true });
    configureChapterScene({ instantCamera: false });
  }

  function setCh3Mode(mode) {
    if (!["drive", "collision"].includes(mode) || mode === state.ch3Mode) return;
    state.ch3Mode = mode;
    sim.law3Phase = "idle";
    sim.law3T = 0;
    sim.law3Running = false;
    sim.law3DriveSpeed = 0;
    sim.law3CarAX = -9.4;
    sim.law3CarBX = 6.7;
    renderChapter({ preserveScroll: true });
    configureChapterScene({ instantCamera: false });
  }

  /* =========================================================
     06 · Chart
     ========================================================= */

  function drawVTChart() {
    if (state.chapter !== 2) return;
    const canvas = $("#vtChart");
    if (!canvas) return;
    const width = canvas.clientWidth || 340;
    const height = canvas.clientHeight || 105;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const a = (sim.law2Force - FRICTION_N) / sim.law2Mass;
    const predicted = Math.max(1, a * 5);
    let yMax = predicted <= 10 ? Math.ceil(predicted / 2) * 2 : predicted <= 30 ? Math.ceil(predicted / 5) * 5 : Math.ceil(predicted / 10) * 10;
    const left = 26;
    const right = 6;
    const top = 8;
    const bottom = 18;
    const plotW = width - left - right;
    const plotH = height - top - bottom;
    const x = (t) => left + (t / 5) * plotW;
    const y = (v) => top + plotH - (v / yMax) * plotH;

    ctx.font = '7px "SFMono-Regular", Menlo, monospace';
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.strokeStyle = "rgba(23,21,17,.09)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i += 1) {
      const level = (yMax / 3) * i;
      const yy = y(level);
      ctx.beginPath();
      ctx.moveTo(left, yy + 0.5);
      ctx.lineTo(width - right, yy + 0.5);
      ctx.stroke();
      ctx.fillStyle = "rgba(117,109,95,.72)";
      ctx.fillText(String(Math.round(level)), left - 5, yy);
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(117,109,95,.72)";
    ctx.fillText("0", left, height - 7);
    ctx.fillText("2.5", left + plotW / 2, height - 7);
    ctx.fillText("5 s", left + plotW, height - 7);

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(230,90,43,.45)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x(0), y(0));
    ctx.lineTo(x(5), y(predicted));
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = "#171511";
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x(0), y(0));
    ctx.lineTo(x(clamp(sim.law2T, 0, 5)), y(clamp(sim.law2V, 0, yMax)));
    ctx.stroke();

    ctx.fillStyle = "#e65a2b";
    ctx.beginPath();
    ctx.arc(x(clamp(sim.law2T, 0, 5)), y(clamp(sim.law2V, 0, yMax)), 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(117,109,95,.72)";
    ctx.font = '7px "SFMono-Regular", Menlo, monospace';
    ctx.fillText("t", width - right, height - 7);
  }

  /* =========================================================
     07 · 3D world
     ========================================================= */

  const CAMERA_PRESETS = {
    forces: { azim: 0.63, elev: 0.26, radius: 12.8, target: [0, 1.0, 2.1] },
    firstCoast: { azim: 0.38, elev: 0.36, radius: 20.5, target: [0.7, 0.78, 0.2] },
    passenger: { azim: 0.58, elev: 0.15, radius: 9.8, target: [0, 0.98, 2.5] },
    second: { azim: 0.7, elev: 0.22, radius: 11.8, target: [0, 0.9, 2.2] },
    thirdDrive: { azim: 0.38, elev: 0.14, radius: 11.4, target: [0.1, 0.78, 2.5] },
    thirdCrashWide: { azim: 0.27, elev: 0.36, radius: 21.5, target: [0, 0.75, 1.5] },
    thirdCrashContact: { azim: 0.46, elev: 0.23, radius: 14.2, target: [0, 0.8, 2.3] },
    review: { azim: 0.62, elev: 0.29, radius: 14.5, target: [0, 1.05, 2.15] }
  };

  const world = {
    ready: false,
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    envMap: null,
    roadTexture: null,
    forceGroup: null,
    carA: null,
    carB: null,
    sparks: null,
    sparkState: null,
    labels: {
      force: new Map(),
      screen: new Map()
    },
    cameraRig: {
      azim: 0.63,
      elev: 0.26,
      radius: 12.8,
      target: null,
      goalAzim: 0.63,
      goalElev: 0.26,
      goalRadius: 12.8,
      goalTarget: null,
      fit: 1,
      autoOrbit: false
    },
    pointer: {
      dragging: false,
      id: null,
      lastX: 0,
      lastY: 0
    },
    uiAccumulator: 0
  };

  function makeCanvasTexture(width, height, painter) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (context) painter(context, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    return texture;
  }

  function makeEnvironmentMap() {
    const faces = [];
    for (let i = 0; i < 6; i += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 96, 96);
      gradient.addColorStop(0, i < 3 ? "#253845" : "#0b151e");
      gradient.addColorStop(0.48, i === 4 ? "#5a3727" : "#101e29");
      gradient.addColorStop(1, i === 5 ? "#9a5735" : "#050b10");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 96, 96);
      const glow = ctx.createRadialGradient(i === 2 ? 38 : 68, 28, 1, i === 2 ? 38 : 68, 28, 34);
      glow.addColorStop(0, i === 2 ? "rgba(255,204,155,.8)" : "rgba(115,198,210,.4)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 96, 96);
      faces.push(canvas);
    }
    const texture = new THREE.CubeTexture(faces);
    texture.needsUpdate = true;
    texture.encoding = THREE.sRGBEncoding;
    return texture;
  }

  function makeRadialTexture() {
    return makeCanvasTexture(256, 256, (context, width, height) => {
      const gradient = context.createRadialGradient(width / 2, height / 2, 2, width / 2, height / 2, width / 2);
      gradient.addColorStop(0, "rgba(0,0,0,.74)");
      gradient.addColorStop(0.45, "rgba(0,0,0,.44)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    });
  }

  function makeGlowTexture() {
    return makeCanvasTexture(512, 512, (context, width, height) => {
      const gradient = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.5);
      gradient.addColorStop(0, "rgba(255,176,118,.8)");
      gradient.addColorStop(0.18, "rgba(237,116,67,.38)");
      gradient.addColorStop(0.48, "rgba(157,68,45,.1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    });
  }

  function makeCoolGlowTexture() {
    return makeCanvasTexture(512, 512, (context, width, height) => {
      const gradient = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.5);
      gradient.addColorStop(0, "rgba(80,190,200,.36)");
      gradient.addColorStop(0.3, "rgba(48,119,143,.16)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    });
  }

  function makeRoadTexture() {
    return makeCanvasTexture(1024, 256, (context, width, height) => {
      const base = context.createLinearGradient(0, 0, 0, height);
      base.addColorStop(0, "#15222a");
      base.addColorStop(0.5, "#0f1b22");
      base.addColorStop(1, "#111e25");
      context.fillStyle = base;
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < 2100; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const light = Math.random() > 0.5;
        context.fillStyle = light ? "rgba(200,217,218,.065)" : "rgba(0,0,0,.16)";
        const size = Math.random() * 1.5 + 0.35;
        context.fillRect(x, y, size, size * 0.7);
      }

      context.fillStyle = "rgba(0,0,0,.13)";
      context.fillRect(0, 52, width, 10);
      context.fillRect(0, 194, width, 10);
      context.fillStyle = "rgba(0,0,0,.1)";
      context.fillRect(0, 94, width, 26);
      context.fillRect(0, 154, width, 26);

      context.fillStyle = "rgba(226,237,232,.44)";
      context.fillRect(0, 17, width, 3);
      context.fillRect(0, 236, width, 3);
      context.fillStyle = "rgba(228,181,122,.58)";
      context.fillRect(0, 23, width, 1);
      context.fillRect(0, 232, width, 1);

      context.fillStyle = "rgba(230,235,226,.5)";
      for (let x = 8; x < width; x += 148) {
        context.fillRect(x, 126, 68, 3);
      }

      context.fillStyle = "rgba(230,90,43,.2)";
      context.fillRect(0, 82, width, 1);
      context.fillRect(0, 174, width, 1);
    });
  }

  function makeSignTexture() {
    return makeCanvasTexture(768, 192, (context, width, height) => {
      context.fillStyle = "#0b151c";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "rgba(239,107,58,.8)";
      context.lineWidth = 4;
      context.strokeRect(10, 10, width - 20, height - 20);
      context.fillStyle = "#f2ede3";
      context.font = "600 48px SFMono-Regular, Menlo, monospace";
      context.fillText("NEWTON TEST TRACK", 46, 78);
      context.fillStyle = "rgba(242,237,227,.52)";
      context.font = '500 22px "SFMono-Regular", Menlo, monospace';
      context.fillText("FORCE LAB · N° 07 · 力学实验室", 48, 126);
      context.fillStyle = "#ef6b3a";
      context.fillRect(48, 145, 224, 5);
    });
  }

  function setCarPose(car, x, z, rotationY) {
    if (!car) return;
    car.group.position.set(x, 0, z);
    car.group.rotation.y = rotationY == null ? 0 : rotationY;
  }

  function carPoint(car, x, y, z) {
    return car.group.localToWorld(new THREE.Vector3(x, y, z));
  }

  function carDirection(car, x, y, z) {
    return new THREE.Vector3(x, y, z).applyQuaternion(car.group.quaternion).normalize();
  }

  function createCarModel(options) {
    const opts = options || {};
    const paintColor = opts.color == null ? 0xe96839 : opts.color;
    const car = new THREE.Group();
    const paint = new THREE.MeshPhysicalMaterial({
      color: paintColor,
      metalness: 0.48,
      roughness: 0.27,
      clearcoat: 0.82,
      clearcoatRoughness: 0.18,
      envMap: world.envMap,
      envMapIntensity: 0.9,
      emissive: new THREE.Color(paintColor).multiplyScalar(0.012)
    });
    const darkPaint = new THREE.MeshStandardMaterial({
      color: 0x171a1b,
      metalness: 0.35,
      roughness: 0.42,
      envMap: world.envMap,
      envMapIntensity: 0.45
    });
    const trim = new THREE.MeshStandardMaterial({
      color: 0x080c0e,
      metalness: 0.2,
      roughness: 0.7
    });
    const steel = new THREE.MeshStandardMaterial({
      color: 0x879298,
      metalness: 0.95,
      roughness: 0.24,
      envMap: world.envMap,
      envMapIntensity: 0.85
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x07090a,
      metalness: 0.05,
      roughness: 0.96
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x071319,
      metalness: 0.25,
      roughness: 0.08,
      transparent: true,
      opacity: 0.58,
      side: THREE.DoubleSide,
      envMap: world.envMap,
      envMapIntensity: 0.9,
      depthWrite: false
    });
    const headMat = new THREE.MeshBasicMaterial({ color: 0xfff1cf });
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff3f21 });
    const tailMats = [tailMat];
    const headMats = [headMat];

    /* Body silhouette: +X is forward. */
    const shape = new THREE.Shape();
    shape.moveTo(2.18, 0.26);
    shape.lineTo(2.25, 0.52);
    shape.quadraticCurveTo(2.27, 0.79, 2.02, 0.88);
    shape.lineTo(1.62, 0.95);
    shape.lineTo(1.2, 1.07);
    shape.lineTo(0.68, 1.42);
    shape.quadraticCurveTo(0.45, 1.48, 0.12, 1.48);
    shape.quadraticCurveTo(-0.55, 1.48, -1.02, 1.35);
    shape.lineTo(-1.62, 0.99);
    shape.quadraticCurveTo(-1.92, 0.93, -2.08, 0.92);
    shape.quadraticCurveTo(-2.24, 0.89, -2.25, 0.68);
    shape.lineTo(-2.18, 0.28);
    shape.lineTo(-1.98, 0.2);
    shape.lineTo(1.96, 0.2);
    shape.closePath();

    const windowOutline = [
      [1.0, 0.94],
      [-1.42, 0.9],
      [-1.3, 1.11],
      [-0.55, 1.25],
      [0.3, 1.22]
    ];
    const windowHole = new THREE.Path();
    windowHole.moveTo(windowOutline[0][0], windowOutline[0][1]);
    windowOutline.slice(1).forEach((point) => windowHole.lineTo(point[0], point[1]));
    windowHole.closePath();
    shape.holes.push(windowHole);

    const bodyGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: 1.64,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2,
      curveSegments: 12,
      steps: 1
    });
    bodyGeometry.translate(0, 0, -0.82);
    bodyGeometry.computeVertexNormals();
    const body = new THREE.Mesh(bodyGeometry, paint);
    body.castShadow = true;
    body.receiveShadow = true;
    car.add(body);

    const underbody = new THREE.Mesh(new THREE.BoxGeometry(3.78, 0.14, 1.42), trim);
    underbody.position.set(0, 0.19, 0);
    car.add(underbody);

    /* Tinted side glazing over the cut-through window opening. */
    const windowShape = new THREE.Shape();
    windowShape.moveTo(windowOutline[0][0], windowOutline[0][1]);
    windowOutline.slice(1).forEach((point) => windowShape.lineTo(point[0], point[1]));
    windowShape.closePath();
    const glassGeometry = new THREE.ShapeGeometry(windowShape, 10);
    const glassMaterials = [];
    [-1, 1].forEach((side) => {
      const material = glassMat.clone();
      material.opacity = 0.72;
      glassMaterials.push(material);
      const glass = new THREE.Mesh(glassGeometry, material);
      glass.position.z = side * 0.844;
      glass.renderOrder = 2;
      car.add(glass);
    });

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 1.42), glassMat.clone());
    windshield.material.opacity = 0.7;
    windshield.position.set(0.94, 1.245, 0);
    windshield.rotation.z = 0.56;
    car.add(windshield);

    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.022, 1.34), glassMat.clone());
    rearGlass.material.opacity = 0.72;
    rearGlass.position.set(-1.31, 1.18, 0);
    rearGlass.rotation.z = -0.46;
    car.add(rearGlass);

    const bPillar = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.48, 0.04), darkPaint);
    [-1, 1].forEach((side) => {
      const pillar = bPillar.clone();
      pillar.position.set(-0.61, 1.06, side * 0.855);
      car.add(pillar);
    });

    const trimLineMaterial = new THREE.LineBasicMaterial({ color: 0x071014, transparent: true, opacity: 0.75 });
    [-1, 1].forEach((side) => {
      const points = windowOutline.map((point) => new THREE.Vector3(point[0], point[1], side * 0.861));
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), trimLineMaterial);
      car.add(line);
    });

    /* Front and rear details. */
    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.82), trim);
    grille.position.set(2.225, 0.43, 0);
    car.add(grille);

    [-1, 1].forEach((side) => {
      const light = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.105, 0.52), headMat);
      light.position.set(2.235, 0.66, side * 0.68);
      light.rotation.z = -0.08;
      car.add(light);

      const sideLight = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.092, 0.035), headMat);
      sideLight.position.set(2.05, 0.68, side * 0.845);
      sideLight.rotation.y = side * 0.18;
      car.add(sideLight);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.13, 0.48), tailMat);
      tail.position.set(-2.225, 0.69, side * 0.68);
      car.add(tail);

      const tailSide = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.105, 0.032), tailMat);
      tailSide.position.set(-2.06, 0.72, side * 0.845);
      tailSide.rotation.y = -side * 0.16;
      car.add(tailSide);

      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.075, 0.23), paint);
      mirror.position.set(0.58, 1.015, side * 0.91);
      mirror.rotation.x = side * 0.1;
      car.add(mirror);
    });

    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.14, 0.38), new THREE.MeshStandardMaterial({ color: 0xd7d0bd, roughness: 0.7 }));
    plate.position.set(-2.205, 0.46, 0);
    car.add(plate);

    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.055, 1.24), darkPaint);
    spoiler.position.set(-2.02, 1.02, 0);
    spoiler.rotation.z = -0.08;
    car.add(spoiler);

    const doorSeamMaterial = new THREE.LineBasicMaterial({ color: 0x4b1a0d, transparent: true, opacity: 0.45 });
    [-1, 1].forEach((side) => {
      const seamPoints = [
        new THREE.Vector3(0.42, 0.29, side * 0.869),
        new THREE.Vector3(0.34, 1.08, side * 0.869),
        new THREE.Vector3(0.88, 1.06, side * 0.869)
      ];
      const seam = new THREE.Line(new THREE.BufferGeometry().setFromPoints(seamPoints), doorSeamMaterial);
      car.add(seam);

      const rocker = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.09, 0.032), trim);
      rocker.position.set(0.02, 0.3, side * 0.858);
      car.add(rocker);

      const pinstripe = new THREE.Mesh(
        new THREE.BoxGeometry(2.7, 0.015, 0.012),
        new THREE.MeshBasicMaterial({ color: 0xf3e1c7, transparent: true, opacity: 0.55 })
      );
      pinstripe.position.set(0.1, 0.52, side * 0.874);
      car.add(pinstripe);

      [0.78, -0.86].forEach((hx) => {
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.02), darkPaint);
        handle.position.set(hx, 0.83, side * 0.872);
        car.add(handle);
      });
    });

    /* Wheels */
    const wheels = [];
    function addWheel(x, z) {
      const side = Math.sign(z);
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.43, z);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.32, 24, 1), tireMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      pivot.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.245, 0.335, 18), steel);
      rim.rotation.x = Math.PI / 2;
      pivot.add(rim);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.178, 0.022, 8, 24), steel);
      ring.position.z = side * 0.171;
      pivot.add(ring);

      for (let i = 0; i < 3; i += 1) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.31, 0.018), steel);
        spoke.position.z = side * 0.173;
        spoke.rotation.z = (i / 3) * Math.PI;
        pivot.add(spoke);
      }

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.35, 12), darkPaint);
      hub.rotation.x = Math.PI / 2;
      pivot.add(hub);
      pivot.userData.side = side;
      car.add(pivot);
      wheels.push(pivot);
    }
    addWheel(1.38, 0.9);
    addWheel(1.38, -0.9);
    addWheel(-1.38, 0.9);
    addWheel(-1.38, -0.9);

    const tyreArchMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0e10, metalness: 0.45, roughness: 0.55 });
    [-1, 1].forEach((side) => {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.035, 6, 22, Math.PI), tyreArchMaterial);
      arch.position.set(1.38, 0.43, side * 0.86);
      arch.rotation.z = Math.PI;
      car.add(arch);
      const rearArch = arch.clone();
      rearArch.position.x = -1.38;
      car.add(rearArch);
    });

    /* Seats and a crash-test style passenger, visible through the glazing. */
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x22201d, roughness: 0.72 });
    const seat = new THREE.Group();
    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.4), seatMaterial);
    seatBase.position.set(-0.06, 0.58, 0.38);
    seat.add(seatBase);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.54, 0.4), seatMaterial);
    seatBack.position.set(-0.33, 0.86, 0.38);
    seatBack.rotation.z = 0.13;
    seat.add(seatBack);
    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.23), seatMaterial);
    headrest.position.set(-0.4, 1.2, 0.38);
    seat.add(headrest);
    seat.visible = !!opts.withInterior;
    car.add(seat);

    const dummy = new THREE.Group();
    dummy.position.set(-0.08, 0.63, 0.43);
    dummy.scale.setScalar(1.08);
    const suit = new THREE.MeshStandardMaterial({ color: 0xffb335, emissive: 0x6b3200, emissiveIntensity: 0.38, roughness: 0.55, metalness: 0.04 });
    const skin = new THREE.MeshStandardMaterial({ color: 0xffdcb0, emissive: 0x4a270b, emissiveIntensity: 0.28, roughness: 0.62 });
    const visor = new THREE.MeshStandardMaterial({ color: 0x171511, roughness: 0.35 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.4, 0.31), suit);
    torso.position.y = 0.22;
    torso.castShadow = true;
    dummy.add(torso);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.08, 10), skin);
    neck.position.y = 0.45;
    dummy.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.135, 18, 14), skin);
    head.position.y = 0.57;
    head.castShadow = true;
    dummy.add(head);
    const headBand = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.07, 0.22), visor);
    headBand.position.set(0.127, 0.585, 0);
    dummy.add(headBand);
    [-1, 1].forEach((side) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.28, 0.075), suit);
      arm.position.set(0.015, 0.22, side * 0.195);
      arm.rotation.x = side * 0.12;
      dummy.add(arm);
    });
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.5, 0.026), new THREE.MeshStandardMaterial({ color: 0xffb15f, roughness: 0.48 }));
    belt.position.set(0.105, 0.25, 0.177);
    belt.rotation.z = -0.52;
    belt.visible = false;
    dummy.add(belt);
    dummy.visible = false;
    car.add(dummy);

    const cabinLight = new THREE.PointLight(0xffd7a3, 0.72, 2.7, 2);
    cabinLight.position.set(0.05, 1.28, 0.4);
    car.add(cabinLight);

    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.7, 2.75),
      new THREE.MeshBasicMaterial({
        map: makeRadialTexture(),
        transparent: true,
        opacity: 0.78,
        depthWrite: false
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.014;
    contactShadow.renderOrder = 1;
    car.add(contactShadow);

    car.traverse((object) => {
      if (object.isMesh && object !== contactShadow) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    car.visible = true;

    return {
      group: car,
      wheels: wheels,
      glassMaterials: glassMaterials,
      dummy: dummy,
      belt: belt,
      seat: seat,
      tailMats: tailMats,
      headMats: headMats,
      paintMaterial: paint,
      contactShadow: contactShadow,
      color: paintColor
    };
  }

  function addEnvironment(scene) {
    const env = new THREE.Group();
    scene.add(env);

    const skyTexture = makeGlowTexture();
    const sky = new THREE.Sprite(new THREE.SpriteMaterial({
      map: skyTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      fog: false
    }));
    sky.scale.set(50, 34, 1);
    sky.position.set(-18, 12, -42);
    env.add(sky);

    const coolTexture = makeCoolGlowTexture();
    const coolGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: coolTexture,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false
    }));
    coolGlow.scale.set(62, 30, 1);
    coolGlow.position.set(25, 8, -46);
    env.add(coolGlow);

    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x07131b,
      roughness: 0.94,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 120), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.065;
    ground.receiveShadow = true;
    env.add(ground);

    const grid = new THREE.GridHelper(120, 60, 0x195566, 0x0d2730);
    grid.position.y = -0.03;
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    grid.material.depthWrite = false;
    env.add(grid);

    world.roadTexture = makeRoadTexture();
    world.roadTexture.wrapS = THREE.RepeatWrapping;
    world.roadTexture.wrapT = THREE.ClampToEdgeWrapping;
    world.roadTexture.repeat.set(5, 1);
    world.roadTexture.anisotropy = Math.min(8, world.renderer.capabilities.getMaxAnisotropy());

    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: world.roadTexture,
      roughness: 0.69,
      metalness: 0.18
    });
    const road = new THREE.Mesh(new THREE.PlaneGeometry(100, 12.4), roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.006;
    road.receiveShadow = true;
    env.add(road);

    [-1, 1].forEach((side) => {
      const edgeLight = new THREE.Mesh(
        new THREE.BoxGeometry(100, 0.012, 0.045),
        new THREE.MeshBasicMaterial({ color: 0xd77c4c, transparent: true, opacity: 0.55 })
      );
      edgeLight.position.set(0, 0.023, side * 6.17);
      env.add(edgeLight);
    });

    const railMaterial = new THREE.MeshStandardMaterial({
      color: 0x28363d,
      metalness: 0.82,
      roughness: 0.34,
      envMap: world.envMap,
      envMapIntensity: 0.6
    });
    [-1, 1].forEach((side) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(100, 0.12, 0.14), railMaterial);
      rail.position.set(0, 0.6, side * 7.2);
      rail.castShadow = true;
      env.add(rail);
      const railGlow = new THREE.Mesh(
        new THREE.BoxGeometry(100, 0.015, 0.025),
        new THREE.MeshBasicMaterial({ color: 0xd08b5a, transparent: true, opacity: 0.6 })
      );
      railGlow.position.set(0, 0.68, side * 7.2);
      env.add(railGlow);
      for (let x = -44; x <= 44; x += 8) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), trimPostMaterial());
        post.position.set(x, 0.3, side * 7.28);
        post.castShadow = true;
        env.add(post);
      }
    });

    function trimPostMaterial() {
      return new THREE.MeshStandardMaterial({ color: 0x1b282f, roughness: 0.55, metalness: 0.55 });
    }

    /* Edge bollards with warm reflectors. */
    for (let x = -40; x <= 40; x += 8) {
      [-1, 1].forEach((side) => {
        const bollard = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.48, 0.09), new THREE.MeshStandardMaterial({ color: 0x2a353a, roughness: 0.6, metalness: 0.4 }));
        bollard.position.set(x + (side > 0 ? 3.7 : 0), 0.24, side * 6.7);
        env.add(bollard);
        const reflector = new THREE.Mesh(
          new THREE.BoxGeometry(0.13, 0.07, 0.1),
          new THREE.MeshBasicMaterial({ color: 0xe7a05e })
        );
        reflector.position.set(x + (side > 0 ? 3.7 : 0), 0.44, side * 6.7);
        env.add(reflector);
      });
    }

    /* Overhead gantry. */
    const gantry = new THREE.Group();
    gantry.position.x = -16;
    const gantryMaterial = new THREE.MeshStandardMaterial({ color: 0x1e2b32, metalness: 0.75, roughness: 0.4, envMap: world.envMap, envMapIntensity: 0.45 });
    [-1, 1].forEach((side) => {
      const column = new THREE.Mesh(new THREE.BoxGeometry(0.24, 6.1, 0.24), gantryMaterial);
      column.position.set(0, 3.05, side * 7.55);
      column.castShadow = true;
      gantry.add(column);
    });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 15.4), gantryMaterial);
    beam.position.set(0, 6.0, 0);
    gantry.add(beam);
    const gantryGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.05, 14.7),
      new THREE.MeshBasicMaterial({ color: 0xf0a36e, transparent: true, opacity: 0.78 })
    );
    gantryGlow.position.set(0.15, 5.84, 0);
    gantry.add(gantryGlow);
    env.add(gantry);

    /* A few poolside light poles. */
    function addLightPole(x, z) {
      const pole = new THREE.Group();
      pole.position.set(x, 0, z);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.095, 5.1, 8), gantryMaterial);
      mast.position.y = 2.55;
      mast.castShadow = true;
      pole.add(mast);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 1.8), gantryMaterial);
      arm.position.set(0, 5.0, -Math.sign(z) * 0.85);
      pole.add(arm);
      const lamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.08, 0.48),
        new THREE.MeshBasicMaterial({ color: 0xffcf9b })
      );
      lamp.position.set(0, 4.9, -Math.sign(z) * 1.65);
      pole.add(lamp);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        color: 0xffb573,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }));
      halo.scale.set(3.8, 3.8, 1);
      halo.position.set(0, 4.7, -Math.sign(z) * 1.65);
      pole.add(halo);
      env.add(pole);
      const light = new THREE.PointLight(0xffb57b, 0.7, 13, 2);
      light.position.set(0, 4.6, -Math.sign(z) * 1.5);
      pole.add(light);
    }
    addLightPole(-19, 10.2);
    addLightPole(18, -10.2);

    /* Distant architectural silhouettes. */
    const cityMaterial = new THREE.MeshStandardMaterial({ color: 0x051017, roughness: 0.96, metalness: 0.1 });
    for (let i = 0; i < 13; i += 1) {
      const height = 2.5 + Math.random() * 5.8;
      const width = 1.5 + Math.random() * 3;
      const block = new THREE.Mesh(new THREE.BoxGeometry(width, height, 1.5 + Math.random() * 2), cityMaterial);
      block.position.set(-38 + i * 6.3, height / 2 - 0.2, -34 - Math.random() * 10);
      env.add(block);
      if (i % 3 === 0) {
        const window = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.9, 0.05),
          new THREE.MeshBasicMaterial({ color: 0xdd8e5b, transparent: true, opacity: 0.64 })
        );
        window.position.set(block.position.x + width / 2 + 0.03, height * 0.58, block.position.z);
        env.add(window);
      }
    }

    /* Atmospheric dust. */
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 56;
      particlePositions[i * 3 + 1] = Math.random() * 11 + 0.3;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 32;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
      color: 0x9db8c2,
      size: 0.035,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    env.add(particles);

    return env;
  }

  function initWorld() {
    if (!window.THREE) {
      showStageToast(L("3D 引擎没有加载。讲义仍可使用。", "The 3D engine did not load. The lesson notes are still available."), 6000);
      return false;
    }
    try {
      world.renderer = new THREE.WebGLRenderer({
        canvas: dom.canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      world.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      world.renderer.setClearColor(0x000000, 0);
      world.renderer.outputEncoding = THREE.sRGBEncoding;
      world.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      world.renderer.toneMappingExposure = 0.82;
      world.renderer.shadowMap.enabled = true;
      world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      world.scene = new THREE.Scene();
      world.scene.fog = new THREE.Fog(0x050d13, 19, 62);
      world.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 180);
      world.envMap = makeEnvironmentMap();
      world.clock = new THREE.Clock();

      const rig = world.cameraRig;
      rig.target = new THREE.Vector3(0, 1, 2.1);
      rig.goalTarget = rig.target.clone();

      world.forceGroup = new THREE.Group();
      world.scene.add(world.forceGroup);

      addEnvironment(world.scene);

      const hemi = new THREE.HemisphereLight(0x8fb8c4, 0x050b0f, 0.42);
      world.scene.add(hemi);

      const key = new THREE.DirectionalLight(0xffb882, 1.45);
      key.position.set(10, 16, 12);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.left = -22;
      key.shadow.camera.right = 22;
      key.shadow.camera.top = 17;
      key.shadow.camera.bottom = -17;
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 55;
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.025;
      world.scene.add(key);

      const fill = new THREE.DirectionalLight(0x3c7690, 0.58);
      fill.position.set(-12, 8, -8);
      world.scene.add(fill);

      const rim = new THREE.PointLight(0xff6f3c, 1.9, 30, 2);
      rim.position.set(8, 3.2, -7);
      world.scene.add(rim);

      const top = new THREE.PointLight(0x69c5d0, 0.62, 26, 2);
      top.position.set(-4, 8, 8);
      world.scene.add(top);

      world.carA = createCarModel({ color: 0xdc5426, withInterior: true });
      world.carB = createCarModel({ color: 0x3f8e9b, withInterior: false });
      world.carA.group.position.set(0, 0, 2.55);
      world.carB.group.position.set(0, 0, -2.55);
      world.carB.group.visible = false;
      world.scene.add(world.carA.group);
      world.scene.add(world.carB.group);

      world.sparks = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({
          color: 0xffb070,
          size: 0.13,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      world.sparks.visible = false;
      world.scene.add(world.sparks);

      resizeStage();
      world.ready = true;
      window.addEventListener("resize", resizeStage);
      if (window.ResizeObserver) {
        new ResizeObserver(resizeStage).observe(dom.stage);
      }
      bindCanvasOrbit();
      return true;
    } catch (error) {
      console.error("3D scene failed:", error);
      showStageToast(L("无法启动 WebGL 三维场景，请换用支持 WebGL 的浏览器。", "WebGL could not start. Try a browser with WebGL enabled."), 8000);
      return false;
    }
  }

  function resizeStage() {
    if (!world.renderer || !world.camera) return;
    const width = dom.stage.clientWidth;
    const height = dom.stage.clientHeight;
    if (!width || !height) return;
    world.camera.aspect = width / height;
    world.camera.fov = width / height < 0.9 ? 47 : width / height < 1.2 ? 42 : 38;
    world.camera.updateProjectionMatrix();
    world.renderer.setSize(width, height, false);
    world.cameraRig.fit = width / height < 0.85 ? 1.22 : width / height < 1.1 ? 1.1 : 1;
  }

  function bindCanvasOrbit() {
    const canvas = dom.canvas;
    canvas.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      world.pointer.dragging = true;
      world.pointer.id = event.pointerId;
      world.pointer.lastX = event.clientX;
      world.pointer.lastY = event.clientY;
      world.cameraRig.autoOrbit = false;
      canvas.classList.add("is-dragging");
      if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!world.pointer.dragging || event.pointerId !== world.pointer.id) return;
      const dx = event.clientX - world.pointer.lastX;
      const dy = event.clientY - world.pointer.lastY;
      world.pointer.lastX = event.clientX;
      world.pointer.lastY = event.clientY;
      const rig = world.cameraRig;
      rig.goalAzim -= dx * 0.0054;
      rig.goalElev = clamp(rig.goalElev + dy * 0.004, 0.06, 1.18);
    });
    function endDrag(event) {
      if (event && event.pointerId !== world.pointer.id) return;
      world.pointer.dragging = false;
      world.pointer.id = null;
      canvas.classList.remove("is-dragging");
    }
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", (event) => {
      if (world.pointer.dragging && event.buttons === 0) endDrag(event);
    });
    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      world.cameraRig.goalRadius = clamp(world.cameraRig.goalRadius * Math.exp(event.deltaY * 0.0012), 6.5, 27);
    }, { passive: false });
    canvas.addEventListener("dblclick", () => {
      setCameraPreset(currentCameraPresetKey(), false);
    });
  }

  function bindStageEvents() {
    dom.presentBtn.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", () => {
      dom.presentBtn.querySelector("span").textContent = document.fullscreenElement
        ? L("退出全屏", "Exit present")
        : L("全屏授课", "Present");
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      const request = document.documentElement.requestFullscreen;
      if (!request) {
        showStageToast(L("当前浏览器不支持全屏。", "Fullscreen is not supported in this browser."), 2600);
        return;
      }
      request.call(document.documentElement).catch(() => {
        showStageToast(L("无法进入全屏。", "Could not enter fullscreen."), 2600);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  let toastTimer = 0;
  function showStageToast(message, duration) {
    window.clearTimeout(toastTimer);
    dom.stageToast.textContent = message;
    dom.stageToast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      dom.stageToast.classList.remove("is-visible");
    }, duration || 2200);
  }

  function setCameraPreset(key, instant) {
    const preset = CAMERA_PRESETS[key] || CAMERA_PRESETS.forces;
    const rig = world.cameraRig;
    rig.goalAzim = preset.azim;
    rig.goalElev = preset.elev;
    rig.goalRadius = preset.radius;
    rig.goalTarget.set(preset.target[0], preset.target[1], preset.target[2]);
    if (instant) {
      rig.azim = preset.azim;
      rig.elev = preset.elev;
      rig.radius = preset.radius;
      rig.target.copy(rig.goalTarget);
    }
  }

  function currentCameraPresetKey() {
    if (state.chapter === 0) return "forces";
    if (state.chapter === 1) return state.ch1Mode === "coast" ? "firstCoast" : "passenger";
    if (state.chapter === 2) return "second";
    if (state.chapter === 3) {
      if (state.ch3Mode === "drive") return "thirdDrive";
      return ["contact", "recoil", "done"].includes(sim.law3Phase) ? "thirdCrashContact" : "thirdCrashWide";
    }
    return "review";
  }

  function updateCamera(dt) {
    const rig = world.cameraRig;
    if (rig.autoOrbit) rig.goalAzim += dt * 0.075;
    const k = 1 - Math.exp(-dt * 3.3);
    rig.azim += (rig.goalAzim - rig.azim) * k;
    rig.elev += (rig.goalElev - rig.elev) * k;
    rig.radius += (rig.goalRadius - rig.radius) * k;
    rig.target.lerp(rig.goalTarget, k);
    const distance = rig.radius * rig.fit;
    world.camera.position.set(
      rig.target.x + distance * Math.cos(rig.elev) * Math.sin(rig.azim),
      rig.target.y + distance * Math.sin(rig.elev),
      rig.target.z + distance * Math.cos(rig.elev) * Math.cos(rig.azim)
    );
    world.camera.lookAt(rig.target);
  }

  /* =========================================================
     08 · Labels & force vectors
     ========================================================= */

  const UP_VECTOR = new THREE.Vector3(0, 1, 0);

  function makeLabel(name, value, unit, color, variant) {
    const el = document.createElement("div");
    el.className = "scene-label" + (variant ? " " + variant : "");
    el.style.setProperty("--label-color", color);
    el.innerHTML = `<span class="label-dot"></span><span class="label-copy"><span class="label-name"></span><span class="label-value"></span></span>`;
    dom.stageLabels.appendChild(el);
    const entry = {
      el: el,
      nameEl: $(".label-name", el),
      valueEl: $(".label-value", el),
      name: name,
      value: value == null ? "" : String(value),
      unit: unit || "",
      color: color,
      anchor: new THREE.Vector3(),
      visible: true,
      lastVisible: null
    };
    updateLabelText(entry);
    return entry;
  }

  function updateLabelText(entry) {
    if (!entry) return;
    const label = entry.name ? L(entry.name.zh, entry.name.en) : "";
    entry.nameEl.textContent = label;
    entry.nameEl.style.display = label ? "" : "none";
    const unit = entry.unit ? `<small>${escapeHTML(entry.unit)}</small>` : "";
    entry.valueEl.innerHTML = `${escapeHTML(entry.value)}${unit}`;
  }

  function setLabelValue(entry, value, unit) {
    if (!entry) return;
    const next = value == null ? "" : String(value);
    const nextUnit = unit == null ? entry.unit : unit;
    if (entry.value === next && entry.unit === nextUnit) return;
    entry.value = next;
    entry.unit = nextUnit || "";
    updateLabelText(entry);
  }

  function addScreenLabel(config) {
    const entry = makeLabel(config.name, config.value == null ? "" : config.value, config.unit || "", config.color || "#e9834f", config.variant || "");
    entry.getAnchor = config.getAnchor;
    entry.id = config.id;
    if (config.valueFn) entry.valueFn = config.valueFn;
    world.labels.screen.set(config.id, entry);
    return entry;
  }

  function clearScreenLabels() {
    world.labels.screen.forEach((entry) => entry.el.remove());
    world.labels.screen.clear();
  }

  function updateScreenLabelValue(id, value, unit) {
    const entry = world.labels.screen.get(id);
    if (entry) setLabelValue(entry, value, unit);
  }

  function refreshAllLabelLanguage() {
    world.labels.force.forEach((entry) => {
      if (entry.def && entry.label) {
        entry.label.name = entry.def.name;
        setLabelValue(entry.label, entry.def.value, entry.def.unit || "kN");
        updateLabelText(entry.label);
      }
    });
    world.labels.screen.forEach((entry) => updateLabelText(entry));
    const passengerLabel = world.labels.screen.get("passenger");
    if (passengerLabel) setLabelValue(passengerLabel, L("保持原来的运动", "keeps prior motion"));
  }

  function projectLabels() {
    if (!world.camera) return;
    const width = dom.stage.clientWidth;
    const height = dom.stage.clientHeight;
    if (!width || !height) return;
    const all = [];
    world.labels.force.forEach((entry) => {
      if (entry.label) all.push(entry.label);
    });
    world.labels.screen.forEach((entry) => all.push(entry));
    for (let i = 0; i < all.length; i += 1) {
      const entry = all[i];
      if (entry.getAnchor) entry.anchor.copy(entry.getAnchor());
      if (!entry.visible) {
        if (entry.lastVisible !== false) {
          entry.el.classList.remove("is-visible");
          entry.lastVisible = false;
        }
        continue;
      }
      const projected = entry.anchor.clone().project(world.camera);
      const behind = projected.z < -1 || projected.z > 1;
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      if (behind || x < -80 || x > width + 80 || y < -60 || y > height + 60) {
        if (entry.lastVisible !== false) {
          entry.el.classList.remove("is-visible");
          entry.lastVisible = false;
        }
        continue;
      }
      entry.el.style.left = `${x.toFixed(1)}px`;
      entry.el.style.top = `${y.toFixed(1)}px`;
      if (entry.lastVisible !== true) {
        entry.el.classList.add("is-visible");
        entry.lastVisible = true;
      }
    }
  }

  function createArrowMesh(color) {
    const group = new THREE.Group();
    const displayColor = new THREE.Color(color).convertSRGBToLinear();
    const material = new THREE.MeshBasicMaterial({
      color: displayColor,
      transparent: true,
      opacity: 0.98,
      toneMapped: false
    });
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: displayColor,
      transparent: true,
      opacity: 0.045,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    });
    const shaftGeometry = new THREE.CylinderGeometry(0.042, 0.042, 1, 10, 1);
    const headGeometry = new THREE.ConeGeometry(0.165, 0.27, 16);
    const glowShaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 10, 1);
    const glowHeadGeometry = new THREE.ConeGeometry(0.28, 0.3, 16);

    const shaft = new THREE.Mesh(shaftGeometry, material);
    const head = new THREE.Mesh(headGeometry, material);
    const glowShaft = new THREE.Mesh(glowShaftGeometry, glowMaterial);
    const glowHead = new THREE.Mesh(glowHeadGeometry, glowMaterial);
    group.add(glowShaft, glowHead, shaft, head);
    group.renderOrder = 4;
    return { group: group, shaft: shaft, head: head, glowShaft: glowShaft, glowHead: glowHead, material: material, glowMaterial: glowMaterial };
  }

  function placeArrow(arrow, origin, direction, length) {
    if (!arrow) return;
    const unit = direction.clone().normalize();
    const total = Math.max(0.5, length);
    const shaftLength = Math.max(0.08, total - 0.27);
    arrow.group.position.copy(origin);
    arrow.group.quaternion.setFromUnitVectors(UP_VECTOR, unit);
    arrow.shaft.scale.y = shaftLength;
    arrow.shaft.position.y = shaftLength / 2;
    arrow.head.position.y = shaftLength + 0.135;
    arrow.glowShaft.scale.y = shaftLength;
    arrow.glowShaft.position.y = shaftLength / 2;
    arrow.glowHead.position.y = shaftLength + 0.15;
    arrow.glowHead.scale.set(1.1, 1.05, 1.1);
  }

  function removeForceEntry(entry) {
    if (!entry) return;
    if (entry.arrow && entry.arrow.group.parent) entry.arrow.group.parent.remove(entry.arrow.group);
    if (entry.label) entry.label.el.remove();
    if (entry.def) world.labels.force.delete(entry.def.id);
  }

  function clearForces() {
    world.labels.force.forEach((entry) => {
      if (entry.arrow && entry.arrow.group.parent) entry.arrow.group.parent.remove(entry.arrow.group);
      entry.label.el.remove();
    });
    world.labels.force.clear();
  }

  function setForces(definitions) {
    const defs = definitions || [];
    const activeIds = new Set(defs.map((def) => def.id));
    world.labels.force.forEach((entry) => {
      if (!activeIds.has(entry.def.id)) removeForceEntry(entry);
    });
    defs.forEach((def) => {
      let entry = world.labels.force.get(def.id);
      if (!entry) {
        const arrow = createArrowMesh(def.color);
        world.forceGroup.add(arrow.group);
        const label = makeLabel(def.name, def.value, def.unit || "kN", cssColor(def.color), "is-active");
        entry = { def: def, arrow: arrow, label: label };
        world.labels.force.set(def.id, entry);
      } else {
        entry.def = def;
        entry.label.name = def.name;
        entry.label.visible = true;
        setLabelValue(entry.label, def.value, def.unit || "kN");
        entry.label.el.style.setProperty("--label-color", cssColor(def.color));
      }
      entry.label.visible = true;
    });
  }

  function updateForces() {
    world.labels.force.forEach((entry) => {
      const def = entry.def;
      if (!def) return;
      const origin = def.origin();
      const dir = typeof def.dir === "function" ? def.dir() : def.dir;
      const length = typeof def.length === "function" ? def.length() : def.length;
      const thickness = def.thickness == null ? 1 : def.thickness;
      entry.arrow.group.scale.set(thickness, 1, thickness);
      placeArrow(entry.arrow, origin, dir, length);
      const labelOffset = def.labelOffset == null ? 0.28 : def.labelOffset;
      entry.label.anchor.copy(origin).addScaledVector(dir.clone().normalize(), Math.max(0.5, length) + labelOffset);
      if (def.labelLift) entry.label.anchor.y += def.labelLift;
    });
  }

  function cssColor(color) {
    if (typeof color === "string") return color;
    return "#" + color.toString(16).padStart(6, "0");
  }

  function makeForceName(zh, en) {
    return { zh: zh, en: en };
  }

  function arrowLengthForForce(newtons) {
    return clamp(0.68 + newtons / 3400, 0.68, 2.75);
  }

  function baseForceDefinitions(car, driveN, resistN, options) {
    const opts = options || {};
    const defs = [];
    const zSide = opts.zSide == null ? 0.98 : opts.zSide;
    const verticalOrigin = () => carPoint(car, -0.05, 1.08, zSide);
    const weightLength = 1.18;
    const normalLength = 1.28;
    defs.push({
      id: "weight",
      name: makeForceName("重力 W", "WEIGHT W"),
      value: fixed(WEIGHT_KN, 1),
      unit: "kN",
      color: FORCE_COLORS.weight,
      origin: verticalOrigin,
      dir: new THREE.Vector3(0, -1, 0),
      length: weightLength
    });
    defs.push({
      id: "normal",
      name: makeForceName("支持力 N", "NORMAL N"),
      value: fixed(WEIGHT_KN, 1),
      unit: "kN",
      color: FORCE_COLORS.normal,
      origin: () => carPoint(car, -0.05, 1.1, zSide),
      dir: new THREE.Vector3(0, 1, 0),
      length: normalLength
    });
    if (driveN > 30) {
      defs.push({
        id: "drive",
        name: makeForceName("动力 F", "DRIVE F"),
        value: fixed(driveN / 1000, 1),
        unit: "kN",
        color: FORCE_COLORS.drive,
        origin: () => carPoint(car, 1.68, 0.62, zSide),
        dir: carDirection(car, 1, 0, 0),
        length: arrowLengthForForce(driveN)
      });
    }
    if (resistN > 20) {
      defs.push({
        id: "resist",
        name: makeForceName("阻力 f", "RESISTANCE f"),
        value: fixed(resistN / 1000, 1),
        unit: "kN",
        color: FORCE_COLORS.resist,
        origin: () => carPoint(car, -1.68, 0.62, zSide),
        dir: carDirection(car, -1, 0, 0),
        length: arrowLengthForForce(resistN)
      });
    }
    return defs;
  }

  /* =========================================================
     09 · Scene configuration for each chapter
     ========================================================= */

  function resetSceneCars() {
    world.forceGroup.clear();
    clearForces();
    world.labels.force.clear();
    clearScreenLabels();
    hideSparks();
    world.cameraRig.autoOrbit = false;

    [world.carA, world.carB].forEach((car) => {
      if (!car) return;
      car.group.visible = true;
      car.group.scale.setScalar(1);
      car.group.rotation.set(0, 0, 0);
      car.group.position.set(0, 0, 0);
      car.wheels.forEach((wheel) => {
        wheel.rotation.z = 0;
      });
      car.dummy.visible = false;
      car.dummy.rotation.z = 0;
      car.belt.visible = false;
      car.tailMats.forEach((material) => {
        material.color.setHex(0xff3f21);
      });
      car.glassMaterials.forEach((material) => {
        material.opacity = 0.72;
      });
      if (car.paintMaterial) {
        car.paintMaterial.transparent = false;
        car.paintMaterial.opacity = 1;
        car.paintMaterial.depthWrite = true;
        car.paintMaterial.needsUpdate = true;
      }
    });
    if (world.carB) world.carB.group.visible = false;
    sim.passengerLean = 0;
  }

  function setGlassOpacity(car, opacity) {
    car.glassMaterials.forEach((material) => {
      material.opacity = opacity;
      material.transparent = true;
    });
  }

  function setDummyVisible(car, visible) {
    car.dummy.visible = !!visible;
    car.seat.visible = !!visible;
    car.belt.visible = false;
  }

  function setCutaway(car, enabled) {
    if (!car || !car.paintMaterial) return;
    car.paintMaterial.transparent = !!enabled;
    car.paintMaterial.opacity = enabled ? 0.38 : 1;
    car.paintMaterial.depthWrite = !enabled;
    car.paintMaterial.needsUpdate = true;
  }

  function setBrakeLights(car, braking) {
    car.tailMats.forEach((material) => {
      material.color.setHex(braking ? 0xff2517 : 0xff3f21);
    });
  }

  function configureForcesScene() {
    const car = world.carA;
    setCarPose(car, 0, 2.55, 0);
    setGlassOpacity(car, 0.68);
    const driveN = state.analysisMode === "accelerate" ? 4800 : state.analysisMode === "cruise" ? 2400 : 0;
    const resistN = state.analysisMode === "rest" ? 0 : state.analysisMode === "accelerate" ? 2400 : 2400;
    const defs = baseForceDefinitions(car, driveN, resistN, {});
    if (state.analysisMode === "rest") {
      /* At rest, only the vertical pair is present. */
    }
    setForces(defs);
  }

  function configureFirstLawScene() {
    const carA = world.carA;
    const carB = world.carB;
    if (state.ch1Mode === "coast") {
      setCarPose(carA, sim.ch1PosA, 2.55, 0);
      setCarPose(carB, sim.ch1PosB, -2.55, 0);
      carB.group.visible = true;
      setGlassOpacity(carA, 0.68);
      setGlassOpacity(carB, 0.68);
      setBrakeLights(carA, false);
      const defs = [
        {
          id: "lane-friction",
          name: makeForceName("阻力 f", "RESISTANCE f"),
          value: "0.96",
          unit: "kN",
          color: FORCE_COLORS.resist,
          origin: () => carPoint(carA, -1.75, 0.58, 0.98),
          dir: carDirection(carA, -1, 0, 0),
          length: 1.12
        }
      ];
      setForces(defs);
      addScreenLabel({
        id: "lane-a",
        name: { zh: "车道 A · 有摩擦", en: "LANE A · FRICTION" },
        value: fixed(sim.ch1SpeedA, 1),
        unit: "m/s",
        color: "#ff7b60",
        variant: "is-vehicle",
        getAnchor: () => carPoint(carA, -0.2, 2.05, 0)
      });
      addScreenLabel({
        id: "lane-b",
        name: { zh: "车道 B · 理想无摩擦", en: "LANE B · IDEAL" },
        value: fixed(sim.ch1SpeedB, 1),
        unit: "m/s",
        color: "#58ded6",
        variant: "is-vehicle",
        getAnchor: () => carPoint(carB, -0.2, 2.05, 0)
      });
    } else {
      setCarPose(carA, 0, 2.55, 0);
      setCutaway(carA, true);
      setGlassOpacity(carA, 0.06);
      setDummyVisible(carA, true);
      carA.belt.visible = sim.passengerAction === "brake";
      carA.dummy.rotation.z = sim.passengerLean;
      setBrakeLights(carA, sim.passengerAction === "brake");
      if (sim.passengerAction) {
        const start = sim.passengerAction === "start";
        setForces([
          {
            id: "passenger-seat",
            name: start
              ? makeForceName("座椅对乘客", "SEAT ON PASSENGER")
              : makeForceName("安全带对乘客", "BELT ON PASSENGER"),
            value: start ? "1.1" : "1.2",
            unit: "kN",
            color: FORCE_COLORS.seat,
            origin: () => carPoint(carA, -0.08, 1.6, 0.66),
            dir: start ? carDirection(carA, 1, 0, 0) : carDirection(carA, -1, 0, 0),
            length: 1.05,
            thickness: 0.72,
            labelOffset: 0.22
          }
        ]);
      }
      addScreenLabel({
        id: "passenger-speed",
        name: { zh: "汽车 · 车速", en: "CAR · SPEED" },
        value: fixed(sim.passengerSpeed, 1),
        unit: "m/s",
        color: "#ffb15f",
        variant: "is-vehicle",
        getAnchor: () => carPoint(carA, -0.2, 2.1, 0)
      });
      addScreenLabel({
        id: "passenger",
        name: { zh: "乘客", en: "PASSENGER" },
        value: L("保持原来的运动", "keeps prior motion"),
        unit: "",
        color: "#ffb15f",
        variant: "is-passenger is-note",
        getAnchor: () => carPoint(carA, -0.16, 1.12, 0.38)
      });
    }
  }

  function configureSecondLawScene() {
    const car = world.carA;
    setCarPose(car, 0, 2.55, 0);
    setGlassOpacity(car, 0.68);
    setForces(baseForceDefinitions(car, sim.law2Force, FRICTION_N, { zSide: 1.0 }).filter((def) => def.id === "drive" || def.id === "resist"));
    addScreenLabel({
      id: "car-speed",
      name: { zh: "试验车 · 实时速度", en: "TEST CAR · LIVE SPEED" },
      value: fixed(sim.law2V, 1),
      unit: "m/s",
      color: "#ff9b6e",
      variant: "is-vehicle",
      getAnchor: () => carPoint(car, -0.2, 2.12, 0)
    });
  }

  function configureLaw2Forces() {
    const car = world.carA;
    setForces(baseForceDefinitions(car, sim.law2Force, FRICTION_N, { zSide: 1.0 }).filter((def) => def.id === "drive" || def.id === "resist"));
    updateScreenLabelValue("car-speed", fixed(sim.law2V, 1), "m/s");
  }

  function configureThirdLawScene() {
    const carA = world.carA;
    const carB = world.carB;
    if (state.ch3Mode === "drive") {
      setCarPose(carA, 0, 2.55, 0);
      setGlassOpacity(carA, 0.7);
      setBrakeLights(carA, false);
      setForces([
        {
          id: "tire-on-road",
          name: makeForceName("轮胎对地面", "TIRE ON ROAD"),
          value: "3.0",
          unit: "kN",
          color: FORCE_COLORS.action,
          origin: () => carPoint(carA, -1.38, 0.1, 1.2),
          dir: new THREE.Vector3(-1, 0, 0),
          length: 2.0,
          labelLift: 0.12
        },
        {
          id: "road-on-tire",
          name: makeForceName("地面对轮胎", "ROAD ON TIRE"),
          value: "3.0",
          unit: "kN",
          color: FORCE_COLORS.reaction,
          origin: () => carPoint(carA, -1.38, 0.58, 1.2),
          dir: new THREE.Vector3(1, 0, 0),
          length: 2.0,
          labelLift: 0.1
        }
      ]);
    } else {
      setCarPose(carA, sim.law3CarAX, 2.55, 0);
      setCarPose(carB, sim.law3CarBX, 2.55, Math.PI);
      carB.group.visible = true;
      setGlassOpacity(carA, 0.7);
      setGlassOpacity(carB, 0.7);
      addScreenLabel({
        id: "crash-a",
        name: { zh: "汽车 A · 1000 kg", en: "CAR A · 1000 kg" },
        value: fixed(Math.abs(sim.law3SpeedA), 1),
        unit: "m/s",
        color: "#e9834f",
        variant: "is-vehicle",
        getAnchor: () => carPoint(carA, -0.2, 2.1, 0)
      });
      addScreenLabel({
        id: "crash-b",
        name: { zh: "汽车 B · 1600 kg", en: "CAR B · 1600 kg" },
        value: fixed(Math.abs(sim.law3SpeedB), 1),
        unit: "m/s",
        color: "#58ded6",
        variant: "is-vehicle",
        getAnchor: () => carPoint(carB, -0.2, 2.1, 0)
      });
      if (sim.law3Phase === "contact") {
        configureCollisionForces();
      }
    }
  }

  function configureCollisionForces() {
    if (sim.law3Phase !== "contact") return;
    setCarPose(world.carA, -2.16, 2.55, 0);
    setCarPose(world.carB, 2.16, 2.55, Math.PI);
    const contactX = 0;
    setForces([
      {
        id: "a-on-b",
        name: makeForceName("A 对 B", "A ON B"),
        value: "12.0",
        unit: "kN",
        color: FORCE_COLORS.action,
        origin: () => new THREE.Vector3(contactX + 0.02, 1.12, 3.55),
        dir: new THREE.Vector3(1, 0, 0),
        length: 2.35,
        labelLift: 0.12
      },
      {
        id: "b-on-a",
        name: makeForceName("B 对 A", "B ON A"),
        value: "12.0",
        unit: "kN",
        color: FORCE_COLORS.reaction,
        origin: () => new THREE.Vector3(contactX + 0.02, 1.5, 3.55),
        dir: new THREE.Vector3(-1, 0, 0),
        length: 2.35,
        labelLift: 0.1
      }
    ]);
    burstSparks(new THREE.Vector3(0, 0.9, 2.55));
    flashImpact();
    setCameraPreset("thirdCrashContact", false);
  }

  function configureReviewScene() {
    const car = world.carA;
    setCarPose(car, 0, 2.55, 0);
    setGlassOpacity(car, 0.68);
    setForces(baseForceDefinitions(car, 2400, 2400, { zSide: 0.98 }));
    world.cameraRig.autoOrbit = true;
  }

  function getSceneMeta() {
    if (state.chapter === 0) {
      const copy = {
        rest: {
          title: L("静止：合力为零", "At rest: zero net force"),
          subtitle: L("重力与支持力彼此平衡，汽车保持静止。", "Weight and normal force balance. The car stays at rest.")
        },
        cruise: {
          title: L("四种力，一张受力图", "Four forces, one map"),
          subtitle: L("动力和阻力等大反向，合力为零，速度不变。", "Drive and resistance balance. Zero net force, constant velocity.")
        },
        accelerate: {
          title: L("合力向前，速度增大", "A forward net force speeds the car up"),
          subtitle: L("动力大于阻力，水平方向出现向前的合力。", "Drive exceeds resistance, creating a forward net force.")
        }
      }[state.analysisMode];
      return {
        code: "SCENE 01 / FORCE ANALYSIS",
        title: copy.title,
        subtitle: copy.subtitle,
        preset: "forces"
      };
    }
    if (state.chapter === 1) {
      if (state.ch1Mode === "coast") {
        return {
          code: "SCENE 02A / INERTIA LAB",
          title: L("双车道惯性实验", "Two-lane inertia experiment"),
          subtitle: L("相同的初速度。一个受阻力，一个不受水平合力。", "Same initial speed. One meets resistance; the other has zero horizontal net force."),
          preset: "firstCoast"
        };
      }
      return {
        code: "SCENE 02B / CUTAWAY · INERTIA",
        title: L("乘客的惯性", "The passenger's inertia"),
        subtitle: L("透视观察车内：车改变速度，乘客的身体仍想保持原来的运动。", "Cutaway view: the car changes speed; the passenger's body keeps its previous motion."),
        preset: "passenger"
      };
    }
    if (state.chapter === 2) {
      return {
        code: "SCENE 03 / F = ma TEST BENCH",
        title: L("F = ma 动态试验台", "The F = ma test bench"),
        subtitle: L("改变驱动力与质量，观察加速度如何响应。", "Change force and mass. Watch acceleration respond."),
        preset: "second"
      };
    }
    if (state.chapter === 3) {
      if (state.ch3Mode === "drive") {
        return {
          code: "SCENE 04A / FORCE PAIR",
          title: L("起步时的力对", "The force pair when launching"),
          subtitle: L("轮胎把地面向后推，地面同时把轮胎向前推。", "The tire pushes the road backward; the road pushes the tire forward."),
          preset: "thirdDrive"
        };
      }
      return {
        code: "SCENE 04B / CRASH TEST",
        title: L("碰撞瞬间的力对", "The force pair at impact"),
        subtitle: L("质量不同，受力等大。较轻的车速度变化更明显。", "Different masses, equal forces. The lighter car's velocity changes more."),
        preset: ["contact", "recoil", "done"].includes(sim.law3Phase) ? "thirdCrashContact" : "thirdCrashWide"
      };
    }
    return {
      code: "SCENE 05 / REVIEW",
      title: L("三条定律，一辆汽车", "Three laws. One car."),
      subtitle: L("把惯性、F = ma 与作用反作用连成一条完整的解释链。", "Connect inertia, F = ma, and action–reaction into one explanation."),
      preset: "review"
    };
  }

  function updateSceneCopy() {
    const meta = getSceneMeta();
    dom.sceneCode.textContent = meta.code;
    dom.sceneTitle.textContent = meta.title;
    dom.sceneSubtitle.textContent = meta.subtitle;
    renderHUD();
    renderLegend();
    updateHudValues();
    refreshScreenLabelValues();
  }

  function configureChapterScene(options) {
    const settings = options || {};
    if (!world.ready) {
      updateSceneCopy();
      return;
    }
    resetSceneCars();
    if (state.chapter === 0) configureForcesScene();
    if (state.chapter === 1) configureFirstLawScene();
    if (state.chapter === 2) configureSecondLawScene();
    if (state.chapter === 3) configureThirdLawScene();
    if (state.chapter === 4) configureReviewScene();

    updateSceneCopy();
    updateForces();
    if (!settings.preserveCamera) {
      setCameraPreset(getSceneMeta().preset, settings.instantCamera !== false);
    }
    projectLabels();
  }

  /* =========================================================
     10 · HUD, legends, and live scene labels
     ========================================================= */

  function hudItemHTML(label, id, unit, extraClass) {
    return `
      <div class="hud-item ${extraClass || ""}">
        <span class="hud-label">${escapeHTML(label)}</span>
        <span class="hud-number"><span id="${id}">—</span><small>${escapeHTML(unit)}</small></span>
      </div>`;
  }

  function pairHudHTML(left, right) {
    return `
      <div class="hud-item">
        <span class="hud-label">${L("作用与反作用 / FORCE PAIR", "FORCE PAIR / 作用与反作用")}</span>
        <span class="hud-pair">
          <span class="pair-side"><span>${left || L("作用力", "ACTION")}</span><b id="hudPairA">—</b><small>kN</small></span>
          <span class="pair-equals">≡</span>
          <span class="pair-side"><span>${right || L("反作用力", "REACTION")}</span><b id="hudPairB">—</b><small>kN</small></span>
        </span>
      </div>`;
  }

  function renderHUD() {
    let html = "";
    dom.telemetry.classList.remove("is-formulas");
    if (state.chapter === 0) {
      html =
        hudItemHTML(L("速度 / SPEED", "SPEED / 速度"), "hudSpeed", "m/s") +
        hudItemHTML(L("合力 / NET FORCE", "NET FORCE / 合力"), "hudNet", "kN") +
        hudItemHTML(L("加速度 / ACCEL", "ACCEL / 加速度"), "hudAccel", "m/s²", "is-accent");
    } else if (state.chapter === 1) {
      if (state.ch1Mode === "coast") {
        html =
          hudItemHTML(L("车道 A · 有摩擦", "LANE A · FRICTION"), "hudA", "m/s", "is-accent") +
          hudItemHTML(L("车道 B · 理想", "LANE B · IDEAL"), "hudB", "m/s", "is-teal") +
          hudItemHTML(L("滑行时间 / TIME", "RUN TIME / 滑行时间"), "hudTime", "s");
      } else {
        html =
          hudItemHTML(L("车速 / CAR SPEED", "CAR SPEED / 车速"), "hudSpeed", "m/s") +
          hudItemHTML(L("安全带 / BELT", "BELT / 安全带"), "hudBelt", "kN", "is-accent");
      }
    } else if (state.chapter === 2) {
      html =
        hudItemHTML(L("实时速度 / LIVE SPEED", "LIVE SPEED / 实时速度"), "hudSpeed", "m/s") +
        hudItemHTML(L("合力 / NET FORCE", "NET FORCE / 合力"), "hudNet", "kN") +
        hudItemHTML(L("加速度 / ACCEL", "ACCEL / 加速度"), "hudAccel", "m/s²", "is-accent");
    } else if (state.chapter === 3) {
      if (state.ch3Mode === "drive") {
        html =
          pairHudHTML(L("车→地", "CAR→ROAD"), L("地→车", "ROAD→CAR")) +
          hudItemHTML(L("车速 / CAR SPEED", "CAR SPEED / 车速"), "hudSpeed", "m/s", "is-teal");
      } else {
        html =
          pairHudHTML("A→B", "B→A") +
          hudItemHTML(L("A 速度 / SPEED A", "SPEED A / A 速度"), "hudSpeedA", "m/s", "is-accent") +
          hudItemHTML(L("B 速度 / SPEED B", "SPEED B / B 速度"), "hudSpeedB", "m/s", "is-teal");
      }
    } else {
      dom.telemetry.classList.add("is-formulas");
      html = `
        <div class="hud-item"><span class="hud-label">LAW 01 · ${L("惯性", "INERTIA")}</span><span class="hud-number">ΣF = 0</span></div>
        <div class="hud-item"><span class="hud-label">LAW 02 · ${L("加速度", "ACCELERATION")}</span><span class="hud-number">ΣF = m · a</span></div>
        <div class="hud-item"><span class="hud-label">LAW 03 · ${L("成对出现", "FORCE PAIRS")}</span><span class="hud-number">F₁₂ = −F₂₁</span></div>`;
    }
    dom.telemetry.innerHTML = html;
    dom.telemetry.classList.add("is-visible");
  }

  function legendChipHTML(label, color) {
    return `<span class="legend-chip" style="--legend-color:${color}"><i></i>${escapeHTML(label)}</span>`;
  }

  function renderLegend() {
    let chips = [];
    if (state.chapter === 0 || state.chapter === 4) {
      chips = [
        { label: L("重力 W", "WEIGHT W"), color: FORCE_CSS.weight },
        { label: L("支持力 N", "NORMAL N"), color: FORCE_CSS.normal },
        { label: L("动力 F", "DRIVE F"), color: FORCE_CSS.drive },
        { label: L("阻力 f", "RESISTANCE f"), color: FORCE_CSS.resist }
      ];
      if (state.chapter === 0 && state.analysisMode === "rest") chips = chips.slice(0, 2);
    } else if (state.chapter === 1 && state.ch1Mode === "passenger" && sim.passengerAction) {
      chips = [{ label: L("乘客受力", "FORCE ON PASSENGER"), color: FORCE_CSS.seat }];
    } else if (state.chapter === 1) {
      chips = [{ label: L("阻力 f", "RESISTANCE f"), color: FORCE_CSS.resist }];
    } else if (state.chapter === 2) {
      chips = [
        { label: L("动力 F", "DRIVE F"), color: FORCE_CSS.drive },
        { label: L("阻力 f", "RESISTANCE f"), color: FORCE_CSS.resist }
      ];
    } else if (state.chapter === 3) {
      chips = [
        { label: L("作用力", "ACTION"), color: FORCE_CSS.action },
        { label: L("反作用力", "REACTION"), color: FORCE_CSS.reaction }
      ];
    }
    dom.forceLegend.innerHTML = chips.map((chip) => legendChipHTML(chip.label, chip.color)).join("");
    dom.forceLegend.classList.toggle("is-visible", chips.length > 0);
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function updateHudValues() {
    if (state.chapter === 0) {
      const drive = state.analysisMode === "accelerate" ? 4800 : state.analysisMode === "cruise" ? 2400 : 0;
      const resist = state.analysisMode === "rest" ? 0 : 2400;
      setText("hudSpeed", fixed(sim.analysisSpeed, 1));
      setText("hudNet", signedFixed((drive - resist) / 1000, 1));
      setText("hudAccel", fixed((drive - resist) / MASS_KG, 1));
    } else if (state.chapter === 1) {
      if (state.ch1Mode === "coast") {
        setText("hudA", fixed(sim.ch1SpeedA, 1));
        setText("hudB", fixed(sim.ch1SpeedB, 1));
        setText("hudTime", fixed(sim.ch1T, 1));
      } else {
        setText("hudSpeed", fixed(sim.passengerSpeed, 1));
        setText("hudBelt", sim.passengerAction === "brake" ? "1.2" : "0.0");
      }
    } else if (state.chapter === 2) {
      setText("hudSpeed", fixed(sim.law2V, 1));
      setText("hudNet", signedFixed((sim.law2Force - FRICTION_N) / 1000, 2));
      setText("hudAccel", fixed((sim.law2Force - FRICTION_N) / sim.law2Mass, 1));
    } else if (state.chapter === 3) {
      if (state.ch3Mode === "drive") {
        setText("hudSpeed", fixed(sim.law3DriveSpeed, 1));
        setText("hudPairA", "3.0");
        setText("hudPairB", "3.0");
      } else {
        const contact = sim.law3Phase === "contact";
        setText("hudPairA", contact ? "12.0" : "—");
        setText("hudPairB", contact ? "12.0" : "—");
        setText("hudSpeedA", fixed(Math.abs(sim.law3SpeedA), 1));
        setText("hudSpeedB", fixed(Math.abs(sim.law3SpeedB), 1));
      }
    }
  }

  function setCollisionCarLabelsVisible(visible) {
    ["crash-a", "crash-b"].forEach((id) => {
      const entry = world.labels.screen.get(id);
      if (entry) entry.visible = !!visible;
    });
  }

  function refreshScreenLabelValues() {
    if (state.chapter === 1) {
      if (state.ch1Mode === "coast") {
        updateScreenLabelValue("lane-a", fixed(sim.ch1SpeedA, 1), "m/s");
        updateScreenLabelValue("lane-b", fixed(sim.ch1SpeedB, 1), "m/s");
      } else {
        updateScreenLabelValue("passenger-speed", fixed(sim.passengerSpeed, 1), "m/s");
      }
    }
    if (state.chapter === 2) {
      updateScreenLabelValue("car-speed", fixed(sim.law2V, 1), "m/s");
    }
    if (state.chapter === 3 && state.ch3Mode === "collision") {
      updateScreenLabelValue("crash-a", fixed(Math.abs(sim.law3SpeedA), 1), "m/s");
      updateScreenLabelValue("crash-b", fixed(Math.abs(sim.law3SpeedB), 1), "m/s");
    }
  }

  /* =========================================================
     11 · Physics animation
     ========================================================= */

  function spinWheels(car, speed, dt, direction) {
    if (!car) return;
    const sign = direction == null ? 1 : direction;
    car.wheels.forEach((wheel) => {
      wheel.rotation.z -= (speed * dt * sign) / 0.43;
    });
  }

  function advanceRoad(speed, dt) {
    if (!world.roadTexture) return;
    world.roadTexture.offset.x = (world.roadTexture.offset.x + speed * dt * 0.055) % 1;
  }

  function setScreenLabelState(id, value) {
    updateScreenLabelValue(id, value);
  }

  function updateSimulation(dt) {
    if (state.chapter === 0) {
      if (state.analysisMode === "rest") {
        sim.analysisSpeed = 0;
      } else if (state.analysisMode === "cruise") {
        sim.analysisSpeed = 8;
        advanceRoad(8, dt);
        spinWheels(world.carA, 8, dt);
      } else {
        sim.analysisT += dt;
        sim.analysisSpeed = Math.min(12, 4 + 2 * sim.analysisT);
        advanceRoad(sim.analysisSpeed, dt);
        spinWheels(world.carA, sim.analysisSpeed, dt);
      }
      return;
    }

    if (state.chapter === 1) {
      if (state.ch1Mode === "coast") {
        if (sim.ch1Running) {
          sim.ch1T += dt;
          const t = Math.min(sim.ch1T, 4.2);
          sim.ch1SpeedA = Math.max(0, 6 - 0.8 * t);
          sim.ch1SpeedB = 6;
          sim.ch1PosA = -4.4 + 0.36 * (6 * t - 0.4 * t * t);
          sim.ch1PosB = -4.4 + 0.36 * 6 * t;
          setCarPose(world.carA, sim.ch1PosA, 2.55, 0);
          setCarPose(world.carB, sim.ch1PosB, -2.55, 0);
          spinWheels(world.carA, sim.ch1SpeedA, dt);
          spinWheels(world.carB, sim.ch1SpeedB, dt);
          if (sim.ch1T >= 4.2) {
            sim.ch1T = 4.2;
            sim.ch1Running = false;
            sim.ch1Done = true;
            sim.ch1SpeedA = Math.max(0, 6 - 0.8 * 4.2);
            renderChapter({ preserveScroll: true });
          }
        }
        return;
      }

      /* Passenger inertia sequence */
      if (sim.passengerAction) {
        sim.passengerT += dt;
        let targetLean = 0;
        if (sim.passengerAction === "start") {
          sim.passengerSpeed = Math.min(5, 3.8 * sim.passengerT);
          targetLean = sim.passengerT < 1.15 ? 0.22 : sim.passengerT < 1.9 ? 0.08 : 0;
          setBrakeLights(world.carA, false);
          world.carA.belt.visible = false;
        } else {
          sim.passengerSpeed = Math.max(0, 8 - 5.2 * sim.passengerT);
          targetLean = sim.passengerT < 1.95 ? -0.3 : 0;
          setBrakeLights(world.carA, sim.passengerSpeed > 0.05);
          world.carA.belt.visible = true;
        }
        sim.passengerLean += (targetLean - sim.passengerLean) * (1 - Math.exp(-dt * 7));
        world.carA.dummy.rotation.z = sim.passengerLean;
        advanceRoad(sim.passengerSpeed, dt);
        spinWheels(world.carA, sim.passengerSpeed, dt);
      }
      return;
    }

    if (state.chapter === 2) {
      if (sim.law2Running) {
        const a = (sim.law2Force - FRICTION_N) / sim.law2Mass;
        sim.law2T = Math.min(5, sim.law2T + dt);
        sim.law2V = a * sim.law2T;
        sim.law2S = 0.5 * a * sim.law2T * sim.law2T;
        advanceRoad(sim.law2V, dt);
        spinWheels(world.carA, sim.law2V, dt);
        if (sim.law2T >= 5) {
          sim.law2Running = false;
          sim.law2Done = true;
          sim.law2T = 5;
          sim.law2V = a * 5;
          sim.law2S = 0.5 * a * 25;
          updatePanelDynamic();
        }
      }
      return;
    }

    if (state.chapter === 3) {
      if (state.ch3Mode === "drive") {
        if (sim.law3Running) {
          sim.law3T += dt;
          sim.law3DriveSpeed = Math.min(5, 3.4 * sim.law3T);
          advanceRoad(sim.law3DriveSpeed, dt);
          spinWheels(world.carA, sim.law3DriveSpeed, dt);
          if (sim.law3T >= 2.8) {
            sim.law3Running = false;
            sim.law3DriveSpeed = 5;
            updatePanelDynamic();
          }
        }
        return;
      }

      if (sim.law3Phase === "approach") {
        sim.law3T += dt;
        sim.law3SpeedA = 4;
        sim.law3SpeedB = -2.5;
        const t = Math.min(sim.law3T, 1.82);
        sim.law3CarAX = -9.4 + 4 * t;
        sim.law3CarBX = 6.7 - 2.5 * t;
        setCarPose(world.carA, sim.law3CarAX, 2.55, 0);
        setCarPose(world.carB, sim.law3CarBX, 2.55, Math.PI);
        spinWheels(world.carA, 4, dt);
        spinWheels(world.carB, 2.5, dt, -1);
        if (sim.law3T >= 1.82) {
          sim.law3Phase = "contact";
          sim.law3T = 0;
          sim.law3CarAX = -2.16;
          sim.law3CarBX = 2.16;
          setCarPose(world.carA, sim.law3CarAX, 2.55, 0);
          setCarPose(world.carB, sim.law3CarBX, 2.55, Math.PI);
          configureCollisionForces();
          setCollisionCarLabelsVisible(false);
          updatePanelDynamic();
        }
        return;
      }

      if (sim.law3Phase === "contact") {
        sim.law3T += dt;
        sim.law3SpeedA = 0;
        sim.law3SpeedB = 0;
        if (sim.law3T >= 1.2) {
          sim.law3Phase = "recoil";
          sim.law3T = 0;
          sim.law3SpeedA = -4;
          sim.law3SpeedB = 2.5;
          setForces([]);
          setCollisionCarLabelsVisible(true);
          updatePanelDynamic();
        }
        updateSparks(dt);
        return;
      }

      if (sim.law3Phase === "recoil") {
        sim.law3T += dt;
        const t = Math.min(sim.law3T, 1.25);
        sim.law3CarAX = -2.16 - 4 * t;
        sim.law3CarBX = 2.16 + 2.5 * t;
        sim.law3SpeedA = -4;
        sim.law3SpeedB = 2.5;
        setCarPose(world.carA, sim.law3CarAX, 2.55, 0);
        setCarPose(world.carB, sim.law3CarBX, 2.55, Math.PI);
        spinWheels(world.carA, 4, dt, -1);
        spinWheels(world.carB, 2.5, dt);
        if (sim.law3T >= 1.25) {
          sim.law3Phase = "done";
          sim.law3SpeedA = 0;
          sim.law3SpeedB = 0;
          updatePanelDynamic();
        }
        updateSparks(dt);
        return;
      }
      updateSparks(dt);
    }
  }

  /* =========================================================
     12 · Impact sparks
     ========================================================= */

  function burstSparks(origin) {
    if (!world.sparks) return;
    const count = 72;
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = origin.x;
      positions[i * 3 + 1] = origin.y;
      positions[i * 3 + 2] = origin.z;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4.2;
      velocities.push(new THREE.Vector3(
        Math.cos(angle) * speed * 0.6,
        Math.random() * speed + 0.8,
        Math.sin(angle) * speed * 0.48
      ));
    }
    world.sparks.geometry.dispose();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    world.sparks.geometry = geometry;
    world.sparks.material.opacity = 0.95;
    world.sparks.visible = true;
    world.sparkState = { positions: positions, velocities: velocities, life: 0, origin: origin.clone() };
  }

  function updateSparks(dt) {
    const sparks = world.sparks;
    const state = world.sparkState;
    if (!sparks || !state || !sparks.visible) return;
    state.life += dt;
    const positions = sparks.geometry.attributes.position.array;
    for (let i = 0; i < state.velocities.length; i += 1) {
      const velocity = state.velocities[i];
      velocity.y -= 7.5 * dt;
      positions[i * 3] += velocity.x * dt;
      positions[i * 3 + 1] += velocity.y * dt;
      positions[i * 3 + 2] += velocity.z * dt;
    }
    sparks.geometry.attributes.position.needsUpdate = true;
    sparks.material.opacity = Math.max(0, 1 - state.life / 1.1);
    if (state.life > 1.1) {
      sparks.visible = false;
    }
  }

  function hideSparks() {
    if (world.sparks) {
      world.sparks.visible = false;
      world.sparks.material.opacity = 0;
    }
    world.sparkState = null;
  }

  function flashImpact() {
    dom.impactFlash.classList.remove("is-active");
    void dom.impactFlash.offsetWidth;
    dom.impactFlash.classList.add("is-active");
    dom.stage.classList.add("is-impact");
    window.setTimeout(() => dom.stage.classList.remove("is-impact"), 800);
  }

  /* =========================================================
     13 · Render loop
     ========================================================= */

  function animate() {
    window.requestAnimationFrame(animate);
    if (!world.ready) return;
    const dt = Math.min(world.clock.getDelta(), 0.05);
    updateCamera(dt);
    if (state.chapter !== 4) updateSimulation(dt);
    updateForces();
    projectLabels();
    world.renderer.render(world.scene, world.camera);

    world.uiAccumulator += dt;
    if (world.uiAccumulator > 0.09) {
      world.uiAccumulator = 0;
      updateHudValues();
      refreshScreenLabelValues();
      updatePanelDynamic();
    }
  }

  /* =========================================================
     14 · Interaction bindings
     ========================================================= */

  function bindInterfaceEvents() {
    function toggleLanguage() {
      setLanguage(state.lang === "zh" ? "en" : "zh");
    }
    dom.langToggle.addEventListener("click", toggleLanguage);
    if (dom.stageLangToggle) dom.stageLangToggle.addEventListener("click", toggleLanguage);

    dom.chapterNav.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action='go-chapter']");
      if (!button) return;
      setChapter(Number(button.dataset.chapter));
    });

    dom.prevBtn.addEventListener("click", () => {
      setChapter(state.chapter - 1);
    });

    dom.nextBtn.addEventListener("click", () => {
      setChapter(state.chapter + 1);
    });

    dom.chapterRoot.addEventListener("click", (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (!actionEl) return;
      const action = actionEl.dataset.action;
      if (action === "set-analysis") {
        setAnalysisMode(actionEl.dataset.mode);
      } else if (action === "ch1-demo") {
        setCh1Mode(actionEl.dataset.mode);
      } else if (action === "ch1-play") {
        if (!sim.ch1Running) {
          if (sim.ch1Done) resetCoastRun();
          window.setTimeout(startCoastRun, 20);
        }
      } else if (action === "ch1-passenger") {
        startPassengerAction(actionEl.dataset.kind);
      } else if (action === "law2-launch") {
        startLaw2();
      } else if (action === "ch3-demo") {
        setCh3Mode(actionEl.dataset.mode);
      } else if (action === "law3-play") {
        startLaw3();
      } else if (action === "quiz-answer") {
        answerQuiz(Number(actionEl.dataset.question), Number(actionEl.dataset.option));
      } else if (action === "quiz-reset") {
        state.quizAnswers = [null, null, null, null];
        renderChapter({ preserveScroll: true });
      }
    });

    dom.chapterRoot.addEventListener("input", (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || !input.dataset.law2) return;
      const value = Number(input.value);
      if (input.dataset.law2 === "force") {
        sim.law2Force = value;
        const output = $("#forceValue");
        if (output) output.textContent = (value / 1000).toFixed(1);
      } else {
        sim.law2Mass = value;
        const output = $("#massValue");
        if (output) output.textContent = value.toLocaleString("en-US");
      }
      resetLaw2Sim();
      updateRangeVisuals();
      updatePanelDynamic();
      refreshSecondLawForceMap();
      configureLaw2Forces();
      updateHudValues();
      updateSceneCopy();
      drawVTChart();
    });

    window.addEventListener("keydown", (event) => {
      const target = event.target;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setChapter(Math.min(CHAPTERS.length - 1, state.chapter + 1));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setChapter(Math.max(0, state.chapter - 1));
      } else if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    });

    window.addEventListener("hashchange", () => {
      const index = CHAPTERS.findIndex((chapter) => chapter.id === window.location.hash.replace("#", ""));
      if (index >= 0 && index !== state.chapter) {
        setChapter(index, { updateHash: false });
      }
    });
  }

  function answerQuiz(questionIndex, optionIndex) {
    if (state.quizAnswers[questionIndex] !== null) return;
    if (!QUIZ[questionIndex] || !QUIZ[questionIndex].options[optionIndex]) return;
    state.quizAnswers[questionIndex] = optionIndex;
    renderChapter({ preserveScroll: true });
  }

  /* =========================================================
     15 · Boot
     ========================================================= */

  function boot() {
    applyStaticLanguage();
    buildNav();
    updateChrome();
    renderChapter({ scrollTop: true });
    bindInterfaceEvents();
    bindStageEvents();
    initWorld();
    if (world.ready) {
      configureChapterScene({ instantCamera: true });
      animate();
    } else {
      dom.stage.classList.add("is-fallback");
      configureChapterScene({ instantCamera: true });
    }
  }

  window.__NEWTON_GARAGE__ = {
    state: state,
    sim: sim,
    world: world,
    L: L,
    setChapter: setChapter,
    setLanguage: setLanguage,
    renderChapter: renderChapter,
    configureChapterScene: configureChapterScene,
    setAnalysisMode: setAnalysisMode,
    setCh1Mode: setCh1Mode,
    setCh3Mode: setCh3Mode,
    startCoastRun: startCoastRun,
    startPassengerAction: startPassengerAction,
    startLaw2: startLaw2,
    startLaw3: startLaw3,
    updatePanelDynamic: updatePanelDynamic,
    updateRangeVisuals: updateRangeVisuals,
    drawVTChart: drawVTChart,
    answerQuiz: answerQuiz
  };

  boot();
})();
