const motif = [0, 7, 4, 12, 7, 4, 0, -5];
const style = {
  id: 'aamunkoitto',
  bpm: 100,
  sections: [
    { name: 'intro', feel: 'night', repeat: 2, motif, chords: ['C', 'Am', 'F', 'G'] },
    { name: 'A', feel: 'overworld', repeat: 2, motif, chords: ['C', 'G', 'Am', 'F', 'C', 'F', 'G', 'C'] },
    { name: 'Avar', feel: 'overworld', repeat: 2, motif: [0, 4, 7, 12, 16, 12, 7, 4], chords: ['F', 'C', 'G', 'Am', 'Dm', 'G', 'C', 'G'] },
    { name: 'B', feel: 'overworld', repeat: 2, motif: [7, 12, 7, 4, 0, 4, 7, 12], chords: ['Am', 'F', 'C', 'G', 'F', 'Em', 'Am', 'G'] },
    { name: 'bridge', feel: 'night', repeat: 2, motif: [0, 3, 7, 0, 7, 3, 0, -5], chords: ['Dm', 'Am', 'Em', 'G'] },
    { name: 'A2', feel: 'overworld', repeat: 2, motif, chords: ['C', 'G', 'Am', 'F'] },
    { name: 'outro', feel: 'overworld', repeat: 1, motif, chords: ['F', 'G', 'C', 'C'] },
  ],
};
export default style;
