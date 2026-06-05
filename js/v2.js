const pieceValue = {
  Pawn: 1,
  Rook: 5,
  Knight: 3,
  Queen: 5,
  Bishop: 3,
};

function minmax(boardState, depth, maximizingPlayer) {
  const newBoard = clonedBoard(boardState);

  if (depth === 0 || isCheckmate) {
    //const posEval = posEval(boardState)
    console.log(posEval(boardState));
    return posEval(newBoard);
  }
  if (maximizingPlayer) {
    const maxEval = -Infinity;
    console.log(maxEval);
    const allPossibleMoves = getAllMovesForEachPiece("black"); //later opponent will be there

    allPossibleMoves.forEach((moves) => {
      console.log(moves);
      newBoard[moves.toRow][moves.toCol] =
        newBoard[moves.fromRow][moves.fromCol];

      const eval = minmax(newBoard, depth - 1, false);
      maxEval = max(maxEval, eval);
      console.log(maxEval);
    });
    return maxEval;
  } else {
    //minimizing player
    const minEval = +Infinity;
    console.log(minEval);
    const allPossibleMoves = getAllMovesForEachPiece("white"); //later opponent will be there
    allPossibleMoves.forEach((moves) => {
      newBoard[moves.toRow][moves.toCol] =
        newBoard[moves.fromRow][moves.fromCol];

      const eval = minmax(newBoard, depth - 1, false);
      minEval = min(minEval, eval);
      console.log(minEval);
    });
    return minEval;
  }
}

minmax(boardState, 4, false);

function posEval(clonedBoard) {
  let whiteArr = [];
  let blackArr = [];
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = boardState[fromRow][fromCol];
      if (!piece || piece.type === "King") continue;

      //   console.log(piece.type);

      //   console.log(
      //     `${whiteArr} - ${piece.type}: ${pieceValue[piece.type]}, ${blackArr} - ${piece.type}: ${pieceValue[piece.type]}`,
      //   );

      if (piece.color === "white") {
        whiteArr.push(pieceValue[piece.type]);
      }
      if (piece.color === "black") {
        blackArr.push(pieceValue[piece.type]);
      }
    }
  }

  //To get the diff between them
  let wTotal = 0;
  let bTotal = 0;
  //console.log(whiteArr);
  let prev = 0;
  for (let i = 0; i < whiteArr.length; i++) {
    prev = prev + whiteArr[i];
    wTotal = prev;
  }
  prev = 0;
  for (let i = 0; i < blackArr.length; i++) {
    prev = prev + whiteArr[i];
    bTotal = prev;
  }
  //   console.log(`White: ${wTotal} | Black: ${bTotal}`);
  const posDiff = bTotal - wTotal;
  //   console.log(posDiff)
  return posDiff;
}

function getAllMovesForEachPiece(color) {
  const allPossibleMoves = [];
  const newBoard = clonedBoard(boardState);
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = newBoard[fromRow][fromCol];
      if (!piece || !piece.color) continue;

      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          if (newBoard[fromRow][fromCol].color !== color) continue;
          const legalMoves = isLegalMove(
            toRow,
            toCol,
            fromRow,
            fromCol,
            newBoard,
            color,
          );
          if (legalMoves) {
            allPossibleMoves.push({ fromRow, fromCol, toRow, toCol });
          }

          //To check piece ratings/value
          value = pieceValue[piece.type];
        }
      }
    }
  }
  return allPossibleMoves;
}
// console.log(getAllMovesForEachPiece("black"));
