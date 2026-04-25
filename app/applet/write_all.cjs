import { Chess } from 'chess.js';

const puzzles = [
  // Levels 1-10: Mate in 1
  {
    id: 1,
    title: 'المستوى 1: المات الأساسي',
    description: 'أنهِ المباراة في خطوة واحدة بسيطة بفضل تقدم قلعتك.',
    fen: '8/8/8/8/8/8/6R1/5K1k w - - 0 1',
    moves: ['Rg1#'],
    orientation: 'white'
  },
  {
    id: 2,
    title: 'المستوى 2: كش مات المبتدئين',
    description: 'الهجوم السريع على النقطة الضعيفة f7.',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    moves: ['Qxf7#'],
    orientation: 'white'
  },
  {
    id: 3,
    title: 'المستوى 3: كش مات المغفل',
    description: 'استغلال ضعف الأجنحة بضربة قاضية سريعة.',
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2',
    moves: ['Qh4#'],
    orientation: 'black'
  },
  {
    id: 4,
    title: 'المستوى 4: اختراق الصف الأخير',
    description: 'القلعة تدعم نفسها لنهاية لا تصد.',
    fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
    moves: ['Re8#'],
    orientation: 'white'
  },
  {
    id: 5,
    title: 'المستوى 5: الوجه للوجه',
    description: 'ضع الملكة مدعومة بملكك في وجه ملك الخصم.',
    fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1',
    moves: ['Qh8#'],
    orientation: 'white'
  },
  {
    id: 6,
    title: 'المستوى 6: المات العربي الدقيق',
    description: 'تناغم القلعة مع الحصان في الزاوية.',
    fen: '7k/6Rp/5N2/8/8/8/8/7K w - - 0 1',
    moves: ['Rxh7#'],
    orientation: 'white'
  },
  {
    id: 7,
    title: 'المستوى 7: الخنق السريع',
    description: 'الفارس يقفز للزاوية ليخنق الملك بين قطعه.',
    fen: '6rk/6pp/8/4N3/8/8/8/7K w - - 0 1',
    moves: ['Nf7#'],
    orientation: 'white'
  },
  {
    id: 8,
    title: 'المستوى 8: أنستازيا المباشر',
    description: 'القلعة تنهي العمل الذي بدأه الحصان.',
    fen: '7k/4N1p1/8/8/8/R7/8/7K w - - 0 1',
    moves: ['Rh3#'],
    orientation: 'white'
  },
  {
    id: 9,
    title: 'المستوى 9: الترقية المباشرة',
    description: 'رقِّ البيدق لملكة وأنه اللعبة فورا.',
    fen: '3k4/1P6/3K4/8/8/8/8/8 w - - 0 1',
    moves: ['b8=Q#'],
    orientation: 'white'
  },
  {
    id: 10,
    title: 'المستوى 10: قلعة القناص',
    description: 'الملكة مدعومة بالقلعة عن بعد.',
    fen: '1k1r4/pp3Q2/8/8/8/8/8/1R5K w - - 0 1',
    moves: ['Qxb7#'],
    orientation: 'white'
  },

  // Levels 11-20: Mate in 2
  {
    id: 11,
    title: 'المستوى 11: تضحية الصف المفتوح',
    description: 'ضحِ بالملكة لإجبار قلعة الخصم، ثم أنهِ الأمر.',
    fen: '3r2k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1',
    moves: ['Qe8+', 'Rxe8', 'Rxe8#'],
    orientation: 'white'
  },
  {
    id: 12,
    title: 'المستوى 12: استدراج الرخ 1',
    description: 'استخدم القلعة لكشف القلعة الأخرى وإحراز النصر.',
    fen: '6k1/5ppp/8/8/8/8/3r1PPP/1R4K1 w - - 0 1',
    moves: ['Rb8+', 'Rd8', 'Rxd8#'],
    orientation: 'white'
  },
  {
    id: 13,
    title: 'المستوى 13: تضحية الدفاع',
    description: 'تضحية القلعة لإجبار الملكة على سد الطريق.',
    fen: '7k/6pp/8/8/8/1q6/8/R6K w - - 0 1',
    moves: ['Ra8+', 'Qb8', 'Rxb8#'],
    orientation: 'white'
  },
  {
    id: 14,
    title: 'المستوى 14: المات المخنوق الكامل',
    description: 'التضحية العظمى بالملكة لأجل حصان الخنق.',
    fen: '6rk/5Qpp/7N/8/8/8/8/7K w - - 0 1',
    moves: ['Qg8+', 'Rxg8', 'Nf7#'],
    orientation: 'white'
  },
  {
    id: 15,
    title: 'المستوى 15: أنستازيا الكامل',
    description: 'ضحِ بالملكة لفتح العمود أمام الرخ.',
    fen: '7k/4N1pp/8/8/8/8/7Q/6RK w - - 0 1',
    moves: ['Qxh7+', 'Kxh7', 'Rh1#'],
    orientation: 'white'
  },
  {
    id: 16,
    title: 'المستوى 16: كش مات الفن',
    description: 'استخدم فيلك لإغلاق الممر ثم انهي بالرخ.',
    fen: 'r6k/1p4pp/p7/5R2/8/1B6/PP5P/7K w - - 0 1',
    moves: ['Rf8+', 'Rxf8'], // Wait, this isn't mate. 
    // Let's use reliable checkmates!
  }
];

// I will now write a solid generator script to ensure all 30 are completely verified exactly.
