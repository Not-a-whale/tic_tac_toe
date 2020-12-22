const statusDiv = document.querySelector(".status");
const resetDiv = document.querySelector(".reset");
const cellDivs = document.querySelectorAll(".game-cell");
const activeCell = document.querySelector(".active");

document.addEventListener("keydown", (e) => move(e.keyCode));

let winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

let newElem = 0;

let huPlayer = "x";
let aiPlayer = "o";

// game constants

const xSymbol = "✗";
const oSymbol = "○";
let currentPlayerSymbol = xSymbol;

let gameIsRunning = true;
let winner = null;
let lastCell = 0;
let currentCell = 0;

// functions
const move = (keyCode) => {
  if (gameIsRunning) {
    let key = null;

    switch (event.keyCode) {
      case 38:
        key = "up";
        break;
      case 40:
        key = "down";
        break;
      case 37:
        key = "left";
        break;
      case 39:
        key = "right";
        break;
      case 13:
        key = "return";
    }

    if (key === "up") {
      if (currentCell > 2) currentCell -= 3;
    } else if (key === "down") {
      if (currentCell < 6) currentCell += 3;
    } else if (key === "right") {
      if (currentCell % 3 < 2) currentCell += 1;
    } else if (key === "left") {
      if (currentCell % 3 > 0) currentCell -= 1;
    } else if (key === "return") {
      handleCellClick(false, currentCell);
    }

    updateActiveCell();
  }
};

const letterToSymbol = (letter) => {
  return letter === "x" ? xSymbol : oSymbol;
};

const getClassForSymbol = (letter) => {
  return letter === xSymbol ? "x" : "o";
};

const checkGameStatus = () => {
  for (let i = 0; i < winCombos.length; i++) {
    if (
      cellDivs[winCombos[i][0]].classList[3] &&
      cellDivs[winCombos[i][0]].classList[3] ===
        cellDivs[winCombos[i][1]].classList[3] &&
      cellDivs[winCombos[i][0]].classList[3] ===
        cellDivs[winCombos[i][2]].classList[3]
    ) {
      gameIsRunning = false;
      for (let j = 0; j < 3; j++) {
        cellDivs[winCombos[i][j]].classList.add("won");
      }
      statusDiv.innerHTML =
        currentPlayerSymbol === xSymbol
          ? `${currentPlayerSymbol} has won!`
          : `<span>${currentPlayerSymbol} has won!</span>`;
      break;
    }
  }
  if (gameIsRunning) {
    if (emptySquares(cellDivs).length === 0) {
      gameIsRunning = false;
      statusDiv.innerHTML = "Game is tied!";
    } else {
      currentPlayerSymbol = currentPlayerSymbol === xSymbol ? oSymbol : xSymbol;
      status.innerHTML =
        currentPlayerSymbol === xSymbol
          ? `${currentPlayerSymbol} is next`
          : `<span>${currentPlayerSymbol} is next</span>`;
    }
  }
};

// event Handlers
const handleReset = (e) => {
  xIsNext = true;
  statusDiv.innerHTML = `${letterToSymbol(xSymbol)} is next`;
  winner = null;
  gameIsRunning = true;
  cellDivs.forEach((div) => {
    div.classList.replace("active", "inactive");
  });
  for (const cellDiv of cellDivs) {
    cellDiv.classList.remove("x");
    cellDiv.classList.remove("o");
    cellDiv.classList.remove("won");
  }
  cellDivs[0].classList.replace("inactive", "active");
};
// event listeners

resetDiv.addEventListener("click", handleReset);

const handleCellClick = (e, elem) => {
  if (gameIsRunning) {
    let classList = e ? e.target.classList : cellDivs[elem].classList;

    if (classList[3] === "x" || classList[3] === "o") {
      return;
    }
    classList.add(getClassForSymbol(currentPlayerSymbol));

    if (e) {
      currentCell = parseInt(e.target.classList[1]);
      updateActiveCell();
    }

    checkGameStatus();

    // Turn of the ai

    aiTurn();
  }
};

const updateActiveCell = () => {
  cellDivs[lastCell].classList.replace("active", "inactive");
  cellDivs[currentCell].classList.replace("inactive", "active");
  lastCell = currentCell;
};

const aiTurn = () => {
  window.setTimeout(() => {
    if (gameIsRunning) {
      let availableSpots = emptySquares(cellDivs);
      availableSpots[bestSpot(availableSpots)].classList.add(
        getClassForSymbol(oSymbol)
      );
      checkGameStatus();
    }
  }, 300);
};

const emptySquares = (elems) => {
  return Array.from(elems).filter((div) => !div.classList[3]);
};

const bestSpot = (origBoard) => {
  return minimax([...cellDivs], true);
};

const checkWin = (board, player) => {
  console.log(board);
  const aiMoves = board.reduce(
    (a, e, i) => (e.classList[3] === player ? a.concat(i.toString()) : a),
    []
  );

  console.log(aiMoves);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => aiMoves.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
};

function minimax(newBoard, player) {
  let availSpots = emptySquares(newBoard, player);
  return 0;
  /*   console.log(availSpots);
  if (checkWin([...newBoard], huPlayer)) {
    return { score: -10 };
  } else if (checkWin([...newBoard], aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  const moves = [];
  console.log(moves);
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = newBoard[availSpots[i]];
    console.log(availSpots[i]);
    newBoard[availSpots[i].classList[3]] = player;

    if (player == aiPlayer) {
      let result = minimax(newBoard, huPlayer);
      console.log(result);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
      console.log(result);
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove]; */
}

for (const cellDiv of cellDivs) {
  cellDiv.addEventListener("click", handleCellClick);
}
