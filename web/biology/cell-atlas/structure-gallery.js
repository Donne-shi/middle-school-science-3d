// Local-only teaching illustrations; the source atlas is imported separately.
(function () {
  'use strict';

  const examples = [
    {
      id: 'ecoli', image: 'assets/structure-ecoli.png',
      zh: '大肠杆菌', en: 'Escherichia coli',
      introZh: '原核细胞示意图：拟核没有核膜，外层呈革兰氏阴性菌的包膜结构。',
      introEn: 'A prokaryotic cell: the nucleoid has no nuclear membrane, and the envelope has the layers typical of Gram-negative bacteria.',
      source: 'https://openstax.org/books/microbiology/pages/3-3-unique-characteristics-of-prokaryotic-cells',
      parts: [
        ['细胞包膜', 'Cell envelope', '外膜、薄肽聚糖层与内膜共同围住细胞。', 'The outer membrane, thin peptidoglycan layer, and inner membrane surround the cell.', 57, 67],
        ['拟核', 'Nucleoid', '细菌 DNA 集中的区域，没有核膜。', 'The DNA-rich region has no nuclear envelope.', 37, 45],
        ['70S 核糖体', '70S ribosomes', '散布在胞质中，负责合成蛋白质。', 'Distributed through the cytoplasm, they synthesize proteins.', 26, 33],
        ['周生鞭毛', 'Peritrichous flagella', '较长的运动丝从细胞表面不同位置伸出。', 'Long motility filaments emerge at multiple positions around the cell.', 76, 49]
      ]
    },
    {
      id: 'mesophyll', image: 'assets/structure-mesophyll.png',
      zh: '叶肉细胞', en: 'Leaf mesophyll cell',
      introZh: '植物细胞示意图：大液泡占据中央，叶绿体位于周边薄层胞质中。',
      introEn: 'A plant cell: a large central vacuole occupies most of the volume, while chloroplasts sit in a thin peripheral cytoplasmic layer.',
      source: 'https://openstax.org/books/concepts-biology/pages/3-3-eukaryotic-cells',
      parts: [
        ['细胞壁', 'Cell wall', '纤维素为主的细胞壁支撑细胞形状，内侧还有细胞膜。', 'A cellulose-rich wall supports the cell; the plasma membrane lies just inside it.', 5, 49],
        ['叶绿体', 'Chloroplast', '含有类囊体膜，是光合作用的重要场所。', 'It contains thylakoid membranes and is a major site of photosynthesis.', 27, 21],
        ['中央液泡', 'Central vacuole', '液泡膜包围的含水空间，参与储存与维持膨压。', 'A water-rich compartment enclosed by the tonoplast; it helps storage and turgor.', 49, 46],
        ['细胞核', 'Nucleus', '具有核膜，图中被大液泡挤向周边。', 'Enclosed by a nuclear envelope and displaced toward the periphery by the vacuole.', 78, 28]
      ]
    },
    {
      id: 'neuron', image: 'assets/structure-neuron.png',
      zh: '神经元', en: 'Neuron',
      introZh: '多极神经元示意图：胞体内含细胞核与细胞器，树突和轴突承担不同的信号传递角色。',
      introEn: 'A schematic multipolar neuron: the soma holds the nucleus and organelles, while dendrites and an axon have different signaling roles.',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK28209/',
      parts: [
        ['树突', 'Dendrites', '胞体周围的分支，主要接收来自其他细胞的信号。', 'Branched processes around the soma that primarily receive signals.', 12, 29],
        ['细胞核', 'Nucleus', '位于胞体内，含有细胞的遗传物质。', 'Located in the soma and contains the cell’s genetic material.', 32, 44],
        ['尼氏体（粗面内质网）', 'Nissl substance (rough ER)', '胞体中较丰富，参与蛋白质合成。', 'Abundant in the soma and involved in protein synthesis.', 25, 36],
        ['轴突', 'Axon', '从轴丘伸出，向远处传导信号。', 'Extends from the axon hillock and carries signals over distance.', 70, 64]
      ]
    },
    {
      id: 't4', image: 'assets/structure-t4.png',
      zh: 'T4 噬菌体', en: 'Bacteriophage T4',
      introZh: '病毒颗粒结构图。噬菌体不是细胞，图中不应出现细胞质、细胞核或细胞器。',
      introEn: 'A virus particle, not a cell. It has no cytoplasm, nucleus, or cellular organelles.',
      source: 'https://www.rcsb.org/structure/1S2E',
      parts: [
        ['蛋白质衣壳', 'Protein capsid', '头部的蛋白质外壳保护病毒基因组。', 'The protein shell in the head protects the viral genome.', 44, 17],
        ['双链 DNA', 'Double-stranded DNA', '遗传物质被包装在头部衣壳内。', 'The genome is packaged inside the head capsid.', 51, 24],
        ['尾鞘', 'Tail sheath', '可收缩的蛋白质结构，参与将基因组送入宿主。', 'A contractile protein structure involved in delivering the genome to the host.', 50, 55],
        ['基板', 'Baseplate', '尾部末端的复合结构，与尾纤维连接。', 'A complex at the tail end where tail fibers attach.', 50, 76],
        ['长尾纤维', 'Long tail fibers', '帮助噬菌体识别并附着于宿主细菌。', 'Help the phage recognize and attach to a bacterial host.', 22, 80]
      ]
    }
  ];
  for (const item of (window.CELL_ATLAS_MORE_STRUCTURES || [])) {
    item.image = `assets/structure-${item.id}.png`;
    examples.push(item);
  }
  const order = ['ecoli', 'staph', 'nostoc', 'mycoplasma', 'methano', 'halo',
    'amoeba', 'paramecium', 'chlamy', 'diatom', 'yeast', 'penicillium',
    'mesophyll', 'onion', 'roothair', 'rbc', 'neuron', 'myocyte', 'sperm',
    'adipocyte', 'neutrophil', 'oocyte', 't4', 'tmv', 'adeno', 'sarscov2'];
  examples.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  const viewer = document.getElementById('structureViewer');
  const trigger = document.getElementById('structureBtn');
  if (!viewer || !trigger) return;
  const tabs = document.getElementById('structureTabs');
  const image = document.getElementById('structureImage');
  const imageWrap = document.getElementById('structureImageWrap');
  const markers = document.getElementById('structureMarkers');
  const list = document.getElementById('structureList');
  const detail = document.getElementById('structureDetail');
  const close = document.getElementById('structureClose');
  const switcher = document.getElementById('structureLang');
  const previous = document.getElementById('structurePrev');
  const next = document.getElementById('structureNext');
  const counter = document.getElementById('structureCount');
  const sourceLink = document.getElementById('structureSource');
  let current = examples[0];
  let selected = 0;
  let previousFocus = null;
  let lang = new URLSearchParams(location.search).get('lang');
  if (lang !== 'en' && lang !== 'zh') {
    try { lang = localStorage.getItem('newton-garage-lang'); } catch (_) { lang = 'zh'; }
  }
  lang = lang === 'en' ? 'en' : 'zh';
  trigger.textContent = lang === 'en' ? 'Structure' : '结构图';

  function setText(id, zh, en) {
    document.getElementById(id).textContent = lang === 'en' ? en : zh;
  }

  function button(label, className, action) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = className;
    el.textContent = label;
    el.addEventListener('click', action);
    return el;
  }

  function positionMarkers() {
    if (!image.naturalWidth || viewer.hidden) return;
    const box = imageWrap.getBoundingClientRect();
    const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    const left = (box.width - width) / 2;
    const top = (box.height - height) / 2;
    markers.querySelectorAll('button').forEach((marker) => {
      marker.style.left = `${left + Number(marker.dataset.x) * width / 100}px`;
      marker.style.top = `${top + Number(marker.dataset.y) * height / 100}px`;
    });
  }

  function selectPart(index) {
    selected = index;
    const part = current.parts[index];
    markers.querySelectorAll('button').forEach((el, i) => el.setAttribute('aria-pressed', String(i === index)));
    list.querySelectorAll('button').forEach((el, i) => el.setAttribute('aria-pressed', String(i === index)));
    detail.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = `${part[0]} · ${part[1]}`;
    const description = document.createElement('p');
    description.textContent = lang === 'en' ? part[3] : part[2];
    detail.append(title, description);
  }

  function render() {
    setText('structureTitle', '内部结构图', 'Structure illustrations');
    setText('structureCaption', 'AI 绘制的教学示意图 · 颜色、数量与比例不代表真实标本', 'AI-generated teaching illustration · Colors, counts, and scale are schematic');
    setText('structureListTitle', '点击数字或结构名称', 'Select a number or structure');
    setText('structureSourceLabel', '结构参考：', 'Structure reference: ');
    switcher.textContent = lang === 'en' ? '中文' : 'EN';
    trigger.textContent = lang === 'en' ? 'Structure' : '结构图';
    switcher.setAttribute('aria-label', lang === 'en' ? 'Switch description language' : '切换说明语言');
    close.setAttribute('aria-label', lang === 'en' ? 'Close structure gallery' : '关闭结构图');
    previous.setAttribute('aria-label', lang === 'en' ? 'Previous specimen' : '上一个标本');
    next.setAttribute('aria-label', lang === 'en' ? 'Next specimen' : '下一个标本');
    counter.textContent = `${String(examples.indexOf(current) + 1).padStart(2, '0')} / ${examples.length}`;
    tabs.setAttribute('aria-label', lang === 'en' ? 'Specimen illustrations' : '标本示意图');
    tabs.replaceChildren();
    let activeTab;
    for (const item of examples) {
      const el = button(`${String(examples.indexOf(item) + 1).padStart(2, '0')} ${lang === 'en' ? item.en : item.zh}`, '', () => { current = item; selected = 0; render(); });
      el.setAttribute('role', 'tab');
      el.setAttribute('aria-selected', String(item === current));
      if (item === current) activeTab = el;
      tabs.append(el);
    }
    if (viewer.hidden === false && activeTab) activeTab.scrollIntoView({ block: 'nearest', inline: 'center' });
    document.getElementById('structureName').textContent = lang === 'en' ? current.en : current.zh;
    document.getElementById('structureLatin').textContent = lang === 'en' ? current.zh : current.en;
    document.getElementById('structureIntro').textContent = lang === 'en' ? current.introEn : current.introZh;
    sourceLink.href = current.source;
    sourceLink.textContent = lang === 'en' ? 'Open reference ↗' : '查看参考资料 ↗';
    image.src = current.image;
    image.alt = (lang === 'en' ? current.en : current.zh) + (lang === 'en' ? ' schematic cutaway illustration' : '内部结构示意图');
    markers.replaceChildren();
    list.replaceChildren();
    current.parts.forEach((part, index) => {
      const marker = button(String(index + 1), 'structure-marker', () => selectPart(index));
      marker.dataset.x = String(part[4]);
      marker.dataset.y = String(part[5]);
      marker.setAttribute('aria-label', `${part[0]} / ${part[1]}`);
      markers.append(marker);
      const row = button('', '', () => selectPart(index));
      const number = document.createElement('span');
      number.className = 'num';
      number.textContent = String(index + 1).padStart(2, '0');
      const labels = document.createElement('span');
      const zh = document.createElement('b');
      zh.textContent = lang === 'en' ? part[1] : part[0];
      const en = document.createElement('small');
      en.textContent = lang === 'en' ? part[0] : part[1];
      labels.append(zh, en);
      row.append(number, labels);
      list.append(row);
    });
    selectPart(selected);
    positionMarkers();
  }

  function open() {
    previousFocus = document.activeElement;
    const active = document.querySelector('.rail-item.is-on');
    const matching = active && examples.find((item) => item.id === active.dataset.id);
    if (matching) current = matching;
    selected = 0;
    viewer.hidden = false;
    render();
    close.focus();
  }

  function dismiss() {
    viewer.hidden = true;
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  trigger.addEventListener('click', open);
  close.addEventListener('click', dismiss);
  switcher.addEventListener('click', () => { lang = lang === 'en' ? 'zh' : 'en'; render(); });
  function step(delta) {
    current = examples[(examples.indexOf(current) + delta + examples.length) % examples.length];
    selected = 0;
    render();
  }
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  image.addEventListener('load', positionMarkers);
  window.addEventListener('resize', positionMarkers);
  viewer.addEventListener('click', (event) => { if (event.target === viewer) dismiss(); });
  window.addEventListener('keydown', (event) => {
    if (viewer.hidden) return;
    if (event.key === 'Escape') { event.stopImmediatePropagation(); event.preventDefault(); dismiss(); }
    if (event.key === 'Tab') {
      const focusable = [...viewer.querySelectorAll('button,a[href]')];
      const index = focusable.indexOf(document.activeElement);
      if (event.shiftKey && index === 0) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); focusable[0].focus(); }
    }
  }, true);
}());
