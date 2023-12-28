import { describe, beforeEach, test, expect } from 'vitest';

import {
	copyTextToClipboard,
	getMinAndMaxIndices,
	isAllowedField,
	getPlayedBoardDimensions,
	cellOnBoard,
	hasNeighbourCard,
	duplicate,
	shuffle,
	fourInARow,
	getMostThrees
} from '$lib/utils';

// TODO: write tests for utils.ts

// describe('getBeautifulColors', () => {
// 	test('returns correct color object for red', () => {
// 		const color = getBeautifulColors('red');
// 		expect(color).toEqual({ color: 'red', hex: '#dc3522', bootstrap: 'danger' });
// 	});

// 	test('returns correct color object for blue', () => {
// 		const color = getBeautifulColors('blue');
// 		expect(color).toEqual({ color: 'blue', hex: '#02ace7', bootstrap: 'info' });
// 	});

// 	test('returns correct color object for green', () => {
// 		const color = getBeautifulColors('green');
// 		expect(color).toEqual({ color: 'green', hex: '#78b728', bootstrap: 'success' });
// 	});

// 	test('returns correct color object for yellow', () => {
// 		const color = getBeautifulColors('yellow');
// 		expect(color).toEqual({ color: 'yellow', hex: '#f1b300', bootstrap: 'warning' });
// 	});

// 	test('returns undefined for invalid color', () => {
// 		const color = getBeautifulColors('purple');
// 		expect(color).toBeUndefined();
// 	});
// });

describe('copyTextToClipboard', () => {
	// test('copies text to clipboard and sets codeCopied to true', async () => {
	// 	const text = 'Hello, world!'
	// 	await copyTextToClipboard(text)
	// 	expect(navigator.clipboard.readText()).resolves.toBe(text)
	// 	expect(codeCopied.get()).toBe(true)
	//   })
	//   test('sets codeCopied back to false after 3 seconds', async () => {
	// 	const text = 'Hello, world!'
	// 	await copyTextToClipboard(text)
	// 	await new Promise(resolve => setTimeout(resolve, 3000))
	// 	expect(codeCopied.get()).toBe(false)
	//   })
	//   test('does nothing if navigator.clipboard is not available', async () => {
	// 	const originalClipboard = navigator.clipboard
	// 	navigator.clipboard = null
	// 	await copyTextToClipboard('Hello, world!')
	// 	expect(codeCopied.get()).toBe(false)
	// 	navigator.clipboard = originalClipboard
	//   })
});

describe('getMinAndMaxIndices', () => {
	// test('returns correct min and max indices for a non-empty board', () => {
	// 	const board = [
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }],
	// 		[{ value: 0 }, { value: 1 }, { value: 0 }],
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }]
	// 	];
	// 	const indices = getMinAndMaxIndices(board);
	// 	expect(indices).toEqual({ minX: 1, maxX: 1, minY: 1, maxY: 1 });
	// });
	// test('returns correct min and max indices for a board with multiple non-zero values', () => {
	// 	const board = [
	// 		[{ value: 0 }, { value: 1 }, { value: 0 }],
	// 		[{ value: 1 }, { value: 0 }, { value: 1 }],
	// 		[{ value: 0 }, { value: 1 }, { value: 0 }]
	// 	];
	// 	const indices = getMinAndMaxIndices(board);
	// 	expect(indices).toEqual({ minX: 0, maxX: 2, minY: 0, maxY: 2 });
	// });
	// test('returns initial values for an empty board', () => {
	// 	const board = [
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }],
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }],
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }]
	// 	];
	// 	const indices = getMinAndMaxIndices(board);
	// 	expect(indices).toEqual({ minX: 3, maxX: 0, minY: 3, maxY: 0 });
	// });
});

