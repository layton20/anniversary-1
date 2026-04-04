(() => {
  const openingOverlay = document.getElementById('openingOverlay');
  const digicamZoom = document.getElementById('digicamZoom');
  const digicamPanY = document.getElementById('digicamPanY');

  function isOpeningOverlayVisible() {
    if (!openingOverlay) return false;
    return !openingOverlay.classList.contains('hidden')
      && !openingOverlay.hidden
      && openingOverlay.getAttribute('aria-hidden') !== 'true';
  }

  function initDigicam() {
    const wrappers = document.querySelectorAll('.digicam-wrapper');
    if (!wrappers.length) return;

    const applyFitVars = () => {
      const zoomValue = digicamZoom ? Number(digicamZoom.value) : 1.22;
      const panYValue = digicamPanY ? Number(digicamPanY.value) : 40;

      wrappers.forEach((wrapper) => {
        wrapper.style.setProperty('--photo-scale', zoomValue.toFixed(2));
        wrapper.style.setProperty('--photo-y', `${panYValue}%`);
      });
    };

    digicamZoom?.addEventListener('input', applyFitVars);
    digicamPanY?.addEventListener('input', applyFitVars);
    applyFitVars();

    wrappers.forEach((wrapper) => {
      const strip = wrapper.querySelector('.digicam-strip');
      const flash = wrapper.querySelector('.digicam-flash');
      const counter = wrapper.querySelector('.digicam-counter');
      if (!strip || !flash || !counter) return;

      const photos = strip.querySelectorAll('.digicam-photo');
      const total = photos.length;
      if (!total) return;

      let current = 0;
      let autoTimer = null;

      function showPhoto(idx, skipFlash) {
        current = ((idx % total) + total) % total;
        strip.style.transform = `translateX(calc(-25% * ${current}))`;
        counter.textContent = `${current + 1} / ${total}`;

        if (!skipFlash) {
          flash.classList.remove('pop');
          void flash.offsetWidth;
          flash.classList.add('pop');
        }
      }

      function advance() {
        showPhoto(current + 1, false);
      }

      function resetTimer() {
        window.clearInterval(autoTimer);
        autoTimer = window.setInterval(advance, 3500);
      }

      wrapper.addEventListener('click', () => {
        advance();
        resetTimer();
      });

      wrapper.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          advance();
          resetTimer();
        }
      });

      showPhoto(0, true);
      resetTimer();
    });
  }

  function initAppleHandwriting() {
    const svgs = document.querySelectorAll('[data-handwrite-svg]');
    if (!svgs.length || !window.gsap) return;

    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    const getStrokeLength = (el) => {
      if (typeof el.getTotalLength === 'function') {
        return el.getTotalLength();
      }
      if (typeof el.getComputedTextLength === 'function') {
        return el.getComputedTextLength();
      }
      return 0;
    };

    const setupTargets = (svg) => {
      const drawTargets = svg.querySelectorAll('text, path');
      if (!drawTargets.length) return [];

      drawTargets.forEach((el) => {
        const length = getStrokeLength(el);
        if (!length) return;

        el.style.fill = 'transparent';
        el.style.strokeDasharray = `${length}`;
        el.style.strokeDashoffset = `${length}`;
      });

      return drawTargets;
    };

    const playHandwrite = (svg) => {
      const drawTargets = setupTargets(svg);
      if (!drawTargets.length) return;

      window.gsap.killTweensOf(drawTargets);
      window.gsap.timeline({ defaults: { ease: 'power2.out' } })
        .to(drawTargets, {
          strokeDashoffset: 0,
          duration: 1.75,
          stagger: 0.2
        })
        .to(drawTargets, {
          fill: '#3f2d20',
          duration: 0.28,
          stagger: 0.05
        }, '-=0.25');
    };

    const setupScrollHandwrite = (svg) => {
      const drawTargets = setupTargets(svg);
      if (!drawTargets.length) return;

      window.gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: svg,
          start: 'top 82%',
          toggleActions: 'play none none reset'
        }
      }).to(drawTargets, {
        strokeDashoffset: 0,
        duration: 1.75,
        stagger: 0.2
      }).to(drawTargets, {
        fill: '#3f2d20',
        duration: 0.28,
        stagger: 0.05
      }, '-=0.25');
    };

    svgs.forEach((svg) => {
      const mode = svg.getAttribute('data-handwrite-svg') || 'scroll';

      if (mode === 'immediate') {
        playHandwrite(svg);
        return;
      }

      const inGuidedMode = document.body.classList.contains('guided-mode');
      if (!inGuidedMode && window.ScrollTrigger) {
        if (isOpeningOverlayVisible()) {
          window.addEventListener('openingOverlayClosed', () => {
            setupScrollHandwrite(svg);
          }, { once: true });
        } else {
          setupScrollHandwrite(svg);
        }
        return;
      }

      window.addEventListener('guidedPanelActivated', (event) => {
        const panel = event.detail?.panel;
        if (panel && panel.contains(svg)) {
          playHandwrite(svg);
        }
      });

      window.addEventListener('openingOverlayClosed', () => {
        const activePanel = document.querySelector('.story-panel:not(.guided-hidden)');
        if (activePanel && activePanel.contains(svg)) {
          playHandwrite(svg);
        }
      });
    });
  }

  initDigicam();
  initAppleHandwriting();
})();