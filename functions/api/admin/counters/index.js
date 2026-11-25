import { requireAdmin } from '../../../lib/auth.js';
import { createCounter, listCounters, parseCounterInput } from '../../../lib/counters.js';
import { isSameOrigin, json, readJson } from '../../../lib/http.js';

function databaseError() {
  return json({ ok: false, error: 'Tietokantaa ei ole alustettu. Aja migraatio.' }, 500);
}

export async function onRequestGet(context) {
  const auth = await requireAdmin(context);
  if (auth.error) return auth.error;
  if (!context.env.DB) return json({ ok: false, error: 'Tietokantaa ei ole kytketty.' }, 500);
  try {
    const counters = await listCounters(context.env.DB);
    return json({ ok: true, counters });
  } catch {
    return databaseError();
  }
}

export async function onRequestPost(context) {
  const auth = await requireAdmin(context);
  if (auth.error) return auth.error;
  if (!isSameOrigin(context.request)) return json({ ok: false, error: 'Pyyntö hylättiin.' }, 403);
  if (!context.env.DB) return json({ ok: false, error: 'Tietokantaa ei ole kytketty.' }, 500);

  const parsed = await readJson(context.request);
  if (parsed.error) return json({ ok: false, error: parsed.error }, 400);
  const input = parseCounterInput(parsed.data);
  if (input.errors.length) return json({ ok: false, error: input.errors[0] }, 400);

  try {
    const result = await createCounter(context.env.DB, input.value);
    if (result.error) return json({ ok: false, error: result.error }, result.status || 400);
    return json({ ok: true, counter: result.counter }, 201);
  } catch {
    return databaseError();
  }
}
