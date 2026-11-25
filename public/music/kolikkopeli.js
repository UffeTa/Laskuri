const motif = [0, 12, 7, 4, 12, 16, 12, 7];
const style = {
  id: 'kolikkopeli',
  bpm: 140,
  sections: [
    { name: 'intro', feel: 'race', repeat: 1, motif, chords: ['C', 'C', 'F', 'G'] },
    { name: 'A', feel: 'race', repeat: 6, motif, chords: ['C', 'F', 'G', 'C', 'Am', 'F', 'G', 'C'] },
    { name: 'Avar', feel: 'race', repeat: 2, motif: [12, 7, 0, 4, 7, 12, 16, 12], chords: ['F', 'G', 'C', 'Am', 'Dm', 'G', 'C', 'G'] },
    { name: 'B', feel: 'race', repeat: 2, motif: [0, 4, 7, 12, 7, 4, 0, 7], chords: ['Am', 'F', 'C', 'G'] },
    { name: 'bridge', feel: 'overworld', repeat: 2, motif: [0, 7, 12, 7, 4, 0, -5, 0], chords: ['Dm', 'G', 'Em', 'Am'] },
    { name: 'A2', feel: 'race', repeat: 5, motif, chords: ['C', 'F', 'G', 'C'] },
    { name: 'outro', feel: 'race', repeat: 1, motif, chords: ['F', 'G', 'C', 'C'] },
  ],
};
export default style;
