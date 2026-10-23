/* ============================================================
   Scenes 04–07: current → magnetism, induction, generator, motor
   ============================================================ */
(function () {
  'use strict';

  const E = window.EL;
  const V3 = E.V3, C = E.C, clamp = E.clamp;
  const chipDef = E.chipDef;

  const steel = () => E.mat(0x8fa3bd, { metalness: 0.92, roughness: 0.3 });
  const darkSteel = () => E.mat(0x51637d, { metalness: 0.85, roughness: 0.38 });

  function poleBox(w, h, d, letter, color) {
    const isN = letter === 'N';
    const m = E.mesh(new THREE.BoxGeometry(w, h, d), E.mat(isN ? 0xd94a5c : 0x3f6fbf, { metalness: 0.5, roughness: 0.45, emissive: isN ? 0x5a0d18 : 0x0d2450, emissiveIntensity: 0.35 }));
    E.addEdges(m, isN ? 0xffc2ca : 0xc2d8ff, 0.18);
    const l = E.letterPlane(letter, Math.min(h, d) * 0.52, color || (isN ? '#ffe9ec' : '#e8f0ff'));
    l.position.set(0, h / 2 + 0.004, 0);
    l.rotation.x = -Math.PI / 2;
    m.add(l);
    return m;
  }
  function northPole(w, h, d) { return poleBox(w, h, d, 'N'); }
  function southPole(w, h, d) { return poleBox(w, h, d, 'S'); }

  function compass(r) {
    const g = new THREE.Group();
    const R = r || 0.4;
    const base = E.mesh(new THREE.CylinderGeometry(R, R, R * 0.2, 32), E.mat(0x1b2431, { metalness: 0.5, roughness: 0.5 }), 0, R * 0.1, 0);
    g.add(base);
    const face = E.mesh(new THREE.CircleGeometry(R * 0.88, 32), E.mat(0xe8eef7, { metalness: 0.05, roughness: 0.72 }), 0, R * 0.205, 0);
    face.rotation.x = -Math.PI / 2;
    g.add(face);
    const ng = new THREE.Group();
    ng.position.y = R * 0.24;
    const n1 = E.mesh(new THREE.BoxGeometry(R * 0.72, R * 0.045, R * 0.13), E.mat(0xd94a5c, { emissive: 0x6a1020, emissiveIntensity: 0.55 }), R * 0.36, 0, 0);
    const n2 = E.mesh(new THREE.BoxGeometry(R * 0.72, R * 0.045, R * 0.13), E.mat(0xdfe7f2, { metalness: 0.6, roughness: 0.4 }), -R * 0.36, 0, 0);
    ng.add(n1, n2);
    g.add(ng);
    return { group: g, needle: ng };
  }

  /* ============================================================
     04  OERSTED — 电生磁
     ============================================================ */
  E.register('oersted', function () {
    const g = new THREE.Group();
    const P = { I: 1.2, n: 12 };
    let mode = 'straight';

    g.add(E.glowDisc(3.6, C.cyan, 0.07));
    g.add(E.slab(8.0, 3.8, 0.18, 0x0d1520));

    /* ---------------- straight wire + compass ---------------- */
    const straight = new THREE.Group();
    g.add(straight);

    const WY = 1.62;
    [-2.9, 2.9].forEach(function (x) {
      const post = E.mesh(new THREE.CylinderGeometry(0.05, 0.07, WY - 0.1, 14), darkSteel(), x, (WY - 0.1) / 2 + 0.18, 0);
      straight.add(post);
      const cap = E.mesh(new THREE.SphereGeometry(0.075, 12, 10), steel(), x, WY, 0);
      straight.add(cap);
    });
    const wireMat = E.mat(C.copper, { metalness: 0.85, roughness: 0.28, emissive: 0x3a1e0c, emissiveIntensity: 0.3 });
    const wireMesh = E.mesh(new THREE.CylinderGeometry(0.048, 0.048, 6.4, 14), wireMat, 0, WY, 0);
    wireMesh.rotation.z = Math.PI / 2;
    straight.add(wireMesh);

    /* battery terminals */
    const batt = new THREE.Group();
    batt.position.set(3.35, 0.55, 1.0);
    straight.add(batt);
    const bBody = E.mesh(new THREE.BoxGeometry(0.9, 0.62, 0.5), E.mat(0x243244, { metalness: 0.5, roughness: 0.5 }), 0, 0, 0);
    batt.add(bBody);
    const bPlus = E.mesh(new THREE.BoxGeometry(0.09, 0.12, 0.12), E.mat(0xd8b46a, { metalness: 0.9, roughness: 0.3 }), 0.5, 0.18, 0);
    batt.add(bPlus);
    const plusG = E.sign('+', 0.075, C.magenta);
    plusG.position.set(0.5, -0.16, 0.28);
    batt.add(plusG);
    const minusG = E.sign('-', 0.075, C.blue);
    minusG.position.set(-0.5, -0.16, 0.28);
    batt.add(minusG);

    const lead = E.wire([new V3(3.35, 0.86, 1.0), new V3(3.35, WY, 1.0), new V3(3.35, WY, 0.1), new V3(2.95, WY, 0)], 0.032, C.copper);
    straight.add(lead);

    const cp = compass(0.44);
    cp.group.position.set(0, 0.2, 0);
    straight.add(cp.group);
    const cpStand = E.mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.34, 10), darkSteel(), 0, 0.36, 0);
    cpStand.position.set(0, 0.35, 0);
    straight.add(cpStand);

    /* circular field around the wire */
    const rings = new THREE.Group();
    straight.add(rings);
    const ringArrows = [];
    [-1.05, 0, 1.05].forEach(function (x, ri) {
      [0.52, 0.86].forEach(function (R, rr) {
        const t = new THREE.Mesh(
          new THREE.TorusGeometry(R, 0.008, 6, 64),
          new THREE.MeshBasicMaterial({ color: 0x8f7bff, transparent: true, opacity: 0.55 - rr * 0.16 })
        );
        t.rotation.y = Math.PI / 2;
        t.position.set(x, WY, 0);
        rings.add(t);
        for (let k = 0; k < 2; k++) {
          const a = k * Math.PI + 0.6 + ri * 0.4;
          const ar = new E.Arrow(0xa48bff, { radius: 0.012, headRadius: 0.05, headLen: 0.12 });
          ar.set(new V3(x, WY + Math.cos(a) * R, Math.sin(a) * R), new V3(0, -Math.sin(a), Math.cos(a)), 0.16);
          rings.add(ar.group);
          ringArrows.push(ar);
        }
      });
    });

    const straightFlow = new E.Flow(16, 0xffd27a, 0.062, new THREE.CatmullRomCurve3([
      new V3(-2.95, WY, 0), new V3(0, WY, 0), new V3(2.95, WY, 0)
    ]));
    straight.add(straightFlow.group);

    /* ---------------- solenoid ---------------- */
    const sol = new THREE.Group();
    sol.visible = false;
    g.add(sol);

    const SL = 2.9, SR = 0.42;
    const helixPts = [];
    const TURNS = 11;
    for (let i = 0; i <= TURNS * 26; i++) {
      const u = i / (TURNS * 26);
      const a = u * TURNS * Math.PI * 2;
      helixPts.push(new V3((u - 0.5) * SL, 1.85 + Math.cos(a) * SR, Math.sin(a) * SR));
    }
    const solHelix = E.curveTube(helixPts, 0.038, C.copper, false, TURNS * 26, { metalness: 0.85, roughness: 0.26, emissive: 0x3a1e0c, emissiveIntensity: 0.25 });
    sol.add(solHelix);
    const solFlow = new E.Flow(22, 0xffd27a, 0.052, solHelix.curve);
    sol.add(solFlow.group);

    /* transparent core cylinder so the coil reads as a tube */
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(SR * 0.86, SR * 0.86, SL, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x7fb6d8, transparent: true, opacity: 0.1, roughness: 0.3, metalness: 0.2, side: THREE.DoubleSide })
    );
    core.rotation.z = Math.PI / 2;
    core.position.y = 1.85;
    sol.add(core);

    /* field lines through the solenoid */
    const solField = new THREE.Group();
    sol.add(solField);
    const fMat = { metalness: 0, roughness: 1, emissive: 0xa48bff, emissiveIntensity: 0.85, opacity: 0.4 };
    [0, Math.PI / 2].forEach(function (az) {
      [[0.1, 0.95], [0.26, 1.55], [0.34, 2.2]].forEach(function (cfg) {
        const ri = cfg[0], R = cfg[1];
        const pts = [];
        const raw = [
          [-SL / 2, ri], [-SL / 4, ri], [0, ri], [SL / 4, ri], [SL / 2, ri],
          [SL / 2 + 0.42, ri + 0.24], [SL / 2 + 0.72, R * 0.72], [SL / 2 + 0.55, R],
          [0, R], [-SL / 2 - 0.55, R], [-SL / 2 - 0.72, R * 0.72], [-SL / 2 - 0.42, ri + 0.24]
        ];
        raw.forEach(function (p) {
          pts.push(new V3(p[0], 1.85 + p[1] * Math.cos(az), p[1] * Math.sin(az)));
        });
        const t = E.curveTube(pts, 0.01, 0xa48bff, true, 140, fMat);
        solField.add(t);
      });
    });

    /* ---------------- electromagnet ---------------- */
    const em = new THREE.Group();
    em.visible = false;
    g.add(em);

    const EMY = 2.35;
    const coreMesh = E.mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.0, 20), E.mat(0x6b7788, { metalness: 0.95, roughness: 0.4 }), 0, EMY, 0);
    em.add(coreMesh);
    const coilPts = [];
    const T2 = 9;
    for (let i = 0; i <= T2 * 26; i++) {
      const u = i / (T2 * 26);
      const a = u * T2 * Math.PI * 2;
      coilPts.push(new V3(Math.cos(a) * 0.3, EMY - 0.7 + u * 1.4, Math.sin(a) * 0.3));
    }
    const emHelix = E.curveTube(coilPts, 0.042, C.copper, false, T2 * 26, { metalness: 0.85, roughness: 0.26, emissive: 0x3a1e0c, emissiveIntensity: 0.25 });
    em.add(emHelix);
    const emFlow = new E.Flow(18, 0xffd27a, 0.05, emHelix.curve);
    em.add(emFlow.group);

    /* suspension arm */
    const armMesh = E.mesh(new THREE.BoxGeometry(2.6, 0.12, 0.16), darkSteel(), -1.3, 3.55, 0);
    em.add(armMesh);
    const armPost = E.mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.4, 14), darkSteel(), -2.55, 1.85, 0);
    em.add(armPost);

    /* clips */
    const clips = [];
    for (let i = 0; i < 9; i++) {
      const clip = new THREE.Mesh(
        new THREE.TorusGeometry(0.1, 0.017, 6, 18, Math.PI * 1.55),
        E.mat(0xc9d4e2, { metalness: 1, roughness: 0.25 })
      );
      clip.rotation.x = Math.PI / 2;
      clip.position.set((i % 3 - 1) * 0.24 + (Math.random() - 0.5) * 0.1, 0.2, Math.floor(i / 3) * 0.18 - 0.1);
      em.add(clip);
      clips.push({ mesh: clip, base: clip.position.clone(), seed: Math.random() * 6.28 });
    }

    /* ---------------- update ---------------- */
    let ang = 0;

    function update(t, dt) {
      const I = P.I;
      ang += dt * I * 1.6;

      if (mode === 'straight') {
        straightFlow.update(t, 0.12 + I * 0.16);
        cp.needle.rotation.y = -(0.12 + I * 0.34) + Math.sin(t * 1.4) * 0.015;
        rings.children.forEach(function (c) {
          if (c.isMesh && c.geometry.type === 'TorusGeometry') {
            c.material.opacity = 0.2 + I * 0.16;
          }
        });
        return;
      }

      if (mode === 'solenoid') {
        solFlow.update(t, 0.06 + I * 0.1);
        const k = 0.55 + I * 0.22;
        solField.scale.set(1, k, k);
        solField.children.forEach(function (c) { c.material.opacity = 0.18 + I * 0.14; });
        return;
      }

      emFlow.update(t, 0.06 + I * 0.1);
      const lift = clamp((I - 0.25) / 2.6, 0, 1);
      clips.forEach(function (c, i) {
        const active = i / clips.length < lift;
        const stickY = 1.2 - (i % 3) * 0.05;
        const stickX = Math.cos(i * 2.1) * 0.14;
        const stickZ = Math.sin(i * 2.1) * 0.14;
        if (active) {
          c.mesh.position.x += (stickX - c.mesh.position.x) * 0.08;
          c.mesh.position.z += (stickZ - c.mesh.position.z) * 0.08;
          c.mesh.position.y += (stickY - c.mesh.position.y) * 0.09;
          c.mesh.rotation.x = Math.PI / 2 + Math.sin(t * 2 + c.seed) * 0.2;
          c.mesh.rotation.z = Math.sin(t * 1.6 + c.seed) * 0.6;
        } else {
          c.mesh.position.lerp(c.base, 0.08);
          c.mesh.rotation.x += (Math.PI / 2 - c.mesh.rotation.x) * 0.1;
          c.mesh.rotation.z += (0 - c.mesh.rotation.z) * 0.1;
        }
      });
    }

    function readout() {
      return [
        { k: 'I', v: P.I.toFixed(2), u: 'A' },
        { k: 'n', v: String(mode === 'solenoid' ? P.n : 9), u: '匝' },
        { k: 'B', v: (P.I * 0.42 * (mode === 'solenoid' ? 1.8 : 1)).toFixed(2), u: 'mT' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.44, phi: 1.06, radius: 9.4, target: new V3(0, 1.75, 0) },
      chips: [
        chipDef('电流 I', 'Current I', 'I = Q / t', function () { return P.I.toFixed(2) + ' A'; }, '#ffb347', function () { return new V3(-1.9, 2.6, 0.3); }),
        chipDef('磁场方向', 'Field direction', 'RIGHT-HAND RULE', function () { return '右手螺旋'; }, '#a48bff', function () { return new V3(0, 3.05, 0); }, { small: true, visible: function () { return mode === 'straight'; } }),
        chipDef('N 极', 'North pole', 'N', function () { return '右端'; }, '#ff4d6a', function () { return new V3(1.85, 2.05, 0); }, { small: true, visible: function () { return mode === 'solenoid'; } }),
        chipDef('S 极', 'South pole', 'S', function () { return '左端'; }, '#4d8dff', function () { return new V3(-1.85, 2.05, 0); }, { small: true, visible: function () { return mode === 'solenoid'; } }),
        chipDef('吸起回形针', 'Clips lifted', 'MAGNETIC FORCE', function () { return Math.round(clamp((P.I - 0.25) / 2.6, 0, 1) * 9) + ' / 9'; }, '#45e08a', function () { return new V3(0, 0.75, 0.6); }, { visible: function () { return mode === 'electromagnet'; } })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        straight.visible = key === 'straight';
        sol.visible = key === 'solenoid';
        em.visible = key === 'electromagnet';
      },
      update: update,
      readout: readout
    };
  });

  /* ============================================================
     05  INDUCTION — 磁生电
     ============================================================ */
  E.register('induction', function () {
    const g = new THREE.Group();
    const P = { v: 1.0 };
    let mode = 'insert';

    g.add(E.glowDisc(3.4, C.cyan, 0.07));
    g.add(E.slab(8.2, 3.6, 0.18, 0x0d1520));

    const CY = 1.72, CR = 0.56, CL = 1.9;
    const coilPts = [];
    const TURNS = 8;
    for (let i = 0; i <= TURNS * 26; i++) {
      const u = i / (TURNS * 26);
      const a = u * TURNS * Math.PI * 2;
      coilPts.push(new V3((u - 0.5) * CL, CY + Math.cos(a) * CR, Math.sin(a) * CR));
    }
    const helix = E.curveTube(coilPts, 0.042, C.copper, false, TURNS * 26, { metalness: 0.85, roughness: 0.26, emissive: 0x3a1e0c, emissiveIntensity: 0.25 });
    g.add(helix);
    const coilFlow = new E.Flow(20, 0xffd27a, 0.055, helix.curve);
    g.add(coilFlow.group);

    const coilCore = new THREE.Mesh(
      new THREE.CylinderGeometry(CR * 0.88, CR * 0.88, CL, 26, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x86c0e0, transparent: true, opacity: 0.09, roughness: 0.25, metalness: 0.2, side: THREE.DoubleSide })
    );
    coilCore.rotation.z = Math.PI / 2;
    coilCore.position.y = CY;
    g.add(coilCore);

    /* coil supports */
    [-0.62, 0.62].forEach(function (x) {
      const s = E.mesh(new THREE.BoxGeometry(0.1, CY - 0.1, 0.12), darkSteel(), x, (CY - 0.1) / 2 + 0.18, -CR - 0.1);
      g.add(s);
    });

    /* bar magnet */
    const mag = new THREE.Group();
    const magN = northPole(0.62, 0.42, 0.42);
    magN.position.x = 0.31;
    const magS = southPole(0.62, 0.42, 0.42);
    magS.position.x = -0.31;
    mag.add(magN, magS);
    g.add(mag);

    const magArrow = new E.Arrow(C.cyan, { radius: 0.026, headRadius: 0.085, headLen: 0.2 });
    g.add(magArrow.group);

    /* galvanometer */
    const gal = E.dial(0.52, 'G', 'μA', { ticks: 10 });
    gal.group.position.set(2.85, 1.15, 0.15);
    g.add(gal.group);
    const galStand = E.mesh(new THREE.BoxGeometry(0.9, 0.7, 0.4), E.mat(0x1b2431, { metalness: 0.4, roughness: 0.6 }), 2.85, 0.5, 0);
    g.add(galStand);

    const leadA = E.wire([new V3(0.95, CY + CR + 0.04, 0), new V3(1.5, CY + CR + 0.04, 0), new V3(1.5, 1.15, 0.15), new V3(2.33, 1.15, 0.15)], 0.028, C.copper);
    const leadB = E.wire([new V3(-0.95, CY + CR + 0.04, 0), new V3(-1.4, CY + CR + 0.04, 0), new V3(-1.4, 0.62, 0.15), new V3(2.33, 0.62, 0.15), new V3(2.33, 1.0, 0.15)], 0.028, C.copper);
    g.add(leadA, leadB);

    let phase = 0, lastX = -3.2, needle = 0;

    function update(t, dt) {
      const v = P.v;
      let moving = 1, sign = 1;

      if (mode === 'still') {
        phase = 0;
        mag.position.set(0, CY, 0);
        moving = 0;
        sign = 0;
      } else {
        phase += dt * (0.18 + v * 0.16);
        const u = phase % 1;
        if (mode === 'insert') {
          mag.position.set(-3.1 + u * 3.1, CY, 0);
          sign = 1;
        } else {
          mag.position.set(u * 3.1, CY, 0);
          sign = -1;
        }
      }

      lastX = mag.position.x;
      const emf = moving ? sign * v : 0;
      needle += (clamp(emf * 0.42, -0.9, 0.9) - needle) * 0.12;
      gal.set(0.5 + needle);

      const spd = moving ? (0.05 + v * 0.1) * (sign > 0 ? 1 : -1) : 0;
      if (moving) {
        coilFlow.update(t * Math.sign(spd || 1), Math.abs(spd));
        coilFlow.setColor(sign > 0 ? 0xffd27a : 0x9fd0ff);
      }
      coilFlow.group.visible = !!moving;

      if (moving) {
        magArrow.set(new V3(mag.position.x + (sign > 0 ? 0.75 : -0.75), CY + 0.45, 0), new V3(sign, 0, 0), 0.4 + v * 0.12);
      }
      magArrow.group.visible = !!moving;
    }

    function readout() {
      const on = mode !== 'still';
      const i = on ? P.v * 1.6 : 0;
      return [
        { k: 'v', v: on ? P.v.toFixed(1) : '0.0', u: 'm/s' },
        { k: 'I', v: i.toFixed(2), u: 'mA' },
        { k: 'dir', v: mode === 'still' ? '无' : (mode === 'insert' ? 'a→b' : 'b→a'), u: '' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.4, phi: 1.08, radius: 9.2, target: new V3(0.35, 1.5, 0) },
      chips: [
        chipDef('感应电流', 'Induced current', 'ELECTROMAGNETIC INDUCTION', function () { return (mode === 'still' ? 0 : P.v * 1.6).toFixed(2) + ' mA'; }, '#ffb347', function () { return new V3(1.6, 2.5, 0.15); }),
        chipDef('运动方向', 'Motion', 'v', function () { return mode === 'insert' ? '→ 插入' : mode === 'pull' ? '→ 拔出' : '静止'; }, '#3fd6f2', function () { return new V3(0, 2.9, 0); }, { small: true }),
        chipDef('磁通量变化', 'Flux change', 'ΔΦ ≠ 0 → EMF', function () { return mode === 'still' ? 'ΔΦ = 0' : 'ΔΦ ≠ 0'; }, '#a48bff', function () { return new V3(-2.0, 1.0, 0.4); }, { small: true })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        phase = 0;
        needle = 0;
      },
      update: update,
      readout: readout
    };
  });

  /* ============================================================
     06  GENERATOR — 发电机
     ============================================================ */
  E.register('generator', function () {
    const g = new THREE.Group();
    const P = { rpm: 300 };
    let mode = 'ac';

    g.add(E.glowDisc(3.8, C.cyan, 0.07));
    g.add(E.slab(8.4, 4.0, 0.18, 0x0d1520));

    /* pole pieces */
    const poleL = northPole(0.34, 1.55, 1.55);
    poleL.position.set(-1.42, 2.08, 0);
    const poleR = southPole(0.34, 1.55, 1.55);
    poleR.position.set(1.42, 2.08, 0);
    g.add(poleL, poleR);

    const yokeL = E.mesh(new THREE.BoxGeometry(0.62, 0.32, 1.55), E.mat(0x5c6a7d, { metalness: 0.85, roughness: 0.4 }), -1.86, 2.08, 0);
    const yokeR = yokeL.clone();
    yokeR.position.x = 1.86;
    g.add(yokeL, yokeR);

    /* rotor */
    const rotor = new THREE.Group();
    rotor.position.set(0, 2.08, 0);
    g.add(rotor);

    const shaft = E.mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5, 14), steel(), 0, -0.6, 0);
    rotor.add(shaft);

    const coilG = new THREE.Group();
    rotor.add(coilG);
    const CW = 0.74, CH = 0.6;
    for (let i = 0; i < 5; i++) {
      const z = (i - 2) * 0.085;
      const w = 0.026;
      coilG.add(E.wire([
        new V3(-CW, CH, z), new V3(CW, CH, z), new V3(CW, -CH, z), new V3(-CW, -CH, z), new V3(-CW, CH, z)
      ], w, 0xc07a45, { metalness: 0.85, roughness: 0.28, emissive: 0x3a1e0c, emissiveIntensity: 0.3 }));
    }

    /* slip rings / commutator */
    const ringsG = new THREE.Group();
    ringsG.position.y = -1.35;
    rotor.add(ringsG);
    const ringMat = E.mat(0xd8b46a, { metalness: 1, roughness: 0.22 });
    const ring1 = E.mesh(new THREE.TorusGeometry(0.2, 0.032, 8, 32), ringMat, 0, 0.16, 0);
    ring1.rotation.x = Math.PI / 2;
    const ring2 = E.mesh(new THREE.TorusGeometry(0.2, 0.032, 8, 32), ringMat, 0, -0.02, 0);
    ring2.rotation.x = Math.PI / 2;
    ringsG.add(ring1, ring2);

    const comm = new THREE.Group();
    ringsG.add(comm);
    [-1, 1].forEach(function (s) {
      const half = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.3, 20, 1, false, s > 0 ? 0 : Math.PI, Math.PI),
        ringMat
      );
      comm.add(half);
    });
    comm.visible = false;

    /* brushes */
    const brushes = new THREE.Group();
    brushes.position.set(0, 2.1 - 1.35, 0);
    [-1, 1].forEach(function (s) {
      const b = E.mesh(new THREE.BoxGeometry(0.1, 0.22, 0.08), E.mat(0x2b3646, { metalness: 0.3, roughness: 0.9 }), s * 0.26, 0.07, 0.24);
      brushes.add(b);
    });
    g.add(brushes);

    /* external circuit + lamp */
    const lampSocket = E.mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.18, 18), E.mat(0x2b3646, { metalness: 0.5, roughness: 0.55 }), 0, 0.28, 2.0);
    g.add(lampSocket);
    const lamp = E.lamp(0.24);
    lamp.group.position.set(0, 0.36, 2.0);
    g.add(lamp.group);

    const cw = E.wire([
      new V3(0.26, 0.82, 0.24), new V3(0.26, 0.5, 1.0), new V3(0.16, 0.36, 2.0)
    ], 0.026, C.copper);
    const cw2 = E.wire([
      new V3(-0.26, 0.82, 0.24), new V3(-0.26, 0.5, 1.0), new V3(-0.16, 0.36, 2.0)
    ], 0.026, C.copper);
    g.add(cw, cw2);

    /* waveform screen */
    const screen = new THREE.Group();
    screen.position.set(0, 3.95, -1.85);
    screen.rotation.x = -0.34;
    g.add(screen);
    const plate = E.mesh(new THREE.BoxGeometry(3.5, 1.6, 0.06), E.mat(0x0a121c, { metalness: 0.4, roughness: 0.6, emissive: 0x0a1a26, emissiveIntensity: 0.5 }), 0, 0, 0);
    E.addEdges(plate, 0x3fd6f2, 0.22);
    screen.add(plate);
    const axisH = E.lineSeg(new V3(-1.55, 0, 0.05), new V3(1.55, 0, 0.05), 0x33465c, 0.9);
    screen.add(axisH);
    const NPTS = 140;
    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NPTS * 3), 3));
    const wave = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({ color: 0x3fd6f2 }));
    screen.add(wave);

    let ang = 0, wphase = 0;

    function update(t, dt) {
      const omega = P.rpm / 60 * Math.PI * 2;
      ang += dt * omega;
      rotor.rotation.y = ang;

      const emf = Math.sin(ang);
      lamp.set(Math.abs(emf) * 0.85);

      wphase += dt * 2.2;
      const pos = waveGeo.attributes.position;
      const amp = 0.5;
      for (let i = 0; i < NPTS; i++) {
        const u = i / (NPTS - 1);
        const x = -1.5 + u * 3.0;
        let y;
        if (mode === 'dc') {
          y = Math.abs(Math.sin(u * Math.PI * 4 - wphase)) * amp;
        } else {
          y = Math.sin(u * Math.PI * 4 - wphase) * amp;
        }
        pos.setXYZ(i, x, y, 0.05);
      }
      pos.needsUpdate = true;
      waveGeo.computeBoundingSphere();
    }

    function readout() {
      const f = P.rpm / 60;
      return [
        { k: 'n', v: String(Math.round(P.rpm)), u: 'r/min' },
        { k: 'f', v: f.toFixed(1), u: 'Hz' },
        { k: 'e', v: (P.rpm / 300 * 6.2).toFixed(1), u: 'V' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.34, phi: 1.06, radius: 10.6, target: new V3(0, 1.75, -0.3) },
      chips: [
        chipDef('转速 n', 'Speed n', 'ROTATION', function () { return Math.round(P.rpm) + ' r/min'; }, '#3fd6f2', function () { return new V3(-2.1, 3.25, 0); }),
        chipDef('感应电动势', 'EMF', 'e = NBAω·sin(ωt)', function () { return (P.rpm / 300 * 6.2).toFixed(1) + ' V'; }, '#ffb347', function () { return new V3(2.15, 3.25, 0); }),
        chipDef(mode === 'dc' ? '换向器' : '滑环', mode === 'dc' ? 'Commutator' : 'Slip rings', 'AC / DC', function () { return mode === 'dc' ? '直流输出' : '交流输出'; }, '#a48bff', function () { return new V3(0.55, 0.62, 0.55); }, { small: true }),
        chipDef('波形', 'Waveform', mode === 'dc' ? 'PULSATING DC' : 'AC', function () { return mode === 'dc' ? '脉动直流' : '正弦交流'; }, '#45e08a', function () { return new V3(0, 4.55, -1.95); }, { small: true })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        ringsG.visible = true;
        ring1.visible = ring2.visible = key === 'ac';
        comm.visible = key === 'dc';
      },
      update: update,
      readout: readout
    };
  });

  /* ============================================================
     07  MOTOR — 电动机
     ============================================================ */
  E.register('motor', function () {
    const g = new THREE.Group();
    const P = { I: 1.5 };
    let mode = 'commutator';

    g.add(E.glowDisc(3.6, C.cyan, 0.07));
    g.add(E.slab(8.0, 3.8, 0.18, 0x0d1520));

    const poleL = northPole(0.28, 1.28, 1.28);
    poleL.position.set(-1.16, 2.0, 0);
    const poleR = southPole(0.28, 1.28, 1.28);
    poleR.position.set(1.16, 2.0, 0);
    g.add(poleL, poleR);

    /* field arrows N → S */
    const fieldArrow = new E.Arrow(0xa48bff, { radius: 0.018, headRadius: 0.06, headLen: 0.16 });
    fieldArrow.set(new V3(-1.0, 2.62, 0), new V3(1, 0, 0), 2.0);
    g.add(fieldArrow.group);

    /* rotor */
    const rotor = new THREE.Group();
    rotor.position.set(0, 2.0, 0);
    g.add(rotor);

    const shaft = E.mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.9, 12), steel(), 0, -0.45, 0);
    rotor.add(shaft);

    const CW = 0.62, CH = 0.56;
    const coilG = new THREE.Group();
    rotor.add(coilG);
    const TURNS = 6;
    for (let i = 0; i < TURNS; i++) {
      const z = (i - (TURNS - 1) / 2) * 0.048;
      coilG.add(E.wire([
        new V3(-CW, CH, z), new V3(CW, CH, z), new V3(CW, -CH, z), new V3(-CW, -CH, z), new V3(-CW, CH, z)
      ], 0.026, 0xc07a45, { metalness: 0.85, roughness: 0.28, emissive: 0x3a1e0c, emissiveIntensity: 0.3 }));
    }

    /* commutator */
    const commG = new THREE.Group();
    commG.position.y = -1.05;
    rotor.add(commG);
    const ringMat = E.mat(0xd8b46a, { metalness: 1, roughness: 0.22 });
    const split = new THREE.Group();
    [-1, 1].forEach(function (s) {
      const half = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.26, 20, 1, false, s > 0 ? 0 : Math.PI, Math.PI),
        ringMat
      );
      split.add(half);
    });
    commG.add(split);
    const ringA = E.mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 32), ringMat, 0, 0.28, 0);
    ringA.rotation.x = Math.PI / 2;
    commG.add(ringA);

    /* brushes */
    [-1, 1].forEach(function (s) {
      const b = E.mesh(new THREE.BoxGeometry(0.09, 0.2, 0.07), E.mat(0x2b3646, { metalness: 0.3, roughness: 0.9 }), s * 0.24, 2.0 - 1.05, 0.2);
      g.add(b);
    });

    /* force arrows (world space, tracked each frame) */
    const fA = new E.Arrow(0xffb347, { radius: 0.028, headRadius: 0.095, headLen: 0.2 });
    const fB = new E.Arrow(0xffb347, { radius: 0.028, headRadius: 0.095, headLen: 0.2 });
    g.add(fA.group, fB.group);

    /* current direction indicators on the coil */
    const curA = new E.Arrow(0x3fd6f2, { radius: 0.014, headRadius: 0.05, headLen: 0.12 });
    const curB = new E.Arrow(0x3fd6f2, { radius: 0.014, headRadius: 0.05, headLen: 0.12 });
    coilG.add(curA.group, curB.group);

    /* battery at the front-left, leads up to the brushes */
    const batt = E.mesh(new THREE.BoxGeometry(1.0, 0.46, 0.42), E.mat(0x243244, { metalness: 0.5, roughness: 0.5 }), -1.95, 0.4, 1.1);
    E.addEdges(batt, 0x3fd6f2, 0.16);
    g.add(batt);
    const plusG = E.sign('+', 0.055, C.magenta);
    plusG.position.set(-1.62, 0.42, 1.33);
    g.add(plusG);
    const minusG = E.sign('-', 0.055, C.cyan);
    minusG.position.set(-2.28, 0.42, 1.33);
    g.add(minusG);

    g.add(E.wire([
      new V3(-1.62, 0.62, 1.1), new V3(-1.62, 0.62, 0.62), new V3(0.24, 0.62, 0.62), new V3(0.24, 0.94, 0.26)
    ], 0.021, C.copper));
    g.add(E.wire([
      new V3(-2.28, 0.62, 1.1), new V3(-2.28, 0.5, 0.34), new V3(-0.24, 0.5, 0.34), new V3(-0.24, 0.94, 0.26)
    ], 0.021, C.copper));

    let ang = 0, dir = 1, needle = 0;

    function update(t, dt) {
      const I = P.I;
      let currentDir;

      if (mode === 'basic') {
        ang = 0.95 * Math.sin(t * (0.8 + I * 0.5));
        currentDir = Math.sign(Math.cos(ang)) || 1;
      } else {
        dir = mode === 'reverse' ? -1 : 1;
        ang += dt * (0.8 + I * 1.1) * dir;
        currentDir = 1;
      }

      rotor.rotation.y = ang;

      const ca = Math.cos(ang), sa = Math.sin(ang);
      /* coil sides: local (+CW,0,0) and (-CW,0,0) rotated about y */
      const pA = new V3(CW * ca, 2.0, -CW * sa);
      const pB = new V3(-CW * ca, 2.0, CW * sa);

      const sgn = currentDir * (mode === 'reverse' ? -1 : 1);
      const L = 0.85 + I * 0.26;
      fA.set(new V3(pA.x, 2.0 + CH * 0.55, pA.z), new V3(0, 0, 1 * sgn), L);
      fB.set(new V3(pB.x, 2.0 + CH * 0.55, pB.z), new V3(0, 0, -1 * sgn), L);

      /* current arrows along the vertical sides */
      curA.set(new V3(CW, -CH * 0.5, 0.02), new V3(0, 1 * sgn, 0), 0.34);
      curB.set(new V3(-CW, CH * 0.5, 0.02), new V3(0, -1 * sgn, 0), 0.34);
    }

    function readout() {
      const speed = mode === 'basic' ? 0 : Math.round((0.8 + P.I * 1.1) * 60 / (Math.PI * 2) * dir * 10) / 10;
      return [
        { k: 'I', v: P.I.toFixed(1), u: 'A' },
        { k: 'F', v: (P.I * 1.2).toFixed(1), u: 'N' },
        { k: 'n', v: mode === 'basic' ? '摆动' : String(Math.abs(speed)), u: mode === 'basic' ? '' : 'r/s' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.78, phi: 1.12, radius: 7.3, target: new V3(-0.25, 1.72, 0.15) },
      chips: [
        chipDef('电流 I', 'Current I', 'F = BIL', function () { return P.I.toFixed(1) + ' A'; }, '#ffb347', function () { return new V3(-0.5, 3.2, 0.35); }),
        chipDef('磁场 B', 'Field B', 'N → S', function () { return '水平向右'; }, '#a48bff', function () { return new V3(1.5, 3.2, -0.2); }, { small: true }),
        chipDef('安培力 F', 'Force F', 'F = BIL', function () { return (P.I * 1.2).toFixed(1) + ' N'; }, '#3fd6f2', function () { return new V3(0.95, 0.9, 1.45); }, { small: true }),
        chipDef('换向器', 'Commutator', 'REVERSES CURRENT', function () { return mode === 'basic' ? '未使用' : '每半周换向'; }, '#45e08a', function () { return new V3(-1.55, 0.62, 0.55); }, { small: true })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        ang = 0;
        dir = 1;
      },
      update: update,
      readout: readout
    };
  });
})();
