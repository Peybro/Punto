<script lang="ts">
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container four">
	<div class={`item1 bg-${color.Bootstrap}`}></div>
	<div class={`item2 bg-${color.Bootstrap}`}></div>
	<div class={`item3 bg-${color.Bootstrap}`}></div>
	<div class={`item4 bg-${color.Bootstrap}`}></div>
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
