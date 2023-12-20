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
		// TODO: block fields that are beyond 6x6 or cannot be reached anymore
		return (
			// first round
			($gameState.turn === 0 && rowIndex === 5 && cardIndex === 5) ||
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

<div class="">
	{#each $gameState.board as row, rowIndex}
		<div class="w-100 d-flex justify-content-center">
			{#each row as card, cardIndex}
				<button
					class={`p-0 cell rounded overflow-hidden ${
						card.value > 0
							? 'bg-dark border-1'
							: isAllowedField(rowIndex, cardIndex)
								? 'bg-secondary border-1 border-secondary'
								: 'invisible border-1'
					} text-${getBeautifulColors(card.color)?.bootstrap}`}
					on:click={() => playCard(rowIndex, cardIndex)}
					disabled={$players[$gameState.currentPlayerIndex].deck[0].value <= card.value ||
						$players[$gameState.currentPlayerIndex].name !== $playerName ||
						(card.value === 0 && !isAllowedField(rowIndex, cardIndex)) ||
						!$roundHasStarted}
				>
					<Face value={card.value} color={card.color} />
					<!-- {card.value > 0 ? card.value : ''} -->
				</button>
			{/each}
		</div>
	{/each}
</div>

<style scoped>
	.cell {
		width: calc(100% / 10.5);
		max-width: 50px;
	}
</style>
