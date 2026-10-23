/* ============================================================
   Electricity 3D Lab — shared toolkit
   Palette, materials, geometry helpers, arrows, wires, flows,
   gauges and lamps. Every builder registers itself into EL.SCENES.
   ============================================================ */
window.EL = (function () {
  'use strict';

  const V3 = THREE.Vector3;
  const UP = new THREE.Vector3(0, 1, 0);
  const D2R = Math.PI / 180;
  const clamp = THREE.MathUtils.clamp;
  const lerp = THREE.MathUtils.lerp;
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const C = {
    copper: 0xc07a45,
    copperDark: 0x8a5430,
    brass: 0xd8b46a,
    steel: 0x93a6c0,
    dark: 0x2a3648,
    cyan: 0x3fd6f2,
    blue: 0x4d8dff,
    magenta: 0xff4d8d,
    amber: 0xffb347,
    violet: 0xa48bff,
    green: 0x45e08a,
    white: 0xe8f2ff,
    ceramic: 0xd9d3c4,
    glass: 0xbfe6f2
  };

  /* ---------------- materials & meshes ---------------- */

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
      side: o.side || THREE.FrontSide,
      depthWrite: o.depthWrite === undefined ? true : o.depthWrite
    });
  }

  function glowMat(color, opacity) {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity === undefined ? 0.6 : opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
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

  /* ---------------- glow ---------------- */

  let _glow = null;
  function glowTexture() {
    if (_glow) return _glow;
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const ctx = cv.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,0.85)');
    grd.addColorStop(0.32, 'rgba(255,255,255,0.28)');
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

  function glowSprite(r, color, opacity) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture(), color: color, transparent: true,
      opacity: opacity === undefined ? 0.7 : opacity,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    s.scale.set(r * 2, r * 2, 1);
    return s;
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
      const m = mat(color, { metalness: 0.3, roughness: 0.4, emissive: color, emissiveIntensity: opts.glow === undefined ? 0.5 : opts.glow });
      this.material = m;
      this.shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 10), m);
      this.head = new THREE.Mesh(new THREE.ConeGeometry(headRadius, headLen, 14), m);
      this.shaft.castShadow = false;
      this.head.castShadow = false;
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
    setColor(c) { this.material.color.setHex(c); this.material.emissive.setHex(c); }
  }

  /* ---------------- rope / tube ---------------- */

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
      const geo = new THREE.CylinderGeometry(radius, radius, 1, 6, 1, false);
      const material = mat(color === undefined ? 0xd8c8a6 : color, { metalness: 0.05, roughness: 0.95 });
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

  function tube(a, b, r, color, opts) {
    const d = new V3().subVectors(b, a);
    const len = d.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), mat(color, opts || { metalness: 0.55, roughness: 0.35 }));
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(UP, d.normalize());
    return m;
  }

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

  /* right-angle routed wire: straight tubes + elbow spheres */
  function wire(points, r, color, opts) {
    const g = new THREE.Group();
    const m = mat(color === undefined ? C.copper : color, opts || { metalness: 0.75, roughness: 0.32 });
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      if (a.distanceTo(b) < 1e-4) continue;
      const t = tube(a, b, r, 0xffffff, null);
      t.material.dispose();
      t.material = m;
      g.add(t);
    }
    for (let i = 1; i < points.length - 1; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), m);
      s.position.copy(points[i]);
      g.add(s);
    }
    return g;
  }

  function curveTube(points, r, color, closed, segs, opts) {
    const curve = new THREE.CatmullRomCurve3(points, !!closed, 'catmullrom', 0.12);
    const geo = new THREE.TubeGeometry(curve, segs || Math.max(48, points.length * 8), r, 8, !!closed);
    const m = new THREE.Mesh(geo, mat(color, opts || { metalness: 0.5, roughness: 0.4, emissive: color, emissiveIntensity: 0.25 }));
    m.castShadow = false;
    m.curve = curve;
    return m;
  }

  /* helix coil along x-axis-ish, centred at origin */
  function coil(turns, radius, length, r, color, axis) {
    const pts = [];
    const n = Math.max(24, turns * 22);
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const a = u * turns * Math.PI * 2;
      const x = (u - 0.5) * length;
      pts.push(new V3(x, Math.cos(a) * radius, Math.sin(a) * radius));
    }
    const g = new THREE.Group();
    const m = curveTube(pts, r, color === undefined ? C.copper : color, false, n, { metalness: 0.85, roughness: 0.28, emissive: color === undefined ? C.copper : color, emissiveIntensity: 0.18 });
    g.add(m);
    if (axis === 'y') g.rotation.z = Math.PI / 2;
    if (axis === 'z') g.rotation.y = Math.PI / 2;
    return g;
  }

  /* ---------------- flowing charges ---------------- */

  class Flow {
    constructor(count, color, radius, curve, opts) {
      opts = opts || {};
      this.group = new THREE.Group();
      this.dots = [];
      const geo = new THREE.SphereGeometry(radius || 0.055, 10, 8);
      const m = new THREE.MeshBasicMaterial({ color: color });
      for (let i = 0; i < count; i++) {
        const d = new THREE.Mesh(geo, m);
        this.dots.push(d);
        this.group.add(d);
      }
      this.curve = curve;
      this.count = count;
      this.offset = 0;
      this.trail = opts.trail || 0;
      this._p = new V3();
    }
    setCurve(c) { this.curve = c; }
    update(t, speed) {
      if (!this.curve) return;
      const n = this.count;
      for (let i = 0; i < n; i++) {
        let u = (t * speed + i / n) % 1;
        if (u < 0) u += 1;
        this.curve.getPoint(u, this._p);
        this.dots[i].position.copy(this._p);
      }
    }
    setVisible(v) { this.group.visible = v; }
    setColor(c) {
      this.dots.forEach(d => d.material.color.setHex(c));
    }
  }

  /* ---------------- charge glyphs ---------------- */

  function sign(type, size, color) {
    const g = new THREE.Group();
    const s = size || 0.1;
    const m = mat(color || (type === '+' ? C.magenta : C.blue), { metalness: 0.2, roughness: 0.35, emissive: color || (type === '+' ? C.magenta : C.blue), emissiveIntensity: 0.9 });
    const a = new THREE.Mesh(new THREE.BoxGeometry(s * 2, s * 0.42, s * 0.42), m);
    g.add(a);
    if (type === '+') {
      const b = new THREE.Mesh(new THREE.BoxGeometry(s * 0.42, s * 2, s * 0.42), m);
      g.add(b);
    }
    return g;
  }

  /* ---------------- canvas letter ---------------- */

  function letterTexture(ch, color) {
    const S = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = color || '#1b2534';
    ctx.font = 'bold 96px ui-monospace, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, S / 2, S / 2 + 4);
    const t = new THREE.CanvasTexture(cv);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  function letterPlane(ch, size, color) {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({ map: letterTexture(ch, color), transparent: true, depthWrite: false })
    );
  }

  /* ---------------- lamp ---------------- */

  function lamp(r) {
    const g = new THREE.Group();
    const R = r || 0.3;
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xdff2ff, metalness: 0.1, roughness: 0.08,
      transparent: true, opacity: 0.24, emissive: 0xffd9a0, emissiveIntensity: 0.0,
      depthWrite: false, side: THREE.DoubleSide
    });
    const glass = new THREE.Mesh(new THREE.SphereGeometry(R, 26, 20), glassMat);
    glass.position.y = R * 0.92;
    g.add(glass);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.42, R * 0.5, R * 0.5, 18), mat(0xb9c6d4, { metalness: 0.95, roughness: 0.3 }));
    neck.position.y = R * 0.06;
    g.add(neck);
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.5, R * 0.5, R * 0.34, 18), mat(0xa8946a, { metalness: 0.9, roughness: 0.45 }));
    screw.position.y = -R * 0.28;
    g.add(screw);

    const filMat = mat(0xffc46b, { metalness: 0.6, roughness: 0.3, emissive: 0xffb347, emissiveIntensity: 0.3 });
    const fil = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R * 0.2, R * 0.022, 8, 26), filMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = R * 0.92;
    fil.add(ring);
    for (let i = 0; i < 2; i++) {
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.016, R * 0.016, R * 0.55, 6), filMat);
      lead.position.set((i ? 1 : -1) * R * 0.2, R * 0.62, 0);
      fil.add(lead);
    }
    g.add(fil);

    const halo = glowSprite(R * 2.6, 0xffd7a0, 0);
    halo.position.y = R * 0.92;
    g.add(halo);

    const light = new THREE.PointLight(0xffcf8a, 0, R * 16, 2);
    light.position.y = R * 0.92;
    g.add(light);

    return {
      group: g,
      glass: glassMat,
      fil: filMat,
      halo: halo,
      light: light,
      set(b) {
        b = clamp(b, 0, 1.6);
        /* keep the glass translucent so the filament stays the brightest thing */
        glassMat.emissiveIntensity = b * 1.0;
        glassMat.opacity = 0.14 + b * 0.2;
        filMat.emissiveIntensity = 0.3 + b * 8.0;
        halo.material.opacity = b * 0.72;
        halo.scale.setScalar(R * (2.1 + b * 2.0));
        light.intensity = b * 2.4;
      }
    };
  }

  /* ---------------- gauge face ---------------- */

  function gaugeTexture(label, unit, max, opts) {
    opts = opts || {};
    const S = 512;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, S, S);

    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S * 0.47, 0, Math.PI * 2);
    ctx.fillStyle = opts.face || '#eef3f9';
    ctx.fill();
    ctx.lineWidth = S * 0.022;
    ctx.strokeStyle = opts.rim || '#1b2534';
    ctx.stroke();

    const a0 = Math.PI * 0.78, a1 = Math.PI * 2.22;
    const N = opts.ticks || 10;
    ctx.strokeStyle = '#2a3648';
    ctx.lineCap = 'round';
    for (let i = 0; i <= N; i++) {
      const a = a0 + (a1 - a0) * i / N;
      const big = i % 2 === 0;
      const r1 = S * 0.40, r2 = S * (big ? 0.33 : 0.36);
      ctx.beginPath();
      ctx.moveTo(S / 2 + Math.cos(a) * r1, S / 2 + Math.sin(a) * r1);
      ctx.lineTo(S / 2 + Math.cos(a) * r2, S / 2 + Math.sin(a) * r2);
      ctx.lineWidth = big ? S * 0.022 : S * 0.012;
      ctx.stroke();
    }

    ctx.fillStyle = '#1b2534';
    ctx.font = 'bold ' + Math.round(S * 0.26) + 'px ui-monospace, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, S / 2, S * 0.38);

    ctx.fillStyle = '#5b6f88';
    ctx.font = '600 ' + Math.round(S * 0.07) + 'px ui-monospace, Menlo, monospace';
    ctx.fillText(unit || '', S / 2, S * 0.63);

    const tex = new THREE.CanvasTexture(cv);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    return tex;
  }

  function dial(r, label, unit, opts) {
    opts = opts || {};
    const g = new THREE.Group();
    const R = r || 0.55;

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(R, R * 0.96, R * 0.34, 40),
      mat(opts.body || 0x1b2431, { metalness: 0.4, roughness: 0.55 })
    );
    body.rotation.x = Math.PI / 2;
    g.add(body);

    const tex = gaugeTexture(label, unit, 1, opts);
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(R * 0.94, 48),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.05, emissive: 0xffffff, emissiveIntensity: 0.04, emissiveMap: tex })
    );
    face.position.z = R * 0.175;
    g.add(face);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(R * 0.95, R * 0.035, 10, 48), mat(0x93a6c0, { metalness: 1, roughness: 0.25 }));
    ring.position.z = R * 0.17;
    g.add(ring);

    const needle = new THREE.Group();
    needle.position.z = R * 0.2;
    const nm = mat(0xff4d5e, { metalness: 0.3, roughness: 0.4, emissive: 0xff2d44, emissiveIntensity: 0.5 });
    const nk = new THREE.Mesh(new THREE.BoxGeometry(R * 0.035, R * 0.74, R * 0.02), nm);
    nk.position.y = R * 0.34;
    needle.add(nk);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.09, R * 0.09, R * 0.03, 16), mat(0x2a3648, { metalness: 0.8, roughness: 0.3 }));
    hub.rotation.x = Math.PI / 2;
    hub.position.z = R * 0.01;
    needle.add(hub);
    g.add(needle);

    const A0 = Math.PI * 0.78, A1 = Math.PI * 2.22;
    return {
      group: g,
      needle: needle,
      set(u) {
        const a = A0 + (A1 - A0) * clamp(u, -0.04, 1.04);
        needle.rotation.z = -a + Math.PI / 2;
      }
    };
  }

  /* ---------------- base slab ---------------- */

  function slab(w, d, h, color) {
    const g = new THREE.Group();
    const m = mesh(new THREE.BoxGeometry(w, h || 0.16, d), mat(color || 0x111a26, { metalness: 0.35, roughness: 0.78 }), 0, (h || 0.16) / 2, 0);
    addEdges(m, 0x2b4159, 0.55);
    g.add(m);
    return g;
  }

  function chipDef(zh, en, sub, value, color, pos, opts) {
    opts = opts || {};
    return {
      zh: zh, en: en, sub: sub, value: value, color: color, pos: pos,
      small: !!opts.small, title: !!opts.title, visible: opts.visible || null
    };
  }

  const SCENES = {};

  function register(name, fn) { SCENES[name] = fn; }

  return {
    V3, UP, D2R, clamp, lerp, ease, C,
    mat, glowMat, addEdges, mesh, lineSeg, disposeTree, clearGroup,
    glowTexture, glowDisc, glowSprite,
    Arrow, Rope, tube, bar, wire, curveTube, coil, Flow, sign, lamp,
    gaugeTexture, dial, slab, chipDef, letterTexture, letterPlane,
    SCENES, register
  };
})();
