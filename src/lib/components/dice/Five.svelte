<script lang="ts">
	import type { Color } from '$lib/types';
	

	export let color: Color;
</script>

<div class="grid-container five">
	<div class={`item1 bg-${color.Bootstrap}`}></div>
	<div class={`item2 bg-${color.Bootstrap}`}></div>
	<div class={`item3 bg-${color.Bootstrap}`}></div>
	<div class={`item4 bg-${color.Bootstrap}`}></div>
	<div class={`item5 bg-${color.Bootstrap}`}></div>
</div>

<style>
    .five > .item1 {
        grid-area: a;
    }

    .five > .item2 {
        grid-area: c;
    }

    .five > .item3 {
        grid-area: e;
    }

    .five > .item4 {
        grid-area: g;
    }

    .five > .item5 {
        grid-area: i;
    }
</style>
