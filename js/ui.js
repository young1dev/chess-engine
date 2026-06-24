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
    cell.classList.add((row + col) % 2 === 0 ? "light" : "dark");

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
    const label = document.createElement("span");
label.style.position = "absolute";
label.style.fontSize = "10px";
label.style.fontWeight = "500";
label.style.color = 'white'

if (playerColor === "white") {
  if (col === 0){
    label.textContent = 8 - row;
  label.style.top = "2px";
  label.style.left = "2px";
  cell.appendChild(label);
  }
  
} 

if (playerColor === "black") {
  if (col === 7){
    label.textContent = 8 - row;
  label.style.top = "2px";
  label.style.left = "2px";
  cell.appendChild(label);
  }
  
} 

if (row === 7 && playerColor === "white") {
  const fileLabel = document.createElement("span");
  fileLabel.style.position = "absolute";
  fileLabel.style.fontSize = "10px";
  fileLabel.style.fontWeight = "500";
  fileLabel.style.color = 'white'
  fileLabel.textContent = ["a","b","c","d","e","f","g","h"][col];
  fileLabel.style.bottom = "2px";
  fileLabel.style.right = "2px";
  cell.appendChild(fileLabel);
}
if (row === 0 && playerColor === "black") {
  const fileLabel = document.createElement("span");
  fileLabel.style.position = "absolute";
  fileLabel.style.fontSize = "10px";
  fileLabel.style.fontWeight = "500";
  fileLabel.style.color = 'white'
  fileLabel.textContent = ["a","b","c","d","e","f","g","h"][col];
  fileLabel.style.bottom = "2px";
  fileLabel.style.right = "2px";
  cell.appendChild(fileLabel);
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
// alertModal("You-Lost Checkmate")
function hideModal() {
  document.getElementById("game-modal").classList.remove("show");
}
