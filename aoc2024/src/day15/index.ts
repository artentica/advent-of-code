import run from 'aocrunner';

type Position = { x: number; y: number };

const robotSymbol = '@';
const voidSpace = '.';
const gift = 'O';
const gift2 = '[';
const wall = '#';

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
  let toMove: Position[] = [robot];

  let pos = { x: robot.x, y: robot.y };
  while (true) {
    pos = { x: pos.x + direction.x, y: pos.y + direction.y };
    const char = grid[pos.y]?.[pos.x];

    if (char === voidSpace) {
      break;
    } else if (char === gift) {
      toMove.push(pos);
    } else {
      // We move nothing
      toMove = [];
      break;
    }
  }

  if (toMove.length) {
    // Déplacer les éléments dans l'ordre inverse
    for (let i = toMove.length - 1; i >= 0; i--) {
      const positionFrom = toMove[i];
      const charToMove = grid[positionFrom.y][positionFrom.x];
      grid[positionFrom.y + direction.y][positionFrom.x + direction.x] =
        charToMove;
      if (i === 0) {
        grid[positionFrom.y][positionFrom.x] = voidSpace;
      }
    }

    // Mettre à jour la position du robot
    return {
      grid,
      robot: { x: toMove[0].x + direction.x, y: toMove[0].y + direction.y },
    };
  }
  return { grid, robot };
}

function explore(
  grid: Grid,
  moves: string,
  moveRobot: (
    grid: Grid,
    move: Direction,
    robot: Position,
  ) => { grid: Grid; robot: Position },
) {
  let gridUpdated = grid;
  let robotCoor = findRobot(grid);
  if (robotCoor === undefined) {
    throw new Error('No robot found');
  }
  let movedState = { grid, robot: robotCoor };
  for (let i = 0; i < moves.length; i++) {
    const direction = moves[i] as Direction;
    movedState = moveRobot(gridUpdated, direction, movedState.robot);
  }
  return movedState.grid;
}

function count(grid: Grid) {
  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === gift || grid[y][x] === gift2) {
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

const replaceMap = (char: string) => {
  switch (char) {
    case '#':
      return ['#', '#'];
    case 'O':
      return ['[', ']'];
    case '.':
      return ['.', '.'];
    case '@':
      return ['@', '.'];
    default:
      return char;
  }
};

const parseInput2 = (rawInput: string) => {
  let [map, moves] = rawInput.split('\n\n');
  let grid: Grid = map
    .split('\n')
    .map((line) => line.split('').flatMap(replaceMap));
  moves = moves.replace(/\n/g, '');
  return { grid, moves };
};

function moveRobot2(
  grid: Grid,
  move: Direction,
  robot: Position,
): { grid: Grid; robot: Position } {
  const direction = directions[move];
  let toMove: (Position | boolean)[] = [];

  let pos = { x: robot.x, y: robot.y };
  if (direction.y === 0) {
    toMove.push(robot);
    while (true) {
      pos = { x: pos.x + direction.x, y: pos.y + direction.y };
      const char = grid[pos.y]?.[pos.x];

      if (char === voidSpace) {
        break;
      } else if (char === '[' || char === ']') {
        toMove.push(pos);
      } else {
        // We move nothing
        toMove = [];
        break;
      }
    }
  } else {
    const tempMove = toMoveVerticaly(grid, robot, direction);
    if (tempMove.some((el) => el === false)) {
      return { grid, robot };
    }
    const filter = Array.from((tempMove as Position[]).reduce((acc, el) => {
      acc.add(`${el.x},${el.y}`);
    return acc;
  }, new Set<string>())).map((el) => {
    const [x, y] = el.split(',').map(Number);
    return { x, y };
  })
    toMove.push(
      ...filter.sort((a, b) => direction.y > 0 ? a.y - b.y : b.y - a.y),
    );
  }

  if (toMove.length) {
    // Déplacer les éléments dans l'ordre inverse
    for (let i = toMove.length - 1; i >= 0; i--) {
      const positionFrom = (toMove as Position[])[i];
      const charToMove = grid[positionFrom.y][positionFrom.x];
      grid[positionFrom.y + direction.y][positionFrom.x + direction.x] =
        charToMove;
      grid[positionFrom.y][positionFrom.x] = voidSpace;
    }

    // Mettre à jour la position du robot
    return {
      grid,
      robot: {
        x: (toMove as Position[])[0].x + direction.x,
        y: (toMove as Position[])[0].y + direction.y,
      },
    };
  }
  return { grid, robot };
}

function nextPosition(robot: Position, direction: Position) {
  return { x: robot.x + direction.x, y: robot.y + direction.y };
}

function toMoveVerticaly(grid: Grid, position: Position, direction: Position) {
  const newPos = nextPosition(position, direction);
  let toMove: (Position | boolean)[] = [position];
  const char = grid[newPos.y][newPos.x];
  if (char === '[') {
    toMove.push(
      ...[newPos, { ...newPos, x: newPos.x + 1 }].flatMap((el) =>
        toMoveVerticaly(grid, el, direction),
      ),
    );
  } else if (char === ']') {
    toMove.push(
      ...[newPos, { ...newPos, x: newPos.x - 1 }].flatMap((el) =>
        toMoveVerticaly(grid, el, direction),
      ),
    );
  } else if (char === wall) {
    // We move nothing
    toMove = [false];
  }
  return toMove;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const finalGrid = explore(input.grid, input.moves, moveRobot);
  return count(finalGrid);
};

const part2 = (rawInput: string) => {
  const input = parseInput2(rawInput);
  const finalGrid = explore(input.grid, input.moves, moveRobot2);
  return count(finalGrid);
};

run({
  part1: {
    tests: [
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
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`,
        expected: 618,
      },
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
        expected: 9021,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
