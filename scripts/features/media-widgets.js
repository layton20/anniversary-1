(() => {
  const gifSlots = document.querySelectorAll('[data-role="gif-slot"]');
  const flightRoute = document.getElementById('flightRoute');
  const flightRouteGlow = document.getElementById('flightRouteGlow');
  const planeToken = document.getElementById('planeToken');
  const discordCallTimer = document.getElementById('discordCallTimer');

  let callDurationSeconds = (24 * 60 * 60) + (7 * 60) + 12;

  function initGifSlots() {
    gifSlots.forEach((img) => {
      const frame = img.closest('.gif-frame');
      const isLegacyFrame = Boolean(frame);

      if ((img.getAttribute('src') || '').includes('miku_spinning')) {
        img.classList.add('transparent-fit');
      }

      if (img.complete && img.naturalWidth > 0 && isLegacyFrame) {
        frame.classList.add('is-loaded');
      }

      img.addEventListener('load', () => {
        if (isLegacyFrame) frame.classList.add('is-loaded');
      });

      img.addEventListener('error', () => {
        if (isLegacyFrame) frame.classList.remove('is-loaded');
      });
    });
  }

  function formatCallDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  function initDiscordCallTimer() {
    if (!discordCallTimer) return;

    discordCallTimer.textContent = formatCallDuration(callDurationSeconds);
    window.setInterval(() => {
      callDurationSeconds += 1;
      discordCallTimer.textContent = formatCallDuration(callDurationSeconds);
    }, 1000);
  }

  function initPeakGallery() {
    const gallery = document.getElementById('peakGallery');
    if (!gallery) return;

    const slides = Array.from(gallery.querySelectorAll('.peak-slide'));
    const dotsWrap = document.getElementById('peakDots');
    let dots = [];
    const prev = document.getElementById('peakPrev');
    const next = document.getElementById('peakNext');
    const lightbox = document.getElementById('peakLightbox');
    const lightboxStage = document.getElementById('peakLightboxStage');
    const lightboxImage = document.getElementById('peakLightboxImage');
    const lightboxCaption = document.getElementById('peakLightboxCaption');
    const lightboxClose = document.getElementById('peakLightboxClose');
    const lightboxCloseCta = document.getElementById('peakLightboxCloseCta');
    const slideImages = slides
      .map((slide) => slide.querySelector('img'))
      .filter((img) => Boolean(img));

    let current = 0;
    let lightboxOpen = false;
    let zoomScale = 1;
    let panX = 0;
    let panY = 0;
    let activePointerId = null;
    let isPanning = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    function buildDots() {
      if (!dotsWrap) return;

      dotsWrap.innerHTML = '';
      dots = slides.map((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'peak-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('type', 'button');
        dot.setAttribute('data-idx', `${idx}`);
        dot.setAttribute('aria-selected', 'false');
        dot.setAttribute('aria-label', `Screenshot ${idx + 1}`);
        dot.addEventListener('click', () => goTo(idx));
        dotsWrap.appendChild(dot);
        return dot;
      });
    }

    function applyLightboxTransform() {
      if (!lightboxImage || !lightboxStage) return;
      lightboxImage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
      lightboxStage.classList.toggle('is-zoomed', zoomScale > 1.01);
    }

    function setZoomScale(nextScale) {
      const clamped = Math.max(1, Math.min(3, nextScale));
      zoomScale = clamped;
      if (zoomScale <= 1.01) {
        panX = 0;
        panY = 0;
      }
      applyLightboxTransform();
    }

    function resetLightboxView() {
      zoomScale = 1;
      panX = 0;
      panY = 0;
      isPanning = false;
      activePointerId = null;
      lightboxStage?.classList.remove('is-panning');
      applyLightboxTransform();
    }

    function closeLightbox() {
      if (!lightbox || !lightboxOpen) return;
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('peak-lightbox-open');
      lightboxOpen = false;
      resetLightboxView();
    }

    function openLightbox(idx) {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      const slide = slides[idx];
      const img = slide?.querySelector('img');
      const caption = slide?.querySelector('figcaption');
      if (!img) return;

      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || 'Expanded PEAK screenshot';
      lightboxCaption.textContent = caption?.textContent?.trim() || 'Expanded PEAK screenshot';

      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('peak-lightbox-open');
      lightboxOpen = true;
      resetLightboxView();
    }

    function goTo(idx) {
      slides[current]?.classList.remove('peak-slide-active');
      dots[current]?.classList.remove('peak-dot-active');
      dots[current]?.setAttribute('aria-selected', 'false');

      current = (idx + slides.length) % slides.length;

      slides[current].classList.add('peak-slide-active');
      dots[current]?.classList.add('peak-dot-active');
      dots[current]?.setAttribute('aria-selected', 'true');
    }

    prev?.addEventListener('click', () => goTo(current - 1));
    next?.addEventListener('click', () => goTo(current + 1));

    slideImages.forEach((img, idx) => {
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', `Open screenshot ${idx + 1} in expanded view`);

      img.addEventListener('click', () => openLightbox(idx));
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(idx);
        }
      });
    });

    gallery.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') goTo(current - 1);
      if (event.key === 'ArrowRight') goTo(current + 1);
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxCloseCta?.addEventListener('click', closeLightbox);

    lightbox?.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const closeTarget = target.closest('[data-peak-close="true"]');
      if (closeTarget) {
        closeLightbox();
      }
    });

    lightboxImage?.addEventListener('click', () => {
      if (!lightboxOpen) return;
      if (zoomScale <= 1.01) closeLightbox();
    });

    lightboxStage?.addEventListener('dblclick', () => {
      setZoomScale(zoomScale > 1.2 ? 1 : 2);
    });

    lightboxStage?.addEventListener('wheel', (event) => {
      event.preventDefault();
      const delta = event.deltaY < 0 ? 0.2 : -0.2;
      setZoomScale(zoomScale + delta);
    }, { passive: false });

    lightboxStage?.addEventListener('pointerdown', (event) => {
      if (zoomScale <= 1.01) return;
      activePointerId = event.pointerId;
      isPanning = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lightboxStage.setPointerCapture(event.pointerId);
      lightboxStage.classList.add('is-panning');
    });

    lightboxStage?.addEventListener('pointermove', (event) => {
      if (!isPanning || activePointerId !== event.pointerId) return;

      const dx = event.clientX - lastPointerX;
      const dy = event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      panX += dx;
      panY += dy;
      applyLightboxTransform();
    });

    function endPan(event) {
      if (!isPanning || activePointerId !== event.pointerId) return;
      isPanning = false;
      activePointerId = null;
      lightboxStage?.classList.remove('is-panning');
    }

    lightboxStage?.addEventListener('pointerup', endPan);
    lightboxStage?.addEventListener('pointercancel', endPan);
    lightboxStage?.addEventListener('pointerleave', endPan);

    window.addEventListener('keydown', (event) => {
      if (!lightboxOpen) return;

      if (event.key === 'Escape') {
        closeLightbox();
        return;
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setZoomScale(zoomScale + 0.2);
        return;
      }

      if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        setZoomScale(zoomScale - 0.2);
        return;
      }

      if (event.key === '0') {
        event.preventDefault();
        setZoomScale(1);
      }
    });

    if (!slides.length) return;
    buildDots();
    goTo(0);
  }

  function initFlightRouteAnimation() {
    if (!flightRoute || !planeToken) return;

    if (window.anime && typeof window.anime.path === 'function') {
      const routePath = window.anime.path(flightRoute);

      window.anime({
        targets: planeToken,
        translateX: routePath('x'),
        translateY: routePath('y'),
        rotate: routePath('angle'),
        easing: 'easeInOutSine',
        duration: 5400,
        direction: 'alternate',
        loop: true
      });

      if (flightRouteGlow) {
        window.anime({
          targets: flightRouteGlow,
          strokeDashoffset: [window.anime.setDashoffset, 0],
          easing: 'easeInOutSine',
          duration: 2800,
          direction: 'alternate',
          loop: true
        });
      }
      return;
    }

    planeToken.style.left = '50%';
    planeToken.style.top = '48%';
  }

  initGifSlots();
  initDiscordCallTimer();
  initPeakGallery();
  initFlightRouteAnimation();
})();