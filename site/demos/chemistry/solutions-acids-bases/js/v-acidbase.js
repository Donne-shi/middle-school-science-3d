/* ==========================================================================
   v-acidbase.js — 分子展厅与电离演示
   强电解质：完全电离；弱电解质：部分电离且可逆；硫酸：分两步
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;
  if (!C || !window.THREE) return;

  var ATOM = C.ATOM;

  var MODELS = {
    HCl: {
      zh: '氯化氢', en: 'Hydrogen chloride', formula: 'HCl', kind: 'strong',
      type: { zh: '强电解质 · 完全电离', en: 'Strong electrolyte · complete' },
      atoms: [{ el: 'Cl', p: [0.3, 0, 0] }, { el: 'H', p: [-0.62, 0, 0] }],
      bonds: [[0, 1]], copies: 8,
      stages: [{ groups: [[1], [0]], labels: ['H⁺', 'Cl⁻'], ratio: 1 }],
      eq: 'HCl = H⁺ + Cl⁻',
      note: {
        zh: '氯化氢溶于水，分子几乎全部分裂成 H⁺ 和 Cl⁻，溶液里基本找不到 HCl 分子。',
        en: 'HCl splits almost completely into H⁺ and Cl⁻ in water — practically no intact HCl molecules remain.'
      },
      hint: { zh: '强酸：电离不可逆，写等号。', en: 'Strong acid: ionization is irreversible — write "=".' }
    },

    H2SO4: {
      zh: '硫酸', en: 'Sulfuric acid', formula: 'H₂SO₄', kind: 'two-step',
      type: { zh: '二元强酸 · 分两步电离', en: 'Diprotic acid · two steps' },
      atoms: [
        { el: 'S', p: [0, 0, 0] },
        { el: 'O', p: [0.62, 0.44, 0] }, { el: 'O', p: [0.62, -0.44, 0] },
        { el: 'O', p: [-0.62, 0.44, 0] }, { el: 'O', p: [-0.62, -0.44, 0] },
        { el: 'H', p: [1.02, 0.76, 0] }, { el: 'H', p: [1.02, -0.76, 0] }
      ],
      bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6]],
      copies: 4,
      stages: [
        { groups: [[5], [0, 1, 2, 3, 4, 6]], labels: ['H⁺', 'HSO₄⁻'], ratio: 1 },
        { groups: [[5], [6], [0, 1, 2, 3, 4]], labels: ['H⁺', 'H⁺', 'SO₄²⁻'], ratio: 0.34 }
      ],
      eq: '第一步  H₂SO₄ = H⁺ + HSO₄⁻\n第二步  HSO₄⁻ ⇌ H⁺ + SO₄²⁻',
      note: {
        zh: '第一步完全电离；第二步只有一部分 HSO₄⁻ 继续电离，用可逆号。所以溶液里 H⁺ 最多，SO₄²⁻ 次之，还剩少量 HSO₄⁻。',
        en: 'The first step goes to completion; only part of the HSO₄⁻ ionizes further, hence the reversible arrow. H⁺ dominates, then SO₄²⁻, with some HSO₄⁻ left.'
      },
      hint: {
        zh: '注意：不是「一步生成 2H⁺ + SO₄²⁻」，第二步是可逆的。',
        en: 'Note: it is not a single step to 2H⁺ + SO₄²⁻ — the second step is reversible.'
      }
    },

    CH3COOH: {
      zh: '醋酸', en: 'Acetic acid', formula: 'CH₃COOH', kind: 'weak',
      type: { zh: '弱电解质 · 部分电离', en: 'Weak electrolyte · partial' },
      atoms: [
        { el: 'C', p: [0, 0, 0] }, { el: 'C', p: [0.62, 0, 0] },
        { el: 'O', p: [1.18, 0.36, 0] }, { el: 'O', p: [1.18, -0.42, 0] },
        { el: 'H', p: [1.62, -0.66, 0] },
        { el: 'H', p: [-0.44, 0.42, 0.18] }, { el: 'H', p: [-0.44, -0.34, 0.38] },
        { el: 'H', p: [-0.44, -0.12, -0.44] }
      ],
      bonds: [[0, 1], [1, 2], [1, 3], [3, 4], [0, 5], [0, 6], [0, 7]],
      copies: 6,
      stages: [{ groups: [[4], [0, 1, 2, 3, 5, 6, 7]], labels: ['H⁺', 'CH₃COO⁻'], ratio: 0.1 }],
      eq: 'CH₃COOH ⇌ CH₃COO⁻ + H⁺',
      note: {
        zh: '醋酸是弱电解质，只有很少一部分分子电离，大部分仍以 CH₃COOH 分子存在。电离与结合同时进行，最终达到动态平衡。',
        en: 'Acetic acid is weak: only a small fraction ionizes, most stays as CH₃COOH molecules. Ionization and recombination run at equal rates — a dynamic equilibrium.'
      },
      hint: {
        zh: '为便于观察，图中放大了电离比例；实际 0.1 mol/L 醋酸的电离度只有约 1%。',
        en: 'The ionization ratio is exaggerated for visibility; a 0.1 mol/L solution is only about 1% ionized.'
      }
    },

    NaOH: {
      zh: '氢氧化钠', en: 'Sodium hydroxide', formula: 'NaOH', kind: 'strong',
      type: { zh: '强碱 · 完全电离', en: 'Strong base · complete' },
      atoms: [
        { el: 'Na', p: [0.6, 0, 0] }, { el: 'O', p: [-0.12, 0, 0] }, { el: 'H', p: [-0.6, 0.26, 0] }
      ],
      bonds: [[0, 1], [1, 2]], copies: 6,
      stages: [{ groups: [[0], [1, 2]], labels: ['Na⁺', 'OH⁻'], ratio: 1 }],
      eq: 'NaOH = Na⁺ + OH⁻',
      note: {
        zh: '氢氧化钠是强碱，在水中完全电离。溶液里只有 Na⁺ 和 OH⁻，没有 NaOH 分子。',
        en: 'NaOH is a strong base and ionizes completely — only Na⁺ and OH⁻ exist in solution.'
      },
      hint: { zh: '强碱：写等号，离子符号右上角标电荷。', en: 'Strong base: use "=" and mark the charge on each ion.' }
    },

    CaOH2: {
      zh: '氢氧化钙', en: 'Calcium hydroxide', formula: 'Ca(OH)₂', kind: 'strong',
      type: { zh: '强碱 · 完全电离（微溶）', en: 'Strong base · complete (slightly soluble)' },
      atoms: [
        { el: 'Ca', p: [0, 0, 0] },
        { el: 'O', p: [-0.7, 0.42, 0] }, { el: 'H', p: [-1.02, 0.7, 0] },
        { el: 'O', p: [-0.7, -0.42, 0] }, { el: 'H', p: [-1.02, -0.7, 0] }
      ],
      bonds: [[0, 1], [1, 2], [0, 3], [3, 4]], copies: 4,
      stages: [{ groups: [[0], [1, 2], [3, 4]], labels: ['Ca²⁺', 'OH⁻', 'OH⁻'], ratio: 1 }],
      eq: 'Ca(OH)₂ = Ca²⁺ + 2OH⁻',
      note: {
        zh: '氢氧化钙微溶于水，但溶解的那一部分完全电离。所以澄清石灰水是强碱溶液，只是浓度很小。',
        en: 'Calcium hydroxide is only slightly soluble, but what does dissolve ionizes completely — limewater is a strong base, just very dilute.'
      },
      hint: { zh: '「微溶」说的是溶得少，不是电离得少。', en: '"Slightly soluble" is about how little dissolves, not how far it ionizes.' }
    },

    NaCl: {
      zh: '氯化钠', en: 'Sodium chloride', formula: 'NaCl', kind: 'strong',
      type: { zh: '盐 · 完全电离', en: 'Salt · complete' },
      atoms: [{ el: 'Na', p: [0.32, 0, 0] }, { el: 'Cl', p: [-0.32, 0, 0] }],
      bonds: [[0, 1]], copies: 8,
      stages: [{ groups: [[0], [1]], labels: ['Na⁺', 'Cl⁻'], ratio: 1 }],
      eq: 'NaCl = Na⁺ + Cl⁻',
      note: {
        zh: '食盐溶于水后完全电离成 Na⁺ 和 Cl⁻，溶液能导电，靠的就是这些自由移动的离子。',
        en: 'Table salt dissociates completely into Na⁺ and Cl⁻ — these free ions carry the current.'
      },
      hint: { zh: '盐不一定中性：NaCl 中性，Na₂CO₃ 显碱性。', en: 'Salts are not always neutral: NaCl is, Na₂CO₃ is basic.' }
    },

    Na2CO3: {
      zh: '碳酸钠', en: 'Sodium carbonate', formula: 'Na₂CO₃', kind: 'strong',
      type: { zh: '盐 · 完全电离', en: 'Salt · complete' },
      atoms: [
        { el: 'C', p: [0, 0, 0] },
        { el: 'O', p: [0, 0.6, 0] }, { el: 'O', p: [0.54, -0.3, 0] }, { el: 'O', p: [-0.54, -0.3, 0] },
        { el: 'Na', p: [1.16, 0.52, 0] }, { el: 'Na', p: [-1.16, 0.52, 0] }
      ],
      bonds: [[0, 1], [0, 2], [0, 3]], copies: 4,
      stages: [{ groups: [[4], [5], [0, 1, 2, 3]], labels: ['Na⁺', 'Na⁺', 'CO₃²⁻'], ratio: 1 }],
      eq: 'Na₂CO₃ = 2Na⁺ + CO₃²⁻',
      note: {
        zh: '纯碱是盐不是碱：它电离出的阴离子是 CO₃²⁻ 而不是 OH⁻，只是水溶液因水解而显碱性。',
        en: 'Soda ash is a salt, not a base: its anion is CO₃²⁻, not OH⁻. Its solution is basic only because of hydrolysis.'
      },
      hint: { zh: '判断碱的标准只有一个：电离出的阴离子是否全部是 OH⁻。', en: 'One test only: are all the anions it releases OH⁻?' }
    }
  };

  var SPREAD = 0.62;

  var stage, scene, camera, ticker;
  var model = null, curKey = '';
  var atoms = [], bonds = [], labels = [], centers = [];
  var geoCache = {};
  var scaledP = [];         // 按分子尺寸归一后的相对坐标
  var molScale = 1;
  var step = 0, mix = 0, mixTarget = 0;
  var visHW = 4, visHH = 3.4, camY = 0;
  var gridC = 4, gridR = 3;
  var eqState = null, eqLock = false;
  var rotY = 0, tRotY = 0, dragging = false, dragX = 0, dragBase = 0;

  function L(o) { return I18N.isEN ? o.en : o.zh; }
  function geoOf(el) {
    if (!geoCache[el]) geoCache[el] = new THREE.SphereGeometry(ATOM[el].r, 20, 16);
    return geoCache[el];
  }

  /* ---------------- 构建 ---------------- */
  function build(key) {
    model = MODELS[key];
    curKey = key;
    clear();

    var n = model.copies;
    var grid = gridOf(n, 1.2);
    var cols = grid.c, rows = grid.r;
    gridC = cols; gridR = rows;
    var gapX = 1.74, gapY = 1.52;
    var w = (cols - 1) * gapX, h = (rows - 1) * gapY;

    /* 分子整体缩放：让每个分子占约 85% 的格宽，避免相互穿插 */
    var maxR = 0;
    model.atoms.forEach(function (a) {
      var d = Math.hypot(a.p[0], a.p[1], a.p[2]) + ATOM[a.el].r;
      if (d > maxR) maxR = d;
    });
    molScale = C.clamp(0.52 * Math.min(gapX, gapY) / maxR, 0.24, 1);
    scaledP = model.atoms.map(function (a) {
      return [a.p[0] * molScale, a.p[1] * molScale, a.p[2] * molScale];
    });

    centers = [];
    for (var i = 0; i < n; i++) {
      var c = i % cols, r = Math.floor(i / cols);
      centers.push(new THREE.Vector3(
        -w / 2 + c * gapX + C.rand(-0.07, 0.07),
        h / 2 - r * gapY + C.rand(-0.07, 0.07),
        C.rand(-0.3, 0.3)
      ));
    }

    for (var m = 0; m < n; m++) {
      for (var a = 0; a < model.atoms.length; a++) {
        var spec = model.atoms[a], def = ATOM[spec.el];
        var mesh = new THREE.Mesh(geoOf(spec.el), new THREE.MeshStandardMaterial({
          color: def.color, roughness: 0.38, metalness: 0.05,
          emissive: def.color, emissiveIntensity: 0.12
        }));
        mesh.scale.setScalar(molScale);
        var sp = scaledP[a];
        var base = new THREE.Vector3(sp[0], sp[1], sp[2]).add(centers[m]);
        mesh.position.copy(base);
        scene.add(mesh);
        atoms.push({ mesh: mesh, base: base, from: base.clone(), el: spec.el, mol: m, idx: a });
      }
    }

    for (var mm = 0; mm < n; mm++) {
      model.bonds.forEach(function (b) {
        var mat = new THREE.MeshStandardMaterial({
          color: 0x9FA8AA, roughness: 0.5, metalness: 0.08,
          transparent: true, opacity: 0.55
        });
        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * Math.max(0.6, molScale), 0.05 * Math.max(0.6, molScale), 1, 8), mat);
        scene.add(mesh);
        bonds.push({ mesh: mesh, mol: mm, ia: b[0], ib: b[1], alive: 1, fade: 1 });
      });
    }

    model.stages.forEach(function (sg, si) {
      /* 只为真正发生电离的分子挂标签，最多 2 个，避免误标与拥挤 */
      var ionN = Math.min(n, Math.max(1, Math.round(n * sg.ratio)), 2);
      for (var mi = 0; mi < ionN; mi++) {
        sg.groups.forEach(function (g, gi) {
          var txt = sg.labels[gi] || '';
          var sp = C.labelSprite(txt, '#EAF6F2', txt.length > 3 ? 0.54 : 0.64);
          sp.material.opacity = 0;
          scene.add(sp);
          /* 标签沿「基团相对分子中心」的径向外出，避免多基团时叠成一列 */
          var cx = 0, cy = 0, rad = 0;
          g.forEach(function (ai) {
            var p = scaledP[ai];
            cx += p[0]; cy += p[1];
          });
          cx /= g.length; cy /= g.length;
          g.forEach(function (ai) {
            var p = scaledP[ai], r = ATOM[model.atoms[ai].el].r * molScale;
            var d = Math.hypot(p[0] - cx, p[1] - cy) + r;
            if (d > rad) rad = d;
          });
          labels.push({
            sprite: sp, mol: mi, stage: si, group: g, shown: false,
            gc: [cx, cy],
            hw: sp.scale.x / 2, hh: sp.scale.y / 2,
            lift: g.length <= 1 ? rad + 0.28 : rad * 0.85 + 0.22
          });
        });
      }
    });

    fitCamera();
    paintCard();
    step = 0; mix = 0; mixTarget = 0;
    atoms.forEach(function (a) { a.from.copy(a.base); });
    bonds.forEach(function (b) { b.alive = 1; b.fade = 1; b.mesh.visible = true; });
    labels.forEach(function (l) { l.shown = false; l.sprite.material.opacity = 0; });
    eqState = null; eqLock = false;
    updateButton();
    updateEq();
  }

  function clear() {
    atoms.forEach(function (o) { scene.remove(o.mesh); o.mesh.material.dispose(); });
    bonds.forEach(function (o) { scene.remove(o.mesh); o.mesh.geometry.dispose(); o.mesh.material.dispose(); });
    labels.forEach(function (o) {
      scene.remove(o.sprite);
      if (o.sprite.material.map) o.sprite.material.map.dispose();
      o.sprite.material.dispose();
    });
    atoms = []; bonds = []; labels = []; centers = [];
  }

  function gridOf(n, aspect) {
    aspect = aspect || 1.2;
    var best = null;
    for (var c = 1; c <= n; c++) {
      var r = Math.ceil(n / c);
      var score = Math.abs(Math.log((c / r) / aspect));
      if (!best || score < best.s) best = { c: c, r: r, s: score };
    }
    return best;
  }

  function fitCamera() {
    if (!camera || !model || !atoms.length) return;
    /* 以真实原子的外接框取景，并给上方标签预留空间 */
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    atoms.forEach(function (a) {
      var r = ATOM[a.el].r * molScale;
      minX = Math.min(minX, a.base.x - r); maxX = Math.max(maxX, a.base.x + r);
      minY = Math.min(minY, a.base.y - r); maxY = Math.max(maxY, a.base.y + r);
    });
    var pad = 0.46 + 0.16 * molScale;
    var gw = (maxX - minX) + pad * 2 + 0.1;
    var gh = (maxY - minY) + pad * 2 + 0.3;
    var cy = (minY + maxY) / 2;
    var vFov = camera.fov * Math.PI / 180;
    var aspect = Math.max(0.55, camera.aspect);
    var tan = Math.tan(vFov / 2);
    var distH = (gh / 2) / tan;
    var distW = (gw / 2) / (tan * aspect);
    camera.position.set(0, cy + 0.05, Math.max(distH, distW, 3.2) * 1.03);
    camera.lookAt(0, cy, 0);
    camY = cy;
    visHH = Math.max(distH, distW, 3.2) * tan;
    visHW = visHH * aspect;
  }

  /* ---------------- 电离几何 ---------------- */
  function ionizedCount(s) {
    var sg = model.stages[s - 1];
    return sg ? Math.round(model.copies * sg.ratio) : 0;
  }

  function ionTargets(molIdx, s) {
    var sg = model.stages[s - 1];
    if (!sg || molIdx >= ionizedCount(s)) return null;

    var center = centers[molIdx];
    var out = {};
    var G = sg.groups.length;

    sg.groups.forEach(function (grp, gi) {
      var cx = 0, cy = 0, cz = 0;
      grp.forEach(function (ai) {
        var p = scaledP[ai];
        cx += p[0]; cy += p[1]; cz += p[2];
      });
      cx /= grp.length; cy /= grp.length; cz /= grp.length;

      var ang = (gi / G) * Math.PI * 2 + molIdx * 1.1;
      var ox = Math.cos(ang) * SPREAD;
      var oy = Math.sin(ang) * SPREAD * 0.7;

      grp.forEach(function (ai) {
        var p = scaledP[ai];
        out[ai] = new THREE.Vector3(
          center.x + ox + (p[0] - cx),
          center.y + oy + (p[1] - cy),
          center.z + (p[2] - cz) * 0.85
        );
      });
    });
    return out;
  }

  /* 累积解析：某分子在某一步时的最终位置 */
  function targetOf(al, s) {
    for (var k = s; k >= 1; k--) {
      var t = ionTargets(al.mol, k);
      if (t && t[al.idx]) return t[al.idx];
    }
    return al.base;
  }

  function groupOf(molIdx, s, atomIdx) {
    var t = ionTargets(molIdx, s);
    if (!t) return -2;               // 未电离
    var sg = model.stages[s - 1];
    for (var gi = 0; gi < sg.groups.length; gi++) {
      if (sg.groups[gi].indexOf(atomIdx) >= 0) return gi;
    }
    return -1;
  }

  function setStep(s) {
    step = s;
    mix = 0;
    mixTarget = 1;
    atoms.forEach(function (a) { a.from.copy(a.mesh.position); });

    bonds.forEach(function (b) {
      var keep = true;
      if (s > 0) {
        var g1 = groupOf(b.mol, s, b.ia), g2 = groupOf(b.mol, s, b.ib);
        keep = g1 >= 0 && g1 === g2;
        if (g1 === -2) keep = true;
      }
      b.alive = keep ? 1 : 0;
    });

    if (!eqLock) updateButton();
    updateEq();
  }

  /* ---------------- 文案 ---------------- */
  function paintCard() {
    document.querySelectorAll('#mol-tabs button').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.dataset.mol === curKey));
    });
    document.getElementById('mol-name').textContent = L({ zh: model.zh, en: model.en });
    document.getElementById('mol-formula').textContent = model.formula;
    document.getElementById('mol-type').textContent = L(model.type);
    document.getElementById('mol-note').textContent = L(model.note);
    document.getElementById('mol-hint').textContent = L(model.hint);
  }

  function updateEq() {
    var el = document.getElementById('mol-ion-eq');
    if (!el) return;
    var txt = model.eq;
    if (model.kind === 'two-step') {
      if (step === 0) txt = 'H₂SO₄ = H⁺ + HSO₄⁻   ⇌';
      else if (step === 1) txt = 'H₂SO₄ = H⁺ + HSO₄⁻\n' + T('第二步 HSO₄⁻ ⇌ H⁺ + SO₄²⁻ 尚未进行');
      else txt = 'H₂SO₄ = H⁺ + HSO₄⁻\nHSO₄⁻ ⇌ H⁺ + SO₄²⁻';
    } else if (model.kind === 'weak') {
      txt = 'CH₃COOH ⇌ CH₃COO⁻ + H⁺\n' + (step > 0 ? T('电离与结合速率相等 · 动态平衡') : T('大部分分子未电离'));
    }
    el.textContent = txt;
  }

  function updateButton() {
    var btn = document.getElementById('mol-ionize');
    if (!btn) return;
    if (step === 0) {
      btn.textContent = model.kind === 'two-step' ? T('第一步：完全电离') : T('电离演示');
      btn.classList.add('btn--primary');
    } else if (model.kind === 'two-step' && step === 1) {
      btn.textContent = T('第二步：部分电离');
      btn.classList.add('btn--primary');
    } else {
      btn.textContent = T('复原为分子');
      btn.classList.remove('btn--primary');
    }
  }

  /* ---------------- 帧 ---------------- */
  function frame(dt, time) {
    mix += (mixTarget - mix) * Math.min(1, dt * 4.4);
    var e = C.ease(C.clamp(mix, 0, 1));

    for (var i = 0; i < atoms.length; i++) {
      var al = atoms[i];
      var tgt = targetOf(al, step);
      al.mesh.position.lerpVectors(al.from, tgt, e);
      var moved = tgt !== al.base;
      al.mesh.material.emissiveIntensity = 0.12 + (moved ? 0.26 : 0) * e;
    }

    for (var b = 0; b < bonds.length; b++) {
      var bd = bonds[b];
      var A = atomAt(bd.mol, bd.ia), B = atomAt(bd.mol, bd.ib);
      if (!A || !B) continue;
      bd.fade += ((bd.alive ? 1 : 0) - bd.fade) * Math.min(1, dt * 6);
      var pa = A.mesh.position, pb = B.mesh.position;
      var dir = pb.clone().sub(pa);
      var len = dir.length() || 0.001;
      bd.mesh.position.copy(pa).add(pb).multiplyScalar(0.5);
      bd.mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
      bd.mesh.scale.set(1, len, 1);
      bd.mesh.material.opacity = 0.55 * bd.fade;
      bd.mesh.visible = bd.fade > 0.02;
    }

    for (var l = 0; l < labels.length; l++) {
      var lb = labels[l];
      var show = (step === lb.stage + 1);
      var sum = ZERO.clone(), cnt = 0;
      for (var g = 0; g < lb.group.length; g++) {
        var at = atomAt(lb.mol, lb.group[g]);
        if (at) { sum.add(at.mesh.position); cnt++; }
      }
      if (cnt) {
        sum.multiplyScalar(1 / cnt);
        /* 在 8 个方位里挑「离其他原子最远、且不出视窗」的一处放标签 */
        var bestA = Math.PI / 2, bestS = -1e9;
        for (var k = 0; k < 8; k++) {
          var ang = Math.PI / 2 + k * Math.PI / 4;
          var ca = Math.abs(Math.cos(ang)), sa = Math.abs(Math.sin(ang));
          var px = sum.x + Math.cos(ang) * lb.lift;
          var py = sum.y + Math.sin(ang) * lb.lift;
          var minD = 9e9;
          for (var q = 0; q < atoms.length; q++) {
            if (atoms[q].mol === lb.mol && lb.group.indexOf(atoms[q].idx) >= 0) continue;
            /* 标签是矩形：按投影半宽算到原子的净间隙 */
            var dx = Math.abs(px - atoms[q].mesh.position.x) - (lb.hw * ca + lb.hh * sa);
            var dy = Math.abs(py - atoms[q].mesh.position.y) - (lb.hw * sa + lb.hh * ca);
            dx = Math.max(0, dx); dy = Math.max(0, dy);
            var dd = Math.sqrt(dx * dx + dy * dy);
            if (dd < minD) minD = dd;
          }
          if (minD > 9e8) minD = 1.2;
          var over = Math.max(0, Math.abs(px) / visHW - 0.9) + Math.max(0, Math.abs(py - camY) / visHH - 0.9);
          var sc = minD - over * 3 + (Math.sin(ang) > 0 ? 0.05 : 0);
          if (sc > bestS) { bestS = sc; bestA = ang; }
        }
        lb.sprite.position.set(
          sum.x + Math.cos(bestA) * lb.lift,
          sum.y + Math.sin(bestA) * lb.lift,
          sum.z
        );
      }
      var want = show ? 0.95 * e : 0;
      var op = lb.sprite.material.opacity + (want - lb.sprite.material.opacity) * Math.min(1, dt * 5);
      lb.sprite.material.opacity = op;
    }

    rotY += (tRotY - rotY) * 0.06;
    scene.rotation.y = rotY;
    stage.renderer.render(scene, camera);
  }

  var UP = new THREE.Vector3(0, 1, 0);
  var ZERO = new THREE.Vector3();

  function atomAt(mol, idx) {
    return atoms[mol * model.atoms.length + idx] || null;
  }

  /* ---------------- 动态平衡 ---------------- */
  function tickEq(dt) {
    if (!eqState) return;
    eqState.t += dt;
    if (eqState.phase === 'ion' && eqState.t > 3.4) {
      eqState.phase = 'rec'; eqState.t = 0;
      setStep(0);
    } else if (eqState.phase === 'rec' && eqState.t > 1.8) {
      eqState.phase = 'ion'; eqState.t = 0;
      setStep(1);
    }
  }

  /* ---------------- 交互 ---------------- */
  function wire() {
    document.querySelectorAll('#mol-tabs button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        build(btn.dataset.mol);
      });
    });

    document.getElementById('mol-ionize').addEventListener('click', function () {
      if (model.kind === 'weak') {
        if (step === 0) {
          eqLock = true;
          setStep(1);
          eqState = { phase: 'ion', t: 0 };
          this.textContent = T('停止演示');
          this.classList.remove('btn--primary');
        } else {
          eqState = null;
          eqLock = false;
          setStep(0);
          updateButton();
        }
        return;
      }
      if (model.kind === 'two-step') {
        setStep(step === 0 ? 1 : step === 1 ? 2 : 0);
        return;
      }
      setStep(step === 0 ? 1 : 0);
    });

    var vp = document.querySelector('[data-view="acidbase"] .viewport');
    if (vp) {
      vp.addEventListener('pointerdown', function (e) {
        dragging = true; dragX = e.clientX; dragBase = tRotY;
        vp.setPointerCapture && vp.setPointerCapture(e.pointerId);
      });
      vp.addEventListener('pointermove', function (e) {
        if (dragging) tRotY = dragBase + (e.clientX - dragX) * 0.007;
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
        vp.addEventListener(ev, function () { dragging = false; });
      });
    }

    I18N.on(function () {
      if (!model) return;
      paintCard();
      updateEq();
      if (!eqLock) updateButton();
    });
  }

  function init() {
    var canvas = document.getElementById('mol-canvas');
    if (!canvas) return;
    stage = C.stage(canvas, { fov: 34, position: [0, 0.05, 8], target: [0, 0, 0] });
    if (!stage) return;
    scene = stage.scene;
    camera = stage.camera;
    wire();
    build('HCl');
    ticker = C.ticker(function (dt, time) {
      tickEq(dt);
      frame(dt, time);
    });
  }

  window.VIEWS.acidbase = {
    init: init,
    enter: function () {
      if (!ticker) return;
      fitCamera();
      ticker.start();
    },
    leave: function () { if (ticker) ticker.stop(); }
  };
})();
