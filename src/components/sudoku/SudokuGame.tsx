'use client';

import { useState, useEffect } from 'react';
import { generateDailySudoku, checkSolution, getCellConflicts, type SudokuGrid, type Difficulty } from '@/lib/sudoku-engine';

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [puzzle, setPuzzle] = useState<SudokuGrid>([]);
  const [solution, setSolution] = useState<SudokuGrid>([]);
  const [playerGrid, setPlayerGrid] = useState<SudokuGrid>([]);
  const [initialGrid, setInitialGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize game
  useEffect(() => {
    const { puzzle: newPuzzle, solution: newSolution } = generateDailySudoku(difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setPlayerGrid(newPuzzle.map((row) => [...row]));
    setInitialGrid(newPuzzle.map((row) => [...row]));
    setIsComplete(false);
    setTimeElapsed(0);
    setIsRunning(true);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isComplete]);

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] === null) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (initialGrid[row][col] === null) {
        const newGrid = playerGrid.map((r) => [...r]);
        newGrid[row][col] = num;
        setPlayerGrid(newGrid);

        // Check if puzzle is complete
        const isCorrect = checkSolution(newGrid, solution);
        if (isCorrect) {
          setIsComplete(true);
          setIsRunning(false);
        }
      }
    }
  };

  const handleClear = () => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (initialGrid[row][col] === null) {
        const newGrid = playerGrid.map((r) => [...r]);
        newGrid[row][col] = null;
        setPlayerGrid(newGrid);
      }
    }
  };

  const handleReset = () => {
    setPlayerGrid(initialGrid.map((row) => [...row]));
    setIsComplete(false);
    setShowErrors(false);
    setTimeElapsed(0);
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellClassName = (row: number, col: number) => {
    const isInitial = initialGrid[row][col] !== null;
    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
    const value = playerGrid[row][col];

    let className =
      'w-full h-full flex items-center justify-center text-xl font-semibold cursor-pointer transition-all ';

    // Base styling
    if (isInitial) {
      className += 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold ';
    } else {
      className += 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 ';
    }

    // Selection
    if (isSelected) {
      className += 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 ';
    } else if (!isInitial) {
      className += 'hover:bg-gray-50 dark:hover:bg-gray-800 ';
    }

    // Errors
    if (showErrors && value !== null && !isInitial) {
      const conflicts = getCellConflicts(playerGrid, row, col);
      if (conflicts.rows.length > 0 || conflicts.cols.length > 0 || conflicts.box.length > 0) {
        className += 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ';
      }
    }

    return className;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                difficulty === diff
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time:</span>
          <span className="text-lg font-mono font-bold">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Sudoku Grid */}
      <div className="relative">
        <div className="grid grid-cols-9 gap-0 border-4 border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100">
          {playerGrid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14
                  ${getCellClassName(rowIndex, colIndex)}
                  ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-gray-900 dark:border-gray-100' : 'border-r border-gray-300 dark:border-gray-600'}
                  ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-gray-900 dark:border-gray-100' : 'border-b border-gray-300 dark:border-gray-600'}
                `}
              >
                {cell !== null ? cell : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Number Buttons */}
      <div className="grid grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg font-bold text-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleClear}
          disabled={!selectedCell}
          className="px-6 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Clear
        </button>
        <button
          onClick={() => setShowErrors(!showErrors)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            showErrors
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {showErrors ? 'Hide Errors' : 'Check Errors'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          Reset
        </button>
      </div>

      {/* Success Message */}
      {isComplete && (
        <div className="text-center p-6 bg-green-100 dark:bg-green-900/30 rounded-xl border-2 border-green-500">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
            🎉 Congratulations!
          </h3>
          <p className="text-green-600 dark:text-green-300">
            You solved the puzzle in {formatTime(timeElapsed)}!
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-md">
        <p>Click a cell and use the number buttons to fill it. Each row, column, and 3×3 box must contain the numbers 1-9.</p>
      </div>
    </div>
  );
}
