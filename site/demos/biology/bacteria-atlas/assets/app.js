/* ==========================================================================
   细菌 · 形态与结构  /  Bacteria Atlas
   assets/app.js  —  左侧目录 · 右侧详情 · 单视窗 3D
   依赖：three.min.js (r147, UMD) · photos/meta.js · assets/data.js
   ========================================================================== */
(function () {
  'use strict';

  var A = window.ATLAS;
  var META = window.PHOTO_META || {};
  if (!A) { console.warn('ATLAS data missing'); return; }

  var detailEl = document.getElementById('detail');
  var sideEl = document.getElementById('sideNav');
  var VIEW = { active: null };          /* 由下方 3D 段填充 */
  var mountScene = function () { };     /* 由下方 3D 段覆盖 */

  /* ------------------------------------------------------------------ 工具 */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function chips(list) {
    return '<ul class="chips">' + list.map(function (t) {
      var cls = /革兰阴性|Gram-negative/.test(t) ? ' n' : (/革兰阳性|Gram-positive|蓝细菌/.test(t) ? ' g' : '');
      return '<li class="' + cls.trim() + '">' + esc(t) + '</li>';
    }).join('') + '</ul>';
  }
  function groupOf(key) {
    for (var i = 0; i < A.groups.length; i++) {
      if (A.groups[i].keys.indexOf(key) >= 0) return A.groups[i];
    }
    return null;
  }

  /* ------------------------------------------------------------------ 目录 */

  function itHTML(key, mark, cn, en, cls) {
    return '<button class="it ' + (cls || '') + '" data-key="' + key + '" type="button">' +
      '<span class="no">' + esc(mark) + '</span>' +
      '<span class="tx"><b>' + esc(cn) + '</b><i>' + esc(en) + '</i></span></button>';
  }

  function buildSide() {
    var h = '<div class="side-head"><span>目录 · Index</span><b>12</b></div>';
    h += itHTML('overview', '◍', '概览', 'Overview', 'top');
    h += itHTML('structure', '◫', '结构剖面', 'Cross-section', 'top');

    A.groups.forEach(function (g) {
      h += '<button class="grp" data-key="' + g.id + '" type="button">' +
        '<b>' + esc(g.cn) + '</b><em>' + esc(g.en) + '</em><i></i></button>';
      g.keys.forEach(function (k) {
        var s = A.specs[k];
        h += itHTML(k, s.num, s.cn, s.lat);
      });
    });

    h += '<div class="side-sep"></div>';
    h += itHTML('credits', '◇', '图片来源', 'Credits & licences', 'top');
    sideEl.innerHTML = h;

    sideEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-key]');
      if (!b) return;
      show(b.getAttribute('data-key'));
    });
  }

  function markOn(key) {
    Array.prototype.forEach.call(sideEl.querySelectorAll('[data-key]'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-key') === key);
    });
    var cur = sideEl.querySelector('[data-key].on');
    if (!cur) return;
    var r = cur.getBoundingClientRect();
    if (sideEl.scrollWidth > sideEl.clientWidth + 4) {          /* 窄屏：横向芯片条 */
      var p1 = sideEl.getBoundingClientRect();
      if (r.left < p1.left + 12 || r.right > p1.right - 12) {
        sideEl.scrollLeft += (r.left - p1.left) - (p1.width - r.width) / 2;
      }
    } else {                                                     /* 宽屏：纵向目录 */
      var aside = document.getElementById('side');
      var p2 = aside.getBoundingClientRect();
      if (r.top < p2.top + 12 || r.bottom > p2.bottom - 12) {
        aside.scrollTop += (r.top - p2.top) - (p2.height - r.height) / 2;
      }
    }
  }

  /* ------------------------------------------------------------------ 模板 */

  function stageHTML(o) {
    return '<div class="stage ' + (o.cls || 'box') + '">' +
      '<div id="stage"></div>' +
      '<div class="stage-tag"><i></i>' + esc(o.tag) + '</div>' +
      '<div class="stage-hint"><b>拖动</b> 旋转 · <b>滚轮</b> 缩放 · <b>双击</b> 复位</div>' +
      (o.labels ? '<div class="labels" id="stageLabels"></div>' : '') +
      '</div>' +
      (o.cap ? '<div class="cap">' + o.cap + '</div>' : '');
  }

  function photoHTML(key) {
    var m = META[key];
    if (!m) return '';
    var tech = m.tech + (m.mag && m.mag !== '—' ? ' · ' + m.mag : '');
    var file = 'photos/' + (m.file || key + '.jpg');
    return '<figure class="ph-fig">' +
      '<div class="ph" data-open="' + esc(key) + '" role="button" tabindex="0" aria-label="放大查看">' +
      '<img src="' + file + '" alt="' + esc(m.cn + ' ' + m.sp + '，' + m.tech + '显微图像') + '" decoding="async">' +
      '<span class="ph-tech">' + esc(tech) + '</span>' +
      '</div>' +
      '<figcaption class="ph-cap">' +
      esc(m.artist) + ' · <span class="lic">' + esc(m.lic) + '</span> · ' +
      '<a href="' + esc(m.page) + '" target="_blank" rel="noopener">原始文件页 ↗</a>' +
      '</figcaption></figure>';
  }

  function biHTML(zh, en) {
    return '<div class="bi">' +
      '<div><span class="bi-k">中文</span>' + zh + '</div>' +
      '<div><span class="bi-k">English</span>' + en + '</div>' +
      '</div>';
  }
  function pZh(t) { return t ? '<p class="zh">' + t + '</p>' : ''; }
  function pEn(t) { return t ? '<p class="en">' + t + '</p>' : ''; }

  /* ---- 概览 ---- */

  function viewOverview() {
    var o = A.overview;
    var h = '<div class="dt">' +
      '<div class="kicker"><span class="kn">00</span><i></i>' + esc(o.kicker) + '</div>' +
      '<h1 class="dt-h1">' + esc(o.cn) + '</h1>' +
      '<div class="dt-lat">' + esc(o.en) + '</div>' +
      '<p class="dt-sub">本页从原核细胞的结构出发，按形态分成六类，取十二种代表菌，' +
      '每一种配一幅可以放大的真实显微照片。<b>从目录里选一项，细看它的形态与显微照片。</b></p>' +
      '<div class="media one">' + stageHTML({
        cls: 'box', tag: '3D 菌群 · Mixed field',
        cap: '<b>菌群示意</b> 球、杆、螺旋与链状混杂，比例仅供示意 · a mixed field of cocci, rods and spirals'
      }) + '</div>' +
      biHTML(pZh(o.lead_zh) + pZh(o.lead_zh2), pEn(o.lead_en) + pEn(o.lead_en2)) +
      '<ul class="facts">' + A.facts.map(function (f) {
        return '<li><b>' + esc(f.n) + '<sub>' + esc(f.u) + '</sub></b>' +
          '<span class="fz">' + esc(f.zh) + '</span>' +
          '<span class="fe">' + esc(f.en) + '</span>' +
          (f.src ? '<span class="fs">' + esc(f.src) + '</span>' : '') + '</li>';
      }).join('') + '</ul>' +
      '<ul class="dims">' + A.dims.map(function (d) {
        return '<li><div class="dn">' + esc(d.n) + '</div>' +
          '<h3>' + esc(d.cn) + '<em>' + esc(d.en) + '</em></h3>' +
          '<p class="zh">' + esc(d.zh) + '</p>' +
          '<p class="en">' + esc(d.en_t) + '</p></li>';
      }).join('') + '</ul>' +
      '</div>';
    return { html: h, scene: 'swarm' };
  }

  /* ---- 结构剖面 ---- */

  function viewStructure() {
    var h = '<div class="dt">' +
      '<div class="kicker"><span class="kn">01</span><i></i>结构 · Structure</div>' +
      '<h1 class="dt-h1">一个细胞里的八种结构</h1>' +
      '<div class="dt-lat">Eight structures inside a single cell</div>' +
      '<p class="dt-sub">剖开的细胞示意：外面是荚膜、细胞壁与细胞膜，中央是盘绕的拟核，' +
      '质粒与核糖体散布在细胞质里，鞭毛与菌毛伸出表面。<b>拖动可以换角度，切口始终朝着你。</b></p>' +
      '<div class="media one">' + stageHTML({
        cls: 'tall', tag: '3D 剖面 · Cross-section', labels: true,
        cap: '<b>剖切示意</b> 模型非等比例，结构数量与排布经过简化 · not to scale; counts simplified'
      }) + '</div>' +
      '<ul class="anno-grid">' + A.anno.map(function (a) {
        return '<li><span class="an">' + a.n + '</span><div>' +
          '<h3>' + esc(a.cn) + '<em>' + esc(a.en) + '</em></h3>' +
          '<p class="zh">' + esc(a.zh) + '</p>' +
          '<p class="en">' + esc(a.en_t) + '</p>' +
          '</div></li>';
      }).join('') + '</ul>' +
      '</div>';
    return { html: h, scene: 'structure', labels: true };
  }

  /* ---- 形态类群 ---- */

  function viewGroup(g) {
    var h = '<div class="dt">' +
      '<div class="kicker"><span class="kn">G' + g.num + '</span><i></i>形态类群 · Morphological group</div>' +
      '<h1 class="dt-h1">' + esc(g.cn) + '</h1>' +
      '<div class="dt-lat">' + esc(g.en) + '</div>' +
      chips(g.chips) +
      '<div class="media one">' + stageHTML({
        cls: 'box', tag: '3D 模型 · ' + g.en,
        cap: '<b>' + esc(g.cn) + '</b> 形态示意 · group morphology'
      }) + '</div>' +
      biHTML(pZh(g.lead_zh) + pZh(g.lead_zh2), pEn(g.lead_en) + pEn(g.lead_en2)) +
      '</div>';
    return { html: h, scene: g.scene };
  }

  /* ---- 标本 ---- */

  function viewSpec(key) {
    var s = A.specs[key];
    var h = '<div class="dt">' +
      '<div class="kicker"><span class="kn">' + s.num + '</span><i></i>' + esc(s.group) + '</div>' +
      '<h1 class="dt-h1">' + esc(s.cn) + '</h1>' +
      '<div class="dt-lat">' + esc(s.lat) + '</div>' +
      chips(s.chips) +
      '<div class="media">' +
      '<div>' + stageHTML({
        cls: 'box', tag: '3D 示意 · 类群形态 Group morphology',
        cap: '<b>类群形态示意</b> 本种的具体形状、排列与表面细节请对照显微照片 · not to scale'
      }) + '</div>' +
      photoHTML(key) +
      '</div>' +
      biHTML(pZh(s.zh), pEn(s.en)) +
      '</div>';
    return { html: h, scene: s.scene };
  }

  /* ---- 来源 ---- */

  function viewCredits() {
    var c = A.credits;
    var rows = '';
    var i = 0;
    Object.keys(A.specs).forEach(function (k) {
      var s = A.specs[k], m = META[k];
      if (!m) return;
      i++;
      rows += '<tr>' +
        '<td class="n">' + ('0' + i).slice(-2) + '</td>' +
        '<td class="spn">' + esc(s.cn) + '<i>' + esc(s.lat) + '</i></td>' +
        '<td class="tech">' + esc(m.tech) + (m.mag && m.mag !== '—' ? '<br>' + esc(m.mag) : '') + '</td>' +
        '<td>' + esc(m.artist) + '</td>' +
        '<td class="lic"><span>' + esc(m.lic) + '</span></td>' +
        '<td class="file"><a href="' + esc(m.page) + '" target="_blank" rel="noopener" title="' + esc(m.title) + '">' + esc(m.title) + '</a></td>' +
        '</tr>';
    });

    var h = '<div class="dt">' +
      '<div class="kicker"><span class="kn">◇</span><i></i>附录 · Colophon</div>' +
      '<h1 class="dt-h1">图片来源与许可</h1>' +
      '<div class="dt-lat">Micrograph credits &amp; licences</div>' +
      biHTML(pZh(c.cn1) + pZh(c.cn2), pEn(c.en1) + pEn(c.en2)) +
      '<div class="tbl-wrap"><table>' +
      '<thead><tr><th>#</th><th>物种 Species</th><th>显微技术 Technique</th>' +
      '<th>作者 Author</th><th>许可 Licence</th><th>文件 File</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
      '<div class="selfmade"><span class="k">SELF-MADE</span><div><b>' +
      '三维模型与结构标注为本页自绘。</b>' + esc(c.self_cn) +
      '<span class="en">' + esc(c.self_en) + '</span></div></div>' +
      '</div>';
    return { html: h, scene: null };
  }

  /* ------------------------------------------------------------------ 切换 */

  function show(key, opts) {
    opts = opts || {};
    var v = null;

    if (key === 'overview') v = viewOverview();
    else if (key === 'structure') v = viewStructure();
    else if (key === 'credits') v = viewCredits();
    else if (A.specs[key]) v = viewSpec(key);
    else {
      var g = null;
      for (var i = 0; i < A.groups.length; i++) if (A.groups[i].id === key) g = A.groups[i];
      if (g) v = viewGroup(g);
    }

    if (!v) { key = 'overview'; v = viewOverview(); }

    detailEl.innerHTML = v.html;
    markOn(key);
    mountScene(v.scene);

    var dt = detailEl.querySelector('.dt');
    requestAnimationFrame(function () { if (dt) dt.classList.add('in'); });

    if (v.labels) wireAnno();

    if (!opts.silent) {
      if (location.hash !== '#' + key) {
        try { history.replaceState(null, '', '#' + key); }
        catch (e) { location.hash = key; }
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    current = key;
  }

  var current = null;

  /* 结构注释 ↔ 编号徽章联动 */
  function wireAnno() {
    var items = Array.prototype.slice.call(detailEl.querySelectorAll('.anno-grid li'));
    items.forEach(function (li, i) {
      li.addEventListener('mouseenter', function () {
        var s = VIEW.active;
        if (s && s.labelEls && s.labelEls[i]) s.labelEls[i].classList.add('hl');
      });
      li.addEventListener('mouseleave', function () {
        var s = VIEW.active;
        if (s && s.labelEls && s.labelEls[i]) s.labelEls[i].classList.remove('hl');
      });
    });
  }

  /* ------------------------------------------------------------------ 灯箱 */

  (function () {
    var modal = document.getElementById('modal');
    var img = document.getElementById('modalImg');
    var cap = document.getElementById('modalCap');
    var lic = document.getElementById('modalLic');
    if (!modal) return;

    function open(key) {
      var s = A.specs[key], m = META[key];
      if (!s || !m) return;
      img.src = 'photos/' + (m.file || key + '.jpg');
      img.alt = s.cn + ' ' + m.tech;
      cap.innerHTML = '<b>' + esc(s.cn) + ' <i style="font-family:var(--latin);font-style:italic;color:var(--ac)">' +
        esc(s.lat) + '</i></b> · ' + esc(m.tech) +
        (m.mag && m.mag !== '—' ? ' · ' + esc(m.mag) : '') + ' · ' + esc(m.note || '');
      lic.innerHTML = esc(m.artist) + ' · <span style="color:var(--ac)">' + esc(m.lic) + '</span> · ' +
        '<a href="' + esc(m.page) + '" target="_blank" rel="noopener" style="border-bottom:1px solid var(--line)">原始文件页</a>';
      modal.classList.add('on');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      modal.classList.remove('on');
      document.body.style.overflow = '';
      img.removeAttribute('src');
    }

    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-open]');
      if (el) open(el.getAttribute('data-open'));
    });
    document.addEventListener('keydown', function (e) {
      var el = document.activeElement;
      if ((e.key === 'Enter' || e.key === ' ') && el && el.hasAttribute && el.hasAttribute('data-open')) {
        e.preventDefault(); open(el.getAttribute('data-open'));
      }
      if (e.key === 'Escape' && modal.classList.contains('on')) close();
    });
    document.getElementById('modalClose').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  })();

  /* ------------------------------------------------------------------ 启动 */

  buildSide();
  window.addEventListener('hashchange', function () {
    var k = (location.hash || '').replace('#', '');
    if (k && k !== current) show(k, { silent: true });
  });

  /* 由文件末尾（3D 就绪后）调用 */
  function boot() {
    show((location.hash || '').replace('#', '') || 'overview', { silent: true });
  }

  /* ================================================================== THREE */

  if (!window.THREE) return;
  var canvas = document.getElementById('gl');
  if (!canvas) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    console.warn('WebGL unavailable', err);
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setScissorTest(true);
  renderer.localClippingEnabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  if (renderer.physicallyCorrectLights !== undefined) renderer.physicallyCorrectLights = false;

  var VW = 0, VH = 0;
  function resize() {
    VW = window.innerWidth; VH = window.innerHeight;
    renderer.setSize(VW, VH, false);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---------------- palette / material helpers ---------------- */
  var C = {
    wall: 0xd8c9ad,      // 细胞壁 / 荚膜偏暖
    wallB: 0xc9b894,
    body: 0xe4d2b4,      // 菌体
    bodyC: 0xc98f6e,     // 暖橙
    bodyG: 0xb9c9bd,
    nucleoid: 0x8f7fd0,
    plasmid: 0xd08a6a,
    ribo: 0xf0c98a,
    flag: 0x9fc6cf,
    pili: 0x9aa8a4,
    membrane: 0x7fb4c8
  };

  function std(color, o) {
    var p = { color: color, roughness: 0.62, metalness: 0.04 };
    if (o) for (var k in o) p[k] = o[k];
    return new THREE.MeshStandardMaterial(p);
  }

  /* 有机表面材质：低高光 + 微弱内散射，避免塑料感 */
  function cellMat(color, o) {
    var p = {
      color: color, roughness: 0.82, metalness: 0.02,
      emissive: new THREE.Color(color).multiplyScalar(0.16),
      emissiveIntensity: 0.55
    };
    if (o) for (var k in o) p[k] = o[k];
    return new THREE.MeshStandardMaterial(p);
  }

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* 顶点扰动：让球体/杆体看起来像有机体而不是完美几何 */
  function organic(geo, amp, freq, seed) {
    var p = geo.attributes.position, v = new THREE.Vector3();
    var r = rng(seed || 7);
    var ph = [r() * 6.28, r() * 6.28, r() * 6.28];
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      var n = Math.sin(v.x * freq + ph[0]) * Math.cos(v.y * freq * 1.3 + ph[1]) * Math.sin(v.z * freq * 0.9 + ph[2]);
      var len = v.length() || 1;
      v.multiplyScalar(1 + n * amp / len * 0.35);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /* 沿 x 轴弯曲（用于弧菌 / 弯杆菌） */
  function bendX(geo, k) {
    var p = geo.attributes.position, v = new THREE.Vector3();
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      v.y += k * v.x * v.x;
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /* 沿圆弧弯曲（用于弧菌 / 弯杆菌）：比抛物线更接近真实的月牙形 */
  function bendArc(geo, radius) {
    var p = geo.attributes.position, v = new THREE.Vector3();
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      var t = v.x / radius;
      var r2 = radius + v.y;
      v.x = Math.sin(t) * r2;
      v.y = Math.cos(t) * r2 - radius;
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /* 鞭毛：从 origin 沿 dir 生长的一段波动曲线 */
  function flagellum(origin, dir, len, amp, turns, radius, mat) {
    var pts = [], steps = 44, up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(dir.dot(up)) > 0.94) up.set(1, 0, 0);
    var n1 = new THREE.Vector3().crossVectors(dir, up).normalize();
    var n2 = new THREE.Vector3().crossVectors(dir, n1).normalize();
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var a = t * Math.PI * 2 * turns;
      var r = amp * Math.pow(t, 0.75);
      var p = origin.clone()
        .addScaledVector(dir, len * t)
        .addScaledVector(n1, Math.cos(a) * r)
        .addScaledVector(n2, Math.sin(a) * r);
      pts.push(p);
    }
    var curve = new THREE.CatmullRomCurve3(pts);
    var g = new THREE.TubeGeometry(curve, 80, radius, 7, false);
    return new THREE.Mesh(g, mat);
  }

  /* 光照装置 */
  function rig(scene) {
    scene.add(new THREE.AmbientLight(0x2a3640, 0.92));
    var key = new THREE.DirectionalLight(0xffe6c8, 3.05); key.position.set(4.2, 5.2, 5.6); scene.add(key);
    var fill = new THREE.DirectionalLight(0xc2c6bb, 0.78); fill.position.set(-5.2, -2.4, 4.2); scene.add(fill);
    var rim = new THREE.DirectionalLight(0xffc98c, 2.3); rim.position.set(-2.4, 4.4, -6.2); scene.add(rim);
    var bot = new THREE.DirectionalLight(0x2a4a52, 0.7); bot.position.set(0, -6, 0); scene.add(bot);
  }

  /* ---------------- scene builders ---------------- */

  function buildSwarm() {
    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05090b, 0.082);
    var g = new THREE.Group();
    g.position.x = 2.05;
    var r = rng(41);
    var mats = [
      std(0xcbb99f, { roughness: .82, metalness: .02 }),
      std(0xbb9c80, { roughness: .86, metalness: .02 }),
      std(0x93a8ad, { roughness: .8, metalness: .02 }),
      std(0xa89ab6, { roughness: .84, metalness: .02 }),
      std(0xd2c3aa, { roughness: .88, metalness: .01 })
    ];

    for (var i = 0; i < 38; i++) {
      var kind = i % 4, m, mesh;
      var rad = 0.09 + r() * 0.12;
      if (kind === 0) {
        m = organic(new THREE.SphereGeometry(rad, 18, 14), rad * 0.14, 6, i + 3);
        mesh = new THREE.Mesh(m, mats[i % 5]);
      } else if (kind === 1) {
        m = new THREE.CapsuleGeometry(rad, rad * 3.2, 6, 14);
        m.rotateZ(Math.PI / 2);
        organic(m, rad * 0.1, 5, i + 9);
        mesh = new THREE.Mesh(m, mats[(i + 1) % 5]);
      } else if (kind === 2) {
        var pts = [];
        for (var j = 0; j <= 30; j++) {
          var t = j / 30, a = t * Math.PI * 3.6;
          pts.push(new THREE.Vector3((t - 0.5) * rad * 7, Math.cos(a) * rad * 0.95, Math.sin(a) * rad * 0.95));
        }
        m = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, rad * 0.36, 8, false);
        mesh = new THREE.Mesh(m, mats[(i + 2) % 5]);
      } else {
        m = organic(new THREE.CapsuleGeometry(rad * 0.9, rad * 2.0, 6, 14), rad * 0.2, 4, i + 21);
        m.rotateZ(Math.PI / 2);
        bendX(m, 0.42);
        mesh = new THREE.Mesh(m, mats[(i + 3) % 5]);
      }
      var ang = r() * Math.PI * 2, dist = 1.6 + r() * 5.0, yy = (r() - 0.5) * 6.0;
      mesh.position.set(Math.cos(ang) * dist * 0.82, yy, Math.sin(ang) * dist * 0.6 - 3.2);
      mesh.rotation.set(r() * 3, r() * 3, r() * 3);
      mesh.userData.spin = 0.0006 + r() * 0.0018;
      mesh.userData.axis = new THREE.Vector3(r() - .5, r() - .5, r() - .5).normalize();
      g.add(mesh);
    }

    /* 悬浮微粒，增加微观景深感 */
    var N = 240, pos = new Float32Array(N * 3);
    for (var q = 0; q < N; q++) {
      pos[q * 3] = (r() - 0.5) * 15;
      pos[q * 3 + 1] = (r() - 0.5) * 9;
      pos[q * 3 + 2] = (r() - 0.5) * 9 - 1.5;
    }
    var pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.add(new THREE.Points(pg, new THREE.PointsMaterial({
      color: 0xb8c6c4, size: 0.022, transparent: true, opacity: .5, sizeAttenuation: true, depthWrite: false
    })));

    scene.add(g);
    rig(scene);
    var cam = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    cam.position.set(0, 0, 7.4);
    return {
      scene: scene, camera: cam, group: g, auto: 0.0006,
      update: function (t) {
        g.rotation.y = Math.sin(t * 0.00008) * 0.12;
        g.children.forEach(function (m) {
          if (m.userData && m.userData.axis) m.rotateOnAxis(m.userData.axis, m.userData.spin);
        });
      }
    };
  }

  function buildStructure() {
    var scene = new THREE.Scene();
    var g = new THREE.Group();

    /* 裁掉朝向相机的前半，露出内部 */
    var clip = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.06);
    var clipArr = [clip];

    var bodyLen = 2.05, bodyR = 0.62;

    /* 荚膜（外层半透明） */
    var capGeo = new THREE.CapsuleGeometry(bodyR * 1.34, bodyLen, 14, 44);
    capGeo.rotateZ(Math.PI / 2);
    var capMat = new THREE.MeshPhysicalMaterial({
      color: 0x8fcfc6, roughness: .3, metalness: 0, transparent: true, opacity: .07,
      side: THREE.DoubleSide, clippingPlanes: clipArr, depthWrite: false
    });
    var capsule = new THREE.Mesh(capGeo, capMat);
    g.add(capsule);
    /* 荚膜表面网格纹理，提示这是一层黏液 */
    /* 荚膜不画网格，仅以轮廓环示意 */

    /* 细胞壁 */
    var wallGeo = new THREE.CapsuleGeometry(bodyR * 1.14, bodyLen, 14, 48);
    wallGeo.rotateZ(Math.PI / 2);
    organic(wallGeo, 0.05, 9, 3);
    var wallMat = new THREE.MeshStandardMaterial({
      color: 0xdcc49c, roughness: .8, metalness: .04, side: THREE.BackSide,
      transparent: true, opacity: .5, clippingPlanes: clipArr, depthWrite: true,
      emissive: 0x33240e, emissiveIntensity: .5
    });
    g.add(new THREE.Mesh(wallGeo, wallMat));

    /* 细胞膜 */
    var memGeo = new THREE.CapsuleGeometry(bodyR * 0.985, bodyLen + 0.02, 14, 48);
    memGeo.rotateZ(Math.PI / 2);
    g.add(new THREE.Mesh(memGeo, new THREE.MeshStandardMaterial({
      color: 0x7dc0d8, roughness: .34, metalness: .2, side: THREE.BackSide,
      transparent: true, opacity: .28, clippingPlanes: clipArr, depthWrite: false,
      emissive: 0x123a46, emissiveIntensity: .8
    })));

    /* 切口轮廓：让「剖开」一眼可见 */
    function sliceRing(ry, z, color, op) {
      var sh = new THREE.Shape();
      var hx = bodyLen / 2;
      sh.moveTo(-hx, -ry);
      sh.lineTo(hx, -ry);
      sh.absarc(hx, 0, ry, -Math.PI / 2, Math.PI / 2, false);
      sh.lineTo(-hx, ry);
      sh.absarc(-hx, 0, ry, Math.PI / 2, Math.PI * 1.5, false);
      var pts = sh.getPoints(90).map(function (p) { return new THREE.Vector3(p.x, p.y, z); });
      var geo = new THREE.BufferGeometry().setFromPoints(pts);
      return new THREE.LineLoop(geo, new THREE.LineBasicMaterial({
        color: color, transparent: true, opacity: op, depthTest: false
      }));
    }
    g.add(sliceRing(bodyR * 1.14, 0.055, 0xffd49a, .85));
    g.add(sliceRing(bodyR * 0.985, 0.052, 0x8fe0dd, .7));
    g.add(sliceRing(bodyR * 1.34, 0.05, 0x8fe0dd, .3));

    /* 拟核：一条盘绕的长链 */
    var np = [];
    var rr = rng(17);
    for (var i = 0; i <= 120; i++) {
      var t = i / 120;
      var a = t * Math.PI * 7.2;
      var rad = 0.3 * Math.sin(t * Math.PI);
      np.push(new THREE.Vector3(
        (t - 0.5) * 2.1 + Math.sin(a * 0.6) * 0.06,
        Math.cos(a) * rad * 0.9 + Math.sin(t * 9) * 0.04,
        Math.sin(a) * rad * 0.75
      ));
    }
    var nucCurve = new THREE.CatmullRomCurve3(np);
    var nuc = new THREE.Mesh(new THREE.TubeGeometry(nucCurve, 320, 0.052, 8, false), cellMat(0x9061e6, { roughness: .34, emissive: 0x43208c, emissiveIntensity: .95 }));
    g.add(nuc);

    /* 质粒：两个小环 */
    function plasmid(pos, s, rot) {
      var m = new THREE.Mesh(new THREE.TorusGeometry(0.115 * s, 0.028, 10, 48), cellMat(0xe07a4e, { roughness: .38, emissive: 0x50200a, emissiveIntensity: .5 }));
      m.position.copy(pos); m.rotation.set(rot[0], rot[1], rot[2]);
      return m;
    }
    g.add(plasmid(new THREE.Vector3(0.56, -0.3, -0.04), 1.3, [1.2, .35, .15]));
    g.add(plasmid(new THREE.Vector3(-0.66, 0.33, -0.02), 1.05, [.35, 1.25, .75]));

    /* 核糖体：散布小球 */
    var riboGeo = new THREE.SphereGeometry(0.038, 12, 10);
    var riboMat = cellMat(0xf0b862, { roughness: .32, emissive: 0x5c3c08, emissiveIntensity: .6 });
    var rj = rng(29);
    for (var q = 0; q < 54; q++) {
      var m2 = new THREE.Mesh(riboGeo, riboMat);
      var u = rj(), vv = rj(), w = rj();
      var cx = (u - 0.5) * 2.3;
      var cy = Math.sin(vv * 6.28) * bodyR * 0.55;
      var cz = Math.cos(w * 6.28) * bodyR * 0.35;
      m2.position.set(cx, cy, cz);
      var sc = 0.7 + rj() * 0.8;
      m2.scale.setScalar(sc);
      g.add(m2);
    }

    /* 鞭毛（不裁剪，长在体外） */
    var flagMat = std(C.flag, { roughness: .55, transparent: true, opacity: .92 });
    var origin = new THREE.Vector3(-bodyLen / 2 - bodyR * 0.9, -0.1, 0);
    var dirs = [
      new THREE.Vector3(-1, 0.1, 0.16), new THREE.Vector3(-1, -0.32, -0.1),
      new THREE.Vector3(-1, 0.34, -0.22), new THREE.Vector3(-1, -0.04, 0.36)
    ];
    dirs.forEach(function (d, i) {
      var f = flagellum(origin, d.normalize(), 1.55 + i * 0.12, 0.13, 2.1 + i * .3, 0.017, flagMat);
      g.add(f);
    });

    /* 菌毛 */
    var piliMat = new THREE.LineBasicMaterial({ color: C.pili, transparent: true, opacity: .38 });
    var pr = rng(53);
    for (var pi = 0; pi < 130; pi++) {
      var px = (pr() - 0.5) * (bodyLen + bodyR);
      var pa = pr() * Math.PI * 2;
      var base = new THREE.Vector3(px, Math.cos(pa) * bodyR * 1.1, Math.sin(pa) * bodyR * 1.1);
      if (base.z > 0.02) continue;
      var tip = base.clone().add(new THREE.Vector3((pr() - .5) * .06, Math.cos(pa) * .16, Math.sin(pa) * .16));
      var lg = new THREE.BufferGeometry().setFromPoints([base, tip]);
      g.add(new THREE.Line(lg, piliMat));
    }

    g.rotation.y = -0.48;
    g.rotation.x = 0.11;
    g.rotation.z = 0.09;
    g.scale.setScalar(1.06);
    scene.add(g);
    rig(scene);

    var cam = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    cam.position.set(0, 0, 4.55);

    /* 标注锚点（模型局部坐标） */
    var anchors = [
      { cn: '荚膜', en: 'Capsule', p: new THREE.Vector3(-0.12, 0.84, 0.06) },
      { cn: '细胞壁', en: 'Cell wall', p: new THREE.Vector3(1.28, 0.44, -0.06) },
      { cn: '细胞膜', en: 'Membrane', p: new THREE.Vector3(0.66, 0.6, -0.1) },
      { cn: '拟核', en: 'Nucleoid', p: new THREE.Vector3(-0.06, 0.08, -0.04) },
      { cn: '质粒', en: 'Plasmid', p: new THREE.Vector3(0.46, -0.26, -0.14) },
      { cn: '核糖体', en: 'Ribosome', p: new THREE.Vector3(-0.74, -0.36, -0.1) },
      { cn: '鞭毛', en: 'Flagellum', p: new THREE.Vector3(-1.98, 0.04, 0.02) },
      { cn: '菌毛', en: 'Pilus', p: new THREE.Vector3(0.26, -0.72, -0.22) }
    ];

    var clipN = new THREE.Vector3();
    return {
      scene: scene, camera: cam, group: g, auto: 0.0014, anchors: anchors,
      update: function () {
        /* 剖切面跟随模型姿态，任何角度都保持「切开」的读法 */
        clipN.set(0, 0, -1).applyQuaternion(g.quaternion);
        clip.normal.copy(clipN);
        clip.constant = 0.055;
      }
    };
  }

  function buildCoccus() {
    var scene = new THREE.Scene(), g = new THREE.Group();
    var r = rng(12);
    var mat = [cellMat(0xe2caa0), cellMat(0xd8bd90), cellMat(0xeed9b4)];

    /* 粘附式生长：新细胞贴着已有细胞长出来，形成真实的葡萄串 */
    var cells = [{ p: new THREE.Vector3(0, 0, 0), r: 0.29 }];
    var seeds = [
      new THREE.Vector3(1, 0.2, 0.1), new THREE.Vector3(-0.7, 0.8, -0.3),
      new THREE.Vector3(0.2, -1, 0.4), new THREE.Vector3(-0.9, -0.4, 0.5)
    ];
    seeds.forEach(function (s, si) {
      var base = { p: s.clone(), r: 0.28 + r() * 0.04 };
      cells.push(base);
      var n = 4 + Math.floor(r() * 4);
      for (var i = 0; i < n; i++) {
        var from = cells[Math.floor(r() * cells.length)];
        var dir = new THREE.Vector3(r() - .5, r() - .5, r() - .5).normalize();
        var rr = 0.26 + r() * 0.05;
        var pos = from.p.clone().addScaledVector(dir, (from.r + rr) * 0.76);
        cells.push({ p: pos, r: rr });
      }
    });

    cells.forEach(function (c, i) {
      var geo = organic(new THREE.SphereGeometry(c.r, 24, 18), c.r * 0.16, 11, i * 7 + 2);
      var m = new THREE.Mesh(geo, mat[i % 3]);
      m.position.copy(c.p);
      m.rotation.set(r() * 3, r() * 3, r() * 3);
      g.add(m);
    });

    /* 轻微胞外基质雾 */
    var halo = new THREE.Mesh(
      new THREE.SphereGeometry(2.15, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x9fc6cf, transparent: true, opacity: 0.022, side: THREE.BackSide })
    );
    g.add(halo);
    g.rotation.set(0.3, -0.45, 0.1);
    scene.add(g); rig(scene);
    var cam = new THREE.PerspectiveCamera(36, 1, .1, 60); cam.position.set(0, 0, 6.1);
    return { scene: scene, camera: cam, group: g, auto: 0.0022, update: function () { } };
  }

  function buildBacillus() {
    var scene = new THREE.Scene(), g = new THREE.Group();
    var R = 0.42, L = 1.88;
    var geo = new THREE.CapsuleGeometry(R, L, 14, 44);
    geo.rotateZ(Math.PI / 2);
    organic(geo, 0.085, 7, 5);
    g.add(new THREE.Mesh(geo, cellMat(0xdec9a6)));

    var flagMat = cellMat(0xa8ccd4, {
      roughness: .5, transparent: true, opacity: .88,
      emissive: 0x0e2026, emissiveIntensity: 1
    });
    var r = rng(31);

    /* 周生鞭毛：贴着表面长出，再向外、向后甩开 */
    for (var i = 0; i < 9; i++) {
      var t = (i + 0.5) / 9;
      var x = -L / 2 + t * L;
      var ang = r() * Math.PI * 2;
      var nrm = new THREE.Vector3(0, Math.cos(ang), Math.sin(ang));
      var origin = nrm.clone().multiplyScalar(R * 0.94).add(new THREE.Vector3(x, 0, 0));
      var dir = nrm.clone().multiplyScalar(0.5)
        .add(new THREE.Vector3((r() - 0.5) * 1.5, 0, (r() - 0.5) * 0.55))
        .normalize();
      g.add(flagellum(origin, dir, 0.8 + r() * 0.6, 0.07, 1.4 + r() * 0.8, 0.0135, flagMat));
    }

    /* 菌毛：短而密的细丝 */
    var piliMat = new THREE.LineBasicMaterial({ color: 0xa8b4b0, transparent: true, opacity: .32 });
    var pr = rng(88);
    for (var p = 0; p < 110; p++) {
      var px = (pr() - 0.5) * (L + R * 1.4);
      var pa = pr() * Math.PI * 2;
      var n2 = new THREE.Vector3(0, Math.cos(pa), Math.sin(pa));
      var b = n2.clone().multiplyScalar(R * 1.01).add(new THREE.Vector3(px, 0, 0));
      var tp = b.clone().addScaledVector(n2, 0.07 + pr() * 0.07)
        .add(new THREE.Vector3((pr() - .5) * .05, 0, (pr() - .5) * .05));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([b, tp]), piliMat));
    }

    g.rotation.set(0.22, -0.38, -0.1);
    scene.add(g); rig(scene);
    var cam = new THREE.PerspectiveCamera(36, 1, .1, 60); cam.position.set(0, 0, 6.5);
    return { scene: scene, camera: cam, group: g, auto: 0.002, update: function () { } };
  }

  function buildVibrio() {
    var scene = new THREE.Scene(), g = new THREE.Group();
    var geo = new THREE.CapsuleGeometry(0.36, 1.55, 12, 44);
    geo.rotateZ(Math.PI / 2);
    bendArc(geo, 1.55);
    organic(geo, 0.05, 7, 11);
    var body = new THREE.Mesh(geo, cellMat(0xdcb98f));
    body.position.y = 0.3;
    g.add(body);

    /* 单极鞭毛束 */
    var flagMat = cellMat(0xa8ccd4, { roughness: .5, transparent: true, opacity: .88, emissive: 0x0e2026, emissiveIntensity: 1 });
    var tEnd = -1.05 / 1.55;
    var origin = new THREE.Vector3(
      Math.sin(tEnd) * 1.55, Math.cos(tEnd) * 1.55 - 1.55 + 0.3, 0
    );
    for (var i = 0; i < 3; i++) {
      var dir = new THREE.Vector3(-1, -0.05 + i * 0.16, (i - 1) * 0.18).normalize();
      g.add(flagellum(origin, dir, 2.3 + i * 0.12, 0.15, 2.6 + i * 0.2, 0.014, flagMat));
    }
    g.rotation.set(0.22, -0.5, 0.16);
    g.position.y = 0.1;
    scene.add(g); rig(scene);
    var cam = new THREE.PerspectiveCamera(36, 1, .1, 60); cam.position.set(0, 0, 3.95);
    return { scene: scene, camera: cam, group: g, auto: 0.0018, update: function () { } };
  }

  function buildSpirillum() {
    var scene = new THREE.Scene(), g = new THREE.Group();
    var pts = [], turns = 5.2, N = 320, len = 4.2;
    for (var i = 0; i <= N; i++) {
      var t = i / N, a = t * Math.PI * 2 * turns;
      pts.push(new THREE.Vector3((t - 0.5) * len, Math.cos(a) * 0.34, Math.sin(a) * 0.34));
    }
    var curve = new THREE.CatmullRomCurve3(pts);
    var tube = new THREE.TubeGeometry(curve, 520, 0.098, 10, false);
    var mesh = new THREE.Mesh(tube, cellMat(0xcbb0d2));
    g.add(mesh);

    /* 轴丝：沿细胞外侧的细线（示意内藏鞭毛） */
    var axMat = new THREE.MeshBasicMaterial({ color: 0x7fa8b4, transparent: true, opacity: .35 });
    for (var k = 0; k < 2; k++) {
      var ap = [];
      for (var j = 0; j <= N; j += 2) {
        var p = pts[j].clone();
        var ang = (j / N) * Math.PI * 2 * turns;
        p.y += Math.cos(ang) * 0.11;
        p.z += Math.sin(ang) * 0.11;
        ap.push(p);
      }
      var ac = new THREE.CatmullRomCurve3(ap);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(ac, 200, 0.014, 5, false), axMat));
    }
    /* 两端收尖 */
    [pts[0], pts[N]].forEach(function (p) {
      var cap = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), cellMat(0xcbb0d2));
      cap.position.copy(p); g.add(cap);
    });

    g.rotation.set(0.3, -0.4, 0.2);
    scene.add(g); rig(scene);
    var cam = new THREE.PerspectiveCamera(34, 1, .1, 60); cam.position.set(0, 0, 6.35);
    return { scene: scene, camera: cam, group: g, auto: 0.0016, update: function () { } };
  }

  function buildFilament() {
    var scene = new THREE.Scene(), g = new THREE.Group();
    var mat = cellMat(0xc9b47e);
    var r = rng(77);

    function grow(start, dir, len, rad, depth) {
      var pts = [start.clone()];
      var p = start.clone(), d = dir.clone();
      var steps = Math.max(4, Math.round(len * 4));
      for (var i = 0; i < steps; i++) {
        d.applyAxisAngle(new THREE.Vector3(r() - .5, r() - .5, r() - .5).normalize(), 0.16 * (r() - .3));
        d.normalize();
        p = p.clone().addScaledVector(d, len / steps);
        pts.push(p.clone());
      }
      var curve = new THREE.CatmullRomCurve3(pts);
      var tube = new THREE.TubeGeometry(curve, Math.max(20, steps * 5), rad, 7, false);
      g.add(new THREE.Mesh(tube, mat));
      /* 端点小球 */
      var tip = new THREE.Mesh(new THREE.SphereGeometry(rad * 1.05, 10, 8), mat);
      tip.position.copy(p); g.add(tip);

      if (depth > 0) {
        var branches = depth > 2 ? 2 : (r() > 0.45 ? 2 : 1);
        for (var b = 0; b < branches; b++) {
          var at = pts[Math.floor(pts.length * (0.45 + r() * 0.45))];
          var nd = d.clone().applyAxisAngle(new THREE.Vector3(r() - .5, r() - .5, r() - .5).normalize(), 0.8 + r() * 0.7).normalize();
          grow(at, nd, len * (0.55 + r() * 0.25), rad * 0.82, depth - 1);
        }
      }
    }

    for (var s = 0; s < 3; s++) {
      var a0 = s * 2.1 + 0.4;
      var start = new THREE.Vector3(Math.cos(a0) * 0.2, Math.sin(a0) * 0.2, (s - 1) * 0.25);
      var dir = new THREE.Vector3(Math.cos(a0), Math.sin(a0), (r() - 0.5) * 0.4).normalize();
      grow(start, dir, 1.5 + r() * 0.7, 0.062, 3);
    }
    g.scale.setScalar(1.06);
    g.rotation.set(0.42, -0.3, 0.1);
    scene.add(g); rig(scene);
    var cam = new THREE.PerspectiveCamera(36, 1, .1, 60); cam.position.set(0, 0, 6.4);
    return { scene: scene, camera: cam, group: g, auto: 0.0012, update: function () { } };
  }

  function buildPleomorphic() {
    var scene = new THREE.Scene(), g = new THREE.Group();
    var r = rng(97);
    var spots = [
      [-1.05, 0.42, -0.15, 1.0, 0.72, 0.88],
      [0.72, -0.42, 0.28, 0.78, 0.95, 0.7],
      [0.18, 0.86, -0.35, 0.55, 0.62, 1.05],
      [1.32, 0.46, 0.05, 0.62, 1.25, 0.6]
    ];
    for (var i = 0; i < 4; i++) {
      var geo = new THREE.IcosahedronGeometry(0.5 + r() * 0.24, 5);
      var p = geo.attributes.position, v = new THREE.Vector3(), ph = r() * 6;
      for (var j = 0; j < p.count; j++) {
        v.fromBufferAttribute(p, j);
        var n = Math.sin(v.x * 3.4 + ph) * Math.cos(v.y * 2.7 + ph) * Math.sin(v.z * 3.1 + ph);
        var n2 = Math.sin(v.x * 6.2 + ph * 2) * 0.35;
        v.multiplyScalar(1 + (n * 0.3 + n2 * 0.12));
        p.setXYZ(j, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      var m = new THREE.Mesh(geo, cellMat(i === 0 ? 0xe0c9a6 : 0xd6bd96));
      m.position.set(spots[i][0], spots[i][1], spots[i][2]);
      m.scale.set(spots[i][3], spots[i][4], spots[i][5]);
      m.rotation.set(r() * 3, r() * 3, r() * 3);
      g.add(m);
    }
    g.rotation.set(0.3, -0.4, 0.2);
    scene.add(g); rig(scene);
    var cam = new THREE.PerspectiveCamera(36, 1, .1, 60); cam.position.set(0, 0, 6.1);
    return { scene: scene, camera: cam, group: g, auto: 0.0018, update: function () { } };
  }

  var BUILDERS = {
    swarm: buildSwarm,
    structure: buildStructure,
    coccus: buildCoccus,
    bacillus: buildBacillus,
    vibrio: buildVibrio,
    spirillum: buildSpirillum,
    filament: buildFilament,
    pleomorphic: buildPleomorphic
  };






  /* ============================================================ 单视窗驱动 */

  var scenes = {};
  var stageEl = null;
  var active = null;
  var drag = null;
  var tmpV = new THREE.Vector3();

  function getScene(name) {
    if (!name) return null;
    if (scenes[name]) return scenes[name];
    var b = BUILDERS[name];
    if (!b) return null;
    var s;
    try { s = b(); } catch (e) { console.warn('build fail', name, e); return null; }
    s.name = name;
    s.yaw = s.yaw0 = s.group.rotation.y;
    s.pitch = s.pitch0 = s.group.rotation.x;
    s.dist = s.dist0 = s.camera.position.z;
    s.velY = 0; s.velX = 0;
    s._w = 0; s._h = 0;
    s.labelEls = null;
    scenes[name] = s;
    return s;
  }

  function mountLabels(s) {
    var host = document.getElementById('stageLabels');
    if (host) host.innerHTML = '';
    if (s) s.labelEls = null;
    if (!s || !s.anchors || !host) return;
    s.labelEls = s.anchors.map(function (a, i) {
      var d = document.createElement('div');
      d.className = 'lbl';
      d.textContent = ('0' + (i + 1)).slice(-2);
      host.appendChild(d);
      return d;
    });
  }

  mountScene = function (name) {
    stageEl = document.getElementById('stage');
    if (!name || !stageEl) {
      active = null; VIEW.active = null;
      return;
    }
    var s = getScene(name);
    active = s;
    VIEW.active = s;
    if (!s) return;
    s._w = 0; s._h = 0;
    mountLabels(s);
  };

  /* ---------------- 交互 ---------------- */

  detailEl.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    var st = e.target.closest('#stage');
    if (!st || !active) return;
    drag = { x: e.clientX, y: e.clientY, s: active };
    if (st.setPointerCapture) { try { st.setPointerCapture(e.pointerId); } catch (_) { } }
    e.preventDefault();
  });

  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    var s = drag.s;
    s.yaw += dx * 0.0075;
    s.pitch = Math.max(-1.1, Math.min(1.1, s.pitch + dy * 0.006));
    s.velY = dx * 0.00035;
    s.velX = dy * 0.00025;
  }, { passive: true });

  function endDrag() { drag = null; }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  detailEl.addEventListener('wheel', function (e) {
    if (!e.target.closest('#stage') || !active) return;
    e.preventDefault();
    active.dist = Math.max(4.2, Math.min(13, active.dist + e.deltaY * 0.0055));
  }, { passive: false });

  detailEl.addEventListener('dblclick', function (e) {
    if (!e.target.closest('#stage') || !active) return;
    e.preventDefault();
    active.yaw = active.yaw0;
    active.pitch = active.pitch0;
    active.dist = active.dist0;
    active.velY = 0; active.velX = 0;
  });

  /* ---------------- 渲染循环 ---------------- */

  function sizeStage(s) {
    var r = stageEl.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width));
    var h = Math.max(1, Math.round(r.height));
    if (w !== s._w || h !== s._h) {
      s._w = w; s._h = h;
      s.camera.aspect = w / h;
      s.camera.updateProjectionMatrix();
    }
    return r;
  }

  function frame() {
    requestAnimationFrame(frame);

    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, VW, VH);
    renderer.clear();

    if (!active || !stageEl) return;

    var r = stageEl.getBoundingClientRect();
    if (r.bottom < -60 || r.top > VH + 60 || r.width < 6 || r.height < 6) return;

    sizeStage(active);

    var s = active;
    if (!drag) {
      s.yaw += s.velY; s.pitch += s.velX;
      s.velY *= 0.93; s.velX *= 0.93;
      s.yaw += s.auto;
      s.pitch += (0 - s.pitch) * 0.004;
      s.pitch = Math.max(-1.1, Math.min(1.1, s.pitch));
    }
    s.group.rotation.y = s.yaw;
    s.group.rotation.x = s.pitch;
    s.camera.position.z += (s.dist - s.camera.position.z) * 0.12;
    s.camera.lookAt(0, 0, 0);
    if (s.update) s.update(performance.now());

    var x = Math.round(r.left), y = Math.round(VH - r.bottom);
    var w = Math.round(r.width), h = Math.round(r.height);
    renderer.setViewport(x, y, w, h);
    renderer.setScissor(x, y, w, h);
    renderer.setScissorTest(true);
    renderer.render(s.scene, s.camera);

    if (s.labelEls) {
      s.group.updateMatrixWorld();
      for (var k = 0; k < s.anchors.length; k++) {
        tmpV.copy(s.anchors[k].p);
        s.group.localToWorld(tmpV);
        tmpV.project(s.camera);
        var el = s.labelEls[k];
        if (!el) continue;
        if (tmpV.z > 1) { el.classList.remove('on'); continue; }
        el.style.left = (tmpV.x * 0.5 + 0.5) * r.width + 'px';
        el.style.top = (-tmpV.y * 0.5 + 0.5) * r.height + 'px';
        el.classList.add('on');
      }
    }
  }

  renderer.setScissorTest(false);
  requestAnimationFrame(frame);

  /* 3D 就绪后再渲染首个视图 */
  boot();

})();
