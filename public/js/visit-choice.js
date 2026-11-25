/** Picks an id that is not the previous one when another choice exists. */
export function pickDifferent(ids, previousId) {
  const unique = [];
  ids.forEach((id) => {
    if (id && !unique.includes(id)) unique.push(id);
  });
  if (!unique.length) return '';
  const pool = unique.filter((id) => id !== previousId);
  const source = pool.length ? pool : unique;
  return source[Math.floor(Math.random() * source.length)];
}

/**
 * A visit is random unless the URL forces a dance or the admin locked a value.
 * A stored style such as the old default "groove" is not a lock by itself.
 */
export function resolveChoice({ forced, locked, value, ids, previousId }) {
  const known = ids.includes(value);
  if (forced && known) return { id: value, randomized: false };
  if (locked && value && value !== 'random' && known) return { id: value, randomized: false };
  return { id: pickDifferent(ids, previousId), randomized: true };
}

/**
 * A legacy share URL only contains d/k when that choice was locked.
 * Reading them back must restore the lock, or a refresh re-rolls the track.
 */
export function locksFromShareParams({ danceId, trackId, danceIds, trackIds }) {
  const danceLocked = Boolean(danceId && danceIds.includes(danceId));
  const musicLocked = Boolean(trackId && trackId !== 'random' && trackIds.includes(trackId));
  return {
    danceStyle: danceLocked ? danceId : 'random',
    danceForced: danceLocked,
    danceLocked,
    musicTrack: musicLocked ? trackId : 'random',
    musicLocked,
  };
}

/** Share links carry d/k only for an admin lock, never for a rolled visit. */
export function shareLockParams(state) {
  const dance = state && state.danceLocked && state.danceStyle && state.danceStyle !== 'random'
    ? state.danceStyle
    : '';
  const track = state && state.musicLocked && state.musicTrack && state.musicTrack !== 'random'
    ? state.musicTrack
    : '';
  return { d: dance, k: track };
}
