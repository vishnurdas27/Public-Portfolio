import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("pro", "routes/pro.tsx"),
  route("story", "routes/story.tsx"),
  route("projects/:slug", "routes/project.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
