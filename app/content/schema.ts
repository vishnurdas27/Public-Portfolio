import { z } from "zod";

// content files only import the types from this file, so zod stays out of the browser bundle.
// the schemas themselves run in scripts/validate-content.ts at build time.

const layerSchema = z.enum(["interface", "logic", "data", "cloud"]);

export const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  email: z.email(),
  linkedin: z.url(),
  github: z.url(),
  resumeUrl: z.string().startsWith("/"),
  availability: z.string().min(1),
  valueProp: z.string().min(20),
  summary: z.string().min(40),
});
export type Profile = z.infer<typeof profileSchema>;

export const experienceSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
  summary: z.string(),
  projectSlugs: z.array(z.string()).min(1),
});
export type Experience = z.infer<typeof experienceSchema>;

export const skillGroupSchema = z.object({
  id: layerSchema,
  label: z.string(),
  blurb: z.string(),
  items: z.array(z.string()).min(1),
});
export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const educationSchema = z.object({
  id: z.string(),
  title: z.string(),
  institution: z.string(),
  period: z.string(),
  result: z.string().optional(),
  note: z.string().optional(),
});
export type Education = z.infer<typeof educationSchema>;

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  date: z.string().optional(),
  kind: z.enum(["award", "certificate", "workshop", "event"]),
  body: z.string(),
});
export type Achievement = z.infer<typeof achievementSchema>;

const diagramNodeSchema = z.object({
  id: z.string(),
  label: z.string().max(28),
  sub: z.string().max(34).optional(),
  group: z.enum(["interface", "logic", "data", "external"]),
});
const diagramEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
});
const diagramSchema = z.object({
  nodes: z.array(diagramNodeSchema).min(2),
  edges: z.array(diagramEdgeSchema).min(1),
});
export type Diagram = z.infer<typeof diagramSchema>;

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  // the long form, when the short title is an acronym or a short name
  fullTitle: z.string().optional(),
  kind: z.enum(["enterprise", "personal"]),
  accent: layerSchema,
  tagline: z.string(),
  summary: z.string(),
  period: z.string().optional(),
  role: z.string(),
  stack: z.array(z.string()).min(1),
  highlights: z.array(z.string()).min(1),
  // every screenshot is 1440x900 (see ScreenGallery)
  screenshots: z
    .array(z.object({ src: z.string().startsWith("/images/projects/"), alt: z.string().min(10), caption: z.string().min(3) }))
    .optional(),
  case: z.object({
    problem: z.string(),
    approach: z.string(),
    features: z.array(z.object({ title: z.string(), body: z.string() })).min(2),
    diagram: diagramSchema,
    notes: z.string().optional(),
  }),
  links: z.object({
    github: z.url().optional(),
    // false while the repo is private, so the UI shows a note instead of a dead link
    githubPublic: z.boolean(),
    live: z.url().optional(),
    liveNote: z.string().optional(),
  }),
});
export type Project = z.infer<typeof projectSchema>;

const toneSchema = z.enum(["butter", "sky", "coral", "leaf", "tangerine"]);

export const storySceneSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  years: z.string(),
  place: z.string(),
  title: z.string().min(4),
  body: z.array(z.string().min(10)).min(1).max(3),
  facts: z.array(z.string().min(2)).min(1).max(4),
  note: z.string().max(40),
  doodle: z.enum(["school", "kochi", "parallel", "events", "tinker"]),
  tone: toneSchema,
});
export type StoryScene = z.infer<typeof storySceneSchema>;

export const principleSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
  icon: z.enum(["diamond", "layers", "coffee", "spark"]),
});
export type Principle = z.infer<typeof principleSchema>;

export const strengthSchema = z.object({
  title: z.string().min(4).max(40),
  body: z.string().min(30),
});
export type Strength = z.infer<typeof strengthSchema>;

export const shortVersionSchema = z.object({
  kicker: z.string(),
  statement: z.string().min(60),
  lines: z.array(z.string().min(20)).min(1).max(4),
});
export type ShortVersion = z.infer<typeof shortVersionSchema>;

const lifeShotSchema = z.object({
  src: z.string().startsWith("/images/"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(10),
  caption: z.string().max(40),
});
const lifeNoteSchema = z.object({ title: z.string().max(40), body: z.string().min(10) });

export const lifeSchema = z.object({
  kicker: z.string(),
  intro: z.string().min(20),
  bubble: z.string().max(40),
  shots: z.object({
    bike: lifeShotSchema,
    golden: lifeShotSchema,
    bridge: lifeShotSchema,
    volleyball: lifeShotSchema,
    bouquet: lifeShotSchema,
    batch: lifeShotSchema,
  }),
  notes: z.object({
    bike: lifeNoteSchema,
    volleyball: lifeNoteSchema,
    batch: lifeNoteSchema,
    bouquet: lifeNoteSchema,
  }),
});
export type Life = z.infer<typeof lifeSchema>;