describe('isAllowedField', () => {
	// test('allows the first move to be in the center of the board', () => {
	// 	const gameState = {
	// 	  turn: 0,
	// 	  board: Array(11).fill().map(() => Array(11).fill({ value: 0 }))
	// 	}
	// 	const isAllowed = isAllowedField(gameState, 5, 5)
	// 	expect(isAllowed).toBe(true)
	//   })
	//   test('does not allow the first move to be outside the center of the board', () => {
	// 	const gameState = {
	// 	  turn: 0,
	// 	  board: Array(11).fill().map(() => Array(11).fill({ value: 0 }))
	// 	}
	// 	const isAllowed = isAllowedField(gameState, 0, 0)
	// 	expect(isAllowed).toBe(false)
	//   })
	//   test('allows a move next to an existing card', () => {
	// 	const gameState = {
	// 	  turn: 1,
	// 	  board: Array(11).fill().map(() => Array(11).fill({ value: 0 }))
	// 	}
	// 	gameState.board[5][5] = { value: 1 }
	// 	const isAllowed = isAllowedField(gameState, 5, 6)
	// 	expect(isAllowed).toBe(true)
	//   })
	//   test('does not allow a move far away from existing cards', () => {
	// 	const gameState = {
	// 	  turn: 1,
	// 	  board: Array(11).fill().map(() => Array(11).fill({ value: 0 }))
	// 	}
	// 	gameState.board[5][5] = { value: 1 }
	// 	const isAllowed = isAllowedField(gameState, 0, 0)
	// 	expect(isAllowed).toBe(false)
	//   })
});

describe('getPlayedBoardDimensions', () => {
	// test('returns correct dimensions for a non-empty board', () => {
	// 	const board = [
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }],
	// 		[{ value: 0 }, { value: 1 }, { value: 0 }],
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }]
	// 	];
	// 	const dimensions = getPlayedBoardDimensions(board);
	// 	expect(dimensions).toEqual({ height: 1, width: 1 });
	// });
	// test('returns correct dimensions for a board with multiple non-zero values', () => {
	// 	const board = [
	// 		[{ value: 0 }, { value: 1 }, { value: 0 }],
	// 		[{ value: 1 }, { value: 0 }, { value: 1 }],
	// 		[{ value: 0 }, { value: 1 }, { value: 0 }]
	// 	];
	// 	const dimensions = getPlayedBoardDimensions(board);
	// 	expect(dimensions).toEqual({ height: 3, width: 3 });
	// });
	// test('returns zero dimensions for an empty board', () => {
	// 	const board = [
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }],
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }],
	// 		[{ value: 0 }, { value: 0 }, { value: 0 }]
	// 	];
	// 	const dimensions = getPlayedBoardDimensions(board);
	// 	expect(dimensions).toEqual({ height: 0, width: 0 });
	// });
});

describe('cellOnBoard', () => {
	// test('returns true for a cell on the board', () => {
	// 	const board = Array(10).fill().map(() => Array(10).fill({ value: 0 }))
	// 	const isOnBoard = cellOnBoard(board, 5, 5)
	// 	expect(isOnBoard).toBe(true)
	//   })
	//   test('returns false for a cell off the board (negative row)', () => {
	// 	const board = Array(10).fill().map(() => Array(10).fill({ value: 0 }))
	// 	const isOnBoard = cellOnBoard(board, -1, 5)
	// 	expect(isOnBoard).toBe(false)
	//   })
	//   test('returns false for a cell off the board (negative column)', () => {
	// 	const board = Array(10).fill().map(() => Array(10).fill({ value: 0 }))
	// 	const isOnBoard = cellOnBoard(board, 5, -1)
	// 	expect(isOnBoard).toBe(false)
	//   })
	//   test('returns false for a cell off the board (row too large)', () => {
	// 	const board = Array(10).fill().map(() => Array(10).fill({ value: 0 }))
	// 	const isOnBoard = cellOnBoard(board, 10, 5)
	// 	expect(isOnBoard).toBe(false)
	//   })
	//   test('returns false for a cell off the board (column too large)', () => {
	// 	const board = Array(10).fill().map(() => Array(10).fill({ value: 0 }))
	// 	const isOnBoard = cellOnBoard(board, 5, 10)
	// 	expect(isOnBoard).toBe(false)
	//   })
});

