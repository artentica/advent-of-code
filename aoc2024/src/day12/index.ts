import run from 'aocrunner';

type Position = { x: number; y: number };

const directions: Position[] = [
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function isWithinBounds(grid: string[][]) {
  const rows = grid.length;
  const cols = grid[0].length;
  return (x: number, y: number) => x >= 0 && x < rows && y >= 0 && y < cols;
}

function findAreaAndPerimeter(
  plot: Position,
  plant: string,
  visitedMap: boolean[][],
  grid: string[][],
  isWithinBounds: (x: number, y: number) => boolean,
): { area: number; perimeter: number } {
  visitedMap[plot.x][plot.y] = true;

  let area = 1;
  let perimeter = 0;

  for (const { x, y } of directions) {
    const nextX = x + plot.x;
    const nextY = y + plot.y;

    if (isWithinBounds(nextX, nextY)) {
      if (grid[nextX][nextY] === plant) {
        if (!visitedMap[nextX][nextY]) {
          const result = findAreaAndPerimeter(
            { x: nextX, y: nextY },
            plant,
            visitedMap,
            grid,
            isWithinBounds,
          );
          area += result.area;
          perimeter += result.perimeter;
        }
      } else {
        perimeter++;
      }
    } else {
      perimeter++;
    }
  }

  return { area, perimeter };
}

function exploredMap(grid: string[][]) {
  const height = grid.length;
  const width = grid[0].length;
  const visitedMap = Array.from({ length: height }, () =>
    Array(width).fill(false),
  );
  let sum = 0;
  for (let x = 0; x < height; x++) {
    for (let y = 0; y < width; y++) {
      if (visitedMap[x][y] === false) {
        const plantType = grid[x][y];
        const { area, perimeter } = findAreaAndPerimeter(
          { x, y },
          plantType,
          visitedMap,
          grid,
          isWithinBounds(grid),
        );
        sum += area * perimeter;
      }
    }
  }
  return sum;
}

function findAreaAndSides(
  plot: Position,
  plant: string,
  visitedMap: boolean[][],
  grid: string[][],
  isWithinBounds: (x: number, y: number) => boolean,
): { area: number; sides: Set<string> } {
  visitedMap[plot.y][plot.x] = true;

  let area = 1;
  const sides = new Set<string>();

  for (const { x, y } of directions) {
    const nextX = x + plot.x;
    const nextY = y + plot.y;

    if (isWithinBounds(nextX, nextY)) {
      if (grid[nextY][nextX] === plant) {
        if (!visitedMap[nextY][nextX]) {
          const result = findAreaAndSides(
            { x: nextX, y: nextY },
            plant,
            visitedMap,
            grid,
            isWithinBounds,
          );
          area += result.area;
          result.sides.forEach((side) => sides.add(side));
        }
      } else {
        sides.add(`${plot.x},${plot.y}/${x},${y}`);
      }
    } else {
      sides.add(`${plot.x},${plot.y}/${x},${y}`);
    }
  }

  return { area, sides };
}

function filterSides(sides: Set<string>): Set<string> {
  for (const side of sides) {
    const [start, end] = side.split('/');
    const [startX, startY] = start.split(',').map(Number);
    const [x, y] = end.split(',').map(Number);

    if (y === 0) {
      let step = 1;
      while (sides.has(`${startX},${startY - step}/${x},${y}`)) {
        sides.delete(`${startX},${startY - step}/${x},${y}`);
        step++;
      }
      step = 1;
      while (sides.has(`${startX},${startY + step}/${x},${y}`)) {
        sides.delete(`${startX},${startY + step}/${x},${y}`);
        step++;
      }
    }
    if (x === 0) {
      let step = 1;
      while (sides.has(`${startX - step},${startY}/${x},${y}`)) {
        sides.delete(`${startX - step},${startY}/${x},${y}`);
        step++;
      }
      step = 1;
      while (sides.has(`${startX + step},${startY}/${x},${y}`)) {
        sides.delete(`${startX + step},${startY}/${x},${y}`);
        step++;
      }
    }
  }
  return sides;
}

function exploredMapPart2(grid: string[][]) {
  const height = grid.length;
  const width = grid[0].length;
  const visitedMap = Array.from({ length: height }, () =>
    Array(width).fill(false),
  );
  let sum = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (visitedMap[y][x] === false) {
        const plantType = grid[y][x];
        const { area, sides } = findAreaAndSides(
          { x, y },
          plantType,
          visitedMap,
          grid,
          isWithinBounds(grid),
        );
        sum += area * filterSides(sides).size;
      }
    }
  }
  return sum;
}

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => line.split(''));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return exploredMap(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return exploredMapPart2(input);
};

run({
  part1: {
    tests: [
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `AAAA
BBCD
BBCC
EEEC`,
        expected: 80,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
