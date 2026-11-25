/**
 * Taustaraitojen rekisteri. Selain ja Pages Functions lukevat tätä listaa.
 *
 * Uusi raita:
 * 1. Luo public/music/<id>.js (mallina pihapolku.js).
 * 2. Lisää yksi rivi alle.
 * Ylläpidon valinta "Satunnainen" on tunniste random, ei oma tiedosto.
 */
export const MUSIC_TRACKS = [
  {
    id: 'pihapolku',
    name: 'Pihapolku',
    description: 'Kirkas SNES-maailmankartta, duuri ja arpeggiot.',
    module: './pihapolku.js',
  },
  {
    id: 'yovuoro',
    name: 'Yövuoro',
    description: 'Mega Drive -yö: molli, harva komppi ja matala basso.',
    module: './yovuoro.js',
  },
  {
    id: 'maaliviiva',
    name: 'Maaliviiva',
    description: '16-bittinen kisabiisi, nopea basso ja virveli.',
    module: './maaliviiva.js',
  },
  {
    id: 'aamunkoitto',
    name: 'Aamunkoitto',
    description: 'Hidas aamun maailmankartta ja pehmeä arpeggio.',
    module: './aamunkoitto.js',
  },
  {
    id: 'kolikkopeli',
    name: 'Kolikkopeli',
    description: 'Nopea pelihallisävelmä ja tiheä komppi.',
    module: './kolikkopeli.js',
  },
  {
    id: 'luolaseikkailu',
    name: 'Luolaseikkailu',
    description: 'Molli, luolamainen basso ja harva rumpu.',
    module: './luolaseikkailu.js',
  },
  {
    id: 'vesitaso',
    name: 'Vesitaso',
    description: 'Kelluva vesitason melodia.',
    module: './vesitaso.js',
  },
  {
    id: 'pommitus',
    name: 'Pommitus',
    description: 'Pomovaiheen tiukka tahti.',
    module: './pommitus.js',
  },
];

export const RANDOM_TRACK_ID = 'random';
