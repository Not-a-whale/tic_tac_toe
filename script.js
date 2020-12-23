const statusDiv = document.querySelector(".status");
const resetDiv = document.querySelector(".reset");
const cellDivs = document.querySelectorAll(".game-cell");
const activeCell = document.querySelector(".active");

document.addEventListener("keydown", (e) => move(e.keyCode));

let winCombos = [
  [0, 4, 8],
  [2, 4, 6],
  [3, 4, 5],
  [1, 4, 7],
  [6, 7, 8],
  [0, 3, 6],
  [2, 5, 8],
  [0, 1, 2],
];

let isCellFourPlayed = false;

// game constants

const xSymbol = "✗";
const oSymbol = "○";

let currentPlayerSymbol = xSymbol;
let gameIsRunning = true;
let lastCell = 0;
let currentCell = 0;

let winCombinatingOwnedCellsAi = [0, 0, 0, 0, 0, 0, 0, 0];
let winCombinatingOwnedCellsPerson = [0, 0, 0, 0, 0, 0, 0, 0];
let digitToWinComboIndex = [
  [0, 5, 7, -1],
  [3, 7, -1, -1],
  [1, 6, 7, -1],
  [2, 5, -1, -1],
  [0, 1, 2, 3],
  [2, 6, -1, -1],
  [1, 4, 5, -1],
  [3, 4, -1, -1],
  [0, 4, 6, -1],
];
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
  let currentWinCombinatingOwnedCell =
    currentPlayerSymbol === xSymbol
      ? winCombinatingOwnedCellsPerson
      : winCombinatingOwnedCellsAi;
  for (let i = 0; i < currentWinCombinatingOwnedCell.length; i++) {
    if (currentWinCombinatingOwnedCell[i] === 3) {
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
      statusDiv.innerHTML =
        currentPlayerSymbol === xSymbol
          ? `${currentPlayerSymbol} is next`
          : `<span>${currentPlayerSymbol} is next</span>`;
    }
  }
};

// event Handlers
const handleReset = (e) => {
  currentPlayerSymbol = xSymbol;
  statusDiv.innerHTML = `${currentPlayerSymbol} is next`;
  lastCell = 0;
  currentCell = 0;
  cellDivs.forEach((div) => {
    div.classList.replace("active", "inactive");
  });
  for (const cellDiv of cellDivs) {
    cellDiv.classList.remove("x");
    cellDiv.classList.remove("o");
    cellDiv.classList.remove("won");
  }
  cellDivs[0].classList.replace("inactive", "active");
  winCombinatingOwnedCellsAi = [0, 0, 0, 0, 0, 0, 0, 0];
  winCombinatingOwnedCellsPerson = [0, 0, 0, 0, 0, 0, 0, 0];
  isCellFourPlayed = false;
  gameIsRunning = true;
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
    if (currentCell === 4) isCellFourPlayed = true;

    digitToWinComboIndex[currentCell].forEach((elem) => {
      if (elem > -1) winCombinatingOwnedCellsPerson[elem] += 1;
    });

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
      let nextMoveCell = getNextAiCell();
      cellDivs[nextMoveCell].classList.add(getClassForSymbol(oSymbol));

      digitToWinComboIndex[nextMoveCell].forEach((elem) => {
        if (elem > -1) winCombinatingOwnedCellsAi[elem] += 1;
      });
      checkGameStatus();
    }
  }, 300);
};

const getNextAiCell = () => {
  if (!isCellFourPlayed) {
    isCellFourPlayed = true;
    return 4;
  }
  let cellToLock = -1;
  // quick check for the penultimate step to win
  for (let i = 0; i < 8; i++) {
    if (
      winCombinatingOwnedCellsAi[i] === 2 &&
      winCombinatingOwnedCellsPerson[i] === 0
    )
      return getFirstFreeCell(i);
    if (
      winCombinatingOwnedCellsPerson[i] === 2 &&
      winCombinatingOwnedCellsAi[i] === 0
    )
      cellToLock = getFirstFreeCell(i);
  }
  if (cellToLock > -1) return cellToLock;

  // variables for the best winning line
  let bestAiWinLineIndex = -1;
  let isFullyAiLine = false;

  // looping through winning combos
  for (let i = 0; i < 8; i++) {
    // check for a free cell
    if (winCombinatingOwnedCellsAi[i] + winCombinatingOwnedCellsPerson[i] < 3) {
      let currentLineIsFullyAiLine = winCombinatingOwnedCellsPerson[i] === 0;
      if (bestAiWinLineIndex === -1) {
        bestAiWinLineIndex = i;
        isFullyAiLine = currentLineIsFullyAiLine;
      }
      // finding the cell with the biggest possible score with "clean" line; "clean" - without player.
      if (
        winCombinatingOwnedCellsAi[i] >
          winCombinatingOwnedCellsAi[bestAiWinLineIndex] &&
        (currentLineIsFullyAiLine || !isFullyAiLine)
      ) {
        bestAiWinLineIndex = i;
        cellToLock = -1;
        isFullyAiLine = currentLineIsFullyAiLine;
      }
    }
    // checking for the chance to break player's advantage
    if (
      winCombinatingOwnedCellsAi[i] ===
      winCombinatingOwnedCellsAi[bestAiWinLineIndex]
    ) {
      for (let j = 0; j < 3, cellToLock === -1; j++) {
        if (!cellDivs[winCombos[i][j]].classList[3]) {
          let currentCellToCheck = winCombos[i][j];
          for (let k = 0; k < 4; k++) {
            let possiblePersonLineIndex =
              digitToWinComboIndex[currentCellToCheck][k];
            if (
              possiblePersonLineIndex > -1 &&
              winCombinatingOwnedCellsAi[possiblePersonLineIndex] === 0 &&
              winCombinatingOwnedCellsPerson[possiblePersonLineIndex] > 0
            ) {
              bestAiWinLineIndex = i;
              cellToLock = currentCellToCheck;
              break;
            }
          }
        }
      }
    }
    // making a move to "break" player's line
    if (cellToLock > -1) return cellToLock;

    // making a move based on all previous filters
    console.log(bestAiWinLineIndex);
    return getFirstFreeCell(bestAiWinLineIndex);
  }
};

const getFirstFreeCell = (winComboRowIndex) => {
  for (let j = 0; j < 3; j++) {
    if (!cellDivs[winCombos[winComboRowIndex][j]].classList[3])
      return winCombos[winComboRowIndex][j];
  }
};

const emptySquares = (elems) => {
  return Array.from(elems).filter((div) => !div.classList[3]);
};

for (const cellDiv of cellDivs) {
  cellDiv.addEventListener("click", handleCellClick);
}
