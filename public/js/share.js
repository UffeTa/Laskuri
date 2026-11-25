import { MUSIC_TRACKS, RANDOM_TRACK_ID } from '../music/registry.js';

function knownShareTrack(id) {
  if (!id || id === RANDOM_TRACK_ID) return RANDOM_TRACK_ID;
  return MUSIC_TRACKS.some((track) => track.id === id) ? id : RANDOM_TRACK_ID;
}

export function isTemporaryPreviewUrl() {
  const proto = location.protocol;
  return proto === 'blob:' || proto === 'about:' || proto === 'data:';
}

export function isHttpPage() {
  return location.protocol === 'http:' || location.protocol === 'https:';
}

export function getPublicSlug() {
  const match = location.pathname.match(/^\/l\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  return match ? match[1] : null;
}

function paramMode() {
  if (!isHttpPage()) return 'hash';
  if (location.search.length > 1) return 'search';
  if (location.hash.includes('=')) return 'hash';
  return 'search';
}

export function readShareParams() {
  const raw = paramMode() === 'hash'
    ? location.hash.replace(/^#/, '')
    : location.search.replace(/^\?/, '');
  try {
    return new URLSearchParams(raw);
  } catch (e) {
    return new URLSearchParams();
  }
}

export function urlHasShareIdentity() {
  const params = readShareParams();
  return params.has('t') || params.has('view') || Boolean(getPublicSlug());
}

function writeShareParams(mutate, { fullscreen }) {
  if (isTemporaryPreviewUrl()) return;
  const mode = paramMode();
  const params = readShareParams();
  mutate(params);
  if (fullscreen) params.set('view', 'full');
  else params.delete('view');
  const qs = params.toString();
  if (mode === 'hash') {
    const base = `${location.pathname}${location.search}`;
    history.replaceState({}, '', qs ? `${base}#${qs}` : base);
    return;
  }
  history.replaceState({}, '', `${location.pathname}${qs ? `?${qs}` : ''}`);
}

export function syncUrlFromState(state, { fullscreen, forceIdentity }) {
  writeShareParams((params) => {
    if (!state.slug && (forceIdentity || params.has('t') || fullscreen)) {
      params.set('n', (state.eventName || 'Ajastin').slice(0, 60));
      params.set('s', String(state.startTimeMs || Date.now()));
      params.set('t', String(state.targetTimeMs || Date.now()));
      params.set('d', state.danceStyle || 'groove');
      params.set('k', state.musicTrack || 'random');
    }
    if (params.has('t') || fullscreen || state.slug) {
      params.set('m', state.counterMode === 'hours_seconds' ? 'h' : 'd');
    }
  }, { fullscreen });
}

export function buildShareUrl(state) {
  if (isTemporaryPreviewUrl()) return '';
  const mode = state.counterMode === 'hours_seconds' ? 'h' : 'd';
  if (state.slug) {
    const url = new URL(`/l/${state.slug}`, location.origin);
    url.searchParams.set('view', 'full');
    url.searchParams.set('m', mode);
    return url.toString();
  }
  const params = new URLSearchParams();
  params.set('view', 'full');
  params.set('n', state.eventName || 'Ajastin');
  params.set('s', String(state.startTimeMs || Date.now()));
  params.set('t', String(state.targetTimeMs || Date.now()));
  params.set('m', mode);
  params.set('d', state.danceStyle || 'groove');
  params.set('k', state.musicTrack || 'random');
  if (!isHttpPage()) {
    return `${location.href.split('#')[0].split('?')[0]}#${params.toString()}`;
  }
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

export function parseLegacyShare(danceIds) {
  const params = readShareParams();
  const targetRaw = params.get('t');
  if (!targetRaw) return null;
  const targetTimeMs = Number(targetRaw);
  if (!Number.isFinite(targetTimeMs) || targetTimeMs <= 0) return null;
  const startRaw = Number(params.get('s'));
  const startTimeMs = Number.isFinite(startRaw) && startRaw > 0 && startRaw < targetTimeMs
    ? startRaw
    : Date.now();
  const requestedDance = params.get('d') || 'groove';
  return {
    isFullscreen: params.get('view') === 'full',
    state: {
      eventName: (params.get('n') || 'Tapahtuma').slice(0, 60),
      startTimeMs,
      targetTimeMs,
      counterMode: params.get('m') === 'h' ? 'hours_seconds' : 'days_hours_seconds',
      danceStyle: danceIds.includes(requestedDance) ? requestedDance : 'groove',
      musicEnabled: true,
      musicTrack: knownShareTrack(params.get('k')),
      celebrated: false,
      slug: null,
    },
  };
}

function execCommandCopy(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.setAttribute('readonly', '');
  tempInput.style.position = 'fixed';
  tempInput.style.left = '-9999px';
  document.body.appendChild(tempInput);
  tempInput.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (e) {
    copied = false;
  }
  document.body.removeChild(tempInput);
  return copied;
}

export async function copyOrShare(text, { title } = {}) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return 'clipboard';
    } catch (e) {
      /* kokeile jakovalikkoa ja lopuksi execCommandia */
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: title || 'Ahlsell-ajastin', url: text });
      return 'share';
    } catch (e) {
      if (e && e.name === 'AbortError') return 'aborted';
    }
  }
  if (execCommandCopy(text)) return 'exec';
  return 'failed';
}
