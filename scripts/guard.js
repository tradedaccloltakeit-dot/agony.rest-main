/* #agony — casual anti-inspect layer.
   Client-side deterrent only: it cannot stop view-source, curl, a disabled
   JS runtime, or anyone who reads this file. It exists so idle visitors stop
   poking at the page, not as real content protection.

   There is deliberately no `debugger` loop: an unconditional one freezes the
   page for every attached debugger (it also froze this site in the preview,
   where outerWidth/innerHeight report odd values), so detection is limited
   to a docked devtools panel and only blurs the page. */
(function () {
  'use strict';

  const guard = document.getElementById('guard');
  const reloadBtn = document.getElementById('guard-reload');
  let tripped = false;

  function trip() {
    if (tripped) return;
    tripped = true;
    document.body.classList.add('held');
    if (guard) guard.hidden = false;
    const bgm = document.getElementById('bgm');
    if (bgm && !bgm.paused) bgm.pause();
  }

  /* right-click menu */
  addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });

  /* dragging images or selected text out of the page */
  addEventListener('dragstart', (e) => e.preventDefault(), { capture: true });

  /* the usual devtools / view-source shortcuts */
  const BLOCKED = new Set(['i', 'j', 'c', 'k', 'e']);
  addEventListener(
    'keydown',
    (e) => {
      const key = (e.key || '').toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      const blocked =
        e.key === 'F12' ||
        (mod && e.shiftKey && BLOCKED.has(key)) ||
        (mod && !e.shiftKey && (key === 'u' || key === 's'));
      if (!blocked) return;
      e.preventDefault();
      e.stopPropagation();
    },
    { capture: true }
  );

  /* devtools detection: a docked panel changes the window/viewport gap.
     Embedded frames and headless shells report 0 or equal sizes, so those are
     ignored — never trip on a sane window. */
  const coarse = matchMedia('(pointer: coarse)').matches;
  let strikes = 0;

  function gapOpen() {
    const ow = window.outerWidth;
    const oh = window.outerHeight;
    const iw = window.innerWidth;
    const ih = window.innerHeight;
    if (!(ow > 0 && oh > 0 && iw > 0 && ih > 0)) return false;
    if (ow < 480 || oh < 480) return false;
    return ow - iw > 180 || oh - ih > 220;
  }

  if (!coarse) {
    setInterval(() => {
      if (tripped || document.hidden) return;
      if (gapOpen()) {
        strikes += 1;
        if (strikes >= 3) trip();
      } else {
        strikes = 0;
      }
    }, 900);
  }

  if (reloadBtn) reloadBtn.addEventListener('click', () => location.reload());

  /* the overlay should survive a visitor just hiding the node */
  const observer = new MutationObserver(() => {
    if (!tripped) return;
    if (guard && guard.hidden) guard.hidden = false;
    if (!document.body.classList.contains('held')) document.body.classList.add('held');
  });
  if (guard) observer.observe(guard, { attributes: true, attributeFilter: ['hidden'] });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
