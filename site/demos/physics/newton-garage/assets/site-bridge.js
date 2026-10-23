// Keep the integrated lesson's return link in the language selected in the lesson.
(function () {
  const back = document.querySelector('.science-back');
  if (!back) return;

  function update() {
    const lang = document.documentElement.dataset.lang === 'en' ? 'en' : 'zh';
    back.textContent = lang === 'en' ? '← Back to Physics' : '← 返回物理学';
    back.href = '../../../subjects/physics/index.html' + (lang === 'en' ? '?lang=en' : '');
  }

  update();
  document.querySelectorAll('#langToggle, #stageLangToggle').forEach((button) => {
    button.addEventListener('click', () => queueMicrotask(update));
  });
  window.addEventListener('load', update);
}());
