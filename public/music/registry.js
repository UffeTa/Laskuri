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
];

export const RANDOM_TRACK_ID = 'random';
