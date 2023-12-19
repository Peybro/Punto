<script lang="ts">
	import './dice.css';
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container eight">
	<div style="background-color: {color}" class="item1"></div>
	<div style="background-color: {color}" class="item2"></div>
	<div style="background-color: {color}" class="item3"></div>
	<div style="background-color: {color}" class="item4"></div>
	<div style="background-color: {color}" class="item5"></div>
	<div style="background-color: {color}" class="item6"></div>
	<div style="background-color: {color}" class="item7"></div>
	<div style="background-color: {color}" class="item8"></div>
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
