/**
 * Python Puzzle Engine - Daily puzzle generation
 */

import { getDailySeed } from './daily';
import { PYTHON_PUZZLES, getPuzzleByIndex, type Puzzle } from './python-puzzles';

/**
 * Get today's Python coding puzzle
 */
export function getDailyPuzzle(): Puzzle {
  const seed = getDailySeed();
  return getPuzzleByIndex(seed);
}

/**
 * Get puzzle for a specific date
 */
export function getPuzzleForDate(date: Date): Puzzle {
  const EPOCH = new Date('2024-01-01').getTime();
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor((targetDate.getTime() - EPOCH) / (1000 * 60 * 60 * 24));
  return getPuzzleByIndex(daysSinceEpoch);
}

/**
 * Get puzzle archive (all past puzzles up to today)
 */
export function getPuzzleArchive(): Array<{ date: Date; puzzle: Puzzle; dayNumber: number }> {
  const today = getDailySeed();
  const archive: Array<{ date: Date; puzzle: Puzzle; dayNumber: number }> = [];
  const EPOCH = new Date('2024-01-01');
  
  for (let day = 0; day <= today; day++) {
    const date = new Date(EPOCH);
    date.setDate(date.getDate() + day);
    const puzzle = getPuzzleByIndex(day);
    archive.push({ date, puzzle, dayNumber: day + 1 });
  }
  
  return archive.reverse(); // Most recent first
}

/**
 * Validate user's Python code solution
 * Returns test results for each test case
 */
export interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
}

/**
 * Simple Python code execution validator (client-side simulation)
 * Note: This is a simplified validator for demonstration.
 * In production, you'd use a sandboxed Python executor on the backend.
 */
export function validateSolution(code: string, puzzle: Puzzle): TestResult[] {
  // This is a placeholder for client-side validation
  // In a real implementation, you would:
  // 1. Send code to a backend API
  // 2. Execute in a sandboxed Python environment (e.g., pyodide, docker container)
  // 3. Run against test cases
  // 4. Return results
  
  return puzzle.testCases.map(testCase => ({
    passed: false,
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    error: 'Code execution not yet implemented - use Submit button to validate'
  }));
}

/**
 * Get total number of puzzles
 */
export function getTotalPuzzles(): number {
  return PYTHON_PUZZLES.length;
}

/**
 * Calculate completion percentage
 */
export function calculateProgress(completedIds: string[]): number {
  if (PYTHON_PUZZLES.length === 0) return 0;
  return Math.round((completedIds.length / PYTHON_PUZZLES.length) * 100);
}
