import run from "aoc-automation";
import * as util from "../../utils/index.js";

const solve = (rawInput: string, isPart1: boolean, testName?: string) => {
	const input = parseInput(rawInput);

	if (testName != undefined) {
		console.log("");
		console.log("------");
		console.log(`${testName} Input`);
		console.log(input);
		console.log("------");
	}

	let total = 0;

	// Code solution here...

	return total;
};

const parseInput = (rawInput: string) => {
	const lines = util.parseLines(rawInput);
	return lines;
};

const part1 = (rawInput: string, testName?: string) => solve(rawInput, true, testName);
const part2 = (rawInput: string, testName?: string) => solve(rawInput, false, testName);

run({
	part1: {
		tests: [
			{
				input: `
				x00: 1
				x01: 1
				x02: 1
				y00: 0
				y01: 1
				y02: 0
				x00 AND y00 -&gt; z00
				x01 XOR y01 -&gt; z01
				x02 OR y02 -&gt; z02
				`,
				expected: 2024
			},
		],
		solution: part1,
	},
	part2: {
		testsPending: [
			{
				input: `
				{testDataPending}
				`,
				expected: "{expectedPending}"
			},
		],
		solution: part2
	},
	trimTestInputs: true,
	onlyTests: true
});
