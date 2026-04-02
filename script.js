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
const infernoStartBtn = document.getElementById('infernoStartBtn');
const infernoIntro = document.getElementById('infernoIntro');
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
const guidedPager = document.getElementById('guidedPager');
const guidedPrevBtn = document.getElementById('guidedPrevBtn');
const guidedNextBtn = document.getElementById('guidedNextBtn');
const guidedDots = document.getElementById('guidedDots');
const storyPanels = Array.from(document.querySelectorAll('.story-panel'));
// envelope-scene.js handles the love letter section now

let activeTrackCard = null;
let notesTimer = null;
let ticking = false;
let callDurationSeconds = (24 * 60 * 60) + (7 * 60) + 12;
let queueSeconds = 0;
let queueTimerHandle = null;
let readyTimerHandle = null;
let activeStoryPanelIndex = 0;
let infernoVaultRenderer = null;
let infernoVaultScene = null;
let infernoVaultCamera = null;
let infernoVaultLidPivot = null;
let infernoVaultCore = null;
let infernoVaultAura = null;
let infernoVaultRaf = null;
let infernoVaultTargetOpen = 0;
let infernoVaultCurrentOpen = 0;
let infernoVaultTargetEnergy = 0.25;
let infernoVaultCurrentEnergy = 0.25;
const infernoVaultClock = typeof THREE !== 'undefined' ? new THREE.Clock() : null;

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
  setInfernoVaultState(false);
  if (!infernoVaultRaf) {
    infernoVaultRaf = window.requestAnimationFrame(animateInfernoVaultScene);
  }
}

function closeOpeningOverlay() {
  if (!openingOverlay) return;
  openingOverlay.classList.add('hidden');
  openingOverlay.setAttribute('aria-hidden', 'true');
  window.dispatchEvent(new CustomEvent('openingOverlayClosed'));
}

function isOpeningOverlayVisible() {
  if (!openingOverlay) return false;
  const ariaHidden = openingOverlay.getAttribute('aria-hidden') === 'true';
  const hasHiddenClass = openingOverlay.classList.contains('hidden');
  return !ariaHidden && !hasHiddenClass;
}

function renderGuidedDots() {
  if (!guidedDots || !storyPanels.length) return;

  guidedDots.innerHTML = '';
  storyPanels.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'guided-dot';
    dot.setAttribute('aria-label', `Go to section ${index + 1}`);
    dot.addEventListener('click', () => applyGuidedPanel(index, true));
    guidedDots.appendChild(dot);
  });
}

function applyGuidedPanel(index, forceAnimate = false) {
  if (!storyPanels.length) return;

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

  startQueueBtn.addEventListener('click', () => {
    if (queueTimerHandle) return;

    startQueueBtn.disabled = true;
    cancelQueueBtn.disabled = false;
    queueState.textContent = 'Searching';
    queueState.classList.add('searching');
    queueHint && (queueHint.textContent = 'Queueing for Ranked Duo...');
    queueRing?.classList.add('searching');

    queueTimerHandle = window.setInterval(() => {
      queueSeconds += 1;
      queueTimer.textContent = formatClock(queueSeconds);

      if (queueSeconds === 8) {
        if (queueTimerHandle) {
          window.clearInterval(queueTimerHandle);
          queueTimerHandle = null;
        }
        showReadyCheck();
      }
    }, 1000);
  });

  cancelQueueBtn.addEventListener('click', () => {
    setQueueIdle();
    queueHint && (queueHint.textContent = 'Queue cancelled.');
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
  });

  declineReadyBtn?.addEventListener('click', () => {
    setQueueIdle();
    queueHint && (queueHint.textContent = 'Declined. Back to lobby.');
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

function initOpenLetter() { /* replaced by envelope-scene.js */ }

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
      closeMemory();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && memoryPop && !memoryPop.hidden) {
      closeMemory();
    }
  });
}

