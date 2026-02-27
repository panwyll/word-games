import { getDailySeed, seededRng } from './daily';

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
}

export interface CrosswordCell {
  letter: string | null;
  number: number | null;
  isBlack: boolean;
}

export type CrosswordGrid = CrosswordCell[][];

// Sample crossword puzzles
const CROSSWORD_PUZZLES = [
  {
    size: 9,
    grid: [
      ['C', 'A', 'T', '#', 'D', 'O', 'G', '#', 'S'],
      ['O', '#', 'A', '#', 'A', '#', 'O', '#', 'U'],
      ['D', 'A', 'T', 'A', 'Y', '#', 'A', 'T', 'N'],
      ['E', '#', '#', '#', '#', '#', 'L', '#', '#'],
      ['#', 'B', 'O', 'O', 'K', 'S', '#', 'C', 'A'],
      ['#', '#', 'P', '#', '#', '#', '#', 'O', 'R'],
      ['M', 'U', 'S', 'I', 'C', '#', 'T', 'R', 'E'],
      ['A', '#', 'K', '#', 'A', '#', 'I', '#', 'A'],
      ['P', 'I', 'N', 'K', 'E', 'Y', 'M', 'E', 'S'],
    ],
    clues: {
      across: [
        { number: 1, clue: 'Feline pet', answer: 'CAT' },
        { number: 5, clue: 'Canine companion', answer: 'DOG' },
        { number: 9, clue: 'Bright star in the sky', answer: 'SUN' },
        { number: 10, clue: 'Information or facts', answer: 'DATA' },
        { number: 11, clue: 'Opposite of night', answer: 'DAY' },
        { number: 13, clue: 'Consumed food', answer: 'ATE' },
        { number: 15, clue: 'Reading material', answer: 'BOOKS' },
        { number: 17, clue: 'Automobile', answer: 'CAR' },
        { number: 18, clue: 'Melody or rhythm', answer: 'MUSIC' },
        { number: 20, clue: 'Large plant', answer: 'TREE' },
        { number: 21, clue: 'Cartography', answer: 'MAP' },
        { number: 23, clue: 'Eye infections', answer: 'PINKEYES' },
      ],
      down: [
        { number: 1, clue: 'Programming script', answer: 'CODE' },
        { number: 2, clue: 'Addition symbol', answer: 'AT' },
        { number: 3, clue: 'Beverage container', answer: 'TANKARD' },
        { number: 4, clue: 'Breakfast food', answer: 'TOAST' },
        { number: 6, clue: 'Short for optical', answer: 'OPT' },
        { number: 7, clue: 'Objective or target', answer: 'GOAL' },
        { number: 8, clue: 'Song lyrics', answer: 'LINES' },
        { number: 12, clue: 'Yearly publication', answer: 'ALMANAC' },
        { number: 14, clue: 'Small insect', answer: 'TICK' },
        { number: 16, clue: 'Ocean motion', answer: 'OCEAN' },
        { number: 19, clue: 'Shred or rip', answer: 'TEAR' },
      ],
    },
  },
  {
    size: 9,
    grid: [
      ['R', 'A', 'I', 'N', '#', 'S', 'T', 'A', 'R'],
      ['O', '#', '#', 'O', '#', 'H', '#', '#', 'U'],
      ['A', 'P', 'P', 'L', 'E', 'S', '#', 'C', 'N'],
      ['D', '#', '#', 'E', '#', '#', '#', 'A', '#'],
      ['#', 'W', 'I', 'N', 'D', 'O', 'W', 'T', '#'],
      ['#', 'A', '#', '#', '#', 'C', '#', '#', 'T'],
      ['B', 'K', '#', 'S', 'N', 'O', 'W', '#', 'R'],
      ['E', '#', '#', 'U', '#', 'O', '#', '#', 'E'],
      ['A', 'R', 'T', 'N', 'E', 'R', 'S', 'H', 'E'],
    ],
    clues: {
      across: [
        { number: 1, clue: 'Water from clouds', answer: 'RAIN' },
        { number: 5, clue: 'Celestial body', answer: 'STAR' },
        { number: 6, clue: 'Red fruit', answer: 'APPLES' },
        { number: 8, clue: 'Sweet treat', answer: 'CAKE' },
        { number: 9, clue: 'Highway or street', answer: 'ROAD' },
        { number: 10, clue: 'Opening in wall', answer: 'WINDOW' },
        { number: 12, clue: 'Feline pet', answer: 'CAT' },
        { number: 13, clue: 'Awaken', answer: 'WAKE' },
        { number: 14, clue: 'White winter weather', answer: 'SNOW' },
        { number: 16, clue: 'Creative work', answer: 'ART' },
        { number: 17, clue: 'Business alliance', answer: 'PARTNERSHIP' },
      ],
      down: [
        { number: 1, clue: 'Path or route', answer: 'ROAD' },
        { number: 2, clue: 'Creative skill', answer: 'ART' },
        { number: 3, clue: 'Inky fluid', answer: 'INK' },
        { number: 4, clue: 'Polar or grizzly', answer: 'BEAR' },
        { number: 5, clue: 'Scorch or char', answer: 'SEAR' },
        { number: 7, clue: 'Move with wings', answer: 'SOAR' },
        { number: 10, clue: 'Ocean tide', answer: 'WATER' },
        { number: 11, clue: 'Opposite of in', answer: 'OUT' },
        { number: 15, clue: 'Narrative', answer: 'STORY' },
      ],
    },
  },
];

