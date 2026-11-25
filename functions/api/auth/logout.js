import { clearSessionCookie } from '../../lib/auth.js';
import { isSameOrigin, json } from '../../lib/http.js';

export async function onRequestPost(context) {
  if (!isSameOrigin(context.request)) {
    return json({ ok: false, error: 'Pyyntö hylättiin.' }, 403);
  }
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie(context.request) });
}
