const pieceValue = {
  Pawn: 1,
  Knight: 3,
  Bishop: 3,
  Rook: 5,
  Queen: 9,
};

const aiColor = true ? "black" : "white";

function minmax(boardState, depth, maximizingPlayer) {
  const color = maximizingPlayer ? "white" : "black";
  if (depth === 0) {
    //const posEval = posEval(boardState)
    // console.log(posEval(boardState));
    return posEval(boardState);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = -Infinity; 
    let bestPosition = null;
    const movesList = getAllMovesForEachPiece(boardState, color);

    for (const moves of movesList) {
      // console.log(movesList);
      // console.log("FROM PIECE:", boardState[moves.fromRow][moves.fromCol]);
      const tempBoard = clonedBoard(boardState);
      tempBoard[moves.toRow][moves.toCol] =
        tempBoard[moves.fromRow][moves.fromCol];

      tempBoard[moves.fromRow][moves.fromCol] = null;
      const eval = minmax(tempBoard, depth - 1, !maximizingPlayer);
      maxEval = Math.max(maxEval, eval);
      if (maxEval > bestMove) {
       bestPosition = moves;
        bestMove = maxEval;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    let bestPosition = Infinity;
    let bestMove = null;
    const movesList = getAllMovesForEachPiece(boardState, color);

    for (const moves of movesList) {
      const tempBoard = clonedBoard(boardState);
      tempBoard[moves.toRow][moves.toCol] =
        tempBoard[moves.fromRow][moves.fromCol];

      tempBoard[moves.fromRow][moves.fromCol] = null;
      const eval = minmax(tempBoard, depth - 1, !maximizingPlayer);
      minEval = Math.min(minEval, eval);
      //  if (minEval < bestMove) {
      //   bestPosition = moves;
      //   console.log(bestPosition);
      //   bestMove = maxEval;
      //   console.log(bestMove)
      // }
    }
    return minEval;
  }
}

minmax(boardState, 1, true);

function posEval(clonedBoard) {
  let score = 0;

  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = clonedBoard[fromRow][fromCol];
      if (!piece || piece.type === "King") continue;

      if (piece.color === "white") {
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
      if (!piece || !piece.color) continue;

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
          value = pieceValue[piece.type];
        }
      }
    }
  }
  return movesList;
}
// console.log(getAllMovesForEachPiece(boardState, "white"));
