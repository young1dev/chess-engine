function isMoveAllowed(piece, fromRow, fromCol, toRow, toCol, boardState) {
  if (!piece || toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
  switch (piece.type) {
    case "Rook":
      return isValidRookMove(fromRow, fromCol, toRow, toCol, boardState);

    case "Bishop":
      return isValidBishopMove(fromRow, fromCol, toRow, toCol, boardState);

    case "Knight":
      return isValidKnightMove(fromRow, fromCol, toRow, toCol, boardState);

    case "Queen":
      return isValidQueenMove(fromRow, fromCol, toRow, toCol, boardState);

    case "King":
      return isValidKingMove(fromRow, fromCol, toRow, toCol, boardState);

    case "Pawn":
      return isValidPawnMove(fromRow, fromCol, toRow, toCol, boardState);

    default:
      return false;
  }
}

function isValidRookMove(fromRow, fromCol, toRow, toCol, boardState) {
  //for safety
  if (!boardState[fromRow][fromCol]) return false;

  if (fromRow !== toRow && fromCol !== toCol) return false;
  if (boardState[toRow][toCol] !== null) {
    if (boardState[fromRow][fromCol].color === boardState[toRow][toCol].color)
      return false;
  }

  // Horizontal Movement
  if (fromRow === toRow) {
    const step = fromCol > toCol ? -1 : 1;
    const start = fromCol + step;
    const end = toCol;

    for (let Col = start; Col !== end; Col += step) {
      if (boardState[fromRow][Col] !== null) return false;
    }
    return true;
  }

  // Vertical Movement
  if (fromCol === toCol) {
    const step = fromRow > toRow ? -1 : 1;
    const start = fromRow + step;
    const end = toRow;

    for (let Row = start; Row !== end; Row += step) {
      if (boardState[Row][fromCol] !== null) return false;
    }
    return true;
  }
  return false;
}

function isValidBishopMove(fromRow, fromCol, toRow, toCol, boardState) {
  //Note: Both row and column changes
  // If the absolute value btw them is the same, it's
  // a diagonal movement

  const piece = boardState[fromRow][fromCol];
  if (!piece) return false;
  const target = boardState[toRow][toCol];
  if (target && target.color === piece.color) return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;

  // Bishops movement occurs in 4 ways
  // up-right, up-left, down-right, down-left

  const rowStep = rowDiff > 0 ? 1 : -1;
  const colStep = colDiff > 0 ? 1 : -1;

  let row = fromRow + rowStep;
  let col = fromCol + colStep;
  while (row !== toRow && col !== toCol) {
    if (boardState[row][col] !== null) return false;
    row += rowStep;
    col += colStep;
  }
  return true;
}

function isValidKnightMove(fromRow, fromCol, toRow, toCol, boardState) {
  //Can only move 2 in an axis and 1 in the other
  //e.g (2, 1) (1,2)
  // Same color filter
  const piece = boardState[fromRow][fromCol];
  if (!piece) return false;
  //console.log(toRow, toCol)
  const target = boardState[toRow][toCol];
  if (target && target.color === piece.color) return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  if (
    (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
    (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
  ) {
    return true;
  }
  return false;
}

function isValidQueenMove(fromRow, fromCol, toRow, toCol, boardState) {
  //for safety
  if (!boardState[fromRow][fromCol]) return false;

  if (fromRow === toRow || fromCol === toCol) {
    return isValidRookMove(fromRow, fromCol, toRow, toCol, boardState);
  }

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  // Must move diagonally
  if (Math.abs(rowDiff) === Math.abs(colDiff)) {
    return isValidBishopMove(fromRow, fromCol, toRow, toCol, boardState);
  }
}

function isValidKingMove(fromRow, fromCol, toRow, toCol, boardState) {
  // Same color filter
  const piece = boardState[fromRow][fromCol];
  if (!piece) return false;

  // if (!piece.hasMoved && Math.abs(toCol - fromCol) === 2) {
  //   return true;
  // }

  const target = boardState[toRow][toCol];
  if (target && target.color === piece.color) return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  //coldiff can either be 0 or 1 so as for row diff
  if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) {
    return true;
  }

  // Castling
  if (rowDiff === 0 && Math.abs(colDiff) === 2) return true;

  return false;
}

function isValidPawnMove(fromRow, fromCol, toRow, toCol, boardState) {
  const piece = boardState[fromRow][fromCol];
  if (!piece) return false;

  const target = boardState[toRow][toCol];
  if (target && target.color === piece.color) return false;

  const step = boardState[fromRow][fromCol].color === "white" ? -1 : 1;

  //The piece can't go backward, can take 2 steps if
  //hasMoved is false, col can change by +1 or -1 for a
  //capture

  //First move conditional
  if (
    boardState[fromRow][fromCol].hasMoved === false &&
    toRow === fromRow + step * 2 &&
    toCol === fromCol &&
    boardState[toRow][toCol] === null &&
    boardState[fromRow + step][fromCol] === null
  ) {
    return true;
  }
  //Normal pawn movement
  if (
    toRow === fromRow + step &&
    toCol === fromCol &&
    boardState[toRow][toCol] === null
  ) {
    return true;
  }

  //Enpassant Condition
  //console.log(enPassantTarget)
  if (
    toRow === fromRow + step &&
    Math.abs(toCol - fromCol) === 1 &&
    boardState[toRow][toCol] === null
  ) {
    if (
      enPassantTarget &&
      toCol === enPassantTarget.col &&
      toRow === enPassantTarget.row
    ) {
      return true;
    }
  }

  //Diagonal Capture
  if (toRow === fromRow + step && Math.abs(toCol - fromCol) === 1) {
    if (boardState[toRow][toCol] !== null) {
      if (
        boardState[fromRow][fromCol].color !== boardState[toRow][toCol].color
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
}

//Pawn Promotion Logic
function isPromotion(piece, toRow) {
  if (piece.type !== "Pawn") return false;

  if (
    (piece.color === "white" && toRow === 0) ||
    (piece.color === "black" && toRow === 7)
  )
    return true;
}

function isPathClear(boardState, row, fromCol, toCol) {
  const rookCol = toCol > fromCol ? 7 : 0;
  const step = fromCol < rookCol ? 1 : -1;

  for (let col = fromCol + step; col !== rookCol; col += step) {
    if (boardState[row][col] !== null) return false;
  }
  return true;
}

function isCastleSafe(boardState, king, fromRow, fromCol, toCol, color) {
  const step = fromCol < toCol ? 1 : -1;
  let col = fromCol;

  while (col !== toCol) {
    col += step;
    const tempBoard = clonedBoard(boardState);
    tempBoard[fromRow][fromCol] = null;
    tempBoard[fromRow][col] = king;

    if (isCheck(tempBoard, color)) return false;
  }
  return true;
}

function canCastle(king, rook, boardState, fromRow, fromCol, toCol, color) {
  if (king.hasMoved || rook.hasMoved) return false;
  if (isCheck(boardState, color)) return false;
  // console.log(isPathClear(boardState, fromRow, fromCol, toCol));
  // console.log(isCastleSafe(boardState, king, fromRow, fromCol, toCol, color));
  if (!isPathClear(boardState, fromRow, fromCol, toCol)) return false;

  if (!isCastleSafe(boardState, king, fromRow, fromCol, toCol, color))
    return false;

  return true;
}

function executeCastle(boardState, row, kingFromCol, kingToCol) {
  const rookFromCol = kingToCol > kingFromCol ? 7 : 0;
  const rookToCol = kingToCol > kingFromCol ? kingToCol - 1 : kingToCol + 1;

  boardState[row][kingToCol] = boardState[row][kingFromCol];
  boardState[row][kingFromCol] = null;

  boardState[row][rookToCol] = boardState[row][rookFromCol];
  boardState[row][rookFromCol] = null;

  boardState[row][kingToCol].hasMoved = true;
  boardState[row][rookToCol].hasMoved = true;
}

function isCheck(boardState, currentTurn) {
  //isCheck() checks Is THIS color’s king under attack right now?
  //Kings position
  let kingRow;
  let kingCol;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      //Scan for current player king coord
      if (boardState[row][col] !== null) {
        if (
          boardState[row][col].type === "King" &&
          boardState[row][col].color === currentTurn
        ) {
          kingRow = row;
          kingCol = col;
        }
      }
    }
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      //Can enemy attack king?
      const enemyColor = currentTurn === "white" ? "black" : "white";
      if (
        boardState[row][col] !== null &&
        boardState[row][col].color === enemyColor
      ) {
        const allowed = isMoveAllowed(
          boardState[row][col],
          row,
          col,
          kingRow,
          kingCol,
          boardState,
        );
        if (allowed) {
          return true;
        }
      }
    }
  }
  return false;
}

function clonedBoard(boardState) {
  const newBoard = [];

  for (let row = 0; row < 8; row++) {
    newBoard[row] = [];

    for (let col = 0; col < 8; col++) {
      const piece = boardState[row][col];
      if (piece === null) {
        newBoard[row][col] = null;
      } else {
        newBoard[row][col] = {
          type: piece.type,
          color: piece.color,
          hasMoved: piece.hasMoved,
        };
      }
    }
  }
  return newBoard;
}

function isLegalMove(toRow, toCol, fromRow, fromCol, boardState, currentTurn) {
  let newBoard = clonedBoard(boardState);
  const piece = newBoard[fromRow][fromCol];

  //Castling Exception
  const isCastlingAttempt =
    piece.type === "King" &&
    Math.abs(toRow - fromRow) === 0 &&
    Math.abs(toCol - fromCol) === 2;

  if (isCastlingAttempt) {
    const rookCol = toCol > fromCol ? 7 : 0;
    const rook = boardState[fromRow][rookCol];
    if (!rook) return false;
    return canCastle(
      piece,
      rook,
      boardState,
      fromRow,
      fromCol,
      toCol,
      currentTurn,
    );
  }

  //Enpassant Exception

  const enemyColor = currentTurn === "white" ? "black" : "white";
  //Legal move not to expose king to check

  if (!isMoveAllowed(piece, fromRow, fromCol, toRow, toCol, boardState))
    return false;

  if (
    piece.type === "Pawn" &&
    enPassantTarget &&
    toCol === enPassantTarget.col &&
    toRow === enPassantTarget.row &&
    boardState[toRow][toCol] === null
  ) {
    newBoard[fromRow][fromCol] = null;
  }
  newBoard[fromRow][fromCol] = null;
  newBoard[toRow][toCol] = piece;
  let check = isCheck(newBoard, currentTurn);
  //console.log(check)
  if (check) {
    return false;
  }

  return true;
}

function isCheckmate(boardState, color) {
  // console.log(isCheck(boardState, color))
  if (!isCheck(boardState, color)) return false;

  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = boardState[fromRow][fromCol];
      if (!piece || piece.color !== color) continue;

      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          if (isLegalMove(toRow, toCol, fromRow, fromCol, boardState, color)) {
            //There's a possible exit
            return false;
          }
        }
      }
    }
  }

  return true;
}

