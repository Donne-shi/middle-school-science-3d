/* =============================================================================
   疫苗与抗生素 · 内容数据层
   课程结构：4 个单元 · 9 讲
   每讲字段：[目标] goal / objectives · [讲解] explain / terms / key
             [实验] task · [自测] check
   科学数值取自 WHO / CDC / 药典常用教学口径
   ========================================================================== */
window.CONTENT = (function () {
  "use strict";

  /* ------------------------------------------------------------ 单元结构 --- */
  var units = [
    {
      id: "u1",
      no: "I",
      title: { zh: "病原体", en: "Pathogens" },
      note: { zh: "先分清敌人，才谈得上策略。", en: "Tell the enemies apart before choosing a strategy." },
      range: [0, 1]
    },
    {
      id: "u2",
      no: "II",
      title: { zh: "免疫与疫苗", en: "Immunity & Vaccines" },
      note: { zh: "先让身体学会认人，再谈怎么提前教它。", en: "The body learns to recognise first; only then can we teach it in advance." },
      range: [2, 4]
    },
    {
      id: "u3",
      no: "III",
      title: { zh: "抗生素与耐药", en: "Antibiotics & Resistance" },
      note: { zh: "药物不制造耐药，它只做选择。", en: "Drugs do not create resistance. They select it." },
      range: [5, 6]
    },
    {
      id: "u4",
      no: "IV",
      title: { zh: "群体与决策", en: "Populations & Decisions" },
      note: { zh: "疫苗的好处会外溢，耐药的代价也会外溢。", en: "The benefit of a vaccine spills over; so does the cost of resistance." },
      range: [7, 8]
    }
  ];

  /* ---------------------------------------------------------------- 章节 --- */
  var chapters = [

    /* ======================================================== 第 1 讲 === */
    {
      id: "intro",
      no: "01",
      unit: 0,
      kicker: { zh: "导论", en: "Prologue" },
      nav: { zh: "两场战争", en: "Two Fronts" },
      title: { zh: "两场战争，<em>一条防线</em>", en: "Two Fronts, <em>One Defence</em>" },
      sub: { zh: "课程导览 · COURSE OVERVIEW", en: "疫苗与抗生素 · 课程导览" },
      lede: {
        zh: "一支疫苗和一颗胶囊，常被收进同一个抽屉。可它们的逻辑恰好相反：一个提前教会免疫系统认人，一个替免疫系统直接开火。",
        en: "A vaccine and a capsule are often kept in the same drawer. Their logic is opposite: one teaches the immune system to recognise an enemy in advance, the other opens fire on its behalf."
      },
      goal: {
        zh: "学完本讲，你能说清疫苗与抗生素各自站在防线的哪个位置。",
        en: "By the end of this lesson you can say exactly where vaccines and antibiotics stand on the defensive line."
      },
      objectives: [
        { zh: "用「防线位置」区分预防与治疗", en: "Separate prevention from treatment by position on the line" },
        { zh: "说出疫苗与抗生素各自对谁有效、对谁无效", en: "State what each one can and cannot act on" },
        { zh: "知道四个单元分别要解决什么问题", en: "Know what each of the four units sets out to solve" }
      ],
      explain: [
        {
          h: { zh: "① 两条防线，位置不同", en: "① Two lines, two positions" },
          p: {
            zh: "**预防**把防线前移：在病原体进入身体之前就完成部署。**治疗**在防线失守之后反击。疫苗属于前者，抗生素属于后者。二者不是替代关系，而是时间轴上的两个不同位置。",
            en: "**Prevention** moves the line forward — deployment finishes before the pathogen arrives. **Treatment** counter-attacks after the line is breached. Vaccines sit in the first category, antibiotics in the second. They are not substitutes; they are two positions on one timeline."
          }
        },
        {
          h: { zh: "② 一个教认人，一个直接开火", en: "② One teaches, one fires" },
          p: {
            zh: "疫苗**不杀任何东西**。它只递上一份通缉令，让免疫系统提前完成识别、扩增与记忆。抗生素**真的杀菌**，但它需要细菌身上存在可以被破坏的结构——所以对病毒完全无能为力。",
            en: "A vaccine **kills nothing**. It circulates a wanted poster so the immune system can finish recognition, expansion and memory early. An antibiotic **does kill**, but it needs a structure on the bacterium that can be broken — which is why it is inert against viruses."
          }
        },
        {
          h: { zh: "③ 这门课的四个问题", en: "③ Four questions, in order" },
          p: {
            zh: "**这是谁**（单元 I）→ **身体怎么打，又怎么被提前教会**（单元 II）→ **已经感染了，药打在哪里、为什么失效**（单元 III）→ **这些选择放进人群意味着什么**（单元 IV）。四步是接力的：前一步没弄清，后一步就只能背结论。每一讲都按同一条单行线推进——先给目标，再逐步讲解，然后动手，最后自测。",
            en: "**Who is this** (Unit I) → **how the body fights, and how it can be taught in advance** (Unit II) → **once infected, where a drug strikes and why it stops working** (Unit III) → **what these choices mean in a population** (Unit IV). Each step hands off to the next; skip one and the rest become memorisation. Every lesson runs on the same single track: aim, step-by-step explanation, takeaway, practise, check."
          }
        }
      ],
      terms: [
        { t: { zh: "预防", en: "Prophylaxis" }, d: { zh: "在发病之前降低感染概率的干预。", en: "Any intervention that lowers the chance of infection before disease." } },
        { t: { zh: "治疗", en: "Therapy" }, d: { zh: "针对已经发生的感染使用药物。", en: "Drugs given to an infection that has already occurred." } },
        { t: { zh: "防线前移", en: "Moving the line forward" }, d: { zh: "把资源从「救治」转向「不发生」。", en: "Shifting resources from rescue to non-occurrence." } }
      ],
      key: {
        zh: "疫苗争取**时间**，抗生素争取**空间**。时间用来建立记忆，空间用来清空菌量。",
        en: "Vaccines buy **time**; antibiotics buy **space**. Time builds memory; space clears the bacterial load."
      },
      task: {
        name: { zh: "读图入门", en: "Read the map" },
        steps: [
          { zh: "看左侧课程目录：四个单元、九讲，当前是第 1 讲。", en: "Look at the syllabus: four units, nine lessons. You are in lesson 1." },
          { zh: "拖动画面旋转一圈——左边是病毒，右边是细菌，尺寸比例刻意放大到同一量级。", en: "Orbit the scene once: virus on the left, bacterium on the right, deliberately scaled to the same order of magnitude." },
          { zh: "按「下一步」把本讲走完，最后一步的自测答完，就进入下一讲。", en: "Press Next to walk the whole lesson; finish the check on the last step to move on." }
        ],
        expect: {
          zh: "病毒只是一个壳加一团遗传物质；细菌是一整个细胞。这个差别，是后面所有用药选择的起点。",
          en: "The virus is a shell around genetic material; the bacterium is a whole cell. That difference is the origin of every prescribing decision that follows."
        }
      },
      check: [
        {
          q: { zh: "关于疫苗与抗生素的区别，下列说法正确的是：", en: "Which statement correctly separates a vaccine from an antibiotic?" },
          opts: [
            { zh: "疫苗杀死病原体，抗生素抑制其繁殖", en: "The vaccine kills the pathogen; the antibiotic inhibits growth" },
            { zh: "疫苗训练免疫系统，抗生素直接作用于病原体", en: "The vaccine trains the immune system; the antibiotic acts on the pathogen directly" },
            { zh: "两者都只对细菌有效", en: "Both act only on bacteria" },
            { zh: "抗生素可以替代疫苗做预防", en: "Antibiotics can replace vaccines for prevention" }
          ],
          a: 1,
          fb: {
            zh: "疫苗提供的是「识别与记忆」，本身不杀菌；抗生素直接破坏细菌结构。一个在感染前，一个在感染后。",
            en: "A vaccine supplies recognition and memory and kills nothing; an antibiotic breaks bacterial structures directly. One acts before infection, one after."
          }
        }
      ],
      legend: []
    },

    /* ======================================================== 第 2 讲 === */
    {
      id: "targets",
      no: "02",
      unit: 0,
      kicker: { zh: "单元 I · 病原体", en: "Unit I · Pathogens" },
      nav: { zh: "认清敌人", en: "Know the Enemy" },
      title: { zh: "病毒<em>不是</em>细胞", en: "A Virus Is <em>Not</em> a Cell" },
      sub: { zh: "VIRUS vs BACTERIUM", en: "病毒 vs 细菌" },
      lede: {
        zh: "病毒和细菌都能让你发烧，但它们在生物学上隔着一整个界。这一句差别，决定了后面所有的用药选择。",
        en: "Both give you a fever, yet a virus and a bacterium sit on opposite sides of biology. That one difference decides every prescribing choice that follows."
      },
      goal: {
        zh: "学完本讲，你能从结构上分辨病毒与细菌，并据此判断抗生素是否可能有效。",
        en: "By the end of this lesson you can tell a virus from a bacterium by structure, and judge whether an antibiotic could possibly work."
      },
      objectives: [
        { zh: "指出病毒与细菌在结构上的三项关键差别", en: "Name three structural differences between viruses and bacteria" },
        { zh: "解释「选择性毒性」为什么依赖这些差别", en: "Explain why selective toxicity depends on those differences" },
        { zh: "判断一次抗生素处方对病毒性感冒是否合理", en: "Judge whether an antibiotic is justified for a viral cold" }
      ],
      explain: [
        {
          h: { zh: "① 病毒：一份图纸，一个信封", en: "① A virus: a blueprint in an envelope" },
          p: {
            zh: "病毒只有遗传物质（DNA 或 RNA）和一层蛋白衣壳，部分还带脂质外包膜。它没有细胞壁、没有核糖体、没有代谢酶系统。离开宿主细胞，它连复制都做不到——它不是「很小的细胞」，而是**不是细胞**。",
            en: "A virus is genetic material — DNA or RNA — inside a protein capsid, sometimes wrapped in a lipid envelope. No cell wall, no ribosome, no metabolic enzymes. Outside a host cell it cannot even replicate: it is not a small cell, it is **not a cell**."
          }
        },
        {
          h: { zh: "② 细菌：一整个细胞", en: "② A bacterium: a whole cell" },
          p: {
            zh: "细菌是完整的单细胞生命：肽聚糖**细胞壁**、细胞膜、**70S 核糖体**、环状 DNA、质粒、鞭毛。它能自己摄取营养、自己分裂。它有可以被精确破坏的机器，也就有了可以被药物瞄准的靶点。",
            en: "A bacterium is a complete single-celled organism: a peptidoglycan **cell wall**, a membrane, **70S ribosomes**, circular DNA, plasmids, flagella. It feeds itself and divides itself. It owns machinery that can be broken precisely — which means it owns targets a drug can aim at."
          }
        },
        {
          h: { zh: "③ 选择性毒性：药为什么只伤敌人", en: "③ Selective toxicity: why the drug spares you" },
          p: {
            zh: "抗生素的靶点几乎都长在「细菌有、人体细胞没有」的结构上：肽聚糖细胞壁、70S 核糖体（人体是 80S）、细菌特有的 DNA 旋转酶。**靶点不存在，药物就无处下手**——这不是剂量问题，是结构问题。",
            en: "Nearly every antibiotic target sits on a structure bacteria have and human cells do not: peptidoglycan walls, 70S ribosomes (human cells are 80S), bacterial gyrase. **No target, no effect** — a structural problem, not a dosing one."
          }
        }
      ],
      terms: [
        { t: { zh: "衣壳 Capsid", en: "Capsid" }, d: { zh: "包裹病毒遗传物质的蛋白外壳。", en: "The protein shell enclosing viral genetic material." } },
        { t: { zh: "肽聚糖", en: "Peptidoglycan" }, d: { zh: "细菌细胞壁的网状骨架，青霉素的作用底物。", en: "The mesh of the bacterial wall — the substrate penicillin blocks." } },
        { t: { zh: "选择性毒性", en: "Selective toxicity" }, d: { zh: "药物只伤病原体、不伤宿主细胞的性质。", en: "A drug harming the pathogen while sparing host cells." } },
        { t: { zh: "70S / 80S 核糖体", en: "70S vs 80S ribosome" }, d: { zh: "细菌与人体细胞的蛋白合成机器，沉降系数不同。", en: "Protein factories of bacteria and human cells, differing in sedimentation rate." } }
      ],
      key: {
        zh: "抗生素对病毒无效，不是因为剂量不够，而是因为**病毒身上根本没有可打的靶点**。",
        en: "Antibiotics fail against viruses not for lack of dose, but because **a virus carries no target to hit**."
      },
      task: {
        name: { zh: "结构对照", en: "Structure audit" },
        steps: [
          { zh: "在实验台切换「完整 / 透视解剖」，把细菌切开看内部。", en: "Toggle Intact / Cutaway to open the bacterium up." },
          { zh: "依次点击画面上的标记：病毒的刺突、衣壳、RNA；细菌的细胞壁、核糖体、质粒。", en: "Click the markers in turn: spike, capsid, RNA on the virus; wall, ribosome, plasmid on the bacterium." },
          { zh: "阅读信息卡，把两侧的结构清单并排比较。", en: "Read the cards and lay the two structure lists side by side." }
        ],
        expect: {
          zh: "病毒一侧只有三四个部件，没有一个是「代谢机器」；细菌一侧是完整的细胞装置。抗生素的靶点全部落在细菌这一侧。",
          en: "The virus side has three or four parts and not one metabolic machine; the bacterium side is a full cellular apparatus. Every antibiotic target falls on the bacterial side."
        }
      },
      check: [
        {
          q: { zh: "为什么青霉素对人体细胞的毒性很低？", en: "Why is penicillin so weakly toxic to human cells?" },
          opts: [
            { zh: "人体细胞修复损伤的能力更强", en: "Human cells repair damage better" },
            { zh: "人体细胞没有细胞壁，青霉素无靶点可打", en: "Human cells have no cell wall — nothing for penicillin to hit" },
            { zh: "青霉素只作用于病毒", en: "Penicillin only acts on viruses" },
            { zh: "人体细胞能主动分解青霉素", en: "Human cells actively degrade penicillin" }
          ],
          a: 1,
          fb: {
            zh: "青霉素阻断肽聚糖交联。人体细胞根本没有细胞壁，因此无从被攻击——这就是选择性毒性。",
            en: "Penicillin blocks peptidoglycan cross-linking. Human cells have no wall to attack — that is selective toxicity."
          }
        },
        {
          q: { zh: "一位患者确诊为病毒性咽痛。此时开抗生素的主要后果是：", en: "A patient has confirmed viral pharyngitis. The main consequence of prescribing an antibiotic is:" },
          opts: [
            { zh: "加快康复", en: "Faster recovery" },
            { zh: "无治疗收益，只在菌群中施加选择压力", en: "No therapeutic gain, only selection pressure on the flora" },
            { zh: "增强免疫力", en: "Stronger immunity" },
            { zh: "预防所有继发感染", en: "Prevention of all secondary infection" }
          ],
          a: 1,
          fb: {
            zh: "没有靶点就没有疗效，但药物仍会杀死共生菌中的敏感株、留下耐药株。收益接近零，成本不为零。",
            en: "No target, no effect — yet the drug still kills susceptible commensals and spares resistant ones. Near-zero benefit, non-zero cost."
          }
        }
      ],
      legend: [
        { c: "var(--path)", t: { zh: "病毒结构", en: "Viral parts" } },
        { c: "var(--abx)", t: { zh: "细菌结构", en: "Bacterial parts" } }
      ]
    },

    /* ======================================================== 第 3 讲 === */
    {
      id: "train",
      no: "03",
      unit: 1,
      kicker: { zh: "单元 II · 免疫应答", en: "Unit II · Immune Response" },
      nav: { zh: "免疫演习", en: "The Drill" },
      title: { zh: "一场<em>演习</em>，不是战争", en: "A <em>Drill</em>, Not a War" },
      sub: { zh: "ANTIGEN → ANTIBODY", en: "抗原 → 抗体" },
      lede: {
        zh: "疫苗的全部技巧，是让免疫系统在不生病的前提下，走完一次完整的应战流程。",
        en: "The whole trick of vaccination is to let the immune system complete a full response without anyone getting ill."
      },
      goal: {
        zh: "学完本讲，你能按顺序复述体液免疫应答的五个环节，并指出疫苗在哪一步「抄了近路」。",
        en: "By the end of this lesson you can recite the five steps of humoral immunity in order, and say exactly which step a vaccine short-circuits."
      },
      objectives: [
        { zh: "按顺序说出：摄取 → 呈递 → 识别 → 克隆扩增 → 分化", en: "Order the steps: uptake → presentation → recognition → clonal expansion → differentiation" },
        { zh: "区分浆细胞与记忆 B 细胞的分工", en: "Distinguish plasma cells from memory B cells" },
        { zh: "解释疫苗为什么不需要让人真正感染", en: "Explain why vaccination needs no real infection" }
      ],
      explain: [
        {
          h: { zh: "① 抗原进入与摄取", en: "① Antigen enters, is taken up" },
          p: {
            zh: "注射进肌肉的抗原被树突状细胞等**抗原呈递细胞**吞下，在溶酶体里被切成碎片。这一步是「取样」。",
            en: "Antigen injected into muscle is swallowed by dendritic cells and other **antigen-presenting cells**, then chopped into fragments in the lysosome. This step is sampling."
          }
        },
        {
          h: { zh: "② 呈递与识别", en: "② Presentation and recognition" },
          p: {
            zh: "碎片被挂到 **MHC-II** 分子上，随细胞迁移到淋巴结，交给辅助 T 细胞。T 细胞确认「这是外来物」，发出激活信号。没有 T 细胞的许可，B 细胞不会启动。",
            en: "Fragments are mounted on **MHC-II** and carried to a lymph node for helper T cells. The T cell confirms the antigen is foreign and issues the activation signal. Without T-cell permission, B cells do not start."
          }
        },
        {
          h: { zh: "③ 克隆扩增", en: "③ Clonal expansion" },
          p: {
            zh: "表面受体恰好匹配这个抗原的 B 细胞被选中，在生发中心高速分裂——几天内从几十个变成上万个。免疫系统用**复制**而不是「生产」来放大信号。",
            en: "The B cell whose surface receptor matches is selected and divides hard in the germinal centre — dozens become tens of thousands in days. The system amplifies by **copying**, not by manufacturing."
          }
        },
        {
          h: { zh: "④ 分化：两条出路", en: "④ Differentiation: two fates" },
          p: {
            zh: "一部分子代成为**浆细胞**，每秒分泌上千个抗体；另一部分成为**记忆 B 细胞**，不分泌任何东西，只是留在淋巴结里等待——可以等几十年。",
            en: "Some offspring become **plasma cells** secreting thousands of antibodies per second; others become **memory B cells** that secrete nothing and simply wait in the lymph node — sometimes for decades."
          }
        },
        {
          h: { zh: "⑤ 中和与清除", en: "⑤ Neutralisation and clearance" },
          p: {
            zh: "抗体结合病原体表面的抗原，阻断它进入细胞（**中和**），并招募补体与吞噬细胞清理残局。整个过程不需要你真的病一场。",
            en: "Antibodies bind surface antigen, block entry (**neutralisation**) and recruit complement and phagocytes to clear up. None of it requires you to actually fall ill."
          }
        }
      ],
      terms: [
        { t: { zh: "抗原", en: "Antigen" }, d: { zh: "能被免疫系统特异性识别的分子结构。", en: "A molecular structure the immune system recognises specifically." } },
        { t: { zh: "克隆扩增", en: "Clonal expansion" }, d: { zh: "被选中的淋巴细胞大量复制自身。", en: "A selected lymphocyte copying itself at scale." } },
        { t: { zh: "浆细胞", en: "Plasma cell" }, d: { zh: "专职分泌抗体的终末分化 B 细胞。", en: "A terminally differentiated B cell devoted to antibody secretion." } },
        { t: { zh: "中和", en: "Neutralisation" }, d: { zh: "抗体封住病原体入侵位点，使其失去感染力。", en: "Antibody blocking the pathogen's entry site, removing infectivity." } }
      ],
      key: {
        zh: "疫苗只删掉了「生病」这一段，**识别、扩增、记忆一步都没少**。",
        en: "A vaccine deletes only the illness. **Recognition, expansion and memory all remain.**"
      },
      task: {
        name: { zh: "逐步放映", en: "Step-through" },
        steps: [
          { zh: "在实验台点击五个阶段按钮：抗原进入 → 识别 → 克隆扩增 → 抗体分泌 → 中和与记忆。", en: "Click the five stage buttons: antigen enters → recognition → clonal expansion → antibody release → neutralisation & memory." },
          { zh: "把进度条拖回第 3、4 步之间反复播放，盯住细胞数量的变化。", en: "Scrub back between steps 3 and 4 repeatedly and watch the cell count." },
          { zh: "播完后点「重播全过程」，一气看完。", en: "Finish with Replay to watch it in one pass." }
        ],
        expect: {
          zh: "扩增阶段的数量是陡直上升，不是线性增加。一周左右的病程，本质是这套流程正在从零启动。",
          en: "The expansion curve goes near-vertical, not linear. A week-long illness is essentially this sequence starting from zero."
        }
      },
      check: [
        {
          q: { zh: "疫苗能在不致病的前提下产生保护，关键原因是：", en: "A vaccine protects without causing disease because:" },
          opts: [
            { zh: "疫苗含抗生素，可杀死病原体", en: "It contains antibiotics that kill the pathogen" },
            { zh: "疫苗保留了抗原信息，跳过了真正的感染过程", en: "It keeps the antigen information and skips the actual infection" },
            { zh: "疫苗直接向血液注射抗体", en: "It injects antibodies straight into the blood" },
            { zh: "疫苗让人体永久携带病原体", en: "It makes the body carry the pathogen permanently" }
          ],
          a: 1,
          fb: {
            zh: "疫苗提供的是抗原信息——足够识别、扩增、建立记忆，但不足以致病。直接注射抗体属于被动免疫，不是疫苗。",
            en: "A vaccine supplies antigen information: enough to recognise, expand and remember, not enough to cause disease. Injecting antibodies is passive immunisation, not vaccination."
          }
        },
        {
          q: { zh: "记忆 B 细胞与浆细胞最重要的区别是：", en: "The key difference between memory B cells and plasma cells is:" },
          opts: [
            { zh: "记忆细胞不分泌抗体，只长期存活待命", en: "Memory cells secrete nothing and simply persist on standby" },
            { zh: "记忆细胞不识别抗原", en: "Memory cells cannot recognise antigen" },
            { zh: "浆细胞寿命更长", en: "Plasma cells live longer" },
            { zh: "两者完全相同，只是名称不同", en: "They are identical, only named differently" }
          ],
          a: 0,
          fb: {
            zh: "浆细胞是「当下的火力」，寿命几天到几周；记忆细胞是「未来的预案」，不分泌抗体，靠存活时间换反应速度。",
            en: "Plasma cells are today's firepower, lasting days to weeks; memory cells are the contingency plan — no secretion, just longevity traded for speed."
          }
        }
      ],
      legend: [
        { c: "var(--vac)", t: { zh: "B 细胞 / 抗体", en: "B cell / antibody" } },
        { c: "var(--path)", t: { zh: "抗原", en: "Antigen" } }
      ]
    },
    /* ======================================================== 第 4 讲 === */
    {
      id: "memory",
      no: "04",
      unit: 1,
      kicker: { zh: "单元 II · 免疫记忆", en: "Unit II · Memory" },
      nav: { zh: "第二次更快", en: "The Second Time" },
      title: { zh: "第二次，<em>快得多</em>", en: "The Second Time, <em>Faster</em>" },
      sub: { zh: "PRIMARY vs SECONDARY", en: "初次应答 vs 二次应答" },
      lede: {
        zh: "同一个病原体第二次进来，反应会快上三到五倍，强度高出一到两个数量级。疫苗要买的，就是这个差价。",
        en: "When the same pathogen returns, the response is three to five times faster and one to two orders of magnitude stronger. That is the premium a vaccine buys."
      },
      goal: {
        zh: "学完本讲，你能读懂抗体浓度–时间曲线，并用它解释加强针为什么必要。",
        en: "By the end of this lesson you can read an antibody titre curve and use it to justify booster doses."
      },
      objectives: [
        { zh: "说出初次与二次应答在潜伏期、峰值、抗体类型上的差别", en: "Compare primary and secondary responses in lag, peak and antibody class" },
        { zh: "解释抗体浓度为什么会随时间衰减", en: "Explain why antibody titres decay over time" },
        { zh: "用曲线说明加强针的作用机制", en: "Use the curve to explain what a booster actually does" }
      ],
      explain: [
        {
          h: { zh: "① 潜伏期：先天的拖延战", en: "① The lag phase: innate immunity stalls" },
          p: {
            zh: "抗原进入后 3–5 天内几乎测不到抗体。这段时间靠**先天免疫**（炎症、干扰素、NK 细胞）撑住——撑住了就不发病，撑不住就出现症状。",
            en: "For three to five days almost no antibody is detectable. **Innate immunity** — inflammation, interferon, NK cells — holds the line. Hold it and there is no disease; fail and symptoms begin."
          }
        },
        {
          h: { zh: "② 初次应答：慢、低、短", en: "② Primary response: slow, low, brief" },
          p: {
            zh: "IgM 先出现，随后**类别转换**为 IgG。峰值低，衰减快，几周后血清里只剩痕迹。一次自然感染换来的，往往就是这样一份不太够用的保护。",
            en: "IgM appears first, then **class switching** to IgG. The peak is low and decays fast; weeks later only a trace remains. One natural infection often buys exactly this — protection that is not quite enough."
          }
        },
        {
          h: { zh: "③ 二次应答：快、高、久", en: "③ Secondary response: fast, high, lasting" },
          p: {
            zh: "记忆 B 细胞被迅速召回，几乎跳过潜伏期；以高亲和力 IgG 为主，峰值可高出一到两个数量级，并维持数年。同样的抗原，不同的结果。",
            en: "Memory B cells are recalled at speed, all but skipping the lag; mostly high-affinity IgG, peaking one to two orders of magnitude higher and lasting years. Same antigen, different outcome."
          }
        },
        {
          h: { zh: "④ 抗体不是一直高，而是「随时能高」", en: "④ Not always high — always ready" },
          p: {
            zh: "抗体浓度本身会衰减，但记忆细胞不会。**加强针补的不是抗体，是记忆细胞**：再扩增一批、再做一轮亲和力成熟，把「随时能高」的响应上限抬高。",
            en: "Titre decays; memory does not. **A booster tops up memory cells, not antibodies**: another round of expansion and affinity maturation, raising the ceiling of the ready response."
          }
        }
      ],
      terms: [
        { t: { zh: "初次应答", en: "Primary response" }, d: { zh: "首次接触抗原时的慢速、低峰值反应。", en: "The slow, low-peak response to first contact." } },
        { t: { zh: "二次应答", en: "Secondary response" }, d: { zh: "记忆细胞介导的快速、高峰值反应。", en: "The fast, high-peak response mediated by memory cells." } },
        { t: { zh: "类别转换", en: "Class switching" }, d: { zh: "B 细胞把 IgM 换成 IgG/IgA/IgE 的过程。", en: "A B cell swapping IgM for IgG, IgA or IgE." } },
        { t: { zh: "加强针", en: "Booster" }, d: { zh: "用同一抗原再次扩增记忆细胞群。", en: "A repeat antigen dose that re-expands the memory pool." } }
      ],
      key: {
        zh: "保护不等于抗体常年很高，而等于**再次遇到时，能在发病前把抗体拉起来**。",
        en: "Protection is not a permanently high titre. It is **the ability to raise one before disease, on re-exposure**."
      },
      task: {
        name: { zh: "曲线对照", en: "Curve comparison" },
        steps: [
          { zh: "实验台默认「已接种」：把时间轴从第 0 天拖到第 60 天，看清曲线的两段。", en: "With Vaccinated selected, drag the timeline from day 0 to day 60 and read both humps." },
          { zh: "切到「未接种」，同样拖一遍，比较两组在第 34 天之后的表现。", en: "Switch to Unvaccinated and repeat; compare what happens after day 34." },
          { zh: "估算两组峰值的倍数关系，记在纸上。", en: "Estimate the ratio between the two peaks and write it down." }
        ],
        expect: {
          zh: "未接种组在第 10–14 天出现一个低矮的峰，随后衰减；已接种组在第 34 天左右再遇抗原，几天内冲上高得多的峰。这就是记忆细胞的价值。",
          en: "The naive group peaks low around day 10–14 then decays; the vaccinated group meets antigen again near day 34 and spikes far higher within days. That is what memory buys."
        }
      },
      check: [
        {
          q: { zh: "两剂疫苗之间通常间隔数周，主要目的是：", en: "Why are two doses usually weeks apart?" },
          opts: [
            { zh: "让第一剂的抗体先降到零，避免冲突", en: "Let the first dose's antibody fall to zero to avoid conflict" },
            { zh: "给记忆细胞足够时间形成并扩增，使第二剂引发更强的二次应答", en: "Give memory cells time to form and expand, so the second dose drives a stronger secondary response" },
            { zh: "减少注射时的疼痛", en: "Reduce injection pain" },
            { zh: "让疫苗在体内慢慢溶解", en: "Let the vaccine dissolve slowly" }
          ],
          a: 1,
          fb: {
            zh: "间隔期正是生发中心筛选与记忆细胞建立的窗口。间隔太短，二次应答就无从谈起——这是免疫程序里最容易被忽视的一条。",
            en: "The interval is the window for germinal-centre selection and memory formation. Too short and there is no secondary response to speak of — the most overlooked detail in any schedule."
          }
        },
        {
          q: { zh: "抗体浓度在接种数月后明显下降，这意味着：", en: "Titre falls noticeably months after vaccination. This means:" },
          opts: [
            { zh: "疫苗已经失效，保护归零", en: "The vaccine has failed and protection is gone" },
            { zh: "记忆细胞仍在，再次接触抗原时可快速拉起抗体", en: "Memory cells persist and can raise antibody fast on re-exposure" },
            { zh: "必须立刻重新接种全部剂次", en: "The whole series must be restarted immediately" }
          ],
          a: 1,
          fb: {
            zh: "血清抗体是消耗品，记忆细胞是资产。滴度下降不等于保护消失，但确实意味着需要评估加强免疫。",
            en: "Serum antibody is consumable; memory is capital. Falling titre is not lost protection, but it does mean boosters deserve consideration."
          }
        }
      ],
      legend: [
        { c: "var(--ink-3)", t: { zh: "未接种", en: "Unvaccinated" } },
        { c: "var(--vac)", t: { zh: "已接种", en: "Vaccinated" } }
      ]
    },

    /* ======================================================== 第 5 讲 === */
    {
      id: "types",
      no: "05",
      unit: 1,
      kicker: { zh: "单元 II · 疫苗平台", en: "Unit II · Platforms" },
      nav: { zh: "五种教法", en: "Five Platforms" },
      title: { zh: "五种<em>教法</em>", en: "Five Ways to <em>Teach</em>" },
      sub: { zh: "VACCINE PLATFORMS", en: "疫苗技术路线" },
      lede: {
        zh: "同样一句「给免疫系统看画像」，交付方式可以完全不同：一具尸体、一个活着的弱者、一块碎片、一个快递员，或一张图纸。",
        en: "The same brief — show the immune system a portrait — can be delivered five ways: a corpse, a weakened live specimen, a fragment, a courier, or a blueprint."
      },
      goal: {
        zh: "学完本讲，你能说出五条主流疫苗技术路线的原理、代价与代表产品。",
        en: "By the end of this lesson you can state the principle, the cost and a real example for each of the five mainstream platforms."
      },
      objectives: [
        { zh: "按「抗原形态」给五种平台分类", en: "Sort the five platforms by the form of antigen they deliver" },
        { zh: "为给定情境（冷链不足 / 急需扩产 / 免疫缺陷人群）选出合适平台", en: "Pick a platform for a given constraint: no cold chain, urgent scale-up, immunocompromised recipients" },
        { zh: "解释 mRNA 疫苗为什么不需要培养病原体", en: "Explain why mRNA vaccines need no pathogen culture" }
      ],
      explain: [
        {
          h: { zh: "① 灭活疫苗 — 一具完整的尸体", en: "① Inactivated — an intact corpse" },
          p: {
            zh: "化学或热力杀死病原体，保留外形供识别。安全性高、稳定性好，免疫缺陷者也可用，但免疫原性弱，通常需多剂加佐剂，且不诱导黏膜免疫。例：狂犬、脊灰 IPV、部分流感疫苗。",
            en: "Killed chemically or with heat while keeping the shape intact. Very safe and stable, usable in immunocompromise, but weakly immunogenic: multiple doses plus adjuvant, and no mucosal immunity. Examples: rabies, IPV, some influenza vaccines."
          }
        },
        {
          h: { zh: "② 减毒活疫苗 — 活着的弱者", en: "② Live attenuated — a weakened specimen" },
          p: {
            zh: "病原体被削弱到不致病，但仍能有限复制。免疫原性最强，常只需一剂，还能诱导黏膜免疫。代价是免疫缺陷者禁用，极少数情况下可能回复毒力。例：麻腮风、水痘、口服脊灰。",
            en: "The pathogen is weakened until it no longer causes disease but still replicates a little. The strongest immunogen, often one dose, and it induces mucosal immunity. The price: contraindicated in immunocompromise, with a rare risk of reversion. Examples: MMR, varicella, oral polio."
          }
        },
        {
          h: { zh: "③ 亚单位 / 重组蛋白 — 一块碎片", en: "③ Subunit / recombinant — one fragment" },
          p: {
            zh: "只给关键抗原蛋白，例如乙肝表面抗原、HPV 的 L1 衣壳蛋白。纯度高、副反应少、可精确设计，但需要强佐剂，且抗原构象必须做对，否则免疫系统认不出来。",
            en: "Only the key antigen protein — hepatitis B surface antigen, HPV L1 capsid protein. High purity, few reactions, precise design; but it needs a strong adjuvant, and the conformation must be right or the immune system will not recognise it."
          }
        },
        {
          h: { zh: "④ 载体疫苗 — 一个快递员", en: "④ Viral vector — a courier" },
          p: {
            zh: "用无害病毒（多为腺病毒）把抗原基因送进细胞，让细胞自己表达抗原。诱导的 T 细胞应答强，但预存免疫可能中和载体，使加强剂效果下降。例：部分埃博拉疫苗、腺病毒载体新冠疫苗。",
            en: "A harmless virus — usually an adenovirus — delivers the antigen gene so cells express the antigen themselves. Strong T-cell responses, but pre-existing immunity may neutralise the vector and blunt repeat doses. Examples: some Ebola vaccines, adenoviral COVID-19 vaccines."
          }
        },
        {
          h: { zh: "⑤ mRNA 疫苗 — 一张图纸", en: "⑤ mRNA — a blueprint" },
          p: {
            zh: "脂质纳米粒包裹 mRNA，进入细胞后直接翻译出抗原蛋白。**不需要培养病原体**，因此从测序到临床前样品只需数周；代价是超低温冷链与较高的单剂成本。",
            en: "A lipid nanoparticle carries mRNA that cells translate into antigen. **No pathogen culture is needed**, so a preclinical sample can follow sequencing within weeks; the price is ultracold logistics and higher cost per dose."
          }
        }
      ],
      terms: [
        { t: { zh: "免疫原性", en: "Immunogenicity" }, d: { zh: "一个抗原引发免疫应答的能力。", en: "The capacity of an antigen to provoke a response." } },
        { t: { zh: "佐剂", en: "Adjuvant" }, d: { zh: "增强抗原免疫原性的添加物，如铝盐。", en: "An additive that strengthens the response, e.g. aluminium salts." } },
        { t: { zh: "脂质纳米粒", en: "Lipid nanoparticle" }, d: { zh: "包裹并护送 mRNA 进入细胞的脂质球。", en: "A lipid sphere that encapsulates and delivers mRNA." } },
        { t: { zh: "预存免疫", en: "Pre-existing immunity" }, d: { zh: "人群中对载体病毒已有的抗体，会削弱载体疫苗。", en: "Existing antibodies to the vector, which weaken vector vaccines." } }
      ],
      key: {
        zh: "平台没有绝对优劣，只有**与病原体、人群、冷链、产能的匹配**。",
        en: "No platform wins outright — only **the fit between platform, pathogen, population, cold chain and capacity**."
      },
      task: {
        name: { zh: "平台对比", en: "Platform matrix" },
        steps: [
          { zh: "在实验台依次点击五种平台，读右侧的 PRO / CON / 代表产品。", en: "Click each of the five platforms and read PRO / CON / examples." },
          { zh: "给每一种标出「抗原形态」：完整活体 / 完整死体 / 片段 / 基因 / mRNA。", en: "Label the antigen form for each: live / killed / fragment / gene / mRNA." },
          { zh: "设想一种全新病毒，要求六个月内部署：哪种平台最快？哪种最稳？", en: "Imagine a novel virus and a six-month deadline: which platform is fastest, which is most robust?" }
        ],
        expect: {
          zh: "越靠「图纸」（mRNA、载体），研发与扩产越快，但对冷链与递送要求越高；越靠「完整病原体」，免疫原性越好，但生产慢、风险高。",
          en: "The closer to a blueprint (mRNA, vector), the faster the design and scale-up, and the heavier the cold-chain demand. The closer to a whole pathogen, the better the immunogenicity — and the slower and riskier the production."
        }
      },
      check: [
        {
          q: { zh: "「灭活疫苗」意味着：", en: "An inactivated vaccine means:" },
          opts: [
            { zh: "只含一段抗原蛋白", en: "It contains only an antigen fragment" },
            { zh: "病原体已被杀死，但保留抗原外形", en: "The pathogen is killed but its antigenic shape is kept" },
            { zh: "用 mRNA 让细胞自己造抗原", en: "mRNA instructs cells to build the antigen" },
            { zh: "用无害病毒运送抗原基因", en: "A harmless virus delivers the antigen gene" }
          ],
          a: 1,
          fb: {
            zh: "灭活疫苗用化学或热力杀死病原体、保留外形供识别，因此安全性高但免疫原性较弱，通常需要佐剂与多剂次。",
            en: "Inactivated vaccines kill the pathogen chemically or with heat while preserving its shape, so they are very safe but weakly immunogenic — hence adjuvants and multiple doses."
          }
        },
        {
          q: { zh: "给免疫缺陷患者选择疫苗时，最需要避开的是：", en: "For an immunocompromised patient, the platform to avoid is:" },
          opts: [
            { zh: "灭活疫苗", en: "Inactivated" },
            { zh: "亚单位疫苗", en: "Subunit" },
            { zh: "减毒活疫苗", en: "Live attenuated" },
            { zh: "mRNA 疫苗", en: "mRNA" }
          ],
          a: 2,
          fb: {
            zh: "减毒活疫苗依赖有限的复制来产生免疫，免疫缺陷者可能无法控制这次复制，从而真的发病。灭活与亚单位平台没有这个问题。",
            en: "Live attenuated vaccines rely on limited replication to immunise; an immunocompromised host may not contain that replication and can fall ill. Inactivated and subunit platforms carry no such risk."
          }
        }
      ],
      legend: [
        { c: "var(--vac)", t: { zh: "抗原", en: "Antigen" } },
        { c: "var(--immune)", t: { zh: "递送载体", en: "Delivery" } }
      ]
    },

    /* ======================================================== 第 7 讲 === */
    {
      id: "abx",
      no: "06",
      unit: 2,
      kicker: { zh: "单元 III · 抗生素", en: "Unit III · Antibiotics" },
      nav: { zh: "五个靶点", en: "Five Targets" },
      title: { zh: "细菌的五道<em class='abx'>防线</em>", en: "Five Bacterial <em class='abx'>Targets</em>" },
      sub: { zh: "MECHANISMS OF ACTION", en: "作用机制" },
      lede: {
        zh: "疫苗那条线先收起来——我们已经知道怎么提前训练免疫系统。现在换另一条线：**已经感染了，怎么办**。抗生素不是一种药，而是五类针对不同结构的攻击方式，每一种都对应细菌身上一个可以被精确破坏的零件。",
        en: "Set the vaccine thread aside — we now know how to train the immune system in advance. The other thread begins **after** infection. An antibiotic is not one thing but five families of attack, each against a structure that can be broken precisely."
      },
      goal: {
        zh: "学完本讲，你能把五类抗生素与其作用靶点一一对应，并解释它们为什么对细菌有选择性。",
        en: "By the end of this lesson you can pair each antibiotic class with its target and explain what makes them selective."
      },
      objectives: [
        { zh: "把五类机制与对应的细菌结构一一对应", en: "Match the five mechanisms to five bacterial structures" },
        { zh: "说出 β-内酰胺类与氨基糖苷类的作用差别", en: "Contrast β-lactams with aminoglycosides" },
        { zh: "解释广谱抗生素为什么带来更大的菌群扰动", en: "Explain why broad-spectrum drugs disturb the flora more" }
      ],
      explain: [
        {
          h: { zh: "① 细胞壁 — 肽聚糖交联被打断", en: "① Cell wall — cross-linking blocked" },
          p: {
            zh: "**β-内酰胺类**（青霉素、头孢）抑制转肽酶，肽聚糖无法交联，细菌在低渗环境中吸水胀裂。人体细胞没有细胞壁，所以这一击只落在细菌身上。杀菌性，时间依赖。",
            en: "**β-lactams** (penicillins, cephalosporins) inhibit transpeptidase, peptidoglycan cannot cross-link, and the cell bursts osmotically in a hypotonic medium. Human cells have no wall, so the blow lands only on bacteria. Bactericidal and time-dependent."
          }
        },
        {
          h: { zh: "② 30S 核糖体 — 让密码被读错", en: "② 30S ribosome — the code is misread" },
          p: {
            zh: "**氨基糖苷类**（庆大霉素、阿米卡星）结合 30S 亚基，使 mRNA 被误读，产生无功能甚至有毒的蛋白，并破坏膜完整性。浓度依赖性杀菌，有耳毒性与肾毒性。",
            en: "**Aminoglycosides** (gentamicin, amikacin) bind the 30S subunit so mRNA is misread, producing non-functional or toxic protein and disrupting membrane integrity. Concentration-dependent killing, with ototoxicity and nephrotoxicity."
          }
        },
        {
          h: { zh: "③ 50S 核糖体 — 堵住流水线", en: "③ 50S ribosome — the line is jammed" },
          p: {
            zh: "**大环内酯类**（阿奇霉素）、氯霉素结合 50S 亚基，阻断肽链延伸。多为**抑菌**而非杀菌——细菌不死，只是停止生长，最终靠免疫系统清除。",
            en: "**Macrolides** (azithromycin) and chloramphenicol bind the 50S subunit and block elongation. Mostly **bacteriostatic** rather than bactericidal — the bacteria stop growing and the immune system finishes the job."
          }
        },
        {
          h: { zh: "④ DNA 旋转酶 — 剪断之后不接上", en: "④ Gyrase — cut without re-ligating" },
          p: {
            zh: "**氟喹诺酮类**（左氧氟沙星）抑制 DNA 旋转酶，造成双链断裂。组织穿透好、胞内浓度高，但影响软骨发育，儿童与孕妇慎用。",
            en: "**Fluoroquinolones** (levofloxacin) inhibit DNA gyrase, causing double-strand breaks. Excellent tissue penetration and intracellular levels, but they affect cartilage, so they are used cautiously in children and pregnancy."
          }
        },
        {
          h: { zh: "⑤ 细胞膜 — 直接打孔", en: "⑤ Membrane — punched through" },
          p: {
            zh: "**多黏菌素 B / E** 与脂多糖结合，破坏外膜通透性，相当于在膜上开孔。肾毒性与神经毒性明显，通常保留给碳青霉烯耐药菌的最后防线。",
            en: "**Polymyxin B / E** bind lipopolysaccharide and destroy outer-membrane integrity — effectively punching holes. Marked nephro- and neurotoxicity keep them as a last line against carbapenem-resistant organisms."
          }
        }
      ],
      terms: [
        { t: { zh: "杀菌 / 抑菌", en: "Bactericidal / static" }, d: { zh: "杀死细菌，或只阻止其生长。", en: "Killing bacteria, versus only stopping their growth." } },
        { t: { zh: "β-内酰胺酶", en: "β-lactamase" }, d: { zh: "细菌水解青霉素类的水解酶，最常见的耐药机制。", en: "The enzyme that hydrolyses penicillins — the commonest resistance mechanism." } },
        { t: { zh: "广谱 / 窄谱", en: "Broad / narrow spectrum" }, d: { zh: "覆盖菌种的多寡，广谱对共生菌扰动更大。", en: "How many species are covered; broad spectrum disturbs commensals more." } },
        { t: { zh: "时间 / 浓度依赖", en: "Time- vs concentration-dependent" }, d: { zh: "疗效取决于高于 MIC 的持续时间，还是峰浓度。", en: "Whether efficacy tracks time above MIC or peak concentration." } }
      ],
      key: {
        zh: "五个靶点全部位于**人体细胞不存在、或结构不同**的位置——这是选择性毒性的唯一来源。",
        en: "All five targets sit where **human cells have nothing, or something structurally different** — the sole source of selective toxicity."
      },
      task: {
        name: { zh: "靶点识别", en: "Target mapping" },
        steps: [
          { zh: "在实验台依次点击五个靶点按钮，观察画面中对应结构的高亮位置。", en: "Click each of the five target buttons and watch where the highlight lands." },
          { zh: "也可以直接点击细菌上的发光标记，镜头会自动聚焦。", en: "Or click a glowing marker on the bacterium; the camera focuses there." },
          { zh: "读信息卡里的「代表药物」与「临床备注」，记录下来。", en: "Read the drug examples and clinical notes in the card, and note them down." }
        ],
        expect: {
          zh: "五个高亮分布在完全不同的位置：外壁、两个核糖体亚基、DNA 环、以及细胞膜。没有两个靶点是同一个结构。",
          en: "The five highlights land in completely different places: the outer wall, two ribosomal subunits, the DNA loop, and the membrane. No two targets are the same structure."
        }
      },
      check: [
        {
          q: { zh: "青霉素与庆大霉素的主要区别之一是：", en: "One key difference between penicillin and gentamicin is:" },
          opts: [
            { zh: "青霉素作用于细胞壁，庆大霉素作用于 30S 核糖体", en: "Penicillin hits the cell wall; gentamicin hits the 30S ribosome" },
            { zh: "两者都作用于细胞膜", en: "Both act on the membrane" },
            { zh: "庆大霉素对病毒有效", en: "Gentamicin works on viruses" },
            { zh: "青霉素抑制 DNA 复制", en: "Penicillin inhibits DNA replication" }
          ],
          a: 0,
          fb: {
            zh: "青霉素阻断肽聚糖交联（细胞壁）；庆大霉素结合 30S 核糖体导致密码误读。靶点不同，抗菌谱、毒性与给药方式都不同。",
            en: "Penicillin blocks peptidoglycan cross-linking (wall); gentamicin binds the 30S subunit and causes misreading. Different targets mean different spectra, toxicities and dosing."
          }
        },
        {
          q: { zh: "使用广谱抗生素比窄谱更容易导致耐药，主要因为：", en: "Broad-spectrum drugs drive resistance faster than narrow-spectrum ones mainly because:" },
          opts: [
            { zh: "广谱药物剂量总是更大", en: "Broad-spectrum drugs always come in bigger doses" },
            { zh: "它对更多菌种施加选择压力，包括无关的共生菌", en: "They apply selection pressure to more species, including unrelated commensals" },
            { zh: "广谱药物分子更小", en: "Their molecules are smaller" },
            { zh: "窄谱药物不会产生耐药", en: "Narrow-spectrum drugs never select resistance" }
          ],
          a: 1,
          fb: {
            zh: "每一支被波及的菌种都是一个额外的选择场。窄谱把压力限制在真正的病原体上，对菌群生态的附带损伤更小。",
            en: "Every species touched is an extra selection arena. Narrow spectrum confines the pressure to the actual pathogen, with far less collateral damage to the flora."
          }
        }
      ],
      legend: [
        { c: "var(--abx)", t: { zh: "药物靶点", en: "Drug target" } },
        { c: "var(--path)", t: { zh: "被破坏处", en: "Damage" } }
      ]
    },

    /* ======================================================== 第 8 讲 === */
    {
      id: "resistance",
      no: "07",
      unit: 2,
      kicker: { zh: "单元 III · 耐药性", en: "Unit III · Resistance" },
      nav: { zh: "耐药性演化", en: "Resistance" },
      title: { zh: "抗生素<em class='abx'>不制造</em>耐药", en: "Drugs Do Not <em class='abx'>Create</em> Resistance" },
      sub: { zh: "SELECTION, NOT CREATION", en: "选择，而非创造" },
      lede: {
        zh: "耐药基因在给药之前就已经存在。抗生素做的事情只有一件：把耐药者挑出来，并把它们周围的竞争者清空。",
        en: "Resistance genes already exist before the first dose. The antibiotic does one thing only: it picks out the resistant and clears the competitors around them."
      },
      goal: {
        zh: "学完本讲，你能用「变异—选择—遗传」三步解释耐药演化，并指出两种错误用药为什么加速它。",
        en: "By the end of this lesson you can explain resistance with variation–selection–inheritance, and say why two kinds of misuse accelerate it."
      },
      objectives: [
        { zh: "用变异 → 选择 → 遗传三步解释耐药演化", en: "Explain resistance evolution as variation → selection → inheritance" },
        { zh: "说明剂量不足与疗程中断为什么会加速耐药", en: "Show why under-dosing and stopping early accelerate resistance" },
        { zh: "说出两种减少选择压力的具体做法", en: "Name two concrete ways to lower selection pressure" }
      ],
      explain: [
        {
          h: { zh: "① 变异先于选择", en: "① Variation comes first" },
          p: {
            zh: "一个菌群里总有个别个体天然 **MIC** 较高——靶点突变、外排泵上调、产灭活酶。这不是抗生素教会它们的，而是给药之前就存在的随机差异。",
            en: "In any population a few cells already have a higher **MIC** — a target mutation, an upregulated efflux pump, an inactivating enzyme. The drug did not teach them; the variation was there before the first dose."
          }
        },
        {
          h: { zh: "② 选择：一次用药就是一次筛选", en: "② Selection: every dose is a screen" },
          p: {
            zh: "敏感菌被杀死，耐药菌活下来，并**继承**母菌的 MIC（附带微小突变）。几轮之后，群体的平均 MIC 显著上移。抗生素是**选择压力**，不是诱变剂。",
            en: "Susceptible cells die; resistant ones survive and **inherit** the parental MIC with small mutations. After a few rounds the population mean MIC has moved up markedly. The drug is a **selective pressure**, not a mutagen."
          }
        },
        {
          h: { zh: "③ 剂量不足为什么最糟", en: "③ Why under-dosing is worst" },
          p: {
            zh: "亚致死浓度只杀死最弱的个体，留下中等耐药者，同时诱导应激突变（SOS 反应）。它做到了「筛选」，却没做到「清除」——这是最坏的组合。",
            en: "A sub-lethal concentration kills only the weakest, spares the moderately resistant, and induces stress mutagenesis (the SOS response). It achieves the screening without the clearing — the worst possible combination."
          }
        },
        {
          h: { zh: "④ 疗程中断为什么也糟", en: "④ Why stopping early is also bad" },
          p: {
            zh: "症状缓解时菌量已降，但仍有残部。提前停药等于给幸存者留出**没有竞争的空位**，让它们快速回填。症状消失 ≠ 细菌清除。",
            en: "By the time symptoms ease the load has fallen but survivors remain. Stopping early hands them an **uncontested niche** to refill fast. Symptom resolution is not bacterial eradication."
          }
        },
        {
          h: { zh: "⑤ 两条减少压力的做法", en: "⑤ Two ways to lower the pressure" },
          p: {
            zh: "① **该用才用、用对剂量、用满疗程**——剂量与疗程都是处方的一部分，不能自行打折；② **窄谱优先**，减少对共生菌群的附带损伤，也就减少了耐药基因的储存库。",
            en: "① **Use only when indicated, at the right dose, for the full course** — dose and duration are part of the prescription and are not yours to discount; ② **prefer narrow spectrum**, reducing collateral damage to commensals and therefore the reservoir of resistance genes."
          }
        }
      ],
      terms: [
        { t: { zh: "MIC 最低抑菌浓度", en: "MIC" }, d: { zh: "能抑制细菌可见生长的最低药物浓度。", en: "The lowest concentration that inhibits visible growth." } },
        { t: { zh: "选择压力", en: "Selection pressure" }, d: { zh: "使某些基因型存活率高于其他基因型的外部条件。", en: "Conditions that let some genotypes out-survive others." } },
        { t: { zh: "水平基因转移", en: "Horizontal gene transfer" }, d: { zh: "耐药基因通过质粒接合在菌种间传递。", en: "Resistance genes moving between species via plasmid conjugation." } },
        { t: { zh: "外排泵", en: "Efflux pump" }, d: { zh: "把药物主动泵出菌体的转运蛋白。", en: "A transporter that pumps the drug back out." } }
      ],
      key: {
        zh: "耐药不是「练出来的」，是**「挑出来的」**。抗生素改变的不是突变率，而是不同基因型在群体中的比例。",
        en: "Resistance is not trained, it is **selected**. Antibiotics change not the mutation rate but the proportions of genotypes in a population."
      },
      task: {
        name: { zh: "选择实验", en: "Selection experiment" },
        steps: [
          { zh: "记录初始状态：存活约 200，观察「平均耐药度」与「耐药比例」。", en: "Record the start: about 200 survivors, plus mean MIC and resistant fraction." },
          { zh: "剂量设 36%，点「给药一轮」，记录存活数与耐药比例的变化。", en: "Set the dose to 36%, apply one round, and record survivors and resistant fraction." },
          { zh: "把剂量降到 15% 再给药一轮；然后升到 80% 观察一次。", en: "Drop to 15% for one round, then raise to 80% and observe." },
          { zh: "点「重新接种菌群」回到起点，改用「连续给药」跑十轮。", en: "Re-inoculate, then run ten rounds with Auto-dose." }
        ],
        expect: {
          zh: "每一轮之后存活数下降，但耐药比例上升；低剂量时这个上升最明显。不做清除的选择，等于在替耐药菌做育种。",
          en: "Each round lowers survivors and raises the resistant fraction; the rise is sharpest at low doses. Selection without eradication is effectively breeding resistant strains."
        }
      },
      check: [
        {
          q: { zh: "「抗生素滥用导致细菌为了生存而产生耐药基因」这句话的问题在于：", en: "What is wrong with \"overuse makes bacteria produce resistance genes in order to survive\"?" },
          opts: [
            { zh: "抗生素其实完全不影响细菌", en: "Antibiotics do not affect bacteria at all" },
            { zh: "耐药变异在给药前就已存在，抗生素只起筛选作用", en: "Resistance variants pre-exist; the drug only selects them" },
            { zh: "细菌不会遗传", en: "Bacteria do not inherit traits" },
            { zh: "耐药只发生在人体内", en: "Resistance only happens inside humans" }
          ],
          a: 1,
          fb: {
            zh: "变异是随机的、先于选择的。抗生素不创造耐药基因，它改变的是不同基因型在群体中的比例——这正是自然选择的定义。",
            en: "Variation is random and precedes selection. The drug creates no resistance gene; it changes genotype frequencies — exactly the definition of natural selection."
          }
        },
        {
          q: { zh: "患者症状缓解后自行停药，最可能的结果是：", en: "A patient stops the course once symptoms ease. The likeliest outcome is:" },
          opts: [
            { zh: "更快康复，且减少副作用", en: "Faster recovery with fewer side effects" },
            { zh: "残存的耐药者获得无竞争空间，快速回填并复发", en: "Surviving resistant cells refill an uncontested niche, causing relapse" },
            { zh: "细菌会主动恢复正常", en: "The bacteria revert to normal on their own" },
            { zh: "对耐药性没有影响", en: "No effect on resistance" }
          ],
          a: 1,
          fb: {
            zh: "症状缓解时菌量已降但未清零。此时撤药，最强壮的幸存者面对的是没有竞争的生态位——它们会以指数速度回填。",
            en: "Symptoms ease when the load is down, not gone. Withdraw the drug then and the fittest survivors face an uncontested niche — and refill it exponentially."
          }
        }
      ],
      legend: [
        { c: "var(--vac)", t: { zh: "敏感菌", en: "Susceptible" } },
        { c: "var(--abx)", t: { zh: "耐药菌", en: "Resistant" } },
        { c: "var(--path)", t: { zh: "高耐药", en: "Highly resistant" } }
      ]
    },

    /* ======================================================== 第 6 讲 === */
    {
      id: "herd",
      no: "08",
      unit: 3,
      kicker: { zh: "单元 IV · 群体免疫", en: "Unit IV · Herd Immunity" },
      nav: { zh: "群体免疫", en: "Herd Immunity" },
      title: { zh: "保护是一件<em>公共品</em>", en: "Protection Is a <em>Public Good</em>" },
      sub: { zh: "HERD IMMUNITY · 1 − 1/R₀", en: "群体免疫阈值" },
      lede: {
        zh: "上一讲把镜头停在菌群内部。现在往外拉一层：无论是一种病毒还是一株耐药菌，只要它能在人之间传播，防控就不再只是个人的事。一个人接种，保护的是他自己；足够多的人接种，保护的是那些不能接种的人。",
        en: "The last lesson kept the camera inside a bacterial population. Now pull back a level: whenever something — a virus, a resistant strain — can pass between people, control stops being a private matter. One person vaccinated protects himself; enough people vaccinated protect those who cannot be."
      },
      goal: {
        zh: "学完本讲，你能用 1 − 1/R₀ 估算群体免疫阈值，并说明它为什么会失效。",
        en: "By the end of this lesson you can estimate a herd-immunity threshold with 1 − 1/R₀ and explain why it fails in practice."
      },
      objectives: [
        { zh: "计算 R₀ = 2、4、8 时对应的阈值", en: "Compute thresholds for R₀ = 2, 4 and 8" },
        { zh: "解释阈值为什么不是一条物理边界", en: "Explain why the threshold is not a physical boundary" },
        { zh: "说出让群体免疫失效的两种现实因素", en: "Name two real-world reasons herd immunity fails" }
      ],
      explain: [
        {
          h: { zh: "① R₀ 是什么", en: "① What R₀ is" },
          p: {
            zh: "**基本传染数**：在一个完全无免疫的人群里，一个感染者平均能传给几个人。R₀ = 3 意味着一个传三个。它是病原体的属性，不是人的属性。",
            en: "The **basic reproduction number**: how many people one case infects in a fully susceptible population. R₀ = 3 means one infects three. It is a property of the pathogen, not of people."
          }
        },
        {
          h: { zh: "② 门槛公式", en: "② The threshold formula" },
          p: {
            zh: "要让传染链逐渐熄灭，**有效传染数**必须降到 1 以下：R₀ × (1 − p) < 1，即 **p > 1 − 1/R₀**。R₀ = 2 → 50%；R₀ = 4 → 75%；R₀ = 8 → 87.5%。",
            en: "For the chain to die out, the **effective reproduction number** must fall below 1: R₀ × (1 − p) < 1, so **p > 1 − 1/R₀**. R₀ = 2 → 50%; R₀ = 4 → 75%; R₀ = 8 → 87.5%."
          }
        },
        {
          h: { zh: "③ 它不是一个开关", en: "③ It is not a switch" },
          p: {
            zh: "阈值是统计意义上的临界点，不是物理边界。刚好卡在阈值上时，传播仍可能靠随机的超级传播事件冲过去；明显高于阈值时，才稳定熄灭。",
            en: "The threshold is a statistical tipping point, not a physical edge. Right at the line, a random superspreading event can still push through; comfortably above it, the chain reliably dies."
          }
        },
        {
          h: { zh: "④ 失效的两种现实", en: "④ Two ways it fails in reality" },
          p: {
            zh: "① **人群不是均匀混合的**——聚集、通勤、接触网络的结构会让局部实际 R 远高于平均值；② **免疫会衰减，病原体也会变异**——免疫逃逸会把阈值重新抬高。",
            en: "① **Populations are not well mixed** — gathering, commuting and contact-network structure push local R far above the average; ② **immunity wanes and pathogens mutate** — immune escape raises the threshold again."
          }
        }
      ],
      terms: [
        { t: { zh: "R₀ 基本传染数", en: "R₀" }, d: { zh: "无免疫人群中一个病例平均传染的人数。", en: "Secondary cases per case in a fully susceptible population." } },
        { t: { zh: "群体免疫阈值", en: "Herd-immunity threshold" }, d: { zh: "阻断持续传播所需的最低免疫比例，1 − 1/R₀。", en: "The minimum immune fraction that stops sustained spread: 1 − 1/R₀." } },
        { t: { zh: "正外部性", en: "Positive externality" }, d: { zh: "一个人的行为给旁人带来的未计价收益。", en: "An unpriced benefit one person's action confers on others." } }
      ],
      key: {
        zh: "门槛 ≈ **1 − 1/R₀**。R₀ 越高，需要的覆盖率越接近 100%——麻疹要 92–95%，流感只需 25–45%。",
        en: "Threshold ≈ **1 − 1/R₀**. The higher R₀, the closer coverage must approach 100% — measles needs 92–95%, influenza only 25–45%."
      },
      task: {
        name: { zh: "传染链实验", en: "Chain experiment" },
        steps: [
          { zh: "保持 R₀ = 2.5，把覆盖率设为 70%，点「释放一个感染者」。", en: "Keep R₀ = 2.5, set coverage to 70%, and release one case." },
          { zh: "重置人群，把覆盖率降到 40%，再释放一个，比较传播代数。", en: "Reset, drop coverage to 40%, release again, and compare generations." },
          { zh: "把 R₀ 调到 6，在覆盖率 60% 下再试一次。", en: "Raise R₀ to 6 and try again at 60% coverage." }
        ],
        expect: {
          zh: "覆盖率高于阈值时，传染链在一两代内断掉；低于阈值时，感染像火线一样穿过整张网。R₀ 越高，分界线越往右移。",
          en: "Above the threshold the chain snaps within a generation or two; below it, infection runs across the grid like a fuse. The higher R₀, the further right the dividing line sits."
        }
      },
      check: [
        {
          q: { zh: "某病原体 R₀ = 4。要阻断持续传播，人群免疫比例至少要达到约：", en: "A pathogen has R₀ = 4. Roughly what immune fraction is needed to stop sustained spread?" },
          opts: [
            { zh: "25%", en: "25%" },
            { zh: "50%", en: "50%" },
            { zh: "75%", en: "75%" },
            { zh: "95%", en: "95%" }
          ],
          a: 2,
          fb: {
            zh: "门槛 = 1 − 1/R₀ = 1 − 1/4 = 75%。R₀ 越高，需要的覆盖率越接近 100%。",
            en: "Threshold = 1 − 1/R₀ = 1 − 1/4 = 75%. The higher R₀, the closer coverage must approach 100%."
          }
        },
        {
          q: { zh: "某地接种率达到理论阈值，却仍然出现暴发。最可能的原因是：", en: "A region hits the theoretical threshold yet still has an outbreak. The likeliest reason is:" },
          opts: [
            { zh: "公式本身错误", en: "The formula is wrong" },
            { zh: "人群并非均匀混合，局部覆盖率远低于平均值", en: "The population is not well mixed; local coverage is far below average" },
            { zh: "疫苗完全没有效果", en: "The vaccine does not work at all" },
            { zh: "R₀ 一定小于 1", en: "R₀ must be below 1" }
          ],
          a: 1,
          fb: {
            zh: "阈值假设均匀混合。真实人群有聚集与接触网络结构，同一个「平均值」下，某些社群的覆盖率可能只有一半——暴发就从那里开始。",
            en: "The threshold assumes homogeneous mixing. Real populations cluster and form contact networks, so under the same average some communities may sit at half the coverage — and outbreaks start there."
          }
        }
      ],
      legend: [
        { c: "rgba(23,26,30,.22)", t: { zh: "易感", en: "Susceptible" } },
        { c: "var(--vac)", t: { zh: "免疫", en: "Immune" } },
        { c: "var(--path)", t: { zh: "感染", en: "Infected" } }
      ]
    },

    /* ======================================================== 第 9 讲 === */
    {
      id: "closing",
      no: "09",
      unit: 3,
      kicker: { zh: "单元 IV · 决策", en: "Unit IV · Decisions" },
      nav: { zh: "处方与防线", en: "Prescription & Line" },
      title: { zh: "一个人的处方，<em>一群人的防线</em>", en: "One Prescription, <em>One Population</em>" },
      sub: { zh: "SYNTHESIS · 三种情境", en: "综合应用" },
      lede: {
        zh: "疫苗与抗生素的每一次使用，都同时是一次个人决策和一次公共决策。这门课最后要回答的，是如何在两者之间做取舍。",
        en: "Every use of a vaccine or an antibiotic is at once a private decision and a public one. This lesson is about choosing between the two."
      },
      goal: {
        zh: "学完本讲，你能把前八讲的机制，用于三个真实处境的判断。",
        en: "By the end of this lesson you can apply the mechanisms of the first eight lessons to three real situations."
      },
      objectives: [
        { zh: "对「病毒性感冒要求开抗生素」给出有依据的回应", en: "Answer a request for antibiotics for a viral cold, with reasons" },
        { zh: "解释个体接种如何产生群体层面的外部性", en: "Explain the population-level externality of individual vaccination" },
        { zh: "说出「合理用药」的三条操作原则", en: "State three operating rules of prudent prescribing" }
      ],
      explain: [
        {
          h: { zh: "情境一 · 病毒性感冒 + 抗生素", en: "Case 1 · Viral cold plus an antibiotic" },
          p: {
            zh: "病毒没有细胞壁、没有 70S 核糖体、没有旋转酶，抗生素**无靶点**。此时收益接近零，成本是菌群扰动与耐药选择压力——净收益为负。正确的回答不是「不给」，而是「给了也没有用，而且有代价」。",
            en: "A virus has no wall, no 70S ribosome, no gyrase — the antibiotic has **no target**. Benefit approaches zero while the costs are flora disruption and selection pressure: net negative. The honest answer is not \"no\" but \"it would not work, and it is not free\"."
          }
        },
        {
          h: { zh: "情境二 · 我接种，为什么保护了别人", en: "Case 2 · How my vaccination protects others" },
          p: {
            zh: "接种降低了自己被感染与传播的概率，从而降低了周围人的**有效 R**。当足够多的人这样做，传染链就断在群体层面。这是典型的**正外部性**：收益外溢给了无法接种的新生儿、免疫缺陷者与重症过敏者。",
            en: "Vaccination lowers my chance of being infected and of transmitting, which lowers the **effective R** around me. When enough people do it, the chain breaks at population level — a textbook **positive externality**, spilling over to newborns, the immunocompromised and the severely allergic, who cannot be vaccinated."
          }
        },
        {
          h: { zh: "情境三 · 新病原体出现，先做什么", en: "Case 3 · A novel pathogen appears" },
          p: {
            zh: "测序 → 定抗原 → 选平台 → 扩产能。mRNA 与载体平台之所以重要，是因为它们把「培养病原体」这一步从流程里删掉了——这一步过去常常要几个月。",
            en: "Sequence → choose the antigen → pick a platform → scale up. mRNA and vector platforms matter because they delete \"culture the pathogen\" from the workflow — a step that used to cost months."
          }
        },
        {
          h: { zh: "三条操作原则", en: "Three operating rules" },
          p: {
            zh: "① **预防优先**：能靠疫苗解决的，不留给抗生素。② **对症下药**：先分清病毒还是细菌，再谈用药。③ **用满疗程**：剂量与疗程是处方的一部分，不能自行打折。",
            en: "① **Prevention first**: what a vaccine can prevent should not be left to antibiotics. ② **Match the target**: establish virus or bacterium before discussing drugs. ③ **Finish the course**: dose and duration are part of the prescription, not yours to discount."
          }
        }
      ],
      terms: [
        { t: { zh: "正外部性", en: "Positive externality" }, d: { zh: "个人行为给他人带来的未计价收益。", en: "An unpriced benefit to others from a private act." } },
        { t: { zh: "合理用药", en: "Prudent prescribing" }, d: { zh: "正确的药、剂量、疗程与给药途径。", en: "The right drug, dose, duration and route." } },
        { t: { zh: "免疫逃逸", en: "Immune escape" }, d: { zh: "病原体变异后不再被既有免疫识别。", en: "A pathogen mutating beyond existing immunity." } }
      ],
      key: {
        zh: "个人用药的每一次「省一点」，都可能变成群体层面的**一次选择压力**。",
        en: "Every private shortcut in prescribing can become **one more turn of selection pressure** at population scale."
      },
      task: {
        name: { zh: "综合自测", en: "Final check" },
        steps: [
          { zh: "在实验台完成 4 道综合题，每题作答后读解析。", en: "Answer the four synthesis questions and read each explanation." },
          { zh: "对照左侧目录的完成标记，检查九讲是否都有记录。", en: "Check the syllabus: does every one of the nine lessons show as done?" },
          { zh: "回到第 2 讲，重看一次「选择性毒性」——那是整门课的地基。", en: "Return to lesson 2 and reread selective toxicity — it is the foundation of the whole course." }
        ],
        expect: {
          zh: "四道题分别对应：选择性毒性、群体免疫阈值、疫苗平台、以及抗生素对病毒无效。答不出来的那一题，指向需要重看的那一讲。",
          en: "The four questions map to selective toxicity, herd threshold, vaccine platforms and antibiotics versus viruses. Whichever you miss points to the lesson to revisit."
        }
      },
      check: [
        {
          q: { zh: "「我接种疫苗只是为了保护自己」这个说法忽略了：", en: "\"I get vaccinated only to protect myself\" overlooks:" },
          opts: [
            { zh: "疫苗的副作用", en: "Vaccine side effects" },
            { zh: "接种带来的群体层面正外部性", en: "The population-level positive externality of vaccination" },
            { zh: "疫苗的价格", en: "The price of vaccines" },
            { zh: "病原体一定会变异", en: "That pathogens always mutate" }
          ],
          a: 1,
          fb: {
            zh: "接种同时降低了自己被感染与传播的概率。覆盖率接近阈值时，传染链在群体层面断开，收益外溢给无法接种的人——这部分不在任何个人账本上。",
            en: "Vaccination lowers both my chance of infection and of transmission. Near the threshold the chain breaks at population level, and the benefit spills over to those who cannot be vaccinated — a line item on no private ledger."
          }
        }
      ],
      legend: []
    }
  ];

  var virusParts = [
    {
      id: "spike",
      zh: "刺突蛋白", en: "Spike protein",
      lat: "S glycoprotein · trimer",
      tone: "path",
      desc: {
        zh: "伸出包膜的三聚体糖蛋白，负责识别并结合宿主细胞受体（如 ACE2）。它是疫苗的主要抗原，也是中和抗体的主要靶点。",
        en: "A trimeric glycoprotein projecting from the envelope; it recognises and binds host receptors such as ACE2. It is the main vaccine antigen and the principal target of neutralising antibodies."
      },
      kv: [
        { k: { zh: "功能", en: "Role" }, v: { zh: "识别受体 · 介导入侵", en: "Receptor recognition · entry" } },
        { k: { zh: "相关", en: "Related" }, v: { zh: "mRNA 疫苗编码的正是它", en: "Encoded by mRNA vaccines" } }
      ]
    },
    {
      id: "envelope",
      zh: "包膜", en: "Envelope",
      lat: "Lipid bilayer",
      tone: "path",
      desc: {
        zh: "取自宿主细胞膜的双层脂质。有包膜的病毒对肥皂、酒精和去污剂敏感——这解释了为什么洗手有效。",
        en: "A lipid bilayer stolen from the host membrane. Enveloped viruses are vulnerable to soap, alcohol and detergents — which is why hand-washing works."
      },
      kv: [
        { k: { zh: "来源", en: "Origin" }, v: { zh: "宿主细胞膜", en: "Host cell membrane" } },
        { k: { zh: "弱点", en: "Weakness" }, v: { zh: "脂溶剂可破坏", en: "Disrupted by lipid solvents" } }
      ]
    },
    {
      id: "capsid",
      zh: "衣壳", en: "Capsid",
      lat: "Icosahedral shell",
      tone: "path",
      desc: {
        zh: "由重复的蛋白亚基按二十面体对称拼成，用最少的基因造出最坚固的容器。保护内部的遗传物质。",
        en: "Repeated protein subunits arranged with icosahedral symmetry — the strongest possible container for the fewest genes. It shields the genome."
      },
      kv: [
        { k: { zh: "对称", en: "Symmetry" }, v: { zh: "二十面体", en: "Icosahedral" } },
        { k: { zh: "组成", en: "Build" }, v: { zh: "重复亚基自组装", en: "Self-assembling subunits" } }
      ]
    },
    {
      id: "genome",
      zh: "遗传物质", en: "Genome",
      lat: "Single-stranded RNA",
      tone: "path",
      desc: {
        zh: "约三万个碱基的单链 RNA，编码复制酶与结构蛋白。病毒没有核糖体，必须借用宿主细胞的机器来翻译它。",
        en: "A single strand of about thirty thousand bases encoding replicase and structural proteins. With no ribosome of its own, the virus borrows the host's to translate it."
      },
      kv: [
        { k: { zh: "类型", en: "Type" }, v: { zh: "单链 RNA（+）", en: "ssRNA (+)" } },
        { k: { zh: "规模", en: "Size" }, v: { zh: "≈ 30 kb", en: "≈ 30 kb" } }
      ]
    }
  ];

  /* -------------------------------------------------------- 细菌结构 --- */
  var bacteriaParts = [
    {
      id: "wall",
      zh: "细胞壁", en: "Cell wall",
      lat: "Peptidoglycan",
      tone: "abx",
      desc: {
        zh: "肽聚糖交联而成的网，像一只连续的紧身衣，抵住细胞内的渗透压。人体细胞没有细胞壁——这就是青霉素选择性毒性的全部来源。",
        en: "A cross-linked peptidoglycan mesh acting like a continuous corset against osmotic pressure. Human cells have none — this is the entire basis of penicillin's selective toxicity."
      },
      kv: [
        { k: { zh: "靶向药", en: "Drugs" }, v: { zh: "青霉素 · 头孢菌素 · 万古霉素", en: "Penicillins · cephalosporins · vancomycin" } },
        { k: { zh: "后果", en: "Effect" }, v: { zh: "交联失败 → 溶菌破裂", en: "Failed cross-linking → lysis" } }
      ]
    },
    {
      id: "membrane",
      zh: "细胞膜", en: "Plasma membrane",
      lat: "Phospholipid bilayer",
      tone: "abx",
      desc: {
        zh: "选择性通透屏障，维持质子梯度与物质运输。多粘菌素像去污剂一样插入脂多糖，在膜上打出孔道，内容物外漏。",
        en: "A selectively permeable barrier maintaining proton gradients and transport. Polymyxins insert into lipopolysaccharide like a detergent, punching pores that leak the cytoplasm."
      },
      kv: [
        { k: { zh: "靶向药", en: "Drugs" }, v: { zh: "多粘菌素 B / E", en: "Polymyxin B / E" } },
        { k: { zh: "备注", en: "Note" }, v: { zh: "肾毒性明显，常作最后防线", en: "Nephrotoxic; a last-resort agent" } }
      ]
    },
    {
      id: "ribosome",
      zh: "核糖体 70S", en: "70S ribosome",
      lat: "30S + 50S subunits",
      tone: "abx",
      desc: {
        zh: "细菌的蛋白质合成机器，由 30S 与 50S 两个亚基组成。人体核糖体是 80S，结构差异足够让药物只认细菌那一个。",
        en: "The bacterial protein factory, built from 30S and 50S subunits. Human ribosomes are 80S; the structural gap is wide enough for drugs to tell them apart."
      },
      kv: [
        { k: { zh: "30S 靶向", en: "30S" }, v: { zh: "四环素 · 氨基糖苷类", en: "Tetracyclines · aminoglycosides" } },
        { k: { zh: "50S 靶向", en: "50S" }, v: { zh: "大环内酯 · 氯霉素", en: "Macrolides · chloramphenicol" } }
      ]
    },
    {
      id: "nucleoid",
      zh: "拟核 DNA", en: "Nucleoid DNA",
      lat: "Circular chromosome",
      tone: "abx",
      desc: {
        zh: "一条环状双链 DNA，没有核膜包裹。复制时双链要先解开，再重新超螺旋——喹诺酮就卡在这个解旋环节上。",
        en: "A single circular double helix, not enclosed by a nucleus. Replication requires unwinding and re-supercoiling — quinolones jam exactly there."
      },
      kv: [
        { k: { zh: "靶向药", en: "Drugs" }, v: { zh: "环丙沙星 · 左氧氟沙星", en: "Ciprofloxacin · levofloxacin" } },
        { k: { zh: "机制", en: "Mechanism" }, v: { zh: "锁定 DNA–酶复合物 → 双链断裂", en: "Traps DNA–enzyme complex → double-strand breaks" } }
      ]
    },
    {
      id: "plasmid",
      zh: "质粒", en: "Plasmid",
      lat: "Extrachromosomal DNA",
      tone: "path",
      desc: {
        zh: "独立复制的小型环状 DNA，常携带耐药基因。它可以通过接合在细菌之间传递——耐药性因此能跨物种扩散。",
        en: "A small, independently replicating circle of DNA that often carries resistance genes. It travels between bacteria by conjugation, letting resistance cross species."
      },
      kv: [
        { k: { zh: "传播", en: "Spread" }, v: { zh: "接合 · 水平基因转移", en: "Conjugation · horizontal transfer" } },
        { k: { zh: "携带", en: "Carries" }, v: { zh: "β-内酰胺酶等耐药基因", en: "β-lactamase and other resistance genes" } }
      ]
    },
    {
      id: "flagellum",
      zh: "鞭毛", en: "Flagellum",
      lat: "Helical protein filament",
      tone: "abx",
      desc: {
        zh: "由鞭毛蛋白螺旋组装成的分子马达，靠质子梯度驱动旋转，让细菌向营养物趋近、逃离有害物。",
        en: "A helical filament driven by a proton-powered rotary motor, steering the cell toward nutrients and away from toxins."
      },
      kv: [
        { k: { zh: "动力", en: "Power" }, v: { zh: "质子梯度", en: "Proton gradient" } },
        { k: { zh: "转速", en: "Speed" }, v: { zh: "可达约 1000 转/分", en: "Up to ~1000 rpm" } }
      ]
    }
  ];

  /* ------------------------------------------------------- 疫苗平台 --- */
  var vaccineTypes = [
    {
      id: "inactivated",
      key: "01",
      zh: "灭活疫苗", en: "Inactivated",
      short: { zh: "整具遗体", en: "The corpse" },
      lat: "Killed whole pathogen",
      desc: {
        zh: "用化学或热力把病原体杀死，保留其外形与抗原表位。安全性最高，但免疫原性弱，通常需要佐剂和多剂次加强。",
        en: "The pathogen is killed by chemical or heat treatment, keeping its shape and epitopes. The safest option, but weakly immunogenic — usually needing adjuvants and repeated doses."
      },
      pros: { zh: "安全性高；免疫缺陷者可用；冷链要求相对宽松", en: "Very safe; usable in immunocompromised people; forgiving cold chain" },
      cons: { zh: "免疫原性弱；多需 2–3 剂；T 细胞应答弱", en: "Weak immunogenicity; often 2–3 doses; poor T-cell response" },
      ex: { zh: "脊灰灭活疫苗 IPV · 流感灭活疫苗 · 狂犬病疫苗", en: "IPV polio · inactivated influenza · rabies" },
      tone: "vac"
    },
    {
      id: "live",
      key: "02",
      zh: "减毒活疫苗", en: "Live attenuated",
      short: { zh: "活着的弱者", en: "The weakened" },
      lat: "Attenuated live strain",
      desc: {
        zh: "在不利条件下长期培养，筛出复制能力削弱的毒株。它仍能有限复制，最接近自然感染，因此免疫最持久。",
        en: "A strain weakened by long cultivation under adverse conditions. It still replicates a little, closely mimicking natural infection — hence the most durable immunity."
      },
      pros: { zh: "免疫持久；一至两剂即可；可激发黏膜与 T 细胞免疫", en: "Durable; one or two doses; drives mucosal and T-cell immunity" },
      cons: { zh: "免疫缺陷者禁用；罕见回复突变；冷链要求严", en: "Contraindicated in immunodeficiency; rare reversion; strict cold chain" },
      ex: { zh: "麻腮风 MMR · 卡介苗 BCG · 口服脊灰 OPV", en: "MMR · BCG · oral polio OPV" },
      tone: "vac"
    },
    {
      id: "subunit",
      key: "03",
      zh: "亚单位 / 重组", en: "Subunit / recombinant",
      short: { zh: "一块碎片", en: "The fragment" },
      lat: "Purified antigen protein",
      desc: {
        zh: "只取一段关键抗原蛋白，用酵母或 CHO 细胞表达后纯化。成分明确、批次稳定，但需要更强的佐剂来「叫醒」免疫系统。",
        en: "Only one key antigen protein, expressed in yeast or CHO cells and purified. A defined, consistent product — but it needs a stronger adjuvant to wake the immune system."
      },
      pros: { zh: "成分明确；无活病原；易放大生产", en: "Defined composition; no live pathogen; easy to scale" },
      cons: { zh: "需强佐剂；应答谱窄；常需多剂", en: "Needs potent adjuvants; narrow response; multiple doses" },
      ex: { zh: "乙肝疫苗 HBsAg · HPV 疫苗 · 重组带状疱疹疫苗", en: "Hepatitis B HBsAg · HPV · recombinant zoster" },
      tone: "vac"
    },
    {
      id: "vector",
      key: "04",
      zh: "病毒载体", en: "Viral vector",
      short: { zh: "一个快递员", en: "The courier" },
      lat: "Non-replicating adenovirus",
      desc: {
        zh: "把抗原基因装进无害的腺病毒，让它替我们送货进细胞。抗原在细胞内表达，因此能同时激发抗体与 T 细胞应答。",
        en: "The antigen gene is loaded into a harmless adenovirus that delivers it into cells. Expressed intracellularly, it triggers both antibodies and T cells."
      },
      pros: { zh: "强 T 细胞应答；单剂常已足够；普通冷链", en: "Strong T-cell response; often one dose; ordinary cold chain" },
      cons: { zh: "预存免疫会削弱效果；罕见过敏与血栓", en: "Pre-existing immunity blunts it; rare allergy and thrombosis" },
      ex: { zh: "埃博拉疫苗 rVSV · 新冠疫苗 ChAdOx1 / Ad26", en: "rVSV Ebola · ChAdOx1 / Ad26 COVID-19" },
      tone: "vac"
    },
    {
      id: "mrna",
      key: "05",
      zh: "mRNA 疫苗", en: "mRNA",
      short: { zh: "一张图纸", en: "The blueprint" },
      lat: "LNP-encapsulated mRNA",
      desc: {
        zh: "把编码抗原的 mRNA 包进脂质纳米颗粒，送入细胞质，让细胞自己造出抗原。序列确定后数周即可出候选，迭代速度前所未有。",
        en: "mRNA encoding the antigen is wrapped in a lipid nanoparticle and delivered to the cytoplasm, where the cell builds the antigen itself. Once the sequence is known, a candidate can follow in weeks."
      },
      pros: { zh: "迭代极快；无活病原；可快速换靶", en: "Rapid iteration; no live pathogen; easy target swap" },
      cons: { zh: "超低温冷链；反应原性较强；成本高", en: "Ultra-cold chain; stronger reactogenicity; high cost" },
      ex: { zh: "BNT162b2 · mRNA-1273 · RSV mRNA 疫苗", en: "BNT162b2 · mRNA-1273 · mRNA RSV" },
      tone: "vac"
    }
  ];

  /* ------------------------------------------------------- 抗生素靶点 --- */
  var abxTargets = [
    {
      id: "wall",
      key: "01",
      zh: "细胞壁合成", en: "Cell wall synthesis",
      lat: "Peptidoglycan cross-linking",
      drug: { zh: "青霉素 G · 阿莫西林 · 头孢曲松", en: "Penicillin G · amoxicillin · ceftriaxone" },
      cls: { zh: "β-内酰胺类", en: "β-lactams" },
      desc: {
        zh: "β-内酰胺环与青霉素结合蛋白（PBPs）共价结合，转肽反应无法完成，肽聚糖链不能交联。细菌在自身渗透压下吸水膨胀，最终破裂。",
        en: "The β-lactam ring binds penicillin-binding proteins covalently, blocking transpeptidation. Peptidoglycan strands cannot cross-link; the cell swells under its own osmotic pressure and bursts."
      },
      note: { zh: "只对正在生长分裂的细菌有效——休眠菌能躲过一劫。", en: "Effective only against growing cells — dormant bacteria survive." },
      tone: "abx"
    },
    {
      id: "p30s",
      key: "02",
      zh: "30S 核糖体", en: "30S ribosome",
      lat: "A-site blockade / misreading",
      drug: { zh: "四环素 · 多西环素 · 庆大霉素", en: "Tetracycline · doxycycline · gentamicin" },
      cls: { zh: "四环素类 · 氨基糖苷类", en: "Tetracyclines · aminoglycosides" },
      desc: {
        zh: "四环素占据 A 位，氨酰-tRNA 无法进入；氨基糖苷则让密码子被读错，造出一堆无功能的错误蛋白，同时破坏膜完整性。",
        en: "Tetracyclines occupy the A site so aminoacyl-tRNA cannot enter; aminoglycosides cause misreading, producing non-functional proteins and disrupting membrane integrity."
      },
      note: { zh: "四环素会与钙结合，因此8岁以下儿童与孕妇慎用。", en: "Tetracyclines chelate calcium — avoided under age 8 and in pregnancy." },
      tone: "abx"
    },
    {
      id: "p50s",
      key: "03",
      zh: "50S 核糖体", en: "50S ribosome",
      lat: "Peptide chain elongation",
      drug: { zh: "阿奇霉素 · 红霉素 · 氯霉素", en: "Azithromycin · erythromycin · chloramphenicol" },
      cls: { zh: "大环内酯类 · 酰胺醇类", en: "Macrolides · amphenicols" },
      desc: {
        zh: "大环内酯结合 23S rRNA 的肽链出口通道，新生肽链无法延伸；氯霉素抑制肽键形成。两者都让蛋白质合成停在中途。",
        en: "Macrolides bind the 23S rRNA exit tunnel so the nascent chain cannot extend; chloramphenicol blocks peptide-bond formation. Both halt synthesis mid-strand."
      },
      note: { zh: "大环内酯是少数对非典型病原体（支原体、衣原体）有效的口服药。", en: "Macrolides are among the few oral agents active against atypical pathogens such as Mycoplasma." },
      tone: "abx"
    },
    {
      id: "dna",
      key: "04",
      zh: "DNA 旋转酶", en: "DNA gyrase",
      lat: "Double-strand breaks",
      drug: { zh: "环丙沙星 · 左氧氟沙星", en: "Ciprofloxacin · levofloxacin" },
      cls: { zh: "氟喹诺酮类", en: "Fluoroquinolones" },
      desc: {
        zh: "喹诺酮锁定 DNA 旋转酶与 DNA 的断裂-重接中间体，复制叉撞上后形成不可逆的双链断裂，染色体碎裂。",
        en: "Quinolones trap the gyrase–DNA cleavage intermediate. A replication fork collides with it, producing an irreversible double-strand break and a shattered chromosome."
      },
      note: { zh: "18 岁以下与肌腱病史者慎用；可能引起肌腱断裂。", en: "Avoid under 18 and with tendon disorders; risk of tendon rupture." },
      tone: "abx"
    },
    {
      id: "membrane",
      key: "05",
      zh: "细胞膜", en: "Cell membrane",
      lat: "Membrane depolarisation",
      drug: { zh: "多粘菌素 B · 多粘菌素 E", en: "Polymyxin B · colistin" },
      cls: { zh: "多肽类", en: "Polypeptides" },
      desc: {
        zh: "多粘菌素带正电，与革兰阴性菌外膜的脂多糖负电荷结合，插入脂质双层形成孔道，钾离子与内容物外漏，膜电位崩溃。",
        en: "Positively charged polymyxins bind the anionic lipopolysaccharide of Gram-negative outer membranes, insert into the bilayer and form pores; potassium leaks out and the membrane potential collapses."
      },
      note: { zh: "肾毒性与神经毒性明显，通常保留给碳青霉烯耐药的最后防线。", en: "Nephrotoxic and neurotoxic — reserved as a last line against carbapenem resistance." },
      tone: "abx"
    }
  ];

  /* ------------------------------------------------------ 综合测验 4 题 --- */
  var quiz = [
    {
      q: { zh: "青霉素对人体细胞毒性很低，根本原因是：", en: "Why is penicillin so weakly toxic to human cells?" },
      opts: [
        { zh: "人体细胞修复能力更强", en: "Human cells repair damage better" },
        { zh: "人体细胞没有细胞壁", en: "Human cells have no cell wall" },
        { zh: "青霉素只作用于病毒", en: "Penicillin only acts on viruses" },
        { zh: "人体细胞能主动分解青霉素", en: "Human cells actively degrade penicillin" }
      ],
      a: 1,
      fb: {
        zh: "青霉素阻断肽聚糖交联。人体细胞根本没有细胞壁，自然无从被攻击——这就是「选择性毒性」。",
        en: "Penicillin blocks peptidoglycan cross-linking. Human cells have no cell wall to attack — that is selective toxicity."
      }
    },
    {
      q: { zh: "某病原体 R₀ = 4。要阻断持续传播，人群免疫比例至少要达到约：", en: "A pathogen has R₀ = 4. Roughly what fraction must be immune to stop sustained spread?" },
      opts: [
        { zh: "25%", en: "25%" },
        { zh: "50%", en: "50%" },
        { zh: "75%", en: "75%" },
        { zh: "95%", en: "95%" }
      ],
      a: 2,
      fb: {
        zh: "门槛 = 1 − 1/R₀ = 1 − 1/4 = 75%。R₀ 越高，需要的覆盖率越接近 100%。",
        en: "Threshold = 1 − 1/R₀ = 1 − 1/4 = 75%. The higher R₀, the closer coverage must approach 100%."
      }
    },
    {
      q: { zh: "「灭活疫苗」意味着：", en: 'An "inactivated" vaccine means:' },
      opts: [
        { zh: "只含一段抗原蛋白", en: "It contains only an antigen fragment" },
        { zh: "病原体已被杀死，但保留抗原外形", en: "The pathogen is killed but its antigenic shape is kept" },
        { zh: "用 mRNA 让细胞自己造抗原", en: "mRNA instructs cells to build the antigen" },
        { zh: "用无害病毒运送抗原基因", en: "A harmless virus delivers the antigen gene" }
      ],
      a: 1,
      fb: {
        zh: "灭活疫苗用化学或热力杀死病原体，保留其外形供免疫系统识别，因此安全性高但免疫原性较弱。",
        en: "Inactivated vaccines kill the pathogen chemically or with heat while preserving its shape, so they are very safe but weakly immunogenic."
      }
    },
    {
      q: { zh: "为什么抗生素对流感无效？", en: "Why do antibiotics fail against influenza?" },
      opts: [
        { zh: "流感病毒太强，抗生素浓度不够", en: "The virus is too strong for the dose" },
        { zh: "病毒没有细胞壁和核糖体等抗生素靶点", en: "Viruses lack the cell walls and ribosomes antibiotics target" },
        { zh: "抗生素只能口服，不能进入血液", en: "Antibiotics cannot enter the bloodstream" },
        { zh: "流感病毒已经对全部抗生素耐药", en: "Influenza is resistant to all antibiotics" }
      ],
      a: 1,
      fb: {
        zh: "抗生素攻击的是细菌的细胞壁、70S 核糖体、DNA 旋转酶等结构。病毒一样都没有，因此抗生素无处下手。",
        en: "Antibiotics attack bacterial cell walls, 70S ribosomes and gyrase. A virus has none of these, so there is nothing to attack."
      }
    }
  ];

  /* ------------------------------------------------------- 记忆曲线 --- */
  var memoryCurve = {
    // 采样点：[天, 相对抗体浓度]
    naive: [
      [0, 0], [3, 0], [5, 2], [7, 8], [10, 26], [12, 44], [14, 52],
      [17, 46], [21, 32], [26, 20], [32, 12], [40, 7], [50, 4], [60, 3]
    ],
    vaccinated: [
      [0, 0], [3, 0], [5, 1], [7, 4], [10, 12], [14, 22], [20, 26], [26, 20],
      [32, 14], [34, 13],
      [36, 95], [38, 260], [40, 420], [43, 480], [46, 455], [50, 410],
      [55, 370], [60, 340]
    ]
  };

  return {
    units: units,
    chapters: chapters,
    virusParts: virusParts,
    bacteriaParts: bacteriaParts,
    vaccineTypes: vaccineTypes,
    abxTargets: abxTargets,
    quiz: quiz,
    memoryCurve: memoryCurve
  };
})();
