import run from 'aocrunner';

type Position = { x: number; y: number };

const robotSymbol = '@';
const voidSpace = '.';
const gift = 'O';

const directions: { [key: string]: Position } = {
  '<': { x: -1, y: 0 },
  '>': { x: 1, y: 0 },
  '^': { x: 0, y: -1 },
  v: { x: 0, y: 1 },
};
type Direction = '<' | '>' | '^' | 'v';
type Grid = string[][];

function findRobot(grid: Grid): Position | undefined {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === robotSymbol) {
        return { x, y };
      }
    }
  }
}

function moveRobot(
  grid: Grid,
  move: Direction,
  robot: Position,
): { grid: Grid; robot: Position } {
  const direction = directions[move];
  let currentPos: Position = robot;
  let toMove: Position[] = [];

  let pos = { x: robot.x, y: robot.y };
  while (true) {
    pos = { x: pos.x + direction.x, y: pos.y + direction.y };
    const char = grid[pos.y]?.[pos.x];

    if (char === voidSpace) {
      toMove.push(pos);
      break;
    } else if (char === gift) {
      toMove.push(pos);
      currentPos = pos;
    } else {
      // We move nothing
      toMove = [];
      break;
    }
  }

  if (toMove.length) {
    // Déplacer les éléments dans l'ordre inverse
    for (let i = toMove.length - 1; i >= 0; i--) {
      const source = i === 0 ? robot : toMove[i - 1];
      const target = toMove[i];
      grid[target.y][target.x] = i === 0 ? robotSymbol : gift;
      grid[source.y][source.x] = voidSpace;
    }

    // Mettre à jour la position du robot
    return { grid, robot: toMove[0] };
  }
  return { grid, robot };
}

function explore(grid: Grid, moves: string) {
  let gridUpdated = grid;
  let robotCoor = findRobot(grid);
  if (robotCoor === undefined) {
    throw new Error('No robot found');
  }
  for (let i = 0; i < moves.length; i++) {
    const direction = moves[i] as Direction;
    const moved = moveRobot(gridUpdated, direction, robotCoor);
    gridUpdated = moved.grid;
    robotCoor = moved.robot;
  }
  return gridUpdated;
}

function count(grid: Grid) {
  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === gift) {
        sum += 100 * y + x;
      }
    }
  }

  return sum;
}

const parseInput = (rawInput: string) => {
  let [map, moves] = rawInput.split('\n\n');
  let grid: Grid = map.split('\n').map((line) => line.split(''));
  moves = moves.replace(/\n/g, '');
  return { grid, moves };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const finalGrid = explore(input.grid, input.moves);
  return count(finalGrid);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
        expected: 10092,
      },
      {
        input: `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
        expected: 2028,
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
