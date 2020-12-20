const statusDiv = document.querySelector(".status");
const resetDiv = document.querySelector(".reset");
const cellDivs = document.querySelectorAll(".game-cell");

console.log(statusDiv);

let gameIsRunning = true;
let xIsNext = true;

// event Handlers

// event listeners

const handleReset = (e) => {};

resetDiv.addEventListener("click", handleReset);

const handleCellClick = (e) => {
  const classList = e.target.classList;
  const location = classList[1];
  console.log(classList);

  if (classList[2] === "x" || classList[2] === "o") {
    return;
  }

  if (xIsNext) {
    console.log("x");
    classList.add("x");
    xIsNext = !xIsNext;
  } else {
    console.log("o");
    classList.add("o");
    xIsNext = !xIsNext;
  }
};

for (const cellDiv of cellDivs) {
  cellDiv.addEventListener("click", handleCellClick);
}
