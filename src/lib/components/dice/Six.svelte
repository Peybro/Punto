<script lang="ts">
	import type { Color } from '$lib/types';
	

	export let color: Color;
</script>

<div class="grid-container six">
	<div class={`item1 bg-${color.Bootstrap}`}></div>
	<div class={`item2 bg-${color.Bootstrap}`}></div>
	<div class={`item3 bg-${color.Bootstrap}`}></div>
	<div class={`item4 bg-${color.Bootstrap}`}></div>
	<div class={`item5 bg-${color.Bootstrap}`}></div>
	<div class={`item6 bg-${color.Bootstrap}`}></div>
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
