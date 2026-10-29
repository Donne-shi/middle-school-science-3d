/* =============================================================================
   疫苗与抗生素 · 三维引擎
   engine.js — 渲染器 / 轨道控制 / 拾取 / 程序化模型工厂 / 屏幕标注
   ========================================================================== */
window.ENGINE = (function () {
  "use strict";

  var T = window.THREE;

  /* ------------------------------------------------------------ 调色板 --- */
  var PAL = {
    vac: 0x45C9B8,
    vacDeep: 0x1E6B64,
    vacPale: 0x9BF0E2,
    abx: 0xE9B44C,
    abxDeep: 0x7A5613,
    abxPale: 0xF8D891,
    path: 0xE2605F,
    pathDeep: 0x6E2426,
    pathPale: 0xFF9C93,
    immune: 0x8A9BF0,
    ink: 0xE7EDF2,
    glass: 0xA8DCE8,
    cyto: 0x2E6D6A
  };

  var E = {
    PAL: PAL,
    time: 0,
    paused: false,
    quality: 1
  };

  var renderer, scene, camera, canvasEl;
  var W = 1, H = 1, DPR = 1;
  var current = null;
  var raycaster = new T.Raycaster();
  var ndc = new T.Vector2();
  var pointer = { x: 0, y: 0, down: false, sx: 0, sy: 0, moved: 0 };
  var activePointers = new Map();
  var pinchStart = 0, pinchRadius = 0;
  var marksEl = null, marks = [], selectedMark = null;
  var texCache = {};

  /* ============================================================ 控制器 === */
  var ctl = {
    theta: -0.55, phi: 1.36, radius: 9,
    tTheta: -0.55, tPhi: 1.36, tRadius: 9,
    target: new T.Vector3(0, 0, 0),
    tTarget: new T.Vector3(0, 0, 0),
    minR: 2.6, maxR: 26,
    autoSpin: 0,
    damping: 7.5,
    enabled: true
  };

  /* 窄屏时把镜头拉远，保证横向构图不被裁掉 */
  var _look = new T.Vector3();

  function frameScale() {
    var a = camera.aspect || 1.6;
    // 宽屏两侧有讲稿面板与实验台，整体退后一点给中间让出位置
    return a >= 1.5 ? 1.12 : Math.min(2.05, 1.62 / a);
  }

  /* 左侧讲稿面板占据画面，用镜头平移（lens shift）把主体推到右侧空白区 */
  var _filmOff = -999;
  function lensShift() {
    var a = camera.aspect || 1.6;
    var f = a <= 1.15 ? 0 : Math.min(0.095, (a - 1.15) * 0.17);
    var skew = -f * a * 2 * Math.tan(camera.fov * Math.PI / 360) * 35;
    if (Math.abs(skew - _filmOff) > 0.002) {
      _filmOff = skew;
      camera.filmOffset = skew;
      camera.updateProjectionMatrix();
    }
  }

  function applyCamera() {
    var sp = Math.sin(ctl.phi);
    var r = ctl.radius * frameScale();
    // 窄屏文字在顶部，构图回正；宽屏由 lensShift 负责右移
    var lf = camera.aspect >= 1.5 ? 1 : 0.18;
    _look.copy(ctl.target);
    _look.x *= lf;
    camera.position.set(
      r * sp * Math.sin(ctl.theta),
      r * Math.cos(ctl.phi),
      r * sp * Math.cos(ctl.theta)
    );
    camera.position.add(_look);
    camera.lookAt(_look);
    lensShift();
  }

  function updateCamera(dt) {
    var k = 1 - Math.exp(-ctl.damping * Math.min(dt, 0.05));
    if (ctl.autoSpin && !pointer.down) ctl.tTheta += ctl.autoSpin * Math.min(dt, 0.05);
    ctl.theta += (ctl.tTheta - ctl.theta) * k;
    ctl.phi += (ctl.tPhi - ctl.phi) * k;
    ctl.radius += (ctl.tRadius - ctl.radius) * k;
    ctl.target.lerp(ctl.tTarget, k);
    applyCamera();
  }

  E.orbit = {
    set: function (o) {
      if (o.theta != null) { ctl.theta = ctl.tTheta = o.theta; }
      if (o.phi != null) { ctl.phi = ctl.tPhi = o.phi; }
      if (o.radius != null) { ctl.radius = ctl.tRadius = o.radius; }
      if (o.target) { ctl.target.copy(o.target); ctl.tTarget.copy(o.target); }
      applyCamera();
    },
    ease: function (o) {
      if (o.theta != null) ctl.tTheta = o.theta;
      if (o.phi != null) ctl.tPhi = o.phi;
      if (o.radius != null) ctl.tRadius = Math.max(ctl.minR, Math.min(ctl.maxR, o.radius));
      if (o.target) ctl.tTarget.copy(o.target);
    },
    spin: function (v) { ctl.autoSpin = v; },
    limits: function (min, max) { ctl.minR = min; ctl.maxR = max; },
    get: function () { return ctl; }
  };

  /* ============================================================ 纹理 === */
  function radialTex(inner, mid, edge) {
    var key = "r" + inner + mid + edge;
    if (texCache[key]) return texCache[key];
    var c = document.createElement("canvas");
    c.width = c.height = 128;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, inner);
    grd.addColorStop(0.42, mid);
    grd.addColorStop(1, edge);
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    var t = new T.CanvasTexture(c);
    t.needsUpdate = true;
    texCache[key] = t;
    return t;
  }

  E.tex = {
    glow: function () { return radialTex("rgba(255,255,255,1)", "rgba(255,255,255,.42)", "rgba(255,255,255,0)"); },
    soft: function () { return radialTex("rgba(255,255,255,.9)", "rgba(255,255,255,.22)", "rgba(255,255,255,0)"); }
  };

  /* ============================================================ 材质 === */
  function mat(color, o) {
    o = o || {};
    return new T.MeshStandardMaterial({
      color: color,
      roughness: o.rough != null ? o.rough : 0.42,
      metalness: o.metal != null ? o.metal : 0.08,
      emissive: o.emissive != null ? o.emissive : color,
      emissiveIntensity: o.ei != null ? o.ei : 0.06,
      transparent: o.opacity != null && o.opacity < 1,
      opacity: o.opacity != null ? o.opacity : 1,
      side: o.side || T.FrontSide,
      flatShading: !!o.flat,
      depthWrite: o.depthWrite != null ? o.depthWrite : true
    });
  }

  function glassMat(color, o) {
    o = o || {};
    return new T.MeshStandardMaterial({
      color: color,
      roughness: 0.22,
      metalness: 0.0,
      emissive: color,
      emissiveIntensity: o.ei != null ? o.ei : 0.2,
      transparent: true,
      opacity: o.opacity != null ? o.opacity : 0.24,
      side: T.DoubleSide,
      depthWrite: false
    });
  }

  /* ======================================================= 几何工具 === */
  // 黄金角球面分布
  function fibSphere(n, cb) {
    var ga = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < n; i++) {
      var y = 1 - (i / Math.max(1, n - 1)) * 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = ga * i;
      cb(new T.Vector3(Math.cos(th) * r, y, Math.sin(th) * r), i / Math.max(1, n - 1));
    }
  }

  function shade(hex, f) {
    var r = ((hex >> 16) & 255) * f;
    var g = ((hex >> 8) & 255) * f;
    var b = (hex & 255) * f;
    return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
  }

  function alignTo(mesh, dir) {
    mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.clone().normalize());
  }

  /* ====================================================== 模型：病毒 === */
  // opt: { radius, spikes, color, opacity, dim, broken (断裂 RNA), showGenome }
  function makeVirus(opt) {
    opt = opt || {};
    var g = new T.Group();
    var R = opt.radius || 1;
    var col = opt.color != null ? opt.color : PAL.path;
    var dim = !!opt.dim;
    var spikes = opt.spikes != null ? opt.spikes : 40;

    // 包膜
    var envMat = new T.MeshStandardMaterial({
      color: col,
      roughness: 0.34,
      metalness: 0.02,
      emissive: col,
      emissiveIntensity: dim ? 0.03 : 0.1,
      transparent: true,
      opacity: opt.opacity != null ? opt.opacity : (dim ? 0.26 : 0.28),
      side: T.DoubleSide,
      depthWrite: false
    });
    var env = new T.Mesh(new T.IcosahedronGeometry(R, 4), envMat);
    g.add(env);

    // 衣壳（内层，多面体感）
    var capMat = new T.MeshStandardMaterial({
      color: dim ? 0x2E1B1D : 0x43191D,
      roughness: 0.62,
      metalness: 0.04,
      emissive: col,
      emissiveIntensity: dim ? 0.02 : 0.07,
      transparent: true,
      opacity: 0.9,
      flatShading: true
    });
    var capsid = new T.Mesh(new T.IcosahedronGeometry(R * 0.86, 1), capMat);
    g.add(capsid);

    // 遗传物质
    var genMat = new T.MeshStandardMaterial({
      color: 0xF2C97A, roughness: 0.5, metalness: 0.1,
      emissive: 0xF2C97A, emissiveIntensity: opt.broken ? 0.1 : 0.5
    });
    if (opt.showGenome !== false) {
      var segs = opt.broken ? 3 : 1;
      for (var s = 0; s < segs; s++) {
        var pts = [], n = 14;
        var seed = s * 2.7 + 0.6;
        for (var i = 0; i <= n; i++) {
          var t = i / n;
          var a = t * Math.PI * 2.3 + seed;
          var sc = R * 0.42;
          var shrink = opt.broken ? (0.55 + 0.45 * Math.sin(t * Math.PI)) : 1;
          pts.push(new T.Vector3(
            Math.cos(a) * sc * (0.75 + 0.25 * Math.sin(a * 1.7 + seed)) * shrink,
            (t - 0.5) * R * 1.1 * shrink,
            Math.sin(a) * sc * (0.7 + 0.3 * Math.cos(a * 1.3)) * shrink
          ));
        }
        var curve = new T.CatmullRomCurve3(pts);
        var tube = new T.Mesh(new T.TubeGeometry(curve, 40, R * 0.022, 5, false), genMat);
        g.add(tube);
      }
    }

    // 刺突
    var spkCol = dim ? 0x6A4A48 : col;
    var spkMat = new T.MeshStandardMaterial({
      color: spkCol, roughness: 0.4, metalness: 0.1,
      emissive: dim ? 0x3A2224 : col, emissiveIntensity: dim ? 0.1 : 0.3
    });
    var stemGeo = new T.CylinderGeometry(R * 0.018, R * 0.015, R * 0.36, 5);
    var headGeo = new T.SphereGeometry(R * 0.05, 9, 7);

    fibSphere(spikes, function (dir) {
      var stem = new T.Mesh(stemGeo, spkMat);
      var base = dir.clone().multiplyScalar(R * 0.96);
      stem.position.copy(base).add(dir.clone().multiplyScalar(R * 0.18));
      alignTo(stem, dir);
      g.add(stem);

      var head = new T.Mesh(headGeo, spkMat);
      head.position.copy(base).add(dir.clone().multiplyScalar(R * 0.4));
      head.scale.set(1.15, 1.5, 1.15);
      alignTo(head, dir);
      g.add(head);
    });

    g.userData.parts = { envelope: env, capsid: capsid };
    return g;
  }

  /* ====================================================== 模型：细菌 === */
  // opt: { radius, length, color, opacity, flagella, plasmid, wallOpacity }
  function makeBacterium(opt) {
    opt = opt || {};
    var g = new T.Group();
    var R = opt.radius || 0.58;
    var L = opt.length || 1.9;
    var col = opt.color != null ? opt.color : 0x3E8F86;

    // 细胞质
    var cytoMat = new T.MeshStandardMaterial({
      color: 0x0C2C2A,
      roughness: 0.6,
      metalness: 0.04,
      emissive: col,
      emissiveIntensity: opt.cytoEi != null ? opt.cytoEi : 0.42,
      transparent: true,
      opacity: opt.cytoOpacity != null ? opt.cytoOpacity : (opt.opacity != null ? opt.opacity : 0.24),
      side: T.DoubleSide,
      depthWrite: false
    });
    var body = new T.Mesh(new T.CapsuleGeometry(R, L, 16, 32), cytoMat);
    body.rotation.z = Math.PI / 2;
    g.add(body);

    // 细胞壁
    var wallCol = opt.wallColor != null ? opt.wallColor : 0xE9B44C;
    var wallMat = new T.MeshStandardMaterial({
      color: wallCol,
      roughness: 0.3,
      metalness: 0.12,
      emissive: wallCol,
      emissiveIntensity: opt.wallEi != null ? opt.wallEi : 0.24,
      transparent: true,
      opacity: opt.wallOpacity != null ? opt.wallOpacity : 0.14,
      side: T.DoubleSide,
      depthWrite: false
    });
    var wall = new T.Mesh(new T.CapsuleGeometry(R * 1.075, L * 1.02, 16, 36), wallMat);
    wall.rotation.z = Math.PI / 2;
    g.add(wall);

    // 网格线框，暗示肽聚糖网
    var netMat = new T.MeshBasicMaterial({
      color: wallCol, wireframe: true, transparent: true, opacity: 0.12
    });
    var net = new T.Mesh(new T.CapsuleGeometry(R * 1.08, L * 1.02, 8, 18), netMat);
    net.rotation.z = Math.PI / 2;
    g.add(net);

    // 核糖体
    var riboMat = new T.MeshStandardMaterial({
      color: 0x54C9BB, roughness: 0.5, metalness: 0.1,
      emissive: 0x45C9B8, emissiveIntensity: 0.42
    });
    var riboGeo = new T.SphereGeometry(R * 0.056, 8, 6);
    var ribos = [];
    for (var i = 0; i < 90; i++) {
      var m = new T.Mesh(riboGeo, riboMat);
      var a = Math.random() * Math.PI * 2;
      var rr = Math.sqrt(Math.random()) * R * 0.76;
      m.position.set(
        (Math.random() - 0.5) * L * 0.94,
        Math.cos(a) * rr,
        Math.sin(a) * rr
      );
      m.scale.setScalar(0.7 + Math.random() * 0.7);
      g.add(m);
      ribos.push(m);
    }

    // 拟核 DNA
    var dnaPts = [];
    for (var j = 0; j <= 60; j++) {
      var t = j / 60;
      var ang = t * Math.PI * 5.2;
      dnaPts.push(new T.Vector3(
        Math.sin(t * Math.PI * 1.6 - 0.8) * L * 0.38,
        Math.sin(ang) * R * 0.46,
        Math.cos(ang) * R * 0.46
      ));
    }
    var dnaCurve = new T.CatmullRomCurve3(dnaPts, true);
    var dnaMat = new T.MeshStandardMaterial({
      color: 0x6B4E1E, roughness: 0.7, metalness: 0.05,
      emissive: 0xF2C97A, emissiveIntensity: 0.55
    });
    var dna = new T.Mesh(new T.TubeGeometry(dnaCurve, 180, R * 0.026, 5, true), dnaMat);
    g.add(dna);

    // 质粒
    var plasmids = [];
    if (opt.plasmid !== false) {
      var plMat = new T.MeshStandardMaterial({
        color: 0xE2605F, roughness: 0.4, metalness: 0.2,
        emissive: 0xE2605F, emissiveIntensity: 0.38
      });
      for (var p = 0; p < 3; p++) {
        var pl = new T.Mesh(new T.TorusGeometry(R * 0.17, R * 0.022, 8, 26), plMat);
        pl.position.set((p - 1) * L * 0.3, R * 0.1 * (p - 1), R * 0.34);
        pl.rotation.set(Math.random(), Math.random() * 3, Math.random());
        g.add(pl);
        plasmids.push(pl);
      }
    }

    // 鞭毛
    var fl = new T.Group();
    var flMat = new T.MeshStandardMaterial({
      color: 0x9BB0B8, roughness: 0.55, metalness: 0.1,
      emissive: 0x45C9B8, emissiveIntensity: 0.12
    });
    var nf = opt.flagella != null ? opt.flagella : 3;
    for (var f = 0; f < nf; f++) {
      var off = (f - (nf - 1) / 2) * 0.34;
      var pts = [];
      for (var s = 0; s <= 46; s++) {
        var tt = s / 46;
        var aa = tt * Math.PI * 5.4;
        pts.push(new T.Vector3(
          -(L / 2 + R * 0.7 + tt * 1.55),
          off + Math.sin(aa) * 0.2 * (0.35 + tt * 0.9),
          Math.cos(aa) * 0.2 * (0.35 + tt * 0.9)
        ));
      }
      var c = new T.CatmullRomCurve3(pts);
      fl.add(new T.Mesh(new T.TubeGeometry(c, 90, R * 0.022, 5, false), flMat));
    }
    g.add(fl);

    // 菌毛
    var pilMat = new T.MeshStandardMaterial({
      color: 0x7E9AA0, roughness: 0.7, transparent: true, opacity: 0.6
    });
    var pilGeo = new T.CylinderGeometry(R * 0.012, R * 0.008, R * 0.42, 4);
    for (var q = 0; q < 26; q++) {
      var pm = new T.Mesh(pilGeo, pilMat);
      var pa = Math.random() * Math.PI * 2;
      var px = (Math.random() - 0.5) * L * 0.9;
      pm.position.set(px, Math.cos(pa) * R * 1.06, Math.sin(pa) * R * 1.06);
      pm.rotation.set(pa, 0, (Math.random() - 0.5) * 0.8);
      g.add(pm);
    }

    g.userData.parts = {
      wall: wall, membrane: body, net: net, dna: dna,
      ribosomes: ribos, plasmids: plasmids, flagella: fl, wallMat: wallMat
    };
    return g;
  }

  /* ====================================================== 模型：抗体 === */
  function makeAntibody(scale, color) {
    scale = scale || 1;
    color = color != null ? color : PAL.vac;
    var g = new T.Group();
    var m = new T.MeshStandardMaterial({
      color: shade(color, 0.22), roughness: 0.42, metalness: 0.14,
      emissive: color, emissiveIntensity: 0.62
    });
    var thick = 0.052;

    var stem = new T.Mesh(new T.CylinderGeometry(thick, thick * 0.9, 0.5, 7), m);
    stem.position.y = -0.22;
    g.add(stem);

    var hinge = new T.Mesh(new T.SphereGeometry(thick * 1.25, 8, 6), m);
    g.add(hinge);

    [1, -1].forEach(function (s) {
      var arm = new T.Mesh(new T.CylinderGeometry(thick * 0.95, thick, 0.44, 7), m);
      arm.position.set(s * 0.14, 0.15, 0);
      arm.rotation.z = -s * 0.62;
      g.add(arm);

      var tip = new T.Mesh(new T.SphereGeometry(thick * 1.15, 8, 6), m);
      tip.position.set(s * 0.26, 0.34, 0);
      g.add(tip);
    });

    g.scale.setScalar(scale);
    return g;
  }

  /* ==================================================== 模型：B 细胞 === */
  function makeBCell(r, opt) {
    opt = opt || {};
    r = r || 1;
    var g = new T.Group();
    var c = opt.color != null ? opt.color : PAL.vacDeep;
    // 浅色主题下用实色壳 + 淡色胞质，靠明度差而不是发光表达体积
    var shellMat = new T.MeshStandardMaterial({
      color: shade(c === PAL.vacDeep ? PAL.vac : c, 0.80),
      roughness: 0.55, metalness: 0.03,
      emissive: 0x0E8577, emissiveIntensity: 0.06,
      transparent: true, opacity: 0.92, depthWrite: true
    });
    shellMat.userData.keep = true;
    var shell = new T.Mesh(new T.SphereGeometry(r, 44, 32), shellMat);
    g.add(shell);

    var coreMat = new T.MeshStandardMaterial({
      color: 0xEAF7F4, roughness: 0.9, metalness: 0,
      emissive: 0x000000, emissiveIntensity: 0,
      transparent: true, opacity: 0.45
    });
    coreMat.userData.keep = true;
    var core = new T.Mesh(new T.SphereGeometry(r * 0.72, 32, 24), coreMat);
    g.add(core);

    // 表面受体（Y 形）
    var receptors = new T.Group();
    fibSphere(opt.receptors || 16, function (dir) {
      var ab = makeAntibody(r * 0.3, PAL.vacDeep);
      var p = dir.clone().multiplyScalar(r * 0.99);
      ab.position.copy(p);
      ab.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
      receptors.add(ab);
    });
    g.add(receptors);

    g.userData.parts = { shell: shell, core: core, receptors: receptors };
    return g;
  }

  /* ============================================= 模型：脂质纳米颗粒 === */
  function makeLNP(r, opt) {
    opt = opt || {};
    r = r || 1;
    var g = new T.Group();

    var shell = new T.Mesh(
      new T.IcosahedronGeometry(r, 3),
      new T.MeshStandardMaterial({
        color: PAL.immune, roughness: 0.28, metalness: 0.1,
        emissive: PAL.immune, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.3, side: T.DoubleSide, depthWrite: false
      })
    );
    g.add(shell);

    var inner = new T.Mesh(
      new T.IcosahedronGeometry(r * 0.82, 2),
      new T.MeshStandardMaterial({
        color: 0x4C5CA8, roughness: 0.6,
        transparent: true, opacity: 0.34, depthWrite: false
      })
    );
    g.add(inner);

    // mRNA 链
    var pts = [];
    for (var i = 0; i <= 70; i++) {
      var t = i / 70;
      var a = t * Math.PI * 5.5;
      var rr = r * 0.6 * (0.55 + 0.45 * Math.sin(t * Math.PI));
      pts.push(new T.Vector3(
        Math.cos(a) * rr,
        (t - 0.5) * r * 1.15,
        Math.sin(a) * rr
      ));
    }
    var curve = new T.CatmullRomCurve3(pts);
    var mrna = new T.Mesh(
      new T.TubeGeometry(curve, 120, r * 0.028, 5, false),
      new T.MeshStandardMaterial({
        color: PAL.vacPale, roughness: 0.35, metalness: 0.2,
        emissive: PAL.vac, emissiveIntensity: 0.75
      })
    );
    g.add(mrna);

    // 表面 PEG 链
    var pegMat = new T.MeshStandardMaterial({
      color: 0xB9C6FF, roughness: 0.4, emissive: PAL.immune, emissiveIntensity: 0.4
    });
    var pegGeo = new T.CylinderGeometry(r * 0.012, r * 0.008, r * 0.2, 4);
    fibSphere(opt.pegs || 22, function (dir) {
      var p = new T.Mesh(pegGeo, pegMat);
      p.position.copy(dir.clone().multiplyScalar(r * 1.06));
      alignTo(p, dir);
      g.add(p);
    });

    g.userData.parts = { shell: shell, inner: inner, mrna: mrna };
    return g;
  }

  /* ==================================================== 模型：刺突蛋白 === */
  function makeSpike(h, color) {
    h = h || 1;
    color = color != null ? color : PAL.path;
    var g = new T.Group();
    var m = new T.MeshStandardMaterial({
      color: color, roughness: 0.35, metalness: 0.12,
      emissive: color, emissiveIntensity: 0.34
    });
    var stem = new T.Mesh(new T.CylinderGeometry(h * 0.07, h * 0.05, h * 0.62, 7), m);
    stem.position.y = h * 0.31;
    g.add(stem);

    var knob = new T.Mesh(new T.SphereGeometry(h * 0.16, 14, 10), m);
    knob.position.y = h * 0.68;
    g.add(knob);

    for (var i = 0; i < 3; i++) {
      var a = (i / 3) * Math.PI * 2;
      var lobe = new T.Mesh(new T.SphereGeometry(h * 0.1, 10, 8), m);
      lobe.position.set(Math.cos(a) * h * 0.11, h * 0.82, Math.sin(a) * h * 0.11);
      lobe.scale.set(1, 1.5, 1);
      g.add(lobe);
    }
    return g;
  }

  /* ==================================================== 模型：双螺旋 === */
  function makeHelix(len, radius, color, turns) {
    len = len || 2; radius = radius || 0.16;
    color = color != null ? color : PAL.vacPale;
    turns = turns || 3;
    var g = new T.Group();
    var m = new T.MeshStandardMaterial({
      color: color, roughness: 0.35, metalness: 0.2,
      emissive: color, emissiveIntensity: 0.5
    });
    var n = 60;
    [0, Math.PI].forEach(function (ph) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n;
        var a = t * Math.PI * 2 * turns + ph;
        pts.push(new T.Vector3(Math.cos(a) * radius, (t - 0.5) * len, Math.sin(a) * radius));
      }
      var c = new T.CatmullRomCurve3(pts);
      g.add(new T.Mesh(new T.TubeGeometry(c, 80, radius * 0.16, 5, false), m));
    });
    // 横档
    var rungMat = new T.MeshStandardMaterial({
      color: 0x9BF0E2, roughness: 0.5, emissive: 0x45C9B8, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.55
    });
    for (var r = 0; r < turns * 5; r++) {
      var t2 = r / (turns * 5);
      var a2 = t2 * Math.PI * 2 * turns;
      var rung = new T.Mesh(new T.CylinderGeometry(radius * 0.05, radius * 0.05, radius * 2, 4), rungMat);
      rung.position.set(0, (t2 - 0.5) * len, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = -a2;
      g.add(rung);
    }
    return g;
  }

  /* ====================================================== 模型：培养皿 === */
  function makeDish(radius) {
    var g = new T.Group();
    var baseMat = new T.MeshStandardMaterial({
      color: 0xDCEBE7, roughness: 1, metalness: 0,
      emissive: 0x000000, emissiveIntensity: 0,
      transparent: true, opacity: 0.9, depthWrite: false
    });
    baseMat.userData.keep = true;
    var base = new T.Mesh(new T.CircleGeometry(radius, 72), baseMat);
    base.rotation.x = -Math.PI / 2;
    g.add(base);

    var ring = new T.Mesh(
      new T.TorusGeometry(radius, radius * 0.012, 8, 90),
      (function () {
        var rm = new T.MeshStandardMaterial({
          color: shade(PAL.vac, 0.4), emissive: PAL.vac, emissiveIntensity: 0.5,
          roughness: 0.35, metalness: 0.3
        });
        rm.userData.keep = true;
        rm.color.setHex(0x0E8577); rm.emissiveIntensity = 0;
        return rm;
      })()
    );
    ring.rotation.x = Math.PI / 2;
    g.add(ring);

    var ring2 = new T.Mesh(
      new T.TorusGeometry(radius * 0.72, radius * 0.004, 6, 80),
      new T.MeshBasicMaterial({ color: PAL.vac, transparent: true, opacity: 0.16 })
    );
    ring2.rotation.x = Math.PI / 2;
    g.add(ring2);

    return g;
  }

  /* ======================================================== 光晕精灵 === */
  function makeHalo(color, size, opacity) {
    var s = new T.Sprite(new T.SpriteMaterial({
      map: E.tex.glow(),
      color: color,
      transparent: true,
      opacity: opacity != null ? opacity : 0.7,
      blending: T.AdditiveBlending,
      depthWrite: false,
      depthTest: false
    }));
    s.scale.setScalar(size);
    return s;
  }

  /* ======================================================== 粒子场 === */
  function makeDust(count, radius, color, size) {
    var geo = new T.BufferGeometry();
    var pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      var r = radius * (0.55 + Math.random() * 0.45);
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.72;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    var m = new T.PointsMaterial({
      color: color != null ? color : 0x7FBFC9,
      size: size || 0.055,
      map: E.tex.soft(),
      transparent: true,
      opacity: 0.3,
      blending: T.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    var p = new T.Points(geo, m);
    p.userData.spin = 0.04 + Math.random() * 0.05;
    return p;
  }

  /* ========================================================== 标注 === */
  function ensureMarksLayer() {
    if (marksEl) return;
    marksEl = document.createElement("div");
    marksEl.className = "marks";
    document.body.appendChild(marksEl);
  }

  E.mark = function (o) {
    ensureMarksLayer();
    var el = document.createElement("div");
    el.className = "mk" + (o.tone ? " " + o.tone : "") + (o.side === "left" ? " left" : "");

    var dot = document.createElement("span");
    dot.className = "mk-dot";
    var lab = document.createElement("span");
    lab.className = "mk-label";
    lab.textContent = o.label;
    el.appendChild(dot);
    el.appendChild(lab);

    var mk = {
      id: o.id,
      el: el,
      labelEl: lab,
      pos: o.pos,
      center: o.center || null,
      onClick: o.onClick,
      visible: o.visible !== false,
      tone: o.tone || ""
    };

    el.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (mk.onClick) mk.onClick(mk.id);
    });

    marksEl.appendChild(el);
    marks.push(mk);
    return mk;
  };

  E.setMarkLabel = function (id, text) {
    marks.forEach(function (m) { if (m.id === id) m.labelEl.textContent = text; });
  };

  E.selectMark = function (id) {
    selectedMark = id;
    marks.forEach(function (m) { m.el.classList.toggle("sel", m.id === id); });
  };

  E.showMarks = function (on) {
    marks.forEach(function (m) { m.visible = on && m.visible !== "hidden"; m.el.classList.toggle("on", !!on); });
  };

  E.clearMarks = function () {
    marks.forEach(function (m) { if (m.el.parentNode) m.el.parentNode.removeChild(m.el); });
    marks = [];
    selectedMark = null;
  };

  var _v = new T.Vector3(), _n = new T.Vector3(), _c = new T.Vector3();
  function updateMarks() {
    if (!marks.length) return;
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (!m.visible || m.visible === "hidden") { m.el.classList.remove("on"); continue; }
      var p = typeof m.pos === "function" ? m.pos() : m.pos;
      if (!p) { m.el.classList.remove("on"); continue; }

      // 背面遮挡：球面上的锚点若朝向背面则淡出
      var hidden = false;
      if (m.center) {
        _n.copy(p).sub(m.center);
        _c.copy(camera.position).sub(p);
        if (_n.lengthSq() > 1e-6 && _c.lengthSq() > 1e-6) {
          if (_n.normalize().dot(_c.normalize()) < -0.08) hidden = true;
        }
      }

      _v.copy(p).project(camera);
      var behind = _v.z > 1;
      var x = (_v.x * 0.5 + 0.5) * W;
      var y = (-_v.y * 0.5 + 0.5) * H;
      m.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) translate(-50%,-50%)";
      m.el.classList.toggle("on", !behind && !hidden);
    }
  }

  /* ======================================================= 生命周期 === */
  function disposeTree(obj) {
    obj.traverse(function (n) {
      if (n.geometry) n.geometry.dispose();
      if (n.material) {
        var ms = Array.isArray(n.material) ? n.material : [n.material];
        ms.forEach(function (m) {
          if (m.map && m.map.__keep !== true) { /* 缓存纹理保留 */ }
          m.dispose();
        });
      }
    });
  }

  E.scene = null;
  E.camera = null;
  E.renderer = null;

  E.clear = function () {
    E.clearMarks();
    if (current && current.group) {
      E.scene.remove(current.group);
      disposeTree(current.group);
    }
    if (current && current.onDispose) current.onDispose();
    current = null;
    E.orbit.spin(0);
    E.orbit.limits(2.6, 26);
    if (E.hideCard) E.hideCard();
    if (E.emitStats) E.emitStats(null);
    E.onAction = null;
    // 靶点拾取是各场景自己挂上来的，换场时必须摘掉，否则会指向已销毁的对象
    E.selectTarget = null;
  };

  /* ================================================ 浅色模式材质转换 === */
  /* 原先所有材质都是「极暗底色 + 高自发光」，只在暗场里成立。
     浅底必须反过来：中明度实色承担形体，自发光只留一点点维持色彩倾向。 */
  function toLightMat(m) {
    if (!m || m.userData._lt) return;
    m.userData._lt = true;
    if (m.userData.keep) return;

    if (m.isMeshStandardMaterial) {
      var emi = m.emissive;
      var eSum = emi ? (emi.r + emi.g + emi.b) : 0;
      var src = (eSum > 0.06) ? emi : m.color;
      var hsl = { h: 0, s: 0, l: 0 };
      src.getHSL(hsl);

      var sat = hsl.s < 0.10 ? hsl.s : Math.min(0.80, Math.max(0.36, hsl.s * 1.2));
      var lum = Math.min(0.42, Math.max(0.18, 0.13 + hsl.l * 0.30));
      m.color.setHSL(hsl.h, sat, lum);

      if (emi) {
        // 保留色相，只把强度压到不会在白底上炸开的程度
        m.emissiveIntensity = Math.min(m.emissiveIntensity || 0, 0.30);
        if (m.emissiveIntensity < 0.03) { emi.setRGB(0, 0, 0); m.emissiveIntensity = 0; }
      }
      m.roughness = Math.min(0.92, Math.max(0.5, m.roughness));
      m.metalness = Math.min(0.10, m.metalness);
      // 半透明壳体在白底上要更透，否则会把内部结构糊掉
      if (m.transparent && m.opacity < 0.5) m.opacity = Math.max(0.05, m.opacity * 0.62);
      m.needsUpdate = true;
      return;
    }

    if (m.isMeshBasicMaterial) {
      var h2 = { h: 0, s: 0, l: 0 };
      m.color.getHSL(h2);
      var s2 = Math.min(0.68, Math.max(0.3, h2.s));
      m.color.setHSL(h2.h, s2, Math.min(0.52, Math.max(0.34, h2.l)));
      // 线框 / 细环是白底上唯一的轮廓线索，要更实
      if (m.transparent) m.opacity = Math.min(0.62, m.opacity + 0.22);
      m.needsUpdate = true;
      return;
    }

    // 光晕 / 尘埃：加法混合在白底上等于消失，改为普通混合
    if (m.isSpriteMaterial || m.isPointsMaterial) {
      if (m.blending === T.AdditiveBlending) {
        m.blending = T.NormalBlending;
        m.depthWrite = false;
      }
      var h3 = { h: 0, s: 0, l: 0 };
      m.color.getHSL(h3);
      m.color.setHSL(h3.h, Math.min(0.55, h3.s), Math.max(0.34, Math.min(0.6, h3.l)));
      // 光晕在白底上很容易变成一层奶雾，压到极淡
      m.opacity = Math.min(m.opacity * 0.28, 0.10);
      m.needsUpdate = true;
    }
  }

  function lightify(root) {
    root.traverse(function (o) {
      if (!o.material) return;
      if (Array.isArray(o.material)) o.material.forEach(toLightMat);
      else toLightMat(o.material);
    });
  }

  E.mount = function (build) {
    E.clear();
    var group = new T.Group();
    E.scene.add(group);

    var api = {
      T: T,
      PAL: PAL,
      E: E,
      scene: E.scene,
      group: group,
      make: {
        virus: makeVirus,
        bacterium: makeBacterium,
        antibody: makeAntibody,
        bcell: makeBCell,
        lnp: makeLNP,
        spike: makeSpike,
        helix: makeHelix,
        dish: makeDish,
        halo: makeHalo,
        dust: makeDust
      },
      mat: mat,
      glassMat: glassMat,
      mark: E.mark,
      fibSphere: fibSphere,
      alignTo: alignTo,
      radialTex: radialTex
    };

    var stage = build(api) || {};
    lightify(group);
    if (stage.onLight) stage.onLight();
    stage.group = group;
    current = stage;

    if (stage.camera) {
      E.orbit.set(stage.camera);
    }
    if (stage.limits) E.orbit.limits(stage.limits[0], stage.limits[1]);

    return stage;
  };

  /* ============================================================ 拾取 === */
  E.raycast = function (clientX, clientY, targets) {
    var rect = canvasEl.getBoundingClientRect();
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    var list = targets || (current && current.group ? current.group.children : []);
    return raycaster.intersectObjects(list, true);
  };

  /* ============================================================ 初始化 === */
  E.init = function (canvas) {
    canvasEl = canvas;
    renderer = new T.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;

    scene = new T.Scene();
    scene.fog = new T.FogExp2(0xF0EDE4, 0.011);
    E.scene = scene;

    camera = new T.PerspectiveCamera(38, 1, 0.1, 220);
    E.camera = camera;
    E.renderer = renderer;

    // 光照
    scene.add(new T.HemisphereLight(0xFFFFFF, 0xC8BDA6, 0.58));

    var key = new T.DirectionalLight(0xFFF8F0, 0.98);
    key.position.set(5, 7, 6);
    scene.add(key);

    var rimA = new T.DirectionalLight(PAL.vac, 0.30);
    rimA.position.set(-6, 3, -5);
    scene.add(rimA);

    var rimB = new T.DirectionalLight(PAL.abx, 0.22);
    rimB.position.set(-3, -5, 4);
    scene.add(rimB);

    var fill = new T.PointLight(0x9FB4CC, 0.32, 40, 2);
    fill.position.set(3, -4, -3);
    scene.add(fill);

    E.lights = { key: key, rimA: rimA, rimB: rimB, fill: fill };

    resize();
    bindPointer();
    window.addEventListener("resize", resize);

    applyCamera();

    var last = performance.now();
    function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var adt = E.paused ? 0 : dt;
      if (!E.paused) E.time += adt;

      updateCamera(dt);
      if (current && current.update) current.update(adt, E.time, dt);
      updateMarks();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    _filmOff = -999;
    camera.updateProjectionMatrix();
    applyCamera();
  }
  E.resize = resize;

  /* ======================================================== 指针事件 === */
  function bindPointer() {
    var el = canvasEl;

    el.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (activePointers.size === 1) {
        pointer.down = true;
        pointer.sx = e.clientX;
        pointer.sy = e.clientY;
        pointer.moved = 0;
        el.classList.add("dragging");
      } else if (activePointers.size === 2) {
        var pts = Array.from(activePointers.values());
        pinchStart = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        pinchRadius = ctl.tRadius;
      }
    });

    el.addEventListener("pointermove", function (e) {
      var prev = activePointers.get(e.pointerId);
      if (!prev) { return; }

      if (activePointers.size === 1) {
        var dx = e.clientX - prev.x;
        var dy = e.clientY - prev.y;
        pointer.moved += Math.abs(dx) + Math.abs(dy);
        ctl.tTheta -= dx * 0.0062;
        ctl.tPhi -= dy * 0.0058;
        ctl.tPhi = Math.max(0.22, Math.min(Math.PI - 0.22, ctl.tPhi));
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      } else if (activePointers.size === 2) {
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        var pts = Array.from(activePointers.values());
        var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (pinchStart > 0) {
          var ratio = pinchStart / Math.max(1, d);
          ctl.tRadius = Math.max(ctl.minR, Math.min(ctl.maxR, pinchRadius * ratio));
        }
        pointer.moved += 20;
      }
    });

    function endPointer(e) {
      var wasSingle = activePointers.size === 1;
      activePointers.delete(e.pointerId);
      if (activePointers.size === 0) {
        el.classList.remove("dragging");
        pointer.down = false;
        if (wasSingle && pointer.moved < 6) {
          handleTap(e.clientX, e.clientY);
        }
      }
      if (activePointers.size < 2) pinchStart = 0;
    }
    el.addEventListener("pointerup", endPointer);
    el.addEventListener("pointercancel", endPointer);

    el.addEventListener("wheel", function (e) {
      e.preventDefault();
      var delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      ctl.tRadius = Math.max(ctl.minR, Math.min(ctl.maxR, ctl.tRadius * (1 + delta * 0.0011)));
    }, { passive: false });

    el.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  }

  function handleTap(x, y) {
    var hits = E.raycast(x, y);
    var userHit = null;
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      while (o) {
        if (o.userData && o.userData.pick) { userHit = { obj: o, point: hits[i].point, meta: o.userData.pick }; break; }
        o = o.parent;
      }
      if (userHit) break;
    }

    if (userHit && current && current.onPick) {
      current.onPick(userHit.meta, userHit.obj, userHit.point);
    } else if (current && current.onEmpty) {
      current.onEmpty();
    }
  }

  /* ====================================================== 全局暂停 === */
  E.setPaused = function (p) { E.paused = !!p; };
  E.isPaused = function () { return E.paused; };

  return E;
})();
