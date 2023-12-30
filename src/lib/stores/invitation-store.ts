import { writable } from 'svelte/store';

export function useInvitationStore() {
	const { subscribe, set, update } = writable({
		title: 'Punto',
		text: "Let's play Punto!",
		url: 'https://punto.vercel.app'
	});

	return {
		subscribe,
		set: (val: { title: string; text: string; url: string }) => set(val),
		update: (val: { title?: string; text?: string; url?: string }) =>
			update((prev) => ({ ...prev, ...val }))
	};
}
