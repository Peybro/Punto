import type { Color } from '$lib/types';

function getBeautifulColors(color: Color) {
    return [
        { color: 'red', hex: '#dc3522' },
        { color: 'blue', hex: '#02ace7' },
        { color: 'green', hex: '#78b728' },
        { color: 'yellow', hex: '#f1b300' }
    ].find((c) => c.color === color)?.hex;
}

export { getBeautifulColors };