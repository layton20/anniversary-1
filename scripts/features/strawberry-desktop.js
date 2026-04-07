(() => {
  const strawberryDesk = document.getElementById('strawberryDesk');

  function clampValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

    const albumOrder = ['all', 'ella', 'games', 'johnny', 'misc', 'shes_worth_it', 'us'];
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
      misc: [],
      shes_worth_it: [],
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
      return key
        .split(/[_-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
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
          // Update active class in-place so the clicked button stays in the DOM
          // during event bubbling (avoids innerHTML = '' detaching it mid-propagation)
          albumList.querySelectorAll('[data-album]').forEach((b) => {
            b.classList.toggle('is-active', b.getAttribute('data-album') === albumKey);
          });
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

    const deskClickAudio = new Audio('assets/audio/pc_click.mp3');
    deskClickAudio.preload = 'auto';
    deskClickAudio.volume = 0.48;

    const playDeskClickSound = () => {
      try {
        deskClickAudio.currentTime = 0;
        const playPromise = deskClickAudio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } catch (_) {}
    };

    const interact2Audio = new Audio('assets/audio/interact_2.mp3');
    interact2Audio.preload = 'auto';
    interact2Audio.volume = 0.55;

    const playInteract2Sound = () => {
      try {
        interact2Audio.currentTime = 0;
        const playPromise = interact2Audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } catch (_) {}
    };

    strawberryDesk.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const actionable = target.closest('button, [role="button"], a, input, select, textarea');
      if (!actionable) return;
      if (actionable instanceof HTMLButtonElement && actionable.disabled) return;
      if (actionable instanceof HTMLInputElement && actionable.disabled) return;
      if (actionable instanceof HTMLSelectElement && actionable.disabled) return;
      if (actionable instanceof HTMLTextAreaElement && actionable.disabled) return;

      // Ellamori objects play interact_2 exclusively — skip the click sound
      if (actionable.hasAttribute('data-ellamori-object')) return;

      playDeskClickSound();
    });

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
      const ellamoriPlayerCtx = ellamoriPlayer instanceof HTMLCanvasElement ? ellamoriPlayer.getContext('2d') : null;
      const WALK_FRAME_WIDTH = 32;
      const WALK_FRAME_HEIGHT = 32;
      const WALK_FRAME_COUNT = 3;
      const WALK_FPS = 12;
      const WALK_SRC_X = 1;
      const WALK_SRC_Y = 15;
      const WALK_CELL_GAP = 1;
      const WALK_COLUMN_STRIDE = WALK_FRAME_WIDTH + WALK_CELL_GAP;
      const WALK_ROW_STRIDE = WALK_FRAME_HEIGHT + WALK_CELL_GAP;
      const WALK_ROW_INDEX = {
        down: 0,
        left: 1,
        right: 2,
        up: 3
      };
      const ellamoriSpriteImage = new Image();
      let ellamoriSpriteLoaded = false;
      ellamoriSpriteImage.src = 'assets/images/browser/omori/aubrey_sprite.png';
      ellamoriSpriteImage.addEventListener('load', () => {
        ellamoriSpriteLoaded = true;
      });

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
          'what the hell, why does he have 300 photos of me?!'
        ],
        digicam: [
          "oh, it's the camera i gave to him.",
          'omg. he took even more pictures of me'
        ],
        cake: [
          'he made another one?! why is it growing mold.',
          'eww. he seriously cannot bake'
        ],
        ending: [
          '...',
          'ok fine. maybe it\'s kind of sweet.',
          'i miss him.'
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
        direction: 'down',
        walkFrame: 0,
        walkAccumulator: 0,
        typewriterTimer: null,
        isTyping: false
      };

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
          gain.gain.setValueAtTime(0.018, ellamoriAudioCtx.currentTime);
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

      const ellamoriFadeIn = (cb) => {
        if (!ellamoriFade) {
          if (cb) cb();
          return;
        }
        ellamoriFade.classList.add('is-opaque');
        window.setTimeout(() => {
          if (cb) cb();
        }, 640);
      };

      const ellamoriFadeOut = (cb) => {
        if (!ellamoriFade) {
          if (cb) cb();
          return;
        }
        ellamoriFade.classList.remove('is-opaque');
        if (cb) window.setTimeout(cb, 640);
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
        if (objectKey !== 'ending') playInteract2Sound();
        showEllamoriLine(objectKey, 0);
        setEllamoriPrompt('');
      };

      const advanceEllamoriDialogue = () => {
        if (!ellamoriDialogText || !ellamoriState.dialogObject) return;
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
                window.setTimeout(() => {
                  ellamoriFadeOut(() => openEllamoriDialogue('ending'));
                }, 400);
              });
            }
          } else {
            window.setTimeout(() => ellamoriFadeIn(), 400);
          }
          return;
        }

        ellamoriState.dialogIndex += 1;
        showEllamoriLine(ellamoriState.dialogObject, ellamoriState.dialogIndex);
      };

      const drawEllamoriPlayer = () => {
        if (!ellamoriPlayer || !ellamoriRoom) return;
        const maxX = Math.max(0, ellamoriRoom.clientWidth - ellamoriPlayer.offsetWidth);
        const maxY = Math.max(0, ellamoriRoom.clientHeight - ellamoriPlayer.offsetHeight);
        ellamoriState.x = clampValue(ellamoriState.x, 0, maxX);
        ellamoriState.y = clampValue(ellamoriState.y, 0, maxY);
        ellamoriPlayer.style.left = `${ellamoriState.x}px`;
        ellamoriPlayer.style.top = `${ellamoriState.y}px`;
      };

      const renderEllamoriSprite = () => {
        if (!ellamoriPlayerCtx || !ellamoriPlayer) return;

        if (ellamoriPlayer.width !== WALK_FRAME_WIDTH) ellamoriPlayer.width = WALK_FRAME_WIDTH;
        if (ellamoriPlayer.height !== WALK_FRAME_HEIGHT) ellamoriPlayer.height = WALK_FRAME_HEIGHT;

        ellamoriPlayerCtx.clearRect(0, 0, WALK_FRAME_WIDTH, WALK_FRAME_HEIGHT);
        if (!ellamoriSpriteLoaded) return;

        const row = WALK_ROW_INDEX[ellamoriState.direction] ?? WALK_ROW_INDEX.down;
        const sx = WALK_SRC_X + (ellamoriState.walkFrame * WALK_COLUMN_STRIDE);
        const sy = WALK_SRC_Y + (row * WALK_ROW_STRIDE);

        ellamoriPlayerCtx.imageSmoothingEnabled = false;
        ellamoriPlayerCtx.drawImage(
          ellamoriSpriteImage,
          sx,
          sy,
          WALK_FRAME_WIDTH,
          WALK_FRAME_HEIGHT,
          0,
          0,
          WALK_FRAME_WIDTH,
          WALK_FRAME_HEIGHT
        );
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
          if (isMoving) {
            if (Math.abs(vertical) >= Math.abs(horizontal)) {
              ellamoriState.direction = vertical > 0 ? 'down' : 'up';
            } else {
              ellamoriState.direction = horizontal > 0 ? 'right' : 'left';
            }
          }

          if (isMoving) {
            const length = Math.hypot(horizontal, vertical) || 1;
            ellamoriState.x += (horizontal / length) * ellamoriState.speed * delta;
            ellamoriState.y += (vertical / length) * ellamoriState.speed * delta;
            ellamoriState.walkAccumulator += delta;
            if (ellamoriState.walkAccumulator >= (1 / WALK_FPS)) {
              const step = Math.floor(ellamoriState.walkAccumulator * WALK_FPS);
              ellamoriState.walkFrame = (ellamoriState.walkFrame + step) % WALK_FRAME_COUNT;
              ellamoriState.walkAccumulator -= step / WALK_FPS;
            }
            drawEllamoriPlayer();
          } else {
            ellamoriState.walkFrame = 0;
            ellamoriState.walkAccumulator = 0;
          }

          renderEllamoriSprite();

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
          drawEllamoriPlayer();
          renderEllamoriSprite();
          window.requestAnimationFrame(updateEllamori);
        }

        if (ellamoriFade) ellamoriFade.classList.add('is-opaque');
        window.setTimeout(() => {
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

  initStrawberryDesktop();
})();