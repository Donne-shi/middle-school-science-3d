/* ============================================================
   Scenes 01–03: static electricity, electrons, magnetism
   ============================================================ */
(function () {
  'use strict';

  const E = window.EL;
  const V3 = E.V3, C = E.C, D2R = E.D2R, clamp = E.clamp, ease = E.ease;
  const chipDef = E.chipDef;

  /* ============================================================
     01  STATIC — 静电现象
     ============================================================ */
  E.register('static', function () {
    const g = new THREE.Group();
    const P = { q: 6 };
    let mode = 'repel';

    g.add(E.glowDisc(3.4, C.cyan, 0.07));
    g.add(E.slab(6.8, 3.0, 0.18, 0x0a1018));

    const steel = E.mat(0x8fa3bd, { metalness: 0.92, roughness: 0.3 });
    const darkSteel = E.mat(0x51637d, { metalness: 0.85, roughness: 0.38 });

    /* stand */
    const stand = new THREE.Group();
    const foot = E.mesh(new THREE.CylinderGeometry(0.62, 0.72, 0.1, 28), darkSteel, 0, 0.23, 0);
    stand.add(foot);
    const post = E.mesh(new THREE.CylinderGeometry(0.055, 0.075, 3.0, 16), steel, 0, 1.7, 0);
    stand.add(post);
    const arm = E.mesh(new THREE.BoxGeometry(3.1, 0.07, 0.11), steel, 0, 3.2, 0);
    stand.add(arm);
    g.add(stand);

    /* hanging balls */
    /* the charge sign is a camera-facing badge — a flat bar poked through the
       sphere just reads as a stray stick once the camera swings around */
    const glyphTex = {};
    function glyphTexture(ch) {
      if (glyphTex[ch]) return glyphTex[ch];
      const S = 128;
      const cv = document.createElement('canvas');
      cv.width = cv.height = S;
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, S, S);
      /* drawn with rects, not fillText — a missing glyph shows up as a tofu box */
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(26, 54, 76, 20);
      if (ch === '+') ctx.fillRect(54, 26, 20, 76);
      const tex = new THREE.CanvasTexture(cv);
      tex.encoding = THREE.sRGBEncoding;
      glyphTex[ch] = tex;
      return tex;
    }

    function makeBall(charge, color) {
      const grp = new THREE.Group();
      const ballMat = E.mat(0xd8e6f5, { metalness: 0.15, roughness: 0.35, emissive: color, emissiveIntensity: 0.22 });
      const b = E.mesh(new THREE.SphereGeometry(0.25, 26, 20), ballMat, 0, 0, 0, false);
      grp.add(b);
      const halo = E.glowSprite(0.5, color, 0.2);
      grp.add(halo);
      /* one camera-facing badge at the ball's centre, drawn over the sphere so it
         always reads as a mark on the ball instead of a stick poking out of it */
      const sm = new THREE.SpriteMaterial({
        map: glyphTexture(charge), color: color,
        transparent: true, depthWrite: false, depthTest: false
      });
      const sp = new THREE.Sprite(sm);
      sp.scale.set(0.36, 0.36, 1);
      sp.renderOrder = 12;
      const glyphMats = [sm];
      grp.add(sp);
      const thread = new E.Rope(1, 0.009, 0xc9c2b2);
      return { group: grp, thread: thread, halo: halo, ballMat: ballMat, glyphMats: glyphMats };
    }

    const leftBall = makeBall('-', C.blue);
    const rightBall = makeBall('-', C.blue);
    g.add(leftBall.thread.group, rightBall.thread.group);
    g.add(leftBall.group, rightBall.group);

    const fL = new E.Arrow(C.cyan, { radius: 0.028, headRadius: 0.09, headLen: 0.2 });
    const fR = new E.Arrow(C.cyan, { radius: 0.028, headRadius: 0.09, headLen: 0.2 });
    g.add(fL.group, fR.group);

    /* spark between balls */
    const sparkMat = new THREE.LineBasicMaterial({ color: 0xbfefff, transparent: true, opacity: 0.9 });
    const sparkGeo = new THREE.BufferGeometry().setFromPoints([new V3(), new V3(), new V3(), new V3(), new V3()]);
    const spark = new THREE.Line(sparkGeo, sparkMat);
    g.add(spark);

    const PIVOT_L = new V3(-0.66, 3.16, 0);
    const PIVOT_R = new V3(0.66, 3.16, 0);
    const THREAD = 1.28;

    /* ---- rub mode: glass rod + silk ---- */
    const rubGroup = new THREE.Group();
    rubGroup.visible = false;
    g.add(rubGroup);

    const rodMat = new THREE.MeshPhysicalMaterial({
      color: 0xcfeef8, metalness: 0.0, roughness: 0.08,
      transparent: true, opacity: 0.55, emissive: 0x2f6f9a, emissiveIntensity: 0.2
    });
    const rodPivot = new THREE.Group();
    rodPivot.position.set(0, 1.62, 0);
    rodPivot.rotation.z = 0.16;
    rubGroup.add(rodPivot);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 2.5, 20), rodMat);
    rod.rotation.z = Math.PI / 2;
    rodPivot.add(rod);
    const rodTip = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), rodMat);
    rodTip.position.x = 1.25;
    rodPivot.add(rodTip);
    const rodTip2 = rodTip.clone();
    rodTip2.position.x = -1.25;
    rodPivot.add(rodTip2);

    /* rod supports */
    [-0.95, 0.95].forEach(function (x) {
      const s = E.mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.42, 12), darkSteel, x, 0.89, 0);
      rubGroup.add(s);
    });

    /* silk cloth */
    const clothMat = E.mat(0xe8dfc8, { metalness: 0.02, roughness: 0.95 });
    const cloth = new THREE.Group();
    const clothBody = E.mesh(new THREE.BoxGeometry(0.46, 0.3, 0.34), clothMat, 0, 0, 0);
    cloth.add(clothBody);
    for (let i = 0; i < 3; i++) {
      const fold = E.mesh(new THREE.BoxGeometry(0.44, 0.26, 0.03), E.mat(0xd9cfb4, { roughness: 1 }), 0, -0.02 + i * 0.02, 0.16 + i * 0.005);
      fold.rotation.x = 0.1 * (i - 1);
      cloth.add(fold);
    }
    cloth.position.set(0, 1.68, 0);
    rubGroup.add(cloth);

    /* electrons hopping cloth -> rod */
    const rubFlow = new E.Flow(9, 0x6fb0ff, 0.045);
    rubFlow.setCurve(new THREE.CatmullRomCurve3([
      new V3(0, 1.66, 0.18), new V3(0.1, 1.72, 0.1), new V3(0.05, 1.66, -0.02), new V3(-0.08, 1.62, -0.06)
    ]));
    rubGroup.add(rubFlow.group);

    /* paper scraps */
    const scraps = [];
    for (let i = 0; i < 3; i++) {
      const p = E.mesh(new THREE.BoxGeometry(0.16, 0.012, 0.11), E.mat(0xf2ead6, { roughness: 0.9 }), -1.5 + i * 0.5, 0.2, 0.75);
      rubGroup.add(p);
      scraps.push(p);
    }

    const rodGlyphs = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const s = E.sign('-', 0.07, C.blue);
      s.position.set(-0.95 + i * 0.47, 0.13, 0.12);
      rodGlyphs.add(s);
    }
    rodGlyphs.visible = false;
    rodPivot.add(rodGlyphs);

    /* ---------------- update ---------------- */
    let rubPhase = 0;

    function update(t) {
      const q = P.q;

      if (mode === 'rub') {
        rubPhase = t;
        const slide = Math.sin(t * 2.1) * 0.42;
        cloth.position.x = slide;
        rodMat.emissiveIntensity = 0.2 + 0.12 * Math.abs(Math.sin(t * 2.1));
        rubFlow.update(t, 0.55);
        rubFlow.group.visible = true;
        const glow = clamp((Math.abs(Math.sin(t * 1.05)) - 0.25) * 1.6, 0, 1);
        rodGlyphs.visible = glow > 0.35;
        rodGlyphs.children.forEach(function (c, i) {
          c.scale.setScalar(0.6 + 0.5 * glow);
          c.position.y = 0.13 + Math.sin(t * 3 + i) * 0.01;
        });
        scraps.forEach(function (p, i) {
          const lift = glow * (0.55 + i * 0.12) * (0.85 + 0.15 * Math.sin(t * 4 + i));
          p.position.y = 0.2 + lift;
          p.rotation.z = Math.sin(t * 5 + i) * 0.5 * glow;
          p.rotation.x = Math.cos(t * 4.2 + i) * 0.3 * glow;
        });
        return;
      }

      rubFlow.group.visible = false;

      const sameSign = mode === 'repel';
      const maxA = sameSign ? 0.56 : 0.42;
      const theta = (0.06 + (q / 10) * 0.94) * maxA;

      const lx = PIVOT_L.x + (sameSign ? -1 : 1) * Math.sin(theta) * THREAD;
      const ly = PIVOT_L.y - Math.cos(theta) * THREAD;
      const rx = PIVOT_R.x + (sameSign ? 1 : -1) * Math.sin(theta) * THREAD;
      const ry = PIVOT_R.y - Math.cos(theta) * THREAD;

      leftBall.group.position.set(lx, ly, 0);
      rightBall.group.position.set(rx, ry, 0);
      leftBall.thread.setPoints([PIVOT_L, new V3(lx, ly, 0)]);
      rightBall.thread.setPoints([PIVOT_R, new V3(rx, ry, 0)]);
      leftBall.halo.material.opacity = 0.12 + q * 0.025;
      rightBall.halo.material.opacity = 0.12 + q * 0.025;

      const flen = 0.28 + q * 0.055;
      if (sameSign) {
        fL.set(new V3(lx - 0.3, ly, 0), new V3(-1, 0, 0), flen);
        fR.set(new V3(rx + 0.3, ry, 0), new V3(1, 0, 0), flen);
      } else {
        fL.set(new V3(lx + 0.3, ly, 0), new V3(1, 0, 0), flen);
        fR.set(new V3(rx - 0.3, ry, 0), new V3(-1, 0, 0), flen);
      }

      /* spark when opposite charges get close and strong */
      const gap = rx - lx;
      const show = !sameSign && gap < 0.95;
      spark.visible = show;
      if (show) {
        const pos = spark.geometry.attributes.position;
        const a = new V3(lx + 0.26, ly, 0), b = new V3(rx - 0.26, ry, 0);
        for (let i = 0; i < 5; i++) {
          const u = i / 4;
          const p = new V3().lerpVectors(a, b, u);
          if (i > 0 && i < 4) {
            p.x += (Math.random() - 0.5) * 0.1;
            p.y += (Math.random() - 0.5) * 0.18;
          }
          pos.setXYZ(i, p.x, p.y, p.z);
        }
        pos.needsUpdate = true;
        sparkMat.opacity = 0.45 + 0.5 * Math.random();
      }
    }

    function readout() {
      const d = 6;
      const F = 9e-5 * P.q * P.q / (d * d) * 1000;
      return [
        { k: 'q', v: P.q.toFixed(1), u: 'nC' },
        { k: 'd', v: '6', u: 'cm' },
        { k: 'F', v: F.toFixed(2), u: 'mN' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.46, phi: 1.1, radius: 8.0, target: new V3(0, 1.8, 0) },
      chips: [
        chipDef('电荷量 q', 'Charge q', 'CHARGE', function () { return P.q.toFixed(1) + ' nC'; }, '#3fd6f2', function () { return mode === 'rub' ? new V3(0, 2.1, 0) : new V3(0, 3.0, 0); }),
        chipDef('同种电荷', 'Like charges', 'REPULSION', function () { return mode === 'repel' ? '相斥' : '—'; }, '#ff4d8d', function () { return new V3(1.85, 2.35, 0); }, { small: true, visible: function () { return mode === 'repel'; } }),
        chipDef('异种电荷', 'Unlike charges', 'ATTRACTION', function () { return mode === 'attract' ? '相吸' : '—'; }, '#45e08a', function () { return new V3(1.85, 2.35, 0); }, { small: true, visible: function () { return mode === 'attract'; } }),
        chipDef('摩擦起电', 'Triboelectric', 'ELECTRON TRANSFER', function () { return mode === 'rub' ? '电子转移' : '—'; }, '#4d8dff', function () { return new V3(1.85, 2.35, 0); }, { small: true, visible: function () { return mode === 'rub'; } })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        const isRub = key === 'rub';
        leftBall.group.visible = rightBall.group.visible = !isRub;
        leftBall.thread.group.visible = rightBall.thread.group.visible = !isRub;
        fL.group.visible = fR.group.visible = !isRub;
        stand.visible = !isRub;
        rubGroup.visible = isRub;

        const c = key === 'attract' ? C.magenta : C.blue;
        rightBall.ballMat.emissive.setHex(c);
        rightBall.halo.material.color.setHex(c);
        rightBall.glyphMats.forEach(function (m) {
          m.map = glyphTexture(key === 'attract' ? '+' : '-');
          m.color.setHex(c);
          if (m.emissive) m.emissive.setHex(c);
        });
        spark.visible = false;
      },
      update: update,
      readout: readout
    };
  });

  /* ============================================================
     02  ELECTRON — 电子与原子
     ============================================================ */
  E.register('electron', function () {
    const g = new THREE.Group();
    const P = { e: 8 };
    const PROTONS = 8;
    let mode = 'neutral';

    g.add(E.glowDisc(3.2, C.blue, 0.09));

    const atom = new THREE.Group();
    atom.position.y = 2.05;
    g.add(atom);

    /* nucleus */
    const nucleus = new THREE.Group();
    atom.add(nucleus);
    const protonMat = E.mat(0xff5a7a, { metalness: 0.2, roughness: 0.4, emissive: 0x8a1230, emissiveIntensity: 0.5 });
    const neutronMat = E.mat(0x9aa8bd, { metalness: 0.25, roughness: 0.5, emissive: 0x1c2733, emissiveIntensity: 0.4 });
    const rN = 0.15;
    const spots = [];
    for (let i = 0; i < 14; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / 14);
      const th = Math.PI * (1 + Math.sqrt(5)) * i;
      spots.push(new V3(
        Math.sin(phi) * Math.cos(th) * 0.34,
        Math.cos(phi) * 0.34,
        Math.sin(phi) * Math.sin(th) * 0.34
      ));
    }
    let pi = 0, ni = 0;
    spots.forEach(function (p, i) {
      const isP = i % 2 === 0;
      const m = E.mesh(new THREE.SphereGeometry(rN, 16, 12), isP ? protonMat : neutronMat, p.x, p.y, p.z, false);
      nucleus.add(m);
      if (isP) pi++; else ni++;
    });
    const nGlow = E.glowSprite(1.1, 0xff7a92, 0.22);
    nucleus.add(nGlow);

    /* shells */
    const SHELLS = [
      { r: 1.05, n: 2, speed: 0.85, tilt: 0.0 },
      { r: 1.72, n: 6, speed: 0.5, tilt: 0.62 }
    ];

    const shells = SHELLS.map(function (sh) {
      const grp = new THREE.Group();
      grp.rotation.z = sh.tilt;
      atom.add(grp);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(sh.r, 0.006, 6, 96),
        new THREE.MeshBasicMaterial({ color: 0x4d8dff, transparent: true, opacity: 0.28 })
      );
      grp.add(ring);

      const orbit = new THREE.Group();
      grp.add(orbit);

      const eMat = E.mat(0x8fc4ff, { metalness: 0.2, roughness: 0.3, emissive: 0x4d8dff, emissiveIntensity: 1.1 });
      const electrons = [];
      for (let i = 0; i < 6; i++) {
        const eg = new THREE.Group();
        const s = E.mesh(new THREE.SphereGeometry(0.115, 16, 12), eMat, 0, 0, 0, false);
        eg.add(s);
        const h = E.glowSprite(0.36, 0x6fb0ff, 0.55);
        eg.add(h);
        eg.position.set(sh.r, 0, 0);
        orbit.add(eg);
        electrons.push(eg);
      }
      return { cfg: sh, grp: grp, orbit: orbit, electrons: electrons };
    });

    /* extra electron shell for the negative ion */
    const extra = new THREE.Group();
    extra.rotation.x = 0.9;
    extra.rotation.z = -0.35;
    atom.add(extra);
    const extraRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.28, 0.005, 6, 96),
      new THREE.MeshBasicMaterial({ color: 0xff4d8d, transparent: true, opacity: 0.3 })
    );
    extra.add(extraRing);
    const extraOrbit = new THREE.Group();
    extra.add(extraOrbit);
    const extraE = new THREE.Group();
    const extraSphere = E.mesh(new THREE.SphereGeometry(0.115, 16, 12), E.mat(0xffb0c8, { emissive: 0xff4d8d, emissiveIntensity: 1.2, roughness: 0.3 }), 0, 0, 0, false);
    extraE.add(extraSphere);
    extraE.add(E.glowSprite(0.4, 0xff4d8d, 0.6));
    extraE.position.set(2.28, 0, 0);
    extraOrbit.add(extraE);
    extra.visible = false;

    /* empty slot marker for the missing electron */
    const hole = new THREE.Mesh(
      new THREE.TorusGeometry(0.13, 0.014, 8, 28),
      new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.9 })
    );
    hole.visible = false;
    atom.add(hole);

    /* charge badge */
    const badge = new THREE.Group();
    const badgeDisc = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), E.glowMat(0xff4d8d, 0.18));
    badge.add(badgeDisc);
    const badgeGlyph = E.sign('+', 0.16, C.magenta);
    badge.add(badgeGlyph);
    badge.position.set(0, -1.05, 1.9);
    badge.visible = false;
    g.add(badge);

    function refresh() {
      shells.forEach(function (sh) {
        sh.electrons.forEach(function (eg, i) {
          eg.visible = i < sh.cfg.n;
        });
        sh.grp.visible = true;
      });
      const missing = PROTONS - P.e;
      extra.visible = P.e > PROTONS;
      hole.visible = P.e < PROTONS;
      if (hole.visible) {
        const sh = shells[1];
        const a = (sh.cfg.n / 6) * Math.PI * 2 + 0.4;
        hole.position.set(Math.cos(a) * sh.cfg.r, Math.sin(a) * sh.cfg.r * Math.cos(sh.cfg.tilt), Math.sin(a) * sh.cfg.r * Math.sin(sh.cfg.tilt));
      }
      badge.visible = P.e !== PROTONS;
      if (P.e !== PROTONS) {
        badgeGlyph.children.forEach(function (c) { c.visible = true; });
        badgeGlyph.rotation.z = 0;
        const isPos = P.e < PROTONS;
        badgeGlyph.children.forEach(function (c) {
          if (c.geometry.parameters.height > c.geometry.parameters.width) c.visible = isPos;
        });
        badge.children[0].material.color.setHex(isPos ? C.magenta : C.blue);
      }
    }

    function update(t) {
      nucleus.rotation.y = t * 0.22;
      nucleus.rotation.x = Math.sin(t * 0.4) * 0.15;
      shells.forEach(function (sh, si) {
        sh.orbit.rotation.z = t * sh.cfg.speed + si * 1.4;
        sh.electrons.forEach(function (eg, i) {
          if (!eg.visible) return;
          const a = (i / sh.cfg.n) * Math.PI * 2;
          eg.position.set(Math.cos(a) * sh.cfg.r, Math.sin(a) * sh.cfg.r, 0);
        });
      });
      extraOrbit.rotation.z = -t * 0.42;
      if (hole.visible) hole.rotation.z = t * 0.4;
      if (badge.visible) {
        badge.position.y = -1.05 + Math.sin(t * 1.6) * 0.05;
        badge.lookAt(0, badge.position.y, 40);
      }
    }

    refresh();

    function readout() {
      const net = P.e - PROTONS;
      return [
        { k: 'p', v: '+' + PROTONS, u: '' },
        { k: 'e', v: String(P.e), u: '' },
        { k: 'net', v: net === 0 ? '0' : (net > 0 ? '+1.6' : '−1.6'), u: net === 0 ? '' : '×10⁻¹⁹ C' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.38, phi: 1.12, radius: 7.6, target: new V3(0, 2.0, 0) },
      chips: [
        chipDef('原子核', 'Nucleus', 'PROTONS +8 / NEUTRONS', function () { return '8p + 6n'; }, '#ff5a7a', function () { return new V3(-1.55, 2.35, 0.3); }),
        chipDef('电子数', 'Electrons', 'SHELL 2 · 6', function () { return String(P.e); }, '#4d8dff', function () { return new V3(0, 3.35, 0.35); }, { small: true }),
        chipDef('净电荷', 'Net charge', 'Q = (e⁻ − p⁺)', function () {
          const net = P.e - PROTONS;
          return net === 0 ? '0 C 中性' : (net > 0 ? '+' : '−') + '1.6×10⁻¹⁹ C';
        }, '#ffb347', function () { return new V3(0, 1.05, 1.35); })
      ],
      setParam: function (k, v) { P[k] = Math.round(v); refresh(); },
      setVariant: function (key) {
        mode = key;
        P.e = key === 'positive' ? PROTONS - 1 : key === 'negative' ? PROTONS + 1 : PROTONS;
        refresh();
      },
      update: update,
      readout: readout
    };
  });

  /* ============================================================
     03  MAGNETISM — 磁现象
     ============================================================ */
  E.register('magnet', function () {
    const g = new THREE.Group();
    const P = { d: 2.0 };
    let mode = 'bar';

    g.add(E.glowDisc(3.6, C.violet, 0.07));
    g.add(E.slab(8.0, 4.2, 0.18, 0x0d1520));

    const fieldMat = { metalness: 0.0, roughness: 1.0, emissive: 0xa48bff, emissiveIntensity: 0.75, opacity: 0.42 };

    function magnetBody(len, w) {
      const grp = new THREE.Group();
      const L = len, W = w;
      const north = E.mesh(new THREE.BoxGeometry(L / 2, W, W), E.mat(0xd94a5c, { metalness: 0.55, roughness: 0.42, emissive: 0x5a0d18, emissiveIntensity: 0.4 }), L / 4, 0, 0);
      const south = E.mesh(new THREE.BoxGeometry(L / 2, W, W), E.mat(0x3f6fbf, { metalness: 0.55, roughness: 0.42, emissive: 0x0d2450, emissiveIntensity: 0.4 }), -L / 4, 0, 0);
      E.addEdges(north, 0xffc2ca, 0.2);
      E.addEdges(south, 0xc2d8ff, 0.2);
      const ln = E.letterPlane('N', W * 0.52, '#ffe9ec');
      ln.position.set(0, W / 2 + 0.004, 0);
      ln.rotation.x = -Math.PI / 2;
      north.add(ln);
      const ls = E.letterPlane('S', W * 0.52, '#e8f0ff');
      ls.position.set(0, W / 2 + 0.004, 0);
      ls.rotation.x = -Math.PI / 2;
      south.add(ls);
      grp.add(north, south);
      return grp;
    }

    /* ---- bar magnet ---- */
    const barGroup = new THREE.Group();
    barGroup.position.y = 0.62;
    g.add(barGroup);
    const bar = magnetBody(3.2, 0.52);
    barGroup.add(bar);

    /* field loops: teardrop shapes anchored at both poles */
    const loops = new THREE.Group();
    barGroup.add(loops);
    const L2 = 3.2 / 2;
    [[0.5, 4], [0.85, 4], [1.3, 4], [1.85, 4], [2.5, 4]].forEach(function (cfg, li) {
      const A = cfg[0];
      for (let k = 0; k < cfg[1]; k++) {
        const az = (k / cfg[1]) * Math.PI;
        const pts = [];
        for (let i = 0; i <= 26; i++) {
          const u = i / 26;
          const x = L2 * Math.cos(Math.PI * u) * 0.98;
          const rho = A * Math.pow(Math.sin(Math.PI * u), 0.75);
          pts.push(new V3(x, rho * Math.cos(az), rho * Math.sin(az)));
        }
        const t = E.curveTube(pts, 0.013, 0xa48bff, true, 96, fieldMat);
        t.material.opacity = 0.46 - li * 0.045;
        loops.add(t);
      }
    });

    /* iron filings oriented along the local dipole field */
    const filingMat = E.mat(0x9aa8bd, { metalness: 0.85, roughness: 0.45, emissive: 0x243044, emissiveIntensity: 0.35 });
    const filings = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.014, 0.03), filingMat, 260);
    filings.castShadow = false;
    g.add(filings);
    const _m4 = new THREE.Matrix4();
    const _q = new THREE.Quaternion();
    const _s = new V3(1, 1, 1);
    function buildFilings() {
      let i = 0, guard = 0;
      const m = new V3(1, 0, 0);
      const mid = new V3(0, 0.62, 0);
      while (i < 260 && guard < 6000) {
        guard++;
        const x = (Math.random() - 0.5) * 5.6;
        const z = (Math.random() - 0.5) * 3.0;
        if (Math.abs(x) < L2 + 0.06 && Math.abs(z) < 0.36) continue;
        const r = new V3(x, 0.23, z);
        const d = new V3().subVectors(r, mid);
        const dist = d.length();
        if (dist > 3.0) continue;
        /* dipole field, flattened onto the bench so the needles lie flat */
        const B = d.clone().multiplyScalar(3 * m.dot(d) / Math.pow(dist, 5))
          .sub(m.clone().divideScalar(Math.pow(dist, 3)));
        B.y = 0;
        if (B.lengthSq() < 1e-9) continue;
        B.normalize();
        _q.setFromUnitVectors(new V3(1, 0, 0), B);
        _m4.compose(r, _q, _s);
        filings.setMatrixAt(i, _m4);
        i++;
      }
      filings.count = i;
      filings.instanceMatrix.needsUpdate = true;
    }
    buildFilings();

    /* compass */
    const compass = new THREE.Group();
    compass.position.set(0.4, 0.28, 1.95);
    g.add(compass);
    const cBase = E.mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.09, 32), E.mat(0x1b2431, { metalness: 0.5, roughness: 0.5 }), 0, 0.045, 0);
    compass.add(cBase);
    const cFace = E.mesh(new THREE.CircleGeometry(0.37, 32), E.mat(0xd3dcea, { metalness: 0.05, roughness: 0.72 }), 0, 0.093, 0);
    cFace.rotation.x = -Math.PI / 2;
    compass.add(cFace);
    const cRim = E.mesh(new THREE.TorusGeometry(0.375, 0.022, 8, 40), E.mat(0x8fa3bd, { metalness: 0.9, roughness: 0.3 }), 0, 0.095, 0);
    cRim.rotation.x = -Math.PI / 2;
    compass.add(cRim);
    const needleG = new THREE.Group();
    needleG.position.y = 0.12;
    const nN = E.mesh(new THREE.BoxGeometry(0.28, 0.018, 0.055), E.mat(0xd94a5c, { emissive: 0x6a1020, emissiveIntensity: 0.6 }), 0.15, 0, 0);
    const nS = E.mesh(new THREE.BoxGeometry(0.28, 0.018, 0.055), E.mat(0x44546b, { metalness: 0.6, roughness: 0.4 }), -0.15, 0, 0);
    needleG.add(nN, nS);
    compass.add(needleG);

    /* ---- horseshoe ---- */
    const horse = new THREE.Group();
    horse.visible = false;
    horse.position.y = 0.55;
    g.add(horse);
    const horseShape = new THREE.Shape();
    const R1 = 1.5, R2 = 0.95;
    horseShape.absarc(0, 0, R1, 0, Math.PI, false);
    horseShape.lineTo(-R2, 0);
    horseShape.absarc(0, 0, R2, Math.PI, 0, true);
    horseShape.lineTo(R1, 0);
    const horseGeo = new THREE.ExtrudeGeometry(horseShape, { depth: 0.62, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 1, curveSegments: 40 });
    horseGeo.translate(0, 0, -0.31);
    const horseMesh = new THREE.Mesh(horseGeo, E.mat(0x8b98ad, { metalness: 0.85, roughness: 0.35 }));
    horseMesh.castShadow = true;
    horse.add(horseMesh);
    /* pole caps */
    const capN = E.mesh(new THREE.BoxGeometry(0.58, 0.5, 0.66), E.mat(0xd94a5c, { metalness: 0.5, roughness: 0.4, emissive: 0x5a0d18, emissiveIntensity: 0.4 }), R1 - 0.28, -0.2, 0);
    const capS = E.mesh(new THREE.BoxGeometry(0.58, 0.5, 0.66), E.mat(0x3f6fbf, { metalness: 0.5, roughness: 0.4, emissive: 0x0d2450, emissiveIntensity: 0.4 }), -R1 + 0.28, -0.2, 0);
    horse.add(capN, capS);

    const horseField = new THREE.Group();
    horse.add(horseField);
    for (let i = 0; i < 7; i++) {
      const u = i / 6;
      const y0 = -0.18;
      const x0 = R1 - 0.32;
      const sag = 0.15 + u * 1.15;
      const pts = [];
      for (let s = 0; s <= 16; s++) {
        const v = s / 16;
        const x = x0 - (2 * x0) * v;
        const y = y0 - Math.sin(Math.PI * v) * sag;
        const z = (u - 0.5) * 1.5 * Math.sin(Math.PI * v);
        pts.push(new V3(x, y, z));
      }
      const t = E.curveTube(pts, 0.01, 0xa48bff, false, 60, fieldMat);
      t.material.opacity = 0.4 - Math.abs(u - 0.5) * 0.2;
      horseField.add(t);
    }

    /* ---- two magnets repelling ---- */
    const repelGroup = new THREE.Group();
    repelGroup.visible = false;
    g.add(repelGroup);
    const mA = magnetBody(1.9, 0.42);
    mA.position.set(-1.5, 0.6, 0);
    repelGroup.add(mA);
    const mB = magnetBody(1.9, 0.42);
    mB.rotation.y = Math.PI;
    mB.position.set(1.5, 0.6, 0);
    repelGroup.add(mB);

    const arrowA = new E.Arrow(C.cyan, { radius: 0.03, headRadius: 0.1, headLen: 0.22 });
    const arrowB = new E.Arrow(C.cyan, { radius: 0.03, headRadius: 0.1, headLen: 0.22 });
    repelGroup.add(arrowA.group, arrowB.group);

    const repelField = new THREE.Group();
    repelGroup.add(repelField);
    for (let i = 0; i < 5; i++) {
      const z = (i - 2) * 0.5;
      const pts = [];
      for (let s = 0; s <= 14; s++) {
        const v = s / 14;
        const x = -1.0 + v * 2.0;
        const y = 0.6 + Math.sin(Math.PI * v) * (0.5 + i * 0.16) - 0.05;
        pts.push(new V3(x, y, z));
      }
      const t = E.curveTube(pts, 0.009, 0xff8a6a, false, 50, { metalness: 0, roughness: 1, emissive: 0xff6a4a, emissiveIntensity: 0.8, opacity: 0.35 });
      repelField.add(t);
    }

    /* ---------------- update ---------------- */
    function update(t) {
      if (mode === 'repel') {
        const sep = P.d;
        mA.position.x = -0.95 - sep / 2;
        mB.position.x = 0.95 + sep / 2;
        const hover = Math.sin(t * 1.8) * 0.012;
        mA.position.y = mB.position.y = 0.6 + hover;
        const len = 0.3 + (2.6 - sep) * 0.28;
        arrowA.set(new V3(mA.position.x - 0.55, 0.62, 0), new V3(-1, 0, 0), len);
        arrowB.set(new V3(mB.position.x + 0.55, 0.62, 0), new V3(1, 0, 0), len);
        repelField.scale.set(1 + (2.6 - sep) * 0.1, 1, 1);
        return;
      }
      if (mode === 'horseshoe') {
        horse.rotation.y = Math.sin(t * 0.3) * 0.12;
        return;
      }
      barGroup.rotation.y = Math.sin(t * 0.28) * 0.18;
      /* compass needle follows the field at its own position */
      const pos = new V3(compass.position.x, 0.6, compass.position.z);
      const m = new V3(1, 0, 0);
      const d = pos.length();
      const B = new V3().copy(pos).multiplyScalar(3 * (m.dot(pos)) / (d * d)).sub(m);
      needleG.rotation.y = -Math.atan2(B.z, B.x) + Math.sin(t * 0.6) * 0.02;
    }

    function readout() {
      return [
        { k: 'd', v: P.d.toFixed(1), u: 'cm' },
        { k: 'B', v: (0.42 / (P.d * P.d) * 4).toFixed(2), u: 'mT' },
        { k: 'n', v: '2', u: '极' }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.42, phi: 1.0, radius: 8.8, target: new V3(0, 1.05, 0) },
      chips: [
        chipDef('N 极', 'North pole', 'N', function () { return '红'; }, '#ff4d6a', function () { return new V3(1.95, 1.2, 0.15); }, { small: true, visible: function () { return mode === 'bar'; } }),
        chipDef('S 极', 'South pole', 'S', function () { return '蓝'; }, '#4d8dff', function () { return new V3(-1.95, 1.2, 0.15); }, { small: true, visible: function () { return mode === 'bar'; } }),
        chipDef('磁感线', 'Field lines', 'N → S OUTSIDE', function () { return '闭合曲线'; }, '#a48bff', function () { return new V3(0, 2.4, 0); }, { visible: function () { return mode !== 'repel'; } }),
        chipDef('磁极间距', 'Pole gap', 'DISTANCE', function () { return P.d.toFixed(1) + ' cm'; }, '#3fd6f2', function () { return new V3(0, 1.25, 0.9); }, { small: true, visible: function () { return mode === 'repel'; } })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        barGroup.visible = key === 'bar';
        loops.visible = key === 'bar';
        filings.visible = key === 'bar' || key === 'repel';
        compass.visible = key === 'bar';
        horse.visible = key === 'horseshoe';
        repelGroup.visible = key === 'repel';
      },
      update: update,
      readout: readout
    };
  });
})();
