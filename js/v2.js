const pieceValue = {
  Pawn: 1,
  Knight: 3,
  Bishop: 3,
  Rook: 5,
  Queen: 9,
};

function getBotMove(boardState, aiColor) {
  let bestScore = -Infinity;
  let bestMove = null;
  let alpha = -Infinity;
  let beta = +Infinity;

  const movesList = getAllMovesForEachPiece(boardState, aiColor); //Change later

  for (const move of movesList) {
    const tempBoard = clonedBoard(boardState);
    tempBoard[move.toRow][move.toCol] = tempBoard[move.fromRow][move.fromCol];
    tempBoard[move.fromRow][move.fromCol] = null;

    const score = minmax(tempBoard, 3, alpha, beta, false);
    console.log(score);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    //console.log(bestMove)
  }
  console.log(bestMove, bestScore);
  return bestMove;
}
// console.log(getBotMove(boardState));

function minmax(boardState, depth, alpha, beta, maximizingPlayer) {
  const color = maximizingPlayer ? aiColor : playerColor;
  if (
    depth === 0 ||
    isCheckmate(boardState, color) ||
    isStalemate(boardState, color)
  ) {
    //const posEval = posEval(boardState)
    // console.log(posEval(boardState));
    return posEval(boardState);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestScore = -Infinity;
    let bestMove = null;
    const movesList = getAllMovesForEachPiece(boardState, color);

    for (const moves of movesList) {
      const tempBoard = clonedBoard(boardState);
      tempBoard[moves.toRow][moves.toCol] =
        tempBoard[moves.fromRow][moves.fromCol];

      tempBoard[moves.fromRow][moves.fromCol] = null;
      const score = minmax(
        tempBoard,
        depth - 1,
        alpha,
        beta,
        !maximizingPlayer,
      );
      maxEval = Math.max(maxEval, score);
      alpha = maxEval;
      if (alpha >= beta) {
        return maxEval;
      }
      if (score > bestScore) {
        bestMove = moves;
        bestScore = score;
      }
    }
    return bestScore;
  } else {
    let minEval = Infinity;
    const movesList = getAllMovesForEachPiece(boardState, color);
    for (const moves of movesList) {
      const tempBoard = clonedBoard(boardState);
      tempBoard[moves.toRow][moves.toCol] =
        tempBoard[moves.fromRow][moves.fromCol];

      tempBoard[moves.fromRow][moves.fromCol] = null;
      const score = minmax(
        tempBoard,
        depth - 1,
        alpha,
        beta,
        !maximizingPlayer,
      );
      minEval = Math.min(minEval, score);
      beta = minEval
      if (alpha >= beta) {
        return minEval;
      }
    }
    return minEval;
  }
}

// minmax(boardState, 1, -Infinity, +Infinity, true);

function posEval(clonedBoard) {
  let score = 0;

  if (isCheckmate(clonedBoard, playerColor)) return 99999;  // bot wins
  if (isCheckmate(clonedBoard, aiColor)) return -99999;    

  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = clonedBoard[fromRow][fromCol];
      if (!piece || piece.type === "King") continue;

      if (piece.color === aiColor) {
        score += pieceValue[piece.type];
      } else {
        score -= pieceValue[piece.type];
      }
    }
  }
  return score;
}
// console.log(posEval(boardState));

function getAllMovesForEachPiece(boardState, color) {
  const movesList = [];
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
            movesList.push({ fromRow, fromCol, toRow, toCol });
          }

          //To check piece ratings/value
          const value = pieceValue[piece.type];
        }
      }
    }
  }
  return movesList;
}
// console.log(getAllMovesForEachPiece(boardState, aiColor));
