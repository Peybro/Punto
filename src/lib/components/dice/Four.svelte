<script lang="ts">
	import type { Color } from '$lib/types';
	import { getBeautifulColors } from '$lib/utils';

	export let color: Color;
</script>

<div class="grid-container four">
	<div class={`item1 bg-${getBeautifulColors(color.value)?.bootstrap}`}></div>
	<div class={`item2 bg-${getBeautifulColors(color.value)?.bootstrap}`}></div>
	<div class={`item3 bg-${getBeautifulColors(color.value)?.bootstrap}`}></div>
	<div class={`item4 bg-${getBeautifulColors(color.value)?.bootstrap}`}></div>
	<div class={`filler`}></div>
</div>

<style>
	.four > .item1 {
		grid-area: a;
	}

	.four > .item2 {
		grid-area: c;
	}

	.four > .item3 {
		grid-area: g;
	}

	.four > .item4 {
		grid-area: i;
	}

	.four > .filler {
		grid-area: e;
	}
</style>
