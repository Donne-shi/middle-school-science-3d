/******************************************************************************
 * 原子图鉴 ATOMIC ATLAS — 3D Interactive Scientific Monograph Engine (v3.0)
 * Historical and quantum teaching illustrations; visual scales are schematic.
 ******************************************************************************/

const SPECIMENS = [
  /* ==========================================================================
   * GROUP 1: 历史演进模型 · HISTORICAL MODELS (01 - 05)
   * ========================================================================== */
  {
    id: 1,
    num: "01",
    group: "historical",
    groupZh: "历史演进模型",
    groupEn: "HISTORICAL MODELS",
    titleZh: "道尔顿实心球",
    titleEn: "DALTON SOLID SPHERE",
    latin: "Sphaera Atomica Solida (Dalton, 1803)",
    taxonomyZh: "近代原子论 · 均质不可分割刚性微粒",
    taxonomyEn: "Modern Atomic Theory · Homogeneous Indivisible Sphere",
    tags: ["均质实心 · 不可分割", "⌀ ~ 100 pm", "John Dalton"],
    scaleText: "100 pm",
    expBtnZh: "组合水分子",
    expBtnEn: "Build H₂O",
    quoteZh: "万物最坚硬的起点，也是化学反应中永不泯灭的最小实心微粒",
    quoteEn: "The indestructible, homogeneous solid sphere at the dawn of quantitative chemistry.",
    proseZh: [
      "1803年，英国化学家<strong>约翰·道尔顿（John Dalton）</strong>基于质量守恒定律与定比定律，提出了近代科学史上第一个定量原子论。他认为一切物质都由极其微小的、坚硬致密的<strong>均质实心球体（Solid Sphere）</strong>构成——原子内部没有任何空隙、分层或更小的亚原子微粒（点击底部<strong>「◒ 剖切」</strong>可观察其完全均质的实心内部截面）。",
      "道尔顿认为同种元素的原子完全相同，化学反应是原子按简单整数比重新组合。下方用今天已知的 H₂O 分子式演示这一思想；道尔顿本人当时误将水写作 HO。"
    ],
    proseEn: [
      "In 1803, British chemist <strong>John Dalton</strong> formulated the first quantitative atomic theory. He envisioned atoms as dense, <strong>homogeneous, indivisible solid spheres</strong> with no internal layers, nucleus, or subatomic particles (click <strong>Slice ◒</strong> to inspect its uniform solid cross-section).",
      "Dalton held that atoms of each element were identical and that reactions rearranged atoms in whole-number ratios. The H₂O animation uses the modern formula; Dalton himself incorrectly wrote water as HO."
    ],
    dataGrid: [
      { lbl: "提出年代 YEAR", val: "1803 年", sub: "英国曼彻斯特" },
      { lbl: "特征直径 SCALE", val: "约 100 pm", sub: "10⁻¹⁰ m 数量级" },
      { lbl: "内部结构 INTERIOR", val: "100% 均质实心", sub: "无原子核与电子" },
      { lbl: "实验依据 EVIDENCE", val: "质量守恒与定比定律", sub: "倍比定律定量分析" },
      { lbl: "可分割性 DIVISIBILITY", val: "当时认为不可分割", sub: "后来发现电子与原子核" },
      { lbl: "历史局限 LIMITATION", val: "未知亚原子结构", sub: "无法解释静电与阴极射线" }
    ],
    callouts: [
      { x: 0, y: 0, z: 0, ox: -155, oy: -85, zh: "均质实心内部 (无核无分层)", en: "Homogeneous solid interior" },
      { x: 85, y: 0, z: 55, ox: 155, oy: -65, zh: "刚性不可分割球面边界", en: "Indivisible rigid surface" },
      { x: -65, y: 55, z: -55, ox: -150, oy: 92, zh: "元素特征原子半径", en: "Characteristic element radius" }
    ]
  },
  {
    id: 2,
    num: "02",
    group: "historical",
    groupZh: "历史演进模型",
    groupEn: "HISTORICAL MODELS",
    titleZh: "汤姆孙葡萄干布丁",
    titleEn: "THOMSON PLUM PUDDING",
    latin: "Corpuscula in Sphaera Positiva (Thomson, 1897)",
    taxonomyZh: "电子的发现 · 均匀正电荷球镶嵌负电电子",
    taxonomyEn: "Discovery of Electron · Electrons in Uniform Positive Sphere",
    tags: ["正电荷均匀球 · 嵌布电子", "无中心原子核", "J.J. Thomson"],
    scaleText: "100 pm",
    expBtnZh: "施加外电场极化",
    expBtnEn: "Apply E-Field",
    quoteZh: "阴极射线撕开了实心球的外壳，负电电子如葡萄干般镶嵌在正电荷布丁之中",
    quoteEn: "Cathode rays proved atoms are divisible: negative electrons embedded in a uniform positive sphere.",
    proseZh: [
      "1897年，<strong>J.J. 汤姆孙（J.J. Thomson）</strong>通过阴极射线管实验发现了质量仅为氢原子 1/1836 的带负电微粒——<strong>电子（Electron, e⁻）</strong>。由于整个原子呈电中性，汤姆孙于1904年提出了著名的<strong>「葡萄干布丁模型 / 西瓜模型」</strong>。",
      "请注意该模型的结构准确性：汤姆孙模型<strong>没有中心原子核</strong>！整个原子是一个<strong>正电荷（+）均匀弥散分布的大球体</strong>（如同布丁或西瓜瓤），而带负电的<strong>电子（e⁻，蓝色小球）</strong>呈对称平衡环层镶嵌在正电球体内部，正负电荷总量严格相等。"
    ],
    proseEn: [
      "In 1897, <strong>J.J. Thomson</strong> discovered the negatively charged <strong>electron (e⁻)</strong> using cathode ray tubes. Because atoms are electrically neutral overall, he proposed the <strong>Plum Pudding Model</strong>.",
      "Crucially, there is <strong>no central nucleus</strong> in Thomson's model: positive charge (+) is distributed uniformly throughout the entire spherical volume, while identical negative <strong>electrons (e⁻, cyan spheres)</strong> are embedded in symmetric equilibrium rings inside."
    ],
    dataGrid: [
      { lbl: "提出年代 YEAR", val: "1897 — 1904", sub: "剑桥卡文迪许实验室" },
      { lbl: "发现微粒 PARTICLE", val: "电子 (Electron, e⁻)", sub: "质量约为质子的 1/1836" },
      { lbl: "正电荷分布 POSITIVE", val: "全球体均匀分布 (+)", sub: "无中心原子核" },
      { lbl: "电子排布 ELECTRONS", val: "同心环层对称镶嵌", sub: "受正电背景静电约束" },
      { lbl: "关键实验 EVIDENCE", val: "阴极射线电磁偏转", sub: "测定电子荷质比 e/m" },
      { lbl: "历史局限 LIMITATION", val: "正电荷密度过低", sub: "无法解释 α 粒子大角反弹" }
    ],
    callouts: [
      { x: 0, y: 0, z: 95, ox: -155, oy: -92, zh: "均匀分布正电荷球体 (+)", en: "Uniform positive charge sphere (+)" },
      { x: 64, y: 0, z: 22, ox: 155, oy: -35, zh: "镶嵌负电电子 (e⁻)", en: "Embedded negative electron (e⁻)" },
      { x: -55, y: 55, z: -38, ox: -150, oy: 92, zh: "同心静电平衡环", en: "Concentric equilibrium ring" }
    ]
  },
  {
    id: 3,
    num: "03",
    group: "historical",
    groupZh: "历史演进模型",
    groupEn: "HISTORICAL MODELS",
    titleZh: "卢瑟福核式结构",
    titleEn: "RUTHERFORD NUCLEAR",
    latin: "Nucleus Centralis et Orbitae (Rutherford, 1911)",
    taxonomyZh: "核式行星模型 · 极小致密核与广袤真空",
    taxonomyEn: "Nuclear Planetary Model · Dense Core in Empty Space",
    tags: ["中心原子核 · 核外电子", "原子核远小于原子", "Ernest Rutherford"],
    scaleText: "100 pm (核 ~0.001 pm)",
    expBtnZh: "原子核比例脉冲",
    expBtnEn: "Nucleus Pulse",
    quoteZh: "如果把原子放大到一座体育场那么大，原子核只是场地中央的一颗小弹珠",
    quoteEn: "If the atom were a stadium, the nucleus would be a tiny marble at the center.",
    proseZh: [
      "1911年，<strong>欧内斯特·卢瑟福（Ernest Rutherford）</strong>根据 α 粒子散射实验提出<strong>原子核式结构模型（Nuclear Model）</strong>：原子核极小，原子的绝大部分体积在核外。这推翻了汤姆孙的均匀正电球图景。",
      "卢瑟福的模型将<strong>正电荷和绝大部分质量</strong>集中到很小的<strong>原子核</strong>中，电子位于核外。图中绕核运动的路径表现的是当时的历史设想；现代量子力学用电子出现的概率分布描述核外区域。"
    ],
    proseEn: [
      "In 1911, <strong>Ernest Rutherford</strong> used alpha-particle scattering to propose the <strong>Nuclear Model</strong>: the nucleus is tiny compared with the atom, overturning Thomson's diffuse positive sphere.",
      "Rutherford placed positive charge and almost all atomic mass in a tiny central <strong>nucleus</strong>. The paths shown here represent a historical model; modern quantum mechanics describes electrons by a probability distribution rather than literal planetary trajectories."
    ],
    dataGrid: [
      { lbl: "提出年代 YEAR", val: "1911 年", sub: "英国曼彻斯特大学" },
      { lbl: "原子核直径 NUCLEUS", val: "约 10⁻¹⁵ m (1 fm)", sub: "仅为原子直径的十万分之一" },
      { lbl: "质量占比 MASS SHARE", val: "绝大部分集中于核", sub: "质子与中子是后来确认的核内粒子" },
      { lbl: "尺度对比 SCALE", val: "原子核远小于原子", sub: "核外区域由电子概率分布描述" },
      { lbl: "向心作用力 FORCE", val: "库仑静电引力", sub: "F = k·Ze² / r²" },
      { lbl: "经典物理危机 CRISIS", val: "电磁辐射坍缩问题", sub: "加速电子应辐射能量坠入核内" }
    ],
    callouts: [
      { x: 0, y: 0, z: 0, ox: -155, oy: -88, zh: "极小高密度正电原子核 (+Ze)", en: "Tiny dense positive nucleus (+Ze)" },
      { x: 135, y: 0, z: 45, ox: 158, oy: -55, zh: "高速绕核运行电子 (e⁻)", en: "High-speed orbiting electron (e⁻)" },
      { x: -75, y: 75, z: -45, ox: -150, oy: 92, zh: "广阔的核外区域", en: "Region beyond the nucleus" }
    ]
  },
  {
    id: 4,
    num: "04",
    group: "historical",
    groupZh: "历史演进模型",
    groupEn: "HISTORICAL MODELS",
    titleZh: "金箔 α 粒子散射实验",
    titleEn: "GOLD FOIL ALPHA SCATTERING",
    latin: "Dispersio Particularum Alpha (Geiger–Marsden, 1909)",
    taxonomyZh: "决定性物理实验 · 带正电 α 粒子轰击金原子核",
    taxonomyEn: "Crucial Experiment · Positive Alpha Particles (He²⁺) vs. Gold Foil",
    tags: ["入射微粒: α粒子 (He²⁺, +2e)", "靶核: 金核 (Au⁷⁹⁺)", "并非电子轰击!"],
    scaleText: "近核库仑散射区",
    expBtnZh: "切换宽束/对准核正碰",
    expBtnEn: "Toggle Head-On Beam",
    quoteZh: "注意：轰击金箔的是带正电的 α 粒子（氦原子核 He²⁺），而非带负电的电子！",
    quoteEn: "Crucial Note: Gold foil is bombarded by positively charged Alpha particles (He²⁺ nuclei), NOT electrons!",
    proseZh: [
      "<strong>【核心概念勘误与解析】</strong>在卢瑟福金箔实验中，发射出去轰击金箔的<strong>绝不是电子</strong>，而是放射性元素钋（Po）释放出的高速<strong>α 粒子（即氦原子核 ⁴₂He²⁺，由 2 个质子和 2 个中子紧束缚而成，带 +2e 正电荷，质量约为电子的 7300 倍）</strong>！",
      "带正电的 α 粒子射向薄金箔时：<strong>绝大多数</strong>穿过金箔，<strong>一小部分</strong>发生偏转，<strong>极少数</strong>发生大角度散射。图中用绿色、黄色和红色区分这些路径；粒子数量是教学示意，不能当成实验测量比例。"
    ],
    proseEn: [
      "<strong>[Key Scientific Precision]</strong> The projectiles bombarding the gold foil are <strong>NOT electrons</strong>—they are heavy, positively charged <strong>Alpha Particles (⁴₂He²⁺ helium nuclei, composed of 2 protons + 2 neutrons, charge +2e, ~7,300× heavier than an electron)</strong>!",
      "When alpha particles strike thin gold foil, <strong>most pass through</strong>, <strong>some deflect</strong>, and <strong>very few scatter through large angles</strong>. The green, amber, and red paths are teaching illustrations; their counts are not measured experimental proportions."
    ],
    dataGrid: [
      { lbl: "入射轰击微粒 PROJECTILE", val: "α 粒子 (⁴₂He²⁺ 氦核)", sub: "2质子+2中子，带 +2e 正电" },
      { lbl: "靶原子核 TARGET", val: "金原子核 (¹⁹⁷₇₉Au⁷⁹⁺)", sub: "带 +79e 正电，质量极大" },
      { lbl: "现象① (绿色轨迹)", val: "绝大多数穿过金箔", sub: "远离集中正电荷的原子核" },
      { lbl: "现象② (黄色轨迹)", val: "少数发生角度偏转", sub: "同种正电荷 (+2e与+79e) 排斥" },
      { lbl: "现象③ (红色轨迹)", val: "极少数大角度散射", sub: "模型中的数量不代表实测比例" },
      { lbl: "决定性结论 CONCLUSION", val: "质量与正电荷集中于极小核", sub: "彻底推翻葡萄干布丁模型" }
    ],
    callouts: [
      { x: -165, y: 0, z: 32, ox: -165, oy: -95, zh: "入射 α 粒子 (He²⁺氦核, +2e)", en: "Incoming α-particle (He²⁺, +2e)" },
      { x: 0, y: 0, z: 0, ox: 150, oy: -88, zh: "金原子核 (Au⁷⁹⁺, +79e正电)", en: "Dense Gold nucleus (Au⁷⁹⁺)" },
      { x: -75, y: 0, z: -12, ox: -160, oy: 92, zh: "极少数 >90° 大角度背向弹回", en: "Rare >90° head-on rebound" },
      { x: 95, y: 0, z: 95, ox: 155, oy: 88, zh: "绝大多数穿过金箔", en: "Most pass through the foil" }
    ]
  },
  {
    id: 5,
    num: "05",
    group: "historical",
    groupZh: "历史演进模型",
    groupEn: "HISTORICAL MODELS",
    titleZh: "玻尔量子化轨道",
    titleEn: "BOHR QUANTUM ORBITS",
    latin: "Orbitae Quantizatae et Saltus (Bohr, 1913)",
    taxonomyZh: "定态能级跃迁 · 德布罗意驻波与氢光谱",
    taxonomyEn: "Quantized Energy Shells · Photon Absorption & Emission",
    tags: ["分立能级 n=1,2,3,4", "跃迁公式 hν = |E₂-E₁|", "Niels Bohr"],
    scaleText: "rₙ = n²·a₀ (a₀=52.9 pm)",
    expBtnZh: "触发量子能级跃迁",
    expBtnEn: "Trigger Quantum Jump",
    quoteZh: "电子只能在分立的量子台阶上运行，每一次跃迁都吞吐一束精确频率的光子",
    quoteEn: "Electrons occupy only quantized shells; every jump absorbs or emits a photon of exact energy.",
    proseZh: [
      "1913年，<strong>尼尔斯·玻尔（Niels Bohr）</strong>提出量子化轨道模型，成功解决了原子的稳定性问题：电子只能在距离原子核特定半径的<strong>分立定态轨道（能级 n = 1, 2, 3, 4... 即 K, L, M, N 层）</strong>上运行，此时电子圆周恰好容纳整数个德布罗意物质波波长（<strong>2πr = nλ</strong>），不向外辐射能量。",
      "在玻尔模型中，电子从低能级跃迁到高能级需要<strong>吸收</strong>相应能量，从高能级回到低能级可<strong>发射</strong>光子（<strong>hν = |E高 - E低|</strong>）。这个模型成功解释了氢原子的部分线状光谱。"
    ],
    proseEn: [
      "In 1913, <strong>Niels Bohr</strong> resolved atomic stability by proposing that electrons orbit only in discrete, quantized shells (<strong>n = 1, 2, 3, 4... or K, L, M, N</strong>) where angular momentum is L = nℏ and de Broglie matter-waves form closed standing waves (<strong>2πr = nλ</strong>).",
      "In Bohr's model, a transition to a higher energy level <strong>absorbs</strong> energy and a transition to a lower one can <strong>emit</strong> a photon, with <strong>hν = |E₂ - E₁|</strong>. The model explains parts of the hydrogen line spectrum."
    ],
    dataGrid: [
      { lbl: "提出年代 YEAR", val: "1913 年", sub: "丹麦哥本哈根" },
      { lbl: "轨道半径公式 RADIUS", val: "rₙ = n² · a₀", sub: "r₁ : r₂ : r₃ = 1 : 4 : 9" },
      { lbl: "定态能级公式 ENERGY", val: "Eₙ = -13.6 / n² eV", sub: "E₁=-13.6eV, E₂=-3.40eV" },
      { lbl: "红光谱线 Hα (n=3→2)", val: "λ = 656.3 nm (ΔE=1.89eV)", sub: "巴耳末系最亮红线" },
      { lbl: "蓝绿谱线 Hβ (n=4→2)", val: "λ = 486.1 nm (ΔE=2.55eV)", sub: "巴耳末系青蓝线" },
      { lbl: "历史局限 LIMITATION", val: "仅适用单电子体系", sub: "无法解释多电子光谱与化学键" }
    ],
    callouts: [
      { x: 44, y: 0, z: 0, ox: -155, oy: -88, zh: "n=1 基态轨道 (K层, -13.6eV)", en: "n=1 Ground shell (K, -13.6eV)" },
      { x: 0, y: 88, z: 0, ox: 155, oy: -65, zh: "n=2 第一激发态 (L层, -3.4eV)", en: "n=2 Excited shell (L, -3.4eV)" },
      { x: -132, y: 0, z: 0, ox: -150, oy: 92, zh: "n=3 德布罗意驻波环 (2πr=3λ)", en: "n=3 Standing wave (2πr=3λ)" }
    ]
  },

  /* ==========================================================================
   * GROUP 2: 量子轨道与电子云 · QUANTUM ORBITALS (06 - 12)
   * ========================================================================== */
  {
    id: 6,
    num: "06",
    group: "quantum",
    groupZh: "量子轨道与电子云",
    groupEn: "QUANTUM ORBITALS",
    orbitalKey: "1s",
    titleZh: "1s 基态球形轨道",
    titleEn: "1s SPHERICAL ORBITAL",
    latin: "Orbitalis Quantica 1s (n=1, l=0, m=0)",
    taxonomyZh: "薛定谔电子云模型 · 球对称基态概率密度分布",
    taxonomyEn: "Quantum Electron Cloud · Spherically Symmetric Ground State",
    tags: ["正球体对称 · 0节面", "n=1, l=0, m=0", "|ψ₁₀₀|² ∝ e⁻²ʳ/ᵃ⁰"],
    scaleText: "a₀ = 52.9 pm",
    expBtnZh: "切换渲染/快门模式",
    expBtnEn: "Switch Cloud Mode",
    quoteZh: "打破行星轨道的幻象：电子云不是成千上万个电子，而是一个电子在时间长河中留下的概率足迹",
    quoteEn: "Not thousands of electrons, but a 3D probability density map of where a single electron appears over time.",
    proseZh: [
      "1926年，<strong>薛定谔（Erwin Schrödinger）</strong>与<strong>海森堡、玻恩</strong>建立了现代<strong>量子力学电子云模型</strong>。由于微观电子具有波粒二象性且服从不确定性原理，它不再沿着固定的圆圈轨道运行，我们只能用波函数模的平方 <strong>|ψ(x,y,z)|²</strong> 来描述它在空间各处出现的<strong>概率密度</strong>。",
      "<strong>1s 轨道（n=1, l=0, m=0）</strong>是距离原子核最近的基态轨道。它的三维电子云呈<strong>完美正球体对称</strong>：离原子核越近，点云越密集（概率密度最大）；随半径 r 增大呈指数衰减，内部没有任何节面（点击下方「单次快门采样」可直观看到同一瞬间只有 1 个电子！）。"
    ],
    proseEn: [
      "In 1926, <strong>Schrödinger, Heisenberg, and Born</strong> established the <strong>Quantum Electron Cloud Model</strong>. Governed by wave-particle duality and the Uncertainty Principle, an electron has no fixed path; instead, <strong>|ψ(x,y,z)|²</strong> gives the 3D <strong>probability density</strong> of finding it.",
      "The <strong>1s orbital (n=1, l=0, m=0)</strong> is spherically symmetric around the nucleus (+X, +Y, +Z axes). Point density is highest at the nucleus and decays exponentially outward with zero nodes."
    ],
    dataGrid: [
      { lbl: "量子数组合 QUANTUM", val: "n = 1, l = 0, m = 0", sub: "K 能层唯一 s 轨道" },
      { lbl: "三维轨道形状 SHAPE", val: "正球体对称 (Spherical)", sub: "各方向概率完全相同" },
      { lbl: "节面总数 NODES", val: "0 个节面", sub: "n - 1 = 0" },
      { lbl: "波函数表达式 PSI", val: "ψ₁₀₀ ∝ e⁻ʳ/ᵃ⁰", sub: "全域正相位 (+ψ)" },
      { lbl: "最概然半径 PEAK r", val: "r = 1.0 a₀ (52.9 pm)", sub: "径向分布函数 4πr²|R|² 峰值" },
      { lbl: "泡利容量 CAPACITY", val: "最多容纳 2 个电子", sub: "自旋方向相反 (↑↓)" }
    ],
    callouts: [
      { x: 0, y: 0, z: 0, ox: -155, oy: -88, zh: "核区最高概率密度中心", en: "Max probability density at core" },
      { x: 68, y: 0, z: 45, ox: 155, oy: -55, zh: "90% 等概率球形边界面", en: "90% spherical boundary surface" },
      { x: -75, y: 65, z: -55, ox: -150, oy: 92, zh: "外围低概率指数衰减区", en: "Outer exponential decay cloud" }
    ]
  },
  {
    id: 7,
    num: "07",
    group: "quantum",
    groupZh: "量子轨道与电子云",
    groupEn: "QUANTUM ORBITALS",
    orbitalKey: "2s",
    titleZh: "2s 双层节面轨道",
    titleEn: "2s RADIAL NODE ORBITAL",
    latin: "Orbitalis Quantica 2s (n=2, l=0, m=0)",
    taxonomyZh: "第二能层球对称轨道 · 内部球形径向节面",
    taxonomyEn: "L-Shell Spherical Orbital · Concentric Shells & Radial Node",
    tags: ["双层同心球壳 · 1个球形节面", "n=2, l=0, m=0", "节面半径 r = 2a₀"],
    scaleText: "r_node = 2.0 a₀",
    expBtnZh: "切换渲染/快门模式",
    expBtnEn: "Switch Cloud Mode",
    quoteZh: "剖开 2s 电子云的球壳，内部隐藏着一层电子出现概率严格为零的球形节面",
    quoteEn: "Slice open the 2s cloud to reveal an inner core and outer shell separated by a zero-probability spherical node.",
    proseZh: [
      "<strong>2s 轨道（n=2, l=0, m=0）</strong>是第二能层（L层）的球形轨道。与单层实心的 1s 轨道不同，开启底部<strong>「◒ 剖切 Slice」</strong>后向内观察，你会清晰看到 2s 电子云呈现出<strong>「内外双层同心球壳」</strong>结构：中心是一团紧凑的内层球核（正相位 +ψ，暖金色），外围包裹着一层宽阔的外球壳（负相位 -ψ，青蓝色）。",
      "在内外两层电子云之间（距离原子核 <strong>r = 2a₀</strong> 处，图中白色虚线圆环所示），波函数 ψ 恰好穿过零点（ψ = 0），形成一个电子出现概率严格为 0 的球面——称为<strong>「径向节面（Radial Node）」</strong>。"
    ],
    proseEn: [
      "The <strong>2s orbital (n=2, l=0, m=0)</strong> is also spherically symmetric, but with a two-layered internal anatomy. With <strong>Slice (◒)</strong> active, you can clearly see its nested structure: a compact inner core (+ψ phase, warm gold) surrounded by a larger outer spherical shell (-ψ phase, teal-blue).",
      "Between the inner core and outer shell at <strong>r = 2a₀</strong> (marked by the dashed ring) lies a spherical <strong>Radial Node</strong> where ψ = 0 and the electron probability density drops strictly to zero."
    ],
    dataGrid: [
      { lbl: "量子数组合 QUANTUM", val: "n = 2, l = 0, m = 0", sub: "L 能层球对称 s 轨道" },
      { lbl: "径向波函数 RADIAL", val: "R₂₀ ∝ (2 - r/a₀)·e⁻ʳ/²ᵃ⁰", sub: "在 r = 2a₀ 处改变正负号" },
      { lbl: "径向节面数 RADIAL NODE", val: "1 个球形节面 (r=2a₀)", sub: "公式：n - l - 1 = 2 - 0 - 1 = 1" },
      { lbl: "角向节面数 ANGULAR", val: "0 个平面节面", sub: "l = 0 保持球对称" },
      { lbl: "波函数相位 PHASE", val: "内层 +ψ (金) / 外层 -ψ (青)", sub: "跨过节面发生相位反转" },
      { lbl: "钻穿效应 PENETRATION", val: "2s 可深入核附近区域", sub: "多电子原子中影响 2s 与 2p 的能量差" }
    ],
    callouts: [
      { x: 0, y: 0, z: 0, ox: -155, oy: -90, zh: "2s 内层高密度球核 (+ψ)", en: "Inner spherical core (+ψ)" },
      { x: 56, y: 0, z: 0, ox: 158, oy: -25, zh: "球形径向节面 (r=2a₀, 概率为0)", en: "Spherical radial node (ψ = 0)" },
      { x: -95, y: 0, z: -65, ox: -150, oy: 92, zh: "2s 外层主概率球壳 (-ψ)", en: "Outer concentric shell (-ψ)" }
    ]
  },
  {
    id: 8,
    num: "08",
    group: "quantum",
    groupZh: "量子轨道与电子云",
    groupEn: "QUANTUM ORBITALS",
    orbitalKey: "2pz",
    titleZh: "2p 哑铃形轨道族",
    titleEn: "2p DUMBBELL ORBITALS",
    latin: "Orbitalis Quantica 2p (n=2, l=1, m=-1,0,+1)",
    taxonomyZh: "双叶纺锤形有向轨道 · 角向节面与正负波瓣",
    taxonomyEn: "Directional Two-Lobed Dumbbell · Angular Nodal Plane",
    tags: ["双叶纺锤/哑铃形", "n=2, l=1, m=0,±1", "可切换 2px / 2py / 2pz"],
    scaleText: "2pₓ / 2pᵧ / 2p_z",
    expBtnZh: "切换 X / Y / Z 轴向",
    expBtnEn: "Switch X/Y/Z Axis",
    quoteZh: "两枚水滴状的纺锤叶瓣在原子核两侧对称舒展，赋予了化学键精确的空间方向",
    quoteEn: "Two teardrop spindle lobes aligned along the coordinate axes give covalent bonds their 3D geometry.",
    proseZh: [
      "当角量子数 <strong>l = 1</strong> 时，原子轨道呈现出由两个对称水滴/纺锤形叶瓣构成的<strong>「哑铃形（Dumbbell / Spindle Shape）」</strong>，称为 <strong>p 轨道</strong>。点击右侧面板中的 <strong>2pₓ、2pᵧ、2p_z</strong> 按钮，可以观察它严格沿着三维坐标系的 <strong>X 轴、Y 轴、Z 轴</strong>切换取向！",
      "p 轨道的两个叶瓣分别位于坐标轴的正半轴（暖琥珀金，<strong>+ψ 正相位</strong>）与负半轴（青蓝色，<strong>-ψ 负相位</strong>）。穿过原子核且垂直于轨道轴线的透明网格平面即为<strong>「角向节面（Angular Nodal Plane）」</strong>——在此平面上波函数 ψ = 0，电子永不出现。"
    ],
    proseEn: [
      "For angular quantum number <strong>l = 1</strong>, the orbital forms two symmetric teardrop spindle lobes in a <strong>Dumbbell Shape (p-orbital)</strong>. Use the parameter buttons on the right to switch between <strong>2pₓ (along X-axis)</strong>, <strong>2pᵧ (along Y-axis)</strong>, and <strong>2p_z (along vertical Z-axis)</strong>!",
      "The two lobes have opposite wavefunction signs: <strong>+ψ (warm gold)</strong> on the positive axis and <strong>-ψ (teal-blue)</strong> on the negative axis. Separating them is a flat <strong>Angular Nodal Plane</strong> passing through the nucleus where ψ = 0."
    ],
    dataGrid: [
      { lbl: "量子数组合 QUANTUM", val: "n = 2, l = 1, m = -1, 0, +1", sub: "三个能量简并的正交轨道" },
      { lbl: "三维几何形状 SHAPE", val: "双叶对称水滴/哑铃形", sub: "极坐标 r(θ) ∝ |cosθ|" },
      { lbl: "角向节面 NODAL PLANE", val: "1 个穿过核的坐标平面", sub: "2pz节面为XY面，2px为YZ面" },
      { lbl: "径向节面 RADIAL NODE", val: "0 个 (n - l - 1 = 0)", sub: "2p 叶瓣内部无分层节面" },
      { lbl: "原子核处密度 CORE", val: "|ψ(0,0,0)|² = 0", sub: "节面穿过原子核，核处概率为0" },
      { lbl: "化学成键 BONDING", val: "头碰头 σ 键 / 肩并肩 π 键", sub: "决定分子空间构型与键角" }
    ],
    callouts: [
      { x: 0, y: 0, z: 88, ox: 155, oy: -85, zh: "正半轴纺锤叶瓣 (+ψ 相位)", en: "Positive spindle lobe (+ψ)" },
      { x: 65, y: 65, z: 0, ox: -158, oy: -10, zh: "穿过原子核的角向节面 (ψ=0)", en: "Angular nodal plane (ψ = 0)" },
      { x: 0, y: 0, z: -88, ox: 155, oy: 88, zh: "负半轴反演叶瓣 (-ψ 相位)", en: "Negative spindle lobe (-ψ)" }
    ]
  },
  {
    id: 9,
    num: "09",
    group: "quantum",
    groupZh: "量子轨道与电子云",
    groupEn: "QUANTUM ORBITALS",
    orbitalKey: "2p_all",
    titleZh: "2p³ 三轴正交全景",
    titleEn: "2p SUBSHELL TRIAD",
    latin: "Substratum 2p Orthogonale (2px ⊕ 2py ⊕ 2pz)",
    taxonomyZh: "第二能层 p 亚层全貌 · 三轴六叶正交对称",
    taxonomyEn: "Full 2p Subshell · Three Orthogonal Dumbbells",
    tags: ["X / Y / Z 三轴正交叠加", "6 枚纺锤叶瓣", "洪特规则 Hund's Rule"],
    scaleText: "2pₓ ⊕ 2pᵧ ⊕ 2p_z",
    expBtnZh: "切换渲染/快门模式",
    expBtnEn: "Switch Cloud Mode",
    quoteZh: "沿 X、Y、Z 三根正交坐标轴同时绽放的六枚量子叶瓣，共同构筑了 p 亚层的完整空间",
    quoteEn: "Three mutually perpendicular dumbbells along X, Y, and Z interlock to form the complete 2p subshell.",
    proseZh: [
      "在第二能层的 p 亚层中，<strong>2pₓ（沿 X 轴，暖珊瑚色）</strong>、<strong>2pᵧ（沿 Y 轴，青黛翠色）</strong>与 <strong>2p_z（沿竖直 Z 轴，柔紫罗兰色）</strong>三个轨道的能量完全相等（称为<strong>简并轨道 Degenerate Orbitals</strong>），并在三维笛卡尔空间内严格互相垂直（90° 正交）。",
      "根据<strong>洪特规则（Hund's Rule）</strong>，电子会先分别占据三个等能 p 轨道，再开始配对。将三个正交 p 轨道的概率密度相加，会得到球对称的总体角向分布；这里的彩色叶瓣是各轨道的示意，不能理解成电子沿固定路径运动。"
    ],
    proseEn: [
      "Within the 2p subshell, the three degenerate orbitals—<strong>2pₓ (along X, coral-amber)</strong>, <strong>2pᵧ (along Y, sage-teal)</strong>, and <strong>2p_z (along Z, lavender-violet)</strong>—are mutually perpendicular (90° orthogonal) in 3D space.",
      "By <strong>Hund's rule</strong>, electrons occupy the three equal-energy p orbitals singly before pairing. The sum of the probability densities of three orthogonal p orbitals has a spherical angular distribution. The colored lobes are illustrations, not paths followed by electrons."
    ],
    dataGrid: [
      { lbl: "亚层包含轨道 SUBSHELL", val: "2pₓ, 2pᵧ, 2p_z (共3个)", sub: "m = -1, 0, +1 三重简并" },
      { lbl: "空间夹角 ANGLE", val: "两两正交 90°", sub: "分别沿 X, Y, Z 坐标轴伸展" },
      { lbl: "叶瓣总数 TOTAL LOBES", val: "3 × 2 = 6 枚纺锤叶瓣", sub: "正负半轴对称分布" },
      { lbl: "排布规律 HUND'S RULE", val: "洪特规则优先单占", sub: "降低电子间库仑排斥能" },
      { lbl: "密度叠加 DENSITY", val: "|pₓ|²+|pᵧ|²+|p_z|² 呈球对称", sub: "三个轨道等权叠加时的角向分布" },
      { lbl: "亚层最大容量 CAPACITY", val: "最多容纳 6 个电子", sub: "2p¹ (B) 至 2p⁶ (Ne)" }
    ],
    callouts: [
      { x: 0, y: 0, z: 95, ox: 155, oy: -88, zh: "2pz 竖直极轴轨道 (Z轴)", en: "2pz vertical orbital (Z-axis)" },
      { x: 95, y: 0, z: 0, ox: -158, oy: 20, zh: "2px 水平横轴轨道 (X轴)", en: "2px horizontal orbital (X-axis)" },
      { x: 0, y: 95, z: 0, ox: 155, oy: 88, zh: "2py 水平纵轴轨道 (Y轴)", en: "2py horizontal orbital (Y-axis)" }
    ]
  },
  {
    id: 10,
    num: "10",
    group: "quantum",
    groupZh: "量子轨道与电子云",
    groupEn: "QUANTUM ORBITALS",
    orbitalKey: "3dz2",
    titleZh: "3dz² 带环哑铃轨道",
    titleEn: "3dz² TORUS DUMBBELL",
    latin: "Orbitalis Quantica 3dz² (n=3, l=2, m=0)",
    taxonomyZh: "第三能层 d 轨道 · 极轴双叶与赤道连续圆环",
    taxonomyEn: "M-Shell d-Orbital · Polar Spindles & Continuous Equatorial Torus",
    tags: ["Z轴哑铃 + XY赤道圆环", "n=3, l=2, m=0", "2个圆锥形节面 (54.7°)"],
    scaleText: "Y₂⁰ ∝ 3cos²θ - 1",
    expBtnZh: "切换渲染/快门模式",
    expBtnEn: "Switch Cloud Mode",
    quoteZh: "沿极轴伸展的金色双叶穿过赤道平面上连续的青色量子圆环，由两座无形的圆锥节面精密分隔",
    quoteEn: "Two polar lobes along Z encircled by a continuous equatorial torus ring in the XY plane, separated by conical nodes.",
    proseZh: [
      "当主量子数 n = 3、角量子数 <strong>l = 2</strong> 时，便进入了过渡金属化学中最核心的 <strong>3d 轨道</strong>。其中 <strong>3dz² 轨道（n=3, l=2, m=0）</strong>拥有极为独特的三维拓扑几何：它由沿竖直 <strong>Z 轴</strong>上下伸展的两个大纺锤形主叶瓣（<strong>+ψ 正相位，暖金色</strong>），以及环绕在水平 <strong>XY 赤道平面</strong>上的一个连续平滑的<strong>甜圈状圆环（Torus Ring，-ψ 负相位，青蓝色）</strong>共同组成！",
      "为什么会有圆环？因为它的角度波函数正比于 <strong>(3cos²θ - 1)</strong>：当极角 θ = 54.7° 或 125.3° 时，3cos²θ - 1 = 0，从而在空间形成上下两个漏斗状的<strong>「圆锥形节面（Conical Nodal Surfaces）」</strong>。"
    ],
    proseEn: [
      "In the n=3 shell, angular quantum number <strong>l = 2</strong> produces five <strong>3d orbitals</strong>. The <strong>3dz² orbital (n=3, l=2, m=0)</strong> features two prominent polar spindle lobes along the vertical <strong>Z-axis (+ψ, warm gold)</strong> surrounded by a continuous, smooth <strong>equatorial torus ring in the XY plane (-ψ, teal-blue)</strong>.",
      "Its angular wavefunction is proportional to <strong>(3cos²θ - 1)</strong>, which vanishes at the magic angle <strong>θ = 54.7° (and 125.3°)</strong>, creating two funnel-shaped <strong>Conical Nodal Surfaces</strong> between the polar lobes and the ring."
    ],
    dataGrid: [
      { lbl: "量子数组合 QUANTUM", val: "n = 3, l = 2, m = 0", sub: "M 能层 d 亚层特征轨道" },
      { lbl: "角度波函数 ANGULAR", val: "Y₂⁰(θ) ∝ (3cos²θ - 1)", sub: "θ<54.7°为正，赤道θ=90°为负" },
      { lbl: "三维几何特征 GEOMETRY", val: "Z轴双叶哑铃 + XY赤道圆环", sub: "连续环状电子云密度带" },
      { lbl: "角向节面 CONICAL NODES", val: "2 个圆锥面 (θ = 54.7°)", sub: "无平面节面，呈轴对称" },
      { lbl: "相位分布 PHASE", val: "上下极叶 +ψ / 赤道环 -ψ", sub: "正负波函数相位严格反号" },
      { lbl: "过渡金属意义 CHEMISTRY", val: "八面体场 dz² 轨道能级分裂", sub: "决定铁、铜、钴配合物结构" }
    ],
    callouts: [
      { x: 0, y: 0, z: 98, ox: 155, oy: -88, zh: "Z轴极向高概率主叶瓣 (+ψ)", en: "Z-axis polar main lobe (+ψ)" },
      { x: 68, y: 0, z: 0, ox: 158, oy: 12, zh: "XY赤道连续圆环带 (-ψ)", en: "XY equatorial torus ring (-ψ)" },
      { x: -45, y: 0, z: -55, ox: -155, oy: 88, zh: "54.7° 圆锥形节面 (ψ=0)", en: "54.7° conical nodal surface" }
    ]
  },
  {
    id: 11,
    num: "11",
    group: "quantum",
    groupZh: "量子轨道与电子云",
    groupEn: "QUANTUM ORBITALS",
    orbitalKey: "3dxy",
    titleZh: "3dxy 四叶草轨道",
    titleEn: "3dxy CLOVERLEAF ORBITAL",
    latin: "Orbitalis Quantica 3dxy (n=3, l=2, m=±2)",
    taxonomyZh: "第三能层四叶花冠轨道 · 象限对角线正负交错",
    taxonomyEn: "Four-Lobed Cloverleaf d-Orbital · Alternating Quadrant Phases",
    tags: ["XY平面四叶草形", "2个正交平面节面", "四象限相位 + / - / + / -"],
    scaleText: "ψ ∝ x·y·e⁻ʳ/³ᵃ⁰",
    expBtnZh: "切换渲染/快门模式",
    expBtnEn: "Switch Cloud Mode",
    quoteZh: "四枚水滴状叶瓣在水平象限的 45° 对角线上正负交错盛开，如同微观世界的四叶幸运草",
    quoteEn: "Four teardrop lobes bloom along the 45° quadrant diagonals in the XY plane with alternating quantum phases.",
    proseZh: [
      "在五个 3d 轨道中，有四个轨道（<strong>3dxy、3dxz、3dyz、3dx²-y²</strong>）都具有完全相同的<strong>「四叶草形（Four-Leaf Clover）」</strong>三维几何结构。以本标本展示的 <strong>3dxy 轨道</strong>为例：它的四个水滴形叶瓣平铺在水平 <strong>XY 平面</strong>内，并严格指向 X 轴与 Y 轴夹角的 <strong>45° 象限对角线</strong>方向！",
      "由于其波函数正比于坐标乘积 <strong>x · y</strong>：在第一、三象限（x 与 y 同号）叶瓣为<strong>正相位（+ψ，暖琥珀金）</strong>；在第二、四象限（x 与 y 异号）叶瓣为<strong>负相位（-ψ，青蓝色）</strong>。而 X 轴所在的 XZ 平面与 Y 轴所在的 YZ 平面则是两个互相垂直的<strong>角向节面</strong>。"
    ],
    proseEn: [
      "Four of the five 3d orbitals (<strong>3dxy, 3dxz, 3dyz, 3dx²-y²</strong>) share a symmetrical <strong>Four-Leaf Clover</strong> geometry. In the <strong>3dxy orbital</strong>, four teardrop lobes lie flat in the horizontal <strong>XY plane</strong>, pointing along the <strong>45° diagonals</strong> between the X and Y axes.",
      "Because ψ ∝ <strong>x · y</strong>, lobes in Quadrants I & III (where x and y have the same sign) have <strong>+ψ phase (warm gold)</strong>, while Quadrants II & IV have <strong>-ψ phase (teal-blue)</strong>. The XZ and YZ coordinate planes are mutually perpendicular nodal planes."
    ],
    dataGrid: [
      { lbl: "量子数组合 QUANTUM", val: "n = 3, l = 2, m = ±2 (xy)", sub: "四叶草形 d 轨道代表" },
      { lbl: "空间波函数 WAVEFUNCTION", val: "ψ₃d_xy ∝ (x·y / r²)·R₃₂(r)", sub: "沿 y = ±x 对角线概率最大" },
      { lbl: "叶瓣几何 SHAPE", val: "4 枚对称水滴形叶瓣", sub: "位于 XY 平面四个象限中心" },
      { lbl: "角向节面 NODAL PLANES", val: "2 个正交平面 (XZ 与 YZ)", sub: "坐标轴 X 与 Y 上电子概率为 0" },
      { lbl: "相位交错 PHASE", val: "一三象限 +ψ / 二四象限 -ψ", sub: "绕 Z 轴每旋转 90° 变号一次" },
      { lbl: "科学应用 APPLICATION", val: "过渡金属 d-d 跃迁显色", sub: "解释宝石、颜料与催化剂活性" }
    ],
    callouts: [
      { x: 68, y: 68, z: 0, ox: 155, oy: -82, zh: "第一象限对角叶瓣 (+ψ)", en: "Quadrant I diagonal lobe (+ψ)" },
      { x: -68, y: 68, z: 0, ox: -158, oy: -75, zh: "第二象限反相叶瓣 (-ψ)", en: "Quadrant II opposite lobe (-ψ)" },
      { x: 85, y: 0, z: 0, ox: 155, oy: 88, zh: "XZ 与 YZ 正交节面 (ψ=0)", en: "Orthogonal nodal planes (ψ=0)" }
    ]
  },
  {
    id: 12,
    num: "12",
    group: "quantum",
    groupZh: "量子轨道与电子云",
    groupEn: "QUANTUM ORBITALS",
    orbitalKey: "neon_full",
    titleZh: "氖原子全壳层电子云",
    titleEn: "NEON 1s²2s²2p⁶ CLOUD",
    latin: "Configurationis Completae Neonis (Z = 10, 1s²2s²2p⁶)",
    taxonomyZh: "多电子原子综合结构 · 多层轨道同心嵌套",
    taxonomyEn: "Complete Multi-Electron Atom · Concentric Orbital Superposition",
    tags: ["1s² + 2s² + 2p⁶ (10电子)", "多轨道同心嵌套", "稀有气体八隅体"],
    scaleText: "Ne (Z = 10)",
    expBtnZh: "切换渲染/快门模式",
    expBtnEn: "Switch Cloud Mode",
    quoteZh: "当球形的 1s、2s 壳层与三轴正交的 2p⁶ 哑铃围绕同一颗原子核层层嵌套，现代原子的完整图景便跃然眼前",
    quoteEn: "When 1s and 2s spheres nest concentrically with three orthogonal 2p dumbbells, the complete modern atom emerges.",
    proseZh: [
      "把单个轨道组合起来，可以怎样理解多电子原子？这幅教学示意以<strong>氖原子（Neon, Z=10，电子排布 1s² 2s² 2pₓ² 2pᵧ² 2p_z²）</strong>为例，叠加显示其已占据的轨道。图像不是氖原子的直接观测照片。",
      "开启<strong>「◒ 剖切 Slice」</strong>从外向内观察它的三层量子嵌套：① 最中心是紧贴原子核的高密度金色 <strong>1s² 核心（2个电子）</strong>；② 向外是第二能层的青蓝色 <strong>2s² 球形壳层（2个电子）</strong>；③ 同时沿 X、Y、Z 三根正交轴伸展出六枚饱满的 <strong>2p⁶ 哑铃形电子云（6个电子）</strong>。10 个电子各司其职，共同构筑了化学性质极度稳定的八隅体满壳层结构。"
    ],
    proseEn: [
      "How can occupied orbitals help us understand a multi-electron atom? This teaching illustration combines the occupied orbitals of <strong>neon (Ne, Z=10: 1s² 2s² 2pₓ² 2pᵧ² 2p_z²)</strong>. It is not a direct image of a neon atom.",
      "With <strong>Slice (◒)</strong> enabled, observe the concentric quantum architecture: (1) the compact inner gold <strong>1s² core (2e⁻)</strong>; (2) the surrounding teal <strong>2s² spherical shell (2e⁻)</strong>; and (3) the six orthogonal spindle lobes of <strong>2pₓ², 2pᵧ², 2p_z² (6e⁻)</strong> along the X, Y, Z axes, forming a chemically inert noble-gas octet."
    ],
    dataGrid: [
      { lbl: "元素与序数 ELEMENT", val: "氖 Neon (₁₀Ne)", sub: "核内 10 质子，核外 10 电子" },
      { lbl: "电子排布式 CONFIG", val: "1s² 2s² 2pₓ² 2pᵧ² 2p_z²", sub: "K层 2e⁻ (满) + L层 8e⁻ (满)" },
      { lbl: "空间轨道数 ORBITALS", val: "5 个原子轨道叠加", sub: "每个轨道配对容纳 2 个电子" },
      { lbl: "轨道组合 ORBITALS", val: "闭合的第二电子层", sub: "图像为轨道叠加的教学示意" },
      { lbl: "第一电离能 IONIZATION", val: "21.56 eV (同周期最高)", sub: "极难失去或夺取电子" },
      { lbl: "历史演进总结 SUMMARY", val: "从1803实心球到现代量子云", sub: "跨越百年的科学认知飞跃" }
    ],
    callouts: [
      { x: 0, y: 0, z: 0, ox: -155, oy: -88, zh: "内层 1s² 核心电子云 (2e⁻)", en: "Inner 1s² core shell (2e⁻)" },
      { x: 52, y: 52, z: 0, ox: 155, oy: -55, zh: "第二层 2s² 球壳电子云 (2e⁻)", en: "2s² spherical shell (2e⁻)" },
      { x: 0, y: 0, z: 95, ox: -150, oy: 90, zh: "三轴正交 2p⁶ 哑铃电子云 (6e⁻)", en: "Orthogonal 2p⁶ dumbbells (6e⁻)" }
    ]
  }
];

