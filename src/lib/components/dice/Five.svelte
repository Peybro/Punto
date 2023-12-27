<script lang="ts">
	import type { Color } from '$lib/types';
	import { getBeautifulColors } from '$lib/utils';

	export let color: Color;
</script>

<div class="grid-container five">
	<div class={`item1 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item2 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item3 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item4 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item5 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
</div>

<style>
	.five > .item1 {
		grid-area: a;
	}

	.five > .item2 {
		grid-area: c;
	}

	.five > .item3 {
		grid-area: e;
	}

	.five > .item4 {
		grid-area: g;
	}

	.five > .item5 {
		grid-area: i;
	}
</style>