describe('hasNeighbourCard', () => {
	// test('returns true for a cell with a neighbour card', () => {
	// 	const board = [
	// 	  [ { value: 0 }, { value: 0 }, { value: 0 } ],
	// 	  [ { value: 0 }, { value: 1 }, { value: 0 } ],
	// 	  [ { value: 0 }, { value: 0 }, { value: 0 } ]
	// 	]
	// 	const hasNeighbour = hasNeighbourCard(board, 1, 2)
	// 	expect(hasNeighbour).toBe(true)
	//   })
	//   test('returns false for a cell without a neighbour card', () => {
	// 	const board = [
	// 	  [ { value: 0 }, { value: 0 }, { value: 0 } ],
	// 	  [ { value: 0 }, { value: 1 }, { value: 0 } ],
	// 	  [ { value: 0 }, { value: 0 }, { value: 0 } ]
	// 	]
	// 	const hasNeighbour = hasNeighbourCard(board, 0, 0)
	// 	expect(hasNeighbour).toBe(false)
	//   })
	//   test('returns true for a cell that is a card', () => {
	// 	const board = [
	// 	  [ { value: 0 }, { value: 0 }, { value: 0 } ],
	// 	  [ { value: 0 }, { value: 1 }, { value: 0 } ],
	// 	  [ { value: 0 }, { value: 0 }, { value: 0 } ]
	// 	]
	// 	const hasNeighbour = hasNeighbourCard(board, 1, 1)
	// 	expect(hasNeighbour).toBe(true)
	//   })
	//   test('returns false for a cell off the board', () => {
	// 	const board = [
	// 	  [ { value: 0 }, { value: 0 }, { value: 0 } ],
	// 	  [ { value: 0 }, { value: 1 }, { value: 0 } ],
	// 	  [ { value: 0 }, { value: 0 }, { value: 0 } ]
	// 	]
	// 	const hasNeighbour = hasNeighbourCard(board, -1, -1)
	// 	expect(hasNeighbour).toBe(false)
	//   })
});

describe('duplicate', () => {
	test('returns correct duplicated array for a non-empty array', () => {
		const arr = [1, 2, 3];
		const duplicated = duplicate(arr);
		expect(duplicated).toEqual([1, 2, 3, 1, 2, 3]);
	});

	test('returns correct duplicated array for an array with one element', () => {
		const arr = [1];
		const duplicated = duplicate(arr);
		expect(duplicated).toEqual([1, 1]);
	});

	test('returns an empty array for an empty array', () => {
		const arr: any[] = [];
		const duplicated = duplicate(arr);
		expect(duplicated).toEqual([]);
	});
});

describe('shuffle', () => {
	test('returns a shuffled array for a non-empty array', () => {
		const arr = [1, 2, 3, 4, 5];
		const shuffled = shuffle(arr);
		expect(shuffled).toHaveLength(5);
		expect(shuffled).toContain(1);
		expect(shuffled).toContain(2);
		expect(shuffled).toContain(3);
		expect(shuffled).toContain(4);
		expect(shuffled).toContain(5);
	});

	test('returns an empty array for an empty array', () => {
		const arr: any[] = [];
		const shuffled = shuffle(arr);
		expect(shuffled).toEqual([]);
	});
});

