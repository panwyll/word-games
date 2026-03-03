'use client';

import type { TestResult } from '@/lib/python-engine';

interface TestResultsProps {
  results: TestResult[] | null;
  allPassed?: boolean;
}

export default function TestResults({ results, allPassed }: TestResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">Run your code to see test results</p>
      </div>
    );
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className={`p-4 rounded-lg border-2 ${
        allPassed
          ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
          : 'bg-red-50 dark:bg-red-900/20 border-red-500'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">
              {allPassed ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {passedCount} / {totalCount} test cases passed
            </p>
          </div>
          {allPassed && (
            <div className="text-4xl">🎉</div>
          )}
        </div>
      </div>

      {/* Individual Test Results */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Test Cases:</h4>
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              result.passed
                ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">
                {result.passed ? '✓' : '✗'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-1">
                  Test Case {index + 1}
                </div>
                <div className="text-xs font-mono space-y-1">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Input: </span>
                    <span className="text-gray-800 dark:text-gray-200">{result.input}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Expected: </span>
                    <span className="text-gray-800 dark:text-gray-200">{result.expectedOutput}</span>
                  </div>
                  {result.actualOutput && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Actual: </span>
                      <span className={result.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {result.actualOutput}
                      </span>
                    </div>
                  )}
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300">
                      {result.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
