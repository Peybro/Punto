import { writable } from 'svelte/store';
import type { Card } from '$lib/types';

export function useGameStateStore() {
	const { subscribe, set, update } = writable<{
		board: Card[][];
		turn: number;
		currentPlayerIndex: number;
	}>({
		board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
		turn: 0,
		currentPlayerIndex: 0
	});
	return {
		subscribe,
		set: (val: { board: Card[][]; turn: number; currentPlayerIndex: number }) => set(val),
		reset: () =>
			set({
				board: Array(11).fill(Array(11).fill({ value: 0, color: null })),
				turn: 0,
				currentPlayerIndex: 0
			})
	};
}
