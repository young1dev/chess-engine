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

  const movesList = getAllMovesForEachPiece(boardState, aiColor);

  for (const move of movesList) {
    const tempBoard = clonedBoard(boardState);
    tempBoard[move.toRow][move.toCol] = tempBoard[move.fromRow][move.fromCol];
    tempBoard[move.fromRow][move.fromCol] = null;

    const score = minmax(tempBoard, 2, alpha, beta, false, aiColor);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
      alpha = Math.max(alpha, score); 
    }
  }
  console.log(bestMove, bestScore);
  return bestMove;
}

function quiescence(boardState, alpha, beta, maximizingPlayer, aiColor, depth = 2) {
  if (depth === 0) return posEval(boardState, aiColor);
  const playerColor = aiColor === "white" ? "black" : "white";
  const color = maximizingPlayer ? aiColor : playerColor;

  let movesList = getAllMovesForEachPiece(boardState, color);
  movesList = movesList.filter(
    (move) => boardState[move.toRow][move.toCol] !== null,
  );

  if (
    movesList.length === 0 ||
    isCheckmate(boardState, color) ||
    isStalemate(boardState, color)
  ) {
    return posEval(boardState, aiColor);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const moves of movesList) {
      const tempBoard = clonedBoard(boardState);
      tempBoard[moves.toRow][moves.toCol] = tempBoard[moves.fromRow][moves.fromCol];
      tempBoard[moves.fromRow][moves.fromCol] = null;
      const score = quiescence(tempBoard, alpha, beta, false, aiColor, depth-1);
      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, maxEval);
      if (alpha >= beta) return maxEval;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const moves of movesList) {
      const tempBoard = clonedBoard(boardState);
      tempBoard[moves.toRow][moves.toCol] = tempBoard[moves.fromRow][moves.fromCol];
      tempBoard[moves.fromRow][moves.fromCol] = null;
      const score = quiescence(tempBoard, alpha, beta, true, aiColor, depth-1);
      minEval = Math.min(minEval, score);
      beta = minEval;
      if (alpha >= beta) return minEval;
    }
    return minEval;
  }
}

const transpositionTable = new Map();

function minmax(boardState, depth, alpha, beta, maximizingPlayer, aiColor) {
  const playerColor = aiColor === "white" ? "black" : "white"; 
  const color = maximizingPlayer ? aiColor : playerColor;

  const key = serializeBoard(boardState, maximizingPlayer ? aiColor : playerColor);

if (transpositionTable.has(key)) {
  return transpositionTable.get(key);
}

  if (isCheckmate(boardState, color) || isStalemate(boardState, color)) {
    return posEval(boardState, aiColor);
}

if (depth === 0) {
    return quiescence(boardState, alpha, beta, maximizingPlayer, aiColor);
}

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    const movesList = getAllMovesForEachPiece(boardState, color);

    for (const moves of movesList) {
      const tempBoard = clonedBoard(boardState);
      tempBoard[moves.toRow][moves.toCol] =
        tempBoard[moves.fromRow][moves.fromCol];
      tempBoard[moves.fromRow][moves.fromCol] = null;

      const score = minmax(tempBoard, depth - 1, alpha, beta, false, aiColor);
      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, maxEval); 
      if (alpha >= beta) {
        return maxEval;
      }
    }
    transpositionTable.set(key, maxEval); 
    return maxEval; 
  } else {
    let minEval = Infinity;
    const movesList = getAllMovesForEachPiece(boardState, color);

    for (const moves of movesList) {
      const tempBoard = clonedBoard(boardState);
      tempBoard[moves.toRow][moves.toCol] =
        tempBoard[moves.fromRow][moves.fromCol];
      tempBoard[moves.fromRow][moves.fromCol] = null;

      const score = minmax(tempBoard, depth - 1, alpha, beta, true, aiColor);
      minEval = Math.min(minEval, score);
      beta = minEval;
      if (alpha >= beta) {
        return minEval;
      }
    }
    transpositionTable.set(key, minEval); 
    return minEval;
  }
}

const pieceTables = {
  Pawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  Knight: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  Bishop: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  Rook: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  Queen: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  King: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

function posEval(clonedBoard, aiColor) {
  const playerColor = aiColor === "white" ? "black" : "white";
  let score = 0;

  if (isCheckmate(clonedBoard, playerColor)) return 99999;
  if (isCheckmate(clonedBoard, aiColor)) return -99999;

  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = clonedBoard[fromRow][fromCol];
      if (!piece || piece.type === "King") continue;

      const row = piece.color === "white" ? fromRow : 7 - fromRow;
      let positionValue = pieceTables[piece.type][row][fromCol];

      if (piece.color === aiColor) {
        score += pieceValue[piece.type] + positionValue;
      } else {
        score -= pieceValue[piece.type] + positionValue;
      }
    }
  }
  return score;
}

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
        }
      }
    }
  }
  movesList.sort((a, b) => {
    const first = boardState[a.toRow][a.toCol] !== null ? 1 : 0;
    const second = boardState[b.toRow][b.toCol] !== null ? 1 : 0;
    return second - first;
  });
  return movesList;
}
