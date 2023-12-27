<script lang="ts">
	import type { Color } from '$lib/types';
	import { getBeautifulColors } from '$lib/utils';

	export let color: Color;
</script>

<div class="grid-container six">
	<div class={`item1 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item2 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item3 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item4 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item5 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item6 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`filler`}></div>
</div>

<style>
	.six > .item1 {
		grid-area: a;
	}

	.six > .item2 {
		grid-area: c;
	}

	.six > .item3 {
		grid-area: d;
	}

	.six > .item4 {
		grid-area: f;
	}

	.six > .item5 {
		grid-area: g;
	}

	.six > .item6 {
		grid-area: i;
	}

	.six > .filler {
		grid-area: e;
	}
</style>
