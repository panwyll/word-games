'use client';

interface SpellingBeeHiveProps {
  centerLetter: string;
  outerLetters: string[];
  onLetter: (letter: string) => void;
}

// Hex cell size: 64×64 px bounding box with pointy-top hexagon clip-path.
// The 7-cell hive uses a 2-3-2 row layout (standard NYT Spelling Bee honeycomb):
//
//   [0] [1]        top row    — y=0,   x=32 and x=96
//  [5] [C] [2]     mid row    — y=48,  x=0, 64, 128
//   [4] [3]        bottom row — y=96,  x=32 and x=96
//
// Container: 192 px wide × 160 px tall.
const CELL = 64; // bounding-box size in pixels
const ROW_STEP = CELL * 0.75; // vertical step between adjacent hex rows = 48 px

// Pixel positions (top-left corner) for the 6 outer cells.
// Ordered clockwise starting from top-left as drawn in the diagram above:
// 0=TL, 1=TR, 2=R, 3=BR, 4=BL, 5=L
const OUTER_POSITIONS = [
  { left: CELL / 2,      top: 0          }, // 0 – top-left
  { left: CELL * 1.5,    top: 0          }, // 1 – top-right
  { left: CELL * 2,      top: ROW_STEP   }, // 2 – right
  { left: CELL * 1.5,    top: ROW_STEP * 2 }, // 3 – bottom-right
  { left: CELL / 2,      top: ROW_STEP * 2 }, // 4 – bottom-left
  { left: 0,             top: ROW_STEP   }, // 5 – left
];

// Center cell position
const CENTER = { left: CELL, top: ROW_STEP };

// Container dimensions
const W = CELL * 3;          // 192 px
const H = ROW_STEP * 2 + CELL; // 160 px

function HexCell({
  letter,
  isCenter,
  onClick,
  pos,
}: {
  letter: string;
  isCenter: boolean;
  onClick: () => void;
  pos: { left: number; top: number };
}) {
  return (
    <button
      onClick={onClick}
      className={`
        absolute flex items-center justify-center
        text-xl font-bold uppercase select-none
        transition-all duration-150 hover:opacity-80 active:scale-95
        ${isCenter ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'}
      `}
      style={{
        width: CELL,
        height: CELL,
        left: pos.left,
        top: pos.top,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      }}
      aria-label={letter}
    >
      {letter}
    </button>
  );
}

export default function SpellingBeeHive({ centerLetter, outerLetters, onLetter }: SpellingBeeHiveProps) {
  return (
    <div
      className="relative mx-auto my-4"
      style={{ width: W, height: H }}
    >
      {outerLetters.slice(0, 6).map((letter, i) => (
        <HexCell
          key={letter + i}
          letter={letter}
          isCenter={false}
          onClick={() => onLetter(letter)}
          pos={OUTER_POSITIONS[i]}
        />
      ))}
      <HexCell
        letter={centerLetter}
        isCenter
        onClick={() => onLetter(centerLetter)}
        pos={CENTER}
      />
    </div>
  );
}
