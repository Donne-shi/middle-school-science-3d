/* ==========================================================================
   v-quiz.js — 自测
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CHEM;

  var QS = [
    {
      zh: '下列物质中，属于溶液的是：',
      en: 'Which of the following is a solution?',
      opts: [
        { zh: '泥水', en: 'Muddy water' },
        { zh: '生理盐水', en: 'Normal saline' },
        { zh: '油水混合物', en: 'Oil–water mixture' },
        { zh: '石灰浆', en: 'Lime slurry' }
      ],
      ans: 1,
      exp: {
        zh: '溶液是均一、稳定的混合物。泥水与石灰浆是悬浊液，油水是乳浊液，静置都会分层或沉淀。',
        en: 'A solution is homogeneous and stable. Muddy water and lime slurry are suspensions; oil–water is an emulsion — both separate on standing.'
      }
    },
    {
      zh: '20 °C 时 NaCl 的溶解度为 36 g。向 100 g 水中加入 40 g NaCl，充分搅拌后所得溶液的质量是：',
      en: 'At 20 °C the solubility of NaCl is 36 g. 40 g of NaCl is stirred into 100 g of water. The mass of the resulting solution is:',
      opts: [
        { zh: '140 g', en: '140 g' },
        { zh: '136 g', en: '136 g' },
        { zh: '100 g', en: '100 g' },
        { zh: '40 g', en: '40 g' }
      ],
      ans: 1,
      exp: {
        zh: '100 g 水最多只能溶解 36 g，剩下的 4 g 沉在杯底，不算溶液的一部分。溶液质量 = 100 + 36 = 136 g。',
        en: 'Only 36 g can dissolve in 100 g of water; the other 4 g settles out and is not part of the solution. Mass = 100 + 36 = 136 g.'
      }
    },
    {
      zh: '用激光笔分别照射下列液体，从侧面能明显看到一条光路的是：',
      en: 'A laser pointer shines through each liquid. In which one is the beam clearly visible from the side?',
      opts: [
        { zh: '食盐水', en: 'Salt water' },
        { zh: '稀盐酸', en: 'Dilute hydrochloric acid' },
        { zh: '泥水', en: 'Muddy water' },
        { zh: '蔗糖水', en: 'Sugar water' }
      ],
      ans: 2,
      exp: {
        zh: '这就是丁达尔效应。泥水中的固体颗粒直径远大于 1 nm，能把光散射到侧面；溶液中的粒子太小，光几乎径直穿过。',
        en: 'This is the Tyndall effect. The particles in muddy water are far larger than 1 nm and scatter light sideways; in a solution they are too small to scatter.'
      }
    },
    {
      zh: '关于醋酸（CH₃COOH）溶液，下列说法正确的是：',
      en: 'Which statement about an acetic acid (CH₃COOH) solution is correct?',
      opts: [
        { zh: '溶液中只有 H⁺ 和 CH₃COO⁻', en: 'Only H⁺ and CH₃COO⁻ are present' },
        { zh: '醋酸分子全部电离', en: 'Every molecule ionizes' },
        { zh: '只有少量分子电离，溶液中还有大量 CH₃COOH 分子', en: 'Only a small fraction ionizes; most stays as CH₃COOH' },
        { zh: '电离方程式应写成 CH₃COOH = CH₃COO⁻ + H⁺', en: 'It should be written CH₃COOH = CH₃COO⁻ + H⁺' }
      ],
      ans: 2,
      exp: {
        zh: '醋酸是弱电解质，只有很少一部分分子电离，大部分仍以分子形式存在，且电离是可逆的，要写「⇌」。',
        en: 'Acetic acid is a weak electrolyte: only a small fraction ionizes, most remains as molecules, and the process is reversible — write "⇌".'
      }
    },
    {
      zh: '硫酸在水中的电离，正确的说法是：',
      en: 'Which statement about the ionization of sulfuric acid in water is correct?',
      opts: [
        { zh: '一步完全电离成 2H⁺ 和 SO₄²⁻', en: 'One complete step to 2H⁺ and SO₄²⁻' },
        { zh: '第一步完全，第二步 HSO₄⁻ ⇌ H⁺ + SO₄²⁻ 只部分进行', en: 'First step complete; HSO₄⁻ ⇌ H⁺ + SO₄²⁻ only partly proceeds' },
        { zh: '两步都只能部分进行', en: 'Both steps are partial' },
        { zh: '硫酸是弱酸', en: 'Sulfuric acid is a weak acid' }
      ],
      ans: 1,
      exp: {
        zh: '第一步 H₂SO₄ = H⁺ + HSO₄⁻ 完全进行；第二步 HSO₄⁻ ⇌ H⁺ + SO₄²⁻ 是可逆的，只有一部分 HSO₄⁻ 继续电离。',
        en: 'The first step goes to completion; the second, HSO₄⁻ ⇌ H⁺ + SO₄²⁻, is reversible and only partly proceeds.'
      }
    },
    {
      zh: '把 50 mL 0.1 mol/L 盐酸与 50 mL 0.1 mol/L 氢氧化钠溶液混合，所得溶液的 pH 约为：',
      en: '50 mL of 0.1 mol/L HCl is mixed with 50 mL of 0.1 mol/L NaOH. The pH is about:',
      opts: [
        { zh: '1', en: '1' },
        { zh: '7', en: '7' },
        { zh: '13', en: '13' },
        { zh: '0', en: '0' }
      ],
      ans: 1,
      exp: {
        zh: 'n(HCl) = n(NaOH) = 0.005 mol，恰好完全中和，溶液中只剩 NaCl，呈中性，pH = 7。',
        en: 'n(HCl) = n(NaOH) = 0.005 mol — exactly neutralized. Only NaCl remains, so pH = 7.'
      }
    }
  ];

  var answers = [];
  var list = null;

  function L(o) { return I18N.isEN ? o.en : o.zh; }

  function render() {
    if (!list) return;
    var correct = 0, done = 0;

    var html = QS.map(function (q, qi) {
      var picked = answers[qi];
      var answered = picked != null;
      if (answered) { done++; if (picked === q.ans) correct++; }
      var opts = q.opts.map(function (o, oi) {
        var cls = 'opt';
        if (answered) {
          if (oi === q.ans) cls += ' is-correct';
          else if (oi === picked) cls += ' is-wrong';
        }
        return '<button type="button" class="' + cls + '" data-q="' + qi + '" data-o="' + oi + '"' +
          (answered ? ' disabled' : '') + '><b>' + 'ABCD'[oi] + '</b><span>' + L(o) + '</span></button>';
      }).join('');

      return '<article class="quiz-item">' +
        '<div class="q-head"><span class="q-no">Q' + ('0' + (qi + 1)).slice(-2) + '</span>' +
        '<p class="q-text">' + L(q) + '</p></div>' +
        '<div class="q-options">' + opts + '</div>' +
        '<div class="q-explain' + (answered ? ' show' : '') + '">' + L(q.exp) + '</div>' +
        '</article>';
    }).join('');

    html += '<div class="q-score"><span>' +
      T('已答 {d} / {n} 题 · 答对 {c} 题 · 每题只有一次机会', { d: done, n: QS.length, c: correct }) +
      '</span><button type="button" class="q-reset">' + T('重新作答') + '</button></div>';

    list.innerHTML = html;

    list.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var qi = +b.getAttribute('data-q');
        if (answers[qi] != null) return;
        answers[qi] = +b.getAttribute('data-o');
        render();
      });
    });
    var reset = list.querySelector('.q-reset');
    if (reset) reset.addEventListener('click', function () {
      answers = [];
      render();
    });
  }

  function init() {
    list = document.getElementById('quiz-list');
    if (!list) return;
    answers = [];
    render();
    I18N.on(render);
  }

  window.VIEWS.quiz = {
    init: init,
    enter: function () { if (list && !list.children.length) render(); }
  };
})();
