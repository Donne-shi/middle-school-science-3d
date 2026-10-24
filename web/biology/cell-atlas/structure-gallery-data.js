// Additional local-only teaching illustrations. Coordinates are percentages of each image.
(function () {
  'use strict';
  const p = (zh, en, zhDescription, enDescription, x, y) =>
    [zh, en, zhDescription, enDescription, x, y];

  window.CELL_ATLAS_MORE_STRUCTURES = [
    {
      id: 'staph', zh: '金黄色葡萄球菌', en: 'Staphylococcus aureus',
      introZh: '革兰氏阳性球菌，常成簇排列；剖面突出厚肽聚糖壁与无核膜的拟核。',
      introEn: 'Gram-positive cocci often form clusters; the cutaway highlights a thick peptidoglycan wall and a nucleoid without a nuclear envelope.',
      source: 'https://openstax.org/books/microbiology/pages/4-4-gram-positive-bacteria',
      parts: [
        p('厚肽聚糖壁', 'Thick peptidoglycan wall', '包围细胞膜，是革兰氏阳性菌的重要结构。', 'Surrounds the plasma membrane and is characteristic of Gram-positive bacteria.', 51, 23),
        p('细胞膜', 'Plasma membrane', '控制物质进出，位于细胞壁内侧。', 'Controls exchange with the surroundings and lies inside the wall.', 41, 64),
        p('拟核', 'Nucleoid', '细菌 DNA 集中的区域，没有核膜。', 'The DNA-rich region has no nuclear envelope.', 52, 49),
        p('核糖体', 'Ribosomes', '散布于胞质中，合成蛋白质。', 'Distributed in the cytoplasm and make proteins.', 59, 43)
      ]
    },
    {
      id: 'nostoc', zh: '念珠藻', en: 'Nostoc',
      introZh: '蓝细菌丝状体；光合膜位于细胞内，较大的异形胞参与固氮。',
      introEn: 'A filamentous cyanobacterium; photosynthetic membranes lie inside vegetative cells, while a larger heterocyst supports nitrogen fixation.',
      source: 'https://openstax.org/books/microbiology/pages/3-3-unique-characteristics-of-prokaryotic-cells',
      parts: [
        p('胶质鞘', 'Gelatinous sheath', '多糖基质包围整条细胞链。', 'A polysaccharide matrix surrounds the cell chain.', 17, 17),
        p('类囊体膜', 'Thylakoid membranes', '蓝细菌用胞内膜进行光合作用，没有叶绿体。', 'Internal membranes support photosynthesis; cyanobacteria have no chloroplasts.', 34, 52),
        p('拟核', 'Nucleoid', 'DNA 集中的区域，没有核膜。', 'A DNA-rich region without a nuclear envelope.', 42, 48),
        p('羧酶体', 'Carboxysome', '包裹固碳酶的蛋白微舱。', 'A protein microcompartment housing carbon-fixation enzymes.', 35, 36),
        p('异形胞', 'Heterocyst', '部分细胞分化为适于固氮的结构。', 'A specialized cell adapted for nitrogen fixation.', 74, 46)
      ]
    },
    {
      id: 'mycoplasma', zh: '生殖支原体', en: 'Mycoplasma genitalium',
      introZh: '无细胞壁的小型细菌；末端附着结构是短而特化的细胞极。',
      introEn: 'A small bacterium without a cell wall; its terminal attachment organelle is a short specialized pole.',
      source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5853509/',
      parts: [
        p('细胞膜', 'Plasma membrane', '直接包围胞质，外侧没有肽聚糖细胞壁。', 'Directly encloses the cytoplasm; there is no peptidoglycan wall.', 44, 18),
        p('拟核', 'Nucleoid', '细菌基因组集中于此，没有细胞核。', 'The bacterial genome occupies this region without a nucleus.', 42, 48),
        p('核糖体', 'Ribosomes', '散布于胞质中的蛋白质合成机器。', 'Protein-making particles scattered through the cytoplasm.', 30, 30),
        p('末端附着结构', 'Terminal organelle', '短小的细胞极，参与附着与滑行。', 'A short specialized cell tip involved in adhesion and gliding.', 78, 50)
      ]
    },
    {
      id: 'methano', zh: '甲烷古菌', en: 'Methanosarcina barkeri',
      introZh: '产甲烷古菌常形成细胞团；单细胞表面层与团块外基质需区分。',
      introEn: 'A methanogenic archaeon that can form aggregates; distinguish each cell’s surface layer from the surrounding matrix.',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK579933/',
      parts: [
        p('团块外基质', 'Aggregate matrix', '甲烷软骨素样多糖帮助细胞聚成团。', 'A methanochondroitin-like polysaccharide helps hold cells together.', 53, 23),
        p('S 层', 'S-layer', '包围单个细胞的蛋白表面层，不是肽聚糖。', 'A protein surface layer around each cell, not peptidoglycan.', 58, 30),
        p('细胞膜', 'Archaeal membrane', '古菌膜脂以醚键连接疏水链。', 'Archaeal membrane lipids use ether-linked hydrophobic chains.', 77, 50),
        p('拟核', 'Nucleoid', 'DNA 没有核膜包围。', 'DNA is not enclosed by a nuclear membrane.', 59, 51),
        p('核糖体', 'Ribosomes', '在胞质中合成蛋白质。', 'Synthesize proteins in the cytoplasm.', 70, 44)
      ]
    },
    {
      id: 'halo', zh: '嗜盐古菌', en: 'Halobacterium salinarum',
      introZh: '高盐环境中的古菌；部分菌株具有紫膜斑块和蛋白质气囊。',
      introEn: 'A salt-loving archaeon; some strains have purple-membrane patches and protein gas vesicles.',
      source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4187190/',
      parts: [
        p('S 层', 'S-layer', '古菌细胞外侧的蛋白质表面层。', 'A protein surface layer on the outside of the archaeal cell.', 42, 17),
        p('紫膜斑块', 'Purple-membrane patch', '富含菌视紫红质，利用光驱动质子转运。', 'Rich in bacteriorhodopsin, which uses light to pump protons.', 62, 27),
        p('气囊', 'Gas vesicles', '封闭的蛋白质结构，可影响浮力；并非液体气泡。', 'Closed protein structures that affect buoyancy, not liquid bubbles.', 33, 40),
        p('拟核', 'Nucleoid', 'DNA 集中但没有核膜。', 'DNA is concentrated here without a nuclear envelope.', 55, 49)
      ]
    },
    {
      id: 'yeast', zh: '酿酒酵母', en: 'Saccharomyces cerevisiae',
      introZh: '出芽中的单细胞真菌；与细菌不同，它具有细胞核和线粒体。',
      introEn: 'A budding unicellular fungus; unlike bacteria, it has a nucleus and mitochondria.',
      source: 'https://openstax.org/books/microbiology/pages/5-3-fungi',
      parts: [
        p('细胞壁', 'Fungal cell wall', '以葡聚糖等为主要成分，帮助维持外形。', 'Rich in glucans and helps maintain cell shape.', 29, 19),
        p('细胞核', 'Nucleus', '核膜包围遗传物质。', 'A nuclear envelope surrounds the genetic material.', 41, 40),
        p('液泡', 'Vacuole', '参与储存、降解与细胞内平衡。', 'Supports storage, degradation, and cell balance.', 52, 59),
        p('线粒体', 'Mitochondrion', '参与有氧能量代谢。', 'Supports aerobic energy metabolism.', 23, 43),
        p('芽体', 'Bud', '从母细胞长出的较小新细胞。', 'A smaller daughter cell growing from the mother cell.', 82, 41)
      ]
    },
    {
      id: 'penicillium', zh: '青霉', en: 'Penicillium',
      introZh: '有隔菌丝与扫帚状分生孢子梗；孢子在菌丝外形成。',
      introEn: 'Septate hyphae bear broom-like conidiophores; spores form outside the hypha.',
      source: 'https://openstax.org/books/microbiology/pages/5-3-fungi',
      parts: [
        p('分生孢子', 'Conidia', '位于瓶梗末端的无性孢子，常排成链。', 'Asexual spores formed in chains at the tips of phialides.', 63, 15),
        p('分生孢子梗', 'Conidiophore', '向上生长、顶部呈扫帚状分枝。', 'An upright stalk with a broom-like branched tip.', 58, 40),
        p('菌丝隔膜', 'Hyphal septum', '把菌丝分隔成相通的区室。', 'Partitions the hypha into connected compartments.', 53, 75),
        p('细胞核', 'Nuclei', '沿菌丝的不同区室分布。', 'Found in different compartments along the hypha.', 23, 75),
        p('真菌细胞壁', 'Fungal cell wall', '含几丁质和葡聚糖，与植物细胞壁不同。', 'Contains chitin and glucans, unlike a plant cell wall.', 53, 83)
      ]
    },
    {
      id: 'amoeba', zh: '变形虫', en: 'Amoeba proteus',
      introZh: '通过宽钝的伪足运动与摄食；细胞内可区分伸缩泡和食物泡。',
      introEn: 'Broad pseudopodia support movement and feeding; contractile and food vacuoles serve different roles.',
      source: 'https://openstax.org/books/biology/pages/41-3-excretion-systems',
      parts: [
        p('伪足', 'Pseudopodium', '细胞质向外伸出的宽钝临时突起。', 'A broad temporary extension of cytoplasm.', 15, 25),
        p('细胞核', 'Nucleus', '有核膜包围的遗传物质。', 'Genetic material enclosed by a nuclear envelope.', 41, 43),
        p('伸缩泡', 'Contractile vacuole', '收集并排出多余的水。', 'Collects and expels excess water.', 66, 48),
        p('食物泡', 'Food vacuole', '包住摄入的食物并参与消化。', 'Encloses ingested food for digestion.', 53, 35),
        p('细胞膜', 'Plasma membrane', '柔软外缘允许形状持续改变。', 'A flexible boundary permits continual changes in shape.', 94, 59)
      ]
    },
    {
      id: 'paramecium', zh: '草履虫', en: 'Paramecium caudatum',
      introZh: '全身纤毛、侧面的口沟和两类细胞核，是草履虫的重要识别特征。',
      introEn: 'Surface cilia, a side oral groove, and two kinds of nuclei distinguish this ciliate.',
      source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8208649/',
      parts: [
        p('纤毛', 'Cilia', '短而密集，协调摆动帮助游动。', 'Short, dense projections beat in coordination for swimming.', 82, 17),
        p('口沟', 'Oral groove', '侧面凹入处将食物引向胞口。', 'A side indentation that directs food toward the cell mouth.', 69, 56),
        p('大核', 'Macronucleus', '主要参与日常基因表达。', 'Mainly supports everyday gene expression.', 48, 45),
        p('小核', 'Micronucleus', '与有性过程中的遗传交换有关。', 'Involved in genetic exchange during sexual processes.', 59, 42),
        p('伸缩泡', 'Contractile vacuole', '收集并排出多余的水。', 'Collects and expels excess water.', 80, 34),
        p('食物泡', 'Food vacuole', '包住吞入的颗粒，进行消化。', 'Encloses ingested particles for digestion.', 30, 43)
      ]
    },
    {
      id: 'chlamy', zh: '衣藻', en: 'Chlamydomonas reinhardtii',
      introZh: '单细胞绿藻，具有两根前端鞭毛和一枚杯状叶绿体。',
      introEn: 'A unicellular green alga with two anterior flagella and a single cup-shaped chloroplast.',
      source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3210518/',
      parts: [
        p('双鞭毛', 'Two flagella', '从细胞前端伸出，帮助游动。', 'Emerge from the anterior pole and support swimming.', 31, 19),
        p('杯状叶绿体', 'Cup-shaped chloroplast', '一枚大型叶绿体环抱细胞内部。', 'One large chloroplast wraps around the cell interior.', 51, 66),
        p('细胞核', 'Nucleus', '位于杯状叶绿体围成的空间。', 'Lies in the space enclosed by the chloroplast cup.', 50, 53),
        p('蛋白核', 'Pyrenoid', '位于叶绿体内部，与碳浓缩机制有关。', 'Inside the chloroplast and associated with carbon concentration.', 50, 79),
        p('眼点', 'Eyespot', '侧面橙红色区域参与感光定向。', 'An orange-red side patch involved in light sensing.', 38, 47)
      ]
    },
    {
      id: 'diatom', zh: '圆筛藻', en: 'Coscinodiscus diatom',
      introZh: '中心硅藻的硅质荚壳呈圆盘状，两片壳瓣像盒盖般扣合。',
      introEn: 'A centric diatom with a disc-like silica frustule whose two valves fit together like a box and lid.',
      source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4776537/',
      parts: [
        p('硅质荚壳', 'Silica frustule', '两片多孔壳瓣与带状结构包围细胞。', 'Two porous valves and girdle bands enclose the cell.', 44, 16),
        p('细胞核', 'Nucleus', '有核膜包围，位于细胞内部。', 'Enclosed by a nuclear membrane inside the cell.', 55, 48),
        p('金褐色叶绿体', 'Golden-brown chloroplasts', '含光合色素，颜色受岩藻黄素影响。', 'Photosynthetic plastids colored in part by fucoxanthin.', 77, 47),
        p('壳面孔纹', 'Frustule pores', '硅壳的规则微孔，图中大小为示意。', 'Regular pores in the silica shell, shown schematically.', 20, 36)
      ]
    },
    {
      id: 'onion', zh: '洋葱鳞茎表皮细胞', en: 'Onion bulb epidermal cell',
      introZh: '洋葱鳞茎的表皮细胞含大液泡，通常不含绿色叶绿体。',
      introEn: 'An onion bulb epidermal cell has a large vacuole and normally lacks green chloroplasts.',
      source: 'https://openstax.org/books/concepts-biology/pages/3-3-eukaryotic-cells',
      parts: [
        p('细胞壁', 'Cell wall', '支撑规整的砖块状外形。', 'Supports the regular brick-like outline.', 49, 26),
        p('中央液泡', 'Central vacuole', '占据细胞大部分空间。', 'Occupies most of the cell interior.', 46, 49),
        p('细胞核', 'Nucleus', '被大液泡推向周边。', 'Displaced toward the periphery by the large vacuole.', 80, 45),
        p('细胞膜', 'Plasma membrane', '紧贴细胞壁内侧。', 'Lies just inside the cell wall.', 21, 50)
      ]
    },
    {
      id: 'roothair', zh: '根毛细胞', en: 'Root hair cell',
      introZh: '根毛是单个根表皮细胞的延伸，增大吸收水和矿物质的表面积。',
      introEn: 'A root hair is an extension of one root epidermal cell, increasing surface area for water and mineral uptake.',
      source: 'https://openstax.org/books/biology-2e/pages/30-3-roots',
      parts: [
        p('根毛延伸部', 'Root hair extension', '一枚细胞向土壤伸出的细长突起。', 'A long, thin projection of a single cell into the soil.', 82, 50),
        p('细胞壁', 'Cell wall', '包围细胞本体并延续到根毛外侧。', 'Surrounds the cell body and continues around the hair.', 59, 40),
        p('液泡', 'Vacuole', '含水空间延伸到根毛内部。', 'The water-rich compartment extends into the hair.', 65, 50),
        p('细胞核', 'Nucleus', '位于细胞本体内。', 'Located in the cell body.', 14, 54)
      ]
    },
    {
      id: 'rbc', zh: '成熟人红细胞', en: 'Mature human red blood cell',
      introZh: '双凹圆盘内充满血红蛋白；成熟人红细胞没有细胞核和线粒体。',
      introEn: 'A biconcave disc packed with hemoglobin; mature human red cells have neither nuclei nor mitochondria.',
      source: 'https://openstax.org/books/biology-2e/pages/40-2-components-of-the-blood',
      parts: [
        p('双凹形态', 'Biconcave shape', '中央薄、边缘较厚，增大交换表面积。', 'A thin center and thicker rim increase exchange surface.', 43, 34),
        p('细胞膜', 'Plasma membrane', '柔韧外缘帮助细胞通过狭窄毛细血管。', 'A flexible boundary helps passage through narrow capillaries.', 48, 17),
        p('含血红蛋白胞质', 'Hemoglobin-rich cytosol', '运载氧气；图中剖面没有细胞器。', 'Carries oxygen; the cutaway contains no organelles.', 69, 55)
      ]
    },
    {
      id: 'myocyte', zh: '骨骼肌细胞', en: 'Skeletal muscle fiber',
      introZh: '一条多核肌纤维内，肌原纤维平行排列并呈重复的肌节条纹。',
      introEn: 'Within one multinucleated muscle fiber, parallel myofibrils show repeating sarcomere bands.',
      source: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/10-2-skeletal-muscle',
      parts: [
        p('肌膜', 'Sarcolemma', '包围整条肌纤维的细胞膜。', 'The plasma membrane around the entire muscle fiber.', 61, 16),
        p('肌原纤维', 'Myofibrils', '长轴方向排列的收缩结构。', 'Longitudinal contractile structures.', 55, 36),
        p('肌节条纹', 'Sarcomere bands', '重复排列的明暗带来自收缩丝的组织。', 'Repeating bands reflect the organization of contractile filaments.', 40, 44),
        p('周边细胞核', 'Peripheral nucleus', '骨骼肌纤维的细胞核靠近肌膜。', 'A skeletal muscle nucleus lies near the sarcolemma.', 25, 20),
        p('线粒体', 'Mitochondria', '分布在肌原纤维之间参与能量供应。', 'Lie between myofibrils and support energy production.', 61, 30)
      ]
    },
    {
      id: 'sperm', zh: '人精子', en: 'Human sperm cell',
      introZh: '头部装载遗传物质，短中段含线粒体，长尾鞭毛提供推进力。',
      introEn: 'The head carries genetic material, the short midpiece contains mitochondria, and a long flagellum provides propulsion.',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK26914/',
      parts: [
        p('顶体', 'Acrosome', '覆盖头部前端的特化囊泡。', 'A specialized vesicle over the front of the head.', 9, 42),
        p('单倍体细胞核', 'Haploid nucleus', '位于头部，含一套染色体。', 'Located in the head and contains one set of chromosomes.', 19, 43),
        p('中段线粒体', 'Midpiece mitochondria', '集中在短中段，参与供能。', 'Concentrated in the short midpiece to support energy supply.', 34, 45),
        p('尾部鞭毛', 'Flagellum', '长尾摆动使精子运动。', 'The long tail beats to move the cell.', 71, 51)
      ]
    },
    {
      id: 'adipocyte', zh: '白色脂肪细胞', en: 'White adipocyte',
      introZh: '单个巨大的脂滴占主要体积，将细胞核与胞质挤向周边。',
      introEn: 'One large lipid droplet fills most of the cell and displaces the nucleus and cytoplasm to the edge.',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK555602/',
      parts: [
        p('单房脂滴', 'Unilocular lipid droplet', '储存甘油三酯，占据细胞大部分体积。', 'Stores triglycerides and occupies most of the cell volume.', 55, 49),
        p('周边细胞核', 'Peripheral nucleus', '被脂滴压向细胞一侧。', 'Pushed to one side by the large lipid droplet.', 28, 48),
        p('薄层胞质', 'Thin cytoplasm', '细胞器分布在脂滴外侧的薄层中。', 'Organelles occupy a thin layer outside the droplet.', 34, 28),
        p('细胞膜', 'Plasma membrane', '围住整个脂肪细胞。', 'Surrounds the entire adipocyte.', 52, 7)
      ]
    },
    {
      id: 'neutrophil', zh: '中性粒细胞', en: 'Neutrophil',
      introZh: '成熟中性粒细胞有相连的分叶细胞核和细密的胞质颗粒。',
      introEn: 'A mature neutrophil has one connected multi-lobed nucleus and many fine cytoplasmic granules.',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK563148/',
      parts: [
        p('分叶细胞核', 'Segmented nucleus', '数个核叶以细丝相连，属于同一个细胞核。', 'Several lobes joined by thin strands form one nucleus.', 51, 50),
        p('胞质颗粒', 'Cytoplasmic granules', '含多种参与防御的酶和蛋白。', 'Contain proteins and enzymes used in host defense.', 69, 38),
        p('细胞膜', 'Plasma membrane', '围住这枚可变形的免疫细胞。', 'Encloses this flexible immune cell.', 77, 60)
      ]
    },
    {
      id: 'oocyte', zh: '成熟人卵细胞（MII）', en: 'Mature human oocyte (MII)',
      introZh: '图示排卵时常见的减数第二次分裂中期阶段；此时没有完整的核膜或“生发泡”。',
      introEn: 'Shown at metaphase II, the stage typical of an ovulated human oocyte; it has no intact nuclear envelope or germinal vesicle.',
      source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11519492/',
      parts: [
        p('透明带', 'Zona pellucida', '包围卵细胞的糖蛋白层。', 'A glycoprotein layer surrounding the oocyte.', 72, 25),
        p('放射冠', 'Corona radiata', '透明带外侧的卵丘细胞层。', 'Cumulus cells outside the zona pellucida.', 20, 29),
        p('第一极体', 'First polar body', '位于透明带和卵细胞之间的卵周隙。', 'Sits in the perivitelline space between cell and zona.', 64, 20),
        p('皮质颗粒', 'Cortical granules', '细胞膜下的小囊泡，受精时参与皮质反应。', 'Small vesicles just under the membrane involved in the cortical reaction.', 68, 43),
        p('MII 纺锤体', 'Metaphase-II spindle', '凝缩染色体排列于靠近细胞边缘的纺锤体上。', 'Condensed chromosomes align on a spindle near the cell cortex.', 63, 32)
      ]
    },
    {
      id: 'tmv', zh: '烟草花叶病毒', en: 'Tobacco mosaic virus',
      introZh: '螺旋衣壳包裹一条单链 RNA；病毒颗粒没有细胞器。',
      introEn: 'A helical protein coat encloses one single-stranded RNA genome; the virion has no cellular organelles.',
      source: 'https://pdb101.rcsb.org/motm/109',
      parts: [
        p('螺旋衣壳', 'Helical capsid', '重复的外壳蛋白亚基围成杆状颗粒。', 'Repeating coat-protein subunits form a rod-like particle.', 50, 33),
        p('单链 RNA', 'Single-stranded RNA', '基因组沿衣壳内部呈螺旋排列。', 'The genome follows a helical path within the coat.', 55, 53),
        p('中央通道', 'Central channel', '螺旋颗粒中心留有狭窄空腔。', 'A narrow hollow channel runs through the particle.', 45, 52)
      ]
    },
    {
      id: 'adeno', zh: '腺病毒', en: 'Adenovirus',
      introZh: '无包膜二十面体病毒；顶点伸出带末端球部的蛋白质纤维。',
      introEn: 'A non-enveloped icosahedral virus with protein fibers and terminal knobs at its vertices.',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK8503/',
      parts: [
        p('二十面体衣壳', 'Icosahedral capsid', '外壳由重复的蛋白亚基组装而成。', 'A shell assembled from repeating protein subunits.', 40, 48),
        p('顶点纤维', 'Vertex fiber', '从顶点伸出，末端球部参与细胞附着。', 'Extends from a vertex; its terminal knob helps bind cells.', 20, 25),
        p('双链 DNA', 'Double-stranded DNA', '线性基因组位于蛋白质核心内。', 'A linear genome lies in a protein-associated core.', 60, 45)
      ]
    },
    {
      id: 'sarscov2', zh: '新型冠状病毒', en: 'SARS-CoV-2',
      introZh: '有包膜的 RNA 病毒；S 刺突位于脂质包膜外侧，RNA 与 N 蛋白在内部结合。',
      introEn: 'An enveloped RNA virus with S spikes outside the lipid envelope and RNA bound to N proteins inside.',
      source: 'https://cdn.rcsb.org/pdb101/learn/resources/flyers/covid-genome/sarscov2-genome-prots.pdf',
      parts: [
        p('S 刺突蛋白', 'S spike protein', '向外伸出的三聚体参与宿主细胞识别。', 'An outward trimer involved in host-cell recognition.', 32, 21),
        p('脂质包膜', 'Lipid envelope', '来源于宿主膜，含有病毒膜蛋白。', 'Derived from host membranes and contains viral membrane proteins.', 65, 28),
        p('单链 RNA', 'Single-stranded RNA', '正义链基因组位于颗粒内部。', 'A positive-sense genome within the particle.', 49, 47),
        p('N 核衣壳蛋白', 'N nucleocapsid protein', '与病毒 RNA 结合，帮助包装基因组。', 'Binds viral RNA and helps package the genome.', 55, 56)
      ]
    }
  ];
}());