function initHandwriteText() {
  const handwriteEls = document.querySelectorAll('[data-handwrite]');
  if (!handwriteEls.length) return;

  handwriteEls.forEach((el, index) => {
    const text = el.getAttribute('data-handwrite') || el.textContent || '';
    el.textContent = '';

    if (window.TypeIt) {
      new window.TypeIt(el, {
        speed: 64,
        lifeLike: true,
        waitUntilVisible: true,
        startDelay: 420 + (index * 260),
        cursorChar: '|'
      }).type(text).go();
    } else {
      el.textContent = text;
    }
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

  svgs.forEach((svg) => {
    const mode = svg.getAttribute('data-handwrite-svg') || 'scroll';

    if (mode === 'immediate') {
      playHandwrite(svg);
      return;
    }

    const inGuidedMode = document.body.classList.contains('guided-mode');
    if (!inGuidedMode && window.ScrollTrigger) {
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
  openingEnvelopeBtn.setAttribute('aria-expanded', 'true');
  openingEnvelopeBtn.classList.add('opened');
  if (openingEnvelopeMessage) {
    openingEnvelopeMessage.textContent = 'mail opened. loading your story...';
  }

  window.setTimeout(() => {
    closeOpeningOverlay();
  }, 520);
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
  note.textContent = Math.random() > 0.5 ? '♪' : '♫';
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

function updateMotionSections() {
  motionSections.forEach((section) => {
    section.classList.add('motion-active');
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

mailboxGrid?.addEventListener('click', (event) => {
  const card = event.target.closest('.locker-door');
  if (!card) return;

  const name = card.dataset.name || 'Unknown';
  const hasLetters = card.dataset.hasLetters === 'true';
  const foldedNotes = [
    {
      title: 'Folded Note 1',
      preview: 'open me first',
      note: 'You are still my favorite hello and my safest place.'
    },
    {
      title: 'Folded Note 2',
      preview: 'little secret',
      note: 'From UK to Sweden, I would cross every timezone for you.',
      tone: 'note-alt'
    },
    {
      title: 'Folded Note 3',
      preview: 'you win',
      note: 'Every version of my future looks better with you in it.',
      tone: 'note-soft'
    },
    {
      title: 'Folded Note 4',
      preview: 'final one',
      note: 'I love you, and I still choose you every single day.'
    }
  ];

  document.querySelectorAll('.locker-door').forEach((locker) => locker.classList.remove('opened'));
  card.classList.remove('opening');
  void card.offsetWidth;
  card.classList.add('opening');

  window.setTimeout(() => {
    card.classList.remove('opening');
    card.classList.add('opened');
  }, 540);

  mailRevealName.textContent = `${name}'s locker`;
  setInfernoVaultState(hasLetters);
  if (hasLetters) {
    if (notePile) {
      notePile.hidden = false;
      notePile.innerHTML = '';

      foldedNotes.forEach((note) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `folded-note ${note.tone || ''}`.trim();
        btn.innerHTML = `<strong>${note.title}</strong><span>${note.preview}</span>`;
        btn.setAttribute('data-note', note.note);
        notePile.appendChild(btn);
      });
    }

    if (unfoldedNote) {
      unfoldedNote.hidden = false;
      unfoldedNote.classList.remove('show');
    }
    if (unfoldedNoteText) {
      unfoldedNoteText.textContent = 'Pick one folded note to unfold her message.';
    }

    mailRevealText.textContent = 'Locker opened. Singles Inferno result: this contestant received notes. Click one to unfold.';
  } else {
    if (notePile) {
      notePile.hidden = true;
      notePile.innerHTML = '';
    }
    if (unfoldedNote) {
      unfoldedNote.hidden = true;
      unfoldedNote.classList.remove('show');
    }
    mailRevealText.textContent = 'Empty locker tonight. Singles Inferno result: no notes this round.';
  }

  if (mailRevealMeta) {
    mailRevealMeta.textContent = hasLetters
      ? `Mailbox mission update: Ella has 4 folded post-it notes waiting.`
      : `Mailbox mission update: only Ella received notes this round.`;
  }

  mailReveal.classList.remove('flash');
  void mailReveal.offsetWidth;
  mailReveal.classList.add('flash');
});

notePile?.addEventListener('click', (event) => {
  const noteCard = event.target.closest('.folded-note');
  if (!noteCard) return;

  notePile.querySelectorAll('.folded-note').forEach((btn) => btn.classList.remove('active'));
  noteCard.classList.add('active');

  const note = noteCard.getAttribute('data-note') || 'A note appears here.';
  if (unfoldedNote && unfoldedNoteText) {
    unfoldedNote.hidden = false;
    unfoldedNoteText.textContent = note;
    unfoldedNote.classList.remove('show');
    void unfoldedNote.offsetWidth;
    unfoldedNote.classList.add('show');
  }
  mailRevealText.textContent = 'Unfolded. You can open another folded note too.';
});

infernoStartBtn?.addEventListener('click', () => {
  mailboxGrid?.classList.remove('locked');
  mailboxGrid?.querySelectorAll('.locker-door').forEach((locker) => {
    locker.removeAttribute('disabled');
  });

  setInfernoVaultState(false);
  if (mailReveal) {
    mailReveal.dataset.state = 'idle';
  }

  if (mailRevealName) mailRevealName.textContent = 'Choose a locker door';
  if (mailRevealText) mailRevealText.textContent = 'Round started. Open one locker to reveal tonight\'s Singles Inferno notes.';
  if (mailRevealMeta) mailRevealMeta.textContent = 'Host note: one contestant received notes this night.';
  if (infernoIntro) {
    infernoIntro.style.display = 'none';
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Set initial values on first load.
updateScrollProgress();
updateMotionSections();
initGifSlots();
initDiscordCallTimer();
initFlightRouteAnimation();
initQueueLobby();
initOpenLetter();
initHeadspaceMemories();
initHandwriteText();
initAppleHandwriting();
initInfernoVaultScene();
initGuidedMode();
