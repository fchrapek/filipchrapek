/**
 * i18n utilities for language detection
 */

/**
 * Get the language code from site config
 * Handles both 'pl' and 'pl-PL' formats
 * @param lang - Language string from siteConfig.lang
 * @returns 'pl' or 'en'
 */
export function getLang(lang: string): 'pl' | 'en' {
	return lang.startsWith('pl') ? 'pl' : 'en';
}

/**
 * Check if the current site is Polish
 * @param lang - Language string from siteConfig.lang
 * @returns true if Polish, false otherwise
 */
export function isPolish(lang: string): boolean {
	return lang.startsWith('pl');
}

/**
 * Check if the current site is English
 * @param lang - Language string from siteConfig.lang
 * @returns true if English, false otherwise
 */
export function isEnglish(lang: string): boolean {
	return !lang.startsWith('pl');
}
