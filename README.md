# chess-engine
JavaScript chess engine with legal move validation, castling, en passant, promotion, and a random-move bot. No frameworks, no libraries — vanilla JS.

# Chess Bot

A vanilla JavaScript chess engine with a built-in bot. No frameworks, no libraries — just HTML, CSS, and JS.

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
- Random-move bot (V1)

## Project Structure

```
├── index.html       # Board markup
├── style.css        # Board and piece styling
├── logic.js         # Chess rules (move validation, check, castling, etc.)
├── ui.js            # Rendering, highlighting, board display
├── v1bot.js         # Bot logic (random legal mover)
├── main.js          # Game loop, event listeners, state management
└── pieces/          # SVG piece images
```

## How It Works

### Move flow
```
Player clicks → main.js
    → isLegalMove() checks rules + king safety
    → move() updates boardState
    → renderBoard() repaints UI
    → turnSwitch() flips turn
    → gameStateCheck() checks for check/checkmate/stalemate/draw
    → Bot triggers if it's black's turn
```

### Key functions

| Function | File | Job |
|---|---|---|
| `isMoveAllowed()` | logic.js | Raw piece movement rules |
| `isLegalMove()` | logic.js | Rules + king safety (clones board to simulate) |
| `isCheck()` | logic.js | Is the current player's king under attack? |
| `isCheckmate()` | logic.js | In check with no legal moves? |
| `isStalemate()` | logic.js | Not in check but no legal moves? |
| `getBotMove()` | v1bot.js | Picks a random legal move for the bot |
| `executeBotMove()` | main.js | Executes the bot's chosen move |
| `gameStateCheck()` | main.js | Runs all end-condition checks after every move |
| `renderBoard()` | ui.js | Repaints the board from boardState |

## Script Load Order

Scripts must load in this order or functions won't exist when called:

```html
<script src="logic.js"></script>
<script src="v1bot.js"></script>
<script src="ui.js"></script>
<script src="main.js"></script>
```

## Piece Images

Drop SVG piece files into a `pieces/` folder in the project root. Expected filenames:

```
wK.svg wQ.svg wR.svg wB.svg wN.svg wP.svg
bK.svg bQ.svg bR.svg bB.svg bN.svg bP.svg
```

Recommended source: [Lichess Cburnett pieces](https://github.com/lichess-org/lila/tree/master/public/piece/cburnett)

## Roadmap

- [ ] Promotion modal (replace `prompt()`)
- [ ] Move history panel
- [ ] V2 bot — minimax with piece value evaluation
- [ ] Alpha-beta pruning
- [ ] Board flip for black
- [ ] Game timer

## Built By

**ZICO** — [@IsaacDev](https://zico-brand.vercel.app)
