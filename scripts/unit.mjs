import assert from 'node:assert/strict';
import { passwordsMatch, signSession, verifySession } from '../functions/lib/auth.js';
import { isAllowedDance, parseCounterInput } from '../functions/lib/counters.js';
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
assert.equal(isAllowedDance('nope'), false);

const bad = parseCounterInput({
  name: '<script>alert(1)</script>',
  targetTimeMs: Date.UTC(2030, 0, 1),
  musicEnabled: false,
  danceStyle: 'groove',
  counterMode: 'days_hours_seconds',
});
assert.equal(bad.errors.length, 0);
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

console.log('unit ok');
