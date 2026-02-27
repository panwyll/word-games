'use client';

import { useState, useEffect, useRef } from 'react';
import {
  generateDailyCrossword,
  checkCrosswordSolution,
  type CrosswordClue,
  type CrosswordGrid,
} from '@/lib/crossword-engine';

export default function CrosswordGame() {
  const [grid, setGrid] = useState<CrosswordGrid>([]);
  const [playerGrid, setPlayerGrid] = useState<string[][]>([]);
  const [solution, setSolution] = useState<string[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [size, setSize] = useState(0);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [isComplete, setIsComplete] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [correctCells, setCorrectCells] = useState<boolean[][]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // Initialize game
  useEffect(() => {
    const { grid: newGrid, clues: newClues, size: newSize } = generateDailyCrossword();
    setGrid(newGrid);
    setClues(newClues);
    setSize(newSize);

    // Extract solution
    const sol = newGrid.map((row) => row.map((cell) => (cell.isBlack ? '#' : cell.letter || '')));
    setSolution(sol);

    // Initialize player grid
    const player = newGrid.map((row) => row.map((cell) => (cell.isBlack ? '#' : '')));
    setPlayerGrid(player);

    // Initialize refs
    inputRefs.current = Array(newSize)
      .fill(null)
      .map(() => Array(newSize).fill(null));
  }, []);

  useEffect(() => {
    if (playerGrid.length > 0) {
      const result = checkCrosswordSolution(playerGrid, solution);
      setCorrectCells(result.correctCells);
      setIsComplete(result.isComplete);
    }
  }, [playerGrid, solution]);

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row][col].isBlack) {
      if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
        // Toggle direction if clicking the same cell
        setDirection(direction === 'across' ? 'down' : 'across');
      } else {
        setSelectedCell([row, col]);
      }
      inputRefs.current[row][col]?.focus();
    }
  };

  const handleInput = (row: number, col: number, value: string) => {
    if (grid[row][col].isBlack) return;

    const newPlayerGrid = playerGrid.map((r) => [...r]);
    newPlayerGrid[row][col] = value.toUpperCase();
    setPlayerGrid(newPlayerGrid);

    // Move to next cell
    if (value) {
      let nextRow = row;
      let nextCol = col;

      if (direction === 'across') {
        nextCol++;
        while (nextCol < size && grid[nextRow][nextCol].isBlack) {
          nextCol++;
        }
        if (nextCol >= size) {
          nextRow++;
          nextCol = 0;
          while (nextRow < size && grid[nextRow][nextCol].isBlack) {
            nextCol++;
            if (nextCol >= size) {
              nextRow++;
              nextCol = 0;
            }
          }
        }
      } else {
        nextRow++;
        while (nextRow < size && grid[nextRow][nextCol].isBlack) {
          nextRow++;
        }
        if (nextRow >= size) {
          nextCol++;
          nextRow = 0;
          while (nextCol < size && grid[nextRow][nextCol].isBlack) {
            nextRow++;
            if (nextRow >= size) {
              nextCol++;
              nextRow = 0;
            }
          }
        }
      }

      if (nextRow < size && nextCol < size) {
        setSelectedCell([nextRow, nextCol]);
        inputRefs.current[nextRow][nextCol]?.focus();
      }
    }
  };

  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !playerGrid[row][col]) {
      e.preventDefault();
      // Move to previous cell
      let prevRow = row;
      let prevCol = col;

      if (direction === 'across') {
        prevCol--;
        while (prevCol >= 0 && grid[prevRow][prevCol].isBlack) {
          prevCol--;
        }
      } else {
        prevRow--;
        while (prevRow >= 0 && grid[prevRow][prevCol].isBlack) {
          prevRow--;
        }
      }

      if (prevRow >= 0 && prevCol >= 0) {
        setSelectedCell([prevRow, prevCol]);
        inputRefs.current[prevRow][prevCol]?.focus();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case 'ArrowLeft':
          newCol--;
          break;
        case 'ArrowRight':
          newCol++;
          break;
        case 'ArrowUp':
          newRow--;
          break;
        case 'ArrowDown':
          newRow++;
          break;
      }

      while (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && grid[newRow][newCol].isBlack) {
        switch (e.key) {
          case 'ArrowLeft':
            newCol--;
            break;
          case 'ArrowRight':
            newCol++;
            break;
          case 'ArrowUp':
            newRow--;
            break;
          case 'ArrowDown':
            newRow++;
            break;
        }
      }

      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && !grid[newRow][newCol].isBlack) {
        setSelectedCell([newRow, newCol]);
        inputRefs.current[newRow][newCol]?.focus();
      }
    }
  };

  const handleReset = () => {
    const player = grid.map((row) => row.map((cell) => (cell.isBlack ? '#' : '')));
    setPlayerGrid(player);
    setIsComplete(false);
    setShowErrors(false);
  };

  const getCellClassName = (row: number, col: number) => {
    if (grid[row][col].isBlack) {
      return 'bg-gray-900 dark:bg-gray-100';
    }

    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
    let className = 'bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 ';

    if (isSelected) {
      className += 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 ';
    }

    if (showErrors && playerGrid[row][col] && !correctCells[row]?.[col]) {
      className += 'bg-red-100 dark:bg-red-900/30 ';
    } else if (showErrors && playerGrid[row][col] && correctCells[row]?.[col]) {
      className += 'bg-green-100 dark:bg-green-900/30 ';
    }

    return className;
  };

  const acrossClues = clues.filter((c) => c.direction === 'across').sort((a, b) => a.number - b.number);
  const downClues = clues.filter((c) => c.direction === 'down').sort((a, b) => a.number - b.number);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Crossword Grid */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="grid gap-0 border-2 border-gray-900 dark:border-gray-100"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 ${getCellClassName(rowIndex, colIndex)}`}
                >
                  {cell.number !== null && (
                    <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-gray-600 dark:text-gray-400">
                      {cell.number}
                    </span>
                  )}
                  {!cell.isBlack && (
                    <input
                      ref={(el) => {
                        if (!inputRefs.current[rowIndex]) {
                          inputRefs.current[rowIndex] = [];
                        }
                        inputRefs.current[rowIndex][colIndex] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={playerGrid[rowIndex]?.[colIndex] || ''}
                      onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                      className="w-full h-full text-center text-lg font-bold bg-transparent outline-none uppercase"
                      style={{ caretColor: 'transparent' }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setShowErrors(!showErrors)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              showErrors
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {showErrors ? 'Hide Check' : 'Check Answers'}
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
            <p className="text-green-600 dark:text-green-300">You completed the crossword!</p>
          </div>
        )}
      </div>

      {/* Clues */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-3">Across</h3>
          <div className="space-y-2">
            {acrossClues.map((clue) => (
              <div key={`across-${clue.number}`} className="text-sm">
                <span className="font-bold">{clue.number}.</span> {clue.clue}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-3">Down</h3>
          <div className="space-y-2">
            {downClues.map((clue) => (
              <div key={`down-${clue.number}`} className="text-sm">
                <span className="font-bold">{clue.number}.</span> {clue.clue}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
