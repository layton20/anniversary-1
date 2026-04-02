/**
 * envelope-scene.js
 * Romantic envelope opening interaction (vanilla JS).
 */

(function initRomanticEnvelope() {
  const envelope = document.getElementById('romanticEnvelope');
  const heartsHost = document.getElementById('envelopeHearts');
  const letter = document.getElementById('romanticLetter');
  const letterText = document.getElementById('romanticLetterText');

  if (!envelope || !letter || !letterText) return;

  const fullMessage = letterText.getAttribute('data-fulltext') || '';
  let opened = false;
  let typeTimer = null;

  function typeMessage(text) {
    if (typeTimer) {
      window.clearInterval(typeTimer);
      typeTimer = null;
    }

    letterText.textContent = '';
    let i = 0;

    typeTimer = window.setInterval(() => {
      i += 1;
      letterText.textContent = text.slice(0, i);
      if (i >= text.length) {
        window.clearInterval(typeTimer);
        typeTimer = null;
      }
    }, 23);
  }

  function spawnHearts() {
    if (!heartsHost) return;
    heartsHost.innerHTML = '';

    const count = 16;
    const glyphs = ['', '', ''];

    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement('span');
      heart.className = 'burst-heart';
      heart.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];

      const driftX = (Math.random() * 160) - 80;
      const rise = Math.random() * 60;
      const size = Math.random();
      const dur = 1.05 + Math.random() * 0.9;

      heart.style.setProperty('--driftX', `${driftX.toFixed(1)}px`);
      heart.style.setProperty('--rise', `${rise.toFixed(1)}px`);
      heart.style.setProperty('--size', size.toFixed(2));
      heart.style.setProperty('--dur', `${dur.toFixed(2)}s`);

      heart.style.animationDelay = `${(Math.random() * 0.22).toFixed(2)}s`;

      heartsHost.appendChild(heart);

      window.setTimeout(() => {
        heart.remove();
      }, (dur + 0.3) * 1000);
    }
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;

    envelope.classList.add('is-open');
    envelope.setAttribute('aria-expanded', 'true');

    spawnHearts();

    window.setTimeout(() => {
      letter.classList.add('is-visible');
      letter.setAttribute('aria-hidden', 'false');
      typeMessage(fullMessage);
    }, 420);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openEnvelope();
    }
  });
})();
