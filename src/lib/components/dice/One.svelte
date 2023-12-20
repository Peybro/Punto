<script lang="ts">
	import type { Color } from '$lib/types';
	import { getBeautifulColors } from '$lib/utils';

	export let color: Color;
</script>

<div class="grid-container one">
	<div class={`item1 bg-${getBeautifulColors(color)?.bootstrap}`}></div>
	<div class={`filler1 bg-dark`}></div>
	<div class={`filler2 bg-dark`}></div>
</div>

<style scoped>
	.one > .item1 {
		grid-area: e;
	}

	.one > .filler1 {
		grid-area: a;
	}

	.one > .filler2 {
		grid-area: i;
	}
</style>
