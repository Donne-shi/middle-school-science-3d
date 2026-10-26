/* ==========================================================================
   v-disperse.js — 溶液 / 悬浊液 / 乳浊液 + 丁达尔光路
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;
  if (!C || !window.THREE) return;

  var R = 0.92, H = 2.5, LH = 1.76;
  var XS = [-2.9, 0, 2.9];
  var BEAM_Y = 0.02;

  var stage, ticker, root;
  var beakers = [], beams = [], sparkles = [], groups = [];
  var dust = [], oil = [], labels = [];
  var settleT = 0, settleTarget = 0;
  var beamT = 0, beamTarget = 0;
  var rotY = 0, tRotY = 0;
  var lastRead = '';

  var TYPES = [
    { key: 'solution', liquid: 0x2F8FA6, scatter: 0.05, tint: '#4FA6C4' },
    { key: 'suspension', liquid: 0x8B6B3E, scatter: 0.92, tint: '#B08A4E' },
    { key: 'emulsion', liquid: 0xCDBE72, scatter: 0.8, tint: '#D8C878' }
  ];

  function typeName(i) {
    return T(['溶液', '悬浊液', '乳浊液'][i]);
  }

  function init() {
    var canvas = document.getElementById('disperse-canvas');
    if (!canvas) return;
    root = canvas.parentNode;
    stage = C.stage(canvas, { fov: 34, position: [0, 1.35, 9.4], target: [0, -0.05, 0] });
    if (!stage) return;

    /* 三只烧杯 */
    for (var i = 0; i < 3; i++) {
      var b = C.buildBeaker({
        radius: R, height: H, liquidHeight: LH,
        liquidColor: TYPES[i].liquid
      });
      b.group.position.x = XS[i];
      b.liquidMat.opacity = i === 0 ? 0.22 : 0.34;
      stage.scene.add(b.group);
      beakers.push(b);
      groups.push(b.group);

      /* 光路 */
      var core = C.beamX(R * 1.94, 0.022, 0xBFF6E6, 0);
      core.position.set(XS[i], BEAM_Y, 0);
      var glow = C.beamX(R * 1.94, 0.085, 0x7FE8CE, 0);
      glow.position.set(XS[i], BEAM_Y, 0);
      stage.scene.add(core, glow);
      beams.push({ core: core, glow: glow, base: TYPES[i].scatter });

      /* 入射与出射的亮点 */
      [-R, R].forEach(function (dx) {
        var g = C.glowSprite(0xD8FFF2, 0.16, 0);
        g.position.set(XS[i] + dx, BEAM_Y, 0.02);
        stage.scene.add(g);
        beams[beams.length - 1]['g' + (dx < 0 ? 'in' : 'out')] = g;
      });
    }

    buildParticles();
    buildSparkles();
    buildLaser();
    buildLabels();
    paintLegend();
    wire();
    ticker = C.ticker(frame);
  }

  function buildLaser() {
    var g = new THREE.Group();
    var body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.72, 20),
      new THREE.MeshStandardMaterial({ color: 0x2A3336, roughness: 0.42, metalness: 0.5 })
    );
    body.rotation.z = Math.PI / 2;
    g.add(body);
    var tip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.06, 16),
      new THREE.MeshStandardMaterial({ color: 0xDFFFF4, emissive: 0x9FF3DC, emissiveIntensity: 2.2 })
    );
    tip.rotation.z = Math.PI / 2;
    tip.position.x = 0.37;
    g.add(tip);
    var halo = C.glowSprite(0x9FF3DC, 0.7, 0.5);
    halo.position.x = 0.4;
    g.add(halo);
    g.position.set(-4.95, BEAM_Y, 0);
    stage.scene.add(g);
  }

  /* ---------------- 颗粒 ---------------- */
  function buildParticles() {
    var dustGeo = new THREE.IcosahedronGeometry(0.036, 0);
    var dustMat = new THREE.MeshStandardMaterial({
      color: 0x6B4A24, roughness: 0.92, metalness: 0,
      emissive: 0x2A1B0C, emissiveIntensity: 0.3
    });
    var oilGeo = new THREE.SphereGeometry(0.052, 10, 8);
    var oilMat = new THREE.MeshStandardMaterial({
      color: 0xE8D98A, roughness: 0.18, metalness: 0.05,
      emissive: 0x6B5C1E, emissiveIntensity: 0.28,
      transparent: true, opacity: 0.92
    });

    for (var i = 0; i < 120; i++) {
      var m = new THREE.Mesh(dustGeo, dustMat);
      resetParticle(m, 1, true);
      groups[1].add(m);
      dust.push(m);
    }
    for (var k = 0; k < 86; k++) {
      var o = new THREE.Mesh(oilGeo, oilMat);
      resetParticle(o, 2, true);
      groups[2].add(o);
      oil.push(o);
    }
  }

  function resetParticle(m, gi, instant) {
    var b = beakers[gi] || { bottomY: -H / 2, liquidTop: -H / 2 + LH };
    var ang = C.rand(0, Math.PI * 2);
    var rad = C.rand(0, R * 0.86);
    var lo = b.bottomY + 0.12, hi = b.liquidTop - 0.1;
    var y = instant ? C.rand(lo, hi) : (gi === 1 ? hi - 0.05 : lo + 0.05);
    m.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad);
    m.rotation.set(C.rand(0, 3), C.rand(0, 3), C.rand(0, 3));
    m.userData = {
      vy: gi === 1 ? C.rand(-0.06, -0.02) : C.rand(0.02, 0.055),
      phase: C.rand(0, 6.28),
      spin: C.rand(-0.4, 0.4),
      lo: lo, hi: hi
    };
  }

  function buildSparkles() {
    for (var i = 0; i < 34; i++) {
      var s = C.glowSprite(0xDFFFF2, C.rand(0.05, 0.1), 0);
      stage.scene.add(s);
      sparkles.push(s);
    }
  }

  /* ---------------- 标签 ---------------- */
  function buildLabels() {
    labels.forEach(function (l) { stage.scene.remove(l); });
    labels = [];
    for (var i = 0; i < 3; i++) {
      var sp = C.labelSprite(typeName(i), i === 0 ? '#BFE7DE' : '#E8D9A8', 0.86);
      sp.material.opacity = 0.88;
      sp.position.set(XS[i], H / 2 + 0.52, 0);
      stage.scene.add(sp);
      labels.push(sp);
    }
  }

  /* ---------------- 图例 ---------------- */
  function paintLegend() {
    var set = function (id, kind, color) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = C.icon(kind, color, 1);
    };
    set('lg-ion2', 'ion', '#4FA6C4');
    set('lg-dust', 'dust', '#B08A4E');
    set('lg-oil', 'oil', '#D8C878');
    var beamEl = document.getElementById('lg-beam');
    if (beamEl) {
      beamEl.innerHTML = '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
        '<rect x="0" y="11" width="26" height="4" fill="#7FE8CE" opacity=".9"/>' +
        '<rect x="0" y="8.5" width="26" height="9" fill="#7FE8CE" opacity=".18"/></svg>';
    }
  }

  /* ---------------- 读数 ---------------- */
  function syncRead() {
    var box = document.getElementById('disperse-read');
    if (!box) return;
    var on = beamTarget > 0.5;
    var settled = settleTarget > 0.5;
    var key = [I18N.lang, on, settled].join('|') + Math.round(settleT * 4);
    if (key === lastRead) return;
    lastRead = key;

    var tag = function (kind, txt) {
      return '<span class="dr-tag is-' + kind + '">' + txt + '</span>';
    };
    var rows = [
      {
        n: typeName(0),
        t: on ? tag('clear', T('无光路')) : tag('clear', T('无光路')),
        d: T('粒子小于 1 nm，光几乎不散射，从侧面看不到光路。')
      },
      {
        n: typeName(1),
        t: on ? tag('lit', T('明显光路')) : tag('lit', T('有光路')),
        d: settled
          ? T('固体已经沉到底部，上层液体变清；光束照到的颗粒变少，光路变暗。')
          : T('固体小颗粒悬浮在水中，散射强烈，能看到一条明亮光路。')
      },
      {
        n: typeName(2),
        t: on ? tag('lit', T('明显光路')) : tag('lit', T('有光路')),
        d: settled
          ? T('小液滴上浮聚成油层，与水分为两层，这正是乳浊液静置后的样子。')
          : T('小液滴分散在水中，光被液滴散射，同样出现明显光路。')
      }
    ];

    box.innerHTML = rows.map(function (r) {
      return '<li><div class="dr-top"><span class="dr-name">' + r.n + '</span>' + r.t + '</div>' +
        '<p class="dr-desc">' + r.d + '</p></li>';
    }).join('');
  }

  /* ---------------- 交互 ---------------- */
  function wire() {
    var btnBeam = document.getElementById('btn-beam');
    btnBeam.addEventListener('click', function () {
      beamTarget = beamTarget > 0.5 ? 0 : 1;
      btnBeam.textContent = beamTarget > 0.5 ? T('关闭激光') : T('打开激光');
      btnBeam.classList.toggle('btn--primary', beamTarget > 0.5);
      syncRead();
    });

    var btnSettle = document.getElementById('btn-settle');
    btnSettle.addEventListener('click', function () {
      settleTarget = settleTarget > 0.5 ? 0 : 1;
      btnSettle.textContent = settleTarget > 0.5 ? T('摇匀') : T('静置 10 分钟');
      btnSettle.classList.toggle('btn--primary', settleTarget > 0.5);
      syncRead();
    });

    document.getElementById('btn-disp-reset').addEventListener('click', function () {
      settleTarget = 0; beamTarget = 0;
      settleT = 0; beamT = 0;
      btnSettle.textContent = T('静置 10 分钟');
      btnSettle.classList.remove('btn--primary');
      btnBeam.textContent = T('打开激光');
      btnBeam.classList.remove('btn--primary');
      dust.forEach(function (m) { resetParticle(m, 1, true); });
      oil.forEach(function (m) { resetParticle(m, 2, true); });
      lastRead = '';
      syncRead();
    });

    var vp = document.querySelector('[data-view="disperse"] .viewport');
    if (vp) {
      vp.addEventListener('pointermove', function (e) {
        var r = vp.getBoundingClientRect();
        tRotY = ((e.clientX - r.left) / r.width - 0.5) * 0.2;
      });
      vp.addEventListener('pointerleave', function () { tRotY = 0; });
    }

    I18N.on(function () {
      buildLabels();
      lastRead = '';
      syncRead();
      var bb = document.getElementById('btn-beam');
      var bs = document.getElementById('btn-settle');
      if (bb) bb.textContent = beamTarget > 0.5 ? T('关闭激光') : T('打开激光');
      if (bs) bs.textContent = settleTarget > 0.5 ? T('摇匀') : T('静置 10 分钟');
    });
  }

  /* ---------------- 循环 ---------------- */
  function frame(dt, time) {
    beamT += (beamTarget - beamT) * Math.min(1, dt * 4);
    settleT += (settleTarget - settleT) * Math.min(1, dt * 1.2);

    rotY += (tRotY - rotY) * 0.05;
    stage.scene.rotation.y = rotY;
    stage.camera.position.x = rotY * 1.4;
    stage.camera.lookAt(0, -0.05, 0);

    /* 光路强度：逐杯衰减，模拟消光 */
    var factor = 1;
    for (var i = 0; i < beams.length; i++) {
      var bm = beams[i];
      var sc = bm.base * (1 - settleT * (i === 0 ? 0 : 0.55));
      var inten = beamT * factor;
      bm.core.material.opacity = 0.92 * sc * inten;
      bm.glow.material.opacity = 0.3 * sc * inten;
      bm.glow.material.opacity *= (0.85 + Math.sin(time * 2 + i) * 0.06);
      if (bm.gin) { bm.gin.material.opacity = 0.5 * inten; bm.gout.material.opacity = 0.42 * inten; }
      factor *= (1 - 0.13 * bm.base);
    }

    /* 散射颗粒闪烁 */
    for (var s = 0; s < sparkles.length; s++) {
      var sp = sparkles[s];
      var idx = s % 3;
      var sc2 = TYPES[idx].scatter;
      var on = beamT * (1 - settleT * (idx === 0 ? 0 : 0.55));
      var flick = 0.55 + Math.sin(time * (2.4 + (s % 5) * 0.7) + s) * 0.45;
      sp.material.opacity = on * sc2 * flick * 0.85;
      if (!sp.userData.seeded) {
        sp.userData.seeded = true;
        sp.userData.dx = C.rand(-R * 0.9, R * 0.9);
        sp.userData.dy = C.rand(-0.14, 0.14);
        sp.userData.dz = C.rand(-0.14, 0.14);
      }
      sp.position.set(XS[idx] + sp.userData.dx, BEAM_Y + sp.userData.dy, sp.userData.dz);
    }

    /* 颗粒沉降 / 上浮 */
    var sink = 0.16 + settleT * 1.5;
    var rise = 0.14 + settleT * 1.2;

    for (var d = 0; d < dust.length; d++) {
      var m = dust[d], u = m.userData;
      m.position.y -= sink * dt * (0.5 + Math.abs(u.vy) * 6);
      m.position.x += Math.sin(time * 0.9 + u.phase) * 0.05 * dt * (1 - settleT);
      m.position.z += Math.cos(time * 0.8 + u.phase) * 0.05 * dt * (1 - settleT);
      m.rotation.y += u.spin * dt;
      if (m.position.y < u.lo) {
        m.position.y = u.lo;
        if (settleT > 0.6) {
          m.position.x *= 0.995;
          m.position.z *= 0.995;
        }
      }
      if (m.position.y > u.hi) m.position.y = u.hi;
    }

    for (var o = 0; o < oil.length; o++) {
      var q = oil[o], v = q.userData;
      q.position.y += rise * dt * (0.4 + Math.abs(v.vy) * 8);
      q.position.x += Math.sin(time * 0.7 + v.phase) * 0.04 * dt * (1 - settleT);
      q.rotation.y += v.spin * dt * 0.5;
      if (q.position.y > v.hi) {
        q.position.y = v.hi;
        if (settleT > 0.6) {
          var rr = Math.hypot(q.position.x, q.position.z) || 1;
          var want = C.rand(0, 0.7 * R);
          q.position.x += (q.position.x / rr) * (want - rr) * 0.02;
          q.position.z += (q.position.z / rr) * (want - rr) * 0.02;
        }
      }
      if (q.position.y < v.lo) q.position.y = v.lo;
    }

    syncRead();
    stage.renderer.render(stage.scene, stage.camera);
  }

  window.VIEWS.disperse = {
    init: init,
    enter: function () {
      if (!ticker) return;
      ticker.start();
      lastRead = '';
      syncRead();
    },
    leave: function () { if (ticker) ticker.stop(); }
  };
})();
