const trackCards = document.querySelectorAll('.track-card');
const trackGrid = document.getElementById('trackGrid');
const togglePlayBtn = document.getElementById('togglePlayBtn');
const audioPlayer = document.getElementById('audioPlayer');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const nowPlayingArt = document.getElementById('nowPlayingArt');
const trackProgress = document.getElementById('trackProgress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const visualizer = document.getElementById('visualizer');
const notesContainer = document.getElementById('musicNotes');
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
const gifSlots = document.querySelectorAll('[data-role="gif-slot"]');
const flightRoute = document.getElementById('flightRoute');
const flightRouteGlow = document.getElementById('flightRouteGlow');
const planeToken = document.getElementById('planeToken');
const discordCallTimer = document.getElementById('discordCallTimer');
const queueState = document.getElementById('queueState');
const queueTimer = document.getElementById('queueTimer');
const queueHint = document.getElementById('queueHint');
const queueRing = document.getElementById('queueRing');
const startQueueBtn = document.getElementById('startQueueBtn');
const cancelQueueBtn = document.getElementById('cancelQueueBtn');
const queueShock = document.getElementById('queueShock');
const readyCheck = document.getElementById('readyCheck');
const readyCountdown = document.getElementById('readyCountdown');
const acceptReadyBtn = document.getElementById('acceptReadyBtn');
const declineReadyBtn = document.getElementById('declineReadyBtn');
const champCrashOverlay = document.getElementById('champCrashOverlay');
const champCrashRetryBtn = document.getElementById('champCrashRetryBtn');
const chatRestrictedModal = document.getElementById('chatRestrictedModal');
const chatRestrictedBackdrop = document.getElementById('chatRestrictedBackdrop');
const chatRestrictedCloseBtn = document.getElementById('chatRestrictedCloseBtn');
const chatRestrictedUnderstandBtn = document.getElementById('chatRestrictedUnderstandBtn');
const chatRestrictedPanel = document.getElementById('chatRestrictedPanel');
const chatRestrictedPill = document.getElementById('chatRestrictedPill');
const chatRestrictedCopy = document.getElementById('chatRestrictedCopy');
const chatLogList = document.getElementById('chatLogList');
const swapRoleBtn = document.getElementById('swapRoleBtn');
const ellaRole = document.getElementById('ellaRole');
const youRole = document.getElementById('youRole');
const duoBanterLine = document.getElementById('duoBanterLine');
const banterChips = document.querySelectorAll('.banter-chip');
const headspaceGrid = document.getElementById('headspaceGrid');
const memoryPop = document.getElementById('memoryPop');
const memoryClose = document.getElementById('memoryClose');
const memoryPopTitle = document.getElementById('memoryPopTitle');
const memoryPopImage = document.getElementById('memoryPopImage');
const memoryPopMessage = document.getElementById('memoryPopMessage');
const strawberryDesk = document.getElementById('strawberryDesk');
const resistSection = document.getElementById('resist-memory');
const resistCanvas = document.getElementById('resistCanvas');
const resistSpeaker = document.getElementById('resistSpeaker');
const resistDialogueText = document.getElementById('resistDialogueText');
const resistChoices = document.getElementById('resistChoices');
const guidedPager = document.getElementById('guidedPager');
const guidedPrevBtn = document.getElementById('guidedPrevBtn');
const guidedNextBtn = document.getElementById('guidedNextBtn');
const guidedDots = document.getElementById('guidedDots');
const digicamZoom = document.getElementById('digicamZoom');
const digicamPanY = document.getElementById('digicamPanY');
const heroDigicamTrigger = document.getElementById('heroDigicamTrigger');
const heroPolaroidStack = document.getElementById('heroPolaroidStack');
const heroHeartBurst = document.getElementById('heroHeartBurst');
const heroPolaroidReset = document.getElementById('heroPolaroidReset');
const phoneScreenSection = document.getElementById('phone-screen-love');
const phoneLoveStage = document.getElementById('phoneLoveStage');
const phoneLoveTrack = document.getElementById('phoneLoveTrack');
const phoneLeft = document.getElementById('phoneLeft');
const phoneRight = document.getElementById('phoneRight');
// Sakura canvas state
let phoneSakuraCanvas = null;
let phoneSakuraCtx = null;
let phoneSakuraRaf = null;
let phoneSakuraVisible = false;
let phoneSakuraPetals = [];
const SAKURA_LOOP_COUNT = 28;
const SAKURA_PETAL_COLORS = [
  ['rgba(255,200,218,0.95)', 'rgba(255,148,184,0.7)'],
  ['rgba(255,220,233,0.90)', 'rgba(245,168,200,0.65)'],
  ['rgba(255,241,248,0.88)', 'rgba(238,185,212,0.60)'],
];
const prefersReducedPhoneMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let phoneMotionRaf = null;
let phoneMotionVisible = false;
let phoneMotionObserver = null;
const phoneMotionState = {
  targetProgress: 0,
  currentProgress: 0,
  targetLeftX: -220,
  currentLeftX: -220,
  targetRightX: 220,
  currentRightX: 220,
  targetTilt: 10,
  currentTilt: 10,
  targetLift: 18,
  currentLift: 18,
  pointerX: 0,
  pointerY: 0,
  pointerXSmoothed: 0,
  pointerYSmoothed: 0,
};
const storyPanels = Array.from(document.querySelectorAll('.story-panel'));
// envelope-scene.js handles the love letter section now

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

document.addEventListener('click', (event) => {
  const target = event.target.closest('button, [role="button"]');
  if (!target || target.disabled) return;

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

  uiSounds.playClick();
});

let activeTrackCard = null;
let notesTimer = null;
let ticking = false;
let callDurationSeconds = (24 * 60 * 60) + (7 * 60) + 12;
let queueSeconds = 0;
let queueTimerHandle = null;
let readyTimerHandle = null;
let riotNoticeAcknowledged = false;
let openingSettleTimer = null;
let truthSequenceTimer = null;
let queueStartPending = false;
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
    text: 'Memory corridor online. Select a thread. Resist forgetting.',
    choices: [
      { label: 'Trace when Ella became home', nextId: 'home' },
      { label: 'Open the devotion file', nextId: 'love' },
      { label: 'Project our shared future', nextId: 'future' },
      { label: 'Replay one midnight call', nextId: 'nightcall' },
      { label: 'Open the vow terminal', nextId: 'promise' }
    ]
  },
  home: {
    speaker: 'Watcher',
    text: 'The loop was simple: call, laugh, breathe, stay. Somewhere in those repeats, distance lost authority and Ella became home.',
    choices: [
      { label: 'Return to memory index', nextId: 'start' },
      { label: 'Jump to future thread', nextId: 'future' },
      { label: 'Simulate alternate timeline', nextId: 'whatif' }
    ]
  },
  love: {
    speaker: 'Watcher',
    text: 'Ella carries gentleness like light. She makes ordinary hours feel ceremonial, like each small moment deserves to be kept.',
    choices: [
      { label: 'Replay from beginning', nextId: 'start' },
      { label: 'Commit to promise', nextId: 'promise' },
      { label: 'Read impact report', nextId: 'impact' }
    ]
  },
  future: {
    speaker: 'Watcher',
    text: 'Future log accepted: one kitchen, one playlist, and a thousand tiny rituals that say anniversary is not a date, but a daily practice.',
    choices: [
      { label: 'Seal this memory', nextId: 'promise' },
      { label: 'Return to archive', nextId: 'start' },
      { label: 'Load first journey plan', nextId: 'trip' }
    ]
  },
  nightcall: {
    speaker: 'You',
    text: 'On those midnight calls, even silence had shape. Different countries, same heartbeat, same soft goodnight.',
    choices: [
      { label: 'Back to archive', nextId: 'start' },
      { label: 'Continue to vow terminal', nextId: 'promise' }
    ]
  },
  impact: {
    speaker: 'Watcher',
    text: 'Impact summary: fear reduced, hope amplified. Ella turns survival mode into living mode.',
    choices: [
      { label: 'Return', nextId: 'start' },
      { label: 'Project forward', nextId: 'future' }
    ]
  },
  trip: {
    speaker: 'Watcher',
    text: 'Journey draft: train windows, shared headphones, one photo every stop, and one laugh we will quote for years.',
    choices: [
      { label: 'Append future log', nextId: 'future' },
      { label: 'Seal with vow', nextId: 'promise' }
    ]
  },
  whatif: {
    speaker: 'You',
    text: 'Alternate timeline rejected. A life without Ella is a version of me with less light. I choose this timeline, every time.',
    choices: [
      { label: 'Back to home thread', nextId: 'home' },
      { label: 'Restart corridor', nextId: 'start' }
    ]
  },
  promise: {
    speaker: 'You',
    text: 'Final vow: in every loop, every timeline, every anniversary, I choose you first, Ella. Always <3',
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
      clearInterval(autoTimer);
      autoTimer = setInterval(advance, 3500);
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

function initHeroPolaroidBlast() {
  if (!heroDigicamTrigger || !heroPolaroidStack || !heroHeartBurst) return;
  let unleashed = false;
  let unleashing = false;
  let shutterAudioContext = null;

  const playShutterSound = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      if (!shutterAudioContext) {
        shutterAudioContext = new AudioContextClass();
      }

      if (shutterAudioContext.state === 'suspended') {
        shutterAudioContext.resume();
      }

      const now = shutterAudioContext.currentTime;
      const gain = shutterAudioContext.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.42, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      gain.connect(shutterAudioContext.destination);

      const osc = shutterAudioContext.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1240, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.12);

      const buffer = shutterAudioContext.createBuffer(1, Math.floor(shutterAudioContext.sampleRate * 0.06), shutterAudioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - (i / data.length));
      }

      const noise = shutterAudioContext.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = shutterAudioContext.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      const noiseGain = shutterAudioContext.createGain();
      noiseGain.gain.setValueAtTime(0.22, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(shutterAudioContext.destination);
      noise.start(now + 0.01);
      noise.stop(now + 0.08);
    } catch (error) {
      // Audio should fail silently on unsupported/restricted environments.
    }
  };

  const spawnHearts = (count = 18) => {
    const hostRect = heroHeartBurst.getBoundingClientRect();
    const triggerRect = heroDigicamTrigger.getBoundingClientRect();
    const originX = (triggerRect.left - hostRect.left) + (triggerRect.width / 2);
    const originY = (triggerRect.top - hostRect.top) + (triggerRect.height / 2);
    const glyphs = ['❤', '♡', '💗'];

    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement('span');
      heart.className = 'hero-heart';
      heart.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];

      const dx = (Math.random() * 260) - 130;
      const dy = -80 - (Math.random() * 170);
      const duration = 700 + Math.floor(Math.random() * 360);
      const scale = (0.75 + (Math.random() * 0.9)).toFixed(2);

      heart.style.left = `${originX}px`;
      heart.style.top = `${originY}px`;
      heart.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      heart.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      heart.style.setProperty('--heart-dur', `${duration}ms`);
      heart.style.setProperty('--heart-scale', scale);

      heroHeartBurst.appendChild(heart);
      window.setTimeout(() => {
        heart.remove();
      }, duration + 120);
    }
  };

  const unleashPolaroids = () => {
    if (unleashing) return;
    unleashing = true;

    playShutterSound();
    heroDigicamTrigger.classList.remove('is-sneeze');
    void heroDigicamTrigger.offsetWidth;
    heroDigicamTrigger.classList.add('is-sneeze');

    spawnHearts(22);
    window.setTimeout(() => {
      spawnHearts(16);
    }, 180);

    window.setTimeout(() => {
      if (!unleashed) {
        unleashed = true;
        heroPolaroidStack.classList.add('is-unleashed');
        if (heroPolaroidReset) heroPolaroidReset.hidden = false;
      }

      heroDigicamTrigger.classList.add('is-fired');
      window.setTimeout(() => {
        heroDigicamTrigger.classList.remove('is-sneeze');
        unleashing = false;
      }, 680);
    }, 220);
  };

  const resetPolaroids = () => {
    if (unleashing) return;
    unleashed = false;
    heroDigicamTrigger.classList.remove('is-fired');
    heroDigicamTrigger.classList.remove('is-sneeze');
    heroPolaroidStack.classList.remove('is-unleashed');
    if (heroPolaroidReset) heroPolaroidReset.hidden = true;
  };

  heroDigicamTrigger.addEventListener('click', unleashPolaroids);
  heroDigicamTrigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      unleashPolaroids();
    }
  });

  heroPolaroidReset?.addEventListener('click', resetPolaroids);
}

function clampValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerpValue(current, target, amount) {
  return current + ((target - current) * amount);
}

function setPhoneMotionTargets() {
  if (!phoneScreenSection || !phoneLoveTrack || !phoneLeft || !phoneRight) return;

  const rect = phoneScreenSection.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const travel = vh * 0.95;
  const progressRaw = (vh * 0.9 - rect.top) / travel;
  const progress = clampValue(progressRaw, 0, 1);

  const trackWidth = Math.max(1, phoneLoveTrack.clientWidth);
  const leftWidth = phoneLeft.offsetWidth || Math.max(220, trackWidth * 0.3);
  const rightWidth = phoneRight.offsetWidth || leftWidth;
  const centerGap = Math.max(14, Math.min(38, trackWidth * 0.026));

  const leftStartX = -Math.round(leftWidth * 0.64);
  const rightStartX = Math.round(rightWidth * 0.64);

  const leftTargetX = Math.round((trackWidth * 0.5) - leftWidth - (centerGap * 0.5));
  const rightTargetX = Math.round((rightWidth - (trackWidth * 0.5)) + (centerGap * 0.5));

  phoneMotionState.targetProgress = progress;
  phoneMotionState.targetLeftX = leftStartX + ((leftTargetX - leftStartX) * progress);
  phoneMotionState.targetRightX = rightStartX + ((rightTargetX - rightStartX) * progress);
  phoneMotionState.targetTilt = 11 * (1 - progress);
  phoneMotionState.targetLift = 20 * (1 - progress);
}

function applyPhoneMotionFrame(timeMs) {
  if (!phoneScreenSection) {
    phoneMotionRaf = null;
    return;
  }

  const t = (timeMs || performance.now()) * 0.001;
  const reducedMotion = prefersReducedPhoneMotion.matches;

  const easing = reducedMotion ? 0.45 : 0.11;
  const pointerEase = reducedMotion ? 0.35 : 0.055;

  phoneMotionState.currentProgress = lerpValue(phoneMotionState.currentProgress, phoneMotionState.targetProgress, easing);
  phoneMotionState.currentLeftX = lerpValue(phoneMotionState.currentLeftX, phoneMotionState.targetLeftX, easing);
  phoneMotionState.currentRightX = lerpValue(phoneMotionState.currentRightX, phoneMotionState.targetRightX, easing);
  phoneMotionState.currentTilt = lerpValue(phoneMotionState.currentTilt, phoneMotionState.targetTilt, easing);
  phoneMotionState.currentLift = lerpValue(phoneMotionState.currentLift, phoneMotionState.targetLift, easing);
  phoneMotionState.pointerXSmoothed = lerpValue(phoneMotionState.pointerXSmoothed, phoneMotionState.pointerX, pointerEase);
  phoneMotionState.pointerYSmoothed = lerpValue(phoneMotionState.pointerYSmoothed, phoneMotionState.pointerY, pointerEase);

  let leftX = phoneMotionState.currentLeftX;
  let rightX = phoneMotionState.currentRightX;
  let leftBobY = 0;
  let rightBobY = 0;
  let leftRoll = 0;
  let rightRoll = 0;
  let leftScale = 1;
  let rightScale = 1;

  if (!reducedMotion) {
    const alive = 1 - (phoneMotionState.currentProgress * 0.44);
    const pointerInfluence = 1 - (phoneMotionState.currentProgress * 0.26);
    const px = phoneMotionState.pointerXSmoothed * pointerInfluence;
    const py = phoneMotionState.pointerYSmoothed * pointerInfluence;

    const idleSway = Math.sin(t * 0.76) * (3.4 * alive);
    leftX += (idleSway * 0.18) + (px * 6.2);
    rightX -= (idleSway * 0.18) + (px * 6.2);

    leftBobY = (Math.sin(t * 1.46) * (1.1 + (1.5 * alive))) + (Math.sin((t * 2.25) + 0.6) * (0.34 + (0.45 * alive))) - (py * 1.65);
    rightBobY = (Math.sin((t * 1.34) + 1.04) * (1.05 + (1.35 * alive))) + (Math.sin((t * 2.1) + 1.5) * (0.32 + (0.42 * alive))) - (py * 1.35);

    leftRoll = (Math.sin((t * 1.06) + 0.5) * (0.24 + (0.5 * alive))) + (px * 1.2);
    rightRoll = (Math.sin((t * 1.14) + 2.1) * (-0.22 - (0.46 * alive))) + (px * 1.0);

    leftScale = 1 + (Math.sin((t * 0.95) + 0.9) * (0.0012 + (alive * 0.0024)));
    rightScale = 1 + (Math.sin((t * 0.92) + 2.2) * (0.0012 + (alive * 0.0022)));
  }

  phoneScreenSection.style.setProperty('--phone-progress', phoneMotionState.currentProgress.toFixed(3));
  phoneScreenSection.style.setProperty('--phone-left-x', `${leftX.toFixed(2)}px`);
  phoneScreenSection.style.setProperty('--phone-right-x', `${rightX.toFixed(2)}px`);
  phoneScreenSection.style.setProperty('--phone-tilt', `${phoneMotionState.currentTilt.toFixed(2)}deg`);
  phoneScreenSection.style.setProperty('--phone-lift', `${phoneMotionState.currentLift.toFixed(2)}px`);
  phoneScreenSection.style.setProperty('--phone-left-bob-y', `${leftBobY.toFixed(2)}px`);
  phoneScreenSection.style.setProperty('--phone-right-bob-y', `${rightBobY.toFixed(2)}px`);
  phoneScreenSection.style.setProperty('--phone-left-roll', `${leftRoll.toFixed(2)}deg`);
  phoneScreenSection.style.setProperty('--phone-right-roll', `${rightRoll.toFixed(2)}deg`);
  phoneScreenSection.style.setProperty('--phone-left-scale', leftScale.toFixed(4));
  phoneScreenSection.style.setProperty('--phone-right-scale', rightScale.toFixed(4));

  const stillSettling =
    Math.abs(phoneMotionState.targetProgress - phoneMotionState.currentProgress) > 0.001
    || Math.abs(phoneMotionState.targetLeftX - phoneMotionState.currentLeftX) > 0.06
    || Math.abs(phoneMotionState.targetRightX - phoneMotionState.currentRightX) > 0.06
    || Math.abs(phoneMotionState.pointerXSmoothed) > 0.002
    || Math.abs(phoneMotionState.pointerYSmoothed) > 0.002;

  if (phoneMotionVisible || stillSettling) {
    phoneMotionRaf = window.requestAnimationFrame(applyPhoneMotionFrame);
  } else {
    phoneMotionRaf = null;
  }
}

