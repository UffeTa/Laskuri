import { DANCE_STYLES } from '../dances/registry.js';
import { MUSIC_TRACKS, RANDOM_TRACK_ID } from '../music/registry.js';
import { copyOrShare } from '../js/share.js';

const loginPanel = document.getElementById('login-panel');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');
const adminStatus = document.getElementById('admin-status');
const counterList = document.getElementById('counter-list');
const counterForm = document.getElementById('counter-form');
const formTitle = document.getElementById('form-title');
const danceSelect = document.getElementById('field-dance');
const trackSelect = document.getElementById('field-track');
const submitButton = document.getElementById('btn-save');

let editingSlug = null;
let counters = [];

function pad2(num) {
  return String(num).padStart(2, '0');
}

function setLoginError(message) {
  loginError.textContent = message || '';
  loginError.classList.toggle('hidden', !message);
}

function setStatus(message) {
  adminStatus.textContent = message || '';
}

function showLogin() {
  loginPanel.classList.remove('hidden');
  adminPanel.classList.add('hidden');
}

function showAdmin() {
  loginPanel.classList.add('hidden');
  adminPanel.classList.remove('hidden');
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  let body = {};
  try {
    body = await response.json();
  } catch (e) {
    body = {};
  }
  return { response, body };
}

function fillDances() {
  danceSelect.replaceChildren();
  const randomOption = document.createElement('option');
  randomOption.value = 'random';
  randomOption.textContent = 'Satunnainen';
  danceSelect.appendChild(randomOption);
  for (const dance of DANCE_STYLES) {
    const option = document.createElement('option');
    option.value = dance.id;
    option.textContent = `${dance.name} — ${dance.description}`;
    danceSelect.appendChild(option);
  }
}

function danceName(counter) {
  const id = counter && counter.danceLocked ? counter.danceStyle : 'random';
  if (!id || id === 'random') return 'Satunnainen';
  const dance = DANCE_STYLES.find((item) => item.id === id);
  return dance ? dance.name : 'Satunnainen';
}

function trackName(counter) {
  const id = counter && counter.musicLocked ? counter.musicTrack : RANDOM_TRACK_ID;
  if (!id || id === RANDOM_TRACK_ID) return 'Satunnainen';
  const track = MUSIC_TRACKS.find((item) => item.id === id);
  return track ? track.name : 'Satunnainen';
}

function fillTracks() {
  trackSelect.replaceChildren();
  const randomOption = document.createElement('option');
  randomOption.value = RANDOM_TRACK_ID;
  randomOption.textContent = 'Satunnainen';
  trackSelect.appendChild(randomOption);
  for (const track of MUSIC_TRACKS) {
    const option = document.createElement('option');
    option.value = track.id;
    option.textContent = `${track.name} — ${track.description}`;
    trackSelect.appendChild(option);
  }
}

function formatWhen(ms) {
  const date = new Date(ms);
  return `${date.toLocaleDateString('fi-FI')} klo ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function dateValue(ms) {
  const date = new Date(ms);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function timeValue(ms) {
  const date = new Date(ms);
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function readStamp(dateId, timeId) {
  const date = document.getElementById(dateId).value;
  const time = document.getElementById(timeId).value;
  if (!date && !time) return { empty: true };
  if (!date || !time) return { error: 'Täytä sekä päivä että kellonaika.' };
  const ms = new Date(`${date}T${time}:00`).getTime();
  if (!Number.isFinite(ms)) return { error: 'Tarkista päivämäärä ja kellonaika.' };
  return { ms };
}

function publicUrl(slug) {
  return new URL(`/l/${slug}`, location.origin).href;
}

function resetForm() {
  editingSlug = null;
  counterForm.reset();
  formTitle.textContent = 'Uusi laskuri';
  submitButton.textContent = 'Luo laskuri';
  danceSelect.value = 'random';
  trackSelect.value = RANDOM_TRACK_ID;
  document.getElementById('field-music').checked = true;
  document.getElementById('field-mode').value = 'days_hours_seconds';
}

function fillForm(counter) {
  editingSlug = counter.slug;
  formTitle.textContent = 'Muokkaa laskuria';
  submitButton.textContent = 'Tallenna muutokset';
  document.getElementById('field-name').value = counter.name;
  document.getElementById('field-slug').value = counter.slug;
  document.getElementById('field-date').value = dateValue(counter.targetTimeMs);
  document.getElementById('field-time').value = timeValue(counter.targetTimeMs);
  document.getElementById('field-start-date').value = dateValue(counter.startTimeMs);
  document.getElementById('field-start-time').value = timeValue(counter.startTimeMs);
  document.getElementById('field-music').checked = !!counter.musicEnabled;
  trackSelect.value = counter.musicLocked && MUSIC_TRACKS.some((track) => track.id === counter.musicTrack)
    ? counter.musicTrack
    : RANDOM_TRACK_ID;
  danceSelect.value = counter.danceLocked && DANCE_STYLES.some((dance) => dance.id === counter.danceStyle)
    ? counter.danceStyle
    : 'random';
  document.getElementById('field-mode').value = counter.counterMode === 'hours_seconds'
    ? 'hours_seconds'
    : 'days_hours_seconds';
  counterForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function button(label, className, onClick) {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = className;
  element.textContent = label;
  element.addEventListener('click', onClick);
  return element;
}

function renderList() {
  counterList.replaceChildren();
  if (!counters.length) {
    const empty = document.createElement('p');
    empty.className = 'text-sm font-semibold text-slate-600';
    empty.textContent = 'Ei laskureita vielä.';
    counterList.appendChild(empty);
    return;
  }
  for (const counter of counters) {
    const card = document.createElement('article');
    card.className = 'bg-white border-[3px] border-[#141414] rounded-2xl p-4 space-y-3';

    const title = document.createElement('h3');
    title.className = 'font-comic text-2xl leading-none';
    title.textContent = counter.name;

    const meta = document.createElement('p');
    meta.className = 'text-sm font-semibold text-slate-700';
    meta.textContent = `Maali ${formatWhen(counter.targetTimeMs)} · aloitus ${formatWhen(counter.startTimeMs)} · ${danceName(counter)} · ${trackName(counter)} · musiikki ${counter.musicEnabled ? 'päällä' : 'pois'}`;

    const link = document.createElement('a');
    link.href = `/l/${encodeURIComponent(counter.slug)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'block text-sm font-bold text-[#118AB2] break-all';
    link.textContent = publicUrl(counter.slug);

    const actions = document.createElement('div');
    actions.className = 'flex flex-wrap gap-2';
    actions.append(
      button('Kopioi osoite', 'comic-btn bg-[#118AB2] text-white text-xs font-bold px-3 py-2 rounded-xl', async () => {
        const result = await copyOrShare(publicUrl(counter.slug), { title: counter.name });
        if (result === 'clipboard' || result === 'exec') setStatus('Osoite kopioitu leikepöydälle.');
        else if (result === 'share') setStatus('Jakovalikko avattiin.');
        else if (result !== 'aborted') setStatus('Kopiointi ei onnistunut tässä selaimessa.');
      }),
      button('Muokkaa', 'comic-btn bg-[#FFD166] text-[#141414] text-xs font-bold px-3 py-2 rounded-xl', () => {
        fillForm(counter);
      }),
      button('Poista', 'comic-btn bg-[#EF476F] text-white text-xs font-bold px-3 py-2 rounded-xl', async (event) => {
        const target = event.currentTarget;
        if (target.dataset.armed !== '1') {
          target.dataset.armed = '1';
          target.textContent = 'Vahvista poisto';
          setTimeout(() => {
            if (target.isConnected) {
              target.dataset.armed = '';
              target.textContent = 'Poista';
            }
          }, 8000);
          return;
        }
        const result = await api(`/api/admin/counters/${encodeURIComponent(counter.slug)}`, { method: 'DELETE' });
        if (result.response.status === 401) {
          showLogin();
          return;
        }
        if (!result.response.ok) {
          setStatus(result.body.error || 'Poisto epäonnistui.');
          return;
        }
        if (editingSlug === counter.slug) resetForm();
        setStatus('Laskuri poistettu.');
        await loadCounters();
      }),
    );

    card.append(title, meta, link, actions);
    counterList.appendChild(card);
  }
}

