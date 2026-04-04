(() => {
  const queueState = document.getElementById('queueState');
  const queueHeaderLabel = document.getElementById('queueHeaderLabel');
  const queueClient = document.getElementById('queueClient');
  const queueTimer = document.getElementById('queueTimer');
  const queueHint = document.getElementById('queueHint');
  const queueRing = document.getElementById('queueRing');
  const startQueueBtn = document.getElementById('startQueueBtn');
  const cancelQueueBtn = document.getElementById('cancelQueueBtn');
  const queueShock = document.getElementById('queueShock');
  const draftOrderChips = document.querySelectorAll('.draft-order-chip');
  const readyCheck = document.getElementById('readyCheck');
  const readyCountdown = document.getElementById('readyCountdown');
  const acceptReadyBtn = document.getElementById('acceptReadyBtn');
  const declineReadyBtn = document.getElementById('declineReadyBtn');
  const champCrashOverlay = document.getElementById('champCrashOverlay');
  const enemyPanel = document.getElementById('enemyPanel');
  const chatRestrictedModal = document.getElementById('chatRestrictedModal');
  const chatRestrictedBackdrop = document.getElementById('chatRestrictedBackdrop');
  const chatRestrictedCloseBtn = document.getElementById('chatRestrictedCloseBtn');
  const chatRestrictedUnderstandBtn = document.getElementById('chatRestrictedUnderstandBtn');
  const chatRestrictedPanel = document.getElementById('chatRestrictedPanel');
  const chatRestrictedPill = document.getElementById('chatRestrictedPill');
  const chatRestrictedCopy = document.getElementById('chatRestrictedCopy');
  const chatLogList = document.getElementById('chatLogList');

  let queueSeconds = 0;
  let queueTimerHandle = null;
  let readyTimerHandle = null;
  let queueShockHideHandle = null;
  let riotNoticeAcknowledged = false;
  let queueStartPending = false;

  function formatClock(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function setDraftStep(activeStep) {
    if (!draftOrderChips.length) return;

    draftOrderChips.forEach((chip, index) => {
      chip.classList.toggle('is-active', index === activeStep);
      chip.classList.toggle('is-done', index < activeStep);
    });
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
    if (queueShockHideHandle) {
      window.clearTimeout(queueShockHideHandle);
      queueShockHideHandle = null;
    }

    queueSeconds = 0;
    if (queueTimer) queueTimer.textContent = '00:00';
    if (queueHint) queueHint.textContent = 'Not in queue. Press Find Match.';
    if (queueState) {
      queueState.textContent = 'Idle';
      queueState.classList.remove('searching', 'found');
    }
    queueRing?.classList.remove('searching');
    if (startQueueBtn) startQueueBtn.disabled = false;
    if (cancelQueueBtn) cancelQueueBtn.disabled = true;
    if (readyCheck) readyCheck.hidden = true;

    if (chatRestrictedPanel) chatRestrictedPanel.classList.remove('is-alert');
    if (chatRestrictedPill) chatRestrictedPill.textContent = 'All Chat Enabled';
    if (chatRestrictedCopy) chatRestrictedCopy.textContent = 'System: You can use all chat normally.';
    if (chatRestrictedModal) chatRestrictedModal.hidden = true;
    if (champCrashOverlay) champCrashOverlay.hidden = true;
    if (enemyPanel) enemyPanel.hidden = true;
    queueClient?.classList.remove('is-champ-select');
    if (queueHeaderLabel) queueHeaderLabel.textContent = 'RANKED SOLO/DUO - CHAMP SELECT';
    queueShock?.classList.remove('show');
    setDraftStep(0);
    queueStartPending = false;
  }

  function showReadyCheck() {
    if (!readyCheck || !readyCountdown) return;

    readyCheck.hidden = false;
    let countdown = 10;
    readyCountdown.textContent = String(countdown);
    if (queueState) {
      queueState.textContent = 'Match Found';
      queueState.classList.remove('searching');
      queueState.classList.add('found');
    }
    if (queueHint) queueHint.textContent = 'Ready check popped. Accept fast.';
    setDraftStep(3);

    queueShock?.classList.remove('show');
    void queueShock?.offsetWidth;
    queueShock?.classList.add('show');
    if (queueShockHideHandle) {
      window.clearTimeout(queueShockHideHandle);
    }
    queueShockHideHandle = window.setTimeout(() => {
      queueShock?.classList.remove('show');
      queueShockHideHandle = null;
    }, 2200);

    readyTimerHandle = window.setInterval(() => {
      countdown -= 1;
      readyCountdown.textContent = String(Math.max(0, countdown));
      if (countdown <= 0) {
        setQueueIdle();
        if (queueHint) queueHint.textContent = 'Ready check timed out. Queue reset.';
      }
    }, 1000);
  }

  function initQueueLobby() {
    if (!startQueueBtn || !cancelQueueBtn || !queueTimer || !queueState) return;

    const setChatModalOpen = (isOpen) => {
      if (!chatRestrictedModal) return;
      chatRestrictedModal.hidden = !isOpen;
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
      if (queueHint) queueHint.textContent = 'Queueing for Ranked Solo/Duo...';
      queueRing?.classList.add('searching');
      setDraftStep(1);
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
      if (queueHint) queueHint.textContent = 'Queue cancelled.';
      setChatRestricted(false);
    });

    acceptReadyBtn?.addEventListener('click', () => {
      if (readyTimerHandle) {
        window.clearInterval(readyTimerHandle);
        readyTimerHandle = null;
      }
      if (readyCheck) readyCheck.hidden = true;
      if (queueHint) queueHint.textContent = 'Accepted. Entering champ select...';
      queueState.textContent = 'Accepted';
      queueState.classList.remove('searching');
      queueState.classList.add('found');
      cancelQueueBtn.disabled = true;
      setDraftStep(4);
      queueShock?.classList.remove('show');
      if (queueShockHideHandle) {
        window.clearTimeout(queueShockHideHandle);
        queueShockHideHandle = null;
      }
      setChatRestricted(true);

      if (enemyPanel) enemyPanel.hidden = false;

      queueClient?.classList.add('is-champ-select');
      if (queueHeaderLabel) queueHeaderLabel.textContent = 'CHAMP SELECT - LOADING';

      if (champCrashOverlay) {
        window.setTimeout(() => {
          queueClient?.classList.remove('is-champ-select');
          if (queueHeaderLabel) queueHeaderLabel.textContent = 'RANKED SOLO/DUO - CHAMP SELECT';
          champCrashOverlay.hidden = false;
          const fill = document.getElementById('champCrashFill');
          if (fill) {
            fill.style.animation = 'none';
            void fill.offsetWidth;
            fill.style.animation = '';
          }
        }, 3200);
      }
    });

    declineReadyBtn?.addEventListener('click', () => {
      setQueueIdle();
      if (queueHint) queueHint.textContent = 'Declined. Back to lobby.';
      setChatRestricted(false);
    });
  }

  initQueueLobby();
})();