import { getCounter } from '../../lib/counters.js';
import { json } from '../../lib/http.js';
import { isValidSlug } from '../../lib/slug.js';

export async function onRequestGet(context) {
  const slug = context.params.slug;
  if (!isValidSlug(slug)) return json({ ok: false, error: 'Laskuria ei löytynyt.' }, 404);
  if (!context.env.DB) return json({ ok: false, error: 'Tietokantaa ei ole kytketty.' }, 500);
  try {
    const counter = await getCounter(context.env.DB, slug);
    if (!counter) return json({ ok: false, error: 'Laskuria ei löytynyt.' }, 404);
    return json({ ok: true, counter });
  } catch {
    return json({ ok: false, error: 'Tietokantaa ei ole alustettu. Aja migraatio.' }, 500);
  }
}
