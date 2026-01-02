/**
 * Theme Configuration
 * Central config for all available style themes
 */

export interface Theme {
	id: string;
	label: {
		en: string;
		pl: string;
	};
	description?: {
		en: string;
		pl: string;
	};
}

export const themes: Theme[] = [
	{
		id: 'default',
		label: {
			en: 'Default',
			pl: 'Domyślny',
		},
		description: {
			en: 'Clean, modern design',
			pl: 'Czysty, nowoczesny design',
		},
	},
	{
		id: 'motherfuckingwebsite',
		label: {
			en: 'Motherf*cking Website',
			pl: 'Pierd*lona Strona',
		},
		description: {
			en: 'Back to basics, no bullshit',
			pl: 'Powrót do podstaw, bez bzdur',
		},
	},
];

/**
 * Get theme label for current language
 */
export function getThemeLabel(themeId: string, lang: 'en' | 'pl' = 'en'): string {
	const theme = themes.find((t) => t.id === themeId);
	return theme?.label[lang] || themeId;
}

/**
 * Get all themes for a specific language
 */
export function getThemesForLang(lang: 'en' | 'pl' = 'en') {
	return themes.map((theme) => ({
		id: theme.id,
		label: theme.label[lang],
		description: theme.description?.[lang],
	}));
}