/**
 * Generate a daily crossword puzzle
 */
export function generateDailyCrossword(): {
  grid: CrosswordGrid;
  clues: CrosswordClue[];
  size: number;
} {
  const seed = getDailySeed();
  const puzzleIndex = seed % CROSSWORD_PUZZLES.length;
  const puzzle = CROSSWORD_PUZZLES[puzzleIndex];

  // Convert the string grid to CrosswordCell grid
  const grid: CrosswordGrid = puzzle.grid.map((row) =>
    row.map((cell) => ({
      letter: cell === '#' ? null : cell,
      number: null,
      isBlack: cell === '#',
    }))
  );

  // Assign numbers to cells based on clues
  const clues: CrosswordClue[] = [];
  const numberMap = new Map<string, number>();

  // Process across clues
  puzzle.clues.across.forEach((clue) => {
    let row = -1,
      col = -1;
    // Find the position of the answer in the grid
    for (let r = 0; r < puzzle.size; r++) {
      for (let c = 0; c < puzzle.size; c++) {
        if (c + clue.answer.length <= puzzle.size) {
          let matches = true;
          for (let i = 0; i < clue.answer.length; i++) {
            if (puzzle.grid[r][c + i] !== clue.answer[i]) {
              matches = false;
              break;
            }
          }
          if (matches) {
            row = r;
            col = c;
            break;
          }
        }
      }
      if (row !== -1) break;
    }

    if (row !== -1 && col !== -1) {
      const key = `${row},${col}`;
      if (!numberMap.has(key)) {
        numberMap.set(key, clue.number);
      }
      grid[row][col].number = clue.number;
      clues.push({
        number: clue.number,
        clue: clue.clue,
        answer: clue.answer,
        direction: 'across',
        row,
        col,
      });
    }
  });

  // Process down clues
  puzzle.clues.down.forEach((clue) => {
    let row = -1,
      col = -1;
    // Find the position of the answer in the grid
    for (let r = 0; r < puzzle.size; r++) {
      for (let c = 0; c < puzzle.size; c++) {
        if (r + clue.answer.length <= puzzle.size) {
          let matches = true;
          for (let i = 0; i < clue.answer.length; i++) {
            if (puzzle.grid[r + i][c] !== clue.answer[i]) {
              matches = false;
              break;
            }
          }
          if (matches) {
            row = r;
            col = c;
            break;
          }
        }
      }
      if (row !== -1) break;
    }

    if (row !== -1 && col !== -1) {
      const key = `${row},${col}`;
      if (!numberMap.has(key)) {
        numberMap.set(key, clue.number);
      }
      grid[row][col].number = clue.number;
      clues.push({
        number: clue.number,
        clue: clue.clue,
        answer: clue.answer,
        direction: 'down',
        row,
        col,
      });
    }
  });

  return { grid, clues, size: puzzle.size };
}

/**
 * Check if the player's answer is correct
 */
export function checkCrosswordSolution(
  playerGrid: string[][],
  solution: string[][]
): { isComplete: boolean; correctCells: boolean[][] } {
  const correctCells: boolean[][] = [];
  let filledCount = 0;
  let totalCells = 0;

  for (let i = 0; i < solution.length; i++) {
    correctCells[i] = [];
    for (let j = 0; j < solution[i].length; j++) {
      if (solution[i][j] !== '#') {
        totalCells++;
        const isCorrect =
          !!playerGrid[i][j] &&
          playerGrid[i][j].toUpperCase() === solution[i][j].toUpperCase();
        correctCells[i][j] = isCorrect;
        if (playerGrid[i][j]) filledCount++;
      } else {
        correctCells[i][j] = true;
      }
    }
  }

  const isComplete = filledCount === totalCells && correctCells.every((row) => row.every((cell) => cell));

  return { isComplete, correctCells };
}
