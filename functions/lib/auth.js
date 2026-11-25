import { json, readCookie } from './http.js';

export const SESSION_COOKIE = 'laskuri_session';
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

function bytesToB64url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function b64urlToBytes(value) {
  const pad = value.length % 4 === 0 ? '' : '='.repeat(4 - (value.length % 4));
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signSession(secret, maxAgeSec = SESSION_MAX_AGE_SEC) {
  const payload = bytesToB64url(encoder.encode(JSON.stringify({
    v: 1,
    exp: Date.now() + maxAgeSec * 1000,
  })));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return `${payload}.${bytesToB64url(new Uint8Array(signature))}`;
}

export async function verifySession(secret, token) {
  if (!secret || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  try {
    const key = await hmacKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlToBytes(parts[1]),
      encoder.encode(parts[0]),
    );
    if (!valid) return null;
    const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0])));
    if (!data || data.v !== 1 || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function cookieSecure(request) {
  return new URL(request.url).protocol === 'https:';
}

export function sessionCookie(token, request, maxAgeSec = SESSION_MAX_AGE_SEC) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAgeSec}`,
  ];
  if (cookieSecure(request)) parts.push('Secure');
  return parts.join('; ');
}

export function clearSessionCookie(request) {
  const parts = [
    `${SESSION_COOKIE}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (cookieSecure(request)) parts.push('Secure');
  return parts.join('; ');
}

export async function passwordsMatch(input, expected) {
  const [left, right] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(String(input))),
    crypto.subtle.digest('SHA-256', encoder.encode(String(expected))),
  ]);
  const a = new Uint8Array(left);
  const b = new Uint8Array(right);
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function secretsReady(env) {
  return Boolean(env && env.ADMIN_PASSWORD && env.SESSION_SECRET);
}

export async function requireAdmin(context) {
  if (!secretsReady(context.env)) {
    return {
      error: json({
        ok: false,
        error: 'Ylläpitoa ei ole vielä otettu käyttöön. Aseta ADMIN_PASSWORD ja SESSION_SECRET.',
      }, 503),
    };
  }
  const token = readCookie(context.request, SESSION_COOKIE);
  const session = await verifySession(context.env.SESSION_SECRET, token);
  if (!session) {
    return { error: json({ ok: false, error: 'Kirjaudu sisään.' }, 401) };
  }
  return { session };
}
