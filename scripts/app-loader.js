// App loader: consolidates script loading and enables on-demand feature lazy-loading
// Goals: improve initial paint by deferring heavy libs & feature scripts until first interaction

(function () {
  const LIBS = [
    'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.min.js',
    'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js',
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'
  ];

  const FEATURE_SCRIPTS = [
    'scripts/features/splash-screen.js',
    'scripts/features/queue-lobby.js',
    'scripts/features/phone-screen.js',
    'scripts/features/media-widgets.js',
    'scripts/features/hero-memory.js',
    'scripts/features/strawberry-desktop.js',
    'scripts/features/visual-effects.js',
    'scripts/features/gastronomy-gallery.js'
  ];

  function loadScript(src, { module = false, async = true } = {}) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      if (module) s.type = 'module';
      s.async = async;
      s.defer = true;
      s.onload = () => resolve(src);
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  // Load feature scripts and libs after the user first interacts (improves LCP and TTI)
  let initiated = false;
  function handleFirstInteraction() {
    if (initiated) return;
    initiated = true;
    window.removeEventListener('scroll', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
    window.removeEventListener('pointerdown', handleFirstInteraction);

    // Start loading libs in background (non-blocking)
    LIBS.forEach(u => loadScript(u).catch(e => console.warn(e)));

    // Load feature scripts (non-blocking) — they use defer so will execute when ready
    FEATURE_SCRIPTS.forEach(u => loadScript(u).catch(e => console.warn(e)));

    // Finally load the main entry that wires up cross-feature interactions
    loadScript('script.js').catch(e => console.warn(e));

    // Optional: register a basic service worker for offline caching (lightweight)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {/* ignore */});
    }
  }

  // Trigger loading after 1st interaction or after 4s as a fallback
  ['scroll', 'keydown', 'pointerdown', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, handleFirstInteraction, { passive: true, once: true })
  );
  setTimeout(handleFirstInteraction, 4000);

  // Smooth scroll and basic SPA-ish behavior
  document.documentElement.style.scrollBehavior = 'smooth';

  // Simple history navigation for deep-linking to sections (SPA-like)
  function onHashChange() {
    const id = location.hash && location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  window.addEventListener('hashchange', onHashChange);
  // If page opened with hash, scroll to it after small timeout allowing layout to settle
  if (location.hash) setTimeout(onHashChange, 600);

})();
