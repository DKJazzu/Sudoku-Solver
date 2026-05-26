"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  // handle full sudoku puzzle solving requests
  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    const validation = solver.validate(puzzle);
    if (validation !== true) {
      return res.json(validation);
    }

    const result = solver.solve(puzzle);
    return res.json(result);
  });

  // validate if a single value can be placed at a specific coordinate
  app.route("/api/check").post((req, res) => {
    let { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    value = String(value);

    const validation = solver.validate(puzzle);
    if (validation !== true) {
      return res.json(validation);
    }

    // validate coordinate format
    const coordRegex = /^[A-I][1-9]$/i;
    if (!coordRegex.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    // parse coordinate string into zero‑indexed row and column values
    const rowChar = coordinate[0].toUpperCase();
    const row = rowChar.charCodeAt(0) - "A".charCodeAt(0);
    const col = parseInt(coordinate[1], 10) - 1;
    const board = solver.buildBoard(puzzle);

    // valid if target cell already contains the requested value
    if (board[row][col] === value) {
      return res.json({ valid: true });
    }

    // evaluate standard sudoku placement rules to identify any conflicts
    const conflicts = [];
    if (!solver.checkRowPlacement(board, row, col, value))
      conflicts.push("row");
    if (!solver.checkColPlacement(board, row, col, value))
      conflicts.push("column");
    if (!solver.checkRegionPlacement(board, row, col, value))
      conflicts.push("region");

    if (conflicts.length === 0) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, conflict: conflicts });
    }
  });
};
