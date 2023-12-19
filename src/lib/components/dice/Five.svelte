<script lang="ts">
	import './dice.css';
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container five">
	<div style="background-color: {color}" class="item1"></div>
	<div style="background-color: {color}" class="item2"></div>
	<div style="background-color: {color}" class="item3"></div>
	<div style="background-color: {color}" class="item4"></div>
	<div style="background-color: {color}" class="item5"></div>
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