function updatePhoneScreenMotion() {
  if (!phoneScreenSection || !phoneLoveTrack || !phoneLeft || !phoneRight) return;
  setPhoneMotionTargets();
  if (!phoneMotionRaf) {
    phoneMotionRaf = window.requestAnimationFrame(applyPhoneMotionFrame);
  }
}

function createSakuraPetal(w, h, fromBurst, bx, by) {
  return {
    x: fromBurst ? bx : Math.random() * w,
    y: fromBurst ? by : -20 - Math.random() * 60,
    vx: fromBurst ? (Math.random() - 0.5) * 7 : (Math.random() - 0.5) * 1.2,
    vy: fromBurst ? -(2.5 + Math.random() * 4) : (0.7 + Math.random() * 1.5),
    angle: Math.random() * Math.PI * 2,
    angularV: (Math.random() - 0.5) * 0.055,
    size: fromBurst ? (7 + Math.random() * 9) : (5 + Math.random() * 9),
    opacity: fromBurst ? 0.92 : (0.5 + Math.random() * 0.4),
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.012 + Math.random() * 0.018,
    swayAmp: 0.5 + Math.random() * 0.9,
    burst: fromBurst,
    life: fromBurst ? 1.0 : -1,
    colorIdx: Math.floor(Math.random() * SAKURA_PETAL_COLORS.length),
  };
}

function drawSakuraPetal(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  const alpha = p.burst ? p.opacity * Math.min(1, p.life * 3) : p.opacity;
  ctx.globalAlpha = Math.max(0, alpha);
  const s = p.size;
  const colors = SAKURA_PETAL_COLORS[p.colorIdx];

  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.55, -s * 0.55, s * 0.55, s * 0.55, 0, s);
  ctx.bezierCurveTo(-s * 0.55, s * 0.55, -s * 0.55, -s * 0.55, 0, -s);

  const grd = ctx.createRadialGradient(0, -s * 0.2, 0, 0, 0, s * 1.1);
  grd.addColorStop(0, colors[0]);
  grd.addColorStop(1, colors[1]);
  ctx.fillStyle = grd;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -s * 0.82);
  ctx.lineTo(0, s * 0.82);
  ctx.strokeStyle = 'rgba(210, 110, 155, 0.18)';
  ctx.lineWidth = 0.6;
  ctx.stroke();

  ctx.restore();
}

function animateSakura() {
  if (!phoneSakuraCanvas || !phoneSakuraCtx || !phoneSakuraVisible) {
    phoneSakuraRaf = null;
    return;
  }
  const ctx = phoneSakuraCtx;
  const w = phoneSakuraCanvas.width;
  const h = phoneSakuraCanvas.height;

  ctx.clearRect(0, 0, w, h);

  const loopCount = phoneSakuraPetals.filter(p => !p.burst).length;
  for (let i = loopCount; i < SAKURA_LOOP_COUNT; i++) {
    phoneSakuraPetals.push(createSakuraPetal(w, h, false));
  }

  phoneSakuraPetals = phoneSakuraPetals.filter(p => {
    p.sway += p.swaySpeed;
    p.vx += Math.sin(p.sway) * p.swayAmp * 0.02;
    p.vx *= 0.98;
    p.x += p.vx;
    p.y += p.vy;
    p.angle += p.angularV;

    if (p.burst) {
      p.vy += 0.13;
      p.life -= 0.017;
      if (p.life <= 0) return false;
    } else {
      if (p.y > h + 20 || p.x < -30 || p.x > w + 30) return false;
    }
    drawSakuraPetal(ctx, p);
    return true;
  });

  phoneSakuraRaf = requestAnimationFrame(animateSakura);
}

function initPhoneSakura() {
  phoneSakuraCanvas = document.getElementById('phoneSakuraCanvas');
  if (!phoneSakuraCanvas) return;
  phoneSakuraCtx = phoneSakuraCanvas.getContext('2d');

  const sizeCanvas = () => {
    const parent = phoneSakuraCanvas.parentElement;
    if (!parent) return;
    phoneSakuraCanvas.width = parent.offsetWidth || 800;
    phoneSakuraCanvas.height = parent.offsetHeight || 500;
  };
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      phoneSakuraVisible = e.isIntersecting;
      if (phoneSakuraVisible && !phoneSakuraRaf) {
        phoneSakuraRaf = requestAnimationFrame(animateSakura);
      }
    });
  }, { threshold: 0.05 });
  if (phoneLoveStage) obs.observe(phoneLoveStage);
}

function initPhoneScreenSection() {
  if (!phoneLoveStage || !phoneLoveTrack) return;

  if (!phoneMotionObserver && phoneScreenSection) {
    phoneMotionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        phoneMotionVisible = entry.isIntersecting;
        if (phoneMotionVisible) {
          updatePhoneScreenMotion();
        }
      });
    }, { threshold: 0.08 });
    phoneMotionObserver.observe(phoneScreenSection);
  }

  phoneLoveTrack.addEventListener('pointermove', (event) => {
    const rect = phoneLoveTrack.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    phoneMotionState.pointerX = clampValue(nx, -1, 1) * 0.62;
    phoneMotionState.pointerY = clampValue(ny, -1, 1) * 0.46;
    if (!phoneMotionRaf) {
      phoneMotionRaf = window.requestAnimationFrame(applyPhoneMotionFrame);
    }
  });

  phoneLoveTrack.addEventListener('pointerleave', () => {
    phoneMotionState.pointerX = 0;
    phoneMotionState.pointerY = 0;
    if (!phoneMotionRaf) {
      phoneMotionRaf = window.requestAnimationFrame(applyPhoneMotionFrame);
    }
  });

  initPhoneSakura();
  updatePhoneScreenMotion();
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

