const openingOverlay = document.getElementById('openingOverlay');
const openingEnvelopeBtn = document.getElementById('openingEnvelopeBtn');
const openingEnvelopeMessage = document.getElementById('openingEnvelopeMessage');
const openingSimpleCard = document.getElementById('openingSimpleCard');
const scrollProgressFill = document.getElementById('scrollProgressFill');
const motionSections = document.querySelectorAll('[data-motion]');
const mailboxGrid = document.getElementById('mailboxGrid');
const mailReveal = document.getElementById('mailReveal');
const infernoVaultCanvas = document.getElementById('infernoVaultCanvas');
const mailRevealName = document.getElementById('mailRevealName');
const mailRevealText = document.getElementById('mailRevealText');
const mailRevealMeta = document.getElementById('mailRevealMeta');
const notePile = document.getElementById('notePile');
const unfoldedNote = document.getElementById('unfoldedNote');
const unfoldedNoteText = document.getElementById('unfoldedNoteText');
const resistSection = document.getElementById('resist-memory');
const resistCanvas = document.getElementById('resistCanvas');
const resistSpeaker = document.getElementById('resistSpeaker');
const resistDialogueText = document.getElementById('resistDialogueText');
const resistChoices = document.getElementById('resistChoices');
const guidedPager = document.getElementById('guidedPager');
const guidedPrevBtn = document.getElementById('guidedPrevBtn');
const guidedNextBtn = document.getElementById('guidedNextBtn');
const guidedDots = document.getElementById('guidedDots');
const storyPanels = Array.from(document.querySelectorAll('.story-panel'));
const heroIntroParagraphs = Array.from(document.querySelectorAll('#intro .hero-content p'))
  .filter((paragraph) => !paragraph.classList.contains('eyebrow'));
const tripMediaModal = document.getElementById('tripMediaModal');
const tripMediaTitle = document.getElementById('tripMediaTitle');
const tripMediaClose = document.getElementById('tripMediaClose');
const tripMediaYoutube = document.getElementById('tripMediaYoutube');
const tripMediaTiktok = document.getElementById('tripMediaTiktok');
// envelope-scene.js handles the love letter section now

let tiktokEmbedScriptPromise = null;
let heroTypewriterTimer = null;
let heroTypewriterStarted = false;

const HERO_TYPEWRITER_BASE_DELAY = 44;
const HERO_TYPEWRITER_EMPHASIS_ENTRY_PAUSE = 1500;
const HERO_TYPEWRITER_EMPHASIS_PHRASES = [
  "i don't want to",
  'i love you <3'
];

function collectPhraseRanges(text, phrases) {
  const lowerText = text.toLowerCase();
  const ranges = [];

  phrases.forEach((phrase) => {
    const lowerPhrase = phrase.toLowerCase();
    let start = lowerText.indexOf(lowerPhrase);

    while (start !== -1) {
      ranges.push({ start, end: start + lowerPhrase.length });
      start = lowerText.indexOf(lowerPhrase, start + lowerPhrase.length);
    }
  });

  return ranges;
}

function getHeroTypeDelay(text, charIndex, baseDelay, emphasisRanges) {
  let delay = baseDelay;
  const char = text[charIndex] || '';
  const nextCharIndex = charIndex + 1;

  if (emphasisRanges.some((range) => charIndex >= range.start && charIndex < range.end)) {
    delay = baseDelay * 2.2;
  }

  if (emphasisRanges.some((range) => nextCharIndex === range.start)) {
    delay += HERO_TYPEWRITER_EMPHASIS_ENTRY_PAUSE;
  }

  if (char === ',' || char === ';' || char === ':') {
    delay += baseDelay * 2;
  } else if (char === '.' || char === '!' || char === '?') {
    delay += baseDelay * 4;
  }

  return Math.round(delay);
}

function typewriteElement(element, speed = HERO_TYPEWRITER_BASE_DELAY) {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }

    const fullText = (element.dataset.fullText || element.textContent || '').trim();
    if (!fullText) {
      resolve();
      return;
    }

    element.dataset.fullText = fullText;
    element.textContent = '';
    element.classList.add('hero-type-line', 'is-typing');

    const emphasisRanges = collectPhraseRanges(fullText, HERO_TYPEWRITER_EMPHASIS_PHRASES);

    let cursor = 0;
    if (heroTypewriterTimer) {
      window.clearTimeout(heroTypewriterTimer);
    }

    const tick = () => {
      cursor += 1;
      element.textContent = fullText.slice(0, cursor);

      if (cursor >= fullText.length) {
        heroTypewriterTimer = null;
        element.classList.remove('is-typing');
        resolve();
        return;
      }

      const nextDelay = getHeroTypeDelay(fullText, cursor - 1, speed, emphasisRanges);
      heroTypewriterTimer = window.setTimeout(tick, nextDelay);
    };

    heroTypewriterTimer = window.setTimeout(tick, speed);
  });
}

function startHeroIntroTypewriter() {
  if (!heroIntroParagraphs.length || heroTypewriterStarted) return;

  heroTypewriterStarted = true;

  heroIntroParagraphs.forEach((paragraph) => {
    const fullText = (paragraph.dataset.fullText || paragraph.textContent || '').trim();
    paragraph.dataset.fullText = fullText;
    paragraph.textContent = '';
  });

  void (async () => {
    for (const paragraph of heroIntroParagraphs) {
      await typewriteElement(paragraph, HERO_TYPEWRITER_BASE_DELAY);
      await new Promise((resolve) => window.setTimeout(resolve, 280));
    }
  })();
}

// ── Section subtitle typewriter ──────────────────────────────────────────────
const subtitleTypedSections = new Set();
const SUBTITLE_TYPE_SPEED = 30;

