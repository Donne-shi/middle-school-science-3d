/* ============================================================
   Simple Machines 3D Lab — app
   ============================================================ */
(function () {
  'use strict';

  const V3 = THREE.Vector3;
  const clamp = THREE.MathUtils.clamp;

  if (THREE.ColorManagement) {
    if ('enabled' in THREE.ColorManagement) THREE.ColorManagement.enabled = true;
    if ('legacyMode' in THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
  }
  const ORDER = ['lever', 'pulley', 'wheel', 'incline', 'screw', 'wedge'];

  /* ---------------- content ---------------- */

  const CONTENT = {
    lever: {
      no: '01',
      zh: {
        name: '杠杆', sub: 'LEVER',
        eyebrow: 'CHAPTER 01 — 杠杆 / LEVER',
        headline: '给我一个支点<br>我能撬动<span class="acc">地球</span>',
        enLine: 'Give me a fulcrum, and I shall move the Earth.',
        lead: '撬棍、天平、钓鱼竿——三件实物，三种杠杆。省力还是费力，只看动力臂和阻力臂谁更长，这正是阿基米德那句豪言的底气。',
        steps: [
          ['五个要素', '支点 O、动力 F₁、阻力 G、动力臂 L₁、阻力臂 L₂，缺一不可。'],
          ['力臂怎么量', '力臂是支点到力的作用线的垂直距离，不是支点到作用点的距离。'],
          ['平衡条件', 'F₁L₁ = G·L₂。两边力矩相等，杠杆才保持平衡。'],
          ['三类杠杆', '撬棍 L₁>L₂ 省力费距离；天平 L₁=L₂ 只改方向；钓鱼竿 L₁<L₂ 省距离却费力。']
        ],
        note: '切换三种实物模型，注意动力箭头长度与 L₁、L₂ 的比例关系。'
      },
      en: {
        name: 'Lever', sub: '杠杆',
        eyebrow: 'CHAPTER 01 — LEVER / 杠杆',
        headline: 'Give me a fulcrum<br>and I can move the <span class="acc">Earth</span>',
        enLine: '给我一个支点，我就能撬动地球。',
        lead: 'A crowbar, a balance, a fishing rod — three objects, three classes of lever. Whether it saves force depends only on which arm is longer: the physics behind Archimedes’ famous boast.',
        steps: [
          ['Five elements', 'Fulcrum O, effort F₁, load G, effort arm L₁ and load arm L₂.'],
          ['Measuring an arm', 'It is the perpendicular distance from the fulcrum to the line of action — not to the point where the force is applied.'],
          ['Balance', 'F₁L₁ = G·L₂: equal torques keep the lever still.'],
          ['Three classes', 'Crowbar L₁>L₂ saves force but costs distance; balance L₁=L₂ only redirects; rod L₁<L₂ saves distance but costs force.']
        ],
        note: 'Switch between the three models and compare the effort arrow with the L₁ : L₂ ratio.'
      }
    },

    pulley: {
      no: '02',
      zh: {
        name: '滑轮', sub: 'PULLEY',
        eyebrow: 'CHAPTER 02 — 滑轮 / PULLEY',
        headline: 'n 段绳子<br>把重物<span class="acc">分成 n 份</span>',
        enLine: 'n rope segments share the load — that is why F = G / n.',
        lead: '滑轮是边缘带槽的小轮。定滑轮像等臂杠杆，只改变方向；动滑轮省一半力，却要多拉一倍绳；把几个滑轮组合起来，省力倍数就看承担物重的绳段数 n。',
        steps: [
          ['定滑轮', '轴固定，1 段绳承担物重，F = G。不省力，但可以改变力的方向。'],
          ['动滑轮', '轴随物体移动，2 段绳承担物重，F = G/2。省一半力，绳端要多移动一倍距离。'],
          ['滑轮组', 'n 段绳承担物重时每段张力都是 F，由 nF = G 得 F = G/n，既省力又能改变方向。'],
          ['机械效率', 'η = W有用/W总 = Gh/(Fs)，摩擦和动滑轮自重都会让它小于 1。']
        ],
        note: '切换四种滑轮系统，先数清承担物重的绳段数 n，再看每段绳上的张力箭头。'
      },
      en: {
        name: 'Pulley', sub: '滑轮',
        eyebrow: 'CHAPTER 02 — PULLEY / 滑轮',
        headline: 'n rope segments<br>split the load <span class="acc">n ways</span>',
        enLine: 'n 段绳子，把重物分成 n 份。',
        lead: 'A pulley is a grooved wheel. Fixed, it behaves like an equal-arm lever and only redirects the force; movable, it halves the effort but doubles the rope you pull. Combine several and the advantage is simply the number of rope segments n carrying the load.',
        steps: [
          ['Fixed pulley', 'The axle is fixed and 1 segment carries the load: F = G. No force saved, but the direction changes.'],
          ['Movable pulley', 'The axle moves with the load and 2 segments carry it: F = G/2, at the cost of pulling twice the rope.'],
          ['Pulley system', 'With n segments each at tension F, nF = G gives F = G/n — force saved and direction changed.'],
          ['Efficiency', 'η = Gh/(Fs) < 1 because of friction and the pulley’s own weight.']
        ],
        note: 'Switch systems, count the segments n that carry the load, then read the tension arrow on each one.'
      }
    },

    wheel: {
      no: '03',
      zh: {
        name: '轮轴', sub: 'WHEEL & AXLE',
        eyebrow: 'CHAPTER 03 — 轮轴 / WHEEL & AXLE',
        headline: '轮转一圈<br>省力<span class="acc">好几倍</span>',
        enLine: 'A bigger wheel turns effort into leverage.',
        lead: '轮和轴固定在一起，绕同一根轴线转动。轮半径就是动力臂，轴半径就是阻力臂——轮轴其实就是杠杆换了一身衣服。',
        steps: [
          ['杠杆变形', '轮半径 R 是动力臂，轴半径 r 是阻力臂，F₁R = F₂r。'],
          ['省力规律', 'F₁ = F₂·r/R。轮越大、轴越细，越省力，但要转更多圈。'],
          ['反向使用', '动力作用在轴上时反而费力，却能省距离，比如自行车后轮。'],
          ['生活实例', '方向盘、门把手、水龙头、扳手、辘轳、螺丝刀。']
        ],
        note: '轮越大，提起同样重物所需的拉力越小，但手柄要走更长的路。'
      },
      en: {
        name: 'Wheel & Axle', sub: '轮轴',
        eyebrow: 'CHAPTER 03 — WHEEL & AXLE / 轮轴',
        headline: 'A bigger wheel<br>turns effort into <span class="acc">leverage</span>',
        enLine: '轮子越大，越省力。',
        lead: 'A wheel locked to an axle, both turning about one axis. The wheel radius is the effort arm and the axle radius is the load arm — a lever in disguise.',
        steps: [
          ['A lever in disguise', 'R is the effort arm and r the load arm, so F₁R = F₂r.'],
          ['Rule', 'F₁ = F₂·r/R. A big wheel on a thin axle saves force but needs more turns.'],
          ['Reversed', 'Driving the axle instead multiplies distance rather than force — like a bicycle hub.'],
          ['Examples', 'Steering wheel, door handle, tap, wrench, windlass, screwdriver.']
        ],
        note: 'The larger the wheel, the smaller the effort — but the handle travels further.'
      }
    },

    incline: {
      no: '04',
      zh: {
        name: '斜面', sub: 'INCLINED PLANE',
        eyebrow: 'CHAPTER 04 — 斜面 / INCLINED PLANE',
        headline: '把高度<br>摊成<span class="acc">距离</span>',
        enLine: 'Trade height for distance, and the climb gets easier.',
        lead: '斜面用距离换力。高度不变时，坡越长越平缓，推上去越省力，但要多走一段路——没有哪种机械能让你少做功。',
        steps: [
          ['功的原理', '不计摩擦时 F·s = G·h，使用任何机械都不省功。'],
          ['省力公式', 'F = G·h/s。斜面越长、越平缓，推力越小。'],
          ['效率', '实际有摩擦，η = Gh/(Fs) < 1，坡度越小摩擦的影响越明显。'],
          ['生活实例', '盘山公路、楼梯、无障碍坡道、滑梯、装卸跳板。']
        ],
        note: '改变倾角，观察推力箭头和 h/s 比值如何一起变化。'
      },
      en: {
        name: 'Inclined Plane', sub: '斜面',
        eyebrow: 'CHAPTER 04 — INCLINED PLANE / 斜面',
        headline: 'Trade height for distance,<br>and the climb gets <span class="acc">easier</span>',
        enLine: '把高度摊成距离，路就好走了。',
        lead: 'An incline trades distance for force. For a fixed height, a longer ramp is gentler and needs less push — but you walk further. No machine saves work.',
        steps: [
          ['Work principle', 'Ignoring friction, F·s = G·h. No machine saves work.'],
          ['Formula', 'F = G·h/s: a longer, gentler ramp needs less push.'],
          ['Efficiency', 'With friction η = Gh/(Fs) < 1; gentle ramps suffer more from friction.'],
          ['Examples', 'Mountain roads, stairs, wheelchair ramps, slides, loading boards.']
        ],
        note: 'Change the angle and watch the push arrow and the h/s ratio move together.'
      }
    },

    screw: {
      no: '05',
      zh: {
        name: '螺旋', sub: 'SCREW',
        eyebrow: 'CHAPTER 05 — 螺旋 / SCREW',
        headline: '把斜面<br>绕成<span class="acc">螺纹</span>',
        enLine: 'A screw is a ramp wrapped around a cylinder.',
        lead: '把一张直角三角形纸片卷到圆柱上，斜边就成了螺纹。螺丝钉、瓶盖、千斤顶，都是斜面绕圈工作的样子。',
        steps: [
          ['斜面变形', '螺纹展开是一个直角三角形：底边 2πR，高是螺距 p。'],
          ['省力公式', 'F = G·p/(2πR)。螺距越小、手柄越长，越省力。'],
          ['自锁', '螺纹间的摩擦让螺丝受力后不会自己退出，这也是它能固定的原因。'],
          ['生活实例', '螺丝、瓶盖、千斤顶、台虎钳、螺旋压力机。']
        ],
        note: '螺距越小，转一圈只前进一点点，但省力倍数越高。'
      },
      en: {
        name: 'Screw', sub: '螺旋',
        eyebrow: 'CHAPTER 05 — SCREW / 螺旋',
        headline: 'A screw is a ramp<br>wrapped around a <span class="acc">cylinder</span>',
        enLine: '把斜面绕在圆柱上，就是螺纹。',
        lead: 'Wrap a right triangle around a cylinder and its hypotenuse becomes a thread. Screws, bottle caps and jacks are all ramps working in circles.',
        steps: [
          ['A wrapped ramp', 'Unrolled, one turn is a right triangle: base 2πR, height p.'],
          ['Formula', 'F = G·p/(2πR): a finer pitch or a longer handle means less effort.'],
          ['Self-locking', 'Friction in the thread stops the screw from backing out — that is why it holds.'],
          ['Examples', 'Screws, bottle caps, jacks, vices, screw presses.']
        ],
        note: 'A finer pitch advances less per turn, but multiplies force more.'
      }
    },

    wedge: {
      no: '06',
      zh: {
        name: '楔子', sub: 'WEDGE',
        eyebrow: 'CHAPTER 06 — 楔子 / WEDGE',
        headline: '薄薄一片<br>劈开<span class="acc">千斤</span>',
        enLine: 'A thin edge splits what a hammer cannot.',
        lead: '楔子是背靠背的两个斜面。斧头、凿子、钉子都靠它：向下的推力被斜面转成侧向的劈开力，越薄越锋利。',
        steps: [
          ['两个斜面', '楔子把推力分解到两侧，形成巨大的劈开力。'],
          ['省力规律', 'N = F·L/t。楔子越薄（t 小）、越长（L 大），劈开力越大。'],
          ['靠冲击工作', '楔子通常靠冲击和摩擦工作，能量损失大，一般不谈机械效率。'],
          ['生活实例', '斧头、凿子、钉子、刀、针、木楔、破窗器。']
        ],
        note: '楔子越薄，同样的推力产生的劈开力越大，但也更容易崩口。'
      },
      en: {
        name: 'Wedge', sub: '楔子',
        eyebrow: 'CHAPTER 06 — WEDGE / 楔子',
        headline: 'A thin edge splits<br>what a hammer <span class="acc">cannot</span>',
        enLine: '薄薄一片，劈开千斤。',
        lead: 'A wedge is two inclined planes back to back. An axe, a chisel, a nail: a downward push becomes a sideways splitting force.',
        steps: [
          ['Two ramps', 'The push is split into two sideways forces.'],
          ['Formula', 'N = F·L/t: thinner (small t) and longer (large L) wedges split harder.'],
          ['Impact', 'Wedges work by impact and friction, so efficiency is rarely the point.'],
          ['Examples', 'Axe, chisel, nail, knife, needle, wooden wedge, glass breaker.']
        ],
        note: 'A thinner wedge multiplies force more — but its edge is easier to chip.'
      }
    }
  };

  const CHAPTER = {
    lever: { zh: '杠杆', en: 'Lever' },
    pulley: { zh: '滑轮', en: 'Pulley' },
    wheel: { zh: '轮轴', en: 'Wheel' },
    incline: { zh: '斜面', en: 'Incline' },
    screw: { zh: '螺旋', en: 'Screw' },
    wedge: { zh: '楔子', en: 'Wedge' }
  };

  const VARIANTS = {
    lever: [
      { key: 'power', zh: '省力杠杆', en: 'Force-saving' },
      { key: 'equal', zh: '等臂杠杆', en: 'Equal arm' },
      { key: 'effort', zh: '费力杠杆', en: 'Distance-saving' }
    ],
    pulley: [
      { key: 'fixed', zh: '定滑轮 n=1', en: 'Fixed n=1' },
      { key: 'movable', zh: '动滑轮 n=2', en: 'Movable n=2' },
      { key: 'block3', zh: '滑轮组 n=3', en: 'Tackle n=3' },
      { key: 'block4', zh: '滑轮组 n=4', en: 'Tackle n=4' }
    ],
    wheel: [
      { key: 'big', zh: '大轮', en: 'Big' },
      { key: 'std', zh: '标准', en: 'Standard' },
      { key: 'small', zh: '小轮', en: 'Small' }
    ],
    incline: [
      { key: 'gentle', zh: '缓坡 16°', en: 'Gentle 16°' },
      { key: 'std', zh: '标准 24°', en: 'Standard 24°' },
      { key: 'steep', zh: '陡坡 33°', en: 'Steep 33°' }
    ],
    screw: [
      { key: 'coarse', zh: '粗牙', en: 'Coarse' },
      { key: 'std', zh: '标准', en: 'Standard' },
      { key: 'fine', zh: '细牙', en: 'Fine' }
    ],
    wedge: [
      { key: 'thick', zh: '厚楔', en: 'Thick' },
      { key: 'std', zh: '标准', en: 'Standard' },
      { key: 'thin', zh: '薄楔', en: 'Thin' }
    ]
  };

  const SLIDERS = {
    lever: { key: 'G', min: 40, max: 200, step: 5, unit: 'N', dec: 0, zh: '物重 G', en: 'Load G' },
    pulley: { key: 'G', min: 40, max: 200, step: 5, unit: 'N', dec: 0, zh: '物重 G', en: 'Load G' },
    wheel: { key: 'R', min: 0.85, max: 1.45, step: 0.01, unit: 'm', dec: 2, zh: '轮半径 R', en: 'Wheel radius R' },
    incline: { key: 'angle', min: 12, max: 38, step: 1, unit: '°', dec: 0, zh: '倾角 θ', en: 'Angle θ' },
    screw: { key: 'R', min: 0.5, max: 1.1, step: 0.01, unit: 'm', dec: 2, zh: '手柄半径 R', en: 'Handle radius R' },
    wedge: { key: 'L', min: 1.2, max: 2.6, step: 0.02, unit: 'm', dec: 2, zh: '楔长 L', en: 'Wedge length L' }
  };

  const FORMULA = {
    lever: 'F₁ = G · L₂ / L₁',
    pulley: 'F = G / n',
    wheel: 'F = G · r / R',
    incline: 'F = G · h / s',
    screw: 'F = G · p / 2πR',
    wedge: 'N = F · L / t'
  };

  const RESULT_KEY = { lever: 'f1', pulley: 'f', wheel: 'f', incline: 'f', screw: 'f', wedge: 'n' };

  const MLAB = {
    lever: {
      zh: { f1: '动力 F₁', ma: '力臂比', l1: '动力臂 L₁', l2: '阻力臂 L₂', cls: '类型' },
      en: { f1: 'Effort F₁', ma: 'Arm ratio', l1: 'Effort arm', l2: 'Load arm', cls: 'Class' }
    },
    pulley: {
      zh: { load: '物重 G', f: '拉力 F', n: '绳段数 n', save: '省力', note: '公式' },
      en: { load: 'Load G', f: 'Effort F', n: 'Rope segments n', save: 'Force saved', note: 'Formula' }
    },
    wheel: {
      zh: { f: '动力 F', ma: '优势 R/r', R: '轮半径 R', r: '轴半径 r', note: '公式' },
      en: { f: 'Effort F', ma: 'Advantage R/r', R: 'Wheel R', r: 'Axle r', note: 'Formula' }
    },
    incline: {
      zh: { f: '推力 F', ma: '优势 s/h', len: '斜面长 s', h: '高 h', note: '倾角' },
      en: { f: 'Push F', ma: 'Advantage s/h', len: 'Length s', h: 'Height h', note: 'Angle' }
    },
    screw: {
      zh: { f: '动力 F', ma: '优势 2πR/p', p: '螺距 p', R: '手柄 R', note: '公式' },
      en: { f: 'Effort F', ma: 'Advantage 2πR/p', p: 'Pitch p', R: 'Handle R', note: 'Formula' }
    },
    wedge: {
      zh: { n: '劈开力 N', gain: '增益 L/t', t: '楔厚 t', L: '楔长 L', note: '公式' },
      en: { n: 'Splitting N', gain: 'Gain L/t', t: 'Thickness t', L: 'Length L', note: 'Formula' }
    }
  };

  const CLASS_VAL = {
    zh: { power: '省力杠杆', equal: '等臂杠杆', effort: '费力杠杆' },
    en: { power: 'Force-saving', equal: 'Equal-arm', effort: 'Distance-saving' }
  };

  const MINI = {
    lever: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="16" y1="78" x2="304" y2="78" stroke="#e6e0d3"/>
      <path d="M160 78 L145 55 L175 55 Z" stroke="#17181a" stroke-width="1.3" stroke-linejoin="round"/>
      <line x1="70" y1="43" x2="252" y2="43" stroke="#17181a" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="160" y1="43" x2="160" y2="55" stroke="#17181a" stroke-width="1"/>
      <path d="M94 18 L94 36 M88 30 L94 37 L100 30" stroke="#2b9fbd" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M228 18 L228 36 M222 30 L228 37 L234 30" stroke="#dd5a2b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="94" y1="64" x2="160" y2="64" stroke="#cfc8ba" stroke-dasharray="3 3"/>
      <line x1="160" y1="64" x2="228" y2="64" stroke="#cfc8ba" stroke-dasharray="3 3"/>
      <text x="118" y="76" font-size="8.5" fill="#9a9385" font-family="monospace">L2</text>
      <text x="188" y="76" font-size="8.5" fill="#9a9385" font-family="monospace">L1</text>
    </svg>`,
    pulley: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="64" y1="16" x2="256" y2="16" stroke="#17181a" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="160" cy="36" r="16" stroke="#17181a" stroke-width="1.4"/>
      <circle cx="160" cy="36" r="3" fill="#17181a"/>
      <path d="M144 36 L144 72 M176 36 L176 54" stroke="#2b9fbd" stroke-width="1.4"/>
      <rect x="128" y="72" width="32" height="20" rx="2" stroke="#2b9fbd" stroke-width="1.4"/>
      <path d="M176 56 L176 70 M170 64 L176 71 L182 64" stroke="#dd5a2b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    wheel: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="118" cy="46" r="33" stroke="#17181a" stroke-width="1.6"/>
      <circle cx="118" cy="46" r="11" stroke="#17181a" stroke-width="1.3"/>
      <line x1="118" y1="46" x2="151" y2="46" stroke="#dd5a2b" stroke-width="1.2" stroke-dasharray="3 2"/>
      <line x1="118" y1="46" x2="118" y2="35" stroke="#2b9fbd" stroke-width="1.2"/>
      <text x="132" y="42" font-size="8.5" fill="#dd5a2b" font-family="monospace">R</text>
      <text x="122" y="40" font-size="8.5" fill="#2b9fbd" font-family="monospace">r</text>
      <line x1="118" y1="79" x2="118" y2="88" stroke="#cfc8ba" stroke-dasharray="3 3"/>
      <path d="M206 22 L206 56" stroke="#2b9fbd" stroke-width="1.2" stroke-dasharray="3 2"/>
      <rect x="190" y="58" width="32" height="20" rx="2" stroke="#2b9fbd" stroke-width="1.4"/>
      <path d="M230 30 L230 48 M224 42 L230 49 L236 42" stroke="#dd5a2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    incline: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M58 80 L262 80 L262 26 Z" stroke="#17181a" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="152" y="42" width="24" height="24" rx="2" transform="rotate(-16 164 54)" fill="#fff" stroke="#2b9fbd" stroke-width="1.4"/>
      <line x1="278" y1="80" x2="278" y2="26" stroke="#cfc8ba" stroke-dasharray="3 3"/>
      <line x1="272" y1="80" x2="284" y2="80" stroke="#cfc8ba"/>
      <line x1="272" y1="26" x2="284" y2="26" stroke="#cfc8ba"/>
      <text x="286" y="56" font-size="8.5" fill="#9a9385" font-family="monospace">h</text>
      <text x="150" y="92" font-size="8.5" fill="#9a9385" font-family="monospace">s</text>
      <path d="M196 40 L214 30 M206 29 L215 29 L214 38" stroke="#dd5a2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    screw: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="62" y="14" width="24" height="66" rx="2" stroke="#17181a" stroke-width="1.3"/>
      <path d="M62 24 L86 33 M62 36 L86 45 M62 48 L86 57 M62 60 L86 69" stroke="#dd5a2b" stroke-width="1.2"/>
      <line x1="40" y1="14" x2="108" y2="14" stroke="#17181a" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M136 80 L248 80 L248 34 Z" stroke="#17181a" stroke-width="1.2" stroke-linejoin="round"/>
      <text x="182" y="92" font-size="8.5" fill="#9a9385" font-family="monospace">2πR</text>
      <text x="254" y="58" font-size="8.5" fill="#9a9385" font-family="monospace">p</text>
    </svg>`,
    wedge: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="92" y="30" width="136" height="50" rx="3" stroke="#17181a" stroke-width="1.4"/>
      <path d="M160 14 L174 32 L146 32 Z" stroke="#dd5a2b" stroke-width="1.5" stroke-linejoin="round" fill="#fff"/>
      <line x1="160" y1="32" x2="160" y2="80" stroke="#e6e0d3" stroke-width="1.2"/>
      <path d="M136 52 L114 52 M120 46 L113 52 L120 58" stroke="#2b9fbd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M184 52 L206 52 M200 46 L207 52 L200 58" stroke="#2b9fbd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M160 6 L160 12 M155 7 L160 2 L165 7" stroke="#dd5a2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };

  /* ---------------- dom ---------------- */

  const $ = id => document.getElementById(id);
  const stageEl = $('stage');
  const canvas = $('scene');
  const chipLayer = $('chips');
  const telemetryEl = $('telemetry');

  const state = {
    machine: 'lever', lang: 'zh', playing: true, spin: false, t: 0,
    variant: { lever: 'power', pulley: 'block3', wheel: 'std', incline: 'std', screw: 'std', wedge: 'std' }
  };
  const scenes = {};
  let active = null;
  let chipEls = [];

  /* ---------------- renderer ---------------- */

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (err) {
    renderer = null;
  }
  if (!renderer) {
    document.getElementById('boot').innerHTML =
      '<div class="boot-fail"><b>无法启动 3D 渲染</b><p>当前浏览器或设备未启用 WebGL，请更换浏览器后重试。<br>WebGL is not available in this browser.</p></div>';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  function buildEnvironment() {
    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 128;
    const ctx = cv.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 0, 128);
    grd.addColorStop(0, '#31465f');
    grd.addColorStop(0.42, '#18222f');
    grd.addColorStop(0.52, '#0a0f16');
    grd.addColorStop(1, '#04060a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 128);

    const keyGlow = ctx.createRadialGradient(78, 26, 0, 78, 26, 62);
    keyGlow.addColorStop(0, 'rgba(255,255,255,0.95)');
    keyGlow.addColorStop(0.35, 'rgba(200,225,255,0.35)');
    keyGlow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = keyGlow;
    ctx.fillRect(0, 0, 256, 128);

    const rimGlow = ctx.createRadialGradient(205, 52, 0, 205, 52, 55);
    rimGlow.addColorStop(0, 'rgba(90,160,255,0.55)');
    rimGlow.addColorStop(1, 'rgba(90,160,255,0)');
    ctx.fillStyle = rimGlow;
    ctx.fillRect(0, 0, 256, 128);

    const tex = new THREE.CanvasTexture(cv);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
    tex.dispose();
    return env;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090c12);
  scene.fog = new THREE.Fog(0x090c12, 18, 42);
  scene.environment = buildEnvironment();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0x9fc4ff, 0x080c12, 0.5));

  const key = new THREE.DirectionalLight(0xffffff, 2.15);
  key.position.set(6.5, 11, 7.5);
  key.castShadow = true;
  key.shadow.mapSize.width = 2048;
  key.shadow.mapSize.height = 2048;
  key.shadow.camera.left = -11;
  key.shadow.camera.right = 11;
  key.shadow.camera.top = 13;
  key.shadow.camera.bottom = -6;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 40;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.022;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x4f8fd6, 1.15);
  rim.position.set(-9, 6, -7);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xffa860, 0.35);
  fill.position.set(5, 2.5, 9);
  scene.add(fill);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(30, 64),
    new THREE.MeshStandardMaterial({ color: 0x05080e, roughness: 1.0, metalness: 0.0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(44, 44, 0x16222f, 0x0c141d);
  grid.position.y = 0.002;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  scene.add(grid);

  /* ---------------- camera orbit ---------------- */

  const cam = { theta: 0.6, phi: 1.1, radius: 12, target: new V3(0, 1.6, 0) };
  const goal = { theta: 0.6, phi: 1.1, radius: 12, target: new V3(0, 1.6, 0) };

  let dragging = false, lastX = 0, lastY = 0;

  canvas.addEventListener('pointerdown', e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.classList.add('dragging');
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    goal.theta -= dx * 0.006;
    goal.phi = clamp(goal.phi - dy * 0.005, 0.36, 1.44);
    cam.theta = goal.theta;
    cam.phi = goal.phi;
  });
  function endDrag() {
    dragging = false;
    canvas.classList.remove('dragging');
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', endDrag);
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    goal.radius = clamp(goal.radius * Math.exp(e.deltaY * 0.0011), 5.2, 24);
  }, { passive: false });

  function fitFactor() {
    const a = camera.aspect || 1.6;
    return clamp(1.42 / a, 1, 1.55);
  }

  function applyCamera(preset) {
    goal.theta = preset.theta;
    goal.phi = preset.phi;
    goal.radius = preset.radius * fitFactor();
    goal.target.copy(preset.target);
  }

  /* ---------------- chips ---------------- */

  function chipName(def) {
    return state.lang === 'zh' ? def.zh : def.en;
  }

  function buildChips() {
    chipLayer.innerHTML = '';
    chipEls = [];
    if (!active) return;
    active.chips.forEach(def => {
      const el = document.createElement('div');
      el.className = 'fchip' + (def.small ? ' sm' : '') + (def.title ? ' title' : '');
      el.style.setProperty('--c', def.color);
      if (def.title) {
        el.innerHTML = '<div class="fchip-name">' + chipName(def) + '</div><div class="fchip-s">' + (def.sub || '') + '</div>';
      } else {
        el.innerHTML = '<div class="fchip-top"><span class="dot"></span><span class="fchip-name">' + chipName(def) + '</span></div>' +
          (def.value ? '<div class="fchip-v">' + def.value() + '</div>' : '');
      }
      chipLayer.appendChild(el);
      chipEls.push({ el: el, def: def, v: new V3() });
    });
  }

  function refreshChipValues() {
    chipEls.forEach(c => {
      const box = c.el.querySelector('.fchip-v');
      if (box && c.def.value) box.textContent = c.def.value();
    });
  }

  function updateChips() {
    if (!chipEls.length) return;
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    chipEls.forEach(c => {
      const p = c.def.pos();
      c.v.copy(p).project(camera);
      const visible = c.v.z < 1 && (!c.def.visible || c.def.visible());
      const x = (c.v.x * 0.5 + 0.5) * w;
      const y = (-c.v.y * 0.5 + 0.5) * h;
      c.el.style.transform = 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      c.el.style.opacity = visible ? '1' : '0';
    });
  }

  /* ---------------- panel ---------------- */

  function renderChapters() {
    const nav = $('chapters');
    nav.innerHTML = '';
    ORDER.forEach((key, i) => {
      const c = CONTENT[key];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chapter' + (state.machine === key ? ' on' : '');
      b.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + '</b><span>' + CHAPTER[key][state.lang] + '</span>';
      b.addEventListener('click', () => setMachine(key));
      nav.appendChild(b);
    });
  }

  function renderVariants() {
    const box = $('variants');
    box.innerHTML = '';
    const list = VARIANTS[state.machine];
    list.forEach(v => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = state.lang === 'zh' ? v.zh : v.en;
      if (state.variant[state.machine] === v.key) b.classList.add('on');
      b.addEventListener('click', () => {
        state.variant[state.machine] = v.key;
        active.setVariant(v.key);
        applyCamera(active.camera);
        renderVariants();
        syncSlider();
        refreshChipValues();
        updateMetrics();
      });
      box.appendChild(b);
    });
  }

  function syncSlider() {
    const cfg = SLIDERS[state.machine];
    const val = active.params[cfg.key];
    const sl = $('slider');
    sl.min = cfg.min;
    sl.max = cfg.max;
    sl.step = cfg.step;
    sl.value = val;
    const pct = ((val - cfg.min) / (cfg.max - cfg.min)) * 100;
    sl.style.setProperty('--p', pct + '%');
    $('slValue').textContent = Number(val).toFixed(cfg.dec) + ' ' + cfg.unit;
  }

  function updateMetrics() {
    const readout = active.readout();
    const labels = MLAB[state.machine][state.lang];
    const rk = RESULT_KEY[state.machine];
    const result = readout.find(r => r.k === rk) || readout[0];

    $('resFormula').textContent = FORMULA[state.machine];
    $('resValue').textContent = result.v + (result.u ? ' ' + result.u : '');

    telemetryEl.innerHTML = '';
    readout.filter(r => r.c !== 'text').slice(0, 3).forEach(r => {
      const d = document.createElement('div');
      d.className = 'tstat';
      d.innerHTML = '<div class="k">' + (labels[r.k] || r.k) + '</div><div class="v">' + r.v + (r.u ? '<u>' + r.u + '</u>' : '') + '</div>';
      telemetryEl.appendChild(d);
    });

    const cls = readout.find(r => r.c === 'text');
    const clsText = cls ? (CLASS_VAL[state.lang][cls.v] || cls.v) : null;
    $('resNote').textContent = (clsText ? clsText + ' · ' : '') + CONTENT[state.machine][state.lang].note;
  }

  function renderPanel() {
    const c = CONTENT[state.machine][state.lang];
    $('eyebrow').textContent = c.eyebrow;
    $('headline').innerHTML = c.headline;
    $('enLine').textContent = c.enLine;
    $('enLine').className = 'en-line' + (state.lang === 'en' ? ' cn' : '');
    $('lead').textContent = c.lead;

    const ol = $('steps');
    ol.innerHTML = '';
    c.steps.forEach((s, i) => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span><div><b>' + s[0] + '</b><p>' + s[1] + '</p></div>';
      ol.appendChild(li);
    });

    $('slLabel').textContent = SLIDERS[state.machine][state.lang];
    $('mini').innerHTML = MINI[state.machine];
    $('watermark').textContent = CONTENT[state.machine].no;
    $('pageNum').textContent = String(ORDER.indexOf(state.machine) + 1).padStart(2, '0') + ' / ' + String(ORDER.length).padStart(2, '0');

    $('prev').disabled = ORDER.indexOf(state.machine) === 0;
    $('next').disabled = ORDER.indexOf(state.machine) === ORDER.length - 1;

    $('labTitle').textContent = state.lang === 'zh' ? '实验台' : 'Lab bench';
    $('liveText').textContent = state.lang === 'zh' ? '实时' : 'Live';
    $('stepsTitle').textContent = state.lang === 'zh' ? '原理详解' : 'How it works';
    $('footNote').textContent = state.lang === 'zh' ? '使用任何机械都不省功 · No machine saves work' : 'No machine saves work · 使用任何机械都不省功';
    $('prevText').textContent = state.lang === 'zh' ? '上一节' : 'Prev';
    $('nextText').textContent = state.lang === 'zh' ? '下一节' : 'Next';
    $('badgeText').textContent = state.lang === 'zh' ? '实时三维演示' : 'Real-time 3D';
    $('stageHint').textContent = state.lang === 'zh' ? '拖动旋转 · 滚轮缩放' : 'Drag to rotate · Scroll to zoom';
    $('brandName').textContent = state.lang === 'zh' ? '简单机械' : 'Simple Machines';
    $('gradeText').textContent = state.lang === 'zh' ? '初中科学' : 'Middle School';
    $('playText').textContent = state.playing ? (state.lang === 'zh' ? '暂停' : 'Pause') : (state.lang === 'zh' ? '播放' : 'Play');
    $('spinText').textContent = state.lang === 'zh' ? '自动旋转' : 'Auto spin';
    $('resetText').textContent = state.lang === 'zh' ? '重置视角' : 'Reset view';

    const lg = [
      ['#ffb347', state.lang === 'zh' ? '动力 Effort' : 'Effort 动力'],
      ['#3fd6f2', state.lang === 'zh' ? '阻力 Load' : 'Load 阻力'],
      ['#a48bff', state.lang === 'zh' ? '尺寸 Dimension' : 'Dimension 尺寸']
    ];
    $('stageLegend').innerHTML = lg.map(x => '<span style="color:' + x[0] + '"><i></i>' + x[1] + '</span>').join('');

    renderChapters();
    renderVariants();
    syncSlider();
    updateMetrics();
  }

  /* ---------------- switching ---------------- */

  function setMachine(key, instant) {
    if (!scenes[key]) return;
    state.machine = key;
    active = scenes[key];

    ORDER.forEach(k => { scenes[k].group.visible = k === key; });

    if (instant) {
      cam.theta = goal.theta = active.camera.theta;
      cam.phi = goal.phi = active.camera.phi;
      cam.radius = goal.radius = active.camera.radius * fitFactor();
      cam.target.copy(active.camera.target);
      goal.target.copy(active.camera.target);
    } else {
      applyCamera(active.camera);
    }

    buildChips();
    renderPanel();
    $('scrollArea').scrollTop = 0;
  }

  function setLang(lang) {
    state.lang = lang;
    document.querySelectorAll('#langSwitch button').forEach(b => {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    buildChips();
    renderPanel();
  }

  /* ---------------- init ---------------- */

  function initScenes() {
    const builders = {
      lever: SM.buildLever,
      pulley: SM.buildPulley,
      wheel: SM.buildWheel,
      incline: SM.buildIncline,
      screw: SM.buildScrew,
      wedge: SM.buildWedge
    };
    ORDER.forEach(k => {
      const s = builders[k]();
      s.group.visible = false;
      scene.add(s.group);
      scenes[k] = s;
    });
  }

  function resize() {
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(stageEl);
  window.addEventListener('resize', resize);

  /* ---------------- events ---------------- */

  $('slider').addEventListener('input', e => {
    const cfg = SLIDERS[state.machine];
    const v = parseFloat(e.target.value);
    active.setParam(cfg.key, v);
    $('slValue').textContent = v.toFixed(cfg.dec) + ' ' + cfg.unit;
    e.target.style.setProperty('--p', ((v - cfg.min) / (cfg.max - cfg.min)) * 100 + '%');
    refreshChipValues();
    updateMetrics();
    if (state.machine !== 'pulley' && state.machine !== 'lever') {
      document.querySelectorAll('#variants button').forEach(b => b.classList.remove('on'));
    }
  });

  $('prev').addEventListener('click', () => {
    const i = ORDER.indexOf(state.machine);
    if (i > 0) setMachine(ORDER[i - 1]);
  });
  $('next').addEventListener('click', () => {
    const i = ORDER.indexOf(state.machine);
    if (i < ORDER.length - 1) setMachine(ORDER[i + 1]);
  });

  document.querySelectorAll('#langSwitch button').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  $('btnPlay').addEventListener('click', () => {
    state.playing = !state.playing;
    $('playText').textContent = state.playing ? (state.lang === 'zh' ? '暂停' : 'Pause') : (state.lang === 'zh' ? '播放' : 'Play');
    $('playIcon').setAttribute('d', state.playing ? 'M5.5 3.5v9M10.5 3.5v9' : 'M5 3.4 L12 8 L5 12.6 Z');
  });

  $('btnSpin').addEventListener('click', () => {
    state.spin = !state.spin;
    $('btnSpin').classList.toggle('on', state.spin);
  });

  $('btnReset').addEventListener('click', () => {
    applyCamera(active.camera);
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ') {
      e.preventDefault();
      $('btnPlay').click();
    } else if (e.key === 'ArrowRight') {
      $('next').click();
    } else if (e.key === 'ArrowLeft') {
      $('prev').click();
    } else if (/^[1-6]$/.test(e.key)) {
      setMachine(ORDER[parseInt(e.key, 10) - 1]);
    }
  });

  /* ---------------- loop ---------------- */

  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);

    if (state.playing) state.t += dt;
    if (state.spin && !dragging) goal.theta += dt * 0.16;

    const k = Math.min(1, dt * 6.5);
    cam.theta += (goal.theta - cam.theta) * k;
    cam.phi += (goal.phi - cam.phi) * k;
    cam.radius += (goal.radius - cam.radius) * k;
    cam.target.lerp(goal.target, k);

    const sp = Math.sin(cam.phi);
    camera.position.set(
      cam.target.x + cam.radius * sp * Math.sin(cam.theta),
      cam.target.y + cam.radius * Math.cos(cam.phi),
      cam.target.z + cam.radius * sp * Math.cos(cam.theta)
    );
    camera.lookAt(cam.target);

    if (active) active.update(state.t);

    renderer.render(scene, camera);
    updateChips();
  }

  /* ---------------- boot ---------------- */


  function runSelfTest() {
    const out = [];
    try {
      ORDER.forEach(function (k) {
        setMachine(k, true);
        VARIANTS[k].forEach(function (v) {
          state.variant[k] = v.key;
          active.setVariant(v.key);
          active.readout();
          active.update(1.2);
          buildChips();
          refreshChipValues();
        });
        const cfg = SLIDERS[k];
        [cfg.min, (cfg.min + cfg.max) / 2, cfg.max].forEach(function (val) {
          active.setParam(cfg.key, val);
          active.readout();
          active.update(2.4);
        });
        updateMetrics();
      });
      setLang('en');
      setMachine('pulley', true);
      state.variant.pulley = 'fixed';
      active.setVariant('fixed');
      updateMetrics();
      setLang('zh');
      out.push('OK');
    } catch (e) {
      out.push('FAIL ' + e.message + ' | ' + String(e.stack || '').split('\n')[1]);
    }
    document.title = 'SELFTEST ' + out.join(' ');
  }



  function boot() {
    initScenes();
    resize();
    const params = new URLSearchParams(location.search);
    const h = (location.hash || '').replace('#', '');
    const q = params.get('m');
    const start = ORDER.indexOf(h) >= 0 ? h : (ORDER.indexOf(q) >= 0 ? q : 'lever');
    setMachine(start, true);
    const v = params.get('v');
    if (v && VARIANTS[start].some(x => x.key === v)) {
      state.variant[start] = v;
      scenes[start].setVariant(v);
      applyCamera(scenes[start].camera);
      cam.theta = goal.theta;
      cam.phi = goal.phi;
      cam.radius = goal.radius;
      cam.target.copy(goal.target);
      renderVariants();
      syncSlider();
      refreshChipValues();
      updateMetrics();
    }
    setLang(params.get('lang') === 'en' ? 'en' : 'zh');
    if (params.has('selftest')) runSelfTest();
    tick();
    requestAnimationFrame(() => {
      setTimeout(() => {
        const b = $('boot');
        b.classList.add('hide');
        setTimeout(() => b.remove(), 800);
      }, 320);
    });
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
