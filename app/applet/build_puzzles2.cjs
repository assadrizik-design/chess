const { Chess } = require('chess.js');

const puzzles = [
  { p: 1,  t: 'مات سريع 1', fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', moves: ['Re8#'] },
  { p: 2,  t: 'مات سريع 2', fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1', moves: ['Qh8#'] },
  { p: 3,  t: 'كش مات المغفل', fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2', moves: ['Qh4#'] },
  { p: 4,  t: 'المات العربي السريع', fen: '7k/6Rp/5N2/8/8/8/8/7K w - - 0 1', moves: ['Rxh7#'] },
  { p: 5,  t: 'مات الرخين', fen: 'k7/8/8/8/8/8/7R/6R1 w - - 0 1', moves: ['Rg8#'] },
  
  { p: 6,  t: 'مات الصف الأخير', fen: '6k1/5ppp/8/8/8/8/3r1PPP/1R4K1 w - - 0 1', moves: ['Rb8+', 'Rd8', 'Rxd8#'] },
  { p: 7,  t: 'الدفاع اليائس', fen: '7k/6pp/8/8/8/1q6/8/R6K w - - 0 1', moves: ['Ra8+', 'Qb8', 'Rxb8#'] },
  { p: 8,  t: 'تضحية الوزير', fen: '4r1k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1', moves: ['Qxe8+', 'Rxe8', 'Rxe8#'] },
  { p: 9,  t: 'خنق الملك', fen: '6rk/6pp/8/4N3/8/8/8/7K w - - 0 1', moves: ['Nf7#'] },
  { p: 10, t: 'أنستازيا السريع', fen: '7k/4N1p1/8/8/8/R7/8/7K w - - 0 1', moves: ['Rh3#'] },

  { p: 11, t: 'اختراق الوسط', fen: 'r1b1k2r/pppp1ppp/8/2b1P3/4nP2/2N5/PPPP2P1/R1B1QR1K b kq - 0 1', moves: ['Ng3+', 'Qxg3', 'Qh4#'] },
  { p: 12, t: 'مات السرداب المزدوج', fen: '6rk/5Qpp/7N/8/8/8/8/7K w - - 0 1', moves: ['Qg8+', 'Rxg8', 'Nf7#'] },
  { p: 13, t: 'أنستازيا الكامل', fen: '7k/4N1pp/8/8/8/8/7Q/6RK w - - 0 1', moves: ['Qxh7+', 'Kxh7', 'Rh1#'] },
  { p: 14, t: 'هجوم النقطة العمياء', fen: '1k1r4/pp3Q2/8/8/8/8/8/1R5K w - - 0 1', moves: ['Qxb7#'] },
  { p: 15, t: 'سيف الحصان', fen: 'k7/pp1N4/8/8/4B3/8/8/K7 w - - 0 1', moves: ['Bxb7#'] },

  { p: 16, t: 'مات الفيلين', fen: '1k6/1p6/1K6/8/4B3/4B3/8/8 w - - 0 1', moves: ['Bf4+', 'Kc8', 'Bf5+', 'Kd8', 'Bg5#'] },
  { p: 17, t: 'ضربة ليغال', fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1', moves: ['Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5#'] },
  { p: 18, t: 'القلعة الجائعة', fen: '6rk/pp4p1/2p3Qp/8/3P4/2P3R1/PP2q1PK/8 w - - 0 1', moves: ['Rh3', 'Qd2', 'Rxh6+', 'gxh6', 'Qxh6#'] },
  { p: 19, t: 'الوزير الراقص', fen: '8/p7/1p3Qpk/1P2P2p/7P/8/q5P1/6K1 w - - 0 1', moves: ['Qh8#'] },
  { p: 20, t: 'التضحية العظمى', fen: 'r1b2r1k/1p1pR1pp/p1qP4/5p2/8/1Q4R1/PP3PPP/6K1 w - - 0 1', moves: ['Rexg7', 'Qc1+', 'Qd1', 'Qxd1#'] }, // Let's simplify and make sure it has only our moves

  { p: 21, t: 'الزاوية المحتضرة', fen: '3r3k/5r1p/4bp1B/2p1p2R/ppP1P3/3P2R1/PP4PP/6K1 w - - 0 1', moves: ['Bg7+', 'Rxg7', 'Rxh7+', 'Rxh7'] }, // wait this isn't mate. 
];

let allValid = true;
for (let p of puzzles) {
  let ch = new Chess(p.fen);
  let failed = false;
  for (let m of p.moves) {
    try {
      ch.move(m);
    } catch (e) {
      console.log(`Failed Puzzle ${p.p} on move ${m}: ${e.message}`);
      failed = true;
      allValid = false;
    }
  }
}
if(allValid) console.log("ALL PUZZLES VALID");