function typeSubtitle(el) {
  const full = (el.dataset.subtitleFull || el.textContent || '').trim();
  if (!full) return;

  el.dataset.subtitleFull = full;
  el.textContent = '';
  el.classList.add('subtitle-is-typing');

  let cursor = 0;

  const tick = () => {
    cursor += 1;
    el.textContent = full.slice(0, cursor);
    if (cursor >= full.length) {
      el.classList.remove('subtitle-is-typing');
      return;
    }
    const ch = full[cursor - 1];
    let delay = SUBTITLE_TYPE_SPEED;
    if (ch === ',' || ch === ';' || ch === ':') delay += SUBTITLE_TYPE_SPEED * 2;
    else if (ch === '.' || ch === '!' || ch === '?') delay += SUBTITLE_TYPE_SPEED * 5;
    window.setTimeout(tick, delay);
  };

  window.setTimeout(tick, SUBTITLE_TYPE_SPEED);
}

function ensureTiktokEmbedScript() {
  if (window.tiktokEmbedLoad) {
    return Promise.resolve();
  }

  if (tiktokEmbedScriptPromise) {
    return tiktokEmbedScriptPromise;
  }

  tiktokEmbedScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      // Resolve anyway in case the script already finished loading.
      window.setTimeout(resolve, 80);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });

  return tiktokEmbedScriptPromise;
}

function closeTripMediaModal() {
  if (!tripMediaModal || tripMediaModal.hidden) return;

  tripMediaModal.hidden = true;
  tripMediaModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('trip-media-open');

  if (tripMediaYoutube) {
    tripMediaYoutube.hidden = true;
    tripMediaYoutube.removeAttribute('src');
  }

  if (tripMediaTiktok) {
    tripMediaTiktok.hidden = true;
    tripMediaTiktok.innerHTML = '';
  }
}

function openTripMediaModalFromLink(link) {
  if (!tripMediaModal || !tripMediaTitle || !tripMediaYoutube || !tripMediaTiktok) return;

  const mediaType = link.getAttribute('data-trip-media') || '';
  const country = link.getAttribute('data-country') || 'Trip clip';

  tripMediaTitle.textContent = `${country} clip`;
  tripMediaModal.hidden = false;
  tripMediaModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('trip-media-open');

  if (mediaType === 'youtube') {
    const embedSrc = link.getAttribute('data-embed-src') || '';
    tripMediaTiktok.hidden = true;
    tripMediaTiktok.innerHTML = '';

    tripMediaYoutube.hidden = false;
    if (embedSrc) {
      tripMediaYoutube.src = embedSrc;
    }
    return;
  }

  if (mediaType === 'tiktok') {
    const cite = link.getAttribute('data-tiktok-cite') || '';
    const videoId = link.getAttribute('data-tiktok-id') || '';
    const author = link.getAttribute('data-tiktok-author') || 'creator';

    tripMediaYoutube.hidden = true;
    tripMediaYoutube.removeAttribute('src');

    tripMediaTiktok.hidden = false;
    if (videoId === '7189808715334274331') {
      tripMediaTiktok.innerHTML = `
        <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@kenichaaann/video/7189808715334274331" data-video-id="7189808715334274331" style="max-width: 605px;min-width: 325px;">
          <section>
            <a target="_blank" title="@kenichaaann" href="https://www.tiktok.com/@kenichaaann?refer=embed">@kenichaaann</a>
            Replying to @chelskysh FAKE SITUATION
            <a title="chinese" target="_blank" href="https://www.tiktok.com/tag/chinese?refer=embed">#chinese</a>
            <a title="chinesegirl" target="_blank" href="https://www.tiktok.com/tag/chinesegirl?refer=embed">#chinesegirl</a>
            <a title="chef" target="_blank" href="https://www.tiktok.com/tag/chef?refer=embed">#chef</a>
            <a title="fakesituation" target="_blank" href="https://www.tiktok.com/tag/fakesituation?refer=embed">#fakesituation</a>
            <a title="stantwitter" target="_blank" href="https://www.tiktok.com/tag/stantwitter?refer=embed">#stantwitter</a>
            <a title="crop" target="_blank" href="https://www.tiktok.com/tag/crop?refer=embed">#crop</a>
            <a title="cropvideo" target="_blank" href="https://www.tiktok.com/tag/cropvideo?refer=embed">#cropvideo</a>
            <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a>
            <a title="meme" target="_blank" href="https://www.tiktok.com/tag/meme?refer=embed">#meme</a>
            <a title="floptok" target="_blank" href="https://www.tiktok.com/tag/floptok?refer=embed">#floptok</a>
            <a title="foryou" target="_blank" href="https://www.tiktok.com/tag/foryou?refer=embed">#foryou</a>
            <a title="foryoupage" target="_blank" href="https://www.tiktok.com/tag/foryoupage?refer=embed">#foryoupage</a>
            <a target="_blank" title="music" href="https://www.tiktok.com/music/%E5%BD%92%E5%9B%AD%E7%94%B0%E5%B1%85-%E5%8F%A4%E9%A3%8E%E5%8E%9F%E5%88%9B-6854962156685756424?refer=embed">audio</a>
          </section>
        </blockquote>
      `;
    } else {
      tripMediaTiktok.innerHTML = `
        <blockquote class="tiktok-embed" cite="${cite}" data-video-id="${videoId}" style="max-width: 605px;min-width: 325px;">
          <section>
            <a target="_blank" title="${author}" href="https://www.tiktok.com/${author}?refer=embed">${author}</a>
          </section>
        </blockquote>
      `;
    }

    ensureTiktokEmbedScript().then(() => {
      if (typeof window.tiktokEmbedLoad === 'function') {
        window.tiktokEmbedLoad();
      }
    });
  }
}

function isOpeningOverlayVisible() {
  if (!openingOverlay) return false;
  return !openingOverlay.classList.contains('hidden')
    && !openingOverlay.hidden
    && openingOverlay.getAttribute('aria-hidden') !== 'true';
}

function resetScrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function triggerOpeningSettle() {
  document.body.classList.remove('opening-settle');
  void document.body.offsetWidth;
  document.body.classList.add('opening-settle');

  if (openingSettleTimer) {
    window.clearTimeout(openingSettleTimer);
  }

  openingSettleTimer = window.setTimeout(() => {
    document.body.classList.remove('opening-settle');
  }, 980);
}

function closeOpeningOverlay() {
  if (!openingOverlay || !isOpeningOverlayVisible()) return;

  resetScrollToTop();

  openingOverlay.classList.add('hidden');
  openingOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('opening-locked');
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }

  window.setTimeout(() => {
    triggerOpeningSettle();
  }, 520);

  window.dispatchEvent(new CustomEvent('openingOverlayClosed'));
}

if (isOpeningOverlayVisible()) {
  document.body.classList.add('opening-locked');
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.requestAnimationFrame(() => {
    resetScrollToTop();
  });
  window.setTimeout(() => {
    resetScrollToTop();
  }, 40);

  window.addEventListener('openingOverlayClosed', () => {
    startHeroIntroTypewriter();
  }, { once: true });
} else {
  window.setTimeout(() => {
    startHeroIntroTypewriter();
  }, 220);
}

function createUiSoundEngine() {
  let audioContext = null;
  let noiseBuffer = null;
  let outputNode = null;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  const getContext = () => {
    if (!AudioContextClass) return null;
    if (!audioContext) {
      audioContext = new AudioContextClass();
      const masterFilter = audioContext.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(1950, audioContext.currentTime);
      masterFilter.Q.setValueAtTime(0.55, audioContext.currentTime);

      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.72, audioContext.currentTime);

      masterFilter.connect(masterGain);
      masterGain.connect(audioContext.destination);
      outputNode = masterFilter;
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  };

  const getNoiseBuffer = (ctx) => {
    if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;

    noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.22), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - (i / data.length));
    }
    return noiseBuffer;
  };

  const playTone = (ctx, options) => {
    const {
      now,
      type = 'sine',
      frequency = 440,
      endFrequency = frequency,
      attack = 0.01,
      decay = 0.18,
      volume = 0.12,
      startTime = 0,
      destination = outputNode || ctx.destination
    } = options;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startAt = now + startTime;
    const stopAt = startAt + decay;

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startAt);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFrequency), stopAt);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(startAt);
    osc.stop(stopAt + 0.02);
  };

  const playNoise = (ctx, options) => {
    const {
      now,
      type = 'bandpass',
      frequency = 1200,
      q = 0.8,
      volume = 0.05,
      decay = 0.12,
      startTime = 0,
      destination = outputNode || ctx.destination
    } = options;

    const source = ctx.createBufferSource();
    source.buffer = getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(frequency, now + startTime);
    filter.Q.setValueAtTime(q, now + startTime);

    const gain = ctx.createGain();
    const startAt = now + startTime;
    const stopAt = startAt + decay;
    gain.gain.setValueAtTime(volume, startAt);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    source.start(startAt);
    source.stop(stopAt + 0.02);
  };

  const safelyPlay = (callback) => {
    try {
      const ctx = getContext();
      if (!ctx) return;
      callback(ctx, ctx.currentTime);
    } catch (error) {
      // Audio should fail silently on unsupported/restricted environments.
    }
  };

  return {
    playClick() {
      safelyPlay((ctx, now) => {
        playTone(ctx, {
          now,
          type: 'sine',
          frequency: 620,
          endFrequency: 430,
          attack: 0.008,
          decay: 0.11,
          volume: 0.024
        });
        playNoise(ctx, {
          now,
          type: 'bandpass',
          frequency: 1120,
          q: 0.55,
          volume: 0.006,
          decay: 0.05
        });
      });
    },

    playSwitch() {
      safelyPlay((ctx, now) => {
        playTone(ctx, {
          now,
          type: 'sine',
          frequency: 430,
          endFrequency: 560,
          attack: 0.016,
          decay: 0.16,
          volume: 0.028
        });
        playTone(ctx, {
          now,
          type: 'sine',
          frequency: 620,
          endFrequency: 760,
          attack: 0.02,
          decay: 0.18,
          volume: 0.016,
          startTime: 0.035
        });
      });
    },

    playMemoryOpen() {
      safelyPlay((ctx, now) => {
        playTone(ctx, {
          now,
          type: 'sine',
          frequency: 470,
          endFrequency: 660,
          attack: 0.03,
          decay: 0.34,
          volume: 0.026
        });
        playTone(ctx, {
          now,
          type: 'sine',
          frequency: 700,
          endFrequency: 920,
          attack: 0.028,
          decay: 0.38,
          volume: 0.014,
          startTime: 0.06
        });
      });
    },

    playPaper() {
      safelyPlay((ctx, now) => {
        playNoise(ctx, {
          now,
          type: 'bandpass',
          frequency: 760,
          q: 0.45,
          volume: 0.018,
          decay: 0.13
        });
        playTone(ctx, {
          now,
          type: 'sine',
          frequency: 260,
          endFrequency: 190,
          attack: 0.01,
          decay: 0.09,
          volume: 0.009,
          startTime: 0.012
        });
      });
    }
  };
}

const uiSounds = createUiSoundEngine();
window.uiSounds = uiSounds;

const click1Audio = new Audio('assets/audio/click_1.mp3');
click1Audio.preload = 'auto';
click1Audio.volume = 0.55;

document.addEventListener('click', (event) => {
  const target = event.target.closest('button, [role="button"]');
  if (!target || target.disabled) return;

  if (target.closest('.strawberry-desk')) return;

  if (target === heroDigicamTrigger) return;

  if (target.matches('.memory-orb')) {
    uiSounds.playMemoryOpen();
    return;
  }

  if (target.matches('.memory-close, .locker-door') || target === openingEnvelopeBtn) {
    uiSounds.playPaper();
    return;
  }

  if (target.matches('[data-desktop-app]')) {
    uiSounds.playSwitch();
    return;
  }

  try {
    click1Audio.currentTime = 0;
    const _p = click1Audio.play();
    if (_p && typeof _p.catch === 'function') _p.catch(() => {});
  } catch (_) {}
});

