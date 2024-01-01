import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Player } from './types';
import { goto } from '$app/navigation';
import { usePlayerStore } from '$lib/stores/player-store';
import { useGameStateStore } from '$lib/stores/gamestate-store';
import { useLanguageIdStore } from '$lib/stores/languageId-store';
import { useInvitationStore } from './stores/invitation-store';

// custom stores
const player = usePlayerStore();
const gameState = useGameStateStore();
const languageId = useLanguageIdStore();
const invitation = useInvitationStore();

// normal stores
const lobbyCode = writable<string>('');
const lobbyConnected = writable<boolean>(false);
const host = writable<{ name: string; uuid: string }>({ name: '', uuid: '' });
const players = writable<Player[]>([]);
const roundHasStarted = writable<boolean>(false);
const codeCopied = writable<boolean>(false);
const infoVisible = writable<boolean>(true);
const neutralColor = writable<string>('');
const playersOnline = writable<string[]>([]);
const winnerWithThrees = writable<[string, number]>(['', 0]);
const oldGame = writable(browser ? JSON.parse(localStorage.getItem('PuntoLobby') ?? '{}') : {});

lobbyCode.subscribe((code: string) => {
	if (browser) invitation.update({ url: `${window.location.origin.toString()}/?code=${code}` });
});

oldGame.subscribe((gameVal) => {
	if (browser) localStorage.setItem('PuntoLobby', JSON.stringify(gameVal));
});

/**
 * Resets the app to its initial state
 */
function resetApp() {
	player.reset();
	gameState.reset();
	lobbyConnected.set(false);
	host.set({ name: '', uuid: '' });
	players.set([]);
	roundHasStarted.set(false);
	infoVisible.set(true);
	neutralColor.set('');
	winnerWithThrees.set(['', 0]);
	if (browser) localStorage.removeItem('PuntoLobby');
	goto(window.location.origin, { replaceState: true });
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
