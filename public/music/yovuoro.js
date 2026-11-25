const motif = [0, 3, 7, 10, 7, 3, 0, -2];

const style = {
  id: 'yovuoro',
  bpm: 96,
  sections: [
    { name: 'intro', feel: 'night', repeat: 2, motif, chords: ['Am', 'Em', 'F', 'Em'] },
    { name: 'A', feel: 'night', repeat: 2, motif, chords: ['Am', 'F', 'C', 'G', 'Am', 'Em', 'F', 'E'] },
    { name: 'Avar', feel: 'overworld', repeat: 2, motif: [0, 7, 3, 10, 12, 7, 3, 0], chords: ['Am', 'Dm', 'Am', 'E', 'F', 'C', 'Dm', 'E'] },
    { name: 'B', feel: 'overworld', repeat: 2, motif: [7, 3, 0, 10, 7, 12, 10, 7], chords: ['F', 'G', 'Am', 'Em', 'Dm', 'E', 'Am', 'E'] },
    { name: 'bridge', feel: 'night', repeat: 2, motif: [0, -2, 0, 3, 7, 3, 0, -5], chords: ['Dm', 'Am', 'Em', 'E'] },
    { name: 'A2', feel: 'night', repeat: 2, motif, chords: ['Am', 'F', 'C', 'G', 'Dm', 'Am', 'E', 'Am'] },
  ],
};

export default style;
