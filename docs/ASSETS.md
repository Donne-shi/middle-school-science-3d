# 素材与授权记录

MIT 许可证只用于本项目可授权的原创代码和文档。第三方素材须按各自的授权条款使用，并在此逐项记录来源、作者、许可版本、是否修改及展示位置。

## 已接入：牛顿车库

源文件由项目作者提供，位于 `newton-motion-lab/`，包括页面、样式、脚本、单文件版和预览图。公开副本位于 `site/demos/physics/newton-garage/`；仅在网站版 `index.html` 增加返回物理学的链接和样式，课程演示主体保持原样。预览图为用户提供的页面截图。演示依赖本地 `assets/three.min.js`，文件头注明 Three.js r128、2010–2021 three.js authors、MIT；完整许可文本保存在同目录的 `THREE_LICENSE.txt`。

## 已接入：简单机械 3D 实验室

源文件由项目作者提供，位于 `WorkBuddy AI/simple-machines-3d/`。公开副本位于 `site/demos/physics/simple-machines/`，包含六种简单机械的双语互动演示。原有的 `app.js`、`scenes.js`、`styles.css` 和 `three.min.js` 原样复制；仅在网站版 `index.html` 添加返回物理学的链接和两份独立的导航样式、脚本。没有发现外部图片或在线运行依赖。本地 `three.min.js` 文件头注明 2010–2023 The Three.js Authors、MIT；许可文本见同目录 `THREE_LICENSE.txt`。原始目录未修改。

## 旧版原子图鉴：仅本地备份

旧版页面及副本保留在 Git 忽略的 `preview/demos/chemistry/atomic-atlas/`，不在化学入口显示，也不纳入公开站点。

旧版展示的是历史模型，电子云是概率分布的教学可视化，不应把颜色、路径和比例视作原子的真实照片。其原稿提到的具体馆藏和书目没有逐条引用记录。

## 已接入：原子模型2400年

作者提供的 `WorkBuddy/科学课程/原子模型2400年.html` 已导入 `site/demos/chemistry/atom-history/index.html`，本地备份位于 `preview/demos/chemistry/atom-history/index.html`。`scripts/import_atom_history.py` 在网站副本中添加返回“原子结构”专题的链接，并随页面的中英文切换同步返回链接语言；原始文件不修改。页面使用内嵌 Canvas 2D 绘制时间线卡片和模型，没有外部图片、字体或脚本依赖。入口预览图 `site/assets/atom-history-preview.png` 是作者提供的页面截图，未修改。

## 已接入：细胞能量图鉴

源文件由项目作者提供，位于 `WorkBuddy/科学课程/细胞能量图鉴.html`。公开副本为 `site/demos/biology/cell-energy/index.html`；原稿保持不变。公开副本增加生物学返回入口、随站点语言切换的导航，以及两张独立的 AI 生成教学插画。叶绿体图为 `assets/chloroplast-ai.png`，线粒体图为 `assets/mitochondrion-ai.png`，均于 2026-10-23 为本项目生成；无外部照片或贴图输入。它们是结构示意图，不是显微照片，颜色、比例和细节不可当作真实标本测量依据。图旁的功能解释由可切换的中英文 HTML 文字提供。

公开副本修正了光合 ATP 合酶质子数、光反应 ATP 产量等容易误导的定值表述。修订依据与教学边界见 [细胞能量内容依据](CELL_ENERGY_REFERENCES.md)。

## 本地预览：细胞形态图鉴

作者提供的原始单文件位于 `WorkBuddy/科学课程/细胞图鉴-单文件版.html`，包含 26 个教学示意模型和 26 张内嵌显微照片。`scripts/import_cell_atlas.py` 只生成 Git 忽略的 `preview/demos/biology/cell-atlas/index.html`，不修改原文件。预览副本增加返回专题的链接，并将封面“3 个域”改为“3 大类”。

原文件在 `PHOTO_META` 中为照片列出作者、许可及 Wikimedia Commons 页面，但这些声明尚未逐项核对；其中圆筛藻图片的来源页为空。**在逐张核对来源、作者、许可版本和是否改动之前，不要把内嵌照片或完整演示副本提交到公开仓库。**MIT 许可证不覆盖这些照片。

## 已接入：太阳系行星图鉴与地球到火星

