export type LetterState = 'correct' | 'present' | 'absent' | 'unused';

export interface WordleGuess {
  word: string;
  states: LetterState[];
}

export interface WordleState {
  guesses: WordleGuess[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  answer: string;
}

export interface ConnectionsCategory {
  title: string;
  color: 'yellow' | 'green' | 'blue' | 'purple';
  words: string[];
}

export interface ConnectionsPuzzle {
  categories: ConnectionsCategory[];
}

export interface SpellingBeePuzzle {
  centerLetter: string;
  outerLetters: string[];
  validWords: string[];
  pangrams: string[];
}