/******************************************************************************
 * GLOBAL STATE
 ******************************************************************************/
const state = {
  currentIdx: 0,
  lang: "bi", // 'bi' | 'zh' | 'en'
  autoRotate: true,
  sliced: true,
  showLabels: true,

  // Standard 3D Physics Camera: Z is vertical polar axis, XY is horizontal plane
  camYaw: 0.65,
  camPitch: 0.36,
  targetYaw: 0.65,
  targetPitch: 0.36,
  camZoom: 1.0,
  targetZoom: 1.0,
  isDragging: false,
  lastX: 0,
  lastY: 0,
  time: 0,

  // Specimen 01: Dalton
  daltonElement: "O",
  daltonH2O: false,

  // Specimen 02: Thomson
  thomsonField: 0,
  thomsonElectrons: [],

  // Specimen 03: Rutherford Nuclear
  rutherfordPulse: 0,
  liveElectronPos: { x: 135, y: 0, z: 45 },

  // Specimen 04: Gold Foil Alpha Scattering (Continuous + Head-on toggle)
  alphaHeadOnBoost: false,
  alphaParticles: [],

  // Specimen 05: Bohr
  bohrShell: 2,
  bohrTransition: null,

  // Specimens 06-12: Quantum Orbitals
  pAxis: "z", // 'x' | 'y' | 'z'
  cloudRenderMode: "hybrid", // 'hybrid' | 'cloud_only' | 'single_snap'
  cloudPoints: [],
  lobeVoxels: []
};