作者提供的天文学 `site/` 文件夹含九个单页。`scripts/import_local_demos.py` 将全部九页导入 Git 忽略的本地预览，其中太阳系结构、宇宙大爆炸、黑洞、星座图解、落入天王星、人类登月、恒星图鉴七页同时导入公开目录。这七页未发现嵌入的照片或行星贴图；画面主要由页面自身的 CSS、Canvas 或 WebGL 程序绘制。原始文件保持不变，公开副本增加返回天文学的入口。这里的模型是教学示意，具体比例、时间和科学解释仍需逐页审阅。

项目作者于 2026-10-24 提供了贴图来源、许可及核对记录。原始单页位于 `WorkBuddy/科学课程/太阳系行星图鉴.html` 与 `WorkBuddy/科学课程/site/earth-to-mars.html`；公开副本位于 `site/demos/solar-system/atlas.html` 与 `site/demos/solar-system/earth-to-mars.html`。公开副本增加返回天文学入口，演示主体与贴图署名保留。Solar System Scope 说明这些贴图依据 NASA 高程与影像数据整理，并按真实色彩照片调色；许可为 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。署名指向 [Solar System Scope 贴图页](https://www.solarsystemscope.com/textures/)及许可文本。

| 用途 | 工作区贴图 | 原输入文件与来源 | 来源与授权、改动 |
| --- | --- | --- | --- |
| 地球 | `tex_earth.jpg` | [`2k_earth_daymap.jpg`](https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg) (`earth_0.jpeg`) | Solar System Scope · CC BY 4.0；1024×512 缩放并以 JPEG q84 重压缩 |
| 火星 | `tex_mars.jpg` | [`2k_mars.jpg`](https://www.solarsystemscope.com/textures/download/2k_mars.jpg) (`earth_1.jpeg`) | Solar System Scope · CC BY 4.0；1024×512 缩放并以 JPEG q80 重压缩 |
| 木星 | `tex_jupiter.jpg` | [`2k_jupiter.jpg`](https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg) (`jupiter_0.jpeg`) | Solar System Scope · CC BY 4.0；尺寸不变，以 JPEG q76 重压缩 |
| 土星 | `tex_saturn.jpg` | [`2k_saturn.jpg`](https://www.solarsystemscope.com/textures/download/2k_saturn.jpg) (`saturn_0.jpeg`) | Solar System Scope · CC BY 4.0；尺寸不变，以 JPEG q78 重压缩 |

作者记录：木星、土星文件与官网 2K 下载字节相同；地球、火星为同图重压缩，灰度平均差分别为 1.6、2.7 级，结构相关系数分别为 0.99999、0.99997。行星图鉴开场屏和详情面板常驻署名“行星贴图（缩图）· Solar System Scope · CC BY 4.0”；“缩图”说明了尺寸缩放和重压缩。地球到火星页内嵌 `earth_0.jpeg` 与 `earth_1.jpeg` 的原始 2048×1024 文件，署名说明原样内嵌、未作修改。

太阳、水星、金星、天王星、海王星、月球与冥王星贴图由 `solar-system/gen_textures.py` 使用噪声、环形山场和色带程序生成。该脚本记录为无第三方素材输入。天体轨道、直径、温度等数值参考 NASA/JPL 公开资料；轨道、小行星带、星系和恒星图由程序绘制。新增素材时请补充记录，不要仅写“来自 NASA”或“网上图片”。

## 已接入：暗物质与暗能量

源文件由项目作者提供，位于 `WorkBuddy/科学课程/dark-universe.html`；公开页面为 `site/demos/solar-system/dark-universe.html`，本地预览为 `preview/demos/solar-system/dark-universe.html`。演示场景由页面内的 WebGL2、Canvas 和 CSS 程序生成，没有外部图片、字体或脚本依赖。公开副本增加返回宇宙专题的入口，并把介绍文字调整为区分暗物质的引力证据与暗能量和宇宙加速膨胀的关系。

质能密度比例采用 ESA/Planck 公开的近似值：普通物质 4.9%、暗物质 26.8%、暗能量 68.3%；这些是宇宙学观测与模型推断的参考比例，不是每一种成分的直接称重结果。演示中的交互几何仅为教学示意。来源：[ESA Planck cosmic recipe](https://www.esa.int/ESA_Multimedia/Images/2013/03/Planck_cosmic_recipe)。专题卡片预览图 `site/assets/astronomy-dark-universe.png` 是项目作者随需求提供的页面截图，未改动。

## 已接入：太阳系行星图鉴入口截图

`content/images/solar-system-atlas-preview.png` 为项目作者提供的太阳系图鉴首页截图（1600×1000），用于太阳系专题中的《太阳系行星图鉴》入口卡片，未修改。截图展示演示首页界面，不作为太阳系天体数据或贴图来源。构建脚本将其复制到 `site/assets/`。

## 已接入：月相与食

作者提供的《月相与食》单文件源稿 已接入 `site/demos/solar-system/moon-phases-large.html`，本地预览副本位于 `preview/demos/solar-system/moon-phases-large.html`。演示以 WebGL2、Canvas 和 CSS 程序绘制太阳、地球、月球、月相及日月食示意，没有外部图片或模型素材；网站副本仅调整返回入口及语言切换后的返回链接，源文件保持不变。画面中的天体大小、距离和轨道倾角用于说明几何关系，不应视作统一比例模型。

专题卡片预览图 `site/assets/moon-phases-preview.png` 来自作者随需求提供的 1600×1000 页面截图，未修改。该截图展示日食场景；卡片以静态截图帮助用户预览演示内容。

## 已接入：病毒图鉴

作者提供的《病毒图鉴》单文件源稿 已复制为 `site/demos/biology/virus-atlas/index.html`，原稿不修改。该单文件内嵌七张电子显微镜图像及 Canvas/WebGL 教学模型，不需额外素材文件或 3D 运行库；网站副本仅修改页面标题，并添加返回生物学入口。模型和电镜均为不同性质的内容，页面逐图显示图像说明、来源页与许可。

| 图像 | 标注来源 | 使用依据 |
| --- | --- | --- |
| 腺病毒 | CDC / Dr. G. William Gary, Jr.；1981；PHIL #237，B82-0142 | 公有领域；[Wikimedia Commons 文件页](https://commons.wikimedia.org/wiki/File:Adenovirus_transmission_electron_micrograph_B82-0142_lores.jpg)注明 CDC 提供者与公有领域；出于礼貌仍保留来源署名。 |
| H-1 细小病毒 | CDC / R. Regnery；E. L. Palmer；1981；EID 24(2) | 公有领域；[CDC EID 图注](https://wwwnc.cdc.gov/eid/article/24/2/et-2402-f1)及原页面图注。 |
| 轮状病毒 | Dr Graham Beards；2007 | CC BY 3.0；[Commons 文件页](https://commons.wikimedia.org/wiki/File:Multiple_rotavirus_particles.jpg)与[许可文本](https://creativecommons.org/licenses/by/3.0/)。 |
| 烟草花叶病毒 | USDA ARS 电镜室；作者不详 | 公有领域；[Commons 文件页](https://commons.wikimedia.org/wiki/File:TobaccoMosaicVirus.jpg)。 |
| 甲型流感病毒 | CDC / Dr. Erskine Palmer；1981；PHIL #280 | 公有领域；[Commons 文件页](https://commons.wikimedia.org/wiki/File:Influenza_A_-_late_passage.jpg)。 |
| HIV-1 | NIAID Integrated Research Facility, Fort Detrick | CC BY 2.0；[Commons 文件页](https://commons.wikimedia.org/wiki/File:HIV-1_Virus_Particles_Replicating_(52532597341).jpg)与[许可文本](https://creativecommons.org/licenses/by/2.0/)。 |
| 乙肝病毒 | CDC；PHIL #5631 | 公有领域；[CDC PHIL 原始页面](https://phil.cdc.gov/Details.aspx?pid=5631)要求再发布时注明 CDC 和已知摄影者，并指出 CDC 网站为免费来源。 |

网页图像署名、许可链接及“显微镜不记录可见光颜色、数字着色为后期赋予”等说明随每张图展示。CDC 页面说明：公有领域图像再发布仍需注明 CDC，并在已知时注明摄影者；CC BY 图片须署名、链接许可并说明修改情况。完整许可不因仓库代码采用 MIT 而改变。


## 已接入：人体系统图鉴

作者提供的《人体图鉴》单文件源稿 已复制为 `site/demos/biology/human-systems/index.html`，原稿未修改。页面用程序化 SDF 几何和 WebGL2 实时生成九大人体系统模型；没有外部图片、字体、脚本或模型文件依赖。网站副本仅修改页面标题，并在工具栏增加返回生物学入口。

原页面提供中英文系统与器官说明，并明确模型依据解剖教材和 Terminologia Anatomica 常见术语、不是医学影像或扫描数据；系统单独归一化取景，比例不可跨系统比较，不适用于诊断、手术规划或尺寸测量。建议教学使用时保留页面中的模型边界说明。
