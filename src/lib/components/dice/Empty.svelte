<script lang="ts">
</script>

<div class="grid-container empty">
	<div class={`filler1`}></div>
	<div class={`filler2`}></div>
	<div class={`filler3`}></div>
</div>

<style scoped>
    .empty > .filler1 {
        grid-area: d;
    }

    .empty > .filler2 {
        grid-area: e;
    }

    .empty > .filler3 {
        grid-area: f;
    }
</style>
