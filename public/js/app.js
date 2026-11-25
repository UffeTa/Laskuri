import { ensureDanceStylesheet, loadAllDances } from '../dances/index.js';
import { MUSIC_TRACKS } from '../music/index.js';
import { resolveChoice, visiblePose } from './visit-choice.js';
import { updateTimeOfDayLighting } from './lighting.js';
import { RetroSynthMusicEngine, setMusicNotifier } from './music.js';
import { isMuted, playFanfare, playNext, setMusicMuted, startTrack, unlockAudio, currentTrack } from './playlist.js';
import { runtime } from './runtime.js';
import { applyPerformanceClasses, renderScene, resolveScene, setCharacterPose } from './scene.js';
import {
  buildShareUrl,
  copyOrShare,
  getPublicSlug,
  isTemporaryPreviewUrl,
  parseLegacyShare,
  readShareParams,
  syncUrlFromState,
  urlHasShareIdentity,
} from './share.js';

const FEATURE_FLAGS = {
  allowCustomScene: false,
};

const STORAGE_KEY = 'ahlsell_comic_timer_state_v2';

let appState = {
  eventName: '',
  startTimeMs: null,
  targetTimeMs: null,
  counterMode: 'days_hours_seconds',
  scene: null,
  celebrated: false,
  danceStyle: 'random',
  danceForced: false,
  musicEnabled: true,
  musicTrack: 'random',
  slug: null,
};

let poseErrorShown = false;
let sceneReady = false;
let startGeneration = 0;

const setupView = document.getElementById('setup-view');
const timerView = document.getElementById('timer-view');
const eventForm = document.getElementById('event-form');
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');
const eventTimeInput = document.getElementById('event-time');
const danceSelect = document.getElementById('dance-style');
const musicInput = document.getElementById('music-enabled');
const trackSelect = document.getElementById('music-track');

const displayEventName = document.getElementById('display-event-name');
const displayTargetDatetime = document.getElementById('display-target-datetime');
const counterToggle = document.getElementById('counter-toggle');
const counterModeBadge = document.getElementById('counter-mode-badge');
const counterDigits = document.getElementById('counter-digits');
const counterLive = document.getElementById('counter-live');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const progressTrack = document.getElementById('progress-track');

const stageEnvironment = document.getElementById('stage-environment');
const stageCharacter = document.getElementById('stage-character');
const stageGoal = document.getElementById('stage-goal');
const characterWrapper = document.getElementById('character-wrapper');
const speechText = document.getElementById('speech-text');
const musicNotes = document.getElementById('music-notes');
const confettiLayer = document.getElementById('confetti-layer');

const lightingSlider = document.getElementById('lighting-slider');
const btnResetLighting = document.getElementById('btn-reset-lighting');
const btnNewEvent = document.getElementById('btn-new-event');
const btnMusicToggle = document.getElementById('btn-music-toggle');
const btnFullscreen = document.getElementById('btn-fullscreen');
const btnShareLink = document.getElementById('btn-share-link');
const btnFsMusic = document.getElementById('btn-fs-music');
const btnFsShare = document.getElementById('btn-fs-share');
const btnFsExit = document.getElementById('btn-fs-exit');

const metaCharacter = document.getElementById('meta-character');
const metaGoal = document.getElementById('meta-goal');
const metaEnvironment = document.getElementById('meta-environment');
const metaDance = document.getElementById('meta-dance');

function showToast(message) {
  const box = document.getElementById('toast-box');
  const msg = document.getElementById('toast-message');
  msg.textContent = message;
  box.classList.remove('hidden');
  clearTimeout(box._hideTimer);
  box._hideTimer = setTimeout(() => {
    box.classList.add('hidden');
  }, 3200);
}

function pad2(num) {
  return String(Math.floor(num)).padStart(2, '0');
}

function setFormDateTime(dateObj) {
  eventDateInput.value = `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`;
  eventTimeInput.value = `${pad2(dateObj.getHours())}:${pad2(dateObj.getMinutes())}`;
}

function activeDance() {
  const id = runtime.resolvedDanceId || appState.danceStyle;
  return runtime.dances.find((dance) => dance.id === id) || runtime.dances[0];
}

