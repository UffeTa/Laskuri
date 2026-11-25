import { requireAdmin } from '../../../lib/auth.js';
import { deleteCounter, parseCounterInput, updateCounter } from '../../../lib/counters.js';
import { isSameOrigin, json, readJson } from '../../../lib/http.js';
import { isValidSlug } from '../../../lib/slug.js';

function databaseError() {
  return json({ ok: false, error: 'Tietokantaa ei ole alustettu. Aja migraatio.' }, 500);
}

export async function onRequestPut(context) {
  const auth = await requireAdmin(context);
  if (auth.error) return auth.error;
  if (!isSameOrigin(context.request)) return json({ ok: false, error: 'Pyyntö hylättiin.' }, 403);
  const slug = context.params.slug;
  if (!isValidSlug(slug)) return json({ ok: false, error: 'Laskuria ei löytynyt.' }, 404);
  if (!context.env.DB) return json({ ok: false, error: 'Tietokantaa ei ole kytketty.' }, 500);

  const parsed = await readJson(context.request);
  if (parsed.error) return json({ ok: false, error: parsed.error }, 400);
  const input = parseCounterInput(parsed.data);
  if (input.errors.length) return json({ ok: false, error: input.errors[0] }, 400);

  try {
    const result = await updateCounter(context.env.DB, slug, input.value);
    if (result.error) return json({ ok: false, error: result.error }, result.status || 400);
    return json({ ok: true, counter: result.counter });
  } catch {
    return databaseError();
  }
}

export async function onRequestDelete(context) {
  const auth = await requireAdmin(context);
  if (auth.error) return auth.error;
  if (!isSameOrigin(context.request)) return json({ ok: false, error: 'Pyyntö hylättiin.' }, 403);
  const slug = context.params.slug;
  if (!isValidSlug(slug)) return json({ ok: false, error: 'Laskuria ei löytynyt.' }, 404);
  if (!context.env.DB) return json({ ok: false, error: 'Tietokantaa ei ole kytketty.' }, 500);
  try {
    const removed = await deleteCounter(context.env.DB, slug);
    if (!removed) return json({ ok: false, error: 'Laskuria ei löytynyt.' }, 404);
    return json({ ok: true });
  } catch {
    return databaseError();
  }
}
