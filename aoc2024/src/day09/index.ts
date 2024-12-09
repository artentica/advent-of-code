import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput;

function createRepresentation(input: string) {
  let disk: (number | '.')[] = [];
  for (let i = 0; i < input.length; i += 2) {
    const fileLength = Number(input[i]);
    const spaceLength = Number(input[i + 1]) || 0;

    disk.push(...Array(fileLength).fill(i / 2));
    disk.push(...Array(spaceLength).fill('.'));
  }
  return disk;
}

function moveDiskParts(disk: (number | '.')[]) {
  let idx = disk.length - 1;
  for (let i = 0; i < disk.length; i++) {
    const element = disk[i];
    if (element === '.') {
      for (let y = idx; y > i; y--) {
        if (disk[y] !== '.') {
          disk[i] = disk[y];
          disk[y] = '.';
          idx = y;
          break;
        }
      }
    }
  }
  return disk;
}

function checksum(disk: (number | '.')[], toTheEnd = false) {
  let sum = 0;
  for (let i = 0; i < disk.length; i++) {
    const element = disk[i];
    if (!toTheEnd && element === '.') {
      return sum;
    } else if (element !== '.') {
      sum += element * i;
    }
  }
  return sum;
}

function arraymove(
  arr: { size: number; space: number; id: number }[],
  fromIndex: number,
  toIndex: number,
) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

function moveWholeFiles(disk: { size: number; space: number; id: number }[]) {
  for (let i = disk.length - 1; i > 0; i--) {
    const lastElement = disk[i];
    for (let j = 0; j < disk.length; j++) {
      const element = disk[j];
      if (j === i) {
        break;
      }
      if (element.space >= lastElement.size) {
        disk[i - 1].space =
          disk[i - 1].space + lastElement.size + lastElement.space;
        lastElement.space = element.space - lastElement.size;
        element.space = 0;
        arraymove(disk, i, j + 1);
        i++;
        break;
      }
    }
  }
  return disk;
}

function representationBlock(input: string) {
  let disk: { size: number; space: number; id: number }[] = [];
  for (let i = 0; i < input.length; i += 2) {
    const fileLength = Number(input[i]);
    const spaceLength = Number(input[i + 1]) || 0;
    disk.push({ size: fileLength, space: spaceLength, id: i / 2 });
  }
  return disk;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const processedData = createRepresentation(input);
  const movedPart = moveDiskParts(processedData);
  return checksum(movedPart);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const processedData = representationBlock(input);
  const movedPart = moveWholeFiles(processedData);

  const representation = movedPart.reduce((acc, curr) => {
    acc.push(...Array(curr.size).fill(curr.id));
    acc.push(...Array(curr.space).fill('.'));
    return acc;
  }, new Array<number | '.'>());

  return checksum(representation, true);
};

run({
  part1: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
