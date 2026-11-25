const motif = [0, 4, 7, 12, 16, 12, 7, 4];

const style = {
  id: 'maaliviiva',
  bpm: 132,
  sections: [
    { name: 'intro', feel: 'race', repeat: 1, motif, chords: ['C', 'C', 'G', 'G'] },
    { name: 'A', feel: 'race', repeat: 3, motif, chords: ['C', 'F', 'G', 'C', 'Am', 'F', 'G', 'C'] },
    { name: 'Avar', feel: 'race', repeat: 3, motif: [12, 7, 4, 0, 4, 7, 12, 16], chords: ['F', 'G', 'C', 'Am', 'F', 'G', 'Em', 'G'] },
    { name: 'B', feel: 'race', repeat: 2, motif: [0, 7, 12, 7, 4, 0, 4, 7], chords: ['Am', 'F', 'C', 'G', 'Dm', 'F', 'G', 'G'] },
    { name: 'bridge', feel: 'overworld', repeat: 2, motif: [0, 4, 0, -5, 0, 4, 7, 12], chords: ['Dm', 'G', 'C', 'Am'] },
    { name: 'A2', feel: 'race', repeat: 4, motif, chords: ['C', 'F', 'G', 'C'] },
    { name: 'outro', feel: 'race', repeat: 1, motif, chords: ['F', 'G', 'C', 'C'] },
  ],
};

export default style;
