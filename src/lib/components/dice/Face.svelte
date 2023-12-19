<script lang="ts">
	import type { CardValue, Color } from '$lib/types';

	import One from './One.svelte';
	import Two from './Two.svelte';
	import Three from './Three.svelte';
	import Four from './Four.svelte';
	import Five from './Five.svelte';
	import Six from './Six.svelte';
	import Seven from './Seven.svelte';
	import Eight from './Eight.svelte';
	import Nine from './Nine.svelte';
	import Empty from './Empty.svelte';

	export let value: CardValue;
	export let color: Color;
</script>

{#if value === 1}
	<One {color} />
{:else if value === 2}
	<Two {color} />
{:else if value === 3}
	<Three {color} />
{:else if value === 4}
	<Four {color} />
{:else if value === 5}
	<Five {color} />
{:else if value === 6}
	<Six {color} />
{:else if value === 7}
	<Seven {color} />
{:else if value === 8}
	<Eight {color} />
{:else if value === 9}
	<Nine {color} />
{:else if value === 0}
	<Empty />
{/if}
