import { JsonLd } from "~/components/shared/json-ld";
import { StoryExperience } from "~/components/story/story-experience";
import { photos, profile } from "~/content";
import { buildMeta, personJsonLd } from "~/lib/seo";
import "~/styles/story/index.css";

export function links() {
  return [{ rel: "preload", as: "image", href: photos.hero.src, type: "image/webp", fetchPriority: "high" }];
}

export function meta() {
  return buildMeta({
    title: `${profile.name} | ${profile.title}`,
    description:
      "Vishnu R Das is a Full Stack Developer from Palakkad, Kerala. His story, from Navodaya to CUSAT to two enterprise platforms for Saint-Gobain SEFPRO.",
    path: "/story",
    image: "story",
  });
}

export default function Story() {
  return (
    <>
      <StoryExperience />
      <JsonLd data={personJsonLd()} />
    </>
  );
}
