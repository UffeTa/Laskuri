export function json(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  for (const [key, value] of Object.entries(extraHeaders)) {
    headers.set(key, value);
  }
  return new Response(JSON.stringify(data), { status, headers });
}

export function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export async function readJson(request) {
  let text = '';
  try {
    text = await request.text();
  } catch {
    return { error: 'Virheellinen pyyntö.' };
  }
  if (text.length > 20000) return { error: 'Liian suuri pyyntö.' };
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { error: 'Virheellinen pyyntö.' };
    }
    return { data };
  } catch {
    return { error: 'Virheellinen JSON.' };
  }
}

export function isSameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'local';
}

export function readCookie(request, name) {
  const raw = request.headers.get('Cookie') || '';
  for (const part of raw.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === name) return trimmed.slice(eq + 1);
  }
  return '';
}
