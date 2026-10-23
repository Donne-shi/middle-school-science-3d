(function () {
  'use strict';
  var back = document.getElementById('courseBack');
  if (!back) return;

  var requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'en' || requested === 'zh') {
    S.lang = requested;
    document.querySelectorAll('#lang button').forEach(function (button) {
      button.classList.toggle('on', button.dataset.l === requested);
    });
    langClass();
  }

  function updateBack() {
    back.textContent = S.lang === 'en' ? '← Back to Biology' : '← 返回生物学';
    back.href = '../../../subjects/biology/index.html' + (S.lang === 'en' ? '?lang=en' : '');
  }

  document.getElementById('lang').addEventListener('click', updateBack);
  updateBack();
}());