function isStalemate(boardState, color) {
  if (isCheck(boardState, color)) return false;

  //Stalemate occurs if king is not in check and there's no legal move
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = boardState[fromRow][fromCol];
      if (piece !== null && piece.color === color) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (
              isLegalMove(toRow, toCol, fromRow, fromCol, boardState, color)
            ) {
              //There's a possible exit
              return false;
            }
          }
        }
      }
    }
  }
  return true;
}

function insuffMaterial(boardState) {
  // ➡️ draw
  let materials = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (boardState[row][col] !== null) {
        let piece = boardState[row][col];
        materials.push({
          type: piece.type,
          color: piece.color,
          squareColor: (row + col) % 2,
        });
      }
    }
  }
  //King + King
  if (materials.length === 2) return true;

  //King + Knight + King
  if (materials.length === 3 && materials.some((p) => p.type === "Knight")) {
    return true;
  }
  // King + Bishop + King
  if (materials.length === 3 && materials.some((p) => p.type === "Bishop")) {
    return true;
  }

  const bishops = materials.filter((p) => p.type === "Bishop");

  //King + Bishop + King + Bishop (Same BIshop color square)
  if (materials.length === 4 && bishops.length === 2) {
    const sameColor = bishops.every(
      (b) => b.squareColor === bishops[0].squareColor,
    );
    if (sameColor) {
      return true;
    }
  }

  return false;
}

