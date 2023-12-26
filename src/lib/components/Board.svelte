<script lang="ts">
	import { gameState, players, lobbyCode, playerName, roundHasStarted } from '$lib/store';
	import { db } from '$lib/firebase';
	import { ref, update } from 'firebase/database';
	import Face from './dice/Face.svelte';
	import { getBeautifulColors, isAllowedField } from '$lib/utils';
	import { dev } from '$app/environment';

	$: currentPlayer = $players[$gameState.currentPlayerIndex];

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
							value: currentPlayer.deck[0].value,
							color: currentPlayer.deck[0].color
						};
					}
					return card;
				})
			),
			turn: $gameState.turn + 1
		});

		await update(ref(db, `${$lobbyCode}/players/${$gameState.currentPlayerIndex}`), {
			deck: currentPlayer.deck.slice(1)
		});

		await update(ref(db, `${$lobbyCode}/gameState`), {
			currentPlayerIndex: ($gameState.currentPlayerIndex + 1) % $players.length
		});
	}
</script>

<div class="">
	{#each $gameState.board as row, rowIndex}
		<div class="w-100 d-flex justify-content-center">
			{#each row as card, cardIndex}
				<button
					class={`p-0 cell rounded overflow-hidden ${
						card.value > 0
							? 'bg-dark border-1 border'
							: $roundHasStarted && isAllowedField($gameState, rowIndex, cardIndex)
								? 'bg-secondary border-1 border-secondary'
								: `${dev ? 'bg-success' : 'invisible'} border-1`
					} text-${getBeautifulColors(card.color)?.bootstrap}`}
					on:click={() => playCard(rowIndex, cardIndex)}
					disabled={currentPlayer.deck === undefined ||
						currentPlayer.deck[0].value <= card.value ||
						currentPlayer.name !== $playerName ||
						(card.value === 0 && !isAllowedField($gameState, rowIndex, cardIndex)) ||
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
		width: calc(100vw / 10);
		max-width: 50px;
		max-height: 50px;
		margin: 0.5px;
	}
</style>
