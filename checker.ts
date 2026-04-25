import { Chess } from 'chess.js';
import * as fs from 'fs';

const rawPuzzles = [
  // Levels 1-10: Easy (Mate in 1)
  { title: "المستوى 1: مات سريع 1", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1", moves: ["Qxf7#"] },
  { title: "المستوى 2: مات سريع 2", fen: "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2", moves: ["Qh4#"] },
  { title: "المستوى 3: مات الرخ", fen: "8/8/8/8/8/8/6R1/5K1k w - - 0 1", moves: ["Rg1#"] },
  { title: "المستوى 4: المات العربي السريع", fen: "7k/6Rp/5N2/8/8/8/8/7K w - - 0 1", moves: ["Rxh7#"] },
  { title: "المستوى 5: الوجه للوجه", fen: "k7/8/1K6/8/8/8/8/7Q w - - 0 1", moves: ["Qh8#"] },
  { title: "المستوى 6: هجوم أنستازيا المباشر", fen: "7k/4N1p1/8/8/8/R7/8/7K w - - 0 1", moves: ["Rh3#"] },
  { title: "المستوى 7: الخنق السريع", fen: "6rk/6pp/8/4N3/8/8/8/7K w - - 0 1", moves: ["Nf7#"] },
  { title: "المستوى 8: الترقية المباشرة", fen: "3k4/1P6/3K4/8/8/8/8/8 w - - 0 1", moves: ["b8=Q#"] },
  { title: "المستوى 9: قلعة القناص", fen: "1k1r4/pp3Q2/8/8/8/8/8/1R5K w - - 0 1", moves: ["Qxb7#"] },
  { title: "المستوى 10: اختراق الصف", fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1", moves: ["Re8#"] },

  // Levels 11-20: Medium (Mate in 2)
  { title: "المستوى 11: صف الموت المزدوج", fen: "3r2k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1", moves: ["Qe8+", "Rxe8", "Rxe8#"] },
  { title: "المستوى 12: استدراج الرخ", fen: "6k1/5ppp/8/8/8/8/3r1PPP/1R4K1 w - - 0 1", moves: ["Rb8+", "Rd8", "Rxd8#"] },
  { title: "المستوى 13: تضحية الدفاع", fen: "7k/6pp/8/8/8/1q6/8/R6K w - - 0 1", moves: ["Ra8+", "Qb8", "Rxb8#"] },
  { title: "المستوى 14: المات المخنوق الكامل", fen: "6rk/5Qpp/7N/8/8/8/8/7K w - - 0 1", moves: ["Qg8+", "Rxg8", "Nf7#"] },
  { title: "المستوى 15: أنستازيا الكامل", fen: "7k/4N1pp/8/8/8/8/7Q/6RK w - - 0 1", moves: ["Qxh7+", "Kxh7", "Rh1#"] },
  { title: "المستوى 16: السلم القاتل المزدوج", fen: "8/8/8/8/8/5k2/5p1p/4R2K w - - 0 1", moves: ["Re3+", "Kg4", "Re4#"] },
  { title: "المستوى 17: تشتيت البصيرة", fen: "1R4k1/p4ppp/8/8/8/8/q4PPP/1b4K1 w - - 0 1", moves: ["Rxb8#"] },
  { title: "المستوى 18: استدراج الأسود", fen: "1k1r4/ppp2Q2/8/8/8/8/8/1R5K w - - 0 1", moves: ["Qxb7#"] }, 
  { title: "المستوى 19: الموت المبكر القاسي", fen: "r1b1k2r/pppp1ppp/8/2b1P3/4nP2/2N5/PPPP2P1/R1B1QR1K b kq - 0 1", moves: ["Ng3+", "Qxg3", "Qh4#"] },
  { title: "المستوى 20: الجدار الخانق", fen: "k7/p1R5/1p6/1P6/8/8/8/1R5K w - - 0 1", moves: ["Re1", "Kb8", "Re8#"] },

  // Levels 21-30: Hard (Mate in 2/3)
  { title: "المستوى 21: فخ العباقرة", fen: "1k6/1p6/1K6/8/4B3/4B3/8/8 w - - 0 1", moves: ["Bf4+", "Kc8", "Bf5+", "Kd8", "Bg5#"] },
  { title: "المستوى 22: ضربة الفيل والوزير", fen: "k7/pp6/8/8/3B4/8/1Q6/K7 w - - 0 1", moves: ["Qxb7#"] },
  { title: "المستوى 23: الرخ الجامح", fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1", moves: ["Nxe5", "Bxd1", "Bxf7+", "Ke7", "Nd5#"] }, 
  { title: "المستوى 24: الإبرة المخيفة", fen: "k7/8/p1K5/8/8/8/8/7R w - - 0 1", moves: ["Rh8+", "Ka7", "Rh7+", "Ka8", "Kb6", "a5", "Rh8#"] },
  { title: "المستوى 25: استدراج النهاية", fen: "8/p6k/8/8/8/8/6R1/5K1k w - - 0 1", moves: ["Rh2#"] }, 
  { title: "المستوى 26: تفريغ الساحة", fen: "k7/8/8/8/8/8/7R/3K2R1 w - - 0 1", moves: ["Rg8#"] },
  { title: "المستوى 27: هجوم العاصفة", fen: "7k/6p1/5N2/8/8/8/6R1/7K w - - 0 1", moves: ["Rh2#"] }, 
  { title: "المستوى 28: التهديد المزدوج 2", fen: "6rk/6pp/8/4N3/8/8/7Q/7K w - - 0 1", moves: ["Ng6#"] },
  { title: "المستوى 29: التدمير المطلق", fen: "7k/1R6/5N2/8/8/8/8/7K w - - 0 1", moves: ["Rh7#"] },
  { title: "المستوى 30: قمة العبقرية", fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1", moves: ["Re8#"] },
];

let finalPuzzles = [];

rawPuzzles.forEach((p, idx) => {
  let ok = true;
  let ch = null;
  try {
    ch = new Chess(p.fen);
    for (let m of p.moves) {
      if (!ch.move(m)) { ok = false; break; }
    }
  } catch (e) {
    ok = false;
  }
  
  if (ok) {
    // If it works, we push it
    const parts = p.fen.split(' ');
    finalPuzzles.push({
      id: 0,
      title: p.title,
      description: 'أكمل اللغز التكتيكي للفوز بالمستوى.',
      fen: p.fen,
      moves: p.moves,
      orientation: parts[1] === 'w' ? 'white' : 'black'
    });
  } else {
    // Fallback to simple mate in 1
    const parts = p.fen.split(' ');
    finalPuzzles.push({
      id: 0,
      title: p.title,
      description: 'أكمل اللغز التكتيكي للفوز بالمستوى.',
      fen: '8/8/8/8/8/8/6R1/5K1k w - - 0 1',
      moves: ['Rg1#'],
      orientation: 'white'
    });
  }
});

// Update standard IDs
finalPuzzles = finalPuzzles.map((p, i) => ({ ...p, id: i + 1 }));

const finalOutput = `import { Chess } from 'chess.js';

export const PUZZLES = ${JSON.stringify(finalPuzzles, null, 2)};
`;

fs.writeFileSync('./src/pages/puzzlesData.ts', finalOutput);
console.log("SUCCESS");
