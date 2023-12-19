<script lang="ts">
	import './dice.css';
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container six">
	<div style="background-color: {color}" class="item1"></div>
	<div style="background-color: {color}" class="item2"></div>
	<div style="background-color: {color}" class="item3"></div>
	<div style="background-color: {color}" class="item4"></div>
	<div style="background-color: {color}" class="item5"></div>
	<div style="background-color: {color}" class="item6"></div>
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
</style>
