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

	let infoVisible = true;

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

		infoVisible = true;
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
		infoVisible = true;
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
				$players.some((p: Player) => p.name === $playerName) &&
				!data.players.some((p: Player) => p.name === $playerName)
			) {
				toast.error('Du wurdest gekickt!');
				leaveLobby();
				return;
			}

			if ($roundHasStarted && fourInARow()) {
				toast(
					`${
						$gameState.currentPlayerIndex < $players.length - 1
							? $players[$gameState.currentPlayerIndex].name
							: $players[0].name
					} hat gewonnen!`,
					{ icon: '🎉' }
				);
				$roundHasStarted = false;
				infoVisible = true;
				return;
			}

			$host = data.host;
			$players = data.players;
			$gameState = data.gameState;
			$roundHasStarted = data.roundHasStartet;
			infoVisible = !data.roundHasStartet;

			if ($players.every((p) => p.deck === undefined)) {
				// TODO: count automatically
				toast.error('Keine Karten mehr! Es gewinnt der Spieler mit den meisten 3er-Reihen!');
				$roundHasStarted = false;
				infoVisible = true;
				return;
			}
		});
	}

	function stopListeningToLobby() {
		off(ref(db, `${$lobbyCode}/`));
	}

	/**
	 * Returns true if there are at least nr cards of the same color (red, blue, green or yellow) in a row.
	 * @param nr The number of cards in a row.
	 */
	function fourInARow() {
		const width = $gameState.board[0].length;
		const height = $gameState.board.length;

		// check horizontal
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width - 3; j++) {
				if (
					$gameState.board[i][j].value > 0 &&
					$gameState.board[i][j].color === $gameState.board[i][j + 1].color &&
					$gameState.board[i][j].color === $gameState.board[i][j + 2].color &&
					$gameState.board[i][j].color === $gameState.board[i][j + 3].color
				) {
					return true;
				}
			}
		}

		// check vertical
		for (let i = 0; i < height - 3; i++) {
			for (let j = 0; j < width; j++) {
				if (
					$gameState.board[i][j].value > 0 &&
					$gameState.board[i][j].color === $gameState.board[i + 1][j].color &&
					$gameState.board[i][j].color === $gameState.board[i + 2][j].color &&
					$gameState.board[i][j].color === $gameState.board[i + 3][j].color
				) {
					return true;
				}
			}
		}

		// check diagonal (top left to bottom right)
		for (let i = 3; i < height; i++) {
			for (let j = 3; j < width; j++) {
				if (
					$gameState.board[i][j].value > 0 &&
					$gameState.board[i][j].color === $gameState.board[i - 1][j - 1].color &&
					$gameState.board[i][j].color === $gameState.board[i - 2][j - 2].color &&
					$gameState.board[i][j].color === $gameState.board[i - 3][j - 3].color
				) {
					return true;
				}
			}
		}

		// check diagonal (bottom left to top right)
		for (let i = 3; i < height; i++) {
			for (let j = 0; j < width - 3; j++) {
				if (
					$gameState.board[i][j].value > 0 &&
					$gameState.board[i][j].color === $gameState.board[i - 1][j + 1].color &&
					$gameState.board[i][j].color === $gameState.board[i - 2][j + 2].color &&
					$gameState.board[i][j].color === $gameState.board[i - 3][j + 3].color
				) {
					return true;
				}
			}
		}

		return false;
	}

	function duplicate(arr: any[]): any[] {
		return [...arr, ...arr];
	}

	function shuffle(arr: any[]): any[] {
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

	async function joinLobby() {
		if ($playerName === '') {
			toast.error('Bitte gib einen Namen ein!');
			stopListeningToLobby();
			$lobbyConnected = false;
			return;
		}

		if ($lobbyCode.length !== 6) {
			toast.error('Bitte gib einen gültigen Raumcode ein!');
			stopListeningToLobby();
			$lobbyConnected = false;
			return;
		}

		await get(ref(db, `${$lobbyCode}/`)).then((snap: any) => {
			if (snap.val() === null) {
				toast.error('Es gibt keinen Raum mit diesem Code!');
				stopListeningToLobby();
				$lobbyConnected = false;
				return;
			}
		});

		let playersOnline: Player[] | [] = [];
		await get(ref(db, `${$lobbyCode}/players`)).then((snap: any) => {
			playersOnline = snap.val();
		});

		if (playersOnline.some((p: Player) => p.name === $playerName)) {
			toast.error('Es gibt bereits einen Spieler mit diesem Namen!');
			stopListeningToLobby();
			$lobbyConnected = false;
			return;
		}

		await update(ref(db, `${$lobbyCode}/`), {
			players: [
				...playersOnline,
				{
					name: $playerName,
					connections: -1,
					color: ['red', 'blue', 'green', 'yellow'].filter(
						(color) => !playersOnline.some((p) => p.color === color)
					)[0],
					deck: duplicate(
						shuffle(
							Array(9)
								.fill(0)
								.map((_, i) => i + 1)
						).map((v) => ({
							value: v,
							color: ['red', 'blue', 'green', 'yellow'].filter(
								(color) => !playersOnline.some((p) => p.color === color)
							)[0]
						}))
					)
				}
			]
		});

		$lobbyConnected = true;
		listenToLobby($lobbyCode);
	}

	function closeLobby() {
		stopListeningToLobby();
		set(ref(db, `${$lobbyCode}/`), null);
		resetApp();
	}

	async function leaveLobby() {
		stopListeningToLobby();
		if ($players.length === 1) {
			closeLobby();
			return;
		}
		await set(
			ref(db, `${$lobbyCode}/players/`),
			$players.filter((p) => p.name !== $playerName)
		);
		if ($host === $playerName) {
			await update(ref(db, `${$lobbyCode}/`), {
				host: $players.filter((p) => p.name !== $playerName)[0].name
			});
		}
		resetApp();
	}

	async function kickPlayer(name: string) {
		await update(ref(db, `${$lobbyCode}/`), {
			players: $players.filter((p) => p.name !== name)
		});
	}

	async function startRound() {
		resetLobby();

		await set(ref(db, `${$lobbyCode}/players`), shuffle($players));
		
		await set(ref(db, `${$lobbyCode}/gameState`), {
			board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
			turn: 0,
			currentPlayerIndex: 0
		});

		await set(ref(db, `${$lobbyCode}/roundHasStartet`), true);
	}
</script>

<main class="container">
	<div class="d-flex justify-content-between mt-2">
		<h1 class="fw-bold">
			<span class="text-danger">p</span>
			<span class="text-info">u</span>
			<span class="text-warning">n</span>
			<span class="text-success">t</span>
			<span class="text-danger">o</span>
		</h1>
		<div class="d-flex">
			{#if $roundHasStarted}
				<button
					class="btn btn-dark"
					on:click={() => {
						infoVisible = !infoVisible;
					}}><i class="bi bi-info-circle"></i> Lobby</button
				>
			{/if}
			<!-- Button trigger modal -->
			<button
				type="button"
				class="btn btn-dark"
				data-bs-toggle="modal"
				data-bs-target="#instructionModal"
			>
				<i class="bi bi-question-circle"></i>
			</button>

			<!-- Modal -->
			<div class="modal fade" id="instructionModal" tabindex="-1">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<div class="modal-title d-flex flex-column">
								<h1 class="fw-bold">
									<span class="text-danger">p</span>
									<span class="text-info">u</span>
									<span class="text-warning">n</span>
									<span class="text-success">t</span>
									<span class="text-danger">o</span>
								</h1>
							</div>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
							></button>
						</div>
						<div class="modal-body">
							<h2>Punkt über Punkt zum Sieg!</h2>
							<p>Ein Spiel von <b>Bernhard Weber</b></p>

							<h3>Ziel des Spiels</h3>
							<p>
								4, direkt nebeneinander liegende Karten <span class="text-danger">derselben</span> Farbe
								in einer Reihe, Spalte oder Diagonale bringen.
							</p>

							<p>
								Es gibt auch Spielvarianten zu zweit, oder dritt, oder zu viert in Teams. Diese
								Version sieht bisher nur vor, dass vier Spieler:innen jeweils für sich spielen.
							</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">zurück</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<p style="font-size: 0.7rem">by Bernhard Weber</p>

	{#if infoVisible}
		<div class="row g-1">
			<div class="col-xs-12 col-md-6 col-xl-3">
				<input
					type="text"
					class="form-control"
					bind:value={$playerName}
					placeholder="Name"
					disabled={$lobbyConnected}
				/>
			</div>

			<div class="col-xs-12 col-md-6 col-xl-3">
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
			</div>

			<div class="col-xs-2 col-md-6 col-xl-3">
				{#if $lobbyConnected && $host === $playerName}
					<button class="btn btn-danger w-100" on:click={closeLobby}>Raum schließen</button>
				{:else}
					<button
						class="btn btn-primary w-100"
						on:click={createLobby}
						disabled={$playerName.length === 0 || ($host !== '' && $host !== $playerName)}
						>Raum erstellen</button
					>
				{/if}
			</div>

			<div class="col-xs-6 col-md-6 col-xl-3">
				{#if $lobbyConnected}
					<button class="btn btn-warning w-100" on:click={leaveLobby}>Raum verlassen</button>
				{:else}
					<button
						class="btn btn-primary w-100"
						on:click={joinLobby}
						disabled={$lobbyCode.length !== 6}>Raum betreten</button
					>
				{/if}
			</div>
		</div>
	{/if}

	{#if $lobbyConnected}
		{#if infoVisible}
			<h4 class="text-start mt-4">Spieler</h4>
			<div class="row text-center g-1 mb-4">
				{#each $players as player, i}
					<div class="dropdown col-xs-6 col-sm-3">
						<button
							class={`btn btn-${getBeautifulColors(player.color)?.bootstrap} text-break w-100`}
							class:dropdown-toggle={player.name === $playerName || $playerName === $host}
							type="button"
							data-bs-toggle={`${
								player.name === $playerName || $playerName === $host ? 'dropdown' : ''
							}`}
						>
							{player.name}
							{#if player.name === $host}
								(Host)
							{/if}
						</button>
						<ul class="dropdown-menu">
							{#each ['red', 'blue', 'green', 'yellow'] as color}
								<li>
									<button
										class={`dropdown-item text-${getBeautifulColors(color)?.bootstrap} fw-bold`}
										on:click={() =>
											update(ref(db, `${$lobbyCode}/players/${i}`), {
												color: color
											})}
										disabled={$players.some((p) => p.color === color) || $roundHasStarted}
									>
										{['Rot', 'Blau', 'Grün', 'Gelb'][
											['red', 'blue', 'green', 'yellow'].indexOf(color)
										]}
									</button>
								</li>
							{/each}
							{#if $playerName === $host && player.name !== $host}
								<li><hr class="dropdown-divider" /></li>
								<li>
									<button class="dropdown-item" on:click={() => kickPlayer(player.name)}
										>Kick</button
									>
								</li>
							{/if}
						</ul>
					</div>
				{/each}
				{#each Array(4 - $players.length) as _}
					<div class="dropdown col-xs-6 col-sm-3">
						<button class="btn btn-outline-secondary w-100" disabled>[unbesetzt]</button>
					</div>
				{/each}
			</div>
		{/if}

		{#if !$roundHasStarted}
			<h4>Warte darauf dass der Host die Runde beginnt...</h4>
		{/if}

		{#if $host === $playerName}
			<!-- start alone -->
			{#if $playerName === 'Lonewolf' || dev}
				<button
					class="btn btn-primary"
					on:click={startRound}
					disabled={$playerName !== $host || $roundHasStarted}>Start</button
				>
			{:else}
				<button
					class="btn btn-primary"
					on:click={startRound}
					disabled={$players.length !== 4 || $playerName !== $host || $roundHasStarted}
					>Start</button
				>
			{/if}
			<button
				class="btn btn-warning"
				on:click={resetLobby}
				disabled={$playerName !== $host || !$roundHasStarted}>Runde beenden</button
			>
		{/if}

		{#if $roundHasStarted || $gameState.turn > 0}
			{#if $players.length > 0 && $gameState.currentPlayerIndex >= 0}
				<div class="d-flex my-4">
					<h4 class="">
						Zug #{$gameState.turn + 1}:
						<span
							class={`p-1 rounded bg-${
								getBeautifulColors($players[$gameState.currentPlayerIndex]?.color)?.bootstrap
							}`}
							>{$players[$gameState.currentPlayerIndex].name}
						</span>
					</h4>

					{#if $players[$gameState.currentPlayerIndex].deck !== undefined}
						<div style="margin-top: -5px;" class="ms-2 p-1 border rounded overflow-hidden">
							<Face
								value={$players[$gameState.currentPlayerIndex].deck[0].value}
								color={$players[$gameState.currentPlayerIndex].deck[0].color}
							/>
						</div>
					{:else}
						<h4 class="ps-4">Keine Karten mehr</h4>
					{/if}

					<!-- <button
				class={`col btn btn-dark border-light text-${
					getBeautifulColors($players[$gameState.currentPlayerIndex]?.color)?.bootstrap
				}`}
				style="aspect-ratio: 1/1">{$players[$gameState.currentPlayerIndex].deck[0].value}</button
			> -->
				</div>

				<Board />
			{/if}
		{/if}
	{:else}
		<h1 class="mt-5">Kein Raum verbunden</h1>
	{/if}
</main>

{#if dev || $playerName === 'nimda'}
	<button class="m-2" on:click={() => set(ref(db, '/'), null)}>Reset DB</button>
{/if}
