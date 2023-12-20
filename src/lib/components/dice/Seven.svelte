<script lang="ts">
	import type { Color } from '$lib/types';
	import { getBeautifulColors } from '$lib/utils';

	export let color: Color;
</script>

<div class="grid-container seven">
	<div class={`item1 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item2 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item3 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item4 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item5 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item6 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item7 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
</div>

<style>
	.seven > .item1 {
		grid-area: a;
	}
	.seven > .item2 {
		grid-area: c;
	}
	.seven > .item3 {
		grid-area: d;
	}
	.seven > .item4 {
		grid-area: e;
	}
	.seven > .item5 {
		grid-area: f;
	}
	.seven > .item6 {
		grid-area: g;
	}
	.seven > .item7 {
		grid-area: i;
	}
</style>