function selectedDanceId() {
  const value = danceSelect.value;
  if (!value || value === 'random') return 'random';
  return runtime.dances.some((dance) => dance.id === value) ? value : 'random';
}

function saveState() {
  if (appState.slug) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      eventName: appState.eventName,
      startTimeMs: appState.startTimeMs,
      targetTimeMs: appState.targetTimeMs,
      counterMode: appState.counterMode,
      scene: appState.scene,
      celebrated: !!appState.celebrated,
      danceStyle: appState.danceStyle || 'random',
      danceLocked: appState.danceLocked === true,
      musicEnabled: !!appState.musicEnabled,
      musicTrack: appState.musicTrack || 'random',
      musicLocked: appState.musicLocked === true,
    }));
  } catch (e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function fillDanceSelect() {
  danceSelect.replaceChildren();
  const randomOption = document.createElement('option');
  randomOption.value = 'random';
  randomOption.textContent = 'Satunnainen';
  danceSelect.appendChild(randomOption);
  for (const dance of runtime.dances) {
    const option = document.createElement('option');
    option.value = dance.id;
    option.textContent = `${dance.id} — ${dance.name}`;
    danceSelect.appendChild(option);
  }
}

function knownDance(id) {
  if (!id || id === 'random') return 'random';
  return runtime.dances.some((dance) => dance.id === id) ? id : 'random';
}

function lastPickKey(kind) {
  return `ahlsell_last_${kind}_${appState.slug || 'paikallinen'}`;
}

function readLastPick(kind) {
  try { return localStorage.getItem(lastPickKey(kind)) || ''; } catch (e) { return ''; }
}

function rememberPick(kind, id) {
  try { localStorage.setItem(lastPickKey(kind), id); } catch (e) {}
}

function resolveVisitChoices() {
  const danceIds = runtime.dances.map((dance) => dance.id);
  const dance = resolveChoice({
    forced: appState.danceForced,
    locked: appState.danceLocked,
    value: appState.danceStyle,
    ids: danceIds,
    previousId: readLastPick('dance'),
  });
  runtime.resolvedDanceId = dance.id;
  rememberPick('dance', dance.id);

  const trackIds = MUSIC_TRACKS.map((track) => track.id);
  const track = resolveChoice({
    forced: false,
    locked: appState.musicLocked,
    value: appState.musicTrack,
    ids: trackIds,
    previousId: readLastPick('track'),
  });
  runtime.resolvedTrackId = track.id;
  rememberPick('track', track.id);
}

function knownTrack(id) {
  if (id === 'random') return 'random';
  return MUSIC_TRACKS.some((track) => track.id === id) ? id : 'random';
}

function fillTrackSelect(select) {
  if (!select) return;
  select.replaceChildren();
  const randomOption = document.createElement('option');
  randomOption.value = 'random';
  randomOption.textContent = 'Satunnainen';
  select.appendChild(randomOption);
  for (const track of MUSIC_TRACKS) {
    const option = document.createElement('option');
    option.value = track.id;
    option.textContent = `${track.id} — ${track.name}`;
    select.appendChild(option);
  }
}

function selectedTrackId() {
  const value = trackSelect ? trackSelect.value : 'random';
  return knownTrack(value);
}

function trackTitle(id) {
  const track = MUSIC_TRACKS.find((item) => item.id === id);
  return track ? track.name : 'Raita';
}

function refreshMusicControls() {
  const sounding = Boolean(currentTrack()) && !isMuted();
  const label = sounding ? '🔇 Mykistä' : '🔊 Ääni päälle';
  [btnMusicToggle, btnFsMusic].forEach((button) => {
    if (!button) return;
    button.textContent = label;
    button.setAttribute('aria-pressed', sounding ? 'true' : 'false');
    button.classList.toggle('bg-[#06D6A0]', sounding);
    button.classList.toggle('bg-[#FFD166]', !sounding);
  });
  const name = trackTitle(runtime.resolvedTrackId);
  const trackLabel = document.getElementById('track-label');
  if (trackLabel) trackLabel.textContent = name;
  const fsNext = document.getElementById('btn-fs-next');
  if (fsNext) fsNext.textContent = `⏭ ${name}`;
}

function showStartOverlay() {
  runtime.performanceStarted = false;
  sceneReady = false;
  resolveVisitChoices();
  document.documentElement.classList.add('awaiting-start');
  const overlay = document.getElementById('start-overlay');
  const title = document.getElementById('start-overlay-title');
  const button = document.getElementById('btn-start-counter');
  const name = appState.eventName || 'Ajastin';
  if (title) title.textContent = name;
  if (button) {
    button.disabled = true;
    button.setAttribute('aria-label', `Aloita: ${name}`);
  }
  if (overlay) overlay.focus();
  refreshMusicControls();
}

function enableStartOverlay() {
  sceneReady = true;
  const button = document.getElementById('btn-start-counter');
  if (!button) return;
  button.disabled = false;
  button.focus();
}

async function beginPerformance() {
  if (!sceneReady || runtime.performanceStarted) return;
  runtime.performanceStarted = true;
  document.documentElement.classList.remove('awaiting-start');
  try {
    await unlockAudio();
    if (appState.musicEnabled && !isMuted()) {
      const compiled = await startTrack(runtime.resolvedTrackId);
      if (compiled) runtime.resolvedTrackId = compiled.id;
    }
  } catch (e) {
    showToast('Ääntä ei saatu käynnistettyä.');
  }
  refreshMusicControls();
  updateTimerTick();
}

async function onToggleMute() {
  if (!runtime.performanceStarted) return;
  const sounding = Boolean(currentTrack()) && !isMuted();
  if (sounding) {
    setMusicMuted(true);
  } else {
    setMusicMuted(false);
    appState.musicEnabled = true;
    try {
      if (!currentTrack()) {
        const compiled = await startTrack(runtime.resolvedTrackId);
        if (compiled) runtime.resolvedTrackId = compiled.id;
      }
    } catch (e) {
      showToast('Ääntä ei saatu käynnistettyä.');
    }
  }
  refreshMusicControls();
}

async function onNextTrack() {
  if (!runtime.performanceStarted) return;
  try {
    if (!currentTrack()) await unlockAudio();
    const compiled = await playNext();
    if (compiled) runtime.resolvedTrackId = compiled.id;
    if (isMuted()) setMusicMuted(true);
  } catch (e) {
    showToast('Raitaa ei voitu vaihtaa.');
  }
  refreshMusicControls();
}

function enterCleanFullscreen(requestNative = false) {
  runtime.previewHourOverride = null;
  document.documentElement.classList.add('wants-fullscreen');
  document.body.classList.add('fullscreen-clean');
  updateTimeOfDayLighting();
  updateTimerTick();
  syncUrlFromState(appState, { fullscreen: true, forceIdentity: !appState.slug });
  if (requestNative && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function exitCleanFullscreen() {
  const wasClean = document.documentElement.classList.contains('wants-fullscreen')
    || document.body.classList.contains('fullscreen-clean');
  document.documentElement.classList.remove('wants-fullscreen');
  document.body.classList.remove('fullscreen-clean');
  if (wasClean) {
    syncUrlFromState(appState, { fullscreen: false, forceIdentity: false });
  }
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  updateTimerTick();
}

async function shareCurrentTimer() {
  if (isTemporaryPreviewUrl()) {
    showToast('Esikatselun väliaikaista osoitetta ei voi jakaa. Avaa sivu julkaistusta osoitteesta, niin jakolinkki toimii.');
    return;
  }
  const url = buildShareUrl(appState);
  const result = await copyOrShare(url, { title: appState.eventName || 'Ahlsell-ajastin' });
  if (result === 'clipboard' || result === 'exec') {
    showToast('Koko näytön jakolinkki kopioitu leikepöydälle!');
  } else if (result === 'share') {
    showToast('Jakolinkki avattiin jakovalikossa.');
  } else if (result === 'aborted') {
    return;
  } else {
    showToast('Kopiointi estetty selaimessa. Kopioi osoite osoiteriviltä.');
  }
}

function formatCounterText(remainingSeconds) {
  const totalSec = Math.max(0, Math.floor(remainingSeconds));
  if (appState.counterMode === 'days_hours_seconds') {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const seconds = totalSec % 3600;
    counterModeBadge.textContent = 'TILA: PÄIVÄT, TUNNIT, SEKUNNIT';
    return `${pad2(days)} pv : ${pad2(hours)} h : ${String(seconds).padStart(4, '0')} s`;
  }
  const hours = Math.floor(totalSec / 3600);
  const seconds = totalSec % 3600;
  counterModeBadge.textContent = 'TILA: TUNNIT, SEKUNNIT';
  return `${pad2(hours)} h : ${String(seconds).padStart(4, '0')} s`;
}

function announceCountdown(remainingSeconds, text) {
  if (!counterLive) return;
  const bucket = remainingSeconds <= 15 ? remainingSeconds : Math.floor(remainingSeconds / 15);
  if (bucket === runtime.lastAnnouncedBucket && counterLive.textContent) return;
  runtime.lastAnnouncedBucket = bucket;
  counterLive.textContent = remainingSeconds === 0 ? 'Perillä.' : `Aikaa jäljellä: ${text}`;
}

function getSpeechForProgress(progress, mood) {
  if (mood === 'celebrate' || progress >= 1) return 'Perillä autolla! 🎉';
  if (mood === 'dance') return 'Viimeinen päivä — tanssiksi! 🕺';
  if (progress > 0.65) return 'BOS-5 jo ihan lähellä! 😄';
  if (mood === 'cheerful') return 'Askel kevenee, pian perillä! 😊';
  if (progress > 0.08) return 'Askellus rullaa!';
  return 'Matka Ahlsellin pihalla alkaa!';
}

function triggerConfetti() {
  confettiLayer.replaceChildren();
  if (!runtime.reducedMotion) {
    const colors = ['#FFD166', '#EF476F', '#06D6A0', '#118AB2', '#FFFFFF'];
    for (let i = 0; i < 36; i += 1) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 96 + 2}%`;
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      confettiLayer.appendChild(piece);
    }
  }
  const carLights = document.getElementById('car-headlights');
  if (carLights) {
    carLights.classList.add('car-lights-flash');
    setTimeout(() => carLights.classList.remove('car-lights-flash'), 2000);
  }
}

function updateTimerTick() {
  const nowMs = Date.now();
  const totalDuration = Math.max(1000, appState.targetTimeMs - appState.startTimeMs);
  const remainingMs = Math.max(0, appState.targetTimeMs - nowMs);
  const elapsedMs = Math.min(totalDuration, Math.max(0, nowMs - appState.startTimeMs));
  const progress = remainingMs === 0 ? 1 : elapsedMs / totalDuration;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const text = formatCounterText(remainingSeconds);

  counterDigits.textContent = text;
  announceCountdown(remainingSeconds, text);
  const pct = Math.round(progress * 100);
  progressBar.style.width = `${pct}%`;
  progressPercent.textContent = remainingMs === 0 ? '100% — Perillä!' : `${pct}% matkasta kuljettu`;
  if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(pct));
  if (!runtime.performanceStarted) return;

  const startLeftPct = 4;
  const maxLeftPct = window.innerWidth < 640 ? 52 : 66;
  const currentLeftPct = startLeftPct + progress * (maxLeftPct - startLeftPct);
  characterWrapper.style.left = `${currentLeftPct.toFixed(2)}%`;

  const oneDayMs = 24 * 60 * 60 * 1000;
  const isFinalDayDance = totalDuration > oneDayMs
    ? (remainingMs > 0 && remainingMs <= oneDayMs)
    : (remainingMs > 0 && progress >= 0.72);

  let nextMood = 'walk';
  if (remainingMs === 0) nextMood = 'celebrate';
  else if (isFinalDayDance) nextMood = 'dance';
  else if (progress >= 0.35) nextMood = 'cheerful';
  runtime.currentMood = nextMood;

  RetroSynthMusicEngine.updateContext(runtime.currentLightingPhase, runtime.currentMood);
  speechText.textContent = getSpeechForProgress(progress, runtime.currentMood);

  const dance = activeDance();
  if (metaDance && dance) metaDance.textContent = dance.name;
  stageCharacter.classList.toggle('mood-cheerful', runtime.currentMood === 'cheerful' && !(dance && dance.walkClass));
  stageCharacter.classList.toggle('mood-dance', runtime.currentMood === 'dance');
  const pose = visiblePose(runtime.currentMood);
  if (dance) applyPerformanceClasses(stageCharacter, dance, runtime.dances, pose === 'dance' ? 'dance' : 'celebrate');
  musicNotes.classList.toggle('hidden', pose !== 'dance' && runtime.currentMood !== 'celebrate');
  setCharacterPose(stageCharacter, pose, dance).catch(() => {
    if (!poseErrorShown) {
      poseErrorShown = true;
      showToast('Hahmon kuvaa ei saatu ladattua.');
    }
  });

  if (runtime.currentMood === 'celebrate') {
    if (!appState.celebrated) {
      appState.celebrated = true;
      saveState();
      triggerConfetti();
      playFanfare();
    }
    if (runtime.tickInterval) {
      clearInterval(runtime.tickInterval);
      runtime.tickInterval = null;
    }
  }
}

async function startTimerView() {
  const generation = ++startGeneration;
  setupView.classList.add('hidden');
  setupView.inert = true;
  timerView.classList.remove('hidden');
  document.documentElement.classList.add('is-ready');
  btnNewEvent.classList.toggle('hidden', Boolean(appState.slug));

  displayEventName.textContent = appState.eventName;
  const targetDate = new Date(appState.targetTimeMs);
  displayTargetDatetime.textContent = `Tavoiteaika: ${targetDate.toLocaleDateString('fi-FI')} klo ${pad2(targetDate.getHours())}:${pad2(targetDate.getMinutes())}`;

  showStartOverlay();
  let sceneLoaded = true;
  try {
    const dance = activeDance();
    if (dance) applyPerformanceClasses(stageCharacter, dance, runtime.dances, 'dance');
    await renderScene({
      stageEnvironment,
      stageGoal,
      stageCharacter,
      metaCharacter,
      metaGoal,
      metaEnvironment,
    });
    if (generation !== startGeneration) return false;
    if (metaDance && dance) metaDance.textContent = dance.name;
    if (dance) {
      await setCharacterPose(stageCharacter, visiblePose('walk'), dance);
      if (generation !== startGeneration) return false;
      applyPerformanceClasses(stageCharacter, dance, runtime.dances, 'dance');
    }
    updateTimeOfDayLighting();
  } catch (error) {
    if (generation !== startGeneration) return false;
    sceneLoaded = false;
    showToast('Näyttämöä ei saatu ladattua.');
  }
  if (generation !== startGeneration) return false;
  enableStartOverlay();
  updateTimerTick();

  if (!runtime.lightingInterval) {
    runtime.lightingInterval = setInterval(() => {
      if (runtime.previewHourOverride === null) updateTimeOfDayLighting();
    }, 30000);
  }
  if (runtime.tickInterval) clearInterval(runtime.tickInterval);
  runtime.tickInterval = setInterval(updateTimerTick, 500);
  return sceneLoaded;
}

function toggleCounterMode() {
  appState.counterMode = appState.counterMode === 'days_hours_seconds'
    ? 'hours_seconds'
    : 'days_hours_seconds';
  saveState();
  if (document.documentElement.classList.contains('wants-fullscreen') || urlHasShareIdentity()) {
    syncUrlFromState(appState, {
      fullscreen: document.documentElement.classList.contains('wants-fullscreen'),
      forceIdentity: false,
    });
  }
  runtime.lastAnnouncedBucket = null;
  updateTimerTick();
}

function showBootError(message) {
  const boot = document.getElementById('boot-status');
  boot.textContent = message;
  document.documentElement.classList.add('remote-counter');
  document.documentElement.classList.remove('is-ready');
}

async function bootRemote(slug) {
  const params = readShareParams();
  const response = await fetch(`/api/counters/${encodeURIComponent(slug)}`);
  if (!response.ok) {
    showBootError('Laskuria ei löytynyt.');
    return;
  }
  const body = await response.json();
  const counter = body.counter;
  if (!counter || typeof counter.name !== 'string') {
    showBootError('Laskuria ei löytynyt.');
    return;
  }
  let counterMode = counter.counterMode || 'days_hours_seconds';
  if (params.get('m') === 'h') counterMode = 'hours_seconds';
  if (params.get('m') === 'd') counterMode = 'days_hours_seconds';
  const urlDance = params.get('d');
  const urlForcesDance = Boolean(urlDance && runtime.dances.some((dance) => dance.id === urlDance));
  appState = {
    eventName: counter.name,
    startTimeMs: Number(counter.startTimeMs),
    targetTimeMs: Number(counter.targetTimeMs),
    counterMode,
    danceStyle: urlForcesDance ? urlDance : knownDance(counter.danceStyle),
    danceForced: urlForcesDance,
    danceLocked: !urlForcesDance && counter.danceLocked === true,
    musicLocked: counter.musicLocked === true,
    musicEnabled: !!counter.musicEnabled,
    musicTrack: knownTrack(counter.musicTrack),
    celebrated: false,
    slug: counter.slug,
    scene: resolveScene(),
  };
  await startTimerView();
  if (params.get('view') === 'full') enterCleanFullscreen(false);
}

function beginLocalTimer({ name, targetTimeMs, toast }) {
  if (!timerView.classList.contains('hidden')) return;
  const nowMs = Date.now();
  if (targetTimeMs <= nowMs) {
    showToast('Valitse tulevaisuudessa oleva ajankohta!');
    return;
  }
  appState = {
    eventName: name,
    startTimeMs: nowMs,
    targetTimeMs,
    counterMode: appState.counterMode || 'days_hours_seconds',
    scene: resolveScene(),
    celebrated: false,
    danceStyle: selectedDanceId(),
    danceForced: false,
    danceLocked: selectedDanceId() !== 'random',
    musicEnabled: musicInput.checked,
    musicTrack: selectedTrackId(),
    musicLocked: selectedTrackId() !== 'random',
    slug: null,
  };
  if (FEATURE_FLAGS.allowCustomScene) {
    appState.scene = resolveScene();
  }
  saveState();
  startTimerView().then((loaded) => {
    if (loaded && toast) showToast(toast);
  }).catch(() => {
    showToast('Näyttämöä ei saatu ladattua.');
  });
}

eventForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = eventNameInput.value.trim();
  const dateVal = eventDateInput.value;
  const timeVal = eventTimeInput.value;
  if (!name || !dateVal || !timeVal) {
    showToast('Täytä tapahtuman nimi, päivämäärä ja kellonaika.');
    return;
  }
  const targetDate = new Date(`${dateVal}T${timeVal}:00`);
  if (Number.isNaN(targetDate.getTime())) {
    showToast('Tarkista päivämäärän ja kellonajan muoto.');
    return;
  }
  beginLocalTimer({ name, targetTimeMs: targetDate.getTime() });
});

document.getElementById('preset-30s').addEventListener('click', () => {
  const name = eventNameInput.value.trim() || 'Pikamatka BOS-5:lle!';
  eventNameInput.value = name;
  beginLocalTimer({
    name,
    targetTimeMs: Date.now() + 30 * 1000,
    toast: '30 sekunnin testiajastin käynnistetty!',
  });
});

document.getElementById('preset-5m').addEventListener('click', () => {
  if (!eventNameInput.value.trim()) eventNameInput.value = 'Kahvitauko & lähtö';
  setFormDateTime(new Date(Date.now() + 5 * 60 * 1000));
  showToast('Ajaksi asetettu +5 minuuttia.');
});

document.getElementById('preset-1d').addEventListener('click', () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(16, 0, 0, 0);
  if (!eventNameInput.value.trim()) eventNameInput.value = 'Huomenna kotimatkalle!';
  setFormDateTime(date);
  showToast('Ajaksi asetettu huomenna klo 16:00.');
});

counterToggle.addEventListener('click', toggleCounterMode);
counterToggle.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleCounterMode();
  }
});

document.addEventListener('keydown', (event) => {
  if (timerView.classList.contains('hidden')) return;
  if (event.key === 'm' || event.key === 'M') {
    toggleCounterMode();
  } else if (event.key === 'Escape' && document.documentElement.classList.contains('wants-fullscreen')) {
    exitCleanFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && document.documentElement.classList.contains('wants-fullscreen')) {
    exitCleanFullscreen();
  }
});

btnMusicToggle.addEventListener('click', () => { onToggleMute(); });
btnFsMusic.addEventListener('click', () => { onToggleMute(); });
document.getElementById('btn-next-track').addEventListener('click', () => { onNextTrack(); });
document.getElementById('btn-fs-next').addEventListener('click', () => { onNextTrack(); });
document.getElementById('btn-start-counter').addEventListener('click', () => { beginPerformance(); });
btnFullscreen.addEventListener('click', () => enterCleanFullscreen(true));
btnShareLink.addEventListener('click', shareCurrentTimer);
btnFsShare.addEventListener('click', shareCurrentTimer);
btnFsExit.addEventListener('click', exitCleanFullscreen);

if (lightingSlider) {
  lightingSlider.addEventListener('input', (event) => {
    runtime.previewHourOverride = parseFloat(event.target.value);
    updateTimeOfDayLighting();
  });
}

if (btnResetLighting) {
  btnResetLighting.addEventListener('click', () => {
    runtime.previewHourOverride = null;
    updateTimeOfDayLighting();
    showToast('Valaistus palautettu reaaliaikaan.');
  });
}

btnNewEvent.addEventListener('click', () => {
  startGeneration += 1;
  sceneReady = false;
  if (runtime.tickInterval) {
    clearInterval(runtime.tickInterval);
    runtime.tickInterval = null;
  }
  timerView.classList.add('hidden');
  setupView.classList.remove('hidden');
  setupView.inert = false;
  document.documentElement.classList.remove('is-ready');
  document.documentElement.classList.remove('awaiting-start');
  if (appState.eventName) eventNameInput.value = appState.eventName;
  if (appState.targetTimeMs) setFormDateTime(new Date(appState.targetTimeMs));
  danceSelect.value = knownDance(appState.danceStyle);
  musicInput.checked = !!appState.musicEnabled;
  if (trackSelect) trackSelect.value = knownTrack(appState.musicTrack);
});

window.addEventListener('resize', () => {
  if (!timerView.classList.contains('hidden') && appState.targetTimeMs) updateTimerTick();
});

async function boot() {
  setMusicNotifier(showToast);
  runtime.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  runtime.dances = await loadAllDances();
  for (const dance of runtime.dances) ensureDanceStylesheet(dance);
  fillDanceSelect();
  fillTrackSelect(trackSelect);

  const slug = getPublicSlug();
  if (slug) {
    document.documentElement.classList.add('remote-counter');
    await bootRemote(slug);
    return;
  }

  const shared = parseLegacyShare(runtime.dances.map((dance) => dance.id));
  if (shared) {
    appState = { ...shared.state, scene: resolveScene() };
    danceSelect.value = appState.danceStyle;
    if (trackSelect) trackSelect.value = knownTrack(appState.musicTrack);
    musicInput.checked = appState.musicEnabled !== false;
    await startTimerView();
    if (shared.isFullscreen) enterCleanFullscreen(false);
    return;
  }

  const saved = loadState();
  if (saved && saved.eventName && saved.targetTimeMs && saved.scene) {
    appState = {
      eventName: String(saved.eventName).slice(0, 60),
      startTimeMs: Number(saved.startTimeMs),
      targetTimeMs: Number(saved.targetTimeMs),
      counterMode: saved.counterMode === 'hours_seconds' ? 'hours_seconds' : 'days_hours_seconds',
      scene: saved.scene,
      celebrated: !!saved.celebrated,
      danceStyle: saved.danceLocked === true ? knownDance(saved.danceStyle) : 'random',
      danceLocked: saved.danceLocked === true,
      danceForced: false,
      musicEnabled: saved.musicEnabled !== false,
      musicTrack: saved.musicLocked === true ? knownTrack(saved.musicTrack) : 'random',
      musicLocked: saved.musicLocked === true,
      slug: null,
    };
    danceSelect.value = appState.danceStyle;
    musicInput.checked = appState.musicEnabled;
    if (trackSelect) trackSelect.value = knownTrack(appState.musicTrack);
    await startTimerView();
    return;
  }

  setFormDateTime(new Date(Date.now() + 60 * 60 * 1000));
}

boot().catch(() => {
  startGeneration += 1;
  sceneReady = false;
  document.documentElement.classList.remove('awaiting-start');
  if (setupView) setupView.inert = false;
  showToast('Sivun käynnistys epäonnistui.');
  showBootError('Laskuria ei saatu käynnistettyä.');
});
