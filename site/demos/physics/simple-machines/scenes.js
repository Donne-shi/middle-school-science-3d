/* ============================================================
   Simple Machines — 3D scene builders
   Each builder returns { group, chips, camera, params, setParam,
                          setVariant, update, readout }
   ============================================================ */
(function () {
  'use strict';

  const V3 = THREE.Vector3;
  const UP = new THREE.Vector3(0, 1, 0);
  const D2R = Math.PI / 180;
  const clamp = THREE.MathUtils.clamp;
  const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const C = {
    metal: 0x93a6c0,
    steel: 0x6f86a6,
    dark: 0x2c3c52,
    cyan: 0x3fd6f2,
    amber: 0xffb347,
    violet: 0xa48bff,
    blue: 0x6fa8ff,
    rope: 0xd8c8a6,
    wood: 0x7b5433,
    woodDark: 0x5d3f27
  };

  /* ---------------- helpers ---------------- */

  function mat(color, o) {
    o = o || {};
    return new THREE.MeshStandardMaterial({
      color: color,
      metalness: o.metalness === undefined ? 0.35 : o.metalness,
      roughness: o.roughness === undefined ? 0.55 : o.roughness,
      emissive: o.emissive === undefined ? 0x000000 : o.emissive,
      emissiveIntensity: o.emissiveIntensity === undefined ? 1 : o.emissiveIntensity,
      transparent: (o.opacity === undefined ? 1 : o.opacity) < 1,
      opacity: o.opacity === undefined ? 1 : o.opacity,
      side: o.side || THREE.FrontSide
    });
  }

  function addEdges(mesh, color, opacity) {
    const e = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry, 28),
      new THREE.LineBasicMaterial({ color: color || 0xa9c6e8, transparent: true, opacity: opacity === undefined ? 0.25 : opacity })
    );
    mesh.add(e);
    return e;
  }

  function mesh(geo, material, x, y, z, cast) {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = cast !== false;
    m.receiveShadow = true;
    return m;
  }

  function lineSeg(a, b, color, opacity, dashed) {
    const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
    let m;
    if (dashed) {
      m = new THREE.LineDashedMaterial({ color: color, dashSize: 0.14, gapSize: 0.1, transparent: true, opacity: opacity === undefined ? 1 : opacity });
    } else {
      m = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity === undefined ? 1 : opacity });
    }
    const line = new THREE.Line(geo, m);
    if (dashed) line.computeLineDistances();
    return line;
  }

  function disposeTree(obj) {
    obj.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const arr = Array.isArray(o.material) ? o.material : [o.material];
        arr.forEach(function (m) {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      }
    });
  }

  function clearGroup(g) {
    for (let i = g.children.length - 1; i >= 0; i--) {
      const c = g.children[i];
      g.remove(c);
      disposeTree(c);
    }
  }

  let _glow = null;
  function glowTexture() {
    if (_glow) return _glow;
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const ctx = cv.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,0.6)');
    grd.addColorStop(0.4, 'rgba(255,255,255,0.14)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    _glow = new THREE.CanvasTexture(cv);
    return _glow;
  }

  function glowDisc(r, color, opacity) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(r * 2, r * 2),
      new THREE.MeshBasicMaterial({ map: glowTexture(), color: color, transparent: true, opacity: opacity === undefined ? 0.4 : opacity, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.015;
    m.renderOrder = -1;
    return m;
  }

  /* ---------------- arrow ---------------- */

  class Arrow {
    constructor(color, opts) {
      opts = opts || {};
      const radius = opts.radius || 0.032;
      const headRadius = opts.headRadius || 0.1;
      const headLen = opts.headLen || 0.24;
      this.headLen = headLen;
      this.group = new THREE.Group();
      const m = mat(color, { metalness: 0.35, roughness: 0.4, emissive: color, emissiveIntensity: 0.45 });
      if (opts.overlay) {
        m.depthTest = false;
        m.depthWrite = false;
        m.transparent = true;
      }
      this.material = m;
      this.shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 12), m);
      this.head = new THREE.Mesh(new THREE.ConeGeometry(headRadius, headLen, 16), m);
      this.shaft.castShadow = false;
      this.head.castShadow = false;
      if (opts.overlay) {
        this.shaft.renderOrder = 16;
        this.head.renderOrder = 16;
      }
      this.group.add(this.shaft);
      this.group.add(this.head);
    }
    set(origin, dir, length) {
      const d = dir.clone().normalize();
      this.group.position.copy(origin);
      this.group.quaternion.setFromUnitVectors(UP, d);
      const l = Math.max(length, this.headLen + 0.02);
      const shaftLen = l - this.headLen;
      this.shaft.scale.set(1, shaftLen, 1);
      this.shaft.position.set(0, shaftLen / 2, 0);
      this.head.position.set(0, l - this.headLen / 2, 0);
    }
    setVisible(v) { this.group.visible = v; }
  }

  /* ---------------- rope ---------------- */

  function resample(points, n) {
    const segs = [];
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const d = points[i].distanceTo(points[i + 1]);
      segs.push(d);
      total += d;
    }
    const out = [];
    if (total < 1e-6) {
      for (let i = 0; i < n; i++) out.push(points[0].clone());
      return out;
    }
    const step = total / (n - 1);
    let si = 0, acc = 0;
    for (let i = 0; i < n; i++) {
      const target = i * step;
      while (si < segs.length - 1 && acc + segs[si] < target) { acc += segs[si]; si++; }
      const local = segs[si] < 1e-9 ? 0 : clamp((target - acc) / segs[si], 0, 1);
      out.push(new V3().lerpVectors(points[si], points[si + 1], local));
    }
    return out;
  }

  class Rope {
    constructor(count, radius, color) {
      this.group = new THREE.Group();
      this.meshes = [];
      this.count = count;
      const geo = new THREE.CylinderGeometry(radius, radius, 1, 7, 1, false);
      const material = mat(color === undefined ? C.rope : color, { metalness: 0.05, roughness: 0.95, emissive: 0x1a1408, emissiveIntensity: 0.35 });
      for (let i = 0; i < count; i++) {
        const m = new THREE.Mesh(geo, material);
        m.castShadow = false;
        this.meshes.push(m);
        this.group.add(m);
      }
      this._d = new V3();
    }
    setPoints(points) {
      const pts = resample(points, this.count + 1);
      for (let i = 0; i < this.count; i++) {
        const a = pts[i], b = pts[i + 1];
        const m = this.meshes[i];
        this._d.subVectors(b, a);
        const len = this._d.length();
        m.position.copy(a).addScaledVector(this._d, 0.5);
        m.quaternion.setFromUnitVectors(UP, this._d.normalize());
        m.scale.set(1, Math.max(len, 0.0001), 1);
      }
    }
  }

  function tube(a, b, r, color) {
    const d = new V3().subVectors(b, a);
    const len = d.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8), mat(color, { metalness: 0.2, roughness: 0.5 }));
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(UP, d.normalize());
    return m;
  }

  /* glowing dimension bar — far more legible than a 1px line on a dark stage */
  function bar(a, b, r, color, glow) {
    const d = new V3().subVectors(b, a);
    const len = d.length();
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, len, 7),
      mat(color, { metalness: 0.3, roughness: 0.45, emissive: color, emissiveIntensity: glow === undefined ? 0.45 : glow })
    );
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(UP, d.normalize());
    m.castShadow = false;
    return m;
  }

  function chipDef(zh, en, sub, value, color, pos, opts) {
    opts = opts || {};
    return {
      zh: zh, en: en, sub: sub, value: value, color: color, pos: pos,
      small: !!opts.small, title: !!opts.title, visible: opts.visible || null
    };
  }

  /* ============================================================
     1. LEVER — three physically distinct models
     ============================================================ */
  function buildLever() {
    const g = new THREE.Group();
    const P = { G: 120 };
    let mode = 'power';

    const MODELS = {
      power: { L1: 4.35, L2: 1.35 },
      equal: { L1: 1.85, L2: 1.85 },
      effort: { L1: 1.2, L2: 4.5 }
    };

    const CAMS = {
      power: { theta: 0.5, phi: 1.16, radius: 8.6, target: new V3(-0.25, 0.8, 0) },
      equal: { theta: 0.24, phi: 1.1, radius: 8.4, target: new V3(0, 1.58, 0) },
      effort: { theta: 0.48, phi: 1.12, radius: 7.6, target: new V3(1.7, 1.55, 0) }
    };

    const CP = {
      power: { o: new V3(), f1: new V3(), g: new V3(), l1: new V3(), l2: new V3() },
      equal: { o: new V3(), f1: new V3(), g: new V3(), l1: new V3(), l2: new V3() },
      effort: { o: new V3(), f1: new V3(), g: new V3(), l1: new V3(), l2: new V3() }
    };

    const metal = mat(0x93a3b8, { metalness: 0.92, roughness: 0.3 });
    const darkMetal = mat(0x51637d, { metalness: 0.9, roughness: 0.34 });
    const groundMat = mat(0x080e18, { metalness: 0.4, roughness: 0.8 });

    /* ---------------- 省力杠杆：撬棍撬重物 ---------------- */
    function makePower() {
      const grp = new THREE.Group();
      const px = -1.8, py = 1.06;
      const L1 = MODELS.power.L1, L2 = MODELS.power.L2;
      const cp = CP.power;

      const ful = mesh(new THREE.BoxGeometry(0.58, 0.94, 0.7), darkMetal, px, 0.59, 0);
      addEdges(ful, 0xb9d4f5, 0.22);
      grp.add(ful);

      const pivot = new THREE.Group();
      pivot.position.set(px, py, 0);
      grp.add(pivot);

      const beam = mesh(new THREE.BoxGeometry(L1 + L2 + 0.5, 0.15, 0.32), metal, (L1 - L2) / 2, 0, 0);
      addEdges(beam, 0xcfe4ff, 0.28);
      pivot.add(beam);

      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.5, 14), mat(0xe4edf9, { metalness: 1, roughness: 0.2 }));
      bolt.rotation.x = Math.PI / 2;
      pivot.add(bolt);

      const load = new THREE.Group();
      grp.add(load);
      const crate = mesh(new THREE.BoxGeometry(0.74, 0.74, 0.74), mat(0x7a5a34, { metalness: 0.08, roughness: 0.88 }), 0, 0, 0);
      addEdges(crate, 0xc9a97f, 0.32);
      load.add(crate);

      const rope = new Rope(2, 0.022, 0xb9a97f);
      grp.add(rope.group);

      const effort = new Arrow(0xffb347, { radius: 0.036, headRadius: 0.11, headLen: 0.25 });
      grp.add(effort.group);
      const pad = mesh(new THREE.BoxGeometry(0.3, 0.07, 0.3), mat(0xffb347, { metalness: 0.5, roughness: 0.4, emissive: 0x8a5200, emissiveIntensity: 0.5 }), 0, 0, 0);
      grp.add(pad);

      const dims = new THREE.Group();
      grp.add(dims);
      const dimZ = 0.52, dimY = 0.78;
      dims.add(lineSeg(new V3(px - L2, dimY, dimZ), new V3(px + L1, dimY, dimZ), 0x8fb0d0, 0.85, true));
      dims.add(bar(new V3(px - L2, dimY - 0.15, dimZ), new V3(px - L2, dimY + 0.15, dimZ), 0.013, 0x3fd6f2, 0.7));
      dims.add(bar(new V3(px, dimY - 0.15, dimZ), new V3(px, dimY + 0.15, dimZ), 0.013, 0x9fb0c8, 0.7));
      dims.add(bar(new V3(px + L1, dimY - 0.15, dimZ), new V3(px + L1, dimY + 0.15, dimZ), 0.013, 0xffb347, 0.7));
      cp.l2.set(px - L2 * 0.5, dimY - 0.36, dimZ);
      cp.l1.set(px + L1 * 0.5, dimY - 0.36, dimZ);
      cp.o.set(px, 1.34, 0.36);

      function update(t) {
        const tilt = 0.055 * Math.sin(t * 0.9) + 0.012;
        pivot.rotation.z = tilt;
        const c = Math.cos(tilt), s = Math.sin(tilt);

        const lp = new V3(px - L2 * c, py - L2 * s, 0);
        const crateY = lp.y - 0.66 - 0.37;
        load.position.set(lp.x, crateY, 0);
        rope.setPoints([lp, new V3(lp.x, lp.y - 0.66, 0)]);
        cp.g.set(lp.x, crateY - 0.5, 0);

        const ep = new V3(px + L1 * c, py + L1 * s, 0);
        const F = P.G * L2 / L1;
        const len = clamp(0.5 + F / 210, 0.6, 1.9);
        pad.position.set(ep.x, ep.y + 0.07, 0);
        pad.rotation.z = tilt;
        effort.set(new V3(ep.x, ep.y + 0.14 + len, 0), new V3(0, -1, 0), len);
        cp.f1.set(ep.x, ep.y + 0.14 + len * 0.55, 0);
      }

      return { group: grp, update: update };
    }

    /* ---------------- 等臂杠杆：天平 ---------------- */
    function makeEqual() {
      const grp = new THREE.Group();
      const py = 2.12, half = MODELS.equal.L1;
      const cp = CP.equal;

      const base = mesh(new THREE.BoxGeometry(1.9, 0.14, 1.2), groundMat, 0, 0.07, 0);
      addEdges(base, 0x2b4159, 0.5);
      grp.add(base);

      const col = mesh(new THREE.CylinderGeometry(0.07, 0.14, 2.0, 20), darkMetal, 0, 1.06, 0);
      grp.add(col);
      const cap = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 20), mat(0xc9d8ea, { metalness: 1, roughness: 0.2 }), 0, 2.05, 0);
      grp.add(cap);

      const pivot = new THREE.Group();
      pivot.position.set(0, py, 0);
      grp.add(pivot);

      const beam = mesh(new THREE.BoxGeometry(half * 2 + 0.26, 0.1, 0.24), metal, 0, 0, 0);
      addEdges(beam, 0xcfe4ff, 0.28);
      pivot.add(beam);

      const needle = mesh(new THREE.BoxGeometry(0.026, 0.44, 0.026), mat(0xffb347, { metalness: 0.5, roughness: 0.4, emissive: 0x8a5200, emissiveIntensity: 0.45 }), 0, -0.24, 0.15);
      pivot.add(needle);

      function makePan(sx) {
        const pg = new THREE.Group();
        pg.position.set(sx, 0, 0);
        const dish = mesh(new THREE.CylinderGeometry(0.4, 0.33, 0.06, 28), mat(0x9db3cf, { metalness: 0.9, roughness: 0.3 }), 0, -0.96, 0);
        pg.add(dish);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.016, 6, 32), mat(0xc9d8ea, { metalness: 1, roughness: 0.25 }));
        rim.rotation.x = Math.PI / 2;
        rim.position.y = -0.93;
        pg.add(rim);
        for (let i = 0; i < 3; i++) {
          const a = i * Math.PI * 2 / 3;
          pg.add(tube(new V3(0, -0.02, 0), new V3(Math.cos(a) * 0.38, -0.93, Math.sin(a) * 0.38), 0.008, 0xa9bdd6));
        }
        return pg;
      }

      const panL = makePan(-half);
      const panR = makePan(half);
      pivot.add(panL, panR);

      const wL = mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), mat(0x0d7f99, { metalness: 0.5, roughness: 0.4, emissive: 0x06414f, emissiveIntensity: 0.85 }), 0, -0.75, 0);
      addEdges(wL, 0x7ff0ff, 0.4);
      panL.add(wL);
      const wR = mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), mat(0xc07a2a, { metalness: 0.5, roughness: 0.4, emissive: 0x5a3200, emissiveIntensity: 0.7 }), 0, -0.75, 0);
      addEdges(wR, 0xffc078, 0.4);
      panR.add(wR);

      const dims = new THREE.Group();
      grp.add(dims);
      const dimY = 2.52, dimZ = 0.4;
      dims.add(lineSeg(new V3(-half, dimY, dimZ), new V3(half, dimY, dimZ), 0x8fb0d0, 0.85, true));
      dims.add(bar(new V3(0, dimY - 0.13, dimZ), new V3(0, dimY + 0.13, dimZ), 0.012, 0x9fb0c8, 0.7));
      dims.add(bar(new V3(-half, dimY - 0.13, dimZ), new V3(-half, dimY + 0.13, dimZ), 0.012, 0x3fd6f2, 0.7));
      dims.add(bar(new V3(half, dimY - 0.13, dimZ), new V3(half, dimY + 0.13, dimZ), 0.012, 0xffb347, 0.7));
      cp.l2.set(-half * 0.5, dimY + 0.28, dimZ);
      cp.l1.set(half * 0.5, dimY + 0.28, dimZ);
      cp.o.set(0, 2.3, 0.42);

      function update(t) {
        const tilt = 0.016 * Math.sin(t * 0.8);
        pivot.rotation.z = tilt;
        const c = Math.cos(tilt), s = Math.sin(tilt);
        cp.g.set(-half * c, py - half * s - 0.75, 0);
        cp.f1.set(half * c, py + half * s - 0.75, 0);
      }

      return { group: grp, update: update };
    }

    /* ---------------- 费力杠杆：钓鱼竿 ---------------- */
    function makeEffort() {
      const grp = new THREE.Group();
      const px = -0.45, py = 1.32;
      const ang0 = 0.185;
      const L1 = MODELS.effort.L1, L2 = MODELS.effort.L2;
      const cp = CP.effort;

      const base = mesh(new THREE.BoxGeometry(1.1, 0.12, 0.95), groundMat, px, 0.06, 0);
      addEdges(base, 0x2b4159, 0.5);
      grp.add(base);

      const post = mesh(new THREE.BoxGeometry(0.13, 1.26, 0.13), darkMetal, px, 0.69, 0);
      grp.add(post);
      const clampBox = mesh(new THREE.BoxGeometry(0.28, 0.18, 0.28), mat(0x5f7288, { metalness: 0.85, roughness: 0.4 }), px, py - 0.08, 0);
      grp.add(clampBox);

      const pivot = new THREE.Group();
      pivot.position.set(px, py, 0);
      pivot.rotation.z = ang0;
      grp.add(pivot);

      const rod = mesh(new THREE.CylinderGeometry(0.028, 0.076, L2, 14), mat(0x8a6a45, { metalness: 0.45, roughness: 0.45 }), L2 / 2, 0, 0);
      rod.rotation.z = -Math.PI / 2;
      pivot.add(rod);

      const grip = mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.26, 14), mat(0x2c3c52, { metalness: 0.6, roughness: 0.5 }), L1, 0, 0);
      grip.rotation.z = -Math.PI / 2;
      pivot.add(grip);

      const tipRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 6, 14), mat(0xc9d8ea, { metalness: 1, roughness: 0.25 }));
      tipRing.rotation.y = Math.PI / 2;
      tipRing.position.set(L2, 0, 0);
      pivot.add(tipRing);

      const fishLine = new Rope(1, 0.012, 0xcfe0f2);
      grp.add(fishLine.group);

      const fish = new THREE.Group();
      const body = mesh(new THREE.SphereGeometry(0.2, 16, 12), mat(0x3fa9cf, { metalness: 0.35, roughness: 0.4, emissive: 0x06384a, emissiveIntensity: 0.6 }), 0, 0, 0);
      body.scale.set(1.55, 0.82, 0.72);
      const tail = mesh(new THREE.ConeGeometry(0.15, 0.24, 3), mat(0x2e8fb2, { metalness: 0.35, roughness: 0.45 }), -0.34, 0, 0);
      tail.rotation.z = Math.PI / 2;
      fish.add(body, tail);
      grp.add(fish);

      const effort = new Arrow(0xffb347, { radius: 0.034, headRadius: 0.105, headLen: 0.24 });
      grp.add(effort.group);
      const handPad = mesh(new THREE.BoxGeometry(0.26, 0.08, 0.26), mat(0xffb347, { metalness: 0.5, roughness: 0.4, emissive: 0x8a5200, emissiveIntensity: 0.5 }), 0, 0, 0);
      grp.add(handPad);

      /* dimension rail lives in a group that mirrors the rod's angle */
      const dimPivot = new THREE.Group();
      dimPivot.position.set(px, py, 0);
      dimPivot.rotation.z = ang0;
      grp.add(dimPivot);
      const dOff = -0.4;
      dimPivot.add(lineSeg(new V3(0, dOff, 0.3), new V3(L2, dOff, 0.3), 0x8fb0d0, 0.85, true));
      dimPivot.add(bar(new V3(0, dOff, 0.3), new V3(L1, dOff, 0.3), 0.013, 0xffb347, 0.75));
      dimPivot.add(bar(new V3(L1, dOff, 0.3), new V3(L2, dOff, 0.3), 0.013, 0x3fd6f2, 0.75));
      [0, L1, L2].forEach(function (x, i) {
        dimPivot.add(bar(new V3(x, dOff - 0.13, 0.3), new V3(x, dOff + 0.13, 0.3), 0.011, i === 1 ? 0x9fb0c8 : 0x6d8aa8, 0.7));
      });

      function update(t) {
        const ang = ang0 + 0.024 * Math.sin(t * 0.8);
        pivot.rotation.z = ang;
        dimPivot.rotation.z = ang;
        const c = Math.cos(ang), s = Math.sin(ang);

        const handP = new V3(px + L1 * c, py + L1 * s, 0);
        const tipP = new V3(px + L2 * c, py + L2 * s, 0);
        const fishP = new V3(tipP.x, tipP.y - 1.02, 0);

        fish.position.copy(fishP);
        fish.rotation.z = Math.sin(t * 1.6) * 0.08;
        fishLine.setPoints([tipP, new V3(fishP.x, fishP.y + 0.18, 0)]);
        cp.g.set(fishP.x, fishP.y - 0.62, 0);

        const F = P.G * L2 / L1;
        const len = clamp(0.5 + F / 640, 0.65, 1.7);
        handPad.position.set(handP.x, handP.y + 0.07, 0);
        handPad.rotation.z = ang;
        effort.set(new V3(handP.x, handP.y + 0.13, 0), new V3(0, 1, 0), len);
        cp.f1.set(handP.x, handP.y + 0.13 + len * 0.55, 0);

        const d = 0.4;
        function toWorld(x) {
          return new V3(px + x * c + d * s, py + x * s - d * c, 0.3);
        }
        const p1 = toWorld(L1 * 0.5);
        const p2 = toWorld((L1 + L2) * 0.5);
        cp.l1.set(p1.x, p1.y - 0.3, 0.3);
        cp.l2.set(p2.x, p2.y - 0.3, 0.3);
        cp.o.set(px - 0.34, py + 0.16, 0.34);
      }

      return { group: grp, update: update };
    }

    const rigs = { power: makePower(), equal: makeEqual(), effort: makeEffort() };
    g.add(rigs.power.group, rigs.equal.group, rigs.effort.group);
    rigs.power.group.visible = true;
    rigs.equal.group.visible = false;
    rigs.effort.group.visible = false;

    function readout() {
      const m = MODELS[mode];
      const F = P.G * m.L2 / m.L1;
      const ma = m.L1 / m.L2;
      const cls = ma > 1.04 ? 'power' : ma < 0.96 ? 'effort' : 'equal';
      return [
        { k: 'f1', v: F.toFixed(0), u: 'N', c: 'amber' },
        { k: 'ma', v: ma.toFixed(2), u: '', c: 'violet' },
        { k: 'l1', v: m.L1.toFixed(2), u: 'm', c: 'dim' },
        { k: 'l2', v: m.L2.toFixed(2), u: 'm', c: 'dim' },
        { k: 'cls', v: cls, c: 'text', wide: true }
      ];
    }

    const api = {
      group: g,
      params: P,
      camera: { theta: CAMS.power.theta, phi: CAMS.power.phi, radius: CAMS.power.radius, target: CAMS.power.target.clone() },
      chips: [
        chipDef('支点 O', 'Fulcrum O', 'PIVOT', null, '#9fb0c8', () => CP.power.o, { small: true, visible: () => mode === 'power' }),
        chipDef('动力 F₁', 'Effort F₁', 'EFFORT', () => (P.G * MODELS.power.L2 / MODELS.power.L1).toFixed(0) + ' N', '#ffb347', () => CP.power.f1, { visible: () => mode === 'power' }),
        chipDef('阻力 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.power.g, { visible: () => mode === 'power' }),
        chipDef('动力臂 L₁', 'Effort arm L₁', 'ARM', () => MODELS.power.L1.toFixed(2) + ' m', '#a48bff', () => CP.power.l1, { small: true, visible: () => mode === 'power' }),
        chipDef('阻力臂 L₂', 'Load arm L₂', 'ARM', () => MODELS.power.L2.toFixed(2) + ' m', '#a48bff', () => CP.power.l2, { small: true, visible: () => mode === 'power' }),

        chipDef('支点 O', 'Fulcrum O', 'PIVOT', null, '#9fb0c8', () => CP.equal.o, { small: true, visible: () => mode === 'equal' }),
        chipDef('动力 F₁', 'Effort F₁', 'EFFORT', () => P.G.toFixed(0) + ' N', '#ffb347', () => CP.equal.f1, { visible: () => mode === 'equal' }),
        chipDef('阻力 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.equal.g, { visible: () => mode === 'equal' }),
        chipDef('动力臂 L₁', 'Effort arm L₁', 'ARM', () => MODELS.equal.L1.toFixed(2) + ' m', '#a48bff', () => CP.equal.l1, { small: true, visible: () => mode === 'equal' }),
        chipDef('阻力臂 L₂', 'Load arm L₂', 'ARM', () => MODELS.equal.L2.toFixed(2) + ' m', '#a48bff', () => CP.equal.l2, { small: true, visible: () => mode === 'equal' }),

        chipDef('支点 O', 'Fulcrum O', 'PIVOT', null, '#9fb0c8', () => CP.effort.o, { small: true, visible: () => mode === 'effort' }),
        chipDef('动力 F₁', 'Effort F₁', 'EFFORT', () => (P.G * MODELS.effort.L2 / MODELS.effort.L1).toFixed(0) + ' N', '#ffb347', () => CP.effort.f1, { visible: () => mode === 'effort' }),
        chipDef('阻力 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.effort.g, { visible: () => mode === 'effort' }),
        chipDef('动力臂 L₁', 'Effort arm L₁', 'ARM', () => MODELS.effort.L1.toFixed(2) + ' m', '#a48bff', () => CP.effort.l1, { small: true, visible: () => mode === 'effort' }),
        chipDef('阻力臂 L₂', 'Load arm L₂', 'ARM', () => MODELS.effort.L2.toFixed(2) + ' m', '#a48bff', () => CP.effort.l2, { small: true, visible: () => mode === 'effort' })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        rigs.power.group.visible = key === 'power';
        rigs.equal.group.visible = key === 'equal';
        rigs.effort.group.visible = key === 'effort';
        const c = CAMS[key];
        api.camera.theta = c.theta;
        api.camera.phi = c.phi;
        api.camera.radius = c.radius;
        api.camera.target.copy(c.target);
      },
      update: function (t) { rigs[mode].update(t); },
      readout: readout
    };

    return api;
  }

  /* ============================================================
     2. PULLEY — four systems, rope-by-rope force analysis
     ============================================================ */
  function buildPulley() {
    const g = new THREE.Group();
    const P = { G: 300 };
    const CEIL = 4.0;
    const RW = 0.45;
    let mode = 'block3';

    const N_OF = { fixed: 1, movable: 2, block3: 3, block4: 4 };

    const CP = {
      fixed: { f: new V3(), g: new V3(), bal: new V3(), title: new V3() },
      movable: { f: new V3(), g: new V3(), bal: new V3(), title: new V3() },
      block3: { f: new V3(), g: new V3(), bal: new V3(), title: new V3() },
      block4: { f: new V3(), g: new V3(), bal: new V3(), title: new V3() }
    };

    const postMat = mat(0x51637d, { metalness: 0.9, roughness: 0.34 });
    const beamMat = mat(0x46586f, { metalness: 0.88, roughness: 0.36 });
    const boxMat = mat(0x0d7f99, { metalness: 0.5, roughness: 0.4, emissive: 0x06414f, emissiveIntensity: 0.9 });
    const wheelMat = mat(0x546a88, { metalness: 0.92, roughness: 0.3 });
    const rimMat = mat(0x9db3cf, { metalness: 1, roughness: 0.24 });
    const hubMat = mat(0xd2e0f2, { metalness: 1, roughness: 0.2 });

    function pulleyWheel(r) {
      const w = new THREE.Group();
      const disc = mesh(new THREE.CylinderGeometry(r, r, 0.15, 40), wheelMat, 0, 0, 0);
      disc.rotation.x = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.032, 8, 44), rimMat);
      const hub = mesh(new THREE.CylinderGeometry(r * 0.24, r * 0.24, 0.26, 20), hubMat, 0, 0, 0);
      hub.rotation.x = Math.PI / 2;
      w.add(disc, rim, hub);
      return w;
    }

    function frame(x0, x1) {
      const grp = new THREE.Group();
      [x0, x1].forEach(function (px) {
        const post = mesh(new THREE.BoxGeometry(0.16, CEIL, 0.16), postMat, px, CEIL / 2, 0);
        addEdges(post, 0x9fc0e8, 0.28);
        const foot = mesh(new THREE.BoxGeometry(0.58, 0.1, 0.58), mat(0x1a2534, { metalness: 0.4, roughness: 0.7 }), px, 0.05, 0);
        grp.add(post, foot);
      });
      const beam = mesh(new THREE.BoxGeometry(Math.abs(x1 - x0) + 0.18, 0.15, 0.22), beamMat, (x0 + x1) / 2, CEIL, 0);
      addEdges(beam, 0x9fc0e8, 0.28);
      grp.add(beam);
      return grp;
    }

    function bracket(x, y) {
      return mesh(new THREE.BoxGeometry(0.07, CEIL - y, 0.07), postMat, x, (CEIL + y) / 2, 0);
    }

    function arc(cx, cy, r, a0, a1, n) {
      const pts = [];
      for (let i = 1; i <= n; i++) {
        const a = a0 + (a1 - a0) * (i / n);
        pts.push(new V3(cx + r * Math.cos(a), cy + r * Math.sin(a), 0));
      }
      return pts;
    }

    function makeLoad(w) {
      const grp = new THREE.Group();
      const b = mesh(new THREE.BoxGeometry(w, w, w), boxMat, 0, 0, 0);
      addEdges(b, 0x7ff0ff, 0.4);
      grp.add(b);
      return grp;
    }

    function makeHand(parent, color) {
      const grip = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.028, 8, 20), mat(color, { metalness: 0.5, roughness: 0.4, emissive: 0x8a5200, emissiveIntensity: 0.4 }));
      grip.rotation.x = Math.PI / 2;
      const arrow = new Arrow(0xffb347, { radius: 0.032, headRadius: 0.1, headLen: 0.22 });
      parent.add(grip, arrow.group);
      return { grip: grip, arrow: arrow };
    }

    /* ================= A. fixed pulley (n = 1) ================= */
    const rigFixed = new THREE.Group();
    rigFixed.add(frame(-1.45, 1.7));
    const fWheel = pulleyWheel(RW);
    fWheel.position.set(0, 3.0, 0);
    rigFixed.add(fWheel, bracket(0, 3.0));
    const fLoad = makeLoad(0.56);
    rigFixed.add(fLoad);
    const fRope = new Rope(26, 0.034, 0xe3d3b0);
    rigFixed.add(fRope.group);
    const fHand = makeHand(rigFixed, 0xffb347);
    const fT = new Arrow(0xffb347, { radius: 0.024, headRadius: 0.07, headLen: 0.15 });
    rigFixed.add(fT.group);
    g.add(rigFixed);

    /* ================= B. movable pulley (n = 2) ================= */
    const rigMov = new THREE.Group();
    rigMov.add(frame(-2.3, 2.35));
    const anchor = mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), postMat, -0.35, CEIL - 0.06, 0);
    rigMov.add(anchor);
    const mFixed = pulleyWheel(RW);
    mFixed.position.set(1.0, 3.0, 0);
    rigMov.add(mFixed, bracket(1.0, 3.0));

    const movB = new THREE.Group();
    movB.position.set(0.1, 1.95, 0);
    const mWheel = pulleyWheel(RW);
    movB.add(mWheel);
    const mHook = mesh(new THREE.BoxGeometry(0.05, 0.2, 0.05), mat(0xa8bcd8, { metalness: 0.9, roughness: 0.3 }), 0, -0.52, 0);
    movB.add(mHook);
    const mLoad = makeLoad(0.56);
    mLoad.position.set(0, -0.86, 0);
    movB.add(mLoad);
    rigMov.add(movB);

    const mRope = new Rope(34, 0.034, 0xe3d3b0);
    rigMov.add(mRope.group);
    const mHand = makeHand(rigMov, 0xffb347);
    const mT1 = new Arrow(0xffb347, { radius: 0.024, headRadius: 0.07, headLen: 0.15 });
    const mT2 = new Arrow(0xffb347, { radius: 0.024, headRadius: 0.07, headLen: 0.15 });
    rigMov.add(mT1.group, mT2.group);
    g.add(rigMov);

    /* ================= C. block & tackle, n = 3 ================= */
    const rig3 = new THREE.Group();
    rig3.add(frame(-1.95, 2.35));
    const a3 = pulleyWheel(RW);
    a3.position.set(0, 3.45, 0);
    const b3 = pulleyWheel(RW);
    b3.position.set(0.9, 3.45, 0);
    rig3.add(a3, bracket(0, 3.45), b3, bracket(0.9, 3.45));

    const mov3 = new THREE.Group();
    mov3.position.set(0, 1.6, 0);
    const w3 = pulleyWheel(RW);
    mov3.add(w3);
    const tie3 = mesh(new THREE.BoxGeometry(0.22, 0.09, 0.14), mat(0xa8bcd8, { metalness: 0.9, roughness: 0.3 }), 0, 0.52, 0);
    const yoke3 = mesh(new THREE.BoxGeometry(0.05, 0.2, 0.05), mat(0xa8bcd8, { metalness: 0.9, roughness: 0.3 }), 0, -0.52, 0);
    const load3 = makeLoad(0.56);
    load3.position.set(0, -0.86, 0);
    mov3.add(tie3, yoke3, load3);
    rig3.add(mov3);

    const rope3 = new Rope(44, 0.034, 0xe3d3b0);
    rig3.add(rope3.group);
    const hand3 = makeHand(rig3, 0xffb347);
    const t3a = new Arrow(0xffb347, { radius: 0.024, headRadius: 0.07, headLen: 0.15 });
    const t3b = new Arrow(0xffb347, { radius: 0.024, headRadius: 0.07, headLen: 0.15 });
    const t3c = new Arrow(0xffb347, { radius: 0.024, headRadius: 0.07, headLen: 0.15 });
    rig3.add(t3a.group, t3b.group, t3c.group);
    g.add(rig3);

    /* ================= D. block & tackle, n = 4 ================= */
    const rig4 = new THREE.Group();
    rig4.add(frame(-2.9, 3.2));
    const fa = pulleyWheel(RW);
    fa.position.set(0, 3.35, 0);
    const fb = pulleyWheel(RW);
    fb.position.set(1.8, 3.35, 0);
    rig4.add(fa, bracket(0, 3.35), fb, bracket(1.8, 3.35));
    const anchor4 = mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), postMat, -1.35, CEIL - 0.06, 0);
    rig4.add(anchor4);

    const mov4 = new THREE.Group();
    mov4.position.set(0, 1.85, 0);
    const m4a = pulleyWheel(RW);
    m4a.position.set(-0.9, 0, 0);
    const m4b = pulleyWheel(RW);
    m4b.position.set(0.9, 0, 0);
    const bar4 = mesh(new THREE.BoxGeometry(1.98, 0.09, 0.13), mat(0xa8bcd8, { metalness: 0.9, roughness: 0.3 }), 0, -0.56, 0);
    addEdges(bar4, 0xd7e6f8, 0.3);
    const hang4a = mesh(new THREE.BoxGeometry(0.05, 0.24, 0.05), mat(0xa8bcd8, { metalness: 0.9, roughness: 0.3 }), -0.9, -0.44, 0);
    const hang4b = mesh(new THREE.BoxGeometry(0.05, 0.24, 0.05), mat(0xa8bcd8, { metalness: 0.9, roughness: 0.3 }), 0.9, -0.44, 0);
    const load4 = makeLoad(0.56);
    load4.position.set(0, -0.86, 0);
    mov4.add(m4a, m4b, bar4, hang4a, hang4b, load4);
    rig4.add(mov4);

    const rope4 = new Rope(56, 0.034, 0xe3d3b0);
    rig4.add(rope4.group);
    const hand4 = makeHand(rig4, 0xffb347);
    const t4 = [];
    for (let i = 0; i < 4; i++) {
      const a = new Arrow(0xffb347, { radius: 0.024, headRadius: 0.07, headLen: 0.15 });
      t4.push(a);
      rig4.add(a.group);
    }
    g.add(rig4);

    /* ---------------- animation ---------------- */
    function tension(arrow, x, yMid, len) {
      arrow.set(new V3(x, yMid - len * 0.5, 0.13), new V3(0, 1, 0), len);
    }

    function update(t) {
      const n = N_OF[mode];
      const F = P.G / n;
      const len = clamp(0.4 + F / 620, 0.5, 1.35);

      if (mode === 'fixed') {
        const dy = 0.34 * Math.sin(t * 0.8);
        const loadTop = 1.92 + dy;
        const handY = 1.55 - dy;
        fLoad.position.set(-RW, loadTop - 0.28, 0);
        fRope.setPoints([
          new V3(-RW, loadTop, 0),
          new V3(-RW, 3.0, 0),
          ...arc(0, 3.0, RW, Math.PI, 0, 14),
          new V3(RW, handY, 0)
        ]);
        fWheel.rotation.z = -dy / RW;
        fHand.grip.position.set(RW, handY, 0);
        fHand.arrow.set(new V3(RW, handY + 0.1 + len, 0), new V3(0, -1, 0), len);
        tension(fT, -RW, (loadTop + 2.55) / 2 + 0.04, 0.44);
        CP.fixed.g.set(-RW, loadTop - 1.02, 0);
        CP.fixed.f.set(RW, handY + 0.1 + len * 0.55, 0);
        CP.fixed.bal.set(1.42, 2.62, 0);
        CP.fixed.title.set(0, CEIL + 0.42, 0);
      } else if (mode === 'movable') {
        const dy = 0.3 * Math.sin(t * 0.8);
        const mY = 1.95 + dy;
        const handY = 1.5 - 2 * dy;
        movB.position.y = mY;
        mRope.setPoints([
          new V3(-0.35, CEIL, 0),
          new V3(-0.35, mY, 0),
          ...arc(0.1, mY, RW, Math.PI, Math.PI * 2, 16),
          new V3(0.55, mY, 0),
          new V3(0.55, 3.0, 0),
          ...arc(1.0, 3.0, RW, Math.PI, 0, 14),
          new V3(1.45, handY, 0)
        ]);
        mWheel.rotation.z = 2 * dy / RW;
        mFixed.rotation.z = -2 * dy / RW;
        mHand.grip.position.set(1.45, handY, 0);
        mHand.arrow.set(new V3(1.45, handY + 0.1 + len, 0), new V3(0, -1, 0), len);
        tension(mT1, -0.35, mY + 0.62, 0.5);
        tension(mT2, 0.55, mY + 0.62, 0.5);
        CP.movable.g.set(-0.82, mY - 0.92, 0);
        CP.movable.f.set(1.45, handY + 0.1 + len * 0.55, 0);
        CP.movable.bal.set(2.0, 2.6, 0);
        CP.movable.title.set(0.55, CEIL + 0.42, 0);
      } else if (mode === 'block3') {
        const dy = 0.26 * Math.sin(t * 0.8);
        const mY = 1.6 + dy;
        const handY = 1.3 - 3 * dy;
        mov3.position.y = mY;
        rope3.setPoints([
          new V3(0, mY + 0.56, 0),
          new V3(0, 3.0, 0),
          ...arc(0, 3.45, RW, -Math.PI / 2, -Math.PI, 10),
          new V3(-RW, mY, 0),
          ...arc(0, mY, RW, Math.PI, Math.PI * 2, 16),
          new V3(RW, mY, 0),
          new V3(RW, 3.45, 0),
          ...arc(0.9, 3.45, RW, Math.PI, 0, 12),
          new V3(1.35, handY, 0)
        ]);
        w3.rotation.z = 2 * dy / RW;
        a3.rotation.z = dy / RW;
        b3.rotation.z = -dy / RW;
        hand3.grip.position.set(1.35, handY, 0);
        hand3.arrow.set(new V3(1.35, handY + 0.1 + len, 0), new V3(0, -1, 0), len);
        tension(t3a, 0, mY + 0.62, 0.38);
        tension(t3b, -RW, mY + 0.85, 0.42);
        tension(t3c, RW, mY + 0.85, 0.42);
        CP.block3.g.set(-0.92, mY - 0.95, 0);
        CP.block3.f.set(1.35, handY + 0.1 + len * 0.55, 0);
        CP.block3.bal.set(-1.28, 2.5, 0);
        CP.block3.title.set(0.45, CEIL + 0.42, 0);
      } else {
        const dy = 0.22 * Math.sin(t * 0.8);
        const mY = 1.85 + dy;
        const handY = 1.42 - 4 * dy;
        mov4.position.y = mY;
        rope4.setPoints([
          new V3(-1.35, CEIL, 0),
          new V3(-1.35, mY, 0),
          ...arc(-0.9, mY, RW, Math.PI, Math.PI * 2, 16),
          new V3(-0.45, mY, 0),
          new V3(-0.45, 3.35, 0),
          ...arc(0, 3.35, RW, Math.PI, 0, 12),
          new V3(0.45, 3.35, 0),
          new V3(0.45, mY, 0),
          ...arc(0.9, mY, RW, Math.PI, Math.PI * 2, 16),
          new V3(1.35, mY, 0),
          new V3(1.35, 3.35, 0),
          ...arc(1.8, 3.35, RW, Math.PI, 0, 12),
          new V3(2.25, handY, 0)
        ]);
        m4a.rotation.z = 2 * dy / RW;
        m4b.rotation.z = 2 * dy / RW;
        fa.rotation.z = -dy / RW;
        fb.rotation.z = -dy / RW;
        hand4.grip.position.set(2.25, handY, 0);
        hand4.arrow.set(new V3(2.25, handY + 0.1 + len, 0), new V3(0, -1, 0), len);
        [-1.35, -0.45, 0.45, 1.35].forEach(function (x, i) {
          tension(t4[i], x, mY + 0.78, 0.5);
        });
        CP.block4.g.set(0, mY - 1.42, 0);
        CP.block4.f.set(2.25, handY + 0.1 + len * 0.55, 0);
        CP.block4.bal.set(-2.1, 2.55, 0);
        CP.block4.title.set(0.95, CEIL + 0.42, 0);
      }
    }

    function readout() {
      const n = N_OF[mode];
      return [
        { k: 'load', v: P.G.toFixed(0), u: 'N', c: 'cyan' },
        { k: 'f', v: (P.G / n).toFixed(0), u: 'N', c: 'amber' },
        { k: 'n', v: String(n), u: '', c: 'violet' },
        { k: 'save', v: (100 * (1 - 1 / n)).toFixed(0), u: '%', c: 'dim' },
        { k: 'note', v: 'F = G / ' + n, c: 'text', wide: true }
      ];
    }

    const CAMS = {
      fixed: { theta: 0.28, phi: 1.14, radius: 7.3, target: new V3(0.02, 2.0, 0) },
      movable: { theta: 0.34, phi: 1.13, radius: 9.8, target: new V3(0.4, 1.95, 0) },
      block3: { theta: 0.3, phi: 1.12, radius: 9.0, target: new V3(0.38, 1.9, 0) },
      block4: { theta: 0.3, phi: 1.13, radius: 11.2, target: new V3(0.34, 1.92, 0) }
    };

    function balText(n) { return (n === 1 ? 'F = ' : n + 'F = ') + P.G.toFixed(0) + ' N'; }

    const api = {
      group: g,
      params: P,
      camera: { theta: CAMS.block3.theta, phi: CAMS.block3.phi, radius: CAMS.block3.radius, target: CAMS.block3.target.clone() },
      chips: [
        chipDef('定滑轮', 'Fixed pulley', 'AXLE FIXED', null, '#3fd6f2', () => CP.fixed.title, { title: true, visible: () => mode === 'fixed' }),
        chipDef('动滑轮', 'Movable pulley', 'AXLE MOVES', null, '#3fd6f2', () => CP.movable.title, { title: true, visible: () => mode === 'movable' }),
        chipDef('滑轮组 n=3', 'Block & tackle n=3', '3 ROPE SEGMENTS', null, '#3fd6f2', () => CP.block3.title, { title: true, visible: () => mode === 'block3' }),
        chipDef('滑轮组 n=4', 'Block & tackle n=4', '4 ROPE SEGMENTS', null, '#3fd6f2', () => CP.block4.title, { title: true, visible: () => mode === 'block4' }),

        chipDef('拉力 F', 'Effort F', 'F = G / 1', () => P.G.toFixed(0) + ' N', '#ffb347', () => CP.fixed.f, { visible: () => mode === 'fixed' }),
        chipDef('拉力 F', 'Effort F', 'F = G / 2', () => (P.G / 2).toFixed(0) + ' N', '#ffb347', () => CP.movable.f, { visible: () => mode === 'movable' }),
        chipDef('拉力 F', 'Effort F', 'F = G / 3', () => (P.G / 3).toFixed(0) + ' N', '#ffb347', () => CP.block3.f, { visible: () => mode === 'block3' }),
        chipDef('拉力 F', 'Effort F', 'F = G / 4', () => (P.G / 4).toFixed(0) + ' N', '#ffb347', () => CP.block4.f, { visible: () => mode === 'block4' }),

        chipDef('物重 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.fixed.g, { small: true, visible: () => mode === 'fixed' }),
        chipDef('物重 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.movable.g, { small: true, visible: () => mode === 'movable' }),
        chipDef('物重 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.block3.g, { small: true, visible: () => mode === 'block3' }),
        chipDef('物重 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.block4.g, { small: true, visible: () => mode === 'block4' }),

        chipDef('受力平衡', 'Force balance', 'BALANCE', () => balText(1), '#a48bff', () => CP.fixed.bal, { small: true, visible: () => mode === 'fixed' }),
        chipDef('受力平衡', 'Force balance', 'BALANCE', () => balText(2), '#a48bff', () => CP.movable.bal, { small: true, visible: () => mode === 'movable' }),
        chipDef('受力平衡', 'Force balance', 'BALANCE', () => balText(3), '#a48bff', () => CP.block3.bal, { small: true, visible: () => mode === 'block3' }),
        chipDef('受力平衡', 'Force balance', 'BALANCE', () => balText(4), '#a48bff', () => CP.block4.bal, { small: true, visible: () => mode === 'block4' })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        mode = key;
        rigFixed.visible = key === 'fixed';
        rigMov.visible = key === 'movable';
        rig3.visible = key === 'block3';
        rig4.visible = key === 'block4';
        const c = CAMS[key] || CAMS.block3;
        api.camera.theta = c.theta;
        api.camera.phi = c.phi;
        api.camera.radius = c.radius;
        api.camera.target.copy(c.target);
      },
      update: update,
      readout: readout
    };

    return api;
  }

  /* ============================================================
     3. WHEEL & AXLE
     ============================================================ */
  function buildWheel() {
    const g = new THREE.Group();
    const P = { R: 1.2, r: 0.3, G: 120 };
    const axleY = 2.6;
    const wheelZ = -1.0;
    const R0 = 1.2;

    g.add(glowDisc(4.2, 0x3fd6f2, 0.12));

    const postMat = mat(0x4f6179, { metalness: 0.9, roughness: 0.34 });
    [-1.35, 1.35].forEach(function (z) {
      const post = mesh(new THREE.BoxGeometry(0.17, 3.7, 0.17), postMat, 0, 1.85, z);
      addEdges(post, 0x9fc0e8, 0.25);
      const foot = mesh(new THREE.BoxGeometry(0.62, 0.1, 0.62), mat(0x1a2534, { metalness: 0.4, roughness: 0.7 }), 0, 0.05, z);
      const cap = mesh(new THREE.BoxGeometry(0.26, 0.08, 0.26), mat(0x7d90aa, { metalness: 0.9, roughness: 0.3 }), 0, 3.72, z);
      g.add(post, foot, cap);
    });

    const axle = mesh(new THREE.CylinderGeometry(P.r, P.r, 2.75, 28), mat(0x8a9db8, { metalness: 1, roughness: 0.26 }), 0, axleY, 0);
    axle.rotation.x = Math.PI / 2;
    g.add(axle);

    const wheel = new THREE.Group();
    wheel.position.set(0, axleY, wheelZ);
    g.add(wheel);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(R0, 0.062, 10, 64), mat(0x9db3cf, { metalness: 1, roughness: 0.22 }));
    wheel.add(rim);

    const rim2 = new THREE.Mesh(new THREE.TorusGeometry(R0 - 0.1, 0.03, 8, 56), mat(0x6d84a3, { metalness: 0.95, roughness: 0.3 }));
    wheel.add(rim2);

    const hub = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.34, 20), mat(0xd2e0f2, { metalness: 1, roughness: 0.2 }), 0, 0, 0);
    hub.rotation.x = Math.PI / 2;
    wheel.add(hub);

    for (let i = 0; i < 8; i++) {
      const holder = new THREE.Group();
      holder.rotation.z = (i / 8) * Math.PI * 2;
      const spoke = mesh(new THREE.CylinderGeometry(0.026, 0.026, R0 - 0.12, 8), mat(0x8ba1bd, { metalness: 0.9, roughness: 0.3 }), 0, (R0 - 0.12) / 2, 0);
      holder.add(spoke);
      wheel.add(holder);
    }

    // crank handle
    const crank = new THREE.Group();
    wheel.add(crank);
    const arm = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 10), mat(0xc9d8ea, { metalness: 0.95, roughness: 0.24 }), 0, R0, 0.16);
    arm.rotation.x = Math.PI / 2;
    const grip = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.34, 14), mat(0xffb347, { metalness: 0.4, roughness: 0.45, emissive: 0x8a5200, emissiveIntensity: 0.4 }), 0, R0, 0.34);
    crank.add(arm, grip);

    // effort arrow (child of wheel → sweeps with crank)
    const effort = new Arrow(0xffb347, { radius: 0.032, headRadius: 0.1, headLen: 0.22 });
    effort.group.position.set(0, R0, 0.34);
    effort.group.quaternion.setFromUnitVectors(UP, new V3(1, 0, 0));
    effort.shaft.scale.set(1, 0.8, 1);
    effort.shaft.position.set(0, 0.4, 0);
    effort.head.position.set(0, 0.9, 0);
    wheel.add(effort.group);

    // rope + bucket
    const rope = new Rope(12, 0.026);
    g.add(rope.group);
    const bucket = new THREE.Group();
    const body = mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.42, 24, 1, true), mat(0x8a6a45, { metalness: 0.5, roughness: 0.55, side: THREE.DoubleSide }), 0, 0, 0);
    const bottom = mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.03, 24), mat(0x6d5334, { metalness: 0.5, roughness: 0.6 }), 0, -0.21, 0);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.016, 6, 30), mat(0xb9c9dd, { metalness: 1, roughness: 0.3 }));
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.16;
    const bail = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.014, 6, 24, Math.PI), mat(0xb9c9dd, { metalness: 1, roughness: 0.3 }));
    bail.position.y = 0.24;
    bucket.add(body, bottom, band, bail);
    g.add(bucket);

    const CP = {
      f: new V3(),
      g: new V3(),
      R: new V3(-P.R * 0.72, axleY + P.R * 0.7, wheelZ),
      r: new V3(0.42, axleY + P.r + 0.06, 0)
    };

    const dimGroup = new THREE.Group();
    g.add(dimGroup);

    function rebuildDims() {
      clearGroup(dimGroup);
      const a = 140 * D2R;
      const rimPt = new V3(Math.cos(a) * P.R, axleY + Math.sin(a) * P.R, wheelZ);
      dimGroup.add(lineSeg(new V3(0, axleY, wheelZ), rimPt, 0xa48bff, 0.85, false));
      dimGroup.add(lineSeg(new V3(0, axleY, wheelZ), new V3(0, axleY + P.r, 0), 0xa48bff, 0.85, false));
      CP.R.set(Math.cos(a) * P.R * 0.55, axleY + Math.sin(a) * P.R * 0.55, wheelZ);
      CP.r.set(0.36, axleY + P.r * 0.5, 0);
    }
    rebuildDims();

    let angle = 0;

    function update(t) {
      const cyc = 9;
      const p = (t % cyc) / cyc;
      let k;
      if (p < 0.46) k = easeInOut(p / 0.46);
      else if (p < 0.54) k = 1;
      else k = 1 - easeInOut((p - 0.54) / 0.46);

      const rise = 1.15 * k;
      angle = rise / P.r;
      wheel.rotation.z = -angle;

      const bucketY = 0.72 + rise;
      bucket.position.set(0, bucketY, 0);
      rope.setPoints([new V3(0, axleY - P.r, 0), new V3(0, bucketY + 0.28, 0)]);
      CP.g.set(0.95, bucketY, 0);

      const a = wheel.rotation.z;
      const rr = P.R + 0.5;
      CP.f.set(-Math.sin(a) * rr, axleY + Math.cos(a) * rr, wheelZ + 0.34);
    }

    function readout() {
      return [
        { k: 'f', v: (P.G * P.r / P.R).toFixed(0), u: 'N', c: 'amber' },
        { k: 'ma', v: (P.R / P.r).toFixed(2), u: '', c: 'violet' },
        { k: 'R', v: P.R.toFixed(2), u: 'm', c: 'dim' },
        { k: 'r', v: P.r.toFixed(2), u: 'm', c: 'dim' },
        { k: 'note', v: 'R/r', c: 'text', wide: true }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.52, phi: 1.08, radius: 9.6, target: new V3(0, 2.0, 0) },
      chips: [
        chipDef('动力 F', 'Effort F', 'F = G·r/R', () => (P.G * P.r / P.R).toFixed(0) + ' N', '#ffb347', () => CP.f),
        chipDef('物重 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.g),
        chipDef('轮半径 R', 'Wheel radius R', 'EFFORT ARM', () => P.R.toFixed(2) + ' m', '#a48bff', () => CP.R, { small: true }),
        chipDef('轴半径 r', 'Axle radius r', 'LOAD ARM', () => P.r.toFixed(2) + ' m', '#a48bff', () => CP.r, { small: true })
      ],
      setParam: function (k, v) {
        P[k] = v;
        if (k === 'R') {
          wheel.scale.setScalar(P.R / R0);
          rebuildDims();
        }
      },
      setVariant: function (key) {
        P.R = key === 'big' ? 1.42 : key === 'small' ? 0.92 : 1.2;
        wheel.scale.setScalar(P.R / R0);
        rebuildDims();
      },
      update: update,
      readout: readout
    };
  }

  /* ============================================================
     4. INCLINED PLANE
     ============================================================ */
  function buildIncline() {
    const g = new THREE.Group();
    const P = { angle: 24, G: 100, L: 5.0 };
    let H = P.L * Math.tan(P.angle * D2R);

    g.add(glowDisc(4.4, 0x3fd6f2, 0.1));

    const wedgeMat = mat(0x2c3746, { metalness: 0.05, roughness: 0.95 });
    let wedgeMesh = null;

    function wedgeGeo(L, h) {
      const s = new THREE.Shape();
      s.moveTo(0, 0); s.lineTo(L, 0); s.lineTo(L, h); s.lineTo(0, 0);
      const geo = new THREE.ExtrudeGeometry(s, { depth: 1.9, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 1 });
      geo.translate(-L / 2, 0, -0.95);
      return geo;
    }

    function rebuildWedge() {
      if (wedgeMesh) { g.remove(wedgeMesh); disposeTree(wedgeMesh); }
      wedgeMesh = mesh(wedgeGeo(P.L, H), wedgeMat, 0, 0, 0);
      addEdges(wedgeMesh, 0xa9c6e8, 0.55);
      g.add(wedgeMesh);
    }
    rebuildWedge();

    const baseSlab = mesh(new THREE.BoxGeometry(P.L + 0.9, 0.1, 2.3), mat(0x0a111a, { metalness: 0.3, roughness: 0.85 }), 0, 0.05, 0);
    addEdges(baseSlab, 0x2b4159, 0.5);
    g.add(baseSlab);

    const block = new THREE.Group();
    const blockMesh = mesh(new THREE.BoxGeometry(0.76, 0.76, 0.76), mat(0x0d7f99, { metalness: 0.5, roughness: 0.4, emissive: 0x06414f, emissiveIntensity: 0.85 }), 0, 0, 0);
    addEdges(blockMesh, 0x7ff0ff, 0.4);
    block.add(blockMesh);
    g.add(block);

    const aG = new Arrow(0x3fd6f2, { radius: 0.03, headRadius: 0.095, headLen: 0.22, overlay: true });
    const aN = new Arrow(0x6fa8ff, { radius: 0.03, headRadius: 0.095, headLen: 0.22, overlay: true });
    const aF = new Arrow(0xffb347, { radius: 0.032, headRadius: 0.1, headLen: 0.22, overlay: true });
    g.add(aG.group, aN.group, aF.group);

    const dims = new THREE.Group();
    g.add(dims);

    const CP = {
      f: new V3(), g: new V3(), n: new V3(), h: new V3(), s: new V3()
    };

    function rebuildDims() {
      clearGroup(dims);
      const xH = P.L / 2 + 0.62;
      dims.add(lineSeg(new V3(xH, 0, 0), new V3(xH, H, 0), 0xa48bff, 0.8, true));
      dims.add(lineSeg(new V3(xH - 0.16, 0, 0), new V3(xH + 0.16, 0, 0), 0xa48bff, 0.8, false));
      dims.add(lineSeg(new V3(xH - 0.16, H, 0), new V3(xH + 0.16, H, 0), 0xa48bff, 0.8, false));
      dims.add(lineSeg(new V3(-P.L / 2, 0.02, 1.16), new V3(P.L / 2, 0.02, 1.16), 0xa48bff, 0.75, true));
      dims.add(lineSeg(new V3(-P.L / 2, 0.02, 1.0), new V3(-P.L / 2, 0.02, 1.32), 0xa48bff, 0.75, false));
      dims.add(lineSeg(new V3(P.L / 2, 0.02, 1.0), new V3(P.L / 2, 0.02, 1.32), 0xa48bff, 0.75, false));

      const arcR = 0.9;
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const a = (P.angle * D2R) * (i / 20);
        pts.push(new V3(-P.L / 2 + Math.cos(a) * arcR, Math.sin(a) * arcR, 0.02));
      }
      const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.85 }));
      dims.add(arc);

      CP.h.set(xH + 0.05, H * 0.5, 0);
      CP.s.set(P.L * 0.3, 0.2, 1.16);
    }

    rebuildDims();

    function update(t) {
      const cyc = 8.2;
      const p = (t % cyc) / cyc;
      let k;
      if (p < 0.44) k = easeInOut(p / 0.44);
      else if (p < 0.54) k = 1;
      else k = 1 - easeInOut((p - 0.54) / 0.46);

      const s = 0.85 + (P.L - 1.95) * k;
      const th = P.angle * D2R;
      const u = new V3(Math.cos(th), Math.sin(th), 0);
      const n = new V3(-Math.sin(th), Math.cos(th), 0);
      const surf = new V3(-P.L / 2 + s * Math.cos(th), s * Math.sin(th), 0);
      const center = surf.clone().addScaledVector(n, 0.4);

      block.position.copy(center);
      block.rotation.z = th;

      const F = P.G * Math.sin(th);
      aG.set(center, new V3(0, -1, 0), 1.05);
      aN.set(center, n, 0.88);
      aF.set(center.clone().addScaledVector(n, 0.05), u, clamp(0.55 + F / 90, 0.7, 1.55));

      CP.g.set(center.x, center.y - 1.1, 0);
      CP.n.set(center.x + n.x * 0.95, center.y + n.y * 0.95, 0);
      CP.f.set(center.x + u.x * 1.0, center.y + u.y * 1.0, 0);
    }

    function readout() {
      return [
        { k: 'f', v: (P.G * Math.sin(P.angle * D2R)).toFixed(0), u: 'N', c: 'amber' },
        { k: 'ma', v: (P.L / H).toFixed(2), u: '', c: 'violet' },
        { k: 'len', v: P.L.toFixed(2), u: 'm', c: 'dim' },
        { k: 'h', v: H.toFixed(2), u: 'm', c: 'dim' },
        { k: 'note', v: P.angle.toFixed(0) + '°', c: 'text', wide: true }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.5, phi: 1.16, radius: 9.9, target: new V3(0, 0.95, 0) },
      chips: [
        chipDef('推力 F', 'Push F', 'F = G·h/s', () => (P.G * Math.sin(P.angle * D2R)).toFixed(0) + ' N', '#ffb347', () => CP.f),
        chipDef('重力 G', 'Weight G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.g),
        chipDef('支持力 N', 'Normal N', 'N = G·cosθ', () => (P.G * Math.cos(P.angle * D2R)).toFixed(0) + ' N', '#6fa8ff', () => CP.n, { small: true }),
        chipDef('高 h', 'Height h', 'RISE', () => H.toFixed(2) + ' m', '#a48bff', () => CP.h, { small: true }),
        chipDef('长 s', 'Length s', 'RUN', () => P.L.toFixed(2) + ' m', '#a48bff', () => CP.s, { small: true })
      ],
      setParam: function (k, v) {
        P[k] = v;
        if (k === 'angle') {
          H = P.L * Math.tan(P.angle * D2R);
          rebuildWedge();
          rebuildDims();
        }
      },
      setVariant: function (key) {
        P.angle = key === 'gentle' ? 16 : key === 'steep' ? 33 : 24;
        H = P.L * Math.tan(P.angle * D2R);
        rebuildWedge();
        rebuildDims();
      },
      update: update,
      readout: readout
    };
  }

  /* ============================================================
     5. SCREW
     ============================================================ */
  function buildScrew() {
    const g = new THREE.Group();
    const P = { p: 0.3, R: 0.85, G: 600 };
    const blockX = -0.55;
    const blockTop = 1.5;

    g.add(glowDisc(4.2, 0xffb347, 0.08));

    const baseSlab = mesh(new THREE.BoxGeometry(4.0, 0.1, 2.7), mat(0x0a111a, { metalness: 0.3, roughness: 0.85 }), blockX, 0.05, 0);
    addEdges(baseSlab, 0x2b4159, 0.5);
    g.add(baseSlab);

    const wood = mesh(new THREE.BoxGeometry(3.0, 1.5, 2.0), mat(C.wood, { metalness: 0.05, roughness: 0.92 }), blockX, 0.75, 0);
    addEdges(wood, 0xc79a6a, 0.18);
    g.add(wood);

    const grainMat = mat(0x5c3d24, { metalness: 0.02, roughness: 0.95 });
    [[-0.85, 2.2, 0.028], [-0.45, 2.5, 0.022], [-0.05, 2.0, 0.03], [0.38, 2.45, 0.024], [0.78, 2.1, 0.02]].forEach(function (gr) {
      const line = mesh(new THREE.BoxGeometry(gr[1], 0.005, gr[2]), grainMat, blockX, 1.503, gr[0], false);
      g.add(line);
      const line2 = mesh(new THREE.BoxGeometry(gr[1] * 0.72, 0.005, gr[2] * 0.8), grainMat, blockX - 0.2, 1.503, gr[0] + 0.09, false);
      g.add(line2);
    });

    // thread helix
    class Helix extends THREE.Curve {
      constructor(r, pitch, turns, y0) {
        super();
        this.r = r; this.pitch = pitch; this.turns = turns; this.y0 = y0;
      }
      getPoint(t, target) {
        const v = target || new V3();
        const a = t * this.turns * Math.PI * 2;
        return v.set(this.r * Math.cos(a), this.y0 + t * this.turns * this.pitch, this.r * Math.sin(a));
      }
    }

    const screw = new THREE.Group();
    screw.position.set(blockX, 3.5, 0);
    g.add(screw);

    const shaft = mesh(new THREE.CylinderGeometry(0.272, 0.272, 1.75, 28), mat(0x9aa9bd, { metalness: 1, roughness: 0.22 }), 0, -0.875, 0);
    screw.add(shaft);

    const tip = mesh(new THREE.ConeGeometry(0.272, 0.26, 28), mat(0xa9b8cc, { metalness: 1, roughness: 0.2 }), 0, -1.85, 0);
    tip.rotation.z = Math.PI;
    screw.add(tip);

    let thread = null;
    function rebuildThread() {
      if (thread) { screw.remove(thread); disposeTree(thread); }
      const vp = P.p * 0.55;
      const curve = new Helix(0.30, vp, 1.62 / vp, -1.72);
      thread = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 820, vp * 0.47, 8, false),
        mat(0xb9c9dd, { metalness: 0.95, roughness: 0.28, emissive: 0x2a3a52, emissiveIntensity: 0.4 })
      );
      screw.add(thread);
    }
    rebuildThread();

    const head = mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.16, 6), mat(0xc2d2e6, { metalness: 1, roughness: 0.2 }), 0, 0.08, 0);
    screw.add(head);

    const handle = new THREE.Group();
    screw.add(handle);
    const bar = mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.7, 12), mat(0xd6e2f0, { metalness: 1, roughness: 0.2 }), 0, 0.26, 0);
    bar.rotation.z = Math.PI / 2;
    handle.add(bar);
    const knob1 = mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.26, 14), mat(0xffb347, { metalness: 0.4, roughness: 0.45, emissive: 0x8a5200, emissiveIntensity: 0.4 }), 0, 0.26, 0);
    knob1.rotation.z = Math.PI / 2;
    knob1.position.x = 0.85;
    const knob2 = knob1.clone();
    knob2.position.x = -0.85;
    handle.add(knob1, knob2);

    const effort = new Arrow(0xffb347, { radius: 0.028, headRadius: 0.09, headLen: 0.2 });
    effort.group.position.set(P.R, 0.26, 0);
    effort.group.quaternion.setFromUnitVectors(UP, new V3(1, 0, 0));
    effort.shaft.scale.set(1, 0.72, 1);
    effort.shaft.position.set(0, 0.36, 0);
    effort.head.position.set(0, 0.82, 0);
    handle.add(effort.group);

    const CP = {
      f: new V3(),
      g: new V3(),
      p: new V3(blockX + 0.34, 2.55, 0),
    };

    let ang = 0;

    function update(t) {
      const cyc = 10;
      const q = ((t + 2.2) % cyc) / cyc;
      let k;
      if (q < 0.44) k = easeInOut(q / 0.44);
      else if (q < 0.54) k = 1;
      else k = 1 - easeInOut((q - 0.54) / 0.46);

      const depth = 0.85 * k;
      screw.position.y = 3.5 - depth;
      ang = (depth / P.p) * Math.PI * 2;
      handle.rotation.y = -ang;

      CP.f.set(blockX + Math.cos(ang) * (P.R + 0.34), screw.position.y + 0.62, Math.sin(ang) * (P.R + 0.34));
      CP.g.set(blockX - 1.66, 0.95, 0);
      CP.p.set(blockX + 0.36, 2.55, 0);
    }

    function readout() {
      return [
        { k: 'f', v: (P.G * P.p / (2 * Math.PI * P.R)).toFixed(1), u: 'N', c: 'amber' },
        { k: 'ma', v: (2 * Math.PI * P.R / P.p).toFixed(1), u: '', c: 'violet' },
        { k: 'p', v: (P.p * 100).toFixed(0), u: 'mm', c: 'dim' },
        { k: 'R', v: P.R.toFixed(2), u: 'm', c: 'dim' },
        { k: 'note', v: '2πR / p', c: 'text', wide: true }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.45, phi: 1.1, radius: 9.8, target: new V3(-0.5, 1.85, 0) },
      chips: [
        chipDef('动力 F', 'Effort F', 'F = G·p/2πR', () => (P.G * P.p / (2 * Math.PI * P.R)).toFixed(1) + ' N', '#ffb347', () => CP.f),
        chipDef('压力 G', 'Load G', 'LOAD', () => P.G.toFixed(0) + ' N', '#3fd6f2', () => CP.g),
        chipDef('螺距 p', 'Pitch p', 'PITCH', () => (P.p * 100).toFixed(0) + ' mm', '#a48bff', () => CP.p, { small: true })
      ],
      setParam: function (k, v) {
        P[k] = v;
        if (k === 'p') rebuildThread();
        if (k === 'R') {
          bar.scale.y = P.R / 0.85;
          knob1.position.x = P.R;
          knob2.position.x = -P.R;
          effort.group.position.x = P.R;
        }
      },
      setVariant: function (key) {
        P.p = key === 'coarse' ? 0.42 : key === 'fine' ? 0.2 : 0.3;
        rebuildThread();
      },
      update: update,
      readout: readout
    };
  }

  /* ============================================================
     6. WEDGE
     ============================================================ */
  function buildWedge() {
    const g = new THREE.Group();
    const P = { t: 0.5, L: 1.5, F: 200 };
    const logR = 0.66, logH = 1.5;

    g.add(glowDisc(3.4, 0xffb347, 0.08));

    const halfGeoA = new THREE.CylinderGeometry(logR, logR, logH, 36, 1, false, 0, Math.PI);
    const halfGeoB = new THREE.CylinderGeometry(logR, logR, logH, 36, 1, false, Math.PI, Math.PI);
    const woodMat = mat(C.wood, { metalness: 0.05, roughness: 0.92 });
    const halfA = mesh(halfGeoA, woodMat, 0, logH / 2, 0);
    const halfB = mesh(halfGeoB, woodMat, 0, logH / 2, 0);
    addEdges(halfA, 0xc79a6a, 0.16);
    addEdges(halfB, 0xc79a6a, 0.16);
    g.add(halfA, halfB);

    const wedge = new THREE.Group();
    g.add(wedge);

    let wedgeMesh = null;
    function rebuildWedge() {
      if (wedgeMesh) { wedge.remove(wedgeMesh); disposeTree(wedgeMesh); }
      const s = new THREE.Shape();
      s.moveTo(P.t / 2, 0); s.lineTo(-P.t / 2, 0); s.lineTo(0, -P.L); s.lineTo(P.t / 2, 0);
      const geo = new THREE.ExtrudeGeometry(s, { depth: 1.3, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 1 });
      geo.translate(0, 0, -0.65);
      wedgeMesh = mesh(geo, mat(0x9db0c8, { metalness: 0.8, roughness: 0.28, emissive: 0x1e2a3a, emissiveIntensity: 0.9 }), 0, 0, 0);
      addEdges(wedgeMesh, 0xd6e6fa, 0.3);
      wedge.add(wedgeMesh);
    }
    rebuildWedge();

    const effort = new Arrow(0xffb347, { radius: 0.034, headRadius: 0.11, headLen: 0.24 });
    g.add(effort.group);

    const nA = new Arrow(0x3fd6f2, { radius: 0.03, headRadius: 0.095, headLen: 0.22, overlay: true });
    const nB = new Arrow(0x3fd6f2, { radius: 0.03, headRadius: 0.095, headLen: 0.22, overlay: true });
    g.add(nA.group, nB.group);

    const CP = { f: new V3(), n: new V3(), t: new V3(), l: new V3() };

    function update(t) {
      const cyc = 8.5;
      const q = ((t + 2.2) % cyc) / cyc;
      let k;
      if (q < 0.42) k = easeInOut(q / 0.42);
      else if (q < 0.56) k = 1;
      else k = 1 - easeInOut((q - 0.56) / 0.44);

      const topY = logH + 0.4 + P.L;
      const y = topY - 0.95 * k;
      wedge.position.set(0, y, 0);
      effort.set(new V3(0, y + 1.18, 0), new V3(0, -1, 0), 1.05);

      const gap = 0.5 * k;
      halfA.position.x = gap;
      halfB.position.x = -gap;

      const splitY = 0.95;
      nA.set(new V3(gap + logR - 0.06, splitY, 0), new V3(1, 0, 0), 0.7);
      nB.set(new V3(-gap - logR + 0.06, splitY, 0), new V3(-1, 0, 0), 0.7);

      CP.f.set(0, y + 1.42, 0);
      CP.n.set(gap + logR + 0.72, splitY + 0.34, 0);
      CP.t.set(P.t * 0.5 + 0.46, y + 0.05, 0);
      CP.l.set(-0.6, y - 0.5, 0);
    }

    function readout() {
      return [
        { k: 'n', v: (P.F * P.L / P.t).toFixed(0), u: 'N', c: 'cyan' },
        { k: 'gain', v: (P.L / P.t).toFixed(2), u: '×', c: 'violet' },
        { k: 't', v: P.t.toFixed(2), u: 'm', c: 'dim' },
        { k: 'L', v: P.L.toFixed(2), u: 'm', c: 'dim' },
        { k: 'note', v: 'F · L / t', c: 'text', wide: true }
      ];
    }

    return {
      group: g,
      params: P,
      camera: { theta: 0.5, phi: 1.1, radius: 9.2, target: new V3(0, 1.35, 0) },
      chips: [
        chipDef('压力 F', 'Push F', 'APPLIED', () => P.F.toFixed(0) + ' N', '#ffb347', () => CP.f),
        chipDef('劈开力 N', 'Splitting N', 'F·L/t', () => (P.F * P.L / P.t).toFixed(0) + ' N', '#3fd6f2', () => CP.n),
        chipDef('厚 t', 'Thickness t', 'WEDGE', () => P.t.toFixed(2) + ' m', '#a48bff', () => CP.t, { small: true }),
        chipDef('长 L', 'Length L', 'WEDGE', () => P.L.toFixed(2) + ' m', '#a48bff', () => CP.l, { small: true })
      ],
      setParam: function (k, v) {
        P[k] = v;
        if (k === 't') rebuildWedge();
      },
      setVariant: function (key) {
        P.t = key === 'thick' ? 0.72 : key === 'thin' ? 0.32 : 0.5;
        rebuildWedge();
      },
      update: update,
      readout: readout
    };
  }

  window.SM = {
    buildLever: buildLever,
    buildPulley: buildPulley,
    buildWheel: buildWheel,
    buildIncline: buildIncline,
    buildScrew: buildScrew,
    buildWedge: buildWedge
  };
})();
