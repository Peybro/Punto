<script lang="ts">
	import PuntoText from './PuntoText.svelte';
	import InstructionModal from './InstructionModal.svelte';

	import { theme, infoVisible, roundHasStarted } from '$lib/store';
</script>

<div class="d-flex justify-content-between mt-2">
	<PuntoText />
	<div class="d-flex">
		{#if $roundHasStarted}
			<button
				class="btn"
				data-bs-theme={$theme}
				on:click={() => {
					$infoVisible = !$infoVisible;
				}}><i class="bi bi-info-circle"></i> Lobby</button
			>
		{/if}
		<InstructionModal />
	</div>
</div>
<p style="font-size: 0.7rem">by Bernhard Weber</p>
