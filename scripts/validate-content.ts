// build-time check: every content file must match its schema, cross-references must resolve,
// and the prerender slug list must match the projects. npm run validate
import { z } from "zod";
import { achievements } from "../app/content/achievements";
import { education } from "../app/content/education";
import { experience } from "../app/content/experience";
import { life } from "../app/content/life";
import { profile } from "../app/content/profile";
import { projects } from "../app/content/projects";
import {
  achievementSchema,
  educationSchema,
  experienceSchema,
  lifeSchema,
  profileSchema,
  principleSchema,
  projectSchema,
  shortVersionSchema,
  strengthSchema,
  skillGroupSchema,
  storySceneSchema,
} from "../app/content/schema";
import { skillGroups } from "../app/content/skills";
import { projectSlugs } from "../app/content/slugs";
import { principles, shortVersion, storyScenes } from "../app/content/story";
import { strengths } from "../app/content/strengths";

const errors: string[] = [];
const check = (label: string, fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    errors.push(`${label}: ${error instanceof z.ZodError ? z.prettifyError(error) : String(error)}`);
  }
};

check("profile", () => profileSchema.parse(profile));
check("experience", () => z.array(experienceSchema).parse(experience));
check("skills", () => z.array(skillGroupSchema).parse(skillGroups));
check("education", () => z.array(educationSchema).parse(education));
check("achievements", () => z.array(achievementSchema).parse(achievements));
check("projects", () => z.array(projectSchema).parse(projects));
check("story", () => z.array(storySceneSchema).parse(storyScenes));
check("principles", () => z.array(principleSchema).parse(principles));
check("short version", () => shortVersionSchema.parse(shortVersion));
check("strengths", () => z.array(strengthSchema).parse(strengths));
check("life", () => lifeSchema.parse(life));
for (const scene of storyScenes) {
  // facts are template strings, so catch an "undefined" from a renamed education id
  for (const text of [...scene.body, ...scene.facts]) {
    if (text.includes("undefined")) errors.push(`story "${scene.id}": contains "undefined": ${text}`);
  }
}

const slugs = projects.map((p) => p.slug);
if (new Set(slugs).size !== slugs.length) errors.push("projects: duplicate slugs");
if ([...slugs].sort().join() !== [...projectSlugs].sort().join()) {
  errors.push(`slugs.ts is out of sync with projects.ts (${slugs.join(", ")} vs ${projectSlugs.join(", ")})`);
}
for (const job of experience) {
  for (const slug of job.projectSlugs) {
    if (!slugs.includes(slug)) errors.push(`experience "${job.id}" references unknown project "${slug}"`);
  }
}
for (const project of projects) {
  const ids = new Set(project.case.diagram.nodes.map((n) => n.id));
  for (const edge of project.case.diagram.edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) {
      errors.push(`project "${project.slug}": edge ${edge.from}→${edge.to} references a missing node`);
    }
  }
  if (project.links.githubPublic && !project.links.github) {
    errors.push(`project "${project.slug}": githubPublic is true but no github URL`);
  }
}

if (errors.length) {
  console.error(`\nContent validation failed:\n\n${errors.join("\n\n")}\n`);
  process.exit(1);
}
console.log(`Content OK: ${projects.length} projects, ${experience.length} role(s), ${skillGroups.length} skill groups.`);
