import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import PlexMonoRegular from "@/assets/fonts/IBMPlexMono-Regular.ttf";
import PlexMonoMedium from "@/assets/fonts/IBMPlexMono-Medium.ttf";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";

const ogOptions: SatoriOptions = {
  // debug: true,
  fonts: [
    {
      data: Buffer.from(PlexMonoRegular),
      name: "IBM Plex Mono",
      style: "normal",
      weight: 400,
    },
    {
      data: Buffer.from(PlexMonoMedium),
      name: "IBM Plex Mono",
      style: "normal",
      weight: 500,
    },
  ],
  height: 630,
  width: 1200,
};

// Paper-and-ink OG card — mirrors the site palette: warm off-white paper
// (--color-bg #f6f5f2) with near-black ink (--color-ink #161614) text and a
// hairline divider above the byline.
const markup = (title: string, pubDate: string) =>
  html`<div tw="flex flex-col w-full h-full" style="background-color:#f6f5f2;color:#161614;">
    <div tw="flex flex-col flex-1 w-full p-20 justify-center">
      <p tw="text-3xl mb-10" style="color:#7a7a78;letter-spacing:0.18em;text-transform:uppercase;">
        ${pubDate}
      </p>
      <h1 tw="text-7xl font-medium leading-tight" style="color:#161614;">
        ${title}
      </h1>
    </div>
    <div
      tw="flex items-center justify-between w-full px-20 py-10 text-2xl"
      style="border-top:1px solid rgba(22,22,20,0.12);color:#7a7a78;"
    >
      <p style="color:#161614;font-weight:500;letter-spacing:0.05em;">
        ~ / ${siteConfig.author}
      </p>
      <p style="color:#161614;letter-spacing:0.05em;">
        ${siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      </p>
    </div>
  </div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { pubDate, title } = context.props as Props;

  const postDate = getFormattedDate(pubDate, {
    month: "long",
    weekday: "long",
  });
  const svg = await satori(markup(title, postDate), ogOptions);
  const pngBuffer = new Resvg(svg).render().asPng();
  const png = new Uint8Array(pngBuffer);
  return new Response(png, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts
    .filter(({ data }) => !data.ogImage)
    .map((post) => ({
      params: { slug: post.id.split("/").pop() },
      props: {
        pubDate: post.data.updatedDate ?? post.data.publishDate,
        title: post.data.title,
      },
    }));
}
