import type { Card, Color, GameState } from '$lib/types';
import { codeCopied } from './store';

/**
 * Returns a color object with the color, hex and bootstrap color.
 * @param color
 */
function getBeautifulColors(color: Color | string) {
	return [
		{ color: 'red', hex: '#dc3522', bootstrap: 'danger' },
		{ color: 'blue', hex: '#02ace7', bootstrap: 'info' },
		{ color: 'green', hex: '#78b728', bootstrap: 'success' },
		{ color: 'yellow', hex: '#f1b300', bootstrap: 'warning' }
	].find((c) => c.color === color);
}

/**
 * Copies the given text to the clipboard.
 * @param text
 */
async function copyTextToClipboard(text: string) {
	if (navigator.share && typeOf window !== undefined) {
	 	await navigator.share({
     title: 'Punto',
     text: 'Willst du mit mir Punto spielen?',
     url: window.location.href.toString()
   });
	} else {
   if (!navigator.clipboard) return;
	  await navigator.clipboard.writeText(text);
			codeCopied.set(true);

			setTimeout(() => {
				codeCopied.set(false);
			}, 3000);
	 },
}

/**
 * Returns the minimum and maximum indices of the board that are actually used.
 * @param board
 * @returns
 */
function getMinAndMaxIndices(board: Card[][]) {
	let minY = board.length;
	let maxY = 0;
	let minX = board[0].length;
	let maxX = 0;

	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j].value > 0) {
				if (j < minX) {
					minX = j;
				}
				if (j > maxX) {
					maxX = j;
				}
				if (i < minY) {
					minY = i;
				}
				if (i > maxY) {
					maxY = i;
				}
			}
		}
	}

	return { minX, maxX, minY, maxY };
}

/**
 * Returns true if the field is allowed to be played on.
 * @param rowIndex
 * @param cardIndex
 */
function isAllowedField(gameState: GameState, rowIndex: number, cardIndex: number) {
	const board = gameState.board;

	// check if the field is in the allowed area
	let minY = -1;
	let maxY = -1;
	let minX = -1;
	let maxX = -1;

	if (getPlayedBoardDimensions(board).height === 6) {
		minY = getMinAndMaxIndices(board).maxY - 5;
		maxY = getMinAndMaxIndices(board).minY + 5;
	}

	if (getPlayedBoardDimensions(board).width === 6) {
		minX = getMinAndMaxIndices(board).maxX - 5;
		maxX = getMinAndMaxIndices(board).minX + 5;
	}

	if (
		(minX >= 0 && cardIndex < minX) ||
		(maxX >= 0 && cardIndex > maxX) ||
		(minY >= 0 && rowIndex < minY) ||
		(maxY >= 0 && rowIndex > maxY)
	) {
		return false;
	}

	return (
		// first round
		(gameState.turn === 0 && rowIndex === 5 && cardIndex === 5) ||
		// else
		hasNeighbourCard(board, rowIndex, cardIndex)
	);
}

/**
 * Returns the width and height of the part of the board that are actually used.
 */
function getPlayedBoardDimensions(board: Card[][]) {
	const { minX, maxX, minY, maxY } = getMinAndMaxIndices(board);

	return { height: maxY - minY + 1, width: maxX - minX + 1 };
}

/**
 * Returns true if the cell is on the board.
 * @param row
 * @param col
 */
function cellOnBoard(board: Card[][], row: number, col: number) {
	return row >= 0 && row < board.length && col >= 0 && col < board.length;
}

/**
 * Returns true if the cell has a neighbour card (cell with value > 0).
 * @param row
 * @param col
 */