function indexToSquare(row, col) {
  // Row 0 rank is 8
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const file = files[col];
  const rank = Math.abs(row - 8);
  return file + rank;
}

function pieceToChar(piece) {
  if (!piece) return;
  //White piece are represented in uppercase

  const map = {
    King: "K",
    Queen: "Q",
    Rook: "R",
    Bishop: "B",
    Knight: "N",
    Pawn: "e",
  };
  const char = map[piece.type];
  //console.log(piece)
  let charc = piece.color === "white" ? char : char.toLowerCase();
  return charc;
}

function serializePiece(piece, row, col) {
  //Convert each piece to chars+square notation
  //if (piece === ".") return null;
  const square = indexToSquare(row, col);
  return pieceToChar(piece) + square;
}

function serializeBoard(boardState, currentTurn) {
  let pieces = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = boardState[row][col];
      const serialized = serializePiece(piece, row, col);
      if (serialized) {
        pieces.push(serialized);
      }
    }
  }
  pieces.sort();
  return currentTurn + "|" + pieces.join("|");
}
const positionMap = new Map();
function isThreshold(boardState) {
  //This function stores each boardstate with the current players turn
  //Since passing  boardstate each time is unreliable and unsafe since our logic function is to be independent
  //We then convert each pieces in the boardstate to chars and serialize it which makes it more of a text instead of
  //an object

  const key = serializeBoard(boardState, currentTurn);
  const count = positionMap.get(key) || 0;
  positionMap.set(key, count + 1);
  //console.log(positionMap)
  if (count + 1 === 3) {
    return true;
  }
  return false;
}