const canvas = document.getElementById("atomCanvas");
const ctx = canvas.getContext("2d");

/******************************************************************************
 * INITIALIZATION
 ******************************************************************************/
function initApp() {
  initThomsonElectrons();
  initContinuousAlphaParticles();
  buildCatalogSidebar();
  renderQuiz();
  selectSpecimen(0);

  window.addEventListener("resize", resizeCanvas);
  setupPointerAndKeyboard();
  resizeCanvas();
  requestAnimationFrame(animateLoop);
}

function resizeCanvas() {
  const wrap = document.getElementById("canvasWrap");
  const rect = wrap.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function setLanguage(lang) {
  state.lang = lang;
  document.body.setAttribute("data-lang", lang);
  document.getElementById("btnLangBi").classList.toggle("active", lang === "bi");
  document.getElementById("btnLangZh").classList.toggle("active", lang === "zh");
  document.getElementById("btnLangEn").classList.toggle("active", lang === "en");
  selectSpecimen(state.currentIdx);
  renderQuiz();
}

/******************************************************************************
 * LEFT SIDEBAR CATALOG BUILDER (01 - 12)
 ******************************************************************************/
function buildCatalogSidebar() {
  const container = document.getElementById("catalogList");
  let html = "";
  let lastGroup = "";

  SPECIMENS.forEach((sp, idx) => {
    if (sp.group !== lastGroup) {
      lastGroup = sp.group;
      html += `
        <div class="catalog-group-header">
          <div class="group-dot-title">
            <span class="group-dot ${sp.group === 'quantum' ? 'quantum' : ''}"></span>
            <span>${sp.groupZh}</span>
          </div>
          <span class="group-en-label">${sp.groupEn}</span>
        </div>
      `;
    }
    html += `
      <button class="catalog-item ${idx === state.currentIdx ? 'active' : ''}" id="catItem_${idx}" onclick="selectSpecimen(${idx})">
        <span class="cat-num">${sp.num}</span>
        <div class="cat-names">
          <span class="cat-zh">${sp.titleZh}</span>
          <span class="cat-en">${sp.titleEn}</span>
        </div>
      </button>
    `;
  });

  container.innerHTML = html;
}

/******************************************************************************
 * SELECT SPECIMEN & RENDER RIGHT MONOGRAPH
 ******************************************************************************/
function selectSpecimen(idx) {
  state.currentIdx = (idx + SPECIMENS.length) % SPECIMENS.length;
  const sp = SPECIMENS[state.currentIdx];

  SPECIMENS.forEach((_, i) => {
    const el = document.getElementById(`catItem_${i}`);
    if (el) el.classList.toggle("active", i === state.currentIdx);
  });

  document.getElementById("topIndexNum").textContent = sp.num;
  document.getElementById("topCategoryText").textContent = state.lang === "en" ? sp.groupEn : sp.groupZh;
  document.getElementById("scaleTitle").textContent = state.lang === "en" ? sp.titleEn : sp.titleZh;
  document.getElementById("scaleVal").textContent = sp.scaleText;
  document.getElementById("footIndex").textContent = state.lang === "en" ? `VIEW ${sp.num}` : `标本 ${sp.num}`;
  document.getElementById("footCategory").textContent = state.lang === "en" ? sp.groupEn : sp.groupZh;
  document.getElementById("footScale").textContent = sp.scaleText.toUpperCase();
  document.getElementById("btnExpLabel").textContent = state.lang === "en" ? sp.expBtnEn : sp.expBtnZh;

  if (sp.orbitalKey) {
    const key = (sp.id === 8) ? `2p${state.pAxis}` : sp.orbitalKey;
    buildOrbitalGeometryAndCloud(key);
  }

  buildCalloutDOM(sp);
  renderMonographPanel(sp);
}

function renderMonographPanel(sp) {
  const container = document.getElementById("monographContent");

  const tagsHtml = sp.tags.map((t, i) =>
    `<span class="${i === 0 ? 'mono-tag-gold' : 'mono-tag-neutral'}">${t}</span>`
  ).join("");

  const proseHtml = sp.proseZh.map((zh, i) => `
    <p class="zh-text">${zh}</p>
    <p class="en-prose en-text">${sp.proseEn[i]}</p>
  `).join("");

  const dataCellsHtml = sp.dataGrid.map(c => `
    <div class="data-cell">
      <span class="data-cell-label">${c.lbl}</span>
      <div class="data-cell-value">
        ${c.val} <span class="muted">· ${c.sub}</span>
      </div>
    </div>
  `).join("");

  const subControlHtml = buildStageSubControls(sp);

  container.innerHTML = `
    <div class="mono-top-row">
      <div>
        <span class="mono-index-num">${sp.num}</span>
        <span class="mono-index-total">/ 12</span>
      </div>
      <span class="mono-cat-right">${state.lang === "en" ? sp.groupEn : sp.groupZh}</span>
    </div>

    <h1 class="mono-title-zh">${state.lang === "en" ? sp.titleEn : sp.titleZh}</h1>
    <div class="mono-title-latin">${sp.latin}</div>

    <div class="mono-taxonomy-line">
      <span>——</span>
      <span class="zh-inline">${sp.taxonomyZh}</span>
      <span class="en-inline">${sp.taxonomyEn}</span>
    </div>

    <div class="mono-tags-row">${tagsHtml}</div>

    <div class="mono-pullquote">
      <div class="mono-pullquote-zh zh-text">${sp.quoteZh}</div>
      <div class="mono-pullquote-en en-text">${sp.quoteEn}</div>
    </div>

    <div class="mono-prose">${proseHtml}</div>

    ${subControlHtml}

    <div class="mono-section-head data-section-head">
      <span class="sec-zh">数据</span>
      <span class="sec-en">DATA</span>
    </div>

    <div class="data-grid-2x3">${dataCellsHtml}</div>
  `;
}

function ui(zh, en) {
  return state.lang === "en" ? en : zh;
}

function buildStageSubControls(sp) {
  if (sp.id === 1) {
    return `
      <div class="mono-section-head">
        <span class="sec-zh">交互控制</span>
        <span class="sec-en">INTERACTIVE PARAMETERS</span>
      </div>
      <div class="interactive-subpanel">
        <div class="sub-btn-row">
          <button class="sub-opt-btn ${!state.daltonH2O && state.daltonElement==='H'?'active':''}" onclick="setDaltonSub('H', false)">${ui('氢 H (1u)', 'Hydrogen H (1u)')}</button>
          <button class="sub-opt-btn ${!state.daltonH2O && state.daltonElement==='C'?'active':''}" onclick="setDaltonSub('C', false)">${ui('碳 C (12u)', 'Carbon C (12u)')}</button>
          <button class="sub-opt-btn ${!state.daltonH2O && state.daltonElement==='O'?'active':''}" onclick="setDaltonSub('O', false)">${ui('氧 O (16u)', 'Oxygen O (16u)')}</button>
          <button class="sub-opt-btn ${!state.daltonH2O && state.daltonElement==='Fe'?'active':''}" onclick="setDaltonSub('Fe', false)">${ui('铁 Fe (56u)', 'Iron Fe (56u)')}</button>
        </div>
        <div class="sub-btn-row">
          <button class="sub-opt-btn ${state.daltonH2O?'active':''}" onclick="setDaltonSub('O', !state.daltonH2O)">
            ${ui('现代水分子组成：2 个 H + 1 个 O', 'Modern water molecule: 2 H + 1 O')}
          </button>
        </div>
      </div>
    `;
  }
  if (sp.id === 2) {
    return `
      <div class="mono-section-head">
        <span class="sec-zh">交互控制</span>
        <span class="sec-en">INTERACTIVE PARAMETERS</span>
      </div>
      <div class="interactive-subpanel">
        <div class="sub-btn-row">
          <button class="sub-opt-btn ${state.thomsonField===0?'active':''}" onclick="setThomsonSub(0)">${ui('静电平衡态 (E = 0)', 'Equilibrium (E = 0)')}</button>
          <button class="sub-opt-btn ${state.thomsonField===55?'active':''}" onclick="setThomsonSub(55)">${ui('外加正电场 (+E 偏移)', 'Apply +E field')}</button>
          <button class="sub-opt-btn ${state.thomsonField===-55?'active':''}" onclick="setThomsonSub(-55)">${ui('外加反电场 (-E 偏移)', 'Apply −E field')}</button>
        </div>
      </div>
    `;
  }
  if (sp.id === 4) {
    return `
      <div class="mono-section-head">
        <span class="sec-zh">α 粒子束准直控制</span>
        <span class="sec-en">ALPHA BEAM COLLIMATOR</span>
      </div>
      <div class="interactive-subpanel">
        <div class="sub-btn-row">
          <button class="sub-opt-btn ${!state.alphaHeadOnBoost?'active':''}" onclick="setAlphaMode(false)">${ui('标准金箔散射', 'Standard gold foil scattering')}</button>
          <button class="sub-opt-btn ${state.alphaHeadOnBoost?'active':''}" onclick="setAlphaMode(true)">${ui('聚焦原子核中心', 'Aim at the nucleus')}</button>
        </div>
      </div>
    `;
  }
  if (sp.id === 5) {
    return `
      <div class="mono-section-head">
        <span class="sec-zh">定态能级跃迁控制</span>
        <span class="sec-en">QUANTUM JUMP SHELLS</span>
      </div>
      <div class="interactive-subpanel">
        <div class="sub-btn-row">
          <button class="sub-opt-btn ${state.bohrShell===1?'active':''}" onclick="jumpBohrShell(1)">n=1 (K · -13.6eV)</button>
          <button class="sub-opt-btn ${state.bohrShell===2?'active':''}" onclick="jumpBohrShell(2)">n=2 (L · -3.40eV)</button>
          <button class="sub-opt-btn ${state.bohrShell===3?'active':''}" onclick="jumpBohrShell(3)">n=3 (M · -1.51eV)</button>
          <button class="sub-opt-btn ${state.bohrShell===4?'active':''}" onclick="jumpBohrShell(4)">n=4 (N · -0.85eV)</button>
        </div>
      </div>
    `;
  }
  if (sp.id >= 6) {
    const axisRow = sp.id === 8 ? `
      <div class="sub-btn-row">
        <button class="sub-opt-btn ${state.pAxis==='x'?'active':''}" onclick="setPAxis('x')">${ui('2pₓ（沿 X 轴）', '2pₓ (X axis)')}</button>
        <button class="sub-opt-btn ${state.pAxis==='y'?'active':''}" onclick="setPAxis('y')">${ui('2pᵧ（沿 Y 轴）', '2pᵧ (Y axis)')}</button>
        <button class="sub-opt-btn ${state.pAxis==='z'?'active':''}" onclick="setPAxis('z')">${ui('2p_z（沿 Z 轴）', '2p_z (Z axis)')}</button>
      </div>
    ` : "";
    return `
      <div class="mono-section-head">
        <span class="sec-zh">量子轨道可视化模式</span>
        <span class="sec-en">ORBITAL VISUALIZATION</span>
      </div>
      <div class="interactive-subpanel">
        ${axisRow}
        <div class="sub-btn-row">
          <button class="sub-opt-btn ${state.cloudRenderMode==='hybrid'?'active':''}" onclick="setCloudMode('hybrid')">${ui('轨道轮廓 + 电子云', 'Orbital outline + cloud')}</button>
          <button class="sub-opt-btn ${state.cloudRenderMode==='cloud_only'?'active':''}" onclick="setCloudMode('cloud_only')">${ui('概率密度点云 |ψ|²', 'Probability cloud |ψ|²')}</button>
          <button class="sub-opt-btn ${state.cloudRenderMode==='single_snap'?'active':''}" onclick="setCloudMode('single_snap')">${ui('单电子瞬间抓拍', 'Single-electron snapshot')}</button>
        </div>
      </div>
    `;
  }
  return "";
}

/******************************************************************************
 * TOOLBAR & SUB-CONTROL ACTIONS
 ******************************************************************************/
function toggleRotate() {
  state.autoRotate = !state.autoRotate;
  document.getElementById("btnRotate").classList.toggle("active", state.autoRotate);
}

function toggleSlice() {
  state.sliced = !state.sliced;
  document.getElementById("btnSlice").classList.toggle("active", state.sliced);
  const sp = SPECIMENS[state.currentIdx];
  if (sp.orbitalKey) {
    const key = (sp.id === 8) ? `2p${state.pAxis}` : sp.orbitalKey;
    buildOrbitalGeometryAndCloud(key);
  }
}

function toggleLabels() {
  state.showLabels = !state.showLabels;
  document.getElementById("btnLabels").classList.toggle("active", state.showLabels);
  document.getElementById("calloutSvg").style.display = state.showLabels ? "block" : "none";
  document.getElementById("calloutLabelsLayer").style.display = state.showLabels ? "block" : "none";
}

function resetView() {
  state.targetYaw = 0.65;
  state.targetPitch = 0.36;
  state.targetZoom = 1.0;
}

function triggerStageExperiment() {
  const sp = SPECIMENS[state.currentIdx];
  if (sp.id === 1) {
    setDaltonSub("O", !state.daltonH2O);
  } else if (sp.id === 2) {
    setThomsonSub(state.thomsonField === 0 ? 55 : 0);
  } else if (sp.id === 3) {
    state.rutherfordPulse = 1.0;
  } else if (sp.id === 4) {
    setAlphaMode(!state.alphaHeadOnBoost);
  } else if (sp.id === 5) {
    const next = state.bohrShell >= 4 ? 1 : state.bohrShell + 1;
    jumpBohrShell(next);
  } else {
    const modes = ["hybrid", "cloud_only", "single_snap"];
    const nextM = modes[(modes.indexOf(state.cloudRenderMode) + 1) % modes.length];
    setCloudMode(nextM);
  }
}

function setDaltonSub(el, h2o) {
  state.daltonElement = el;
  state.daltonH2O = h2o;
  renderMonographPanel(SPECIMENS[state.currentIdx]);
}

function setThomsonSub(fieldVal) {
  state.thomsonField = fieldVal;
  renderMonographPanel(SPECIMENS[state.currentIdx]);
}

function setAlphaMode(headOn) {
  state.alphaHeadOnBoost = headOn;
  renderMonographPanel(SPECIMENS[state.currentIdx]);
}

function jumpBohrShell(target) {
  const from = state.bohrShell;
  if (from === target) return;
  const E = { 1: -13.6, 2: -3.4, 3: -1.51, 4: -0.85 };
  const dE = Math.abs(E[target] - E[from]).toFixed(2);
  const low = Math.min(from, target);
  const high = Math.max(from, target);
  let col = "#d4a359";
  let label = `hν = ${dE} eV`;
  if (low === 2 && high === 3) { col = "#e06c75"; label = ui("656.3 nm Hα 红光光子", "656.3 nm Hα red photon"); }
  else if (low === 2 && high === 4) { col = "#56b6c2"; label = ui("486.1 nm Hβ 蓝绿光子", "486.1 nm Hβ blue-green photon"); }
  else if (low === 1) { col = "#c678dd"; label = ui(`${dE} eV 莱曼系紫外光子`, `${dE} eV Lyman UV photon`); }

  state.bohrTransition = {
    from,
    to: target,
    progress: 0,
    isEmit: target < from,
    color: col,
    label
  };
  state.bohrShell = target;
  renderMonographPanel(SPECIMENS[state.currentIdx]);
}

function setPAxis(ax) {
  state.pAxis = ax;
  // Update callout coordinates for 2px / 2py / 2pz
  const sp8 = SPECIMENS[7];
  if (ax === "x") {
    sp8.callouts[0].x = 88; sp8.callouts[0].y = 0; sp8.callouts[0].z = 0;
    sp8.callouts[2].x = -88; sp8.callouts[2].y = 0; sp8.callouts[2].z = 0;
  } else if (ax === "y") {
    sp8.callouts[0].x = 0; sp8.callouts[0].y = 88; sp8.callouts[0].z = 0;
    sp8.callouts[2].x = 0; sp8.callouts[2].y = -88; sp8.callouts[2].z = 0;
  } else {
    sp8.callouts[0].x = 0; sp8.callouts[0].y = 0; sp8.callouts[0].z = 88;
    sp8.callouts[2].x = 0; sp8.callouts[2].y = 0; sp8.callouts[2].z = -88;
  }
  buildOrbitalGeometryAndCloud(`2p${ax}`);
  renderMonographPanel(sp8);
}

function setCloudMode(m) {
  state.cloudRenderMode = m;
  renderMonographPanel(SPECIMENS[state.currentIdx]);
}

/******************************************************************************
 * 3D CALLOUT LEADER-LINE SYSTEM
 ******************************************************************************/
function buildCalloutDOM(sp) {
  const layer = document.getElementById("calloutLabelsLayer");
  layer.innerHTML = sp.callouts.map((c, idx) => `
    <div class="callout-tag" id="calloutTag_${idx}">
      <span class="zh-inline">${c.zh}</span>
      <span class="tag-en">${c.en}</span>
    </div>
  `).join("");
}

function updateCalloutLeaderLines(cx, cy) {
  if (!state.showLabels) return;
  const sp = SPECIMENS[state.currentIdx];
  const svg = document.getElementById("calloutSvg");
  let svgLines = "";

  sp.callouts.forEach((c, idx) => {
    // For Specimen 03 (Rutherford), attach Callout #1 dynamically to the moving electron!
    let ax = c.x, ay = c.y, az = c.z;
    if (sp.id === 3 && idx === 1) {
      ax = state.liveElectronPos.x;
      ay = state.liveElectronPos.y;
      az = state.liveElectronPos.z;
    }

    const anchor = project3D(ax, ay, az, cx, cy);
    const labelX = cx + c.ox * state.camZoom;
    const labelY = cy + c.oy * state.camZoom;

    const tagEl = document.getElementById(`calloutTag_${idx}`);
    if (tagEl) {
      tagEl.style.left = `${labelX}px`;
      tagEl.style.top = `${labelY}px`;
    }

    svgLines += `
      <line x1="${anchor.sx}" y1="${anchor.sy}" x2="${labelX}" y2="${labelY}"
            stroke="rgba(220, 230, 235, 0.3)" stroke-width="1" />
      <circle cx="${anchor.sx}" cy="${anchor.sy}" r="2.6" fill="rgba(235, 242, 245, 0.85)" />
    `;
  });

  svg.innerHTML = svgLines;
}

/******************************************************************************
 * STANDARD 3D PHYSICS PROJECTION ENGINE
 * +Z is Vertical Up (Polar Axis), X and Y form the Horizontal Equatorial Plane
 ******************************************************************************/
function setupPointerAndKeyboard() {
  canvas.addEventListener("mousedown", e => {
    state.isDragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
  });
  window.addEventListener("mousemove", e => {
    if (!state.isDragging) return;
    const dx = e.clientX - state.lastX;
    const dy = e.clientY - state.lastY;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    state.targetYaw += dx * 0.007;
    state.targetPitch = Math.max(-1.35, Math.min(1.35, state.targetPitch + dy * 0.007));
  });
  window.addEventListener("mouseup", () => { state.isDragging = false; });

  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const f = e.deltaY > 0 ? 0.93 : 1.07;
    state.targetZoom = Math.max(0.55, Math.min(2.1, state.targetZoom * f));
  }, { passive: false });

  window.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") selectSpecimen(state.currentIdx + 1);
    else if (e.key === "ArrowLeft") selectSpecimen(state.currentIdx - 1);
    else if (e.key === "c" || e.key === "C") toggleSlice();
    else if (e.key === "l" || e.key === "L") toggleLabels();
    else if (e.key === "e" || e.key === "E") triggerStageExperiment();
    else if (e.key === "r" || e.key === "R") resetView();
  });
}

