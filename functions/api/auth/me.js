import { requireAdmin } from '../../lib/auth.js';
import { json } from '../../lib/http.js';

export async function onRequestGet(context) {
  const auth = await requireAdmin(context);
  if (auth.error) return auth.error;
  return json({ ok: true, authenticated: true });
}
