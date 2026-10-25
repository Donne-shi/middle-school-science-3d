/* ==========================================================================
   细菌 · 形态与结构  /  Bacteria Atlas
   assets/data.js  —  全部文本内容（中英对照）· 与几何/交互解耦
   ========================================================================== */

var ATLAS = {

  /* ---------------------------------------------------------------- 概览 */

  overview: {
    kicker: '序章 · Prologue',
    cn: '没有细胞核的细胞',
    en: 'The cell without a nucleus',
    lead_zh:
      '细菌是原核生物——遗传物质不被核膜包裹，也没有线粒体、内质网这类膜性细胞器。' +
      '它们的 DNA 通常是一条环状染色体，盘绕在细胞质中央的「拟核」区域，旁边还常带着几个小环状质粒。',
    lead_zh2:
      '因此细菌的全部生命活动都发生在同一个细胞里：呼吸链在细胞膜上，蛋白质在细胞质里合成，' +
      'DNA 复制、转录与翻译可以同时进行。分裂靠二分裂，一代的时间从二十分钟到十几个小时不等。',
    lead_en:
      'Bacteria are prokaryotes: their genetic material is not enclosed by a nuclear membrane, and they lack the ' +
      'membrane-bound organelles — mitochondria, endoplasmic reticulum — of eukaryotic cells. Their DNA is usually a ' +
      'single circular chromosome, coiled in a central region called the nucleoid and often accompanied by a few ' +
      'small circular plasmids.',
    lead_en2:
      'Everything therefore happens inside one compartment: the respiratory chain sits in the plasma membrane, ' +
      'proteins are made in the cytoplasm, and replication, transcription and translation can run at the same time. ' +
      'Division is by binary fission, with generation times from twenty minutes to a dozen hours.'
  },

  /* ---------------------------------------------------------------- 数据条 */

  facts: [
    { n: '38', u: ' 万亿', n_en: '38 trillion',
      zh: '一个 70 kg 成年人携带的细菌细胞数', en: 'Bacterial cells carried by a 70 kg adult',
      src: 'Sender, Fuchs & Milo, 2016' },
    { n: '0.2–750', u: ' µm', n_en: '0.2–750 µm',
      zh: '细菌的尺寸跨度：支原体 → 纳米比亚硫珠菌', en: 'Range of bacterial size: Mycoplasma → Thiomargarita',
      src: '' },
    { n: '4.6', u: ' Mb', n_en: '4.6 Mb',
      zh: '大肠杆菌基因组：一条环状 DNA，约 4400 个基因', en: "E. coli genome: one circular DNA, ~4,400 genes",
      src: '' },
    { n: '20', u: ' 分钟', n_en: '20 min',
      zh: '大肠杆菌在理想条件下的一代时间', en: 'Doubling time of E. coli under ideal conditions',
      src: '' }
  ],

  /* ---------------------------------------------------------- 三个分类维度 */

  dims: [
    { n: 'Dimension 01', cn: '形状', en: 'Shape',
      zh: '球菌、杆菌、弧菌、螺旋菌、丝状菌、无壁菌——左侧目录的六组。形状由细胞壁的合成分裂方向决定，是最直观的第一层分类。',
      en_t: 'Cocci, bacilli, vibrios, spirilla, filamentous and wall-less forms — the six groups in the index. Shape follows from how the wall is laid down and where the cell divides; it is the most immediate first cut.' },
    { n: 'Dimension 02', cn: '革兰氏反应', en: 'Gram reaction',
      zh: '1884 年 Hans Christian Gram 的染色法把细菌分成两大类：厚肽聚糖保留结晶紫（紫色，阳性），薄层加外膜则被酒精脱色后复染成红色（阴性）。',
      en_t: "Hans Christian Gram's 1884 stain splits bacteria in two: a thick peptidoglycan layer keeps the crystal violet (purple, positive), while a thin layer with an outer membrane is decolourised by alcohol and counterstained red (negative)." },
    { n: 'Dimension 03', cn: '形态与分类', en: 'Morphology & taxonomy',
      zh: '细菌域已描述 30 多个门、数千个种。同一个门里既有球状也有杆状，而同一种形状又出现在许多互不相干的门里。所以「杆菌」只是一句形状描述，不构成一个分类单元——本页按形态分组，是为看清差异，不是生物学上的归类。',
      en_t: 'More than thirty phyla and several thousand species have been described. A single phylum may hold both spheres and rods, and the same shape turns up in many unrelated phyla. "Bacillus" is therefore a description, not a taxon — the grouping here is for seeing differences clearly, not a biological classification.' }
  ],

  /* -------------------------------------------------------------- 结构注释 */

  anno: [
    { n: '01', cn: '荚膜', en: 'Capsule',
      zh: '多糖或蛋白黏层，帮助附着、抵抗干燥与宿主吞噬细胞。',
      en_t: 'A layer of polysaccharide or protein: aids attachment, resists drying, and helps evade phagocytes.' },
    { n: '02', cn: '细胞壁', en: 'Cell wall',
      zh: '肽聚糖交联成网，决定形状，也是革兰氏染色的分水岭。',
      en_t: 'Peptidoglycan cross-linked into a net; it sets the shape and decides the Gram stain.' },
    { n: '03', cn: '细胞膜', en: 'Plasma membrane',
      zh: '磷脂双层，选择透过；呼吸链与 ATP 合成都在这里进行。',
      en_t: 'A phospholipid bilayer, selectively permeable; the respiratory chain and ATP synthesis happen here.' },
    { n: '04', cn: '拟核', en: 'Nucleoid',
      zh: '一条环状染色体，展开后约 1000 倍于细胞长度，高度盘绕。',
      en_t: "One circular chromosome, about 1000 times the cell's length when unwound, tightly coiled." },
    { n: '05', cn: '质粒', en: 'Plasmid',
      zh: '独立复制的小环 DNA，常携带抗药基因，可通过接合转移。',
      en_t: 'A small circular DNA that replicates on its own, often carrying resistance genes and transferable by conjugation.' },
    { n: '06', cn: '核糖体', en: 'Ribosome',
      zh: '70S（50S + 30S），与真核的 80S 不同——这是许多抗生素的靶点。',
      en_t: '70S (50S + 30S), unlike the eukaryotic 80S — the target of many antibiotics.' },
    { n: '07', cn: '鞭毛', en: 'Flagellum',
      zh: '由基体、钩与鞭毛丝组成的螺旋马达，转速可达每分钟一千转。',
      en_t: 'A rotary motor of basal body, hook and filament, spinning at up to about 1000 rpm.' },
    { n: '08', cn: '菌毛', en: 'Pilus',
      zh: '数十到上千根细丝，负责附着与接合，也是噬菌体的入口。',
      en_t: 'Dozens to a thousand fine threads for attachment and conjugation; also the entry point for phage.' }
  ],

  /* ------------------------------------------------------------ 六个类群 */

  groups: [
    {
      id: 'cocci', num: '01', cn: '球菌', en: 'Cocci', scene: 'coccus',
      tag: '球形 · Spherical',
      chips: ['直径 0.5–2 µm', '不变形', '革兰阳性为主'],
      lead_zh: '球菌是近似球形或椭球形的细菌。单个细胞看不出门道，但分裂后子细胞是否分离、沿几个平面分离，会留下整齐的排列图案——这正是葡萄球菌、链球菌、四联球菌、八叠球菌这些名字的来源。',
      lead_zh2: '一个平面上连续分裂不分离，得到链状；两个垂直平面，得到四联；三个平面，得到八叠；三个以上平面随机分裂，得到葡萄串状。',
      lead_en: 'Cocci are roughly spherical or ellipsoidal. A single cell shows little, but whether the daughters separate after division — and along how many planes — leaves a regular arrangement. That is where the names Staphylococcus, Streptococcus, tetrad and sarcina come from.',
      lead_en2: 'Division in one plane without separation gives chains; two perpendicular planes give tetrads; three give sarcinae; division in three or more random planes gives clusters.',
      keys: ['staph', 'pneumo', 'gonorr']
    },
    {
      id: 'bacilli', num: '02', cn: '杆菌', en: 'Bacilli', scene: 'bacillus',
      tag: '杆状 · Rod-shaped',
      chips: ['长 1–10 µm', '两端可圆可方', '最常见的形态'],
      lead_zh: '杆状是细菌中最常见的形态。细胞沿长轴生长、在中部横裂，因此容易看到成对或成链的排列。杆菌的两端可以是圆的、方的、甚至尖的——结核分枝杆菌的钝端、梭菌的尖端起名于此。',
      lead_zh2: '部分杆菌在营养耗尽时把 DNA 包裹进多层厚壁，形成内生芽孢。芽孢几乎不代谢，能耐受沸水、辐射与数十年干燥——这是灭菌必须用高压蒸汽的原因。',
      lead_en: 'The rod is the commonest bacterial shape. The cell grows along its long axis and divides across the middle, so pairs and chains are easy to see. The ends may be round, square or even pointed — the blunt ends of M. tuberculosis and the pointed ends of clostridia are named for this.',
      lead_en2: 'Some rods wrap their DNA in a multi-layered coat when nutrients run out, forming an endospore. An endospore hardly metabolises and survives boiling water, radiation and decades of drying — which is why sterilisation needs autoclaving.',
      keys: ['ecoli', 'subtilis', 'tb']
    },
    {
      id: 'vibrio', num: '03', cn: '弧菌', en: 'Vibrio', scene: 'vibrio',
      tag: '逗号形 · Comma-shaped',
      chips: ['长 1.5–3 µm', '单极鞭毛', '革兰阴性'],
      lead_zh: '弧菌是短杆弯成逗号或新月形的细菌，一端长着一根（有时是一束）极生鞭毛。它们绝大多数生活在海水与河口，需要盐分才能生长，因此很少出现在淡水和陆地上。',
      lead_zh2: '霍乱弧菌是这个属的模式种。它的鞭毛让它在水中以每秒数十倍体长的速度穿行，穿过胃酸后定植于小肠，分泌的霍乱毒素使肠上皮持续泵出氯离子与水。',
      lead_en: 'Vibrios are short rods bent into a comma or crescent, with a single polar flagellum (sometimes a tuft) at one end. Nearly all live in seawater and estuaries and need salt to grow, so they are rare in fresh water and on land.',
      lead_en2: 'V. cholerae is the type species. Its flagellum drives it through water at tens of body lengths per second; after surviving the stomach it colonises the small intestine, and the toxin it secretes makes the epithelium pump out chloride and water.',
      keys: ['vibrio']
    },
    {
      id: 'spiral', num: '04', cn: '螺旋菌', en: 'Spirilla & Spirochetes', scene: 'spirillum',
      tag: '螺旋状 · Helical',
      chips: ['长 1–15 µm', '轴向旋转推进', '革兰阴性'],
      lead_zh: '螺旋形细菌分两类，机制完全不同。螺旋菌（spirilla）细胞壁刚硬，螺旋形状固定，鞭毛长在细胞外面；螺旋体（spirochetes）细胞柔韧，鞭毛藏在细胞壁与细胞膜之间的周质空间里，称为轴丝，整根细胞像开瓶器一样旋转前进。',
      lead_zh2: '螺旋形态在黏稠环境里是优势：胃黏液、结缔组织、生殖道黏膜——这些地方正是幽门螺杆菌与苍白密螺旋体的栖息地。',
      lead_en: 'Helical bacteria fall into two kinds with entirely different mechanisms. Spirilla have a rigid wall and a fixed helix, with flagella outside the cell; spirochetes are flexible, their flagella hidden in the periplasmic space as axial filaments, so the whole cell turns like a corkscrew.',
      lead_en2: 'The helical form pays off in viscous places — gastric mucus, connective tissue, genital mucosa — which is exactly where H. pylori and T. pallidum live.',
      keys: ['hpyori', 'treponema']
    },
    {
      id: 'filament', num: '05', cn: '丝状菌', en: 'Filamentous & Mycelial', scene: 'filament',
      tag: '丝状与分枝 · Filamentous',
      chips: ['可达数百 µm', '多核体', '土壤与水体'],
      lead_zh: '有些细菌不再保持单个细胞的边界：细胞伸长成丝，连续分裂却不分离，形成多核的长丝；或者向侧面出芽，长成分枝的菌丝网络——后者在放线菌里发展成类似真菌的菌丝体。',
      lead_zh2: '链霉菌因此长期被误认为真菌，直到发现它的细胞壁是肽聚糖、基因组是细菌式的。蓝细菌（如鱼腥藻）则把丝状体推向另一个方向：细胞串联成念珠，其中少数特化为异形胞，专职固氮。',
      lead_en: 'Some bacteria abandon the single-cell boundary: the cell elongates into a filament and divides repeatedly without separating, making a long multinucleate thread; or it buds sideways into a branching network, which in actinomycetes becomes a fungus-like mycelium.',
      lead_en2: 'Streptomyces was long taken for a fungus until its wall turned out to be peptidoglycan and its genome bacterial. Cyanobacteria such as Anabaena take filaments another way: cells strung like beads, a few of them specialised as heterocysts for fixing nitrogen.',
      keys: ['strepto', 'anabaena']
    },
    {
      id: 'wallless', num: '06', cn: '无壁菌', en: 'Wall-less & Pleomorphic', scene: 'pleomorphic',
      tag: '无壁与多形 · Wall-less',
      chips: ['0.2–0.3 µm', '无肽聚糖', '渗透敏感'],
      lead_zh: '支原体是已知最小的能自我复制的生命。它的基因组只有 58 万到 140 万个碱基对——不到大肠杆菌的三分之一；它完全没有细胞壁，只有一层细胞膜，因此形状不定、对渗透压极其敏感。',
      lead_zh2: '没有细胞壁意味着 β-内酰胺类抗生素（青霉素一类）对它完全无效，因为它们的作用靶点正是肽聚糖的合成。这也是支原体肺炎要用大环内酯类或四环素类治疗的原因。',
      lead_en: 'Mycoplasma is the smallest self-replicating organism known. Its genome holds only 0.58–1.4 million base pairs — under a third of the E. coli genome — and it has no cell wall at all, only a membrane, so its shape is indefinite and it is extremely sensitive to osmotic pressure.',
      lead_en2: 'Without a wall, β-lactams (the penicillins) have no target at all, since they act on peptidoglycan synthesis. That is why mycoplasmal pneumonia is treated with macrolides or tetracyclines.',
      keys: ['mycoplasma']
    }
  ],

  /* -------------------------------------------------------------- 十二标本 */

  specs: {
    staph: {
      num: '01', group: '球菌 · Cocci', scene: 'coccus',
      cn: '金黄色葡萄球菌', lat: 'Staphylococcus aureus',
      chips: ['⌀ 0.5–1.0 µm', '革兰阳性 Gram-positive', '葡萄串状 Clusters'],
      zh: '革兰阳性球菌，沿三个互相垂直的平面不规则分裂，堆成葡萄串。约三成人的鼻腔里长期住着它。耐甲氧西林菌株（MRSA）是医院获得性感染中最棘手的病原之一。',
      en: 'A Gram-positive coccus that divides along three perpendicular planes without separating, piling up into grape-like clusters. It lives permanently in the nostrils of about one person in three. Methicillin-resistant strains (MRSA) are among the most stubborn hospital-acquired pathogens.'
    },
    pneumo: {
      num: '02', group: '球菌 · Cocci', scene: 'coccus',
      cn: '肺炎链球菌', lat: 'Streptococcus pneumoniae',
      chips: ['⌀ 0.5–1.25 µm', '革兰阳性 Gram-positive', '成对 Diplococci'],
      zh: '两个细胞以钝端相对，各自呈柳叶刀形，外面包着厚荚膜——荚膜是它最主要的毒力因子。全球每年约有 100 万名五岁以下儿童死于它引起的肺炎。',
      en: 'Two cells meet at their blunt ends, each shaped like a lancet and wrapped in a thick capsule — the capsule being its principal virulence factor. Pneumonia caused by this organism kills roughly one million children under five each year worldwide.'
    },
    gonorr: {
      num: '03', group: '球菌 · Cocci', scene: 'coccus',
      cn: '淋病奈瑟菌', lat: 'Neisseria gonorrhoeae',
      chips: ['⌀ 0.6–1.0 µm', '革兰阴性 Gram-negative', '肾形双球菌 Kidney-shaped'],
      zh: '革兰阴性双球菌，相邻的一面内凹，呈肾形或咖啡豆形。IV 型菌毛让它能抓住泌尿生殖道上皮、抵抗尿液冲洗。人类是它唯一的自然宿主。',
      en: 'A Gram-negative diplococcus whose adjacent faces are flattened, giving each cell a kidney or coffee-bean outline. Type IV pili let it grip the urogenital epithelium and withstand the flushing action of urine. Humans are its only natural host.'
    },
    ecoli: {
      num: '04', group: '杆菌 · Bacilli', scene: 'bacillus',
      cn: '大肠杆菌', lat: 'Escherichia coli',
      chips: ['2.0 × 0.5 µm', '革兰阴性 Gram-negative', '周生鞭毛 Peritrichous'],
      zh: '革兰阴性杆菌，周生鞭毛。肠道里最常见的兼性厌氧菌，也是分子生物学的头号模式生物；少数血清型（如 O157:H7）会产志贺毒素，引起出血性腹泻。',
      en: 'A Gram-negative rod with peritrichous flagella. The commonest facultative anaerobe of the gut and the premier model organism of molecular biology; a few serotypes (O157:H7 among them) produce Shiga toxin and cause bloody diarrhoea.'
    },
    subtilis: {
      num: '05', group: '杆菌 · Bacilli', scene: 'bacillus',
      cn: '枯草芽孢杆菌', lat: 'Bacillus subtilis',
      chips: ['0.7 × 2–3 µm', '革兰阳性 Gram-positive', '成链 Chains'],
      zh: '革兰阳性杆菌，常首尾相连成链。缺氮时把 DNA 裹进多层厚壁，形成内生芽孢，可耐 100 °C 与数十年干燥。研究细胞分化与生物膜的模式菌。',
      en: 'A Gram-positive rod that often stays end-to-end in chains. When nitrogen runs short it wraps its DNA in a multi-layered coat to form an endospore, surviving 100 °C and decades of desiccation. A model organism for cell differentiation and biofilms.'
    },
    tb: {
      num: '06', group: '杆菌 · Bacilli', scene: 'bacillus',
      cn: '结核分枝杆菌', lat: 'Mycobacterium tuberculosis',
      chips: ['0.3 × 2–4 µm', '抗酸染色 Acid-fast', '钝端 Blunt ends'],
      zh: '细胞壁外覆一层分枝菌酸，蜡质、疏水、抗酸染色呈红色。这层屏障让营养物质难以进入，分裂一代需要 18–24 小时——是普通细菌的数十倍。',
      en: 'A layer of branched mycolic acids coats the wall: waxy, hydrophobic, and stained red by the acid-fast method. That barrier keeps nutrients out as well, so a generation takes 18–24 hours — dozens of times longer than in ordinary bacteria.'
    },
    vibrio: {
      num: '07', group: '弧菌 · Vibrio', scene: 'vibrio',
      cn: '霍乱弧菌', lat: 'Vibrio cholerae',
      chips: ['2.0 × 0.5 µm', '革兰阴性 Gram-negative', '单极鞭毛 Polar'],
      zh: '逗号形，一端一根极生鞭毛，推动它在水中高速穿行。穿过胃酸后定植小肠，分泌霍乱毒素，使肠上皮持续泵出氯离子与水，造成米泔水样腹泻。',
      en: 'Comma-shaped, with a single polar flagellum that drives it through water at speed. After surviving the stomach it colonises the small intestine and secretes cholera toxin, which makes the epithelium pump out chloride and water — the rice-water stool of cholera.'
    },
    hpyori: {
      num: '08', group: '螺旋菌 · Spirilla & Spirochetes', scene: 'spirillum',
      cn: '幽门螺杆菌', lat: 'Helicobacter pylori',
      chips: ['3.0 × 0.5 µm', '革兰阴性 Gram-negative', '4–7 根带鞘鞭毛'],
      zh: '螺旋形，一端长着 4–7 根带鞘的鞭毛。分泌尿素酶把尿素分解成氨，中和周围的胃酸，从而在胃黏液层下安家。与胃炎、胃溃疡和胃癌密切相关。',
      en: 'Helical, with 4–7 sheathed flagella at one pole. It secretes urease, which splits urea into ammonia and neutralises the surrounding acid, letting it settle beneath the gastric mucus layer. Closely tied to gastritis, peptic ulcer and gastric cancer.'
    },
    treponema: {
      num: '09', group: '螺旋菌 · Spirilla & Spirochetes', scene: 'spirillum',
      cn: '苍白密螺旋体', lat: 'Treponema pallidum',
      chips: ['6–15 × 0.1–0.2 µm', '革兰阴性 Gram-negative', '轴丝内藏 Axial filaments'],
      zh: '细密螺旋，长 6–15 µm，直径只有 0.1–0.2 µm——普通光镜下几乎看不见，只能靠银染或暗视野。鞭毛藏在周质空间里，整根细胞像开瓶器一样旋转前进。',
      en: 'A fine, tightly coiled spiral 6–15 µm long but only 0.1–0.2 µm across — almost invisible under an ordinary light microscope, and shown only by silver stain or dark-field. Its flagella lie in the periplasmic space, and the whole cell advances like a corkscrew.'
    },
    strepto: {
      num: '10', group: '丝状菌 · Filamentous & Mycelial', scene: 'filament',
      cn: '链霉菌', lat: 'Streptomyces sp.',
      chips: ['菌丝 ⌀ 0.5–1 µm', '革兰阳性 Gram-positive', '分枝菌丝体 Mycelium'],
      zh: '分枝菌丝体，形态接近真菌，却是地道的革兰阳性细菌。土壤中分解有机物；人类约三分之二的抗生素——链霉素、四环素、红霉素——都来自这个属。',
      en: 'A branching mycelium that looks like a fungus yet is a genuine Gram-positive bacterium. It breaks down organic matter in soil; about two-thirds of the antibiotics in human use — streptomycin, tetracycline, erythromycin — come from this genus.'
    },
    anabaena: {
      num: '11', group: '丝状菌 · Filamentous & Mycelial', scene: 'filament',
      cn: '鱼腥藻', lat: 'Anabaena sp.',
      chips: ['细胞 ⌀ 3–6 µm', '蓝细菌 Cyanobacterium', '念珠状丝体 Trichome'],
      zh: '蓝细菌，球形细胞串成念珠状丝体。缺氮时每隔约十个细胞就分化出一个异形胞：壁加厚、光合系统关闭，把氧气挡在外面，专职把氮气固定成氨。',
      en: 'A cyanobacterium whose spherical cells form a bead-like filament. When nitrogen is scarce, roughly every tenth cell differentiates into a heterocyst: thickened wall, photosystem shut down, oxygen kept out, and nitrogen fixed into ammonia full time.'
    },
    mycoplasma: {
      num: '12', group: '无壁菌 · Wall-less', scene: 'pleomorphic',
      cn: '支原体', lat: 'Mycoplasma sp.',
      chips: ['⌀ 0.2–0.3 µm', '无细胞壁 No cell wall', '多形性 Pleomorphic'],
      zh: '已知最小的能自我复制的生命，基因组 0.58–1.4 Mb。完全没有细胞壁，形状不定、对渗透压敏感；因此 β-内酰胺类抗生素对它无效。琼脂上长成中心致密的「油煎蛋」状菌落。',
      en: 'The smallest self-replicating organism known, with a genome of 0.58–1.4 Mb. It has no cell wall at all, only a membrane, so its shape is indefinite and it is highly sensitive to osmotic stress; β-lactams are therefore useless against it. On agar it grows as a dense-centred "fried egg" colony.'
    }
  },

  /* -------------------------------------------------------------- 来源说明 */

  credits: {
    cn1: '本页十二幅显微图像全部取自 Wikimedia Commons，并逐张核验了原始描述页上的物种、技术手段、作者与许可协议。点击文件名可跳转到原始文件页。',
    en1: 'All twelve micrographs come from Wikimedia Commons. Each was checked against its original description page for species, technique, author and licence. Click a file name to open the source page.',
    cn2: '图像以长边 1600 px 重新导出，可直接用于教学、讲义与再创作。标注 CC BY 或 CC BY-SA 的图像，再使用时请保留作者署名；BY-SA 还要求衍生作品采用相同许可。',
    en2: 'Images were re-exported at 1600 px on the long edge and may be reused in teaching, handouts and derivative work. Those under CC BY or CC BY-SA require attribution; BY-SA additionally requires derivative works to carry the same licence.',
    self_cn: '三维模型与结构标注为本页自绘。所有 3D 模型由程序化几何实时生成，用于示意形态比例与结构位置，不代表真实测量尺度，也不是电镜重建；细胞器数量与排布经过简化。这部分内容可自由使用、修改与再分发，无需署名。',
    self_en: 'The 3D models and structural annotations are original to this page. All are generated procedurally in real time to suggest proportions and the position of structures; they are neither to scale nor reconstructions from electron micrographs, and organelle counts and arrangements are simplified. This part may be freely used, modified and redistributed without attribution.'
  }
};
