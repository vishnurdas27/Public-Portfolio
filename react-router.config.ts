import type { Config } from "@react-router/dev/config";
import { projectSlugs } from "./app/content/slugs";

// static site: every route is rendered to HTML at build time, then hydrated
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), "/404", ...projectSlugs.map((slug) => `/projects/${slug}`)];
  },
} satisfies Config;
