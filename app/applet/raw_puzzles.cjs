const { Chess } = require('chess.js');

const raw = [
  // 1 to 5
  { fen: '8/8/8/8/8/8/5q2/3K1k2 b - - 0 1', moves: ['Qe2#'] },
  { fen: '8/8/8/8/8/8/6R1/5K1k w - - 0 1', moves: ['Rg1#'] },
  { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', moves: ['Qxf7#'] },
  { fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2', moves: ['Qh4#'] },
  { fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1', moves: ['Qh8#'] },

  // 6 to 10
  { fen: '4r1k1/5ppp/8/8/8/8/4Q1PP/4R1K1 w - - 0 1', moves: ['Qxe8+', 'Rxe8', 'Rxe8#'] },
  { fen: '6k1/5ppp/8/8/8/8/3r1PPP/1R4K1 w - - 0 1', moves: ['Rb8+', 'Rd8', 'Rxd8#'] },
  { fen: '7k/6pp/8/8/8/1q6/8/R6K w - - 0 1', moves: ['Ra8+', 'Qb8', 'Rxb8#'] },
  { fen: 'k7/pp6/8/8/4B3/8/1Q6/K7 w - - 0 1', moves: ['Qxb7#'] },
  { fen: '8/8/8/8/8/6k1/7p/4R2K w - - 0 1', moves: ['Re3+', 'Kf4', 'Re4+', 'Kxe4', 'Kxh2'] }, // No, too long. Need mates.

  // 11 to 15
  { fen: '6rk/6pp/8/4N3/8/8/8/7K w - - 0 1', moves: ['Nf7#'] },
  { fen: '7k/4N1p1/8/8/8/R7/8/7K w - - 0 1', moves: ['Rh3#'] },
  { fen: 'r1b1k2r/pppp1ppp/8/2b1P3/4nP2/2N5/PPPP2P1/R1B1QR1K b kq - 0 1', moves: ['Ng3+', 'Qxg3', 'Qh4#'] },
  { fen: '7k/6Rp/5N2/8/8/8/8/7K w - - 0 1', moves: ['Rxh7#'] },
  { fen: '3k4/1P6/3K4/8/8/8/8/8 w - - 0 1', moves: ['b8=Q#'] },

  // Let me replace the entire 30 list with guaranteed mates.
];
