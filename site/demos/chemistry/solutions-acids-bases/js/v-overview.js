/* ==========================================================================
   v-overview.js — 概览页的三维烧杯
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;
  if (!C || !window.THREE) return;

  var stage, world, beaker, ticker;
  var waters = [], ions = [];
  var rotX = 0, rotY = 0, tRotX = 0, tRotY = 0;

  function init() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    stage = C.stage(canvas, { fov: 32, position: [0, 0.72, 8.3], target: [0, -0.05, 0] });
    if (!stage) return;

    beaker = C.buildBeaker({ radius: 1.46, height: 3.4, liquidHeight: 2.3, liquidColor: 0x2F8FA6 });
    world = beaker.group;
    stage.scene.add(world);

    var yMin = beaker.bottomY + 0.4;
    var yMax = beaker.liquidTop - 0.28;
    var rMax = 1.2;

    /* 水分子 */
    for (var i = 0; i < 18; i++) {
      var w = C.waterMolecule(C.rand(0.5, 0.76));
      var ang = C.rand(0, Math.PI * 2), rad = C.rand(0.15, rMax);
      w.position.set(Math.cos(ang) * rad, C.rand(yMin, yMax), Math.sin(ang) * rad);
      w.rotation.set(C.rand(0, 3), C.rand(0, 3), C.rand(0, 3));
      w.userData.spin = new THREE.Vector3(C.rand(-0.3, 0.3), C.rand(-0.3, 0.3), C.rand(-0.3, 0.3));
      w.userData.phase = C.rand(0, 6.28);
      w.userData.base = w.position.clone();
      world.add(w);
      waters.push(w);
    }

    /* 离子：NaCl */
    var na = C.SOL.NaCl.ionA, cl = C.SOL.NaCl.ionB;
    var geo = new THREE.SphereGeometry(C.ION_R, 20, 16);
    for (var k = 0; k < 14; k++) {
      var isNa = k % 2 === 0;
      var tint = isNa ? na : cl;
      var m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: tint.color, roughness: 0.34, metalness: 0.04,
        emissive: tint.color, emissiveIntensity: 0.3
      }));
      var a2 = C.rand(0, Math.PI * 2), r2 = C.rand(0.22, rMax - 0.1);
      m.position.set(Math.cos(a2) * r2, C.rand(yMin + 0.1, yMax), Math.sin(a2) * r2);
      var halo = C.glowSprite(tint.color, C.ION_R * 2 * C.ION_GLOW, 0.3);
      m.add(halo);
      m.userData = {
        v: new THREE.Vector3(C.rand(-0.1, 0.1), C.rand(-0.07, 0.07), C.rand(-0.1, 0.1)),
        phase: C.rand(0, 6.28)
      };
      world.add(m);
      ions.push(m);
    }

    paintLegend();

    var vp = canvas.parentNode;
    vp.addEventListener('pointermove', function (e) {
      var r = vp.getBoundingClientRect();
      tRotY = ((e.clientX - r.left) / r.width - 0.5) * 0.3;
      tRotX = ((e.clientY - r.top) / r.height - 0.5) * 0.14;
    });
    vp.addEventListener('pointerleave', function () { tRotX = 0; tRotY = 0; });

    ticker = C.ticker(frame);
  }

  function paintLegend() {
    var box = document.getElementById('hero-legend');
    if (!box) return;
    var na = C.SOL.NaCl.ionA, cl = C.SOL.NaCl.ionB;
    box.innerHTML =
      '<span class="lg"><i>' + C.icon('ion', na.css, 1) + '</i><b>Na⁺</b></span>' +
      '<span class="lg"><i>' + C.icon('ion', cl.css, 1) + '</i><b>Cl⁻</b></span>' +
      '<span class="lg"><i>' + C.icon('water', null, 1) + '</i><b data-i18n>' + T('水分子') + '</b></span>';
    I18N.apply(box);
  }

  function frame(dt, time) {
    rotY += (tRotY - rotY) * 0.04;
    rotX += (tRotX - rotX) * 0.04;
    world.rotation.y = rotY + Math.sin(time * 0.16) * 0.05;
    world.rotation.x = rotX * 0.5;

    for (var i = 0; i < waters.length; i++) {
      var w = waters[i], u = w.userData;
      w.rotation.x += u.spin.x * dt;
      w.rotation.y += u.spin.y * dt;
      w.position.x = u.base.x + Math.sin(time * 0.6 + u.phase) * 0.075;
      w.position.y = u.base.y + Math.cos(time * 0.48 + u.phase) * 0.06;
      w.position.z = u.base.z + Math.sin(time * 0.54 + u.phase * 1.6) * 0.075;
    }

    for (var k = 0; k < ions.length; k++) {
      var m = ions[k], ud = m.userData, p = m.position;
      p.x += ud.v.x * dt;
      p.y += ud.v.y * dt;
      p.z += ud.v.z * dt;
      var r = Math.hypot(p.x, p.z);
      if (r > 1.16) {
        p.x *= 1.16 / r;
        p.z *= 1.16 / r;
        ud.v.x *= -0.85; ud.v.z *= -0.85;
      }
      if (p.y < beaker.bottomY + 0.42) { p.y = beaker.bottomY + 0.42; ud.v.y = Math.abs(ud.v.y); }
      if (p.y > beaker.liquidTop - 0.28) { p.y = beaker.liquidTop - 0.28; ud.v.y = -Math.abs(ud.v.y); }
      if (ud.v.length() < 0.04) {
        ud.v.x += C.rand(-0.03, 0.03);
        ud.v.z += C.rand(-0.03, 0.03);
      }
    }

    stage.renderer.render(stage.scene, stage.camera);
  }

  window.VIEWS.overview = {
    init: init,
    enter: function () { if (ticker) ticker.start(); },
    leave: function () { if (ticker) ticker.stop(); }
  };
})();
