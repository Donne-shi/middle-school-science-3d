/* ==========================================================================
   core.js — 公共数据、三维舞台、粒子与图例基元
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM = window.CHEM || {};

  // 让十六进制颜色按 sRGB 解释，避免输出编码造成褪色
  if (window.THREE && THREE.ColorManagement) {
    THREE.ColorManagement.legacyMode = false;
  }

  /* ---------------- 数学 ---------------- */
  C.clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  C.lerp = function (a, b, t) { return a + (b - a) * t; };
  C.smooth = function (t) { return t * t * (3 - 2 * t); };
  C.ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  C.rand = function (a, b) { return a + Math.random() * (b - a); };
  C.fmt = function (v, d) { d = d == null ? 1 : d; return (+v).toFixed(d); };

  /* ---------------- 元素配色（3D 与图例共用） ---------------- */
  C.ATOM = {
    H:  { css: '#E9F1F4', color: 0xE9F1F4, r: 0.17 },
    C:  { css: '#4B545A', color: 0x4B545A, r: 0.26 },
    O:  { css: '#D9584A', color: 0xD9584A, r: 0.24 },
    N:  { css: '#4E7FB8', color: 0x4E7FB8, r: 0.24 },
    Na: { css: '#C9A03C', color: 0xC9A03C, r: 0.26 },
    Cl: { css: '#2A8F6E', color: 0x2A8F6E, r: 0.26 },
    Ca: { css: '#9B77BD', color: 0x9B77BD, r: 0.28 },
    S:  { css: '#D6B33C', color: 0xD6B33C, r: 0.28 },
    Al: { css: '#93A2A8', color: 0x93A2A8, r: 0.26 },
    Fe: { css: '#8A5A3B', color: 0x8A5A3B, r: 0.27 }
  };

  /* ---------------- 溶质数据 ---------------- */
  /* 单位：g / 100 g 水；数据取自中学化学常用溶解度表 */
  C.SOL = {
    KNO3: {
      zh: '硝酸钾', en: 'Potassium nitrate', formula: 'KNO₃', css: '#D9772F', color: 0xD9772F,
      ionA: { label: 'K⁺', css: '#D9772F', color: 0xD9772F },
      ionB: { label: 'NO₃⁻', css: '#2A8F6E', color: 0x2A8F6E },
      pts: [[0, 13.3], [10, 20.9], [20, 31.6], [30, 45.8], [40, 63.9], [50, 85.5], [60, 110], [70, 138], [80, 169], [90, 202], [100, 246]]
    },
    NaCl: {
      zh: '氯化钠', en: 'Sodium chloride', formula: 'NaCl', css: '#C9A03C', color: 0xC9A03C,
      ionA: { label: 'Na⁺', css: '#C9A03C', color: 0xC9A03C },
      ionB: { label: 'Cl⁻', css: '#2A8F6E', color: 0x2A8F6E },
      pts: [[0, 35.7], [10, 35.8], [20, 36.0], [30, 36.3], [40, 36.6], [50, 37.0], [60, 37.3], [70, 37.8], [80, 38.4], [90, 39.0], [100, 39.8]]
    },
    CaOH2: {
      zh: '氢氧化钙', en: 'Calcium hydroxide', formula: 'Ca(OH)₂', css: '#9B77BD', color: 0x9B77BD,
      ionA: { label: 'Ca²⁺', css: '#9B77BD', color: 0x9B77BD },
      ionB: { label: 'OH⁻', css: '#D9772F', color: 0xD9772F },
      pts: [[0, 0.185], [10, 0.176], [20, 0.165], [30, 0.153], [40, 0.141], [50, 0.138], [60, 0.116], [70, 0.106], [80, 0.094], [90, 0.085], [100, 0.077]]
    },
    NH4Cl: {
      zh: '氯化铵', en: 'Ammonium chloride', formula: 'NH₄Cl', css: '#2C6C92', color: 0x2C6C92,
      ionA: { label: 'NH₄⁺', css: '#2C6C92', color: 0x2C6C92 },
      ionB: { label: 'Cl⁻', css: '#3E9E7E', color: 0x3E9E7E },
      pts: [[0, 29.4], [10, 33.3], [20, 37.2], [30, 41.4], [40, 45.8], [50, 50.4], [60, 55.2], [70, 60.2], [80, 65.6], [90, 71.3], [100, 77.3]]
    }
  };

  C.solAt = function (key, T) {
    var pts = C.SOL[key].pts;
    T = C.clamp(T, 0, 100);
    for (var i = 0; i < pts.length - 1; i++) {
      if (T >= pts[i][0] && T <= pts[i + 1][0]) {
        var k = (T - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
        return C.lerp(pts[i][1], pts[i + 1][1], k);
      }
    }
    return pts[pts.length - 1][1];
  };

  /* ---------------- 渲染舞台 ---------------- */
  C.stage = function (canvas, opts) {
    opts = opts || {};
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
      });
    } catch (e) {
      canvas.parentNode.classList.add('is-nowebgl');
      return null;
    }
    if (!renderer.getContext()) {
      canvas.parentNode.classList.add('is-nowebgl');
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(opts.fov || 34, 1, 0.1, 220);
    camera.position.fromArray(opts.position || [0, 1.4, 8]);
    var target = new THREE.Vector3().fromArray(opts.target || [0, 0, 0]);
    camera.lookAt(target);

    scene.add(new THREE.HemisphereLight(0xd8ecf2, 0x0a1012, 0.36));
    var key = new THREE.DirectionalLight(0xfff6ea, 0.8);
    key.position.set(5.2, 8.4, 7.2);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0x7fc0d0, 0.28);
    fill.position.set(-7, 3, -4);
    scene.add(fill);
    var rim = new THREE.PointLight(0x69e3c2, 1.0, 18, 2);
    rim.position.set(-3.4, 1.6, -3.0);
    scene.add(rim);
    var warm = new THREE.PointLight(0xff9d63, 0.55, 16, 2);
    warm.position.set(3.6, 0.4, 2.6);
    scene.add(warm);

    function resize() {
      var w = canvas.clientWidth || canvas.parentNode.clientWidth;
      var h = canvas.clientHeight || canvas.parentNode.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentNode);
    else window.addEventListener('resize', resize);

    return { renderer: renderer, scene: scene, camera: camera, target: target, resize: resize, lights: { key: key, rim: rim, warm: warm } };
  };

  /* ---------------- 纹理工具 ---------------- */
  C.radialTex = function (inner, mid, outer) {
    var s = 128, cv = document.createElement('canvas');
    cv.width = cv.height = s;
    var ctx = cv.getContext('2d');
    var g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, inner || 'rgba(255,255,255,1)');
    g.addColorStop(0.45, mid || 'rgba(255,255,255,.35)');
    g.addColorStop(1, outer || 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    var t = new THREE.CanvasTexture(cv);
    t.encoding = THREE.sRGBEncoding;
    return t;
  };

  C.haloTex = (function () {
    var cache = null;
    return function () {
      if (!cache) cache = C.radialTex('rgba(255,255,255,.9)', 'rgba(255,255,255,.28)', 'rgba(255,255,255,0)');
      return cache;
    };
  })();

  C.glowSprite = function (color, size, opacity) {
    var mat = new THREE.SpriteMaterial({
      map: C.haloTex(), color: color, transparent: true, opacity: opacity == null ? 0.55 : opacity,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    var sp = new THREE.Sprite(mat);
    sp.scale.set(size, size, 1);
    return sp;
  };

  C.labelSprite = function (text, color, scale) {
    var size = 52;
    var cv = document.createElement('canvas');
    var ctx = cv.getContext('2d');
    var font = '500 ' + size + 'px "PingFang SC","Hiragino Sans GB","Noto Sans SC",sans-serif';
    ctx.font = font;
    var w = Math.ceil(ctx.measureText(text).width) + 26;
    cv.width = w; cv.height = size * 1.5;
    ctx = cv.getContext('2d');
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,.6)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = color || '#EAF2EF';
    ctx.fillText(text, cv.width / 2, cv.height / 2);
    var tex = new THREE.CanvasTexture(cv);
    tex.encoding = THREE.sRGBEncoding;
    tex.minFilter = THREE.LinearFilter;
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 0
    }));
    var k = (scale || 1) * 0.0056;
    sp.scale.set(cv.width * k, cv.height * k, 1);
    sp.renderOrder = 20;
    return sp;
  };

  /* ---------------- 材质 ---------------- */
  C.glassMat = function (opacity) {
    return new THREE.MeshPhysicalMaterial({
      color: 0xDCF1EE, metalness: 0, roughness: 0.14,
      transparent: true, opacity: opacity == null ? 0.07 : opacity,
      side: THREE.DoubleSide, depthWrite: false,
      clearcoat: 0.6, clearcoatRoughness: 0.14
    });
  };

  C.glowMat = function (color, intensity) {
    return new THREE.MeshStandardMaterial({
      color: color, roughness: 0.44, metalness: 0.04,
      emissive: color, emissiveIntensity: intensity == null ? 0.2 : intensity
    });
  };

  /* ---------------- 玻璃杯 ---------------- */
  C.buildBeaker = function (opt) {
    opt = opt || {};
    var R = opt.radius || 1.42;
    var H = opt.height || 3.3;
    var lh = opt.liquidHeight || 2.15;
    var liquidColor = opt.liquidColor == null ? 0x2f7f8c : opt.liquidColor;
    var g = new THREE.Group();
    var bottomY = -H / 2;

    var glass = C.glassMat(opt.glassOpacity == null ? 0.075 : opt.glassOpacity);
    var wall = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.975, H, 72, 1, true), glass);
    g.add(wall);

    var baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x9FD3CE, metalness: 0, roughness: 0.18, transparent: true, opacity: 0.05,
      side: THREE.DoubleSide, depthWrite: false
    });
    var base = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.975, R * 0.95, 0.07, 72), baseMat);
    base.position.y = bottomY + 0.035;
    g.add(base);

    var rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.021, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0xBFEDE6, transparent: true, opacity: 0.42, depthWrite: false }));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = H / 2;
    g.add(rim);

    var liquidMat = new THREE.MeshPhysicalMaterial({
      color: liquidColor, metalness: 0, roughness: 0.08,
      transparent: true, opacity: 0.26, depthWrite: false
    });
    var liquid = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.945, R * 0.925, lh, 64), liquidMat);
    liquid.position.y = bottomY + lh / 2 + 0.07;
    liquid.renderOrder = 1;
    g.add(liquid);

    var surfMat = new THREE.MeshBasicMaterial({
      color: 0x8FE6DE, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide
    });
    var surface = new THREE.Mesh(new THREE.CircleGeometry(R * 0.945, 64), surfMat);
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = bottomY + lh + 0.07;
    surface.renderOrder = 2;
    g.add(surface);

    var waterline = new THREE.Mesh(
      new THREE.TorusGeometry(R * 0.945, 0.008, 6, 72),
      new THREE.MeshBasicMaterial({ color: 0x9FE8E0, transparent: true, opacity: 0.34, depthWrite: false })
    );
    waterline.rotation.x = Math.PI / 2;
    waterline.position.y = bottomY + lh + 0.07;
    waterline.renderOrder = 3;
    g.add(waterline);

    var glintCanvas = document.createElement('canvas');
    glintCanvas.width = 64; glintCanvas.height = 256;
    var gctx = glintCanvas.getContext('2d');
    var lg = gctx.createLinearGradient(0, 0, 64, 0);
    lg.addColorStop(0, 'rgba(255,255,255,0)');
    lg.addColorStop(0.45, 'rgba(255,255,255,.55)');
    lg.addColorStop(0.62, 'rgba(255,255,255,.18)');
    lg.addColorStop(1, 'rgba(255,255,255,0)');
    gctx.fillStyle = lg;
    gctx.fillRect(0, 0, 64, 256);
    var glintTex = new THREE.CanvasTexture(glintCanvas);
    glintTex.encoding = THREE.sRGBEncoding;
    var glint = new THREE.Mesh(
      new THREE.PlaneGeometry(R * 0.7, H * 0.86),
      new THREE.MeshBasicMaterial({ map: glintTex, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    glint.position.set(-R * 0.52, 0, R * 0.68);
    glint.rotation.y = -0.42;
    glint.renderOrder = 3;
    g.add(glint);

    g.position.y = opt.offsetY == null ? 0 : opt.offsetY;
    return { group: g, liquid: liquid, liquidMat: liquidMat, surface: surface, R: R, H: H, bottomY: bottomY + g.position.y, liquidTop: bottomY + lh + g.position.y };
  };

  /* ---------------- 水分子 ---------------- */
  C.waterMolecule = function (scale) {
    var s = scale || 1;
    var g = new THREE.Group();
    var oMat = new THREE.MeshStandardMaterial({ color: 0x5F94AC, roughness: 0.42, metalness: 0, transparent: true, opacity: 0.52, emissive: 0x16323C, emissiveIntensity: 0.45 });
    var hMat = new THREE.MeshStandardMaterial({ color: 0xD6E7EA, roughness: 0.45, metalness: 0, transparent: true, opacity: 0.34 });
    var o = new THREE.Mesh(new THREE.SphereGeometry(0.125 * s, 14, 12), oMat);
    g.add(o);
    var h1 = new THREE.Mesh(new THREE.SphereGeometry(0.058 * s, 10, 8), hMat);
    h1.position.set(0.142 * s, 0.09 * s, 0);
    var h2 = new THREE.Mesh(new THREE.SphereGeometry(0.058 * s, 10, 8), hMat);
    h2.position.set(-0.142 * s, 0.09 * s, 0);
    g.add(h1, h2);
    return g;
  };

  /* ---------------- 离子球：与图例同源的参数 ---------------- */
  /* r 为基准半径，光晕倍数 2.5，与 C.icon('ion') 的绘制比例一致 */
  C.ION_R = 0.132;
  C.ION_GLOW = 2.5;
  C.ionBall = function (color, r, opts) {
    opts = opts || {};
    var rad = r || C.ION_R;
    var g = new THREE.Group();
    var mesh = new THREE.Mesh(
      new THREE.SphereGeometry(rad, 22, 18),
      new THREE.MeshStandardMaterial({
        color: color, roughness: 0.34, metalness: 0.04,
        emissive: color, emissiveIntensity: opts.emissive == null ? 0.34 : opts.emissive
      })
    );
    g.add(mesh);
    var halo = C.glowSprite(color, rad * 2 * C.ION_GLOW, opts.halo == null ? 0.34 : opts.halo);
    g.add(halo);
    g.userData = { mesh: mesh, halo: halo, r: rad };
    return g;
  };

  /* 未溶解晶体：3×3×3 球簇，与图例团簇同一构造逻辑 */
  C.CRYSTAL_STEP = 0.3;
  C.CRYSTAL_R = 0.185;
  C.crystalCluster = function (color, n, step, rad) {
    var s = step || C.CRYSTAL_STEP;
    var rr = rad || C.CRYSTAL_R;
    var hits = n || 3;
    var g = new THREE.Group();
    var geo = new THREE.SphereGeometry(rr, 16, 12);
    var mat = new THREE.MeshStandardMaterial({
      color: color, roughness: 0.52, metalness: 0.02,
      emissive: color, emissiveIntensity: 0.12
    });
    var half = (hits - 1) / 2;
    for (var i = 0; i < hits; i++) {
      for (var j = 0; j < hits; j++) {
        for (var k = 0; k < hits; k++) {
          var m = new THREE.Mesh(geo, mat);
          m.position.set((i - half) * s, (j - half) * s, (k - half) * s);
          g.add(m);
        }
      }
    }
    g.userData = { step: s, rad: rr, n: hits };
    return g;
  };

  /* ---------------- 图例图标（SVG，与 3D 参数同源） ---------------- */
  /* kind: ion | molecule | crystal | water | oil | dust */
  C.icon = function (kind, cssColor, scale) {
    var s = scale || 1;
    var W = 26 * s, H = 26 * s, cx = W / 2, cy = H / 2;
    var c = cssColor || '#D9772F';
    var out = '';
    if (kind === 'ion') {
      var r = 6.2 * s;
      out = '<defs><radialGradient id="g' + c.replace('#', '') + s + '">' +
        '<stop offset="0" stop-color="' + c + '" stop-opacity=".95"/>' +
        '<stop offset=".62" stop-color="' + c + '" stop-opacity=".9"/>' +
        '<stop offset="1" stop-color="' + c + '" stop-opacity=".55"/></radialGradient></defs>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * C.ION_GLOW * 0.9) + '" fill="' + c + '" opacity=".16"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#g' + c.replace('#', '') + s + ')"/>' +
        '<circle cx="' + (cx - r * 0.3) + '" cy="' + (cy - r * 0.32) + '" r="' + (r * 0.26) + '" fill="#fff" opacity=".55"/>';
    } else if (kind === 'crystal') {
      /* 晶体：几颗球堆成的一小坨，轮廓要「不圆」，才和单个离子区分得开 */
      var sr = 4.15 * s;
      var pts = [[-4.9, 3.1], [4.9, 3.1], [0, 4.3], [-2.4, -0.5], [2.4, -0.5], [0, -4.3]];
      out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (11 * s) + '" fill="' + c + '" opacity=".08"/>';
      for (var i = 0; i < pts.length; i++) {
        var ox = pts[i][0] * s, oy = pts[i][1] * s;
        var top = oy < 0;
        out += '<circle cx="' + (cx + ox) + '" cy="' + (cy + oy) + '" r="' + sr + '" fill="' + c + '" opacity="' + (top ? 0.98 : 0.9) + '"/>' +
          '<circle cx="' + (cx + ox - sr * 0.26) + '" cy="' + (cy + oy - sr * 0.28) + '" r="' + (sr * 0.28) + '" fill="#fff" opacity="' + (top ? 0.34 : 0.2) + '"/>';
      }
    } else if (kind === 'molecule' || kind === 'water') {
      var pale = kind === 'water';
      var oc = pale ? '#5F94AC' : c;
      var hc = pale ? '#D8E9EC' : c;
      var oR = 4.35 * s, hR = 2.55 * s;
      /* 两个氢要探出氧球之外，否则缩到 22px 就糊成一团 */
      out = '<circle cx="' + (cx - oR * 1.12) + '" cy="' + (cy + oR * 0.62) + '" r="' + hR + '" fill="' + hc + '" opacity=".92"/>' +
        '<circle cx="' + (cx + oR * 1.12) + '" cy="' + (cy + oR * 0.62) + '" r="' + hR + '" fill="' + hc + '" opacity=".92"/>' +
        '<circle cx="' + cx + '" cy="' + (cy - oR * 0.22) + '" r="' + oR + '" fill="' + oc + '"/>' +
        '<circle cx="' + (cx - oR * 0.3) + '" cy="' + (cy - oR * 0.52) + '" r="' + (oR * 0.26) + '" fill="#fff" opacity=".42"/>';
    } else if (kind === 'oil') {
      var orr = 4.4 * s;
      out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + orr + '" fill="' + c + '" opacity=".82"/>' +
        '<circle cx="' + (cx - orr * 0.3) + '" cy="' + (cy - orr * 0.34) + '" r="' + (orr * 0.3) + '" fill="#fff" opacity=".5"/>';
    } else if (kind === 'dust') {
      var dr = 3.4 * s;
      out = '<polygon points="' +
        [[0, -dr], [dr * 0.86, -dr * 0.5], [dr * 0.86, dr * 0.5], [0, dr], [-dr * 0.86, dr * 0.5], [-dr * 0.86, -dr * 0.5]]
          .map(function (p) { return (cx + p[0]) + ',' + (cy + p[1]); }).join(' ') +
        '" fill="' + c + '"/>';
    }
    return '<svg class="ico" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">' + out + '</svg>';
  };

  /* ---------------- 光束（沿 X 轴） ---------------- */
  C.beamX = function (len, radius, color, opacity) {
    var geo = new THREE.CylinderGeometry(radius, radius, len, 16, 1, true);
    var mat = new THREE.MeshBasicMaterial({
      color: color, transparent: true, opacity: opacity == null ? 0.3 : opacity,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    var m = new THREE.Mesh(geo, mat);
    m.rotation.z = Math.PI / 2;
    m.renderOrder = 6;
    return m;
  };

  /* ---------------- 循环 ---------------- */
  C.loop = (function () {
    var fns = [], raf = 0, last = 0;
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      for (var i = 0; i < fns.length; i++) {
        try { fns[i](dt, now / 1000); } catch (e) { /* 单个场景异常不阻塞其他场景 */ }
      }
      raf = requestAnimationFrame(frame);
    }
    return {
      add: function (fn) {
        fns.push(fn);
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      }
    };
  })();

  /* 可开关的 ticker：视图不可见时不推进模拟 */
  C.ticker = function (fn) {
    var on = false;
    C.loop.add(function (dt, t) { if (on) fn(dt, t); });
    return {
      start: function () { on = true; },
      stop: function () { on = false; },
      get on() { return on; }
    };
  };

  C.whenVisible = function (el, cb) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { cb(e.isIntersecting); });
    }, { rootMargin: '120px 0px' });
    io.observe(el);
  };

  /* 指针视角微调 */
  C.parallax = function (el, camera, base, amount) {
    if (!el) return function () {};
    var tx = 0, ty = 0;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    el.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
    return function () {
      var a = amount || 0.22;
      camera.position.x += (base[0] + tx * a - camera.position.x) * 0.04;
      camera.position.y += (base[1] - ty * a * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(0, base[3] == null ? 0.1 : base[3], 0);
    };
  };

  /* 视图注册表 */
  window.VIEWS = window.VIEWS || {};

})();
