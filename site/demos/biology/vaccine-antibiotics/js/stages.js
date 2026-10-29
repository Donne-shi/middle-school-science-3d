/* =============================================================================
   疫苗与抗生素 · 场景脚本
   stages.js — 九章三维演示与互动
   ========================================================================== */
window.STAGES = (function () {
  "use strict";

  var C = window.CONTENT;

  /* ------------------------------------------------------------ 工具 --- */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutBack(t) { var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

  var STAGES = {};

  /* ==========================================================================
     00 · 序章
     ========================================================================== */
  STAGES.intro = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var dust = make.dust(420, 11, 0x6FA8B4, 0.038);
    root.add(dust);

    var virus = make.virus({ radius: 1.08, spikes: 34, color: PAL.path });
    virus.position.set(-1.85, 0.3, 0.1);
    root.add(virus);

    var bact = make.bacterium({ radius: 0.6, length: 1.9, color: 0x3E8F86, flagella: 3, wallOpacity: 0.09, wallColor: 0x8FBDB4, wallEi: 0.12 });
    bact.position.set(2.18, -0.28, -0.1);
    bact.rotation.y = Math.PI + 0.42;
    bact.scale.setScalar(0.92);
    root.add(bact);

    var haloV = make.halo(PAL.path, 5.2, 0.18);
    haloV.position.copy(virus.position);
    root.add(haloV);

    var haloB = make.halo(PAL.abx, 4.4, 0.12);
    haloB.position.copy(bact.position);
    root.add(haloB);

    var t0 = 0;
    return {
      camera: { theta: -0.1, phi: 1.42, radius: 14.2, target: new T.Vector3(-1.98, 0, 0) },
      limits: [8, 22],
      duration: 0,
      update: function (dt, t) {
        t0 += dt;
        virus.rotation.y = t0 * 0.22;
        virus.rotation.x = Math.sin(t0 * 0.3) * 0.12;
        virus.position.y = 0.34 + Math.sin(t0 * 0.55) * 0.09;

        bact.rotation.y = Math.PI + 0.42 + Math.sin(t0 * 0.32) * 0.2;
        bact.position.y = -0.3 + Math.sin(t0 * 0.45 + 1.2) * 0.07;

        var f = bact.userData.parts.flagella;
        if (f) f.rotation.x = t0 * 3.4;

        dust.rotation.y = t0 * 0.035;
        dust.rotation.x = Math.sin(t0 * 0.12) * 0.1;

        haloV.material.opacity = 0.13 + Math.sin(t0 * 1.1) * 0.05;
        haloB.material.opacity = 0.09 + Math.sin(t0 * 1.1 + 2) * 0.035;
      }
    };
  };

  /* ==========================================================================
     01 · 认清敌人（解剖病毒与细菌）
     ========================================================================== */
  STAGES.targets = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var dust = make.dust(300, 12, 0x5E93A0, 0.032);
    root.add(dust);

    /* --- 病毒 --- */
    var VIRUS_POS = new T.Vector3(-1.78, 0.1, 0);
    var virus = make.virus({ radius: 1.02, spikes: 32, color: PAL.path });
    virus.position.copy(VIRUS_POS);
    root.add(virus);

    var haloV = make.halo(PAL.path, 4.6, 0.16);
    haloV.position.copy(VIRUS_POS);
    root.add(haloV);

    /* --- 细菌 --- */
    var BACT_POS = new T.Vector3(1.72, -0.08, 0);
    var bact = make.bacterium({ radius: 0.62, length: 2.0, color: 0x3E8F86, flagella: 3, wallOpacity: 0.1, wallColor: 0x8FBDB4, wallEi: 0.14 });
    bact.position.copy(BACT_POS);
    bact.rotation.y = Math.PI - 0.2;
    root.add(bact);

    var haloB = make.halo(PAL.abx, 4.2, 0.12);
    haloB.position.copy(BACT_POS);
    root.add(haloB);

    /* --- 标注 --- */
    var vm = {};
    function vLocal(x, y, z) {
      var v = new T.Vector3(x, y, z).normalize().multiplyScalar(1.0);
      return function () { return virus.localToWorld(v.clone()); };
    }
    var virusMarks = [
      { id: "spike", dir: [0.86, 0.42, 0.3], side: "right" },
      { id: "envelope", dir: [-0.9, 0.24, 0.36], side: "left" },
      { id: "capsid", dir: [0.3, -0.8, 0.52], side: "right" },
      { id: "genome", point: [-0.42, -0.42, 0.22], side: "left" }
    ];

    virusMarks.forEach(function (mm) {
      var part = C.virusParts.filter(function (x) { return x.id === mm.id; })[0];
      if (!part) return;
      var local = mm.point
        ? new T.Vector3(mm.point[0], mm.point[1], mm.point[2])
        : new T.Vector3(mm.dir[0], mm.dir[1], mm.dir[2]).normalize().multiplyScalar(1.04);
      vm[mm.id] = api.mark({
        id: mm.id,
        label: part.zh,
        tone: "path",
        side: mm.side,
        center: mm.point ? null : virus.position,
        pos: function () { return virus.localToWorld(local.clone()); },
        onClick: function (id) { select(id); }
      });
    });

    var bm = {};
    var bactMarks = [
      { id: "wall", p: [0.42, 0.74, 0.2], side: "right" },
      { id: "membrane", p: [-0.55, -0.8, 0.24], side: "left" },
      { id: "ribosome", p: [0.9, 0.26, 0.4], side: "right" },
      { id: "nucleoid", p: [-0.95, -0.22, 0.3], side: "left" },
      { id: "plasmid", p: [-1.28, 0.44, 0.22], side: "left" },
      { id: "flagellum", p: [-2.3, 0.16, 0], side: "left" }
    ];
    bactMarks.forEach(function (mm) {
      var part = C.bacteriaParts.filter(function (x) { return x.id === mm.id; })[0];
      if (!part) return;
      var local = new T.Vector3(mm.p[0], mm.p[1], mm.p[2]);
      bm[mm.id] = api.mark({
        id: mm.id,
        label: part.zh,
        tone: "abx",
        side: mm.side,
        pos: function () { return bact.localToWorld(local.clone()); },
        onClick: function (id) { select(id); }
      });
    });

    var allParts = C.virusParts.concat(C.bacteriaParts);
    var selected = null;

    function select(id) {
      selected = id;
      api.E.selectMark(id);
      var part = allParts.filter(function (x) { return x.id === id; })[0];
      if (!part) return;

      // 高亮目标结构
      var isVirus = C.virusParts.some(function (x) { return x.id === id; });
      if (isVirus) {
        virus.scale.setScalar(1.06);
        haloV.material.opacity = 0.36;
        haloB.material.opacity = 0.06;
      } else {
        bact.scale.setScalar(1.06);
        haloB.material.opacity = 0.34;
        haloV.material.opacity = 0.06;
      }
      api.E.emitCard(part, isVirus ? "path" : "abx");
    }

    /* --- 解剖模式 --- */
    var anatomy = false;
    var morph = 0, morphT = 0;

    api.E.onAction = function (act) {
      if (act === "anatomy") {
        anatomy = !anatomy;
        morphT = anatomy ? 1 : 0;
        return anatomy;
      }
      if (act === "reset") {
        selected = null;
        api.E.selectMark(null);
        api.E.hideCard();
        virus.scale.setScalar(1);
        bact.scale.setScalar(1);
        haloV.material.opacity = 0.16;
        haloB.material.opacity = 0.12;
        return;
      }
    };

    return {
      camera: { theta: 0.0, phi: 1.44, radius: 15.2, target: new T.Vector3(-1.72, 0.04, 0) },
      limits: [8, 20],
      duration: 0,
      update: function (dt, t) {
        virus.rotation.y = t * 0.06;
        dust.rotation.y = t * 0.02;

        var f = bact.userData.parts.flagella;
        if (f) f.rotation.x = t * 2.6;

        morph += (morphT - morph) * Math.min(1, dt * 4);
        var wm = bact.userData.parts;
        if (wm.wallMat) wm.wallMat.opacity = lerp(0.16, 0.42, morph);
        if (wm.net && wm.net.material) wm.net.material.opacity = lerp(0.1, 0.22, morph);

        haloV.material.opacity = lerp(haloV.material.opacity, selected ? (C.virusParts.some(function (x) { return x.id === selected; }) ? 0.34 : 0.08) : 0.16 + Math.sin(t * 1.1) * 0.04, 0.06);
        haloB.material.opacity = lerp(haloB.material.opacity, selected ? (C.bacteriaParts.some(function (x) { return x.id === selected; }) ? 0.32 : 0.06) : 0.11 + Math.sin(t * 1.1 + 2) * 0.03, 0.06);
      },
      onEmpty: function () {
        selected = null;
        api.E.selectMark(null);
        api.E.hideCard();
        virus.scale.setScalar(1);
        bact.scale.setScalar(1);
      }
    };
  };

  /* ==========================================================================
     02 · 免疫演习
     ========================================================================== */
  STAGES.train = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var dust = make.dust(380, 10, 0x6FA8B4, 0.035);
    root.add(dust);

    var R = 1.02;
    var center = make.bcell(R, { receptors: 13 });
    root.add(center);

    var halo = make.halo(PAL.vac, 4.4, 0.14);
    root.add(halo);

    // 克隆子代
    var CLONES = 6;
    var clones = [];
    for (var i = 0; i < CLONES; i++) {
      var ang = (i / CLONES) * Math.PI * 2 - Math.PI / 2;
      var b = make.bcell(R * 0.8, { receptors: 8, color: 0x2E7C74 });
      b.visible = false;
      b.userData.home = new T.Vector3(Math.cos(ang) * 2.68, Math.sin(ang) * 1.58, Math.sin(ang * 1.6) * 0.9);
      root.add(b);
      clones.push(b);
    }

    // 抗原
    var antigens = [];
    var dock = [
      new T.Vector3(-1.18, 0.72, 0.32),
      new T.Vector3(1.12, -0.6, 0.42),
      new T.Vector3(0.2, 1.12, -0.55)
    ];
    for (var k = 0; k < 3; k++) {
      var v = make.virus({ radius: 0.23, spikes: 14, color: PAL.path });
      v.userData.dock = dock[k];
      v.userData.spawn = dock[k].clone().normalize().multiplyScalar(9.5).add(new T.Vector3(0, (k - 1) * 1.2, 2.5));
      v.userData.spin = Math.random() * 6;
      root.add(v);
      antigens.push(v);
    }

    // 抗体
    var ABS = 34;
    var antibodies = [];
    var abMat = PAL.vac;
    for (var a = 0; a < ABS; a++) {
      var ab = make.antibody(0.155, a % 3 === 0 ? PAL.vac : abMat);
      var src = Math.random() < 0.45 ? new T.Vector3(0, 0, 0) : clones[a % CLONES].userData.home.clone();
      var dirA = new T.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      var anti = antigens[a % 3];
      ab.userData.src = src.clone();
      ab.userData.mid = src.clone().add(dirA.multiplyScalar(1.6 + Math.random() * 1.9));
      ab.userData.end = anti.userData.dock.clone().add(
        new T.Vector3((Math.random() - 0.5) * 0.34, (Math.random() - 0.5) * 0.34, (Math.random() - 0.5) * 0.34)
      );
      ab.userData.rot = new T.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      ab.visible = false;
      root.add(ab);
      antibodies.push(ab);
    }

    var p = 0;

    function apply(pr) {
      p = pr;

      /* 抗原飞行 */
      var tIn = seg(pr, 0.0, 0.36);
      antigens.forEach(function (v, i) {
        var localT = clamp((tIn - i * 0.08) / 0.78, 0, 1);
        var e = easeOut(localT);
        v.position.lerpVectors(v.userData.spawn, v.userData.dock, e);
        v.scale.setScalar(0.55 + 0.45 * e);
        v.rotation.y = v.userData.spin + pr * 4;
      });

      /* 识别：中心细胞脉动 */
      var tRec = seg(pr, 0.2, 0.42);
      var pulse = 1 + Math.sin(tRec * Math.PI) * 0.07;
      center.scale.setScalar(pulse);
      halo.material.opacity = 0.1 + tRec * 0.34;

      /* 克隆扩增 */
      var tClone = seg(pr, 0.4, 0.66);
      clones.forEach(function (b, i) {
        var localT = clamp((tClone - i * 0.09) / 0.55, 0, 1);
        b.visible = localT > 0.001;
        if (!b.visible) return;
        var e = easeOutBack(localT);
        b.position.copy(b.userData.home).multiplyScalar(clamp(e, 0, 1.08));
        b.scale.setScalar(clamp(0.3 + e * 0.7, 0.02, 1.06));
      });

      /* 抗体释放 */
      var tAb = seg(pr, 0.62, 0.84);
      antibodies.forEach(function (ab, i) {
        var localT = clamp((tAb - (i % 10) * 0.035) / 0.7, 0, 1);
        ab.visible = localT > 0.001;
        if (!ab.visible) return;
        var e = easeOut(localT);
        ab.position.lerpVectors(ab.userData.src, ab.userData.mid, e);
        var s = 0.4 + 0.6 * Math.min(1, localT * 2.2);
        ab.scale.setScalar(s);
        ab.rotation.set(
          ab.userData.rot.x + localT * 2,
          ab.userData.rot.y + localT * 3,
          ab.userData.rot.z
        );
      });

      /* 中和 */
      var tNeu = seg(pr, 0.82, 1.0);
      if (tNeu > 0) {
        antibodies.forEach(function (ab) {
          var e = easeInOut(tNeu);
          ab.position.lerpVectors(ab.userData.mid, ab.userData.end, e);
        });
        antigens.forEach(function (v) {
          var m = v.material;
          v.traverse(function (n) {
            if (n.material && n.material.emissiveIntensity != null) {
              n.material.emissiveIntensity = lerp(0.22, 0.02, tNeu);
            }
          });
        });
      }
    }

    apply(0);

    return {
      camera: { theta: -0.28, phi: 1.34, radius: 12.8, target: new T.Vector3(-1.25, 0, 0) },
      limits: [7, 20],
      duration: 17,
      setProgress: apply,
      update: function (dt, t) {
        dust.rotation.y = t * 0.03;
        center.rotation.y = t * 0.1;
        clones.forEach(function (b, i) {
          if (b.visible) b.rotation.y = t * 0.14 + i;
        });
        // 抗体轻微游动
        antibodies.forEach(function (ab, i) {
          if (!ab.visible) return;
          ab.position.x += Math.sin(t * 1.3 + i) * 0.0012;
          ab.position.y += Math.cos(t * 1.1 + i * 1.7) * 0.0012;
        });
      },
      onPick: function (meta) {
        if (meta && meta.part) api.E.emitCard(meta.part, "vac");
      }
    };
  };

  /* ==========================================================================
     03 · 五种疫苗平台
     ========================================================================== */
  STAGES.types = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var dust = make.dust(280, 9, 0x6FA8B4, 0.032);
    root.add(dust);

    var holder = new T.Group();
    root.add(holder);

    var halo = make.halo(PAL.vac, 4.6, 0.13);
    root.add(halo);

    var currentModel = null;
    var currentIdx = 0;
    var appear = 1;
    var spinners = [];

    function clearModel() {
      if (!currentModel) return;
      holder.remove(currentModel);
      currentModel.traverse(function (n) {
        if (n.geometry) n.geometry.dispose();
        if (n.material) {
          var ms = Array.isArray(n.material) ? n.material : [n.material];
          ms.forEach(function (m) { m.dispose(); });
        }
      });
      currentModel = null;
      spinners = [];
    }

    function build(idx) {
      clearModel();
      var t = C.vaccineTypes[idx];
      var g = new T.Group();
      var spin = [];

      if (t.id === "inactivated") {
        var v = make.virus({ radius: 0.98, spikes: 34, color: 0xA8565A, dim: true, broken: true, opacity: 0.5 });
        g.add(v);
        spin.push({ o: v, s: 0.22 });
        var ring = new T.Mesh(
          new T.TorusGeometry(1.55, 0.012, 6, 90),
          new T.MeshBasicMaterial({ color: PAL.path, transparent: true, opacity: 0.22 })
        );
        ring.rotation.x = Math.PI / 2;
        g.add(ring);
      }

      if (t.id === "live") {
        var v2 = make.virus({ radius: 0.86, spikes: 30, color: PAL.vac });
        g.add(v2);
        spin.push({ o: v2, s: 0.3 });
        var h2 = make.halo(PAL.vac, 3.4, 0.3);
        g.add(h2);
        g.userData.halo = h2;
      }

      if (t.id === "subunit") {
        var count = 13;
        api.fibSphere(count, function (dir, tt) {
          var s = make.spike(0.78, PAL.path);
          s.position.copy(dir.clone().multiplyScalar(1.55));
          s.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
          s.rotateX(Math.PI);
          s.userData.ph = tt * 6;
          g.add(s);
          spin.push({ o: s, s: 0.4, bob: true });
        });
        var core = new T.Mesh(
          new T.IcosahedronGeometry(1.28, 1),
          new T.MeshBasicMaterial({ color: PAL.vac, wireframe: true, transparent: true, opacity: 0.12 })
        );
        g.add(core);
        spin.push({ o: core, s: 0.12 });
      }

      if (t.id === "vector") {
        var cap = new T.Mesh(
          new T.IcosahedronGeometry(1.14, 2),
          new T.MeshStandardMaterial({
            color: PAL.immune, roughness: 0.4, metalness: 0.16,
            emissive: PAL.immune, emissiveIntensity: 0.24,
            transparent: true, opacity: 0.42, flatShading: true
          })
        );
        g.add(cap);
        spin.push({ o: cap, s: 0.2 });

        // 腺病毒纤维突起
        var fibMat = new T.MeshStandardMaterial({
          color: 0xC3CCFF, roughness: 0.4, emissive: PAL.immune, emissiveIntensity: 0.4
        });
        api.fibSphere(12, function (dir) {
          var st = new T.Mesh(new T.CylinderGeometry(0.028, 0.022, 0.62, 5), fibMat);
          st.position.copy(dir.clone().multiplyScalar(1.42));
          api.alignTo(st, dir);
          g.add(st);
          var knob = new T.Mesh(new T.SphereGeometry(0.07, 8, 6), fibMat);
          knob.position.copy(dir.clone().multiplyScalar(1.75));
          g.add(knob);
        });

        var hel = make.helix(1.9, 0.24, PAL.vacPale, 3.2);
        g.add(hel);
        spin.push({ o: hel, s: 0.5 });
      }

      if (t.id === "mrna") {
        var lnp = make.lnp(1.18, { pegs: 26 });
        g.add(lnp);
        spin.push({ o: lnp, s: 0.18 });
        var h3 = make.halo(PAL.immune, 3.6, 0.24);
        g.add(h3);
        g.userData.halo = h3;
      }

      currentModel = g;
      holder.add(g);
      appear = 0;
    }

    build(0);

    api.E.onAction = function (act, val) {
      if (act === "type") {
        currentIdx = val | 0;
        build(currentIdx);
        var t = C.vaccineTypes[currentIdx];
        halo.material.color.set(t.id === "mrna" || t.id === "vector" ? PAL.immune : PAL.vac);
        return currentIdx;
      }
    };

    return {
      camera: { theta: -0.32, phi: 1.36, radius: 9.8, target: new T.Vector3(-0.8, 0, 0) },
      limits: [6, 16],
      duration: 0,
      update: function (dt, t) {
        dust.rotation.y = t * 0.025;
        appear += (1 - appear) * Math.min(1, dt * 3.2);
        if (currentModel) {
          currentModel.scale.setScalar(0.72 + 0.28 * easeOut(appear));
          currentModel.rotation.y = t * 0.16;
        }
        spinners.forEach(function (s) {
          s.o.rotation.y += s.s * dt;
          if (s.bob) s.o.position.y += Math.sin(t * 1.4 + s.o.userData.ph) * 0.0018;
        });
        halo.material.opacity = 0.1 + Math.sin(t * 0.9) * 0.035;
        if (currentModel && currentModel.userData.halo) {
          currentModel.userData.halo.material.opacity = 0.2 + Math.sin(t * 1.6) * 0.08;
        }
      }
    };
  };

  /* ==========================================================================
     04 · 免疫记忆（曲线 + 粒子）
     ========================================================================== */
  STAGES.memory = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var dust = make.dust(300, 9, 0x5E93A0, 0.03);
    root.add(dust);

    /* --- 抗体粒子（InstancedMesh） --- */
    var MAX = 260;
    var abGeo = new T.SphereGeometry(0.048, 8, 6);
    var abMat = new T.MeshStandardMaterial({
      color: PAL.vac, roughness: 0.35, metalness: 0.2,
      emissive: PAL.vac, emissiveIntensity: 0.7,
      transparent: true, opacity: 0.42
    });
    var abMesh = new T.InstancedMesh(abGeo, abMat, MAX);
    abMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    var dummy = new T.Object3D();
    var seeds = [];
    for (var i = 0; i < MAX; i++) {
      var r = 1.1 + Math.random() * 3.1;
      var a = Math.random() * Math.PI * 2;
      seeds.push(new T.Vector3(
        Math.cos(a) * r,
        0.05 + Math.random() * 1.95,
        Math.sin(a) * r * 0.6
      ));
    }
    root.add(abMesh);

    /* --- 曲线面板 --- */
    var panel = document.createElement("div");
    panel.className = "curve-panel";
    var cv = document.createElement("canvas");
    cv.width = 1120; cv.height = 380;
    panel.appendChild(cv);
    var capEl = document.createElement("div");
    capEl.className = "curve-cap";
    panel.appendChild(capEl);
    document.body.appendChild(panel);

    var ctx = cv.getContext("2d");
    var W = cv.width, H = cv.height, PAD = { l: 62, r: 26, t: 26, b: 44 };

    var state = { vac: true, day: 0 };
    var maxY = 500;

    function series() {
      return state.vac ? C.memoryCurve.vaccinated : C.memoryCurve.naive;
    }

    function valAt(day) {
      var s = series();
      for (var i = 1; i < s.length; i++) {
        if (day <= s[i][0]) {
          var t = (day - s[i - 1][0]) / Math.max(0.001, s[i][0] - s[i - 1][0]);
          return lerp(s[i - 1][1], s[i][1], clamp(t, 0, 1));
        }
      }
      return s[s.length - 1][1];
    }

    function drawCurve() {
      ctx.clearRect(0, 0, W, H);
      var iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;

      // 网格
      ctx.strokeStyle = "rgba(23,26,30,.10)";
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 6; gx++) {
        var x = PAD.l + (iw / 6) * gx;
        ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + ih); ctx.stroke();
      }
      for (var gy = 0; gy <= 4; gy++) {
        var y = PAD.t + (ih / 4) * gy;
        ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + iw, y); ctx.stroke();
      }

      // 轴标签
      ctx.fillStyle = "rgba(23,26,30,.58)";
      ctx.font = "600 17px ui-monospace, monospace";
      ctx.textAlign = "center";
      ["0", "10", "20", "30", "40", "50", "60"].forEach(function (d, i) {
        ctx.fillText(d, PAD.l + (iw / 6) * i, H - 14);
      });
      ctx.textAlign = "right";
      ["0", "125", "250", "375", "500"].forEach(function (v, i) {
        ctx.fillText(v, PAD.l - 12, PAD.t + ih - (ih / 4) * i + 6);
      });
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(23,26,30,.42)";
      ctx.font = "600 15px ui-monospace, monospace";
      ctx.fillText("DAY", PAD.l + iw - 46, H - 14);
      ctx.fillText("Ab", PAD.l - 44, PAD.t - 8);

      // 接种线
      if (state.vac) {
        var vx = PAD.l + (34 / 60) * iw;
        ctx.setLineDash([5, 6]);
        ctx.strokeStyle = "rgba(169,116,26,.55)";
        ctx.beginPath(); ctx.moveTo(vx, PAD.t); ctx.lineTo(vx, PAD.t + ih); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(126,85,16,.9)";
        ctx.font = "600 15px ui-monospace, monospace";
        ctx.fillText("BOOST", vx + 8, PAD.t + 16);
      }

      // 曲线
      function path(s, color, w, dash) {
        ctx.beginPath();
        s.forEach(function (pt, i) {
          var x = PAD.l + (pt[0] / 60) * iw;
          var y = PAD.t + ih - (pt[1] / maxY) * ih;
          if (i === 0) ctx.moveTo(x, y);
          else {
            var px = PAD.l + (s[i - 1][0] / 60) * iw;
            var py = PAD.t + ih - (s[i - 1][1] / maxY) * ih;
            var cx = (px + x) / 2;
            ctx.bezierCurveTo(cx, py, cx, y, x, y);
          }
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.setLineDash(dash || []);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (state.vac) path(C.memoryCurve.naive, "rgba(23,26,30,.28)", 2, [6, 6]);
      path(series(), state.vac ? "#0E8577" : "rgba(192,57,43,.92)", 3.2);

      // 当前点
      var cx2 = PAD.l + (state.day / 60) * iw;
      var cy2 = PAD.t + ih - (valAt(state.day) / maxY) * ih;
      ctx.beginPath(); ctx.arc(cx2, cy2, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF"; ctx.fill();
      ctx.strokeStyle = state.vac ? "#0E8577" : "#C0392B"; ctx.lineWidth = 2.6; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx2, cy2, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = state.vac ? "#0E8577" : "#C0392B"; ctx.fill();
    }

    function apply() {
      var v = valAt(state.day);
      var n = Math.max(9, Math.round((v / maxY) * MAX));
      for (var i = 0; i < MAX; i++) {
        var on = i < n;
        dummy.position.copy(seeds[i]);
        var sc = on ? (0.7 + (i / MAX) * 0.7) : 0.0001;
        dummy.scale.setScalar(sc);
        dummy.updateMatrix();
        abMesh.setMatrixAt(i, dummy.matrix);
      }
      abMesh.instanceMatrix.needsUpdate = true;
      abMat.color.set(state.vac ? PAL.vac : PAL.path);
      abMat.emissive.set(state.vac ? PAL.vac : PAL.path);
      drawCurve();
      capEl.textContent = "DAY " + String(Math.round(state.day)).padStart(2, "0") +
        "  ·  Ab " + Math.round(v);
    }

    apply();

    api.E.onAction = function (act, val) {
      if (act === "mode") {
        state.vac = !!val;
        apply();
        return state.vac;
      }
      if (act === "day") {
        state.day = val;
        apply();
        return val;
      }
    };

    return {
      camera: { theta: -0.16, phi: 1.46, radius: 11.4, target: new T.Vector3(0, 0.5, 0) },
      limits: [6, 18],
      duration: 0,
      onLight: function () {
        // 抗体粒子在浅色主题下需要更实的填充，否则只剩薄雾
        abMat.opacity = 0.88;
        abMat.emissiveIntensity = 0.10;
        abMat.roughness = 0.55;
        abMat.metalness = 0.04;
        abMat.needsUpdate = true;
      },
      update: function (dt, t) {
        dust.rotation.y = t * 0.02;
        abMesh.rotation.y = t * 0.035;
      },
      onDispose: function () {
        if (panel.parentNode) panel.parentNode.removeChild(panel);
        abGeo.dispose();
        abMat.dispose();
      }
    };
  };

  /* ==========================================================================
     05 · 群体免疫
     ========================================================================== */
  STAGES.herd = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var COLS = 10, ROWS = 7, GAP = 0.98;
    var N = COLS * ROWS;
    var R = 0.172;

    var dust = make.dust(240, 11, 0x4E7F8C, 0.026);
    root.add(dust);

    // 状态材质
    var M = {
      s: new T.MeshStandardMaterial({ color: 0x131C24, roughness: 0.8, metalness: 0.04, emissive: 0x434F5B, emissiveIntensity: 0.32 }),
      i: new T.MeshStandardMaterial({ color: 0x072C29, roughness: 0.45, metalness: 0.1, emissive: 0x2CC4B1, emissiveIntensity: 0.68 }),
      x: new T.MeshStandardMaterial({ color: 0x3A1010, roughness: 0.5, metalness: 0.05, emissive: 0xDE5B5A, emissiveIntensity: 0.82 }),
      d: new T.MeshStandardMaterial({ color: 0x211A0A, roughness: 0.85, metalness: 0.04, emissive: 0x8A7030, emissiveIntensity: 0.45 })
    };

    var geo = new T.SphereGeometry(R, 14, 10);
    var nodes = [];
    var grid = [];

    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var m = new T.Mesh(geo, M.s);
        var x = (c - (COLS - 1) / 2) * GAP;
        var z = (r - (ROWS - 1) / 2) * GAP;
        m.position.set(x, 0, z);
        m.userData.state = 0; // 0 易感 1 免疫 2 感染 3 阻断
        m.userData.rc = [r, c];
        m.userData.ph = Math.random() * 6.28;
        root.add(m);

        var idx = r * COLS + c;
        nodes.push(m);
        grid[idx] = m;
      }
    }

    // 地面网格线
    var floorGeo = new T.BufferGeometry();
    var lines = [];
    for (var i2 = 0; i2 <= COLS; i2++) {
      var xx = (i2 - COLS / 2) * GAP + GAP / 2;
      lines.push(xx, 0, -(ROWS / 2) * GAP, xx, 0, (ROWS / 2) * GAP);
    }
    for (var j2 = 0; j2 <= ROWS; j2++) {
      var zz = (j2 - ROWS / 2) * GAP + GAP / 2;
      lines.push(-(COLS / 2) * GAP, 0, zz, (COLS / 2) * GAP, 0, zz);
    }
    floorGeo.setAttribute("position", new T.Float32BufferAttribute(lines, 3));
    var floor = new T.LineSegments(floorGeo, new T.LineBasicMaterial({
      color: 0x2C4550, transparent: true, opacity: 0.22
    }));
    floor.position.y = -0.34;
    root.add(floor);

    var st = {
      coverage: 0.6,
      running: false,
      generation: 0,
      infectedTotal: 0,
      blocked: 0,
      timer: 0,
      queue: []
    };

    function setState(n, s) {
      n.userData.state = s;
      n.material = s === 0 ? M.s : (s === 1 ? M.i : (s === 2 ? M.x : M.d));
    }

    function reset(coverage) {
      st.coverage = coverage != null ? coverage : st.coverage;
      st.running = false;
      st.generation = 0;
      st.infectedTotal = 0;
      st.blocked = 0;
      st.timer = 0;
      st.queue = [];
      st.prevQ = [];
      var nImmune = Math.round(N * st.coverage);
      var order = [];
      for (var i = 0; i < N; i++) order.push(i);
      for (var a = order.length - 1; a > 0; a--) {
        var b = Math.floor(Math.random() * (a + 1));
        var tmp = order[a]; order[a] = order[b]; order[b] = tmp;
      }
      var immuneSet = {};
      for (var k = 0; k < nImmune; k++) immuneSet[order[k]] = true;

      nodes.forEach(function (n, ix) {
        setState(n, immuneSet[ix] ? 1 : 0);
        n.scale.setScalar(0.9 + Math.random() * 0.2);
      });
      api.E.emitStats({
        cov: Math.round(st.coverage * 100),
        inf: 0,
        gen: 0,
        status: "ready"
      });
    }

    var LONG = 4;   // 长途接触：人群不是一张网格，总有跨区域的随机接触

    function neighbors(idx) {
      var r = Math.floor(idx / COLS), c = idx % COLS;
      var out = [];
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          var rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) out.push(rr * COLS + cc);
        }
      }
      for (var k = 0; k < LONG; k++) {
        var j = Math.floor(Math.random() * N);
        if (j !== idx && out.indexOf(j) === -1) out.push(j);
      }
      return out;
    }

    function release() {
      if (st.running) return;
      // 从内部格子起火：边界格只有 5 个邻居，容易误判成"很快自灭"
      var candidates = [];
      nodes.forEach(function (n, i) {
        if (n.userData.state !== 0) return;
        var rc = n.userData.rc;
        if (rc[0] > 0 && rc[0] < ROWS - 1 && rc[1] > 0 && rc[1] < COLS - 1) candidates.push(i);
      });
      if (!candidates.length) nodes.forEach(function (n, i) { if (n.userData.state === 0) candidates.push(i); });
      if (!candidates.length) { reset(st.coverage); return; }
      var pick = candidates[Math.floor(Math.random() * candidates.length)];
      setState(nodes[pick], 2);
      nodes[pick].scale.setScalar(1.4);
      st.running = true;
      st.generation = 1;
      st.infectedTotal = 1;
      st.timer = 0;
      st.queue = [pick];
      api.E.emitStats({ cov: Math.round(st.coverage * 100), inf: 1, gen: 1, status: "running" });
    }

    /* 按期望值推进：先把整数部分确定性地传染出去，小数部分按概率补一个。
       这样 R_eff 才真正等于 R0 × 易感比例，而不是每次都靠运气。 */
    function stepGeneration() {
      var next = [];
      var added = 0;
      var p = clamp((st.r0 != null ? st.r0 : 2.5) / (8 + LONG), 0, 1);

      // 一个感染者连续两代具有传染性（相当于一个病程），否则网格会瞬间饱和
      var active = st.queue.concat(st.prevQ || []);

      active.forEach(function (idx) {
        var nbrs = neighbors(idx);
        var susc = [];
        nbrs.forEach(function (ni) {
          var n = nodes[ni];
          if (n.userData.state === 0) susc.push(ni);
          else if (n.userData.state === 1) st.blocked++;
        });

        var expected = p * susc.length;
        var whole = Math.floor(expected);
        if (Math.random() < expected - whole) whole++;
        if (whole > susc.length) whole = susc.length;

        // 洗牌后取前 whole 个
        for (var a = susc.length - 1; a > 0; a--) {
          var b = Math.floor(Math.random() * (a + 1));
          var tmp = susc[a]; susc[a] = susc[b]; susc[b] = tmp;
        }
        for (var k = 0; k < whole; k++) {
          var n = nodes[susc[k]];
          setState(n, 2);
          n.scale.setScalar(1.35);
          next.push(susc[k]);
          added++;
          st.infectedTotal++;
        }

        var srcNode = nodes[idx];
        if (srcNode.userData.state === 2) srcNode.scale.setScalar(1.0);
      });

      st.prevQ = st.queue;
      st.queue = next;
      st.generation++;
      api.E.emitStats({
        cov: Math.round(st.coverage * 100),
        inf: st.infectedTotal,
        gen: st.generation,
        status: next.length ? "running" : "ended"
      });

      if (!next.length) {
        st.running = false;
      }
    }

    st.r0 = 2.5;
    reset(0.6);

    api.E.onAction = function (act, val) {
      if (act === "coverage") {
        reset(val);
        return Math.round(val * 100);
      }
      if (act === "r0") {
        st.r0 = val;
        return val.toFixed(1);
      }
      if (act === "release") {
        release();
        return true;
      }
      if (act === "reset") {
        reset(st.coverage);
        return true;
      }
    };

    return {
      camera: { theta: 0.0, phi: 0.9, radius: 18.0, target: new T.Vector3(-0.35, 0, 0.3) },
      limits: [10, 32],
      duration: 0,
      update: function (dt, t) {
        dust.rotation.y = t * 0.015;
        nodes.forEach(function (n) {
          var targetScale = n.userData.state === 2 ? 1.32 : (n.userData.state === 1 ? 1.0 : 0.95);
          var s = n.scale.x;
          n.scale.setScalar(lerp(s, targetScale, Math.min(1, dt * 5)));
          if (n.userData.state === 2) {
            n.position.y = 0.1 + Math.sin(t * 4 + n.userData.ph) * 0.09;
          } else {
            n.position.y = lerp(n.position.y, 0, Math.min(1, dt * 4));
          }
        });

        if (st.running) {
          st.timer += dt;
          if (st.timer > 0.75) {
            st.timer = 0;
            stepGeneration();
          }
        }
      }
    };
  };

  /* ==========================================================================
     06 · 抗生素五靶点
     ========================================================================== */
  STAGES.abx = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var dust = make.dust(300, 10, 0x5E93A0, 0.032);
    root.add(dust);

    var halo = make.halo(PAL.abx, 6.4, 0.1);
    root.add(halo);

    var bact = make.bacterium({
      radius: 0.86, length: 2.55, color: 0x3E8F86, flagella: 0,
      wallOpacity: 0.085, wallEi: 0.30,
      cytoOpacity: 0.035, cytoEi: 0.10
    });
    root.add(bact);

    var P = bact.userData.parts;
    // 剖面视图：壳体只画近侧，避免双层叠加把胞内糊成一片
    P.wallMat.side = T.FrontSide;
    P.wallMat.depthWrite = false;

    /* 核糖体分两色：30S / 50S */
    var mat30 = new T.MeshStandardMaterial({
      color: 0x04100E, roughness: 1, metalness: 0,
      emissive: 0x18A897, emissiveIntensity: 0.62
    });
    var mat50 = new T.MeshStandardMaterial({
      color: 0x06070F, roughness: 1, metalness: 0,
      emissive: 0x5C6BD8, emissiveIntensity: 0.62
    });
    P.ribosomes.forEach(function (m, i) {
      m.material = (i % 2 === 0) ? mat30 : mat50;
      m.scale.multiplyScalar(1.28);
      m.userData.baseScale = m.scale.x;
    });

    var baseWallColor = P.wallMat.color.clone();
    var baseNetColor = P.net.material.color.clone();
    var baseDnaColor = P.dna.material.color.clone();
    var baseM30 = mat30.color.clone();
    var baseM50 = mat50.color.clone();

    /* 膜孔 */
    var poreMat = new T.MeshStandardMaterial({
      color: PAL.path, roughness: 0.3, metalness: 0.1,
      emissive: PAL.path, emissiveIntensity: 1.4,
      transparent: true, opacity: 0.92
    });
    var poreGroup = new T.Group();
    for (var i = 0; i < 12; i++) {
      var pr = new T.Mesh(new T.SphereGeometry(0.055, 8, 6), poreMat);
      var a = (i / 12) * Math.PI * 2;
      pr.position.set((i % 4 - 1.5) * 0.95, Math.cos(a) * 0.94, Math.sin(a) * 0.94);
      poreGroup.add(pr);
    }
    poreGroup.visible = false;
    root.add(poreGroup);

    /* 泄漏粒子 */
    var leakGeo = new T.BufferGeometry();
    var leakN = 60;
    var lp = new Float32Array(leakN * 3);
    var ldir = [];
    for (var j = 0; j < leakN; j++) {
      var aa = Math.random() * Math.PI * 2;
      var yy = (Math.random() - 0.5) * 2.2;
      ldir.push(new T.Vector3(Math.cos(aa) * 0.9, yy, Math.sin(aa) * 0.9));
      lp[j * 3] = 0; lp[j * 3 + 1] = 0; lp[j * 3 + 2] = 0;
    }
    leakGeo.setAttribute("position", new T.BufferAttribute(lp, 3));
    var leakMat = new T.PointsMaterial({
      color: PAL.pathPale, size: 0.07, map: api.E.tex.soft(),
      transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false
    });
    var leak = new T.Points(leakGeo, leakMat);
    leak.visible = false;
    root.add(leak);

    /* 靶点 */
    var TGT = {
      wall: { local: new T.Vector3(0.55, 0.96, 0.4), cam: { theta: -0.5, phi: 1.0, radius: 8.6 } },
      p30s: { local: new T.Vector3(1.0, 0.2, 0.6), cam: { theta: -0.15, phi: 1.3, radius: 7.2 } },
      p50s: { local: new T.Vector3(-1.32, 0.1, 0.5), cam: { theta: 0.45, phi: 1.32, radius: 7.2 } },
      dna: { local: new T.Vector3(-0.35, -0.52, 0.28), cam: { theta: 0.1, phi: 1.5, radius: 7.0 } },
      membrane: { local: new T.Vector3(-0.2, -0.92, 0.5), cam: { theta: 0.6, phi: 1.66, radius: 8.2 } }
    };
    var TGT_SIDE = { wall: "right", p30s: "right", p50s: "left", dna: "left", membrane: "left" };

    Object.keys(TGT).forEach(function (id) {
      var part = C.abxTargets.filter(function (x) { return x.id === id; })[0];
      if (!part) return;
      api.mark({
        id: id,
        label: part.zh,
        tone: "abx",
        side: TGT_SIDE[id],
        pos: function () { return bact.localToWorld(TGT[id].local.clone()); },
        onClick: function (mid) { select(mid); }
      });
    });

    var active = null, activeT = 0;

    /* 把镜头对准某个靶点：目标点整体左移，避开左侧文字与右侧控制台 */
    function focus(id) {
      var t = TGT[id];
      if (!t) return;
      var p = bact.localToWorld(t.local.clone());
      p.x -= 0.62;
      p.y += 0.04;
      api.E.orbit.ease({
        target: p,
        radius: t.cam.radius + 2.4,
        theta: t.cam.theta,
        phi: t.cam.phi
      });
    }

    function restore() {
      P.wallMat.color.copy(baseWallColor);
      P.wallMat.emissiveIntensity = 0;
      P.wallMat.opacity = 0.085;
      P.net.material.color.copy(baseNetColor);
      P.net.material.opacity = 0.34;
      P.dna.material.color.copy(baseDnaColor);
      P.dna.material.emissiveIntensity = 0;
      P.dna.position.set(0, 0, 0);
      mat30.color.copy(baseM30); mat30.emissiveIntensity = 0;
      mat50.color.copy(baseM50); mat50.emissiveIntensity = 0;
      P.ribosomes.forEach(function (m) { m.scale.setScalar(m.userData.baseScale || 1); });
      poreGroup.visible = false;
      leak.visible = false;
      bact.scale.setScalar(1);
      halo.material.opacity = 0.08;
    }

    function select(id) {
      active = id;
      activeT = 0;
      restore();
      api.E.selectMark(id);

      var t = TGT[id];
      if (t) focus(id);

      if (id === "wall") {
        P.wallMat.color.set(0xC0392B);
        P.wallMat.opacity = 0.5;
        P.net.material.color.set(0xC0392B);
        P.net.material.opacity = 0.6;
      }
      if (id === "p30s") { mat30.color.set(0xC0392B); mat50.color.set(0x8B94AC); }
      if (id === "p50s") { mat50.color.set(0xC0392B); mat30.color.set(0x86A8A2); }
      if (id === "dna") {
        P.dna.material.color.set(0xC0392B);
      }
      if (id === "membrane") {
        poreGroup.visible = true;
        leak.visible = true;
      }
      halo.material.opacity = 0.055;

      var part = C.abxTargets.filter(function (x) { return x.id === id; })[0];
      if (part) api.E.emitCard(part, "abx", true);
    }

    api.E.onAction = function (act) {
      if (act === "overview") {
        active = null;
        restore();
        api.E.selectMark(null);
        api.E.hideCard();
        api.E.orbit.ease({ target: new T.Vector3(-0.55, 0, 0), radius: 12.8, theta: -0.38, phi: 1.34 });
      }
    };
    api.E.selectTarget = select;

    return {
      camera: { theta: -0.38, phi: 1.34, radius: 12.8, target: new T.Vector3(-0.55, 0, 0) },
      limits: [8, 22],
      duration: 0,
      onLight: function () {
        // 浅色模式下基色在转换后才确定，这里重新记一遍，恢复时才不会跳回暗色
        baseWallColor.copy(P.wallMat.color);
        baseNetColor.copy(P.net.material.color);
        baseDnaColor.copy(P.dna.material.color);
        baseM30.copy(mat30.color);
        baseM50.copy(mat50.color);
      },
      update: function (dt, t) {
        dust.rotation.y = t * 0.02;
        if (!active) {
          bact.rotation.y = Math.sin(t * 0.18) * 0.22;
          halo.material.opacity = 0.042 + Math.sin(t * 0.9) * 0.016;
        } else {
          bact.rotation.y += (0 - bact.rotation.y) * Math.min(1, dt * 3);
          activeT += dt;
        }

        if (active === "wall") {
          var w = 1 + Math.sin(activeT * 5.5) * 0.045;
          bact.scale.set(w, 2 - w, w);
          P.net.material.opacity = 0.3 + Math.sin(activeT * 6) * 0.22;
        }

        if (active === "p30s") {
          P.ribosomes.forEach(function (m, i) {
            if (i % 2 !== 0) return;
            m.scale.setScalar((m.userData.baseScale || 1) * (0.55 + Math.sin(activeT * 6 + i) * 0.12));
          });
        }
        if (active === "p50s") {
          P.ribosomes.forEach(function (m, i) {
            if (i % 2 === 0) return;
            m.scale.setScalar((m.userData.baseScale || 1) * (0.55 + Math.sin(activeT * 6 + i) * 0.12));
          });
        }

        if (active === "dna") {
          P.dna.position.set(
            Math.sin(activeT * 22) * 0.02,
            Math.cos(activeT * 19) * 0.02,
            0
          );
          P.dna.material.color.setHSL(0.02, 0.72, 0.36 + Math.sin(activeT * 9) * 0.10);
        }

        if (active === "membrane") {
          poreGroup.children.forEach(function (p, i) {
            p.scale.setScalar(0.7 + Math.sin(activeT * 5 + i * 0.7) * 0.45);
          });
          var pos = leak.geometry.attributes.position;
          for (var k = 0; k < leakN; k++) {
            var ph = (activeT * 0.9 + k * 0.137) % 1;
            var d = ldir[k];
            pos.array[k * 3] = d.x * (0.9 + ph * 1.5);
            pos.array[k * 3 + 1] = d.y * (0.9 + ph * 1.2) * 0.85;
            pos.array[k * 3 + 2] = d.z * (0.9 + ph * 1.5);
          }
          pos.needsUpdate = true;
          leakMat.opacity = 0.55 + Math.sin(activeT * 3) * 0.2;
        }
      },
      onEmpty: function () {
        if (!active) return;
        active = null;
        restore();
        api.E.selectMark(null);
        api.E.hideCard();
        api.E.orbit.ease({ target: new T.Vector3(0, 0, 0), radius: 11.2, theta: -0.38, phi: 1.34 });
      },
      onDispose: function () {
        [mat30, mat50, poreMat, leakMat].forEach(function (m) { m.dispose(); });
        leakGeo.dispose();
      }
    };
  };

  /* ==========================================================================
     07 · 耐药性演化
     ========================================================================== */
  STAGES.resistance = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var DISH_R = 2.62;
    var dish = make.dish(DISH_R);
    root.add(dish);

    var dust = make.dust(220, 9, 0x4E7F8C, 0.026);
    root.add(dust);

    var halo = make.halo(PAL.abx, 6.8, 0.055);
    root.add(halo);

    var bugGeo = new T.SphereGeometry(0.048, 10, 8);
    var M = {
      s: new T.MeshStandardMaterial({ color: 0x08302C, roughness: 0.5, metalness: 0.08, emissive: 0x4FD6C1, emissiveIntensity: 0.62 }),
      m: new T.MeshStandardMaterial({ color: 0x332305, roughness: 0.5, metalness: 0.08, emissive: 0xE9B44C, emissiveIntensity: 0.72 }),
      r: new T.MeshStandardMaterial({ color: 0x330D0D, roughness: 0.5, metalness: 0.08, emissive: 0xE8665E, emissiveIntensity: 0.82 })
    };

    var POOL = 520;
    var bugs = [];
    var free = [];

    for (var i = 0; i < POOL; i++) {
      var m = new T.Mesh(bugGeo, M.s);
      m.visible = false;
      root.add(m);
      var b = { mesh: m, mic: 0, alive: false, die: 0, grow: 0, size: 1, phase: Math.random() * 6.28 };
      bugs.push(b);
      free.push(b);
    }

    function randPos(minR) {
      var a = Math.random() * Math.PI * 2;
      var r = Math.sqrt(Math.random()) * (DISH_R - 0.2);
      if (minR) r = Math.max(r, minR);
      return new T.Vector3(Math.cos(a) * r, 0.075, Math.sin(a) * r);
    }

    function take() {
      for (var k = 0; k < free.length; k++) {
        if (free[k] !== null) {
          var b = free[k];
          free[k] = null;
          return b;
        }
      }
      return null;
    }

    function release(b) {
      if (free.indexOf(b) === -1) free.push(b);
    }

    function matFor(mic) {
      if (mic < 0.3) return M.s;
      if (mic < 0.62) return M.m;
      return M.r;
    }

    var st = { conc: 0.36, rounds: 0, auto: 0, sterile: false, lastDead: 0 };

    function seed() {
      bugs.forEach(function (b) {
        b.alive = false; b.die = 0; b.grow = 0;
        b.mesh.visible = false;
        b.mesh.scale.setScalar(0.0001);
      });
      free = bugs.slice();

      for (var k = 0; k < 200; k++) {
        var b = take();
        if (!b) break;
        // 绝大多数是敏感菌；约 2% 天生就带耐药基因（MIC 偏高）
        b.mic = Math.random() < 0.022
          ? 0.56 + Math.random() * 0.30
          : Math.random() * 0.30;
        b.alive = true;
        b.die = 0;
        b.grow = Math.random() * 0.6;
        b.size = 0.85 + Math.random() * 0.4;
        b.mesh.material = matFor(b.mic);
        b.mesh.position.copy(randPos());
        b.mesh.visible = true;
        b.mesh.scale.setScalar(0.0001);
      }
      st.rounds = 0;
      st.sterile = false;
      st.auto = 0;
      stats("ready");
    }

    function stats(status) {
      var alive = 0, sum = 0, resistant = 0;
      bugs.forEach(function (b) {
        if (!b.alive) return;
        alive++;
        sum += b.mic;
        if (b.mic > 0.5) resistant++;
      });
      api.E.emitStats({
        alive: alive,
        mic: alive ? (sum / alive) : 0,
        res: alive ? Math.round((resistant / alive) * 100) : 0,
        round: st.rounds,
        status: status || (st.sterile ? "sterile" : "ready")
      });
    }

    function dose() {
      if (st.sterile) return;
      var conc = st.conc;
      var survivors = [];
      var deadCount = 0;

      bugs.forEach(function (b) {
        if (!b.alive) return;
        var p = clamp((conc - b.mic) / 0.42, 0, 1) * 0.97;
        if (Math.random() < p) {
          b.alive = false;
          b.die = 1;
          deadCount++;
        } else {
          survivors.push(b);
        }
      });
      st.lastDead = deadCount;
      st.rounds++;

      if (survivors.length === 0) {
        st.sterile = true;
        stats("sterile");
        return;
      }

      var targetN = Math.min(200, Math.round(survivors.length * 2.6) + 3);
      var need = Math.max(0, targetN - survivors.length);
      var per = Math.ceil(need / survivors.length);
      var made = 0;
      for (var i = 0; i < survivors.length && made < need; i++) {
        var pnode = survivors[i];
        for (var k = 0; k < per && made < need; k++) {
          var child = take();
          if (!child) break;
          // 耐药基因继承 + 微小突变
          child.mic = clamp(pnode.mic + (Math.random() - 0.38) * 0.22, 0, 1);
          // 质粒接合：小概率直接从另一株获得耐药基因
          if (Math.random() < 0.05 && survivors.length > 1) {
            var donor = survivors[Math.floor(Math.random() * survivors.length)];
            if (donor.mic > child.mic) child.mic = clamp(donor.mic - 0.02, 0, 1);
          }
          child.alive = true;
          child.die = 0;
          child.grow = 0.55;
          child.size = 0.85 + Math.random() * 0.4;
          child.mesh.material = matFor(child.mic);
          var base = pnode.mesh.position;
          var ang2 = Math.random() * Math.PI * 2;
          var rad2 = Math.sqrt(Math.random()) * (DISH_R - 0.22);
          child.mesh.position.set(Math.cos(ang2) * rad2, 0.075, Math.sin(ang2) * rad2);
          if (Math.random() < 0.34) {
            child.mesh.position.x = clamp(base.x + (Math.random() - 0.5) * 0.34, -DISH_R + 0.2, DISH_R - 0.2);
            child.mesh.position.z = clamp(base.z + (Math.random() - 0.5) * 0.34, -DISH_R + 0.2, DISH_R - 0.2);
          }
          child.mesh.visible = true;
          child.mesh.scale.setScalar(0.0001);
          made++;
        }
      }
      stats("dosed");
    }

    seed();

    api.E.onAction = function (act, val) {
      if (act === "conc") {
        st.conc = val;
        return Math.round(val * 100);
      }
      if (act === "dose") {
        dose();
        return true;
      }
      if (act === "auto") {
        st.auto = st.auto ? 0 : 1.3;
        return !!st.auto;
      }
      if (act === "reset") {
        seed();
        return true;
      }
    };

    return {
      camera: { theta: 0.08, phi: 0.7, radius: 13.4, target: new T.Vector3(-0.32, 0, 0.12) },
      limits: [6, 20],
      duration: 0,
      update: function (dt, t) {
        dust.rotation.y = t * 0.018;
        halo.material.opacity = 0.06 + Math.sin(t * 0.8) * 0.025;

        bugs.forEach(function (b) {
          if (b.die > 0) {
            b.die -= dt * 1.9;
            var s = clamp(b.die, 0, 1);
            b.mesh.scale.setScalar(Math.max(0.0001, s * b.size));
            if (b.die <= 0) {
              b.mesh.visible = false;
              b.die = 0;
              release(b);
            }
            return;
          }
          if (!b.alive) return;
          if (b.grow > 0) {
            b.grow -= dt * 1.8;
            var g = clamp(1 - b.grow, 0, 1);
            b.mesh.scale.setScalar(Math.max(0.0001, g * b.size));
          } else {
            b.mesh.scale.setScalar(b.size);
          }
          b.mesh.position.y = 0.075 + Math.sin(t * 1.6 + b.phase) * 0.012;
        });

        if (st.auto) {
          st.auto -= dt;
          if (st.auto <= 0) {
            st.auto = 1.3;
            dose();
          }
        }
      },
      onDispose: function () {
        bugGeo.dispose();
        [M.s, M.m, M.r].forEach(function (m) { m.dispose(); });
      }
    };
  };

  /* ==========================================================================
     08 · 尾声
     ========================================================================== */
  STAGES.closing = function (api) {
    var T = api.T, make = api.make, PAL = api.PAL;
    var root = api.group;

    var dust = make.dust(560, 10.5, 0x6FA8B4, 0.038);
    root.add(dust);

    var core = new T.Mesh(
      new T.IcosahedronGeometry(1.34, 1),
      new T.MeshBasicMaterial({ color: PAL.vac, wireframe: true, transparent: true, opacity: 0.07 })
    );
    root.add(core);

    var halo = make.halo(PAL.vac, 7.2, 0.1);
    root.add(halo);

    var abs = [];
    for (var i = 0; i < 15; i++) {
      var ab = make.antibody(0.33, i % 4 === 0 ? PAL.abx : PAL.vacPale);
      ab.userData.r = 2.3 + (i % 3) * 0.55;
      ab.userData.a = (i / 15) * Math.PI * 2;
      ab.userData.y = (Math.random() - 0.5) * 1.9;
      ab.userData.sp = 0.1 + Math.random() * 0.07;
      root.add(ab);
      abs.push(ab);
    }

    return {
      camera: { theta: -0.18, phi: 1.36, radius: 11.9, target: new T.Vector3(-0.55, 0, 0) },
      limits: [7, 20],
      duration: 0,
      update: function (dt, t) {
        dust.rotation.y = t * 0.022;
        core.rotation.y = t * 0.09;
        core.rotation.x = Math.sin(t * 0.14) * 0.2;
        halo.material.opacity = 0.07 + Math.sin(t * 0.7) * 0.03;
        abs.forEach(function (ab, i) {
          var a = ab.userData.a + t * ab.userData.sp;
          ab.position.set(
            Math.cos(a) * ab.userData.r,
            ab.userData.y + Math.sin(t * 0.55 + i) * 0.16,
            Math.sin(a) * ab.userData.r * 0.66
          );
          ab.rotation.y = -a + Math.PI / 2;
          ab.rotation.z = Math.sin(t * 0.4 + i) * 0.25;
        });
      }
    };
  };

  return STAGES;
})();
