const statusDiv = document.querySelector(".status");
const resetDiv = document.querySelector(".reset");
const cellDivs = document.querySelectorAll(".game-cell");
const activeCell = document.querySelector(".active");

document.addEventListener("keydown", (e) => move(e.keyCode));

let matrix = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

let winCombos = [
  ["0", "1", "2"],
  ["3", "4", "5"],
  ["6", "7", "8"],
  ["0", "3", "6"],
  ["1", "4", "7"],
  ["2", "5", "8"],
  ["0", "4", "8"],
  ["6", "4", "2"],
];

let currentX = 0;
let currentY = 0;
let newElem = matrix[currentY][currentX];

let huPlayer = "x";
let aiPlayer = "o";

// game constants

const xSymbol = "✗";
const oSymbol = "○";

let gameIsRunning = true;
let xIsNext = true;
let winner = null;

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
      currentY--;
      if (currentY < 0) {
        currentY = 0;
      }
      newElem = matrix[currentY][currentX];
    } else if (key === "down") {
      currentY++;
      if (currentY > 2) {
        currentY = 2;
      }
      newElem = matrix[currentY][currentX];
    } else if (key === "right") {
      currentX++;
      if (currentX > 2) {
        currentX = 2;
      }
      newElem = matrix[currentY][currentX];
    } else if (key === "left") {
      currentX--;
      if (currentX < 0) {
        currentX = 0;
      }
      newElem = matrix[currentY][currentX];
    } else if (key === "return") {
      handleCellClick(false, newElem);
    }

    cellDivs.forEach((div) => {
      div.classList.replace("active", "inactive");
      if (div.classList[1] === newElem) {
        div.classList.replace("inactive", "active");
      }
    });
  }
};

const letterToSymbol = (letter) => {
  return letter === "x" ? xSymbol : oSymbol;
};

const handleWin = (letter) => {
  gameIsRunning = false;
  winner = letter;

  if (winner === "x") {
    statusDiv.innerHTML = `${letterToSymbol(winner)} has won!`;
  } else {
    statusDiv.innerHTML = `<span>${letterToSymbol(winner)} has won!</span>`;
  }
};

const checkGameStatus = () => {
  const topLeft = cellDivs[0].classList[3];
  const topMiddle = cellDivs[1].classList[3];
  const topRight = cellDivs[2].classList[3];
  const middleLeft = cellDivs[3].classList[3];
  const middleMiddle = cellDivs[4].classList[3];
  const middleRight = cellDivs[5].classList[3];
  const bottomLeft = cellDivs[6].classList[3];
  const bottomMiddle = cellDivs[7].classList[3];
  const bottomRight = cellDivs[8].classList[3];

  // check a winner

  if (topLeft && topLeft === topMiddle && topLeft === topRight) {
    handleWin(topLeft);
    cellDivs[0].classList.add("won");
    cellDivs[1].classList.add("won");
    cellDivs[2].classList.add("won");
  } else if (
    middleLeft &&
    middleLeft === middleMiddle &&
    middleLeft === middleRight
  ) {
    handleWin(middleLeft);
    cellDivs[3].classList.add("won");
    cellDivs[4].classList.add("won");
    cellDivs[5].classList.add("won");
  } else if (
    bottomLeft &&
    bottomLeft === bottomMiddle &&
    bottomLeft === bottomRight
  ) {
    handleWin(bottomLeft);
    cellDivs[6].classList.add("won");
    cellDivs[7].classList.add("won");
    cellDivs[8].classList.add("won");
  } else if (topLeft && topLeft === middleLeft && topLeft === bottomLeft) {
    handleWin(topLeft);
    cellDivs[0].classList.add("won");
    cellDivs[3].classList.add("won");
    cellDivs[6].classList.add("won");
  } else if (
    topMiddle &&
    topMiddle === middleMiddle &&
    topMiddle === bottomMiddle
  ) {
    handleWin(topMiddle);
    cellDivs[1].classList.add("won");
    cellDivs[4].classList.add("won");
    cellDivs[7].classList.add("won");
  } else if (topRight && topRight === middleRight && topRight === bottomRight) {
    handleWin(topRight);
    cellDivs[2].classList.add("won");
    cellDivs[5].classList.add("won");
    cellDivs[8].classList.add("won");
  } else if (topLeft && topLeft === middleMiddle && topLeft === bottomRight) {
    handleWin(topLeft);
    cellDivs[0].classList.add("won");
    cellDivs[4].classList.add("won");
    cellDivs[8].classList.add("won");
  } else if (topRight && topRight === middleMiddle && topRight === bottomLeft) {
    handleWin(topRight);
    cellDivs[2].classList.add("won");
    cellDivs[4].classList.add("won");
    cellDivs[6].classList.add("won");
  } else if (
    topLeft &&
    topMiddle &&
    topRight &&
    middleLeft &&
    middleMiddle &&
    middleRight &&
    bottomMiddle &&
    bottomRight &&
    bottomLeft
  ) {
    gameIsRunning = false;
    statusDiv.innerHTML = "Game is tied!";
  } else {
    xIsNext = !xIsNext;
    if (xIsNext) {
      statusDiv.innerHTML = `${letterToSymbol("x")} is next`;
    } else {
      statusDiv.innerHTML = `<span>${letterToSymbol(oSymbol)} is next</span>`;
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
    let classList;
    if (e) {
      classList = e.target.classList;
    } else if (elem) {
      cellDivs.forEach((div) => {
        if (Array.from(div.classList).includes(elem)) {
          classList = div.classList;
        }
      });
    }

    if (!gameIsRunning || classList[3] === "x" || classList[3] === "o") {
      return;
    }

    if (xIsNext) {
      classList.add("x");
      checkGameStatus();
    } else {
      classList.add("o");
      checkGameStatus();
    }

    if (e.target) {
      cellDivs.forEach((div) => {
        div.classList.replace("active", "inactive");
      });
      e.target.classList.replace("inactive", "active");
    }
    aiTurn();
  }
};

const aiTurn = () => {
  window.setTimeout(() => {
    if (gameIsRunning) {
      let availableSpots = emptySquares(cellDivs);

      if (xIsNext) {
        availableSpots[0].classList.add("x");
        checkGameStatus();
      } else {
        availableSpots[bestSpot(availableSpots)].classList.add("o");
        checkGameStatus();
      }
    }
  }, 300);
};

const emptySquares = (elems) => {
  return Array.from(elems).filter((div, index) => {
    return !div.classList[3];
  });
};

const bestSpot = (origBoard) => {
  let isAi = xIsNext ? "x" : "o";
  return minimax([...cellDivs], isAi);
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
  console.log(availSpots);
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

  return moves[bestMove];
}

for (const cellDiv of cellDivs) {
  cellDiv.addEventListener("click", handleCellClick);
}