function initGifSlots() {
  gifSlots.forEach((img) => {
    const frame = img.closest('.gif-frame');
    const isLegacyFrame = Boolean(frame);

    if ((img.getAttribute('src') || '').includes('miku_spinning')) {
      img.classList.add('transparent-fit');
    }

    // If gif was cached before listeners attached, treat it as loaded.
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
  const prev   = document.getElementById('peakPrev');
  const next   = document.getElementById('peakNext');
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

  // Keyboard navigation when gallery is focused
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
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

  // Fallback if anime.js fails to load.
  planeToken.style.left = '50%';
  planeToken.style.top = '48%';
}

function formatClock(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function setQueueIdle() {
  if (queueTimerHandle) {
    window.clearInterval(queueTimerHandle);
    queueTimerHandle = null;
  }
  if (readyTimerHandle) {
    window.clearInterval(readyTimerHandle);
    readyTimerHandle = null;
  }

  queueSeconds = 0;
  if (queueTimer) queueTimer.textContent = '00:00';
  if (queueHint) queueHint.textContent = 'Not in queue. Press Find Match.';
  if (queueState) {
    queueState.textContent = 'Idle';
    queueState.classList.remove('searching', 'found');
  }
  queueRing?.classList.remove('searching');
  startQueueBtn && (startQueueBtn.disabled = false);
  cancelQueueBtn && (cancelQueueBtn.disabled = true);
  if (readyCheck) readyCheck.hidden = true;

  if (chatRestrictedPanel) chatRestrictedPanel.classList.remove('is-alert');
  if (chatRestrictedPill) chatRestrictedPill.textContent = 'All Chat Enabled';
  if (chatRestrictedCopy) chatRestrictedCopy.textContent = 'System: You can use all chat normally.';
  if (chatRestrictedModal) chatRestrictedModal.hidden = true;
  if (champCrashOverlay) champCrashOverlay.hidden = true;
  queueStartPending = false;
}

function showReadyCheck() {
  if (!readyCheck || !readyCountdown) return;

  readyCheck.hidden = false;
  let countdown = 10;
  readyCountdown.textContent = String(countdown);
  queueState && (queueState.textContent = 'Match Found');
  queueState?.classList.remove('searching');
  queueState?.classList.add('found');
  queueHint && (queueHint.textContent = 'Ready check popped. Accept fast.');

  queueShock?.classList.remove('show');
  void queueShock?.offsetWidth;
  queueShock?.classList.add('show');

  readyTimerHandle = window.setInterval(() => {
    countdown -= 1;
    readyCountdown.textContent = String(Math.max(0, countdown));
    if (countdown <= 0) {
      setQueueIdle();
      queueHint && (queueHint.textContent = 'Ready check timed out. Queue reset.');
    }
  }, 1000);
}

function initQueueLobby() {
  if (!startQueueBtn || !cancelQueueBtn || !queueTimer || !queueState) return;

  const setChatModalOpen = (isOpen) => {
    if (!chatRestrictedModal) return;
    chatRestrictedModal.hidden = !isOpen;
  };

  const closeChatModal = () => {
    setChatModalOpen(false);
    queueStartPending = false;
    if (!riotNoticeAcknowledged) {
      setChatRestricted(false);
    }
  };

  const beginQueueSearch = () => {
    if (queueTimerHandle) return;

    startQueueBtn.disabled = true;
    cancelQueueBtn.disabled = false;
    queueState.textContent = 'Searching';
    queueState.classList.add('searching');
    queueHint && (queueHint.textContent = 'Queueing for Ranked Solo/Duo...');
    queueRing?.classList.add('searching');
    setChatRestricted(true);

    queueTimerHandle = window.setInterval(() => {
      queueSeconds += 1;
      queueTimer.textContent = formatClock(queueSeconds);

      if (queueSeconds === 3) {
        if (queueTimerHandle) {
          window.clearInterval(queueTimerHandle);
          queueTimerHandle = null;
        }
        showReadyCheck();
      }
    }, 1000);
  };

  const setChatRestricted = (isRestricted) => {
    if (!chatRestrictedPanel || !chatRestrictedPill || !chatRestrictedCopy) return;
    chatRestrictedPanel.classList.toggle('is-alert', isRestricted);

    if (isRestricted) {
      chatRestrictedPill.textContent = 'Chat Restricted: 5 Games';
      chatRestrictedCopy.textContent = 'Penalty reason: abusive language in all chat.';
      if (chatLogList && !chatLogList.dataset.bumped) {
        const extraLog = document.createElement('li');
        extraLog.textContent = '[System]: You have been chat restricted for abusive language in all chat.';
        chatLogList.prepend(extraLog);
        chatLogList.dataset.bumped = 'true';
      }
      return;
    }

    chatRestrictedPill.textContent = 'All Chat Enabled';
    chatRestrictedCopy.textContent = 'System: You can use all chat normally.';
  };

  startQueueBtn.addEventListener('click', () => {
    if (queueTimerHandle) return;
    if (!riotNoticeAcknowledged) {
      queueStartPending = true;
      setChatRestricted(true);
      setChatModalOpen(true);
      return;
    }

    beginQueueSearch();
  });

  chatRestrictedUnderstandBtn?.addEventListener('click', () => {
    riotNoticeAcknowledged = true;
    setChatModalOpen(false);

    if (queueStartPending) {
      queueStartPending = false;
      beginQueueSearch();
    }
  });

  chatRestrictedCloseBtn?.addEventListener('click', closeChatModal);
  chatRestrictedBackdrop?.addEventListener('click', closeChatModal);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && chatRestrictedModal && !chatRestrictedModal.hidden) {
      closeChatModal();
    }
  });

  cancelQueueBtn.addEventListener('click', () => {
    setQueueIdle();
    queueHint && (queueHint.textContent = 'Queue cancelled.');
    setChatRestricted(false);
  });

  acceptReadyBtn?.addEventListener('click', () => {
    if (readyTimerHandle) {
      window.clearInterval(readyTimerHandle);
      readyTimerHandle = null;
    }
    readyCheck && (readyCheck.hidden = true);
    queueHint && (queueHint.textContent = 'Accepted. Entering champ select...');
    queueState.textContent = 'Accepted';
    queueState.classList.remove('searching');
    queueState.classList.add('found');
    cancelQueueBtn.disabled = true;
    setChatRestricted(true);

    if (champCrashOverlay) {
      window.setTimeout(() => {
        champCrashOverlay.hidden = false;
        const fill = document.getElementById('champCrashFill');
        if (fill) {
          fill.style.animation = 'none';
          void fill.offsetWidth;
          fill.style.animation = '';
        }
      }, 680);
    }
  });

  champCrashRetryBtn?.addEventListener('click', () => {
    setQueueIdle();
    queueHint && (queueHint.textContent = 'Connection lost. Press Find Match to retry.');
  });

  declineReadyBtn?.addEventListener('click', () => {
    setQueueIdle();
    queueHint && (queueHint.textContent = 'Declined. Back to lobby.');
    setChatRestricted(false);
  });

  swapRoleBtn?.addEventListener('click', () => {
    if (!ellaRole || !youRole) return;
    const ellaText = ellaRole.textContent;
    ellaRole.textContent = youRole.textContent || '';
    youRole.textContent = ellaText || '';
  });

  banterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const line = chip.getAttribute('data-line') || 'Queue vibes only.';
      if (duoBanterLine) duoBanterLine.textContent = `"${line}"`;
    });
  });
}

function openMemory(card) {
  if (!memoryPop || !memoryPopTitle || !memoryPopImage || !memoryPopMessage) return;

  const title = card.dataset.memoryTitle || 'Untitled Memory';
  const image = card.dataset.memoryImage || 'assets/images/memory-01.jpg';
  const message = card.dataset.memoryMessage || 'A memory opens here.';

  memoryPopTitle.textContent = title;
  memoryPopImage.src = image;
  memoryPopImage.alt = title;
  memoryPopMessage.textContent = message;

  memoryPop.hidden = false;
  memoryPop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMemory() {
  if (!memoryPop) return;
  memoryPop.hidden = true;
  memoryPop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initHeadspaceMemories() {
  if (!headspaceGrid) return;

  // Portal modal to body so section transforms/overflow do not trap it.
  if (memoryPop && memoryPop.parentElement !== document.body) {
    document.body.appendChild(memoryPop);
  }

  headspaceGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.memory-orb');
    if (!card) return;
    openMemory(card);
  });

  memoryClose?.addEventListener('click', closeMemory);

  memoryPop?.addEventListener('click', (event) => {
    if (event.target === memoryPop) {
      uiSounds.playPaper();
      closeMemory();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && memoryPop && !memoryPop.hidden) {
      closeMemory();
    }
  });
}

