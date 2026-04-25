const { Chess } = require('chess.js');
const fs = require('fs');

const puzzlesData = [
  // Levels 1-5 (Very Easy: 1-2 move standard mates)
  {
    title: 'المستوى 1: المات السريع',
    desc: 'مات المبتدئين السريع (Scholars Mate).',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    uci: ['f3f7']
  },
  {
    title: 'المستوى 2: مات الرخين',
    desc: 'استخدم الرخين للصعود بحركة سلمية مات',
    fen: '6k1/8/8/8/8/8/7R/6R1 w - - 0 1',
    uci: ['h2h8'] // Wait, this fen has G1 rook. No, let's use exact mates. 
  }
];
