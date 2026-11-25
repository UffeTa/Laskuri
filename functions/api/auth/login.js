import { passwordsMatch, secretsReady, sessionCookie, signSession } from '../../lib/auth.js';
import { clientIp, isSameOrigin, json, readJson } from '../../lib/http.js';
import { clearLoginFailures, loginStatus, recordLoginFailure } from '../../lib/rate-limit.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!isSameOrigin(request)) {
    return json({ ok: false, error: 'Pyyntö hylättiin.' }, 403);
  }
  if (!secretsReady(env) || !env.DB) {
    return json({
      ok: false,
      error: 'Ylläpitoa ei ole vielä otettu käyttöön. Aseta salaisuudet ja D1-tietokanta.',
    }, 503);
  }

  const ip = clientIp(request);
  try {
    const status = await loginStatus(env.DB, ip);
    if (!status.allowed) {
      return json(
        { ok: false, error: 'Liian monta yritystä. Yritä myöhemmin uudelleen.' },
        429,
        { 'Retry-After': String(status.retryAfter) },
      );
    }
  } catch {
    return json({ ok: false, error: 'Tietokantaa ei ole alustettu. Aja migraatio.' }, 500);
  }

  const parsed = await readJson(request);
  if (parsed.error) return json({ ok: false, error: parsed.error }, 400);
  const password = parsed.data.password;
  if (typeof password !== 'string' || password.length < 1 || password.length > 200) {
    return json({ ok: false, error: 'Tarkista salasana.' }, 400);
  }

  const matches = await passwordsMatch(password, env.ADMIN_PASSWORD);
  if (!matches) {
    await recordLoginFailure(env.DB, ip);
    return json({ ok: false, error: 'Väärä salasana.' }, 401);
  }

  await clearLoginFailures(env.DB, ip);
  const token = await signSession(env.SESSION_SECRET);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token, request) });
}