let resetGameState = false;

function resetGame(boardState) {
  hideModal();
  resetGameState = false;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      boardState[row][col] = null;
    }
  }
  //White pawns
  for (let col = 0; col < 8; col++) {
    boardState[6][col] = createPieces("Pawn", "white");
  }

  //boardState[3][4] = createPieces("Pawn", "white")

  //Black pawn
  for (let col = 0; col < 8; col++) {
    boardState[1][col] = createPieces("Pawn", "black");
  }

  //Rook
  boardState[0][0] = createPieces("Rook", "black");
  boardState[0][7] = createPieces("Rook", "black");
  boardState[7][0] = createPieces("Rook", "white");
  boardState[7][7] = createPieces("Rook", "white");

  //Bishop
  boardState[0][2] = createPieces("Bishop", "black");
  boardState[0][5] = createPieces("Bishop", "black");
  boardState[7][2] = createPieces("Bishop", "white");
  boardState[7][5] = createPieces("Bishop", "white");

  //Knight
  boardState[0][1] = createPieces("Knight", "black");
  boardState[0][6] = createPieces("Knight", "black");
  boardState[7][1] = createPieces("Knight", "white");
  boardState[7][6] = createPieces("Knight", "white");

  //King
  boardState[7][3] = createPieces("King", "white");
  boardState[0][3] = createPieces("King", "black");

  //Queen
  boardState[7][4] = createPieces("Queen", "white");
  boardState[0][4] = createPieces("Queen", "black");

  positionMap.clear();
  history.length = 0;
  currentTurn = "white";

  clearSelection();

  renderBoard();
}
const history = [];

function moveHistory(
  fromRow,
  fromCol,
  toRow,
  toCol,
  promotion,
  enPassantTarget,
) {
  const piece = boardState[fromRow][fromCol];
  if (!piece) return;

  let move = "";

  const target = boardState[toRow][toCol];
  const square = indexToSquare(toRow, toCol);

  // console.log(fromRow, fromCol, toRow, toCol);
  // console.log(piece);

  //Castle
  if (piece.type === "King" && Math.abs(toCol - fromCol) === 2) {
    move = toCol > fromCol ? "O-O" : "O-O-O";
    history.push(move);
    return;
  }
  // console.log(enPassantTarget);

  //Enpassant
  if (piece.type === "Pawn" && enPassantTarget) {
    if (toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
      console.log(enPassantTarget.row, enPassantTarget.col);
      move =
        pieceToChar(boardState[fromRow][fromCol]) +
        indexToSquare(enPassantTarget.row, enPassantTarget.col);
      history.push(move);
      return;
    }
  }

  if (piece.type !== "Pawn") {
    move += pieceToChar(piece);
    console.log(history);
  }

  if (target !== null) {
    move += "x" + pieceToChar(boardState[toRow][toCol]);
  }

  move += square;

  if (promotion) {
    move += pieceToChar(piece) + "=" + pieceToChar(promotion);
  }

  history.push(move);
  console.log(history);
}

function executeBotMove(botMove) {
  if (!botMove) return;
  selectedPiece = boardState[botMove.fromRow][botMove.fromCol];
  selectedFrom = { row: botMove.fromRow, col: botMove.fromCol };

  const legal = isLegalMove(
    botMove.toRow,
    botMove.toCol,
    botMove.fromRow,
    botMove.fromCol,
    boardState,
    aiColor,
  );

  if (!legal) {
    // Bot found no valid move, just skip
    clearSelection();
    return;
  }

  if (isPromotion(selectedPiece, botMove.toRow)) {
    selectedPiece.type = "Queen";
  }

  move(botMove.toRow, botMove.toCol, {
    row: botMove.fromRow,
    col: botMove.fromCol,
  });
}
