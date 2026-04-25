const { Chess } = require('chess.js');

function check(id, fen, move) {
  let ch = new Chess(fen);
  console.log(`\nPuzzle ${id}`);
  console.log(ch.ascii());
  console.log("Legal moves:", ch.moves());
}

check(21, '4r1k1/5ppp/8/8/8/8/4Q1PP/4R1K1 w - - 0 1');
check(23, '5rk1/5Qpp/7N/8/8/8/8/7K w - - 0 1');
check(24, '7k/4N1pp/8/8/8/8/7Q/6RK w - - 0 1');
check(30, 'k7/pp6/8/8/8/8/8/KR5R w - - 0 1');