function initStrawberryDesktop() {
  if (!strawberryDesk) return;

  const appButtons = Array.from(strawberryDesk.querySelectorAll('[data-desktop-app]'));
  const panes = Array.from(strawberryDesk.querySelectorAll('[data-pane]'));
  if (!appButtons.length || !panes.length) return;

  const setActiveApp = (appName) => {
    strawberryDesk.setAttribute('data-active-app', appName);

    appButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-desktop-app') === appName;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    panes.forEach((pane) => {
      const isActive = pane.getAttribute('data-pane') === appName;
      pane.classList.toggle('is-active', isActive);
      pane.hidden = !isActive;
    });
  };

  appButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const appName = btn.getAttribute('data-desktop-app') || 'photos';
      setActiveApp(appName);
    });
  });

  const spotifyToggle = strawberryDesk.querySelector('#spotifyJamToggle');
  const spotifyProgressFill = strawberryDesk.querySelector('#spotifyProgressFill');
  const spotifyNowTitle = strawberryDesk.querySelector('#spotifyNowTitle');
  const spotifyHeroTitle = strawberryDesk.querySelector('.spotify-hero h3');
  const spotifyPlaylists = Array.from(strawberryDesk.querySelectorAll('.spotify-side-item'));
  const spotifyTracks = Array.from(strawberryDesk.querySelectorAll('.spotify-track'));
  let spotifyProgress = 0;
  let spotifyTimer = null;

  const stopSpotify = () => {
    if (spotifyTimer) {
      window.clearInterval(spotifyTimer);
      spotifyTimer = null;
    }
    if (spotifyToggle) {
      spotifyToggle.textContent = 'Play';
      spotifyToggle.setAttribute('aria-pressed', 'false');
    }
  };

  spotifyToggle?.addEventListener('click', () => {
    const currentlyPlaying = spotifyToggle.getAttribute('aria-pressed') === 'true';
    if (currentlyPlaying) {
      stopSpotify();
      return;
    }

    spotifyToggle.textContent = 'Pause';
    spotifyToggle.setAttribute('aria-pressed', 'true');
    if (spotifyTimer) window.clearInterval(spotifyTimer);

    spotifyTimer = window.setInterval(() => {
      spotifyProgress = (spotifyProgress + 1.4) % 100;
      if (spotifyProgressFill) spotifyProgressFill.style.width = `${spotifyProgress.toFixed(1)}%`;
    }, 180);
  });

  spotifyTracks.forEach((trackBtn) => {
    trackBtn.addEventListener('click', () => {
      spotifyTracks.forEach((btn) => btn.classList.remove('is-active'));
      trackBtn.classList.add('is-active');
      const title = trackBtn.getAttribute('data-track-title') || 'Bodies';
      if (spotifyNowTitle) spotifyNowTitle.textContent = title;
      spotifyProgress = 0;
      if (spotifyProgressFill) spotifyProgressFill.style.width = '0%';
    });
  });

  spotifyPlaylists.forEach((playlistBtn) => {
    playlistBtn.addEventListener('click', () => {
      spotifyPlaylists.forEach((btn) => btn.classList.remove('is-active'));
      playlistBtn.classList.add('is-active');
      const playlistName = playlistBtn.getAttribute('data-playlist-name') || 'emyan + johnny';
      if (spotifyHeroTitle) spotifyHeroTitle.textContent = playlistName;
    });
  });

  const albumList = strawberryDesk.querySelector('#photosAlbumList');
  const photosGrid = strawberryDesk.querySelector('#photosGrid');
  const albumSummary = strawberryDesk.querySelector('#photosAlbumSummary');
  const activeAlbumTitle = strawberryDesk.querySelector('#photosActiveAlbumTitle');
  const activeAlbumMeta = strawberryDesk.querySelector('#photosActiveAlbumMeta');
  const previewImage = strawberryDesk.querySelector('#photosPreviewImage');
  const previewTitle = strawberryDesk.querySelector('#photosPreviewTitle');
  const previewDate = strawberryDesk.querySelector('#photosPreviewDate');
  const previewPlace = strawberryDesk.querySelector('#photosPreviewPlace');
  let photoThumbs = [];

  const albumOrder = ['all', 'ella', 'games', 'johnny', 'us'];
  const albumFolders = albumOrder.filter((key) => key !== 'all');
  const fallbackPhotoAlbums = {
    ella: [],
    games: [
      { src: 'assets/images/photos/games/20250418233217_1.jpg', title: '20250418233217_1' },
      { src: 'assets/images/photos/games/20250830143034_1.jpg', title: '20250830143034_1' },
      { src: 'assets/images/photos/games/20250830145235_1.jpg', title: '20250830145235_1' },
      { src: 'assets/images/photos/games/20251208234947_1.jpg', title: '20251208234947_1' }
    ],
    johnny: [
      { src: 'assets/images/photos/johnny/johnny_avatar.jpg', title: 'johnny_avatar' }
    ],
    us: []
  };
  let photoAlbums = { ...fallbackPhotoAlbums, all: [] };
  let activeAlbum = 'all';

  const selectPhotoThumb = (thumb) => {
    if (!thumb) return;
    photoThumbs.forEach((btn) => btn.classList.remove('is-active'));
    thumb.classList.add('is-active');

    const src = thumb.getAttribute('data-photo-src') || '';
    const title = thumb.getAttribute('data-photo-title') || 'Memory';
    const album = thumb.getAttribute('data-photo-album') || 'Album';
    const index = thumb.getAttribute('data-photo-index') || '1';
    if (previewImage && src) previewImage.src = src;
    if (previewImage) previewImage.alt = title;
    if (previewTitle) previewTitle.textContent = title;
    if (previewDate) previewDate.textContent = album;
    if (previewPlace) previewPlace.textContent = `Photo ${index}`;
  };

  const toAlbumLabel = (key) => {
    if (key === 'all') return 'All Photos';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const isImageFile = (filename) => /\.(png|jpe?g|webp|gif|avif)$/i.test(filename || '');

  const toPhotoTitle = (filename) => {
    const base = (filename || '').replace(/\.[^.]+$/, '');
    return base.replace(/[_-]+/g, ' ');
  };

  const buildAllAlbum = (albums) => {
    return albumFolders.flatMap((folder) => {
      const items = albums[folder] || [];
      return items.map((item) => ({
        src: item.src,
        title: `${folder} / ${item.title || 'photo'}`
      }));
    });
  };

  const updateAlbumSummary = () => {
    if (!albumSummary) return;
    albumSummary.textContent = `${albumFolders.length} albums • ${(photoAlbums.all || []).length} photos`;
  };

  const renderAlbums = () => {
    if (!albumList) return;
    albumList.innerHTML = '';

    albumOrder.forEach((albumKey) => {
      const count = photoAlbums[albumKey]?.length || 0;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'photos-album-btn';
      btn.setAttribute('data-album', albumKey);
      btn.innerHTML = `<span>${toAlbumLabel(albumKey)}</span><strong>${count}</strong>`;
      btn.addEventListener('click', () => {
        activeAlbum = albumKey;
        renderAlbums();
        renderGrid();
      });
      btn.classList.toggle('is-active', albumKey === activeAlbum);
      albumList.appendChild(btn);
    });
  };

  const renderGrid = () => {
    if (!photosGrid) return;
    photosGrid.innerHTML = '';

    const albumItems = photoAlbums[activeAlbum] || [];
    if (activeAlbumTitle) activeAlbumTitle.textContent = toAlbumLabel(activeAlbum);
    if (activeAlbumMeta) activeAlbumMeta.textContent = `${albumItems.length} photo${albumItems.length === 1 ? '' : 's'}`;

    if (!albumItems.length) {
      const empty = document.createElement('p');
      empty.className = 'photos-empty';
      empty.textContent = 'No photos in this album yet.';
      photosGrid.appendChild(empty);

      if (previewImage) previewImage.src = 'assets/images/hero-placeholder.jpg';
      if (previewImage) previewImage.alt = 'No photo selected';
      if (previewTitle) previewTitle.textContent = 'No photos yet';
      if (previewDate) previewDate.textContent = toAlbumLabel(activeAlbum);
      if (previewPlace) previewPlace.textContent = 'Waiting for uploads';
      photoThumbs = [];
      return;
    }

    albumItems.forEach((item, idx) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'photos-thumb';
      thumb.setAttribute('data-photo-src', item.src);
      thumb.setAttribute('data-photo-title', item.title || `Photo ${idx + 1}`);
      thumb.setAttribute('data-photo-album', toAlbumLabel(activeAlbum));
      thumb.setAttribute('data-photo-index', `${idx + 1}`);

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title || `Photo ${idx + 1}`;
      img.loading = 'lazy';
      thumb.appendChild(img);

      thumb.addEventListener('click', () => selectPhotoThumb(thumb));
      photosGrid.appendChild(thumb);
    });

    photoThumbs = Array.from(photosGrid.querySelectorAll('.photos-thumb'));
    if (photoThumbs.length) {
      photoThumbs[0].classList.add('is-active');
      selectPhotoThumb(photoThumbs[0]);
    }
  };

  const tryLoadAlbumsFromFolders = async () => {
    const discovered = {};

    await Promise.all(albumFolders.map(async (folder) => {
      try {
        const response = await fetch(`assets/images/photos/${folder}/`, { cache: 'no-store' });
        if (!response.ok) throw new Error('album listing not available');

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a[href]'));
        const fileSet = new Set();

        links.forEach((anchor) => {
          const href = anchor.getAttribute('href') || '';
          if (!href || href.startsWith('?') || href.startsWith('#')) return;

          const clean = href.split('?')[0].split('#')[0];
          const decoded = decodeURIComponent(clean);
          if (decoded.endsWith('/')) return;

          const filename = decoded.split('/').pop() || '';
          if (!filename || !isImageFile(filename)) return;
          fileSet.add(filename);
        });

        const sortedFiles = Array.from(fileSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        discovered[folder] = sortedFiles.map((filename) => ({
          src: `assets/images/photos/${folder}/${encodeURIComponent(filename)}`,
          title: toPhotoTitle(filename)
        }));
      } catch (error) {
        discovered[folder] = fallbackPhotoAlbums[folder] || [];
      }
    }));

    photoAlbums = {
      ...discovered,
      all: buildAllAlbum(discovered)
    };

    if (!(photoAlbums[activeAlbum] || []).length) {
      activeAlbum = 'all';
    }

    updateAlbumSummary();
    renderAlbums();
    renderGrid();
  };

  photoAlbums.all = buildAllAlbum(photoAlbums);
  updateAlbumSummary();
  renderAlbums();
  renderGrid();
  void tryLoadAlbumsFromFolders();

  const discordChannels = Array.from(strawberryDesk.querySelectorAll('.discord-channel'));
  const discordMessages = Array.from(strawberryDesk.querySelectorAll('.discord-message'));
  const discordChannelTitle = strawberryDesk.querySelector('#discordChannelTitle');
  const discordComposerChannel = strawberryDesk.querySelector('#discordComposerChannel');

  discordChannels.forEach((channelBtn) => {
    channelBtn.addEventListener('click', () => {
      const channel = channelBtn.getAttribute('data-channel') || 'general';
      discordChannels.forEach((btn) => btn.classList.toggle('is-active', btn === channelBtn));
      discordMessages.forEach((msg) => {
        msg.hidden = msg.getAttribute('data-channel') !== channel;
      });
      if (discordChannelTitle) discordChannelTitle.textContent = `# ${channel}`;
      if (discordComposerChannel) discordComposerChannel.textContent = channel;
    });
  });

  const initialDiscordChannel = discordChannels.find((btn) => btn.classList.contains('is-active'))?.getAttribute('data-channel') || 'general';
  if (discordChannelTitle) discordChannelTitle.textContent = `# ${initialDiscordChannel}`;
  if (discordComposerChannel) discordComposerChannel.textContent = initialDiscordChannel;

  // Browser chrome tabs (camera, stats.fm, keep, in my room, ellamori)
  const browserPane = strawberryDesk.querySelector('.pane-browser');
  if (browserPane) {
    const browserTabBtns = Array.from(browserPane.querySelectorAll('[data-browser-tab]'));
    const browserContents = Array.from(browserPane.querySelectorAll('[data-browser-content]'));
    const browserAddress = browserPane.querySelector('.browser-address-text');

    const roomContent = browserPane.querySelector('.room-content');
    const roomWalletPhotoWrap = roomContent?.querySelector('.room-wallet-photo-wrap');
    const roomExpandBtns = Array.from(browserPane.querySelectorAll('[data-room-expand]'));
    const roomLightbox = browserPane.querySelector('#roomLightbox');
    const roomLightboxImage = browserPane.querySelector('#roomLightboxImage');
    const roomCloseBtns = Array.from(browserPane.querySelectorAll('[data-room-close]'));

    const ellamoriContent = browserPane.querySelector('.ellamori-content');
    const ellamoriStage = browserPane.querySelector('#ellamoriStage');
    const ellamoriRoom = browserPane.querySelector('#ellamoriRoom');
    const ellamoriPlayer = browserPane.querySelector('#ellamoriPlayer');
    const ellamoriPrompt = browserPane.querySelector('#ellamoriPrompt');
    const ellamoriFade = browserPane.querySelector('#ellamoriFade');
    const ellamoriDialog = browserPane.querySelector('#ellamoriDialog');
    const ellamoriDialogText = browserPane.querySelector('#ellamoriDialogText');
    const ellamoriDialogHint = browserPane.querySelector('#ellamoriDialogHint');
    const ellamoriDialogItem = browserPane.querySelector('#ellamoriDialogItem');
    const ellamoriDialogSpeaker = browserPane.querySelector('#ellamoriDialogSpeaker');
    const ellamoriDialogNext = browserPane.querySelector('#ellamoriDialogNext');
    const ellamoriObjects = Array.from(browserPane.querySelectorAll('[data-ellamori-object]'));

    const ellamoriObjectLabels = {
      phone: "johnny's phone",
      digicam: 'digicam',
      cake: 'strawberry cake'
    };

    const ellamoriObjectTitles = {
      phone: "JOHNNY'S PHONE",
      digicam: 'DIGICAM',
      cake: 'STRAWBERRY CAKE'
    };

    const ellamoriLines = {
      phone: [
        "wait, he's not here. let me check his phone",
        "what the hell, why does he have 300 photos of me?!"
      ],
      digicam: [
        "oh, it's the camera i gave to him.",
        "omg. he took even more pictures of me"
      ],
      cake: [
        "he made another one?! why is it growing mold.",
        "eww. he seriously cannot bake"
      ],
      ending: [
        "...",
        "ok fine. maybe it's kind of sweet.",
        "i miss him."
      ]
    };

    const ellamoriState = {
      active: false,
      x: 120,
      y: 120,
      speed: 128,
      keysDown: new Set(),
      nearbyObject: '',
      dialogObject: '',
      dialogIndex: 0,
      dialogOpen: false,
      lastTime: 0,
      started: false,
      discovered: new Set(),
      endingShown: false,
      prevNearest: '',
      facingLeft: false,
      typewriterTimer: null,
      isTyping: false
    };

    // Web Audio blip (no file needed)
    let ellamoriAudioCtx = null;
    const playEllamoriBlip = () => {
      try {
        if (!ellamoriAudioCtx) ellamoriAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ellamoriAudioCtx.createOscillator();
        const gain = ellamoriAudioCtx.createGain();
        osc.connect(gain);
        gain.connect(ellamoriAudioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(520, ellamoriAudioCtx.currentTime);
        gain.gain.setValueAtTime(0.06, ellamoriAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ellamoriAudioCtx.currentTime + 0.045);
        osc.start();
        osc.stop(ellamoriAudioCtx.currentTime + 0.045);
      } catch (_) {}
    };

    const tabUrls = {
      camera: 'https://strawberry.love/lens',
      statsfm: 'https://stats.fm/',
      keep: 'https://keep.google.com/',
      room: 'about:blank',
      ellamori: 'about:ellamori'
    };

    const isMoveKey = (key) => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key);

    // Typewriter engine
    const typewriterWrite = (text, onDone) => {
      if (!ellamoriDialogText) return;
      if (ellamoriState.typewriterTimer) clearInterval(ellamoriState.typewriterTimer);
      ellamoriState.isTyping = true;
      ellamoriDialogText.classList.add('is-typing');
      let i = 0;
      ellamoriDialogText.textContent = '';
      ellamoriState.typewriterTimer = setInterval(() => {
        i += 1;
        ellamoriDialogText.textContent = text.slice(0, i);
        playEllamoriBlip();
        if (i >= text.length) {
          clearInterval(ellamoriState.typewriterTimer);
          ellamoriState.typewriterTimer = null;
          ellamoriState.isTyping = false;
          ellamoriDialogText.classList.remove('is-typing');
          if (onDone) onDone();
        }
      }, 34);
    };

    const typewriterSkip = () => {
      if (!ellamoriState.isTyping || !ellamoriDialogText) return false;
      if (ellamoriState.typewriterTimer) clearInterval(ellamoriState.typewriterTimer);
      ellamoriState.typewriterTimer = null;
      ellamoriState.isTyping = false;
      ellamoriDialogText.classList.remove('is-typing');
      const lines = ellamoriLines[ellamoriState.dialogObject] || [];
      ellamoriDialogText.textContent = lines[ellamoriState.dialogIndex] || '';
      return true;
    };

    // Fade helpers
    const ellamoriFadeIn = (cb) => {
      if (!ellamoriFade) { if (cb) cb(); return; }
      ellamoriFade.classList.add('is-opaque');
      setTimeout(() => { if (cb) cb(); }, 640);
    };
    const ellamoriFadeOut = (cb) => {
      if (!ellamoriFade) { if (cb) cb(); return; }
      ellamoriFade.classList.remove('is-opaque');
      if (cb) setTimeout(cb, 640);
    };

    const closeEllamoriDialog = () => {
      if (!ellamoriDialog || ellamoriDialog.hidden) return;
      if (ellamoriState.typewriterTimer) clearInterval(ellamoriState.typewriterTimer);
      ellamoriState.typewriterTimer = null;
      ellamoriState.isTyping = false;
      ellamoriDialog.hidden = true;
      ellamoriState.dialogOpen = false;
      ellamoriState.dialogObject = '';
      ellamoriState.dialogIndex = 0;
    };

    const setEllamoriPrompt = (nextObject) => {
      if (!ellamoriPrompt) return;
      if (!nextObject || !ellamoriState.active || ellamoriState.dialogOpen) {
        ellamoriPrompt.hidden = true;
        ellamoriPrompt.textContent = 'press E';
        return;
      }
      const objectLabel = ellamoriObjectLabels[nextObject] || nextObject;
      ellamoriPrompt.textContent = `press E · ${objectLabel}`;
      ellamoriPrompt.hidden = false;
    };

    const updateEllamoriNearbyClass = (nearestKey) => {
      ellamoriObjects.forEach((obj) => {
        const key = obj.getAttribute('data-ellamori-object') || '';
        obj.classList.toggle('is-nearby', key === nearestKey && Boolean(nearestKey));
      });
    };

    const updateEllamoriDialogHint = () => {
      if (!ellamoriDialogHint || !ellamoriState.dialogObject) return;
      const lines = ellamoriLines[ellamoriState.dialogObject] || [];
      const currentLine = ellamoriState.dialogIndex + 1;
      const totalLines = lines.length || 1;
      const isLast = currentLine >= totalLines;
      ellamoriDialogHint.textContent = isLast ? 'E or Enter to close' : `${currentLine}/${totalLines} · continue`;
    };

    const getNearestEllamoriObject = () => {
      if (!ellamoriRoom || !ellamoriPlayer || !ellamoriObjects.length) return '';

      const roomRect = ellamoriRoom.getBoundingClientRect();
      const playerX = ellamoriState.x + ellamoriPlayer.offsetWidth / 2;
      const playerY = ellamoriState.y + ellamoriPlayer.offsetHeight / 2;
      let nearestKey = '';
      let nearestDistance = Number.POSITIVE_INFINITY;

      ellamoriObjects.forEach((obj) => {
        const rect = obj.getBoundingClientRect();
        const objectX = rect.left - roomRect.left + rect.width / 2;
        const objectY = rect.top - roomRect.top + rect.height / 2;
        const dx = objectX - playerX;
        const dy = objectY - playerY;
        const distance = Math.hypot(dx, dy);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestKey = obj.getAttribute('data-ellamori-object') || '';
        }
      });

      return nearestDistance <= 38 ? nearestKey : '';
    };

    const showEllamoriLine = (objectKey, index) => {
      const lines = ellamoriLines[objectKey] || [];
      const text = lines[index] || '';
      if (ellamoriDialogItem) {
        ellamoriDialogItem.textContent = (index === 0 && objectKey !== 'ending')
          ? (ellamoriObjectTitles[objectKey] || '')
          : '';
      }
      typewriterWrite(text, () => updateEllamoriDialogHint());
      updateEllamoriDialogHint();
    };

    const openEllamoriDialogue = (objectKey) => {
      if (!ellamoriDialog || !ellamoriDialogText || !objectKey) return;
      const lines = ellamoriLines[objectKey];
      if (!Array.isArray(lines) || !lines.length) return;

      ellamoriState.dialogObject = objectKey;
      ellamoriState.dialogIndex = 0;
      ellamoriState.dialogOpen = true;
      ellamoriDialog.hidden = false;
      if (ellamoriDialogSpeaker) ellamoriDialogSpeaker.textContent = 'ELLA';
      showEllamoriLine(objectKey, 0);
      setEllamoriPrompt('');
    };

    const advanceEllamoriDialogue = () => {
      if (!ellamoriDialogText || !ellamoriState.dialogObject) return;
      // If still typing, skip to end first
      if (typewriterSkip()) return;

      const lines = ellamoriLines[ellamoriState.dialogObject] || [];
      if (ellamoriState.dialogIndex >= lines.length - 1) {
        const finishedKey = ellamoriState.dialogObject;
        closeEllamoriDialog();
        if (finishedKey !== 'ending') {
          ellamoriState.discovered.add(finishedKey);
          if (!ellamoriState.endingShown && ellamoriState.discovered.size >= 3) {
            ellamoriState.endingShown = true;
            ellamoriFadeIn(() => {
              setTimeout(() => {
                ellamoriFadeOut(() => openEllamoriDialogue('ending'));
              }, 400);
            });
          }
        } else {
          // Ending finished — final fade to black
          setTimeout(() => ellamoriFadeIn(), 400);
        }
        return;
      }

      ellamoriState.dialogIndex += 1;
      showEllamoriLine(ellamoriState.dialogObject, ellamoriState.dialogIndex);
    };

    const drawEllamoriPlayer = (horizontal) => {
      if (!ellamoriPlayer || !ellamoriRoom) return;
      const maxX = Math.max(0, ellamoriRoom.clientWidth - ellamoriPlayer.offsetWidth);
      const maxY = Math.max(0, ellamoriRoom.clientHeight - ellamoriPlayer.offsetHeight);
      ellamoriState.x = clampValue(ellamoriState.x, 0, maxX);
      ellamoriState.y = clampValue(ellamoriState.y, 0, maxY);
      ellamoriPlayer.style.left = `${ellamoriState.x}px`;
      ellamoriPlayer.style.top = `${ellamoriState.y}px`;
      // Flip sprite based on horizontal direction
      if (horizontal < 0 && !ellamoriState.facingLeft) {
        ellamoriState.facingLeft = true;
        ellamoriPlayer.style.transform = 'scaleX(-1)';
      } else if (horizontal > 0 && ellamoriState.facingLeft) {
        ellamoriState.facingLeft = false;
        ellamoriPlayer.style.transform = 'scaleX(1)';
      }
    };

    const updateEllamori = (timeMs) => {
      if (!ellamoriState.started || !ellamoriRoom || !ellamoriPlayer) return;

      if (!ellamoriState.lastTime) {
        ellamoriState.lastTime = timeMs;
      }

      const delta = Math.min(0.05, (timeMs - ellamoriState.lastTime) / 1000);
      ellamoriState.lastTime = timeMs;

      if (ellamoriState.active && !ellamoriState.dialogOpen) {
        const horizontal = (ellamoriState.keysDown.has('ArrowRight') || ellamoriState.keysDown.has('d') ? 1 : 0)
          - (ellamoriState.keysDown.has('ArrowLeft') || ellamoriState.keysDown.has('a') ? 1 : 0);
        const vertical = (ellamoriState.keysDown.has('ArrowDown') || ellamoriState.keysDown.has('s') ? 1 : 0)
          - (ellamoriState.keysDown.has('ArrowUp') || ellamoriState.keysDown.has('w') ? 1 : 0);

        const isMoving = Boolean(horizontal || vertical);
        ellamoriPlayer.classList.toggle('is-walking', isMoving);

        if (isMoving) {
          const length = Math.hypot(horizontal, vertical) || 1;
          ellamoriState.x += (horizontal / length) * ellamoriState.speed * delta;
          ellamoriState.y += (vertical / length) * ellamoriState.speed * delta;
          drawEllamoriPlayer(horizontal);
        }

        const nearest = getNearestEllamoriObject();
        if (nearest !== ellamoriState.prevNearest) {
          ellamoriState.prevNearest = nearest;
          updateEllamoriNearbyClass(nearest);
        }
        ellamoriState.nearbyObject = nearest;
        setEllamoriPrompt(nearest);
      }

      window.requestAnimationFrame(updateEllamori);
    };

    const setEllamoriActive = (isActive) => {
      ellamoriState.active = Boolean(isActive && ellamoriContent && ellamoriStage && ellamoriRoom && ellamoriPlayer);
      if (!ellamoriState.active) {
        ellamoriState.keysDown.clear();
        ellamoriState.nearbyObject = '';
        setEllamoriPrompt('');
        closeEllamoriDialog();
        return;
      }

      if (!ellamoriState.started) {
        ellamoriState.started = true;
        ellamoriState.x = Math.max(14, (ellamoriRoom.clientWidth * 0.5) - 12);
        ellamoriState.y = Math.max(14, (ellamoriRoom.clientHeight * 0.56) - 16);
        drawEllamoriPlayer(0);
        window.requestAnimationFrame(updateEllamori);
      }

      // Fade in from black each time the tab is entered
      if (ellamoriFade) ellamoriFade.classList.add('is-opaque');
      setTimeout(() => {
        if (ellamoriFade) ellamoriFade.classList.remove('is-opaque');
      }, 50);

      const nearest = getNearestEllamoriObject();
      ellamoriState.nearbyObject = nearest;
      setEllamoriPrompt(nearest);
      ellamoriStage.focus({ preventScroll: true });
    };

    const closeRoomLightbox = () => {
      if (!roomLightbox || roomLightbox.hidden) return;
      roomLightbox.hidden = true;
      roomLightbox.setAttribute('aria-hidden', 'true');
      if (roomLightboxImage) {
        roomLightboxImage.removeAttribute('src');
      }
    };

    const openRoomLightbox = (src, altText) => {
      if (!roomLightbox || !roomLightboxImage || !src) return;
      roomLightboxImage.src = src;
      roomLightboxImage.alt = altText || 'Expanded room photo';
      roomLightbox.hidden = false;
      roomLightbox.setAttribute('aria-hidden', 'false');
    };

    roomExpandBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        openRoomLightbox(btn.getAttribute('data-room-src') || '', btn.getAttribute('data-room-alt') || 'Expanded room photo');
      });
    });

    roomCloseBtns.forEach((btn) => {
      btn.addEventListener('click', closeRoomLightbox);
    });

    ellamoriObjects.forEach((obj) => {
      obj.addEventListener('click', () => {
        if (!ellamoriState.active || ellamoriState.dialogOpen) return;
        const objectKey = obj.getAttribute('data-ellamori-object') || '';
        if (objectKey) openEllamoriDialogue(objectKey);
      });
    });

    if (ellamoriDialogNext) {
      ellamoriDialogNext.addEventListener('click', advanceEllamoriDialogue);
    }

    if (ellamoriDialog) {
      ellamoriDialog.addEventListener('click', (event) => {
        if (!ellamoriState.active || !ellamoriState.dialogOpen) return;
        if (event.target === ellamoriDialogNext) return;
        advanceEllamoriDialogue();
      });
    }

    window.addEventListener('keydown', (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (ellamoriState.active && isMoveKey(key)) {
        ellamoriState.keysDown.add(key);
        event.preventDefault();
      }

      if (ellamoriState.active && (key === 'e' || key === 'Enter' || key === ' ')) {
        if (ellamoriState.dialogOpen) {
          advanceEllamoriDialogue();
        } else if (ellamoriState.nearbyObject) {
          openEllamoriDialogue(ellamoriState.nearbyObject);
        }
        event.preventDefault();
      }

      if (event.key === 'Escape') {
        closeRoomLightbox();
        closeEllamoriDialog();
      }
    });

    window.addEventListener('keyup', (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (isMoveKey(key)) {
        ellamoriState.keysDown.delete(key);
      }
    });

    const setActiveBrowserTab = (tabName) => {
      browserTabBtns.forEach((btn) => {
        const active = btn.getAttribute('data-browser-tab') === tabName;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      browserContents.forEach((panel) => {
        panel.hidden = panel.getAttribute('data-browser-content') !== tabName;
      });
      if (browserAddress) browserAddress.textContent = tabUrls[tabName] || '';

      if (tabName !== 'room') {
        closeRoomLightbox();
      } else if (roomWalletPhotoWrap) {
        roomWalletPhotoWrap.classList.remove('is-revealed');
        void roomWalletPhotoWrap.offsetWidth;
        roomWalletPhotoWrap.classList.add('is-revealed');
      }

      setEllamoriActive(tabName === 'ellamori');
    };

    browserTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => setActiveBrowserTab(btn.getAttribute('data-browser-tab') || 'camera'));
    });

    setActiveBrowserTab('camera');
  }

  setActiveApp(strawberryDesk.getAttribute('data-active-app') || 'spotify');
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

    // Guided mode: animate only when the section containing this SVG is active/visible.
    window.addEventListener('guidedPanelActivated', (event) => {
      const panel = event.detail?.panel;
      if (panel && panel.contains(svg)) {
        playHandwrite(svg);
      }
    });

    // Also trigger after opening overlay closes if this section is currently active.
    window.addEventListener('openingOverlayClosed', () => {
      const activePanel = document.querySelector('.story-panel:not(.guided-hidden)');
      if (activePanel && activePanel.contains(svg)) {
        playHandwrite(svg);
      }
    });
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

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function updateNowPlayingUI(card) {
  const title = card.dataset.title || 'Untitled track';
  const artist = card.dataset.artist || 'Unknown artist';
  const art = card.dataset.art;

  nowPlayingTitle.textContent = title;
  nowPlayingArtist.textContent = artist;

  // If you provide real cover image paths in data-art, they appear here.
  if (art) {
    nowPlayingArt.style.backgroundImage = `linear-gradient(140deg, rgba(196, 225, 255, 0.5), rgba(169, 208, 245, 0.5)), url('${art}')`;
    nowPlayingArt.textContent = '';
  } else {
    nowPlayingArt.style.backgroundImage = '';
    nowPlayingArt.textContent = 'ALBUM ART';
  }
}

