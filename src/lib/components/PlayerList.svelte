<script lang="ts">
	import { players, lobbyCode, host, roundHasStarted, playerName } from '$lib/store';
	import { getBeautifulColors } from '$lib/utils';
	import { db } from '$lib/firebase';
	import { update, ref } from 'firebase/database';

	async function kickPlayer(name: string) {
		await update(ref(db, `${$lobbyCode}/`), {
			players: $players.filter((p) => p.name !== name)
		});
	}
</script>

<div class="row text-center g-1 mb-4">
	{#each $players as player, i}
		<div class="dropdown col-xs-6 col-sm-3">
			<button
				class={`btn btn-${getBeautifulColors(player.color)?.bootstrap} text-break w-100`}
				class:dropdown-toggle={player.name === $playerName || $playerName === $host}
				type="button"
				data-bs-toggle={`${player.name === $playerName || $playerName === $host ? 'dropdown' : ''}`}
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
							{['Rot', 'Blau', 'Grün', 'Gelb'][['red', 'blue', 'green', 'yellow'].indexOf(color)]}
						</button>
					</li>
				{/each}
				{#if $playerName === $host && player.name !== $host}
					<li><hr class="dropdown-divider" /></li>
					<li>
						<button class="dropdown-item" on:click={() => kickPlayer(player.name)}>Kick</button>
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
