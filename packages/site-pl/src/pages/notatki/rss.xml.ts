import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { siteConfig } from "@/site.config";

export const GET = async () => {
	const notes = await getCollection("notatka");

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: notes.map((note) => ({
			title: note.data.title,
			pubDate: note.data.publishDate,
			link: `notatki/${note.id}/`,
		})),
	});
};
