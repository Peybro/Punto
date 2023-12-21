<script lang="ts">
	import { playerName, lobbyCode, lobbyConnected, host, codeCopied } from '$lib/store';
	import { copyTextToClipboard } from '$lib/utils';

	export let closeLobby: () => void;
	export let createLobby: () => void;
	export let leaveLobby: () => void;
	export let joinLobby: () => void;
</script>

<div class="row g-1">
	<div class="col-xs-12 col-md-6 col-xl-3">
		<input
			type="text"
			class="form-control"
			bind:value={$playerName}
			placeholder="Name"
			disabled={$lobbyConnected}
		/>
	</div>

	<div class="col-xs-12 col-md-6 col-xl-3">
		<div class="input-group">
			<input
				type="text"
				class="form-control"
				value={$lobbyCode}
				on:input={(e) => ($lobbyCode = e.currentTarget.value.toUpperCase())}
				placeholder="Lobby Code"
				disabled={$lobbyConnected}
			/>
			{#if navigator.clipboard && $lobbyConnected}
				<button class="btn btn-outline-primary" on:click={() => copyTextToClipboard($lobbyCode)}
					>{#if $codeCopied}
						<i class="bi bi-clipboard-check"></i>
					{:else}<i class="bi bi-clipboard-plus"></i>
					{/if}</button
				>
			{/if}
		</div>
	</div>

	<div class="col-xs-2 col-md-6 col-xl-3">
		{#if $lobbyConnected && $host === $playerName}
			<button class="btn btn-danger w-100" on:click={closeLobby}>Raum schließen</button>
		{:else}
			<button
				class="btn btn-primary w-100"
				on:click={createLobby}
				disabled={$playerName.length === 0 || ($host !== '' && $host !== $playerName)}
				>Raum erstellen</button
			>
		{/if}
	</div>

	<div class="col-xs-6 col-md-6 col-xl-3">
		{#if $lobbyConnected}
			<button class="btn btn-warning w-100" on:click={leaveLobby}>Raum verlassen</button>
		{:else}
			<button class="btn btn-primary w-100" on:click={joinLobby} disabled={$lobbyCode.length !== 6}
				>Raum betreten</button
			>
		{/if}
	</div>
</div>