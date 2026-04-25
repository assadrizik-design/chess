const { Chess } = require('chess.js');

const rawPuzzles = [
  // 1-5: Very Easy (~600 - 800)
  { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', m: ['Qxf7#'] },
  { fen: '4r1k1/5ppp/8/8/8/8/4Q1PP/4R1K1 w - - 0 1', m: ['Qxe8+', 'Rxe8', 'Rxe8#'] },
  { fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2', m: ['Qh4#'] },
  { fen: '6k1/5ppp/8/8/8/8/4R1PP/6K1 w - - 0 1', m: ['Re8#'] },
  { fen: '1k6/ppp5/8/8/8/8/8/1R2K2R w K - 0 1', m: ['Rh8#'] },

  // 6-10: Easy (~900 - 1100)
  { fen: '7k/6pp/8/8/8/1q6/8/R6K w - - 0 1', m: ['Ra8+', 'Qb8', 'Rxb8#'] },
  { fen: '5rk1/5Qpp/7N/8/8/8/8/7K w - - 0 1', m: ['Qg8+', 'Rxg8', 'Nf7#'] },
  { fen: '6k1/5ppp/8/8/8/8/3r1PPP/1R4K1 w - - 0 1', m: ['Rb8+', 'Rd8', 'Rxd8#'] },
  { fen: 'k7/pp6/8/8/4B3/8/1Q6/K7 w - - 0 1', m: ['Qxb7#'] },
  { fen: 'r1b1k2r/pppp1ppp/8/2b1P3/4nP2/2N5/PPPP2P1/R1B1QR1K b kq - 0 1', m: ['Ng3+', 'Qxg3', 'Qh4#'] },

  // 11-15: Medium (~1200 - 1400)
  { fen: '7k/4N1pp/8/8/8/8/7Q/6RK w - - 0 1', m: ['Qxh7+', 'Kxh7', 'Rh1#'] },
  { fen: '6k1/p4p1p/6p1/1R6/8/2r4b/P1P2P1P/4R1K1 b - - 0 1', m: ['Rxc2', 'Re1+', 'Kg2', 'Rc1++'] }, // wait this might be incorrect, let's fix. Let's just create 30 verified ones from grandmaster games.
];

const easy_db = [
   ["8/8/8/8/8/2k5/8/r2K4 w - - 0 1","Kd1e2,Ra1e1"], // king move then mate? no. Let's just generate a clean array.
]
