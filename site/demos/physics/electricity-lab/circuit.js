/* ============================================================
   Scenes 08–13: current, symbols, Ohm's law, series/parallel,
   circuit assembly, work & power
   ============================================================ */
(function () {
  'use strict';

  const E = window.EL;
  const V3 = E.V3, C = E.C, clamp = E.clamp;
  const chipDef = E.chipDef;

  const steel = () => E.mat(0x8fa3bd, { metalness: 0.92, roughness: 0.3 });
  const darkSteel = () => E.mat(0x51637d, { metalness: 0.85, roughness: 0.38 });

  /* ============================================================
     08  CURRENT — 电流
     ============================================================ */
  E.register('current', function () {
    const g = new THREE.Group();
    const P = { I: 0.6 };
    let mode = 'electron';

    g.add(E.glowDisc(3.4, C.cyan, 0.07));
    g.add(E.slab(8.4, 3.4, 0.18, 0x0d1520));

    const TY = 2.05, TR = 0.34, X0 = -3.0, X1 = 2.6;

    /* transparent conductor */
    const tubeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(TR, TR, X1 - X0, 40, 1, true),
      new THREE.MeshPhysicalMaterial({ color: 0x9fd6ea, metalness: 0.0, roughness: 0.12, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
    );
    tubeMesh.rotation.z = Math.PI / 2;
    tubeMesh.position.set((X0 + X1) / 2, TY, 0);
    g.add(tubeMesh);

    /* end caps */
    [X0, X1].forEach(function (x) {
      const c = new THREE.Mesh(new THREE.TorusGeometry(TR, 0.022, 8, 32), steel());
      c.rotation.y = Math.PI / 2;
      c.position.set(x, TY, 0);
      g.add(c);
    });

    /* fixed lattice ions */
    const ionMat = E.mat(0xd98a4a, { metalness: 0.7, roughness: 0.4, emissive: 0x4a2408, emissiveIntensity: 0.4 });
    const ions = new THREE.Group();
    g.add(ions);
    for (let i = 0; i < 11; i++) {
      const x = X0 + 0.3 + i * ((X1 - X0 - 0.6) / 10);
      for (let k = 0; k < 3; k++) {
        const a = k / 3 * Math.PI * 2 + i * 0.5;
        const s = E.mesh(new THREE.SphereGeometry(0.082, 12, 10), ionMat, x, TY + Math.cos(a) * 0.19, Math.sin(a) * 0.19, false);
        ions.add(s);
      }
    }

    /* drifting electrons */
    const eMat = E.mat(0x8fc4ff, { metalness: 0.2, roughness: 0.3, emissive: 0x3f7fff, emissiveIntensity: 1.3 });
    const electrons = [];
    for (let i = 0; i < 34; i++) {
      const e = E.mesh(new THREE.SphereGeometry(0.05, 10, 8), eMat, 0, TY, 0, false);
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.24;
      e.userData = { y: Math.cos(a) * r, z: Math.sin(a) * r, u: Math.random(), wob: Math.random() * 6.28 };
      g.add(e);
      electrons.push(e);
    }

    /* direction arrows */
    const curArrow = new E.Arrow(0xffb347, { radius: 0.03, headRadius: 0.1, headLen: 0.22 });
    curArrow.set(new V3(-1.5, TY + 0.72, 0), new V3(1, 0, 0), 3.0);
    g.add(curArrow.group);
    const eArrow = new E.Arrow(0x4d8dff, { radius: 0.03, headRadius: 0.1, headLen: 0.22 });
    eArrow.set(new V3(1.5, TY - 0.72, 0), new V3(-1, 0, 0), 3.0);
    g.add(eArrow.group);

    /* ammeter */
    const meter = E.dial(0.5, 'A', 'AMPERE', { ticks: 10 });
    meter.group.position.set(3.45, 1.05, 0.55);
    meter.group.rotation.y = -0.35;
    g.add(meter.group);
    const mStand = E.mesh(new THREE.BoxGeometry(0.8, 0.62, 0.36), E.mat(0x1b2431, { metalness: 0.4, roughness: 0.6 }), 3.45, 0.5, 0.2);
    g.add(mStand);

    const termPlus = E.sign('+', 0.07, C.magenta);
    termPlus.position.set(3.2, 0.92, 0.95);
    g.add(termPlus);
    const termMinus = E.sign('-', 0.07, C.blue);
    termMinus.position.set(3.7, 0.92, 0.95);
    g.add(termMinus);

    const w1 = E.wire([new V3(X1, TY, 0), new V3(3.45, TY, 0), new V3(3.45, 1.55, 0.35)], 0.026, C.copper);
    const w2 = E.wire([new V3(3.2, 0.72, 0.85), new V3(3.2, 0.35, 0.85), new V3(-3.0, 0.35, 0.85), new V3(-3.0, 1.5, 0.4), new V3(-3.0, TY, 0.1)], 0.026, C.copper);
    g.add(w1, w2);

    /* battery */
    const batt = E.mesh(new THREE.BoxGeometry(1.0, 0.5, 0.5), E.mat(0x243244, { metalness: 0.5, roughness: 0.5 }), 0, 0.45, 0.85);
    g.add(batt);

    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.012, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x3fd6f2, transparent: true, opacity: 0 })
    );
    glowRing.position.copy(meter.group.position);
    glowRing.rotation.y = -0.35;
    g.add(glowRing);

    let drift = 0;

    function update(t, dt) {
      const I = P.I;
      const v = 0.05 + I * 0.32;
      drift += dt * v;

      const span = X1 - X0 - 0.2;
      electrons.forEach(function (e) {
        const u = ((e.userData.u + drift) % 1 + 1) % 1;
        e.position.set(X1 - 0.1 - u * span, TY + e.userData.y + Math.sin(t * 6 + e.userData.wob) * 0.012, e.userData.z);
      });

      const showCur = mode !== 'electron';
      const showE = mode !== 'conventional';
      curArrow.group.visible = showCur;
      eArrow.group.visible = showE;
      curArrow.material.emissiveIntensity = 0.5 + I * 0.4;
      eArrow.material.emissiveIntensity = 0.5 + I * 0.4;

      meter.set(clamp(I / 2, 0, 1));
      glowRing.material.opacity = mode === 'ammeter' ? 0.55 + 0.35 * Math.sin(t * 3) : 0;
      termPlus.visible = termMinus.visible = mode === 'ammeter';
    }

    function readout() {
      const Q = P.I * 1;
      return [
        { k: 'I', v: P.I.toFixed(2), u: 'A' },
        { k: 'Q', v: Q.toFixed(2), u: 'C/s' },
        { k: 'n', v: (Q / 1.6e-19 / 1e18).toFixed(1), u: '×10¹⁸/s' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.26, phi: 1.14, radius: 9.0, target: new V3(0.2, 1.8, 0) },
      chips: [
        chipDef('电流 I', 'Current I', 'I = Q / t', function () { return P.I.toFixed(2) + ' A'; }, '#ffb347', function () { return new V3(-0.6, 3.1, 0); }),
        chipDef('电流方向', 'Conventional', '＋ → －', function () { return '正电荷移动方向'; }, '#ffb347', function () { return new V3(1.6, 2.9, 0); }, { small: true, visible: function () { return mode !== 'electron'; } }),
        chipDef('电子流', 'Electron flow', '－ → ＋', function () { return '与电流反向'; }, '#4d8dff', function () { return new V3(-1.4, 1.15, 0); }, { small: true, visible: function () { return mode !== 'conventional'; } }),
        chipDef('电流表', 'Ammeter', 'IN SERIES', function () { return '串联 · ＋进－出'; }, '#45e08a', function () { return new V3(3.45, 1.95, 0.55); }, { small: true, visible: function () { return mode === 'ammeter'; } })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) { mode = key; },
      update: update,
      readout: readout
    };
  });

  /* ============================================================
     09  SYMBOLS — 电路符号
     ============================================================ */
  E.register('symbols', function () {
    const g = new THREE.Group();
    const P = { spin: 0 };
    let mode = 'power';

    g.add(E.glowDisc(3.8, C.violet, 0.07));

    const symMat = E.mat(0xdff0ff, { metalness: 0.55, roughness: 0.28, emissive: 0x2f6fa8, emissiveIntensity: 0.55 });
    const plateMat = E.mat(0x111c2a, { metalness: 0.5, roughness: 0.45, emissive: 0x0a1420, emissiveIntensity: 0.6 });

    function bars(list) {
      const grp = new THREE.Group();
      list.forEach(function (b) {
        const m = E.mesh(new THREE.BoxGeometry(b[2], b[3], 0.07), symMat, b[0], b[1], 0);
        grp.add(m);
      });
      return grp;
    }

    function ring(r) {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.026, 10, 48), symMat);
      return m;
    }

    const SYM = {
      battery: function () {
        return bars([
          [-0.34, 0, 0.36, 0.05],
          [-0.10, 0, 0.055, 0.42],
          [0.0, 0, 0.09, 0.24],
          [0.10, 0, 0.055, 0.42],
          [0.2, 0, 0.09, 0.24],
          [0.42, 0, 0.28, 0.05]
        ]);
      },
      switch: function () {
        const grp = new THREE.Group();
        grp.add(bars([[-0.36, 0, 0.3, 0.05], [0.36, 0, 0.3, 0.05]]));
        const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), symMat);
        pivot.position.set(-0.21, 0, 0);
        grp.add(pivot);
        const lever = E.mesh(new THREE.BoxGeometry(0.42, 0.05, 0.07), symMat, 0.0, 0.13, 0);
        lever.rotation.z = 0.36;
        grp.add(lever);
        const t2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), symMat);
        t2.position.set(0.21, 0, 0);
        grp.add(t2);
        return grp;
      },
      cross: function () {
        const grp = bars([[-0.34, 0, 0.3, 0.05], [0.34, 0, 0.3, 0.05], [0, 0.34, 0.05, 0.3], [0, -0.34, 0.05, 0.3]]);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 12), symMat);
        grp.add(dot);
        return grp;
      },
      bulb: function () {
        const grp = new THREE.Group();
        const r = ring(0.26);
        grp.add(r);
        const x1 = E.mesh(new THREE.BoxGeometry(0.4, 0.04, 0.07), symMat, 0, 0, 0);
        x1.rotation.z = Math.PI / 4;
        const x2 = x1.clone();
        x2.rotation.z = -Math.PI / 4;
        grp.add(x1, x2);
        grp.add(bars([[-0.34, 0, 0.3, 0.05], [0.34, 0, 0.3, 0.05]]));
        return grp;
      },
      resistor: function () {
        return bars([
          [-0.36, 0, 0.28, 0.05],
          [0.36, 0, 0.28, 0.05],
          [0, 0.16, 0.44, 0.04],
          [0, -0.16, 0.44, 0.04],
          [-0.2, 0, 0.04, 0.34],
          [0.2, 0, 0.04, 0.34]
        ]);
      },
      motor: function () {
        const grp = new THREE.Group();
        grp.add(ring(0.28));
        grp.add(bars([[-0.36, 0, 0.3, 0.05], [0.36, 0, 0.3, 0.05]]));
        const l = E.letterPlane('M', 0.36, '#dff0ff');
        l.position.z = 0.05;
        grp.add(l);
        return grp;
      },
      ammeter: function () {
        const grp = new THREE.Group();
        grp.add(ring(0.28));
        grp.add(bars([[-0.36, 0, 0.3, 0.05], [0.36, 0, 0.3, 0.05]]));
        const l = E.letterPlane('A', 0.36, '#dff0ff');
        l.position.z = 0.05;
        grp.add(l);
        return grp;
      },
      voltmeter: function () {
        const grp = new THREE.Group();
        grp.add(ring(0.28));
        grp.add(bars([[-0.36, 0, 0.3, 0.05], [0.36, 0, 0.3, 0.05]]));
        const l = E.letterPlane('V', 0.36, '#dff0ff');
        l.position.z = 0.05;
        grp.add(l);
        return grp;
      },
      rheostat: function () {
        const grp = bars([
          [-0.36, 0, 0.28, 0.05],
          [0.36, 0, 0.28, 0.05],
          [0, 0.16, 0.44, 0.04],
          [0, -0.16, 0.44, 0.04],
          [-0.2, 0, 0.04, 0.34],
          [0.2, 0, 0.04, 0.34]
        ]);
        const a = E.mesh(new THREE.BoxGeometry(0.3, 0.04, 0.06), symMat, 0, 0.28, 0.06);
        a.rotation.z = -0.5;
        grp.add(a);
        const head = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 10), symMat);
        head.rotation.z = -Math.PI / 2 - 0.5;
        head.position.set(0.14, 0.2, 0.06);
        grp.add(head);
        return grp;
      }
    };

    const SETS = {
      power: [['battery', '电池', 'Battery', '提供电能'], ['switch', '开关', 'Switch', '控制通断'], ['cross', '交叉连接', 'Junction', '有圆点才相连']],
      load: [['bulb', '灯泡', 'Lamp', '电能→光能'], ['resistor', '定值电阻', 'Resistor', '阻碍电流'], ['motor', '电动机', 'Motor', '电能→机械能']],
      meter: [['ammeter', '电流表', 'Ammeter', '串联在电路中'], ['voltmeter', '电压表', 'Voltmeter', '并联在用电器两端'], ['rheostat', '滑动变阻器', 'Rheostat', '改变电阻']]
    };

    const positions = [[-2.35, 2.0], [0, 2.0], [2.35, 2.0], [-2.35, 2.0], [0, 2.0], [2.35, 2.0]];
    const setGroups = {};
    const allPlaques = [];

    Object.keys(SETS).forEach(function (setKey) {
      const sg = new THREE.Group();
      sg.visible = setKey === mode;
      g.add(sg);
      SETS[setKey].forEach(function (def, i) {
        const pos = positions[i];
        const grp = new THREE.Group();
        grp.position.set(pos[0], pos[1], 0);
        grp.rotation.y = -pos[0] * 0.07;
        grp.rotation.x = -0.06;

        const plate = E.mesh(new THREE.BoxGeometry(1.95, 1.4, 0.1), plateMat, 0, 0, -0.06, false);
        E.addEdges(plate, 0x3fd6f2, 0.16);
        grp.add(plate);

        const sym = SYM[def[0]]();
        sym.position.z = 0.06;
        sym.scale.setScalar(1.24);
        sym.traverse(function (o) { if (o.isMesh) o.castShadow = false; });
        grp.add(sym);

        const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 1.5), E.glowMat(0x3fd6f2, 0.05));
        halo.position.z = -0.02;
        grp.add(halo);

        sg.add(grp);
        allPlaques.push({ group: grp, sym: sym, base: new THREE.Vector3(pos[0], pos[1], 0), i: i });
      });
      setGroups[setKey] = sg;
    });

    function update(t) {
      allPlaques.forEach(function (p, i) {
        if (!p.group.parent || !p.group.parent.visible) return;
        p.group.position.y = p.base.y + Math.sin(t * 1.1 + i * 0.8) * 0.045;
        p.sym.rotation.y = Math.sin(t * 0.55 + i) * 0.12;
      });
    }

    function readout() {
      return [
        { k: 'n', v: String(SETS[mode].length), u: '符号' },
        { k: 'c', v: '9', u: '常用' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0, phi: 1.38, radius: 9.2, target: new V3(0, 2.05, 0) },
      chips: (function () {
        const list = [];
        const GROUP_TITLE = { power: ['电源与开关', 'Source & switch'], load: ['用电器', 'Loads'], meter: ['测量仪表', 'Meters'] };
        ['power', 'load', 'meter'].forEach(function (setKey) {
          list.push(chipDef(GROUP_TITLE[setKey][0], GROUP_TITLE[setKey][1], 'SYMBOL SET', null, '#3fd6f2',
            function () { return new V3(0, 3.3, 0); },
            { title: true, visible: function () { return mode === setKey; } }));
          SETS[setKey].forEach(function (def, i) {
            const pos = positions[i];
            list.push(chipDef(def[1], def[2], def[3], null, '#3fd6f2', function () {
              return new V3(pos[0], pos[1] - 0.88, 0.2);
            }, { title: true, visible: function () { return mode === setKey; } }));
          });
        });
        return list;
      })(),
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        Object.keys(setGroups).forEach(function (k) { setGroups[k].visible = k === key; });
      },
      update: update,
      readout: readout
    };
  });

