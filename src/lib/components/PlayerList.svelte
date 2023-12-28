<script lang="ts">
	import {
		host,
		invitation,
		languageId,
		lobbyCode,
		player,
		players,
		roundHasStarted
	} from '$lib/store';
	import { db } from '$lib/firebase';
	import { ref, update } from 'firebase/database';
	import { translations } from '$lib/translations';
	import { browser } from '$app/environment';
	import { Color, colors, Player } from '$lib/types';

	$: selectedLanguage = translations[$languageId];

	async function kickPlayer(player: Player) {
		await update(ref(db, `${$lobbyCode}/`), {
			players: $players.filter((p) => p !== player)
		});
	}
</script>

<div class="row text-center g-1 mb-4">
	{#each $players as p, i}
		<div class="dropdown col-sm-6 col-md-3">
			<button
				class={`btn btn-${p.color.Bootstrap} text-break w-100`}
				class:dropdown-toggle={p.name === $player.name || $player.name === $host.name}
				type="button"
				data-bs-toggle={`${
					p.name === $player.name || $player.name === $host.name ? 'dropdown' : ''
				}`}
			>
				{$roundHasStarted ? i + 1 + '.' : ''}
				{p.name}
				{#if p === $host}
					(Host)
				{/if}
				{#if p.wins > 0}
					<span class="ms-2"><i class="bi bi-trophy"></i> {p.wins}x</span>
				{/if}
			</button>
			<ul class="dropdown-menu">
				{#each [new Color(colors.Red), new Color(colors.Blue), new Color(colors.Green), new Color(colors.Yellow)] as color}
					<li>
						<button
							class={`dropdown-item text-${color.Bootstrap} fw-bold`}
							on:click={() =>
								update(ref(db, `${$lobbyCode}/players/${i}`), {
									color: color.value
								})}
							disabled={$players.some((p) => p.color === color) || $roundHasStarted}
						>
							{Object.values(selectedLanguage.colors)[
								[
									new Color(colors.Red),
									new Color(colors.Blue),
									new Color(colors.Green),
									new Color(colors.Yellow)
								].indexOf(color)
							]}
						</button>
					</li>
				{/each}
				{#if $player.name === $host.name && p.name !== $host.name}
					<li>
						<hr class="dropdown-divider" />
					</li>
					<li>
						<button class="dropdown-item" on:click={() => kickPlayer(p)} disabled={$roundHasStarted}
							>{selectedLanguage.kick}</button
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
	{#if navigator.share && browser && $players.length < 4}
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
