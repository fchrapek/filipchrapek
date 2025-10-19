import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime(locale: string = "en") {
	// @ts-expect-error:next-line
	return (tree, { data }) => {
		const textOnPage = mdastToString(tree);
		const readingTime = getReadingTime(textOnPage);
		
		// Translate based on locale
		let translatedText = readingTime.text;
		
		if (locale === "pl" || locale === "pl-PL") {
			// Replace "min read" with "min czytania"
			translatedText = readingTime.text.replace(/min read/i, "min czytania");
		}
		
		data.astro.frontmatter.readingTime = translatedText;
	};
}
