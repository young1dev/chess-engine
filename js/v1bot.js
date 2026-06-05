// V1 Bot Randomized legal mover

function getBotMove(boardState, color) {
  let allPossibleMoves = [];

  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = boardState[fromRow][fromCol];
      if (!piece || piece.color !== color) continue;

      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          const legalMoves = isLegalMove(
            toRow,
            toCol,
            fromRow,
            fromCol,
            boardState,
            color,
          );
          if (legalMoves) {
            allPossibleMoves.push({ fromRow, fromCol, toRow, toCol });
          }
        }
      }
    }
  }
  //console.log(allPossibleMoves)
  if (allPossibleMoves.length === 0) return null;
  const botMove =
    allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
  console.log(botMove);
  return botMove;
}
