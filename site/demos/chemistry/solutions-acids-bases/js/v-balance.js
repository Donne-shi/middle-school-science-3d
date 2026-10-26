/* ==========================================================================
   v-balance.js — 方程式配平：三维原子守恒
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;
  if (!C || !window.THREE) return;

  var ATOM = C.ATOM;

  var EQS = [
    {
      tag: '01',
      left: [{ f: 'HCl', a: { H: 1, Cl: 1 } }, { f: 'Ca(OH)₂', a: { Ca: 1, O: 2, H: 2 } }],
      right: [{ f: 'CaCl₂', a: { Ca: 1, Cl: 2 } }, { f: 'H₂O', a: { H: 2, O: 1 } }],
      ans: [2, 1, 1, 2],
      tip: { zh: '先看钙：右边只有 1 个 Ca，所以 Ca(OH)₂ 系数先定 1。再看氯：右边 2 个 Cl，HCl 前面填 2。', en: 'Start with Ca: only one on the right, so Ca(OH)₂ stays at 1. Then Cl: two on the right, so HCl takes 2.' }
    },
    {
      tag: '02',
      left: [{ f: 'H₂SO₄', a: { H: 2, S: 1, O: 4 } }, { f: 'NaOH', a: { Na: 1, O: 1, H: 1 } }],
      right: [{ f: 'Na₂SO₄', a: { Na: 2, S: 1, O: 4 } }, { f: 'H₂O', a: { H: 2, O: 1 } }],
      ans: [1, 2, 1, 2],
      tip: { zh: '钠在右边成对出现，NaOH 前面先填 2；随后用氢和氧去核对水。', en: 'Na appears in pairs on the right — set NaOH to 2 first, then check H and O on water.' }
    },
    {
      tag: '03',
      left: [{ f: 'Al', a: { Al: 1 } }, { f: 'HCl', a: { H: 1, Cl: 1 } }],
      right: [{ f: 'AlCl₃', a: { Al: 1, Cl: 3 } }, { f: 'H₂', a: { H: 2 } }],
      ans: [2, 6, 2, 3],
      tip: { zh: '氯的最小公倍数是 6：左边 6 个 HCl，右边 2 个 AlCl₃；氢正好 6 个，配 3 个 H₂。', en: 'Least common multiple for Cl is 6: six HCl on the left, two AlCl₃ on the right; that leaves six H, i.e. three H₂.' }
    },
    {
      tag: '04',
      left: [{ f: 'CH₄', a: { C: 1, H: 4 } }, { f: 'O₂', a: { O: 2 } }],
      right: [{ f: 'CO₂', a: { C: 1, O: 2 } }, { f: 'H₂O', a: { H: 2, O: 1 } }],
      ans: [1, 2, 1, 2],
      tip: { zh: '碳只有一处，先定 CH₄ = 1；4 个氢要 2 个 H₂O；最后数氧：右边共 4 个，左边补 2 个 O₂。', en: 'Carbon pins CH₄ at 1; four H need two H₂O; count O last — four on the right, so two O₂.' }
    },
    {
      tag: '05',
      left: [{ f: 'Fe', a: { Fe: 1 } }, { f: 'O₂', a: { O: 2 } }],
      right: [{ f: 'Fe₃O₄', a: { Fe: 3, O: 4 } }],
      ans: [3, 2, 1],
      tip: { zh: 'Fe₃O₄ 里铁氧比是 3 : 4，所以先写 3Fe 和 2O₂，产物系数保持 1。', en: 'Fe₃O₄ fixes Fe:O = 3:4, so write 3Fe and 2O₂ with the product at 1.' }
    }
  ];

  var BOX_W = 1.86, BOX_H = 2.0;
  var LEFT_X = -2.12, RIGHT_X = 2.12;

  var stage, scene, camera, ticker;
  var cur = 0;
  var coefs = [];
  var leftGroup = null, rightGroup = null, bridge = null;
  var spawned = [];
  var geoCache = {};
  var rotY = 0;
  var verdictKey = '';

  function L(o) { return I18N.isEN ? o.en : o.zh; }
  function geoOf(el) {
    if (!geoCache[el]) {
      geoCache[el] = new THREE.SphereGeometry(ATOM[el].r, 14, 12);
      geoCache[el].userData.shared = true;
    }
    return geoCache[el];
  }

  /* ---------------- 场景骨架 ---------------- */
  function init() {
    var canvas = document.getElementById('balance-canvas');
    if (!canvas) return;
    stage = C.stage(canvas, { fov: 34, position: [0, 0.15, 9.6], target: [0, 0, 0] });
    if (!stage) return;
    scene = stage.scene;
    camera = stage.camera;

    drawBox(LEFT_X, -BOX_W / 2, BOX_W);
    drawBox(RIGHT_X, -BOX_W / 2, BOX_W);

    /* 中间箭头 */
    var shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.42, 12),
      new THREE.MeshBasicMaterial({ color: 0x5FBF9E, transparent: true, opacity: 0.7 })
    );
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(-0.28, 0, 0);
    scene.add(shaft);
    var head = new THREE.Mesh(
      new THREE.ConeGeometry(0.085, 0.2, 16),
      new THREE.MeshBasicMaterial({ color: 0x5FBF9E, transparent: true, opacity: 0.8 })
    );
    head.rotation.z = -Math.PI / 2;
    head.position.set(0.03, 0, 0);
    scene.add(head);

    /* 守恒光带 */
    bridge = new THREE.Mesh(
      new THREE.BoxGeometry(3.3, 0.02, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x4FE0A8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    bridge.position.set(0, 0, 0.05);
    scene.add(bridge);

    wire();
    load(0);
    fit();
    window.addEventListener('resize', fit);
    ticker = C.ticker(function (dt, time) { frame(dt, time); });
  }

  /* 取景：让两个虚线框在视窗里占满，而不是缩在中间 */
  function fit() {
    if (!camera) return;
    if (stage && stage.resize) stage.resize();   /* 视图刚显示时宽高比可能还是旧值 */
    var halfW = (RIGHT_X - LEFT_X) / 2 + BOX_W / 2 + 0.28;
    var halfH = BOX_H / 2 + 0.62;
    var tan = Math.tan(camera.fov * Math.PI / 360);
    var aspect = Math.max(0.6, camera.aspect);
    var dH = halfH / tan, dW = halfW / (tan * aspect);
    camera.position.set(0, 0.15, Math.max(dH, dW, 3.0) * 1.02);
    camera.lookAt(0, 0, 0);
  }

  function drawBox(cx, y0, w) {    var g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-w / 2, -BOX_H / 2, 0), new THREE.Vector3(w / 2, -BOX_H / 2, 0),
      new THREE.Vector3(w / 2, BOX_H / 2, 0), new THREE.Vector3(-w / 2, BOX_H / 2, 0),
      new THREE.Vector3(-w / 2, -BOX_H / 2, 0)
    ]);
    var line = new THREE.Line(g, new THREE.LineBasicMaterial({
      color: 0x6FA8A0, transparent: true, opacity: 0.26
    }));
    line.position.set(cx, 0, -0.1);
    scene.add(line);

    /* 四角刻度 */
    var corner = new THREE.MeshBasicMaterial({ color: 0x7FD8C4, transparent: true, opacity: 0.5 });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), corner);
      m.position.set(cx + c[0] * w / 2, c[1] * BOX_H / 2, -0.1);
      scene.add(m);
    });
  }

  /* ---------------- 数据 ---------------- */
  function atomsOf(eq, side) {
    var out = {};
    var list = side === 'left' ? eq.left : eq.right;
    var offset = side === 'left' ? 0 : eq.left.length;
    list.forEach(function (sp, i) {
      var n = coefs[offset + i];
      Object.keys(sp.a).forEach(function (el) {
        out[el] = (out[el] || 0) + sp.a[el] * n;
      });
    });
    return out;
  }

  function balanced() {
    var l = atomsOf(EQS[cur], 'left'), r = atomsOf(EQS[cur], 'right');
    var keys = Object.keys(Object.assign({}, l, r));
    return keys.every(function (k) { return (l[k] || 0) === (r[k] || 0); }) ? keys : null;
  }

  /* ---------------- 建模 ---------------- */
  function clearSide(group) {
    if (!group) return;
    group.children.slice().forEach(function (c) {
      c.traverse(function (m) {
        if (m.isMesh) {
          if (m.geometry && m.geometry.userData.shared !== true) m.geometry.dispose();
          if (m.material) m.material.dispose();
        }
      });
      group.remove(c);
    });
    scene.remove(group);
  }

  function buildSide(eq, side) {
    var list = side === 'left' ? eq.left : eq.right;
    var offset = side === 'left' ? 0 : eq.left.length;
    var counts = list.map(function (_, i) { return coefs[offset + i]; });
    var total = counts.reduce(function (a, b) { return a + b; }, 0);
    if (!total) return null;

    var group = new THREE.Group();
    var cx = side === 'left' ? LEFT_X : RIGHT_X;
    group.position.set(cx, 0, 0);

    var cols = Math.ceil(Math.sqrt(total));
    var rows = Math.ceil(total / cols);
    var cellW = BOX_W / cols, cellH = BOX_H / rows;
    /* 每个分子的外接半径按格子大小来定，保证不超出虚线框 */
    var targetR = Math.min(cellW, cellH) * 0.43;

    var idx = 0;
    list.forEach(function (sp, si) {
      var els = Object.keys(sp.a);
      for (var c = 0; c < counts[si]; c++) {
        var col = idx % cols, row = Math.floor(idx / cols);
        var px = -BOX_W / 2 + cellW * (col + 0.5);
        var py = BOX_H / 2 - cellH * (row + 0.5);
        var cluster = makeMolecule(els, sp.a, targetR);
        cluster.position.set(px, py, C.rand(-0.12, 0.12));
        cluster.userData.delay = idx * 0.035;
        group.add(cluster);
        spawned.push(cluster);
        idx++;
      }
    });

    scene.add(group);
    return group;
  }

  function makeMolecule(els, counts, targetR) {
    var outer = new THREE.Group();
    var g = new THREE.Group();
    var seq = [];
    els.forEach(function (el) {
      for (var i = 0; i < counts[el]; i++) seq.push(el);
    });
    var n = seq.length;
    var rad = 0.88;   /* 键长：明显大于相邻原子半径之和，键才看得见 */
    var atoms = [];
    seq.forEach(function (el, i) {
      var def = ATOM[el];
      var m = new THREE.Mesh(geoOf(el), new THREE.MeshStandardMaterial({
        color: def.color, roughness: 0.4, metalness: 0.05,
        emissive: def.color, emissiveIntensity: 0.16
      }));
      var pos;
      if (i === 0) pos = new THREE.Vector3(0, 0, 0);
      else {
        var phi = Math.acos(1 - 2 * (i / Math.max(1, n)));
        var theta = Math.PI * (1 + Math.sqrt(5)) * i;
        pos = new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi) * rad,
          Math.sin(theta) * Math.sin(phi) * rad,
          Math.cos(phi) * rad * 0.8
        );
      }
      m.position.copy(pos);
      g.add(m);
      atoms.push({ mesh: m, pos: pos, el: el });
    });

    /* 键：从中心原子连到其余原子 */
    var bondMat = new THREE.MeshStandardMaterial({
      color: 0xC7D3D0, roughness: 0.45, metalness: 0.05,
      transparent: true, opacity: 0.7
    });
    for (var i = 1; i < atoms.length; i++) {
      var a = atoms[0].pos, b = atoms[i].pos;
      var dir = b.clone().sub(a);
      var len = dir.length();
      if (len < 1e-4) continue;
      var cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, len, 10), bondMat);
      cyl.position.copy(a).add(b).multiplyScalar(0.5);
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      g.add(cyl);
    }

    /* 按实际外接半径整体缩放到 targetR */
    var ext = 0.5;
    atoms.forEach(function (o) {
      var d = o.pos.length() + ATOM[o.el].r;
      if (d > ext) ext = d;
    });
    g.scale.setScalar(C.clamp(targetR / ext, 0.18, 1.6));

    outer.add(g);
    outer.scale.setScalar(0.01);
    return outer;
  }

  /* ---------------- 重建 ---------------- */
  function rebuild() {
    clearSide(leftGroup);
    clearSide(rightGroup);
    leftGroup = buildSide(EQS[cur], 'left');
    rightGroup = buildSide(EQS[cur], 'right');
    spawned = spawned.filter(function (c) { return c.parent; });
    renderAtoms();
    renderVerdict();
  }

  /* ---------------- HTML ---------------- */
  function renderEquation() {
    var eq = EQS[cur];
    var box = document.getElementById('balance-eq');
    if (!box) return;
    var html = '';
    var make = function (sp, i) {
      return '<span class="coef" data-i="' + i + '">' +
        '<button type="button" data-act="dec" aria-label="-">−</button>' +
        '<b>' + coefs[i] + '</b>' +
        '<button type="button" data-act="inc" aria-label="+">+</button></span>' +
        '<span class="formula">' + sp.f + '</span>';
    };
    eq.left.forEach(function (sp, i) {
      if (i) html += '<span class="plus">+</span>';
      html += make(sp, i);
    });
    html += '<span class="arrow">→</span>';
    eq.right.forEach(function (sp, i) {
      if (i) html += '<span class="plus">+</span>';
      html += make(sp, i + eq.left.length);
    });
    box.innerHTML = html;
  }

  function renderAtoms() {
    var eq = EQS[cur];
    var l = atomsOf(eq, 'left'), r = atomsOf(eq, 'right');
    var keys = Object.keys(Object.assign({}, l, r));
    var box = document.getElementById('balance-atoms');
    if (!box) return;
    box.innerHTML = keys.map(function (k) {
      var lv = l[k] || 0, rv = r[k] || 0;
      var ok = lv === rv;
      return '<div class="atom-row ' + (ok ? 'is-ok' : 'is-bad') + '">' +
        '<span class="ae"><i style="background:' + ATOM[k].css + '"></i>' + k + '</span>' +
        '<span class="an">' + lv + '</span>' +
        '<span class="ao">→</span>' +
        '<span class="an">' + rv + '</span>' +
        '<span class="st">' + (ok ? '✓' : '✗') + '</span>' +
        '</div>';
    }).join('');
  }

  function renderVerdict() {
    var eq = EQS[cur];
    var l = atomsOf(eq, 'left'), r = atomsOf(eq, 'right');
    var keys = Object.keys(Object.assign({}, l, r));
    var bad = keys.filter(function (k) { return (l[k] || 0) !== (r[k] || 0); });
    var el = document.getElementById('balance-check');
    if (!el) return;

    var key = bad.join(',') + '|' + I18N.lang + '|' + coefs.join('');
    if (key === verdictKey) return;
    verdictKey = key;

    /* 系数高亮 */
    document.querySelectorAll('#balance-eq .coef').forEach(function (c) {
      var i = +c.getAttribute('data-i');
      c.classList.toggle('is-ok', !bad.length);
      c.classList.toggle('is-bad', bad.length > 0 && coefs[i] === 1);
    });

    if (!bad.length) {
      el.className = 'balance-verdict is-ok';
      el.innerHTML = '<b>' + T('已配平') + '</b>　' + T('等号两边每种原子的个数都相等，系数是最简整数比。');
      if (bridge) bridge.userData.on = 1;
    } else {
      el.className = 'balance-verdict is-bad';
      var parts = bad.map(function (k) {
        return k + ' ' + (l[k] || 0) + ' : ' + (r[k] || 0);
      });
      el.innerHTML = '<b>' + T('还没平') + '</b>　' + T('这些元素两边不相等：') + parts.join('，') +
        '．' + T('调整对应的系数，让两边的数目对上。');
      if (bridge) bridge.userData.on = 0;
    }
  }

  function renderPool() {
    var box = document.getElementById('balance-pool');
    if (!box) return;
    box.innerHTML = EQS.map(function (e, i) {
      var txt = e.left.map(function (s, k) { return (k ? ' + ' : '') + s.f; }).join('') +
        ' → ' + e.right.map(function (s, k) { return (k ? ' + ' : '') + s.f; }).join('');
      return '<button type="button" data-eq="' + i + '" aria-selected="' + (i === cur) + '">' +
        '<span>' + e.tag + '</span>' + txt + '</button>';
    }).join('');
    box.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { load(+b.getAttribute('data-eq')); });
    });
  }

  function renderLegend() {
    var eq = EQS[cur];
    var keys = {};
    eq.left.concat(eq.right).forEach(function (sp) {
      Object.keys(sp.a).forEach(function (k) { keys[k] = 1; });
    });
    var box = document.getElementById('balance-legend');
    if (!box) return;
    box.innerHTML = Object.keys(keys).map(function (k) {
      return '<span class="lg"><i>' + C.icon('ion', ATOM[k].css, 0.62) + '</i><b>' + k + '</b></span>';
    }).join('');
  }

  /* ---------------- 交互 ---------------- */
  function load(i) {
    cur = i;
    coefs = EQS[i].left.concat(EQS[i].right).map(function () { return 1; });
    spawned = [];
    verdictKey = '';
    var tip = document.getElementById('balance-tip');
    if (tip) tip.hidden = true;
    var hb = document.getElementById('btn-bal-hint');
    if (hb) hb.textContent = T('给点提示');
    renderPool();
    renderEquation();
    renderLegend();
    rebuild();
  }

  function bump(i, d) {
    coefs[i] = C.clamp(coefs[i] + d, 1, 9);
    verdictKey = '';
    var b = document.querySelector('#balance-eq .coef[data-i="' + i + '"] b');
    if (b) b.textContent = coefs[i];
    rebuild();
  }

  function wire() {
    var box = document.getElementById('balance-eq');
    box.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-act]');
      if (!btn) return;
      var wrap = btn.closest('.coef');
      var i = +wrap.getAttribute('data-i');
      bump(i, btn.getAttribute('data-act') === 'inc' ? 1 : -1);
    });

    document.getElementById('btn-bal-reset').addEventListener('click', function () {
      coefs = coefs.map(function () { return 1; });
      verdictKey = '';
      renderEquation();
      rebuild();
    });

    document.getElementById('btn-bal-hint').addEventListener('click', function () {
      var el = document.getElementById('balance-tip');
      if (!el) return;
      if (!el.hidden) { el.hidden = true; return; }   /* 再点一次收起 */
      el.textContent = L(EQS[cur].tip);
      el.hidden = false;
      this.textContent = T('收起提示');
    });

    var vp = document.querySelector('[data-view="balance"] .viewport');
    if (vp) {
      vp.addEventListener('pointermove', function (e) {
        var r = vp.getBoundingClientRect();
        rotY = ((e.clientX - r.left) / r.width - 0.5) * 0.22;
      });
      vp.addEventListener('pointerleave', function () { rotY = 0; });
    }

    I18N.on(function () {
      verdictKey = '';
      renderVerdict();
      renderPool();
      var tip = document.getElementById('balance-tip');
      if (tip && !tip.hidden) tip.textContent = L(EQS[cur].tip);
    });
  }

  /* ---------------- 帧 ---------------- */
  var t0 = 0;

  function frame(dt, time) {
    t0 += dt;

    for (var i = 0; i < spawned.length; i++) {
      var c = spawned[i];
      if (!c.parent) continue;
      var d = c.userData.delay || 0;
      var k = C.clamp((t0 - d) * 1.8, 0, 1);
      var e = C.ease(k);
      c.scale.setScalar(0.001 + e * 0.999);
      c.position.y += Math.sin(time * 1.2 + i) * 0.0006;
    }

    if (bridge) {
      var on = bridge.userData.on || 0;
      bridge.material.opacity += (on * 0.5 - bridge.material.opacity) * Math.min(1, dt * 3);
      var s = 0.4 + Math.sin(time * 2.4) * 0.06;
      bridge.scale.y = bridge.scale.z = on ? s : 0.2;
    }

    scene.rotation.y = rotY * 0.35;
    scene.rotation.x = 0;
    stage.renderer.render(scene, camera);
  }

  window.VIEWS.balance = {
    init: init,
    enter: function () {
      if (!ticker) return;
      t0 = 0;
      fit();
      spawned.forEach(function (c) { c.scale.setScalar(0.01); });
      ticker.start();
    },
    leave: function () { if (ticker) ticker.stop(); }
  };
})();
