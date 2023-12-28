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

<!-- Sicher neu laden/verlassen? -->
<svelte:window
	on:beforeunload={(event) => {
		if (!$lobbyConnected) return;
		event.preventDefault();
		event.returnValue = '';
		return '[Dieser Text wird nicht angezeigt]';
	}}
/>

<main>
	<slot />
	<Toaster />
</main>

{#if dev || $player === 'nimda'}
	<button class="m-2" on:click={() => set(ref(db, '/'), null)}>Reset DB</button>
{/if}
