/* ==========================================================================
   v-solubility.js — 互动溶解度曲线
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;
  if (!C) return;

  var canvas, ctx, W = 0, H = 0;
  var KEYS = ['KNO3', 'NH4Cl', 'NaCl'];
  var PAD = { l: 58, r: 26, t: 22 };
  var state = {
    mode: 'compare', sub: 'KNO3', cursorT: 40, pointT: 40, pointM: 45, dragging: false
  };
  var els = {};
  var inited = false;

  function subName(k) { return I18N.isEN ? C.SOL[k].en : C.SOL[k].zh; }

  /* ---------------- 尺寸 ---------------- */
  function resize() {
    if (!canvas) return;
    var w = canvas.clientWidth || 600;
    var h = canvas.clientHeight || 380;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = w; H = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  /* ---------------- 坐标 ---------------- */
  function rect() {
    if (state.mode === 'compare') {
      return {
        main: { x0: PAD.l, x1: W - PAD.r, y0: PAD.t + 6, y1: H - 152 },
        sub: { x0: PAD.l, x1: W - PAD.r, y0: H - 92, y1: H - 34 }
      };
    }
    return { main: { x0: PAD.l, x1: W - PAD.r, y0: PAD.t + 4, y1: H - 44 } };
  }
  function yMaxOf(key) { return key === 'CaOH2' ? 0.2 : 250; }
  function sx(r, t) { return r.x0 + (t / 100) * (r.x1 - r.x0); }
  function sy(r, v, ymax) { return r.y1 - (v / ymax) * (r.y1 - r.y0); }
  function invX(r, px) { return C.clamp((px - r.x0) / (r.x1 - r.x0) * 100, 0, 100); }
  function invY(r, py, ymax) { return C.clamp((r.y1 - py) / (r.y1 - r.y0) * ymax, 0, ymax); }

  /* ---------------- 绘图基元 ---------------- */
  function line(x1, y1, x2, y2, color, width, dash) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash(dash || []);
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 1;
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  function text(str, x, y, color, font, align) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(str, x, y);
    ctx.restore();
  }
  function gridMain(r, ymax, stepY, stepX) {
    ctx.save();
    ctx.strokeStyle = 'rgba(23,27,29,.075)';
    ctx.lineWidth = 1;
    for (var v = 0; v <= ymax + 0.001; v += stepY) {
      var y = sy(r, v, ymax);
      ctx.beginPath(); ctx.moveTo(r.x0, y); ctx.lineTo(r.x1, y); ctx.stroke();
      text(ymax <= 1 ? v.toFixed(2) : String(Math.round(v)), r.x0 - 9, y + 3, '#8D9698', '9px ui-monospace,Menlo,monospace', 'right');
    }
    for (var t = 0; t <= 100; t += stepX) {
      var x = sx(r, t);
      ctx.beginPath(); ctx.moveTo(x, r.y0); ctx.lineTo(x, r.y1); ctx.stroke();
      text(String(t), x, r.y1 + 15, '#8D9698', '9px ui-monospace,Menlo,monospace', 'center');
    }
    ctx.strokeStyle = 'rgba(23,27,29,.34)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(r.x0, r.y0); ctx.lineTo(r.x0, r.y1); ctx.lineTo(r.x1, r.y1); ctx.stroke();
    ctx.restore();
  }
  function curve(r, key, ymax) {
    ctx.save();
    ctx.beginPath();
    for (var t = 0; t <= 100; t += 1) {
      var v = C.solAt(key, t);
      var x = sx(r, t), y = sy(r, Math.min(v, ymax), ymax);
      if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = C.SOL[key].css;
    ctx.lineWidth = 1.9;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }
  function dot(x, y, color, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r || 3.4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.restore();
  }
  function axisTitles(r, isSub) {
    text(T('温度 / °C'), (r.x0 + r.x1) / 2, r.y1 + (isSub ? 15 : 30), '#8D9698', '9px ui-monospace,Menlo,monospace', 'center');
    ctx.save();
    ctx.translate(r.x0 - 44, (r.y0 + r.y1) / 2);
    ctx.rotate(-Math.PI / 2);
    text(T('溶解度 / g'), 0, 0, '#8D9698', '9px ui-monospace,Menlo,monospace', 'center');
    ctx.restore();
  }

  /* ---------------- 对比模式 ---------------- */
  function drawCompare() {
    var R = rect(), m = R.main, s = R.sub, ymax = 250;
    gridMain(m, ymax, 50, 20);
    axisTitles(m, false);

    KEYS.forEach(function (k) {
      curve(m, k, ymax);
      var v = C.solAt(k, 100);
      text(C.SOL[k].formula, m.x1 - 6, Math.max(m.y0 + 12, sy(m, Math.min(v, ymax), ymax) - 7), C.SOL[k].css,
        '600 10px ui-monospace,Menlo,monospace', 'right');
    });

    var over = sy(m, ymax, ymax);
    line(m.x1 - 3, over + 6, m.x1 - 3, over - 6, '#0E7A57', 1);

    var Tc = state.cursorT;
    var cx = sx(m, Tc);
    line(cx, m.y0, cx, m.y1, 'rgba(23,27,29,.38)', 1, [3, 4]);
    KEYS.forEach(function (k) {
      var v = C.solAt(k, Tc);
      if (v <= ymax) dot(cx, sy(m, v, ymax), C.SOL[k].css, 3.2);
    });

    var badge = 'T = ' + Math.round(Tc) + ' °C';
    ctx.save();
    ctx.font = '9px ui-monospace,Menlo,monospace';
    var bw = ctx.measureText(badge).width + 14;
    var bx = C.clamp(cx - bw / 2, m.x0, m.x1 - bw);
    ctx.fillStyle = '#171B1D';
    ctx.fillRect(bx, m.y0 - 2, bw, 16);
    ctx.fillStyle = '#F5F2EA';
    ctx.textAlign = 'center';
    ctx.fillText(badge, bx + bw / 2, m.y0 + 9);
    ctx.restore();

    /* Ca(OH)₂ 子图 */
    var cymax = 0.2;
    text(T('Ca(OH)₂ 单独坐标 · 0–0.20 g'), s.x0, s.y0 - 7, '#B24A20', '9px ui-monospace,Menlo,monospace', 'left');
    ctx.save();
    ctx.strokeStyle = 'rgba(23,27,29,.075)';
    for (var i = 0; i <= 4; i++) {
      var yy = s.y0 + (s.y1 - s.y0) * i / 4;
      ctx.beginPath(); ctx.moveTo(s.x0, yy); ctx.lineTo(s.x1, yy); ctx.stroke();
    }
    ctx.restore();
    text('0.20', s.x0 - 9, s.y0 + 4, '#8D9698', '8px ui-monospace,Menlo,monospace', 'right');
    text('0.10', s.x0 - 9, (s.y0 + s.y1) / 2 + 3, '#8D9698', '8px ui-monospace,Menlo,monospace', 'right');
    text('0', s.x0 - 9, s.y1 + 3, '#8D9698', '8px ui-monospace,Menlo,monospace', 'right');
    [0, 25, 50, 75, 100].forEach(function (t) {
      text(String(t), sx(s, t), s.y1 + 13, '#B7B2A5', '8px ui-monospace,Menlo,monospace', 'center');
    });
    curve(s, 'CaOH2', cymax);
    dot(sx(s, Tc), sy(s, C.solAt('CaOH2', Tc), cymax), '#B24A20', 3);
    line(sx(s, Tc), s.y0, sx(s, Tc), s.y1, 'rgba(178,74,32,.35)', 1, [3, 4]);
    text('Ca(OH)₂', s.x1 - 4, s.y0 + 11, '#B24A20', '600 9px ui-monospace,Menlo,monospace', 'right');
  }

  /* ---------------- 状态判定模式 ---------------- */
  function drawState() {
    var R = rect(), m = R.main;
    var key = state.sub;
    var ymax = yMaxOf(key);
    var stepY = ymax <= 1 ? 0.05 : 50;
    var S = C.solAt(key, state.pointT);

    gridMain(m, ymax, stepY, 20);
    axisTitles(m, false);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx(m, 0), sy(m, 0, ymax));
    for (var t = 0; t <= 100; t += 1) {
      ctx.lineTo(sx(m, t), sy(m, Math.min(C.solAt(key, t), ymax), ymax));
    }
    ctx.lineTo(sx(m, 100), sy(m, 0, ymax));
    ctx.closePath();
    ctx.fillStyle = 'rgba(14,122,87,.055)';
    ctx.fill();
    ctx.restore();

    curve(m, key, ymax);
    text(C.SOL[key].formula, m.x1 - 6, Math.max(m.y0 + 12, sy(m, Math.min(C.solAt(key, 100), ymax), ymax) - 8),
      C.SOL[key].css, '600 11px ui-monospace,Menlo,monospace', 'right');

    var px = sx(m, state.pointT);
    var py = sy(m, Math.min(state.pointM, ymax), ymax);
    line(m.x0, py, px, py, 'rgba(23,27,29,.28)', 1, [2, 4]);
    line(px, m.y1, px, py, 'rgba(23,27,29,.28)', 1, [2, 4]);

    var sy0 = sy(m, Math.min(S, ymax), ymax);
    line(px - 7, sy0, px + 7, sy0, 'rgba(23,27,29,.45)', 1);

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(14,122,87,.10)';
    ctx.fill();
    ctx.restore();
    dot(px, py, '#171B1D', 5);

    var label = 'T = ' + C.fmt(state.pointT, 0) + ' °C,  m = ' + C.fmt(state.pointM, ymax <= 1 ? 2 : 1) + ' g';
    text(label, C.clamp(px + 12, m.x0 + 4, m.x1 - 4), C.clamp(py - 12, m.y0 + 12, m.y1 - 4),
      '#171B1D', '9px ui-monospace,Menlo,monospace', px > m.x1 - 180 ? 'right' : 'left');
  }

  function draw() {
    if (!ctx || !W || !H) return;
    ctx.clearRect(0, 0, W, H);
    if (state.mode === 'compare') drawCompare();
    else drawState();
  }

  /* ---------------- 读数面板 ---------------- */
  function updateReadout() {
    if (!els.readout) return;
    if (state.mode === 'compare') {
      var Tc = state.cursorT;
      var html = '<div class="row"><span>' + T('当前温度') + '</span><b>' + Math.round(Tc) + ' °C</b></div>';
      ['KNO3', 'NH4Cl', 'NaCl', 'CaOH2'].forEach(function (k) {
        var v = C.solAt(k, Tc);
        html += '<div class="row"><span style="color:' + C.SOL[k].css + '">' + C.SOL[k].formula + '</span><b>' +
          (v < 1 ? v.toFixed(3) : v.toFixed(1)) + '</b></div>';
      });
      els.readout.innerHTML = html;
      els.verdict.hidden = true;
    } else {
      var S = C.solAt(state.sub, state.pointT);
      var m = state.pointM;
      els.readout.innerHTML =
        '<div class="row"><span>' + T('温度 T') + '</span><b>' + C.fmt(state.pointT, 0) + ' °C</b></div>' +
        '<div class="row"><span>' + T('溶解度 S') + '</span><b>' + C.fmt(S, S < 1 ? 3 : 1) + ' g</b></div>' +
        '<div class="row"><span>' + T('设定溶质质量') + '</span><b>' + C.fmt(m, S < 1 ? 2 : 1) + ' g</b></div>' +
        '<div class="row"><span>' + T('溶剂') + '</span><b>' + T('100 g 水') + '</b></div>';
      els.verdict.hidden = false;

      var cls, title, note;
      if (m < S - 0.02) {
        cls = 'is-unsat';
        title = T('不饱和溶液');
        note = T('还能继续溶解约 {n} g {x}。', { n: C.fmt(S - m, S < 1 ? 3 : 1), x: subName(state.sub) });
      } else if (Math.abs(m - S) <= 0.02) {
        cls = 'is-sat';
        title = T('恰好饱和');
        note = T('溶质质量正好等于该温度下的溶解度，再加就会有固体剩余。');
      } else {
        cls = 'is-over';
        title = T('饱和溶液 · 有剩余');
        note = T('最多只能溶解 {s} g，剩余 {r} g 未溶解。', {
          s: C.fmt(S, S < 1 ? 3 : 1), r: C.fmt(m - S, S < 1 ? 3 : 1)
        });
      }
      els.verdict.className = 'chart-verdict ' + cls;
      els.verdict.innerHTML = '<b>' + title + '</b>　' + note;
    }
  }

  /* ---------------- 交互 ---------------- */
  function pos(e) {
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function wire() {
    canvas.addEventListener('pointermove', function (e) {
      var p = pos(e), R = rect();
      if (state.mode === 'compare') {
        state.cursorT = invX(R.main, p.x);
        draw(); updateReadout();
      } else if (state.dragging) {
        state.pointT = invX(R.main, p.x);
        state.pointM = invY(R.main, p.y, yMaxOf(state.sub));
        draw(); updateReadout();
      }
    });
    canvas.addEventListener('pointerdown', function (e) {
      if (state.mode !== 'state') return;
      var p = pos(e), R = rect();
      state.dragging = true;
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      state.pointT = invX(R.main, p.x);
      state.pointM = invY(R.main, p.y, yMaxOf(state.sub));
      draw(); updateReadout();
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      canvas.addEventListener(ev, function () { state.dragging = false; });
    });
    canvas.addEventListener('pointerleave', function () {
      if (state.mode === 'compare') {
        state.cursorT = 40;
        draw(); updateReadout();
      }
    });
    canvas.addEventListener('keydown', function (e) {
      var k = e.key;
      if (state.mode === 'compare') {
        if (k === 'ArrowLeft' || k === 'ArrowRight') {
          state.cursorT = C.clamp(state.cursorT + (k === 'ArrowLeft' ? -2 : 2), 0, 100);
          draw(); updateReadout(); e.preventDefault();
        }
        return;
      }
      var stepT = k === 'ArrowLeft' ? -2 : k === 'ArrowRight' ? 2 : 0;
      var stepM = 0;
      var mStep = state.sub === 'CaOH2' ? 0.01 : 2;
      if (k === 'ArrowUp') stepM = mStep;
      if (k === 'ArrowDown') stepM = -mStep;
      if (stepT || stepM) {
        state.pointT = C.clamp(state.pointT + stepT, 0, 100);
        state.pointM = C.clamp(state.pointM + stepM, 0, yMaxOf(state.sub));
        draw(); updateReadout(); e.preventDefault();
      }
    });

    document.querySelectorAll('#chart-mode button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.mode = btn.dataset.mode;
        document.querySelectorAll('#chart-mode button').forEach(function (b) {
          b.setAttribute('aria-selected', String(b === btn));
        });
        els.subRow.hidden = state.mode !== 'state';
        els.tip.textContent = state.mode === 'compare'
          ? T('移动指针读取任意温度下的溶解度（触屏可直接拖动）')
          : T('拖动黑色圆点，同时改变温度与溶质质量');
        if (state.mode === 'state') {
          state.pointM = +(C.solAt(state.sub, state.pointT).toFixed(1) * 0.75);
        }
        draw(); updateReadout();
      });
    });

    els.sub.addEventListener('change', function () {
      state.sub = els.sub.value;
      var S = C.solAt(state.sub, state.pointT);
      state.pointM = +(S * 0.75).toFixed(state.sub === 'CaOH2' ? 2 : 1);
      draw(); updateReadout();
    });

    I18N.on(function () {
      els.tip.textContent = state.mode === 'compare'
        ? T('移动指针读取任意温度下的溶解度（触屏可直接拖动）')
        : T('拖动黑色圆点，同时改变温度与溶质质量');
      draw();
      updateReadout();
    });
  }

  function init() {
    canvas = document.getElementById('solubility-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    els.readout = document.getElementById('chart-readout');
    els.verdict = document.getElementById('chart-verdict');
    els.tip = document.getElementById('chart-tip');
    els.sub = document.getElementById('chart-sub');
    els.subRow = document.getElementById('chart-sub-row');

    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);

    wire();
    inited = true;
    requestAnimationFrame(resize);
  }

  window.VIEWS.solubility = {
    init: init,
    enter: function () { if (inited) { resize(); updateReadout(); } }
  };
})();
