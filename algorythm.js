function bestMove() {
  // AI's turn
  let bestScore = -Infinity;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // is the spot available?
      if (board[i][j]) {
        board[i][j] = ai;
        let score = minimax(board);

        if (score > bestScore) {
          bestScore = score;
          bestMove = { i, j };
        }
      }
    }
  }
}
