<script lang="ts">
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container seven">
	<div class={`item1 bg-${color.Bootstrap}`}></div>
	<div class={`item2 bg-${color.Bootstrap}`}></div>
	<div class={`item3 bg-${color.Bootstrap}`}></div>
	<div class={`item4 bg-${color.Bootstrap}`}></div>
	<div class={`item5 bg-${color.Bootstrap}`}></div>
	<div class={`item6 bg-${color.Bootstrap}`}></div>
	<div class={`item7 bg-${color.Bootstrap}`}></div>
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
