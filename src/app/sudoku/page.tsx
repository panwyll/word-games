import SudokuGame from '@/components/sudoku/SudokuGame';

export const metadata = { title: 'Sudoku – Word Games' };

export default function SudokuPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Sudoku</h1>
        <p className="text-gray-500 text-sm">Fill the 9×9 grid so each row, column, and 3×3 box contains 1-9</p>
      </div>
      <SudokuGame />
    </div>
  );
}
