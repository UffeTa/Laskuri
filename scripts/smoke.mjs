const base = process.env.BASE || 'http://127.0.0.1:8788';
const password = process.env.ADMIN_PASSWORD || 'test-admin-salasana';
const origin = new URL(base).origin;

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

let cookie = '';

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Origin', origin);
  if (cookie) headers.set('Cookie', cookie);
  if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json');
  const response = await fetch(`${base}${path}`, { ...options, headers });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    const pair = setCookie.split(';')[0];
    if (pair.startsWith('laskuri_session=')) cookie = pair;
    if (pair === 'laskuri_session=') cookie = '';
  }
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { response, body, text };
}

const home = await request('/');
assert(home.response.status === 200, 'etusivu');
assert(home.text.includes('/css/styles.css'), 'css');
assert(!home.text.includes('cdn.tailwindcss.com'), 'ei tailwind-play-cdnia');
assert(home.text.includes('id="dance-style"'), 'tanssivalinta');
assert(home.text.includes('aria-live="polite"'), 'aria-live');
assert(!home.text.includes('innerHTML'), 'sivupohjassa ei innerHTML');

const anon = await request('/api/admin/counters', { method: 'POST', body: '{}' });
assert(anon.response.status === 401, `anon ${anon.response.status}`);

const noOrigin = await fetch(`${base}/api/auth/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ password }),
});
assert(noOrigin.status === 403, `origin ${noOrigin.status}`);

const wrong = await request('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ password: 'vaara' }),
});
assert(wrong.response.status === 401, `wrong ${wrong.response.status}`);

const login = await request('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ password }),
});
assert(login.response.status === 200, `login ${login.response.status} ${login.text}`);
assert(cookie.includes('laskuri_session='), 'cookie');
const cookieHeader = login.response.headers.get('set-cookie') || '';
assert(cookieHeader.includes('HttpOnly'), 'httponly');
assert(cookieHeader.includes('SameSite=Lax'), 'samesite');
assert(!cookieHeader.includes('Secure'), 'local cookie ei secure');

const me = await request('/api/auth/me');
assert(me.body.authenticated === true, 'me');

const dances = await request('/api/dances');
assert(dances.body.dances.some((dance) => dance.id === 'robot'), 'robot-tyyli');

const now = Date.now();
const created = await request('/api/admin/counters', {
  method: 'POST',
  body: JSON.stringify({
    name: '<b>Savutesti</b>',
    targetTimeMs: now + 60 * 60 * 1000,
    startTimeMs: now - 60 * 1000,
    musicEnabled: false,
    danceStyle: 'groove',
    counterMode: 'days_hours_seconds',
    slug: 'savutesti',
  }),
});
assert(created.response.status === 201, `create ${created.response.status} ${created.text}`);
assert(created.body.counter.name === '<b>Savutesti</b>', 'name json');

const pub = await request('/api/counters/savutesti');
assert(pub.response.status === 200, 'public get');
assert(pub.body.counter.danceStyle === 'groove', 'groove');

const page = await request('/l/savutesti');
assert(page.response.status === 200, `slug page ${page.response.status}`);
assert(page.text.includes('/js/app.js'), 'slug serves app');
assert(!page.text.includes('<b>Savutesti</b>'), 'nimi ei ole html:ssa');

const missing = await request('/l/ei-ole-olemassa');
assert(missing.response.status === 404, `missing ${missing.response.status}`);
assert(missing.text.includes('Laskuria ei löytynyt'), '404 teksti');

const updated = await request('/api/admin/counters/savutesti', {
  method: 'PUT',
  body: JSON.stringify({
    name: 'Savutesti',
    targetTimeMs: now + 60 * 60 * 1000,
    startTimeMs: now - 60 * 1000,
    musicEnabled: true,
    danceStyle: 'robot',
    counterMode: 'hours_seconds',
    slug: 'savutesti',
  }),
});
assert(updated.response.status === 200, `update ${updated.response.status} ${updated.text}`);
assert(updated.body.counter.danceStyle === 'robot', 'robot');
assert(updated.body.counter.musicEnabled === true, 'music');

const legacy = await request(`/?n=Vanha&s=${now - 1000}&t=${now + 60000}&m=d&view=full&d=groove`);
assert(legacy.response.status === 200, 'legacy');
assert(legacy.text.includes('boot.js'), 'boot');

const removed = await request('/api/admin/counters/savutesti', { method: 'DELETE' });
assert(removed.response.status === 200, `delete ${removed.response.status}`);
const gone = await request('/api/counters/savutesti');
assert(gone.response.status === 404, 'deleted public');

const logout = await request('/api/auth/logout', { method: 'POST' });
assert(logout.response.status === 200, 'logout');
const after = await request('/api/auth/me');
assert(after.response.status === 401, 'logged out');

console.log('smoke ok');
