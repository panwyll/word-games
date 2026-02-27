import { getDailySeed, seededRng } from './daily';

export type SudokuCell = number | null;
export type SudokuGrid = SudokuCell[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

const GRID_SIZE = 9;
const BOX_SIZE = 3;

/**
 * Check if a number can be placed in a specific position
 */
function isValid(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

/**
 * Solve the Sudoku puzzle using backtracking
 */
function solveSudoku(grid: SudokuGrid): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= GRID_SIZE; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Generate a complete valid Sudoku solution using seeded randomness
 */
function generateSolution(rng: () => number): SudokuGrid {
  const grid: SudokuGrid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));

  // Fill diagonal 3x3 boxes first (they don't affect each other)
  for (let box = 0; box < GRID_SIZE; box += BOX_SIZE) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle using seeded RNG
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let numIdx = 0;
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        grid[box + i][box + j] = numbers[numIdx++];
      }
    }
  }

  // Solve the rest
  solveSudoku(grid);
  return grid;
}

/**
 * Remove numbers from a complete grid to create a puzzle
 */
function createPuzzle(solution: SudokuGrid, difficulty: Difficulty, rng: () => number): SudokuGrid {
  const puzzle = solution.map((row) => [...row]);

  // Number of cells to remove based on difficulty
  const cellsToRemove = {
    easy: 35,
    medium: 45,
    hard: 55,
  }[difficulty];

  // Create array of all positions
  const positions: [number, number][] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions using seeded RNG
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Remove numbers
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = null;
  }

  return puzzle;
}

/**
 * Generate a daily Sudoku puzzle
 */
export function generateDailySudoku(difficulty: Difficulty = 'medium'): {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
} {
  const seed = getDailySeed();
  const rng = seededRng(seed + difficulty.charCodeAt(0)); // Add difficulty to seed for variation

  const solution = generateSolution(rng);
  const puzzle = createPuzzle(solution, difficulty, rng);

  return { puzzle, solution };
}

/**
 * Check if the player's grid is correct
 */
export function checkSolution(playerGrid: SudokuGrid, solution: SudokuGrid): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (playerGrid[i][j] !== solution[i][j]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if a move is valid (doesn't conflict with existing numbers)
 */
export function isMoveValid(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  return isValid(grid, row, col, num);
}

/**
 * Get conflicts for a specific cell (for hints)
 */
export function getCellConflicts(
  grid: SudokuGrid,
  row: number,
  col: number
): { rows: number[]; cols: number[]; box: [number, number][] } {
  const num = grid[row][col];
  if (num === null) return { rows: [], cols: [], box: [] };

  const conflicts = { rows: [] as number[], cols: [] as number[], box: [] as [number, number][] };

  // Check row conflicts
  for (let x = 0; x < GRID_SIZE; x++) {
    if (x !== col && grid[row][x] === num) {
      conflicts.rows.push(x);
    }
  }

  // Check column conflicts
  for (let x = 0; x < GRID_SIZE; x++) {
    if (x !== row && grid[x][col] === num) {
      conflicts.cols.push(x);
    }
  }

  // Check 3x3 box conflicts
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      const r = i + startRow;
      const c = j + startCol;
      if ((r !== row || c !== col) && grid[r][c] === num) {
        conflicts.box.push([r, c]);
      }
    }
  }

  return conflicts;
}
