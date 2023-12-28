import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { Color, colors, Deck, GameState, Player } from './types';
import { translations } from './translations';
import { goto } from '$app/navigation';
import { v4 as uuidV4 } from 'uuid';

const youJson = () =>
	JSON.parse(
		localStorage.getItem('localPlayerName') ||
		JSON.stringify(new Player('', uuidV4(), new Color(colors.Red), new Deck(colors.Red), 0))
	);
let youInLocalStorage = () =>
	new Player(youJson().name, youJson().uuid, youJson().color, youJson().deck, youJson().wins);

const player = writable<Player>(youInLocalStorage() || JSON.stringify(youInLocalStorage()));
const lobbyCode = writable<string>('');
const lobbyConnected = writable<boolean>(false);
const host = writable<Player>(youInLocalStorage());
const players = writable<Player[]>([]);
const gameState = writable<GameState>(
	new GameState(Array(11).fill(Array(11).fill({ value: 0, color: null })), 0, 0)
);
const roundHasStarted = writable<boolean>(false);
const codeCopied = writable<boolean>(false);
const infoVisible = writable<boolean>(true);
const languageId = writable<string>(browser ? navigator.language.split('-')[0] || 'en' : 'en');
const invitation = {
	title: 'Punto',
	text: 'Let\'s play Punto!',
	url: 'https://punto.vercel.app'
};
const neutralColor = writable<Color>(new Color('NULL'));
const uuid = writable<string>(browser ? localStorage.getItem('uuid') || uuidV4() : uuidV4());

player.subscribe((player: Player) =>
	browser ? localStorage.setItem('localPlayerName', JSON.stringify(player)) : null
);

languageId.subscribe((id: string) => {
	invitation.text = translations[id].inviteText;
});

lobbyCode.subscribe((code: string) => {
	if (browser) invitation.url = `${window.location.origin.toString()}/?code=${code}`;
});

uuid.subscribe((id: string) => {
	browser ? localStorage.setItem('uuid', id) : null;
});

/**
 * Resets the app to its initial state
 */
async function resetApp(): Promise<void> {
	player.set(youInLocalStorage());
	await goto(window.location.origin, { replaceState: true });
	lobbyConnected.set(false);
	host.set(youInLocalStorage());
	players.set([]);
	gameState.set({
		board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
		turn: 0,
		currentPlayerIndex: 0
	});
	roundHasStarted.set(false);
	infoVisible.set(true);
	neutralColor.set(new Color('NULL'));
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
