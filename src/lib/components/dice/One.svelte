<script lang="ts">
	import type { Color } from '$lib/types';
	

	export let color: Color;
</script>

<div class="grid-container one">
	<div class={`item1 bg-${color.Bootstrap}`}></div>
	<div class={`filler1`}></div>
	<div class={`filler2`}></div>
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
