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
];
