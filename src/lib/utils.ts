import type { Color } from '$lib/types';
import { set } from '@firebase/database';
import { codeCopied } from './store';

function getBeautifulColors(color: Color) {
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

export { getBeautifulColors, copyTextToClipboard };
