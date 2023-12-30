import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { v4 as uuidV4 } from 'uuid';

export function usePlayerStore() {
	const { subscribe, set, update } = writable<{ name: string; uuid: string }>(
		browser
			? {
					name: JSON.parse(localStorage.getItem('localPlayer') ?? '{}').name || '',
					uuid: JSON.parse(localStorage.getItem('localPlayer') ?? '{}').uuid || uuidV4()
				}
			: { name: '', uuid: uuidV4() }
	);

	subscribe((player) => {
		if (browser) localStorage.setItem('localPlayer', JSON.stringify(player));
	});

	return {
		subscribe,
		set: (val: { name: string; uuid: string }) => set(val),
		reset: () =>
			set(
				browser
					? {
							name: JSON.parse(localStorage.getItem('localPlayer') ?? '{}').name || '',
							uuid: JSON.parse(localStorage.getItem('localPlayer') ?? '{}').uuid || uuidV4()
						}
					: { name: '', uuid: uuidV4() }
			)
	};
}
