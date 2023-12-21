import type { Card, Color } from '$lib/types';
import { set } from '@firebase/database';
import { codeCopied } from './store';

function getBeautifulColors(color: Color | string) {
	return [
		{ color: 'red', hex: '#dc3522', bootstrap: 'danger' },
		{ color: 'blue', hex: '#02ace7', bootstrap: 'info' },
		{ color: 'green', hex: '#78b728', bootstrap: 'success' },
		{ color: 'yellow', hex: '#f1b300', bootstrap: 'warning' }
	].find((c) => c.color === color);
}

function copyTextToClipboard(text: string) {
	if (!navigator.clipboard) {
		return;
	}
	navigator.clipboard.writeText(text).then(
		function () {
			console.log('Async: Copying to clipboard was successful!');
			codeCopied.set(true);

			setTimeout(() => {
				codeCopied.set(false);
			}, 3000);
		},
		function (err) {
			console.error('Async: Could not copy text: ', err);
		}
	);
}

function duplicate(arr: any[]): any[] {
	return [...arr, ...arr];
}

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

export { getBeautifulColors, copyTextToClipboard, duplicate, shuffle, fourInARow };
