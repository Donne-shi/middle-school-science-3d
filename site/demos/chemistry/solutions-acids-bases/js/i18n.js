/* ==========================================================================
   i18n.js — 以中文原文为键的中英切换
   静态文案：在元素上加 data-i18n（纯文本）或 data-i18n-html（含标记）
   动态文案：JS 里用 T('中文原文', {n: 1}) 取值
   ========================================================================== */
(function () {
  'use strict';

  var EN = window.EN_DICT = window.EN_DICT || {};
  var lang = 'zh';
  var KEY = 'chem.lang';
  var HOOKS = window.CHEMI18N_HOOKS = window.CHEMI18N_HOOKS || [];

  try {
    var saved = window.localStorage && localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'zh') lang = saved;
  } catch (e) { /* 隐私模式下忽略 */ }

  function interpolate(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, function (m, k) {
      return vars[k] == null ? m : String(vars[k]);
    });
  }

  var MISS = window.__chemMissT = window.__chemMissT || {};

  function T(str, vars) {
    if (lang === 'zh' && str && !EN[str]) MISS[str] = 1;
    var out = (lang === 'en' && EN[str]) || str;
    return interpolate(out, vars);
  }

  function applyOne(el) {
    var html = el.hasAttribute('data-i18n-html');
    if (el.__zhSrc == null) {
      el.__zhSrc = (html ? el.innerHTML : el.textContent).trim();
    }
    var src = el.__zhSrc;
    if (!src) return;
    var val = (lang === 'en' && EN[src]) || src;
    if (html) el.innerHTML = val;
    else el.textContent = val;
  }

  function apply(root) {
    (root || document).querySelectorAll('[data-i18n],[data-i18n-html]').forEach(applyOne);
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    document.documentElement.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-btn') === lang));
    });
  }

  function set(next) {
    lang = next === 'en' ? 'en' : 'zh';
    try { localStorage && localStorage.setItem(KEY, lang); } catch (e) {}
    apply();
    HOOKS.forEach(function (fn) { try { fn(lang); } catch (e) {} });
  }

  window.T = T;
  window.I18N = {
    get lang() { return lang; },
    get isEN() { return lang === 'en'; },
    t: T,
    apply: apply,
    set: set,
    toggle: function () { set(lang === 'en' ? 'zh' : 'en'); },
    on: function (fn) { HOOKS.push(fn); },
    /* 缺少英文词条时的自查：静态文案 + 运行时 T() 用到的原文 */
    missing: function () {
      var out = [];
      document.querySelectorAll('[data-i18n],[data-i18n-html]').forEach(function (el) {
        var src = el.__zhSrc != null ? el.__zhSrc
          : (el.hasAttribute('data-i18n-html') ? el.innerHTML : el.textContent).trim();
        if (src && !EN[src]) out.push(src);
      });
      Object.keys(MISS).forEach(function (k) { if (!EN[k]) out.push('T:' + k); });
      return out.filter(function (v, i, a) { return a.indexOf(v) === i; });
    }
  };
})();
