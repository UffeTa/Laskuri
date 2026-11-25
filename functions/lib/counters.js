import { DANCE_STYLES } from '../../public/dances/registry.js';
import { MUSIC_TRACKS, RANDOM_TRACK_ID } from '../../public/music/registry.js';
import { isValidSlug, randomSuffix, slugify } from './slug.js';

const MODES = new Set(['days_hours_seconds', 'hours_seconds']);
const MIN_MS = Date.UTC(2000, 0, 1);
const MAX_MS = Date.UTC(2100, 0, 1);

export function isAllowedDance(id) {
  return id === 'random' || DANCE_STYLES.some((dance) => dance.id === id);
}

export function isAllowedTrack(id) {
  return id === RANDOM_TRACK_ID || MUSIC_TRACKS.some((track) => track.id === id);
}

export function rowToCounter(row) {
  if (!row) return null;
  return {
    slug: row.slug,
    name: row.name,
    targetTimeMs: Number(row.target_time_ms),
    startTimeMs: Number(row.start_time_ms),
    musicEnabled: Number(row.music_enabled) === 1,
    musicTrack: row.music_track || RANDOM_TRACK_ID,
    danceStyle: row.dance_style || 'random',
    counterMode: row.counter_mode,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

function cleanName(value) {
  return String(value).trim().replace(/[\u0000-\u001F\u007F]/g, '');
}

function readTime(value, label, errors, key, out) {
  if (value === undefined || value === null || value === '') {
    errors.push(`${label} puuttuu.`);
    return;
  }
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number) || number < MIN_MS || number > MAX_MS) {
    errors.push(`${label} on virheellinen.`);
    return;
  }
  out[key] = number;
}

export function parseCounterInput(data) {
  const errors = [];
  const value = {};
  if (!data || typeof data !== 'object') return { errors: ['Virheellinen pyyntö.'], value };

  const name = typeof data.name === 'string' ? cleanName(data.name) : '';
  if (!name || name.length > 60) errors.push('Tapahtuman nimi puuttuu tai on liian pitkä.');
  else value.name = name;

  readTime(data.targetTimeMs, 'Tavoiteaika', errors, 'targetTimeMs', value);

  if (data.startTimeMs !== undefined && data.startTimeMs !== null && data.startTimeMs !== '') {
    readTime(data.startTimeMs, 'Aloitusaika', errors, 'startTimeMs', value);
  }

  if (typeof data.musicEnabled !== 'boolean') errors.push('Musiikkivalinta on virheellinen.');
  else value.musicEnabled = data.musicEnabled;

  if (data.musicTrack === undefined || data.musicTrack === null || data.musicTrack === '') {
    value.musicTrack = RANDOM_TRACK_ID;
  } else if (!isAllowedTrack(data.musicTrack)) {
    errors.push('Tuntematon taustaraita.');
  } else {
    value.musicTrack = data.musicTrack;
  }

  if (data.danceStyle === undefined || data.danceStyle === null || data.danceStyle === '') {
    value.danceStyle = 'random';
  } else if (!isAllowedDance(data.danceStyle)) {
    errors.push('Tuntematon tanssityyli.');
  } else {
    value.danceStyle = data.danceStyle;
  }

  const mode = data.counterMode || 'days_hours_seconds';
  if (!MODES.has(mode)) errors.push('Laskurin näyttötila on virheellinen.');
  else value.counterMode = mode;

  if (data.slug !== undefined && data.slug !== null && String(data.slug).trim() !== '') {
    const slug = String(data.slug).trim().toLowerCase();
    if (!isValidSlug(slug)) {
      errors.push('Osoitteen tulee olla 2–48 merkkiä: pieniä kirjaimia, numeroita ja väliviivoja.');
    } else {
      value.slug = slug;
    }
  }

  if (value.startTimeMs !== undefined && value.targetTimeMs !== undefined && value.startTimeMs >= value.targetTimeMs) {
    errors.push('Aloitusajan pitää olla ennen tavoiteaikaa.');
  }

  return { errors, value };
}

export async function getCounter(db, slug) {
  const row = await db.prepare('SELECT * FROM counters WHERE slug = ?').bind(slug).first();
  return rowToCounter(row);
}