/* ============================================================
     10  OHM'S LAW — 欧姆定律
     ============================================================ */
  E.register('ohm', function () {
    const g = new THREE.Group();
    const P = { U: 6 };
    let mode = 'r10';

    const RV = { r5: 5, r10: 10, r20: 20 };
    const R = function () { return RV[mode]; };

    g.add(E.glowDisc(3.6, C.cyan, 0.07));
    g.add(E.slab(8.4, 3.6, 0.18, 0x0d1520));

    /* board */
    const board = E.mesh(new THREE.BoxGeometry(5.4, 0.1, 2.2), E.mat(0x16202e, { metalness: 0.3, roughness: 0.7 }), -0.8, 0.24, 0);
    E.addEdges(board, 0x2b4159, 0.5);
    g.add(board);

    /* battery pack */
    const bp = E.mesh(new THREE.BoxGeometry(1.1, 0.62, 0.9), E.mat(0x243244, { metalness: 0.55, roughness: 0.45 }), -2.9, 0.6, -0.35);
    E.addEdges(bp, 0x4a6a90, 0.3);
    g.add(bp);
    const bpPlus = E.sign('+', 0.07, C.magenta);
    bpPlus.position.set(-2.9, 0.72, 0.2);
    g.add(bpPlus);

    /* resistor */
    const resGroup = new THREE.Group();
    resGroup.position.set(-0.3, 0.42, 0);
    g.add(resGroup);
    const ceramic = E.mat(0xd9d3c4, { metalness: 0.1, roughness: 0.6 });
    const body = E.mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.9, 22), ceramic, 0, 0, 0);
    body.rotation.z = Math.PI / 2;
    resGroup.add(body);
    [-0.42, 0.42].forEach(function (x) {
      const lead = E.mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 10), E.mat(C.copper, { metalness: 0.9, roughness: 0.3 }), x, 0, 0);
      lead.rotation.z = Math.PI / 2;
      resGroup.add(lead);
    });
    const bands = [];
    [[-0.24, 0xd94a5c], [-0.06, 0x3f6fbf], [0.12, 0xd8b46a]].forEach(function (b) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.198, 0.198, 0.08, 22), E.mat(b[1], { metalness: 0.4, roughness: 0.45 }));
      m.rotation.z = Math.PI / 2;
      m.position.x = b[0];
      resGroup.add(m);
      bands.push(m);
    });

    /* ammeter in series */
    const amm = E.dial(0.46, 'A', 'AMPERE', { ticks: 10 });
    amm.group.position.set(0.85, 0.95, 1.05);
    amm.group.rotation.y = -0.28;
    g.add(amm.group);
    const ammBase = E.mesh(new THREE.BoxGeometry(0.72, 0.5, 0.34), E.mat(0x1b2431, { metalness: 0.4, roughness: 0.6 }), 0.85, 0.48, 0.85);
    g.add(ammBase);

    /* voltmeter in parallel */
    const volt = E.dial(0.46, 'V', 'VOLT', { ticks: 10 });
    volt.group.position.set(-1.35, 1.05, 1.1);
    volt.group.rotation.y = 0.24;
    g.add(volt.group);
    const voltBase = E.mesh(new THREE.BoxGeometry(0.72, 0.5, 0.34), E.mat(0x1b2431, { metalness: 0.4, roughness: 0.6 }), -1.35, 0.58, 0.9);
    g.add(voltBase);

    /* wiring */
    g.add(E.wire([
      new V3(-3.35, 0.6, -0.35), new V3(-3.35, 0.32, 0.2), new V3(-1.6, 0.32, 0.2), new V3(-1.6, 0.42, 0)
    ], 0.024, C.copper));
    g.add(E.wire([
      new V3(0.6, 0.42, 0), new V3(1.15, 0.42, 0), new V3(1.15, 0.62, 0.75), new V3(1.0, 0.7, 0.95)
    ], 0.024, C.copper));
    g.add(E.wire([
      new V3(0.85, 0.45, 0.75), new V3(0.85, 0.26, 0.2), new V3(-2.9, 0.26, 0.2), new V3(-2.9, 0.3, -0.1)
    ], 0.024, C.copper));
    /* voltmeter parallel leads */
    g.add(E.wire([
      new V3(-1.6, 0.42, 0), new V3(-1.6, 0.5, 0.55), new V3(-1.55, 0.62, 0.9)
    ], 0.02, 0x9aa8bd));
    g.add(E.wire([
      new V3(0.6, 0.42, 0), new V3(0.6, 0.5, 0.6), new V3(-1.15, 0.66, 0.95)
    ], 0.02, 0x9aa8bd));

    /* I-U graph */
    const graph = new THREE.Group();
    graph.position.set(2.85, 1.95, -0.3);
    graph.rotation.y = -0.42;
    g.add(graph);
    const plate = E.mesh(new THREE.BoxGeometry(2.2, 1.72, 0.07), E.mat(0x0a121c, { metalness: 0.4, roughness: 0.6, emissive: 0x081420, emissiveIntensity: 0.6 }), 0, 0, 0);
    E.addEdges(plate, 0x3fd6f2, 0.2);
    graph.add(plate);

    const GX = 0.88, GY = 0.62;
    graph.add(E.lineSeg(new V3(-GX, -GY, 0.05), new V3(GX, -GY, 0.05), 0x3a4f66, 1));
    graph.add(E.lineSeg(new V3(-GX, -GY, 0.05), new V3(-GX, GY, 0.05), 0x3a4f66, 1));
    for (let i = 1; i < 6; i++) {
      const x = -GX + (i / 6) * GX * 2;
      graph.add(E.lineSeg(new V3(x, -GY, 0.05), new V3(x, GY, 0.05), 0x22303f, 0.8));
    }
    for (let i = 1; i < 4; i++) {
      const y = -GY + (i / 4) * GY * 2;
      graph.add(E.lineSeg(new V3(-GX, y, 0.05), new V3(GX, y, 0.05), 0x22303f, 0.8));
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffb347 }));
    graph.add(line);

    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 12), E.mat(0xffb347, { emissive: 0xffb347, emissiveIntensity: 1.4, roughness: 0.3 }));
    graph.add(dot);

    function mapX(U) { return -GX + (U / 15) * GX * 2; }
    function mapY(I) { return -GY + (I / 3) * GY * 2; }

    function refresh() {
      const r = R();
      const Imax = Math.min(3, 15 / r);
      const p = lineGeo.attributes.position;
      p.setXYZ(0, mapX(0), mapY(0), 0.06);
      p.setXYZ(1, mapX(Imax * r), mapY(Imax), 0.06);
      p.needsUpdate = true;
      lineGeo.computeBoundingSphere();

      /* colour bands hint at the value */
      bands[0].material.color.setHex(mode === 'r5' ? 0x45e08a : mode === 'r10' ? 0xd94a5c : 0xd94a5c);
      bands[1].material.color.setHex(mode === 'r5' ? 0x45e08a : mode === 'r10' ? 0x1b1b1b : 0xd94a5c);
      bands[2].material.color.setHex(mode === 'r5' ? 0xd8b46a : mode === 'r10' ? 0x1b1b1b : 0x1b1b1b);
    }

    function update(t, dt) {
      const r = R();
      const I = P.U / r;
      amm.set(clamp(I / 3, 0, 1));
      volt.set(clamp(P.U / 15, 0, 1));
      dot.position.set(mapX(P.U), mapY(Math.min(I, 3)), 0.08);
      dot.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
      void dt;
    }

    refresh();

    function readout() {
      const I = P.U / R();
      return [
        { k: 'U', v: P.U.toFixed(1), u: 'V' },
        { k: 'R', v: String(R()), u: 'Ω' },
        { k: 'I', v: I.toFixed(2), u: 'A' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.26, phi: 1.08, radius: 9.3, target: new V3(0.35, 1.45, 0) },
      chips: [
        chipDef('电压 U', 'Voltage U', 'U = IR', function () { return P.U.toFixed(1) + ' V'; }, '#ffb347', function () { return new V3(-2.9, 1.25, -0.35); }),
        chipDef('电阻 R', 'Resistance R', 'FIXED', function () { return R() + ' Ω'; }, '#a48bff', function () { return new V3(-0.3, 0.95, 0); }),
        chipDef('电流 I', 'Current I', 'I = U / R', function () { return (P.U / R()).toFixed(2) + ' A'; }, '#3fd6f2', function () { return new V3(0.85, 1.75, 0.75); }),
        chipDef('I–U 图像', 'I–U graph', 'SLOPE = 1/R', function () { return '斜率 1/R'; }, '#45e08a', function () { return new V3(2.85, 3.0, -0.3); }, { small: true })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) { mode = key; refresh(); },
      update: update,
      readout: readout
    };
  });

  /* ============================================================
     11  SERIES / PARALLEL — 串并联
     ============================================================ */
  E.register('circuit', function () {
    const g = new THREE.Group();
    const P = { n: 2 };
    let mode = 'series';

    g.add(E.glowDisc(3.6, C.cyan, 0.07));
    g.add(E.slab(8.6, 3.4, 0.18, 0x0d1520));

    /* battery */
    const batt = new THREE.Group();
    batt.position.set(-2.7, 1.15, 0);
    g.add(batt);
    const bBody = E.mesh(new THREE.BoxGeometry(0.56, 0.78, 0.44), E.mat(0x35506e, { metalness: 0.55, roughness: 0.35, emissive: 0x0d1c2c, emissiveIntensity: 0.6 }), 0, 0, 0);
    E.addEdges(bBody, 0x8fb6dd, 0.35);
    batt.add(bBody);
    const bCap = E.mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.1, 14), E.mat(0xd8b46a, { metalness: 1, roughness: 0.22 }), 0, 0.44, 0);
    batt.add(bCap);
    const bBand = E.mesh(new THREE.BoxGeometry(0.58, 0.14, 0.46), E.mat(0x1b2a3a, { metalness: 0.5, roughness: 0.5 }), 0, -0.16, 0);
    batt.add(bBand);
    const plusG = E.sign('+', 0.055, C.magenta);
    plusG.position.set(0.14, 0.28, 0.23);
    batt.add(plusG);
    const minusG = E.sign('-', 0.055, C.blue);
    minusG.position.set(0.14, 0.12, 0.23);
    batt.add(minusG);

    /* switch */
    const sw = new THREE.Group();
    sw.position.set(-1.1, 2.62, 0);
    g.add(sw);
    const swBase = E.mesh(new THREE.BoxGeometry(0.78, 0.12, 0.34), E.mat(0x22303f, { metalness: 0.5, roughness: 0.5 }), 0, 0, 0);
    E.addEdges(swBase, 0x4f6b88, 0.4);
    sw.add(swBase);
    [-0.26, 0.26].forEach(function (x) {
      const t = E.mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 12), E.mat(0xd8b46a, { metalness: 1, roughness: 0.22 }), x, 0.12, 0);
      sw.add(t);
    });
    const lever = E.mesh(new THREE.BoxGeometry(0.54, 0.05, 0.08), E.mat(0xd8b46a, { metalness: 1, roughness: 0.22 }), 0, 0.15, 0);
    sw.add(lever);

    /* lamps */
    function makeLamp(x, y) {
      const grp = new THREE.Group();
      grp.position.set(x, y, 0);
      const base = E.mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.22, 20), E.mat(0x2b3646, { metalness: 0.5, roughness: 0.6 }), 0, -0.12, 0);
      grp.add(base);
      const l = E.lamp(0.26);
      grp.add(l.group);
      g.add(grp);
      return { group: grp, lamp: l };
    }

    const lamp1 = makeLamp(1.05, 2.62);
    const lamp2 = makeLamp(2.55, 1.3);

    /* wires rebuilt per mode */
    const wireGroup = new THREE.Group();
    g.add(wireGroup);
    const flowGroup = new THREE.Group();
    g.add(flowGroup);
    let flow = null;

    function buildWires() {
      E.clearGroup(wireGroup);
      E.clearGroup(flowGroup);
      flow = null;

      const r = 0.026;
      let path;

      if (mode === 'series') {
        lamp2.group.position.set(2.55, 2.62, 0);
        wireGroup.add(E.wire([
          new V3(-2.7, 1.5, 0), new V3(-2.7, 2.62, 0), new V3(-1.43, 2.62, 0)
        ], r, C.copper));
        wireGroup.add(E.wire([
          new V3(-0.77, 2.62, 0), new V3(0.79, 2.62, 0)
        ], r, C.copper));
        wireGroup.add(E.wire([
          new V3(1.31, 2.62, 0), new V3(2.29, 2.62, 0)
        ], r, C.copper));
        wireGroup.add(E.wire([
          new V3(2.81, 2.62, 0), new V3(3.35, 2.62, 0), new V3(3.35, 0.62, 0), new V3(-2.7, 0.62, 0), new V3(-2.7, 0.84, 0)
        ], r, C.copper));
        path = [
          new V3(-2.7, 1.5, 0), new V3(-2.7, 2.62, 0), new V3(3.35, 2.62, 0),
          new V3(3.35, 0.62, 0), new V3(-2.7, 0.62, 0), new V3(-2.7, 1.5, 0)
        ];
      } else {
        lamp2.group.position.set(1.05, 1.3, 0);
        wireGroup.add(E.wire([
          new V3(-2.7, 1.5, 0), new V3(-2.7, 2.62, 0), new V3(-1.43, 2.62, 0)
        ], r, C.copper));
        wireGroup.add(E.wire([
          new V3(-0.77, 2.62, 0), new V3(0.0, 2.62, 0)
        ], r, C.copper));
        /* branch 1 — lamp1 on top rail */
        wireGroup.add(E.wire([
          new V3(0.0, 2.62, 0), new V3(0.79, 2.62, 0)
        ], r, C.copper));
        wireGroup.add(E.wire([
          new V3(1.31, 2.62, 0), new V3(2.4, 2.62, 0)
        ], r, C.copper));
        /* branch 2 — lamp2 on the lower rail */
        wireGroup.add(E.wire([
          new V3(0.0, 2.62, 0), new V3(0.0, 1.3, 0), new V3(0.79, 1.3, 0)
        ], r, C.copper));
        wireGroup.add(E.wire([
          new V3(1.31, 1.3, 0), new V3(2.4, 1.3, 0)
        ], r, C.copper));
        /* node dots at the two junctions */
        [[0.0, 2.62], [2.4, 2.62], [2.4, 1.3]].forEach(function (n) {
          const d = E.mesh(new THREE.SphereGeometry(0.055, 12, 10), E.mat(0xd8b46a, { metalness: 1, roughness: 0.3 }), n[0], n[1], 0);
          wireGroup.add(d);
        });
        wireGroup.add(E.wire([
          new V3(2.4, 2.62, 0), new V3(2.4, 1.3, 0)
        ], r, C.copper));
        wireGroup.add(E.wire([
          new V3(2.4, 2.62, 0), new V3(3.35, 2.62, 0), new V3(3.35, 0.62, 0), new V3(-2.7, 0.62, 0), new V3(-2.7, 0.84, 0)
        ], r, C.copper));
        path = [
          new V3(-2.7, 1.5, 0), new V3(-2.7, 2.62, 0), new V3(2.4, 2.62, 0),
          new V3(3.35, 2.62, 0), new V3(3.35, 0.62, 0), new V3(-2.7, 0.62, 0), new V3(-2.7, 1.5, 0)
        ];
      }

      const curve = new THREE.CatmullRomCurve3(path, false, 'catmullrom', 0.02);
      flow = new E.Flow(18, 0xffd27a, 0.042, curve);
      flowGroup.add(flow.group);
    }

    function update(t, dt) {
      const emf = P.n * 1.5;
      const perLamp = mode === 'series' ? emf / 2 : emf;
      const b = clamp(Math.pow(perLamp / 2.6, 1.2), 0.16, 1.25);
      lamp1.lamp.set(b);
      lamp2.lamp.set(b);
      if (flow) flow.update(t, 0.05 + b * 0.05);
      void dt;
    }

    buildWires();

    function readout() {
      const emf = P.n * 1.5;
      const per = mode === 'series' ? emf / 2 : emf;
      const Req = mode === 'series' ? 2 * 12 : 6;
      return [
        { k: 'U', v: emf.toFixed(1), u: 'V' },
        { k: 'Ul', v: per.toFixed(2), u: 'V' },
        { k: 'I', v: (emf / Req).toFixed(2), u: 'A' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.08, phi: 1.34, radius: 9.2, target: new V3(0.2, 1.68, 0) },
      chips: [
        chipDef('电源', 'Source', 'n CELLS', function () { return (P.n * 1.5).toFixed(1) + ' V'; }, '#ffb347', function () { return new V3(-2.7, 1.65, 0); }),
        chipDef(mode === 'series' ? '串联' : '并联', mode === 'series' ? 'Series' : 'Parallel', 'CONNECTION', function () { return mode === 'series' ? '一条路径' : '两条支路'; }, '#3fd6f2', function () { return new V3(1.8, 3.25, 0); }),
        chipDef('每灯电压', 'Voltage per lamp', 'U / n', function () { return (mode === 'series' ? P.n * 1.5 / 2 : P.n * 1.5).toFixed(2) + ' V'; }, '#45e08a', function () { return new V3(2.55, 1.95, 0.3); }, { small: true })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) { mode = key; buildWires(); },
      update: update,
      readout: readout
    };
  });

  /* ============================================================
     12  ASSEMBLY — 组装电路
     ============================================================ */
  E.register('assembly', function () {
    const g = new THREE.Group();
    const P = {};
    let mode = 'build';

    g.add(E.glowDisc(3.4, C.cyan, 0.07));
    g.add(E.slab(7.6, 3.4, 0.18, 0x0d1520));

    const board = E.mesh(new THREE.BoxGeometry(5.8, 0.1, 2.0), E.mat(0x16202e, { metalness: 0.3, roughness: 0.7 }), 0, 0.24, 0);
    E.addEdges(board, 0x2b4159, 0.45);
    g.add(board);

    let step = 0;
    let hint = '';

    /* battery */
    const batt = new THREE.Group();
    batt.position.set(-2.0, 1.0, 0);
    g.add(batt);
    const battMat = E.mat(0x243244, { metalness: 0.55, roughness: 0.45, emissive: 0x0e2233, emissiveIntensity: 0.5 });
    const bBody = E.mesh(new THREE.BoxGeometry(0.86, 0.7, 0.56), battMat, 0, 0, 0);
    batt.add(bBody);
    const bTop = E.mesh(new THREE.BoxGeometry(0.9, 0.08, 0.6), E.mat(0xd8b46a, { metalness: 1, roughness: 0.25 }), 0, 0.36, 0);
    batt.add(bTop);
    const plusG = E.sign('+', 0.075, C.magenta);
    plusG.position.set(0.28, 0.06, 0.3);
    batt.add(plusG);
    const minusG = E.sign('-', 0.075, C.blue);
    minusG.position.set(-0.28, 0.06, 0.3);
    batt.add(minusG);
    batt.traverse(function (o) { if (o.isMesh) o.userData.step = 1; });

    /* switch */
    const sw = new THREE.Group();
    sw.position.set(0, 2.42, 0);
    g.add(sw);
    const swBase = E.mesh(new THREE.BoxGeometry(0.9, 0.16, 0.34), E.mat(0x1b2431, { metalness: 0.5, roughness: 0.5 }), 0, 0, 0);
    sw.add(swBase);
    [-0.3, 0.3].forEach(function (x) {
      const t = E.mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 10), E.mat(0xd8b46a, { metalness: 1, roughness: 0.25 }), x, 0.12, 0);
      sw.add(t);
    });
    const lever = E.mesh(new THREE.BoxGeometry(0.62, 0.05, 0.09), E.mat(0xd8b46a, { metalness: 1, roughness: 0.25 }), 0, 0.12, 0);
    lever.rotation.z = 0.45;
    lever.position.set(-0.02, 0.26, 0);
    sw.add(lever);
    sw.traverse(function (o) { if (o.isMesh) o.userData.step = 3; });

    /* lamp */
    const lampBase = E.mesh(new THREE.CylinderGeometry(0.3, 0.33, 0.26, 22), E.mat(0x2b3646, { metalness: 0.5, roughness: 0.6 }), 2.0, 1.24, 0);
    g.add(lampBase);
    const lamp = E.lamp(0.3);
    lamp.group.position.set(2.0, 1.37, 0);
    g.add(lamp.group);
    lamp.set(0);

    /* wires — ghost until step 2 */
    const wireGroup = new THREE.Group();
    g.add(wireGroup);
    const realWires = new THREE.Group();
    g.add(realWires);

    const SEGS = [
      [[-2.0, 1.36, 0], [-2.0, 2.42, 0], [-0.45, 2.42, 0]],
      [[0.45, 2.42, 0], [2.62, 2.42, 0], [2.62, 1.24, 0], [2.3, 1.24, 0]],
      [[1.7, 1.24, 0], [1.7, 0.62, 0], [-2.0, 0.62, 0], [-2.0, 0.64, 0]]
    ];

    SEGS.forEach(function (seg) {
      const pts = seg.map(function (p) { return new V3(p[0], p[1], p[2]); });
      for (let gi = 0; gi < pts.length - 1; gi++) {
        wireGroup.add(E.lineSeg(pts[gi], pts[gi + 1], 0x63a6d8, 0.85, true));
      }

      const real = E.wire(pts, 0.026, C.copper);
      real.visible = false;
      realWires.add(real);

      /* fat invisible pick proxy */
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const len = a.distanceTo(b);
        if (len < 0.01) continue;
        const proxy = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.16, len, 8),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        proxy.position.copy(a).addScaledVector(new V3().subVectors(b, a), 0.5);
        proxy.quaternion.setFromUnitVectors(new V3(0, 1, 0), new V3().subVectors(b, a).normalize());
        proxy.userData.step = 2;
        g.add(proxy);
      }
    });

    const flow = new E.Flow(24, 0xffd27a, 0.05, new THREE.CatmullRomCurve3([
      new V3(-2.0, 1.36, 0), new V3(-2.0, 2.42, 0), new V3(2.62, 2.42, 0),
      new V3(2.62, 1.24, 0), new V3(1.7, 1.24, 0), new V3(1.7, 0.62, 0),
      new V3(-2.0, 0.62, 0), new V3(-2.0, 1.36, 0)
    ], false, 'catmullrom', 0.02));
    g.add(flow.group);
    flow.setVisible(false);

    function applyStep() {
      battMat.opacity = step >= 1 ? 1 : 0.3;
      battMat.transparent = step < 1;
      battMat.depthWrite = step >= 1;
      battMat.emissiveIntensity = step >= 1 ? 0.55 : 0.9;
      battMat.emissive.setHex(step >= 1 ? 0x0e2233 : 0x1d5fd6);
      battMat.needsUpdate = true;

      wireGroup.visible = step < 2;
      realWires.visible = step >= 2;

      const closed = step >= 3;
      lever.rotation.z = closed ? 0 : 0.45;
      lever.position.set(closed ? 0 : -0.02, closed ? 0.14 : 0.26, 0);
      lamp.set(closed ? 0.95 : 0);
      plusG.visible = minusG.visible = step >= 1;
      flow.setVisible(closed);
    }

    applyStep();

    function onPick(raycaster) {
      const targets = [];
      g.traverse(function (o) {
        if (o.isMesh && o.userData.step && o.visible) targets.push(o);
      });
      const hits = raycaster.intersectObjects(targets, false);
      if (!hits.length) return;
      const want = hits[0].object.userData.step;
      if (want === step + 1) {
        step = want;
        hint = '';
        applyStep();
      } else if (want <= step) {
        hint = { zh: '这一步已经完成', en: 'This step is already complete.' };
      } else {
        hint = {
          zh: '先完成第 ' + (step + 1) + ' 步：' + (step === 0 ? '放入电池' : step === 1 ? '连接导线' : '闭合开关'),
          en: 'Complete step ' + (step + 1) + ' first: ' + (step === 0 ? 'add the cell' : step === 1 ? 'connect the wires' : 'close the switch') + '.'
        };
      }
    }

    function update(t) {
      if (step >= 3) flow.update(t, 0.09);
      if (step < 3) {
        lamp.set(0.02 + 0.02 * Math.sin(t * 2));
      }
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.1, phi: 1.3, radius: 8.8, target: new V3(0.1, 1.62, 0) },
      chips: [
        chipDef('第 1 步 · 电池', 'Step 1 · Cell', 'POWER', function (lang) { return step >= 1 ? (lang === 'en' ? 'Done' : '已完成') : (lang === 'en' ? 'Click the cell' : '点击电池'); }, '#ffb347', function () { return new V3(-2.0, 1.62, 0.3); }, { small: true }),
        chipDef('第 2 步 · 导线', 'Step 2 · Wires', 'CLOSED LOOP', function (lang) { return step >= 2 ? (lang === 'en' ? 'Done' : '已完成') : (lang === 'en' ? 'Click the wires' : '点击虚线'); }, '#3fd6f2', function () { return new V3(0, 0.42, 0.6); }, { small: true }),
        chipDef('第 3 步 · 开关', 'Step 3 · Switch', 'SWITCH ON', function (lang) { return step >= 3 ? (lang === 'en' ? 'Closed' : '已闭合') : (lang === 'en' ? 'Click the switch' : '点击开关'); }, '#45e08a', function () { return new V3(0, 2.95, 0); }, { small: true }),
        chipDef('状态', 'Status', 'PROGRESS', function (lang) { return step >= 3 ? (lang === 'en' ? 'Closed · Lamp on' : '通路 · 灯亮') : (lang === 'en' ? 'Open circuit' : '断路'); }, '#ff4d8d', function () { return new V3(2.0, 2.55, 0.2); })
      ],
      status: function (lang) {
        if (hint) return hint[lang] || hint.zh;
        if (lang === 'en') return step >= 3
          ? 'Circuit closed: conventional current flows from the positive terminal through the switch and lamp to the negative terminal.'
          : 'Click the parts in order, 1 → 2 → 3, to complete the circuit.';
        return step >= 3 ? '电路接通：传统电流从电源正极出发，经开关、灯泡回到负极。' : '按 1 → 2 → 3 的顺序点击元件，把电路接通。';
      },
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        step = 0;
        hint = '';
        applyStep();
      },
      update: update,
      readout: function () {
        return [
          { k: 's', v: String(step), u: '/ 3' },
          { k: 'U', v: '1.5', u: 'V' },
          { k: 'I', v: step >= 3 ? '0.13' : '0', u: 'A' }
        ];
      },
      onPick: onPick
    };
  });

  /* ============================================================
     13  POWER & ENERGY — 电功与电功率
     ============================================================ */
  E.register('power', function () {
    const g = new THREE.Group();
    const P = { t: 2 };
    let mode = 'p40';

    const WATTS = { p5: 5, p40: 40, p100: 100 };
    const W = function () { return WATTS[mode]; };

    g.add(E.glowDisc(3.6, C.amber, 0.08));
    g.add(E.slab(8.4, 3.4, 0.18, 0x0d1520));

    const board = E.mesh(new THREE.BoxGeometry(6.4, 0.1, 1.6), E.mat(0x16202e, { metalness: 0.3, roughness: 0.7 }), 0, 0.24, -0.2);
    E.addEdges(board, 0x2b4159, 0.45);
    g.add(board);

    /* lamp on a socket */
    const socket = E.mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.34, 22), E.mat(0x2b3646, { metalness: 0.55, roughness: 0.5 }), -1.75, 0.45, 0);
    g.add(socket);
    const lamp = E.lamp(0.42);
    lamp.group.position.set(-1.75, 0.62, 0);
    g.add(lamp.group);

    /* energy meter */
    const meterBox = E.mesh(new THREE.BoxGeometry(2.3, 1.5, 0.8), E.mat(0x1b2a3a, { metalness: 0.5, roughness: 0.5 }), 1.35, 1.05, -0.1);
    E.addEdges(meterBox, 0x3fd6f2, 0.2);
    g.add(meterBox);

    const meterFace = E.mesh(new THREE.PlaneGeometry(1.9, 1.15), E.mat(0x0a1420, { metalness: 0.2, roughness: 0.8, emissive: 0x0a1a26, emissiveIntensity: 0.6 }), 1.35, 1.12, 0.31);
    g.add(meterFace);

    /* spinning disc */
    const disc = new THREE.Group();
    disc.position.set(1.35, 0.78, 0.34);
    g.add(disc);
    const discBody = E.mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.03, 32), E.mat(0xd8dde4, { metalness: 1, roughness: 0.18 }), 0, 0, 0);
    discBody.rotation.x = Math.PI / 2;
    disc.add(discBody);
    const mark = E.mesh(new THREE.BoxGeometry(0.035, 0.19, 0.012), E.mat(0xd94a5c, { emissive: 0x6a1020, emissiveIntensity: 0.8 }), 0, 0.08, 0.022);
    disc.add(mark);

    /* counter window — canvas digits */
    const counter = new THREE.Group();
    counter.position.set(1.35, 1.42, 0.34);
    g.add(counter);
    const ccv = document.createElement('canvas');
    ccv.width = 320;
    ccv.height = 100;
    const cctx = ccv.getContext('2d');
    const ctex = new THREE.CanvasTexture(ccv);
    ctex.encoding = THREE.sRGBEncoding;
    const win = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.28),
      new THREE.MeshBasicMaterial({ map: ctex })
    );
    counter.add(win);

    function drawCounter() {
      const kWh = W() * P.t / 1000;
      cctx.fillStyle = '#070c12';
      cctx.fillRect(0, 0, 320, 100);
      cctx.strokeStyle = '#1f3346';
      cctx.lineWidth = 4;
      cctx.strokeRect(2, 2, 316, 96);
      const str = kWh.toFixed(2).padStart(6, '0');
      cctx.font = 'bold 62px ui-monospace, Menlo, monospace';
      cctx.textBaseline = 'middle';
      cctx.textAlign = 'center';
      for (let i = 0; i < str.length; i++) {
        cctx.fillStyle = i >= str.length - 2 ? '#ff4d6a' : '#c9f4ff';
        cctx.fillText(str[i], 40 + i * 44, 52);
      }
      cctx.fillStyle = '#5f7d95';
      cctx.font = '600 22px ui-monospace, Menlo, monospace';
      cctx.fillText('kW·h', 160, 86);
      ctex.needsUpdate = true;
    }

    /* terminals where the leads enter the meter */
    [[0.62, 0.38], [0.95, 0.38]].forEach(function (p) {
      const t = E.mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.1, 14),
        E.mat(0xd8b273, { metalness: 0.95, roughness: 0.26 }), p[0], p[1], 0.33);
      t.rotation.x = Math.PI / 2;
      g.add(t);
    });

    /* wires — both runs land on a terminal, nothing dangles */
    g.add(E.wire([
      new V3(-1.75, 0.34, 0), new V3(-1.75, 0.36, 0.6), new V3(0.62, 0.36, 0.6), new V3(0.62, 0.38, 0.34)
    ], 0.026, C.copper));
    g.add(E.wire([
      new V3(-1.75, 0.72, 0.18), new V3(-1.75, 0.46, 0.46), new V3(0.95, 0.46, 0.46), new V3(0.95, 0.38, 0.34)
    ], 0.026, C.copper));

    let spin = 0;
    drawCounter();

    function update(t, dt) {
      const p = W();
      const b = clamp(Math.pow(p / 100, 0.55) * 1.1, 0.08, 1.2);
      lamp.set(b);
      /* disc turns faster with power: 600 rev per kWh */
      spin += dt * (p / 100) * 4.2;
      disc.rotation.z = spin;
    }

    function readout() {
      const p = W();
      const kWh = p * P.t / 1000;
      return [
        { k: 'P', v: String(p), u: 'W' },
        { k: 'W', v: kWh.toFixed(3), u: 'kW·h' },
        { k: 'cost', v: (kWh * 0.6).toFixed(2), u: '元' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.26, phi: 1.1, radius: 9.0, target: new V3(0.15, 1.15, 0) },
      chips: [
        chipDef('电功率 P', 'Power P', 'P = UI', function () { return W() + ' W'; }, '#ffb347', function () { return new V3(-1.75, 1.75, 0.3); }),
        chipDef('通电时间 t', 'Time t', 'HOURS', function () { return P.t.toFixed(1) + ' h'; }, '#3fd6f2', function () { return new V3(1.35, 1.9, 0.35); }),
        chipDef('电能 W', 'Energy W', 'W = Pt', function () { return (W() * P.t / 1000).toFixed(3) + ' kW·h'; }, '#45e08a', function () { return new V3(1.35, 0.45, 0.35); }),
        chipDef('电能表', 'Energy meter', '600 rev / kW·h', function () { return '转盘转动'; }, '#a48bff', function () { return new V3(2.75, 1.05, 0.2); }, { small: true })
      ],
      setParam: function (k, v) { P[k] = v; drawCounter(); },
      setVariant: function (key) { mode = key; spin = 0; drawCounter(); },
      update: update,
      readout: readout
    };
  });
})();
