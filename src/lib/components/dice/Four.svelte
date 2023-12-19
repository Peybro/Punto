<script lang="ts">
	import './dice.css';
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container four">
	<div style="background-color: {color}" class="item1"></div>
	<div style="background-color: {color}" class="item2"></div>
	<div class="item5"></div>
	<div style="background-color: {color}" class="item3"></div>
	<div style="background-color: {color}" class="item4"></div>
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
	.four > .item5 {
		grid-area: e;
		background-color: black;
	}
</style>
