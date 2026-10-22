// Keep this standalone lesson aligned with the discovery center's language and navigation.
(function () {
  const key = 'newton-garage-lang';
  const originalSetLanguage = window.setLanguage;

  function siteLanguage(lang) {
    return lang === 'en' ? 'en' : 'zh';
  }

  function sync(lang) {
    const siteLang = siteLanguage(lang);
    const back = document.getElementById('scienceBack');
    document.documentElement.lang = siteLang === 'en' ? 'en' : 'zh-CN';
    document.title = (siteLang === 'en' ? 'Atomic Atlas' : '原子图鉴') +
      ' · ' + (siteLang === 'en' ? 'Newton Science Discovery Center' : '牛顿科学探索馆');
    document.querySelector('.brand-zh').textContent = siteLang === 'en' ? 'Atomic Atlas' : '原子图鉴';
    document.querySelector('.brand-en').textContent = siteLang === 'en' ?
      'NEWTON SCIENCE DISCOVERY CENTER' : '牛顿科学探索馆 / ATOMIC ATLAS';
    document.querySelector('.intro-count').firstChild.textContent = siteLang === 'en' ?
      '12 INTERACTIVE VIEWS ' : '12 个交互视图 ';
    back.textContent = siteLang === 'en' ? '← Back to Atomic Structure' : '← 返回原子结构';
    back.href = '../../../topics/chemistry/atomic-structure/index.html' +
      (siteLang === 'en' ? '?lang=en' : '');
    document.querySelectorAll('#btnLangBi, #btnLangZh, #btnLangEn').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    });
    try { window.localStorage.setItem(key, siteLang); } catch (_) { /* file previews can block storage */ }
  }

  window.setLanguage = function (lang) {
    originalSetLanguage(lang);
    sync(lang);
  };

  window.addEventListener('DOMContentLoaded', function () {
    const query = new URLSearchParams(window.location.search).get('lang');
    let lang = query === 'en' || query === 'zh' ? query : 'zh';
    if (!query) {
      try {
        const saved = window.localStorage.getItem(key);
        if (saved === 'en' || saved === 'zh') lang = saved;
      } catch (_) { /* use Chinese default */ }
    }
    window.setLanguage(lang);
  });
}());
