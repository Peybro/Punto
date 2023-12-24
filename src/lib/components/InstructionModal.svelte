<script lang="ts">
	import PuntoText from './PuntoText.svelte';
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
				<h2>Punkt über Punkt zum Sieg!</h2>
				<p>Ein Spiel von <b>Bernhard Weber</b></p>

				<h3>Ziel des Spiels</h3>
				<p>
					Vier, direkt nebeneinander liegende Karten <span class="text-danger">derselben</span> Farbe
					in eine Reihe, Spalte oder Diagonale bringen.
				</p>

				<!-- <p>
					Es gibt auch Spielvarianten zu zweit, oder dritt, oder zu viert in Teams. Diese Version
					sieht bisher nur vor, dass vier Spieler:innen jeweils für sich spielen.
				</p> -->
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">zurück</button>
			</div>
		</div>
	</div>
</div>
