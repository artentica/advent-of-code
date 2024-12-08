import run from 'aocrunner';

type Coordonate = [number, number];

const parseInput = (rawInput: string) => {
  return rawInput.split('\n');
};

function replaceCharAtIndex(str: string, index: number, newChar: string) {
  if (index < 0 || index >= str.length) {
    throw new Error('Index out of bounds');
  }
  return str.slice(0, index) + newChar + str.slice(index + 1);
}

function getAntinodeCoordonate(map: string[]): Set<string> {
  const height = map.length;
  const width = map[0].length;

  // Find the antennas
  const antennas: Record<string, Coordonate[]> = {};
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = map[y][x];
      if (char !== '.') {
        if (!antennas[char]) antennas[char] = [];
        antennas[char].push([x, y]);
      }
    }
  }

  const antinodePositions = new Set<string>();

  // Get the antinode
  for (const [freq, positions] of Object.entries(antennas)) {
    // Check every pair of antennas
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [x1, y1] = positions[i];
        const [x2, y2] = positions[j];

        // Calculate midpoints
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Potential antinodes
        const antinode1: [number, number] = [x1 - dx, y1 - dy];
        const antinode2: [number, number] = [x2 + dx, y2 + dy];

        // Check if they're within bounds
        for (const [x, y] of [antinode1, antinode2]) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            antinodePositions.add(`${x},${y},${freq}`);
          }
        }
      }
    }
  }

  return antinodePositions;
}

function getAntinodeCoordonateWithResonnance(map: string[]): Set<string> {
  const height = map.length;
  const width = map[0].length;

  // Find the antennas
  const antennas: Record<string, Coordonate[]> = {};
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = map[y][x];
      if (char !== '.') {
        if (!antennas[char]) antennas[char] = [];
        antennas[char].push([x, y]);
      }
    }
  }

  const antinodePositions = new Set<string>();

  // Get the antinode
  for (const [freq, positions] of Object.entries(antennas)) {
    for (const [x, y] of positions) {
      antinodePositions.add(`${x},${y}`);
    }

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [x1, y1] = positions[i];
        const [x2, y2] = positions[j];

        const dx = x2 - x1;
        const dy = y2 - y1;

        let step = 1;

        while (
          (x1 - dx * step >= 0 && y1 - dy * step >= 0) ||
          (y2 + dy * step < height && x2 + dx * step < width)
        ) {
          const antinode1: [number, number] = [x1 - dx * step, y1 - dy * step];
          const antinode2: [number, number] = [x2 + dx * step, y2 + dy * step];
          step++;
          for (const [x, y] of [antinode1, antinode2]) {
            if (x >= 0 && x < width && y >= 0 && y < height) {
              antinodePositions.add(`${x},${y},${freq}`);
            }
          }
        }
      }
    }
  }

  return antinodePositions;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const antinodeWithFreq = getAntinodeCoordonate(input);
  return Array.from(antinodeWithFreq).reduce((acc, curr) => {
    const parts = curr.split(',');
    acc.add(`${parts[0]}/${parts[1]}`);
    return acc;
  }, new Set<string>()).size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const antinodeWithFreq = getAntinodeCoordonateWithResonnance(input);
  return Array.from(antinodeWithFreq).reduce((acc, curr) => {
    const parts = curr.split(',');
    acc.add(`${parts[0]}/${parts[1]}`);
    return acc;
  }, new Set<string>()).size;
};

run({
  part1: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
