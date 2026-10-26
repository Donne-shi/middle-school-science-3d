/* ==========================================================================
   v-neutralize.js — 三维酸碱中和滴定 + pH 曲线
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;
  if (!C || !window.THREE) return;

  var stage, scene, beaker, burette, buretteLiquid, ticker;
  var canvas, curveCanvas, cctx;
  var ions = [], effects = [], waters = [];
  var delivered = 0;
  var state = { V: 0, indicator: 'none', auto: false };
  var els = {};
  var rx = 0, ry = 0, trx = 0, try_ = 0;
  var bottomY, liquidTop, yMin, yMax, rMax = 1.08;

  var geoH, geoCl, geoNa, geoOH, matH, matCl, matNa, matOH;
  var lastUI = '';

  /* ---------------- 构建 ---------------- */
  function init() {
    canvas = document.getElementById('neut-canvas');
    if (!canvas) return;
    stage = C.stage(canvas, { fov: 35, position: [0.4, 1.4, 10.4], target: [0, 0.3, 0] });
    if (!stage) return;
    scene = stage.scene;

    beaker = C.buildBeaker({
      radius: 1.36, height: 2.9, liquidHeight: 1.85, offsetY: -0.78,
      liquidColor: 0x8FB9BE, glassOpacity: 0.13
    });
    scene.add(beaker.group);

    bottomY = beaker.bottomY;
    liquidTop = beaker.liquidTop;
    yMin = bottomY + 0.4;
    yMax = liquidTop - 0.18;

    buildBurette();
    buildParticles();
    cacheEls();
    wire();
    paintLegend();

    rebuild();
    refreshUI(true);
    ticker = C.ticker(function (dt, time) { frame(dt, time); });
    requestAnimationFrame(drawCurve);
  }

  function buildBurette() {
    burette = new THREE.Group();
    var tube = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 2.15, 40, 1, true), C.glassMat(0.2));
    tube.position.y = 2.18;
    burette.add(tube);
    var tubeTop = new THREE.Mesh(
      new THREE.TorusGeometry(0.17, 0.014, 8, 40),
      new THREE.MeshBasicMaterial({ color: 0xbfe8e2, transparent: true, opacity: 0.4 })
    );
    tubeTop.rotation.x = Math.PI / 2; tubeTop.position.y = 3.25;
    burette.add(tubeTop);

    buretteLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.135, 1.95, 32),
      new THREE.MeshPhysicalMaterial({ color: 0x6fbfc4, transparent: true, opacity: 0.34, roughness: 0.1, depthWrite: false })
    );
    burette.add(buretteLiquid);

    var stop = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.1, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.4, metalness: 0.3 })
    );
    stop.position.y = 1.18;
    burette.add(stop);

    var knob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0xE8E1D2, roughness: 0.4 })
    );
    knob.rotation.z = Math.PI / 2;
    knob.position.set(0.34, 1.18, 0);
    burette.add(knob);

    var tip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.1, 0.32, 24), C.glassMat(0.3));
    tip.position.y = 0.96;
    burette.add(tip);

    scene.add(burette);
  }

  function buildParticles() {
    geoH = new THREE.SphereGeometry(0.105, 14, 12);
    geoCl = new THREE.SphereGeometry(0.145, 16, 12);
    geoNa = new THREE.SphereGeometry(0.14, 16, 12);
    geoOH = new THREE.SphereGeometry(0.12, 14, 12);
    matH = C.glowMat(0x6FB6C9, 0.5);
    matCl = C.glowMat(0x3E9E7E, 0.22);
    matNa = C.glowMat(0xC9A85A, 0.3);
    matOH = C.glowMat(0xC97B4A, 0.4);
  }

  function paintLegend() {
    var set = function (id, color) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = C.icon('ion', color, 1);
    };
    set('lg-h', '#6FB6C9');
    set('lg-cl', '#3E9E7E');
    set('lg-oh', '#C97B4A');
    set('lg-na', '#C9A85A');
    var w = document.getElementById('lg-water2');
    if (w) w.innerHTML = C.icon('water', null, 1);
  }

  /* ---------------- 粒子 ---------------- */
  function randomSpot() {
    var a = C.rand(0, Math.PI * 2), r = C.rand(0.2, rMax - 0.04);
    return new THREE.Vector3(Math.cos(a) * r, C.rand(yMin + 0.12, yMax), Math.sin(a) * r);
  }

  function spawnIon(kind, pos) {
    var geo = kind === 'H' ? geoH : kind === 'Cl' ? geoCl : kind === 'Na' ? geoNa : geoOH;
    var mat = kind === 'H' ? matH : kind === 'Cl' ? matCl : kind === 'Na' ? matNa : matOH;
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    scene.add(mesh);
    var ion = {
      kind: kind, mesh: mesh, state: 'free', busy: false, target: null,
      v: new THREE.Vector3(C.rand(-0.14, 0.14), C.rand(-0.1, 0.1), C.rand(-0.14, 0.14)),
      t: 0, from: pos.clone(), to: pos.clone(), phase: Math.random() * 6.28
    };
    ions.push(ion);
    return ion;
  }

  function killIon(ion) {
    var i = ions.indexOf(ion);
    if (i >= 0) ions.splice(i, 1);
    scene.remove(ion.mesh);
  }

  function flash(pos, color) {
    var sp = C.glowSprite(color, 0.5, 0.9);
    sp.position.copy(pos);
    scene.add(sp);
    effects.push({ type: 'flash', obj: sp, t: 0 });
  }

  function ripple(pos) {
    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.012, 6, 36),
      new THREE.MeshBasicMaterial({ color: 0x9FE0D8, transparent: true, opacity: 0.65, depthWrite: false })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pos.x, liquidTop - 0.01, pos.z);
    scene.add(ring);
    effects.push({ type: 'ring', obj: ring, t: 0 });
  }

  function addWater(pos) {
    if (waters.length > 10) {
      var old = waters.shift();
      scene.remove(old);
    }
    var w = C.waterMolecule(0.55);
    w.position.copy(pos);
    scene.add(w);
    waters.push(w);
  }

  function rebuild() {
    ions.slice().forEach(killIon);
    waters.splice(0).forEach(function (w) { scene.remove(w); });
    effects.splice(0).forEach(function (e) { scene.remove(e.obj); });
    delivered = Math.round(state.V / 50 * 12);
    var units = delivered;
    var nH = C.clamp(12 - units, 0, 12);
    var nOH = C.clamp(units - 12, 0, 12);
    var nNa = C.clamp(units, 0, 12);
    for (var i = 0; i < nH; i++) spawnIon('H', randomSpot());
    for (var j = 0; j < 12; j++) spawnIon('Cl', randomSpot());
    for (var k = 0; k < nNa; k++) spawnIon('Na', randomSpot());
    for (var m = 0; m < nOH; m++) spawnIon('OH', randomSpot());
  }

  function countKind(k) {
    var n = 0;
    for (var i = 0; i < ions.length; i++) if (ions[i].kind === k) n++;
    return n;
  }

  function findFreeH() {
    var cands = ions.filter(function (o) { return o.kind === 'H' && !o.busy && o.state === 'free'; });
    return cands.length ? cands[Math.floor(Math.random() * cands.length)] : null;
  }

  function spawnUnit() {
    if (countKind('Na') < 12) {
      var na = spawnIon('Na', new THREE.Vector3(C.rand(-0.05, 0.05), 1.0, C.rand(-0.05, 0.05)));
      na.state = 'fall'; na.t = 0; na.to = randomSpot();
    }
    var oh = spawnIon('OH', new THREE.Vector3(C.rand(-0.05, 0.05), 1.0, C.rand(-0.05, 0.05)));
    oh.state = 'fall'; oh.t = 0; oh.to = randomSpot();
    var h = findFreeH();
    if (h) { oh.seek = h; h.busy = true; }
    delivered++;
    if (Math.random() < 0.7) ripple({ x: C.rand(-0.3, 0.3), z: C.rand(-0.3, 0.3) });
  }

  function syncUnits() {
    var target = Math.round(state.V / 50 * 12);
    if (target < delivered || target - delivered > 6) { rebuild(); return; }
    var guard = 0;
    while (delivered < target && guard < 2) { spawnUnit(); guard++; }
  }

  /* ---------------- 更新 ---------------- */
  function updateIons(dt, time) {
    var dead = [];
    for (var i = 0; i < ions.length; i++) {
      var ion = ions[i];
      var p = ion.mesh.position;

      if (ion.state === 'fall') {
        ion.t += dt / 0.55;
        var k = Math.min(1, ion.t);
        p.lerpVectors(ion.from, ion.to, k * k);
        if (k >= 1) {
          ion.state = 'free';
          if (ion.seek) ion.state = 'seek';
        }
        continue;
      }

      if (ion.state === 'seek' && ion.seek) {
        if (ion.seek._dead) { ion.seek = null; ion.state = 'free'; continue; }
        var tp = ion.seek.mesh.position;
        var dir = new THREE.Vector3().subVectors(tp, p);
        var d = dir.length();
        if (d < 0.22) { dead.push({ ion: ion, other: ion.seek }); continue; }
        dir.multiplyScalar(1 / d);
        p.addScaledVector(dir, dt * 3.4);
        continue;
      }

      p.x += ion.v.x * dt;
      p.y += ion.v.y * dt;
      p.z += ion.v.z * dt;
      var r = Math.hypot(p.x, p.z);
      if (r > rMax) {
        var nx = p.x / r, nz = p.z / r;
        p.x = nx * rMax; p.z = nz * rMax;
        var vn = ion.v.x * nx + ion.v.z * nz;
        ion.v.x -= 1.5 * vn * nx; ion.v.z -= 1.5 * vn * nz;
      }
      if (p.y < yMin) { p.y = yMin; ion.v.y = Math.abs(ion.v.y) * 0.6; }
      if (p.y > yMax) { p.y = yMax; ion.v.y = -Math.abs(ion.v.y) * 0.6; }
      ion.v.x += Math.sin(time * 0.9 + ion.phase) * dt * 0.05;
      ion.v.z += Math.cos(time * 0.8 + ion.phase) * dt * 0.05;
    }

    dead.forEach(function (pair) {
      var a = pair.ion, b = pair.other;
      if (!b || b._dead) return;
      a._dead = true; b._dead = true;
      var mid = a.mesh.position.clone().add(b.mesh.position).multiplyScalar(0.5);
      flash(mid, 0xA8E6DA);
      addWater(mid);
      killIon(a); killIon(b);
    });
  }

  function updateEffects(dt) {
    for (var i = effects.length - 1; i >= 0; i--) {
      var e = effects[i];
      e.t += dt;
      if (e.type === 'flash') {
        var k = Math.min(1, e.t / 0.5);
        e.obj.scale.setScalar(0.3 + k * 1.5);
        e.obj.material.opacity = (1 - k) * 0.85;
        if (k >= 1) { scene.remove(e.obj); effects.splice(i, 1); }
      } else {
        var kk = Math.min(1, e.t / 0.9);
        e.obj.scale.setScalar(1 + kk * 3.2);
        e.obj.material.opacity = (1 - kk) * 0.6;
        if (kk >= 1) { scene.remove(e.obj); effects.splice(i, 1); }
      }
    }
    for (var j = waters.length - 1; j >= 0; j--) {
      waters[j].rotation.y += dt * 0.6;
      waters[j].position.y += dt * 0.03;
    }
  }

  /* ---------------- pH ---------------- */
  function phOf(V) {
    var nH = 5 - 0.1 * V;
    var Vtot = 50 + V;
    if (Math.abs(nH) < 1e-9) return 7;
    if (nH > 0) return C.clamp(-Math.log10(nH / Vtot), 0.3, 13.7);
    return C.clamp(14 + Math.log10(-nH / Vtot), 0.3, 13.7);
  }

  function natureOf(ph) {
    if (ph < 3) return [T('强酸性'), 'is-acid'];
    if (ph < 6.5) return [T('弱酸性'), 'is-acid'];
    if (ph <= 7.5) return [T('中性'), 'is-neutral'];
    if (ph <= 11) return [T('弱碱性'), 'is-base'];
    return [T('强碱性'), 'is-base'];
  }

  function liquidColor(ph) {
    if (state.indicator === 'phen') {
      return ph >= 8.2 ? { c: 0xD9738C, o: 0.38 } : { c: 0x9FC4C8, o: 0.2 };
    }
    if (state.indicator === 'litmus') {
      if (ph < 5) return { c: 0xB85A3A, o: 0.34 };
      if (ph > 8) return { c: 0x3E6FA0, o: 0.36 };
      return { c: 0x7A6FA0, o: 0.28 };
    }
    return { c: 0x9FC4C8, o: 0.18 };
  }

  /* ---------------- 界面 ---------------- */
  function cacheEls() {
    els.ph = document.getElementById('ph-value');
    els.nature = document.getElementById('ph-nature');
    els.out = document.getElementById('naoh-out');
    els.vol = document.getElementById('neut-volume');
    els.note = document.getElementById('tit-eq-note');
    els.range = document.getElementById('naoh-range');
    els.auto = document.getElementById('btn-titrate');
    els.reset = document.getElementById('btn-neut-reset');
    els.select = document.getElementById('indicator-select');
  }

  function refreshUI(force) {
    var ph = phOf(state.V);
    var key = ph.toFixed(2) + '|' + state.indicator + '|' + I18N.lang;
    if (key === lastUI && !force) return;
    lastUI = key;

    els.ph.textContent = ph.toFixed(2);
    var nt = natureOf(ph);
    els.nature.textContent = nt[0];
    els.nature.className = 'ph-nature ' + nt[1];
    els.out.textContent = state.V.toFixed(1) + ' mL';
    els.vol.textContent = (50 + state.V).toFixed(1) + ' mL';

    if (state.V < 49.4) {
      els.note.textContent = T('盐酸过量，溶液中还有未被消耗的 H⁺，滴入的 OH⁻ 一进入就被中和。');
    } else if (state.V <= 50.6) {
      els.note.textContent = T('恰好完全反应：H⁺ 与 OH⁻ 按 1 : 1 全部结合成水，溶液中的溶质是 NaCl。');
    } else {
      els.note.textContent = T('氢氧化钠过量，溶液中 OH⁻ 增多，溶液由酸性变为碱性。');
    }

    var lc = liquidColor(ph);
    beaker.liquidMat.color.lerp(new THREE.Color(lc.c), 0.5);
    beaker.liquidMat.emissive.lerp(new THREE.Color(lc.c), 0.5);
    beaker.liquidMat.emissiveIntensity = lc.o > 0.3 ? 0.24 : 0.1;
    beaker.liquidMat.opacity += (lc.o - beaker.liquidMat.opacity) * 0.2;

    var h = Math.max(0.12, 1.95 * (1 - state.V / 100));
    buretteLiquid.scale.y = h / 1.95;
    buretteLiquid.position.y = 3.23 - h / 2;
  }

  /* ---------------- pH 曲线 ---------------- */
  function drawCurve() {
    if (!cctx) return;
    var w = curveCanvas.clientWidth, h = curveCanvas.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    curveCanvas.width = Math.round(w * dpr);
    curveCanvas.height = Math.round(h * dpr);
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cctx.clearRect(0, 0, w, h);

    var pad = { l: 24, r: 8, t: 10, b: 16 };
    var X = function (v) { return pad.l + (v / 100) * (w - pad.l - pad.r); };
    var Y = function (p) { return pad.t + (1 - p / 14) * (h - pad.t - pad.b); };

    cctx.save();
    cctx.strokeStyle = 'rgba(23,27,29,.10)';
    cctx.lineWidth = 1;
    [0, 7, 14].forEach(function (p) {
      cctx.beginPath(); cctx.moveTo(pad.l, Y(p)); cctx.lineTo(w - pad.r, Y(p)); cctx.stroke();
      cctx.fillStyle = '#8D9698';
      cctx.font = '8px ui-monospace,Menlo,monospace';
      cctx.textAlign = 'right';
      cctx.fillText(String(p), pad.l - 5, Y(p) + 3);
    });
    [0, 50, 100].forEach(function (v) {
      cctx.beginPath(); cctx.moveTo(X(v), pad.t); cctx.lineTo(X(v), h - pad.b); cctx.stroke();
      cctx.fillStyle = '#8D9698';
      cctx.textAlign = 'center';
      cctx.fillText(String(v), X(v), h - 4);
    });

    cctx.beginPath();
    for (var v = 0; v <= 100; v += 0.4) {
      var p = phOf(v);
      if (v === 0) cctx.moveTo(X(v), Y(p)); else cctx.lineTo(X(v), Y(p));
    }
    cctx.strokeStyle = '#2C6C92';
    cctx.lineWidth = 1.5;
    cctx.lineJoin = 'round';
    cctx.stroke();

    cctx.setLineDash([2, 3]);
    cctx.strokeStyle = 'rgba(14,122,87,.45)';
    cctx.beginPath(); cctx.moveTo(X(50), pad.t); cctx.lineTo(X(50), h - pad.b); cctx.stroke();
    cctx.setLineDash([]);

    var cp = phOf(state.V);
    cctx.beginPath();
    cctx.arc(X(state.V), Y(cp), 3.6, 0, Math.PI * 2);
    cctx.fillStyle = '#0E7A57';
    cctx.fill();
    cctx.strokeStyle = '#fff';
    cctx.lineWidth = 1.5;
    cctx.stroke();
    cctx.restore();
  }

  /* ---------------- 交互 ---------------- */
  function wire() {
    els.range.addEventListener('input', function () {
      state.V = +els.range.value;
      syncUnits();
      refreshUI(true);
      drawCurve();
    });

    els.auto.addEventListener('click', function () {
      state.auto = !state.auto;
      els.auto.textContent = state.auto ? T('暂停滴加') : T('自动滴加');
      els.auto.classList.toggle('btn--primary', !state.auto);
      if (state.auto && state.V >= 100) {
        state.V = 0;
        els.range.value = 0;
        rebuild();
      }
    });

    els.reset.addEventListener('click', function () {
      state.V = 0;
      state.auto = false;
      els.auto.textContent = T('自动滴加');
      els.auto.classList.add('btn--primary');
      els.range.value = 0;
      rebuild();
      refreshUI(true);
      drawCurve();
    });

    els.select.addEventListener('change', function () {
      state.indicator = els.select.value;
      refreshUI(true);
    });

    var vp = document.querySelector('[data-view="neutralize"] .viewport');
    if (vp) {
      vp.addEventListener('pointermove', function (e) {
        var r = vp.getBoundingClientRect();
        trx = ((e.clientX - r.left) / r.width - 0.5) * 0.18;
        try_ = ((e.clientY - r.top) / r.height - 0.5) * 0.06;
      });
      vp.addEventListener('pointerleave', function () { trx = 0; try_ = 0; });
    }

    curveCanvas = document.getElementById('ph-curve');
    cctx = curveCanvas && curveCanvas.getContext('2d');
    if (window.ResizeObserver && curveCanvas) new ResizeObserver(drawCurve).observe(curveCanvas);

    I18N.on(function () {
      if (!els.ph) return;
      els.auto.textContent = state.auto ? T('暂停滴加') : T('自动滴加');
      refreshUI(true);
      drawCurve();
    });
  }

  /* ---------------- 循环 ---------------- */
  function frame(dt, time) {
    if (state.auto) {
      var speed = state.V < 48 ? 9 : state.V < 52 ? 2.2 : 9;
      state.V = Math.min(100, state.V + dt * speed);
      els.range.value = state.V;
      syncUnits();
      if (state.V >= 100) {
        state.auto = false;
        els.auto.textContent = T('自动滴加');
        els.auto.classList.add('btn--primary');
      }
      refreshUI();
      drawCurve();
    }

    rx += (trx - rx) * 0.05;
    ry += (try_ - ry) * 0.05;
    beaker.group.rotation.y = rx * 0.5;
    burette.rotation.y = rx * 0.5;
    burette.rotation.x = ry * 0.3;
    beaker.group.rotation.x = ry * 0.3;

    updateIons(dt, time);
    updateEffects(dt);
    stage.renderer.render(scene, stage.camera);
  }

  window.VIEWS.neutralize = {
    init: init,
    enter: function () {
      if (!ticker) return;
      ticker.start();
      refreshUI(true);
      requestAnimationFrame(drawCurve);
    },
    leave: function () { if (ticker) ticker.stop(); }
  };
})();
