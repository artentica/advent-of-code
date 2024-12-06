import run from "aocrunner";
type Rule = [number, number];

const parseInput = (rawInput: string) => {
  const [rulesInput, updatesInput] = rawInput.split("\n\n");
  const rules = rulesInput.split("\n").map(line => line.split("|").map(Number) as Rule);
  const updates = updatesInput.split("\n").map(line => line.split(",").map(Number));
  return { rules, updates }
};

const getMiddlePage = (updates: number[]) => {
  return updates[(updates.length - 1)/2];
}

const checkUpdate = (rules: Record<number, number[]>, update: number[]) => {
  for (let i = 0; i < update.length; i++) {
    const element = update[i];
    const elementToCheck = rules[element];
    if(elementToCheck) {
    for (let y = 0; y < i; y++) {
      if(elementToCheck.includes(update[y])) {
        return false;
      }
    }
    }

    
  }
return true
}

const resumeRules = (rules: Rule[]) => {
  return rules.reduce((acc, rule) => {
    if(acc[rule[0]] === undefined) {
      acc[rule[0]] = [];
    }
    acc[rule[0]].push(rule[1]);
    return acc;
  }, {} as Record<number, number[]>);
}

const rearrangeList = (list: number[], index: number) => {
  
}

const part1 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);
  const resumedRules = resumeRules(rules);


  return updates.reduce((acc, update) => {
    if(checkUpdate(resumedRules, update)) {
      return acc + getMiddlePage(update);
    }
    return acc;
  }
  , 0);
};

const part2 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);
  const resumedRules = resumeRules(rules);


  const updateError = updates.reduce((acc, update) => {
    if(!checkUpdate(resumedRules, update)) {
      acc.push(update);
    }
    return acc;
  }, [] as number[][]);


};

run({
  part1: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
