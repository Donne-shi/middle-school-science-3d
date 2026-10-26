/* ==========================================================================
   app.js — 路由、菜单、语言切换
   ========================================================================== */
(function () {
  'use strict';

  var MENU = '#menu';
  var views = {};           // name -> { init, enter, leave, lang, ready }
  var current = null;
  var inited = {};

  function modules() { return window.VIEWS || {}; }

  function menuBtn(name) {
    return document.querySelector(MENU + ' [data-view="' + name + '"]');
  }

  function syncCrumb(name) {
    var btn = menuBtn(name);
    if (!btn) return;
    document.getElementById('crumb-no').textContent = btn.querySelector('.mi-no').textContent;
    document.getElementById('crumb-name').textContent = btn.querySelector('.mi-name').textContent;
  }

  function go(name, opts) {
    if (!name || current === name) return;
    var mods = modules();
    var target = document.querySelector('.view[data-view="' + name + '"]');
    if (!target) return;

    if (current && mods[current] && mods[current].leave) {
      try { mods[current].leave(); } catch (e) {}
    }

    document.querySelectorAll('.view').forEach(function (v) {
      v.hidden = v.getAttribute('data-view') !== name;
      v.classList.toggle('is-on', v.getAttribute('data-view') === name);
    });
    document.querySelectorAll(MENU + ' .menu-item').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-view') === name);
    });

    current = name;
    syncCrumb(name);
    if (!opts || opts.scroll !== false) {
      var sc = document.getElementById('scroll');
      if (sc) sc.scrollTop = 0;
      window.scrollTo(0, 0);
    }

    var m = mods[name];
    if (m) {
      if (!inited[name] && m.init) {
        inited[name] = true;
        try { m.init(); } catch (e) { console.error('[view ' + name + ']', e); }
      }
      if (m.enter) {
        /* 等一帧，让隐藏视图拿到真实尺寸后再唤醒场景 */
        requestAnimationFrame(function () {
          try { m.enter(); } catch (e) { console.error('[view ' + name + ']', e); }
        });
      }
    }

    if (history.replaceState) {
      try { history.replaceState(null, '', '#' + name); } catch (e) {}
    } else {
      location.hash = name;
    }
  }

  /* ---------- 语言 ---------- */
  function wireLang() {
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.addEventListener('click', function () {
        var next = b.getAttribute('data-lang-btn');
        if (I18N.lang === next) return;
        I18N.set(next);
      });
    });
    I18N.on(function () {
      if (current) syncCrumb(current);
    });
  }

  /* ---------- 启动 ---------- */
  function boot() {
    wireLang();
    I18N.apply();

    document.querySelectorAll(MENU + ' .menu-item').forEach(function (b) {
      b.addEventListener('click', function () { go(b.getAttribute('data-view')); });
    });

    document.addEventListener('click', function (e) {
      var g = e.target.closest && e.target.closest('[data-goto]');
      if (g) go(g.getAttribute('data-goto'));
    });

    var start = (location.hash || '').replace('#', '');
    if (!menuBtn(start)) start = 'overview';
    go(start, { scroll: false });

    /* 支持直接改地址栏 / 浏览器前进后退 */
    window.addEventListener('hashchange', function () {
      var n = (location.hash || '').replace('#', '');
      if (n && n !== current && menuBtn(n)) go(n);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
