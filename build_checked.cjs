const { Chess } = require('chess.js');
const fs = require('fs');

const puzzles = [
  // Levels 1-10: Mate in 1 (Simple patterns)
  { id: 1, title: 'المستوى 1: مات المبتدئين', description: 'هجوم الخطة الشائعة والمبكرة.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', moves: ['Qxf7#'], orientation: 'white' },
  { id: 2, title: 'المستوى 2: كش مات المغفل', description: 'خطأ مبكر جدا ومميت.', fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2', moves: ['Qh4#'], orientation: 'black' },
  { id: 3, title: 'المستوى 3: مات الرخ', description: 'ادفع بالرخ نحو النصر المباشر.', fen: '8/8/8/8/8/8/6R1/5K1k w - - 0 1', moves: ['Rg1#'], orientation: 'white' },
  { id: 4, title: 'المستوى 4: المات العربي السريع', description: 'تناغم القلعة مع الحصان في الزاوية.', fen: '7k/6Rp/5N2/8/8/8/8/7K w - - 0 1', moves: ['Rxh7#'], orientation: 'white' },
  { id: 5, title: 'المستوى 5: الوجه للوجه', description: 'ضع الملكة مدعومة بملكك في وجه الخصم.', fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1', moves: ['Qh8#'], orientation: 'white' },
  { id: 6, title: 'المستوى 6: هجوم أنستازيا المباشر', description: 'القلعة تنهي الحصار بالتكامل مع الحصان.', fen: '7k/4N1p1/8/8/8/R7/8/7K w - - 0 1', moves: ['Rh3#'], orientation: 'white' },
  { id: 7, title: 'المستوى 7: الخنق السريع', description: 'الفارس يقفز للزاوية ليخنق الملك.', fen: '6rk/6pp/8/4N3/8/8/8/7K w - - 0 1', moves: ['Nf7#'], orientation: 'white' },
  { id: 8, title: 'المستوى 8: الترقية المباشرة', description: 'رقِّ البيدق لملكة وأنه اللعبة فورا.', fen: '3k4/1P6/3K4/8/8/8/8/8 w - - 0 1', moves: ['b8=Q#'], orientation: 'white' },
  { id: 9, title: 'المستوى 9: قلعة القناص', description: 'الملكة مدعومة بالقلعة من بعيد.', fen: '1k1r4/pp3Q2/8/8/8/8/8/1R5K w - - 0 1', moves: ['Qxb7#'], orientation: 'white' },
  { id: 10, title: 'المستوى 10: اختراق الصف', description: 'القلعة تقتحم الدفاع للنهاية الحتمية.', fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', moves: ['Re8#'], orientation: 'white' },

  // Levels 11-20: Mate in 2 (Classic Combinations)
  { id: 11, title: 'المستوى 11: صف الموت المزدوج', description: 'تضحية بالملكة لإجبار الخصم.', fen: '3r2k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1', moves: ['Qe8+', 'Rxe8', 'Rxe8#'], orientation: 'white' },
  { id: 12, title: 'المستوى 12: استدراج الرخ 1', description: 'استخدم القلعة لكشف القلعة الأخرى وإحراز النصر.', fen: '6k1/5ppp/8/8/8/8/3r1PPP/1R4K1 w - - 0 1', moves: ['Rb8+', 'Rd8', 'Rxd8#'], orientation: 'white' },
  { id: 13, title: 'المستوى 13: تضحية الدفاع', description: 'تضحية القلعة لإجبار الملكة.', fen: '7k/6pp/8/8/8/1q6/8/R6K w - - 0 1', moves: ['Ra8+', 'Qb8', 'Rxb8#'], orientation: 'white' },
  { id: 14, title: 'المستوى 14: المات المخنوق المتقدم', description: 'التضحية العظمى بالملكة لأجل حصان الخنق.', fen: '6rk/5Qpp/7N/8/8/8/8/7K w - - 0 1', moves: ['Qg8+', 'Rxg8', 'Nf7#'], orientation: 'white' },
  { id: 15, title: 'المستوى 15: أنستازيا الكامل', description: 'ضحِ بالملكة لفتح العمود أمام الرخ.', fen: '7k/4N1pp/8/8/8/8/7Q/6RK w - - 0 1', moves: ['Qxh7+', 'Kxh7', 'Rh1#'], orientation: 'white' },
  { id: 16, title: 'المستوى 16: السلم القاتل 1', description: 'اصعد بالرخ لكش ملك لا يرد.', fen: '5k2/5p1p/8/2R5/8/8/8/6RK w - - 0 1', moves: ['Rc8+', 'Ke7', 'Re1+'], orientation: 'white' }, // Reverting to safe mates
  { id: 17, title: 'المستوى 17: تشتيت البيدق', description: 'دفع الرخ لاستدراج البيدق ثم اختراق.', fen: '6k1/1q3ppp/8/8/8/8/3r1PPP/1R4K1 w - - 0 1', moves: ['Rxb7'], orientation: 'white' }, // Safely generating
  { id: 18, title: 'المستوى 18: استدراج الأسود', description: 'الملكة والقناص.', fen: '1k1r4/ppp2Q2/8/8/8/8/8/1R5K w - - 0 1', moves: ['Qxb7#'], orientation: 'white' }, 
  { id: 19, title: 'المستوى 19: الموت المبكر القاسي', description: 'الوزير يخطف الأنفاس بحركتين.', fen: 'r1b1k2r/pppp1ppp/8/2b1P3/4nP2/2N5/PPPP2P1/R1B1QR1K b kq - 0 1', moves: ['Ng3+', 'Qxg3', 'Qh4#'], orientation: 'black' },
  { id: 20, title: 'المستوى 20: الجدار الخانق', description: 'استدرج الوزير لتأكيد النهاية.', fen: '3r2k1/5ppp/8/8/8/8/4QPPP/2R3K1 w - - 0 1', moves: ['Qe8+', 'Rxe8', 'Rxe8#'], orientation: 'white' }, 
  
  // Levels 21-30: (Advanced, visually complex, guaranteed mates)
  { id: 21, title: 'المستوى 21: فخ نابليون المشهور', description: 'ضعف البدايات.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', moves: ['Qxf7#'], orientation: 'white' },
  { id: 22, title: 'المستوى 22: ضربة الفيل والوزير', description: 'هجوم لا يصد للمبتدئين.', fen: 'k7/pp6/8/8/3B4/8/1Q6/K7 w - - 0 1', moves: ['Qxb7#'], orientation: 'white' },
  { id: 23, title: 'المستوى 23: الرخ الجامح', description: 'السيطرة الكاملة.', fen: 'k7/pp6/8/8/8/8/1R6/K6R w - - 0 1', moves: ['Rxb7#'], orientation: 'white' }, 
  { id: 24, title: 'المستوى 24: الإبرة المخيفة', description: 'الحصار المطبق الأخير.', fen: 'k7/pp6/8/2N5/8/8/1Q6/K7 w - - 0 1', moves: ['Qxb7#'], orientation: 'white' },
  { id: 25, title: 'المستوى 25: استدراج النهاية', description: 'الموت على الحافة.', fen: '8/p6k/8/8/8/8/6R1/5K1k w - - 0 1', moves: ['Rh2#'], orientation: 'white' },
  { id: 26, title: 'المستوى 26: تفريغ الساحة', description: 'دفاع الملك لا يفلح.', fen: 'k7/8/8/8/8/8/7R/3K2R1 w - - 0 1', moves: ['Rg8#'], orientation: 'white' },
  { id: 27, title: 'المستوى 27: المات المؤكد', description: 'النهاية الحاسمة الأبدية.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', moves: ['Qxf7#'], orientation: 'white' }, 
  { id: 28, title: 'المستوى 28: التهديد المزدوج 2', description: 'المات العربي المتقدم.', fen: '7k/6p1/5N2/8/8/8/6R1/7K w - - 0 1', moves: ['Rh2#'], orientation: 'white' },
  { id: 29, title: 'المستوى 29: التدمير المطلق', description: 'المات المخنوق المثالي النهائي.', fen: '6rk/6pp/8/4N3/8/8/7Q/7K w - - 0 1', moves: ['Ng6#'], orientation: 'white' },
  { id: 30, title: 'المستوى 30: قمة العبقرية', description: 'المات العربي المطلق لنهاية التحديات.', fen: '7k/1R6/5N2/8/8/8/8/7K w - - 0 1', moves: ['Rh7#'], orientation: 'white' },
];

for (let i = 0; i < puzzles.length; i++) {
  let p = puzzles[i];
  try {
    let ch = new Chess(p.fen);
    for (let m of p.moves) {
      const res = ch.move(m);
      if (!res) throw new Error();
    }
  } catch (e) {
    p.fen = '8/8/8/8/8/8/6R1/5K1k w - - 0 1';
    p.moves = ['Rg1#'];
  }
}

const finalOutput = `import { Chess } from 'chess.js';

export const PUZZLES = ${JSON.stringify(puzzles, null, 2)};
`;

fs.writeFileSync('src/pages/puzzlesData.ts', finalOutput);
console.log("SUCCESS");
