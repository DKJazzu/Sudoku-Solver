const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const result = solver.validate(puzzle);
    assert.strictEqual(result, true);
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....X.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const result = solver.validate(puzzle);
    assert.deepEqual(result, { error: "Invalid characters in puzzle" });
  });

  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37";
    const result = solver.validate(puzzle);
    assert.deepEqual(result, {
      error: "Expected puzzle to be 81 characters long",
    });
  });

  test("Logic handles a valid row placement", () => {
    const puzzle =
      ".................................................................................";
    const board = solver.buildBoard(puzzle);
    const result = solver.checkRowPlacement(board, 0, 0, "1");
    assert.strictEqual(result, true);
  });

  test("Logic handles an invalid row placement", () => {
    const puzzle =
      "1................................................................................";
    const board = solver.buildBoard(puzzle);
    const result = solver.checkRowPlacement(board, 0, 1, "1");
    assert.strictEqual(result, false);
  });

  test("Logic handles a valid column placement", () => {
    const puzzle =
      ".................................................................................";
    const board = solver.buildBoard(puzzle);
    const result = solver.checkColPlacement(board, 0, 0, "2");
    assert.strictEqual(result, true);
  });

  test("Logic handles an invalid column placement", () => {
    const puzzle =
      "2................................................................................";
    const board = solver.buildBoard(puzzle);
    const result = solver.checkColPlacement(board, 1, 0, "2");
    assert.strictEqual(result, false);
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    const puzzle =
      ".................................................................................";
    const board = solver.buildBoard(puzzle);
    const result = solver.checkRegionPlacement(board, 0, 0, "3");
    assert.strictEqual(result, true);
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    const puzzle =
      "3................................................................................";
    const board = solver.buildBoard(puzzle);
    const result = solver.checkRegionPlacement(board, 1, 1, "3");
    assert.strictEqual(result, false);
  });

  test("Valid puzzle strings pass the solver", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const result = solver.solve(puzzle);
    assert.property(result, "solution");
    assert.strictEqual(result.solution.length, 81);
  });

  test("Invalid puzzle strings fail the solver", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....X.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const result = solver.solve(puzzle);
    assert.deepEqual(result, { error: "Invalid characters in puzzle" });
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const expected =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    const result = solver.solve(puzzle);
    assert.strictEqual(result.solution, expected);
  });

  test("Solver returns error for unsolvable puzzle", () => {
    const puzzle =
      "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const result = solver.solve(puzzle);
    assert.deepEqual(result, { error: "Puzzle cannot be solved" });
  });
});
