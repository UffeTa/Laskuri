# Laskuri

Ahlsell-pihan seikkailuajastin. Pipopäinen hahmo kävelee kohti mustaa BOS-5-autoa, valaistus seuraa katsojan paikallista kellonaikaa, ja viimeisenä päivänä hahmo tanssii. Perillä tulee konfetti ja fanfaari, jos musiikki on päällä. Käyttöliittymän tekstit ovat suomeksi.

Sivu julkaistaan Cloudflare Pagesissa. Vanha GitHub Pages -osoite ei enää palvele tätä rakennetta, koska laskurit ja ylläpito tarvitsevat Pages Functionsin ja D1-tietokannan.

## Rakenne

```
public/                 sivuston juuri (Pagesin build-output)
  index.html            julkinen laskuri ja paikallinen lomake
  admin/index.html      ylläpito
  css/styles.css        valmis tyyli (lähde: css/input.css)
  js/                   sovellus, musiikki, valaistus, jakaminen
  assets/               hahmo, auto ja piha
  dances/               tanssityylit ja rekisteri
functions/              Cloudflare Pages Functions
  api/auth/             kirjautuminen, uloskirjautuminen, istunto
  api/admin/counters/   laskureiden listaus, luonti, muokkaus, poisto
  api/counters/[slug]   julkinen luku
  l/[slug].js           osoite /l/<slug>
migrations/0001_init.sql
wrangler.toml           projekti laskuri, output public, D1-binding DB
css/input.css           Tailwind-lähde ja sarjakuvatyyli
```

Tailwind Play CDN on poistettu. Tyylit käännetään komennolla `npm run build:css` (Tailwind CLI, ei erillistä bundleria). Tone.js 14.8.49 ja Google Fonts latautuvat yhä CDN:stä. Käyttäjän nimiä ja aikoja ei kirjoiteta `innerHTML`:ään; piirrokset tulevat vain `assets/`- ja `dances/`-tiedostoista.

Paikallinen ajastin tallentuu yhä selaimeen avaimella `ahlsell_comic_timer_state_v2`. Jaettu `/l/<slug>`-sivu ei ylikirjoita sitä.

## Julkinen käyttö

1. Etusivulla annat tapahtuman nimen, päivän, kellonajan, tanssityylin ja halutessasi musiikin.
2. **Käynnistä matka**. Hahmo etenee pihalla jäljellä olevan ajan mukaan.
3. Napauta laskuria tai paina **M**, niin näkymä vaihtuu päivien ja pelkkien tuntien välillä.
4. **Koko näyttö** sopii jaettavaksi. Poistuminen jättää jakolinkin parametrit osoitteeseen (vain `view=full` poistuu).
5. **Jaa linkki** käyttää `navigator.clipboard`:ia, sitten `navigator.share`:a, ja viimeisenä `document.execCommand('copy')`.

Viimeisen vuorokauden aikana hahmo tanssii valitulla tyylillä. Jos koko matka on alle vuorokauden, tanssi alkaa kun matkasta on kulunut noin 72 %. Saapuminen tuo konfetin. `prefers-reduced-motion` pysäyttää animaatiot ja konfetin. Laskurin muutokset ja ilmoitukset luetaan `aria-live`-alueelta.

Vanha jakolinkki toimii yhä etusivulla: `?n=<nimi>&s=<aloitus-ms>&t=<maali-ms>&m=d|h&view=full`. Uusi valinnainen parametri on `d=<tanssityyli>`. Ilman sitä tyyli on groovi.

## Tanssityylin lisääminen

Jokainen tyyli on oma moduuli kansiossa `public/dances/`. Rekisteri on `public/dances/registry.js`. Sovellus lataa listan sieltä, ja palvelin hyväksyy vain samat tunnukset.

1. Kopioi `public/dances/groove.js` nimelle `public/dances/<id>.js`.
2. Vaihda `id`, `rootClass` (esimerkiksi `dance-oma`) ja rajaa CSS-valitsimet sen alle, jotta tyylit eivät vuoda toisiinsa.
3. Osoita `svgUrl` uuteen piirrokseen `public/assets/`-kansiossa tai käytä olemassa olevaa SVG:tä.
4. Lisää yksi rivi `public/dances/registry.js`-tiedostoon: `id`, suomenkielinen `name`, `description` ja `module`.

Muuta koodia tai tietokantaa ei tarvitse muuttaa. Ylläpidon pudotusvalikko ja julkinen lomake lukevat rekisterin. Valmiit esimerkit ovat **Groovi** (`groove`) ja **Robotti** (`robot`).

## Ylläpito

Avaa `/admin`. Salasana ei ole koodissa: paikallisesti se on `.dev.vars`-tiedoston `ADMIN_PASSWORD`, tuotannossa Pages-salaisuus samalla nimellä.

Kirjautumisen jälkeen voit:

