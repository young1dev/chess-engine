const pieceImages = {
  white: {
    King: "pieces/wK.svg",
    Queen: "pieces/wQ.svg",
    Rook: "pieces/wR.svg",
    Bishop: "pieces/wB.svg",
    Knight: "pieces/wN.svg",
    Pawn: "pieces/wP.svg",
  },
  black: {
    King: "pieces/bK.svg",
    Queen: "pieces/bQ.svg",
    Rook: "pieces/bR.svg",
    Bishop: "pieces/bB.svg",
    Knight: "pieces/bN.svg",
    Pawn: "pieces/bP.svg",
  },
};

function renderBoard() {
  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    cell.classList.remove("light", "dark");
    cell.classList.add((row + col) % 2 === 0 ? "dark" : "light");

    // Clear cell
    cell.innerHTML = "";

    const piece = boardState[row][col];
    if (piece !== null) {
      const img = document.createElement("img");
      img.src = pieceImages[piece.color][piece.type];
      img.style.width = "80%";
      img.style.height = "80%";
      img.style.pointerEvents = "none"; // so clicks pass through to the cell
      cell.appendChild(img);
    }
  });
}

function movesHighlight(piece, selectedFrom, boardState) {
  //This loops through all x64 grid boxes and gives/highlights the moves possible
  const { row: fromRow, col: fromCol } = selectedFrom;

  let possibleMove = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let allowed = isLegalMove(
        row,
        col,
        fromRow,
        fromCol,
        boardState,
        currentTurn,
      );
      if (allowed) {
        possibleMove.push({ row, col });
      }
    }
  }
  renderHighlight(possibleMove);
}

function renderHighlight(possibleMove) {
  //remove highlight first
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("highlight");
  });
  possibleMove.forEach((move) => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      if (
        Number(cell.dataset.row) === move.row &&
        Number(cell.dataset.col) === move.col
      ) {
        cell.classList.add("highlight");
      }
    });
  });
}

function clearHighlight() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("highlight");
    if (resetGameState) {
      cell.style.backgroundColor = "";
    }
  });
  possibleMove = [];
}

function prevMoveHighlight(fromRow, fromCol, toRow, toCol) {
  // console.log(fromRow, fromCol)
  cells.forEach((cell) => {
    cell.style.backgroundColor = "";
    if (
      Number(cell.dataset.row) === fromRow &&
      Number(cell.dataset.col) === fromCol
    ) {
      cell.style.backgroundColor = "rgba(255, 255, 0, 0.25)";
    }
    if (
      Number(cell.dataset.row) === toRow &&
      Number(cell.dataset.col) === toCol
    ) {
      cell.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
    }
  });
}

function checkHighlight(kingRow, kingCol) {
  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    const kingPosition = row === kingRow && col === kingCol;
    if (kingPosition) {
      cell.style.backgroundColor = "red";
    }
  });
}

function chooseColor(color) {
  playerColor = color;
  aiColor = color === "white" ? "black" : "white";
  document.getElementById("color-modal").classList.remove("show");
  const board = document.getElementById("board");
  if (playerColor === "black") {
    board.classList.add("flipped");
  } else {
    board.classList.remove("flipped");
  }
  startGame();
}

function alertModal(message) {
  document.getElementById("modal-message").textContent = message;
  document.getElementById("game-modal").classList.add("show");
}

function hideModal() {
  document.getElementById("game-modal").classList.remove("show");
}