document.addEventListener('click', (event) => {
  const tripLink = event.target.closest('.trip-country-link[data-trip-media]');
  if (tripLink instanceof HTMLAnchorElement) {
    event.preventDefault();
    openTripMediaModalFromLink(tripLink);
    return;
  }

  if (!(event.target instanceof HTMLElement)) return;

  if (event.target.closest('[data-trip-media-close]') || event.target === tripMediaClose) {
    closeTripMediaModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeTripMediaModal();
  }
});

let ticking = false;
let openingSettleTimer = null;
let truthSequenceTimer = null;
let activeStoryPanelIndex = 0;
let infernoVaultRenderer = null;
let infernoVaultScene = null;
let infernoVaultCamera = null;
let infernoVaultLidPivot = null;
let infernoVaultCore = null;
let infernoVaultAura = null;
let infernoVaultRaf = null;
let infernoVaultVisible = true;
let infernoVaultTargetOpen = 0;
let infernoVaultCurrentOpen = 0;
let infernoVaultTargetEnergy = 0.25;
let infernoVaultCurrentEnergy = 0.25;
const infernoVaultClock = typeof THREE !== 'undefined' ? new THREE.Clock() : null;
let resistCtx = null;
let resistRaf = null;
let resistVisible = true;
let resistTypingTimer = null;
const resistParticles = [];

const RESIST_CONFIG = {
  minWidth: 280,
  minHeight: 240,
  particleCount: 32,
  connectionDistance: 130,
  typingDelay: 18
};

function resizeResistCanvas() {
  if (!resistCanvas) return;
  const width = Math.max(RESIST_CONFIG.minWidth, resistCanvas.clientWidth || RESIST_CONFIG.minWidth);
  const height = Math.max(RESIST_CONFIG.minHeight, resistCanvas.clientHeight || RESIST_CONFIG.minHeight);
  resistCanvas.width = Math.floor(width * Math.min(window.devicePixelRatio || 1, 2));
  resistCanvas.height = Math.floor(height * Math.min(window.devicePixelRatio || 1, 2));
}

function initResistParticles() {
  if (!resistCanvas) return;
  const width = resistCanvas.width;
  const height = resistCanvas.height;
  resistParticles.length = 0;

  for (let i = 0; i < RESIST_CONFIG.particleCount; i += 1) {
    resistParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() * 0.46) - 0.23,
      vy: (Math.random() * 0.42) - 0.21,
      size: 0.9 + (Math.random() * 1.8)
    });
  }
}

function animateResistCanvas() {
  if (!resistCtx || !resistCanvas) return;
  if (!resistVisible || document.hidden) {
    resistRaf = null;
    return;
  }

  const width = resistCanvas.width;
  const height = resistCanvas.height;
  resistCtx.clearRect(0, 0, width, height);

  const pulse = 0.14 + ((Math.sin(Date.now() * 0.0014) + 1) * 0.08);
  const gradient = resistCtx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `rgba(96, 168, 255, ${0.17 + pulse})`);
  gradient.addColorStop(1, 'rgba(8, 15, 28, 0.04)');
  resistCtx.fillStyle = gradient;
  resistCtx.fillRect(0, 0, width, height);

  resistParticles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -8) particle.x = width + 8;
    if (particle.x > width + 8) particle.x = -8;
    if (particle.y < -8) particle.y = height + 8;
    if (particle.y > height + 8) particle.y = -8;

    resistCtx.fillStyle = 'rgba(184, 220, 255, 0.84)';
    resistCtx.beginPath();
    resistCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    resistCtx.fill();

    for (let j = index + 1; j < resistParticles.length; j += 1) {
      const other = resistParticles[j];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < RESIST_CONFIG.connectionDistance) {
        const alpha = 1 - (distance / RESIST_CONFIG.connectionDistance);
        resistCtx.strokeStyle = `rgba(124, 182, 255, ${alpha * 0.18})`;
        resistCtx.lineWidth = 1;
        resistCtx.beginPath();
        resistCtx.moveTo(particle.x, particle.y);
        resistCtx.lineTo(other.x, other.y);
        resistCtx.stroke();
      }
    }
  });

  resistRaf = window.requestAnimationFrame(animateResistCanvas);
}