async function loadCounters() {
  const result = await api('/api/admin/counters');
  if (result.response.status === 401) {
    showLogin();
    return;
  }
  if (!result.response.ok) {
    setStatus(result.body.error || 'Laskureita ei saatu ladattua.');
    return;
  }
  counters = Array.isArray(result.body.counters) ? result.body.counters : [];
  renderList();
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoginError('');
  const password = passwordInput.value;
  const result = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  passwordInput.value = '';
  if (!result.response.ok) {
    setLoginError(result.body.error || 'Kirjautuminen epäonnistui.');
    return;
  }
  showAdmin();
  setStatus('');
  await loadCounters();
});

document.getElementById('btn-logout').addEventListener('click', async () => {
  await api('/api/auth/logout', { method: 'POST' });
  resetForm();
  showLogin();
});

document.getElementById('btn-cancel').addEventListener('click', () => {
  resetForm();
  setStatus('');
});

counterForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('field-name').value.trim();
  if (!name) {
    setStatus('Anna tapahtuman nimi.');
    return;
  }
  const target = readStamp('field-date', 'field-time');
  if (target.error || target.empty) {
    setStatus(target.error || 'Anna tavoitteen päivä ja kellonaika.');
    return;
  }
  const start = readStamp('field-start-date', 'field-start-time');
  if (start.error) {
    setStatus(start.error);
    return;
  }
  const payload = {
    name,
    targetTimeMs: target.ms,
    musicEnabled: document.getElementById('field-music').checked,
    musicTrack: trackSelect.value,
    danceStyle: danceSelect.value,
    counterMode: document.getElementById('field-mode').value,
  };
  if (!start.empty) payload.startTimeMs = start.ms;
  const slug = document.getElementById('field-slug').value.trim().toLowerCase();
  if (slug) payload.slug = slug;

  const path = editingSlug
    ? `/api/admin/counters/${encodeURIComponent(editingSlug)}`
    : '/api/admin/counters';
  const method = editingSlug ? 'PUT' : 'POST';
  submitButton.disabled = true;
  const result = await api(path, { method, body: JSON.stringify(payload) });
  submitButton.disabled = false;
  if (result.response.status === 401) {
    showLogin();
    return;
  }
  if (!result.response.ok) {
    setStatus(result.body.error || 'Tallennus epäonnistui.');
    return;
  }
  setStatus(editingSlug ? 'Muutokset tallennettu.' : `Laskuri luotu: ${publicUrl(result.body.counter.slug)}`);
  resetForm();
  await loadCounters();
});

fillDances();
fillTracks();
resetForm();

try {
  const session = await api('/api/auth/me');
  if (session.response.ok) {
    showAdmin();
    await loadCounters();
  } else {
    showLogin();
  }
} catch (e) {
  setLoginError('Yhteys palvelimeen epäonnistui.');
  showLogin();
}
