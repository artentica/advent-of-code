import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split('\n').map((line) => line.split(''));
}

const researchedWord = "XMAS";
type Direction = [number, number];

const directions: Direction[] = [
    [0, 1],   // Horizontal right
    [0, -1],  // Horizontal left
    [1, 0],   // Vertical down
    [-1, 0],  // Vertical up
    [1, 1],   // Diagonal down-right
    [-1, -1], // Diagonal up-left
    [1, -1],  // Diagonal down-left
    [-1, 1]   // Diagonal up-right
];

function checkWordInGrid(
  startY: number,
  startX: number,
  direction: Direction,
  grid: string[][],
): boolean {
  if(grid[startY][startX] !== researchedWord[0]) {
    return false;
  }
  const [xDelta, yDelta] = direction
  const maxX = startX + (researchedWord.length - 1) * xDelta;
  const maxY = startY + (researchedWord.length - 1) * yDelta;
  if(maxX < 0 || maxX >= grid[0].length || maxY < 0 || maxY >= grid.length) {
    return false;
  }
  for (let i = 1; i < researchedWord.length; i++) {
      const y = startY + i * yDelta;
      const x = startX + i * xDelta;
      if (grid[y][x] !== researchedWord[i]) {
          return false;
      }
  }
  return true;
}

function isXMASPattern(startY: number, startX: number, grid: string[][]): boolean {
    if(grid[startY][startX] !== 'A') {
      return false;
    }

  // Ensure the X pattern stays within bounds
  if (
    startY - 1 < 0 || startY + 1 >= grid.length || // Top and bottom rows
    startX - 1 < 0 || startX + 1 >= grid[0].length   // Left and right columns
  ) {
      return false;
  }

  const lettersXpattern = [[grid[startY - 1][startX - 1], grid[startY + 1][startX + 1]], [grid[startY - 1][startX + 1], grid[startY + 1][startX - 1]]];

  // Check if the pattern forms two "MAS" in an X shape
  const isMAS = (pattern: string[]) => pattern.join("") === "MS" || pattern.join("") === "SM";

  return lettersXpattern.every(isMAS);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let count = 0;
  for (let row = 0; row < input[0].length; row++) {
    for (let col = 0; col < input.length; col++) {
        for (const direction of directions) {
            if (checkWordInGrid(row, col, direction, input)) {
                count++;
            }
        }
    }
  }
  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let count = 0;
  for (let row = 0; row < input[0].length; row++) {
    for (let col = 0; col < input.length; col++) {
            if (isXMASPattern(row, col, input)) {
                count++;
            }
    }
  }
  return count;
};

run({
  part1: {
    tests: [
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
