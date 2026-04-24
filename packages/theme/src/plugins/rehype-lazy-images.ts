import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Adds `loading="lazy"` and `decoding="async"` to every <img> in the rendered
 * markdown unless the author already set the attribute explicitly. Free perf
 * win for prose images with zero content-author effort.
 */
export const rehypeLazyImages: Plugin<[], Root> = () => (tree) => {
	visit(tree, "element", (node) => {
		if (node.tagName !== "img") return;
		node.properties ??= {};
		if (node.properties.loading == null) {
			node.properties.loading = "lazy";
		}
		if (node.properties.decoding == null) {
			node.properties.decoding = "async";
		}
	});
};
