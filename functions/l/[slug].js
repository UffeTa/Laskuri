import { html } from '../lib/http.js';
import { isValidSlug } from '../lib/slug.js';

function page(title, message, status) {
  return html(`<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
</head>
<body class="min-h-screen flex items-center justify-center p-6">
  <main class="w-full max-w-lg bg-[#FFF9EC] comic-box rounded-3xl p-8 text-center">
    <h1 class="font-comic text-4xl text-[#141414] mb-3">${title}</h1>
    <p class="font-semibold text-slate-700 mb-6">${message}</p>
    <a class="comic-btn inline-block bg-[#FFD166] text-[#141414] font-bold px-4 py-2 rounded-xl" href="/">Etusivulle</a>
  </main>
</body>
</html>`, status);
}

export async function onRequestGet(context) {
  const slug = context.params.slug;
  if (!isValidSlug(slug)) {
    return page('Laskuria ei löytynyt', 'Tarkista osoite tai pyydä uusi linkki.', 404);
  }
  if (!context.env.DB) {
    return page('Laskuri ei ole käytettävissä', 'Tietokantaa ei ole vielä kytketty.', 500);
  }
  try {
    const row = await context.env.DB.prepare(
      'SELECT slug FROM counters WHERE slug = ?',
    ).bind(slug).first();
    if (!row) {
      return page('Laskuria ei löytynyt', 'Tarkista osoite tai pyydä uusi linkki.', 404);
    }
  } catch {
    return page('Laskuri ei ole käytettävissä', 'Tietokantaa ei ole alustettu. Aja migraatio.', 500);
  }

  const assetUrl = new URL('/index.html', context.request.url);
  const asset = await context.env.ASSETS.fetch(new Request(assetUrl.toString(), { method: 'GET' }));
  const headers = new Headers(asset.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'no-store');
  return new Response(asset.body, { status: asset.status, headers });
}
