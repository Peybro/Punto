<script lang="ts">
	import './dice.css';
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container seven">
	<div style="background-color: {color}" class="item1"></div>
	<div style="background-color: {color}" class="item2"></div>
	<div style="background-color: {color}" class="item3"></div>
	<div style="background-color: {color}" class="item4"></div>
	<div style="background-color: {color}" class="item5"></div>
	<div style="background-color: {color}" class="item6"></div>
	<div style="background-color: {color}" class="item7"></div>
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
