# Laskuri

Ahlsell-pihan seikkailuajastin. Pipopäinen hahmo kävelee kohti mustaa BOS-5-autoa, valaistus seuraa katsojan paikallista kellonaikaa automaattisesti, ja viimeisenä päivänä hahmo tanssii. Laskurin isot numerot käyttävät itseisännöityä Intel One Mono -fonttia (`public/assets/fonts/`), jotta numerot 0–9 erottuvat toisistaan. Perillä tulee konfetti ja fanfaari, jos musiikki on päällä. Käyttöliittymän tekstit ovat suomeksi.

Sivu julkaistaan Cloudflare Pages -projektissa `laskuri`. Osoite on `https://laskuri-89s.pages.dev`, koska `laskuri.pages.dev` oli varattu. Tuotantoa ei ole vielä julkaistu: se päivittyy vasta, kun `main` yhdistetään. Esikatselu on osoitteessa `https://preview.laskuri-89s.pages.dev`. Vanha GitHub Pages -osoite ei enää palvele tätä rakennetta, koska laskurit ja ylläpito tarvitsevat Pages Functionsin ja D1-tietokannan.

## Rakenne

```
public/                 sivuston juuri (Pagesin build-output)
  index.html            julkinen laskuri ja paikallinen lomake
  admin/index.html      ylläpito
  css/styles.css        valmis tyyli (lähde: css/input.css)
  js/                   sovellus, musiikki, valaistus, jakaminen
  assets/               hahmo, auto, piha ja laskurifontti
  dances/               tanssityylit ja rekisteri
  music/                taustaraidat ja rekisteri
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
2. **Käynnistä matka** avaa laskurin. Hahmo ja musiikki odottavat vielä aloitusnappia.
3. Laskurinäkymässä iso aloitusnappi näyttää tapahtuman nimen. Hahmo ja taustamusiikki pysyvät paikallaan, kunnes nappia painetaan. Painallus myös avaa selaimen äänen. Sen jälkeen nappi katoaa.
4. Napauta laskuria tai paina **M**, niin näkymä vaihtuu päivien ja pelkkien tuntien välillä. **Mykistä** muistaa valinnan tässä selaimessa. **Seuraava** vaihtaa taustaraitaa.
5. **Koko näyttö** sopii jaettavaksi. Poistuminen jättää jakolinkin parametrit osoitteeseen (vain `view=full` poistuu).
6. **Jaa linkki** käyttää `navigator.clipboard`:ia, sitten `navigator.share`:a, ja viimeisenä `document.execCommand('copy')`.

Viimeisen vuorokauden aikana hahmo tanssii valitulla tyylillä. Jos koko matka on alle vuorokauden, tanssi alkaa kun matkasta on kulunut noin 72 %. Saapuminen tuo konfetin. `prefers-reduced-motion` pysäyttää animaatiot ja konfetin. Laskurin muutokset ja ilmoitukset luetaan `aria-live`-alueelta.

Vanha jakolinkki toimii yhä etusivulla: `?n=<nimi>&s=<aloitus-ms>&t=<maali-ms>&m=d|h&view=full`. Valinnainen `d` on tanssityyli (oletus groovi) ja valinnainen `k` on taustaraita (`random` tai raidan tunnus).

## Tanssityylin lisääminen

Jokainen tyyli on oma moduuli kansiossa `public/dances/`. Rekisteri on `public/dances/registry.js`. Sovellus lataa listan sieltä, ja palvelin hyväksyy vain samat tunnukset.

1. Kopioi `public/dances/groove.js` nimelle `public/dances/<id>.js`.
2. Vaihda `id`, `rootClass` (esimerkiksi `dance-oma`) ja rajaa CSS-valitsimet sen alle, jotta tyylit eivät vuoda toisiinsa.
3. Osoita `svgUrl` uuteen piirrokseen `public/assets/`-kansiossa tai käytä olemassa olevaa SVG:tä.
4. Lisää yksi rivi `public/dances/registry.js`-tiedostoon: `id`, suomenkielinen `name`, `description` ja `module`.

Muuta koodia tai tietokantaa ei tarvitse muuttaa. Ylläpidon pudotusvalikko, julkinen lomake ja parametri `d` lukevat rekisterin.

Valmiit tyylit: Groovi, Robotti, Disco, Breikki, Macarena, Twist, Hyppy, Moonwalk, Hammaslanka (`floss`), Dab, Hevostanssi (`gangnam`), Appelsiini (`orange`), Renegade, Zombi (`thriller`), Juoksumies (`runningman`), Griddy, Wednesday ja Oletustanssi (`oletus`). Ne ovat alkuperäisiä liikkeitä, eivät lainattuja kuvia tai koreografioita.

Jokaisella latauksella ja päivityksellä tanssi ja taustaraita arvotaan uudelleen, eri valinta kuin edellisellä kerralla. Viimeisin arvonta on vain estämässä samaa peräkkäin: avaimet ovat `ahlsell_last_dance_<osoite>` ja `ahlsell_last_track_<osoite>`. Arvottu tanssi näkyy heti hahmon liikkeessä, ei vasta viimeisenä päivänä. Maalissa hahmo vilkuttaa. Tallennettu tyyli, myös vanha oletus `groove`, ei lukitse mitään. Lukitus syntyy vain, kun ylläpito valitsee tietyn tyylin tai raidan (`dance_locked` / `music_locked`, migraatio `0004_choice_locks.sql`). Ylläpitonäkymä listaa tunnukset muodossa `floss — Hammaslanka`. Jakolinkki ei lisää parametria `d` eikä `k`, ellei valinta ole lukittu. Jos ne ovat osoitteessa, päivitys pitää sekä tanssin että raidan. Ilman niitä jokainen lataus arpoo uudelleen. Skriptit eivät jää välimuistiin (`public/_headers`).

Kävelyanimaatio näkyy matkan aikana ja tanssi viimeisenä päivänä. Uuden tyylin CSS kannattaa animoida vain `transform`- ja `opacity`-ominaisuuksia, jotta puhelin pysyy kevyenä. Halutessasi voit laittaa moduuliin `walkClass`-luokan, joka vaihtaa kävelysyklin.

## Taustamusiikki

Raidat ovat Tone.js-määrittelyjä kansiossa `public/music/`. Rekisteri on `public/music/registry.js`. Jokainen raita on noin kolme minuuttia: intro, A- ja B-jaksot, silta ja kertaus, ja se kiertää puhtaasti alkuun. Musiikki on hiljaisemmalla väylällä kuin maalifanfaari.

1. Kopioi `public/music/pihapolku.js` nimelle `public/music/<id>.js`.
2. Vaihda `bpm`, sointukulku (`chords`) ja motiivi. `public/music/sequence.js` rakentaa basson, arpeggion, rummut ja variaatiot.
3. Lisää yksi rivi `public/music/registry.js`-tiedostoon.

Ylläpito valitsee laskurille raidan tai arvon **Satunnainen** (`random`). Valinta tallentuu sarakkeeseen `music_track`. Kuulija voi mykistää äänen tai vaihtaa seuraavaan raitaan. Mykistys muistetaan selaimen `localStorage`-avaimessa `ahlsell_comic_music_muted`.

Valmiit raidat, kukin noin kolme minuuttia: **Pihapolku**, **Yövuoro**, **Maaliviiva**, **Aamunkoitto**, **Kolikkopeli**, **Luolaseikkailu**, **Vesitaso** ja **Pommitus**.

Ennen tuotantojulkaisua aja migraatiot `migrations/0002_music_track.sql` ja `migrations/0003_random_defaults.sql`. Ensimmäinen lisää sarakkeen `music_track`. Jälkimmäinen vaihtaa vanhan oletustanssin `groove` arvontaan. Erikseen valittu tyyli tai raita säilyy, kunnes ylläpito vaihtaa sen satunnaiseksi. Paikallisesti: `npm run db:migrate:local`. Tuotantoon: `npm run db:migrate:remote`.

## Ylläpito

Avaa `/admin`. Salasana ei ole koodissa: paikallisesti se on `.dev.vars`-tiedoston `ADMIN_PASSWORD`, tuotannossa Pages-salaisuus samalla nimellä.

Kirjautumisen jälkeen voit:

- listata laskurit
- luoda laskurin (nimi, maali, valinnainen aloitus, musiikki, taustaraita tai satunnainen, tanssityyli, laskurin näyttö, valinnainen osoite)
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

Pages-projektin nimi on `laskuri`. Julkinen alidomain on `laskuri-89s`, koska `laskuri.pages.dev` oli jo varattu. `wrangler pages deploy` käyttää projektin nimeä, ei alidomainia:

```bash
npx wrangler pages deploy public --project-name laskuri
npx wrangler pages deploy public --project-name laskuri --branch preview
```

`wrangler.toml` sisältää `name = "laskuri"` ja `pages_build_output_dir = "public"`.

| Ympäristö | Osoite | Tila |
| --- | --- | --- |
| Tuotanto | https://laskuri-89s.pages.dev | Ei vielä julkaistu. Päivittyy, kun `main` yhdistetään. |
| Esikatselu | https://preview.laskuri-89s.pages.dev | Julkaistu haaraan `preview` komennolla yllä. |

Ylläpito on `/admin` ja yksittäinen laskuri `/l/<slug>` saman osoitteen perässä. Esimerkiksi esikatselun ylläpito on https://preview.laskuri-89s.pages.dev/admin.

D1-kanta `laskuri` on olemassa ja migraatio `0001_init.sql` on ajettu. Bindingin nimi on `DB`, `database_id` on `7bd16b1f-8382-4763-a81a-661f7a5d1954`. Taulut `counters` ja `login_attempts` ovat kannassa. Uutta kantaa ei luoda eikä `0001`:tä ajeta uudelleen. Taustaraidan sarake tulee migraatiosta `0002_music_track.sql`. Lukitusliput tulevat migraatiosta `0004_choice_locks.sql` (oletus 0, eli vanhat laskurit arvotaan, vaikka `0003` ei olisi ehtinyt muuttaa rivejä). Aja puuttuvat migraatiot komennolla `npm run db:migrate:remote`. Paikallinen kanta päivitetään komennolla `npm run db:migrate:local`. Kohdeauto on piirretty Elroq-, Enyaq- ja Peaq-suunnan sähkömaasturina: pysty kori, kaksivärinen katto, suljettu keula, kapea valonauha ja tekstimuotoinen SKODA-sanamerkki. Kilpi on yhä BOS-5. Virallista logotiedostoa ei käytetä.

Salaisuudet `ADMIN_PASSWORD` ja `SESSION_SECRET` on asetettu sekä tuotantoon että esikatseluun. Niitä ei ole repossa eikä `wrangler.toml`-tiedostossa. Uudelleenasetus:

```bash
npx wrangler pages secret put ADMIN_PASSWORD --project-name laskuri
npx wrangler pages secret put SESSION_SECRET --project-name laskuri
npx wrangler pages secret put ADMIN_PASSWORD --project-name laskuri --env preview
npx wrangler pages secret put SESSION_SECRET --project-name laskuri --env preview
```

Arvon `SESSION_SECRET` vaihtaminen mitätöi kyseisen ympäristön vanhat kirjautumiset.

GitHubia ei ole vielä kytketty Pages-projektiin, joten push ei julkaise itseään. Automaattinen julkaisu kytketään Cloudflare-hallinnassa (Workers & Pages → `laskuri` → yhdistä Git). Asetukset silloin:

- Production branch: `main`
- Build command: `npm run build:css`
- Build output directory: `public`
- Root directory: repon juuri
- Älä aseta `NODE_ENV=production` asennuksen ajaksi: `tailwindcss` on devDependency
- `functions/` jää juureen. Pages ottaa sen käyttöön automaattisesti

Ilman Git-kytkentää `main`-yhdistys ei vielä julkaise mitään. Tuotanto-osoite https://laskuri-89s.pages.dev päivittyy, kun `main` on yhdistetty ja se on julkaistu: joko automaattisesti Git-kytkennän jälkeen tai komennolla `npx wrangler pages deploy public --project-name laskuri`. Esikatselu julkaistaan erikseen komennolla `--branch preview`. D1-bindingin nimi hallinnassa on `DB` ja tietokanta `laskuri`.
