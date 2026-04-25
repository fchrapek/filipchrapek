import { Resvg } from "@resvg/resvg-js";
import type { APIContext } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import PlexMonoRegular from "@/assets/fonts/IBMPlexMono-Regular.ttf";
import PlexMonoMedium from "@/assets/fonts/IBMPlexMono-Medium.ttf";
import { siteConfig } from "@/site.config";

const ogOptions: SatoriOptions = {
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

// Default social card — used as the fallback OG image for non-post pages
// (home, listings, about) and for any post that doesn't have its own
// generated /og-image/[slug].png. Mirrors the paper-and-ink palette.
const markup = () =>
  html`<div tw="flex flex-col w-full h-full" style="background-color:#f6f5f2;color:#161614;">
    <div
      tw="flex w-full px-20 py-10 text-2xl"
      style="color:#7a7a78;border-bottom:1px solid rgba(22,22,20,0.12);letter-spacing:0.18em;text-transform:uppercase;"
    >
      <p>~ / ${siteConfig.author}</p>
    </div>
    <div tw="flex flex-col flex-1 w-full px-20 justify-center">
      <h1 tw="text-8xl font-medium leading-tight" style="color:#161614;">
        ${siteConfig.title}
      </h1>
      <p tw="text-3xl mt-8" style="color:#7a7a78;line-height:1.4;">
        ${siteConfig.description}
      </p>
    </div>
    <div
      tw="flex items-center justify-between w-full px-20 py-10 text-2xl"
      style="border-top:1px solid rgba(22,22,20,0.12);color:#7a7a78;"
    >
      <p style="letter-spacing:0.18em;text-transform:uppercase;">
        ${siteConfig.location}
      </p>
      <p style="color:#161614;letter-spacing:0.05em;">
        ${siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      </p>
    </div>
  </div>`;

export async function GET(_context: APIContext) {
  const svg = await satori(markup(), ogOptions);
  const pngBuffer = new Resvg(svg).render().asPng();
  const png = new Uint8Array(pngBuffer);
  return new Response(png, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
}