function triggerAlbumTransition(card) {
  const playerCard = document.querySelector('.player-card');

  card.classList.remove('spin-in');
  void card.offsetWidth;
  card.classList.add('spin-in');

  if (playerCard) {
    playerCard.classList.remove('spotlight');
    void playerCard.offsetWidth;
    playerCard.classList.add('spotlight');
  }

  nowPlayingArt.classList.remove('bump');
  void nowPlayingArt.offsetWidth;
  nowPlayingArt.classList.add('bump');
}

function setPlayingState(isPlaying) {
  const playerCard = document.querySelector('.player-card');
  if (!playerCard) return;

  playerCard.classList.toggle('is-playing', isPlaying);
  togglePlayBtn.textContent = isPlaying ? 'Pause' : 'Play';

  if (isPlaying) {
    startNotes();
  } else {
    stopNotes();
  }
}

function stopCurrentTrackHighlight() {
  trackCards.forEach((card) => {
    card.classList.remove('active');
    const btn = card.querySelector('.track-play-btn');
    if (btn) btn.textContent = 'Play';
  });
}

function setCardAsActive(card, isPlaying) {
  stopCurrentTrackHighlight();
  card.classList.add('active');
  if (isPlaying) triggerAlbumTransition(card);
  const btn = card.querySelector('.track-play-btn');
  if (btn) btn.textContent = isPlaying ? 'Pause' : 'Play';
  activeTrackCard = card;
}