- listata laskurit
- luoda laskurin (nimi, maali, valinnainen aloitus, musiikki, tanssityyli, laskurin näyttö, valinnainen osoite)
- muokata ja poistaa (poisto kysyy vahvistuksen samasta napista)
- kopioida julkisen osoitteen ja avata sen

Tyhjä osoitekenttä luo polun nimestä (`/l/tyopaiva-pulkassa`). Osoitteen voi vaihtaa, kunhan se on uniikki: 2–48 merkkiä, `a–z`, numerot ja väliviivat. Katsoja avaa `/l/<slug>` ilman kirjautumista. Aloitusajasta ja maalista lasketaan, missä kohtaa pihaa hahmo on. Tyhjä aloitus tarkoittaa luontihetkeä.

Istunto on eväste `laskuri_session`: HttpOnly, SameSite=Lax, allekirjoitettu `SESSION_SECRET`-arvolla (HMAC-SHA-256), voimassa 7 päivää. Tuotannon HTTPS-pyynnössä eväste saa myös Secure-lipun. Paikallinen `wrangler pages dev` on HTTP:tä, joten Secure jätetään pois, jotta kirjautuminen toimii. Kahdeksan väärää salasanaa 15 minuutissa lukitsee saman IP-osoitteen 15 minuutiksi, ja jokainen huti hidastaa vastausta. Uloskirjautuminen tyhjentää evästeen.

## Paikallinen kehitys

```bash
npm install
cp .dev.vars.example .dev.vars
# täytä ADMIN_PASSWORD ja SESSION_SECRET (vähintään 32 merkkiä)
npm run build:css
npm run db:migrate:local
npm run dev
```

- Etusivu: http://127.0.0.1:8788/
- Ylläpito: http://127.0.0.1:8788/admin
- Yksikkötestit: `npm run test:unit`
- Kun dev-palvelin on käynnissä: `node scripts/smoke.mjs`

Aja `npm run build:css` uudelleen, jos lisäät Tailwind-luokkia `public/`-tiedostoihin. Tanssityylin oma CSS elää moduulin sisällä, eikä se vaadi Tailwind-käännöstä.

## Cloudflare Pages

D1-kanta `laskuri` on jo olemassa ja migraatio `0001_init.sql` on ajettu tuotantoon. `wrangler.toml` osoittaa siihen:

- `name = "laskuri"` (sama nimi `wrangler pages deploy` -komennolle)
- `pages_build_output_dir = "public"`
- binding `DB`, `database_name = "laskuri"`, `database_id = "7bd16b1f-8382-4763-a81a-661f7a5d1954"`

Salasanaa ja istuntosalaisuutta ei kirjoiteta repoon eikä `wrangler.toml`-tiedostoon. Uutta kantaa ei luoda uudelleen, eikä `0001_init.sql`:ää ajeta uudelleen.

Jäljellä oleva käyttöönotto:

1. Kirjaudu: `npx wrangler login`
2. Yhdistä repo Cloudflare Pagesiin (Workers & Pages → Create → Pages → Connect to Git):
   - Production branch: `main`
   - Build command: `npm run build:css`
   - Build output directory: `public`
   - Älä aseta `NODE_ENV=production` asennuksen ajaksi: `tailwindcss` on devDependency, ja Pagesin oletusasennus asentaa sen.
   - Root directory: repon juuri
   - `functions/` jätetään juureen. Pages ottaa sen käyttöön automaattisesti, sitä ei kopioida `public/`-kansioon.
3. Varmista projektin Settings → Bindings -kohdassa D1-binding: muuttujan nimi `DB`, tietokanta `laskuri`. Tunnus on sama kuin `wrangler.toml`-tiedostossa.
4. Aseta salaisuudet sen jälkeen, kun Pages-projekti on olemassa. Projektin nimen pitää olla `laskuri`, jotta `wrangler pages deploy` toimii ilman eri nimeä.

```bash
npx wrangler pages secret put ADMIN_PASSWORD --project-name laskuri
npx wrangler pages secret put SESSION_SECRET --project-name laskuri
```

`SESSION_SECRET` on pitkä satunnainen merkkijono. Sen vaihtaminen mitätöi vanhat kirjautumiset. `ADMIN_PASSWORD` on ylläpitosalasana.

5. Julkaise yhdistämällä `main`-haaraan tai komenolla `npx wrangler pages deploy public --project-name laskuri`.
6. Avaa `https://laskuri.pages.dev/admin`, kirjaudu ja luo ensimmäinen laskuri. Julkinen sivu on `https://laskuri.pages.dev/l/<slug>`.

Taulut `counters` ja `login_attempts` ovat jo tuotantokannassa. Uusi migraatiotiedosto ajetaan myöhemmin komennolla `npm run db:migrate:remote`. Paikallinen kanta alustetaan yhä komennolla `npm run db:migrate:local`.
