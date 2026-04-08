// ─────────────────────────────────────────────────────────────────────────────
// Gastronomy Gallery — CS:GO case-opening spotlight carousel
//
// TO ADD MORE DISHES: push a new object into GASTRONOMY_PHOTOS below.
// Each entry: { src: 'path/to/image', label: 'Caption text' }
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  // ── CONFIG ─────────────────────────────────────────────────────────────────
  // Add, remove, or reorder entries freely — the carousel scales automatically.
  const GASTRONOMY_PHOTOS = [
    { src: 'assets/images/food/090720220003.jpg',                          label: 'Dish #1'  },
    { src: 'assets/images/food/1AFD716E-7792-44F1-BAC6-36B4E76E3F93.jpg', label: 'Dish #2'  },
    { src: 'assets/images/food/4A708D1F-AAA5-4CBE-B76E-B4D07C9FD3C3.jpg', label: 'Dish #3'  },
    { src: 'assets/images/food/50728E83-3AD7-4D88-98BC-4878C9E17503.jpg', label: 'Dish #4'  },
    { src: 'assets/images/food/53DF70BB-3916-4A3A-86A1-8F472E2AC773.jpg', label: 'Dish #5'  },
    { src: 'assets/images/food/BF663D3F-92A2-4CB5-A520-90C3C6490A53.jpg', label: 'Dish #6'  },
    { src: 'assets/images/food/D3174854-B386-43D9-BE78-EFC2A5FDC7C0.jpg', label: 'Dish #7'  },
    { src: 'assets/images/food/DE7E8A09-2F7A-489D-9FDC-9DC3B36D295F.jpg', label: 'Dish #8'  },
    { src: 'assets/images/food/F5FEA5BC-2A68-4866-921E-147F537E7D4A.jpg', label: 'Dish #9'  },
    { src: 'assets/images/food/image.jpg',                                 label: 'Dish #10' },
    { src: 'assets/images/food/image.png',                                 label: 'Dish #11' },
    { src: 'assets/images/food/image1.png',                                label: 'Dish #12' },
    { src: 'assets/images/food/IMG_0246.jpg',                              label: 'Dish #13' },
    { src: 'assets/images/food/IMG_0251.JPEG',                             label: 'Dish #14' },
    { src: 'assets/images/food/IMG_1161.jpg',                              label: 'Dish #15' },
    { src: 'assets/images/food/IMG_5262.jpg',                              label: 'Dish #16' },
    { src: 'assets/images/food/IMG_5324.jpg',                              label: 'Dish #17' },
    { src: 'assets/images/food/IMG_5737.jpg',                              label: 'Dish #18' },
    { src: 'assets/images/food/IMG_6036.jpg',                              label: 'Dish #19' },
    { src: 'assets/images/food/IMG_6055.jpg',                              label: 'Dish #20' },
    { src: 'assets/images/food/IMG_6181.jpg',                              label: 'Dish #21' },
    { src: 'assets/images/food/IMG_6426.jpg',                              label: 'Dish #22' },
  ];

  const SPOTLIGHT_HOLD_MS = 2000; // how long each image stays spotlighted
  const FADE_MS           = 240;  // must match CSS transition duration

  // ── STATE ──────────────────────────────────────────────────────────────────
  let currentIndex = 0;
  let autoTimer    = null;
  let swapTimer    = null;
  let isPlaying    = false;

  // ── DOM REFS ───────────────────────────────────────────────────────────────
  const widget         = document.getElementById('gastronomyWidget');
  const strip          = document.getElementById('gastronomyStrip');
  const spotlightPhoto = document.getElementById('gastronomySpotlightPhoto');
  const counter        = document.getElementById('gastronomyCounter');
  const playBtn        = document.getElementById('gastronomyPlayBtn');
  const hudLabel       = document.getElementById('gastronomyHudLabel');

  // Guard: bail silently if section isn't in the DOM
  if (!widget || !strip) return;

  // ── BUILD THUMBNAIL STRIP ──────────────────────────────────────────────────
  function buildStrip() {
    strip.innerHTML = '';
    GASTRONOMY_PHOTOS.forEach(function (item, i) {
      var thumb = document.createElement('div');
      thumb.className = 'gastronomy-thumb';
      thumb.setAttribute('role', 'listitem');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', item.label + ' — open spotlight');
      thumb.dataset.index = i;

      var img = document.createElement('img');
      img.src = item.src;
      img.alt = '';
      img.loading = 'lazy';
      thumb.appendChild(img);

      thumb.addEventListener('click', function () { goTo(i); });
      thumb.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goTo(i);
        }
      });

      strip.appendChild(thumb);
    });
  }

  // ── SPOTLIGHT A GIVEN INDEX ────────────────────────────────────────────────
  function goTo(index, skipAnimation) {
    var item = GASTRONOMY_PHOTOS[index];
    if (!item) return;

    currentIndex = index;

    // ① Update strip: mark active thumb, scroll it into view
    var thumbs = strip.querySelectorAll('.gastronomy-thumb');
    thumbs.forEach(function (t, i) {
      t.classList.toggle('is-active', i === index);
    });

    var activeThumb = thumbs[index];
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // ② Update counter
    if (counter) counter.textContent = (index + 1) + ' / ' + GASTRONOMY_PHOTOS.length;

    if (skipAnimation) {
      spotlightPhoto.src = item.src;
      spotlightPhoto.alt = item.label;
      if (hudLabel) hudLabel.textContent = item.label;
      return;
    }

    // ③ Preload next image so it's cached when we need it
    var nextItem = GASTRONOMY_PHOTOS[(index + 1) % GASTRONOMY_PHOTOS.length];
    if (nextItem) {
      var preload = new Image();
      preload.src = nextItem.src;
    }

    // ④ Fade out → swap src → double-RAF fade in (guarantees new image is painted first)
    clearTimeout(swapTimer);
    spotlightPhoto.classList.add('is-fading');
    if (hudLabel) hudLabel.textContent = item.label;

    swapTimer = setTimeout(function () {
      spotlightPhoto.src = item.src;
      spotlightPhoto.alt = item.label;
      // Double RAF: first frame picks up new src, second frame starts the transition
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          spotlightPhoto.classList.remove('is-fading');
        });
      });
    }, FADE_MS);
  }

  // ── AUTO-PLAY ──────────────────────────────────────────────────────────────
  function startAuto() {
    stopAuto();
    isPlaying = true;
    if (playBtn) playBtn.textContent = '⏸ Pause';
    scheduleNext();
  }

  function stopAuto() {
    clearTimeout(autoTimer);
    isPlaying = false;
    if (playBtn) playBtn.textContent = '▶ Auto-Showcase';
  }

  function scheduleNext() {
    if (!isPlaying) return;
    autoTimer = setTimeout(function () {
      var next = (currentIndex + 1) % GASTRONOMY_PHOTOS.length;
      goTo(next);
      scheduleNext();
    }, SPOTLIGHT_HOLD_MS);
  }

  // ── INIT ───────────────────────────────────────────────────────────────────
  buildStrip();
  goTo(0, true); // silent initial load

  if (playBtn) {
    playBtn.addEventListener('click', function () {
      if (isPlaying) stopAuto();
      else           startAuto();
    });
  }

  // Auto-start / pause based on section visibility
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !isPlaying) {
        startAuto();
      } else if (!entry.isIntersecting && isPlaying) {
        stopAuto();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(widget);
})();
