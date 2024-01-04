<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import { pwaInfo } from 'virtual:pwa-info';
	import { ref, set } from 'firebase/database';
	import { db } from '$lib/firebase';
	import { browser, dev } from '$app/environment';
	import { lobbyConnected, player } from '$lib/store';

	import './../scss/styles.scss';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	browser && import('bootstrap');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<!-- Sure to leave/reload? -->
<svelte:window
	on:beforeunload={(event) => {
		if (!$lobbyConnected) return;
		event.preventDefault();
		event.returnValue = '';
		return '[This text is not visible]';
	}}
/>

<main>
	<slot />
	<Toaster />
</main>

{#if dev || $player.name === 'nimda'}
	<button class="m-2" on:click={() => set(ref(db, '/'), null)}>Reset DB</button>
{/if}
