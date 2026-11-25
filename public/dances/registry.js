/**
 * Tanssityylien rekisteri. Tämä on ainoa lista, jota sekä selain että
 * Pages Functions lukevat.
 *
 * Uuden tyylin lisääminen:
 * 1. Luo public/dances/<id>.js (mallina groove.js).
 * 2. Lisää yksi rivi alle. Sovellusta tai tietokantaa ei tarvitse muuttaa.
 */
export const DANCE_STYLES = [
  {
    id: 'groove',
    name: 'Groovi',
    description: 'Klassinen viimeisen päivän groovi.',
    module: './groove.js',
  },
  {
    id: 'robot',
    name: 'Robotti',
    description: 'Kulmikkaat askeleet ja suorat kulmat.',
    module: './robot.js',
  },
  {
    id: 'disco',
    name: 'Disco',
    description: 'Osoittava käsi ja lantiokeinu.',
    module: './disco.js',
  },
  {
    id: 'toprock',
    name: 'Breikki',
    description: 'Sivuttaiset toprock-askeleet.',
    module: './toprock.js',
  },
  {
    id: 'macarena',
    name: 'Macarena',
    description: 'Käsien askelittainen kuvio.',
    module: './macarena.js',
  },
  {
    id: 'twist',
    name: 'Twist',
    description: 'Vartalo kiertyy vastakkain jalkoihin.',
    module: './twist.js',
  },
  {
    id: 'hop',
    name: 'Hyppy',
    description: 'Korkeat hypyt ja pehmeä alastulo.',
    module: './hop.js',
  },
  {
    id: 'moonwalk',
    name: 'Moonwalk',
    description: 'Taaksepäin liukuva askel ja noja.',
    module: './moonwalk.js',
  },
  {
    id: 'floss',
    name: 'Hammaslanka',
    description: 'Kädet heiluvat vastakkain vartalon editse.',
    module: './floss.js',
  },
  {
    id: 'dab',
    name: 'Dab',
    description: 'Pää kainaloon ja toinen käsi suoraksi.',
    module: './dab.js',
  },
  {
    id: 'gangnam',
    name: 'Hevostanssi',
    description: 'Ratsastuspompusta ja lassokäsi.',
    module: './gangnam.js',
  },
  {
    id: 'orange',
    name: 'Appelsiini',
    description: 'Käsien heiluri ja vartalon kallistus.',
    module: './orange.js',
  },
  {
    id: 'renegade',
    name: 'Renegade',
    description: 'Nopea käsiaalto ja lantion nosto.',
    module: './renegade.js',
  },
  {
    id: 'thriller',
    name: 'Zombi',
    description: 'Jäykät käsivarret eteen ja olkapääheilahdus.',
    module: './thriller.js',
  },
  {
    id: 'runningman',
    name: 'Juoksumies',
    description: 'Paikallaan juoksu ja liuku taakse.',
    module: './runningman.js',
  },
  {
    id: 'griddy',
    name: 'Griddy',
    description: 'Nopeat sivutassutukset.',
    module: './griddy.js',
  },
  {
    id: 'wednesday',
    name: 'Wednesday',
    description: 'Jäykät käsien askeleet ja naksahdus.',
    module: './wednesday.js',
  },
  {
    id: 'oletus',
    name: 'Oletustanssi',
    description: 'Vuorokäsi ylös ja pieni hyppy.',
    module: './oletus.js',
  },
];
