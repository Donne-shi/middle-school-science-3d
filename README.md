# 牛顿科学探索馆 · Newton Science Discovery Center

面向中学科学课堂与自主探索的静态多页面网站，设有物理学、天文学、生物学、化学四个学科入口。每个学科首页和每个演示都有独立地址；内容随课程制作逐步加入。

目前已开放物理学《牛顿车库》和化学《原子图鉴》互动演示。天文学的太阳系行星图鉴与太阳系结构页可在本地预览；**这些演示的部分贴图来源尚未核实，因此本地导入的演示被 Git 忽略，未纳入公开仓库。**详情见 [素材与授权记录](docs/ASSETS.md)。

## 页面结构

```text
site/index.html                                四学科总入口
site/subjects/astronomy/index.html             天文学独立入口
site/subjects/physics/index.html               物理学独立入口
site/subjects/biology/index.html               生物学独立入口
site/subjects/chemistry/index.html             化学独立入口
site/topics/astronomy/solar-system/index.html  太阳系专题
site/topics/physics/forces-and-motion/index.html 力与运动专题
site/demos/physics/newton-garage/index.html    牛顿车库独立入口
site/topics/chemistry/atomic-structure/index.html 原子结构专题
site/demos/chemistry/atomic-atlas/index.html    原子图鉴独立入口
preview/                                       本地演示预览，Git 忽略
```

所有入口采用相对链接和本地样式文件，不依赖前端框架或运行时接口。单独打开学科首页时，导航仍可使用。每页右上角可切换中文 / English；语言选择会随站内链接传递，并与《牛顿车库》《原子图鉴》的语言设置保持一致。首页直接显示内容，不播放开场动画。《牛顿车库》需要支持 WebGL 的浏览器；《原子图鉴》使用 Canvas 绘制。建议通过本地 HTTP 服务预览。

## 本地预览

在仓库根目录运行：

```bash
python3 scripts/build_site.py --local
python3 scripts/import_local_demos.py --source /path/to/科学课程/site
python3 scripts/check_site.py --local
python3 -m http.server 8000 --directory preview
```

浏览器访问 `http://localhost:8000/`。公开版本运行 `python3 scripts/build_site.py` 构建到 `site/`，再运行 `python3 scripts/check_site.py`。公开版的牛顿车库和原子图鉴可直接打开；太阳系演示保留介绍卡片，素材核查前不显示无效链接。本地预览版会自动复制已公开的演示，并可打开导入的太阳系单页。

导入脚本只读取提供的源目录，并在仓库内生成本地预览副本。它不会修改原始演示文件。生成副本增加“返回太阳系专题”入口，并修正地球与木星的对比标签、太阳系结构的返回链接，以及地火转移中的一句易误解文案。每次源页面更新后，可重新运行导入命令。

## 添加内容

1. 在 [`content/catalog.json`](content/catalog.json) 登记学科、专题和演示的名称、介绍与路径。
2. 运行 `python3 scripts/build_site.py` 更新公开入口页面；使用 `--local` 更新本地预览。
3. 将核对过来源和授权的演示页面接入对应路径，将课程目录项设为 `"published": true`，并运行 `python3 scripts/check_site.py` 检查站内链接。
4. 在浏览器检查桌面、窄屏、键盘导航、WebGL2 回退提示和科学内容。

目录生成方式见 [网站结构说明](docs/SITE_ARCHITECTURE.md)，原子图鉴的教学边界见 [内容依据](docs/ATOMIC_ATLAS_REFERENCES.md)，发布前检查见 [发布清单](docs/PUBLISH_CHECKLIST.md)。

## 参与贡献与授权

欢迎提供科学内容纠错、浏览器兼容和课堂使用反馈。提交前请阅读 [贡献指南](CONTRIBUTING.md)。本仓库原创代码采用 [MIT 许可证](LICENSE)。牛顿车库所用 Three.js r128 的授权文本见 [THREE_LICENSE.txt](site/demos/physics/newton-garage/THREE_LICENSE.txt)；第三方图片、贴图等素材按各自授权使用，不能因仓库采用 MIT 而视为 MIT 素材。
