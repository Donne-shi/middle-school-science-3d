/* ==========================================================================
   v-solution.js — 溶液：溶解与饱和实验台
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;
  if (!C || !window.THREE) return;

  var state, stage, beaker, world, sub;
  var yMin, yMax, rMax, crystalY;
  var waters = [], ions = [], lattice = [], crystalGroup;
  var ionGeo, crystalGeo, ionMats, crystalMats, haloMats;
  var els = {}, ticker, rig;
  var rotX = 0, rotY = 0, tRotX = 0, tRotY = 0;
  var lastHud = '';

  var DEFAULTS = { KNO3: 45, NaCl: 45, CaOH2: 2.0 };

  function subName() { return I18N.isEN ? sub.en : sub.zh; }

  function init() {
    var canvas = document.getElementById('dissolve-canvas');
    if (!canvas) return;
    stage = C.stage(canvas, { fov: 34, position: [0, 1.2, 7.7], target: [0, -0.02, 0] });
    if (!stage) return;

    beaker = C.buildBeaker({ radius: 1.5, height: 3.5, liquidHeight: 2.32 });
    world = beaker.group;
    stage.scene.add(world);

    yMin = beaker.bottomY + 0.42;
    yMax = beaker.liquidTop - 0.26;
    rMax = 1.28;
    crystalY = beaker.bottomY + 0.4;

    state = { sub: 'KNO3', temp: 20, added: 45, dissolved: 0, left: 0, stir: false };
    sub = C.SOL[state.sub];

    ionGeo = new THREE.SphereGeometry(C.ION_R, 18, 14);
    crystalGeo = new THREE.SphereGeometry(C.CRYSTAL_R, 16, 14);
    ionMats = [C.glowMat(sub.ionA.color, 0.16), C.glowMat(sub.ionB.color, 0.16)];
    crystalMats = [C.glowMat(sub.ionA.color, 0.04), C.glowMat(sub.ionB.color, 0.04)];
    crystalMats.forEach(function (m) {
      m.roughness = 0.55;
      m.color.multiplyScalar(0.72);
    });
    haloMats = [0, 1].map(function (i) {
      return new THREE.SpriteMaterial({
        map: C.haloTex(), color: i ? sub.ionB.color : sub.ionA.color,
        transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false
      });
    });

    buildWaters();
    buildCrystal();
    cacheEls();
    wire();
    paintLegend();
    setSubstance('KNO3');

    ticker = C.ticker(function (dt, time) { frame(dt, time); });
  }

  /* ---------------- 水分子 ---------------- */
  function buildWaters() {
    for (var i = 0; i < 16; i++) {
      var w = C.waterMolecule(C.rand(0.52, 0.78));
      var ang = C.rand(0, Math.PI * 2), rad = C.rand(0.2, 1.15);
      w.position.set(Math.cos(ang) * rad, C.rand(yMin + 0.15, yMax), Math.sin(ang) * rad);
      w.rotation.set(C.rand(0, 3), C.rand(0, 3), C.rand(0, 3));
      w.userData.spin = new THREE.Vector3(C.rand(-0.35, 0.35), C.rand(-0.35, 0.35), C.rand(-0.35, 0.35));
      w.userData.phase = C.rand(0, 6.28);
      w.userData.base = w.position.clone();
      world.add(w);
      waters.push(w);
    }
  }

  /* ---------------- 晶体 ---------------- */
  function buildCrystal() {
    crystalGroup = new THREE.Group();
    var n = 3, step = C.CRYSTAL_STEP;
    for (var ix = 0; ix < n; ix++) {
      for (var iy = 0; iy < n; iy++) {
        for (var iz = 0; iz < n; iz++) {
          var mesh = new THREE.Mesh(crystalGeo, crystalMats[(ix + iy + iz) % 2]);
          var px = (ix - (n - 1) / 2) * step, py = (iy - (n - 1) / 2) * step, pz = (iz - (n - 1) / 2) * step;
          mesh.position.set(px, py, pz);
          crystalGroup.add(mesh);
          lattice.push({ mesh: mesh, d: Math.sqrt(px * px + py * py + pz * pz) });
        }
      }
    }
    lattice.sort(function (a, b) { return a.d - b.d; });
    crystalGroup.position.set(0, crystalY, 0.38);
    world.add(crystalGroup);
  }

  /* ---------------- 离子 ---------------- */
  var lastSpawn = 0;

  function spawnIon(kind, from, to, dur) {
    var mesh = new THREE.Mesh(ionGeo, ionMats[kind]);
    var halo = new THREE.Sprite(haloMats[kind]);
    halo.scale.set(0.46, 0.46, 1);
    mesh.add(halo);
    mesh.position.copy(from);
    world.add(mesh);
    var ion = {
      kind: kind, mesh: mesh,
      v: new THREE.Vector3(C.rand(-0.24, 0.24), C.rand(-0.14, 0.14), C.rand(-0.24, 0.24)),
      state: 'fly', t: 0, dur: dur || 0.85,
      from: from.clone(), to: to.clone()
    };
    ions.push(ion);
    return ion;
  }

  function removeIon(ion) {
    var idx = ions.indexOf(ion);
    if (idx >= 0) ions.splice(idx, 1);
    world.remove(ion.mesh);
  }

  function freeTarget() {
    var ang = C.rand(0, Math.PI * 2), rad = C.rand(0.2, rMax - 0.14);
    return new THREE.Vector3(Math.cos(ang) * rad, C.rand(yMin + 0.1, yMax), Math.sin(ang) * rad);
  }

  function targetPairs() {
    if (state.dissolved <= 0.01) return 0;
    var p = Math.round(state.dissolved / 3);
    return C.clamp(Math.max(p, 1), 0, 22);
  }

  function prefill() {
    var want = targetPairs();
    for (var i = 0; i < want; i++) {
      var a = spawnIon(0, freeTarget(), freeTarget(), 0.01);
      a.state = 'free'; a.mesh.position.copy(a.to);
      var b = spawnIon(1, freeTarget(), freeTarget(), 0.01);
      b.state = 'free'; b.mesh.position.copy(b.to);
    }
  }

  function reconcile(dt, time) {
    var want = targetPairs();
    var active = 0, freeList = [];
    for (var i = 0; i < ions.length; i++) {
      if (ions[i].state !== 'return') active++;
      if (ions[i].state === 'free') freeList.push(ions[i]);
    }
    var pairs = Math.floor(active / 2);
    if (pairs < want && time - lastSpawn > 0.14) {
      var f = new THREE.Vector3(0, crystalY, 0);
      spawnIon(0, f, freeTarget(), 0.8);
      spawnIon(1, f.clone().add(new THREE.Vector3(0, 0.05, 0)), freeTarget(), 0.9);
      lastSpawn = time;
    } else if (pairs > want) {
      var need = Math.min((pairs - want) * 2, freeList.length);
      for (var k = 0; k < need; k++) {
        var pick = freeList[k];
        pick.state = 'return';
        pick.t = 0;
        pick.dur = 0.55;
        pick.from.copy(pick.mesh.position);
      }
    }
  }

  /* ---------------- 更新 ---------------- */
  function updateIons(dt) {
    for (var i = ions.length - 1; i >= 0; i--) {
      var ion = ions[i];
      var p = ion.mesh.position;

      if (ion.state === 'fly' || ion.state === 'return') {
        ion.t += dt / ion.dur;
        var k = C.smooth(Math.min(1, ion.t));
        if (ion.state === 'fly') {
          p.lerpVectors(ion.from, ion.to, k);
          p.y += Math.sin(k * Math.PI) * 0.22;
        } else {
          p.lerpVectors(ion.from, new THREE.Vector3(0, crystalY, 0), k);
          ion.mesh.scale.setScalar(1 - 0.65 * k);
        }
        if (ion.t >= 1) {
          if (ion.state === 'return') { removeIon(ion); continue; }
          ion.state = 'free';
          ion.mesh.scale.setScalar(1);
        }
        continue;
      }

      var speed = state.stir ? 2.1 : 1;
      p.x += ion.v.x * dt * speed;
      p.y += ion.v.y * dt * speed;
      p.z += ion.v.z * dt * speed;

      if (state.stir) {
        var tx = -p.z, tz = p.x;
        var len = Math.hypot(tx, tz) || 1;
        ion.v.x += (tx / len) * dt * 1.5;
        ion.v.z += (tz / len) * dt * 1.5;
      }

      var r = Math.hypot(p.x, p.z);
      if (r > rMax) {
        var nx = p.x / r, nz = p.z / r;
        p.x = nx * rMax; p.z = nz * rMax;
        var vn = ion.v.x * nx + ion.v.z * nz;
        ion.v.x -= 1.6 * vn * nx; ion.v.z -= 1.6 * vn * nz;
      }
      if (p.y < yMin) { p.y = yMin; ion.v.y = Math.abs(ion.v.y) * 0.7; }
      if (p.y > yMax) { p.y = yMax; ion.v.y = -Math.abs(ion.v.y) * 0.7; }

      var damp = state.stir ? 0.4 : 0.18;
      ion.v.x *= (1 - damp * dt * 4);
      ion.v.z *= (1 - damp * dt * 4);
      if (ion.v.length() < 0.06) {
        ion.v.x += C.rand(-0.05, 0.05);
        ion.v.z += C.rand(-0.05, 0.05);
      }
    }
  }

  function updateCrystal(dt, time) {
    var frac = state.added > 0 ? C.clamp(state.left / state.added, 0, 1) : 0;
    var count = Math.ceil(frac * lattice.length);
    if (state.left < 0.03) count = 0;
    for (var i = 0; i < lattice.length; i++) lattice[i].mesh.visible = i < count;
    crystalGroup.visible = count > 0;
    if (count > 0) {
      crystalGroup.position.y = crystalY + Math.sin(time * 1.6) * 0.004;
      crystalGroup.rotation.y = Math.sin(time * 0.25) * 0.06;
    }
  }

  function updateWaters(dt, time) {
    for (var i = 0; i < waters.length; i++) {
      var w = waters[i], u = w.userData;
      w.rotation.x += u.spin.x * dt;
      w.rotation.y += u.spin.y * dt;
      var drift = state.stir ? 0.14 : 0.05;
      w.position.x = u.base.x + Math.sin(time * 0.7 + u.phase) * drift;
      w.position.y = u.base.y + Math.cos(time * 0.55 + u.phase) * drift * 0.7;
      w.position.z = u.base.z + Math.sin(time * 0.63 + u.phase * 1.7) * drift;
    }
  }

  /* ---------------- HUD ---------------- */
  function cacheEls() {
    els.state = document.getElementById('dissolve-state');
    els.sol = document.getElementById('ro-sol');
    els.added = document.getElementById('ro-added');
    els.dis = document.getElementById('ro-dissolved');
    els.left = document.getElementById('ro-left');
    els.frac = document.getElementById('ro-frac');
    els.note = document.getElementById('dissolve-note');
    els.temp = document.getElementById('temp-out');
  }

  function compute() {
    var S = C.solAt(state.sub, state.temp);
    state.dissolved = Math.min(state.added, S);
    state.left = Math.max(0, state.added - S);
    return S;
  }

  function syncHud(force) {
    var S = compute();
    var key = [state.sub, state.temp, state.added, I18N.lang].join('|');
    if (key === lastHud && !force) return;
    lastHud = key;

    var dp = S < 1 ? 3 : 1;
    els.sol.textContent = C.fmt(S, dp) + ' g';
    els.added.textContent = C.fmt(state.added, 1) + ' g';
    els.dis.textContent = C.fmt(state.dissolved, dp) + ' g';
    els.left.textContent = C.fmt(state.left, state.left < 1 ? 3 : 1) + ' g';
    els.frac.textContent = C.fmt(state.dissolved / (state.dissolved + 100) * 100, 1) + ' %';
    els.temp.textContent = state.temp + ' °C';

    var full = state.left > 0.04;
    var exact = !full && Math.abs(state.added - S) < 0.3;
    els.state.classList.remove('is-warn', 'is-ok');
    if (full) {
      els.state.textContent = T('饱和溶液 · 有剩余固体');
      els.state.classList.add('is-warn');
      els.note.textContent = T('杯底还剩 {n} g 未溶解的{x}。升温或加溶剂，它才可能继续溶解。', {
        n: C.fmt(state.left, state.left < 1 ? 3 : 1), x: subName()
      });
    } else if (exact) {
      els.state.textContent = T('恰好饱和');
      els.state.classList.add('is-ok');
      els.note.textContent = T('恰好达到饱和：再加一点点{x}，就会有固体沉在杯底。', { x: subName() });
    } else {
      els.state.textContent = T('不饱和溶液');
      els.note.textContent = T('还能继续溶解。目前的{x}全部溶入水中，再加一些也会继续消失。', { x: subName() });
    }
  }

  /* ---------------- 图例 ---------------- */
  function paintLegend() {
    var set = function (id, kind, color) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = C.icon(kind, color, 1);
    };
    set('legend-crystal', 'crystal', sub.css);
    set('legend-a-dot', 'ion', sub.ionA.css);
    set('legend-b-dot', 'ion', sub.ionB.css);
    set('legend-water', 'water');
    var a = document.getElementById('legend-a-text');
    var b = document.getElementById('legend-b-text');
    if (a) a.textContent = sub.ionA.label;
    if (b) b.textContent = sub.ionB.label;
  }

  /* ---------------- 交互 ---------------- */
  function setSubstance(key) {
    state.sub = key;
    sub = C.SOL[key];
    state.added = DEFAULTS[key];

    ionMats[0].color.setHex(sub.ionA.color); ionMats[0].emissive.setHex(sub.ionA.color);
    ionMats[1].color.setHex(sub.ionB.color); ionMats[1].emissive.setHex(sub.ionB.color);
    crystalMats[0].color.setHex(sub.ionA.color).multiplyScalar(0.72);
    crystalMats[0].emissive.setHex(sub.ionA.color);
    crystalMats[1].color.setHex(sub.ionB.color).multiplyScalar(0.72);
    crystalMats[1].emissive.setHex(sub.ionB.color);
    haloMats[0].color.setHex(sub.ionA.color);
    haloMats[1].color.setHex(sub.ionB.color);
    beaker.liquidMat.color.setHex(0x2F8FA6).lerp(new THREE.Color(sub.color), 0.12);

    paintLegend();
    document.querySelectorAll('#sol-tabs button').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.dataset.sub === key));
    });

    ions.slice().forEach(removeIon);
    lattice.forEach(function (l) { l.mesh.visible = true; });
    compute();
    prefill();
    syncHud(true);
  }

  function wire() {
    document.querySelectorAll('#sol-tabs button').forEach(function (btn) {
      btn.addEventListener('click', function () { setSubstance(btn.dataset.sub); });
    });
    var tempRange = document.getElementById('temp-range');
    tempRange.addEventListener('input', function () {
      state.temp = +tempRange.value;
      syncHud();
    });
    document.getElementById('btn-add').addEventListener('click', function () {
      state.added = Math.min(state.added + 10, 70);
      syncHud();
    });
    var stir = document.getElementById('btn-stir');
    stir.addEventListener('click', function () {
      state.stir = !state.stir;
      stir.setAttribute('aria-pressed', String(state.stir));
      stir.classList.toggle('btn--primary', state.stir);
    });
    document.getElementById('btn-reset').addEventListener('click', function () {
      state.temp = 20;
      tempRange.value = 20;
      state.stir = false;
      document.getElementById('btn-stir').classList.remove('btn--primary');
      setSubstance('KNO3');
    });

    var vp = document.querySelector('[data-view="solution"] .viewport');
    if (vp) {
      vp.addEventListener('pointermove', function (e) {
        var r = vp.getBoundingClientRect();
        tRotY = ((e.clientX - r.left) / r.width - 0.5) * 0.24;
        tRotX = ((e.clientY - r.top) / r.height - 0.5) * 0.10;
      });
      vp.addEventListener('pointerleave', function () { tRotX = 0; tRotY = 0; });
    }

    I18N.on(function () { if (sub) syncHud(true); });
  }

  /* ---------------- 循环 ---------------- */
  function frame(dt, time) {
    rotY += (tRotY - rotY) * 0.05;
    rotX += (tRotX - rotX) * 0.05;
    world.rotation.y = rotY;
    world.rotation.x = rotX * 0.5;
    updateWaters(dt, time);
    reconcile(dt, time);
    updateIons(dt);
    updateCrystal(dt, time);
    stage.renderer.render(stage.scene, stage.camera);
  }

  window.VIEWS.solution = {
    init: init,
    enter: function () { if (ticker) { ticker.start(); syncHud(true); } },
    leave: function () { if (ticker) ticker.stop(); }
  };
})();
