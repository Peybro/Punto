<script lang="ts">
	import { db } from '$lib/firebase';
	import { get, ref, set, onValue, off, update } from 'firebase/database';
	import { toast } from '@zerodevx/svelte-toast';
	import Board from '$lib/components/Board.svelte';
	import {
		playerName,
		lobbyCode,
		lobbyConnected,
		host,
		players,
		gameState,
		roundHasStarted
	} from '$lib/store';
	import Face from '$lib/components/dice/Face.svelte';
	import { browser } from '$app/environment';
	import type { Player } from '$lib/types';
	import { dev } from '$app/environment';

	async function resetLobby() {
		await set(ref(db, `${$lobbyCode}/roundHasStartet`), false);

		$players = $players.map((player) => {
			return {
				name: player.name,
				connections: -1,
				color: player.color,
				deck: shuffle(
					duplicate(
						Array(9)
							.fill(0)
							.map((_, i) => i + 1)
					).map((v) => ({ value: v, color: player.color }))
				)
			};
		});
		$gameState = {
			board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
			turn: 0,
			currentPlayerIndex: 0
		};
	}

	function resetApp() {
		$playerName = browser ? localStorage.getItem('localPlayerName') || '' : '';
		$lobbyCode = '';
		$lobbyConnected = false;
		$host = '';
		$players = [];
		$gameState = {
			board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
			turn: 0,
			currentPlayerIndex: 0
		};
		$roundHasStarted = false;
	}

	function listenToLobby(code: string) {
		onValue(ref(db, `${code}/`), (snap) => {
			const data = snap.val();
			if (data === null) {
				toast.push('Raum nicht gefunden!');
				leaveLobby();
				return;
			}

			if (
				$players.some((p) => p.name === $playerName) &&
				!data.players.some((p: Player) => p.name === $playerName)
			) {
				toast.push('Du wurdest gekickt!');
				leaveLobby();
				return;
			}

			$host = data.host;
			$players = data.players;
			$gameState = data.gameState;
			$roundHasStarted = data.roundHasStartet;

			if (isInARowOfSameColor(4)) {
				// TODO: fix double win message
				toast.push(
					`${
						$gameState.currentPlayerIndex < $players.length - 1
							? $players[$gameState.currentPlayerIndex].name
							: $players[0].name
					} hat gewonnen!`
				);
				$roundHasStarted = false;
			}
		});
	}

	function stopListeningToLobby() {
		off(ref(db, `${$lobbyCode}/`));
	}

	// TODO: fix diagonal checks
	/**
	 * Returns true if there are at least nr cards of the same color (red, blue, green or yellow) in a row.
	 * @param nr The number of cards in a row.
	 */
	function isInARowOfSameColor(nr: number) {
		const width = $gameState.board[0].length;
		const height = $gameState.board.length;

		// check horizontal
		for (let i = 0; i < height; i++) {
			let count = 0;
			let lastColor = null;
			for (let j = 0; j < width; j++) {
				if ($gameState.board[i][j].value > 0) {
					if ($gameState.board[i][j].color === lastColor) {
						count++;
					} else {
						count = 1;
						lastColor = $gameState.board[i][j].color;
					}
				} else {
					count = 0;
					lastColor = null;
				}
				if (count >= nr) {
					return true;
				}
			}
		}

		// check vertical
		for (let j = 0; j < width; j++) {
			let count = 0;
			let lastColor = null;
			for (let i = 0; i < height; i++) {
				if ($gameState.board[i][j].value > 0) {
					if ($gameState.board[i][j].color === lastColor) {
						count++;
					} else {
						count = 1;
						lastColor = $gameState.board[i][j].color;
					}
				} else {
					count = 0;
					lastColor = null;
				}
				if (count >= nr) {
					return true;
				}
			}
		}

		// check diagonal (top left to bottom right)
		for (let i = 0; i < height; i++) {
			let count = 0;
			let lastColor = null;
			for (let j = 0; j < width; j++) {
				if ($gameState.board[i][j].value > 0) {
					if ($gameState.board[i][j].color === lastColor) {
						count++;
					} else {
						count = 1;
						lastColor = $gameState.board[i][j].color;
					}
				} else {
					count = 0;
					lastColor = null;
				}
				if (count >= nr) {
					return true;
				}
			}
		}

		// check diagonal (top right to bottom left)
		for (let i = 0; i < height; i++) {
			let count = 0;
			let lastColor = null;
			for (let j = width - 1; j >= 0; j--) {
				if ($gameState.board[i][j].value > 0) {
					if ($gameState.board[i][j].color === lastColor) {
						count++;
					} else {
						count = 1;
						lastColor = $gameState.board[i][j].color;
					}
				} else {
					count = 0;
					lastColor = null;
				}
				if (count >= nr) {
					return true;
				}
			}
		}

		return false;
	}

	function duplicate(arr: any[]) {
		return [...arr, ...arr];
	}

	function shuffle(arr: any[]) {
		return arr.sort(() => Math.random() - 0.5);
	}

	async function createLobby() {
		if ($playerName === '') {
			toast.push('Bitte gib einen Namen ein!');
			return;
		}

		const newLobbyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
		$lobbyCode = newLobbyCode;

		await set(ref(db, `${newLobbyCode}/`), {
			lobbyCode: newLobbyCode,
			host: $playerName,
			players: [
				{
					name: $playerName,
					connections: -1,
					color: 'red',
					deck: shuffle(
						duplicate(
							Array(9)
								.fill(0)
								.map((_, i) => i + 1)
						).map((v) => ({ value: v, color: 'red' }))
					)
				}
			],
			gameState: {
				board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
				turn: 0,
				currentPlayerIndex: 0
			}
		});

		$lobbyConnected = true;
		listenToLobby(newLobbyCode);
	}

	async function joinLobby() {
		if ($playerName === '') {
			toast.push('Bitte gib einen Namen ein!');
			return;
		}

		if ($lobbyCode.length !== 6) {
			toast.push('Bitte gib einen gültigen Raumcode ein!');
			return;
		}

		$lobbyConnected = true;
		listenToLobby($lobbyCode);

		let playersOnline: any[] = [];
		await get(ref(db, `${$lobbyCode}/players`)).then((snap: any) => {
			playersOnline = snap.val();
		});

		await update(ref(db, `${$lobbyCode}/`), {
			players: [
				...playersOnline,
				{
					name: $playerName,
					connections: -1,
					color: ['red', 'blue', 'green', 'yellow'][playersOnline.length],
					deck: duplicate(
						shuffle(
							Array(9)
								.fill(0)
								.map((_, i) => i + 1)
						).map((v) => ({
							value: v,
							color: ['red', 'blue', 'green', 'yellow'][playersOnline.length]
						}))
					)
				}
			]
		});
	}

	function closeLobby() {
		stopListeningToLobby();
		set(ref(db, `${$lobbyCode}/`), null);
		resetApp();
	}

	function leaveLobby() {
		if ($players.length === 1) {
			closeLobby();
			return;
		}
		if ($host === $playerName) {
			update(ref(db, `${$lobbyCode}/`), {
				host: $players.filter((p) => p.name !== $playerName)[0].name
			});
		}
		stopListeningToLobby();
		set(
			ref(db, `${$lobbyCode}/players/${$players.find((p) => p.name !== $playerName)?.name}`),
			null
		);
		resetApp();
	}

	async function kickPlayer(name: string) {
		await update(ref(db, `${$lobbyCode}/`), {
			players: $players.filter((p) => p.name !== name)
		});
	}

	async function startRound() {
		resetLobby();

		await set(ref(db, `${$lobbyCode}/roundHasStartet`), true);

		await set(ref(db, `${$lobbyCode}/players`), shuffle($players));

		await set(ref(db, `${$lobbyCode}/gameState`), {
			board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
			turn: 0,
			currentPlayerIndex: 0
		});
	}
