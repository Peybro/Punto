<script lang="ts">
	import type { Color } from '$lib/types';
	

	export let color: Color;
</script>

<div class="grid-container three">
	<div class={`item1 bg-${color.Bootstrap}`}></div>
	<div class={`item2 bg-${color.Bootstrap}`}></div>
	<div class={`item3 bg-${color.Bootstrap}`}></div>
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
