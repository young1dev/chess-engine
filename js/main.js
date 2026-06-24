let playerColor = "white";
let aiColor = "black";
//console.log(playerColor)

let currentTurn = "white";

function validateTurn(currentTurn) {
  console.log("Current turn:", currentTurn);
  if (selectedPiece.color !== currentTurn) {
    console.log(`Not your turn`);
    return false;
  }
  if (selectedPiece.color !== playerColor) return false;
  return true;
}

function turnSwitch() {
  switch (currentTurn) {
    case "black":
      currentTurn = "white";
      break;
    case "white":
      currentTurn = "black";
      break;

    default:
      break;
  }
}

enPassantTarget = null;

const boardState = [
  [null, null, null, null, null, null, null, null], // row 0
  [null, null, null, null, null, null, null, null], // row 1
  [null, null, null, null, null, null, null, null], // row 2
  [null, null, null, null, null, null, null, null], // row 3
  [null, null, null, null, null, null, null, null], // row 4
  [null, null, null, null, null, null, null, null], // row 5
  [null, null, null, null, null, null, null, null], // row 6
  [null, null, null, null, null, null, null, null], // row 7
];

const board = document.getElementById("board");
let selectedPiece = null;
let selectedFrom = null;

const cells = document.querySelectorAll(".cell");

console.log(currentTurn);

function startGame() {
  console.log("Got here");
  if (currentTurn === aiColor) {
    setTimeout(() => {
      const botMove = getBotMove(boardState, aiColor);
      executeBotMove(botMove);
      appendHistory("bot");
      aiMove += 1;
    }, 300);
  }
}

board.addEventListener("click", (e) => {
  const cell = e.target; //The cell clicked

  if (!cell.classList.contains("cell")) return;

  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);

  if (selectedPiece === null) {
    if (boardState[row][col] == null) return;

    selectedPiece = boardState[row][col];
    selectedFrom = { row, col };
    console.log(`CLICKED: ${selectedPiece.type} ${selectedPiece.color}`);
    if (validateTurn(currentTurn) === false) {
      clearSelection();
      return;
    }
    movesHighlight(selectedPiece, selectedFrom, boardState);

    return;
  }

  //For choosing another piece
  if (boardState[row][col] !== null) {
    if (boardState[row][col].color === currentTurn) {
      selectedPiece = boardState[row][col];
      selectedFrom = { row, col };
      console.log(`CLICKED: ${selectedPiece.type} ${selectedPiece.color}`);
      movesHighlight(selectedPiece, selectedFrom, boardState);
      return;
    }
  }

  const allowed = isMoveAllowed(
    selectedPiece,
    selectedFrom.row,
    selectedFrom.col,
    row,
    col,
    boardState,
  );
  console.log(allowed);
  if (!allowed) {
    // clearSelection();
    // clearHighlight();
    return;
  }
  console.log(
    isLegalMove(
      row,
      col,
      selectedFrom.row,
      selectedFrom.col,
      boardState,
      currentTurn,
    ),
  );
  if (
    !isLegalMove(
      row,
      col,
      selectedFrom.row,
      selectedFrom.col,
      boardState,
      currentTurn,
    )
  ) {
    return;
  }

  move(row, col, selectedFrom);
});

function gameStateCheck() {
  // Check

  if (isCheck(boardState, currentTurn)) {
    let kingRow, kingCol;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (
          boardState[row][col]?.type === "King" &&
          boardState[row][col]?.color === currentTurn
        ) {
          kingRow = row;
          kingCol = col;
        }
      }
    }
    checkHighlight(kingRow, kingCol);
  }

  // Checkmate
  if (isCheckmate(boardState, currentTurn)) {
    if (currentTurn === playerColor) {
      alertModal("You lost! Checkmate.");
    } else {
      alertModal("You win! Checkmate.");
    }
    resetGame(boardState);
    return;
  }

  // Stalemate
  if (isStalemate(boardState, currentTurn)) {
    alertModal("Draw by Stalemate");
    resetGame(boardState);
    return;
  }

  // Insufficient material
  if (insuffMaterial(boardState)) {
    alertModal("Draw - Insufficient Material");
    resetGame(boardState);
    return;
  }
}

function appendHistory(user) {
  const whiteHistory = document.getElementsByClassName("whitePiece");
  const blackHistory = document.getElementsByClassName("blackPiece");

  const map = {
    K: "white",
    Q: "white"

  }
  
  history.forEach((h) => {
    if (h[0] === toUpperCase) {
      console.log("White")
    }
  });
}

