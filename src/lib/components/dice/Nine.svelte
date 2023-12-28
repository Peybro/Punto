<script lang="ts">
	import type { Color } from '$lib/types';
	

	export let color: Color;
</script>

<div class="grid-container nine">
	<div class={`item1 bg-${color.Bootstrap}`}></div>
	<div class={`item2 bg-${color.Bootstrap}`}></div>
	<div class={`item3 bg-${color.Bootstrap}`}></div>
	<div class={`item4 bg-${color.Bootstrap}`}></div>
	<div class={`item5 bg-${color.Bootstrap}`}></div>
	<div class={`item6 bg-${color.Bootstrap}`}></div>
	<div class={`item7 bg-${color.Bootstrap}`}></div>
	<div class={`item8 bg-${color.Bootstrap}`}></div>
	<div class={`item9 bg-${color.Bootstrap}`}></div>
</div>

<style>
    .nine > .item1 {
        grid-area: a;
    }

    .nine > .item2 {
        grid-area: b;
    }

    .nine > .item3 {
        grid-area: c;
    }

    .nine > .item4 {
        grid-area: d;
    }

    .nine > .item5 {
        grid-area: e;
    }

    .nine > .item6 {
        grid-area: f;
    }

    .nine > .item7 {
        grid-area: g;
    }

    .nine > .item8 {
        grid-area: h;
    }

    .nine > .item9 {
        grid-area: i;
    }
</style>
