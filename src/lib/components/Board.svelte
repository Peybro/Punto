<script lang="ts">
	import { gameState, players, lobbyCode, playerName, roundHasStarted } from '$lib/store';
	import { db } from '$lib/firebase';
	import { ref, update } from 'firebase/database';
	import Face from './dice/Face.svelte';
	import { getBeautifulColors } from '$lib/utils';

	/**
	 * Plays a card on the board.
	 * @param rowIndex
	 * @param cardIndex
	 */
	async function playCard(rowIndex: number, cardIndex: number) {
		await update(ref(db, `${$lobbyCode}/gameState`), {
			board: $gameState.board.map((row, i) =>
				row.map((card, j) => {
					if (i === rowIndex && j === cardIndex) {
						return {
							value: $players[$gameState.currentPlayerIndex].deck[0].value,
							color: $players[$gameState.currentPlayerIndex].color
						};
					}
					return card;
				})
			),
			turn: $gameState.turn + 1
		});

		await update(ref(db, `${$lobbyCode}/players/${$gameState.currentPlayerIndex}`), {
			deck: $players[$gameState.currentPlayerIndex].deck.slice(1)
		});

		await update(ref(db, `${$lobbyCode}/gameState`), {
			currentPlayerIndex: ($gameState.currentPlayerIndex + 1) % $players.length
		});

		// console.log(getMinAndMaxIndices(), getPlayedBoardDimensions());
	}

	/**
	 * Returns the min and max index of the board that are actually used.
	 */
	function getMinAndMaxIndices() {
		let minY = $gameState.board.length;
		let maxY = 0;
		let minX = $gameState.board[0].length;
		let maxX = 0;

		for (let i = 0; i < $gameState.board.length; i++) {
			for (let j = 0; j < $gameState.board[i].length; j++) {
				if ($gameState.board[i][j].value > 0) {
					if (j < minX) {
						minX = j;
					}
					if (j > maxX) {
						maxX = j;
					}
					if (i < minY) {
						minY = i;
					}
					if (i > maxY) {
						maxY = i;
					}
				}
			}
		}

		return { minX, maxX, minY, maxY };
	}

	/**
	 * Returns the width and height of the part of the board that are actually used.
	 */
	function getPlayedBoardDimensions() {
		const { minX, maxX, minY, maxY } = getMinAndMaxIndices();

		return { width: maxY - minY + 1, height: maxX - minX + 1 };
	}

	/**
	 * Returns true if the field is allowed to be played on.
	 * @param rowIndex
	 * @param cardIndex
	 */
	function isAllowedField(rowIndex: number, cardIndex: number) {
		return (
			// upper left corner
			(rowIndex === 0 &&
				rowIndex < $gameState.board.length - 1 &&
				cardIndex === 0 &&
				cardIndex < $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex].value > 0)) ||
			// lower right corner
			(rowIndex > 0 &&
				rowIndex === $gameState.board.length - 1 &&
				cardIndex > 0 &&
				cardIndex === $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex - 1][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex].value > 0)) ||
			// upper right corner
			(rowIndex === 0 &&
				rowIndex < $gameState.board.length - 1 &&
				cardIndex > 0 &&
				cardIndex === $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex - 1].value > 0)) ||
			// lower left corner
			(rowIndex > 0 &&
				rowIndex === $gameState.board.length - 1 &&
				cardIndex === 0 &&
				cardIndex < $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex + 1].value > 0)) ||
			// inner fields
			(rowIndex > 0 &&
				rowIndex < $gameState.board.length - 1 &&
				cardIndex > 0 &&
				cardIndex < $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex - 1][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex - 1].value > 0)) ||
			// upper border
			(rowIndex === 0 &&
				rowIndex < $gameState.board.length - 1 &&
				cardIndex > 0 &&
				cardIndex < $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex - 1].value > 0)) ||
			// lower border
			(rowIndex > 0 &&
				rowIndex === $gameState.board.length - 1 &&
				cardIndex > 0 &&
				cardIndex < $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex - 1][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex + 1].value > 0)) ||
			// left border
			(rowIndex > 0 &&
				rowIndex < $gameState.board.length - 1 &&
				cardIndex === 0 &&
				cardIndex < $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex + 1].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex + 1].value > 0)) ||
			// right border
			(rowIndex > 0 &&
				rowIndex < $gameState.board.length - 1 &&
				cardIndex > 0 &&
				cardIndex === $gameState.board[0].length - 1 &&
				($gameState.board[rowIndex - 1][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex][cardIndex - 1].value > 0 ||
					$gameState.board[rowIndex - 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex].value > 0 ||
					$gameState.board[rowIndex + 1][cardIndex - 1].value > 0))
		);
	}
</script>

{#each $gameState.board as row, rowIndex}
	<div class="row">
		{#each row as card, cardIndex}
			{#if $gameState.turn === 0}
				{#if rowIndex === 5 && cardIndex === 5}
					<button
						class="cell"
						style="border: none; background-color: lightgrey"
						on:click={() => playCard(rowIndex, cardIndex)}
						disabled={($players.length > 0
							? $players[$gameState.currentPlayerIndex].name !== $playerName
							: true) || !$roundHasStarted}
						>{' '}
					</button>
				{:else}
					<button class="cell" style="border:none; background-color: white" disabled>{' '}</button>
				{/if}
			{:else}
				<button
					class="cell"
					style="border: none; background-color: {card.value > 0
						? 'black'
						: isAllowedField(rowIndex, cardIndex)
							? 'lightgrey'
							: 'white'}; color: {getBeautifulColors(card.color)};"
					on:click={() => playCard(rowIndex, cardIndex)}
					disabled={$players[$gameState.currentPlayerIndex].deck[0].value <= card.value ||
						$players[$gameState.currentPlayerIndex].name !== $playerName ||
						(card.value === 0 && !isAllowedField(rowIndex, cardIndex)) ||
						!$roundHasStarted}
				>
					<!-- <Face value={card.value} color={card.color} /> -->
					{card.value > 0 ? card.value : ' '}
				</button>
			{/if}
		{/each}
	</div>
{/each}

<style>
	.cell {
		width: 30px;
		height: 30px;
		font-size: 20px;
	}
</style>