const RESIST_DIALOGUE = {
  start: {
    speaker: 'Watcher',
    text: 'Corridor booted. Pick a memory. No running from cringe.',
    choices: [
      { label: 'Replay my first hardstuck', nextId: 'home' },
      { label: 'Open the "How She Carries" file', nextId: 'love' },
      { label: 'Simulate a kitchen disaster', nextId: 'future' },
      { label: 'Replay a clumsy night call', nextId: 'nightcall' },
      { label: 'Access the loyalty contract', nextId: 'promise' }
    ]
  },
  home: {
    speaker: 'Watcher',
    text: 'We were cursed to forever lose, but you queued up anyway. Somewhere between my inting and your patience, you became home.',
    choices: [
      { label: 'Back to memory index', nextId: 'start' },
      { label: 'Jump to kitchen disaster', nextId: 'future' },
      { label: 'Simulate alternate timeline (no Ella, more LP?)', nextId: 'whatif' }
    ]
  },
  love: {
    speaker: 'Watcher',
    text: 'She carried every game, I did objectives without prio, she never flamed me. I still don’t know how I got so lucky.',
    choices: [
      { label: 'Replay from beginning', nextId: 'start' },
      { label: 'Sign the loyalty contract', nextId: 'promise' },
      { label: 'Read the "How She Carries" report', nextId: 'impact' }
    ]
  },
  future: {
    speaker: 'Watcher',
    text: 'Future log: OH NO! The kitchen is on fire! There is flour everywhere. Kladkadda has imploded and bits are hanging on your face. Me laughing, you smiling, I apologise. Something tells me, never let me in a kitchen again.',
    choices: [
      { label: 'Seal this memory (and my fate)', nextId: 'promise' },
      { label: 'Back to archive', nextId: 'start' },
      { label: 'Load next clumsy adventure', nextId: 'trip' }
    ]
  },
  nightcall: {
    speaker: 'You',
    text: 'Midnight call. I say something dumb, you bully me, and suddenly the world feels less heavy.',
    choices: [
      { label: 'Back to archive', nextId: 'start' },
      { label: 'Continue to loyalty contract', nextId: 'promise' }
    ]
  },
  impact: {
    speaker: 'Watcher',
    text: 'Impact report: LP lost, confidence gained. She’s the reason I keep queueing up. It was never about winning, it was about sending a message to my teammates',
    choices: [
      { label: 'Return', nextId: 'start' },
      { label: 'Project next kitchen fire', nextId: 'future' }
    ]
  },
  trip: {
    speaker: 'Watcher',
    text: 'Trip log: missed trains, wrong turns, but you’re still here. That’s the win condition.',
    choices: [
      { label: 'Append future log (with more fails)', nextId: 'future' },
      { label: 'Seal with loyalty contract', nextId: 'promise' }
    ]
  },
  whatif: {
    speaker: 'You',
    text: 'Alternate timeline: I’m not clumsy, I climb, but you’re not there. No thanks.',
    choices: [
      { label: 'Back to heart thread', nextId: 'home' },
      { label: 'Restart corridor', nextId: 'start' }
    ]
  },
  promise: {
    speaker: 'You',
    text: 'Final contract: I’ll keep inting, you’ll keep carrying, and I’ll always pick you first. No dodge.',
    choices: [
      { label: 'Restart corridor', nextId: 'start' },
      { label: 'One more memory thread', nextId: 'nightcall' }
    ]
  }
};

function typeResistText(text) {
  if (!resistDialogueText) return;
  if (resistTypingTimer) {
    window.clearInterval(resistTypingTimer);
    resistTypingTimer = null;
  }

  resistDialogueText.textContent = '';
  let cursor = 0;
  resistTypingTimer = window.setInterval(() => {
    cursor += 1;
    resistDialogueText.textContent = text.slice(0, cursor);
    if (cursor >= text.length) {
      window.clearInterval(resistTypingTimer);
      resistTypingTimer = null;
    }
  }, RESIST_CONFIG.typingDelay);
}

function renderResistNode(nodeId) {
  const node = RESIST_DIALOGUE[nodeId] || RESIST_DIALOGUE.start;
  if (resistSpeaker) resistSpeaker.textContent = node.speaker;
  typeResistText(node.text);

  if (!resistChoices) return;
  resistChoices.innerHTML = '';

  (node.choices || []).forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'resist-choice';
    button.textContent = choice.label;
    button.addEventListener('click', () => {
      renderResistNode(choice.nextId);
    });
    resistChoices.appendChild(button);
  });
}

function initResistSection() {
  if (!resistSection || !resistCanvas) return;

  resistCtx = resistCanvas.getContext('2d');
  resizeResistCanvas();
  initResistParticles();
  renderResistNode('start');

  window.addEventListener('resize', () => {
    resizeResistCanvas();
    initResistParticles();
  });

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      resistVisible = entry.isIntersecting;
      if (resistVisible && !resistRaf) {
        resistRaf = window.requestAnimationFrame(animateResistCanvas);
      }
    });
  }, { threshold: 0.28 });

  visibilityObserver.observe(resistSection);
  resistRaf = window.requestAnimationFrame(animateResistCanvas);
}

function resizeInfernoVaultScene() {
  if (!infernoVaultRenderer || !infernoVaultCamera || !infernoVaultCanvas) return;
  const width = Math.max(220, infernoVaultCanvas.clientWidth || 220);
  const height = Math.max(180, infernoVaultCanvas.clientHeight || 220);
  infernoVaultRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  infernoVaultRenderer.setSize(width, height, false);
  infernoVaultCamera.aspect = width / height;
  infernoVaultCamera.updateProjectionMatrix();
}

function setInfernoVaultState(hasLetters) {
  infernoVaultTargetOpen = hasLetters ? -1.16 : -0.68;
  infernoVaultTargetEnergy = hasLetters ? 1 : 0.38;
  if (mailReveal) {
    mailReveal.dataset.state = hasLetters ? 'hit' : 'miss';
  }
}

function animateInfernoVaultScene() {
  if (!infernoVaultRenderer || !infernoVaultScene || !infernoVaultCamera || !infernoVaultClock) return;
  if (!infernoVaultVisible || document.hidden) {
    infernoVaultRaf = null;
    return;
  }

  const elapsed = infernoVaultClock.getElapsedTime();
  infernoVaultCurrentOpen += (infernoVaultTargetOpen - infernoVaultCurrentOpen) * 0.12;
  infernoVaultCurrentEnergy += (infernoVaultTargetEnergy - infernoVaultCurrentEnergy) * 0.08;

  if (infernoVaultLidPivot) {
    infernoVaultLidPivot.rotation.x = infernoVaultCurrentOpen;
  }

  if (infernoVaultCore) {
    infernoVaultCore.position.y = -0.05 + (Math.sin(elapsed * 2.3) * 0.045);
    const scale = 1 + (infernoVaultCurrentEnergy * 0.14);
    infernoVaultCore.scale.set(scale, scale, scale);
    infernoVaultCore.material.emissiveIntensity = 0.18 + (infernoVaultCurrentEnergy * 0.72);
    infernoVaultCore.material.opacity = 0.32 + (infernoVaultCurrentEnergy * 0.58);
  }

  if (infernoVaultAura) {
    infernoVaultAura.rotation.z += 0.007;
    infernoVaultAura.material.opacity = 0.1 + (infernoVaultCurrentEnergy * 0.2);
  }

  infernoVaultRenderer.render(infernoVaultScene, infernoVaultCamera);
  infernoVaultRaf = window.requestAnimationFrame(animateInfernoVaultScene);
}

