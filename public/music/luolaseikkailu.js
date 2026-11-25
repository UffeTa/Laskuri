const motif = [0, 3, 7, 10, 12, 7, 3, 0];
const style = {
  id: 'luolaseikkailu',
  bpm: 92,
  sections: [
    { name: 'intro', feel: 'night', repeat: 2, motif, chords: ['Am', 'Em', 'Dm', 'E'] },
    { name: 'A', feel: 'night', repeat: 2, motif, chords: ['Am', 'F', 'C', 'E', 'Am', 'Dm', 'Em', 'Am'] },
    { name: 'Avar', feel: 'overworld', repeat: 2, motif: [0, 7, 3, 10, 7, 12, 10, 7], chords: ['Dm', 'Am', 'Em', 'F', 'Dm', 'E', 'Am', 'E'] },
    { name: 'B', feel: 'overworld', repeat: 2, motif: [7, 0, 3, 7, 12, 10, 7, 3], chords: ['F', 'G', 'Am', 'Em', 'Dm', 'E', 'Am', 'Am'] },
    { name: 'bridge', feel: 'night', repeat: 2, motif: [0, -2, 0, 3, 7, 3, 0, -5], chords: ['Em', 'Am', 'Dm', 'E'] },
    { name: 'A2', feel: 'night', repeat: 2, motif, chords: ['Am', 'F', 'Dm', 'E', 'Am', 'Em', 'F', 'E'] },
  ],
};
export default style;
