import { profile } from "~/content";

// set VITE_SITE_URL at build time to get absolute canonical and og urls
export const SITE_URL: string | undefined = (
  import.meta.env.VITE_SITE_URL as string | undefined
)?.replace(/\/$/, "");

interface MetaInput {
  title: string;
  description: string;
  path: string;
  // name of a generated image in /og, without the extension
  image?: string;
  noindex?: boolean;
}

export function buildMeta({ title, description, path, image = "default", noindex }: MetaInput) {
  const url = SITE_URL ? `${SITE_URL}${path}` : undefined;
  const ogImage = SITE_URL ? `${SITE_URL}/og/${image}.png` : undefined;

  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: profile.name },
    ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: `${profile.name} · Portfolio` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    ...(url ? [{ property: "og:url", content: url }, { tagName: "link", rel: "canonical", href: url }] : []),
    ...(ogImage
      ? [
          { property: "og:image", content: ogImage },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { name: "twitter:image", content: ogImage },
        ]
      : []),
    { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.valueProp,
    email: `mailto:${profile.email}`,
    ...(SITE_URL ? { url: SITE_URL, image: `${SITE_URL}/images/portrait-pro.webp` } : {}),
    sameAs: [profile.linkedin, profile.github],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palakkad",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Cochin University of Science and Technology",
    },
    knowsAbout: [
      "React",
      "Node.js",
      "Express",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "AWS",
      "Socket.IO",
      "Microsoft Graph API",
    ],
  };
}
