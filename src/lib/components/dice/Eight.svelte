<script lang="ts">
	import type { Color } from '$lib/types';
	import { getBeautifulColors } from '$lib/utils';

	export let color: Color;
</script>

<div class="grid-container eight">
	<div class={`item1 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item2 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item3 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item4 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item5 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item6 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item7 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`item8 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
</div>

<style scoped>
	.eight > .item1 {
		grid-area: a;
	}

	.eight > .item2 {
		grid-area: b;
	}

	.eight > .item3 {
		grid-area: c;
	}

	.eight > .item4 {
		grid-area: d;
	}

	.eight > .item5 {
		grid-area: f;
	}

	.eight > .item6 {
		grid-area: g;
	}

	.eight > .item7 {
		grid-area: h;
	}

	.eight > .item8 {
		grid-area: i;
	}
</style>
