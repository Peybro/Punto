import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { useInvitationStore } from '$lib/stores/invitation-store';
import { translations } from '$lib/translations';
import type { AvailableLanguageType } from '$lib/types';

const invitation = useInvitationStore();

export function useLanguageIdStore() {
	const { subscribe, set, update } = writable<AvailableLanguageType>(
		browser ? navigator.language.split('-')[0] as AvailableLanguageType || 'en' : 'en'
	);

	subscribe((id: AvailableLanguageType) => {
		invitation.update({ text: translations[id].inviteText });
	});

	return {
		subscribe,
		set: (val: AvailableLanguageType) => set(val)
	};
}
