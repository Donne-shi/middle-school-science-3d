# 素材与授权记录

MIT 许可证只用于本项目可授权的原创代码和文档。第三方素材须按各自的授权条款使用，并在此逐项记录来源、作者、许可版本、是否修改及展示位置。

## 已接入：牛顿车库

源文件由项目作者提供，位于 `newton-motion-lab/`，包括页面、样式、脚本、单文件版和预览图。公开副本位于 `site/demos/physics/newton-garage/`；仅在网站版 `index.html` 增加返回物理学的链接和样式，课程演示主体保持原样。预览图为用户提供的页面截图。演示依赖本地 `assets/three.min.js`，文件头注明 Three.js r128、2010–2021 three.js authors、MIT；完整许可文本保存在同目录的 `THREE_LICENSE.txt`。

## 已接入：简单机械 3D 实验室

源文件由项目作者提供，位于 `WorkBuddy AI/simple-machines-3d/`。公开副本位于 `site/demos/physics/simple-machines/`，包含六种简单机械的双语互动演示。原有的 `app.js`、`scenes.js`、`styles.css` 和 `three.min.js` 原样复制；仅在网站版 `index.html` 添加返回物理学的链接和两份独立的导航样式、脚本。没有发现外部图片或在线运行依赖。本地 `three.min.js` 文件头注明 2010–2023 The Three.js Authors、MIT；许可文本见同目录 `THREE_LICENSE.txt`。原始目录未修改。

## 已接入：原子图鉴

源页面、样式、脚本与说明由项目作者提供，原始目录为 `Documents/gemini/科学模型/`。公开副本位于 `site/demos/chemistry/atomic-atlas/`；本项目在副本中调整明亮主题、窄屏排版、站内导航与部分科学表述。页面中的模型与背景由本地 Canvas 和 CSS 绘制，未发现单独的外部图片或字体文件。原始目录未修改。

历史模型展示的是当时的认识，电子云是概率分布的教学可视化，不应把颜色、路径和比例视作原子的真实照片。原稿提到的具体馆藏和书目未提供逐条引用，因此新版页面未将它们作为资料来源宣称。

## 本地预览：细胞形态图鉴

作者提供的原始单文件位于 `WorkBuddy/科学课程/细胞图鉴-单文件版.html`，包含 26 个教学示意模型和 26 张内嵌显微照片。`scripts/import_cell_atlas.py` 只生成 Git 忽略的 `preview/demos/biology/cell-atlas/index.html`，不修改原文件。预览副本增加返回专题的链接，并将封面“3 个域”改为“3 大类”。

原文件在 `PHOTO_META` 中为照片列出作者、许可及 Wikimedia Commons 页面，但这些声明尚未逐项核对；其中圆筛藻图片的来源页为空。**在逐张核对来源、作者、许可版本和是否改动之前，不要把内嵌照片或完整演示副本提交到公开仓库。**MIT 许可证不覆盖这些照片。

## 首版待核对贴图

当前工作区的太阳系图鉴含四张由既有图片处理得到的贴图。生成脚本只记录了本地输入文件名，没有记录原始发布页面或授权。它们及嵌入这些贴图的生成页面暂不进入公开版本，直到来源与许可核对完成，或改用来源清楚的替代贴图。

| 用途 | 工作区贴图 | 原输入文件 | 来源与授权 |
| --- | --- | --- | --- |
| 地球 | `tex_earth.jpg` | `earth_0.jpeg` | 待核对 |
| 火星 | `tex_mars.jpg` | `earth_1.jpeg` | 待核对 |
| 木星 | `tex_jupiter.jpg` | `jupiter_0.jpeg` | 待核对 |
| 土星 | `tex_saturn.jpg` | `saturn_0.jpeg` | 待核对 |

其他行星贴图由脚本程序生成；公开前仍需确认脚本本身及所依赖的输入都可发布。新增素材时请补充记录，不要仅写“来自 NASA”或“网上图片”。