async function loadAndPlayTrack(card) {
  const src = card.dataset.audio;

  // Placeholder tracks may not exist yet. Keep this alert so it is easy to debug missing files.
  if (!src) {
    alert('No audio source found. Add data-audio on this track card.');
    return;
  }

  // Set audio source from card metadata.
  audioPlayer.src = src;
  updateNowPlayingUI(card);

  try {
    await audioPlayer.play();
    setCardAsActive(card, true);
    setPlayingState(true);
  } catch (error) {
    console.error('Playback failed:', error);
    alert('Could not play this file yet. Add a valid MP3 path or hosted audio URL.');
    setPlayingState(false);
  }
}

trackGrid?.addEventListener('click', (event) => {
  const playBtn = event.target.closest('.track-play-btn');
  if (!playBtn) return;

  const card = playBtn.closest('.track-card');
  if (!card) return;

  const isSameTrack = activeTrackCard === card;

  if (isSameTrack && !audioPlayer.paused) {
    audioPlayer.pause();
    setCardAsActive(card, false);
    setPlayingState(false);
    return;
  }

  if (isSameTrack && audioPlayer.paused) {
    audioPlayer.play().then(() => {
      setCardAsActive(card, true);
      setPlayingState(true);
    }).catch(() => {
      alert('Unable to resume. Check your audio source file path.');
    });
    return;
  }

  loadAndPlayTrack(card);
});