function project3D(x, y, z, cx, cy) {
  const cosY = Math.cos(state.camYaw);
  const sinY = Math.sin(state.camYaw);
  const cosP = Math.cos(state.camPitch);
  const sinP = Math.sin(state.camPitch);

  // Rotate horizontal plane (x, y) around vertical Z-axis by camYaw
  const x1 = x * cosY - y * sinY;
  const y1 = x * sinY + y * cosY;

  // Tilt vertical Z-axis and depth y1 by camPitch
  const screenY = z * cosP - y1 * sinP;
  const depthZ = z * sinP + y1 * cosP;

  const fov = 680;
  const dist = 720;
  const scale = (fov / Math.max(110, dist + depthZ)) * state.camZoom;

  return {
    sx: cx + x1 * scale,
    sy: cy - screenY * scale,
    z: depthZ,
    scale
  };
}

// Draw 3D Cartesian Coordinate Axes (+X, +Y, +Z) for Scientific Reference
function draw3DCartesianAxes(cx, cy, len = 175) {
  const origin = project3D(0, 0, 0, cx, cy);
  const axes = [
    { x: len, y: 0, z: 0, col: "rgba(218, 145, 115, 0.55)", lbl: "+X" },
    { x: 0, y: len, z: 0, col: "rgba(105, 175, 165, 0.55)", lbl: "+Y" },
    { x: 0, y: 0, z: len, col: "rgba(185, 155, 225, 0.65)", lbl: "+Z (极轴)" }
  ];
  ctx.save();
  axes.forEach(ax => {
    const pPos = project3D(ax.x, ax.y, ax.z, cx, cy);
    const pNeg = project3D(-ax.x * 0.75, -ax.y * 0.75, -ax.z * 0.75, cx, cy);

    ctx.strokeStyle = ax.col;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(pNeg.sx, pNeg.sy);
    ctx.lineTo(origin.sx, origin.sy);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(origin.sx, origin.sy);
    ctx.lineTo(pPos.sx, pPos.sy);
    ctx.stroke();

    ctx.fillStyle = ax.col;
    ctx.font = "500 10.5px 'JetBrains Mono', monospace";
    ctx.fillText(ax.lbl, pPos.sx + 5, pPos.sy + 3);
  });
  ctx.restore();
}

