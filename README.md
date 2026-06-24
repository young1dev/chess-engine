# Chess-Engine

JavaScript chess engine with legal move validation, castling, en passant, promotion, and a random-move bot. No frameworks, no libraries — vanilla JS.

# Chess Bot

A vanilla JavaScript chess engine with a built-in bot. Built with HTML, CSS, and JS.

## Features

- Full chess rule enforcement (legal move validation)
- Check, checkmate, and stalemate detection
- Castling (kingside and queenside)
- En passant
- Pawn promotion
- Threefold repetition draw
- Insufficient material draw
- Move and check highlighting
- Previous move highlight
- Boardstate hashing
- Move history (SAN-style notation) (Console only for now)
- Rank and files UI on the board 
- Random-move bot (V1)
- A min-max algorithm based bot (v2)

### Why I Built This

I've always wanted to know how to play chess like top players eg magnus carlsen, hikaru and the likes but to no avail. So i thought that if i can't be a great player i can create one. This brought me to the descison of creating one by studying and using patterns of top players (Current v1bot doesn't have that yet)

This project helped me deeply understand:

Game state management
Rule validation
Edge cases like castling, en passant, and draw conditions
Structuring larger JavaScript files without frameworks
How recursive code works

### Problems I Faced

````
- Handling king safety was harder than expected. I had to simulate moves on a cloned board to avoid illegal self-checks and also prevent mutatio.
- Threefold repetition required hashing board states correctly.
- Separating UI logic separate from game rules took several refactors as i always tied the game logic which the ui logic which caused lot of bugs and disappearing piece.
- Trying to reduce the runtime for the v2 bot. Used alpha-beta pruning but it's thinking is still slow. (Next update will solve that)

These challenges helped me understand why chess engines are usually built in layers.
```

## Key Logic Functions

| Function | File | Purpose |
|--------|------|--------|
| `isMoveAllowed()` | logic.js | Raw piece movement rules |
| `isLegalMove()` | logic.js | Validates move + king safety using board simulation |
| `isCheck()` | logic.js | Detects if a king is under attack |
| `isCheckmate()` | logic.js | King in check with no legal moves |
| `isStalemate()` | logic.js | No legal moves but not in check |
| `getBotMove()` | v2.js | Selects a move with the highest value in the min-max tree|
| `executeBotMove()` | main.js | Applies the bot move |
| `gameStateCheck()` | main.js | Evaluates end-game conditions |
| `renderBoard()` | ui.js | Updates board UI |

````
````
### Move flow

Player clicks → main.js
→ isLegalMove() checks rules + king safety
→ move() updates boardState
→ renderBoard() repaints UI
→ turnSwitch() flips turn
→ gameStateCheck() checks for check/checkmate/stalemate/draw
→ Bot triggers if it's it turn

### Tools used while building
AI for UI and research 
Youtube for understanding the minmax algorithm for v2bot

## Built By

**ZICO** — [@IsaacDev](https://isaacdev-portfolio.vercel.app)

```

```
