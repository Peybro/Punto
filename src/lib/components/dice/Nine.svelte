<script lang="ts">
	import './dice.css';
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container nine">
	<div style="background-color: {color}" class="item1"></div>
	<div style="background-color: {color}" class="item2"></div>
	<div style="background-color: {color}" class="item3"></div>
	<div style="background-color: {color}" class="item4"></div>
	<div style="background-color: {color}" class="item5"></div>
	<div style="background-color: {color}" class="item6"></div>
	<div style="background-color: {color}" class="item7"></div>
	<div style="background-color: {color}" class="item8"></div>
	<div style="background-color: {color}" class="item9"></div>
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