function initInfernoVaultScene() {
  if (!infernoVaultCanvas || typeof THREE === 'undefined') return;

  infernoVaultRenderer = new THREE.WebGLRenderer({
    canvas: infernoVaultCanvas,
    alpha: true,
    antialias: true
  });

  infernoVaultScene = new THREE.Scene();
  infernoVaultCamera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
  infernoVaultCamera.position.set(0, 1.05, 4.2);

  const keyLight = new THREE.DirectionalLight(0xffd2ec, 1.1);
  keyLight.position.set(2.2, 3.4, 3);
  infernoVaultScene.add(keyLight);

  const rimLight = new THREE.PointLight(0x8b6ce4, 1.45, 9, 2);
  rimLight.position.set(-2.2, 1.8, -1.6);
  infernoVaultScene.add(rimLight);

  const ambient = new THREE.AmbientLight(0xc5c8ff, 0.5);
  infernoVaultScene.add(ambient);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.05, 50),
    new THREE.MeshBasicMaterial({ color: 0xf15fbf, transparent: true, opacity: 0.09 })
  );
  floor.position.y = -1.05;
  floor.rotation.x = -Math.PI / 2;
  infernoVaultScene.add(floor);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 0.82, 1.24),
    new THREE.MeshStandardMaterial({ color: 0x8f5f9f, roughness: 0.48, metalness: 0.16 })
  );
  base.position.y = -0.4;
  infernoVaultScene.add(base);

  const cavity = new THREE.Mesh(
    new THREE.BoxGeometry(1.66, 0.5, 0.93),
    new THREE.MeshStandardMaterial({ color: 0x231628, roughness: 0.72, metalness: 0 })
  );
  cavity.position.set(0, -0.22, 0.03);
  infernoVaultScene.add(cavity);

  infernoVaultLidPivot = new THREE.Group();
  infernoVaultLidPivot.position.set(0, -0.02, -0.62);
  infernoVaultScene.add(infernoVaultLidPivot);

  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(2.08, 0.16, 1.26),
    new THREE.MeshStandardMaterial({ color: 0xd771b1, roughness: 0.34, metalness: 0.22 })
  );
  lid.position.set(0, 0.17, 0.63);
  infernoVaultLidPivot.add(lid);

  const lidStripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.04, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xffe1f4, roughness: 0.44, metalness: 0.18 })
  );
  lidStripe.position.set(0, 0.26, 1.1);
  infernoVaultLidPivot.add(lidStripe);

  infernoVaultCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.22, 1),
    new THREE.MeshStandardMaterial({
      color: 0xff7ac9,
      emissive: 0xff6cbd,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.52,
      roughness: 0.22,
      metalness: 0.1
    })
  );
  infernoVaultCore.position.set(0, -0.05, 0.03);
  infernoVaultScene.add(infernoVaultCore);

  infernoVaultAura = new THREE.Mesh(
    new THREE.TorusGeometry(0.44, 0.038, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0xffa6db, transparent: true, opacity: 0.2 })
  );
  infernoVaultAura.rotation.x = Math.PI / 2;
  infernoVaultAura.position.y = -0.02;
  infernoVaultScene.add(infernoVaultAura);

  resizeInfernoVaultScene();
  window.addEventListener('resize', resizeInfernoVaultScene);

  const vaultObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      infernoVaultVisible = entry.isIntersecting;
      if (infernoVaultVisible && !infernoVaultRaf) {
        infernoVaultRaf = window.requestAnimationFrame(animateInfernoVaultScene);
      }
    });
  }, { threshold: 0.18 });

  vaultObserver.observe(mailReveal || infernoVaultCanvas);

  setInfernoVaultState(false);
  if (!infernoVaultRaf) {
    infernoVaultRaf = window.requestAnimationFrame(animateInfernoVaultScene);
  }
}

function applyGuidedPanel(index, forceAnimate = false) {
  const previousIndex = activeStoryPanelIndex;
  const safeIndex = Math.max(0, Math.min(index, storyPanels.length - 1));
  activeStoryPanelIndex = safeIndex;
  const direction = safeIndex === previousIndex ? 0 : (safeIndex > previousIndex ? 1 : -1);

  storyPanels.forEach((panel, panelIndex) => {
    const isActive = panelIndex === safeIndex;
    panel.classList.toggle('guided-hidden', !isActive);
    if (isActive) {
      panel.classList.add('visible', 'motion-active');
      panel.classList.remove('guided-animate-down', 'guided-animate-up');
      if (direction === 1 || (forceAnimate && direction === 0)) {
        panel.classList.add('guided-animate-down');
      }
      if (direction === -1) {
        panel.classList.add('guided-animate-up');
      }
    }
  });

  if (guidedPager) {
    const openingVisible = isOpeningOverlayVisible();
    guidedPager.hidden = openingVisible;
    guidedPager.setAttribute('aria-hidden', String(openingVisible));
  }

  if (guidedPrevBtn) guidedPrevBtn.disabled = safeIndex <= 0;
  if (guidedNextBtn) guidedNextBtn.disabled = safeIndex >= storyPanels.length - 1;

  if (guidedDots) {
    const dots = guidedDots.querySelectorAll('.guided-dot');
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === safeIndex);
    });
  }

  window.scrollTo({ top: 0, behavior: 'auto' });

  const activePanel = storyPanels[safeIndex] || null;
  window.dispatchEvent(new CustomEvent('guidedPanelActivated', {
    detail: {
      panel: activePanel,
      index: safeIndex
    }
  }));
}

