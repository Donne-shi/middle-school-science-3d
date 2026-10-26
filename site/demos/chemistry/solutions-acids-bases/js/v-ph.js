/* ==========================================================================
   v-ph.js — pH 色带、烧杯与指示剂读数
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;
  if (!C) return;

  /* 0–14 通用指示剂色带 */
  var STOPS = [
    [0, '#B3241B'], [1, '#C8402A'], [2, '#D9584A'], [3, '#D9772F'],
    [4, '#D4952F'], [5, '#C9A03C'], [6, '#A8B43C'], [7, '#4FA96B'],
    [8, '#2F9E8F'], [9, '#2A87A6'], [10, '#2E6F9E'], [11, '#2E5F9E'],
    [12, '#33488F'], [13, '#3A3A85'], [14, '#2B2A6E']
  ];

  var SAMPLES = [
    { zh: '胃液', en: 'Gastric juice', v: 1.5, f: 'HCl' },
    { zh: '柠檬汁', en: 'Lemon juice', v: 2.4, f: 'C₆H₈O₇' },
    { zh: '食醋', en: 'Vinegar', v: 3.0, f: 'CH₃COOH' },
    { zh: '雨水', en: 'Rain water', v: 5.6, f: 'CO₂ / H₂O' },
    { zh: '纯水', en: 'Pure water', v: 7.0, f: 'H₂O' },
    { zh: '食盐水', en: 'Salt water', v: 7.0, f: 'NaCl' },
    { zh: '肥皂水', en: 'Soap water', v: 9.8, f: '—' },
    { zh: '石灰水', en: 'Limewater', v: 12.4, f: 'Ca(OH)₂' }
  ];

  var state = { ph: 7, sample: 4 };
  var els = {};
  var lastKey = '';

  function colorAt(ph) {
    ph = C.clamp(ph, 0, 14);
    for (var i = 0; i < STOPS.length - 1; i++) {
      if (ph >= STOPS[i][0] && ph <= STOPS[i + 1][0]) {
        var t = (ph - STOPS[i][0]) / (STOPS[i + 1][0] - STOPS[i][0]);
        return mixHex(STOPS[i][1], STOPS[i + 1][1], t);
      }
    }
    return STOPS[14][1];
  }

  function mixHex(a, b, t) {
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    var r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    var g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    var bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  function litmusOf(ph) {
    if (ph < 5.4) return { txt: T('变红'), color: '#C8402A', note: T('酸性越强，红色越深') };
    if (ph > 7.6) return { txt: T('变蓝'), color: '#2E6F9E', note: T('碱性越强，蓝色越深') };
    return { txt: T('紫色'), color: '#7A6FA0', note: T('接近中性，石蕊保持本色') };
  }

  function phenOf(ph) {
    if (ph < 8.2) return { txt: T('无色'), color: '#DCD8CB', note: T('pH 小于 8.2 时酚酞不显色') };
    if (ph < 10) return { txt: T('浅红色'), color: '#D9738C', note: T('pH 8.2–10 之间呈浅红') };
    return { txt: T('深红色'), color: '#C0405C', note: T('碱性增强，红色加深') };
  }

  function natureOf(ph) {
    if (ph < 6.9) return { txt: T('酸性'), note: T('[H⁺] 大于 [OH⁻]') };
    if (ph > 7.1) return { txt: T('碱性'), note: T('[OH⁻] 大于 [H⁺]') };
    return { txt: T('中性'), note: T('[H⁺] = [OH⁻]') };
  }

  function render() {
    var ph = state.ph;
    var key = ph.toFixed(1) + '|' + I18N.lang;
    if (key === lastKey) return;
    lastKey = key;

    var col = colorAt(ph);
    els.liquid.style.background = col;
    els.marker.style.left = (ph / 14 * 100) + '%';
    els.markerLabel.textContent = ph.toFixed(1);
    els.out.textContent = ph.toFixed(1);

    var lit = litmusOf(ph), phe = phenOf(ph), nat = natureOf(ph);
    els.litmus.textContent = lit.txt;
    els.litmusNote.textContent = lit.note;
    els.litmusDot.style.background = lit.color;

    els.phen.textContent = phe.txt;
    els.phenNote.textContent = phe.note;
    els.phenDot.style.background = phe.color;

    els.nature.textContent = nat.txt;
    els.natureNote.textContent = nat.note;
    els.natureDot.style.background = col;

    document.querySelectorAll('#ph-samples .chip').forEach(function (c, i) {
      c.classList.toggle('is-on', i === state.sample && Math.abs(SAMPLES[i].v - ph) < 0.05);
    });
  }

  function buildSamples() {
    var box = document.getElementById('ph-samples');
    if (!box) return;
    box.innerHTML = SAMPLES.map(function (s, i) {
      return '<button type="button" class="chip" data-i="' + i + '">' +
        '<b>' + (I18N.isEN ? s.en : s.zh) + '</b><small>pH ' + s.v.toFixed(1) + '</small></button>';
    }).join('');
    box.querySelectorAll('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        state.sample = i;
        state.ph = SAMPLES[i].v;
        els.range.value = SAMPLES[i].v;
        render();
      });
    });
  }

  function init() {
    if (!document.getElementById('ph-range')) return;
    els.range = document.getElementById('ph-range');
    els.out = document.getElementById('ph-out');
    els.liquid = document.getElementById('ph-liquid');
    els.marker = document.getElementById('ph-marker');
    els.markerLabel = document.getElementById('ph-marker-label');
    els.litmus = document.getElementById('read-litmus');
    els.litmusNote = document.getElementById('read-litmus-note');
    els.litmusDot = document.getElementById('read-litmus-dot');
    els.phen = document.getElementById('read-phen');
    els.phenNote = document.getElementById('read-phen-note');
    els.phenDot = document.getElementById('read-phen-dot');
    els.nature = document.getElementById('read-nature');
    els.natureNote = document.getElementById('read-nature-note');
    els.natureDot = document.getElementById('read-nature-dot');

    buildSamples();

    els.range.addEventListener('input', function () {
      state.ph = +els.range.value;
      state.sample = -1;
      render();
    });

    I18N.on(function () {
      buildSamples();
      lastKey = '';
      render();
    });

    render();
  }

  window.VIEWS.ph = {
    init: init,
    enter: function () { if (els.range) { lastKey = ''; render(); } }
  };
})();
