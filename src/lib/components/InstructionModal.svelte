<script lang="ts">
	import PuntoText from './PuntoText.svelte';
	import { translations } from '$lib/translations';
	import { languageId } from '$lib/store';

	$: selectedLanguage = translations[$languageId];
</script>

<!-- Button trigger modal -->
<button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#instructionModal">
	<i class="bi bi-question-circle"></i>
</button>

<!-- Modal -->
<div class="modal fade" id="instructionModal" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<div class="modal-title d-flex flex-column">
					<PuntoText />
				</div>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<h2>{selectedLanguage.subtitle}</h2>
				<p>
					<a href="https://www.gamefactory-spiele.com/punto"
						>{selectedLanguage.by} <b>Bernhard Weber</b></a
					>
				</p>

				<h3>{selectedLanguage.aim.title}</h3>
				<p>
					{selectedLanguage.aim.text[0]}
					<span class="text-danger">{selectedLanguage.aim.text[1]}</span>
					{selectedLanguage.aim.text[2]}
				</p>

				<h3>{selectedLanguage.rules.title}</h3>
				<p>
					{selectedLanguage.rules.text[0]}
				</p>
				<p>
					{selectedLanguage.rules.text[1]}
				</p>

				<p>
					{selectedLanguage.rules.text[2]}
				</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
					>{selectedLanguage.back}</button
				>
			</div>
		</div>
	</div>
</div>
