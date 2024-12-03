import run from 'aocrunner';

const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let match;
  let sum = 0;
  while ((match = mulRegex.exec(input)) !== null) {
    sum += Number(match[1]) * Number(match[2]);
  }
  return sum;
};

const part2 = (rawInput: string) => {
  // /!\ Had to reset lastIndex of the regex due to the loop

  // const input = parseInput(rawInput);

  // // Découpage en instructions valides
  // const splited = input.split(/(?=mul\()|(?=do\(\))|(?=don't\(\))/);

  // let enabled = true; // Par défaut, `mul` est activé
  // let sum = 0;

  // // Parcours des instructions
  // for (const el of splited) {
  //   if (el.startsWith('do()')) {
  //     enabled = true; // Active les `mul`
  //   } else if (el.startsWith("don't()")) {
  //     enabled = false; // Désactive les `mul`
  //   } else if (enabled) {
  //     // Si `mul` est activé, vérifie si l'instruction est valide
  //     mulRegex.lastIndex = 0;
  //     const match = mulRegex.exec(el);
  //     if (match) {
  //       // Si valide, ajoute le produit à la somme
  //       sum += Number(match[1]) * Number(match[2]);
  //     }
  //   }
  // }
  const input = parseInput(rawInput)
    .replace(/don't\([\s\S]*?do\(\)/g, '')
    .replace(/don't\(\).*$/g, '');
  let match;
  let sum = 0;
  while ((match = mulRegex.exec(input)) !== null) {
    sum += Number(match[1]) * Number(match[2]);
  }
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo(?mul(8,5))`,
        expected: 8,
      },
      {
        input: `xmul(2,4)&mul[3,7]!^don't)_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