export async function listCounters(db) {
  const { results } = await db.prepare(
    'SELECT * FROM counters ORDER BY updated_at DESC',
  ).all();
  return (results || []).map(rowToCounter);
}

async function slugIsFree(db, slug) {
  const row = await db.prepare('SELECT slug FROM counters WHERE slug = ?').bind(slug).first();
  return !row;
}

async function allocateSlug(db, name, requested) {
  if (requested) {
    if (!(await slugIsFree(db, requested))) {
      return { error: 'Osoite on jo käytössä.', status: 409 };
    }
    return { slug: requested };
  }
  const base = slugify(name);
  let slug = base;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    if (await slugIsFree(db, slug)) return { slug };
    slug = `${base.slice(0, 40)}-${randomSuffix()}`.replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!isValidSlug(slug)) slug = `laskuri-${randomSuffix()}`;
  }
  return { error: 'Osoitetta ei saatu luotua. Yritä uudelleen.', status: 409 };
}

function defaultStart(targetTimeMs, startTimeMs) {
  if (startTimeMs !== undefined) return startTimeMs;
  const now = Date.now();
  if (now < targetTimeMs) return now;
  return targetTimeMs - 60 * 1000;
}

export async function createCounter(db, input) {
  const allocated = await allocateSlug(db, input.name, input.slug);
  if (allocated.error) return allocated;
  const startTimeMs = defaultStart(input.targetTimeMs, input.startTimeMs);
  if (startTimeMs >= input.targetTimeMs) {
    return { error: 'Aloitusajan pitää olla ennen tavoiteaikaa.', status: 400 };
  }
  const now = Date.now();
  try {
    await db.prepare(`
      INSERT INTO counters (
        slug, name, target_time_ms, start_time_ms, music_enabled, dance_style, counter_mode, music_track, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      allocated.slug,
      input.name,
      input.targetTimeMs,
      startTimeMs,
      input.musicEnabled ? 1 : 0,
      input.danceStyle,
      input.counterMode,
      input.musicTrack || RANDOM_TRACK_ID,
      now,
      now,
    ).run();
  } catch (error) {
    if (String(error && error.message || error).includes('UNIQUE')) {
      return { error: 'Osoite on jo käytössä.', status: 409 };
    }
    throw error;
  }
  return { counter: await getCounter(db, allocated.slug) };
}

export async function updateCounter(db, currentSlug, input) {
  const current = await getCounter(db, currentSlug);
  if (!current) return { error: 'Laskuria ei löytynyt.', status: 404 };
  const nextSlug = input.slug || current.slug;
  if (nextSlug !== current.slug && !(await slugIsFree(db, nextSlug))) {
    return { error: 'Osoite on jo käytössä.', status: 409 };
  }
  const startTimeMs = input.startTimeMs !== undefined ? input.startTimeMs : current.startTimeMs;
  if (startTimeMs >= input.targetTimeMs) {
    return { error: 'Aloitusajan pitää olla ennen tavoiteaikaa.', status: 400 };
  }
  try {
    await db.prepare(`
      UPDATE counters
      SET slug = ?, name = ?, target_time_ms = ?, start_time_ms = ?, music_enabled = ?,
          dance_style = ?, counter_mode = ?, music_track = ?, updated_at = ?
      WHERE slug = ?
    `).bind(
      nextSlug,
      input.name,
      input.targetTimeMs,
      startTimeMs,
      input.musicEnabled ? 1 : 0,
      input.danceStyle,
      input.counterMode,
      input.musicTrack || RANDOM_TRACK_ID,
      Date.now(),
      currentSlug,
    ).run();
  } catch (error) {
    if (String(error && error.message || error).includes('UNIQUE')) {
      return { error: 'Osoite on jo käytössä.', status: 409 };
    }
    throw error;
  }
  return { counter: await getCounter(db, nextSlug) };
}

export async function deleteCounter(db, slug) {
  const result = await db.prepare('DELETE FROM counters WHERE slug = ?').bind(slug).run();
  const changes = result && result.meta ? Number(result.meta.changes || 0) : 0;
  return changes > 0;
}
