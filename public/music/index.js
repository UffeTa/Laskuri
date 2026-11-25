import { RANDOM_TRACK_ID, MUSIC_TRACKS } from './registry.js';
import { compileTrack } from './sequence.js';

export { MUSIC_TRACKS, RANDOM_TRACK_ID };

const cache = new Map();

export function isKnownTrack(id) {
  return id === RANDOM_TRACK_ID || MUSIC_TRACKS.some((track) => track.id === id);
}

export async function loadTrack(id) {
  const entry = MUSIC_TRACKS.find((track) => track.id === id) || MUSIC_TRACKS[0];
  if (cache.has(entry.id)) return cache.get(entry.id);
  const mod = await import(new URL(entry.module, import.meta.url).href);
  const compiled = compileTrack({
    ...mod.default,
    id: entry.id,
    name: entry.name,
    description: entry.description,
  });
  cache.set(entry.id, compiled);
  return compiled;
}

export function resolveTrackId(requested) {
  if (requested && requested !== RANDOM_TRACK_ID && MUSIC_TRACKS.some((track) => track.id === requested)) {
    return requested;
  }
  const index = Math.floor(Math.random() * MUSIC_TRACKS.length);
  return MUSIC_TRACKS[index].id;
}

export function nextTrackId(currentId) {
  const index = MUSIC_TRACKS.findIndex((track) => track.id === currentId);
  return MUSIC_TRACKS[(index + 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length].id;
}
