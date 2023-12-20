<script lang="ts">
	import { db } from '$lib/firebase';
	import { get, ref, set, onValue, off, update } from 'firebase/database';
	// import { toast } from '@zerodevx/svelte-toast';
	import toast, { Toaster } from 'svelte-french-toast';
	import Board from '$lib/components/Board.svelte';
	import {
		playerName,
		lobbyCode,
		lobbyConnected,
		host,
		players,
		gameState,
		roundHasStarted,
		codeCopied
	} from '$lib/store';
	import Face from '$lib/components/dice/Face.svelte';
	import { browser } from '$app/environment';
	import type { Color, Player } from '$lib/types';
	import { dev } from '$app/environment';
	import { copyTextToClipboard, getBeautifulColors } from '$lib/utils';

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
				toast.error('Raum nicht gefunden!');
				leaveLobby();
				return;
			}

			if (
				$players.some((p) => p.name === $playerName) &&
				!data.players.some((p: Player) => p.name === $playerName)
			) {
				toast.error('Du wurdest gekickt!');
				leaveLobby();
				return;
			}

			$host = data.host;
			$players = data.players;
			$gameState = data.gameState;
			$roundHasStarted = data.roundHasStartet;

			if (isInARowOfSameColor(4)) {
				// TODO: fix double win message
				toast(
					`${
						$gameState.currentPlayerIndex < $players.length - 1
							? $players[$gameState.currentPlayerIndex].name
							: $players[0].name
					} hat gewonnen!`,
					{ icon: '🎉' }
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
			toast.error('Bitte gib einen Namen ein!');
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

	// TODO: fix joining with same name possible
	async function joinLobby() {
		let legitToJoin = true;

		if ($playerName === '') {
			toast.error('Bitte gib einen Namen ein!');
			legitToJoin = false;
			return;
		}

		if ($lobbyCode.length !== 6) {
			toast.error('Bitte gib einen gültigen Raumcode ein!');
			legitToJoin = false;
			return;
		}

		$lobbyConnected = true;
		listenToLobby($lobbyCode);

		let playersOnline: any[] = [];
		await get(ref(db, `${$lobbyCode}/players`)).then((snap: any) => {
			playersOnline = snap.val();
		});

		if (playersOnline.some((p) => p.name === $playerName)) {
			toast.error('Es gibt bereits einen Spieler mit diesem Namen!');
			legitToJoin = false;
			return;
		}

		if (legitToJoin) {
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
		} else {
			stopListeningToLobby();
			$lobbyConnected = false;
		}
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

<main class="container">
	<h1>
		<span class="text-danger">p</span>
		<span class="text-info">u</span>
		<span class="text-warning">n</span>
		<span class="text-success">t</span>
		<span class="text-danger">o</span>
	</h1>

	<input
		type="text"
		class="form-control"
		bind:value={$playerName}
		placeholder="Name"
		disabled={$lobbyConnected}
	/>
	{#if $lobbyConnected && $host === $playerName}
		<button class="btn btn-danger" on:click={closeLobby}>Raum schließen</button>
	{:else}
		<button class="btn btn-primary" on:click={createLobby} disabled={$playerName.length === 0}
			>Raum erstellen</button
		>
	{/if}

	<div class="input-group">
		<input
			type="text"
			class="form-control"
			value={$lobbyCode}
			on:input={(e) => ($lobbyCode = e.currentTarget.value.toUpperCase())}
			placeholder="Lobby Code"
			disabled={$lobbyConnected}
		/>
		{#if navigator.clipboard && $lobbyConnected}
			<button class="btn btn-outline-primary" on:click={() => copyTextToClipboard($lobbyCode)}
				>{#if $codeCopied}
					<i class="bi bi-clipboard-check"></i>
				{:else}<i class="bi bi-clipboard-plus"></i>
				{/if}</button
			>
		{/if}
	</div>

	{#if $lobbyConnected}
		<button class="btn btn-warning" on:click={leaveLobby}>Raum verlassen</button>
	{:else}
		<button class="btn btn-primary" on:click={joinLobby} disabled={$lobbyCode.length !== 6}
			>Raum betreten</button
		>
	{/if}

	{#if $lobbyConnected}
		<div class="container">
			<div class="my-4 row">
				{#each $players as player}
					<div class="btn-group col">
						<button type="button" class={`bg-${getBeautifulColors(player.color)?.bootstrap}`}
							>{player.name}
							{#if player.name === $host}
								(Host)
							{/if}</button
						>
						<button
							type="button"
							class="btn btn-danger dropdown-toggle dropdown-toggle-split"
							data-bs-toggle="dropdown"
						>
							<span class="visually-hidden">Toggle Dropdown</span>
						</button>
						<ul class="dropdown-menu">
							<li>
								<a class="dropdown-item" role="button" on:click={() => console.log('test')}>rot</a>
							</li>
							<li>
								<a class="dropdown-item" role="button" on:click={() => console.log('test')}>blau</a>
							</li>
							<li>
								<a class="dropdown-item" role="button" on:click={() => console.log('test')}>gelb</a>
							</li>
							<li>
								<a class="dropdown-item" role="button" on:click={() => console.log('test')}>grün</a>
							</li>
							{#if $playerName === $host && player.name !== $host}
								<li><hr class="dropdown-divider" /></li>
								<li>
									<a class="dropdown-item" role="button" on:click={() => kickPlayer(player.name)}
										>Kick</a
									>
								</li>
							{/if}
						</ul>
					</div>
				{/each}
				{#each Array(4 - $players.length) as _}
					<div class="col bg-secondary p-2 border">[unbesetzt]</div>
				{/each}
			</div>
		</div>

		<button
			class="btn btn-primary"
			on:click={startRound}
			disabled={(dev ? false : $players.length !== 4) || $playerName !== $host || $roundHasStarted}
			>Start</button
		>
		<button
			class="btn btn-warning"
			on:click={resetLobby}
			disabled={$playerName !== $host || !$roundHasStarted}>Runde beenden</button
		>

		{#if $players.length > 0 && $gameState.currentPlayerIndex >= 0}
			<h3>
				Zug #{$gameState.turn + 1}:
				<span
					class={`bg-${
						getBeautifulColors($players[$gameState.currentPlayerIndex]?.color)?.bootstrap
					}`}
					>{$players[$gameState.currentPlayerIndex].name}:
					{$players[$gameState.currentPlayerIndex].deck[0].value}</span
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
