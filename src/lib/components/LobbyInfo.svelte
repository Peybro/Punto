<script lang="ts">
	import { codeCopied, host, languageId, lobbyCode, lobbyConnected, player } from '$lib/store';
	import { copyTextToClipboard } from '$lib/utils';
	import { translations } from '$lib/translations';
	import { page } from '$app/stores';

	export let closeLobby: () => void;
	export let createLobby: () => void;
	export let leaveLobby: () => void;
	export let joinLobby: () => void;

	$: $lobbyCode = $page.url.searchParams.get('code') || '';
	$: selectedLanguage = translations[$languageId];
</script>

<div class="row g-1">
	<div class="col-xs-12 col-md-6 col-xl-3">
		<input
			bind:value={$player.name}
			class="form-control"
			disabled={$lobbyConnected}
			placeholder="Name"
			type="text"
		/>
	</div>

	<div class="col-xs-12 col-md-6 col-xl-3">
		<div class="input-group">
			<input
				class="form-control"
				disabled={$lobbyConnected}
				on:input={(e) => ($lobbyCode = e.currentTarget.value.toUpperCase())}
				placeholder="Lobby Code"
				type="text"
				value={$lobbyCode}
			/>
			{#if navigator.clipboard && $lobbyConnected}
				<button class="btn btn-outline-primary" on:click={() => copyTextToClipboard($lobbyCode)}>
					{#if $codeCopied}
						<i class="bi bi-clipboard-check"></i>
					{:else}<i class="bi bi-clipboard-plus"></i>
					{/if}
				</button>
			{/if}
		</div>
	</div>

	<div class="col-xs-2 col-md-6 col-xl-3">
		{#if $lobbyConnected && $host === $player.name}
			<button class="btn btn-outline-danger w-100" on:click={closeLobby}
				>{selectedLanguage.closeRoom}</button
			>
		{:else}
			<button
				class="btn btn-primary w-100"
				on:click={createLobby}
				disabled={$player.name.length === 0 || ($host !== '' && $host !== $player.name)}
				>{selectedLanguage.createRoom}</button
			>
		{/if}
	</div>

	<div class="col-xs-6 col-md-6 col-xl-3">
		{#if $lobbyConnected}
			<button class="btn btn-outline-warning w-100" on:click={leaveLobby}
				>{selectedLanguage.leaveRoom}</button
			>
		{:else}
			<button class="btn btn-primary w-100" on:click={joinLobby} disabled={$lobbyCode.length !== 6}
				>{selectedLanguage.joinRoom}</button
			>
		{/if}
	</div>
</div>
