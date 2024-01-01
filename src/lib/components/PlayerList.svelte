<script lang="ts">
	import {
		host,
		invitation,
		languageId,
		lobbyCode,
		player,
		players,
		playersOnline,
		roundHasStarted,
		renameInProgress
	} from '$lib/store';
	import { getBeautifulColors } from '$lib/utils';
	import { db } from '$lib/firebase';
	import { ref, update } from 'firebase/database';
	import { translations } from '$lib/translations';
	import { browser } from '$app/environment';

	$: selectedLanguage = translations[$languageId];

	async function kickPlayer(name: string) {
		await update(ref(db, `${$lobbyCode}/`), {
			players: $players.filter((p) => p.name !== name)
		});
	}

	async function renamePlayer(name: string) {
		$renameInProgress = true;
	}
</script>

<div class="row text-center g-1 mb-4">
	{#each $players as tPlayer, i}
		<div class="dropdown col-md-6 col-lg-3">
			<button
				class={`btn btn-${!$playersOnline.some((p) => p === tPlayer.uuid) ? 'outline-' : ''}${
					getBeautifulColors(tPlayer.color)?.bootstrap
				} text-break w-100`}
				class:dropdown-toggle={tPlayer.uuid === $player.uuid || $player.uuid === $host.uuid}
				type="button"
				data-bs-toggle={`${
					tPlayer.uuid === $player.uuid || $player.uuid === $host.uuid ? 'dropdown' : ''
				}`}
			>
				{#if $playersOnline.some((p) => p === tPlayer.uuid)}
					<!-- <i class="bi bi-check-circle-fill float-start"></i> -->
					<i class="bi bi-wifi float-start"></i>
				{:else}
					<!-- <i class="bi bi-x-circle-fill text-danger float-start"></i> -->
					<i class="bi bi-wifi-off float-start"></i>
				{/if}
				{$roundHasStarted ? i + 1 + '.' : ''}
				{tPlayer.name}
				{#if tPlayer.uuid === $host.uuid}
					(Host)
				{/if}
				{#if tPlayer.wins > 0}
					<span class="ms-2"><i class="bi bi-trophy"></i> {tPlayer.wins}x</span>
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
				<li>
					<hr class="dropdown-divider" />
				</li>
				{#if $player.uuid === tPlayer.uuid}
					<li>
						<button
							class="dropdown-item"
							on:click={() => renamePlayer(tPlayer.name)}
							disabled={$roundHasStarted}
							><i class="bi bi-pencil-square"></i> {selectedLanguage.rename}</button
						>
					</li>
				{/if}
				{#if $player.uuid === $host.uuid && tPlayer.uuid !== $host.uuid}
					<li>
						<button
							class="dropdown-item"
							on:click={() => kickPlayer(tPlayer.name)}
							disabled={$roundHasStarted}>{selectedLanguage.kick}</button
						>
					</li>
				{/if}
			</ul>
		</div>
	{/each}
	{#if !$roundHasStarted}
		{#each { length: 4 - $players.length } as _}
			<div class="col-md-6 col-lg-3">
				<button class="btn btn-outline-secondary w-100" disabled>[{selectedLanguage.free}]</button>
			</div>
		{/each}
	{/if}
	{#if navigator.share && browser}
		<div>
			<button
				class="btn btn-outline-primary w-100 mt-1"
				on:click={() => {
					navigator.share($invitation);
				}}>{selectedLanguage.shareText} <i class="bi bi-share-fill"></i></button
			>
		</div>
	{/if}
</div>
