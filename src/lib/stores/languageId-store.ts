import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { useInvitationStore } from '$lib/stores/invitation-store';
import { translations } from '$lib/translations';

const invitation = useInvitationStore();

export function useLanguageIdStore() {
	const { subscribe, set, update } = writable<string>(
		browser ? navigator.language.split('-')[0] || 'en' : 'en'
	);

	subscribe((id: string) => {
		invitation.update({ text: translations[id].inviteText });
	});

	return {
		subscribe,
		set: (val: string) => set(val)
	};
}