</script>

<main>
	<input type="text" bind:value={$playerName} placeholder="Name" disabled={$lobbyConnected} />
	{#if $lobbyConnected && $host === $playerName}
		<button on:click={closeLobby}>Raum schließen</button>
	{:else}
		<button on:click={createLobby} disabled={$playerName.length === 0}>Raum erstellen</button>
	{/if}
	<input
		type="text"
		value={$lobbyCode}
		on:input={(e) => ($lobbyCode = e.currentTarget.value.toUpperCase())}
		placeholder="Lobby Code"
		disabled={$lobbyConnected}
	/>
	{#if $lobbyConnected}
		<button on:click={leaveLobby}>Raum verlassen</button>
	{:else}
		<button on:click={joinLobby} disabled={$lobbyCode.length !== 6}>Raum betreten</button>
	{/if}

	{#if $lobbyConnected}
		<h2>Players:</h2>
		<ul>
			{#each $players as player}
				<li style="background-color: {player.color}">
					{player.name}
					{#each player.deck as card}{card.value}{/each}
					{#if player.name === $host}
						(Host)
					{/if}
					{#if player.name === $playerName}
						(Du)
					{/if}

					{#if $playerName === $host && player.name !== $host}
						<button on:click={() => kickPlayer(player.name)}>Kick</button>
					{/if}
				</li>
			{/each}
		</ul>

		<button
			on:click={startRound}
			disabled={$players.length !== (dev ? 1 : 4) || $playerName !== $host || $roundHasStarted}
			>Start</button
		>
		<button on:click={resetLobby} disabled={!$roundHasStarted}>Runde beenden</button>

		{#if $players.length > 0 && $gameState.currentPlayerIndex >= 0}
			<h3>
				Zug #{$gameState.turn + 1}:
				<span style="background-color: {$players[$gameState.currentPlayerIndex].color}"
					>{$players[$gameState.currentPlayerIndex].name}</span
				>
			</h3>
		{/if}

		<Board />
	{:else}
		<h1>Kein Raum verbunden</h1>
	{/if}
</main>

{#if dev}
	<button on:click={() => set(ref(db, '/'), null)}>Reset DB</button>
{/if}