// Velvety Matte-Satin 3D Sphere Renderer
function drawVelvetSphere(sx, sy, radius, highlightCol, midCol, edgeCol, alpha = 1.0) {
  if (radius <= 0.4) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const grad = ctx.createRadialGradient(
    sx - radius * 0.28,
    sy - radius * 0.28,
    radius * 0.04,
    sx,
    sy,
    radius
  );
  grad.addColorStop(0, highlightCol);
  grad.addColorStop(0.46, midCol);
  grad.addColorStop(0.88, edgeCol);
  grad.addColorStop(1, "rgba(14, 18, 22, 0.92)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sx, sy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/******************************************************************************
 * MAIN 60FPS ANIMATION LOOP
 ******************************************************************************/
function animateLoop() {
  state.time += 0.016;
  if (state.autoRotate && !state.isDragging) {
    // Slow rotation in Specimen 04 so the left-to-right alpha beam stays easy to read
    const speed = state.currentIdx === 3 ? 0.0008 : 0.0034;
    state.targetYaw += speed;
  }

  state.camYaw += (state.targetYaw - state.camYaw) * 0.12;
  state.camPitch += (state.targetPitch - state.camPitch) * 0.12;
  state.camZoom += (state.targetZoom - state.camZoom) * 0.12;

  const wrap = document.getElementById("canvasWrap");
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  const cx = w * 0.5;
  const cy = h * 0.5;

  ctx.clearRect(0, 0, w, h);

  const sp = SPECIMENS[state.currentIdx];
  if (sp.id === 1) renderSpecimen01Dalton(cx, cy);
  else if (sp.id === 2) renderSpecimen02Thomson(cx, cy);
  else if (sp.id === 3) renderSpecimen03Rutherford(cx, cy);
  else if (sp.id === 4) renderSpecimen04AlphaScatter(cx, cy);
  else if (sp.id === 5) renderSpecimen05Bohr(cx, cy);
  else renderSpecimenQuantumOrbital(sp, cx, cy);

  updateCalloutLeaderLines(cx, cy);
  requestAnimationFrame(animateLoop);
}

/* ============================================================================
 * SPECIMEN 01: DALTON'S SOLID SPHERE (1803)
 * Pure Homogeneous Indivisible Solid Sphere (NO fake nuclei, shells, or electrons!)
 * ============================================================================ */
function renderSpecimen01Dalton(cx, cy) {
  const center = project3D(0, 0, 0, cx, cy);

  // H2O Whole-Number Ratio Combination Mode (104.5 deg bond angle)
  if (state.daltonH2O) {
    const bob = Math.sin(state.time * 2.2) * 3;
    const halfAng = (104.5 / 2) * (Math.PI / 180);
    const bondLen = 108;
    const atoms = [
      { x: 0, y: 0, z: 22 + bob, r: 88, pal: ["#e8d5f5", "#8e62b0", "#3d2452"], lbl: "O (氧实心球 16u)" },
      { x: -Math.sin(halfAng) * bondLen, y: 0, z: 22 - Math.cos(halfAng) * bondLen + bob, r: 50, pal: ["#dceae7", "#7d9c96", "#384a47"], lbl: "H (氢实心球 1u)" },
      { x: Math.sin(halfAng) * bondLen, y: 0, z: 22 - Math.cos(halfAng) * bondLen + bob, r: 50, pal: ["#dceae7", "#7d9c96", "#384a47"], lbl: "H (氢实心球 1u)" }
    ];
    const proj = atoms.map(a => ({ ...a, p: project3D(a.x, a.y, a.z, cx, cy) }));
    proj.sort((a, b) => b.p.z - a.p.z);
    proj.forEach(a => {
      const rad = a.r * a.p.scale;
      drawVelvetSphere(a.p.sx, a.p.sy, rad, a.pal[0], a.pal[1], a.pal[2], 1.0);
      ctx.fillStyle = "rgba(235, 240, 242, 0.8)";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(state.lang === "en" ? a.lbl.replace("氧实心球", "oxygen sphere").replace("氢实心球", "hydrogen sphere") : a.lbl, a.p.sx, a.p.sy + rad + 16);
    });
    return;
  }

  const elMap = {
    H: { r: 92, pal: ["#dceae7", "#7d9c96", "#384a47"], name: "氢原子 H (1 u)" },
    C: { r: 128, pal: ["#d8dce0", "#6e7a85", "#323940"], name: "碳原子 C (12 u)" },
    O: { r: 148, pal: ["#e8d5f5", "#8e62b0", "#3d2452"], name: "氧原子 O (16 u)" },
    Fe: { r: 172, pal: ["#f5d5b8", "#b87d56", "#593822"], name: "铁原子 Fe (56 u)" }
  };
  const cfg = elMap[state.daltonElement];
  const r = cfg.r;
  const rad = r * center.scale;

  // Render solid uniform sphere
  drawVelvetSphere(center.sx, center.sy, rad, cfg.pal[0], cfg.pal[1], cfg.pal[2], 1.0);

  // 3D Latitude & Longitude Geometric Grid on sphere surface to show 3D rotation clearly
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
  ctx.lineWidth = 1;
  [-45, 0, 45].forEach(lat => {
    const phi = (lat * Math.PI) / 180;
    ctx.beginPath();
    let started = false;
    for (let lon = 0; lon <= 360; lon += 10) {
      const theta = (lon * Math.PI) / 180;
      const px = r * Math.cos(phi) * Math.cos(theta);
      const py = r * Math.cos(phi) * Math.sin(theta);
      const pz = r * Math.sin(phi);
      const p = project3D(px, py, pz, cx, cy);
      if (p.z < 15) {
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
        else ctx.lineTo(p.sx, p.sy);
      } else {
        started = false;
      }
    }
    ctx.stroke();
  });

  [0, 60, 120].forEach(lon => {
    const theta = (lon * Math.PI) / 180;
    ctx.beginPath();
    let started = false;
    for (let a = 0; a <= 360; a += 10) {
      const phi = (a * Math.PI) / 180;
      const px = r * Math.cos(phi) * Math.cos(theta);
      const py = r * Math.cos(phi) * Math.sin(theta);
      const pz = r * Math.sin(phi);
      const p = project3D(px, py, pz, cx, cy);
      if (p.z < 15) {
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
        else ctx.lineTo(p.sx, p.sy);
      } else {
        started = false;
      }
    }
    ctx.stroke();
  });

  // If Sliced, show a uniform solid cross-section hatch (proving NO internal core or particles!)
  if (state.sliced) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(center.sx, center.sy, rad * 0.86, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(ui("均质实心截面（无核、无电子）", "Uniform solid interior (no nucleus or electrons)"), center.sx, center.sy + 4);
  }
  ctx.restore();
}

/* ============================================================================
 * SPECIMEN 02: THOMSON'S PLUM PUDDING MODEL (1897)
 * Uniform Positive Sphere (+) with Embedded Negative Electrons (e⁻) — NO central nucleus!
 * ============================================================================ */
function initThomsonElectrons() {
  state.thomsonElectrons = [];
  // 12 identical negative electrons in symmetric 3D equilibrium shells inside positive sphere
  const coords = [
    // Inner tetrahedral ring (4 electrons)
    [45, 45, 45], [-45, -45, 45], [-45, 45, -45], [45, -45, -45],
    // Outer octahedral/cuboctahedral shell (8 electrons)
    [105, 0, 0], [-105, 0, 0], [0, 105, 0], [0, -105, 0],
    [0, 0, 105], [0, 0, -105], [74, -74, 0], [-74, 74, 0]
  ];
  coords.forEach((c, idx) => {
    state.thomsonElectrons.push({ x: c[0], y: c[1], z: c[2], phase: idx * 0.8 });
  });
}

function renderSpecimen02Thomson(cx, cy) {
  const center = project3D(0, 0, 0, cx, cy);
  const sphereR = 162;
  const rad = sphereR * center.scale;

  // 1. Uniform Positively Charged Sphere ("Pudding" — warm rose-amber translucent sphere, NO central core!)
  ctx.save();
  const posGrad = ctx.createRadialGradient(
    center.sx - rad * 0.2,
    center.sy - rad * 0.2,
    rad * 0.05,
    center.sx,
    center.sy,
    rad
  );
  posGrad.addColorStop(0, "rgba(185, 115, 105, 0.34)");
  posGrad.addColorStop(0.65, "rgba(148, 86, 78, 0.32)");
  posGrad.addColorStop(0.95, "rgba(195, 128, 116, 0.42)");
  posGrad.addColorStop(1, "rgba(220, 155, 140, 0.5)");
  ctx.fillStyle = posGrad;
  ctx.beginPath();
  ctx.arc(center.sx, center.sy, rad, 0, Math.PI * 2);
  ctx.fill();

  if (state.sliced) {
    ctx.strokeStyle = "rgba(228, 168, 152, 0.38)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(center.sx, center.sy, rad * 0.94, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();

  // 2. Uniformly distributed Positive Charge '+' markers throughout the sphere
  const plusGrid = [
    [0, 0, 0], [65, 65, 0], [-65, 65, 0], [65, -65, 0], [-65, -65, 0],
    [0, 70, 65], [0, -70, 65], [0, 70, -65], [0, -70, -65],
    [75, 0, -55], [-75, 0, 55]
  ];
  ctx.save();
  ctx.fillStyle = "rgba(245, 195, 180, 0.52)";
  ctx.font = "bold 14px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  plusGrid.forEach(g => {
    const gp = project3D(g[0], g[1], g[2], cx, cy);
    ctx.fillText("+", gp.sx, gp.sy + 5);
  });
  ctx.restore();

  // 3. 12 Identical Negative Electrons (e⁻) embedded in the positive sphere
  const shiftX = state.thomsonField * 0.45;
  const projectedElec = state.thomsonElectrons.map(el => {
    const vx = el.x + shiftX + Math.sin(state.time * 3.6 + el.phase) * 3.2;
    const vy = el.y + Math.cos(state.time * 3.2 + el.phase) * 3.2;
    const vz = el.z + Math.sin(state.time * 2.9 + el.phase) * 3.2;
    return {
      eqP: project3D(el.x, el.y, el.z, cx, cy),
      curP: project3D(vx, vy, vz, cx, cy)
    };
  });

  projectedElec.sort((a, b) => b.curP.z - a.curP.z);

  projectedElec.forEach(item => {
    if (state.sliced && item.curP.z < -85) return;

    // Restoring tether if electric field is applied
    if (Math.abs(state.thomsonField) > 5) {
      ctx.save();
      ctx.strokeStyle = "rgba(125, 211, 252, 0.45)";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(item.eqP.sx, item.eqP.sy);
      ctx.lineTo(item.curP.sx, item.curP.sy);
      ctx.stroke();
      ctx.restore();
    }

    const eRad = 12.5 * item.curP.scale;
    drawVelvetSphere(item.curP.sx, item.curP.sy, eRad, "#e0f2fe", "#4ea8de", "#1d4e6e", 1.0);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(10 * item.curP.scale)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.fillText("e⁻", item.curP.sx, item.curP.sy + 3.5 * item.curP.scale);
  });
}

/* ============================================================================
 * SPECIMEN 03: RUTHERFORD'S NUCLEAR MODEL (1911)
 * Tiny Ultra-Dense Positive Nucleus (+Ze) in Vast Empty Space + Inclined Electron Orbits
 * ============================================================================ */
function renderSpecimen03Rutherford(cx, cy) {
  const center = project3D(0, 0, 0, cx, cy);
  const outerR = 175 * center.scale;

  // Faint dotted boundary indicating the vast 99.999% empty atomic volume
  ctx.save();
  ctx.strokeStyle = "rgba(160, 180, 190, 0.16)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(center.sx, center.sy, outerR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4 Inclined 3D Planetary Electron Orbits
  const orbits = [
    { r: 152, tx: 0.35, ty: 0.25, sp: 2.3, ph: 0 },
    { r: 152, tx: -0.95, ty: 0.45, sp: 2.6, ph: 1.6 },
    { r: 152, tx: 0.75, ty: -0.85, sp: 2.1, ph: 3.2 },
    { r: 152, tx: -0.35, ty: -1.05, sp: 2.4, ph: 4.8 }
  ];

  orbits.forEach((orb, idx) => {
    ctx.save();
    ctx.strokeStyle = "rgba(125, 185, 210, 0.26)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (let s = 0; s <= 72; s++) {
      const a = (s / 72) * Math.PI * 2;
      const pt3 = getTiltedOrbitPoint(a, orb.r, orb.tx, orb.ty);
      const p = project3D(pt3.x, pt3.y, pt3.z, cx, cy);
      if (s === 0) ctx.moveTo(p.sx, p.sy);
      else ctx.lineTo(p.sx, p.sy);
    }
    ctx.stroke();

    // Moving electron + comet tail trail
    const ea = state.time * orb.sp + orb.ph;
    ctx.strokeStyle = "rgba(125, 211, 252, 0.55)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let t = 0; t <= 12; t++) {
      const ta = ea - t * 0.045;
      const tp3 = getTiltedOrbitPoint(ta, orb.r, orb.tx, orb.ty);
      const tp = project3D(tp3.x, tp3.y, tp3.z, cx, cy);
      if (t === 0) ctx.moveTo(tp.sx, tp.sy);
      else ctx.lineTo(tp.sx, tp.sy);
    }
    ctx.stroke();

    const ePos3 = getTiltedOrbitPoint(ea, orb.r, orb.tx, orb.ty);
    if (idx === 0) {
      state.liveElectronPos = ePos3;
    }
    const ep = project3D(ePos3.x, ePos3.y, ePos3.z, cx, cy);
    drawVelvetSphere(ep.sx, ep.sy, 8.5 * ep.scale, "#e0f2fe", "#4ea8de", "#1d4e6e", 1.0);
    ctx.fillStyle = "#bae6fd";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillText("e⁻", ep.sx + 10, ep.sy - 6);
    ctx.restore();
  });

  // Central Tiny, Ultra-Dense Positive Nucleus (Protons + Neutrons tightly bound)
  const nucHalo = ctx.createRadialGradient(center.sx, center.sy, 2, center.sx, center.sy, 32 * center.scale);
  nucHalo.addColorStop(0, "rgba(212, 163, 89, 0.65)");
  nucHalo.addColorStop(1, "rgba(212, 163, 89, 0)");
  ctx.fillStyle = nucHalo;
  ctx.beginPath();
  ctx.arc(center.sx, center.sy, 32 * center.scale, 0, Math.PI * 2);
  ctx.fill();

  const nucleons = [
    [0,0,0,true], [5,4,3,false], [-5,4,-3,true], [4,-5,3,false],
    [-4,-4,5,true], [0,5,-5,false], [5,0,-5,true], [-5,0,5,false]
  ];
  nucleons.forEach(n => {
    const np = project3D(n[0], n[1], n[2], cx, cy);
    if (n[3]) {
      drawVelvetSphere(np.sx, np.sy, 6.2 * np.scale, "#fde68a", "#d97757", "#6e2c1b", 1.0);
    } else {
      drawVelvetSphere(np.sx, np.sy, 6.2 * np.scale, "#e2ece9", "#8ea39e", "#455450", 1.0);
    }
  });

  if (state.rutherfordPulse > 0) {
    state.rutherfordPulse = Math.max(0, state.rutherfordPulse - 0.02);
    ctx.save();
    ctx.strokeStyle = `rgba(212, 163, 89, ${state.rutherfordPulse})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center.sx, center.sy, (18 + (1 - state.rutherfordPulse) * 150) * center.scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function getTiltedOrbitPoint(ang, r, tiltX, tiltY) {
  const x0 = Math.cos(ang) * r;
  const y0 = Math.sin(ang) * r;
  // Tilt in 3D
  const x = x0 * Math.cos(tiltY);
  const y = y0 * Math.cos(tiltX);
  const z = x0 * Math.sin(tiltY) + y0 * Math.sin(tiltX);
  return { x, y, z };
}

/* ============================================================================
 * SPECIMEN 04: GOLD FOIL ALPHA PARTICLE SCATTERING EXPERIMENT (1909-1911)
 * 100% Scientifically Accurate:
 * - Projectiles are Alpha Particles (⁴₂He²⁺: 2 protons + 2 neutrons, +2e charge), NOT electrons!
 * - Continuous, uninterrupted stream (no mid-flight resets!)
 * - Shows Gold Foil lattice plane, Au⁷⁹⁺ nucleus, typical straight paths (green),
 *   moderate Coulomb deflection (amber), and rare >90° head-on rebound (coral-red)!
 * ============================================================================ */
function initContinuousAlphaParticles() {
  state.alphaParticles = [];
  // Create 26 continuous alpha particles across different impact parameters (b)
  const impactZones = [
    // 2 head-on / near-head-on trajectories (b very small -> >90 deg rebound!)
    { z0: -3.5, y0: 0, type: "rebound" },
    { z0: 4.2, y0: 1.5, type: "rebound" },
    // 6 intermediate impact parameter trajectories (15 - 75 deg deflection)
    { z0: 22, y0: -8, type: "deflect" },
    { z0: -25, y0: 10, type: "deflect" },
    { z0: 34, y0: 12, type: "deflect" },
    { z0: -36, y0: -14, type: "deflect" },
    { z0: 18, y0: 22, type: "deflect" },
    { z0: -19, y0: -24, type: "deflect" },
    // Wide impact-parameter trajectories illustrate common near-straight paths.
    { z0: 68, y0: 0, type: "straight" },
    { z0: -68, y0: 0, type: "straight" },
    { z0: 95, y0: 25, type: "straight" },
    { z0: -95, y0: -25, type: "straight" },
    { z0: 122, y0: -18, type: "straight" },
    { z0: -122, y0: 18, type: "straight" },
    { z0: 55, y0: 65, type: "straight" },
    { z0: -55, y0: -65, type: "straight" },
    { z0: 82, y0: -60, type: "straight" },
    { z0: -82, y0: 60, type: "straight" },
    { z0: 110, y0: 45, type: "straight" },
    { z0: -110, y0: -45, type: "straight" }
  ];

  impactZones.forEach((zone, idx) => {
    const p = createSingleAlphaParticle(zone, -220 - (idx * 22));
    state.alphaParticles.push(p);
  });
}

function createSingleAlphaParticle(zone, startX = -230) {
  let z0 = zone.z0;
  let y0 = zone.y0;
  if (state.alphaHeadOnBoost && zone.type === "straight" && Math.random() < 0.45) {
    // In Head-On focus mode, aim more alpha particles right at the Au79+ nucleus!
    z0 = (Math.random() - 0.5) * 14;
    y0 = (Math.random() - 0.5) * 10;
  }
  return {
    x: startX,
    y: y0,
    z: z0,
    vx: 3.4,
    vy: 0,
    vz: 0,
    zone,
    trail: []
  };
}

// Helper to draw a composite Alpha Particle (⁴₂He²⁺: 2 red protons + 2 gray neutrons)
function drawAlphaCluster(sx, sy, scale, tailCol) {
  const r = 3.6 * scale;
  ctx.save();
  // Positive +2e halo
  const halo = ctx.createRadialGradient(sx, sy, 1, sx, sy, r * 2.8);
  halo.addColorStop(0, tailCol);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sx, sy, r * 2.8, 0, Math.PI * 2);
  ctx.fill();

  // 4 bound nucleons (2 Protons + 2 Neutrons) forming He2+
  drawVelvetSphere(sx - r * 0.55, sy - r * 0.45, r, "#fecaca", "#e11d48", "#7f1d1d", 1.0);
  drawVelvetSphere(sx + r * 0.55, sy + r * 0.45, r, "#fecaca", "#e11d48", "#7f1d1d", 1.0);
  drawVelvetSphere(sx + r * 0.55, sy - r * 0.45, r, "#f1f5f9", "#94a3b8", "#334155", 1.0);
  drawVelvetSphere(sx - r * 0.55, sy + r * 0.45, r, "#f1f5f9", "#94a3b8", "#334155", 1.0);
  ctx.restore();
}

function renderSpecimen04AlphaScatter(cx, cy) {
  const center = project3D(0, 0, 0, cx, cy);

  // 1. Draw the Gold Foil Plane (x = 0 plane) & Neighboring Gold Atoms in the Lattice
  ctx.save();
  const foilCorners = [
    project3D(0, -140, 155, cx, cy),
    project3D(0, 140, 155, cx, cy),
    project3D(0, 140, -155, cx, cy),
    project3D(0, -140, -155, cx, cy)
  ];
  ctx.fillStyle = "rgba(212, 163, 89, 0.045)";
  ctx.strokeStyle = "rgba(212, 163, 89, 0.24)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  foilCorners.forEach((p, i) => { if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy); });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dotted boundary of the Central Gold Atom's vast empty volume
  ctx.strokeStyle = "rgba(212, 163, 89, 0.22)";
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.arc(center.sx, center.sy, 145 * center.scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 2. Central Massive Gold Nucleus (Au⁷⁹⁺, +79e positive charge)
  const auGlow = ctx.createRadialGradient(center.sx, center.sy, 2, center.sx, center.sy, 42 * center.scale);
  auGlow.addColorStop(0, "rgba(251, 191, 36, 0.85)");
  auGlow.addColorStop(0.5, "rgba(212, 163, 89, 0.25)");
  auGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = auGlow;
  ctx.beginPath();
  ctx.arc(center.sx, center.sy, 42 * center.scale, 0, Math.PI * 2);
  ctx.fill();

  drawVelvetSphere(center.sx, center.sy, 16 * center.scale, "#fef08a", "#d4a359", "#6e4e1e", 1.0);
  ctx.fillStyle = "#fef08a";
  ctx.font = "bold 11px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("Au⁷⁹⁺ (+79e)", center.sx, center.sy - 21 * center.scale);

  // 3. Left Alpha Particle Source Collimator Box
  const srcPt = project3D(-225, 0, 0, cx, cy);
  ctx.save();
  ctx.fillStyle = "rgba(30, 38, 44, 0.9)";
  ctx.strokeStyle = "rgba(212, 163, 89, 0.55)";
  ctx.lineWidth = 1.2;
  ctx.fillRect(srcPt.sx - 26, srcPt.sy - 48, 26, 96);
  ctx.strokeRect(srcPt.sx - 26, srcPt.sy - 48, 26, 96);
  ctx.fillStyle = "#d4a359";
  ctx.font = "10.5px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(ui("α 粒子放射源", "Alpha source"), srcPt.sx - 13, srcPt.sy - 56);
  ctx.fillText("(He²⁺, +2e)", srcPt.sx - 13, srcPt.sy + 64);
  ctx.restore();

  // 4. Update & Render Continuous Alpha Particles (NEVER resetting the whole array!)
  const kCoulomb = 1550;
  for (let i = 0; i < state.alphaParticles.length; i++) {
    const ap = state.alphaParticles[i];

    // Only integrate once the particle enters the chamber (x >= -225)
    for (let step = 0; step < 3; step++) {
      if (ap.x >= -225) {
        const r2 = ap.x * ap.x + ap.y * ap.y + ap.z * ap.z + 24;
        const r = Math.sqrt(r2);
        const f = kCoulomb / (r2 * r);
        ap.vx += (ap.x * f) / 3;
        ap.vy += (ap.y * f) / 3;
        ap.vz += (ap.z * f) / 3;
      }
      ap.x += ap.vx / 3;
      ap.y += ap.vy / 3;
      ap.z += ap.vz / 3;
    }

    if (ap.x >= -225) {
      ap.trail.push({ x: ap.x, y: ap.y, z: ap.z });
      if (ap.trail.length > 48) ap.trail.shift();
    }

    // Determine scattering angle category for color-coding
    const sp = Math.sqrt(ap.vx * ap.vx + ap.vy * ap.vy + ap.vz * ap.vz);
    const cosTheta = ap.vx / (sp + 1e-5);
    let col = "rgba(82, 184, 154, 0.72)"; // Straight transmission (green-teal)
    if (cosTheta < 0.1) {
      col = "rgba(235, 105, 95, 0.92)";   // Large-angle rebound (>90°, coral-red)
    } else if (cosTheta < 0.94) {
      col = "rgba(228, 175, 88, 0.85)";   // Moderate deflection (amber-gold)
    }

    if (ap.trail.length > 1) {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = cosTheta < 0.1 ? 2.2 : 1.5;
      ctx.beginPath();
      ap.trail.forEach((t, idx) => {
        const tp = project3D(t.x, t.y, t.z, cx, cy);
        if (idx === 0) ctx.moveTo(tp.sx, tp.sy);
        else ctx.lineTo(tp.sx, tp.sy);
      });
      ctx.stroke();
      ctx.restore();
    }

    if (ap.x >= -225) {
      const hp = project3D(ap.x, ap.y, ap.z, cx, cy);
      drawAlphaCluster(hp.sx, hp.sy, hp.scale, col);
    }

    // Individually recycle only particles that exit the chamber boundaries!
    if (ap.x > 235 || ap.x < -250 || Math.abs(ap.y) > 220 || Math.abs(ap.z) > 220) {
      state.alphaParticles[i] = createSingleAlphaParticle(ap.zone, -225 - Math.random() * 35);
    }
  }
}

/* ============================================================================
 * SPECIMEN 05: BOHR'S QUANTUM ORBITS (1913)
 * Quantized Shells (n=1,2,3,4), de Broglie Standing Wave (2πr = nλ) & Photon Jumps
 * ============================================================================ */
function renderSpecimen05Bohr(cx, cy) {
  const center = project3D(0, 0, 0, cx, cy);
  const radii = [0, 44, 88, 132, 176];
  const shellNames = ["", "n=1 (K)", "n=2 (L)", "n=3 (M)", "n=4 (N)"];

  // Central proton nucleus (+e)
  drawVelvetSphere(center.sx, center.sy, 14 * center.scale, "#fde68a", "#d97757", "#6e2c1b", 1.0);

  // Render quantized concentric shells in 3D XY plane
  for (let n = 1; n <= 4; n++) {
    const r = radii[n];
    const isAct = (state.bohrShell === n);

    ctx.save();
    ctx.strokeStyle = isAct ? "rgba(212, 163, 89, 0.8)" : "rgba(165, 185, 195, 0.24)";
    ctx.lineWidth = isAct ? 1.8 : 1.0;
    if (!isAct) ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let s = 0; s <= 90; s++) {
      const a = (s / 90) * Math.PI * 2;
      const p = project3D(Math.cos(a) * r, Math.sin(a) * r, 0, cx, cy);
      if (s === 0) ctx.moveTo(p.sx, p.sy);
      else ctx.lineTo(p.sx, p.sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // De Broglie Standing Wave on the active shell (2*pi*r = n*lambda)
    if (isAct) {
      ctx.strokeStyle = "rgba(78, 154, 142, 0.72)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let s = 0; s <= 160; s++) {
        const a = (s / 160) * Math.PI * 2;
        const wave = Math.sin(n * a) * Math.cos(state.time * 6) * 7.5;
        const wr = r + wave;
        const p = project3D(Math.cos(a) * wr, Math.sin(a) * wr, wave * 0.35, cx, cy);
        if (s === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    }

    const lp = project3D(r + 12, 0, 0, cx, cy);
    ctx.fillStyle = isAct ? "#d4a359" : "rgba(165, 185, 195, 0.6)";
    ctx.font = "10.5px 'JetBrains Mono', monospace";
    ctx.fillText(shellNames[n], lp.sx + 4, lp.sy + 3);
    ctx.restore();
  }

  // Electron & Photon Transition Animation
  let curR = radii[state.bohrShell];
  if (state.bohrTransition) {
    const tr = state.bohrTransition;
    tr.progress += 0.022;
    const t = Math.min(1, tr.progress);
    curR = radii[tr.from] + (radii[tr.to] - radii[tr.from]) * t;

    const ea = state.time * 2.2;
    const ep = project3D(Math.cos(ea) * curR, Math.sin(ea) * curR, 0, cx, cy);
    const dist = tr.isEmit ? t * 155 : (1 - t) * 155;
    const px = ep.sx + dist;
    const py = ep.sy - dist * 0.45;

    ctx.save();
    ctx.strokeStyle = tr.color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let k = -24; k <= 24; k += 2) {
      const wx = px + k;
      const wy = py - k * 0.45 + Math.sin(k * 0.55 + state.time * 25) * 6.5;
      if (k === -24) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();
    ctx.fillStyle = tr.color;
    ctx.font = "11px sans-serif";
    ctx.fillText(tr.label, px + 18, py - 12);
    ctx.restore();

    if (tr.progress >= 1) state.bohrTransition = null;
  }

  const ea = state.time * (2.4 / Math.sqrt(state.bohrShell));
  const ep = project3D(Math.cos(ea) * curR, Math.sin(ea) * curR, 0, cx, cy);
  drawVelvetSphere(ep.sx, ep.sy, 10 * ep.scale, "#e0f2fe", "#4ea8de", "#1d4e6e", 1.0);
}

/* ============================================================================
 * SPECIMENS 06 - 12: QUANTUM ELECTRON CLOUD & 3D ATOMIC ORBITALS
 * Mathematically Rigorous Wavefunctions ψ(x,y,z) aligned with +X, +Y, +Z Axes!
 * Includes:
 * 1) Parametric 3D Harmonic Iso-Surface Lobes (Smooth Teardrop / Torus / Clover)
 * 2) Monte Carlo Probability Density Cloud (|ψ|²)
 * 3) Translucent 3D Nodal Planes / Spherical Radial Nodes / Conical Nodes
 * ============================================================================ */
function evalExactWavefunction(key, x, y, z) {
  const r = Math.sqrt(x * x + y * y + z * z) + 1e-6;
  if (key === "1s") {
    const psi = Math.exp(-r / 1.35);
    return { prob: psi * psi, phase: 1 };
  }
  if (key === "2s") {
    const rho = r / 1.15;
    const psi = (2.0 - rho) * Math.exp(-rho / 2.0);
    return { prob: psi * psi, phase: psi >= 0 ? 1 : -1 };
  }
  if (key === "2px" || key === "2py" || key === "2pz") {
    const rho = r / 1.18;
    const coord = key === "2px" ? x : (key === "2py" ? y : z);
    const psi = rho * Math.exp(-rho / 2.0) * (coord / r);
    return { prob: psi * psi, phase: psi >= 0 ? 1 : -1 };
  }
  if (key === "3dz2") {
    const rho = r / 1.05;
    const cosTheta = z / r; // Z is the vertical polar axis!
    const psi = (rho * rho) * Math.exp(-rho / 2.3) * (3 * cosTheta * cosTheta - 1);
    return { prob: psi * psi, phase: psi >= 0 ? 1 : -1 };
  }
  if (key === "3dxy") {
    const rho = r / 1.05;
    // Four-leaf clover in the horizontal XY plane!
    const psi = (rho * rho) * Math.exp(-rho / 2.3) * ((x * y) / (r * r)) * 2.3;
    return { prob: psi * psi, phase: psi >= 0 ? 1 : -1 };
  }
  return { prob: 0, phase: 1 };
}

function buildOrbitalGeometryAndCloud(key) {
  // 1. Build Parametric 3D Harmonic Iso-Surface Voxels for silky-smooth 3D lobes
  const voxels = [];
  if (key === "1s") {
    addSphericalShellVoxels(voxels, 78, 1, null, state.sliced);
  } else if (key === "2s") {
    // Inner core (+psi) + outer concentric shell (-psi), with clear empty gap at r=56 (Radial Node!)
    addSphericalShellVoxels(voxels, 36, 1, null, false);
    addSphericalShellVoxels(voxels, 112, -1, null, state.sliced);
  } else if (key === "2px" || key === "2py" || key === "2pz") {
    addHarmonicLobeVoxels(voxels, key, 118, null);
  } else if (key === "2p_all") {
    addHarmonicLobeVoxels(voxels, "2px", 112, ["#ffe4cc", "#d89672", "#75462e"]);
    addHarmonicLobeVoxels(voxels, "2py", 112, ["#d8ece8", "#689c94", "#32524e"]);
    addHarmonicLobeVoxels(voxels, "2pz", 112, ["#ebd0f8", "#9866be", "#46295e"]);
  } else if (key === "3dz2") {
    addHarmonicLobeVoxels(voxels, "3dz2", 126, null);
  } else if (key === "3dxy") {
    addHarmonicLobeVoxels(voxels, "3dxy", 128, null);
  } else if (key === "neon_full") {
    addSphericalShellVoxels(voxels, 34, 1, ["#fef08a", "#d4a359", "#6e4e1e"], false);
    addSphericalShellVoxels(voxels, 78, -1, ["#d8ece8", "#689c94", "#32524e"], true);
    addHarmonicLobeVoxels(voxels, "2px", 115, ["#ffe4cc", "#d89672", "#75462e"]);
    addHarmonicLobeVoxels(voxels, "2py", 115, ["#d8ece8", "#689c94", "#32524e"]);
    addHarmonicLobeVoxels(voxels, "2pz", 115, ["#ebd0f8", "#9866be", "#46295e"]);
  }
  state.lobeVoxels = voxels;

  // 2. Build Monte Carlo Probability Density Point Cloud |ψ|²
  const pts = [];
  const total = 3400;

  if (key === "2p_all") {
    const axes = [
      { k: "2px", col: [216, 152, 108] },
      { k: "2py", col: [108, 168, 158] },
      { k: "2pz", col: [168, 132, 208] }
    ];
    axes.forEach(ax => {
      let c = 0, g = 0;
      while (c < 1100 && g < 110000) {
        g++;
        const x = (Math.random() - 0.5) * 14;
        const y = (Math.random() - 0.5) * 14;
        const z = (Math.random() - 0.5) * 14;
        if (state.sliced && x > 0 && y > 0) continue;
        const res = evalExactWavefunction(ax.k, x, y, z);
        if (Math.random() * 0.42 < res.prob) {
          pts.push({ x: x * 24, y: y * 24, z: z * 24, prob: Math.min(1, res.prob / 0.36), phase: res.phase, rgb: ax.col });
          c++;
        }
      }
    });
    state.cloudPoints = pts;
    return;
  }

  if (key === "neon_full") {
    const layers = [
      { k: "1s", goal: 700, col: [232, 186, 108], maxP: 0.85, b: 4.8 },
      { k: "2s", goal: 800, col: [114, 176, 182], maxP: 0.44, b: 11.5 },
      { k: "2px", goal: 650, col: [216, 148, 118], maxP: 0.42, b: 12.5 },
      { k: "2py", goal: 650, col: [118, 176, 154], maxP: 0.42, b: 12.5 },
      { k: "2pz", goal: 650, col: [172, 136, 208], maxP: 0.42, b: 12.5 }
    ];
    layers.forEach(lay => {
      let c = 0, g = 0;
      while (c < lay.goal && g < 80000) {
        g++;
        const x = (Math.random() - 0.5) * lay.b * 2;
        const y = (Math.random() - 0.5) * lay.b * 2;
        const z = (Math.random() - 0.5) * lay.b * 2;
        if (state.sliced && x > 0 && y > 0) continue;
        const res = evalExactWavefunction(lay.k, x, y, z);
        if (Math.random() * lay.maxP < res.prob) {
          pts.push({ x: x * 21, y: y * 21, z: z * 21, prob: Math.min(1, res.prob / lay.maxP), phase: res.phase, rgb: lay.col });
          c++;
        }
      }
    });
    state.cloudPoints = pts;
    return;
  }

  let maxB = 7.2, maxP = 0.42, scale = 25;
  if (key === "1s") { maxB = 4.2; maxP = 0.85; scale = 36; }
  else if (key === "2s") { maxB = 7.6; maxP = 0.35; scale = 23; }
  else if (key.startsWith("2p")) { maxB = 7.4; maxP = 0.42; scale = 24; }
  else if (key.startsWith("3d")) { maxB = 10.2; maxP = 1.65; scale = 19; }

  let c = 0, g = 0;
  while (c < total && g < 220000) {
    g++;
    const x = (Math.random() - 0.5) * maxB * 2;
    const y = (Math.random() - 0.5) * maxB * 2;
    const z = (Math.random() - 0.5) * maxB * 2;
    if (state.sliced && x > 0 && y > 0 && (key === "1s" || key === "2s")) continue;
    const res = evalExactWavefunction(key, x, y, z);
    if (Math.random() * maxP < res.prob) {
      pts.push({
        x: x * scale, y: y * scale, z: z * scale,
        prob: Math.min(1, res.prob / (maxP * 0.62)),
        phase: res.phase,
        rgb: null
      });
      c++;
    }
  }
  state.cloudPoints = pts;
}

// Parametric Spherical Harmonic Iso-Surface Builder for True 3D Teardrop/Torus/Clover Lobes
function addSphericalShellVoxels(arr, radius, phase, customPal, sliceFrontOctant) {
  const latSteps = 12, lonSteps = 24;
  for (let i = 1; i < latSteps; i++) {
    const theta = (i / latSteps) * Math.PI;
    for (let j = 0; j < lonSteps; j++) {
      const phi = (j / lonSteps) * Math.PI * 2;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);
      if (sliceFrontOctant && x > 0 && y > 0) continue;
      arr.push({ x, y, z, r: radius * 0.24, phase, pal: customPal });
    }
  }
}

function addHarmonicLobeVoxels(arr, key, maxScale, customPal) {
  // Sample along orbital axes/rings to form smooth, continuous 3D teardrop spindles & torus rings
  if (key === "2px" || key === "2py" || key === "2pz") {
    // Teardrop spindle profile along the axis: 8 axial stations from r=18 to r=maxScale
    const stations = [
      { t: 0.24, rad: 14 },
      { t: 0.40, rad: 24 },
      { t: 0.58, rad: 33 },
      { t: 0.74, rad: 38 },
      { t: 0.88, rad: 34 },
      { t: 0.96, rad: 24 }
    ];
    [1, -1].forEach(sign => {
      stations.forEach(st => {
        const pos = sign * st.t * maxScale;
        const x = key === "2px" ? pos : 0;
        const y = key === "2py" ? pos : 0;
        const z = key === "2pz" ? pos : 0;
        arr.push({ x, y, z, r: st.rad, phase: sign, pal: customPal });
      });
    });
  } else if (key === "3dz2") {
    // Two polar teardrop spindles along +Z and -Z
    const stations = [
      { t: 0.25, rad: 13 },
      { t: 0.44, rad: 22 },
      { t: 0.64, rad: 31 },
      { t: 0.82, rad: 35 },
      { t: 0.94, rad: 25 }
    ];
    [1, -1].forEach(sign => {
      stations.forEach(st => {
        arr.push({ x: 0, y: 0, z: sign * st.t * maxScale, r: st.rad, phase: 1, pal: customPal });
      });
    });
    // Smooth continuous equatorial torus ring in the XY plane (z = 0, phase = -1)
    const torusR = maxScale * 0.56;
    for (let s = 0; s < 36; s++) {
      const phi = (s / 36) * Math.PI * 2;
      arr.push({
        x: Math.cos(phi) * torusR,
        y: Math.sin(phi) * torusR,
        z: 0,
        r: 19,
        phase: -1,
        pal: customPal
      });
    }
  } else if (key === "3dxy") {
    // 4 Cloverleaf teardrop spindles along the 45-degree diagonals in the XY plane
    const diagAngles = [
      { ang: Math.PI * 0.25, phase: 1 },
      { ang: Math.PI * 0.75, phase: -1 },
      { ang: Math.PI * 1.25, phase: 1 },
      { ang: Math.PI * 1.75, phase: -1 }
    ];
    const stations = [
      { t: 0.26, rad: 13 },
      { t: 0.45, rad: 22 },
      { t: 0.65, rad: 30 },
      { t: 0.82, rad: 33 },
      { t: 0.94, rad: 23 }
    ];
    diagAngles.forEach(d => {
      stations.forEach(st => {
        const dist = st.t * maxScale;
        arr.push({
          x: Math.cos(d.ang) * dist,
          y: Math.sin(d.ang) * dist,
          z: 0,
          r: st.rad,
          phase: d.phase,
          pal: customPal
        });
      });
    });
  }
}

function renderSpecimenQuantumOrbital(sp, cx, cy) {
  const key = (sp.id === 8) ? `2p${state.pAxis}` : sp.orbitalKey;

  // 1. Draw crisp 3D Cartesian Coordinate Axes (+X, +Y, +Z)
  draw3DCartesianAxes(cx, cy, 175);

  // 2. Draw 3D Nodal Surfaces (Radial Node sphere for 2s, Nodal Planes for 2p/3dxy, Conical Nodes for 3dz2)
  render3DNodalSurfaces(key, cx, cy);

  // 3. Single-Electron Instant Snapshot Mode (Myth-buster pedagogical feature!)
  if (state.cloudRenderMode === "single_snap") {
    const center = project3D(0, 0, 0, cx, cy);
    drawVelvetSphere(center.sx, center.sy, 6 * center.scale, "#ffffff", "#d4a359", "#6e4e1e", 1.0);

    const pts = state.cloudPoints;
    if (pts.length > 0) {
      const idx = Math.floor((state.time * 12) % pts.length);
      for (let g = 8; g >= 1; g--) {
        const gp = pts[(idx - g + pts.length) % pts.length];
        const pr = project3D(gp.x, gp.y, gp.z, cx, cy);
        drawVelvetSphere(pr.sx, pr.sy, 5 * pr.scale, "#e0f2fe", "#4ea8de", "#1d4e6e", 0.22 / g);
      }
      const cur = pts[idx];
      const cp = project3D(cur.x, cur.y, cur.z, cx, cy);
      drawVelvetSphere(cp.sx, cp.sy, 9.5 * cp.scale, "#ffffff", "#38bdf8", "#1d4ed8", 1.0);
      ctx.fillStyle = "#bae6fd";
      ctx.font = "11px sans-serif";
      ctx.fillText(ui("e⁻ 瞬间抓拍位置（1个电子）", "e⁻ snapshot (one electron)"), cp.sx + 12, cp.sy - 8);
    }
    return;
  }

  // 4. In 'hybrid' mode, render depth-sorted 3D Harmonic Iso-Surface Lobes
  if (state.cloudRenderMode === "hybrid" && state.lobeVoxels.length > 0) {
    const projectedVoxels = state.lobeVoxels.map(v => ({
      ...v,
      p: project3D(v.x, v.y, v.z, cx, cy)
    }));
    projectedVoxels.sort((a, b) => b.p.z - a.p.z);

    projectedVoxels.forEach(vx => {
      const rad = vx.r * vx.p.scale;
      if (vx.pal) {
        drawVelvetSphere(vx.p.sx, vx.p.sy, rad, vx.pal[0], vx.pal[1], vx.pal[2], 0.34);
      } else if (vx.phase > 0) {
        // +ψ Positive Wavefunction Phase: Warm Amber-Gold / Lavender
        drawVelvetSphere(vx.p.sx, vx.p.sy, rad, "rgba(252, 224, 185, 0.72)", "rgba(204, 142, 88, 0.45)", "rgba(112, 68, 36, 0.25)", 0.42);
      } else {
        // -ψ Negative Wavefunction Phase: Muted Sage-Teal / Slate-Blue
        drawVelvetSphere(vx.p.sx, vx.p.sy, rad, "rgba(205, 238, 235, 0.72)", "rgba(88, 152, 148, 0.45)", "rgba(42, 82, 80, 0.25)", 0.42);
      }
    });
  }

  // 5. Render Monte Carlo Probability Density Cloud Points |ψ|²
  ctx.save();
  for (let i = 0; i < state.cloudPoints.length; i++) {
    const pt = state.cloudPoints[i];
    const pr = project3D(pt.x, pt.y, pt.z, cx, cy);
    if (pr.z < -480) continue;

    const alpha = state.cloudRenderMode === "hybrid"
      ? (0.18 + pt.prob * 0.48)
      : (0.28 + pt.prob * 0.65);
    const sz = (1.3 + pt.prob * 1.9) * pr.scale;

    let r = 235, g = 185, b = 135;
    if (pt.rgb) {
      [r, g, b] = pt.rgb;
    } else if (pt.phase > 0) {
      r = 242; g = 192; b = 132; // +ψ Warm Amber-Gold
    } else {
      r = 128; g = 198; b = 192; // -ψ Muted Sage-Teal
    }

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(pr.sx, pr.sy, sz, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Central atomic nucleus pinpoint at (0,0,0)
  const center = project3D(0, 0, 0, cx, cy);
  drawVelvetSphere(center.sx, center.sy, 5.5 * center.scale, "#ffffff", "#d4a359", "#6e4e1e", 1.0);
}

// Render Translucent 3D Nodal Surfaces (Radial Node for 2s, Nodal Planes for 2p, Conical Nodes for 3dz2)
function render3DNodalSurfaces(key, cx, cy) {
  ctx.save();
  if (key === "2s") {
    // Spherical Radial Node at r = 2a₀ (radius = 56 in 3D units)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
    ctx.lineWidth = 1.3;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let s = 0; s <= 72; s++) {
      const a = (s / 72) * Math.PI * 2;
      const p = project3D(Math.cos(a) * 56, Math.sin(a) * 56, 0, cx, cy);
      if (s === 0) ctx.moveTo(p.sx, p.sy);
      else ctx.lineTo(p.sx, p.sy);
    }
    ctx.stroke();
  } else if (key === "2px" || key === "2py" || key === "2pz") {
    // Flat Angular Nodal Plane perpendicular to orbital axis
    const sz = 115;
    let corners = [];
    if (key === "2pz") {
      corners = [[-sz,-sz,0], [sz,-sz,0], [sz,sz,0], [-sz,sz,0]];
    } else if (key === "2px") {
      corners = [[0,-sz,-sz], [0,sz,-sz], [0,sz,sz], [0,-sz,sz]];
    } else {
      corners = [[-sz,0,-sz], [sz,0,-sz], [sz,0,sz], [-sz,0,sz]];
    }
    const projC = corners.map(c => project3D(c[0], c[1], c[2], cx, cy));
    ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    projC.forEach((p, i) => { if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy); });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (key === "3dz2") {
    // Two Conical Nodal Rings at magic angle θ = 54.7°
    const rCone = 72, zCone = 51;
    [zCone, -zCone].forEach(zc => {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      for (let s = 0; s <= 60; s++) {
        const a = (s / 60) * Math.PI * 2;
        const p = project3D(Math.cos(a) * rCone, Math.sin(a) * rCone, zc, cx, cy);
        if (s === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    });
  }
  ctx.restore();
}

/******************************************************************************
 * INTERACTIVE QUIZ MODAL
 ******************************************************************************/
const QUIZ_LIST = [
  {
    qZh: "01 · 1897年 J.J. 汤姆孙通过阴极射线管实验发现了哪种亚原子微粒，从而打破了道尔顿「原子不可分割」的观点？",
    qEn: "01 · Which subatomic particle did J.J. Thomson discover in 1897 using cathode rays, disproving Dalton's indivisible sphere?",
    opts: ["A. 质子 (Proton)", "B. 电子 (Electron, e⁻)", "C. 中子 (Neutron)", "D. α 粒子 (Alpha Particle)"],
    optsEn: ["A. Proton", "B. Electron (e⁻)", "C. Neutron", "D. Alpha particle"],
    ans: 1,
    expZh: "正确！汤姆孙发现的电子质量仅为氢原子的约 1/1836，证明原子内部含有更小的带电结构，并提出了正电球体镶嵌电子的葡萄干布丁模型。",
    expEn: "Correct! Thomson discovered the negatively charged electron and proposed the Plum Pudding Model."
  },
  {
    qZh: "02 · 在卢瑟福金箔散射实验中，用来轰击金箔的「α 粒子」究竟是什么微粒？",
    qEn: "02 · In Rutherford's Gold Foil experiment, what exactly are the 'Alpha Particles' used to bombard the gold foil?",
    opts: [
      "A. 带负电的高速电子流 (Negatively charged electrons)",
      "B. 带 +2e 正电的氦原子核 (⁴₂He²⁺, 由2个质子和2个中子组成)",
      "C. 不带电的中子束 (Uncharged neutrons)",
      "D. X 射线光子 (X-ray photons)"
    ],
    optsEn: ["A. Fast electrons", "B. Helium nuclei (He²⁺)", "C. Neutrons", "D. X-ray photons"],
    ans: 1,
    expZh: "正确！轰击金箔的绝不是电子，而是带 +2e 正电、质量极大的 α 粒子（氦核 He²⁺）。绝大多数穿透说明原子内部极空旷，极少数被同种正电斥力弹回说明存在极小致密的原子核。",
    expEn: "Correct! Alpha particles are positively charged Helium-4 nuclei (He²⁺), NOT electrons."
  },
  {
    qZh: "03 · 关于现代量子力学的「电子云（Electron Cloud）」与「原子轨道（Orbital）」，下列理解正确的是？",
    qEn: "03 · Which statement accurately describes the modern Quantum Electron Cloud & Atomic Orbitals?",
    opts: [
      "A. 氢原子核外同时有上万个电子聚集成云雾",
      "B. 电子云的疏密代表电子在核外空间各处出现「概率密度 (|ψ|²)」的大小",
      "C. s 轨道和 p 轨道都是二维平面圆环",
      "D. 电子在节面 (Node) 上出现的概率最大"
    ],
    optsEn: [
      "A. A hydrogen atom contains thousands of electrons",
      "B. Cloud density maps electron probability density |ψ|²",
      "C. s and p orbitals are flat rings",
      "D. Electron probability is greatest at a node"
    ],
    ans: 1,
    expZh: "正确！氢原子核外只有 1 个电子，电子云是多次快门采样叠加而成的概率密度图；s 轨道呈球形，p 轨道呈三维哑铃形，节面上电子出现概率严格为 0。",
    expEn: "Correct! The cloud maps probability density |ψ|² over time; s-orbitals are spherical, p-orbitals are 3D dumbbells, and nodes have zero probability."
  }
];

function renderQuiz() {
  const box = document.getElementById("quizContainer");
  box.innerHTML = QUIZ_LIST.map((q, qi) => `
    <div class="quiz-item">
      <div class="quiz-q-title zh-text">${q.qZh}</div>
      <div class="quiz-q-title en-text">${q.qEn}</div>
      <div class="quiz-grid">
        ${q.opts.map((o, oi) => `
          <button class="quiz-choice" id="qz_${qi}_${oi}" onclick="checkQuiz(${qi}, ${oi})">${state.lang === 'en' ? q.optsEn[oi] : o}</button>
        `).join("")}
      </div>
      <div class="quiz-exp-box" id="qz_exp_${qi}">
        <div class="zh-text">${q.expZh}</div>
        <div class="en-text" style="margin-top:4px; opacity:0.85;">${q.expEn}</div>
      </div>
    </div>
  `).join("");
}

function checkQuiz(qi, oi) {
  const q = QUIZ_LIST[qi];
  q.opts.forEach((_, idx) => {
    const btn = document.getElementById(`qz_${qi}_${idx}`);
    btn.classList.remove("correct", "wrong");
    if (idx === q.ans) btn.classList.add("correct");
    else if (idx === oi) btn.classList.add("wrong");
  });
  document.getElementById(`qz_exp_${qi}`).style.display = "block";
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

window.addEventListener("DOMContentLoaded", initApp);
