import { writable } from 'svelte/store';
import { browser } from '$app/environment';

import type { Player, Card } from './types';
import { translations } from './translations';

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
const languageId = writable<string>(browser ? navigator.language.split('-')[0] || 'en' : 'en');
const invitation = {
	title: 'Punto',
	text: "Let's play Punto!",
	url: window.location.toString()
};

playerName.subscribe((name: string) =>
	browser ? localStorage.setItem('localPlayerName', name) : null
);

languageId.subscribe((id: string) => {
	invitation.text = translations[id].inviteText;
});

/**
 * Resets the app to its initial state
 */
function resetApp() {
	playerName.set(browser ? localStorage.getItem('localPlayerName') || '' : '');
	lobbyCode.set('');

	// reset code param in URL
	const urlParams = new URLSearchParams(window.location.search);
	urlParams.delete('code');
	window.location.search = urlParams.toString();

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
	resetApp,
	languageId,
	invitation
};
