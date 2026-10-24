# 牛顿科学探索馆 · Newton Science Discovery Center

面向中学科学课堂与自主探索的静态多页面网站，设有物理学、天文学、生物学、化学四个学科入口。每个学科首页和每个演示都有独立地址；内容随课程制作逐步加入。

[在线打开牛顿科学探索馆](https://donne-shi.github.io/middle-school-science-3d/)。

目前已开放天文学 11 个独立演示，以及物理学《牛顿车库》《简单机械 3D 实验室》《电与磁 3D 实验室》、生物学《细胞能量图鉴》和化学《原子模型2400年》。总入口另设跨学科的《2026 诺贝尔奖互动实验室》，可切换生理学或医学奖、化学奖与物理学奖并操作三维模型。《太阳系行星图鉴》和《地球到火星》已公开，贴图来源与 CC BY 4.0 署名记录见素材文档；生物学《细胞形态图鉴》仍仅在本地预览，内嵌显微照片待核实授权。详情见 [素材与授权记录](docs/ASSETS.md)。

天文学按太阳系、宇宙现象、恒星与星空、登月探索四个专题组织。各演示可独立打开，返回天文学入口。

## 页面结构

```text
site/index.html                                四学科总入口（含诺贝尔奖跨学科专题）
site/demos/nobel-2026/index.html               2026 诺贝尔奖互动实验室独立入口
site/subjects/astronomy/index.html             天文学独立入口
site/subjects/physics/index.html               物理学独立入口
site/subjects/biology/index.html               生物学独立入口
site/topics/biology/cell-energy/index.html     细胞能量专题
site/demos/biology/cell-energy/index.html      细胞能量图鉴独立入口
site/topics/biology/cell-world/index.html      细胞世界专题
preview/demos/biology/cell-atlas/index.html    细胞形态图鉴本地预览
site/subjects/chemistry/index.html             化学独立入口
site/topics/astronomy/solar-system/index.html  太阳系专题
site/topics/astronomy/universe/index.html      宇宙现象专题
site/topics/astronomy/stellar-sky/index.html   恒星与星空专题
site/topics/astronomy/moon-exploration/index.html 登月探索专题
site/demos/solar-system/*.html                 11 个已公开的天文学独立演示
preview/demos/solar-system/atlas.html          行星图鉴本地预览副本
preview/demos/solar-system/earth-to-mars.html  地火转移本地预览副本
site/topics/physics/forces-and-motion/index.html 力与运动专题
site/demos/physics/newton-garage/index.html    牛顿车库独立入口
site/topics/physics/simple-machines/index.html 简单机械专题
site/demos/physics/simple-machines/index.html  简单机械 3D 实验室独立入口
site/topics/physics/electricity-and-magnetism/index.html 电与磁专题
site/demos/physics/electricity-lab/index.html 电与磁 3D 实验室独立入口
site/topics/chemistry/atomic-structure/index.html 原子结构专题
site/demos/chemistry/atom-history/index.html    原子模型2400年独立入口
preview/                                       本地演示预览，Git 忽略
```

所有站点目录入口采用相对链接和本地样式文件，不依赖前端框架或运行时接口。诺贝尔奖互动实验室保留独立页面与三维依赖，构建时从 `content/demos/nobel-2026/` 复制到 `site/demos/nobel-2026/`；获奖信息的机构来源及模型说明见 [诺贝尔奖参考资料](content/demos/nobel-2026/REFERENCES.md)。单独打开学科首页时，导航仍可使用。目录页右上角可切换中文 / English；语言选择会随目录链接传递，并与《牛顿车库》《简单机械 3D 实验室》《电与磁 3D 实验室》《细胞能量图鉴》《原子模型2400年》的语言设置保持一致。天文学单页保留作者原有的语言支持，其中部分演示正文仍主要为中文。首页直接显示内容，不播放开场动画。《原子模型2400年》使用 Canvas 绘制，可在支持 Canvas 的浏览器中运行。建议通过本地 HTTP 服务预览。

## 本地预览

在仓库根目录运行：

```bash
python3 scripts/import_local_demos.py --source /path/to/科学课程/site
python3 scripts/import_cell_atlas.py --source /path/to/细胞图鉴-单文件版.html
python3 scripts/build_site.py --local
python3 scripts/check_site.py --local
python3 -m http.server 8000 --directory preview
```

浏览器访问 `http://localhost:8000/`。公开版本运行 `python3 scripts/build_site.py` 构建到 `site/`，再运行 `python3 scripts/check_site.py`。公开版可直接打开 11 个天文学演示及其他已开放演示；细胞图鉴保留说明卡片，素材核查前不显示无效链接。本地预览版还包括全部天文学单页以及已导入的细胞图鉴。

天文学导入脚本只读取提供的源目录，不修改原始演示文件。它生成九个本地预览副本，其中七个不含待核对内嵌行星贴图的页面同时写入公开目录；另外，已核实授权的《太阳系行星图鉴》《地球到火星》、作者提供的《暗物质与暗能量》和《月相与食》也已单独接入。生成副本增加返回专题入口，并修正少数页面的标签或返回链接。每次源页面更新后，可重新运行导入命令。

细胞图鉴导入脚本同样不修改原稿。预览副本增加“返回细胞世界”入口，并把封面上的“3 个域”改为“3 大类”，避免将病毒误称为生物学的域。图鉴正文目前为中文，外层课程目录支持中英文切换。

本地 `local_assets/cell-atlas/` 中若放齐图鉴全部 26 张插画，导入脚本会给图鉴增加“结构图”入口。每个标本的示意图均可切换中英文说明，点击数字可查看结构解释；可用上一个、下一个按钮浏览。图片属于待审阅的 AI 教学插画，仅在本地预览中使用；结构依据和局限见 [细胞图鉴结构图说明](docs/CELL_ATLAS_STRUCTURE_IMAGES.md)。

## 添加内容

1. 在 [`content/catalog.json`](content/catalog.json) 登记学科、专题和演示的名称、介绍与路径。
2. 运行 `python3 scripts/build_site.py` 更新公开入口页面；使用 `--local` 更新本地预览。
3. 将核对过来源和授权的演示页面接入对应路径，将课程目录项设为 `"published": true`，并运行 `python3 scripts/check_site.py` 检查站内链接。
4. 在浏览器检查桌面、窄屏、键盘导航、WebGL2 回退提示和科学内容。

目录生成方式见 [网站结构说明](docs/SITE_ARCHITECTURE.md)，旧版原子图鉴备份的教学边界见 [内容依据](docs/ATOMIC_ATLAS_REFERENCES.md)，发布前检查见 [发布清单](docs/PUBLISH_CHECKLIST.md)。

## 参与贡献与授权

欢迎提供科学内容纠错、浏览器兼容和课堂使用反馈。提交前请阅读 [贡献指南](CONTRIBUTING.md)。本仓库原创代码采用 [MIT 许可证](LICENSE)。诺贝尔奖互动实验室和三个物理演示所用 Three.js 的授权文本分别见 [诺贝尔实验室许可](content/demos/nobel-2026/THREE_LICENSE.txt)、 [牛顿车库许可](site/demos/physics/newton-garage/THREE_LICENSE.txt)、[简单机械许可](site/demos/physics/simple-machines/THREE_LICENSE.txt)和[电与磁许可](site/demos/physics/electricity-lab/THREE_LICENSE.txt)；第三方图片、贴图等素材按各自授权使用，不能因仓库采用 MIT 而视为 MIT 素材。