togglePlayBtn?.addEventListener('click', async () => {
  if (!audioPlayer.src && trackCards[0]) {
    await loadAndPlayTrack(trackCards[0]);
    return;
  }

  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
      if (activeTrackCard) setCardAsActive(activeTrackCard, true);
      setPlayingState(true);
    } catch {
      alert('Playback blocked or missing source. Select a track with a valid MP3 first.');
    }
  } else {
    audioPlayer.pause();
    if (activeTrackCard) setCardAsActive(activeTrackCard, false);
    setPlayingState(false);
  }
});

audioPlayer?.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
  trackProgress.value = '0';
});

audioPlayer?.addEventListener('timeupdate', () => {
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);

  if (audioPlayer.duration) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    trackProgress.value = String(progress);
  }
});

audioPlayer?.addEventListener('ended', () => {
  setPlayingState(false);
  if (activeTrackCard) {
    setCardAsActive(activeTrackCard, false);
  }
});

trackProgress?.addEventListener('input', () => {
  if (!audioPlayer.duration) return;
  const percent = Number(trackProgress.value) / 100;
  audioPlayer.currentTime = percent * audioPlayer.duration;
});

function makeNote() {
  if (!notesContainer) return;

  const note = document.createElement('span');
  note.className = 'note';
  note.textContent = Math.random() > 0.5 ? '\u266A' : '\u266B';
  note.style.left = `${Math.random() * 90 + 5}%`;
  note.style.fontSize = `${0.8 + Math.random() * 0.6}rem`;
  notesContainer.appendChild(note);

  setTimeout(() => {
    note.remove();
  }, 2800);
}

function startNotes() {
  if (notesTimer) return;
  notesTimer = setInterval(makeNote, 460);
}

function stopNotes() {
  if (!notesTimer) return;
  clearInterval(notesTimer);
  notesTimer = null;
}

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
  });
}

function onScrollAnimate() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      updateMotionSections();
      updatePhoneScreenMotion();
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
initGifSlots();
initDiscordCallTimer();
initPeakGallery();
initFlightRouteAnimation();
initQueueLobby();
initHeadspaceMemories();
initStrawberryDesktop();
initAppleHandwriting();
initInfernoVaultScene();
initResistSection();
initGuidedMode();
initDigicam();
initHeroPolaroidBlast();
initPhoneScreenSection();
