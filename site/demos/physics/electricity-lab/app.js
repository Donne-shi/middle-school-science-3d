/* ============================================================
   Electricity 3D Lab — app
   ============================================================ */
(function () {
  'use strict';

  const V3 = THREE.Vector3;
  const clamp = THREE.MathUtils.clamp;

  if (THREE.ColorManagement) {
    if ('enabled' in THREE.ColorManagement) THREE.ColorManagement.enabled = true;
    if ('legacyMode' in THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
  }

  const ORDER = ['static', 'electron', 'magnet', 'oersted', 'induction', 'generator', 'motor',
    'current', 'symbols', 'ohm', 'circuit', 'assembly', 'power'];

  /* ---------------- content ---------------- */

  const CONTENT = {
    static: {
      no: '01',
      zh: {
        name: '静电', sub: 'STATIC',
        eyebrow: 'CHAPTER 01 — 静电现象 / STATIC ELECTRICITY',
        headline: '摩擦一下<br>就能<span class="acc">吸起纸屑</span>',
        enLine: 'Rubbing transfers electrons — and charge appears.',
        lead: '用丝绸摩擦玻璃棒，玻璃棒就带上了正电。带电体之间要么互相推开，要么互相吸引，秘密全在电子的转移。',
        steps: [
          ['摩擦起电', '不同物质束缚电子的本领不同。摩擦时电子从束缚弱的物体转移到束缚强的物体上。'],
          ['两种电荷', '丝绸摩擦过的玻璃棒带正电，毛皮摩擦过的橡胶棒带负电。同种电荷相斥，异种电荷相吸。'],
          ['电荷量 Q', '电荷的多少叫电荷量，单位是库仑（C）。一个电子带 1.6×10⁻¹⁹ C 的负电荷。'],
          ['验电器', '金属箔张开的角度越大，说明物体带的电荷越多。它靠同种电荷相斥工作。']
        ],
        note: '拖动滑块改变电荷量，观察悬球张开的角度与斥力箭头如何一起变化。'
      },
      en: {
        name: 'Static', sub: '静电',
        eyebrow: 'CHAPTER 01 — STATIC ELECTRICITY / 静电现象',
        headline: 'One rub<br>and it <span class="acc">lifts paper</span>',
        enLine: '摩擦一下，就能吸起纸屑。',
        lead: 'Rub a glass rod with silk and it becomes positively charged. Charged objects either push apart or pull together — the secret is electron transfer.',
        steps: [
          ['Charging by friction', 'Different materials hold electrons with different strength, so rubbing moves electrons from one to the other.'],
          ['Two kinds of charge', 'Glass rubbed with silk is positive; rubber rubbed with fur is negative. Like repels, unlike attracts.'],
          ['Charge Q', 'Charge is measured in coulombs (C). One electron carries 1.6×10⁻¹⁹ C of negative charge.'],
          ['Electroscope', 'The wider the metal leaves open, the more charge. It works because like charges repel.']
        ],
        note: 'Change the charge and watch the hanging balls splay out while the repulsion arrows grow.'
      }
    },

    electron: {
      no: '02',
      zh: {
        name: '电子', sub: 'ELECTRON',
        eyebrow: 'CHAPTER 02 — 电子与原子 / ELECTRONS',
        headline: '得失电子<br>就成了<span class="acc">带电体</span>',
        enLine: 'Gain or lose electrons, and the atom becomes charged.',
        lead: '原子由带正电的原子核和核外电子组成。核外电子数等于核内质子数时原子中性；失去电子带正电，得到电子带负电。',
        steps: [
          ['原子的结构', '原子核（质子 + 中子）位于中心，电子在核外分层绕核运动。'],
          ['电中性', '质子数 = 电子数，正负电荷数量相等，整个原子不显电性。'],
          ['带电的本质', '摩擦起电不是创造了电荷，而是电子从一个物体转移到了另一个物体。'],
          ['电荷守恒', '转移过程中电荷总量不变：得到电子的带负电，失去电子的带正电。']
        ],
        note: '切换三种状态，注意最外层电子数与净电荷之间的关系。'
      },
      en: {
        name: 'Electrons', sub: '电子',
        eyebrow: 'CHAPTER 02 — ELECTRONS / 电子与原子',
        headline: 'Gain or lose electrons<br>and the atom is <span class="acc">charged</span>',
        enLine: '得失电子，就成了带电体。',
        lead: 'An atom is a positive nucleus surrounded by electrons. Equal numbers mean neutral; lose one and it is positive, gain one and it is negative.',
        steps: [
          ['Atomic structure', 'A nucleus of protons and neutrons sits at the centre; electrons orbit in shells.'],
          ['Neutral', 'Protons = electrons, so the positive and negative charges cancel.'],
          ['What charging really is', 'Rubbing does not create charge — it moves electrons from one body to another.'],
          ['Conservation', 'The total charge never changes: the loser becomes positive, the gainer negative.']
        ],
        note: 'Switch states and watch the outer-shell count drive the net charge.'
      }
    },

    magnet: {
      no: '03',
      zh: {
        name: '磁现象', sub: 'MAGNET',
        eyebrow: 'CHAPTER 03 — 磁现象 / MAGNETISM',
        headline: '看不见的<span class="acc">磁场</span><br>让铁屑排成队',
        enLine: 'An invisible field lines the iron filings up.',
        lead: '磁体两端磁性最强，叫做磁极。同名磁极相斥，异名磁极相吸。磁体周围存在磁场，用磁感线可以把它画出来。',
        steps: [
          ['磁极', '任何磁体都有 N、S 两个磁极，磁极不能单独存在——把磁体折断，仍然是两个磁极。'],
          ['磁感线', '磁体外部磁感线从 N 极出发回到 S 极，是闭合曲线；越密的地方磁场越强。'],
          ['磁化', '使原来没有磁性的物体获得磁性。铁屑被磁体吸引后，自己也变成一根根小磁针。'],
          ['地磁场', '地球是一个大磁体，地磁的北极在地理南极附近，所以指南针的 N 极指北。']
        ],
        note: '观察铁屑沿磁感线排列的方向，指南针的针尖始终指向该点的磁场方向。'
      },
      en: {
        name: 'Magnetism', sub: '磁现象',
        eyebrow: 'CHAPTER 03 — MAGNETISM / 磁现象',
        headline: 'An invisible <span class="acc">field</span><br>lines the filings up',
        enLine: '看不见的磁场，让铁屑排成队。',
        lead: 'A magnet is strongest at its poles. Like poles repel, unlike attract. Around every magnet there is a field, and field lines let us draw it.',
        steps: [
          ['Poles', 'Every magnet has a N and a S pole, and they never come alone — break it and you get two magnets.'],
          ['Field lines', 'Outside a magnet they run from N to S and form closed loops; closer lines mean a stronger field.'],
          ['Magnetisation', 'A non-magnetic object can become magnetic: each iron filing turns into a tiny compass needle.'],
          ['Earth’s field', 'Earth is a giant magnet whose magnetic north pole lies near the geographic south.']
        ],
        note: 'Watch the filings follow the field lines and the compass needle align with the local field.'
      }
    },

    oersted: {
      no: '04',
      zh: {
        name: '电生磁', sub: 'OERSTED',
        eyebrow: 'CHAPTER 04 — 电生磁 / CURRENT & MAGNETISM',
        headline: '电流周围<br>也有<span class="acc">磁场</span>',
        enLine: 'A current carries a magnetic field around it.',
        lead: '1820 年，奥斯特发现通电导线旁边的小磁针会偏转——电流的周围存在磁场。把导线绕成螺线管，磁场会强得多。',
        steps: [
          ['奥斯特实验', '通电导线下方的小磁针发生偏转，说明电流周围存在磁场，这是电与磁的第一次握手。'],
          ['右手螺旋定则', '右手握住导线，拇指指向电流方向，四指弯曲的方向就是磁感线的环绕方向。'],
          ['通电螺线管', '外部磁场与条形磁体相似，内部磁场方向一致。电流越大、匝数越多，磁性越强。'],
          ['电磁铁', '插入铁芯后磁性大大增强，断电立即失去磁性，电磁起重机就是这样搬运废钢铁的。']
        ],
        note: '增大电流，同时观察小磁针偏转角、磁感线密度和吸起的回形针数量。'
      },
      en: {
        name: 'Oersted', sub: '电生磁',
        eyebrow: 'CHAPTER 04 — CURRENT & MAGNETISM / 电生磁',
        headline: 'A current<br>carries a <span class="acc">field</span>',
        enLine: '电流周围，也有磁场。',
        lead: 'In 1820 Oersted saw a compass needle swing beside a current-carrying wire: a current creates a magnetic field. Wind the wire into a solenoid and the field becomes far stronger.',
        steps: [
          ['Oersted’s experiment', 'The needle under the wire deflects when current flows — the first link between electricity and magnetism.'],
          ['Right-hand grip rule', 'Grip the wire with your right hand, thumb along the current; your fingers curl the way the field circles.'],
          ['Solenoid', 'Outside it looks like a bar magnet; inside the field is uniform. More current and more turns mean a stronger field.'],
          ['Electromagnet', 'An iron core multiplies the strength and the magnetism vanishes when the current stops.']
        ],
        note: 'Raise the current and watch the needle, the field density and the number of clips lifted.'
      }
    },

    induction: {
      no: '05',
      zh: {
        name: '磁生电', sub: 'INDUCTION',
        eyebrow: 'CHAPTER 05 — 磁生电 / ELECTROMAGNETIC INDUCTION',
        headline: '磁体动起来<br>导线里就有了<span class="acc">电</span>',
        enLine: 'Move the magnet, and the wire carries a current.',
        lead: '闭合电路的一部分导体在磁场中做切割磁感线运动时，导体中就会产生感应电流——这就是电磁感应。',
        steps: [
          ['电磁感应', '闭合电路的一部分导体做切割磁感线运动，电路中就产生感应电流。'],
          ['三个条件', '电路闭合、有磁场、导体做切割磁感线运动，三个条件缺一不可。'],
          ['电流方向', '与导体运动方向和磁场方向都有关。改变其中一个，感应电流的方向就改变。'],
          ['能量转化', '机械能转化为电能。发电机就是根据电磁感应原理制成的。']
        ],
        note: '磁体静止时没有电流；插入和拔出时电流方向相反，指针向两侧偏转。'
      },
      en: {
        name: 'Induction', sub: '磁生电',
        eyebrow: 'CHAPTER 05 — ELECTROMAGNETIC INDUCTION / 磁生电',
        headline: 'Move the magnet<br>and the wire <span class="acc">carries current</span>',
        enLine: '磁体动起来，导线里就有了电。',
        lead: 'When part of a closed circuit cuts magnetic field lines, a current appears — electromagnetic induction.',
        steps: [
          ['Induction', 'A conductor cutting field lines inside a closed circuit produces an induced current.'],
          ['Three conditions', 'A closed circuit, a magnetic field, and motion that cuts the lines. All three are needed.'],
          ['Direction', 'It depends on both the motion and the field direction. Reverse either and the current reverses.'],
          ['Energy', 'Mechanical energy becomes electrical energy — exactly how a generator works.']
        ],
        note: 'A still magnet gives no current; pushing in and pulling out send the needle opposite ways.'
      }
    },

    generator: {
      no: '06',
      zh: {
        name: '发电机', sub: 'GENERATOR',
        eyebrow: 'CHAPTER 06 — 发电机 / GENERATOR',
        headline: '线圈转一圈<br>电流<span class="acc">换两次向</span>',
        enLine: 'One turn of the coil, two current reversals.',
        lead: '线圈在磁场中转动，两条边不断切割磁感线，产生方向周期性变化的交流电。滑环输出交流，换向器输出直流。',
        steps: [
          ['工作原理', '电磁感应。线圈转动时两条边不断切割磁感线，产生感应电动势。'],
          ['交流电', '线圈每转一周，电流方向改变两次。我国民用交流电的频率是 50 Hz。'],
          ['滑环与电刷', '两个完整的滑环把线圈两端接到外电路，外电路得到方向不断变化的交流电。'],
          ['换向器', '用两个半环代替滑环，每半周改变一次接线，输出方向不变的脉动直流电。']
        ],
        note: '提高转速，波形频率和灯泡闪烁的频率一起变快，感应电动势也随之增大。'
      },
      en: {
        name: 'Generator', sub: '发电机',
        eyebrow: 'CHAPTER 06 — GENERATOR / 发电机',
        headline: 'One turn of the coil,<br>two <span class="acc">reversals</span>',
        enLine: '线圈转一圈，电流换两次向。',
        lead: 'A coil spinning in a magnetic field cuts the lines continuously and produces alternating current. Slip rings give AC, a commutator gives DC.',
        steps: [
          ['Principle', 'Electromagnetic induction: the two sides of the coil keep cutting field lines.'],
          ['AC', 'The current reverses twice per revolution. Mains AC in China runs at 50 Hz.'],
          ['Slip rings', 'Two complete rings connect the coil to the circuit, delivering alternating current.'],
          ['Commutator', 'Two half-rings swap the connections every half turn, giving pulsating direct current.']
        ],
        note: 'Raise the speed and the wave, the flicker and the EMF all scale up together.'
      }
    },

    motor: {
      no: '07',
      zh: {
        name: '电动机', sub: 'MOTOR',
        eyebrow: 'CHAPTER 07 — 电动机 / ELECTRIC MOTOR',
        headline: '通电线圈<br>在磁场里<span class="acc">转起来</span>',
        enLine: 'A current-carrying coil turns in a magnetic field.',
        lead: '通电导体在磁场中受到安培力。线圈两条边电流方向相反，受力方向也相反，于是形成力矩，线圈就转起来了。',
        steps: [
          ['安培力', '通电导体在磁场中受力，F = BIL。力的方向与电流方向、磁场方向都垂直。'],
          ['力矩', '线圈两条边电流方向相反，受力方向也相反，一推一拉就绕轴转动。'],
          ['换向器', '线圈转过平衡位置时自动改变电流方向，保证线圈始终朝同一方向转动。'],
          ['能量转化', '电能转化为机械能。改变电流方向或磁场方向，转动方向随之反转。']
        ],
        note: '没有换向器时线圈只能来回摆动；装上换向器才能连续旋转。'
      },
      en: {
        name: 'Motor', sub: '电动机',
        eyebrow: 'CHAPTER 07 — ELECTRIC MOTOR / 电动机',
        headline: 'A live coil<br><span class="acc">spins</span> in a field',
        enLine: '通电线圈，在磁场里转起来。',
        lead: 'A current-carrying conductor feels a force in a magnetic field. The two sides of the coil carry opposite currents, so the forces oppose and produce a torque.',
        steps: [
          ['Ampere force', 'F = BIL, perpendicular to both the current and the field.'],
          ['Torque', 'Opposite currents mean opposite forces — one pushes, one pulls, and the coil turns.'],
          ['Commutator', 'It reverses the current as the coil passes the neutral position, so rotation continues one way.'],
          ['Energy', 'Electrical energy becomes mechanical energy. Reverse the current or the field and it spins backwards.']
        ],
        note: 'Without a commutator the coil only swings; with one it keeps rotating.'
      }
    },

    current: {
      no: '08',
      zh: {
        name: '电流', sub: 'CURRENT',
        eyebrow: 'CHAPTER 08 — 电流 / ELECTRIC CURRENT',
        headline: '电荷的<span class="acc">定向移动</span><br>形成电流',
        enLine: 'Directed motion of charge is what we call current.',
        lead: '电荷的定向移动形成电流。金属导体中移动的是自由电子，而规定的电流方向是正电荷移动的方向，两者正好相反。',
        steps: [
          ['电流的形成', '电荷的定向移动形成电流，方向规定为正电荷定向移动的方向。'],
          ['电子流', '金属中自由电子带负电，实际移动方向与规定的电流方向相反。'],
          ['电流的大小', 'I = Q/t。1 A 表示 1 s 内通过导体横截面的电荷量为 1 C。'],
          ['电流表', '必须串联在电路中，电流从"+"接线柱流入、从"−"接线柱流出，绝不允许直接接到电源两极。']
        ],
        note: '电流越大，电子定向移动越快，电流表指针偏转越大。'
      },
      en: {
        name: 'Current', sub: '电流',
        eyebrow: 'CHAPTER 08 — ELECTRIC CURRENT / 电流',
        headline: 'Directed charge<br>is <span class="acc">current</span>',
        enLine: '电荷的定向移动，形成电流。',
        lead: 'Current is the directed motion of charge. In metals the moving charges are free electrons, yet conventional current points the other way — the direction positive charge would move.',
        steps: [
          ['How current forms', 'Charges drift in one direction; by convention the direction is that of positive charge.'],
          ['Electron flow', 'Free electrons are negative, so they actually drift opposite to the conventional current.'],
          ['Size of the current', 'I = Q/t. One ampere means one coulomb passes a cross-section each second.'],
          ['Ammeter', 'Connect it in series, current in at "+" and out at "−". Never connect it straight across the supply.']
        ],
        note: 'More current means faster drift and a larger needle deflection.'
      }
    },

    symbols: {
      no: '09',
      zh: {
        name: '电路符号', sub: 'SYMBOLS',
        eyebrow: 'CHAPTER 09 — 电路符号 / CIRCUIT SYMBOLS',
        headline: '几个<span class="acc">符号</span><br>画出一整条电路',
        enLine: 'A handful of symbols draws a whole circuit.',
        lead: '画实物图太麻烦，物理学家用一套统一的符号表示电路元件。记住这些符号，你就能读懂任何一张电路图。',
        steps: [
          ['电源与开关', '长线代表正极、短线代表负极；开关用来控制电路的通断。'],
          ['用电器', '灯泡把电能转化为光能，电阻阻碍电流，电动机把电能转化为机械能。'],
          ['仪表', '电流表串联、电压表并联，都要让电流从"+"接线柱流入。'],
          ['连接点', '导线交叉处画圆点表示相连，不画圆点只表示交叉而不相连。']
        ],
        note: '切换三组符号，注意每个符号的接线端位置与连接方式。'
      },
      en: {
        name: 'Symbols', sub: '电路符号',
        eyebrow: 'CHAPTER 09 — CIRCUIT SYMBOLS / 电路符号',
        headline: 'A few <span class="acc">symbols</span><br>draw a whole circuit',
        enLine: '几个符号，画出一整条电路。',
        lead: 'Drawing every component realistically is hopeless, so physicists use a standard set of symbols. Learn them and any circuit diagram becomes readable.',
        steps: [
          ['Source and switch', 'The long line is positive, the short one negative; the switch opens or closes the circuit.'],
          ['Loads', 'A lamp makes light, a resistor opposes current, a motor makes motion.'],
          ['Meters', 'Ammeter in series, voltmeter in parallel — both take current in at the "+" terminal.'],
          ['Junctions', 'A dot where wires cross means connected; no dot means they merely cross.']
        ],
        note: 'Cycle the three groups and note where each symbol’s terminals sit.'
      }
    },

    ohm: {
      no: '10',
      zh: {
        name: '欧姆定律', sub: 'OHM',
        eyebrow: 'CHAPTER 10 — 欧姆定律 / OHM’S LAW',
        headline: '电流<br>正比于<span class="acc">电压</span>',
        enLine: 'Current rises with voltage, falls with resistance.',
        lead: '导体中的电流，跟导体两端的电压成正比，跟导体的电阻成反比。I = U/R，这就是欧姆定律。',
        steps: [
          ['欧姆定律', 'I = U/R。电压用伏特（V），电阻用欧姆（Ω），电流用安培（A）。'],
          ['控制变量', '电阻一定时，电流与电压成正比；电压一定时，电流与电阻成反比。'],
          ['图像', 'I–U 图像是一条过原点的直线，斜率等于 1/R。电阻越大，直线越平。'],
          ['适用条件', '只适用于纯电阻电路，而且 U、I、R 必须对应同一段导体、同一时刻。']
        ],
        note: '换用更大的电阻，直线变平；同样的电压下电流明显变小。'
      },
      en: {
        name: 'Ohm’s Law', sub: '欧姆定律',
        eyebrow: 'CHAPTER 10 — OHM’S LAW / 欧姆定律',
        headline: 'Current rises<br>with <span class="acc">voltage</span>',
        enLine: '电流正比于电压。',
        lead: 'The current through a conductor is proportional to the voltage across it and inversely proportional to its resistance: I = U/R.',
        steps: [
          ['The law', 'I = U/R, with U in volts, R in ohms and I in amperes.'],
          ['Control the variables', 'Fix R and current tracks voltage; fix U and current falls as R rises.'],
          ['The graph', 'I against U is a straight line through the origin with slope 1/R. Bigger R, flatter line.'],
          ['When it applies', 'Only to pure resistance, with U, I and R taken for the same conductor at the same time.']
        ],
        note: 'Switch to a larger resistor: the line flattens and the current drops at the same voltage.'
      }
    },

    circuit: {
      no: '11',
      zh: {
        name: '串并联', sub: 'SERIES',
        eyebrow: 'CHAPTER 11 — 串联与并联 / SERIES & PARALLEL',
        headline: '一条路<br>还是<span class="acc">两条路</span>',
        enLine: 'One path, or two?',
        lead: '串联只有一条电流路径，电流处处相等，电压分给各个用电器；并联有两条以上支路，各支路电压相等，电流被分流。',
        steps: [
          ['串联', '电流处处相等：I = I₁ = I₂。U总 = U₁ + U₂，R总 = R₁ + R₂。'],
          ['并联', '各支路电压相等：U = U₁ = U₂。I总 = I₁ + I₂，1/R总 = 1/R₁ + 1/R₂。'],
          ['灯泡亮度', '串联时每只灯只分到一部分电压，所以比并联时暗。'],
          ['生活应用', '家庭电路用并联，各用电器互不影响；开关与它控制的灯串联。']
        ],
        note: '增加电池节数，比较串联与并联时灯泡亮度的差别。'
      },
      en: {
        name: 'Series & Parallel', sub: '串并联',
        eyebrow: 'CHAPTER 11 — SERIES & PARALLEL / 串联与并联',
        headline: 'One path,<br>or <span class="acc">two</span>?',
        enLine: '一条路，还是两条路。',
        lead: 'In series there is a single path, the current is the same everywhere and the voltage is shared. In parallel each branch gets the full voltage and the current splits.',
        steps: [
          ['Series', 'Same current everywhere. U = U₁ + U₂ and R = R₁ + R₂.'],
          ['Parallel', 'Same voltage across branches. I = I₁ + I₂ and 1/R = 1/R₁ + 1/R₂.'],
          ['Brightness', 'In series each lamp only gets part of the voltage, so both look dimmer.'],
          ['In the home', 'Household appliances are in parallel so each works independently; a switch is in series with its lamp.']
        ],
        note: 'Add cells and compare how bright the lamps are in series versus parallel.'
      }
    },

    assembly: {
      no: '12',
      zh: {
        name: '组装电路', sub: 'BUILD',
        eyebrow: 'CHAPTER 12 — 组装电路 / BUILD A CIRCUIT',
        headline: '三步<br>点亮<span class="acc">第一盏灯</span>',
        enLine: 'Three steps to your first lit lamp.',
        lead: '一个能工作的电路必须有电源、用电器、导线和开关，并且组成闭合回路。按顺序把它们接起来，灯就亮了。',
        steps: [
          ['放入电源', '电池提供电压，是电路中电能的来源。'],
          ['连接导线', '用导线把电源、开关、灯泡连成一个闭合回路。'],
          ['闭合开关', '开关闭合，电路成为通路，电流流过灯丝，灯泡发光。'],
          ['通路·断路·短路', '通路电流畅通；断路某处断开；短路会烧坏电源，必须避免。']
        ],
        note: '点击 3D 场景中的元件完成接线，顺序不对会有提示。'
      },
      en: {
        name: 'Build a Circuit', sub: '组装电路',
        eyebrow: 'CHAPTER 12 — BUILD A CIRCUIT / 组装电路',
        headline: 'Three steps<br>to a <span class="acc">lit lamp</span>',
        enLine: '三步，点亮第一盏灯。',
        lead: 'A working circuit needs a source, a load, wires and a switch, all forming a closed loop. Connect them in order and the lamp lights.',
        steps: [
          ['Add the cell', 'The battery supplies the voltage — the source of energy in the circuit.'],
          ['Wire it up', 'Connect source, switch and lamp into one closed loop.'],
          ['Close the switch', 'The circuit becomes a closed path, current flows through the filament and the lamp glows.'],
          ['Closed · open · short', 'Closed conducts, open breaks the path, a short circuit can destroy the supply.']
        ],
        note: 'Click the components in the 3D scene to wire them up; wrong order gets a hint.'
      }
    },

    power: {
      no: '13',
      zh: {
        name: '电功电功率', sub: 'POWER',
        eyebrow: 'CHAPTER 13 — 电功与电功率 / WORK & POWER',
        headline: '电流做了多少功<br>电表<span class="acc">记得清清楚楚</span>',
        enLine: 'The meter remembers every joule.',
        lead: '电流做功的过程就是电能转化为其他形式能的过程。W = UIt = Pt，电功率 P = UI 表示电流做功的快慢。',
        steps: [
          ['电功', 'W = UIt = Pt，单位焦耳（J）。生活中常用千瓦时（度），1 kW·h = 3.6×10⁶ J。'],
          ['电功率', 'P = UI = W/t，表示电流做功的快慢，单位瓦特（W）。'],
          ['额定功率', '用电器在额定电压下工作时的功率。实际电压偏低，实际功率就偏小。'],
          ['电能表', '测量一段时间内消耗的电能。表盘转得越快，说明用电器的功率越大。']
        ],
        note: '功率越大、通电时间越长，消耗的电能越多，电表转盘转得越快。'
      },
      en: {
        name: 'Work & Power', sub: '电功电功率',
        eyebrow: 'CHAPTER 13 — ELECTRICAL WORK & POWER / 电功与电功率',
        headline: 'The meter remembers<br>every <span class="acc">joule</span>',
        enLine: '电流做了多少功，电表记得清清楚楚。',
        lead: 'Current doing work is energy changing form. W = UIt = Pt, and power P = UI tells you how fast that work is done.',
        steps: [
          ['Work', 'W = UIt = Pt in joules. Households use kilowatt-hours: 1 kW·h = 3.6×10⁶ J.'],
          ['Power', 'P = UI = W/t, measured in watts — the rate of doing electrical work.'],
          ['Rated power', 'The power at the rated voltage. Drop the voltage and the actual power falls.'],
          ['Energy meter', 'It integrates energy over time; the faster the disc spins, the greater the power.']
        ],
        note: 'Higher power or a longer time means more energy — and a faster-spinning disc.'
      }
    }
  };

  const CHAPTER = {
    static: { zh: '静电', en: 'Static' },
    electron: { zh: '电子', en: 'Electron' },
    magnet: { zh: '磁现象', en: 'Magnet' },
    oersted: { zh: '电生磁', en: 'Oersted' },
    induction: { zh: '磁生电', en: 'Induction' },
    generator: { zh: '发电机', en: 'Generator' },
    motor: { zh: '电动机', en: 'Motor' },
    current: { zh: '电流', en: 'Current' },
    symbols: { zh: '符号', en: 'Symbols' },
    ohm: { zh: '欧姆定律', en: 'Ohm' },
    circuit: { zh: '串并联', en: 'Series' },
    assembly: { zh: '组装', en: 'Build' },
    power: { zh: '电功率', en: 'Power' }
  };

  const VARIANTS = {
    static: [
      { key: 'repel', zh: '同种电荷', en: 'Like charges' },
      { key: 'attract', zh: '异种电荷', en: 'Unlike charges' },
      { key: 'rub', zh: '摩擦起电', en: 'By friction' }
    ],
    electron: [
      { key: 'neutral', zh: '中性原子', en: 'Neutral' },
      { key: 'positive', zh: '失去电子', en: 'Lost e⁻' },
      { key: 'negative', zh: '得到电子', en: 'Gained e⁻' }
    ],
    magnet: [
      { key: 'bar', zh: '条形磁体', en: 'Bar magnet' },
      { key: 'horseshoe', zh: '蹄形磁体', en: 'Horseshoe' },
      { key: 'repel', zh: '同名磁极', en: 'Like poles' }
    ],
    oersted: [
      { key: 'straight', zh: '通电直导线', en: 'Straight wire' },
      { key: 'solenoid', zh: '通电螺线管', en: 'Solenoid' },
      { key: 'electromagnet', zh: '电磁铁', en: 'Electromagnet' }
    ],
    induction: [
      { key: 'insert', zh: '插入磁体', en: 'Push in' },
      { key: 'pull', zh: '拔出磁体', en: 'Pull out' },
      { key: 'still', zh: '静止不动', en: 'At rest' }
    ],
    generator: [
      { key: 'ac', zh: '交流发电机', en: 'AC' },
      { key: 'dc', zh: '直流发电机', en: 'DC' }
    ],
    motor: [
      { key: 'commutator', zh: '有换向器', en: 'Commutator' },
      { key: 'basic', zh: '无换向器', en: 'No commutator' },
      { key: 'reverse', zh: '电流反向', en: 'Reversed' }
    ],
    current: [
      { key: 'electron', zh: '电子定向移动', en: 'Electron flow' },
      { key: 'conventional', zh: '电流的方向', en: 'Conventional' },
      { key: 'ammeter', zh: '电流表', en: 'Ammeter' }
    ],
    symbols: [
      { key: 'power', zh: '电源与开关', en: 'Source' },
      { key: 'load', zh: '用电器', en: 'Loads' },
      { key: 'meter', zh: '仪表', en: 'Meters' }
    ],
    ohm: [
      { key: 'r5', zh: 'R = 5 Ω', en: '5 Ω' },
      { key: 'r10', zh: 'R = 10 Ω', en: '10 Ω' },
      { key: 'r20', zh: 'R = 20 Ω', en: '20 Ω' }
    ],
    circuit: [
      { key: 'series', zh: '串联', en: 'Series' },
      { key: 'parallel', zh: '并联', en: 'Parallel' }
    ],
    assembly: [
      { key: 'build', zh: '接线挑战', en: 'Wiring' }
    ],
    power: [
      { key: 'p5', zh: '5 W LED', en: '5 W LED' },
      { key: 'p40', zh: '40 W 白炽灯', en: '40 W bulb' },
      { key: 'p100', zh: '100 W 白炽灯', en: '100 W bulb' }
    ]
  };

  const SLIDERS = {
    static: { key: 'q', min: 1, max: 10, step: 0.5, unit: 'nC', dec: 1, zh: '电荷量 q', en: 'Charge q' },
    electron: { key: 'e', min: 5, max: 11, step: 1, unit: '个', dec: 0, zh: '核外电子数', en: 'Electrons' },
    magnet: { key: 'd', min: 1.0, max: 3.2, step: 0.1, unit: 'cm', dec: 1, zh: '磁极间距 d', en: 'Pole gap d' },
    oersted: { key: 'I', min: 0.2, max: 3, step: 0.05, unit: 'A', dec: 2, zh: '电流 I', en: 'Current I' },
    induction: { key: 'v', min: 0.2, max: 3, step: 0.1, unit: 'm/s', dec: 1, zh: '运动速度 v', en: 'Speed v' },
    generator: { key: 'rpm', min: 60, max: 900, step: 10, unit: 'r/min', dec: 0, zh: '转速 n', en: 'Speed n' },
    motor: { key: 'I', min: 0.2, max: 3, step: 0.05, unit: 'A', dec: 2, zh: '电流 I', en: 'Current I' },
    current: { key: 'I', min: 0.1, max: 2, step: 0.05, unit: 'A', dec: 2, zh: '电流 I', en: 'Current I' },
    symbols: null,
    ohm: { key: 'U', min: 0, max: 12, step: 0.5, unit: 'V', dec: 1, zh: '电压 U', en: 'Voltage U' },
    circuit: { key: 'n', min: 1, max: 3, step: 1, unit: '节', dec: 0, zh: '电池节数', en: 'Cells' },
    assembly: null,
    power: { key: 't', min: 0.5, max: 5, step: 0.5, unit: 'h', dec: 1, zh: '通电时间 t', en: 'Time t' }
  };

  const FORMULA = {
    static: 'F = k·q₁q₂ / r²',
    electron: 'Q = (e⁻ − p⁺) × 1.6×10⁻¹⁹ C',
    magnet: 'B varies with position / 磁场随位置变化',
    oersted: 'B = μ₀nI / L',
    induction: 'E = BLv',
    generator: 'e = NBAω·sin(ωt)',
    motor: 'F = BIL',
    current: 'I = Q / t',
    symbols: '统一符号 · 统一语言',
    ohm: 'I = U / R',
    circuit: 'R串 = R₁ + R₂ · 1/R并 = 1/R₁ + 1/R₂',
    assembly: '通路 = 电源 + 用电器 + 导线 + 开关',
    power: 'W = Pt = UIt'
  };
  const FORMULA_EN = {
    symbols: 'Standard symbols · shared language',
    circuit: 'Rseries = R₁ + R₂ · 1/Rparallel = 1/R₁ + 1/R₂',
    assembly: 'Closed circuit = source + load + wires + switch'
  };

  const RESULT_KEY = {
    static: 'F', electron: 'net', magnet: 'B', oersted: 'B', induction: 'I',
    generator: 'e', motor: 'F', current: 'I', symbols: 'n', ohm: 'I',
    circuit: 'I', assembly: 's', power: 'W'
  };

  const MLAB = {
    static: { zh: { q: '电荷量', d: '间距', F: '库仑力' }, en: { q: 'Charge', d: 'Distance', F: 'Force' } },
    electron: { zh: { p: '质子数', e: '电子数', net: '净电荷' }, en: { p: 'Protons', e: 'Electrons', net: 'Net charge' } },
    magnet: { zh: { d: '磁极间距', B: '磁感应强度', n: '磁极数' }, en: { d: 'Pole gap', B: 'Field B', n: 'Poles' } },
    oersted: { zh: { I: '电流', n: '匝数', B: '磁感应强度' }, en: { I: 'Current', n: 'Turns', B: 'Field B' } },
    induction: { zh: { v: '运动速度', I: '感应电流', dir: '电流方向' }, en: { v: 'Speed', I: 'Induced I', dir: 'Direction' } },
    generator: { zh: { n: '转速', f: '频率', e: '电动势' }, en: { n: 'Speed', f: 'Frequency', e: 'EMF' } },
    motor: { zh: { I: '电流', F: '安培力', n: '转速' }, en: { I: 'Current', F: 'Force', n: 'Speed' } },
    current: { zh: { I: '电流', Q: '电荷量', n: '电子数率' }, en: { I: 'Current', Q: 'Charge/s', n: 'Electrons' } },
    symbols: { zh: { n: '符号数', c: '常用符号' }, en: { n: 'Symbols', c: 'Common' } },
    ohm: { zh: { U: '电压', R: '电阻', I: '电流' }, en: { U: 'Voltage', R: 'Resistance', I: 'Current' } },
    circuit: { zh: { U: '电源电压', Ul: '每灯电压', I: '干路电流' }, en: { U: 'Supply', Ul: 'Per lamp', I: 'Current' } },
    assembly: { zh: { s: '完成步骤', U: '电源电压', I: '电流' }, en: { s: 'Steps', U: 'Voltage', I: 'Current' } },
    power: { zh: { P: '电功率', W: '消耗电能', cost: '电费' }, en: { P: 'Power', W: 'Energy', cost: 'Cost' } }
  };

  const LEGEND = {
    static: [['#3fd6f2', '库仑力', 'Force'], ['#ff4d8d', '正电荷', 'Positive'], ['#4d8dff', '负电荷', 'Negative']],
    electron: [['#ff5a7a', '质子', 'Proton'], ['#4d8dff', '电子', 'Electron'], ['#ffb347', '净电荷', 'Net charge']],
    magnet: [['#a48bff', '磁感线', 'Field lines'], ['#ff4d6a', 'N 极', 'North'], ['#4d8dff', 'S 极', 'South']],
    oersted: [['#ffb347', '电流', 'Current'], ['#a48bff', '磁场', 'Field'], ['#45e08a', '铁芯', 'Core']],
    induction: [['#ffb347', '感应电流', 'Induced'], ['#3fd6f2', '运动方向', 'Motion'], ['#a48bff', '磁场', 'Field']],
    generator: [['#3fd6f2', '交流输出', 'AC'], ['#ffb347', '电动势', 'EMF'], ['#a48bff', '磁极', 'Poles']],
    motor: [['#ffb347', '安培力', 'Force'], ['#3fd6f2', '电流', 'Current'], ['#a48bff', '磁场', 'Field']],
    current: [['#ffb347', '电流方向', 'Current'], ['#4d8dff', '电子流', 'Electrons'], ['#d98a4a', '正离子', 'Ions']],
    symbols: [['#3fd6f2', '符号', 'Symbol'], ['#a48bff', '分组', 'Group']],
    ohm: [['#ffb347', '电压', 'Voltage'], ['#3fd6f2', '电流', 'Current'], ['#45e08a', '图像', 'Graph']],
    circuit: [['#ffb347', '干路', 'Main'], ['#45e08a', '支路', 'Branch'], ['#3fd6f2', '电流', 'Current']],
    assembly: [['#ffb347', '电源', 'Source'], ['#3fd6f2', '导线', 'Wire'], ['#45e08a', '开关', 'Switch']],
    power: [['#ffb347', '电功率', 'Power'], ['#3fd6f2', '时间', 'Time'], ['#45e08a', '电能', 'Energy']]
  };

  /* ---------------- mini schematics ---------------- */

  const INK = '#17181a', CYA = '#2b9fbd', ORG = '#dd5a2b';
  const DIML = '#cfc8ba', MUT = '#9a9385', MBG = '#fbfaf6';

  function svgWrap(inner) {
    return '<svg viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }
  function svgArrow(x1, y1, x2, y2, color, w) {
    const a = Math.atan2(y2 - y1, x2 - x1), hl = 7, hd = 2.7;
    const bx = x2 - hl * Math.cos(a), by = y2 - hl * Math.sin(a);
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 +
      'M' + (bx + hd * Math.sin(a)).toFixed(1) + ' ' + (by - hd * Math.cos(a)).toFixed(1) +
      'L' + x2 + ' ' + y2 +
      'L' + (bx - hd * Math.sin(a)).toFixed(1) + ' ' + (by + hd * Math.cos(a)).toFixed(1) +
      '" stroke="' + color + '" stroke-width="' + (w || 1.7) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function lbl(x, y, t, size, color) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 8.5) + '" fill="' + (color || MUT) + '" font-family="ui-monospace,Menlo,monospace">' + t + '</text>';
  }
  function circle(cx, cy, r, color, w) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="' + (color || INK) + '" stroke-width="' + (w || 1.4) + '" fill="' + MBG + '"/>';
  }
  function battSymbol(x, y, horiz) {
    if (horiz) {
      return '<path d="M' + (x - 20) + ' ' + y + 'h14M' + (x - 6) + ' ' + (y - 12) + 'v24M' + (x + 2) + ' ' + (y - 7) + 'v14M' + (x + 10) + ' ' + (y - 12) + 'v24M' + (x + 18) + ' ' + y + 'h12" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round"/>';
    }
    return '<path d="M' + x + ' ' + (y - 18) + 'v12M' + (x - 12) + ' ' + (y - 6) + 'h24M' + (x - 7) + ' ' + (y + 2) + 'h14M' + (x - 12) + ' ' + (y + 10) + 'h24M' + x + ' ' + (y + 22) + 'v12" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round"/>';
  }
  function bulbSymbol(cx, cy, r) {
    return circle(cx, cy, r) +
      '<path d="M' + (cx - r * 0.7) + ' ' + (cy - r * 0.7) + 'L' + (cx + r * 0.7) + ' ' + (cy + r * 0.7) +
      'M' + (cx + r * 0.7) + ' ' + (cy - r * 0.7) + 'L' + (cx - r * 0.7) + ' ' + (cy + r * 0.7) + '" stroke="' + INK + '" stroke-width="1.3"/>';
  }

  const MINI = {
    static: function (v) {
      if (v === 'rub') {
        let dots = '';
        for (let i = 0; i < 5; i++) dots += '<circle cx="' + (120 + i * 14) + '" cy="' + (30 + (i % 2) * 5) + '" r="2.4" fill="' + CYA + '"/>';
        return svgWrap(
          '<rect x="66" y="40" width="150" height="14" rx="7" transform="rotate(-9 66 40)" fill="' + MBG + '" stroke="' + INK + '" stroke-width="1.4"/>' +
          '<path d="M150 30 q26 -8 44 6 q6 16 -12 20 l-30 4 z" fill="#efe6d0" stroke="' + INK + '" stroke-width="1.2"/>' +
          svgArrow(196, 34, 214, 26, ORG, 1.5) +
          dots +
          lbl(112, 76, '玻璃棒 + 丝绸') + lbl(228, 52, 'e⁻', 9, CYA));
      }
      const same = v === 'repel';
      const lx = 128, rx = 192, y = 50;
      const dirL = same ? -1 : 1;
      return svgWrap(
        '<path d="M60 14h200" stroke="' + DIML + '" stroke-width="1.4"/>' +
        '<path d="M' + lx + ' 14v18M' + rx + ' 14v18" stroke="' + INK + '" stroke-width="0.9"/>' +
        circle(lx, y, 15) + circle(rx, y, 15) +
        '<text x="' + lx + '" y="' + (y + 5) + '" font-size="16" text-anchor="middle" fill="' + (same ? CYA : ORG) + '" font-family="ui-monospace,Menlo,monospace">' + (same ? '−' : '+') + '</text>' +
        '<text x="' + rx + '" y="' + (y + 5) + '" font-size="16" text-anchor="middle" fill="' + (same ? CYA : ORG) + '" font-family="ui-monospace,Menlo,monospace">−</text>' +
        svgArrow(lx - 17, y, lx - 17 + dirL * 26, y, CYA, 1.5) +
        svgArrow(rx + 17, y, rx + 17 - dirL * 26, y, CYA, 1.5) +
        lbl(same ? 118 : 122, 84, same ? '同种电荷相斥' : '异种电荷相吸'));
    },

    electron: function (v) {
      const e = v === 'positive' ? 7 : v === 'negative' ? 9 : 8;
      let orbit = '<ellipse cx="150" cy="46" rx="46" ry="26" stroke="' + DIML + '" stroke-width="1.2"/>' +
        '<ellipse cx="150" cy="46" rx="68" ry="36" stroke="' + DIML + '" stroke-width="1.2"/>';
      let dots = '';
      for (let i = 0; i < 8; i++) {
        if (i >= e) continue;
        const a = (i / 8) * Math.PI * 2;
        const r = i < 2 ? 46 : 68;
        const ry = i < 2 ? 26 : 36;
        dots += '<circle cx="' + (150 + Math.cos(a) * r).toFixed(1) + '" cy="' + (46 + Math.sin(a) * ry).toFixed(1) + '" r="3.4" fill="' + CYA + '"/>';
      }
      if (e === 9) dots += '<circle cx="218" cy="46" r="3.4" fill="' + ORG + '"/>';
      return svgWrap(
        orbit + dots +
        '<circle cx="150" cy="46" r="15" fill="' + MBG + '" stroke="' + INK + '" stroke-width="1.4"/>' +
        '<text x="150" y="50" font-size="9" text-anchor="middle" fill="' + ORG + '" font-family="ui-monospace,Menlo,monospace">8p</text>' +
        lbl(24, 30, 'e⁻ = ' + e, 9.5, INK) +
        lbl(24, 44, e === 8 ? '中性' : e > 8 ? '带负电' : '带正电', 9.5, e === 8 ? MUT : ORG));
    },

    magnet: function (v) {
      if (v === 'horseshoe') {
        return svgWrap(
          '<path d="M96 74V44a34 34 0 0 1 68 0v30" stroke="' + INK + '" stroke-width="14" fill="none" stroke-linecap="round"/>' +
          '<path d="M96 74V44a34 34 0 0 1 34 -34" stroke="#c8524f" stroke-width="14" fill="none" stroke-linecap="round"/>' +
          '<path d="M164 44a34 34 0 0 0 -34 -34" stroke="#3f6fbf" stroke-width="14" fill="none" stroke-linecap="round"/>' +
          '<path d="M112 78q20 14 40 0" stroke="' + CYA + '" stroke-width="1.2" stroke-dasharray="3 3"/>' +
          lbl(88, 90, 'S') + lbl(166, 90, 'N'));
      }
      if (v === 'repel') {
        return svgWrap(
          '<rect x="52" y="36" width="60" height="22" fill="' + MBG + '" stroke="' + INK + '" stroke-width="1.4"/>' +
          '<path d="M82 36h30v22H82z" fill="#e8b6b3"/>' +
          '<rect x="176" y="36" width="60" height="22" fill="' + MBG + '" stroke="' + INK + '" stroke-width="1.4"/>' +
          '<path d="M176 36h30v22h-30z" fill="#e8b6b3"/>' +
          '<text x="96" y="52" font-size="9" text-anchor="middle" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">N</text>' +
          '<text x="188" y="52" font-size="9" text-anchor="middle" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">N</text>' +
          svgArrow(148, 47, 128, 47, ORG, 1.5) + svgArrow(168, 47, 188, 47, ORG, 1.5) +
          lbl(126, 78, '同名磁极相斥'));
      }
      let arcs = '';
      [14, 24, 34].forEach(function (r, i) {
        arcs += '<path d="M196 52 Q136 ' + (52 - r * 1.55) + ' 76 52" stroke="' + CYA + '" stroke-width="1.1" opacity="' + (0.85 - i * 0.18) + '"/>';
        arcs += '<path d="M196 52 Q136 ' + (52 + r * 1.55) + ' 76 52" stroke="' + CYA + '" stroke-width="1.1" opacity="' + (0.85 - i * 0.18) + '"/>';
      });
      return svgWrap(
        arcs +
        '<rect x="76" y="40" width="120" height="24" fill="' + MBG + '" stroke="' + INK + '" stroke-width="1.4"/>' +
        '<path d="M76 40h60v24H76z" fill="#3f6fbf" opacity="0.85"/>' +
        '<path d="M136 40h60v24h-60z" fill="#c8524f" opacity="0.85"/>' +
        '<text x="104" y="57" font-size="11" text-anchor="middle" fill="#fff" font-family="ui-monospace,Menlo,monospace">S</text>' +
        '<text x="168" y="57" font-size="11" text-anchor="middle" fill="#fff" font-family="ui-monospace,Menlo,monospace">N</text>' +
        '<circle cx="252" cy="52" r="13" stroke="' + INK + '" stroke-width="1.3" fill="' + MBG + '"/>' +
        '<path d="M252 52l9 -5" stroke="#c8524f" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M252 52l-9 5" stroke="#3f6fbf" stroke-width="2.4" stroke-linecap="round"/>' +
        lbl(228, 80, '小磁针', 7.5) +
        lbl(96, 90, '磁感线 N → S'));
    },

    oersted: function (v) {
      if (v === 'solenoid' || v === 'electromagnet') {
        let coil = '';
        for (let i = 0; i < 5; i++) {
          coil += '<ellipse cx="' + (118 + i * 17) + '" cy="50" rx="7" ry="19" stroke="' + ORG + '" stroke-width="1.5"/>';
        }
        return svgWrap(
          (v === 'electromagnet' ? '<rect x="108" y="40" width="100" height="20" rx="4" fill="#dfe3e8" stroke="' + INK + '" stroke-width="1.2"/>' : '') +
          coil +
          '<path d="M118 31h68" stroke="' + CYA + '" stroke-width="1.2" stroke-dasharray="3 3"/>' +
          svgArrow(150, 24, 176, 24, CYA, 1.3) +
          lbl(104, 24, 'S') + lbl(190, 24, 'N') +
          lbl(214, 56, 'I', 9, ORG));
      }
      return svgWrap(
        '<path d="M60 44h200" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M74 34a20 20 0 0 1 0 20" stroke="' + CYA + '" stroke-width="1.1"/>' +
        '<path d="M74 54a20 20 0 0 1 0 -20" stroke="' + CYA + '" stroke-width="1.1" stroke-dasharray="2 2"/>' +
        '<circle cx="160" cy="74" r="12" stroke="' + INK + '" stroke-width="1.3" fill="' + MBG + '"/>' +
        '<path d="M160 74l8 -6" stroke="#c8524f" stroke-width="2.4" stroke-linecap="round"/>' +
        svgArrow(196, 44, 232, 44, ORG, 1.5) +
        lbl(238, 48, 'I', 9, ORG) + lbl(140, 92, '小磁针偏转'));
    },

    induction: function (v) {
      let coil = '';
      for (let i = 0; i < 4; i++) coil += '<ellipse cx="' + (128 + i * 13) + '" cy="48" rx="6" ry="18" stroke="' + ORG + '" stroke-width="1.5"/>';
      const magX = v === 'pull' ? 214 : v === 'still' ? 168 : 62;
      return svgWrap(
        coil +
        '<rect x="' + (magX - 14) + '" y="40" width="28" height="16" fill="' + MBG + '" stroke="' + INK + '" stroke-width="1.3"/>' +
        '<path d="M' + (magX + 1) + ' 40h13v16h-13z" fill="#c8524f" opacity="0.85"/>' +
        '<text x="' + (magX - 7) + '" y="52" font-size="8" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">S</text>' +
        '<text x="' + (magX + 5) + '" y="52" font-size="8" fill="#fff" font-family="ui-monospace,Menlo,monospace">N</text>' +
        (v !== 'still' ? svgArrow(magX + (v === 'pull' ? 22 : -22), 28, magX + (v === 'pull' ? 44 : -44), 28, CYA, 1.4) : '') +
        '<path d="M178 66h44" stroke="' + INK + '" stroke-width="1.2"/>' +
        circle(240, 66, 13) +
        '<text x="240" y="70" font-size="10" text-anchor="middle" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">G</text>' +
        '<path d="M240 66l7 -7" stroke="#c8524f" stroke-width="2" stroke-linecap="round"/>' +
        lbl(30, 84, v === 'still' ? '静止：无电流' : v === 'pull' ? '拔出：反向电流' : '插入：产生电流'));
    },

    generator: function (v) {
      let wave = '';
      for (let i = 0; i <= 60; i++) {
        const x = 40 + i * 1.3;
        const u = i / 60 * Math.PI * 4;
        const y = 30 - (v === 'dc' ? Math.abs(Math.sin(u)) : Math.sin(u)) * 12;
        wave += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      return svgWrap(
        '<rect x="52" y="52" width="18" height="34" fill="#c8524f" opacity="0.8"/>' +
        '<rect x="120" y="52" width="18" height="34" fill="#3f6fbf" opacity="0.8"/>' +
        '<text x="56" y="49" font-size="8" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">N</text>' +
        '<text x="124" y="49" font-size="8" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">S</text>' +
        '<ellipse cx="95" cy="69" rx="22" ry="16" stroke="' + ORG + '" stroke-width="2"/>' +
        '<path d="M95 53v-6" stroke="' + INK + '" stroke-width="1.2"/>' +
        svgArrow(95, 47, 108, 47, MUT, 1.2) +
        '<path d="' + wave + '" stroke="' + CYA + '" stroke-width="1.6" fill="none"/>' +
        '<path d="M40 30h80" stroke="' + DIML + '" stroke-width="1"/>' +
        lbl(150, 84, v === 'dc' ? '换向器 → 脉动直流' : '滑环 → 交流电'));
    },

    motor: function (v) {
      return svgWrap(
        '<rect x="46" y="34" width="16" height="34" fill="#c8524f" opacity="0.8"/>' +
        '<rect x="146" y="34" width="16" height="34" fill="#3f6fbf" opacity="0.8"/>' +
        '<text x="49" y="31" font-size="8" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">N</text>' +
        '<text x="149" y="31" font-size="8" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">S</text>' +
        '<rect x="78" y="30" width="52" height="42" stroke="' + ORG + '" stroke-width="2" fill="none"/>' +
        '<path d="M104 24v-6M104 78v6" stroke="' + INK + '" stroke-width="1.2"/>' +
        svgArrow(96, 44, 96, 26, CYA, 1.5) +
        svgArrow(112, 58, 112, 76, CYA, 1.5) +
        '<path d="M186 50h34M186 62h34" stroke="' + INK + '" stroke-width="1.1"/>' +
        lbl(186, 44, '换向器', 7.5) +
        lbl(24, 86, v === 'basic' ? '无换向器：来回摆动' : v === 'reverse' ? '电流反向：反转' : '持续旋转'));
    },

    current: function (v) {
      let dots = '';
      for (let i = 0; i < 9; i++) dots += '<circle cx="' + (78 + i * 18) + '" cy="48" r="3" fill="' + CYA + '"/>';
      return svgWrap(
        '<rect x="64" y="34" width="170" height="28" rx="14" stroke="' + INK + '" stroke-width="1.3" fill="' + MBG + '"/>' +
        dots +
        svgArrow(96, 24, 190, 24, ORG, 1.5) +
        lbl(120, 18, '电流方向 I', 7.5, ORG) +
        svgArrow(190, 76, 96, 76, CYA, 1.4) +
        lbl(112, 90, '电子流方向', 7.5, CYA) +
        (v === 'ammeter'
          ? circle(262, 48, 14) + '<text x="262" y="52" font-size="10" text-anchor="middle" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">A</text>'
          : ''));
    },

    symbols: function (v) {
      if (v === 'load') {
        return svgWrap(
          bulbSymbol(96, 48, 18) +
          '<rect x="146" y="34" width="46" height="28" stroke="' + INK + '" stroke-width="1.4" fill="' + MBG + '"/>' +
          circle(232, 48, 18) + '<text x="232" y="53" font-size="12" text-anchor="middle" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">M</text>' +
          '<path d="M114 48h32M192 48h22" stroke="' + INK + '" stroke-width="1.3"/>' +
          lbl(72, 82, '灯泡') + lbl(152, 82, '电阻') + lbl(220, 82, '电动机'));
      }
      if (v === 'meter') {
        return svgWrap(
          circle(92, 48, 18) + '<text x="92" y="53" font-size="12" text-anchor="middle" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">A</text>' +
          circle(228, 48, 18) + '<text x="228" y="53" font-size="12" text-anchor="middle" fill="' + INK + '" font-family="ui-monospace,Menlo,monospace">V</text>' +
          '<path d="M110 48h22M74 48h-22" stroke="' + INK + '" stroke-width="1.3"/>' +
          '<path d="M210 48h-22M246 48h22" stroke="' + INK + '" stroke-width="1.3"/>' +
          '<path d="M92 66v12h136v-12" stroke="' + CYA + '" stroke-width="1.1" stroke-dasharray="3 3"/>' +
          lbl(46, 86, '电流表串联') + lbl(196, 86, '电压表并联', 7.5));
      }
      return svgWrap(
        battSymbol(84, 48, true) +
        '<path d="M84 26v22M110 48h34" stroke="' + INK + '" stroke-width="1.3"/>' +
        '<path d="M144 48l16 -12" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<circle cx="144" cy="48" r="2.6" fill="' + INK + '"/><circle cx="166" cy="48" r="2.6" fill="' + INK + '"/>' +
        '<path d="M166 48h34" stroke="' + INK + '" stroke-width="1.3"/>' +
        bulbSymbol(216, 48, 18) +
        '<path d="M234 48h28v22H84v-12" stroke="' + INK + '" stroke-width="1.3"/>' +
        lbl(70, 84, '电源') + lbl(140, 84, '开关') + lbl(204, 84, '灯泡'));
    },

    ohm: function (v) {
      const R = v === 'r5' ? 5 : v === 'r20' ? 20 : 10;
      const yEnd = 74 - (12 / R) * 27;
      return svgWrap(
        '<path d="M56 74h190M56 74V16" stroke="' + INK + '" stroke-width="1.3"/>' +
        '<path d="M56 74l' + (150) + ' ' + (yEnd - 74) + '" stroke="' + ORG + '" stroke-width="1.8"/>' +
        '<circle cx="206" cy="' + yEnd.toFixed(1) + '" r="3.4" fill="' + ORG + '"/>' +
        lbl(238, 82, 'U', 8) + lbl(44, 22, 'I', 8) +
        lbl(64, 34, 'R = ' + R + ' Ω', 8, MUT) +
        lbl(96, 90, '斜率 = 1/R'));
    },

    circuit: function (v) {
      if (v === 'parallel') {
        return svgWrap(
          battSymbol(56, 48, false) +
          '<path d="M56 30v-8h44M100 22h34" stroke="' + INK + '" stroke-width="1.3"/>' +
          '<path d="M134 22l12 -8" stroke="' + INK + '" stroke-width="1.5"/>' +
          '<path d="M146 22h44v-8h22M146 22h44v56h22" stroke="' + INK + '" stroke-width="1.3"/>' +
          bulbSymbol(168, 14, 11) + bulbSymbol(168, 78, 11) +
          '<path d="M212 14h34v64h-34" stroke="' + INK + '" stroke-width="1.3"/>' +
          '<path d="M212 46h34" stroke="' + INK + '" stroke-width="1.3"/>' +
          '<path d="M246 78v-30" stroke="' + INK + '" stroke-width="1.3"/>' +
          '<circle cx="212" cy="46" r="2.4" fill="' + INK + '"/>' +
          lbl(24, 88, '并联：U 相同'));
      }
      return svgWrap(
        battSymbol(56, 48, false) +
        '<path d="M56 30v-8h48M104 22h30" stroke="' + INK + '" stroke-width="1.3"/>' +
        '<path d="M134 22l12 -8M146 22h26" stroke="' + INK + '" stroke-width="1.5"/>' +
        bulbSymbol(190, 22, 12) + bulbSymbol(190, 74, 12) +
        '<path d="M208 22h30v52h-30M208 74h-42M166 74v14H56v-20" stroke="' + INK + '" stroke-width="1.3"/>' +
        lbl(24, 90, '串联：I 相同'));
    },

    assembly: function () {
      return svgWrap(
        '<path d="M70 70V34h44M114 34h26" stroke="' + INK + '" stroke-width="1.3"/>' +
        '<path d="M140 34l12 -8M152 34h40v18" stroke="' + INK + '" stroke-width="1.5"/>' +
        bulbSymbol(192, 66, 14) +
        '<path d="M192 52v-0M178 66H96v14h-26" stroke="' + INK + '" stroke-width="1.3"/>' +
        battSymbol(70, 62, false) +
        circle(126, 34, 8, CYA, 1.1) + lbl(122, 37, '1', 7, CYA) +
        circle(230, 78, 8, CYA, 1.1) + lbl(226, 81, '2', 7, CYA) +
        circle(160, 22, 8, CYA, 1.1) + lbl(156, 25, '3', 7, CYA) +
        lbl(240, 34, '闭合回路'));
    },

    power: function (v) {
      const P = v === 'p5' ? 5 : v === 'p100' ? 100 : 40;
      return svgWrap(
        bulbSymbol(80, 44, 18) +
        '<path d="M98 44h20" stroke="' + INK + '" stroke-width="1.3"/>' +
        '<rect x="132" y="26" width="76" height="36" rx="4" stroke="' + INK + '" stroke-width="1.3" fill="' + MBG + '"/>' +
        '<text x="170" y="49" font-size="11" text-anchor="middle" fill="' + ORG + '" font-family="ui-monospace,Menlo,monospace">' + P + ' W</text>' +
        '<path d="M208 44h40" stroke="' + INK + '" stroke-width="1.3"/>' +
        '<circle cx="262" cy="44" r="13" stroke="' + INK + '" stroke-width="1.3" fill="' + MBG + '"/>' +
        '<path d="M262 44l8 -6" stroke="#c8524f" stroke-width="2" stroke-linecap="round"/>' +
        lbl(52, 84, 'W = Pt') + lbl(232, 84, '电能表', 7.5));
    }
  };

  /* ---------------- dom ---------------- */

  const $ = id => document.getElementById(id);
  const stageEl = $('stage');
  const canvas = $('scene');
  const chipLayer = $('chips');
  const telemetryEl = $('telemetry');

  const state = {
    chapter: 'static', lang: 'zh', playing: true, spin: false, t: 0,
    variant: {
      static: 'repel', electron: 'neutral', magnet: 'bar', oersted: 'straight',
      induction: 'insert', generator: 'ac', motor: 'commutator', current: 'electron',
      symbols: 'power', ohm: 'r10', circuit: 'series', assembly: 'build', power: 'p40'
    }
  };
  const scenes = {};
  let active = null;
  let chipEls = [];
  let lastW = 0, lastH = 0;

  /* ---------------- renderer ---------------- */

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (err) {
    renderer = null;
  }
  if (!renderer) {
    document.getElementById('boot').innerHTML =
      '<div class="boot-fail"><b>无法启动 3D 渲染</b><p>当前浏览器或设备未启用 WebGL，请更换浏览器后重试。<br>WebGL is not available in this browser.</p></div>';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  function buildEnvironment() {
    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 128;
    const ctx = cv.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 0, 128);
    grd.addColorStop(0, '#2d4360');
    grd.addColorStop(0.42, '#16222f');
    grd.addColorStop(0.52, '#080f16');
    grd.addColorStop(1, '#03070b');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 128);

    const keyGlow = ctx.createRadialGradient(80, 24, 0, 80, 24, 64);
    keyGlow.addColorStop(0, 'rgba(255,255,255,0.95)');
    keyGlow.addColorStop(0.35, 'rgba(190,225,255,0.32)');
    keyGlow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = keyGlow;
    ctx.fillRect(0, 0, 256, 128);

    const rimGlow = ctx.createRadialGradient(208, 54, 0, 208, 54, 58);
    rimGlow.addColorStop(0, 'rgba(70,150,255,0.55)');
    rimGlow.addColorStop(1, 'rgba(70,150,255,0)');
    ctx.fillStyle = rimGlow;
    ctx.fillRect(0, 0, 256, 128);

    const tex = new THREE.CanvasTexture(cv);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
    tex.dispose();
    return env;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080d14);
  scene.fog = new THREE.Fog(0x080d14, 20, 46);
  scene.environment = buildEnvironment();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0x9fc4ff, 0x080c12, 0.5));

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(6.5, 11, 7.5);
  key.castShadow = true;
  key.shadow.mapSize.width = 2048;
  key.shadow.mapSize.height = 2048;
  key.shadow.camera.left = -12;
  key.shadow.camera.right = 12;
  key.shadow.camera.top = 14;
  key.shadow.camera.bottom = -6;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 44;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.022;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x4f8fd6, 1.1);
  rim.position.set(-9, 6, -7);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xffa860, 0.3);
  fill.position.set(5, 2.5, 9);
  scene.add(fill);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(32, 64),
    new THREE.MeshStandardMaterial({ color: 0x04070c, roughness: 1.0, metalness: 0.0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(46, 46, 0x152232, 0x0b131c);
  grid.position.y = 0.002;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  scene.add(grid);

  /* ---------------- camera orbit ---------------- */

  const cam = { theta: 0.5, phi: 1.1, radius: 11, target: new V3(0, 1.7, 0) };
  const goal = { theta: 0.5, phi: 1.1, radius: 11, target: new V3(0, 1.7, 0) };

  let dragging = false, lastX = 0, lastY = 0, downX = 0, downY = 0, moved = 0;

  canvas.addEventListener('pointerdown', e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    downX = e.clientX;
    downY = e.clientY;
    moved = 0;
    canvas.classList.add('dragging');
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    goal.theta -= dx * 0.006;
    goal.phi = clamp(goal.phi - dy * 0.005, 0.34, 1.46);
    cam.theta = goal.theta;
    cam.phi = goal.phi;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('dragging');
    if (moved < 6 && active && active.onPick && e) {
      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const ray = new THREE.Raycaster();
      ray.setFromCamera(ndc, camera);
      active.onPick(ray);
      refreshChipValues();
      updateMetrics();
    }
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', function () { dragging = false; canvas.classList.remove('dragging'); });
  canvas.addEventListener('pointerleave', function () { dragging = false; canvas.classList.remove('dragging'); });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    goal.radius = clamp(goal.radius * Math.exp(e.deltaY * 0.0011), 5.4, 26);
  }, { passive: false });

  function fitFactor() {
    const a = camera.aspect || 1.6;
    return clamp(1.42 / a, 1, 1.55);
  }

  function applyCamera(preset) {
    goal.theta = preset.theta;
    goal.phi = preset.phi;
    goal.radius = preset.radius * fitFactor();
    goal.target.copy(preset.target);
  }

  /* ---------------- chips ---------------- */

  function chipName(def) {
    return state.lang === 'zh' ? def.zh : def.en;
  }

  function buildChips() {
    chipLayer.innerHTML = '';
    chipEls = [];
    if (!active) return;
    active.chips.forEach(def => {
      const el = document.createElement('div');
      el.className = 'fchip' + (def.small ? ' sm' : '') + (def.title ? ' title' : '');
      el.style.setProperty('--c', def.color);
      if (def.title) {
        el.innerHTML = '<div class="fchip-name">' + chipName(def) + '</div><div class="fchip-s">' + (def.sub || '') + '</div>';
      } else {
        el.innerHTML = '<div class="fchip-top"><span class="dot"></span><span class="fchip-name">' + chipName(def) + '</span></div>' +
          (def.value ? '<div class="fchip-v">' + def.value(state.lang) + '</div>' : '');
      }
      chipLayer.appendChild(el);
      chipEls.push({ el: el, def: def, v: new V3() });
    });
  }

  function refreshChipValues() {
    chipEls.forEach(c => {
      const box = c.el.querySelector('.fchip-v');
      if (box && c.def.value) box.textContent = c.def.value(state.lang);
    });
  }

  function updateChips() {
    if (!chipEls.length) return;
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    chipEls.forEach(c => {
      const p = c.def.pos();
      c.v.copy(p).project(camera);
      const visible = c.v.z < 1 && (!c.def.visible || c.def.visible());
      const x = (c.v.x * 0.5 + 0.5) * w;
      const y = (-c.v.y * 0.5 + 0.5) * h;
      c.el.style.transform = 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      c.el.style.opacity = visible ? '1' : '0';
    });
  }

  /* ---------------- panel ---------------- */

  function renderChapters() {
    const nav = $('chapters');
    nav.innerHTML = '';
    ORDER.forEach((k, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chapter' + (state.chapter === k ? ' on' : '');
      b.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + '</b><span>' + CHAPTER[k][state.lang] + '</span>';
      b.addEventListener('click', () => setChapter(k));
      nav.appendChild(b);
    });
  }

  function renderVariants() {
    const box = $('variants');
    const list = VARIANTS[state.chapter];
    box.innerHTML = '';
    box.style.display = list.length > 1 ? '' : 'none';
    list.forEach(v => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = state.lang === 'zh' ? v.zh : v.en;
      if (state.variant[state.chapter] === v.key) b.classList.add('on');
      b.addEventListener('click', () => {
        state.variant[state.chapter] = v.key;
        active.setVariant(v.key);
        applyCamera(active.camera);
        renderMini();
        renderVariants();
        syncSlider();
        refreshChipValues();
        updateMetrics();
      });
      box.appendChild(b);
    });
  }

  function syncSlider() {
    const cfg = SLIDERS[state.chapter];
    const wrap = $('sliderBlock');
    if (!cfg) {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = '';
    const val = active.params[cfg.key];
    const sl = $('slider');
    sl.min = cfg.min;
    sl.max = cfg.max;
    sl.step = cfg.step;
    sl.value = val;
    const pct = ((val - cfg.min) / (cfg.max - cfg.min)) * 100;
    sl.style.setProperty('--p', pct + '%');
    $('slValue').textContent = Number(val).toFixed(cfg.dec) + ' ' + cfg.unit;
  }

  function updateMetrics() {
    const readout = active.readout();
    const labels = MLAB[state.chapter][state.lang];
    const rk = RESULT_KEY[state.chapter];
    const result = readout.find(r => r.k === rk) || readout[0];

    $('resFormula').textContent = state.lang === 'en' && FORMULA_EN[state.chapter]
      ? FORMULA_EN[state.chapter] : FORMULA[state.chapter];
    $('resValue').textContent = result.v + (result.u ? ' ' + result.u : '');

    telemetryEl.innerHTML = '';
    readout.filter(r => r.c !== 'text').slice(0, 3).forEach(r => {
      const d = document.createElement('div');
      d.className = 'tstat';
      d.innerHTML = '<div class="k">' + (labels[r.k] || r.k) + '</div><div class="v">' + r.v + (r.u ? '<u>' + r.u + '</u>' : '') + '</div>';
      telemetryEl.appendChild(d);
    });

    const statusText = active.status ? active.status(state.lang) : '';
    $('resNote').textContent = statusText || CONTENT[state.chapter][state.lang].note;
  }

  function renderMini() {
    $('mini').innerHTML = MINI[state.chapter](state.variant[state.chapter]);
  }

  function renderPanel() {
    const c = CONTENT[state.chapter][state.lang];
    $('eyebrow').textContent = c.eyebrow;
    $('headline').innerHTML = c.headline;
    $('enLine').textContent = c.enLine;
    $('enLine').className = 'en-line' + (state.lang === 'en' ? ' cn' : '');
    $('lead').textContent = c.lead;

    const ol = $('steps');
    ol.innerHTML = '';
    c.steps.forEach((s, i) => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span><div><b>' + s[0] + '</b><p>' + s[1] + '</p></div>';
      ol.appendChild(li);
    });

    const cfg = SLIDERS[state.chapter];
    $('slLabel').textContent = cfg ? cfg[state.lang] : '';
    renderMini();
    $('watermark').textContent = CONTENT[state.chapter].no;
    $('pageNum').textContent = String(ORDER.indexOf(state.chapter) + 1).padStart(2, '0') + ' / ' + String(ORDER.length).padStart(2, '0');

    $('prev').disabled = ORDER.indexOf(state.chapter) === 0;
    $('next').disabled = ORDER.indexOf(state.chapter) === ORDER.length - 1;

    $('labTitle').textContent = state.lang === 'zh' ? '实验台' : 'Lab bench';
    $('liveText').textContent = state.lang === 'zh' ? '实时' : 'Live';
    $('stepsTitle').textContent = state.lang === 'zh' ? '原理详解' : 'How it works';
    $('footNote').textContent = state.lang === 'zh' ? '电与磁 · 电路 · 电学计算 — 一节课一个实验' : 'Electricity & magnetism · circuits · one experiment per lesson';
    $('prevText').textContent = state.lang === 'zh' ? '上一节' : 'Prev';
    $('nextText').textContent = state.lang === 'zh' ? '下一节' : 'Next';
    $('badgeText').textContent = state.lang === 'zh' ? '实时三维演示' : 'Real-time 3D';
    $('stageHint').textContent = state.chapter === 'assembly'
      ? (state.lang === 'zh' ? '点击元件接线 · 拖动旋转' : 'Click parts · drag to rotate')
      : (state.lang === 'zh' ? '拖动旋转 · 滚轮缩放' : 'Drag to rotate · Scroll to zoom');
    $('brandName').textContent = state.lang === 'zh' ? '初中电学' : 'Electricity';
    $('gradeText').textContent = state.lang === 'zh' ? '初中物理' : 'Middle School';
    $('playText').textContent = state.playing ? (state.lang === 'zh' ? '暂停' : 'Pause') : (state.lang === 'zh' ? '播放' : 'Play');
    $('spinText').textContent = state.lang === 'zh' ? '自动旋转' : 'Auto spin';
    $('resetText').textContent = state.lang === 'zh' ? '重置视角' : 'Reset view';

    $('stageLegend').innerHTML = LEGEND[state.chapter].map(x =>
      '<span style="color:' + x[0] + '"><i></i>' + x[state.lang === 'zh' ? 1 : 2] + '</span>').join('');

    renderChapters();
    renderVariants();
    syncSlider();
    updateMetrics();
  }

  /* ---------------- switching ---------------- */

  function setChapter(key, instant) {
    if (!scenes[key]) return;
    state.chapter = key;
    active = scenes[key];

    ORDER.forEach(k => { scenes[k].group.visible = k === key; });

    if (instant) {
      cam.theta = goal.theta = active.camera.theta;
      cam.phi = goal.phi = active.camera.phi;
      cam.radius = goal.radius = active.camera.radius * fitFactor();
      cam.target.copy(active.camera.target);
      goal.target.copy(active.camera.target);
    } else {
      applyCamera(active.camera);
    }

    buildChips();
    renderPanel();
    $('scrollArea').scrollTop = 0;
  }

  function setLang(lang) {
    state.lang = lang;
    document.querySelectorAll('#langSwitch button').forEach(b => {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    buildChips();
    renderPanel();
  }

  /* ---------------- init ---------------- */

  function initScenes() {
    ORDER.forEach(k => {
      if (!EL.SCENES[k]) return;
      const s = EL.SCENES[k]();
      s.group.visible = false;
      scene.add(s.group);
      scenes[k] = s;
    });
  }

  function resize() {
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, true);
    camera.aspect = w / h;
    lastW = w;
    lastH = h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(stageEl);
  window.addEventListener('resize', resize);

  /* ---------------- events ---------------- */

  $('slider').addEventListener('input', e => {
    const cfg = SLIDERS[state.chapter];
    if (!cfg) return;
    const v = parseFloat(e.target.value);
    active.setParam(cfg.key, v);
    $('slValue').textContent = v.toFixed(cfg.dec) + ' ' + cfg.unit;
    e.target.style.setProperty('--p', ((v - cfg.min) / (cfg.max - cfg.min)) * 100 + '%');
    refreshChipValues();
    updateMetrics();
  });

  $('prev').addEventListener('click', () => {
    const i = ORDER.indexOf(state.chapter);
    if (i > 0) setChapter(ORDER[i - 1]);
  });
  $('next').addEventListener('click', () => {
    const i = ORDER.indexOf(state.chapter);
    if (i < ORDER.length - 1) setChapter(ORDER[i + 1]);
  });

  document.querySelectorAll('#langSwitch button').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  $('btnPlay').addEventListener('click', () => {
    state.playing = !state.playing;
    $('playText').textContent = state.playing ? (state.lang === 'zh' ? '暂停' : 'Pause') : (state.lang === 'zh' ? '播放' : 'Play');
    $('playIcon').setAttribute('d', state.playing ? 'M5.5 3.5v9M10.5 3.5v9' : 'M5 3.4 L12 8 L5 12.6 Z');
  });

  $('btnSpin').addEventListener('click', () => {
    state.spin = !state.spin;
    $('btnSpin').classList.toggle('on', state.spin);
  });

  $('btnReset').addEventListener('click', () => {
    applyCamera(active.camera);
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ') {
      e.preventDefault();
      $('btnPlay').click();
    } else if (e.key === 'ArrowRight') {
      $('next').click();
    } else if (e.key === 'ArrowLeft') {
      $('prev').click();
    } else if (/^[1-9]$/.test(e.key)) {
      setChapter(ORDER[parseInt(e.key, 10) - 1]);
    }
  });

  /* ---------------- loop ---------------- */

  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);

    if (stageEl.clientWidth !== lastW || stageEl.clientHeight !== lastH) {
      lastW = stageEl.clientWidth;
      lastH = stageEl.clientHeight;
      resize();
    }

    if (state.playing) state.t += dt;
    if (state.spin && !dragging) goal.theta += dt * 0.16;

    const k = Math.min(1, dt * 6.5);
    cam.theta += (goal.theta - cam.theta) * k;
    cam.phi += (goal.phi - cam.phi) * k;
    cam.radius += (goal.radius - cam.radius) * k;
    cam.target.lerp(goal.target, k);

    const sp = Math.sin(cam.phi);
    camera.position.set(
      cam.target.x + cam.radius * sp * Math.sin(cam.theta),
      cam.target.y + cam.radius * Math.cos(cam.phi),
      cam.target.z + cam.radius * sp * Math.cos(cam.theta)
    );
    camera.lookAt(cam.target);

    if (active) active.update(state.t, state.playing ? dt : 0);

    renderer.render(scene, camera);
    updateChips();
  }

  /* ---------------- self test ---------------- */

  function runSelfTest() {
    const out = [];
    try {
      ORDER.forEach(function (k) {
        setChapter(k, true);
        VARIANTS[k].forEach(function (v) {
          state.variant[k] = v.key;
          active.setVariant(v.key);
          active.readout();
          active.update(1.2, 0.016);
          buildChips();
          refreshChipValues();
        });
        const cfg = SLIDERS[k];
        if (cfg) {
          [cfg.min, (cfg.min + cfg.max) / 2, cfg.max].forEach(function (val) {
            active.setParam(cfg.key, val);
            active.readout();
            active.update(2.4, 0.016);
          });
        }
        updateMetrics();
      });
      setLang('en');
      setChapter('ohm', true);
      updateMetrics();
      setLang('zh');
      out.push('OK');
    } catch (e) {
      out.push('FAIL ' + e.message + ' | ' + String(e.stack || '').split('\n')[1]);
    }
    document.title = 'SELFTEST ' + out.join(' ');
  }

  function boot() {
    try {
      initScenes();
      resize();
      const params = new URLSearchParams(location.search);
      const h = (location.hash || '').replace('#', '');
      const q = params.get('m');
      const start = ORDER.indexOf(h) >= 0 ? h : (ORDER.indexOf(q) >= 0 ? q : 'static');
      setChapter(start, true);

      const v = params.get('v');
      if (v && VARIANTS[start].some(x => x.key === v)) {
        state.variant[start] = v;
        scenes[start].setVariant(v);
        applyCamera(scenes[start].camera);
        cam.theta = goal.theta;
        cam.phi = goal.phi;
        cam.radius = goal.radius;
        cam.target.copy(goal.target);
        renderVariants();
        syncSlider();
        renderMini();
        refreshChipValues();
        updateMetrics();
      }

      setLang(params.get('lang') === 'en' ? 'en' : 'zh');

      /* the panel width settles a frame or two after boot — re-fit the stage */
      [0, 80, 300, 900, 2000].forEach(function (ms) { setTimeout(resize, ms); });

      if (params.has('selftest')) runSelfTest();

      tick();

      requestAnimationFrame(() => {
        setTimeout(() => {
          const b = $('boot');
          if (!b) return;
          b.classList.add('hide');
          setTimeout(() => b.remove(), 800);
        }, 320);
      });
    } catch (e) {
      const b = $('boot');
      if (b) {
        b.innerHTML = '<div class="boot-fail"><b>3D 初始化失败</b><p>' + e.message +
          '</p><p>请刷新页面重试 · Please reload.</p></div>';
      }
      if (window.console) console.error(e);
    }
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
