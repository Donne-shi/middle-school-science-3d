/* =============================================================================
   岩石与矿物 · Rocks & Minerals — 内容数据（中英双语）
   数据核对来源：Mindat、USGS、Britannica、Dana/Klein 矿物学教材
   ========================================================================== */
window.GEO = (function () {
  "use strict";

  var minerals = [
    {
      id: "quartz", no: "M-01", img: "quartz.jpg", shape: "quartz", color: 0xaec6d4, gloss: "vitreous",
      name: { zh: "石英", en: "Quartz" },
      formula: "SiO<sub>2</sub>", cls: "silicate", system: "trigonal",
      H: "7", SG: "2.65",
      cleavage: { zh: "无解理；贝壳状断口", en: "None; conchoidal fracture" },
      luster: { zh: "玻璃光泽，断口呈油脂光泽", en: "Vitreous, greasy on fracture" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "六方柱与菱面体组成的晶簇，亦呈块状、脉状、砂粒状", en: "Hexagonal prisms capped by rhombohedra; also massive, veined and granular" },
      occ: { zh: "花岗岩与砂岩的主要组分；石英脉、热液矿床、伟晶岩", en: "Main component of granite and sandstone; quartz veins, hydrothermal deposits, pegmatites" },
      uses: {
        zh: ["玻璃与陶瓷工业的主要原料", "电子工业：石英晶振、光纤、硅片原料", "研磨料、砂纸与铸造用砂", "宝石：水晶、紫晶、黄水晶"],
        en: ["Primary raw material for glass and ceramics", "Electronics: oscillator crystals, optical fibre, silicon feedstock", "Abrasives, sandpaper and foundry sand", "Gemstones: rock crystal, amethyst, citrine"]
      },
      fact: { zh: "石英的压电效应使石英片成为钟表与无线电的频率标准。", en: "Quartz's piezoelectric effect makes thin plates the frequency standard in watches and radios." }
    },
    {
      id: "feldspar", no: "M-02", img: "feldspar.jpg", shape: "feldspar", color: 0xe7b9a3, gloss: "vitreous",
      name: { zh: "钾长石", en: "Orthoclase" },
      formula: "KAlSi<sub>3</sub>O<sub>8</sub>", cls: "silicate", system: "monoclinic",
      H: "6", SG: "2.55–2.63",
      cleavage: { zh: "两组解理近于直角相交", en: "Two cleavages meeting at about 90°" },
      luster: { zh: "玻璃光泽，解理面呈珍珠光泽", en: "Vitreous; pearly on cleavage faces" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "短柱状或板状晶体，常呈肉红色块体", en: "Short prismatic or tabular crystals; commonly flesh-pink masses" },
      occ: { zh: "花岗岩、正长岩、伟晶岩；风化后成为黏土矿物", en: "Granite, syenite and pegmatite; weathers to clay minerals" },
      uses: {
        zh: ["陶瓷与玻璃的助熔剂", "钾肥与钾盐原料", "部分品种可作宝石（月光石、日光石）"],
        en: ["Flux in ceramics and glass", "Raw material for potash fertiliser", "Some varieties are gemstones (moonstone, sunstone)"]
      },
      fact: { zh: "长石族约占大陆地壳体积的 60%，是地壳中最丰富的矿物族。", en: "Feldspars make up roughly 60% of the continental crust by volume — the most abundant mineral group." }
    },
    {
      id: "biotite", no: "M-03", img: "biotite.jpg", shape: "mica", color: 0x2f2a26, gloss: "metallic",
      name: { zh: "黑云母", en: "Biotite" },
      formula: "K(Mg,Fe)<sub>3</sub>(AlSi<sub>3</sub>O<sub>10</sub>)(F,OH)<sub>2</sub>", cls: "silicate", system: "monoclinic",
      H: "2.5–3", SG: "2.7–3.3",
      cleavage: { zh: "底面极完全解理，可剥成有弹性的薄片", en: "Perfect basal cleavage; peels into elastic sheets" },
      luster: { zh: "玻璃至珍珠光泽，薄片半透明", en: "Vitreous to pearly; thin sheets translucent" },
      streak: { zh: "白色至浅灰", en: "White to pale grey" },
      habit: { zh: "片状、鳞片状集合体，常呈“书册状”叠层", en: "Flaky and scaly aggregates, often stacked like a book" },
      occ: { zh: "花岗岩、片岩、片麻岩；中酸性岩浆岩的常见暗色矿物", en: "Granite, schist and gneiss; a common dark mineral in intermediate to felsic igneous rocks" },
      uses: {
        zh: ["电气绝缘材料（云母片、云母带）", "珠光颜料与化妆品", "钾-氩同位素定年"],
        en: ["Electrical insulation (mica sheets and tape)", "Pearlescent pigments and cosmetics", "K–Ar isotopic dating"]
      },
      fact: { zh: "黑云母薄片有弹性、可弯曲回弹；白云母更透明银白且同样有弹性——这是区分二者的快捷方式。", en: "Biotite sheets are elastic and spring back when bent; muscovite is paler and silvery. Elasticity separates both micas from brittle chlorite." }
    },
    {
      id: "olivine", no: "M-04", img: "olivine.jpg", shape: "olivine", color: 0x7fa63f, gloss: "vitreous",
      name: { zh: "橄榄石", en: "Olivine" },
      formula: "(Mg,Fe)<sub>2</sub>SiO<sub>4</sub>", cls: "silicate", system: "orthorhombic",
      H: "6.5–7", SG: "3.27–4.37",
      cleavage: { zh: "解理差；贝壳状断口", en: "Poor cleavage; conchoidal fracture" },
      luster: { zh: "玻璃光泽，断口油脂光泽", en: "Vitreous, greasy on fractures" },
      streak: { zh: "无色至浅黄", en: "Colourless to pale yellow" },
      habit: { zh: "粒状集合体，偶见短柱状晶体", en: "Granular aggregates; occasional short prisms" },
      occ: { zh: "基性与超基性岩（辉长岩、橄榄岩）、陨石、上地幔", en: "Mafic and ultramafic rocks (gabbro, peridotite), meteorites, the upper mantle" },
      uses: {
        zh: ["耐火砂与铸造型砂", "炼铁球团与炉渣调节剂", "宝石（橄榄石／贵橄榄石）", "CO₂ 矿化固碳的实验原料"],
        en: ["Refractory and foundry sand", "Iron-ore pelletising and slag conditioner", "Gemstone (peridot)", "Feedstock for experimental CO₂ mineralisation"]
      },
      fact: { zh: "橄榄石是上地幔最主要的矿物之一；宝石级绿色橄榄石属于镁橄榄石–铁橄榄石固溶体。", en: "Olivine dominates the upper mantle; gem peridot is a forsterite–fayalite solid solution." }
    },
    {
      id: "calcite", no: "M-05", img: "calcite.jpg", shape: "rhomb", color: 0xefe6c6, gloss: "vitreous",
      name: { zh: "方解石", en: "Calcite" },
      formula: "CaCO<sub>3</sub>", cls: "carbonate", system: "trigonal",
      H: "3", SG: "2.71",
      cleavage: { zh: "三组菱面体完全解理，碎块仍为菱面体", en: "Perfect rhombohedral cleavage in three directions; fragments remain rhombohedra" },
      luster: { zh: "玻璃至珍珠光泽", en: "Vitreous to pearly" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "菱面体、偏三角面体；亦呈钟乳状、鲕状、纤维状", en: "Rhombohedra and scalenohedra; also stalactitic, oolitic and fibrous" },
      occ: { zh: "石灰岩与大理岩的主要矿物；洞穴沉积、热液脉、贝壳", en: "Main mineral of limestone and marble; cave deposits, hydrothermal veins, shells" },
      uses: {
        zh: ["水泥、石灰与冶金熔剂", "造纸、塑料与涂料的填料", "光学棱镜（冰洲石的双折射）", "土壤与水质调节"],
        en: ["Cement, lime and metallurgical flux", "Filler in paper, plastics and paint", "Optical prisms using Iceland spar's birefringence", "Soil and water conditioning"]
      },
      fact: { zh: "冰洲石可把一束光分成两束（双折射），历史上是制造偏光棱镜的关键材料。", en: "Iceland spar splits a light beam in two (birefringence) and was historically essential for polarising prisms." }
    },
    {
      id: "malachite", no: "M-06", img: "malachite.jpg", shape: "botryoid", color: 0x1d7a4c, gloss: "silky",
      name: { zh: "孔雀石", en: "Malachite" },
      formula: "Cu<sub>2</sub>CO<sub>3</sub>(OH)<sub>2</sub>", cls: "carbonate", system: "monoclinic",
      H: "3.5–4", SG: "3.6–4.05",
      cleavage: { zh: "无解理；参差状至贝壳状断口", en: "No cleavage; uneven to conchoidal fracture" },
      luster: { zh: "丝绢光泽至土状光泽", en: "Silky to earthy" },
      streak: { zh: "浅绿色", en: "Pale green" },
      habit: { zh: "葡萄状、纤维状、皮壳状，断面呈同心环带", en: "Botryoidal, fibrous and crustose; concentric banding in cross-section" },
      occ: { zh: "铜矿床氧化带，与蓝铜矿、赤铜矿共生", en: "Oxidised zone of copper deposits, with azurite and cuprite" },
      uses: {
        zh: ["铜矿石（次要来源）", "绿色矿物颜料", "装饰石材与工艺品", "宝石与观赏标本"],
        en: ["Copper ore (secondary source)", "Green mineral pigment", "Ornamental stone and carvings", "Gem and display specimens"]
      },
      fact: { zh: "孔雀石的绿色来自 Cu²⁺；它与更蓝的蓝铜矿常在同一氧化带中共生。", en: "The green comes from Cu²⁺; it commonly coexists with the bluer azurite in the same oxidation zone." }
    },
    {
      id: "pyrite", no: "M-07", img: "pyrite.jpg", shape: "pyrite", color: 0xc9a13b, gloss: "metallic",
      name: { zh: "黄铁矿", en: "Pyrite" },
      formula: "FeS<sub>2</sub>", cls: "sulfide", system: "cubic",
      H: "6–6.5", SG: "5.0",
      cleavage: { zh: "解理极差；断口不平", en: "Very poor cleavage; uneven fracture" },
      luster: { zh: "金属光泽", en: "Metallic" },
      streak: { zh: "绿黑色", en: "Greenish black" },
      habit: { zh: "立方体、五角十二面体，晶面常具条纹", en: "Cubes and pyritohedra, often with striated faces" },
      occ: { zh: "热液脉、沉积岩、煤层与变质岩中广泛产出", en: "Widespread in hydrothermal veins, sedimentary rocks, coal measures and metamorphic rocks" },
      uses: {
        zh: ["硫酸工业原料", "提取伴生的金、钴、镍", "半导体与太阳能材料研究", "观赏矿物"],
        en: ["Feedstock for sulphuric acid", "Recovery of associated gold, cobalt and nickel", "Research on semiconductor and photovoltaic materials", "Display mineral"]
      },
      fact: { zh: "黄铁矿常被误认为黄金，故称“愚人金”。它的条痕是绿黑色，而黄金的条痕是金黄色。", en: "Pyrite is the classic 'fool's gold'. Its streak is greenish black, whereas gold leaves a golden streak." }
    },
    {
      id: "hematite", no: "M-08", img: "hematite.jpg", shape: "roses", color: 0x4a3430, gloss: "metallic",
      name: { zh: "赤铁矿", en: "Hematite" },
      formula: "Fe<sub>2</sub>O<sub>3</sub>", cls: "oxide", system: "trigonal",
      H: "5–6", SG: "5.26",
      cleavage: { zh: "无解理；断口不平至贝壳状", en: "No cleavage; uneven to conchoidal fracture" },
      luster: { zh: "金属至半金属光泽，土状者暗淡", en: "Metallic to sub-metallic; earthy varieties dull" },
      streak: { zh: "樱红色（特征性）", en: "Cherry red (diagnostic)" },
      habit: { zh: "片状（镜铁矿）、肾状、土状、鲕状", en: "Specular plates, reniform, earthy and oolitic" },
      occ: { zh: "沉积铁矿（条带状铁建造）、热液脉、风化壳", en: "Sedimentary iron formations (BIF), hydrothermal veins, weathering crusts" },
      uses: {
        zh: ["最主要的铁矿石之一", "红色颜料（赭石、铁红）", "防锈底漆与抛光粉", "高密度混凝土骨料（辐射屏蔽）"],
        en: ["One of the principal iron ores", "Red pigment (ochre, iron oxide red)", "Anti-corrosion primer and polishing powder", "High-density concrete aggregate for radiation shielding"]
      },
      fact: { zh: "赤铁矿的条痕恒为樱红色，是野外鉴定最可靠的依据，即使标本本身呈铁黑色。", en: "Hematite always leaves a cherry-red streak — the most reliable field test, even when the specimen looks iron-black." }
    },
    {
      id: "magnetite", no: "M-09", img: "magnetite.jpg", shape: "octa", color: 0x2a2a2f, gloss: "metallic",
      name: { zh: "磁铁矿", en: "Magnetite" },
      formula: "Fe<sub>3</sub>O<sub>4</sub>", cls: "oxide", system: "cubic",
      H: "5.5–6.5", SG: "5.17",
      cleavage: { zh: "解理不明显；断口不平", en: "Indistinct cleavage; uneven fracture" },
      luster: { zh: "金属至半金属光泽", en: "Metallic to sub-metallic" },
      streak: { zh: "黑色", en: "Black" },
      habit: { zh: "八面体、菱形十二面体，常呈粒状集合体", en: "Octahedra and dodecahedra, commonly granular" },
      occ: { zh: "基性岩、接触交代矿床、砂矿；陨石中常见", en: "Mafic rocks, contact-metasomatic deposits, placers; common in meteorites" },
      uses: {
        zh: ["重要铁矿石", "重介质选煤与选矿", "磁记录与磁性材料", "纳米氧化铁用于医学造影研究"],
        en: ["Major iron ore", "Dense medium for coal and ore separation", "Magnetic recording and magnetic materials", "Iron-oxide nanoparticles in medical imaging research"]
      },
      fact: { zh: "磁铁矿是天然磁性最强的矿物之一，普通磁铁即可直接吸附，也是古地磁学记录地球磁场倒转的载体。", en: "One of the most strongly magnetic natural minerals; it records geomagnetic reversals in palaeomagnetism." }
    },
    {
      id: "fluorite", no: "M-10", img: "fluorite.jpg", shape: "octa", color: 0x4aa87a, gloss: "vitreous",
      name: { zh: "萤石", en: "Fluorite" },
      formula: "CaF<sub>2</sub>", cls: "halide", system: "cubic",
      H: "4", SG: "3.18",
      cleavage: { zh: "八面体完全解理（四组）", en: "Perfect octahedral cleavage (four directions)" },
      luster: { zh: "玻璃光泽", en: "Vitreous" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "立方体、八面体，常具条带状色带", en: "Cubes and octahedra, often colour-zoned" },
      occ: { zh: "热液脉，与石英、方解石、重晶石共生", en: "Hydrothermal veins with quartz, calcite and barite" },
      uses: {
        zh: ["炼钢与炼铝的熔剂", "制氢氟酸与氟化工产品", "低色散光学镜片", "装饰与收藏"],
        en: ["Flux in steel and aluminium smelting", "Feedstock for hydrofluoric acid and fluorochemicals", "Low-dispersion optical lenses", "Ornamental and collector material"]
      },
      fact: { zh: "萤石在紫外线下常发出蓝紫色荧光，英文 fluorescence 一词即由 fluorite 而来。", en: "Fluorite often fluoresces blue-violet under UV — the word 'fluorescence' derives from fluorite." }
    },
    {
      id: "halite", no: "M-11", img: "halite.jpg", shape: "cube", color: 0xf2eee6, gloss: "vitreous",
      name: { zh: "石盐", en: "Halite" },
      formula: "NaCl", cls: "halide", system: "cubic",
      H: "2–2.5", SG: "2.17",
      cleavage: { zh: "三组立方体完全解理", en: "Perfect cubic cleavage in three directions" },
      luster: { zh: "玻璃光泽", en: "Vitreous" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "立方体晶体，常呈块状、粒状、盐壳", en: "Cubic crystals; massive, granular or crusts" },
      occ: { zh: "蒸发岩、盐湖、盐丘与地下盐层", en: "Evaporites, salt lakes, salt domes and bedded salt" },
      uses: {
        zh: ["食用盐与工业盐", "氯碱工业（烧碱、氯气、盐酸）", "冬季道路融雪", "岩盐灯与装饰"],
        en: ["Table and industrial salt", "Chlor-alkali industry (caustic soda, chlorine, hydrochloric acid)", "Road de-icing", "Salt lamps and decoration"]
      },
      fact: { zh: "石盐的立方体解理使它敲碎后仍是小立方体；天然石盐因杂质可呈粉红、橙红或蓝色。", en: "Cubic cleavage means halite breaks into small cubes; impurities tint natural salt pink, orange or blue." }
    },
    {
      id: "gypsum", no: "M-12", img: "gypsum.jpg", shape: "tabular", color: 0xefe9dc, gloss: "vitreous",
      name: { zh: "石膏", en: "Gypsum" },
      formula: "CaSO<sub>4</sub>·2H<sub>2</sub>O", cls: "sulfate", system: "monoclinic",
      H: "2", SG: "2.32",
      cleavage: { zh: "一组极完全解理，可剥成薄片", en: "One direction of perfect cleavage; splits into sheets" },
      luster: { zh: "玻璃至丝绢光泽", en: "Vitreous to silky" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "板状（透石膏）、纤维状（纤维石膏）、土状（雪花石膏）", en: "Tabular (selenite), fibrous (satin spar) and earthy (alabaster)" },
      occ: { zh: "蒸发岩、湖相沉积、风化壳与洞穴", en: "Evaporites, lacustrine deposits, weathering crusts and caves" },
      uses: {
        zh: ["建筑石膏、纸面石膏板与模具", "水泥缓凝剂", "医用与牙科模型材料", "土壤改良与肥料"],
        en: ["Plaster, plasterboard and moulds", "Cement retarder", "Medical and dental model material", "Soil amendment and fertiliser"]
      },
      fact: { zh: "石膏硬度只有 2，指甲（约 2.5）即可刻划；加热到约 150 °C 失去部分结晶水成为熟石膏。", en: "At hardness 2 a fingernail (≈2.5) scratches gypsum; heating to about 150 °C drives off water to make plaster of Paris." }
    },
    {
      id: "graphite", no: "M-13", img: "graphite.jpg", shape: "plate", color: 0x3a3a3d, gloss: "metallic",
      name: { zh: "石墨", en: "Graphite" },
      formula: "C", cls: "native", system: "hexagonal",
      H: "1–2", SG: "2.1–2.3",
      cleavage: { zh: "底面极完全解理，薄片柔软可弯", en: "Perfect basal cleavage; flexible sheets" },
      luster: { zh: "金属至土状光泽，具滑腻感", en: "Metallic to earthy; greasy feel" },
      streak: { zh: "黑色至灰黑", en: "Black to grey-black" },
      habit: { zh: "鳞片状、块状、六方板状", en: "Flaky, massive, hexagonal plates" },
      occ: { zh: "变质岩（片岩、片麻岩）、接触变质煤层", en: "Metamorphic rocks (schist, gneiss); contact-metamorphosed coal" },
      uses: {
        zh: ["铅笔芯", "高温润滑剂", "锂离子电池负极材料", "电极、电刷与核反应堆减速剂"],
        en: ["Pencil leads", "High-temperature lubricant", "Anode material in lithium-ion batteries", "Electrodes, brushes and nuclear moderators"]
      },
      fact: { zh: "石墨与金刚石同为碳：碳原子层状排列则软而导电，三维骨架排列则硬而绝缘——同质多象的经典例子。", en: "Graphite and diamond are both carbon: layered sheets give softness and conductivity, a 3-D framework gives hardness and insulation." }
    },
    {
      id: "diamond", no: "M-14", img: "diamond.jpg", shape: "octa", color: 0xeef3f5, gloss: "adamantine",
      name: { zh: "金刚石", en: "Diamond" },
      formula: "C", cls: "native", system: "cubic",
      H: "10", SG: "3.52",
      cleavage: { zh: "八面体完全解理（四组）", en: "Perfect octahedral cleavage (four directions)" },
      luster: { zh: "金刚光泽", en: "Adamantine" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "八面体、菱形十二面体，晶面常弯曲", en: "Octahedra and dodecahedra, often with curved faces" },
      occ: { zh: "金伯利岩筒与钾镁煌斑岩；砂矿", en: "Kimberlite and lamproite pipes; placer deposits" },
      uses: {
        zh: ["切割、研磨与钻探（锯片、钻头）", "高压实验的金刚石压砧", "光学与电子器件窗口", "宝石"],
        en: ["Cutting, grinding and drilling (saw blades, drill bits)", "Diamond anvil cells for high-pressure research", "Optical and electronic windows", "Gemstone"]
      },
      fact: { zh: "金刚石在约 150–200 km 深、4–6 GPa 的地幔条件下结晶，由金伯利岩岩浆快速带到地表。", en: "Diamonds crystallise at 150–200 km depth and 4–6 GPa, then are carried up rapidly by kimberlite magmas." }
    },
    {
      id: "zircon", no: "M-15", img: "zircon.jpg", shape: "zircon", color: 0x8e3d2c, gloss: "adamantine",
      name: { zh: "锆石", en: "Zircon" },
      formula: "ZrSiO<sub>4</sub>", cls: "silicate", system: "tetragonal",
      H: "7.5", SG: "4.6–4.7",
      cleavage: { zh: "解理差；贝壳状断口", en: "Poor cleavage; conchoidal fracture" },
      luster: { zh: "金刚至玻璃光泽", en: "Adamantine to vitreous" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "四方柱与四方双锥组成的短柱状晶体", en: "Short prisms of a tetragonal prism terminated by bipyramids" },
      occ: { zh: "花岗岩、伟晶岩、碱性岩；重砂与砂矿", en: "Granite, pegmatite and alkaline rocks; heavy mineral sands" },
      uses: {
        zh: ["宝石（锆石）", "陶瓷、耐火材料与釉料", "提取锆与铪", "铀-铅同位素定年"],
        en: ["Gemstone (zircon)", "Ceramics, refractories and glazes", "Source of zirconium and hafnium", "U–Pb isotopic dating"]
      },
      fact: { zh: "锆石极耐风化，能保存数十亿年的铀-铅同位素信息，是地质年代学最重要的“时钟”矿物。", en: "Zircon resists weathering for billions of years and retains U–Pb isotopes — geochronology's most important clock." }
    },
    {
      id: "plagioclase", no: "M-16", img: "plagioclase.jpg", shape: "triclinic", color: 0xe9e3d6, gloss: "vitreous",
      name: { zh: "斜长石", en: "Plagioclase" },
      formula: "(Na,Ca)(Al,Si)<sub>3</sub>O<sub>8</sub>", cls: "silicate", system: "triclinic",
      H: "6–6.5", SG: "2.60–2.76",
      cleavage: { zh: "两组解理，交角约 86°–94°", en: "Two cleavages intersecting at about 86–94°" },
      luster: { zh: "玻璃至珍珠光泽", en: "Vitreous to pearly" },
      streak: { zh: "白色", en: "White" },
      habit: { zh: "板状、条板状晶体，常具聚片双晶纹", en: "Tabular and lath-shaped crystals, often with polysynthetic twinning" },
      occ: { zh: "几乎所有火成岩；花岗岩、玄武岩、辉长岩中均常见", en: "Nearly all igneous rocks: granite, basalt, gabbro" },
      uses: {
        zh: ["陶瓷与玻璃原料", "部分品种可作宝石（日光石、拉长石）", "岩石成因与温压条件研究"],
        en: ["Ceramic and glass raw material", "Some varieties are gemstones (sunstone, labradorite)", "Petrogenetic indicators of temperature and pressure"]
      },
      fact: { zh: "斜长石是钠长石与钙长石的连续固溶体，用 An 值（钙长石分子百分比）表示成分。", en: "Plagioclase is a continuous solid solution from albite to anorthite, described by its An content." }
    }
  ];

  var classes = [
    { id: "silicate", name: { zh: "硅酸盐", en: "Silicates" }, def: { zh: "以 [SiO₄] 四面体为基本单元，可连接成岛状、链状、层状或架状结构，占地壳体积约 90%。", en: "Built from [SiO₄] tetrahedra linked as islands, chains, sheets or frameworks; about 90% of the crust by volume." }, ex: { zh: "石英 · 长石 · 云母 · 橄榄石 · 锆石", en: "Quartz · feldspar · mica · olivine · zircon" } },
    { id: "oxide", name: { zh: "氧化物与氢氧化物", en: "Oxides & Hydroxides" }, def: { zh: "金属阳离子与 O²⁻ 或 OH⁻ 结合，多为金属矿石，硬度与密度偏高。", en: "Metal cations bonded to O²⁻ or OH⁻; mostly ore minerals with high hardness and density." }, ex: { zh: "赤铁矿 · 磁铁矿 · 刚玉 · 软锰矿", en: "Hematite · magnetite · corundum · pyrolusite" } },
    { id: "sulfide", name: { zh: "硫化物", en: "Sulfides" }, def: { zh: "硫与金属或半金属结合，金属光泽、比重大，是铜、铅、锌、银的主要矿石。", en: "Sulfur combined with metals or semi-metals; metallic lustre, high density, main ores of Cu, Pb, Zn and Ag." }, ex: { zh: "黄铁矿 · 黄铜矿 · 方铅矿 · 闪锌矿", en: "Pyrite · chalcopyrite · galena · sphalerite" } },
    { id: "carbonate", name: { zh: "碳酸盐", en: "Carbonates" }, def: { zh: "含 CO₃²⁻ 三角基团；方解石族遇稀盐酸起泡，是石灰岩与大理岩的主体。", en: "Contain the CO₃²⁻ group; the calcite group effervesces in dilute acid and dominates limestone and marble." }, ex: { zh: "方解石 · 白云石 · 孔雀石 · 菱铁矿", en: "Calcite · dolomite · malachite · siderite" } },
    { id: "sulfate", name: { zh: "硫酸盐", en: "Sulfates" }, def: { zh: "含 SO₄²⁻ 四面体，多形成于蒸发环境或热液氧化带，硬度普遍较低。", en: "Contain SO₄²⁻ tetrahedra; form in evaporites or oxidised hydrothermal zones, generally soft." }, ex: { zh: "石膏 · 硬石膏 · 重晶石 · 天青石", en: "Gypsum · anhydrite · barite · celestine" } },
    { id: "halide", name: { zh: "卤化物", en: "Halides" }, def: { zh: "卤族元素（F、Cl、Br、I）与金属的化合物，多为可溶盐类，解理极完全。", en: "Halogens (F, Cl, Br, I) with metals; mostly soluble salts with very perfect cleavage." }, ex: { zh: "石盐 · 萤石 · 钾盐 · 光卤石", en: "Halite · fluorite · sylvite · carnallite" } },
    { id: "phosphate", name: { zh: "磷酸盐", en: "Phosphates" }, def: { zh: "含 PO₄³⁻ 四面体，是磷肥与稀土元素的重要来源。", en: "Contain PO₄³⁻ tetrahedra; key sources of phosphate fertiliser and rare-earth elements." }, ex: { zh: "磷灰石 · 独居石 · 绿松石", en: "Apatite · monazite · turquoise" } },
    { id: "native", name: { zh: "自然元素", en: "Native Elements" }, def: { zh: "以单一元素产出，包括金属（金、铜）、半金属（砷）与非金属（碳、硫）。", en: "Single elements: metals (gold, copper), semi-metals (arsenic) and non-metals (carbon, sulfur)." }, ex: { zh: "石墨 · 金刚石 · 自然金 · 自然硫", en: "Graphite · diamond · native gold · sulfur" } }
  ];

  var families = {
    igneous: {
      name: { zh: "岩浆岩", en: "Igneous" }, color: "#8E3A2B",
      tag: { zh: "火成 · 由熔融到结晶", en: "From melt to crystal" },
      intro: { zh: "岩浆在地下或地表冷却结晶形成。按 SiO₂ 含量分为超基性、基性、中性、酸性；按就位位置分为侵入岩（慢冷、粗粒）与喷出岩（快冷、细粒或玻璃质）。", en: "Formed when magma or lava crystallises. Classified by silica content (ultramafic to felsic) and by emplacement: intrusive rocks cool slowly and grow coarse crystals; extrusive rocks cool fast and stay fine-grained or glassy." },
      stat: { zh: "占地壳体积约 65%", en: "≈65% of crust volume" }
    },
    sedimentary: {
      name: { zh: "沉积岩", en: "Sedimentary" }, color: "#A8862F",
      tag: { zh: "水与风 · 由碎屑到层理", en: "Water and wind" },
      intro: { zh: "地表岩石风化后的碎屑、溶解物质或生物遗骸，经搬运、沉积与成岩作用形成。只占地壳体积约 8%，却覆盖大陆地表约 75%，也是化石与能源的主要载体。", en: "Made from weathered debris, dissolved ions or organic remains that are transported, deposited and lithified. Only ~8% of crust volume but ~75% of the continental surface — and the main host of fossils and fossil fuels." },
      stat: { zh: "覆盖地表约 75%", en: "≈75% of land surface" }
    },
    metamorphic: {
      name: { zh: "变质岩", en: "Metamorphic" }, color: "#24567F",
      tag: { zh: "热与压力 · 由重结晶到定向", en: "Heat and pressure" },
      intro: { zh: "原有岩石在固态下受温度（>200 °C）、压力与流体作用，矿物重结晶、长大或新生。片状矿物定向排列形成片理，是变质岩最典型的构造。", en: "Pre-existing rocks recrystallise in the solid state under heat (>200 °C), pressure and fluids. Aligned platy minerals produce foliation — the signature structure of metamorphic rocks." },
      stat: { zh: "温压每深 1 km 约增 25 °C", en: "≈25 °C per km of burial" }
    }
  };

  var rocks = [
    {
      id: "granite", img: "granite.jpg", family: "igneous", sub: "intrusive",
      name: { zh: "花岗岩", en: "Granite" },
      grain: { zh: "粗粒 · 2–10 mm", en: "Coarse · 2–10 mm" },
      formation: { zh: "酸性岩浆在地壳深部缓慢冷却（数万至数百万年），矿物有充足时间长大，形成颗粒相互嵌合的等粒结构。", en: "Felsic magma cools slowly at depth over tens of thousands to millions of years, so crystals grow large and interlock." },
      minerals: [
        { zh: "钾长石", en: "K-feldspar", pct: 35, c: "#D98E7A" },
        { zh: "石英", en: "Quartz", pct: 30, c: "#B9C6CC" },
        { zh: "斜长石", en: "Plagioclase", pct: 25, c: "#EADFCB" },
        { zh: "黑云母／角闪石", en: "Biotite / hornblende", pct: 10, c: "#4A4038" }
      ],
      tips: { zh: "肉红色钾长石、灰白石英与黑色云母肉眼可辨，无定向排列。", en: "Flesh-pink feldspar, grey quartz and black mica are visible to the eye, with no preferred orientation." },
      uses: { zh: "建筑石材、台面与碑石；放射性元素含量低者可室内使用。", en: "Building stone, worktops and monuments; low-radioactivity varieties suit interiors." }
    },
    {
      id: "basalt", img: "basalt.jpg", family: "igneous", sub: "extrusive",
      name: { zh: "玄武岩", en: "Basalt" },
      grain: { zh: "细粒至隐晶 · <1 mm", en: "Fine to aphanitic · <1 mm" },
      formation: { zh: "基性岩浆喷出地表后快速冷却（数天至数年），晶体来不及长大；熔岩流顶部常保留气孔，冷却收缩可形成柱状节理。", en: "Mafic lava cools at the surface within days to years, so crystals stay tiny. Vesicles are common and cooling contraction can produce columnar jointing." },
      minerals: [
        { zh: "斜长石", en: "Plagioclase", pct: 50, c: "#E6DCC8" },
        { zh: "辉石", en: "Pyroxene", pct: 35, c: "#5C6B5A" },
        { zh: "橄榄石", en: "Olivine", pct: 8, c: "#7FA63F" },
        { zh: "磁铁矿／钛铁矿", en: "Magnetite / ilmenite", pct: 7, c: "#2E2E33" }
      ],
      tips: { zh: "深灰黑色、致密沉重；气孔与杏仁构造常见；柱状节理是六边形石柱。", en: "Dark, dense and heavy; vesicles and amygdales common; columnar jointing forms hexagonal pillars." },
      uses: { zh: "碎石与道砟、铸石、玄武岩纤维；可用于 CO₂ 矿化封存。", en: "Aggregate and ballast, cast stone, basalt fibre; also used for CO₂ mineralisation." }
    },
    {
      id: "obsidian", img: "obsidian.jpg", family: "igneous", sub: "extrusive",
      name: { zh: "黑曜岩", en: "Obsidian" },
      grain: { zh: "玻璃质 · 无颗粒", en: "Glassy · no grains" },
      formation: { zh: "高硅岩浆喷出后极快速冷却，原子来不及排列成晶格，形成天然火山玻璃；含水量通常低于 1%。", en: "Silica-rich lava cools so fast that atoms cannot order into a lattice, producing natural glass; water content is usually below 1%." },
      minerals: [
        { zh: "火山玻璃", en: "Volcanic glass", pct: 95, c: "#26262A" },
        { zh: "磁铁矿微晶", en: "Magnetite microlites", pct: 3, c: "#4B4B52" },
        { zh: "辉石微晶", en: "Pyroxene microlites", pct: 2, c: "#5C6B5A" }
      ],
      tips: { zh: "漆黑、强玻璃光泽；断口呈贝壳状且边缘锋利；可含白色“雪花”斑晶。", en: "Jet black with a strong glassy lustre; conchoidal fracture with razor edges; may contain white 'snowflake' phenocrysts." },
      uses: { zh: "史前石器与刀片、现代手术刀；装饰与宝石；火山玻璃研究。", en: "Prehistoric tools and blades, modern scalpel blades, ornament, gemstones and volcanology." }
    },
    {
      id: "gabbro", img: "gabbro.jpg", family: "igneous", sub: "intrusive",
      name: { zh: "辉长岩", en: "Gabbro" },
      grain: { zh: "粗粒 · 2–15 mm", en: "Coarse · 2–15 mm" },
      formation: { zh: "与玄武岩化学成分相同，但在地下深处缓慢冷却，因此晶体粗大；常构成洋壳的下部与大型层状侵入体。", en: "Chemically equivalent to basalt but cooled slowly at depth, so crystals are coarse. It forms the lower oceanic crust and large layered intrusions." },
      minerals: [
        { zh: "斜长石", en: "Plagioclase", pct: 55, c: "#E6DCC8" },
        { zh: "辉石", en: "Pyroxene", pct: 35, c: "#5C6B5A" },
        { zh: "橄榄石", en: "Olivine", pct: 7, c: "#7FA63F" },
        { zh: "磁铁矿", en: "Magnetite", pct: 3, c: "#2E2E33" }
      ],
      tips: { zh: "暗灰至黑色、颗粒粗；密度约 3.0，比花岗岩重；不含石英。", en: "Dark grey to black and coarse-grained; density ≈3.0, heavier than granite; no quartz." },
      uses: { zh: "碎石与装饰石材；铂族元素与铜镍硫化物矿床的母岩。", en: "Aggregate and dimension stone; host rock of platinum-group and Ni–Cu sulfide ores." }
    },
    {
      id: "sandstone", img: "sandstone.jpg", family: "sedimentary", sub: "clastic",
      name: { zh: "砂岩", en: "Sandstone" },
      grain: { zh: "砂级碎屑 · 0.06–2 mm", en: "Sand-grade · 0.06–2 mm" },
      formation: { zh: "岩石风化产生的砂粒被河流、风或海浪搬运到盆地沉积，再由硅质、钙质或铁质胶结物固结。", en: "Weathered sand grains are transported by rivers, wind or waves into a basin, then cemented by silica, calcite or iron oxide." },
      minerals: [
        { zh: "石英", en: "Quartz", pct: 70, c: "#B9C6CC" },
        { zh: "长石", en: "Feldspar", pct: 15, c: "#D98E7A" },
        { zh: "岩屑", en: "Lithic fragments", pct: 10, c: "#8A7A66" },
        { zh: "胶结物", en: "Cement", pct: 5, c: "#C9B98E" }
      ],
      tips: { zh: "手指可感到砂粒；常见交错层理；滴稀盐酸通常不起泡（钙质胶结者除外）。", en: "Gritty to the touch; cross-bedding common; usually no reaction to dilute acid unless calcite-cemented." },
      uses: { zh: "建筑石材、玻璃砂原料；重要的储油、储水层。", en: "Building stone and glass sand; major oil and water reservoir rock." }
    },
    {
      id: "limestone", img: "limestone.jpg", family: "sedimentary", sub: "biochemical",
      name: { zh: "石灰岩", en: "Limestone" },
      grain: { zh: "生物碎屑／微晶 · 细", en: "Bioclastic / micritic · fine" },
      formation: { zh: "海洋生物的钙质壳体堆积，或海水中碳酸钙直接化学沉淀，经压实与胶结形成；常含化石与鲕粒。", en: "Accumulated calcareous shells or directly precipitated calcium carbonate, compacted and cemented; fossils and ooids are common." },
      minerals: [
        { zh: "方解石", en: "Calcite", pct: 90, c: "#EADFCB" },
        { zh: "白云石", en: "Dolomite", pct: 5, c: "#D8CDB4" },
        { zh: "石英／黏土", en: "Quartz / clay", pct: 5, c: "#9A9484" }
      ],
      tips: { zh: "滴稀盐酸剧烈起泡；常见化石；硬度约 3，小刀可刻。", en: "Effervesces vigorously in dilute acid; fossils common; hardness ≈3, scratched by a knife." },
      uses: { zh: "水泥与石灰、炼钢熔剂、烟气脱硫剂、建筑石材。", en: "Cement and lime, steel flux, flue-gas desulfurisation, building stone." }
    },
    {
      id: "shale", img: "shale.jpg", family: "sedimentary", sub: "clastic",
      name: { zh: "页岩", en: "Shale" },
      grain: { zh: "泥质 · <0.004 mm", en: "Mud-grade · <0.004 mm" },
      formation: { zh: "极细的黏土与粉砂在平静水体中缓慢沉降，经压实脱水与轻微胶结形成；页理平行于层理。", en: "Very fine clay and silt settle in quiet water, then compact and dewater. Fissility runs parallel to bedding." },
      minerals: [
        { zh: "黏土矿物", en: "Clay minerals", pct: 60, c: "#8A8578" },
        { zh: "石英粉砂", en: "Quartz silt", pct: 30, c: "#C2C8C4" },
        { zh: "有机质／碳酸盐", en: "Organic matter / carbonate", pct: 10, c: "#4A4038" }
      ],
      tips: { zh: "可剥成薄片（页理）；质地软、易碎；常含化石与有机质。", en: "Splits into thin sheets (fissility); soft and friable; often fossiliferous and organic-rich." },
      uses: { zh: "制砖与水泥原料、陶瓷原料；页岩气与页岩油的烃源岩。", en: "Brick and cement raw material, ceramics; source rock for shale gas and oil." }
    },
    {
      id: "conglomerate", img: "conglomerate.jpg", family: "sedimentary", sub: "clastic",
      name: { zh: "砾岩", en: "Conglomerate" },
      grain: { zh: "砾级 · >2 mm", en: "Gravel-grade · >2 mm" },
      formation: { zh: "河流、海滩或洪流搬运的砾石在盆地边缘堆积，被砂泥基质与胶结物固结；砾石经过磨圆是它与角砾岩的关键区别。", en: "Rounded gravel carried by rivers, beaches or floods accumulates at basin margins and is cemented by a sand–mud matrix. Rounding separates it from breccia." },
      minerals: [
        { zh: "岩屑砾石", en: "Rock fragments", pct: 60, c: "#8A7A66" },
        { zh: "砂质基质", en: "Sandy matrix", pct: 30, c: "#C9B98E" },
        { zh: "胶结物", en: "Cement", pct: 10, c: "#EADFCB" }
      ],
      tips: { zh: "砾石圆滑、大小混杂；砾间为砂泥充填；常指示古河道或古海岸。", en: "Rounded, size-sorted clasts in a sandy matrix; a good indicator of ancient rivers or shorelines." },
      uses: { zh: "建筑石材与混凝土骨料；指示古环境；局部可含金、铀。", en: "Building stone and aggregate; palaeoenvironmental indicator; locally gold- or uranium-bearing." }
    },
    {
      id: "marble", img: "marble.jpg", family: "metamorphic", sub: "nonfoliated",
      name: { zh: "大理岩", en: "Marble" },
      grain: { zh: "粒状变晶 · 糖粒状", en: "Granoblastic · sugary" },
      formation: { zh: "石灰岩在高温高压下重结晶，方解石晶粒变大、边界变得紧密；泥质与铁质杂质形成条带与颜色。", en: "Limestone recrystallises under heat and pressure; calcite grains coarsen and interlock. Clay and iron impurities produce bands and colours." },
      minerals: [
        { zh: "方解石", en: "Calcite", pct: 95, c: "#EADFCB" },
        { zh: "白云石／石英", en: "Dolomite / quartz", pct: 3, c: "#D8CDB4" },
        { zh: "云母／石墨", en: "Mica / graphite", pct: 2, c: "#5A5248" }
      ],
      tips: { zh: "白色或带色带纹；滴稀盐酸起泡；硬度 3，易雕刻；无页理。", en: "White or banded; effervesces in acid; hardness 3, easily carved; no foliation." },
      uses: { zh: "雕塑与建筑装饰、碳酸钙填料、艺术品。", en: "Sculpture and architectural decoration, calcium carbonate filler, art objects." }
    },
    {
      id: "schist", img: "schist.jpg", family: "metamorphic", sub: "foliated",
      name: { zh: "片岩", en: "Schist" },
      grain: { zh: "鳞片变晶 · 1–10 mm", en: "Lepidoblastic · 1–10 mm" },
      formation: { zh: "中级变质作用使云母等片状矿物定向排列并长大，形成可剥开的片理；石榴石等矿物可长成变斑晶。", en: "Medium-grade metamorphism aligns and coarsens platy micas into a foliation that can be split; garnet and other minerals grow as porphyroblasts." },
      minerals: [
        { zh: "云母", en: "Mica", pct: 40, c: "#6B6257" },
        { zh: "石英", en: "Quartz", pct: 35, c: "#B9C6CC" },
        { zh: "长石", en: "Feldspar", pct: 10, c: "#D98E7A" },
        { zh: "石榴石／绿泥石", en: "Garnet / chlorite", pct: 15, c: "#3F5E4A" }
      ],
      tips: { zh: "片理面闪光（云母），可用手指剥开；常含石榴石变斑晶。", en: "Micaceous sheen on the foliation plane; splits by hand; garnet porphyroblasts common." },
      uses: { zh: "建筑碎石；石榴石可作研磨料；部分片岩含石棉。", en: "Crushed stone; garnet as abrasive; some schists contain asbestos." }
    },
    {
      id: "gneiss", img: "gneiss.jpg", family: "metamorphic", sub: "foliated",
      name: { zh: "片麻岩", en: "Gneiss" },
      grain: { zh: "条带状 · 1–10 mm", en: "Banded · 1–10 mm" },
      formation: { zh: "高级变质作用使矿物发生分异：浅色的石英与长石与暗色的云母、角闪石分别聚集，形成明暗相间的条带，条带可被褶皱弯曲。", en: "High-grade metamorphism segregates felsic quartz and feldspar from mafic mica and hornblende into light and dark bands that may be folded." },
      minerals: [
        { zh: "石英", en: "Quartz", pct: 30, c: "#B9C6CC" },
        { zh: "钾长石", en: "K-feldspar", pct: 30, c: "#D98E7A" },
        { zh: "斜长石", en: "Plagioclase", pct: 20, c: "#EADFCB" },
        { zh: "黑云母／角闪石", en: "Biotite / hornblende", pct: 20, c: "#4A4038" }
      ],
      tips: { zh: "明暗相间的条带，条带可弯曲成褶皱；晶粒比片岩粗。", en: "Alternating light and dark bands that may be folded; coarser than schist." },
      uses: { zh: "建筑石材与路基材料；局部含石榴石、石墨。", en: "Building stone and road base; locally garnet- or graphite-bearing." }
    },
    {
      id: "slate", img: "slate.jpg", family: "metamorphic", sub: "foliated",
      name: { zh: "板岩", en: "Slate" },
      grain: { zh: "变余泥质 · <0.1 mm", en: "Pelitic · <0.1 mm" },
      formation: { zh: "页岩在低级变质条件下，黏土矿物重结晶为细小的云母与绿泥石，形成与层理斜交的板状劈理。", en: "Under low-grade metamorphism, clay minerals in shale recrystallise into fine mica and chlorite, producing slaty cleavage oblique to bedding." },
      minerals: [
        { zh: "云母／绿泥石", en: "Mica / chlorite", pct: 50, c: "#6B6257" },
        { zh: "石英", en: "Quartz", pct: 30, c: "#B9C6CC" },
        { zh: "黏土／有机质", en: "Clay / organic matter", pct: 20, c: "#3A3A36" }
      ],
      tips: { zh: "可劈成平整薄板，表面暗哑，敲击声脆；比片岩更细。", en: "Splits into flat sheets, matte surface, rings when struck; finer than schist." },
      uses: { zh: "屋面瓦、地板、黑板与书写板、文化石。", en: "Roofing, flooring, blackboards and writing slates, cladding." }
    }
  ];

  var cycle = [
    { id: "melt", name: { zh: "熔融", en: "Melting" }, from: "metamorphic", to: "magma",
      body: { zh: "温度超过岩石的固相线，或俯冲带流体降低熔点，岩石部分熔融形成岩浆。放射性生热与构造挤压是主要热源。", en: "Rock crosses its solidus, or fluids in a subduction zone lower the melting point, producing magma. Radiogenic heat and tectonic compression drive it." },
      energy: { zh: "地球内热", en: "Earth's internal heat" } },
    { id: "crystallize", name: { zh: "冷却结晶", en: "Crystallisation" }, from: "magma", to: "igneous",
      body: { zh: "岩浆上升、减压、散热，矿物按鲍文反应序列依次结晶。冷却慢则晶粒粗（侵入岩），冷却快则细粒或玻璃质（喷出岩）。", en: "As magma rises, decompresses and cools, minerals crystallise in Bowen's sequence. Slow cooling gives coarse grains; fast cooling gives fine grains or glass." },
      energy: { zh: "热量散失", en: "Heat loss" } },
    { id: "weather", name: { zh: "风化与侵蚀", en: "Weathering & erosion" }, from: "igneous", to: "sediment",
      body: { zh: "温度变化、冻融、水与酸、植物根系把岩石物理破碎并化学分解，形成碎屑与溶解离子。", en: "Temperature cycling, freeze–thaw, water and acids, and plant roots break rock physically and chemically into debris and dissolved ions." },
      energy: { zh: "太阳能与重力", en: "Sunlight and gravity" } },
    { id: "transport", name: { zh: "搬运与沉积", en: "Transport & deposition" }, from: "sediment", to: "sediment",
      body: { zh: "河流、风、冰川与海浪按粒度分选搬运碎屑，在盆地、三角洲与海底扇沉积下来，形成层理。", en: "Rivers, wind, ice and waves sort and carry debris, depositing it in basins, deltas and submarine fans as layered beds." },
      energy: { zh: "重力与水／风", en: "Gravity, water and wind" } },
    { id: "lithify", name: { zh: "成岩作用", en: "Lithification" }, from: "sediment", to: "sedimentary",
      body: { zh: "沉积物被上覆层压实、孔隙水排出，胶结物（硅质、钙质、铁质）沉淀，松散颗粒固结成岩。", en: "Overburden compacts the sediment, pore water is expelled and cement (silica, calcite, iron oxide) precipitates, turning loose grains into rock." },
      energy: { zh: "上覆压力", en: "Overburden pressure" } },
    { id: "metamorphose", name: { zh: "变质作用", en: "Metamorphism" }, from: "sedimentary", to: "metamorphic",
      body: { zh: "温度高于 200 °C、压力增大或有流体参与时，矿物在固态下重结晶、长大或生成新矿物；片状矿物定向排列形成片理。", en: "Above ~200 °C, with rising pressure or fluids, minerals recrystallise in the solid state. Aligned platy minerals produce foliation." },
      energy: { zh: "地热与构造应力", en: "Geothermal heat and stress" } },
    { id: "uplift", name: { zh: "抬升与剥露", en: "Uplift & exposure" }, from: "metamorphic", to: "igneous",
      body: { zh: "构造抬升与侵蚀不断剥离上覆岩层，把深部岩石带回地表，再次进入风化循环。", en: "Tectonic uplift and erosion strip the overburden, returning deep rocks to the surface and back into the weathering cycle." },
      energy: { zh: "构造运动与重力", en: "Tectonics and gravity" } },
    { id: "remelt", name: { zh: "深熔", en: "Anatexis" }, from: "metamorphic", to: "magma",
      body: { zh: "温度继续升高，长英质矿物优先熔融，形成花岗质熔体；熔体上升可再次结晶为岩浆岩。", en: "At higher temperature the felsic minerals melt first, producing granitic melt that rises and crystallises again as igneous rock." },
      energy: { zh: "地球内热", en: "Earth's internal heat" } }
  ];

  var mohs = [
    { h: 1, zh: "滑石", en: "Talc", note: { zh: "指甲可刻", en: "Scratched by a fingernail" } },
    { h: 2, zh: "石膏", en: "Gypsum", note: { zh: "指甲（2.5）可刻", en: "Scratched by a fingernail (2.5)" } },
    { h: 3, zh: "方解石", en: "Calcite", note: { zh: "铜币（3.5）可刻", en: "Scratched by a copper coin (3.5)" } },
    { h: 4, zh: "萤石", en: "Fluorite", note: { zh: "小刀易刻", en: "Easily scratched by a knife" } },
    { h: 5, zh: "磷灰石", en: "Apatite", note: { zh: "小刀（5.5）可刻", en: "Scratched by a knife (5.5)" } },
    { h: 6, zh: "正长石", en: "Orthoclase", note: { zh: "钢锉可刻，玻璃划不动", en: "Scratched by a file; will not scratch glass" } },
    { h: 7, zh: "石英", en: "Quartz", note: { zh: "可划伤玻璃", en: "Scratches glass" } },
    { h: 8, zh: "黄玉", en: "Topaz", note: { zh: "可划伤石英", en: "Scratches quartz" } },
    { h: 9, zh: "刚玉", en: "Corundum", note: { zh: "仅次于金刚石", en: "Second only to diamond" } },
    { h: 10, zh: "金刚石", en: "Diamond", note: { zh: "自然界最硬", en: "The hardest natural mineral" } }
  ];

  var tests = [
    { zh: "条痕", en: "Streak", body: { zh: "把矿物在无釉瓷板上划出粉末的颜色。条痕常比标本本色更稳定，赤铁矿的樱红色条痕就是典型例子。", en: "The colour of the powder left on unglazed porcelain. Streak is more consistent than the specimen colour — hematite's cherry-red streak is the classic case." } },
    { zh: "解理与断口", en: "Cleavage & fracture", body: { zh: "解理沿原子键较弱的面裂开，形成平整闪亮的平面；断口则是不规则的破裂。方解石的菱面体解理与石英的贝壳状断口形成鲜明对比。", en: "Cleavage follows planes of weaker bonding, giving flat shiny faces; fracture is irregular. Calcite's rhombohedral cleavage contrasts sharply with quartz's conchoidal fracture." } },
    { zh: "光泽", en: "Lustre", body: { zh: "金属光泽（黄铁矿）、玻璃光泽（石英）、金刚光泽（金刚石）、丝绢光泽（孔雀石）、珍珠光泽（云母）。", en: "Metallic (pyrite), vitreous (quartz), adamantine (diamond), silky (malachite), pearly (mica)." } },
    { zh: "酸反应与磁性", en: "Acid & magnetism", body: { zh: "碳酸盐遇稀盐酸起泡放出 CO₂；磁铁矿可被磁铁吸引。两个简单测试就能排除大量候选矿物。", en: "Carbonates fizz in dilute HCl, releasing CO₂; magnetite is attracted to a magnet. Two simple tests eliminate many candidates." } }
  ];

  var refs = [
    { zh: "Mindat 矿物数据库（矿物学数据与产状）", en: "Mindat mineral database (species data and occurrences)", url: "https://www.mindat.org/" },
    { zh: "USGS — 岩石与矿物基础资料", en: "USGS — rocks and minerals background", url: "https://www.usgs.gov/programs/mineral-resources-program" },
    { zh: "Encyclopaedia Britannica — 岩石类型与岩石循环", en: "Encyclopaedia Britannica — rock types and the rock cycle", url: "https://www.britannica.com/science/rock-geology" },
    { zh: "IMA-CNMNC 矿物分类与命名", en: "IMA-CNMNC mineral classification and nomenclature", url: "https://www.ima-mineralogy.org/" },
    { zh: "Klein & Hurlbut, Manual of Mineralogy（硬度、解理与晶系）", en: "Klein & Hurlbut, Manual of Mineralogy (hardness, cleavage, crystal systems)", url: "" },
    { zh: "维基共享资源（全部标本照片的来源与授权）", en: "Wikimedia Commons (source and licence of every specimen photograph)", url: "https://commons.wikimedia.org/" }
  ];

  return { minerals: minerals, classes: classes, families: families, rocks: rocks, cycle: cycle, mohs: mohs, tests: tests, refs: refs };
})();
