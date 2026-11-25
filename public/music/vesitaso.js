const motif = [0, 4, 7, 12, 16, 12, 7, 4];
const style = {
  id: 'vesitaso',
  bpm: 104,
  sections: [
    { name: 'intro', feel: 'night', repeat: 2, motif, chords: ['C', 'Am', 'F', 'G'] },
    { name: 'A', feel: 'overworld', repeat: 2, motif, chords: ['C', 'Em', 'Am', 'F', 'C', 'G', 'F', 'C'] },
    { name: 'Avar', feel: 'overworld', repeat: 2, motif: [0, 7, 12, 7, 4, 0, 4, 7], chords: ['F', 'C', 'G', 'Am', 'Dm', 'Em', 'F', 'G'] },
    { name: 'B', feel: 'overworld', repeat: 2, motif: [7, 4, 0, 7, 12, 7, 4, 0], chords: ['Am', 'G', 'F', 'C', 'Dm', 'G', 'C', 'G'] },
    { name: 'bridge', feel: 'night', repeat: 2, motif: [0, 3, 7, 12, 7, 3, 0, -5], chords: ['Em', 'Am', 'Dm', 'G'] },
    { name: 'A2', feel: 'overworld', repeat: 2, motif, chords: ['C', 'Am', 'F', 'G', 'C', 'Em', 'F', 'G'] },
    { name: 'outro', feel: 'overworld', repeat: 1, motif, chords: ['F', 'G', 'C', 'C'] },
  ],
};
export default style;
