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
		resetApp,
		languageId
	} from '$lib/store';
	import Face from '$lib/components/dice/Face.svelte';
	import type { Player } from '$lib/types';
	import { duplicate, fourInARow, getBeautifulColors, shuffle, getMostThrees } from '$lib/utils';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import LobbyInfo from '$lib/components/LobbyInfo.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import { translations } from '$lib/translations';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: selectedLanguage = translations[$languageId];
	$: isHost = $host === $playerName;
	$: currentPlayer = $players[$gameState.currentPlayerIndex];

	/**
	 * Listens to the lobby with the given code and updates the store accordingly
	 * @param code The lobby code to listen to
	 */
	function listenToLobby(code: string) {
		const callback = async (snap: any) => {
			const data = snap.val();

			if (data === null) {
				toast.error(selectedLanguage.toasts.roomNotFound);
				leaveLobby();
			}

			if (
				$players.some((p: Player) => p.name === $playerName) &&
				!data.players.some((p: Player) => p.name === $playerName)
			) {
				toast.error(selectedLanguage.toasts.kick);
				leaveLobby();
			}

			// update local state with data from database
			$host = data.host;
			$players = data.players;
			$gameState = data.gameState;
			$roundHasStarted = data.roundHasStartet;
			$infoVisible = !data.roundHasStartet;

			// update url with lobby code
			$page.url.searchParams.set('code', data.lobbyCode);
			goto(`?${$page.url.searchParams.toString()}`);

			if ($roundHasStarted && fourInARow($gameState.board)) {
				// turn off listener to prevent multiple updates
				off(ref(db, `${$lobbyCode}/`));
				// reset currentPlayerIndex to prevent future errors
				await set(ref(db, `${$lobbyCode}/gameState/currentPlayerIndex`), 0);

				toast(`${currentPlayer.name} ${selectedLanguage.toasts.win}`, { icon: '🎉' });
				await set(
					ref(db, `${$lobbyCode}/players/${$gameState.currentPlayerIndex}/wins`),
					currentPlayer.wins + 1
				);
				await set(ref(db, `${$lobbyCode}/roundHasStartet`), false);

				// turn on listener again
				onValue(ref(db, `${$lobbyCode}/`), callback);
			}

			if ($roundHasStarted && $players.every((p) => p.deck === undefined)) {
				// turn off listener to prevent multiple updates
				off(ref(db, `${$lobbyCode}/`));
				// reset currentPlayerIndex to prevent future errors
				await set(ref(db, `${$lobbyCode}/gameState/currentPlayerIndex`), 0);

				// TODO: implement
				// const mostThrees = getMostThrees($players);
				toast.error(selectedLanguage.toasts.winnerWhenNoCards);
				await set(ref(db, `${$lobbyCode}/roundHasStartet`), false);

				// turn on listener again
				onValue(ref(db, `${$lobbyCode}/`), callback);
			}
		};

		// listen to updates from database
		onValue(ref(db, `${code}/`), callback);
	}

	/**
	 * Starts the round by resetting the lobby and shuffling the players
	 */
	async function startRound() {
		await resetLobby();

		await update(ref(db, `${$lobbyCode}/`), { players: shuffle($players) });
		await set(ref(db, `${$lobbyCode}/roundHasStartet`), true);
	}

	/**
	 * Stops listening to the current lobby
	 */
	function stopListeningToLobby() {
		off(ref(db, `${$lobbyCode}/`));
	}

	/**
	 * Closes the lobby and resets the app
	 */
	function closeLobby() {
		stopListeningToLobby();
		set(ref(db, `${$lobbyCode}/`), null);
		resetApp();
	}

	/**
	 * Current client leaves the lobby and resets the app for itself
	 */
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
		if (isHost) {
			await update(ref(db, `${$lobbyCode}/`), {
				host: $players.filter((p) => p.name !== $playerName)[0].name
			});
		}
		resetApp();
	}

	/**
	 * Resets the lobby to its initial state
	 */
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

	/**
	 * Creates a new lobby with a random code and sets the current client as host
	 */
	async function createLobby() {
		if ($playerName === '') {
			toast.error(selectedLanguage.toasts.nameMissing);
			return;
		}

		let newLobbyCode = '';

		let lobbyCodeAlreadyExists = false;
		await get(ref(db, `${$lobbyCode}/`)).then((snap: any) => {
			if (snap.val() !== null) {
				lobbyCodeAlreadyExists = true;
			}
		});

		if ($lobbyCode.length === 6 && !lobbyCodeAlreadyExists) {
			newLobbyCode = $lobbyCode;
		} else {
			newLobbyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
			$lobbyCode = newLobbyCode;
		}

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

	/**
	 * Joins a lobby with the given code and sets the current client as player
	 */
	async function joinLobby() {
		let validToJoin = true;

		if ($playerName === '') {
			toast.error(selectedLanguage.toasts.nameMissing);
			$lobbyConnected = false;
			validToJoin = false;
		}

		if ($lobbyCode.length !== 6) {
			toast.error(selectedLanguage.toasts.roomCodeNotValid);
			$lobbyConnected = false;
			validToJoin = false;
		}

		await get(ref(db, `${$lobbyCode}/`)).then((snap: any) => {
			if (snap.val() === null) {
				toast.error(selectedLanguage.toasts.noMatchingRoom);
				$lobbyConnected = false;
				validToJoin = false;
			}
		});

		let playersOnline: Player[] | [] = [];
		await get(ref(db, `${$lobbyCode}/players`)).then((snap: any) => {
			if (snap.val()) playersOnline = snap.val();
		});
		if (playersOnline.length === 4) {
			toast.error(selectedLanguage.toasts.roomFull);
			$lobbyConnected = false;
			validToJoin = false;
		}
		if (playersOnline.some((p: Player) => p.name === $playerName)) {
			toast.error(selectedLanguage.toasts.nameAlreadyTaken);
			$lobbyConnected = false;
			validToJoin = false;
		}

		let roundInProgress = false;
		await get(ref(db, `${$lobbyCode}/roundHasStartet`)).then((snap: any) => {
			if (snap.val()) roundInProgress = snap.val();
		});
		if (roundInProgress) {
			toast.error(selectedLanguage.toasts.roundStarted);
			$lobbyConnected = false;
			validToJoin = false;
		}

		// if any of the above checks failed, return
		if (!validToJoin) return;

		// else register new player and start listening to lobby changes
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
					),
					wins: 0
				}
			]
		});

		$lobbyConnected = true;
		listenToLobby($lobbyCode);
	}