function renderGuidedDots() {
  if (!guidedDots) return;
  guidedDots.innerHTML = '';

  storyPanels.forEach((_, panelIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'guided-dot';
    dot.setAttribute('aria-label', `Go to section ${panelIndex + 1}`);
    dot.classList.toggle('active', panelIndex === activeStoryPanelIndex);
    dot.addEventListener('click', () => {
      applyGuidedPanel(panelIndex, true);
    });
    guidedDots.appendChild(dot);
  });
}

function initGuidedMode() {
  if (!storyPanels.length) return;

  const enableGuidedMode = false;
  if (!enableGuidedMode) {
    document.body.classList.remove('guided-mode');
    storyPanels.forEach((panel) => {
      panel.classList.remove('guided-hidden', 'guided-animate-down', 'guided-animate-up');
    });

    if (guidedPager) {
      guidedPager.hidden = true;
      guidedPager.setAttribute('aria-hidden', 'true');
    }
    return;
  }

  document.body.classList.add('guided-mode');
  if (guidedPager) {
    guidedPager.hidden = true;
    guidedPager.setAttribute('aria-hidden', 'true');
  }
  renderGuidedDots();
  applyGuidedPanel(0);

  guidedNextBtn?.addEventListener('click', () => {
    applyGuidedPanel(activeStoryPanelIndex + 1);
  });

  guidedPrevBtn?.addEventListener('click', () => {
    applyGuidedPanel(activeStoryPanelIndex - 1);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      applyGuidedPanel(activeStoryPanelIndex + 1);
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      applyGuidedPanel(activeStoryPanelIndex - 1);
    }
  });

  window.addEventListener('openingOverlayClosed', () => {
    applyGuidedPanel(activeStoryPanelIndex);
  });
}

openingEnvelopeBtn?.addEventListener('click', () => {
  if (openingEnvelopeBtn.disabled) return;

  openingEnvelopeBtn.disabled = true;
  openingEnvelopeBtn.setAttribute('aria-expanded', 'true');
  openingEnvelopeBtn.classList.add('is-opening');
  openingEnvelopeBtn.classList.add('opened');
  openingSimpleCard?.classList.add('is-opening');
  if (openingEnvelopeMessage) {
    openingEnvelopeMessage.textContent = 'mail opened. loading your story...';
  }

  resetScrollToTop();

  window.setTimeout(() => {
    closeOpeningOverlay();
  }, 700);
});

function updateScrollProgress() {
  if (!scrollProgressFill) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function getRevealStyle(sectionId, item) {
  if (item.classList.contains('section-heading')) return 'heading-rise';

  if (sectionId === 'fandom') return 'from-left';
  if (sectionId === 'phone-screen-love') return 'soft-pop';
  if (sectionId === 'photos') return 'soft-pop';
  if (sectionId === 'music') return 'from-right';
  if (sectionId === 'strawberry-booth') return 'desk-swing';
  if (sectionId === 'peak') return 'tilt-up';
  if (sectionId === 'timeline') {
    if (item.matches('.timeline-item, .trip-card')) return 'float-up';
    return 'from-left';
  }
  if (sectionId === 'resist-memory') return 'glow-lift';
  if (sectionId === 'inferno-mail') {
    if (item.matches('.locker-door')) return 'flip-door';
    return 'from-right';
  }
  if (sectionId === 'letter') return 'paper-rise';
  if (sectionId === 'truth-sequence') return 'cinema-rise';

  return 'from-left';
}

function initScrollRevealStagger() {
  const revealSelector = [
    '.section-heading',
    '.queue-client',
    '.phone-love-stage',
    '.headspace-grid',
    '.music-shell',
    '.strawberry-desk',
    '.peak-client',
    '.timeline',
    '.distance-grid',
    '.resist-stage',
    '.inferno-brand',
    '.inferno-intro',
    '.mailbox-grid',
    '.inferno-vault',
    '.letter-card',
    '.vinyl-player-card',
    '.truth-sequence-card',
    '.motion-card'
  ].join(', ');

  motionSections.forEach((section) => {
    const sectionId = section.id || '';
    const uniqueItems = new Set();
    section.querySelectorAll(revealSelector).forEach((item) => {
      if (!item.closest('.story-panel')) return;
      uniqueItems.add(item);
    });

    Array.from(uniqueItems).forEach((item, index) => {
      const revealStyle = getRevealStyle(sectionId, item);
      item.classList.add('scroll-reveal-item');
      item.dataset.revealStyle = revealStyle;
      item.style.setProperty('--reveal-delay', `${Math.min(index * 110, 760)}ms`);
      item.style.setProperty('--reveal-shift', index % 2 === 0 ? '-24px' : '24px');
      item.style.setProperty('--reveal-tilt', index % 2 === 0 ? '-0.8deg' : '0.8deg');
      item.style.setProperty('--reveal-duration', `${960 + Math.min(index, 3) * 70}ms`);
    });

    // Pre-hide subtitle text so it never flashes before the typewriter runs.
    const subtitle = section.querySelector('.section-heading > p');
    if (subtitle) {
      const full = subtitle.textContent.trim();
      if (full) {
        subtitle.dataset.subtitleFull = full;
        subtitle.textContent = '';
      }
    }
  });
}

function updateMotionSections() {
  motionSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const centerOffset = (rect.top + (rect.height / 2)) - (vh / 2);
    const normalized = Math.max(-1, Math.min(1, centerOffset / (vh * 0.9)));
    const inView = rect.bottom > vh * 0.14 && rect.top < vh * 0.86;
    const focused = Math.abs(centerOffset) < Math.min(vh * 0.24, rect.height * 0.35);

    section.classList.toggle('motion-active', inView);
    section.classList.toggle('is-inview', inView);
    section.classList.toggle('is-focused', focused);
    section.style.setProperty('--parallax-y', `${(-normalized * 22).toFixed(2)}px`);

    if (section.id === 'truth-sequence' && inView && !section.classList.contains('truth-sequence-complete')) {
      section.classList.add('truth-sequence-playing');

      if (!section.dataset.playedOnce) {
        section.dataset.playedOnce = 'true';
        if (truthSequenceTimer) {
          window.clearTimeout(truthSequenceTimer);
        }

        truthSequenceTimer = window.setTimeout(() => {
          section.classList.remove('truth-sequence-playing');
          section.classList.add('truth-sequence-complete');
        }, 4050);
      }
    }

    if (inView && !subtitleTypedSections.has(section)) {
      subtitleTypedSections.add(section);
      const subtitle = section.querySelector('.section-heading > p');
      if (subtitle) {
        typeSubtitle(subtitle);
      }
    }
  });
}

