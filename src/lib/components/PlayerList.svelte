<script lang="ts">
	import { players, lobbyCode, host, roundHasStarted, playerName, invitation } from '$lib/store';
	import { getBeautifulColors } from '$lib/utils';
	import { db } from '$lib/firebase';
	import { update, ref, get, set } from 'firebase/database';
	import { translations } from '$lib/translations';
	import { languageId } from '$lib/store';
	import { browser } from '$app/environment';

	$: selectedLanguage = translations[$languageId];

	async function kickPlayer(name: string) {
		await update(ref(db, `${$lobbyCode}/`), {
			players: $players.filter((p) => p.name !== name)
		});
	}
</script>

<div class="row text-center g-1 mb-4">
	{#each $players as player, i}
		<div class="dropdown col-sm-6 col-md-3">
			<button
				class={`btn btn-${getBeautifulColors(player.color)?.bootstrap} text-break w-100`}
				class:dropdown-toggle={player.name === $playerName || $playerName === $host}
				type="button"
				data-bs-toggle={`${player.name === $playerName || $playerName === $host ? 'dropdown' : ''}`}
			>
				{$roundHasStarted ? i + 1 + '.' : ''}
				{player.name}
				{#if player.name === $host}
					(Host)
				{/if}
				{#if player.wins > 0}
					<span class="ms-2"><i class="bi bi-trophy"></i> {player.wins}x</span>
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
							{Object.values(selectedLanguage.colors)[
								['red', 'blue', 'green', 'yellow'].indexOf(color)
							]}
						</button>
					</li>
				{/each}
				{#if $playerName === $host && player.name !== $host}
					<li><hr class="dropdown-divider" /></li>
					<li>
						<button
							class="dropdown-item"
							on:click={() => kickPlayer(player.name)}
							disabled={$roundHasStarted}>{selectedLanguage.kick}</button
						>
					</li>
				{/if}
			</ul>
		</div>
	{/each}
	{#if !$roundHasStarted}
		{#each Array(4 - $players.length) as _}
			<div class="col-sm-6 col-md-3">
				<button class="btn btn-outline-secondary w-100" disabled>[{selectedLanguage.free}]</button>
			</div>
		{/each}
	{/if}
	{#if navigator.share && browser}
		<div>
			<button
				class="btn btn-outline-primary w-100 mt-1"
				on:click={() => {
					navigator.share(invitation);
				}}>{selectedLanguage.shareText} <i class="bi bi-share-fill"></i></button
			>
		</div>
	{/if}
</div>
