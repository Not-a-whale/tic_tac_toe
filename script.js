const statusDiv = document.querySelector(".status");
const resetDiv = document.querySelector(".reset");
const cellDivs = document.querySelectorAll(".game-cell");
const activeCell = document.querySelector(".active");
const buttons = document.querySelectorAll(".buttons__button");
const blockedModules = document.querySelectorAll(".field");

document.addEventListener("keydown", (e) => {
  preventDefaultScroll(e);
  chooseSide(e.keyCode);
});
//All possible winning combinations
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

let chosenPlayer = "x";

let keyEnum = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  return: 13,
  reset: 27,
  space: 32,
};
let currentPlayerSymbol = xSymbol;
let gameIsRunning = false;
let lastCell = 0;
let currentCell = 0;

// counters for winning combinations
let winCombinatingOwnedCellsAi = [0, 0, 0, 0, 0, 0, 0, 0];
let winCombinatingOwnedCellsPerson = [0, 0, 0, 0, 0, 0, 0, 0];

// I wich wincombos a number is present
let digitToWinComboIndex = [
  [0, 5, 7, -1], // 0
  [3, 7, -1, -1], // 1
  [1, 6, 7, -1], // 2
  [2, 5, -1, -1], // 3
  [0, 1, 2, 3], // 4
  [2, 6, -1, -1], // 5
  [1, 4, 5, -1], // 6
  [3, 4, -1, -1], // 7
  [0, 4, 6, -1], // 8
];
// functions
const preventDefaultScroll = (e) => {
  if (
    [
      keyEnum.space,
      keyEnum.left,
      keyEnum.up,
      keyEnum.right,
      keyEnum.down,
    ].indexOf(e.keyCode) > -1
  ) {
    e.preventDefault();
    move(e.keyCode);
  } else {
    move(e.keyCode);
  }
};

const move = (key) => {
  if (key === keyEnum.reset) {
    handleReset();
  }
  if (gameIsRunning) {
    if (key === keyEnum.up) {
      if (currentCell > 2) currentCell -= 3;
    } else if (key === keyEnum.down) {
      if (currentCell < 6) currentCell += 3;
    } else if (key === keyEnum.right) {
      if (currentCell % 3 < 2) currentCell += 1;
    } else if (key === keyEnum.left) {
      if (currentCell % 3 > 0) currentCell -= 1;
    } else if (key === keyEnum.return) {
      handleCellClick(false, currentCell);
    }

    updateActiveCell();
  }
};

const chooseSide = (key, letter) => {
  //
  if (!gameIsRunning) {
    if (key === keyEnum.right || letter === "o") {
      buttons[0].classList.replace("button-active", "button-inactive");
      buttons[1].classList.replace("button-inactive", "button-active");
      chosenPlayer = getClassForSymbol(oSymbol);
      currentPlayerSymbol = oSymbol;
      console.log(currentPlayerSymbol);
    } else if (key === keyEnum.left || letter === "x") {
      console.log(keyEnum.left);
      buttons[0].classList.replace("button-inactive", "button-active");
      buttons[1].classList.replace("button-active", "button-inactive");
      chosenPlayer = getClassForSymbol(xSymbol);

      currentPlayerSymbol = xSymbol;
      console.log(currentPlayerSymbol);
    }

    if (key === keyEnum.return || letter) {
      gameIsRunning = true;
      blockedModules[0].classList.replace("blocked", "unblocked");
      blockedModules[1].classList.replace("unblocked", "blocked");
      switchSides(chosenPlayer);
    }
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
  gameIsRunning = false;
  blockedModules[1].classList.replace("blocked", "unblocked");
  blockedModules[0].classList.replace("unblocked", "blocked");
  chosenPlayer = undefined;
};
// event listeners

resetDiv.addEventListener("click", handleReset);

// function that handles person's click :)

let handleCellClick = (e, elem) => {
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

function switchSides(player) {
  console.log(player);
  if (player === "o") {
    aiTurn();
    console.log(player);
  } else if (chosenPlayer === "x") {
  }
}

const updateActiveCell = () => {
  cellDivs[lastCell].classList.replace("active", "inactive");
  cellDivs[currentCell].classList.replace("inactive", "active");
  lastCell = currentCell;
};

const aiTurn = () => {
  window.setTimeout(() => {
    if (gameIsRunning) {
      let nextMoveCell = getNextAiCell();
      if (cellDivs[nextMoveCell]) {
        cellDivs[nextMoveCell].classList.add(getClassForSymbol(oSymbol));
      }

      digitToWinComboIndex[nextMoveCell].forEach((elem) => {
        if (elem > -1) winCombinatingOwnedCellsAi[elem] += 1;
      });
      checkGameStatus();
    }
  }, 300);
};

const getNextAiCell = () => {
  console.log(winCombinatingOwnedCellsAi, winCombinatingOwnedCellsPerson);
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
  if (winCombinatingOwnedCellsPerson[4] === 2) {
    cellToLock = getFirstFreeCell(4);
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

      // checking for the chance to break player's advantage
      if (
        winCombinatingOwnedCellsAi[i] ===
        winCombinatingOwnedCellsAi[bestAiWinLineIndex]
      ) {
        console.log(
          winCombinatingOwnedCellsAi[i],
          winCombinatingOwnedCellsAi[bestAiWinLineIndex]
        );
        for (let j = 0; j < 3 && cellToLock === -1; j++) {
          console.log(cellDivs[winCombos[i][j]]);
          if (!cellDivs[winCombos[i][j]].classList[3]) {
            console.log(!cellDivs[winCombos[i][j]].classList[3]);
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

for (const button of buttons) {
  button.addEventListener("click", (e) => {
    console.log(e.target.classList[1], switchSides);
    chooseSide(false, e.target.classList[1]);
  });
}