function onScrollAnimate() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      updateMotionSections();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('resize', onScrollAnimate);
window.addEventListener('scroll', onScrollAnimate, { passive: true });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (resistRaf) {
      window.cancelAnimationFrame(resistRaf);
      resistRaf = null;
    }
    if (infernoVaultRaf) {
      window.cancelAnimationFrame(infernoVaultRaf);
      infernoVaultRaf = null;
    }
    return;
  }

  if (resistVisible && !resistRaf) {
    resistRaf = window.requestAnimationFrame(animateResistCanvas);
  }
  if (infernoVaultVisible && !infernoVaultRaf) {
    infernoVaultRaf = window.requestAnimationFrame(animateInfernoVaultScene);
  }
});

mailboxGrid?.addEventListener('click', (event) => {
  const card = event.target.closest('.locker-door');
  if (!card) return;

  const name = card.dataset.name || 'Unknown';
  const hasLetters = card.dataset.hasLetters === 'true';
  const foldedNotes = [
    {
      title: 'Folded Note 1',
      preview: 'first one',
      sender: 'from paradise pick',
      note: 'You are still my favorite hello and my safest place.'
    },
    {
      title: 'Folded Note 2',
      preview: 'little secret',
      sender: 'from long distance',
      note: 'From UK to Sweden, I would cross every timezone for you.',
      tone: 'note-alt'
    },
    {
      title: 'Folded Note 3',
      preview: 'you win',
      sender: 'from tonight',
      note: 'Every version of my future looks better with you in it.',
      tone: 'note-soft'
    },
    {
      title: 'Folded Note 4',
      preview: 'final one',
      sender: 'from me',
      note: 'I love you, and I still choose you every single day.'
    }
  ];

  document.querySelectorAll('.locker-door').forEach((locker) => locker.classList.remove('opened', 'is-selected'));
  card.classList.remove('opening');
  void card.offsetWidth;
  card.classList.add('opening');

  window.setTimeout(() => {
    card.classList.remove('opening');
    card.classList.add('opened');
  }, 540);
  card.classList.add('is-selected');

  mailRevealName.textContent = `${name}'s locker`;
  setInfernoVaultState(hasLetters);
  if (mailReveal) {
    mailReveal.dataset.state = hasLetters ? 'hit' : 'miss';
  }

  if (hasLetters) {
    if (notePile) {
      notePile.hidden = false;
      notePile.innerHTML = '';
      notePile.classList.remove('has-lifted');

      foldedNotes.forEach((note) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `folded-note ${note.tone || ''}`.trim();
        btn.innerHTML = `<strong>${note.title}</strong><span>${note.preview}</span><em>${note.sender}</em>`;
        btn.setAttribute('data-note', note.note);
        notePile.appendChild(btn);
      });
    }

    if (unfoldedNote) {
      unfoldedNote.hidden = false;
      unfoldedNote.classList.remove('show');
    }
    if (unfoldedNoteText) {
      unfoldedNoteText.textContent = 'Pick one folded note, then click it again to unfold.';
    }

    mailRevealText.textContent = 'This locker received notes tonight. Pick one folded post-it to unfold.';
  } else {
    if (notePile) {
      notePile.hidden = true;
      notePile.innerHTML = '';
      notePile.classList.remove('has-lifted');
    }
    if (unfoldedNote) {
      unfoldedNote.hidden = true;
      unfoldedNote.classList.remove('show');
    }
    mailRevealText.textContent = 'No note tonight for this locker. Pick another contestant.';
  }

  if (mailRevealMeta) {
    mailRevealMeta.textContent = hasLetters
      ? 'Mailbox update: Ella has 4 folded post-it notes waiting.'
      : 'Mailbox update: only Ella received notes this round.';
  }

  mailReveal.classList.remove('flash');
  void mailReveal.offsetWidth;
  mailReveal.classList.add('flash');
});

notePile?.addEventListener('click', (event) => {
  const noteCard = event.target.closest('.folded-note');
  if (!noteCard) return;

  const isLifted = noteCard.classList.contains('lifted');

  if (!isLifted) {
    notePile.querySelectorAll('.folded-note').forEach((btn) => btn.classList.remove('lifted', 'active'));
    noteCard.classList.add('lifted');
    notePile.classList.add('has-lifted');
    mailRevealText.textContent = 'Selected. Click the same folded note again to unfold it.';
    return;
  }

  notePile.querySelectorAll('.folded-note').forEach((btn) => btn.classList.remove('active'));
  noteCard.classList.add('active');
  uiSounds.playPaper();

  const note = noteCard.getAttribute('data-note') || 'A note appears here.';
  if (unfoldedNote && unfoldedNoteText) {
    unfoldedNote.hidden = false;
    unfoldedNoteText.textContent = note;
    unfoldedNote.classList.remove('show');
    void unfoldedNote.offsetWidth;
    unfoldedNote.classList.add('show');
  }
  mailRevealText.textContent = 'Message unfolded. You can still open the other folded notes.';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  });
}, { threshold: 0.38 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Set initial values on first load.
initScrollRevealStagger();
updateScrollProgress();
updateMotionSections();
initInfernoVaultScene();
initResistSection();
initGuidedMode();
