import type { SkillGroup } from "./schema";

// grouped like the résumé; the ids pick each group's accent colour
export const skillGroups: SkillGroup[] = [
  {
    id: "interface",
    label: "Frontend",
    blurb: "Responsive, accessible interfaces with component-driven React.",
    items: ["React.js", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Flexbox"],
  },
  {
    id: "logic",
    label: "Backend",
    blurb: "APIs, authentication, real-time channels and third-party integrations.",
    items: [
      "Node.js",
      "Express.js",
      "Python (FastAPI)",
      "Socket.IO",
      "JWT auth",
      "Microsoft Graph API",
      "Stripe",
      "Clerk",
      "Inngest",
    ],
  },
  {
    id: "data",
    label: "Databases",
    blurb: "Relational and document data modelling, with Prisma as the access layer.",
    items: ["PostgreSQL", "MongoDB", "SQLite", "Prisma"],
  },
  {
    id: "cloud",
    label: "Tools & Cloud",
    blurb: "Shipping and running what I build.",
    items: ["Git", "AWS (EC2, RDS, S3)", "IBM Cloud", "Postman"],
  },
];
