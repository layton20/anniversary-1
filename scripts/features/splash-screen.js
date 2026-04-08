(function () {
  'use strict';

  var splash      = document.getElementById('splashScreen');
  var continueBtn = document.getElementById('splashContinueBtn');
  var eyebrow     = document.getElementById('splashEyebrow');
  var mobileNote  = document.getElementById('splashMobileNotice');
  if (!splash) return;

  // ── Mobile / tablet detection ────────────────────────────────────────────
  // Treat as non-desktop if the device has coarse touch AND a narrow viewport.
  // matchMedia pointer:coarse catches touch screens; width < 1024px excludes
  // large-screen touch devices (e.g. Surface in desktop mode).
  function isMobileOrTablet() {
    var coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    var narrowScreen  = window.innerWidth < 1024;
    return coarsePointer && narrowScreen;
  }

  // Block page scroll while splash is visible
  document.body.style.overflow = 'hidden';

  if (isMobileOrTablet()) {
    // ── Mobile path: lock splash, swap content ───────────────────────────
    if (eyebrow)    eyebrow.textContent = 'Oops!';
    if (continueBtn) continueBtn.hidden = true;
    if (mobileNote)  mobileNote.hidden  = false;
    // Do NOT attach any dismiss handlers — splash stays up permanently
    return;
  }

  // ── Desktop path: normal dismissal ──────────────────────────────────────
  var dismissed = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;

    splash.classList.add('is-leaving');
    setTimeout(function () {
      splash.classList.add('is-gone');
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('splashDismissed'));
    }, 600);
  }

  continueBtn && continueBtn.addEventListener('click', dismiss);
})();

