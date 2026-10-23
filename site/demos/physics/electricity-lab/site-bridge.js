// Keep the course return link in the language selected in this lesson.
(function () {
  'use strict';
  const back = document.getElementById('scienceBack');
  if (!back) return;

  function update() {
    const selected = document.querySelector('#langSwitch button.on');
    const lang = selected ? selected.dataset.lang : new URLSearchParams(location.search).get('lang');
    back.textContent = lang === 'en' ? '← Back to Physics' : '← 返回物理学';
    back.href = '../../../subjects/physics/index.html' + (lang === 'en' ? '?lang=en' : '');
  }

  document.querySelectorAll('#langSwitch button').forEach((button) => {
    button.addEventListener('click', () => queueMicrotask(update));
  });
  window.addEventListener('load', update);
  update();
}());
