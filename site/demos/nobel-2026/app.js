/* ============================================================
   Nobel Prize 2026 — 3D lab · app
   ============================================================ */
(function () {
  'use strict';

  const V3 = THREE.Vector3;
  const clamp = THREE.MathUtils.clamp;

  if (THREE.ColorManagement) {
    if ('enabled' in THREE.ColorManagement) THREE.ColorManagement.enabled = true;
    if ('legacyMode' in THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
  }

  const ORDER = ['medicine', 'chemistry', 'physics'];

  /* ---------------- content ---------------- */

  const CONTENT = {
    medicine: {
      no: '01',
      zh: {
        name: '生理学或医学奖', sub: 'MEDICINE',
        eyebrow: 'NOBEL 2026 — 生理学或医学奖',
        headline: '一束蓝光<br>让神经元<span class="acc">开口说话</span>',
        enLine: 'Light-gated ion channels and optogenetics.',
        lead: '戴塞罗斯、黑格曼与纳格尔找到了自然界现成的光开关：来自绿藻的通道视紫红质。把它交给指定的神经元，再用蓝光一照，细胞便在毫秒间放电——神经科学第一次能用光读写大脑。',
        laureates: [
          ['Karl Deisseroth', '斯坦福大学 · 美国'],
          ['Peter Hegemann', '柏林洪堡大学 · 德国'],
          ['Georg Nagel', '维尔茨堡大学 · 德国']
        ],
        steps: [
          ['找到光开关', '2002—2003 年，Hegemann 与 Nagel 在莱茵衣藻中找到通道视紫红质 ChR1、ChR2，证明它们是被光直接打开的阳离子通道。'],
          ['装进神经元', '2005 年，Deisseroth 团队把 ChR2 基因导入大鼠神经元，一束蓝光就能触发动作电位，时间精度达到毫秒。'],
          ['分子机制', '全反式视黄醛吸收约 470 nm 的光子后异构化，通道孔打开，Na⁺、H⁺、Ca²⁺ 顺电化学梯度内流，膜电位由 −70 mV 去极化到正值。'],
          ['光遗传学', '基因决定“哪群细胞”，光决定“什么时候”。如今已用于帕金森病、癫痫、抑郁症与视觉修复的研究。']
        ],
        note: '拖动滑块改变光强：通道开放比例、内向电流与放电频率会同步变化。'
      },
      en: {
        name: 'Medicine', sub: '生理学或医学奖',
        eyebrow: 'NOBEL 2026 — PHYSIOLOGY OR MEDICINE',
        headline: 'A beam of blue light<br>makes neurons <span class="acc">speak</span>',
        enLine: '光门控离子通道与光遗传学。',
        lead: 'Deisseroth, Hegemann and Nagel found nature’s ready-made light switch: channelrhodopsin from green algae. Give it to chosen neurons, shine blue light, and they fire within milliseconds — reading and writing the brain with light.',
        laureates: [
          ['Karl Deisseroth', 'Stanford · USA'],
          ['Peter Hegemann', 'HU Berlin · Germany'],
          ['Georg Nagel', 'Würzburg · Germany']
        ],
        steps: [
          ['Finding the switch', 'In 2002–2003 Hegemann and Nagel identified channelrhodopsin-1 and -2 in Chlamydomonas reinhardtii and showed they are cation channels opened directly by light.'],
          ['Into neurons', 'In 2005 Deisseroth’s lab expressed ChR2 in rat neurons; a pulse of blue light triggered action potentials with millisecond precision.'],
          ['Molecular mechanism', 'All-trans retinal absorbs a ~470 nm photon and isomerises; the pore opens and Na⁺, H⁺ and Ca²⁺ flow in, taking the membrane from −70 mV to positive values.'],
          ['Optogenetics', 'Genes choose which cells, light chooses when. It now underpins research on Parkinson’s, epilepsy, depression and vision restoration.']
        ],
        note: 'Drag the slider: open probability, inward current and firing rate move together.'
      }
    },

    chemistry: {
      no: '02',
      zh: {
        name: '化学奖', sub: 'CHEMISTRY',
        eyebrow: 'NOBEL 2026 — 化学奖',
        headline: '一点点手性<br>被放大成<span class="acc">唯一答案</span>',
        enLine: 'Non-linear effects and autocatalysis in asymmetric synthesis.',
        lead: 'Kagan 发现手性催化剂的效率并不随纯度线性变化；Soai 则让产物自己催化自己。两个看似抽象的结果合在一起，解释了为什么微小的手性偏差可以被放大六个数量级——同手性或许是生命的必然。',
        laureates: [
          ['Henri B. Kagan', '巴黎南大学 · 法国'],
          ['Kenso Soai', '东京理科大学 · 日本']
        ],
        steps: [
          ['手性是什么', '互为镜像却不能重合的分子，就像左手和右手。同一药物的两个对映体，在体内可能有完全不同的作用。'],
          ['Kagan 的非线性效应', '手性催化剂会自组装成二聚体，异手性二聚体失去活性。于是催化剂 ee 稍高一点，产物 ee 就会高出许多，曲线呈 S 形。'],
          ['Soai 自催化', '1995 年，Soai 发现嘧啶基烷醇与二异丙基锌的反应中，产物本身就是催化剂，会优先复制与自己同手性的分子。'],
          ['六个数量级', '从 0.00005% ee 出发，三轮自催化即可达到 99.5% ee，放大约 2×10⁶ 倍，为生命同手性提供了一条可能的路径。']
        ],
        note: '纵轴为对数刻度：前两轮几乎看不出差别，第三轮直接封顶。'
      },
      en: {
        name: 'Chemistry', sub: '化学奖',
        eyebrow: 'NOBEL 2026 — CHEMISTRY',
        headline: 'A trace of handedness,<br>amplified into <span class="acc">one answer</span>',
        enLine: '不对称有机合成中的非线性效应与自催化。',
        lead: 'Kagan showed that a chiral catalyst’s performance is not linear in its purity; Soai made the product catalyse itself. Together they explain how a tiny chiral bias can be amplified six orders of magnitude — perhaps how life became homochiral.',
        laureates: [
          ['Henri B. Kagan', 'Paris-Sud · France'],
          ['Kenso Soai', 'Tokyo Univ. of Science · Japan']
        ],
        steps: [
          ['What chirality is', 'Mirror-image molecules that cannot be superimposed, like left and right hands. The two enantiomers of one drug can behave completely differently in the body.'],
          ['Kagan’s non-linear effect', 'Chiral catalysts self-assemble into dimers, and heterochiral dimers are inactive. A small excess of catalyst ee therefore gives a much larger product ee: an S-shaped curve.'],
          ['Soai’s autocatalysis', 'In 1995 Soai found that in the zinc reaction of pyrimidyl alkanols the product is itself the catalyst, preferentially copying its own handedness.'],
          ['Six orders of magnitude', 'Starting from 0.00005% ee, three rounds of autocatalysis reach 99.5% ee — a 2×10⁶-fold amplification, a plausible route to life’s homochirality.']
        ],
        note: 'The vertical axis is logarithmic: the first two rounds look flat, the third hits the ceiling.'
      }
    },

    physics: {
      no: '03',
      zh: {
        name: '物理学奖', sub: 'PHYSICS',
        eyebrow: 'NOBEL 2026 — 物理学奖',
        headline: '南极的冰<br>是最大的<span class="acc">望远镜</span>',
        enLine: 'A cubic kilometre of ice, watching the universe.',
        lead: '中微子不带电、几乎不与物质作用，却能穿过整个宇宙。哈尔岑在 1988 年提出：把南极的冰本身当作探测介质。IceCube 由此建成——86 串、5160 个光学模块，埋在 1.5 至 2.5 公里深处，第一次抓住了来自太阳系外的高能中微子。',
        laureates: [
          ['Francis Halzen', '威斯康星大学麦迪逊分校 · 美国']
        ],
        steps: [
          ['冰下望远镜', 'IceCube 占用 1 km³ 南极冰，86 串探测器、5160 个数字光学模块（DOM），2010 年建成运行，是全球最大的中微子探测器。'],
          ['中微子如何被看见', 'νμ 在冰中与原子核碰撞产生一个 μ 子；μ 子在冰中超过光速，发出切伦科夫蓝光，光锥张角约 41°，被沿途的 DOM 记录。'],
          ['2013 年的发现', '探测器记录到 PeV 级的高能事件，数量远超大气中微子能解释的范围，证实它们来自太阳系外的天体物理源。'],
          ['多信使天文学', '2017 年，事件 IceCube-170922A 与耀变体 TXS 0506+056 对应，人类第一次把一颗中微子追溯到具体的天体。']
        ],
        note: '拖动滑块提高中微子能量：μ 子径迹更亮，被点亮的 DOM 也更多。'
      },
      en: {
        name: 'Physics', sub: '物理学奖',
        eyebrow: 'NOBEL 2026 — PHYSICS',
        headline: 'Antarctic ice,<br>the largest <span class="acc">telescope</span> ever built',
        enLine: '一立方公里的冰，注视着宇宙。',
        lead: 'Neutrinos carry no charge and barely interact, yet they cross the whole universe. In 1988 Halzen proposed using Antarctic ice itself as the detector medium. IceCube followed: 86 strings, 5,160 optical modules, 1.5–2.5 km deep — and the first high-energy neutrinos from beyond the solar system.',
        laureates: [
          ['Francis Halzen', 'UW–Madison · USA']
        ],
        steps: [
          ['A telescope in ice', 'IceCube instruments a cubic kilometre of Antarctic ice with 86 strings and 5,160 digital optical modules. Running since 2010, it is the largest neutrino detector ever built.'],
          ['Seeing a neutrino', 'A muon neutrino collides with a nucleus and makes a muon. Travelling faster than light in ice, the muon emits Cherenkov blue light in a cone of about 41°, recorded by DOMs along its path.'],
          ['The 2013 discovery', 'PeV-scale events, far too many to come from atmospheric neutrinos, proved a flux of astrophysical origin.'],
          ['Multi-messenger astronomy', 'In 2017 event IceCube-170922A was matched to blazar TXS 0506+056 — the first neutrino traced back to a specific source.']
        ],
        note: 'Raise the neutrino energy: the muon track brightens and more DOMs light up.'
      }
    }
  };

  const CHAPTER = {
    medicine: { zh: '医学奖', en: 'Medicine' },
    chemistry: { zh: '化学奖', en: 'Chemistry' },
    physics: { zh: '物理学奖', en: 'Physics' }
  };

  const VARIANTS = {
    medicine: [
      { key: 'channel', zh: '光通道', en: 'Channel' },
      { key: 'neuron', zh: '神经元', en: 'Neuron' },
      { key: 'circuit', zh: '神经环路', en: 'Circuit' }
    ],
    chemistry: [
      { key: 'chiral', zh: '手性分子', en: 'Chirality' },
      { key: 'amp', zh: '自催化放大', en: 'Amplification' },
      { key: 'nle', zh: '非线性效应', en: 'Non-linear' }
    ],
    physics: [
      { key: 'array', zh: '探测器阵列', en: 'Array' },
      { key: 'event', zh: '中微子事件', en: 'Event' },
      { key: 'ice', zh: '冰层剖面', en: 'Ice sheet' }
    ]
  };

  function pctStr(v) {
    const p = v * 100;
    if (p >= 10) return p.toFixed(1) + '%';
    if (p >= 1) return p.toFixed(2) + '%';
    if (p >= 0.01) return p.toFixed(3) + '%';
    return p.toFixed(5) + '%';
  }

  function energyStr(v) {
    return v >= 1000 ? (v / 1000).toFixed(2) + ' PeV' : v.toFixed(0) + ' TeV';
  }

  const SLIDERS = {
    medicine: { key: 'light', min: 0, max: 1, step: 0.01, fmt: function (v) { return Math.round(v * 100) + '%'; }, zh: '光强', en: 'Light intensity' },
    chemistry: { key: 'ee0', min: 1e-7, max: 0.1, log: true, fmt: pctStr, zh: '初始 ee', en: 'Initial ee' },
    physics: { key: 'energy', min: 1, max: 10000, log: true, fmt: energyStr, zh: '中微子能量', en: 'Neutrino energy' }
  };

  const FORMULA = {
    medicine: 'I = g_max · P(open)',
    chemistry: 'ee₃ = ee₀ · 126³',
    physics: 'E_μ ≈ 0.8 · E_ν'
  };

  const RESULT_KEY = { medicine: 'i', chemistry: 'ee3', physics: 'emu' };

  const MLAB = {
    medicine: {
      zh: { i: '通道电流', rate: '放电频率', vm: '膜电位', open: '开放比例' },
      en: { i: 'Channel current', rate: 'Firing rate', vm: 'Membrane', open: 'Open fraction' }
    },
    chemistry: {
      zh: { ee0: '初始 ee', ee3: '最终 ee', amp: '放大倍数', rounds: '轮数' },
      en: { ee0: 'Initial ee', ee3: 'Final ee', amp: 'Amplification', rounds: 'Rounds' }
    },
    physics: {
      zh: { E: '中微子能量', emu: 'μ 子能量', hits: '命中 DOM' },
      en: { E: 'Neutrino energy', emu: 'Muon energy', hits: 'DOM hits' }
    }
  };

  const LEGEND = {
    medicine: {
      zh: [['#3fb6ea', '蓝光 470 nm'], ['#3fd6f2', '阳离子流'], ['#a8728f', '神经元']],
      en: [['#3fb6ea', 'Blue light'], ['#3fd6f2', 'Cations'], ['#a8728f', 'Neuron']]
    },
    chemistry: {
      zh: [['#ffb347', 'R 构型'], ['#45c8f0', 'S 构型'], ['#ffd166', 'ee 放大']],
      en: [['#ffb347', 'R form'], ['#45c8f0', 'S form'], ['#ffd166', 'ee growth']]
    },
    physics: {
      zh: [['#a48bff', '中微子 ν'], ['#d8f6ff', 'μ 子径迹'], ['#4fd0ff', '切伦科夫光']],
      en: [['#a48bff', 'Neutrino ν'], ['#d8f6ff', 'Muon track'], ['#4fd0ff', 'Cherenkov']]
    }
  };

  const MINI = {
    medicine: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="26" y="44" width="268" height="9" rx="2" fill="#e6e0d3"/>
      <path d="M150 34 L150 63 M170 34 L170 63" stroke="#0d7f9e" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M116 10 L146 33 M160 6 L160 31 M204 10 L174 33" stroke="#4bb8d8" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M160 53 L160 70" stroke="#0d7f9e" stroke-width="1" stroke-dasharray="2 2"/>
      <circle cx="160" cy="74" r="2.8" fill="#0d7f9e"/>
      <circle cx="152" cy="84" r="2" fill="#0d7f9e" opacity=".55"/>
      <circle cx="169" cy="82" r="2" fill="#0d7f9e" opacity=".4"/>
      <text x="178" y="52" font-size="8" fill="#9a9385" font-family="monospace">ChR2</text>
      <text x="196" y="22" font-size="8" fill="#9a9385" font-family="monospace">470 nm</text>
      <text x="30" y="42" font-size="8" fill="#9a9385" font-family="monospace">outside</text>
      <text x="30" y="66" font-size="8" fill="#9a9385" font-family="monospace">inside</text>
    </svg>`,
    chemistry: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="160" y1="6" x2="160" y2="90" stroke="#cfc8ba" stroke-dasharray="3 3"/>
      <circle cx="106" cy="46" r="6" fill="#17181a"/>
      <path d="M106 46 L90 28 M106 46 L122 30 M106 46 L94 64 M106 46 L122 62" stroke="#17181a" stroke-width="1.2"/>
      <circle cx="90" cy="28" r="3.4" fill="#ff6b6b"/><circle cx="122" cy="30" r="4.6" fill="#a48bff"/>
      <circle cx="94" cy="64" r="4" fill="#7f8ea3"/><circle cx="122" cy="62" r="2.6" fill="#c9d4e2"/>
      <circle cx="214" cy="46" r="6" fill="#17181a"/>
      <path d="M214 46 L230 28 M214 46 L198 30 M214 46 L226 64 M214 46 L198 62" stroke="#17181a" stroke-width="1.2"/>
      <circle cx="230" cy="28" r="3.4" fill="#ff6b6b"/><circle cx="198" cy="30" r="4.6" fill="#a48bff"/>
      <circle cx="226" cy="64" r="4" fill="#7f8ea3"/><circle cx="198" cy="62" r="2.6" fill="#c9d4e2"/>
      <text x="96" y="84" font-size="8" fill="#9a9385" font-family="monospace">R</text>
      <text x="214" y="84" font-size="8" fill="#9a9385" font-family="monospace">S</text>
      <text x="146" y="14" font-size="8" fill="#9a9385" font-family="monospace">σ</text>
    </svg>`,
    physics: `<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="26" y="10" width="268" height="9" fill="#dceaf3"/>
      <rect x="26" y="19" width="268" height="58" fill="#eef6fa"/>
      <rect x="26" y="77" width="268" height="11" fill="#e2ddd1"/>
      <rect x="26" y="36" width="268" height="22" fill="#cfe8f5" opacity=".85"/>
      <path d="M92 26 L92 72 M132 26 L132 72 M172 26 L172 72 M212 26 L212 72" stroke="#0d5f8a" stroke-width="1"/>
      <circle cx="92" cy="40" r="2.2" fill="#0d7f9e"/><circle cx="92" cy="52" r="2.2" fill="#0d7f9e"/><circle cx="92" cy="64" r="2.2" fill="#0d7f9e"/>
      <circle cx="132" cy="40" r="2.2" fill="#0d7f9e"/><circle cx="132" cy="52" r="2.2" fill="#0d7f9e"/><circle cx="132" cy="64" r="2.2" fill="#0d7f9e"/>
      <circle cx="172" cy="40" r="2.2" fill="#0d7f9e"/><circle cx="172" cy="52" r="2.2" fill="#0d7f9e"/><circle cx="172" cy="64" r="2.2" fill="#0d7f9e"/>
      <circle cx="212" cy="40" r="2.2" fill="#0d7f9e"/><circle cx="212" cy="52" r="2.2" fill="#0d7f9e"/><circle cx="212" cy="64" r="2.2" fill="#0d7f9e"/>
      <path d="M56 92 L236 22" stroke="#b05f18" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="240" y="20" font-size="8" fill="#9a9385" font-family="monospace">0 m</text>
      <text x="240" y="90" font-size="8" fill="#9a9385" font-family="monospace">−2800 m</text>
    </svg>`
  };

  /* ---------------- dom ---------------- */

  const $ = function (id) { return document.getElementById(id); };
  const stageEl = $('stage');
  const canvas = $('scene');
  const chipLayer = $('chips');
  const telemetryEl = $('telemetry');

  const state = {
    chapter: 'medicine',
    lang: 'zh',
    playing: true,
    spin: false,
    t: 0,
    variant: { medicine: 'channel', chemistry: 'chiral', physics: 'array' }
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
    $('boot').innerHTML =
      '<div class="boot-fail"><b>无法启动 3D 渲染</b><p>当前浏览器或设备未启用 WebGL，请更换浏览器后重试。<br>WebGL is not available in this browser.</p></div>';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  function buildEnvironment() {
    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 128;
    const ctx = cv.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 0, 128);
    grd.addColorStop(0, '#2c3f56');
    grd.addColorStop(0.42, '#16202c');
    grd.addColorStop(0.52, '#080d14');
    grd.addColorStop(1, '#030509');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 128);

    const keyGlow = ctx.createRadialGradient(76, 24, 0, 76, 24, 64);
    keyGlow.addColorStop(0, 'rgba(255,255,255,0.95)');
    keyGlow.addColorStop(0.35, 'rgba(205,228,255,0.32)');
    keyGlow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = keyGlow;
    ctx.fillRect(0, 0, 256, 128);

    const rimGlow = ctx.createRadialGradient(206, 54, 0, 206, 54, 58);
    rimGlow.addColorStop(0, 'rgba(80,150,255,0.5)');
    rimGlow.addColorStop(1, 'rgba(80,150,255,0)');
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
  scene.background = new THREE.Color(0x070a10);
  scene.fog = new THREE.Fog(0x070a10, 22, 52);
  scene.environment = buildEnvironment();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 240);

  scene.add(new THREE.HemisphereLight(0x9fc4ff, 0x060a10, 0.46));

  const key = new THREE.DirectionalLight(0xffffff, 1.65);
  key.position.set(6.5, 10, 7.5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x4f8fd6, 1.0);
  rim.position.set(-9, 6, -7);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xffa860, 0.3);
  fill.position.set(5, 2.5, 9);
  scene.add(fill);

  const front = new THREE.DirectionalLight(0xa8d4ff, 0.55);
  front.position.set(-2, 4, 12);
  scene.add(front);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(34, 64),
    new THREE.MeshStandardMaterial({ color: 0x04070c, roughness: 1.0, metalness: 0.0 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const grid = new THREE.GridHelper(48, 48, 0x14202c, 0x0b131b);
  grid.position.y = 0.002;
  grid.material.transparent = true;
  grid.material.opacity = 0.35;
  scene.add(grid);

  function setFloor(on) {
    ground.visible = on;
    grid.visible = on;
  }

  /* ---------------- camera orbit ---------------- */

  const cam = { theta: 0.6, phi: 1.1, radius: 12, target: new V3(0, 1.6, 0) };
  const goal = { theta: 0.6, phi: 1.1, radius: 12, target: new V3(0, 1.6, 0) };

  let dragging = false, lastX = 0, lastY = 0;

  canvas.addEventListener('pointerdown', function (e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.classList.add('dragging');
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    goal.theta -= dx * 0.006;
    goal.phi = clamp(goal.phi - dy * 0.005, 0.36, 1.52);
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
  canvas.addEventListener('wheel', function (e) {
    e.preventDefault();
    goal.radius = clamp(goal.radius * Math.exp(e.deltaY * 0.0011), 4.6, 30);
  }, { passive: false });

  function fitFactor() {
    const a = camera.aspect || 1.6;
    return clamp(1.42 / a, 1, 1.55);
  }

  function applyCamera(preset) {
    if (!preset) return;
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
    active.chips.forEach(function (def) {
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
    chipEls.forEach(function (c) {
      const box = c.el.querySelector('.fchip-v');
      if (box && c.def.value) box.textContent = c.def.value();
    });
  }

  function updateChips() {
    if (!chipEls.length) return;
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    chipEls.forEach(function (c) {
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
    ORDER.forEach(function (k, i) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chapter' + (state.chapter === k ? ' on' : '');
      b.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + '</b><span>' + CHAPTER[k][state.lang] + '</span>';
      b.addEventListener('click', function () { setMachine(k); });
      nav.appendChild(b);
    });
  }

  function renderVariants() {
    const box = $('variants');
    box.innerHTML = '';
    VARIANTS[state.chapter].forEach(function (v) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = state.lang === 'zh' ? v.zh : v.en;
      if (state.variant[state.chapter] === v.key) b.classList.add('on');
      b.addEventListener('click', function () {
        state.variant[state.chapter] = v.key;
        active.setVariant(v.key);
        if (active.cameras && active.cameras[v.key]) applyCamera(active.cameras[v.key]);
        renderVariants();
        syncSlider();
        refreshChipValues();
        updateMetrics();
      });
      box.appendChild(b);
    });
  }

  function sliderValue(cfg, t) {
    return cfg.log ? cfg.min * Math.pow(cfg.max / cfg.min, t) : cfg.min + (cfg.max - cfg.min) * t;
  }

  function sliderPos(cfg, v) {
    return cfg.log
      ? Math.log(v / cfg.min) / Math.log(cfg.max / cfg.min)
      : (v - cfg.min) / (cfg.max - cfg.min);
  }

  function fmtVal(cfg, v) {
    return cfg.fmt ? cfg.fmt(v) : v.toFixed(cfg.dec) + ' ' + cfg.unit;
  }

  function syncSlider() {
    const cfg = SLIDERS[state.chapter];
    const val = active.params[cfg.key];
    const sl = $('slider');
    if (cfg.log) {
      sl.min = 0;
      sl.max = 1;
      sl.step = 0.001;
      sl.value = sliderPos(cfg, val);
      sl.style.setProperty('--p', (sliderPos(cfg, val) * 100).toFixed(1) + '%');
    } else {
      sl.min = cfg.min;
      sl.max = cfg.max;
      sl.step = cfg.step;
      sl.value = val;
      sl.style.setProperty('--p', (((val - cfg.min) / (cfg.max - cfg.min)) * 100).toFixed(1) + '%');
    }
    $('slValue').textContent = fmtVal(cfg, val);
  }

  function updateMetrics() {
    const readout = active.readout();
    const labels = MLAB[state.chapter][state.lang];
    const rk = RESULT_KEY[state.chapter];
    const result = readout.find(function (r) { return r.k === rk; }) || readout[0];

    $('resFormula').textContent = FORMULA[state.chapter];
    $('resValue').textContent = result.v + (result.u ? ' ' + result.u : '');

    telemetryEl.innerHTML = '';
    readout.filter(function (r) { return r.c !== 'text'; }).slice(0, 3).forEach(function (r) {
      const d = document.createElement('div');
      d.className = 'tstat';
      d.innerHTML = '<div class="k">' + (labels[r.k] || r.k) + '</div><div class="v">' + r.v + (r.u ? '<u>' + r.u + '</u>' : '') + '</div>';
      telemetryEl.appendChild(d);
    });

    $('resNote').textContent = CONTENT[state.chapter][state.lang].note;
  }

  function renderPanel() {
    const c = CONTENT[state.chapter][state.lang];
    $('eyebrow').textContent = c.eyebrow;
    $('headline').innerHTML = c.headline;
    $('enLine').textContent = c.enLine;
    $('enLine').className = 'en-line' + (state.lang === 'en' ? ' cn' : '');
    $('lead').textContent = c.lead;

    $('laureates').innerHTML = c.laureates.map(function (l) {
      return '<div class="lau"><i></i><b>' + l[0] + '</b><span>' + l[1] + '</span></div>';
    }).join('');

    const ol = $('steps');
    ol.innerHTML = '';
    c.steps.forEach(function (s, i) {
      const li = document.createElement('li');
      li.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span><div><b>' + s[0] + '</b><p>' + s[1] + '</p></div>';
      ol.appendChild(li);
    });

    $('slLabel').textContent = SLIDERS[state.chapter][state.lang];
    $('mini').innerHTML = MINI[state.chapter];
    $('watermark').textContent = CONTENT[state.chapter].no;
    $('pageNum').textContent = String(ORDER.indexOf(state.chapter) + 1).padStart(2, '0') + ' / ' + String(ORDER.length).padStart(2, '0');

    $('prev').disabled = ORDER.indexOf(state.chapter) === 0;
    $('next').disabled = ORDER.indexOf(state.chapter) === ORDER.length - 1;

    $('labTitle').textContent = state.lang === 'zh' ? '实验台' : 'Lab bench';
    $('liveText').textContent = state.lang === 'zh' ? '实时' : 'Live';
    $('stepsTitle').textContent = state.lang === 'zh' ? '原理详解' : 'How it works';
    $('footNote').textContent = state.lang === 'zh'
      ? '三项诺贝尔奖 · 每项奖金 1 200 万瑞典克朗'
      : 'Three Nobel Prizes · 12 million SEK each';
    $('prevText').textContent = state.lang === 'zh' ? '上一项' : 'Prev';
    $('nextText').textContent = state.lang === 'zh' ? '下一项' : 'Next';
    $('badgeText').textContent = state.lang === 'zh' ? '实时三维演示' : 'Real-time 3D';
    $('stageHint').textContent = state.lang === 'zh' ? '拖动旋转 · 滚轮缩放' : 'Drag to rotate · Scroll to zoom';
    $('brandName').textContent = state.lang === 'zh' ? '诺贝尔奖 2026' : 'Nobel Prize 2026';
    $('gradeText').textContent = state.lang === 'zh' ? '2026 年度' : '2026';
    $('playText').textContent = state.playing ? (state.lang === 'zh' ? '暂停' : 'Pause') : (state.lang === 'zh' ? '播放' : 'Play');
    $('spinText').textContent = state.lang === 'zh' ? '自动旋转' : 'Auto spin';
    $('resetText').textContent = state.lang === 'zh' ? '重置视角' : 'Reset view';

    $('stageLegend').innerHTML = LEGEND[state.chapter][state.lang].map(function (x) {
      return '<span style="color:' + x[0] + '"><i></i>' + x[1] + '</span>';
    }).join('');

    renderChapters();
    renderVariants();
    syncSlider();
    updateMetrics();
  }

  /* ---------------- switching ---------------- */

  function setMachine(key, instant) {
    if (!scenes[key]) return;
    state.chapter = key;
    active = scenes[key];

    ORDER.forEach(function (k) { scenes[k].group.visible = k === key; });
    $('app').dataset.ch = key;
    setFloor(active.floor !== false);

    const vk = state.variant[key];
    active.setVariant(vk);

    const preset = active.cameras[vk] || active.cameras[Object.keys(active.cameras)[0]];
    if (instant) {
      cam.theta = goal.theta = preset.theta;
      cam.phi = goal.phi = preset.phi;
      cam.radius = goal.radius = preset.radius * fitFactor();
      cam.target.copy(preset.target);
      goal.target.copy(preset.target);
    } else {
      applyCamera(preset);
    }

    buildChips();
    renderPanel();
    $('scrollArea').scrollTop = 0;
  }

  function setLang(lang) {
    state.lang = lang;
    document.querySelectorAll('#langSwitch button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    buildChips();
    renderPanel();
  }

  /* ---------------- init ---------------- */

  function initScenes() {
    const builders = {
      medicine: SM.buildOpto,
      chemistry: SM.buildChem,
      physics: SM.buildPhys
    };
    ORDER.forEach(function (k) {
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

  $('slider').addEventListener('input', function (e) {
    const cfg = SLIDERS[state.chapter];
    const t = parseFloat(e.target.value);
    const v = sliderValue(cfg, t);
    active.setParam(cfg.key, v);
    $('slValue').textContent = fmtVal(cfg, v);
    const p = cfg.log ? t * 100 : ((v - cfg.min) / (cfg.max - cfg.min)) * 100;
    e.target.style.setProperty('--p', p.toFixed(1) + '%');
    refreshChipValues();
    updateMetrics();
  });

  $('prev').addEventListener('click', function () {
    const i = ORDER.indexOf(state.chapter);
    if (i > 0) setMachine(ORDER[i - 1]);
  });
  $('next').addEventListener('click', function () {
    const i = ORDER.indexOf(state.chapter);
    if (i < ORDER.length - 1) setMachine(ORDER[i + 1]);
  });

  document.querySelectorAll('#langSwitch button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  $('btnPlay').addEventListener('click', function () {
    state.playing = !state.playing;
    $('playText').textContent = state.playing ? (state.lang === 'zh' ? '暂停' : 'Pause') : (state.lang === 'zh' ? '播放' : 'Play');
    $('playIcon').setAttribute('d', state.playing ? 'M5.5 3.5v9M10.5 3.5v9' : 'M5 3.4 L12 8 L5 12.6 Z');
  });

  $('btnSpin').addEventListener('click', function () {
    state.spin = !state.spin;
    $('btnSpin').classList.toggle('on', state.spin);
  });

  $('btnReset').addEventListener('click', function () {
    const vk = state.variant[state.chapter];
    applyCamera(active.cameras[vk]);
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ') {
      e.preventDefault();
      $('btnPlay').click();
    } else if (e.key === 'ArrowRight') {
      $('next').click();
    } else if (e.key === 'ArrowLeft') {
      $('prev').click();
    } else if (/^[1-3]$/.test(e.key)) {
      setMachine(ORDER[parseInt(e.key, 10) - 1]);
    }
  });

  /* ---------------- loop ---------------- */

  const clock = new THREE.Clock();
  const camQuat = new THREE.Quaternion();

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
    camera.getWorldQuaternion(camQuat);

    if (active) {
      active.update(state.t);
      if (active.setCamera) active.setCamera(camQuat);
    }

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
        [0, 0.5, 1].forEach(function (t) {
          const val = cfg.log ? cfg.min * Math.pow(cfg.max / cfg.min, t) : cfg.min + (cfg.max - cfg.min) * t;
          active.setParam(cfg.key, val);
          active.readout();
          active.update(2.4);
        });
        updateMetrics();
      });
      setLang('en');
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

    const h = (location.hash || '').replace('#', '');
    const q = new URLSearchParams(location.search).get('m');
    const start = ORDER.indexOf(h) >= 0 ? h : (ORDER.indexOf(q) >= 0 ? q : 'medicine');

    const vq = new URLSearchParams(location.search).get('v');
    if (vq && VARIANTS[start].some(function (v) { return v.key === vq; })) state.variant[start] = vq;

    setMachine(start, true);
    setLang(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh');

    if (new URLSearchParams(location.search).has('selftest')) runSelfTest();

    tick();
    requestAnimationFrame(function () {
      setTimeout(function () {
        const b = $('boot');
        b.classList.add('hide');
        setTimeout(function () { b.remove(); }, 800);
      }, 320);
    });
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
