/* 显微图像来源与许可 —— 全部取自 Wikimedia Commons，逐张核验原始描述页 */
var PHOTO_META = {
  staph: {
    sp: "Staphylococcus aureus", cn: "金黄色葡萄球菌",
    tech: "扫描电镜 SEM", mag: "10,000×",
    lic: "Public domain", licUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    artist: "Janice Carr / CDC（供图：Matthew J. Arduino）",
    title: "Staphylococcus aureus 01.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Staphylococcus_aureus_01.jpg",
    note: "葡萄状簇；耐万古霉素中间型菌株（VISA）培养物"
  },
  pneumo: {
    sp: "Streptococcus pneumoniae", cn: "肺炎链球菌",
    tech: "扫描电镜 SEM", mag: "—",
    lic: "Public domain", licUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    artist: "Janice Haney Carr / CDC",
    title: "Streptococcus pneumoniae-263.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Streptococcus_pneumoniae-263.jpg",
    note: "成对排列的球菌，可见分裂中的细胞与表面荚膜"
  },
  gonorr: {
    sp: "Neisseria gonorrhoeae", cn: "淋病奈瑟菌",
    tech: "彩色扫描电镜 SEM", mag: "—",
    lic: "CC BY 2.0", licUrl: "https://creativecommons.org/licenses/by/2.0/",
    artist: "NIAID / Rocky Mountain Laboratories",
    title: "Neisseria gonorrhoeae Bacteria - 53136008302.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Neisseria_gonorrhoeae_Bacteria_-_53136008302.jpg",
    note: "肾形（咖啡豆形）双球菌，可见细胞间连接的 IV 型菌毛"
  },
  ecoli: {
    sp: "Escherichia coli", cn: "大肠杆菌",
    tech: "扫描电镜 SEM", mag: "12,800×",
    lic: "Public domain", licUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    artist: "CDC / Evangeline Sowers, Janice Carr",
    title: "Escherichia coli (SEM).jpg",
    page: "https://commons.wikimedia.org/wiki/File:Escherichia_coli_(SEM).jpg",
    note: "单根杆状菌体，背景为滤膜孔；标尺 2 µm"
  },
  subtilis: {
    sp: "Bacillus subtilis", cn: "枯草芽孢杆菌",
    tech: "革兰氏染色 · 光学显微镜", mag: "1000×（油镜）",
    lic: "CC BY-SA 3.0", licUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    artist: "Riraq25",
    title: "Bacillus subtilis Gram stain.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Bacillus_subtilis_Gram_stain.jpg",
    note: "革兰阳性（紫色）杆菌，多呈链状排列"
  },
  tb: {
    sp: "Mycobacterium tuberculosis", cn: "结核分枝杆菌",
    tech: "扫描电镜 SEM", mag: "15,549×",
    lic: "Public domain", licUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    artist: "Janice Carr / CDC（供图：Dr. Ray Butler）",
    title: "Mycobacterium tuberculosis.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Mycobacterium_tuberculosis.jpg",
    note: "杆状菌体聚集成束；细胞壁含分枝菌酸，具抗酸性"
  },
  hpyori: {
    sp: "Helicobacter pylori", cn: "幽门螺杆菌",
    tech: "透射电镜 TEM · 负染", mag: "—",
    lic: "Copyrighted free use", licUrl: "https://commons.wikimedia.org/wiki/Template:Copyrighted_free_use",
    artist: "Yutaka Tsutsumi, M.D.（藤田保健卫生大学）",
    title: "EMpylori.jpg",
    page: "https://commons.wikimedia.org/wiki/File:EMpylori.jpg",
    note: "弯曲菌体与一端的多根鞘鞭毛束，为定植胃黏膜的运动器官"
  },
  treponema: {
    sp: "Treponema pallidum", cn: "苍白密螺旋体",
    tech: "改良 Steiner 银染 · 光学显微镜", mag: "—",
    lic: "Public domain", licUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    artist: "CDC / Dr. Edwin P. Ewing, Jr.（PHIL #836）",
    title: "Treponema pallidum 01.png",
    page: "https://commons.wikimedia.org/wiki/File:Treponema_pallidum_01.png",
    note: "组织切片中银染成黑色的细密螺旋体，直径仅约 0.1–0.2 µm"
  },
  vibrio: {
    sp: "Vibrio cholerae", cn: "霍乱弧菌",
    tech: "透射电镜 TEM · 负染", mag: "—",
    lic: "Public domain", licUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    artist: "Tom Kirn, Ron Taylor, Louisa Howard / Dartmouth Electron Microscope Facility",
    title: "Vibrio cholerae.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Vibrio_cholerae.jpg",
    note: "逗号形菌体与一端的单根极生鞭毛（鞭毛束）"
  },
  strepto: {
    sp: "Streptomyces sp.", cn: "链霉菌（属）",
    tech: "光学显微镜 · 菌丝体", mag: "标尺 0.02 mm",
    lic: "CC BY-SA 3.0 DE", licUrl: "https://creativecommons.org/licenses/by-sa/3.0/de/",
    artist: "Hildgund Schrempf",
    title: "Streptomyces-Myzelgeflecht-frei.tif",
    page: "https://commons.wikimedia.org/wiki/File:Streptomyces-Myzelgeflecht-frei.tif",
    note: "分枝菌丝交织成网；该菌株可合成红色细胞毒性化合物"
  },
  anabaena: {
    sp: "Anabaena sp.", cn: "鱼腥藻（属）",
    tech: "光学显微镜", mag: "400×",
    lic: "CC0", licUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    artist: "Berkshire Community College Bioscience Image Library",
    title: "Heterocyst in Anaboena (34993459942).jpg",
    page: "https://commons.wikimedia.org/wiki/File:Heterocyst_in_Anaboena_(34993459942).jpg",
    note: "念珠状丝体，由球形细胞串联而成；丝体中膨大的细胞为异形胞"
  },
  mycoplasma: {
    sp: "Mycoplasma sp.", cn: "支原体（属）",
    tech: "体视显微镜 · 琼脂菌落", mag: "—",
    lic: "CC BY-SA 4.0", licUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    artist: "TheKnowHowe",
    title: "Mycoplasma Howe Bovine Mastitis 2022.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Mycoplasma_Howe_Bovine_Mastitis_2022.jpg",
    note: "Hayflick 琼脂上的「油煎蛋」状菌落——中心致密、边缘薄而铺展"
  }
};

/* 文件名与键名一致：自动补全 file 字段，便于单独取用 */
Object.keys(PHOTO_META).forEach(function (k) {
  if (!PHOTO_META[k].file) PHOTO_META[k].file = k + '.jpg';
});
