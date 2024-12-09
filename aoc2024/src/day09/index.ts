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

function checksum(disk: (number | '.')[]) {
  let sum = 0;
  for (let i = 0; i < disk.length; i++) {
    const element = disk[i];
    if(element === '.') {
      return sum;
    }
    sum += element * i;
  }
  return sum;
}
function moveWholeFiles(disk: (number | '.')[]) {
  // Étape 1 : Identifier les fichiers et leurs positions
  const files: { id: number; start: number; length: number }[] = [];
  let currentId = null;
  let start = -1;

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] !== '.' && disk[i] !== currentId) {
      if (currentId !== null) {
        files.push({ id: currentId as number, start, length: i - start });
      }
      currentId = disk[i] as number;
      start = i;
    }
  }
  if (currentId !== null) {
    files.push({ id: currentId as number, start, length: disk.length - start });
  }

  // Étape 2 : Déplacer les fichiers en ordre décroissant d'ID
  files.sort((a, b) => b.id - a.id); // Trier par ID décroissant

  for (const file of files) {
    // Chercher un espace contigu suffisant à gauche
    for (let i = 0; i < file.start; i++) {
      const isSpaceAvailable = disk.slice(i, i + file.length).every((block) => block === '.');
      if (isSpaceAvailable) {
        // Déplacer le fichier entier
        for (let j = 0; j < file.length; j++) {
          disk[i + j] = file.id; // Copier le fichier
          disk[file.start + j] = '.'; // Libérer l'ancienne position
        }
        break; // Passer au fichier suivant
      }
    }
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
  const processedData = createRepresentation(input);
  const movedPart = moveWholeFiles(processedData);
  return checksum(movedPart);
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
