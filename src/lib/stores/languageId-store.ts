import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { useInvitationStore } from '$lib/stores/invitation-store';
import { translations } from '$lib/translations';
import type { AvailableLanguages } from '$lib/types';

const invitation = useInvitationStore();

export function useLanguageIdStore() {
	const { subscribe, set } = writable<AvailableLanguages>(
		browser ? (navigator.language.split('-')[0] as AvailableLanguages) || 'en' : 'en'
	);

	subscribe((id: AvailableLanguages) => {
		invitation.update({ text: translations[id].inviteText });
	});

	return {
		subscribe,
		set: (val: AvailableLanguages) => set(val)
	};
}
