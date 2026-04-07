(() => {
  const phoneScreenSection = document.getElementById('phone-screen-love');
  const phoneLoveStage = document.getElementById('phoneLoveStage');
  const phoneLoveTrack = document.getElementById('phoneLoveTrack');
  const phoneLeft = document.getElementById('phoneLeft');
  const phoneRight = document.getElementById('phoneRight');
  const phoneDiscordNotification = document.getElementById('phoneDiscordNotification');

  const phoneNotificationAudio = new Audio('assets/audio/iphone_notification.mp3');
  phoneNotificationAudio.preload = 'auto';
  phoneNotificationAudio.volume = 0.10;

  let phoneSakuraCanvas = null;
  let phoneSakuraCtx = null;
  let phoneSakuraRaf = null;
  let phoneSakuraVisible = false;
  let phoneSakuraPetals = [];

  const SAKURA_LOOP_COUNT = 18;
  const SAKURA_PETAL_COLORS = [
    ['rgba(255,200,218,0.95)', 'rgba(255,148,184,0.7)'],
    ['rgba(255,220,233,0.90)', 'rgba(245,168,200,0.65)'],
    ['rgba(255,241,248,0.88)', 'rgba(238,185,212,0.60)'],
  ];

  const prefersReducedPhoneMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let phoneMotionRaf = null;
  let phoneMotionVisible = false;
  let phoneMotionObserver = null;
  let phoneNotificationTriggered = false;
  let phoneNotificationRevealTimer = null;
  let phoneNotificationHideTimer = null;
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

  function clearPhoneNotificationTimers() {
    if (phoneNotificationRevealTimer) {
      window.clearTimeout(phoneNotificationRevealTimer);
      phoneNotificationRevealTimer = null;
    }
    if (phoneNotificationHideTimer) {
      window.clearTimeout(phoneNotificationHideTimer);
      phoneNotificationHideTimer = null;
    }
  }

  function hidePhoneNotification() {
    if (!phoneDiscordNotification) return;
    phoneDiscordNotification.classList.remove('is-visible');
    phoneDiscordNotification.setAttribute('aria-hidden', 'true');
  }

  function resetPhoneNotification() {
    clearPhoneNotificationTimers();
    phoneNotificationTriggered = false;
    hidePhoneNotification();
  }

  function playPhoneNotificationAudio() {
    if (!phoneNotificationAudio) return;
    try {
      phoneNotificationAudio.currentTime = 0;
      const playPromise = phoneNotificationAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Fail silently when autoplay is blocked.
        });
      }
    } catch (error) {
      // Fail silently when audio playback is not allowed.
    }
  }

  function triggerPhoneNotification() {
    if (!phoneDiscordNotification || phoneNotificationTriggered) return;
    phoneNotificationTriggered = true;
    clearPhoneNotificationTimers();

    phoneNotificationRevealTimer = window.setTimeout(() => {
      phoneDiscordNotification.classList.add('is-visible');
      phoneDiscordNotification.setAttribute('aria-hidden', 'false');
      playPhoneNotificationAudio();

      phoneNotificationHideTimer = window.setTimeout(() => {
        hidePhoneNotification();
      }, 5200);
    }, 560);
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

    if (phoneMotionVisible) {
      setPhoneMotionTargets();
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

    if (phoneMotionVisible && !phoneNotificationTriggered && phoneMotionState.currentProgress >= 0.93) {
      triggerPhoneNotification();
    }

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

  function createSakuraPetal(width, height, fromBurst, burstX, burstY) {
    return {
      x: fromBurst ? burstX : Math.random() * width,
      y: fromBurst ? burstY : -20 - Math.random() * 60,
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

  function drawSakuraPetal(ctx, petal) {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.angle);
    const alpha = petal.burst ? petal.opacity * Math.min(1, petal.life * 3) : petal.opacity;
    ctx.globalAlpha = Math.max(0, alpha);
    const size = petal.size;
    const colors = SAKURA_PETAL_COLORS[petal.colorIdx];

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.55, -size * 0.55, size * 0.55, size * 0.55, 0, size);
    ctx.bezierCurveTo(-size * 0.55, size * 0.55, -size * 0.55, -size * 0.55, 0, -size);

    const gradient = ctx.createRadialGradient(0, -size * 0.2, 0, 0, 0, size * 1.1);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.82);
    ctx.lineTo(0, size * 0.82);
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
    const width = phoneSakuraCanvas.width;
    const height = phoneSakuraCanvas.height;

    ctx.clearRect(0, 0, width, height);

    const loopCount = phoneSakuraPetals.filter((petal) => !petal.burst).length;
    for (let i = loopCount; i < SAKURA_LOOP_COUNT; i += 1) {
      phoneSakuraPetals.push(createSakuraPetal(width, height, false));
    }

    phoneSakuraPetals = phoneSakuraPetals.filter((petal) => {
      petal.sway += petal.swaySpeed;
      petal.vx += Math.sin(petal.sway) * petal.swayAmp * 0.02;
      petal.vx *= 0.98;
      petal.x += petal.vx;
      petal.y += petal.vy;
      petal.angle += petal.angularV;

      if (petal.burst) {
        petal.vy += 0.13;
        petal.life -= 0.017;
        if (petal.life <= 0) return false;
      } else if (petal.y > height + 20 || petal.x < -30 || petal.x > width + 30) {
        return false;
      }

      drawSakuraPetal(ctx, petal);
      return true;
    });

    phoneSakuraRaf = window.requestAnimationFrame(animateSakura);
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        phoneSakuraVisible = entry.isIntersecting;
        if (phoneSakuraVisible && !phoneSakuraRaf) {
          phoneSakuraRaf = window.requestAnimationFrame(animateSakura);
        }
      });
    }, { threshold: 0.05 });

    if (phoneLoveStage) observer.observe(phoneLoveStage);
  }

  function initPhoneScreenSection() {
    if (!phoneLoveStage || !phoneLoveTrack) return;

    hidePhoneNotification();

    if (!phoneMotionObserver && phoneScreenSection) {
      phoneMotionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          phoneMotionVisible = entry.isIntersecting;
          if (phoneMotionVisible) {
            updatePhoneScreenMotion();
          } else {
            resetPhoneNotification();
          }
        });
      }, { threshold: 0.08 });

      phoneMotionObserver.observe(phoneScreenSection);
    }

    phoneLoveTrack.addEventListener('pointermove', (event) => {
      const rect = phoneLoveTrack.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      phoneMotionState.pointerX = clampValue(normalizedX, -1, 1) * 0.62;
      phoneMotionState.pointerY = clampValue(normalizedY, -1, 1) * 0.46;
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

  initPhoneScreenSection();

  window.addEventListener('beforeunload', () => {
    clearPhoneNotificationTimers();
  });
})();