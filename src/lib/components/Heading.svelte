<script lang="ts">
	import PuntoText from './PuntoText.svelte';
	import InstructionModal from './InstructionModal.svelte';

	import { infoVisible, languageId, roundHasStarted } from '$lib/store';
	import { translations } from '$lib/translations';

	$: selectedLanguage = translations[$languageId];
</script>

<div class="d-flex justify-content-between mt-2">
	<PuntoText />
	<div class="d-flex">
		{#if $roundHasStarted}
			<button
				class="btn"
				on:click={() => {
					$infoVisible = !$infoVisible;
				}}><i class="bi bi-list-ol"></i> {selectedLanguage.order}</button
			>
		{/if}
		<InstructionModal />

		<div class="dropdown p-0 pe-0">
			<button class="btn dropdown-toggle" data-bs-toggle="dropdown" type="button">
				{$languageId === 'en' ? '🇬🇧' : $languageId === 'fr' ? '🇫🇷' : '🇩🇪'}
			</button>
			<ul class="dropdown-menu">
				<li>
					<button class="dropdown-item" on:click={() => ($languageId = 'en')}>🇬🇧 English</button>
				</li>
				<li>
					<button class="dropdown-item" on:click={() => ($languageId = 'fr')}>🇫🇷 Français</button>
				</li>
				<li>
					<button class="dropdown-item" on:click={() => ($languageId = 'de')}>🇩🇪 Deutsch</button>
				</li>
			</ul>
		</div>
	</div>
</div>
<p style="font-size: 0.7rem">by Bernhard Weber</p>
