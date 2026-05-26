class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    }
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }

    // check for non-digit (1–9) or non-period characters
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    return true;
  }

  buildBoard(puzzleString) {
    const board = [];
    // split the 81-character string into a 9x9 2D array of rows
    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, (i + 1) * 9).split(""));
    }
    return board;
  }

  checkRowPlacement(board, row, column, value) {
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === value && c !== column) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(board, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (board[r][column] === value && r !== row) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(board, row, column, value) {
    // locate the top-left corner index of the 3x3 sub-grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === value && !(r === row && c === column)) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) return validation;

    const board = this.buildBoard(puzzleString);

    // verify initial board state has no conflicting pre-filled numbers
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== ".") {
          const val = board[r][c];
          if (
            !this.checkRowPlacement(board, r, c, val) ||
            !this.checkColPlacement(board, r, c, val) ||
            !this.checkRegionPlacement(board, r, c, val)
          ) {
            return { error: "Puzzle cannot be solved" };
          }
        }
      }
    }

    // backtracking algorithm to recursively find a valid solution
    const solveBoard = () => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === ".") {
            for (let num = 1; num <= 9; num++) {
              const val = String(num);
              if (
                this.checkRowPlacement(board, r, c, val) &&
                this.checkColPlacement(board, r, c, val) &&
                this.checkRegionPlacement(board, r, c, val)
              ) {
                board[r][c] = val;
                if (solveBoard()) return true;
                // backtrack if guess leads to an unsolveable path
                board[r][c] = ".";
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    if (!solveBoard()) {
      return { error: "Puzzle cannot be solved" };
    }

    return { solution: board.flat().join("") };
  }
}

module.exports = SudokuSolver;
