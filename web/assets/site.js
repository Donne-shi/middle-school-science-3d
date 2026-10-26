// Shared language switch for every Newton Science Discovery Center page.
(function () {
  const key = 'newton-garage-lang'; // Shared with the standalone Newton's Garage lesson.
  const root = document.documentElement;
  const button = document.getElementById('language-switch');
  if (!button) return;

  function savedLanguage() {
    const query = new URLSearchParams(window.location.search).get('lang');
    if (query === 'zh' || query === 'zh-CN') return 'zh';
    if (query === 'en') return query;
    try {
      const saved = window.localStorage.getItem(key);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (_) { /* file previews may block storage */ }
    return 'zh';
  }

  function updateLinks(lang) {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const base = anchor.dataset.baseHref || anchor.getAttribute('href');
      if (!base) return;
      anchor.dataset.baseHref = base;
      let url;
      try { url = new URL(base, window.location.href); } catch (_) { return; }
      if (url.origin !== window.location.origin) return;
      const params = url.searchParams;
      if (lang === 'en') params.set('lang', 'en');
      else params.delete('lang');
      anchor.setAttribute('href', url.pathname + (params.size ? '?' + params.toString() : '') + url.hash);
    });
  }

  function apply(lang) {
    root.lang = lang === 'en' ? 'en' : 'zh-CN';
    root.dataset.lang = lang;
    document.querySelectorAll('[data-zh][data-en]').forEach((element) => {
      if (element.tagName === 'META') element.setAttribute('content', element.dataset[lang]);
      else element.textContent = element.dataset[lang];
    });
    document.querySelectorAll('[data-aria-zh][data-aria-en]').forEach((element) => {
      element.setAttribute('aria-label', element.dataset[lang === 'en' ? 'ariaEn' : 'ariaZh']);
    });
    document.title = (lang === 'en' ? root.dataset.titleEn : root.dataset.titleZh) + ' · ' +
      (lang === 'en' ? 'Newton Science Discovery Center' : '牛顿科学探索馆');
    button.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : '切换为英文');
    button.setAttribute('aria-pressed', String(lang === 'en'));
    updateLinks(lang);
    try { window.localStorage.setItem(key, lang); } catch (_) { /* query links keep the choice */ }
  }

  button.addEventListener('click', () => apply(root.dataset.lang === 'en' ? 'zh' : 'en'));
  apply(savedLanguage());
}());
