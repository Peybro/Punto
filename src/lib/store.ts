import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { Color, type Card, Player, colors, Deck } from './types';
import { translations } from './translations';
import { goto } from '$app/navigation';
import { v4 as uuidV4 } from 'uuid';

const you = new Player('', uuidV4(), new Color(colors.Red), new Deck(colors.Red), 0);
let youInLocalStorage = JSON.parse(localStorage.getItem('localPlayerName')) || null

const player = writable<Player>(browser ? localStorage.getItem('localPlayerName') || you : you);
const lobbyCode = writable<string>('');
const lobbyConnected = writable<boolean>(false);
const host = writable<Player>(you);
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
const neutralColor = writable<Color>(new Color('NULL'));
const uuid = writable<string>(browser ? localStorage.getItem('uuid') || uuidV4() : uuidV4());

player.subscribe((name: string) =>
	browser ? localStorage.setItem('localPlayerName', name) : null
);

languageId.subscribe((id: string) => {
	invitation.text = translations[id].inviteText;
});

lobbyCode.subscribe((code: string) => {
	if (typeof window === 'undefined') return;
	invitation.url = `${window.location.origin.toString()}/?code=${code}`;
});

uuid.subscribe((id: string) => {
	browser ? localStorage.setItem('uuid', id) : null;
});

/**
 * Resets the app to its initial state
 */
function resetApp() {
	player.set(browser ? localStorage.getItem('localPlayerName') || '' : '');
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
	neutralColor.set(new Color("NULL"));
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
	uuid
};
