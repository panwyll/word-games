'use client';

import { useState } from 'react';
import type { Puzzle } from '@/lib/python-puzzles';

interface PythonEditorProps {
  puzzle: Puzzle;
  onSubmit: (code: string) => void;
}

export default function PythonEditor({ puzzle, onSubmit }: PythonEditorProps) {
  const [code, setCode] = useState(getStarterCode(puzzle));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(code);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset code to starter template?')) {
      setCode(getStarterCode(puzzle));
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {/* Editor Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">Python 3</span>
          <span className="text-xs text-gray-500">|</span>
          <span className="text-xs text-gray-400">{puzzle.title}</span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Reset Code
        </button>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          spellCheck={false}
          placeholder="Write your solution here..."
          style={{
            tabSize: 4,
            lineHeight: '1.6'
          }}
        />
        {/* Line numbers could be added here */}
      </div>

      {/* Editor Footer */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700">
        <div className="flex gap-2 text-xs text-gray-400">
          <span>Lines: {code.split('\n').length}</span>
          <span>|</span>
          <span>Chars: {code.length}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !code.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
          >
            {isSubmitting ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Generate starter code template for a puzzle */
function getStarterCode(puzzle: Puzzle): string {
  // Extract function signature from solution
  const lines = puzzle.solution.split('\n');
  const defLine = lines.find(line => line.trim().startsWith('def '));
  
  if (defLine) {
    // Get function signature
    const signature = defLine.substring(0, defLine.indexOf(':') + 1);
    const indent = '    ';
    return `${signature}\n${indent}# Write your solution here\n${indent}pass\n`;
  }
  
  return '# Write your solution here\n';
}
