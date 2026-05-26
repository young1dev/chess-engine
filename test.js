function isCheck(boardState, enemyColor) {
    //Kings position
    let kingRow = null;
    let kingCol = null;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (boardState[row][col] !==null) {
                if (boardState[row][col].type === "King" && boardState[row][col].color !== enemyColor) {
                    kingRow = row;
                    kingCol = col;

                }
            }      
        }
    }

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (boardState[row][col] !== null && boardState[row][col].color === enemyColor) {
                const allowed = isMoveAllowed(boardState[row][col], row, col, kingRow, kingCol, boardState)
                if (allowed) {
                    return true;
                }
            }
        }
        
    }
    return false;
}