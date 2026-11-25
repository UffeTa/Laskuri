import assert from 'node:assert/strict';
import { passwordsMatch, signSession, verifySession } from '../functions/lib/auth.js';
import { isAllowedDance, isAllowedTrack, parseCounterInput } from '../functions/lib/counters.js';
import { compileTrack } from '../public/music/sequence.js';
import pihapolku from '../public/music/pihapolku.js';
import yovuoro from '../public/music/yovuoro.js';
import maaliviiva from '../public/music/maaliviiva.js';
import aamunkoitto from '../public/music/aamunkoitto.js';
import kolikkopeli from '../public/music/kolikkopeli.js';
import luolaseikkailu from '../public/music/luolaseikkailu.js';
import vesitaso from '../public/music/vesitaso.js';
import pommitus from '../public/music/pommitus.js';
import { DANCE_STYLES } from '../public/dances/registry.js';
import { locksFromShareParams, pickDifferent, resolveChoice, shareLockParams, visiblePose } from '../public/js/visit-choice.js';
import { isValidSlug, slugify } from '../functions/lib/slug.js';

assert.equal(slugify('Työpäivä pulkassa & viikonloppu'), 'tyopaiva-pulkassa-viikonloppu');
assert.equal(slugify('!!!'), 'laskuri');
assert.equal(slugify('a'), 'laskuri');
assert.equal(isValidSlug('bos-5'), true);
assert.equal(isValidSlug('A'), false);
assert.equal(isValidSlug('foo_bar'), false);
assert.equal(isValidSlug('../etc'), false);

assert.equal(isAllowedDance('groove'), true);
assert.equal(isAllowedDance('robot'), true);
assert.equal(isAllowedDance('random'), true);
assert.equal(isAllowedDance('nope'), false);
assert.equal(isAllowedDance('disco'), true);
assert.equal(isAllowedDance('floss'), true);
assert.equal(isAllowedDance('moonwalk'), true);
assert.ok(DANCE_STYLES.length >= 18);
assert.equal(isAllowedTrack('random'), true);
assert.equal(isAllowedTrack('pihapolku'), true);
assert.equal(isAllowedTrack('ei-raitaa'), false);

for (const definition of [pihapolku, yovuoro, maaliviiva, aamunkoitto, kolikkopeli, luolaseikkailu, vesitaso, pommitus]) {
  const compiled = compileTrack(definition);
  assert.ok(compiled.seconds >= 170 && compiled.seconds <= 210, `${definition.id} ${compiled.seconds}`);
  assert.equal(compiled.bars % 1, 0);
  const last = compiled.events[compiled.events.length - 1];
  assert.ok(last.time < compiled.seconds);
}

const bad = parseCounterInput({
  name: '<script>alert(1)</script>',
  targetTimeMs: Date.UTC(2030, 0, 1),
  musicEnabled: false,
  danceStyle: 'groove',
  counterMode: 'days_hours_seconds',
});
assert.equal(bad.errors.length, 0);
assert.equal(bad.value.musicTrack, 'random');
assert.equal(bad.value.name.includes('<'), true);
assert.equal(bad.value.name.includes('\u0000'), false);

const unknownDance = parseCounterInput({
  name: 'Testi',
  targetTimeMs: Date.UTC(2030, 0, 1),
  musicEnabled: true,
  danceStyle: 'polkka',
  counterMode: 'hours_seconds',
});
assert.ok(unknownDance.errors.some((error) => error.includes('tanssi')));

const secret = 'test-session-secret-value';
const token = await signSession(secret, 60);
const session = await verifySession(secret, token);
assert.equal(session.v, 1);
assert.equal(await verifySession('other-secret', token), null);
assert.equal(await verifySession(secret, `${token}x`), null);
const expired = await signSession(secret, -10);
assert.equal(await verifySession(secret, expired), null);

assert.equal(await passwordsMatch('salasana', 'salasana'), true);
assert.equal(await passwordsMatch('salasana', 'väärä'), false);

const groove = (await import('../public/dances/groove.js')).default;
const robot = (await import('../public/dances/robot.js')).default;
assert.equal(groove.rootClass, 'dance-groove');
assert.match(groove.css, /\.dance-groove \.anim-dance-body/);
assert.equal(robot.rootClass, 'dance-robot');
assert.match(robot.css, /steps\(2, end\)/);
assert.notEqual(groove.svgUrl, robot.svgUrl);

const ids = ['groove', 'floss', 'dab'];
for (let i = 0; i < 30; i += 1) {
  assert.notEqual(pickDifferent(ids, 'groove'), 'groove');
}
assert.equal(pickDifferent(['only'], 'only'), 'only');
const storedGroove = resolveChoice({
  forced: false,
  locked: false,
  value: 'groove',
  ids,
  previousId: 'dab',
});
assert.equal(storedGroove.randomized, true);
assert.notEqual(storedGroove.id, 'dab');
const locked = resolveChoice({ forced: false, locked: true, value: 'floss', ids, previousId: 'dab' });
assert.deepEqual(locked, { id: 'floss', randomized: false });
const forced = resolveChoice({ forced: true, locked: false, value: 'dab', ids, previousId: 'floss' });
assert.deepEqual(forced, { id: 'dab', randomized: false });
assert.deepEqual(shareLockParams({ danceStyle: 'groove', danceLocked: false, musicTrack: 'random' }), { d: '', k: '' });
assert.deepEqual(shareLockParams({ danceStyle: 'floss', danceLocked: true, musicTrack: 'yovuoro', musicLocked: true }), { d: 'floss', k: 'yovuoro' });
const fromLockedUrl = locksFromShareParams({
  danceId: 'floss',
  trackId: 'yovuoro',
  danceIds: ids,
  trackIds: ['pihapolku', 'yovuoro'],
});
assert.equal(fromLockedUrl.danceLocked, true);
assert.equal(fromLockedUrl.musicLocked, true);
assert.deepEqual(resolveChoice({
  forced: false,
  locked: fromLockedUrl.musicLocked,
  value: fromLockedUrl.musicTrack,
  ids: ['pihapolku', 'yovuoro'],
  previousId: 'pihapolku',
}), { id: 'yovuoro', randomized: false });
const fromOpenUrl = locksFromShareParams({
  danceId: null,
  trackId: 'random',
  danceIds: ids,
  trackIds: ['pihapolku', 'yovuoro'],
});
assert.equal(fromOpenUrl.danceLocked, false);
assert.equal(fromOpenUrl.musicLocked, false);
assert.equal(visiblePose('walk'), 'dance');
assert.equal(visiblePose('cheerful'), 'dance');
assert.equal(visiblePose('dance'), 'dance');
assert.equal(visiblePose('celebrate'), 'celebrate');
const seen = new Set();
let previous = '';
for (let i = 0; i < 8; i += 1) {
  previous = pickDifferent(ids, previous);
  seen.add(previous);
}
assert.ok(seen.size >= 2);

console.log('unit ok');
