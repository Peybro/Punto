<script lang="ts">
	import './dice.css';
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div class="grid-container three">
	<div style="background-color: {color}" class="item1"></div>
	<div style="background-color: {color}" class="item2"></div>
	<div style="background-color: {color}" class="item3"></div>
</div>

<style>
	.three > .item1 {
		grid-area: a;
	}
	.three > .item2 {
		grid-area: e;
	}
	.three > .item3 {
		grid-area: i;
	}
</style>
