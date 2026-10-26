/* =============================================================================
   岩石与矿物 · 三维标本室
   app.js — 双语渲染、程序化晶体建模、标本交互
   ========================================================================== */
(function () {
  "use strict";

  var GEO = window.GEO;
  var CREDITS = window.CREDITS || {};
  var LANG = "zh";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function L(o) { return o ? (o[LANG] != null ? o[LANG] : o.zh) : ""; }
  function t(zh, en) { return LANG === "zh" ? zh : en; }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  var SYSTEM = {
    cubic: { zh: "等轴晶系（立方）", en: "Cubic" },
    tetragonal: { zh: "四方晶系", en: "Tetragonal" },
    hexagonal: { zh: "六方晶系", en: "Hexagonal" },
    trigonal: { zh: "三方晶系", en: "Trigonal" },
    orthorhombic: { zh: "斜方晶系", en: "Orthorhombic" },
    monoclinic: { zh: "单斜晶系", en: "Monoclinic" },
    triclinic: { zh: "三斜晶系", en: "Triclinic" }
  };
  var CLASS = {
    silicate: { zh: "硅酸盐", en: "Silicate" },
    oxide: { zh: "氧化物", en: "Oxide" },
    sulfide: { zh: "硫化物", en: "Sulfide" },
    carbonate: { zh: "碳酸盐", en: "Carbonate" },
    sulfate: { zh: "硫酸盐", en: "Sulfate" },
    halide: { zh: "卤化物", en: "Halide" },
    phosphate: { zh: "磷酸盐", en: "Phosphate" },
    native: { zh: "自然元素", en: "Native element" }
  };
  var SUB = {
    intrusive: { zh: "侵入岩", en: "Intrusive" },
    extrusive: { zh: "喷出岩", en: "Extrusive" },
    clastic: { zh: "碎屑岩", en: "Clastic" },
    biochemical: { zh: "生物化学岩", en: "Biochemical" },
    foliated: { zh: "片理构造", en: "Foliated" },
    nonfoliated: { zh: "非片理构造", en: "Non-foliated" }
  };

  /* ======================================================================
     一、语言切换
     ====================================================================== */
  function applyLang(lang) {
    LANG = lang;
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    $$("[data-en]").forEach(function (n) {
      if (!n.hasAttribute("data-zh")) n.setAttribute("data-zh", n.textContent);
      n.textContent = lang === "zh" ? n.getAttribute("data-zh") : n.getAttribute("data-en");
    });
    $$("[data-lang-btn]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang-btn") === lang));
    });
    renderAll();
    setTimeout(function () { balancePanels(); }, 90);
  }

  /* ======================================================================
     二、测角仪刻度盘
     ====================================================================== */
  function buildDial(svg) {
    var NS = "http://www.w3.org/2000/svg";
    var dark = svg.parentNode && svg.parentNode.classList.contains("dark");
    var ink = dark ? "242,236,222" : "23,26,24";
    var s = document.createElementNS(NS, "svg");
    // 复用父级 svg 节点
    svg.innerHTML = "";
    function line(x1, y1, x2, y2, w, o) {
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1);
      l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      l.setAttribute("stroke", "rgba(" + ink + "," + o + ")");
      l.setAttribute("stroke-width", w);
      svg.appendChild(l);
    }
    function circ(r, w, o, dash) {
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", 50); c.setAttribute("cy", 50); c.setAttribute("r", r);
      c.setAttribute("fill", "none");
      c.setAttribute("stroke", "rgba(" + ink + "," + o + ")");
      c.setAttribute("stroke-width", w);
      if (dash) c.setAttribute("stroke-dasharray", dash);
      svg.appendChild(c);
    }
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    circ(41.6, 0.16, dark ? 0.34 : 0.20);
    circ(36.4, 0.1, dark ? 0.18 : 0.10, "0.6 1.4");
    for (var i = 0; i < 72; i++) {
      var a = (i * 5 - 90) * Math.PI / 180;
      var major = i % 6 === 0;
      var r1 = 41.6, r2 = major ? 38.4 : 39.9;
      line(50 + Math.cos(a) * r1, 50 + Math.sin(a) * r1,
           50 + Math.cos(a) * r2, 50 + Math.sin(a) * r2,
           major ? 0.22 : 0.12, major ? (dark ? 0.52 : 0.30) : (dark ? 0.26 : 0.16));
    }
    // 十字准线
    line(50, 8.5, 50, 11.5, 0.14, dark ? 0.42 : 0.28);
    line(50, 88.5, 50, 91.5, 0.14, dark ? 0.42 : 0.28);
    line(8.5, 50, 11.5, 50, 0.14, dark ? 0.42 : 0.28);
    line(88.5, 50, 91.5, 50, 0.14, dark ? 0.42 : 0.28);
  }

  /* ======================================================================
     三、程序化晶体几何
     ====================================================================== */
  function poly(verts, faces) {
    var pos = [];
    function tri(a, b, c) {
      var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
      var vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      var mx = (a[0] + b[0] + c[0]) / 3, my = (a[1] + b[1] + c[1]) / 3, mz = (a[2] + b[2] + c[2]) / 3;
      if (nx * mx + ny * my + nz * mz < 0) { var tmp = b; b = c; c = tmp; }
      pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    }
    faces.forEach(function (f) {
      for (var i = 1; i < f.length - 1; i++) tri(verts[f[0]], verts[f[i]], verts[f[i + 1]]);
    });
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }

  function prism(o) {
    var n = o.n || 6, r0 = o.r0, r1 = (o.r1 == null ? o.r0 : o.r1), h = o.h || 1;
    var y0 = -h / 2, y1 = h / 2, rot = o.rot || 0, sx = o.sx || 1, sz = o.sz || 1;
    var apexT = o.apexTop || 0, apexB = o.apexB || 0;
    var offT = o.offTop || [0, 0], offB = o.offBot || [0, 0];
    var V = [], F = [], i, j, a;
    for (i = 0; i < n; i++) { a = rot + i / n * Math.PI * 2; V.push([Math.cos(a) * r0 * sx, y0, Math.sin(a) * r0 * sz]); }
    for (i = 0; i < n; i++) { a = rot + i / n * Math.PI * 2; V.push([Math.cos(a) * r1 * sx, y1, Math.sin(a) * r1 * sz]); }
    for (i = 0; i < n; i++) { j = (i + 1) % n; F.push([i, j, n + j, n + i]); }
    if (apexT > 0) {
      var ti = V.length; V.push([offT[0], y1 + apexT, offT[1]]);
      for (i = 0; i < n; i++) F.push([n + i, n + (i + 1) % n, ti]);
    } else {
      var tc = V.length; V.push([0, y1, 0]);
      for (i = 0; i < n; i++) F.push([n + i, n + (i + 1) % n, tc]);
    }
    if (apexB > 0) {
      var bi = V.length; V.push([offB[0], y0 - apexB, offB[1]]);
      for (i = 0; i < n; i++) F.push([i, bi, (i + 1) % n]);
    } else {
      var bc = V.length; V.push([0, y0, 0]);
      for (i = 0; i < n; i++) F.push([i, bc, (i + 1) % n]);
    }
    return poly(V, F);
  }

  function box(o) {
    var w = o.w / 2, h = o.h / 2, d = o.d / 2;
    var tx = o.topX || 0, tz = o.topZ || 0, bx = o.botX || 0, bz = o.botZ || 0;
    var V = [
      [-w + bx, -h, -d + bz], [w + bx, -h, -d + bz], [w + bx, -h, d + bz], [-w + bx, -h, d + bz],
      [-w + tx, h, -d + tz], [w + tx, h, -d + tz], [w + tx, h, d + tz], [-w + tx, h, d + tz]
    ];
    var F = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
    return poly(V, F);
  }

  function rhomb(o) {
    // 菱面体：立方体沿体对角线剪切
    var s = o.s || 1, h = o.h || 1.35, sh = o.shift || 0.52;
    var y0 = -h, y1 = h;
    var V = [
      [-s, y0, -s], [s, y0, -s], [s, y0, s], [-s, y0, s],
      [-s + sh, y1, -s + sh], [s + sh, y1, -s + sh], [s + sh, y1, s + sh], [-s + sh, y1, s + sh]
    ];
    var F = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
    return poly(V, F);
  }

  function hexPlate(r, h, rot) {
    return prism({ n: 6, r0: r, h: h, rot: rot || Math.PI / 6 });
  }

  var EDGE_MAT = null;

  function matFor(m, env) {
    var base = { color: m.color, flatShading: true, envMap: env, envMapIntensity: 1.0 };
    if (m.gloss === "metallic") {
      return new THREE.MeshStandardMaterial(Object.assign({}, base, {
        metalness: 0.74, roughness: 0.24, envMapIntensity: 1.55
      }));
    }
    if (m.gloss === "adamantine") {
      return new THREE.MeshPhysicalMaterial(Object.assign({}, base, {
        metalness: 0.0, roughness: 0.05, ior: 2.1, reflectivity: 1,
        clearcoat: 1, clearcoatRoughness: 0.02, transparent: true,
        envMapIntensity: 1.7, opacity: 0.82
      }));
    }
    if (m.gloss === "silky") {
      return new THREE.MeshPhysicalMaterial(Object.assign({}, base, {
        metalness: 0.0, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35, envMapIntensity: 0.85
      }));
    }
    return new THREE.MeshPhysicalMaterial(Object.assign({}, base, {
      metalness: 0.0, roughness: 0.07, ior: 1.55, reflectivity: 0.9,
      clearcoat: 0.95, clearcoatRoughness: 0.04, transparent: false,
      envMapIntensity: 1.0, opacity: 1
    }));
  }

  function buildModel(m, env) {
    var g = new THREE.Group();
    var mat = matFor(m, env);
    if (!EDGE_MAT) EDGE_MAT = new THREE.LineBasicMaterial({ color: 0x3c3a33, transparent: true, opacity: 0.14 });

    function add(geo, opt) {
      opt = opt || {};
      var mesh = new THREE.Mesh(geo, mat);
      if (opt.p) mesh.position.set(opt.p[0], opt.p[1], opt.p[2]);
      if (opt.r) mesh.rotation.set(opt.r[0], opt.r[1], opt.r[2]);
      if (opt.s) mesh.scale.set(opt.s[0], opt.s[1], opt.s[2]);
      g.add(mesh);
      if (m.gloss !== "silky") {
        var e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 22), EDGE_MAT);
        e.position.copy(mesh.position); e.rotation.copy(mesh.rotation); e.scale.copy(mesh.scale);
        g.add(e);
      }
      return mesh;
    }

    var i, a;
    switch (m.shape) {
      case "quartz":
        add(prism({ n: 6, r0: 0.34, r1: 0.37, h: 1.75, apexTop: 0.55, offTop: [0.1, 0.05] }),
          { p: [0.02, 0.12, 0], r: [0, 0, 0.05] });
        add(prism({ n: 6, r0: 0.23, r1: 0.25, h: 1.35, apexTop: 0.38, offTop: [-0.05, 0.03] }),
          { p: [-0.42, -0.34, 0.12], r: [0.06, 0.4, 0.34] });
        add(prism({ n: 6, r0: 0.26, r1: 0.28, h: 1.55, apexTop: 0.42, offTop: [0.06, -0.03] }),
          { p: [0.46, -0.22, 0.06], r: [-0.04, -0.3, -0.3] });
        add(prism({ n: 6, r0: 0.15, r1: 0.16, h: 0.8, apexTop: 0.24, offTop: [0.03, 0.02] }),
          { p: [0.1, -0.72, 0.3], r: [0.32, 0.2, 0.22] });
        break;
      case "feldspar":
        add(box({ w: 1.05, h: 1.15, d: 0.78, topX: 0.18, botX: -0.06 }),
          { r: [0.06, 0.4, 0.03] });
        add(box({ w: 0.52, h: 0.7, d: 0.5, topX: 0.1 }), { p: [0.52, -0.18, 0.12], r: [0.14, 0.9, 0.18] });
        break;
      case "mica":
        for (i = 0; i < 5; i++) {
          add(hexPlate(0.96 - i * 0.055, 0.075), {
            p: [Math.sin(i * 1.7) * 0.035, -0.32 + i * 0.1, Math.cos(i * 1.3) * 0.035],
            r: [0.015 * i, i * 0.1, 0.012 * i]
          });
        }
        break;
      case "olivine":
        add(prism({ n: 4, r0: 0.58, r1: 0.62, h: 0.86, apexTop: 0.5, offTop: [0.06, 0.02], apexB: 0.44, rot: Math.PI / 4 }));
        add(prism({ n: 4, r0: 0.28, r1: 0.3, h: 0.5, apexTop: 0.24, apexB: 0.22, rot: Math.PI / 4 }),
          { p: [0.55, -0.3, 0.2], r: [0.2, 0.5, 0.25] });
        break;
      case "rhomb":
        add(rhomb({ s: 0.98, h: 1.06, shift: 0.5 }), { r: [0.2, 0.95, 0.05] });
        break;
      case "botryoid":
        [[0, 0, 0, 0.62], [0.5, -0.16, 0.2, 0.42], [-0.46, -0.2, 0.24, 0.38],
         [0.16, 0.3, -0.3, 0.34], [-0.3, 0.26, -0.34, 0.28], [0.62, 0.22, -0.24, 0.24],
         [-0.66, 0.1, -0.1, 0.22]].forEach(function (s) {
          var geo = new THREE.SphereGeometry(s[3], 24, 18);
          add(geo, { p: [s[0], s[1], s[2]] });
        });
        break;
      case "pyrite":
        add(box({ w: 1.05, h: 1.05, d: 1.05 }), { r: [0.1, 0.3, 0.08] });
        add(box({ w: 0.62, h: 0.62, d: 0.62 }), { p: [0.62, -0.36, 0.22], r: [0.5, 0.8, 0.3] });
        add(box({ w: 0.42, h: 0.42, d: 0.42 }), { p: [-0.56, -0.44, 0.3], r: [0.2, 1.1, 0.5] });
        break;
      case "roses":
        var rosz = [0.46, 0.34, 0.28], rotr = [1.44, 1.2, 1.34];
        for (i = 0; i < 3; i++) {
          a = i / 3 * Math.PI * 2 + 0.5;
          add(hexPlate(rosz[i], 0.05), {
            p: [Math.cos(a) * (0.26 + i * 0.05), 0.02 + i * 0.05, Math.sin(a) * (0.26 + i * 0.05)],
            r: [rotr[i], a, 0]
          });
        }
        add(hexPlate(0.46, 0.06), { p: [0, -0.3, 0], r: [0.06, 0.3, 0.02] });
        break;
      case "octa":
        add(new THREE.OctahedronGeometry(1.0, 0), { r: [0.06, 0.3, 0.02] });
        if (m.id === "magnetite") {
          add(new THREE.OctahedronGeometry(0.5, 0), { p: [0.66, -0.38, 0.2], r: [0.4, 0.6, 0.2] });
        }
        if (m.id === "diamond") {
          add(new THREE.OctahedronGeometry(0.38, 0), { p: [-0.66, -0.44, 0.24], r: [0.2, 0.9, 0.3] });
        }
        break;
      case "cube":
        add(box({ w: 1.15, h: 1.15, d: 1.15 }), { r: [0.08, 0.42, 0.05] });
        add(box({ w: 0.44, h: 0.44, d: 0.44 }), { p: [0.62, -0.44, 0.28], r: [0.3, 0.9, 0.2] });
        break;
      case "tabular":
        add(box({ w: 1.24, h: 0.78, d: 0.92, topX: 0.26, topZ: 0.1 }), { r: [0.14, 0.42, 0.05] });
        add(box({ w: 0.62, h: 0.34, d: 0.5, topX: 0.16 }), { p: [0.6, 0.16, 0.26], r: [0.1, 0.9, 0.12] });
        break;
      case "plate":
        for (i = 0; i < 5; i++) {
          add(hexPlate(0.8 - i * 0.06, 0.06), { p: [i * 0.03, -0.2 + i * 0.1, i * 0.02], r: [0, i * 0.12, 0] });
        }
        break;
      case "zircon":
        add(prism({ n: 4, r0: 0.5, r1: 0.5, h: 0.9, apexTop: 0.62, apexB: 0.5, rot: Math.PI / 4 }));
        add(prism({ n: 4, r0: 0.24, r1: 0.24, h: 0.44, apexTop: 0.28, apexB: 0.22, rot: Math.PI / 4 }),
          { p: [0.56, -0.34, 0.22], r: [0.25, 0.7, 0.3] });
        break;
      case "triclinic":
        add(box({ w: 1.3, h: 0.72, d: 1.0, topX: 0.34, topZ: 0.2, botX: -0.1 }), { r: [0.05, 0.3, 0.04] });
        add(box({ w: 0.6, h: 0.4, d: 0.5, topX: 0.14 }), { p: [0.5, -0.3, 0.26], r: [0.1, 0.8, 0.2] });
        break;
      default:
        add(new THREE.IcosahedronGeometry(1, 0), {});
    }

    // 归一化：按外接球半径统一，保证不同晶形在转台上观感一致
    var bb = new THREE.Box3().setFromObject(g);
    var c = new THREE.Vector3(); bb.getCenter(c);
    var bs = new THREE.Sphere(); bb.getBoundingSphere(bs);
    for (i = 0; i < g.children.length; i++) g.children[i].position.sub(c);
    var k = 1.32 / (bs.radius || 1);
    g.scale.setScalar(k);
    return { group: g, mat: mat };
  }

  /* ======================================================================
     四、Three.js 舞台
     ====================================================================== */
  function makeEnv(renderer) {
    if (renderer.userData && renderer.userData.env) return renderer.userData.env;
    var c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    var x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#e8edf2");
    g.addColorStop(0.38, "#a9a294");
    g.addColorStop(0.54, "#5d584e");
    g.addColorStop(1, "#22201c");
    x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    x.fillStyle = "rgba(255,255,255,.92)";
    x.fillRect(70, 14, 64, 92);
    x.fillRect(360, 30, 40, 66);
    x.fillStyle = "rgba(255,255,255,.42)";
    x.fillRect(196, 6, 104, 52);
    x.fillStyle = "rgba(20,18,14,.55)";
    x.fillRect(0, 208, 512, 48);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
    else tex.encoding = THREE.sRGBEncoding;
    var pm = new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    var env = pm.fromEquirectangular(tex).texture;
    tex.dispose(); pm.dispose();
    if (renderer.userData) renderer.userData.env = env;
    return env;
  }

  function shadowTexture() {
    var c = document.createElement("canvas");
    c.width = 128; c.height = 128;
    var x = c.getContext("2d");
    var g = x.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, "rgba(30,26,20,.55)");
    g.addColorStop(0.55, "rgba(30,26,20,.20)");
    g.addColorStop(1, "rgba(30,26,20,0)");
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    var t = new THREE.CanvasTexture(c);
    return t;
  }

  function Stage(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.visible = true;
    this.spinning = true;
    this.dragging = false;
    this.rotY = opts.rotY != null ? opts.rotY : -0.5;
    this.rotX = opts.rotX != null ? opts.rotX : 0.16;
    this.targetY = this.rotY;
    this.targetX = this.rotX;
    this.dist = 6.6;
    this.targetDist = 6.6;
    this.model = null;

    var r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.9));
    if ("outputColorSpace" in r) r.outputColorSpace = THREE.SRGBColorSpace;
    else r.outputEncoding = THREE.sRGBEncoding;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.95;
    this.renderer = r;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    this.camera.position.set(0, 0.25, this.dist);

    var env = makeEnv(r);
    var hemi = new THREE.HemisphereLight(0xf2f6ff, 0x221f1a, 0.22);
    this.scene.add(hemi);
    var key = new THREE.DirectionalLight(0xfff1dc, 2.3);
    key.position.set(3.2, 5.5, 4.2);
    this.scene.add(key);
    var fill = new THREE.DirectionalLight(0xcfe0f2, 0.3);
    fill.position.set(-4.5, 1.5, -2.5);
    this.scene.add(fill);
    var rim = new THREE.DirectionalLight(0xffffff, 1.5);
    rim.position.set(-2, 1.2, -4.8);
    this.scene.add(rim);
    var bounce = new THREE.DirectionalLight(0xffe9cf, 0.22);
    bounce.position.set(0, -4, 2);
    this.scene.add(bounce);

    this.pivot = new THREE.Group();
    this.tilt = new THREE.Group();
    this.pivot.add(this.tilt);
    this.scene.add(this.pivot);

    this.size();
    var self = this;
    if (window.ResizeObserver) {
      new ResizeObserver(function () { self.size(); }).observe(canvas.parentNode);
    } else {
      window.addEventListener("resize", function () { self.size(); });
    }
    if (opts.interactive !== false) this.bind();
    stages.push(this);
  }

  Stage.prototype.size = function () {
    var p = this.canvas.parentNode;
    var w = p.clientWidth || 300, h = p.clientHeight || 300;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  Stage.prototype.setModel = function (m) {
    if (this.model) {
      this.tilt.remove(this.model.group);
      this.model.mat.dispose();
      this.model.group.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
    }
    var built = buildModel(m, makeEnv(this.renderer));
    this.model = built;
    this.tilt.add(built.group);
    if (this.wire) this.setWire(true);
  };

  Stage.prototype.setWire = function (on) {
    if (!this.model) return;
    this.model.mat.wireframe = on;
    this.model.group.traverse(function (o) {
      if (o.isLineSegments) o.visible = !on;
    });
  };

  Stage.prototype.bind = function () {
    var s = this, c = this.canvas, last = null;
    c.addEventListener("pointerdown", function (e) {
      s.dragging = true; last = { x: e.clientX, y: e.clientY };
      c.setPointerCapture(e.pointerId);
      c.parentNode.classList.add("dragging");
    });
    c.addEventListener("pointermove", function (e) {
      if (!s.dragging || !last) return;
      s.targetY += (e.clientX - last.x) * 0.0085;
      s.targetX += (e.clientY - last.y) * 0.006;
      s.targetX = Math.max(-1.1, Math.min(1.1, s.targetX));
      last = { x: e.clientX, y: e.clientY };
    });
    function end(e) {
      s.dragging = false; last = null;
      c.parentNode.classList.remove("dragging");
    }
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
    c.addEventListener("wheel", function (e) {
      e.preventDefault();
      s.targetDist = Math.max(4.6, Math.min(9, s.targetDist + e.deltaY * 0.0035));
    }, { passive: false });
  };

  Stage.prototype.reset = function () {
    this.targetY = -0.5; this.targetX = 0.16; this.targetDist = 6.6;
  };

  Stage.prototype.tick = function (time) {
    if (!this.visible) return;
    if (this.spinning && !this.dragging) this.targetY += 0.0032;
    this.rotY += (this.targetY - this.rotY) * 0.09;
    this.rotX += (this.targetX - this.rotX) * 0.09;
    this.dist += (this.targetDist - this.dist) * 0.08;
    this.pivot.rotation.y = this.rotY;
    this.tilt.rotation.x = this.rotX;
    this.camera.position.z = this.dist;
    this.camera.lookAt(0, 0, 0);
    if (this.model) {
      this.tilt.position.y = Math.sin(time * 0.0009) * 0.035;
    }
    this.renderer.render(this.scene, this.camera);
  };

  var stages = [];
  var heroStage = null, minStage = null;

  /* ======================================================================
     五、状态
     ====================================================================== */
  var state = {
    mineral: 0,
    family: "igneous",
    rock: "granite",
    process: "crystallize",
    mohs: 7
  };

  function mineralById(id) {
    for (var i = 0; i < GEO.minerals.length; i++) if (GEO.minerals[i].id === id) return GEO.minerals[i];
    return GEO.minerals[0];
  }

  /* ======================================================================
     六、渲染 · 矿物
     ====================================================================== */
  function renderMineralList() {
    var box = $("#mlist");
    box.innerHTML = "";
    GEO.minerals.forEach(function (m, i) {
      var b = el("button", "mitem");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === state.mineral));
      b.innerHTML = '<span class="no">' + m.no + '</span>' +
        '<span class="nm">' + esc(L(m.name)) + '<i>' + esc(LANG === "zh" ? m.name.en : m.name.zh) + '</i></span>' +
        '<span class="cl">' + (LANG === "zh" ? m.H : "H " + m.H) + '</span>';
      b.addEventListener("click", function () { selectMineral(i); });
      box.appendChild(b);
    });
  }

  function renderMineralPanel() {
    var m = GEO.minerals[state.mineral];
    var p = $("#mpanel");
    var cr = CREDITS[m.img.replace(".jpg", "")] || {};
    var rows = [
      [t("类别", "Class"), L(CLASS[m.cls])],
      [t("晶系", "System"), L(SYSTEM[m.system])],
      [t("硬度", "Hardness"), m.H],
      [t("相对密度", "Density"), m.SG],
      [t("解理", "Cleavage"), L(m.cleavage)],
      [t("光泽", "Lustre"), L(m.luster)],
      [t("条痕", "Streak"), L(m.streak)]
    ];
    var html = '<div class="panel-h"><span>' + m.no + '</span><span>' + L(CLASS[m.cls]) + '</span></div>' +
      '<h3 class="mp-name">' + esc(LANG === "zh" ? m.name.zh : m.name.en) + '</h3>' +
      '<div class="mp-en">' + esc(LANG === "zh" ? m.name.en : m.name.zh) + '</div>' +
      '<div class="mp-formula">' + m.formula + '</div>' +
      '<figure class="mp-photo"><img src="assets/' + m.img + '" alt="' + esc(L(m.name)) + '"><figcaption>' +
        esc(t("馆藏标本照", "Specimen photograph")) + (cr.author ? " · " + esc(cr.author) + " · " + esc(cr.license) : "") +
      '</figcaption></figure>' +
      '<ul class="spec">' + rows.map(function (r) {
        return '<li><span class="k">' + r[0] + '</span><span class="dots"></span><span class="v">' + esc(r[1]) + '</span></li>';
      }).join("") + '</ul>' +
      '<div class="fact"><b style="font-weight:600">' + t("产状", "Occurrence") + '</b> · ' + esc(L(m.occ)) + '</div>' +
      '<ul class="uses">' + L(m.uses).map(function (u) { return "<li>" + esc(u) + "</li>"; }).join("") + '</ul>' +
      '<div class="fact">' + esc(L(m.fact)) + '</div>';
    p.innerHTML = html;

    $("#stage-no").textContent = m.no + " · " + m.formula.replace(/<[^>]+>/g, "");
    $("#stage-nm").textContent = LANG === "zh" ? m.name.zh + " " + m.name.en : m.name.en;
  }

  function renderFilmstrip() {
    var box = $("#filmstrip");
    box.innerHTML = "";
    GEO.minerals.forEach(function (m, i) {
      var b = el("button", "thumb");
      b.type = "button";
      b.setAttribute("aria-selected", String(i === state.mineral));
      b.innerHTML = '<div class="im"><img src="assets/' + m.img + '" alt="' + esc(L(m.name)) + '" loading="lazy"></div>' +
        '<div class="cap"><span>' + m.no + '</span><span>' + esc(L(m.name)) + '</span></div>';
      b.addEventListener("click", function () { selectMineral(i); });
      box.appendChild(b);
    });
  }

  function selectMineral(i) {
    state.mineral = i;
    var m = GEO.minerals[i];
    if (minStage) minStage.setModel(m);
    renderMineralList();
    renderMineralPanel();
    renderFilmstrip();
    var sel = $('.mitem[aria-selected="true"]');
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest" });
    var fs = $('.thumb[aria-selected="true"]');
    if (fs && fs.scrollIntoView) fs.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  /* ======================================================================
     七、渲染 · 分类
     ====================================================================== */
  function renderClasses() {
    var box = $("#classes-grid");
    box.innerHTML = "";
    GEO.classes.forEach(function (c, i) {
      var d = el("div", "cls");
      d.innerHTML = '<div class="idx">' + String(i + 1).padStart(2, "0") + '</div>' +
        '<h3>' + esc(LANG === "zh" ? c.name.zh : c.name.en) + '</h3>' +
        '<div class="en">' + esc(LANG === "zh" ? c.name.en : c.name.zh) + '</div>' +
        '<p>' + esc(L(c.def)) + '</p>' +
        '<div class="ex">' + esc(L(c.ex)) + '</div>';
      box.appendChild(d);
    });
  }

  /* ======================================================================
     八、渲染 · 岩石
     ====================================================================== */
  function rocksOf(f) { return GEO.rocks.filter(function (r) { return r.family === f; }); }

  function renderTabs() {
    var box = $("#rtabs");
    box.innerHTML = "";
    ["igneous", "sedimentary", "metamorphic"].forEach(function (f) {
      var fam = GEO.families[f];
      var b = el("button", "rtab");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(f === state.family));
      b.style.setProperty("--tabc", fam.color);
      b.innerHTML = '<span class="n">' + rocksOf(f).length + '</span><span>' + esc(L(fam.name)) + '</span>';
      b.addEventListener("click", function () {
        state.family = f;
        state.rock = rocksOf(f)[0].id;
        renderTabs(); renderRock(); renderTray();
      });
      box.appendChild(b);
    });
  }

  function currentRock() {
    for (var i = 0; i < GEO.rocks.length; i++) if (GEO.rocks[i].id === state.rock) return GEO.rocks[i];
    return GEO.rocks[0];
  }

  function renderRock() {
    var r = currentRock();
    var fam = GEO.families[r.family];
    var no = "R-" + String(GEO.rocks.indexOf(r) + 1).padStart(2, "0");
    var fig = $("#rock-figure");
    fig.innerHTML = '<div class="frame"><img id="rock-img" src="assets/' + r.img + '" alt="' + esc(L(r.name)) + '"><div class="loupe" id="loupe"></div></div>' +
      '<div class="plate"><span><b>' + no + '</b> · ' + esc(L(r.name)) + '</span><span>' + esc(L(r.grain)) + '</span></div>';
    bindLoupe();

    var data = $("#rock-data");
    var mineralRows = r.minerals.map(function (m) {
      return '<div><i style="background:' + m.c + '"></i><span>' + esc(L(m)) + '</span><b>' + m.pct + '%</b></div>';
    }).join("");
    var bar = r.minerals.map(function (m) {
      return '<span style="width:' + m.pct + '%;background:' + m.c + '"></span>';
    }).join("");

    data.innerHTML = '<h3>' + esc(LANG === "zh" ? r.name.zh : r.name.en) + '</h3>' +
      '<div class="sub">' + esc(LANG === "zh" ? r.name.en : r.name.zh) + '</div>' +
      '<div class="rock-meta">' +
        '<span class="chip fam" style="color:' + fam.color + '">' + esc(L(fam.name)) + '</span>' +
        '<span class="chip">' + esc(L(SUB[r.sub])) + '</span>' +
        '<span class="chip">' + esc(L(r.grain)) + '</span>' +
      '</div>' +
      '<p class="rock-text">' + esc(L(r.formation)) + '</p>' +
      '<div class="comp"><div class="comp-h"><span>' + t("纹理中的矿物组成", "Minerals in the texture") + '</span><span>' + t("体积分数（约）", "Approx. volume %") + '</span></div>' +
        '<div class="bar">' + bar + '</div><div class="legend">' + mineralRows + '</div></div>' +
      '<div class="rock-notes">' +
        '<div class="note"><div class="k">' + t("识别", "Field ID") + '</div><p>' + esc(L(r.tips)) + '</p></div>' +
        '<div class="note"><div class="k">' + t("用途", "Uses") + '</div><p>' + esc(L(r.uses)) + '</p></div>' +
      '</div>';
  }

  function bindLoupe() {
    var frame = $(".frame");
    var img = $("#rock-img");
    var loupe = $("#loupe");
    if (!frame || !img || !loupe) return;
    var Z = 2.7, R = 84;
    frame.addEventListener("mousemove", function (e) {
      var b = frame.getBoundingClientRect();
      var x = e.clientX - b.left, y = e.clientY - b.top;
      loupe.style.backgroundImage = "url(" + img.src + ")";
      loupe.style.backgroundSize = (b.width * Z) + "px " + (b.height * Z) + "px";
      loupe.style.backgroundPosition = (-(x * Z - R)) + "px " + (-(y * Z - R)) + "px";
      loupe.style.left = (x - R) + "px";
      loupe.style.top = (y - R) + "px";
      loupe.classList.add("on");
    });
    frame.addEventListener("mouseleave", function () { loupe.classList.remove("on"); });
  }

  function renderTray() {
    var box = $("#rock-tray");
    box.innerHTML = "";
    GEO.rocks.forEach(function (r, i) {
      var b = el("button", "rthumb");
      b.type = "button";
      b.setAttribute("aria-selected", String(r.id === state.rock));
      if (r.family !== state.family) b.style.opacity = ".42";
      b.innerHTML = '<div class="im"><img src="assets/' + r.img + '" alt="' + esc(L(r.name)) + '" loading="lazy"></div>' +
        '<div class="cap"><span>R-' + String(i + 1).padStart(2, "0") + '</span><span>' + esc(L(r.name)) + '</span></div>';
      b.addEventListener("click", function () {
        state.rock = r.id; state.family = r.family;
        renderTabs(); renderRock(); renderTray();
      });
      box.appendChild(b);
    });
  }

  /* ======================================================================
     九、渲染 · 岩石循环
     ====================================================================== */
  var ARCS = {
    crystallize: { a1: -90, a2: 0 },
    weather: { a1: 0, a2: 90 },
    metamorphose: { a1: 90, a2: 180 },
    melt: { a1: 180, a2: 270 }
  };
  var STEP_ARC = {
    crystallize: "crystallize", weather: "weather", transport: "weather", lithify: "weather",
    metamorphose: "metamorphose", uplift: "metamorphose", melt: "melt", remelt: "melt"
  };

  function renderCycle() {
    var NS = "http://www.w3.org/2000/svg";
    var svg = $("#cycle-svg");
    svg.innerHTML = "";
    var cx = 230, cy = 230, R = 148;
    function pt(deg, r) {
      var a = deg * Math.PI / 180;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    }
    function add(tag, attrs, text) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (text != null) n.textContent = text;
      svg.appendChild(n);
      return n;
    }

    // 外圈细环
    add("circle", { cx: cx, cy: cy, r: R + 34, fill: "none", stroke: "rgba(23,26,24,.08)", "stroke-width": 1 });

    var nodes = [
      { id: "magma", deg: -90, zh: "岩浆", en: "Magma", c: "#8E3A2B" },
      { id: "igneous", deg: 0, zh: "岩浆岩", en: "Igneous", c: "#8E3A2B" },
      { id: "sedimentary", deg: 90, zh: "沉积岩", en: "Sedimentary", c: "#A8862F" },
      { id: "metamorphic", deg: 180, zh: "变质岩", en: "Metamorphic", c: "#24567F" }
    ];

    Object.keys(ARCS).forEach(function (key) {
      var arc = ARCS[key], p1 = pt(arc.a1 + 20, R), p2 = pt(arc.a2 - 20, R);
      var d = "M" + p1[0] + " " + p1[1] + " A" + R + " " + R + " 0 0 1 " + p2[0] + " " + p2[1];
      var g = document.createElementNS(NS, "g");
      g.setAttribute("class", "cy-arc");
      g.setAttribute("data-arc", key);
      var halo = document.createElementNS(NS, "path");
      halo.setAttribute("d", d); halo.setAttribute("class", "halo");
      var line = document.createElementNS(NS, "path");
      line.setAttribute("d", d); line.setAttribute("class", "line");
      line.setAttribute("stroke-dasharray", "2 5");
      line.setAttribute("id", "arcpath-" + key);
      var hit = document.createElementNS(NS, "path");
      hit.setAttribute("d", d); hit.setAttribute("class", "hit");
      g.appendChild(halo); g.appendChild(line); g.appendChild(hit);

      // 箭头
      var aTip = (arc.a2 - 4) * Math.PI / 180;
      var tipA = arc.a2 - 23;
      var tip = pt(tipA, R);
      var arrow = document.createElementNS(NS, "path");
      arrow.setAttribute("d", "M-5.2,-3.8 L5,0 L-5.2,3.8 Z");
      arrow.setAttribute("transform", "translate(" + tip[0] + "," + tip[1] + ") rotate(" + (tipA + 90) + ")");
      arrow.setAttribute("class", "cy-arrow");
      arrow.setAttribute("fill", "#7a756a");
      g.appendChild(arrow);

      // 流动点
      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("r", "3");
      dot.setAttribute("class", "cy-dot");
      dot.setAttribute("data-dot", key);
      var am = document.createElementNS(NS, "animateMotion");
      am.setAttribute("dur", "4.2s");
      am.setAttribute("repeatCount", "indefinite");
      am.setAttribute("begin", "0s");
      var mp = document.createElementNS(NS, "mpath");
      mp.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#arcpath-" + key);
      am.appendChild(mp); dot.appendChild(am);
      g.appendChild(dot);

      // 标签
      var mid = (arc.a1 + arc.a2) / 2;
      var lp = pt(mid, R + 26);
      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", lp[0]); label.setAttribute("y", lp[1]);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "cy-lbl");
      label.setAttribute("data-arc-lbl", key);
      var step = GEO.cycle.filter(function (s) { return STEP_ARC[s.id] === key; })[0];
      label.textContent = step ? L(step.name) : "";
      g.appendChild(label);
      svg.appendChild(g);

      g.addEventListener("click", function () { setProcess(step.id); });
      g.addEventListener("mouseenter", function () { highlightArc(key); });
    });

    // 节点
    nodes.forEach(function (n) {
      var p = pt(n.deg, R);
      var g = document.createElementNS(NS, "g");
      g.setAttribute("class", "cy-node");
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", p[0]); c.setAttribute("cy", p[1]); c.setAttribute("r", 52);
      c.setAttribute("fill", "#F7F3EA");
      c.setAttribute("stroke", n.c);
      c.setAttribute("stroke-width", "1.2");
      g.appendChild(c);
      var c2 = document.createElementNS(NS, "circle");
      c2.setAttribute("cx", p[0]); c2.setAttribute("cy", p[1]); c2.setAttribute("r", 44);
      c2.setAttribute("fill", "none");
      c2.setAttribute("stroke", n.c);
      c2.setAttribute("stroke-opacity", ".18");
      g.appendChild(c2);
      var tx = document.createElementNS(NS, "text");
      tx.setAttribute("x", p[0]); tx.setAttribute("y", p[1] + 3);
      tx.setAttribute("text-anchor", "middle");
      tx.setAttribute("font-size", LANG === "zh" ? "17" : "12.5");
      tx.setAttribute("fill", "#171A18");
      tx.textContent = LANG === "zh" ? n.zh : n.en;
      g.appendChild(tx);
      var te = document.createElementNS(NS, "text");
      te.setAttribute("x", p[0]); te.setAttribute("y", p[1] + 20);
      te.setAttribute("text-anchor", "middle");
      te.setAttribute("font-family", "ui-monospace, monospace");
      te.setAttribute("font-size", "7.6");
      te.setAttribute("letter-spacing", "1.2");
      te.setAttribute("fill", "#83887F");
      te.textContent = LANG === "zh" ? n.en.toUpperCase() : n.zh;
      g.appendChild(te);
      svg.appendChild(g);
    });

    // 中心说明
    var c1 = document.createElementNS(NS, "text");
    c1.setAttribute("x", cx); c1.setAttribute("y", cy - 6);
    c1.setAttribute("text-anchor", "middle");
    c1.setAttribute("font-family", "Songti SC, serif");
    c1.setAttribute("font-size", "14");
    c1.setAttribute("fill", "#83887F");
    c1.textContent = LANG === "zh" ? "岩石循环" : "Rock cycle";
    svg.appendChild(c1);
    var c2t = document.createElementNS(NS, "text");
    c2t.setAttribute("x", cx); c2t.setAttribute("y", cy + 14);
    c2t.setAttribute("text-anchor", "middle");
    c2t.setAttribute("font-family", "ui-monospace, monospace");
    c2t.setAttribute("font-size", "8");
    c2t.setAttribute("letter-spacing", "1.4");
    c2t.setAttribute("fill", "#83887F");
    c2t.textContent = "NO START · NO END";
    svg.appendChild(c2t);
  }

  function renderProcList() {
    var box = $("#proc-list");
    box.innerHTML = "";
    GEO.cycle.forEach(function (s, i) {
      var b = el("button", "proc");
      b.type = "button";
      b.setAttribute("aria-current", String(s.id === state.process));
      b.innerHTML = '<span class="n">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<span class="t">' + esc(L(s.name)) + '</span>' +
        '<span class="e">' + esc(LANG === "zh" ? s.name.en : s.name.zh) + '</span>';
      b.addEventListener("click", function () { setProcess(s.id); });
      b.addEventListener("mouseenter", function () { highlightArc(STEP_ARC[s.id]); });
      box.appendChild(b);
    });
  }

  function highlightArc(key) {
    $$(".cy-arc").forEach(function (g) {
      g.classList.toggle("active", g.getAttribute("data-arc") === key);
    });
    $$(".cy-dot").forEach(function (d) {
      d.style.opacity = d.getAttribute("data-dot") === key ? "1" : "0";
    });
  }

  function setProcess(id) {
    state.process = id;
    var s = null;
    GEO.cycle.forEach(function (x) { if (x.id === id) s = x; });
    if (!s) return;
    highlightArc(STEP_ARC[id]);
    $$(".proc").forEach(function (b, i) {
      b.setAttribute("aria-current", String(GEO.cycle[i].id === id));
    });
    var d = $("#cycle-detail");
    d.innerHTML = '<div class="hd"><h3>' + esc(L(s.name)) + '</h3><span class="en">' + esc(LANG === "zh" ? s.name.en : s.name.zh) + '</span></div>' +
      '<p>' + esc(L(s.body)) + '</p>' +
      '<div class="energy">' + esc(L(s.energy)) + '</div>';
  }

  /* ======================================================================
     十、渲染 · 鉴定
     ====================================================================== */
  function renderMohs() {
    var box = $("#mohs"), labs = $("#mohs-labels");
    box.innerHTML = ""; labs.innerHTML = "";
    GEO.mohs.forEach(function (m) {
      var b = el("div", "mbar");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(m.h === state.mohs));
      var btn = el("button");
      btn.type = "button";
      btn.style.width = "100%";
      btn.innerHTML = '<div class="h">' + m.h + '</div><div class="fill" style="--h:' + m.h + '"></div>';
      btn.addEventListener("click", function () { state.mohs = m.h; renderMohs(); });
      b.appendChild(btn);
      box.appendChild(b);

      var s = el("span", null, LANG === "zh" ? m.zh : m.en);
      labs.appendChild(s);
    });
    var cur = GEO.mohs[state.mohs - 1];
    var objs = [
      { h: 2.5, zh: "指甲", en: "Fingernail" },
      { h: 3.5, zh: "铜币", en: "Copper coin" },
      { h: 4.5, zh: "铁钉", en: "Iron nail" },
      { h: 5.5, zh: "玻璃", en: "Glass" },
      { h: 6.5, zh: "钢锉", en: "Steel file" }
    ];
    var canScratch = objs.filter(function (o) { return o.h < cur.h; });
    var scratchedBy = objs.filter(function (o) { return o.h > cur.h; });
    $("#mohs-detail").innerHTML =
      '<div class="big">' + cur.h + '</div>' +
      '<div><div class="nm">' + esc(L(cur)) + ' <span style="font-family:var(--mono);font-size:9px;color:var(--ink-3);letter-spacing:.14em">MOHS</span></div>' +
      '<p>' + esc(L(cur.note)) + '</p>' +
      '<div class="objects">' +
        '<span>' + t("能刻划", "Scratches") + ': ' + (canScratch.length ? canScratch.map(function (o) { return esc(L(o)); }).join(" · ") : t("几乎无", "almost none")) + '</span>' +
        '<span>' + t("被刻划", "Scratched by") + ': ' + (scratchedBy.length ? scratchedBy.map(function (o) { return esc(L(o)); }).join(" · ") : t("无", "none")) + '</span>' +
      '</div></div>';
  }

  function renderTests() {
    var box = $("#tests");
    box.innerHTML = "";
    var icons = {
      0: '<svg viewBox="0 0 34 34" class="ico"><rect x="4" y="18" width="26" height="12" fill="none" stroke="#171A18"/><path d="M8 24 h12" stroke="#8E3A2B" stroke-width="3"/></svg>',
      1: '<svg viewBox="0 0 34 34" class="ico"><path d="M17 4 L30 12 L26 28 L8 28 L4 12 Z" fill="none" stroke="#171A18"/><path d="M17 4 L17 28 M4 12 L30 12 M8 28 L22 12" fill="none" stroke="#24567F" stroke-width=".8"/></svg>',
      2: '<svg viewBox="0 0 34 34" class="ico"><circle cx="17" cy="17" r="12" fill="none" stroke="#171A18"/><path d="M6 17 a11 11 0 0 1 22 0" fill="none" stroke="#A8862F" stroke-width="2"/><circle cx="13" cy="12" r="3" fill="#fff"/></svg>',
      3: '<svg viewBox="0 0 34 34" class="ico"><path d="M6 26 h22" stroke="#171A18"/><circle cx="13" cy="21" r="2.4" fill="none" stroke="#24567F"/><circle cx="19" cy="16" r="1.8" fill="none" stroke="#24567F"/><circle cx="23" cy="22" r="1.4" fill="none" stroke="#24567F"/><circle cx="10" cy="14" r="1.2" fill="none" stroke="#24567F"/></svg>'
    };
    GEO.tests.forEach(function (x, i) {
      var d = el("div", "tcard");
      d.innerHTML = icons[i] + '<h4>' + esc(LANG === "zh" ? x.zh : x.en) + '</h4><p>' + esc(L(x.body)) + '</p>';
      box.appendChild(d);
    });
  }

  /* ======================================================================
     十一、渲染 · 来源
     ====================================================================== */
  function renderCredits() {
    var box = $("#credits-list");
    box.innerHTML = "";
    var head = el("div", "crow");
    head.style.fontFamily = "var(--mono)";
    head.style.fontSize = "9px";
    head.style.letterSpacing = ".14em";
    head.style.color = "var(--ink-3)";
    head.innerHTML = "<span>" + t("标本", "SPECIMEN") + "</span><span>" + t("作者", "AUTHOR") + "</span><span>" + t("许可", "LICENCE") + "</span><span style='text-align:right'>" + t("来源", "SOURCE") + "</span>";
    box.appendChild(head);

    var items = GEO.minerals.map(function (m) { return { key: m.img.replace(".jpg", ""), name: m.name }; })
      .concat(GEO.rocks.map(function (r) { return { key: r.img.replace(".jpg", ""), name: r.name }; }));
    items.forEach(function (it) {
      var c = CREDITS[it.key] || {};
      var row = el("div", "crow");
      row.innerHTML = '<span class="nm">' + esc(L(it.name)) + '</span>' +
        '<span class="au">' + esc(c.author || "—") + '</span>' +
        '<span class="li">' + esc(c.license || "—") + '</span>' +
        '<span class="lk">' + (c.page ? '<a href="' + c.page + '" target="_blank" rel="noopener">Commons ↗</a>' : "—") + '</span>';
      box.appendChild(row);
    });

    var refs = $("#refs");
    refs.innerHTML = "";
    GEO.refs.forEach(function (r, i) {
      var d = el("div", "ref");
      d.innerHTML = '<span class="n">' + String(i + 1).padStart(2, "0") + '</span><span>' +
        (r.url ? '<a href="' + r.url + '" target="_blank" rel="noopener">' + esc(L(r)) + '</a>' : esc(L(r))) + '</span>';
      refs.appendChild(d);
    });
  }

  /* ======================================================================
     十二、总渲染
     ====================================================================== */
  function renderAll() {
    renderMineralList();
    renderMineralPanel();
    renderFilmstrip();
    renderClasses();
    renderTabs();
    renderRock();
    renderTray();
    renderCycle();
    renderProcList();
    setProcess(state.process);
    renderMohs();
    renderTests();
    renderCredits();
  }

  /* ======================================================================
     十三、标签导航
     ====================================================================== */
  var TABS = ["overview", "definition", "minerals", "classes", "rocks", "cycle", "identify", "credits"];
  var scrollMemo = {};
  var curTab = null;

  function panelOf(id) { return document.querySelector('.panel[data-panel="' + id + '"]'); }

  function revealIn(panel) {
    if (!panel) return;
    var items = panel.querySelectorAll(".reveal");
    for (var i = 0; i < items.length; i++) {
      (function (n, k) {
        if (n.classList.contains("in")) return;
        n.style.transitionDelay = Math.min(k * 55, 320) + "ms";
        setTimeout(function () { n.classList.add("in"); }, 30);
        setTimeout(function () { n.style.transitionDelay = ""; }, 1200);
      })(items[i], i);
    }
  }

  function setTab(id, opts) {
    opts = opts || {};
    if (TABS.indexOf(id) < 0) id = "overview";
    if (id === curTab && !opts.force) return;

    if (curTab) {
      var old = panelOf(curTab);
      if (old) scrollMemo[curTab] = old.scrollTop;
    }
    curTab = id;

    var activeBtn = null;
    $$(".tab[data-tab]").forEach(function (b) {
      var on = b.getAttribute("data-tab") === id;
      b.setAttribute("aria-selected", String(on));
      b.setAttribute("tabindex", on ? "0" : "-1");
      if (on) activeBtn = b;
    });

    $$(".panel").forEach(function (p) {
      var on = p.getAttribute("data-panel") === id;
      p.classList.toggle("active", on);
      if (on) {
        p.scrollTop = opts.reset ? 0 : (scrollMemo[id] || 0);
        revealIn(p);
      }
    });

    if (heroStage) heroStage.visible = (id === "overview");
    if (minStage) minStage.visible = (id === "minerals");
    if (id === "overview" || id === "minerals") {
      requestAnimationFrame(function () {
        if (heroStage) heroStage.size();
        if (minStage) minStage.size();
      });
    }

    if (activeBtn && activeBtn.scrollIntoView) {
      try { activeBtn.scrollIntoView({ block: "nearest", inline: "center" }); } catch (e) { }
    }

    if (opts.hash !== false) {
      try { history.replaceState(null, "", "#" + id); } catch (e) { }
    }
    balancePanels();
  }

  // 内容不足一屏时垂直居中，超过一屏则保持顶部对齐
  function balancePanels() {
    var vh = window.innerHeight || 800;
    $$(".panel").forEach(function (p) {
      var inner = p.querySelector(".panel-inner");
      if (!inner) return;
      var was = p.classList.contains("is-short");
      if (was) p.classList.remove("is-short");
      var fits = p.scrollHeight <= (p.clientHeight || vh) + 2;
      p.classList.toggle("is-short", fits);
      if (was !== fits && p.getAttribute("data-panel") === curTab) p.scrollTop = 0;
    });
  }

  function bindTabs() {
    var bar = $("#tabs");
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".tab[data-tab]") : null;
      if (b) setTab(b.getAttribute("data-tab"));
    });
    bar.addEventListener("keydown", function (e) {
      var k = e.key, i = TABS.indexOf(curTab);
      if (k === "ArrowDown" || k === "ArrowRight") { e.preventDefault(); setTab(TABS[(i + 1) % TABS.length]); }
      else if (k === "ArrowUp" || k === "ArrowLeft") { e.preventDefault(); setTab(TABS[(i - 1 + TABS.length) % TABS.length]); }
      else if (k === "Home") { e.preventDefault(); setTab(TABS[0]); }
      else if (k === "End") { e.preventDefault(); setTab(TABS[TABS.length - 1]); }
      else return;
      var b2 = $('.tab[data-tab="' + curTab + '"]');
      if (b2) b2.focus();
    });

    // 页内锚点 → 切换标签
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      if (TABS.indexOf(id) < 0) return;
      e.preventDefault();
      setTab(id);
    });

    window.addEventListener("hashchange", function () {
      var id = location.hash.replace("#", "");
      if (TABS.indexOf(id) >= 0) setTab(id, { hash: false });
    });
  }

  /* ======================================================================
     十四、初始化
     ====================================================================== */
  function init() {
    $$(".dial").forEach(buildDial);

    if (window.THREE) {
      try {
        heroStage = new Stage($("#hero-canvas"), { interactive: true, rotY: -0.6, rotX: 0.14 });
        heroStage.setModel(mineralById("quartz"));
        heroStage.targetDist = 6.2; heroStage.dist = 6.2;

        minStage = new Stage($("#min-canvas"), { interactive: true });
        minStage.setModel(GEO.minerals[state.mineral]);

        var btnSpin = $("#btn-spin"), btnWire = $("#btn-wire"), btnReset = $("#btn-reset");
        btnSpin.addEventListener("click", function () {
          minStage.spinning = !minStage.spinning;
          btnSpin.setAttribute("aria-pressed", String(minStage.spinning));
        });
        btnWire.addEventListener("click", function () {
          var on = btnWire.getAttribute("aria-pressed") !== "true";
          btnWire.setAttribute("aria-pressed", String(on));
          minStage.setWire(on);
        });
        btnReset.addEventListener("click", function () { minStage.reset(); });

        (function loop(time) {
          for (var i = 0; i < stages.length; i++) stages[i].tick(time);
          requestAnimationFrame(loop);
        })(0);
      } catch (err) {
        console.error("WebGL init failed", err);
        document.body.classList.add("no-webgl");
      }
    }

    $$("[data-lang-btn]").forEach(function (b) {
      b.addEventListener("click", function () {
        var l = b.getAttribute("data-lang-btn");
        if (l !== LANG) applyLang(l);
      });
    });

    applyLang("zh");
    bindTabs();

    var bt = null;
    window.addEventListener("resize", function () {
      clearTimeout(bt);
      bt = setTimeout(balancePanels, 160);
    });

    var start = location.hash.replace("#", "");
    setTab(TABS.indexOf(start) >= 0 ? start : "overview", { force: true, hash: false });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
