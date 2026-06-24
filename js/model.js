function openingGame(boardstate) {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = boardstate[fromRow][fromCol]
            if (!piece) continue;
            if (aiMove <= 4) {
                const openingGameMove = [
                    {fromRow: 0, fromCol: 1, toRow: 2, toCol: 0}
                ]
            }
        }
        
    }
}