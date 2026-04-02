/**
 * envelope-scene.js
 * Letter section interaction: turn on vinyl, then unlock and open the envelope.
 */

(function initRomanticEnvelope() {
  const envelopeStage = document.getElementById('letterEnvelopeStage');
  const letter = document.getElementById('letterPopup');
  const hint = document.getElementById('envelopeHint');
  const lockNote = document.getElementById('letterLockNote');
  const vinylPowerBtn = document.getElementById('vinylPowerBtn');
  const vinylTurntable = document.getElementById('vinylTurntable');
  const vinylStatus = document.getElementById('vinylStatus');

  if (!envelopeStage || !letter || !hint || !vinylPowerBtn || !vinylTurntable || !vinylStatus) return;

  let opened = false;
  let vinylReady = false;
  let ambienceStarted = false;
  let ambienceContext = null;

  function startVinylAmbience() {
    if (ambienceStarted) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      ambienceContext = new AudioContextClass();
      if (ambienceContext.state === 'suspended') {
        ambienceContext.resume();
      }

      const now = ambienceContext.currentTime;
      const master = ambienceContext.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.012, now + 1.3);
      master.connect(ambienceContext.destination);

      const masterFilter = ambienceContext.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(1500, now);
      masterFilter.Q.setValueAtTime(0.55, now);
      master.disconnect();
      master.connect(masterFilter);
      masterFilter.connect(ambienceContext.destination);

      const bedOsc = ambienceContext.createOscillator();
      bedOsc.type = 'sine';
      bedOsc.frequency.setValueAtTime(182, now);

      const bedGain = ambienceContext.createGain();
      bedGain.gain.setValueAtTime(0.0007, now);
      bedOsc.connect(bedGain);
      bedGain.connect(master);

      const lfo = ambienceContext.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.14, now);
      const lfoGain = ambienceContext.createGain();
      lfoGain.gain.setValueAtTime(0.00035, now);
      lfo.connect(lfoGain);
      lfoGain.connect(bedGain.gain);

      const noiseBuffer = ambienceContext.createBuffer(1, Math.floor(ambienceContext.sampleRate * 1.6), ambienceContext.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * 0.32;
      }

      const crackle = ambienceContext.createBufferSource();
      crackle.buffer = noiseBuffer;
      crackle.loop = true;

      const crackleLowpass = ambienceContext.createBiquadFilter();
      crackleLowpass.type = 'lowpass';
      crackleLowpass.frequency.setValueAtTime(1600, now);
      const crackleHighpass = ambienceContext.createBiquadFilter();
      crackleHighpass.type = 'highpass';
      crackleHighpass.frequency.setValueAtTime(860, now);

      const crackleGain = ambienceContext.createGain();
      crackleGain.gain.setValueAtTime(0.0025, now);

      crackle.connect(crackleLowpass);
      crackleLowpass.connect(crackleHighpass);
      crackleHighpass.connect(crackleGain);
      crackleGain.connect(master);

      const needleTone = ambienceContext.createOscillator();
      needleTone.type = 'triangle';
      needleTone.frequency.setValueAtTime(860, now);
      needleTone.frequency.exponentialRampToValueAtTime(410, now + 0.16);
      const needleGain = ambienceContext.createGain();
      needleGain.gain.setValueAtTime(0.0001, now);
      needleGain.gain.exponentialRampToValueAtTime(0.012, now + 0.02);
      needleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      needleTone.connect(needleGain);
      needleGain.connect(master);

      bedOsc.start(now);
      lfo.start(now);
      crackle.start(now);
      needleTone.start(now + 0.03);
      needleTone.stop(now + 0.24);
      ambienceStarted = true;
    } catch (error) {
      // Audio should fail silently on unsupported/restricted environments.
    }
  }

  function updateLockedState() {
    envelopeStage.classList.toggle('is-locked', !vinylReady);
    envelopeStage.classList.toggle('is-ready', vinylReady);
    envelopeStage.setAttribute('data-locked', String(!vinylReady));
    hint.disabled = !vinylReady;
    hint.setAttribute('aria-disabled', String(!vinylReady));
    hint.textContent = vinylReady ? 'tap to open' : 'start the record first';
    if (lockNote) {
      lockNote.hidden = vinylReady;
    }
  }

  function openEnvelope() {
    if (!vinylReady || opened) return;
    opened = true;

    envelopeStage.classList.add('is-opened');
    envelopeStage.setAttribute('aria-expanded', 'true');
    hint.hidden = true;

    window.setTimeout(() => {
      letter.hidden = false;
      requestAnimationFrame(() => {
        letter.classList.add('visible');
      });
      letter.setAttribute('aria-hidden', 'false');
      vinylStatus.textContent = 'Now playing: OUR STORY. The letter is ready for you.';
    }, 420);
  }

  function nudgeLockedState() {
    if (vinylReady) return;
    envelopeStage.classList.remove('is-shaking');
    void envelopeStage.offsetWidth;
    envelopeStage.classList.add('is-shaking');
    vinylStatus.textContent = 'Turn the record on first, then the envelope will open.';
  }

  vinylPowerBtn.addEventListener('click', () => {
    if (vinylReady) return;
    vinylReady = true;
    vinylTurntable.classList.add('is-spinning');
    vinylPowerBtn.classList.add('is-on');
    vinylPowerBtn.textContent = 'now spinning';
    vinylPowerBtn.setAttribute('aria-pressed', 'true');
    updateLockedState();
    startVinylAmbience();
    vinylStatus.textContent = 'The record is spinning. Now you can open the envelope.';
  });

  envelopeStage.addEventListener('click', (event) => {
    if (event.target.closest('#letterPopup')) return;
    if (!vinylReady) {
      nudgeLockedState();
      return;
    }

    if (event.target === hint || event.target === envelopeStage || event.target.tagName === 'CANVAS') {
      openEnvelope();
    }
  });

  hint.addEventListener('click', (event) => {
    event.preventDefault();
    openEnvelope();
  });

  updateLockedState();
})();
