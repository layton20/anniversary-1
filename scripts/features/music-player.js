(() => {
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
  const notesContainer = document.getElementById('musicNotes');

  let activeTrackCard = null;
  let notesTimer = null;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function updateNowPlayingUI(card) {
    if (!nowPlayingTitle || !nowPlayingArtist || !nowPlayingArt) return;

    const title = card.dataset.title || 'Untitled track';
    const artist = card.dataset.artist || 'Unknown artist';
    const art = card.dataset.art;

    nowPlayingTitle.textContent = title;
    nowPlayingArtist.textContent = artist;

    if (art) {
      nowPlayingArt.style.backgroundImage = `linear-gradient(140deg, rgba(196, 225, 255, 0.5), rgba(169, 208, 245, 0.5)), url('${art}')`;
      nowPlayingArt.textContent = '';
    } else {
      nowPlayingArt.style.backgroundImage = '';
      nowPlayingArt.textContent = 'ALBUM ART';
    }
  }

  function triggerAlbumTransition(card) {
    if (!nowPlayingArt) return;

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

  function makeNote() {
    if (!notesContainer) return;

    const note = document.createElement('span');
    note.className = 'note';
    note.textContent = Math.random() > 0.5 ? '\u266A' : '\u266B';
    note.style.left = `${Math.random() * 90 + 5}%`;
    note.style.fontSize = `${0.8 + Math.random() * 0.6}rem`;
    notesContainer.appendChild(note);

    window.setTimeout(() => {
      note.remove();
    }, 2800);
  }

  function startNotes() {
    if (notesTimer) return;
    notesTimer = window.setInterval(makeNote, 460);
  }

  function stopNotes() {
    if (!notesTimer) return;
    window.clearInterval(notesTimer);
    notesTimer = null;
  }

  function setPlayingState(isPlaying) {
    if (!togglePlayBtn) return;

    const playerCard = document.querySelector('.player-card');
    if (playerCard) {
      playerCard.classList.toggle('is-playing', isPlaying);
    }
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
    if (!audioPlayer) return;

    const src = card.dataset.audio;
    if (!src) {
      alert('No audio source found. Add data-audio on this track card.');
      return;
    }

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
    if (!audioPlayer) return;

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

    void loadAndPlayTrack(card);
  });

  togglePlayBtn?.addEventListener('click', async () => {
    if (!audioPlayer) return;

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
    if (!durationEl || !trackProgress) return;
    durationEl.textContent = formatTime(audioPlayer.duration);
    trackProgress.value = '0';
  });

  audioPlayer?.addEventListener('timeupdate', () => {
    if (!currentTimeEl || !trackProgress) return;

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
    if (!audioPlayer?.duration) return;
    const percent = Number(trackProgress.value) / 100;
    audioPlayer.currentTime = percent * audioPlayer.duration;
  });
})();