(() => {
  const headspaceGrid = document.getElementById('headspaceGrid');
  const memoryPop = document.getElementById('memoryPop');
  const memoryClose = document.getElementById('memoryClose');
  const memoryPopTitle = document.getElementById('memoryPopTitle');
  const memoryPopImage = document.getElementById('memoryPopImage');
  const memoryPopMessage = document.getElementById('memoryPopMessage');
  const heroDigicamTrigger = document.getElementById('heroDigicamTrigger');
  const heroPolaroidStack = document.getElementById('heroPolaroidStack');
  const heroHeartBurst = document.getElementById('heroHeartBurst');
  const heroPolaroidReset = document.getElementById('heroPolaroidReset');

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
        window.uiSounds?.playPaper?.();
        closeMemory();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && memoryPop && !memoryPop.hidden) {
        closeMemory();
      }
    });
  }

  initHeadspaceMemories();
  initHeroPolaroidBlast();
})();