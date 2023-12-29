import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Card, Player } from './types';
import { translations } from './translations';
import { goto } from '$app/navigation';
import { v4 as uuidV4 } from 'uuid';

const player = writable<{ name: string; uuid: string }>(
	browser && localStorage.getItem('localPlayer') !== null
		? {
				name: JSON.parse(localStorage.getItem('localPlayer') ?? '').name,
				uuid: JSON.parse(localStorage.getItem('localPlayer') ?? '').uuid
			}
		: { name: '', uuid: uuidV4() }
);
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
	url: 'https://punto.vercel.app'
};
const neutralColor = writable<string>('');
const playersOnline = writable<string[]>([]);
const winnerWithThrees = writable<[string, number]>(['', 0]);
const oldGame = writable(
	browser && localStorage.getItem('PuntoLobby')
		? JSON.parse(localStorage.getItem('PuntoLobby') || '{}')
		: {}
);

player.subscribe((player) => {
	if (browser) localStorage.setItem('localPlayer', JSON.stringify(player));
});

languageId.subscribe((id: string) => {
	invitation.text = translations[id].inviteText;
});

lobbyCode.subscribe((code: string) => {
	if (browser) invitation.url = `${window.location.origin.toString()}/?code=${code}`;
});

oldGame.subscribe((gameVal) => {
	if (browser) localStorage.setItem('PuntoLobby', JSON.stringify(gameVal));
});

/**
 * Resets the app to its initial state
 */
function resetApp() {
	player.set(
		browser
			? {
					name: JSON.parse(localStorage.getItem('localPlayer') || '').name || '',
					uuid: JSON.parse(localStorage.getItem('localPlayer') || '').uuid || uuidV4()
				}
			: { name: '', uuid: uuidV4() }
	);
	// lobbyCode.set('');

	// reset code param in URL
	// TODO: does not work...
	// replaceState(window.location.origin, '/');
	// pushState(window.location.origin, '');
	goto(window.location.origin, { replaceState: true });

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
	neutralColor.set('');
	winnerWithThrees.set(['', 0]);
	localStorage.removeItem('PuntoLobby');
}

export {
	player,
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
	invitation,
	neutralColor,
	playersOnline,
	winnerWithThrees,
	oldGame
};