describe('fourInARow', () => {
	// test('returns true for a board with four in a row horizontally', () => {
	// 	const board = [
	// 	  [ { value: 1, color: 'red' }, { value: 1, color: 'red' }, { value: 1, color: 'red' }, { value: 1, color: 'red' } ],
	// 	  [ { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' } ]
	// 	]
	// 	const hasFourInARow = fourInARow(board, 'neutral')
	// 	expect(hasFourInARow).toBe(true)
	//   })
	//   test('returns true for a board with four in a row vertically', () => {
	// 	const board = [
	// 	  [ { value: 1, color: 'red' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 1, color: 'red' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 1, color: 'red' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 1, color: 'red' }, { value: 0, color: 'neutral' } ]
	// 	]
	// 	const hasFourInARow = fourInARow(board, 'neutral')
	// 	expect(hasFourInARow).toBe(true)
	//   })
	//   test('returns true for a board with four in a row diagonally (top left to bottom right)', () => {
	// 	const board = [
	// 	  [ { value: 1, color: 'red' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 0, color: 'neutral' }, { value: 1, color: 'red' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 1, color: 'red' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 1, color: 'red' } ]
	// 	]
	// 	const hasFourInARow = fourInARow(board, 'neutral')
	// 	expect(hasFourInARow).toBe(true)
	//   })
	//   test('returns true for a board with four in a row diagonally (bottom left to top right)', () => {
	// 	const board = [
	// 	  [ { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 1, color: 'red' } ],
	// 	  [ { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 1, color: 'red' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 0, color: 'neutral' }, { value: 1, color: 'red' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 1, color: 'red' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' } ]
	// 	]
	// 	const hasFourInARow = fourInARow(board, 'neutral')
	// 	expect(hasFourInARow).toBe(true)
	//   })
	//   test('returns false for a board without four in a row', () => {
	// 	const board = [
	// 	  [ { value: 1, color: 'red' }, { value: 1, color: 'red' }, { value: 1, color: 'red' }, { value: 0, color: 'neutral' } ],
	// 	  [ { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' }, { value: 0, color: 'neutral' } ]
	// 	]
	// 	const hasFourInARow = fourInARow(board, 'neutral')
	// 	expect(hasFourInARow).toBe(false)
	//   })
});

describe('getMostThrees', () => {
	// test('returns correct counts for a board with horizontal threes', () => {
	// 	const board = [
	// 		[
	// 			{ value: 1, color: 'red' },
	// 			{ value: 1, color: 'red' },
	// 			{ value: 1, color: 'red' },
	// 			{ value: 0, color: 'neutral' }
	// 		],
	// 		[
	// 			{ value: 1, color: 'blue' },
	// 			{ value: 1, color: 'blue' },
	// 			{ value: 1, color: 'blue' },
	// 			{ value: 0, color: 'neutral' }
	// 		]
	// 	];
	// 	const counts = getMostThrees(board);
	// 	expect(counts).toEqual({ red: 1, blue: 1, green: 0, yellow: 0 });
	// });
	// test('returns correct counts for a board with vertical threes', () => {
	// 	const board = [
	// 		[
	// 			{ value: 1, color: 'red' },
	// 			{ value: 1, color: 'blue' }
	// 		],
	// 		[
	// 			{ value: 1, color: 'red' },
	// 			{ value: 1, color: 'blue' }
	// 		],
	// 		[
	// 			{ value: 1, color: 'red' },
	// 			{ value: 1, color: 'blue' }
	// 		],
	// 		[
	// 			{ value: 0, color: 'neutral' },
	// 			{ value: 0, color: 'neutral' }
	// 		]
	// 	];
	// 	const counts = getMostThrees(board);
	// 	expect(counts).toEqual({ red: 1, blue: 1, green: 0, yellow: 0 });
	// });
	// test('returns zero counts for a board without threes', () => {
	// 	const board = [
	// 		[
	// 			{ value: 1, color: 'red' },
	// 			{ value: 1, color: 'red' },
	// 			{ value: 0, color: 'neutral' },
	// 			{ value: 0, color: 'neutral' }
	// 		],
	// 		[
	// 			{ value: 1, color: 'blue' },
	// 			{ value: 1, color: 'blue' },
	// 			{ value: 0, color: 'neutral' },
	// 			{ value: 0, color: 'neutral' }
	// 		]
	// 	];
	// 	const counts = getMostThrees(board);
	// 	expect(counts).toEqual({ red: 0, blue: 0, green: 0, yellow: 0 });
	// });
});
