import run from 'aocrunner';
import fs from 'fs';

type Position = { x: number; y: number };
type Robot = { position: Position; velocity: Position };
const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => {
    const [px, py, vx, vy] = line.match(/[-\d]+/g)!.map(Number);
    return { position: { x: px, y: py }, velocity: { x: vx, y: vy } };
  });

function explore(robots: Robot[]) {}

function calculateCoord(
  robot: Robot,
  width: number,
  height: number,
  time: number,
): Robot {
  const x =
    (((robot.position.x + robot.velocity.x * time) % width) + width) % width;
  const y =
    (((robot.position.y + robot.velocity.y * time) % height) + height) % height;
  return { position: { x, y }, velocity: robot.velocity };
}

function countByQuadrant(
  robots: Position[],
  width: number,
  height: number,
): [number, number, number, number] {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const widthEven = width % 2 === 0;
  const heightEven = height % 2 === 0;

  return robots.reduce(
    (acc, robot) => {
      if (
        (!widthEven && robot.x === Math.floor(halfWidth)) ||
        (!heightEven && robot.y === Math.floor(halfHeight))
      ) {
        return acc;
      }

      // Top-left
      if (robot.x < halfWidth && robot.y < halfHeight) {
        acc[0]++;
      }
      // Top-right
      else if (robot.x >= halfWidth && robot.y < halfHeight) {
        acc[1]++;
      }
      // Bottom-left
      else if (robot.x < halfWidth && robot.y >= halfHeight) {
        acc[2]++;
      }
      // Bottom-right
      else if (robot.x >= halfWidth && robot.y >= halfHeight) {
        acc[3]++;
      }

      return acc;
    },
    [0, 0, 0, 0],
  );
}

function textToPrintRobotPosition(
  robots: Robot[],
  width: number,
  height: number,
) {
  const grid: string[][] = Array.from({ length: height }, () =>
    Array(width).fill('.'),
  );
  for (const robot of robots) {
    grid[robot.position.y][robot.position.x] = '#';
  }
  return grid.map((row) => row.join(' ')).join('\n');
}

function verticalAlign(robots: Robot[], num: number) {
  // On regroupe les points par leur valeur de Y
  const groupedByY: { [key: number]: Position[] } = {};

  // On parcourt tous les points pour les regrouper par Y
  robots.forEach((robot) => {
    if (!groupedByY[robot.position.y]) {
      groupedByY[robot.position.y] = [];
    }
    groupedByY[robot.position.y].push(robot.position);
  });

  // Parcourir chaque groupe de points ayant la même valeur Y
  for (const y in groupedByY) {
    const yPoints = groupedByY[y];

    if (yPoints.length >= num) {
      // Trier les points par leur coordonnée X
      yPoints.sort((a, b) => a.x - b.x);

      // Vérifier s'il y a au moins num points contigus
      let contiguousCount = 1; // On commence par compter le premier point
      for (let i = 1; i < yPoints.length; i++) {
        if (yPoints[i].x === yPoints[i - 1].x + 1) {
          contiguousCount++;
          if (contiguousCount >= num) {
            return true; // Si on trouve au moins num points contigus, retourner true
          }
        } else {
          contiguousCount = 1; // Réinitialiser le compteur de contiguïté
        }
      }
    }
  }

  // Si aucun groupe ne contient au moins num points contigus
  return false;
}

const part1 = (rawInput: string, width = 101, height = 103) => {
  const time = 100;
  const robots: Robot[] = parseInput(rawInput);
  const robotCoor = robots.map(
    (robot) => calculateCoord(robot, width, height, time).position,
  );
  const quadrantCount = countByQuadrant(robotCoor, width, height);

  return quadrantCount.reduce((acc, curr) => acc * curr, 1);
};

const part2 = (rawInput: string, width = 101, height = 103) => {
  const robots = parseInput(rawInput);
  let lastStateRobots = robots;
  fs.writeFile('file.txt', '', function () {
    console.log('Cleaned');
  });
  let i = 0;
  while (i < 8000) {
    if (verticalAlign(lastStateRobots, 10)) {
      const content =
        [
          '===========================================',
          `================= time: ${i} ================`,
          '===========================================',
          textToPrintRobotPosition(lastStateRobots, width, height),
        ].join('\n') + '\n\n';

      fs.appendFile('file.txt', content, function (err) {
        if (err) throw err;
      });
    }
    lastStateRobots = lastStateRobots.map((robot) =>
      calculateCoord(robot, width, height, 1),
    );
    i++;
  }
};

run({
  part1: {
    tests: [
      //       {
      //         input: `p=0,4 v=3,-3
      // p=6,3 v=-1,-3
      // p=10,3 v=-1,2
      // p=2,0 v=2,-1
      // p=0,0 v=1,3
      // p=3,0 v=-2,-2
      // p=7,6 v=-1,-3
      // p=3,0 v=-1,-2
      // p=9,3 v=2,3
      // p=7,3 v=-1,2
      // p=2,4 v=2,-3
      // p=9,5 v=-3,-3`,
      //         expected: 12,
      //       },
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
