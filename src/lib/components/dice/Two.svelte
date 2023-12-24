<script lang="ts">
	import type { Color } from '$lib/types';
	import { getBeautifulColors } from '$lib/utils';

	export let color: Color;
</script>

<div class="grid-container two">
	<div class={`item1 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item2 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`filler`}></div>
</div>

<style scoped>
	.two > .item1 {
		grid-area: a;
	}
	.two > .item2 {
		grid-area: i;
	}
	.two > .filler {
		grid-area: e;
	}
</style>
