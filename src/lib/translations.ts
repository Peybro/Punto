import type { LanguagesType } from './types';

import { lang_en } from '$lib/languages/lang_en';
import { lang_de } from '$lib/languages/lang_de';
import { lang_fr } from '$lib/languages/lang_fr';

const translations: LanguagesType = {
	en: lang_en,
	de: lang_de,
	fr: lang_fr
};

export { translations };