</script>

<div class="container mb-4">
	<Heading />

	{#if $infoVisible}
		<LobbyInfo {createLobby} {joinLobby} {leaveLobby} {closeLobby} />
	{/if}

	{#if $lobbyConnected}
		{#if $infoVisible}
			<h4 class="text-start mt-4">{selectedLanguage.players}</h4>
			<PlayerList />
		{/if}

		{#if !$roundHasStarted}
			<h4>
				{isHost
					? selectedLanguage.waitingForPlayers.self
					: selectedLanguage.waitingForPlayers.others}
			</h4>
		{/if}

		{#if isHost}
			<button
				class="btn btn-primary"
				on:click={startRound}
				disabled={$playerName !== $host || $roundHasStarted}
				>{!$roundHasStarted && $gameState.board.flat().some((cell) => cell.value > 0)
					? selectedLanguage.startGame.again
					: selectedLanguage.startGame.new}</button
			>
			<button
				class="btn btn-warning"
				on:click={resetLobby}
				disabled={$playerName !== $host || !$roundHasStarted}>{selectedLanguage.endRound}</button
			>
		{/if}

		{#if $roundHasStarted || $gameState.turn > 0}
			{#if $players.length > 0 && $gameState.currentPlayerIndex >= 0}
				<div class="d-flex my-4">
					<h4 class="">
						{selectedLanguage.turn} #{$gameState.turn + 1}:
						{#if currentPlayer.name === $playerName}
							{selectedLanguage.yourTurn}
						{:else}
							<span class={`p-1 rounded bg-${getBeautifulColors(currentPlayer?.color)?.bootstrap}`}
								>{currentPlayer.name}
							</span>
						{/if}
					</h4>

					{#if currentPlayer.deck !== undefined}
						<div class="cell ms-2 p-0 border rounded bg-dark">
							<Face value={currentPlayer.deck[0].value} color={currentPlayer.color} />
						</div>
					{:else}
						<h4 class="ps-4">{selectedLanguage.noMoreCards}</h4>
					{/if}
				</div>

				<Board />
			{/if}
		{/if}
	{:else}
		<h1 class="mt-5">{selectedLanguage.notConnected}</h1>
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
