<script lang="ts">
	import './dice.css';
	import type { Color } from '$lib/types';

	export let color: Color;
</script>

<div style="background-color: {color}" class="item1"></div>

<style scoped>
	.item1 {
		grid-area: e;
	}
</style>
