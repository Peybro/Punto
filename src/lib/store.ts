import { writable } from 'svelte/store';
import { browser } from '$app/environment';

import type { Player, Card } from './types';

const playerName = writable<string>(browser ? localStorage.getItem('localPlayerName') || '' : '');
const lobbyCode = writable<string>('');
const lobbyConnected = writable<boolean>(false);
const host = writable<string>('');
const players = writable<Player[]>([]);
const gameState = writable<{ board: Card[][]; turn: number; currentPlayerIndex: number }>({
	board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
	turn: 0,
	currentPlayerIndex: 0
});
const roundHasStarted = writable<boolean>(false);
const codeCopied = writable<boolean>(false);
const infoVisible = writable<boolean>(true);

playerName.subscribe((name) => (browser ? localStorage.setItem('localPlayerName', name) : null));

function resetApp() {
	playerName.set(browser ? localStorage.getItem('localPlayerName') || '' : '');
	lobbyCode.set('');
	lobbyConnected.set(false);
	host.set('');
	players.set([]);
	gameState.set({
		board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
		turn: 0,
		currentPlayerIndex: 0
	});
	roundHasStarted.set(false);
	infoVisible.set(true);
}

export {
	playerName,
	lobbyCode,
	lobbyConnected,
	host,
	players,
	gameState,
	roundHasStarted,
	codeCopied,
	infoVisible,
	resetApp
};