let promotion;

let aiMove = 0;
let playerMove = 0;
function move(toRow, toCol, selectedFrom) {
  const { row: fromRow, col: fromCol } = selectedFrom;
  if (!selectedPiece) return;
  const allowed = isMoveAllowed(
    selectedPiece,
    fromRow,
    fromCol,
    toRow,
    toCol,
    boardState,
  );

  if (allowed) {
    //SAN
    moveHistory(fromRow, fromCol, toRow, toCol, promotion, enPassantTarget);

    const isCastlingAttempt =
      selectedPiece.type === "King" && Math.abs(toCol - fromCol) === 2;

    if (isCastlingAttempt) {
      const rookCol = toCol > fromCol ? 7 : 0;
      const rook = boardState[fromRow][rookCol];
      if (
        canCastle(
          selectedPiece,
          rook,
          boardState,
          fromRow,
          fromCol,
          toCol,
          currentTurn,
        )
      ) {
        executeCastle(boardState, toRow, fromCol, toCol);
        renderBoard();
        turnSwitch();
        if (currentTurn === aiColor) {
          setTimeout(() => {
            const botMove = getBotMove(boardState, aiColor);
            executeBotMove(botMove);
            appendHistory("bot");
            aiMove += 1;
          }, 300);
        }
        clearSelection();
        clearHighlight();
        return;
      }
    }

    if (
      selectedPiece.type === "Pawn" &&
      enPassantTarget &&
      toCol === enPassantTarget.col &&
      toRow === enPassantTarget.row
    ) {
      // Since in enpassant, the passant piece is near the to be captured piece
      //which is on the same row as the to be capt piece and when enpassant hapeens, it's in the same col with the captured piece
      boardState[toRow][toCol] = selectedPiece;
      let capturedPawnRow = fromRow;
      console.log("Got Here enpassant");
      boardState[capturedPawnRow][toCol] = null;
    }
    // console.log(isPromotion(selectedPiece, toRow));

    if (isPromotion(selectedPiece, toRow)) {
      promotion = prompt("Promote to Q, R, B, or N").toUpperCase();

      const valid = ["Q", "R", "B", "N"];
      const choice = valid.includes(promotion) ? promotion : "Q";

      const map = {
        Q: "Queen",
        R: "Rook",
        B: "Bishop",
        N: "Knight",
      };

      selectedPiece.type = map[choice];
      promotion = selectedPiece;
    }

    if (selectedPiece.type === "Pawn" && Math.abs(toRow - fromRow) === 2) {
      enPassantTarget = {
        row: (fromRow + toRow) / 2,
        col: fromCol,
      };
    } else {
      enPassantTarget = null;
    }
    //console.log(enPassantTarget);

    boardState[toRow][toCol] = selectedPiece;
    boardState[fromRow][fromCol] = null;
    selectedPiece.hasMoved = true;
    appendHistory("player");
    playerMove += 1;

    //Enpassant

    if (isThreshold(boardState)) {
      alert("This position has occured three times and it's therefore a draw");
      resetGame(boardState);
    }

    renderBoard();
    prevMoveHighlight(fromRow, fromCol, toRow, toCol);
    turnSwitch();
    clearSelection();
    clearHighlight();
    gameStateCheck();

    if (currentTurn === aiColor) {
      setTimeout(() => {
        const botMove = getBotMove(boardState, aiColor);
        executeBotMove(botMove);
        appendHistory("bot");
        aiMove += 1;
      }, 300); // small delay so the board renders first
    }
    //return true;
  } else {
    console.log("Can't move here");
    clearSelection();
    clearHighlight();
  }

  //console.log(selectedPiece.color)
  //selectedPiece = null;
  clearSelection();
  clearHighlight();
  gameStateCheck();
}

function clearSelection() {
  selectedPiece = null;
  selectedFrom = null;
}

function createPieces(type, color) {
  return {
    type, // "pawn", "rook", "queen", etc.
    color, // "white" or "black"
    hasMoved: false,
  };
}

//White pawns
for (let col = 0; col < 8; col++) {
  boardState[6][col] = createPieces("Pawn", "white");
}

// boardState[6][4] = createPieces("Pawn", "black");

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
boardState[7][4] = createPieces("King", "white");
boardState[0][4] = createPieces("King", "black");

//Queen
boardState[7][3] = createPieces("Queen", "white");
boardState[0][3] = createPieces("Queen", "black");

isThreshold(boardState);
renderBoard();
