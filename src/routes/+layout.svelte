<script>
	import { SvelteToast } from '@zerodevx/svelte-toast';

	// Default options
	const options = {
		duration: 4000, // duration of progress bar tween to the `next` value
		initial: 1, // initial progress bar value
		next: 0, // next progress value
		pausable: false, // pause progress bar tween on mouse hover
		dismissable: true, // allow dismiss with close button
		reversed: false, // insert new toast to bottom of stack
		intro: { x: 256 }, // toast intro fly animation settings
		theme: {}, // css var overrides
		classes: [] // user-defined classes
	};
</script>

<body>
	<slot />
	<SvelteToast {options} />
</body>

<style scoped>
	body {
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		background-color: #161616;
	}
</style>
