<script lang="ts">
	import type { Color } from '$lib/types';
	

	export let color: Color;
</script>

<div class="grid-container eight">
	<div class={`item1 bg-${color.Bootstrap}`}></div>
	<div class={`item2 bg-${color.Bootstrap}`}></div>
	<div class={`item3 bg-${color.Bootstrap}`}></div>
	<div class={`item4 bg-${color.Bootstrap}`}></div>
	<div class={`item5 bg-${color.Bootstrap}`}></div>
	<div class={`item6 bg-${color.Bootstrap}`}></div>
	<div class={`item7 bg-${color.Bootstrap}`}></div>
	<div class={`item8 bg-${color.Bootstrap}`}></div>
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
