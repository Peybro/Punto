<script lang="ts">
	import type { Color } from '$lib/types';
	import { getBeautifulColors } from '$lib/utils';

	export let color: Color;
</script>

<div class="grid-container three">
	<div class={`item1 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item2 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item3 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
</div>

<style>
	.three > .item1 {
		grid-area: a;
	}
	.three > .item2 {
		grid-area: e;
	}
	.three > .item3 {
		grid-area: i;
	}
</style>