function hasNeighbourCard(board: Card[][], row: number, col: number) {
	return (
		// cell itself
		(cellOnBoard(board, row, col) && board[row][col].value > 0) ||
		// right neighbour
		(cellOnBoard(board, row, col + 1) && board[row][col + 1].value > 0) ||
		// right bottom neighbour
		(cellOnBoard(board, row + 1, col + 1) && board[row + 1][col + 1].value > 0) ||
		// bottom neighbour
		(cellOnBoard(board, row + 1, col) && board[row + 1][col].value > 0) ||
		// left bottom neighbour
		(cellOnBoard(board, row + 1, col - 1) && board[row + 1][col - 1].value > 0) ||
		// left neighbour
		(cellOnBoard(board, row, col - 1) && board[row][col - 1].value > 0) ||
		// left top neighbour
		(cellOnBoard(board, row - 1, col - 1) && board[row - 1][col - 1].value > 0) ||
		// top neighbour
		(cellOnBoard(board, row - 1, col) && board[row - 1][col].value > 0) ||
		// right top neighbour
		(cellOnBoard(board, row - 1, col + 1) && board[row - 1][col + 1].value > 0)
	);
}

/**
 * Returns a new array with the same elements twice.
 * @param arr array to duplicate
 * @returns duplicated array
 */
function duplicate(arr: any[]): any[] {
	return [...arr, ...arr];
}

/**
 * Returns a shuffled array.
 * @param arr array to shuffle
 * @returns shuffled array
 */
function shuffle(arr: any[]): any[] {
	return arr.sort(() => Math.random() - 0.5);
}

/**
 * Returns true if there are at least nr cards of the same color (red, blue, green or yellow) in a row.
 * @param nr The number of cards in a row.
 */
function fourInARow(board: Card[][]) {
	const width = board[0].length;
	const height = board.length;

	// check horizontal
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width - 3; j++) {
			if (
				board[i][j].value > 0 &&
				board[i][j].color === board[i][j + 1].color &&
				board[i][j].color === board[i][j + 2].color &&
				board[i][j].color === board[i][j + 3].color
			) {
				return true;
			}
		}
	}

	// check vertical
	for (let i = 0; i < height - 3; i++) {
		for (let j = 0; j < width; j++) {
			if (
				board[i][j].value > 0 &&
				board[i][j].color === board[i + 1][j].color &&
				board[i][j].color === board[i + 2][j].color &&
				board[i][j].color === board[i + 3][j].color
			) {
				return true;
			}
		}
	}

	// check diagonal (top left to bottom right)
	for (let i = 3; i < height; i++) {
		for (let j = 3; j < width; j++) {
			if (
				board[i][j].value > 0 &&
				board[i][j].color === board[i - 1][j - 1].color &&
				board[i][j].color === board[i - 2][j - 2].color &&
				board[i][j].color === board[i - 3][j - 3].color
			) {
				return true;
			}
		}
	}

	// check diagonal (bottom left to top right)
	for (let i = 3; i < height; i++) {
		for (let j = 0; j < width - 3; j++) {
			if (
				board[i][j].value > 0 &&
				board[i][j].color === board[i - 1][j + 1].color &&
				board[i][j].color === board[i - 2][j + 2].color &&
				board[i][j].color === board[i - 3][j + 3].color
			) {
				return true;
			}
		}
	}

	return false;
}

// TODO: implement
/**
 * Counts the number of threes in a row for each color.
 * @param board The board to check.
 */
function getMostThrees(board: Card[][]) {
	// return ['red', 'blue', 'yellow', 'green'].map((color) => {
	// 	let threes = 0;
	// 	for (let i = 0; i < board.length; i++) {
	// 		for (let j = 0; j < board[i].length; j++) {
	// 			if (board[i][j].color === color) {
	// 					threes++;
	// 			}
	// 		}
	// 	}
	// 	return { color, threes: threes / 3 };
	// });
}

export {
	getBeautifulColors,
	copyTextToClipboard,
	duplicate,
	shuffle,
	fourInARow,
	getMostThrees,
	getPlayedBoardDimensions,
	getMinAndMaxIndices,
	cellOnBoard,
	hasNeighbourCard,
	isAllowedField
};
