import { Chess } from 'chess.js';

const puzzles = [
  {
    id: 18,
    fen: '8/8/8/8/8/8/6q1/K1k5 b - - 0 1',
    moves: ['Qb2#']
  },
  {
    id: 19,
    fen: '8/8/8/8/8/1k6/7r/K7 b - - 0 1',
    moves: ['Rh1#']
  },
  {
    id: 20,
    fen: '7k/6p1/5N2/8/8/8/6R1/7K w - - 0 1',
    moves: ['Rh2#']
  },
  {
    id: 21,
    fen: '4r1k1/5ppp/8/8/8/8/4Q1PP/4R1K1 w - - 0 1',
    moves: ['Qxe8+', 'Rxe8', 'Rxe8#']
  },
  {
    id: 22,
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2',
    moves: ['Qh4#']
  },
  {
    id: 23,
    fen: '5rk1/5Qpp/7N/8/8/8/8/7K w - - 0 1',
    moves: ['Qg8+', 'Rxg8', 'Nf7#']
  },
  {
    id: 24,
    fen: '7k/4N1pp/8/8/8/8/7Q/6RK w - - 0 1',
    moves: ['Qxh7+', 'Kxh7', 'Rh1#']
  },
  {
    id: 25,
    fen: '1k6/ppp5/8/8/8/8/8/1R2K2R w K - 0 1',
    moves: ['Rh8#']
  },
  {
    id: 26,
    fen: '2k5/pp6/2b5/8/8/8/8/3R2K1 w - - 0 1',
    moves: ['Rd8#']
  },
  {
    id: 27,
    fen: '8/8/7R/3k4/4R3/8/8/4K3 w - - 0 1',
    moves: ['Rd6#']
  },
  {
    id: 28,
    fen: '8/2r5/1k6/8/8/1K6/8/R7 w - - 0 1',
    moves: ['Ra6#']
  },
  {
    id: 29,
    fen: '6k1/6pp/8/8/8/8/7r/K6r b - - 0 1',
    moves: ['Rxa1#']
  },
  {
    id: 30,
    fen: 'k7/pp6/8/8/8/8/8/KR5R w - - 0 1',
    moves: ['Rxh7', 'a6', 'Rh8#']
  }
];

let allValid = true;
for (let p of puzzles) {
  let ch = new Chess(p.fen);
  let failed = false;
  for (let m of p.moves) {
    try {
      ch.move(m);
    } catch (e) {
      console.log(`Failed Puzzle ${p.id} on move ${m}: ${e.message}`);
      failed = true;
      allValid = false;
    }
  }
}
if(allValid) console.log("ALL PUZZLES VALID");
