const motif = [0, 7, 12, 15, 12, 7, 3, 0];
const style = {
  id: 'pommitus',
  bpm: 126,
  sections: [
    { name: 'intro', feel: 'race', repeat: 1, motif, chords: ['Am', 'Am', 'F', 'E'] },
    { name: 'A', feel: 'race', repeat: 2, motif, chords: ['Am', 'F', 'C', 'G', 'Am', 'Dm', 'E', 'Am'] },
    { name: 'Avar', feel: 'race', repeat: 2, motif: [12, 7, 3, 0, 3, 7, 10, 12], chords: ['F', 'G', 'Am', 'E', 'Dm', 'F', 'E', 'E'] },
    { name: 'B', feel: 'race', repeat: 2, motif: [0, 3, 7, 12, 7, 3, 0, 7], chords: ['Dm', 'Am', 'Em', 'F', 'C', 'G', 'Am', 'E'] },
    { name: 'bridge', feel: 'night', repeat: 2, motif: [0, -2, 0, 3, 7, 10, 7, 3], chords: ['Em', 'Am', 'Dm', 'E'] },
    { name: 'A2', feel: 'race', repeat: 4, motif, chords: ['Am', 'F', 'G', 'Am', 'Dm', 'E', 'Am', 'Am'] },
    { name: 'outro', feel: 'race', repeat: 1, motif, chords: ['F', 'E', 'Am', 'Am'] },
  ],
};
export default style;
