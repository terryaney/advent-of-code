import run from "aoc-automation";
import * as util from "../../utils/index.js";

const solve = (rawInput: string, isPart1: boolean) => {
	const inputGrid = util.parseGrid(rawInput);
	const rows = inputGrid.rows;
	const cols = inputGrid.cols;

	let wordCounts = 0;

	if (isPart1) {
		/*
		const directions = [
			{ dr: 0, dc: 1 },   // Left to Right
			{ dr: 0, dc: -1 },  // Right to Left
			{ dr: 1, dc: 0 },   // Top to Bottom
			{ dr: -1, dc: 0 },  // Bottom to Top
			{ dr: 1, dc: 1 },   // Top-Left to Bottom-Right
			{ dr: -1, dc: -1 }, // Bottom-Right to Top-Left
			{ dr: 1, dc: -1 },  // Top-Right to Bottom-Left
			{ dr: -1, dc: 1 }   // Bottom-Left to Top-Right
		];
		*/

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (inputGrid.points[r][c].value != "X") continue;

				// Saw this in HyperNeutrino...'faster' to type in competitions :)
				/*
				for (const { dr, dc } of directions) {
					if (r + dr * 3 < 0 || r + dr * 3 >= rows || c + dc * 3 < 0 || c + dc * 3 >= cols) continue;
					... same code
				}
				*/
				for (const dr of [-1, 0, 1]) {
					for (const dc of [-1, 0, 1]) {
						if (dr === 0 && dc === 0) continue;
						if (r + dr * 3 < 0 || r + dr * 3 >= rows || c + dc * 3 < 0 || c + dc * 3 >= cols) continue;

						let found = true;
						for (let i = 1; i < 4; i++) {
							const nr = r + dr * i;
							const nc = c + dc * i;
							if (inputGrid.points[nr][nc].value !== "XMAS"[i]) {
								found = false;
								break;
							}
						}

						if (found) {
							wordCounts++;
						}
					}
				}
			}
		}
	} else {
		// util.logGrid(inputGrid);

		// HyperNeutrino's suggestion of searching for "A"
		for (let r = 1; r < rows - 1; r++) {
			for (let c = 1; c < cols - 1; c++) {
				if (inputGrid.points[r][c].value != "A") continue;

				const leftToRight = inputGrid.points[r - 1][c - 1].value + inputGrid.points[r + 1][c + 1].value;
				const rightToLeft = inputGrid.points[r - 1][c + 1].value + inputGrid.points[r + 1][c - 1].value;

				if (["MS", "SM"].includes(leftToRight) && ["MS", "SM"].includes(rightToLeft)) {
					wordCounts++;
				}
			}
		}
	}

	return wordCounts;
};

const part2Original = (rawInput: string) => {
	const inputGrid = util.parseGrid(rawInput);
	const rows = inputGrid.rows;
	const cols = inputGrid.cols;

	let wordCounts = 0;

	const directions: Record<string, { movement: { dr: number, dc: number }, pairs: Array<{ key: string, sr: number, sc: number }> }> = {
		"tlbr": { // Top-Left to Bottom-Right
			movement: { dr: 1, dc: 1 },
			pairs: [{ key: "bltr", sr: 2, sc: 0 }, { key: "trbl", sr: 0, sc: 2 }]
		},
		"brtl": { // Bottom-Right to Top-Left
			movement: { dr: -1, dc: -1 },
			pairs: [{ key: "bltr", sr: 0, sc: -2 }, { key: "trbl", sr: -2, sc: 0 }]
		},
		"trbl": { // Top-Right to Bottom-Left
			movement: { dr: 1, dc: -1 },
			pairs: [{ key: "tlbr", sr: 0, sc: -2 }, { key: "brtl", sr: 2, sc: 0 }]
		},
		"bltr": { // Bottom-Left to Top-Right
			movement: { dr: -1, dc: 1 },
			pairs: [{ key: "tlbr", sr: -2, sc: 0 }, { key: "brtl", sr: 0, sc: 2 }]
		}
	};

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const point = inputGrid.points[r][c];
			if (!point.visited && point.value === "M") {
				Object.keys(directions).forEach(key => {
					var direction = directions[key];
					let found = true;

					for (let i = 1; i < 3; i++) {
						const nr = r + direction.movement.dr * i;
						const nc = c + direction.movement.dc * i;
						if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || inputGrid.points[nr][nc].value !== "MAS"[i]) {
							found = false;
							break;
						}
					}
					if (found)
					{
						const validPair = direction.pairs.find(pair => {
							const pairDirection = directions[pair.key];
							
							for (let i = 0; i < 3; i++) {
								const nr = r + pair.sr + pairDirection.movement.dr * i;
								const nc = c + pair.sc + pairDirection.movement.dc * i;
								if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || inputGrid.points[nr][nc].value !== "MAS"[i]) {
									return false;
								}
							}
							
							return true;
						});

						if (validPair != undefined) {
							/*
							const first = `[${r}, ${c}]:[${r + direction.movement.dr * 2}, ${c + direction.movement.dc * 2}]`
							const second = `[${r + validPair.sr}, ${c + validPair.sc}]:[${r + validPair.sr + directions[validPair.key].movement.dr * 2}, ${c + validPair.sc + directions[validPair.key].movement.dc * 2}]`
							console.log(`Found X-MAS as ${first} with ${second}`);
							*/
							wordCounts++;	
						}
					}
				});

				point.value = "."; // visited...
			}
		}
	}
	return wordCounts;
};

const part1 = (rawInput: string) => solve(rawInput, true);
const part2 = (rawInput: string) => solve(rawInput, false);

run({
	part1: {
		tests: [
			{
				input: `
				MMMSXXMASM
				MSAMXMSMSA
				AMXSXMAAMM
				MSAMASMSMX
				XMASAMXAMM
				XXAMMXXAMA
				SMSMSASXSS
				SAXAMASAAA
				MAMMMXMMMM
				MXMXAXMASX
				`,
				expected: 18
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
				MMMSXXMASM
				MSAMXMSMSA
				AMXSXMAAMM
				MSAMASMSMX
				XMASAMXAMM
				XXAMMXXAMA
				SMSMSASXSS
				SAXAMASAAA
				MAMMMXMMMM
				MXMXAXMASX
				`,
				expected: 9
			},
		],
		solution: part2
	},
	trimTestInputs: true,
	onlyTests: false
});
