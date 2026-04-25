const { Chess } = require('chess.js');

const puzzles = [
  // 1-10 Mate in 1
  { fen: '8/8/8/8/8/8/6R1/5K1k w - - 0 1', moves: ['Rg1#'], orientation: 'white', title: 'المستوى 1: المات الأساسي' },
  { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', moves: ['Qxf7#'], orientation: 'white', title: 'المستوى 2: كش مات المبتدئين' },
  { fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2', moves: ['Qh4#'], orientation: 'black', title: 'المستوى 3: كش مات المغفل' },
  { fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', moves: ['Re8#'], orientation: 'white', title: 'المستوى 4: اختراق الصف' },
  { fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1', moves: ['Qh8#'], orientation: 'white', title: 'المستوى 5: الوجه للوجه' },
  { fen: '7k/6Rp/5N2/8/8/8/8/7K w - - 0 1', moves: ['Rxh7#'], orientation: 'white', title: 'المستوى 6: المات العربي السريع' },
  { fen: '6rk/6pp/8/4N3/8/8/8/7K w - - 0 1', moves: ['Nf7#'], orientation: 'white', title: 'المستوى 7: الخنق السريع' },
  { fen: '7k/4N1p1/8/8/8/R7/8/7K w - - 0 1', moves: ['Rh3#'], orientation: 'white', title: 'المستوى 8: أنستازيا السريع' },
  { fen: '3k4/1P6/3K4/8/8/8/8/8 w - - 0 1', moves: ['b8=Q#'], orientation: 'white', title: 'المستوى 9: الترقية المباشرة' },
  { fen: '1k1r4/pp3Q2/8/8/8/8/8/1R5K w - - 0 1', moves: ['Qxb7#'], orientation: 'white', title: 'المستوى 10: قلعة القناص' },

  // 11-20 Mate in 2
  { fen: '4r1k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1', moves: ['Qxe8+', 'Rxe8', 'Rxe8#'], orientation: 'white', title: 'المستوى 11: صف الموت المزدوج' },
  { fen: '6k1/5ppp/8/8/8/8/3r1PPP/1R4K1 w - - 0 1', moves: ['Rb8+', 'Rd8', 'Rxd8#'], orientation: 'white', title: 'المستوى 12: استدراج الرخ' },
  { fen: '7k/6pp/8/8/8/1q6/8/R6K w - - 0 1', moves: ['Ra8+', 'Qb8', 'Rxb8#'], orientation: 'white', title: 'المستوى 13: تضحية الدفاع' },
  { fen: 'r1b1k2r/pppp1ppp/8/2b1P3/4nP2/2N5/PPPP2P1/R1B1QR1K b kq - 0 1', moves: ['Ng3+', 'Qxg3', 'Qh4#'], orientation: 'black', title: 'المستوى 14: انفجار الوسط' },
  { fen: '6rk/5Qpp/7N/8/8/8/8/7K w - - 0 1', moves: ['Qg8+', 'Rxg8', 'Nf7#'], orientation: 'white', title: 'المستوى 15: المات المخنوق الكامل' },
  { fen: '7k/4N1pp/8/8/8/8/7Q/6RK w - - 0 1', moves: ['Qxh7+', 'Kxh7', 'Rh1#'], orientation: 'white', title: 'المستوى 16: أنستازيا الكامل' },
  { fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1', moves: ['Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5#'], orientation: 'white', title: 'المستوى 17: مات ليغال' },
  { fen: '1k6/1p6/1K6/8/4B3/4B3/8/8 w - - 0 1', moves: ['Bf4+', 'Kc8', 'Bf5+', 'Kd8', 'Bg5#'], orientation: 'white', title: 'المستوى 18: الفيلة المدمرة (3 حركات)' },
  { fen: '2r2rk1/1bq1bppp/p2p1n2/np2p3/4P3/P1NB1N1P/1PP2PP1/R1BQR1K1 w - - 0 1', moves: ['Bxb5', 'axb5', 'Nxb5'], orientation: 'white', title: 'المستوى 19: تكتيك استراتيجي' }, // Wait, not mate. 
  { fen: 'r1b2r1k/1p1pR1pp/p1qP4/5p2/8/1Q4R1/PP3PPP/6K1 w - - 0 1', moves: ['Qc3', 'Qxc3', 'Re8+', 'Rxe8'], orientation: 'white', title: 'المستوى 20: دفاع وهجوم' } // Wait, incorrect.
];

// Let me use ONLY guaranteed mates. I will calculate 20-30 to be flawless mates.
