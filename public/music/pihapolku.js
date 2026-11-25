const motif = [0, 4, 7, 12, 7, 4, 0, 7];

const style = {
  id: 'pihapolku',
  bpm: 108,
  sections: [
    { name: 'intro', feel: 'night', repeat: 2, motif, chords: ['C', 'G', 'Am', 'F'] },
    { name: 'A', feel: 'overworld', repeat: 2, motif, chords: ['C', 'G', 'Am', 'F', 'F', 'C', 'G', 'C'] },
    { name: 'Avar', feel: 'overworld', repeat: 2, motif: [0, 7, 12, 16, 12, 7, 4, 0], chords: ['C', 'G', 'Am', 'F', 'Dm', 'G', 'C', 'G'] },
    { name: 'B', feel: 'overworld', repeat: 2, motif: [7, 4, 0, -5, 0, 4, 7, 12], chords: ['F', 'G', 'C', 'Am', 'F', 'G', 'Em', 'G'] },
    { name: 'bridge', feel: 'night', repeat: 2, motif: [0, 3, 7, 12, 7, 3, 0, -5], chords: ['Am', 'Em', 'F', 'G'] },
    { name: 'A2', feel: 'overworld', repeat: 2, motif, chords: ['C', 'G', 'Am', 'F', 'F', 'C', 'Dm', 'G'] },
    { name: 'outro', feel: 'overworld', repeat: 1, motif, chords: ['F', 'G', 'C', 'C'] },
  ],
};

export default style;
