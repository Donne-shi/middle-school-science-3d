// Homepage opening. Keep the site usable if storage or motion APIs are unavailable.
(function () {
  const intro = document.getElementById('site-intro');
  const skip = document.getElementById('intro-skip');
  const replay = document.getElementById('replay-intro');
  if (!intro || !skip || !replay) return;

  const key = 'science-site-intro-seen';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;

  function remember() {
    try { sessionStorage.setItem(key, '1'); } catch (_) { /* file previews may block storage */ }
  }

  function dismiss() {
    clearTimeout(timer);
    intro.classList.add('is-leaving');
    document.documentElement.classList.remove('intro-playing');
    if (intro.contains(document.activeElement)) replay.focus();
    remember();
    window.setTimeout(() => { intro.hidden = true; }, reducedMotion ? 0 : 520);
  }

  function play(fromReplay) {
    clearTimeout(timer);
    intro.hidden = false;
    intro.classList.remove('is-leaving');
    document.documentElement.classList.add('intro-playing');
    if (fromReplay) skip.focus();
    timer = window.setTimeout(dismiss, reducedMotion ? 850 : 3300);
  }

  skip.addEventListener('click', dismiss);
  replay.addEventListener('click', () => play(true));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !intro.hidden) dismiss();
  });

  let seen = false;
  try { seen = sessionStorage.getItem(key) === '1'; } catch (_) { /* play on each open */ }
  if (seen) intro.hidden = true;
  else play();
}());
