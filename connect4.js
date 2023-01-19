// set board dimensions
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // start with player 1
let board = []; // define and initialize the board

function makeBoard() {
  // creates a 2d array with dimensions specified by width and height and assigns it to the board
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({
      length: WIDTH
    }));
  }
}

function makeHtmlBoard() {
  const board = document.getElementById('board');
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    // creates the head cell where the player can click and drop in the token
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  board.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    // creates the board rows
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

function findSpotForCol(x) {
  // takes in a column number as a parameter and returns the first empty spot in that column
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}


function placeInTable(y, x) {
  // takes in row and column coordinates (column, row) and visually places a piece on the html table
  const piece = document.createElement('div'); // creates piece
  piece.classList.add('piece'); // adds class "piece"
  piece.classList.add(`p${currPlayer}`); // changes color depending on which player is current
  piece.style.top = -50 * (y + 2); // puts the piece in the right spot on the board.  
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece); // visualizes the piece
}

function endGame(msg) {
  // takes a message as a param and creates an alert in document window
  alert(msg);
}

function handleClick(evt) {
  // called when user clicks on a column
  const x = +evt.target.id;
  // targets the row of spots that can be clicked
  const y = findSpotForCol(x);
  // finds a spot to put the piece
  if (y === null) {
    return;
  }
  board[y][x] = currPlayer;
  placeInTable(y, x);
  // checks for 4 in a row
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('tie');
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1; // check if 1 or 2, else 1
}

function checkForWin() {
  // checks for win, in various ways
  function _win(cells) {
    // uses below calculations to calculate all possible win scenarios
    return cells.every(
      ([y, x]) =>
      y >= 0 &&
      y < HEIGHT &&
      x >= 0 &&
      x < WIDTH &&
      board[y][x] === currPlayer
    );
  }

  // maps the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];
      // all of the different ways to win
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();