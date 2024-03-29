<script lang="ts">
	import {
		host,
		invitation,
		languageId,
		lobbyCode,
		player,
		players,
		playersOnline,
		renameInProgress,
		roundHasStarted
	} from '$lib/store';
	import { getBeautifulColors } from '$lib/utils';
	import { db } from '$lib/firebase';
	import { ref, update } from 'firebase/database';
	import { translations } from '$lib/translations';
	import { browser } from '$app/environment';
	import { colors } from '$lib/types';

	$: selectedLanguage = translations[$languageId];

	/**
	 * Kick a player from the lobby
	 * @param name The name of the player to kick
	 */
	async function kickPlayer(name: string) {
		await update(ref(db, `${$lobbyCode}/`), {
			players: $players.filter((p) => p.name !== name)
		});
	}

	/**
	 * Start renaming the current player
	 */
	async function renamePlayer() {
		if ($renameInProgress) {
			$player.name = $players.find((p) => p.uuid === $player.uuid)?.name || '';
			$renameInProgress = false;
		} else {
			$renameInProgress = true;
			// TODO: diiiirty
			setTimeout(() => {
				document.getElementById('renamePlayerInput')?.focus();
			}, 100);
		}
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
				{:else if tPlayer.uuid === $player.uuid}
					({selectedLanguage.you})
				{/if}
				{#if tPlayer.wins > 0}
					<span class="ms-2"><i class="bi bi-trophy"></i> {tPlayer.wins}x</span>
				{/if}
			</button>
			<ul class="dropdown-menu">
				{#each colors as color}
					<li>
						<button
							class={`dropdown-item text-${getBeautifulColors(color)?.bootstrap} fw-bold`}
							on:click={() =>
								update(ref(db, `${$lobbyCode}/players/${i}`), {
									color: color
								})}
							disabled={$players.some((p) => p.color === color) || $roundHasStarted}
						>
							{Object.values(selectedLanguage.colors)[colors.indexOf(color)]}
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
							on:click={() => renamePlayer()}
							disabled={$roundHasStarted}
							><i class="bi bi-pencil-square"></i>
							{!$renameInProgress ? selectedLanguage.rename : 'Cancel'}</button
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
