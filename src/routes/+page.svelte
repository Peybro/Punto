<script lang="ts">
	import { db } from '$lib/firebase';
	import { get, ref, set, onValue, off, update } from 'firebase/database';
	import toast from 'svelte-french-toast';
	import Board from '$lib/components/Board.svelte';
	import {
		playerName,
		lobbyCode,
		lobbyConnected,
		host,
		players,
		gameState,
		roundHasStarted,
		infoVisible,
		resetApp
	} from '$lib/store';
	import Face from '$lib/components/dice/Face.svelte';
	import type { Player } from '$lib/types';
	import { dev } from '$app/environment';
	import { duplicate, fourInARow, getBeautifulColors, shuffle, getMostThrees } from '$lib/utils';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import LobbyInfo from '$lib/components/LobbyInfo.svelte';
	import Heading from '$lib/components/Heading.svelte';

	function listenToLobby(code: string) {
		onValue(ref(db, `${code}/`), async (snap) => {
			const data = snap.val();
			if (data === null) {
				toast.error('Raum nicht gefunden!');
				leaveLobby();
			}

			if (
				$players.some((p: Player) => p.name === $playerName) &&
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
			$infoVisible = !data.roundHasStartet;

			if ($roundHasStarted && fourInARow($gameState.board)) {
				toast(
					`${
						$gameState.currentPlayerIndex < $players.length - 1
							? $players[$gameState.currentPlayerIndex].name
							: $players[0].name
					} hat gewonnen!`,
					{ icon: '🎉' }
				);

				await set(ref(db, `${$lobbyCode}/roundHasStartet`), false);
				await set(
					ref(db, `${$lobbyCode}/players/${$gameState.currentPlayerIndex}/wins`),
					$players[$gameState.currentPlayerIndex].wins + 1
				);
			}

			if ($roundHasStarted && $players.every((p) => p.deck === undefined)) {
				// TODO: implement
				// const mostThrees = getMostThrees($players);
				toast.error('Keine Karten mehr! Es gewinnt der Spieler mit den meisten 3er-Reihen!');
				await set(ref(db, `${$lobbyCode}/roundHasStartet`), false);
			}
		});
	}

	async function startRound() {
		await resetLobby();

		await set(ref(db, `${$lobbyCode}/roundHasStartet`), true);
	}

	function stopListeningToLobby() {
		off(ref(db, `${$lobbyCode}/`));
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

	async function resetLobby() {
		await set(ref(db, `${$lobbyCode}/roundHasStartet`), false);

		await set(
			ref(db, `${$lobbyCode}/players/`),
			$players.map((player) => {
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
					),
					wins: player.wins
				};
			})
		);

		await set(ref(db, `${$lobbyCode}/gameState`), {
			board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
			turn: 0,
			currentPlayerIndex: 0
		});

		$infoVisible = true;
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
					),
					wins: 0
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

		let roundInProgress = false;
		await get(ref(db, `${$lobbyCode}/roundHasStartet`)).then((snap: any) => {
			roundInProgress = snap.val();
		});
		if (roundInProgress) {
			toast.error('Die Runde hat bereits begonnen! Bitte warte bis sie vorbei ist.');
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
					deck: shuffle(
						duplicate(
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
</script>

<div class="container">
	<Heading />

	{#if $infoVisible}
		<LobbyInfo {createLobby} {joinLobby} {leaveLobby} {closeLobby} />
	{/if}

	{#if $lobbyConnected}
		{#if $infoVisible}
			<h4 class="text-start mt-4">Spieler</h4>
			<PlayerList />
		{/if}

		{#if !$roundHasStarted}
			<h4>Warte darauf dass der Host die Runde beginnt...</h4>
		{/if}

		{#if $host === $playerName}
			<!-- start alone -->
			{#if dev}
				<button
					class="btn btn-primary"
					on:click={startRound}
					disabled={$playerName !== $host || $roundHasStarted}>Start</button
				>
			{:else}
				<button
					class="btn btn-primary"
					on:click={startRound}
					disabled={$playerName !== $host || $roundHasStarted}>Start</button
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
						<div class="cell ms-2 p-0 border rounded bg-dark">
							<Face
								value={$players[$gameState.currentPlayerIndex].deck[0].value}
								color={$players[$gameState.currentPlayerIndex].color}
							/>
						</div>
					{:else}
						<h4 class="ps-4">Keine Karten mehr</h4>
					{/if}
				</div>

				<Board />
			{/if}
		{/if}
	{:else}
		<h1 class="mt-5">Kein Raum verbunden</h1>
	{/if}
</div>

<style scoped>
	.cell {
		margin-top: -5px;
		width: calc(100vw / 10);
		max-width: 50px;
		max-height: 50px;
	}
</style>
