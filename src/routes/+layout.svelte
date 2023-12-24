<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import { pwaInfo } from 'virtual:pwa-info';
	import { set, ref } from 'firebase/database';
	import { db } from '$lib/firebase';
	import { dev } from '$app/environment';
	import { playerName } from '$lib/store';

	import { browser } from '$app/environment';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	// Import our custom CSS
	import './../scss/styles.scss';
	browser && import('bootstrap');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<main>
	<slot />
	<Toaster />
</main>

{#if dev || $playerName === 'nimda'}
	<button class="m-2" on:click={() => set(ref(db, '/'), null)}>Reset DB</button>
{/if}
