/* ============================================================
   Nobel Prize 2026 — 3D scene builders
   Each builder returns:
     { group, cameras, chips, params, setParam, setVariant,
       update, readout }
   ============================================================ */
(function () {
  'use strict';

  const V3 = THREE.Vector3;
  const UP = new THREE.Vector3(0, 1, 0);
  const clamp = THREE.MathUtils.clamp;
  const D2R = Math.PI / 180;

  const C = {
    ice: 0x9fd8f0,
    cyan: 0x3fd6f2,
    amber: 0xffb347,
    gold: 0xffd166,
    violet: 0xa48bff,
    blue: 0x6fa8ff,
    bio: 0x8f5f79,
    bioDark: 0x6a4a61,
    axon: 0x6a8fb8,
    membrane: 0x2f6f92,
    steel: 0x8fa3bd
  };

  /* ============================================================
     helpers
     ============================================================ */

  function mat(color, o) {
    o = o || {};
    return new THREE.MeshStandardMaterial({
      color: color,
      metalness: o.metalness === undefined ? 0.3 : o.metalness,
      roughness: o.roughness === undefined ? 0.55 : o.roughness,
      emissive: o.emissive === undefined ? 0x000000 : o.emissive,
      emissiveIntensity: o.emissiveIntensity === undefined ? 1 : o.emissiveIntensity,
      transparent: (o.opacity === undefined ? 1 : o.opacity) < 1,
      opacity: o.opacity === undefined ? 1 : o.opacity,
      side: o.side || THREE.FrontSide
    });
  }

  function basic(color, opacity) {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity === undefined ? 1 : opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  function addEdges(m, color, opacity) {
    const e = new THREE.LineSegments(
      new THREE.EdgesGeometry(m.geometry, 28),
      new THREE.LineBasicMaterial({ color: color || 0xa9c6e8, transparent: true, opacity: opacity === undefined ? 0.25 : opacity })
    );
    m.add(e);
    return e;
  }

  function mesh(geo, material, x, y, z, cast) {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = cast === true;
    m.receiveShadow = false;
    return m;
  }

  function ball(x, y, z, r, color, o) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), mat(color, o));
    m.position.set(x, y, z);
    return m;
  }

  function tubeM(a, b, r, material, r2) {
    const d = new V3().subVectors(b, a);
    const len = Math.max(d.length(), 0.0001);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r2 === undefined ? r : r2, r, len, 8), material);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(UP, d.normalize());
    return m;
  }

  function tube(a, b, r, color, o) {
    return tubeM(a, b, r, mat(color, o));
  }

  function lineSeg(a, b, color, opacity, dashed) {
    const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
    let m;
    if (dashed) {
      m = new THREE.LineDashedMaterial({ color: color, dashSize: 0.16, gapSize: 0.12, transparent: true, opacity: opacity === undefined ? 1 : opacity });
    } else {
      m = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity === undefined ? 1 : opacity });
    }
    const line = new THREE.Line(geo, m);
    if (dashed) line.computeLineDistances();
    return line;
  }

  function polyline(points, color, opacity, dashed) {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const m = dashed
      ? new THREE.LineDashedMaterial({ color: color, dashSize: 0.18, gapSize: 0.14, transparent: true, opacity: opacity })
      : new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity });
    const line = new THREE.Line(geo, m);
    if (dashed) line.computeLineDistances();
    return line;
  }

  let _glow = null;
  function glowTexture() {
    if (_glow) return _glow;
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const ctx = cv.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,0.95)');
    grd.addColorStop(0.28, 'rgba(255,255,255,0.42)');
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

  function glowSprite(color, size, opacity) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture(), color: color, transparent: true,
      opacity: opacity === undefined ? 0.85 : opacity,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    s.scale.set(size, size, 1);
    return s;
  }

  function textSprite(text, color, size, align) {
    const cv = document.createElement('canvas');
    cv.width = 256; cv.height = 64;
    const ctx = cv.getContext('2d');
    ctx.font = '500 30px -apple-system, "SF Pro Text", "PingFang SC", "Helvetica Neue", sans-serif';
    ctx.fillStyle = color || '#cfe4f2';
    ctx.textBaseline = 'middle';
    if (align === 'left') {
      ctx.textAlign = 'left';
      ctx.fillText(text, 6, 34);
    } else {
      ctx.textAlign = 'right';
      ctx.fillText(text, 250, 34);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 4;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 0.9
    }));
    const s = size === undefined ? 0.34 : size;
    sp.scale.set(s * 4, s, 1);
    sp.renderOrder = 20;
    return sp;
  }

  function vGradTex(top, bottom) {
    const cv = document.createElement('canvas');
    cv.width = 8; cv.height = 256;
    const ctx = cv.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 8, 256);
    const t = new THREE.CanvasTexture(cv);
    t.minFilter = THREE.LinearFilter;
    return t;
  }

  let _beam = null;  function beamTexture() {
    if (_beam) return _beam;
    const cv = document.createElement('canvas');
    cv.width = 8; cv.height = 128;
    const ctx = cv.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.12, 'rgba(255,255,255,0.75)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.28)');
    g.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 8, 128);
    _beam = new THREE.CanvasTexture(cv);
    return _beam;
  }

  function beamBetween(from, to, radius, color, opacity) {
    const dir = new V3().subVectors(to, from);
    const len = dir.length();
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(radius, len, 32, 1, true),
      new THREE.MeshBasicMaterial({
        map: beamTexture(), color: color, transparent: true, opacity: opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      })
    );
    m.position.copy(from).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(UP, dir.clone().normalize().negate());
    return m;
  }

  let _coneTex = null;
  function coneTexture() {
    if (_coneTex) return _coneTex;
    const cv = document.createElement('canvas');
    cv.width = 16; cv.height = 128;
    const ctx = cv.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.22)');
    g.addColorStop(1, 'rgba(255,255,255,0.85)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 128);
    _coneTex = new THREE.CanvasTexture(cv);
    return _coneTex;
  }

  function cherenkovRings(origin, dir, list, color) {    const grp = new THREE.Group();
    const rings = [];
    const zAxis = new THREE.Vector3(0, 0, 1);
    list.forEach(function (s) {
      const r = Math.tan(41 * D2R) * s;
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 6, 56), basic(color, 0.3));
      m.position.copy(origin).addScaledVector(dir, s);
      m.quaternion.setFromUnitVectors(zAxis, dir);
      grp.add(m);
      rings.push(m);
    });
    return { grp: grp, rings: rings };
  }

  function particleField(count, size, color, opacity) {    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const m = new THREE.PointsMaterial({
      size: size, map: glowTexture(), color: color, transparent: true,
      opacity: opacity === undefined ? 0.9 : opacity,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    const pts = new THREE.Points(geo, m);
    pts.frustumCulled = false;
    return pts;
  }

  function rng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function chipDef(zh, en, sub, value, color, pos, opts) {
    opts = opts || {};
    return {
      zh: zh, en: en, sub: sub,
      value: typeof value === 'function' ? value : (value == null ? null : function () { return value; }),
      color: color, pos: pos,
      small: !!opts.small, title: !!opts.title, visible: opts.visible || null
    };
  }

  function sup(n) {
    const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    return String(n).split('').map(function (c) { return map[c] || c; }).join('');
  }

  function sci(x) {
    if (!isFinite(x) || x <= 0) return '—';
    const e = Math.floor(Math.log10(x));
    const m = x / Math.pow(10, e);
    return m.toFixed(1) + '×10' + sup(e);
  }

  /* ============================================================
     1 — PHYSIOLOGY OR MEDICINE · optogenetics
     ============================================================ */

  function buildOpto() {
    const g = new THREE.Group();
    const P = { light: 0.62 };
    const G = { channel: new THREE.Group(), neuron: new THREE.Group(), circuit: new THREE.Group() };
    g.add(G.channel); g.add(G.neuron); g.add(G.circuit);
    G.neuron.visible = false;
    G.circuit.visible = false;

    let variant = 'channel';
    let openS = 0;
    let last = 0;

    const openOf = function () { return clamp((P.light - 0.04) / 0.6, 0, 1); };

    /* ---------------- A · membrane patch ---------------- */
    const A = G.channel;
    A.add(glowDisc(5.4, 0x1d6f96, 0.2));

    const memW = 8.4, memD = 2.5, memT = 0.66;
    const core = mesh(new THREE.BoxGeometry(memW, memT, memD), mat(0x0d1f2c, { roughness: 0.75, metalness: 0.1, opacity: 0.62 }), 0, 0, 0);
    addEdges(core, 0x3f88ab, 0.55);
    A.add(core);

    const headGeo = new THREE.SphereGeometry(0.115, 10, 8);
    const headMat = mat(0x5c8da8, { metalness: 0.12, roughness: 0.6, emissive: 0x08202c, emissiveIntensity: 0.45 });
    const COLS = 24, ROWS = 8;
    const heads = new THREE.InstancedMesh(headGeo, headMat, COLS * ROWS * 2);
    const dummy = new THREE.Object3D();
    let hi = 0;
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const x = (i / (COLS - 1) - 0.5) * (memW - 0.22);
        const z = (j / (ROWS - 1) - 0.5) * (memD - 0.22);
        for (let s = -1; s <= 1; s += 2) {
          dummy.position.set(x, s * (memT / 2 + 0.015), z);
          dummy.updateMatrix();
          heads.setMatrixAt(hi++, dummy.matrix);
        }
      }
    }
    heads.castShadow = false;
    A.add(heads);

    // channel: seven transmembrane helices
    const chG = new THREE.Group();
    chG.scale.setScalar(1.5);
    A.add(chG);
    const helixMat = mat(0x4a86c8, { metalness: 0.5, roughness: 0.35, emissive: 0x0d3350, emissiveIntensity: 1.1 });
    const helices = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const h = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.076, 1.28, 7), helixMat);
      h.position.set(Math.cos(a) * 0.33, 0, Math.sin(a) * 0.33);
      h.rotation.z = -Math.cos(a) * 0.15;
      h.rotation.x = Math.sin(a) * 0.15;
      chG.add(h);
      helices.push({ m: h, a: a });
    }

    const poreMat = new THREE.MeshBasicMaterial({ color: 0x9df4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const pore = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 1.5, 14, 1, true), poreMat);
    A.add(pore);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x9df4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.215, 0.024, 8, 32), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.68;
    A.add(ring);

    // retinal
    const retG = new THREE.Group();
    const retMat = mat(0xff9a3c, { emissive: 0xff6a00, emissiveIntensity: 1.1, roughness: 0.4, metalness: 0.2 });
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 6), retMat);
      s.position.set(0, 0.2 - i * 0.115, -0.03);
      retG.add(s);
    }
    A.add(retG);

    // light
    const beam = beamBetween(new V3(0, 5.4, 0), new V3(0, 0.95, 0), 1.05, 0x3fb6ea, 0.1);
    A.add(beam);

    const PHOTONS = 42;
    const photons = particleField(PHOTONS, 0.14, 0x9fe4ff, 0.9);
    const phState = [];
    for (let i = 0; i < PHOTONS; i++) {
      phState.push({
        a: Math.random() * Math.PI * 2,
        r: Math.sqrt(Math.random()) * 1.5,
        y: 0.3 + Math.random() * 5.2,
        sp: 3.2 + Math.random() * 2.4
      });
    }
    A.add(photons);

    const IONS = 34;
    const ions = particleField(IONS, 0.13, 0x7fe6ff, 0.85);
    const ionState = [];
    for (let i = 0; i < IONS; i++) {
      ionState.push({
        x: (Math.random() - 0.5) * 5.6,
        z: (Math.random() - 0.5) * 1.9,
        y: 0.7 + Math.random() * 2.4,
        sp: 0.16 + Math.random() * 0.22
      });
    }
    A.add(ions);

    const FLUX = 16;
    const flux = particleField(FLUX, 0.15, 0x63f0ff, 1);
    const fluxState = [];
    for (let i = 0; i < FLUX; i++) fluxState.push({ y: -2 - Math.random() * 3, x: 0, z: 0 });
    A.add(flux);

    const field = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 2.6),
      new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0x2fa8d8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    field.rotation.x = -Math.PI / 2;
    field.position.y = -0.62;
    A.add(field);

    const CP = {
      membrane: new V3(-2.6, 0.5, 1.05),
      channel: new V3(0.95, 1.25, 0),
      light: new V3(0, 3.5, 0),
      ion: new V3(2.35, -0.42, 0.85),
      vm: new V3(-2.15, -0.42, 0.9)
    };

    /* ---------------- B · neuron ---------------- */
    const B = G.neuron;
    B.add(glowDisc(4.8, 0x24506e, 0.14));

    function somaGeometry(r, seed) {
      const geo = new THREE.SphereGeometry(r, 28, 22);
      const p = geo.attributes.position;
      const v = new V3();
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        const n = 1 + 0.1 * Math.sin(v.x * 4.1 + seed) * Math.sin(v.y * 3.7 + seed * 1.7) +
          0.065 * Math.cos(v.z * 5.2 + seed);
        v.multiplyScalar(n);
        p.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    }

    const somaMat = mat(C.bio, { metalness: 0.04, roughness: 0.9, emissive: 0x2e0f1c, emissiveIntensity: 0.16 });
    const dendMat = mat(C.bioDark, { metalness: 0.04, roughness: 0.92, emissive: 0x1e0a14, emissiveIntensity: 0.14 });
    const axonMat = mat(C.axon, { metalness: 0.12, roughness: 0.65, emissive: 0x0e2740, emissiveIntensity: 0.3 });

    const somaPos = new V3(-0.4, 2.55, 0);
    const soma = new THREE.Mesh(somaGeometry(0.95, 1.7), somaMat);
    soma.position.copy(somaPos);
    B.add(soma);

    const nucleus = ball(somaPos.x - 0.1, somaPos.y - 0.05, 0, 0.44, 0x6d4260, { roughness: 0.7, metalness: 0.1, emissive: 0x2a0f1e, emissiveIntensity: 0.5 });
    B.add(nucleus);

    // surface bumps give the soma an organic, non-spherical read
    const brnd = rng(4242);
    for (let i = 0; i < 90; i++) {
      const th = Math.acos(2 * brnd() - 1);
      const ph2 = brnd() * Math.PI * 2;
      const p = new V3(Math.sin(th) * Math.cos(ph2), Math.cos(th), Math.sin(th) * Math.sin(ph2)).multiplyScalar(0.95);
      const b = ball(somaPos.x + p.x, somaPos.y + p.y, somaPos.z + p.z, 0.022 + brnd() * 0.035, C.bioDark, { roughness: 0.95, emissive: 0x260d19, emissiveIntensity: 0.16 });
      B.add(b);
    }

    const jointGeo = new THREE.SphereGeometry(1, 10, 8);
    const rnd = rng(20261005);

    function grow(origin, dir, len, rad, depth) {
      const end = origin.clone().addScaledVector(dir, len);
      B.add(tubeM(origin, end, rad, dendMat, rad * 0.72));
      const j = new THREE.Mesh(jointGeo, dendMat);
      j.position.copy(end);
      j.scale.setScalar(rad * 0.95);
      B.add(j);
      if (depth <= 0) return;
      for (let i = 0; i < 2; i++) {
        const nd = dir.clone().add(new V3((rnd() - 0.5) * 1.15, (rnd() - 0.5) * 1.15, (rnd() - 0.5) * 1.15)).normalize();
        grow(end, nd, len * 0.68, rad * 0.7, depth - 1);
      }
    }

    const primaries = 8;
    for (let i = 0; i < primaries; i++) {
      const a = (i / primaries) * Math.PI * 2 + 0.35;
      const d = new V3(Math.cos(a), 0.42 + rnd() * 0.55, Math.sin(a) * 0.9).normalize();
      const start = somaPos.clone().addScaledVector(d, 0.84);
      grow(start, d, 0.95 + rnd() * 0.35, 0.105, 3);
    }

    const axonPts = [
      somaPos.clone().add(new V3(0.9, -0.1, 0)),
      new V3(2.0, 2.28, 0.22),
      new V3(3.3, 2.62, -0.2),
      new V3(4.4, 2.36, 0.12),
      new V3(5.1, 2.2, 0)
    ];
    const axonCurve = new THREE.CatmullRomCurve3(axonPts);
    const axon = new THREE.Mesh(new THREE.TubeGeometry(axonCurve, 80, 0.078, 8, false), axonMat);
    B.add(axon);

    const term = axonPts[4];
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const e = term.clone().add(new V3(0.5 + 0.2 * Math.cos(a), 0.42 * Math.sin(a), 0.42 * Math.cos(a)));
      B.add(tubeM(term, e, 0.05, axonMat));
      B.add(ball(e.x, e.y, e.z, 0.1, C.axon, { emissive: 0x1d4a6e, emissiveIntensity: 0.8 }));
    }

    const spike = glowSprite(0x9df4ff, 1.5, 0.95);
    B.add(spike);
    const spikeCore = ball(0, 0, 0, 0.11, 0xdffbff, { emissive: 0x8fe8ff, emissiveIntensity: 1.6 });
    B.add(spikeCore);

    const somaRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 8, 48), basic(0x8fe8ff, 0));
    somaRing.position.copy(somaPos);
    B.add(somaRing);

    const beamB = beamBetween(new V3(2.6, 7.4, 1.6), somaPos.clone().add(new V3(0.1, 0.55, 0)), 1.05, 0x3fb6ea, 0.12);
    B.add(beamB);

    const CPN = {
      soma: somaPos.clone().add(new V3(0, 1.15, 0.2)),
      dend: new V3(-3.4, 3.9, 0.6),
      axon: new V3(3.4, 2.95, 0),
      spike: new V3(),
      light: new V3(2.2, 6.6, 1.2)
    };

    /* ---------------- C · circuit ---------------- */
    const Cn = G.circuit;
    Cn.add(glowDisc(6.6, 0x24506e, 0.1));

    const nodes = [];
    const nodeX = [-4.3, 0, 4.3];
    for (let i = 0; i < 3; i++) {
      const grp = new THREE.Group();
      const sm = mat(C.bio, { metalness: 0.05, roughness: 0.82, emissive: 0x401428, emissiveIntensity: 0.2 });
      const dm = mat(C.bioDark, { metalness: 0.05, roughness: 0.86, emissive: 0x2a0e1e, emissiveIntensity: 0.18 });
      const am = mat(C.axon, { metalness: 0.15, roughness: 0.6, emissive: 0x0e2740, emissiveIntensity: 0.35 });
      const body = new THREE.Mesh(somaGeometry(0.7, 2.4 + i), sm);
      grp.add(body);
      const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), mat(0x5c3548, { roughness: 0.8, metalness: 0.05, emissive: 0x220c18, emissiveIntensity: 0.4 }));
      nuc.position.set(-0.06, 0.02, 0);
      grp.add(nuc);
      const r2 = rng(3300 + i * 17);
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2 + 0.4;
        const d = new V3(Math.cos(a), 0.5 + r2() * 0.4, Math.sin(a)).normalize();
        const s = d.clone().multiplyScalar(0.62);
        const e = s.clone().addScaledVector(d, 0.7 + r2() * 0.3);
        grp.add(tubeM(s, e, 0.05, dm));
        for (let q = 0; q < 2; q++) {
          const nd = d.clone().add(new V3((r2() - 0.5) * 0.95, (r2() - 0.5) * 0.55, (r2() - 0.5) * 0.95)).normalize();
          const e2 = e.clone().addScaledVector(nd, 0.38 + r2() * 0.24);
          grp.add(tubeM(e, e2, 0.028, dm));
        }
      }
      grp.position.set(nodeX[i], 2.55, 0);
      Cn.add(grp);
      nodes.push({ grp: grp, mat: sm, dend: dm });
    }

    const synPts = [];
    for (let i = 0; i < 2; i++) {
      const a = nodes[i].grp.position.clone().add(new V3(0.62, 0.1, 0));
      const b = nodes[i + 1].grp.position.clone().add(new V3(-0.66, -0.16, 0.12));
      const mid = a.clone().lerp(b, 0.5).add(new V3(0, 0.55, 0));
      const cur = new THREE.QuadraticBezierCurve3(a, mid, b);
      const m = new THREE.Mesh(new THREE.TubeGeometry(cur, 24, 0.045, 6, false), mat(C.axon, { emissive: 0x12324f, emissiveIntensity: 0.6, roughness: 0.45 }));
      Cn.add(m);
      const bouton = ball(b.x, b.y, b.z, 0.11, 0x9df4ff, { emissive: 0x3fd6f2, emissiveIntensity: 1.1 });
      Cn.add(bouton);
      synPts.push(bouton);
    }

    const beamC = beamBetween(new V3(-4.3, 6.6, 1.2), new V3(-4.3, 3.1, 0), 0.72, 0x3fb6ea, 0.13);
    Cn.add(beamC);

    const CPC = {
      stim: new V3(-4.3, 3.55, 0.4),
      syn: new V3(-2.1, 3.1, 0.5),
      out: new V3(4.3, 3.5, 0.3)
    };

    /* ---------------- update ---------------- */
    function update(t) {
      const dt = Math.min(0.05, Math.max(0, t - last));
      last = t;
      const open = openOf();
      openS += (open - openS) * Math.min(1, dt * 6);

      // membrane patch
      poreMat.opacity = openS * 0.5;
      ringMat.opacity = openS * (0.6 + 0.3 * Math.sin(t * 5));
      ring.scale.setScalar(1 + openS * 0.12 + 0.05 * Math.sin(t * 5));
      for (let i = 0; i < helices.length; i++) {
        const h = helices[i];
        h.m.rotation.z = -Math.cos(h.a) * (0.15 + openS * 0.075);
        h.m.rotation.x = Math.sin(h.a) * (0.15 + openS * 0.075);
      }
      retMat.emissiveIntensity = 0.5 + P.light * 1.9 + 0.35 * Math.sin(t * 7) * P.light;
      beam.material.opacity = 0.025 + P.light * 0.11;
      field.material.opacity = openS * 0.07;

      const pa = photons.geometry.attributes.position.array;
      for (let i = 0; i < PHOTONS; i++) {
        const s = phState[i];
        s.y -= s.sp * dt * (0.35 + P.light * 0.9);
        if (s.y < 0.95) { s.y = 5.4; s.a = Math.random() * Math.PI * 2; s.r = Math.sqrt(Math.random()) * 1.5; }
        const spread = 0.16 + (5.4 - s.y) * 0.3;
        pa[i * 3] = Math.cos(s.a) * s.r * spread;
        pa[i * 3 + 1] = s.y;
        pa[i * 3 + 2] = Math.sin(s.a) * s.r * spread * 0.62;
      }
      photons.geometry.attributes.position.needsUpdate = true;

      const ia = ions.geometry.attributes.position.array;
      for (let i = 0; i < IONS; i++) {
        const s = ionState[i];
        s.y -= s.sp * dt * 3.2;
        if (s.y < 0.55) { s.y = 3.1; s.x = (Math.random() - 0.5) * 5.6; s.z = (Math.random() - 0.5) * 1.9; }
        ia[i * 3] = s.x;
        ia[i * 3 + 1] = s.y;
        ia[i * 3 + 2] = s.z;
      }
      ions.geometry.attributes.position.needsUpdate = true;

      const fa = flux.geometry.attributes.position.array;
      for (let i = 0; i < FLUX; i++) {
        const s = fluxState[i];
        if (openS > 0.04) {
          s.y -= dt * (1.6 + openS * 2.2);
          if (s.y < -1.4) { s.y = 0.62; s.x = (Math.random() - 0.5) * 0.06; s.z = (Math.random() - 0.5) * 0.06; }
        } else if (s.y > -3) {
          s.y = -3;
        }
        fa[i * 3] = s.x;
        fa[i * 3 + 1] = s.y;
        fa[i * 3 + 2] = s.z;
      }
      flux.geometry.attributes.position.needsUpdate = true;

      // neuron
      const period = 2.9 - 2.1 * openS;
      const ph = (t % period) / period;
      const u = clamp(ph / 0.55, 0, 1);
      const p = axonCurve.getPointAt(u);
      spike.position.copy(p);
      spikeCore.position.copy(p);
      const flash = Math.max(0, 1 - Math.abs(ph - 0.02) * 14);
      somaMat.emissiveIntensity = 0.3 + flash * 2.4 + openS * 0.18;
      spike.material.opacity = 0.35 + openS * 0.6;
      spikeCore.visible = openS > 0.03;
      spike.visible = openS > 0.03;
      somaRing.material.opacity = Math.max(0, 0.5 - ph * 3) * openS;
      somaRing.scale.setScalar(1 + ph * 1.6);
      somaRing.quaternion.copy(cameraQuat);
      CPN.spike.copy(p);
      beamB.material.opacity = 0.03 + P.light * 0.13;

      // circuit
      const cp = (t * 0.42) % 1;
      for (let i = 0; i < 3; i++) {
        const at = i * 0.16;
        const f = Math.exp(-Math.pow((cp - at) * 13, 2)) * openS;
        nodes[i].mat.emissiveIntensity = 0.28 + f * 2.6;
        nodes[i].dend.emissiveIntensity = 0.26 + f * 0.8;
      }
      for (let i = 0; i < synPts.length; i++) {
        const f = Math.exp(-Math.pow((cp - (0.16 + i * 0.16)) * 13, 2)) * openS;
        synPts[i].material.emissiveIntensity = 0.5 + f * 3;
        synPts[i].scale.setScalar(1 + f * 0.4);
      }
      beamC.material.opacity = 0.03 + P.light * 0.14;
    }

    const cameraQuat = new THREE.Quaternion();
    function setCamera(q) { cameraQuat.copy(q); }

    /* ---------------- readout ---------------- */
    function readout() {
      const open = openOf();
      const I = -open * 420;
      const rate = Math.round(open * 46);
      const vm = -70 + open * 115;
      return [
        { k: 'i', v: I.toFixed(0), u: 'pA', c: 'cyan' },
        { k: 'rate', v: String(rate), u: 'Hz', c: 'amber' },
        { k: 'vm', v: (vm > 0 ? '+' : '') + vm.toFixed(0), u: 'mV', c: 'violet' },
        { k: 'open', v: (open * 100).toFixed(0), u: '%', c: 'dim' }
      ];
    }

    const vis = function (k) { return function () { return variant === k; }; };

    return {
      group: g,
      params: P,
      cameras: {
        channel: { theta: 0.14, phi: 1.33, radius: 12.0, target: new V3(0.2, 0.2, 0) },
        neuron: { theta: 0.24, phi: 1.2, radius: 13.2, target: new V3(0.9, 2.5, 0) },
        circuit: { theta: 0.14, phi: 1.22, radius: 13.6, target: new V3(0, 2.5, 0) }
      },
      chips: [
        chipDef('细胞膜', 'Membrane', 'LIPID BILAYER', null, '#7fb0cc', function () { return CP.membrane; }, { small: true, visible: vis('channel') }),
        chipDef('ChR2 通道', 'ChR2 channel', 'LIGHT-GATED', function () { return (openOf() * 100).toFixed(0) + '% open'; }, '#6fa8ff', function () { return CP.channel; }, { visible: vis('channel') }),
        chipDef('蓝光 470 nm', 'Blue light', 'PHOTON', '470 nm', '#3fb6ea', function () { return CP.light; }, { visible: vis('channel') }),
        chipDef('阳离子内流', 'Cation influx', 'Na⁺ H⁺ Ca²⁺', function () { return (openOf() * 420).toFixed(0) + ' pA'; }, '#3fd6f2', function () { return CP.ion; }, { small: true, visible: vis('channel') }),
        chipDef('膜电位', 'Membrane potential', 'DEPOLARISE', function () { return (-70 + openOf() * 115).toFixed(0) + ' mV'; }, '#ffb347', function () { return CP.vm; }, { small: true, visible: vis('channel') }),

        chipDef('胞体', 'Soma', 'CELL BODY', null, '#c98fb4', function () { return CPN.soma; }, { small: true, visible: vis('neuron') }),
        chipDef('树突', 'Dendrites', 'INPUT', null, '#a87c9c', function () { return CPN.dend; }, { small: true, visible: vis('neuron') }),
        chipDef('轴突', 'Axon', 'OUTPUT', null, '#8fb0d8', function () { return CPN.axon; }, { small: true, visible: vis('neuron') }),
        chipDef('动作电位', 'Action potential', 'SPIKE', function () { return Math.round(openOf() * 46) + ' Hz'; }, '#9df4ff', function () { return CPN.spike; }, { visible: vis('neuron') }),
        chipDef('蓝光刺激', 'Blue light', '470 nm', 'ON', '#3fb6ea', function () { return CPN.light; }, { small: true, visible: vis('neuron') }),

        chipDef('光刺激', 'Light on', 'STIMULUS', function () { return (P.light * 100).toFixed(0) + '%'; }, '#3fb6ea', function () { return CPC.stim; }, { small: true, visible: vis('circuit') }),
        chipDef('突触', 'Synapse', 'RELAY', null, '#9df4ff', function () { return CPC.syn; }, { small: true, visible: vis('circuit') }),
        chipDef('下游放电', 'Downstream', 'SPIKE', function () { return openOf() > 0.2 ? 'firing' : 'silent'; }, '#c98fb4', function () { return CPC.out; }, { visible: vis('circuit') })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        variant = key;
        G.channel.visible = key === 'channel';
        G.neuron.visible = key === 'neuron';
        G.circuit.visible = key === 'circuit';
      },
      update: update,
      setCamera: setCamera,
      readout: readout
    };
  }

  /* ============================================================
     2 — CHEMISTRY · chirality, autocatalysis, non-linear effect
     ============================================================ */

  function buildChem() {
    const g = new THREE.Group();
    const P = { ee0: 5e-7 };
    const G = { chiral: new THREE.Group(), amp: new THREE.Group(), nle: new THREE.Group() };
    g.add(G.chiral); g.add(G.amp); g.add(G.nle);
    G.amp.visible = false;
    G.nle.visible = false;
    let variant = 'chiral';

    const AMP = 126;
    const CAP = 0.995;

    /* ---------------- A · mirror pair ---------------- */
    const A = G.chiral;
    A.add(glowDisc(4.6, 0x8a5a1f, 0.1));

    const subDirs = [
      new V3(1, 1, 1), new V3(1, -1, -1), new V3(-1, 1, -1), new V3(-1, -1, 1)
    ].map(function (v) { return v.normalize(); });

    const subDefs = [
      { color: 0xe8f2ff, r: 0.15, len: 1.0 },
      { color: 0x7f8ea3, r: 0.29, len: 0.98 },
      { color: 0xff6b6b, r: 0.23, len: 0.98 },
      { color: 0xa48bff, r: 0.32, len: 1.02 }
    ];

    function chiralMolecule(mirror) {
      const grp = new THREE.Group();
      const s = mirror ? -1 : 1;
      grp.add(ball(0, 0, 0, 0.25, 0x26313f, { metalness: 0.35, roughness: 0.45 }));
      subDirs.forEach(function (d, i) {
        const def = subDefs[i];
        const p = d.clone().multiplyScalar(def.len);
        p.x *= s;
        grp.add(tube(new V3(0, 0, 0), p, 0.052, 0x8fa3bd, { metalness: 0.3, roughness: 0.5 }));
        const b = ball(p.x, p.y, p.z, def.r, def.color, { metalness: 0.22, roughness: 0.4, emissive: def.color, emissiveIntensity: 0.16 });
        grp.add(b);
        if (i === 3) {
          // pyrimidine ring
          const axis = p.clone().normalize();
          const u = new V3(0, 1, 0).cross(axis).normalize();
          const v = axis.clone().cross(u).normalize();
          const ringPts = [];
          for (let k = 0; k < 6; k++) {
            const a = (k / 6) * Math.PI * 2;
            const q = p.clone().addScaledVector(u, Math.cos(a) * 0.26).addScaledVector(v, Math.sin(a) * 0.26);
            ringPts.push(q);
            grp.add(ball(q.x, q.y, q.z, 0.055, 0xb9a4ff, { emissive: 0x5b3fd6, emissiveIntensity: 0.7 }));
          }
          for (let k = 0; k < 6; k++) {
            grp.add(tubeM(ringPts[k], ringPts[(k + 1) % 6], 0.022, mat(0x9a86e8, { emissive: 0x4a34a8, emissiveIntensity: 0.5 })));
          }
        }
      });
      return grp;
    }

    const mLeft = chiralMolecule(false);
    mLeft.position.set(-2.0, 2.05, 0);
    mLeft.scale.setScalar(1.12);
    A.add(mLeft);
    const mRight = chiralMolecule(true);
    mRight.position.set(2.0, 2.05, 0);
    mRight.scale.setScalar(1.12);
    A.add(mRight);

    // glass pane with a grid so the mirror reads as a plane
    const mirrorG = new THREE.Group();
    mirrorG.position.set(0, 2.05, 0);
    mirrorG.rotation.y = Math.PI / 2;
    A.add(mirrorG);

    const mirrorMat = new THREE.MeshBasicMaterial({ color: 0x9fd0ec, transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false });
    mirrorG.add(new THREE.Mesh(new THREE.PlaneGeometry(4.8, 3.8), mirrorMat));

    for (let i = -4; i <= 4; i++) {
      mirrorG.add(lineSeg(new V3(i * 0.55, -1.9, 0), new V3(i * 0.55, 1.9, 0), 0x6fa8c8, 0.16, false));
      mirrorG.add(lineSeg(new V3(-2.4, i * 0.55, 0), new V3(2.4, i * 0.55, 0), 0x6fa8c8, 0.16, false));
    }
    const mirrorEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(4.8, 3.8)),
      new THREE.LineBasicMaterial({ color: 0x9fd0ec, transparent: true, opacity: 0.65 })
    );
    mirrorG.add(mirrorEdge);

    A.add(lineSeg(new V3(0, 0.02, -2.4), new V3(0, 0.02, 2.4), 0x6f5a3a, 0.6, true));

    const CPA = {
      l: new V3(-2.0, 3.55, 0),
      r: new V3(2.0, 3.55, 0),
      mirror: new V3(0, 0.55, 1.9)
    };

    /* ---------------- B · amplification staircase ---------------- */
    const B = G.amp;
    B.add(glowDisc(5.6, 0x8a5a1f, 0.1));

    const plate = mesh(new THREE.BoxGeometry(9.4, 0.14, 2.3), mat(0x141a22, { metalness: 0.45, roughness: 0.7 }), 0, 0.07, 0);
    addEdges(plate, 0x3a4a5c, 0.45);
    B.add(plate);

    // log-scale axis on the left
    const axX = -5.05;
    B.add(lineSeg(new V3(axX, 0.16, 0.2), new V3(axX, 4.45, 0.2), 0x4b6478, 0.7, false));
    for (let d = -7; d <= 0; d++) {
      const y = 0.16 + 0.35 + ((d + 7) / 7) * 3.95;
      B.add(lineSeg(new V3(axX - 0.14, y, 0.2), new V3(axX + 0.1, y, 0.2), 0x6f8fa8, 0.6, false));
      const t = textSprite('10' + sup(d), '#7f9cb0', 0.24, 'left');
      t.position.set(axX - 0.62, y + 0.06, 0.25);
      B.add(t);
    }

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xbfe4f5, metalness: 0.1, roughness: 0.1,
      transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false
    });
    const barX = [-3.9, -1.3, 1.3, 3.9];
    const bars = [];
    const CPB = [];

    for (let i = 0; i < 4; i++) {
      const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 4.7, 22, 1, true), glassMat);
      outer.position.set(barX[i], 0.14 + 2.35, 0);
      B.add(outer);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.018, 6, 28), mat(0x9fd8f0, { metalness: 0.4, roughness: 0.4, emissive: 0x2a5f78, emissiveIntensity: 0.6 }));
      rim.rotation.x = Math.PI / 2;
      rim.position.set(barX[i], 0.14 + 4.7, 0);
      B.add(rim);
      const fillMat = mat(0x123a5e, { metalness: 0.0, roughness: 0.55, emissive: 0x2b7fd4, emissiveIntensity: 0.85 });
      const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 1, 22), fillMat);
      fill.position.set(barX[i], 0.14, 0);
      B.add(fill);
      const menMat = new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const men = new THREE.Mesh(new THREE.CircleGeometry(0.392, 26), menMat);
      men.rotation.x = -Math.PI / 2;
      // // B.add(men);
      const capGlow = glowSprite(0x8fd8ff, 1.5, 0.55);
      capGlow.position.set(barX[i], 0.6, 0);
      B.add(capGlow);
      bars.push({ fill: fill, mat: fillMat, glow: capGlow, men: men, menMat: menMat, x: barX[i] });
      CPB.push(new V3(barX[i], 0.6, 0.5));
    }

    const trendPts = [];
    for (let i = 0; i < 4; i++) trendPts.push(new V3(0, 0, 0));
    const trendGeo = new THREE.BufferGeometry().setFromPoints(trendPts);
    const trend = new THREE.Line(trendGeo, new THREE.LineBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.7 }));
    B.add(trend);

    const eeAt = function (i) {
      let e = P.ee0;
      for (let k = 0; k < i; k++) e = Math.min(CAP, e * AMP);
      return e;
    };
    const hOf = function (e) {
      return clamp(0.35 + ((Math.log10(Math.max(e, 1e-9)) + 7) / 7) * 3.95, 0.3, 4.35);
    };

    function refreshBars() {
      for (let i = 0; i < 4; i++) {
        const e = eeAt(i);
        const h = hOf(e);
        const b = bars[i];
        b.fill.scale.y = h;
        b.fill.position.y = 0.14 + h / 2;
        b.glow.position.y = 0.14 + h;
        b.glow.scale.setScalar(0.9 + Math.min(1.4, h / 3));
        b.men.position.y = 0.14 + h + 0.004;
        const k = clamp((h - 0.3) / 4.05, 0, 1);
        const col = new THREE.Color(0x1f6fd0).lerp(new THREE.Color(0xffb03a), k);
        b.mat.color.copy(col).multiplyScalar(0.32);
        b.mat.emissive.copy(col);
        b.mat.emissiveIntensity = 0.7 + k * 0.55;
        b.menMat.color.copy(col).lerp(new THREE.Color(0xffffff), 0.35);
        CPB[i].set(b.x, 0.14 + h + 0.36, 0.55);
      }
      const pts = CPB.map(function (p, i) { return new V3(p.x, p.y - 0.5, 0.1); });
      trendGeo.setFromPoints(pts);
      trendGeo.attributes.position.needsUpdate = true;
    }
    refreshBars();

    /* ---------------- C · non-linear effect ---------------- */
    const Cn = G.nle;
    const OX = 0, OY = 2.65, SX = 3.2, SY = 2.0;

    const axisMat = 0x4b6478;
    Cn.add(lineSeg(new V3(-3.5, OY, 0), new V3(3.5, OY, 0), axisMat, 0.9, false));
    Cn.add(lineSeg(new V3(0, 0.45, 0), new V3(0, 4.95, 0), axisMat, 0.9, false));

    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      const x = i * 0.8;
      Cn.add(lineSeg(new V3(x, 0.5, 0), new V3(x, 4.9, 0), 0x1b2b38, 0.85, false));
      const y = OY + i * 0.5;
      Cn.add(lineSeg(new V3(-3.2, y, 0), new V3(3.2, y, 0), 0x1b2b38, 0.85, false));
    }

    Cn.add(polyline([new V3(-3.2, OY - SY, 0), new V3(3.2, OY + SY, 0)], 0x7f8b9c, 0.55, true));

    const BETA = 4.2;
    const curvePts = [];
    for (let i = 0; i <= 80; i++) {
      const e = -1 + (i / 80) * 2;
      const y = e * (1 + BETA) / (1 + BETA * Math.abs(e));
      curvePts.push(new V3(e * SX, OY + y * SY, 0.02));
    }
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
    Cn.add(new THREE.Line(curveGeo, new THREE.LineBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.95 })));

    for (let i = 0; i <= 8; i++) {
      const e = -1 + i * 0.25;
      const y = e * (1 + BETA) / (1 + BETA * Math.abs(e));
      const b = ball(e * SX, OY + y * SY, 0.03, 0.075, 0xffe6a8, { emissive: 0xffb347, emissiveIntensity: 1.2 });
      Cn.add(b);
    }

    const CPN = {
      xAxis: new V3(3.05, OY - 0.42, 0),
      yAxis: new V3(0.85, 4.75, 0),
      flat: new V3(-2.1, 2.15, 0),
      steep: new V3(2.2, 4.35, 0)
    };

    /* ---------------- update ---------------- */
    let last = 0;
    function update(t) {
      const dt = Math.min(0.05, Math.max(0, t - last));
      last = t;
      const a = 0.3 + t * 0.14;
      mLeft.rotation.y = a;
      mRight.rotation.y = -a;
      mLeft.position.y = 2.05 + Math.sin(t * 0.8) * 0.04;
      mRight.position.y = mLeft.position.y;
      mirrorMat.opacity = 0.05 + 0.02 * Math.sin(t * 1.4);

      for (let i = 0; i < bars.length; i++) {
        const b = bars[i];
        b.glow.material.opacity = 0.35 + 0.18 * Math.sin(t * 1.6 + i * 0.8);
      }
    }

    function readout() {
      const e0 = P.ee0;
      const e3 = eeAt(3);
      return [
        { k: 'ee0', v: pct(e0), c: 'dim' },
        { k: 'ee3', v: pct(e3), c: 'gold' },
        { k: 'amp', v: sci(e3 / e0), c: 'violet' },
        { k: 'rounds', v: '3', u: '轮', c: 'dim' }
      ];
    }

    const vis = function (k) { return function () { return variant === k; }; };

    return {
      group: g,
      params: P,
      cameras: {
        chiral: { theta: 0.34, phi: 1.32, radius: 8.8, target: new V3(0, 2.15, 0) },
        amp: { theta: 0.26, phi: 1.16, radius: 14.6, target: new V3(0, 2.35, 0) },
        nle: { theta: 0.02, phi: 1.44, radius: 9.6, target: new V3(0, 2.5, 0) }
      },
      chips: [
        chipDef('R 构型', 'R enantiomer', 'RIGHT HAND', null, '#ffb347', function () { return CPA.l; }, { visible: vis('chiral') }),
        chipDef('S 构型', 'S enantiomer', 'LEFT HAND', null, '#45c8f0', function () { return CPA.r; }, { visible: vis('chiral') }),
        chipDef('镜面', 'Mirror plane', 'σ', '不可重合', '#8fb6d8', function () { return CPA.mirror; }, { small: true, visible: vis('chiral') }),

        chipDef('第 0 轮', 'Round 0', 'SEED', function () { return pct(eeAt(0)); }, '#45c8f0', function () { return CPB[0]; }, { small: true, visible: vis('amp') }),
        chipDef('第 1 轮', 'Round 1', '×126', function () { return pct(eeAt(1)); }, '#6fb0e0', function () { return CPB[1]; }, { small: true, visible: vis('amp') }),
        chipDef('第 2 轮', 'Round 2', '×126', function () { return pct(eeAt(2)); }, '#a8c8a0', function () { return CPB[2]; }, { small: true, visible: vis('amp') }),
        chipDef('第 3 轮', 'Round 3', '×126', function () { return pct(eeAt(3)); }, '#ffd166', function () { return CPB[3]; }, { visible: vis('amp') }),
        chipDef('自催化', 'Autocatalysis', 'PRODUCT = CATALYST', '×126 / 轮', '#ffb347', function () { return new V3(0, 4.6, 0.8); }, { title: true, visible: vis('amp') }),

        chipDef('催化剂 ee', 'Catalyst ee', 'X AXIS', null, '#8fb6d8', function () { return CPN.xAxis; }, { small: true, visible: vis('nle') }),
        chipDef('产物 ee', 'Product ee', 'Y AXIS', null, '#8fb6d8', function () { return CPN.yAxis; }, { small: true, visible: vis('nle') }),
        chipDef('异手性二聚体失活', 'Heterochiral dimer off', 'FLAT', null, '#7f8b9c', function () { return CPN.flat; }, { small: true, visible: vis('nle') }),
        chipDef('正非线性', 'Positive non-linearity', 'STEEP', null, '#ffd166', function () { return CPN.steep; }, { small: true, visible: vis('nle') })
      ],
      setParam: function (k, v) { P[k] = v; if (k === 'ee0') refreshBars(); },
      setVariant: function (key) {
        variant = key;
        G.chiral.visible = key === 'chiral';
        G.amp.visible = key === 'amp';
        G.nle.visible = key === 'nle';
      },
      update: update,
      readout: readout
    };
  }

  function pct(v) {
    const p = v * 100;
    if (p >= 10) return p.toFixed(1) + '%';
    if (p >= 1) return p.toFixed(2) + '%';
    if (p >= 0.01) return p.toFixed(3) + '%';
    return p.toFixed(5) + '%';
  }

  /* ============================================================
     3 — PHYSICS · IceCube
     ============================================================ */

  function buildPhys() {
    const g = new THREE.Group();
    const P = { energy: 300 };
    const G = { array: new THREE.Group(), event: new THREE.Group(), ice: new THREE.Group() };
    g.add(G.array); g.add(G.event); g.add(G.ice);
    G.event.visible = false;
    G.ice.visible = false;
    let variant = 'array';

    const SURF = 4.6;
    const BOT = -3.9;

    function snowTexture() {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 256;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#dceaf3';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2800; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = Math.random() * 2.2;
        const a = Math.random() * 0.45;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,' + a + ')' : 'rgba(140,185,212,' + (a * 0.55) + ')';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 7);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(cv);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      return tex;
    }

    /* ---------------- A · the array ---------------- */
    const A = G.array;
    const SW = 15.5;
    // the ice sheet is drawn as a thin luminous frame — a diagram, not a solid ceiling
    const surface = new THREE.Group();
    surface.position.y = SURF;
    A.add(surface);
    surface.add(polyline([
      new V3(-SW / 2, 0, SW / 2), new V3(SW / 2, 0, SW / 2),
      new V3(SW / 2, 0, -SW / 2), new V3(-SW / 2, 0, -SW / 2),
      new V3(-SW / 2, 0, SW / 2)
    ], 0xcfe8f8, 0.7, false));
    for (let i = -3; i <= 3; i++) {
      surface.add(lineSeg(new V3(i * 2.2, 0.01, -SW / 2), new V3(i * 2.2, 0.01, SW / 2), 0x6f9cb4, 0.22, false));
      surface.add(lineSeg(new V3(-SW / 2, 0.01, i * 2.2), new V3(SW / 2, 0.01, i * 2.2), 0x6f9cb4, 0.22, false));
    }

    const iceVol = new THREE.Mesh(
      new THREE.BoxGeometry(11.6, SURF - BOT, 11.6),
      new THREE.MeshStandardMaterial({ color: 0x5fb4dd, transparent: true, opacity: 0.04, roughness: 0.2, metalness: 0.15, side: THREE.BackSide, depthWrite: false })
    );
    iceVol.position.y = (SURF + BOT) / 2;
    A.add(iceVol);

    // faint depth grid on the bedrock plane
    const bed = new THREE.Group();
    for (let i = -4; i <= 4; i++) {
      const p = i * 1.55;
      bed.add(lineSeg(new V3(p, 0, -6.2), new V3(p, 0, 6.2), 0x1b3444, 0.55, false));
      bed.add(lineSeg(new V3(-6.2, 0, p), new V3(6.2, 0, p), 0x1b3444, 0.55, false));
    }
    bed.position.y = BOT - 0.7;
    A.add(bed);

    // 1 km scale bar
    const sbX = -7.4, sbTop = SURF - 0.2, sbBot = BOT + 0.1;
    A.add(lineSeg(new V3(sbX, sbBot, 0.6), new V3(sbX, sbTop, 0.6), 0x6f9cb4, 0.7, false));
    A.add(lineSeg(new V3(sbX - 0.18, sbTop, 0.6), new V3(sbX + 0.18, sbTop, 0.6), 0x6f9cb4, 0.7, false));
    A.add(lineSeg(new V3(sbX - 0.18, sbBot, 0.6), new V3(sbX + 0.18, sbBot, 0.6), 0x6f9cb4, 0.7, false));

    const domGeo = new THREE.SphereGeometry(0.17, 12, 10);
    const domMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const hexPos = [new V3(0, 0, 0)];
    for (let ring = 1; ring <= 2; ring++) {
      const n = ring * 6;
      const rad = ring * 2.35;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (ring === 2 ? 0.26 : 0);
        hexPos.push(new V3(Math.cos(a) * rad, 0, Math.sin(a) * rad));
      }
    }

    const PER_STR = 9;
    const domCount = hexPos.length * PER_STR;
    const doms = new THREE.InstancedMesh(domGeo, domMat, domCount);
    const dummy = new THREE.Object3D();
    const domPos = [];
    const domColor = [];
    const dark = new THREE.Color(0x0d2734);
    let di = 0;
    for (let s = 0; s < hexPos.length; s++) {
      const p = hexPos[s];
      A.add(tube(new V3(p.x, SURF, p.z), new V3(p.x, BOT, p.z), 0.018, 0x4a7f99, { metalness: 0.4, roughness: 0.5, emissive: 0x0d2a38, emissiveIntensity: 0.7 }));
      for (let j = 0; j < PER_STR; j++) {
        const y = SURF - 0.5 - j * ((SURF - BOT - 0.8) / (PER_STR - 1));
        dummyPos(p.x, y, p.z, 1);
        doms.setMatrixAt(di, dummy.matrix);
        doms.setColorAt(di, dark);
        domPos.push(new V3(p.x, y, p.z));
        domColor.push(dark.clone());
        di++;
      }
    }
    doms.instanceColor.needsUpdate = true;
    A.add(doms);

    function dummyPos(x, y, z, s) {
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
    }

    // track
    const TA = new V3(-2.6, BOT - 0.6, 2.1);
    const TB = new V3(2.3, SURF + 1.4, -1.6);
    const tDir = new V3().subVectors(TB, TA).normalize();
    const tLen = TA.distanceTo(TB);

    const track = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, tLen, 8), basic(0xd8f6ff, 0.95));
    track.position.copy(TA).addScaledVector(tDir, tLen / 2);
    track.quaternion.setFromUnitVectors(UP, tDir);
    A.add(track);

    const coneLen = 6.2;
    const coneRad = Math.tan(41 * D2R) * coneLen;
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(coneRad, coneLen, 40, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x4fd0ff, transparent: true, opacity: 0.03, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    );
    cone.position.copy(TA).addScaledVector(tDir, coneLen / 2);
    cone.quaternion.setFromUnitVectors(UP, tDir.clone().negate());
    A.add(cone);

    const ck = cherenkovRings(TA, tDir, [1.4, 2.8, 4.2, 5.6], 0x4fd0ff);
    A.add(ck.grp);

    const muon = glowSprite(0xd8f6ff, 2.2, 0.95);
    A.add(muon);
    const muonCore = ball(0, 0, 0, 0.11, 0xffffff, { emissive: 0x9fe8ff, emissiveIntensity: 2 });
    A.add(muonCore);

    const surfGlow = glowSprite(0x9fd8f0, 7, 0.14);
    surfGlow.position.set(0, SURF + 0.05, 0);
    surfGlow.material.rotation = 0;
    A.add(surfGlow);

    const CPA = {
      surface: new V3(-3.2, SURF + 0.35, 3.2),
      dom: new V3(3.4, 2.6, 2.2),
      track: new V3(1.5, 0.9, 1.2),
      cone: new V3(-2.4, -1.6, 1.8),
      nu: new V3(-3.0, BOT - 0.1, 2.4)
    };

    /* ---------------- B · the event ---------------- */
    const B = G.event;
    B.add(glowDisc(6.2, 0x2a6f96, 0.12));

    const VX = new V3(-0.35, -2.25, 0.2);
    const EX = new V3(1.2, 3.2, 0.4);
    const eDir = new V3().subVectors(EX, VX).normalize();
    const eLen = VX.distanceTo(EX);

    const eTrack = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, eLen, 10), basic(0xd8f6ff, 0.95));
    eTrack.position.copy(VX).addScaledVector(eDir, eLen / 2);
    eTrack.quaternion.setFromUnitVectors(UP, eDir);
    B.add(eTrack);

    const eConeLen = eLen + 0.6;
    const eCone = new THREE.Mesh(
      new THREE.ConeGeometry(Math.tan(41 * D2R) * eConeLen, eConeLen, 44, 1, true),
      new THREE.MeshBasicMaterial({
        map: coneTexture(), color: 0x4fd0ff, transparent: true, opacity: 0.14,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      })
    );
    eCone.position.copy(VX).addScaledVector(eDir, eConeLen / 2);
    eCone.quaternion.setFromUnitVectors(UP, eDir.clone().negate());
    B.add(eCone);

    const ckE = cherenkovRings(VX, eDir, [0.55, 1.1, 1.65, 2.2], 0x4fd0ff);
    B.add(ckE.grp);

    const nuStart = VX.clone().add(new V3(-2.9, -1.5, 1.0));
    B.add(polyline([nuStart, VX], 0xa48bff, 0.9, true));
    const nuGlow = glowSprite(0xa48bff, 1.1, 0.7);
    nuGlow.position.copy(nuStart);
    B.add(nuGlow);

    const vertexGlow = glowSprite(0xbfefff, 2.4, 0.9);
    vertexGlow.position.copy(VX);
    B.add(vertexGlow);
    const vtxCore = ball(VX.x, VX.y, VX.z, 0.15, 0xeafcff, { emissive: 0x9fe8ff, emissiveIntensity: 3.2 });
    B.add(vtxCore);
    B.add(lineSeg(VX.clone().add(new V3(-0.55, 0, 0)), VX.clone().add(new V3(0.55, 0, 0)), 0x9fe8ff, 0.55, false));
    B.add(lineSeg(VX.clone().add(new V3(0, -0.55, 0)), VX.clone().add(new V3(0, 0.55, 0)), 0x9fe8ff, 0.55, false));

    const shower = new THREE.Group();
    const srnd = rng(77);
    for (let i = 0; i < 18; i++) {
      const d = new V3(srnd() - 0.5, srnd() - 0.5, srnd() - 0.5).normalize();
      const l = 0.25 + srnd() * 0.85;
      shower.add(lineSeg(VX, VX.clone().addScaledVector(d, l), 0x9fe8ff, 0.4, false));
    }
    B.add(shower);

    // two instrument strings — the way a real event is read out
    const eventDoms = [];
    const strings = [{ x: -1.25, z: 0.5 }, { x: 1.35, z: 0.1 }];
    strings.forEach(function (st) {
      const top = 3.45, bot = -2.5;
      B.add(tube(new V3(st.x, bot, st.z), new V3(st.x, top, st.z), 0.016, 0x3f6f88, { metalness: 0.4, roughness: 0.5, emissive: 0x0d2a38, emissiveIntensity: 0.6 }));
      for (let j = 0; j < 9; j++) {
        const y = bot + 0.25 + j * ((top - bot - 0.5) / 8);
        const p = new V3(st.x, y, st.z);
        const m = ball(p.x, p.y, p.z, 0.185, 0x061820, { metalness: 0.0, roughness: 0.72, emissive: 0x020a0e, emissiveIntensity: 0.3 });
        B.add(m);
        eventDoms.push({ m: m, p: p });
      }
    });
    // top rail ties the two strings into one detector
    B.add(lineSeg(new V3(-1.25, 3.45, 0.5), new V3(1.35, 3.45, 0.1), 0x3f6f88, 0.5, false));
    B.add(lineSeg(new V3(-1.25, -2.5, 0.5), new V3(1.35, -2.5, 0.1), 0x2a4f60, 0.3, false));

    const perpU = new V3().crossVectors(eDir, UP).normalize();
    const perpV = new V3().crossVectors(eDir, perpU).normalize();

    const vtxRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.018, 6, 48), basic(0x9fe8ff, 0.55));
    vtxRing.position.copy(VX);
    vtxRing.quaternion.setFromUnitVectors(new V3(0, 0, 1), eDir);
    B.add(vtxRing);

    const coneEdgeA = VX.clone().addScaledVector(eDir, eConeLen).addScaledVector(perpU, Math.tan(41 * D2R) * eConeLen);
    const coneEdgeB = VX.clone().addScaledVector(eDir, eConeLen).addScaledVector(perpU, -Math.tan(41 * D2R) * eConeLen);
    B.add(lineSeg(VX, coneEdgeA, 0x4fd0ff, 0.35, true));
    B.add(lineSeg(VX, coneEdgeB, 0x4fd0ff, 0.35, true));
    const eHits = eventDoms.map(function (ed) {
      const w = ed.p.clone().sub(VX);
      const r = w.length();
      const cos = w.clone().normalize().dot(eDir);
      const ang = Math.acos(clamp(cos, -1, 1));
      const s = clamp(w.dot(eDir), 0, eLen);
      const f = cos > 0 ? clamp(1 - ang / (41 * D2R), 0, 1) * clamp(1 - r / 10, 0.25, 1) : 0;
      return { s: s, d: r, f: f };
    });
    let bestIdx = 0;
    eHits.forEach(function (h, i) { if (h.f > eHits[bestIdx].f) bestIdx = i; });

    // faint coordinate plane grounds the event without a solid floor
    const floorB = new THREE.Group();
    for (let i = -3; i <= 3; i++) {
      floorB.add(lineSeg(new V3(i * 1.5, 0, -4.2), new V3(i * 1.5, 0, 4.2), 0x1b3444, 0.5, false));
      floorB.add(lineSeg(new V3(-4.5, 0, i * 1.4), new V3(4.5, 0, i * 1.4), 0x1b3444, 0.5, false));
    }
    floorB.position.y = -2.85;
    B.add(floorB);

    const muonE = glowSprite(0xd8f6ff, 1.7, 0.95);
    B.add(muonE);
    const muonECore = ball(0, 0, 0, 0.1, 0xffffff, { emissive: 0x9fe8ff, emissiveIntensity: 2.4 });
    B.add(muonECore);

    const CPB = {
      nu: nuStart.clone().add(new V3(0.35, 0.4, 0)),
      vtx: VX.clone().add(new V3(0.35, 0.55, 0.25)),
      mu: VX.clone().addScaledVector(eDir, eLen * 0.62).add(new V3(0.55, 0.3, 0.2)),
      cone: VX.clone().addScaledVector(eDir, 1.9).addScaledVector(perpU, -1.3),
      dom: eventDoms[bestIdx].p.clone().add(new V3(0.5, 0.35, 0.3))
    };

    /* ---------------- C · ice sheet cross-section ---------------- */
    const Cn = G.ice;
    const SLAB_W = 9.8;
    const SLAB_D = 2.0;
    const ICE_TOP = 3.45, ICE_BOT = -3.15;
    const ATM_TOP = 4.3, BED_BOT = -4.05;

    const airMat = new THREE.MeshStandardMaterial({
      color: 0x0d1b27, transparent: true, opacity: 0.55, roughness: 0.9, metalness: 0.05,
      emissive: 0x0a1a26, emissiveIntensity: 0.9
    });
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0x3fa8d6, transparent: true, opacity: 0.17, roughness: 0.15, metalness: 0.12,
      emissive: 0x1d6f96, emissiveIntensity: 0.5
    });
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x39424e, roughness: 0.95, metalness: 0.1,
      emissive: 0x1b232c, emissiveIntensity: 0.7
    });

    function slab(y0, y1, m, edgeOp) {
      const h = y1 - y0;
      const b = new THREE.Mesh(new THREE.BoxGeometry(SLAB_W, h, SLAB_D), m);
      b.position.set(0, y0 + h / 2, 0);
      addEdges(b, 0x4f7488, edgeOp === undefined ? 0.4 : edgeOp);
      Cn.add(b);
      return b;
    }

    // soft halo behind the column so the ice volume reads against it
    const halo = glowSprite(0x1f6f92, 17, 0.42);
    halo.position.set(0, 0.2, -2.6);
    Cn.add(halo);
    slab(ICE_BOT, ICE_TOP, iceMat, 0.28);
    slab(ICE_TOP, ATM_TOP, airMat, 0.16);
    slab(BED_BOT, ICE_BOT, bedMat, 0.4);

    // back panel gives the ice column a readable body all the way down
    const backPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(SLAB_W - 0.08, ICE_TOP - ICE_BOT),
      new THREE.MeshBasicMaterial({
        map: vGradTex('rgba(86,182,220,0.55)', 'rgba(26,80,108,0.75)'),
        transparent: true, opacity: 0.9, depthWrite: false
      })
    );
    backPanel.position.set(0, (ICE_TOP + ICE_BOT) / 2, -SLAB_D / 2 - 0.01);
    Cn.add(backPanel);

    // bedrock strata
    for (let i = 0; i < 5; i++) {
      const y = ICE_BOT - 0.3 - i * 0.34;
      Cn.add(lineSeg(new V3(-SLAB_W / 2 + 0.3, y, SLAB_D / 2 + 0.01), new V3(SLAB_W / 2 - 0.3, y, SLAB_D / 2 + 0.01), 0x3a4552, 0.55, false));
    }

    // snow cap
    const cap = new THREE.Mesh(new THREE.BoxGeometry(SLAB_W, 0.12, SLAB_D), mat(0xdceaf3, { roughness: 0.95, metalness: 0.02, emissive: 0x2a4a5c, emissiveIntensity: 0.5 }));
    cap.position.set(0, ICE_TOP + 0.06, 0);
    Cn.add(cap);
    Cn.add(lineSeg(new V3(-SLAB_W / 2, ICE_TOP + 0.13, SLAB_D / 2), new V3(SLAB_W / 2, ICE_TOP + 0.13, SLAB_D / 2), 0xe8f6ff, 0.85, false));

    const bandTop = ICE_TOP - (1450 / 2800) * (ICE_TOP - ICE_BOT);
    const bandBot = ICE_TOP - (2450 / 2800) * (ICE_TOP - ICE_BOT);

    // instrument band
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(SLAB_W - 0.12, bandTop - bandBot, SLAB_D + 0.06),
      new THREE.MeshBasicMaterial({ color: 0x2fb8e8, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    band.position.set(0, (bandTop + bandBot) / 2, 0);
    Cn.add(band);
    Cn.add(lineSeg(new V3(-SLAB_W / 2, bandTop, SLAB_D / 2 + 0.02), new V3(SLAB_W / 2, bandTop, SLAB_D / 2 + 0.02), 0x3fd6f2, 0.8, true));
    Cn.add(lineSeg(new V3(-SLAB_W / 2, bandBot, SLAB_D / 2 + 0.02), new V3(SLAB_W / 2, bandBot, SLAB_D / 2 + 0.02), 0x3fd6f2, 0.8, true));

    // depth ruler on the left
    for (let d = 0; d <= 2800; d += 200) {
      const y = ICE_TOP - (d / 2800) * (ICE_TOP - ICE_BOT);
      const major = d % 1000 === 0;
      Cn.add(lineSeg(new V3(-SLAB_W / 2 - (major ? 0.42 : 0.24), y, SLAB_D / 2), new V3(-SLAB_W / 2, y, SLAB_D / 2), major ? 0x9fc4d8 : 0x4f7488, major ? 0.85 : 0.45, false));
    }
    Cn.add(lineSeg(new V3(-SLAB_W / 2 - 0.02, ICE_TOP, SLAB_D / 2), new V3(-SLAB_W / 2 - 0.02, ICE_BOT, SLAB_D / 2), 0x5b7f96, 0.55, false));

    // crisp outline of the ice body
    const outlinePts = [
      new V3(-SLAB_W / 2, ICE_TOP, SLAB_D / 2 + 0.03),
      new V3(SLAB_W / 2, ICE_TOP, SLAB_D / 2 + 0.03),
      new V3(SLAB_W / 2, ICE_BOT, SLAB_D / 2 + 0.03),
      new V3(-SLAB_W / 2, ICE_BOT, SLAB_D / 2 + 0.03),
      new V3(-SLAB_W / 2, ICE_TOP, SLAB_D / 2 + 0.03)
    ];
    Cn.add(polyline(outlinePts, 0x9fd8f0, 0.6, false));
    Cn.add(lineSeg(new V3(-SLAB_W / 2, BED_BOT, SLAB_D / 2 + 0.03), new V3(SLAB_W / 2, BED_BOT, SLAB_D / 2 + 0.03), 0x8b95a4, 0.7, false));

    [0, 500, 1000, 1500, 2000, 2500, 2800].forEach(function (d) {
      const y = ICE_TOP - (d / 2800) * (ICE_TOP - ICE_BOT);
      const t = textSprite(d === 0 ? '0 m' : '\u2212' + d + ' m', d === 0 ? '#dceaf3' : '#8fb0c4', 0.3, 'left');
      t.position.set(-SLAB_W / 2 + 0.28, y + 0.14, SLAB_D / 2 + 0.35);
      Cn.add(t);
    });

    const iceStrings = [-3.4, -1.7, 0, 1.7, 3.4];
    iceStrings.forEach(function (x) {
      Cn.add(tube(new V3(x, bandTop, SLAB_D / 2 - 0.06), new V3(x, bandBot, SLAB_D / 2 - 0.06), 0.018, 0x7fc8e0, { metalness: 0.4, roughness: 0.4, emissive: 0x2a6f8a, emissiveIntensity: 1 }));
      for (let j = 0; j < 7; j++) {
        const y = bandTop - 0.1 - j * ((bandTop - bandBot - 0.2) / 6);
        Cn.add(ball(x, y, SLAB_D / 2 - 0.02, 0.088, 0x8fe0f5, { emissive: 0x2fb8dc, emissiveIntensity: 1.1 }));
      }
    });

    // air shower
    const showerTop = new V3(1.0, ATM_TOP - 0.02, SLAB_D / 2 - 0.2);
    for (let i = 0; i < 7; i++) {
      const x = -3.8 + i * 1.25;
      Cn.add(lineSeg(new V3(x, ATM_TOP - 0.02, SLAB_D / 2 - 0.2), showerTop, 0x6f8fa8, 0.4, false));
    }
    Cn.add(polyline([showerTop, new V3(0.7, ICE_TOP, SLAB_D / 2 - 0.2), new V3(0.35, -1.55, SLAB_D / 2 - 0.2)], 0x8fb0c8, 0.55, true));

    // neutrino from below, muon through the ice
    const nuA = new V3(-2.2, BED_BOT + 0.06, SLAB_D / 2 - 0.16);
    const nuB = new V3(-0.55, -1.55, SLAB_D / 2 - 0.16);
    Cn.add(polyline([nuA, nuB], 0xa48bff, 0.9, true));
    const iceVertex = glowSprite(0xbfefff, 1.5, 0.85);
    iceVertex.position.copy(nuB);
    Cn.add(iceVertex);
    Cn.add(tube(new V3(-0.55, -1.55, SLAB_D / 2 - 0.16), new V3(0.55, 2.05, SLAB_D / 2 - 0.16), 0.03, 0xd8f6ff, { emissive: 0x9fe8ff, emissiveIntensity: 2.2 }));

    const CPC = {
      surf: new V3(3.3, ICE_TOP + 0.4, SLAB_D / 2 + 0.2),
      band: new V3(3.3, bandTop + 0.1, SLAB_D / 2 + 0.2),
      band2: new V3(3.3, bandBot - 0.1, SLAB_D / 2 + 0.2),
      bed: new V3(3.3, ICE_BOT - 0.42, SLAB_D / 2 + 0.2),
      shower: new V3(1.0, ATM_TOP - 0.05, SLAB_D / 2)

    };

    /* ---------------- update ---------------- */
    let last = 0;
    function update(t) {
      const dt = Math.min(0.05, Math.max(0, t - last));
      last = t;
      const E = P.energy;
      const reach = clamp(0.45 + 0.14 * Math.log10(E), 0.45, 1.05);

      const period = 3.4;
      const ph = (t % period) / period;
      const u = clamp(ph / 0.72, 0, 1);
      const mp = TA.clone().addScaledVector(tDir, u * tLen);
      muon.position.copy(mp);
      muonCore.position.copy(mp);
      muonCore.visible = u > 0.001 && u < 0.999;
      muon.material.opacity = u < 0.999 ? 0.95 : 0;
      muon.scale.setScalar(1.6 + reach * 0.7);
      cone.material.opacity = 0.05 + reach * 0.06;
      for (let i = 0; i < ck.rings.length; i++) {
        const m = ck.rings[i];
        m.material.opacity = (0.2 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.3 - i * 0.55))) * reach;
      }

      const c = new THREE.Color();
      for (let i = 0; i < domPos.length; i++) {
        const p = domPos[i];
        const w = p.clone().sub(TA);
        const s = clamp(w.dot(tDir), 0, tLen);
        const closest = TA.clone().addScaledVector(tDir, s);
        const dist = p.distanceTo(closest);
        const inside = s < u * tLen + 0.4 && dist < Math.tan(41 * D2R) * s + 0.55;
        let inten = 0;
        if (inside) inten = clamp(1 - dist / (1.4 + reach * 1.2), 0, 1);
        inten *= reach;
        c.copy(dark).lerp(new THREE.Color(0x9ff0ff), clamp(inten, 0, 1));
        doms.setColorAt(i, c);
      }
      doms.instanceColor.needsUpdate = true;

      // event
      const ep = (t * 0.4) % 1;
      const eu = clamp(ep / 0.45, 0, 1);
      const mpE = VX.clone().addScaledVector(eDir, eu * eLen);
      muonE.position.copy(mpE);
      muonECore.position.copy(mpE);
      muonE.material.opacity = eu < 0.99 ? 0.95 : 0;
      muonECore.visible = eu > 0.002 && eu < 0.995;
      eTrack.material.opacity = 0.62 + 0.3 * (1 - eu);
      eCone.material.opacity = 0.05 + 0.12 * (0.5 + 0.5 * Math.sin(ep * Math.PI));
      for (let i = 0; i < ckE.rings.length; i++) {
        ckE.rings[i].material.opacity = 0.12 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.2 - i * 0.6));
      }
      shower.rotation.y = t * 0.25;
      vertexGlow.scale.setScalar(2.2 + 0.5 * Math.sin(t * 3));
      for (let i = 0; i < eventDoms.length; i++) {
        const h = eHits[i];
        const reveal = h.s < eu * eLen + 0.3 ? 1 : 0.35;
        const f = h.f * reveal;
        eventDoms[i].m.material.emissive.setHex(f > 0.25 ? 0x4fd0ff : 0x123744);
        eventDoms[i].m.material.emissiveIntensity = 0.35 + f * 4.2;
        eventDoms[i].m.scale.setScalar(1 + f * 0.22);
      }
    }

    const vis = function (k) { return function () { return variant === k; }; };

    return {
      group: g,
      floor: false,
      params: P,
      cameras: {
        array: { theta: 0.46, phi: 1.03, radius: 16.8, target: new V3(0, 0.7, 0) },
        event: { theta: 0.2, phi: 1.28, radius: 10.4, target: new V3(0, 0.55, 0) },
        ice: { theta: 0.1, phi: 1.44, radius: 13.4, target: new V3(0, 0.15, 0) }
      },
      chips: [
        chipDef('冰面', 'Ice surface', '0 m', '2 800 m ice', '#dceaf3', function () { return CPA.surface; }, { small: true, visible: vis('array') }),
        chipDef('光学模块 DOM', 'Optical module', '5 160 in total', '5160', '#3fd6f2', function () { return CPA.dom; }, { visible: vis('array') }),
        chipDef('μ 子径迹', 'Muon track', 'CHERENKOV', '~1 km', '#d8f6ff', function () { return CPA.track; }, { small: true, visible: vis('array') }),
        chipDef('切伦科夫光', 'Cherenkov cone', '41°', 'blue light', '#4fd0ff', function () { return CPA.cone; }, { small: true, visible: vis('array') }),
        chipDef('νμ 中微子', 'Muon neutrino', 'FROM BELOW', null, '#a48bff', function () { return CPA.nu; }, { small: true, visible: vis('array') }),

        chipDef('νμ 中微子', 'Muon neutrino', 'INCOMING', null, '#a48bff', function () { return CPB.nu; }, { visible: vis('event') }),
        chipDef('相互作用顶点', 'Interaction vertex', 'DEEP INELASTIC', null, '#bfefff', function () { return CPB.vtx; }, { small: true, visible: vis('event') }),
        chipDef('μ⁻ 子', 'Muon', 'TRACK', function () { return (P.energy * 0.8 >= 1000 ? (P.energy * 0.8 / 1000).toFixed(1) + ' PeV' : (P.energy * 0.8).toFixed(0) + ' TeV'); }, '#d8f6ff', function () { return CPB.mu; }, { visible: vis('event') }),
        chipDef('切伦科夫锥', 'Cherenkov cone', '41° IN ICE', null, '#4fd0ff', function () { return CPB.cone; }, { small: true, visible: vis('event') }),
        chipDef('DOM 命中', 'DOM hit', 'SIGNAL', null, '#3fd6f2', function () { return CPB.dom; }, { small: true, visible: vis('event') }),

        chipDef('冰面', 'Surface', '0 m', null, '#dceaf3', function () { return CPC.surf; }, { small: true, visible: vis('ice') }),
        chipDef('探测器上沿', 'Array top', '−1 450 m', null, '#3fd6f2', function () { return CPC.band; }, { small: true, visible: vis('ice') }),
        chipDef('探测器下沿', 'Array bottom', '−2 450 m', null, '#3fd6f2', function () { return CPC.band2; }, { small: true, visible: vis('ice') }),
        chipDef('基岩', 'Bedrock', '−2 800 m', null, '#8b95a4', function () { return CPC.bed; }, { small: true, visible: vis('ice') }),
        chipDef('宇宙线簇射', 'Cosmic-ray shower', 'BACKGROUND', null, '#8fb0c8', function () { return CPC.shower; }, { small: true, visible: vis('ice') })
      ],
      setParam: function (k, v) { P[k] = v; },
      setVariant: function (key) {
        variant = key;
        G.array.visible = key === 'array';
        G.event.visible = key === 'event';
        G.ice.visible = key === 'ice';
      },
      update: update,
      readout: function () {
        const E = P.energy;
        const Emu = E * 0.8;
        const hits = Math.round(clamp(26 + 44 * Math.log10(E), 26, 202));
        return [
          { k: 'E', v: E >= 1000 ? (E / 1000).toFixed(1) : E.toFixed(0), u: E >= 1000 ? 'PeV' : 'TeV', c: 'violet' },
          { k: 'emu', v: Emu >= 1000 ? (Emu / 1000).toFixed(1) : Emu.toFixed(0), u: Emu >= 1000 ? 'PeV' : 'TeV', c: 'cyan' },
          { k: 'hits', v: String(hits), u: 'DOM', c: 'amber' }
        ];
      }
    };
  }

  window.SM = {
    buildOpto: buildOpto,
    buildChem: buildChem,
    buildPhys: buildPhys
  };
})();
