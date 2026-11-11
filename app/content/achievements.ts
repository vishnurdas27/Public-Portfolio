import type { Achievement } from "./schema";

export const achievements: Achievement[] = [
  {
    id: "entrepreneurship-first",
    title: "First Place, Entrepreneurship Business Idea Competition",
    issuer: "Entrepreneurship Bootcamp, CUSAT",
    date: "Feb 2025",
    kind: "award",
    body: "Coordinated the event and secured first place in the business idea competition.",
  },
  {
    id: "fullstack-cert",
    title: "Full Stack Development Certificate",
    issuer: "NxtWave",
    kind: "certificate",
    body: "Certified in building scalable web apps with React, Node.js and MongoDB, covering frontend, backend and database management.",
  },
  {
    id: "aws-workshop",
    title: "AWS Hands-on Workshop",
    issuer: "NxtWave",
    kind: "workshop",
    body: "Practical experience building and deploying applications with AWS EC2, RDS, Route 53, S3 and CloudFront.",
  },
  {
    id: "genai-mcp",
    title: "Generative AI & Model Context Protocol Workshops",
    issuer: "NxtWave",
    kind: "workshop",
    body: "Completed workshops on Generative AI and the Model Context Protocol (MCP), covering AI architecture and implementation.",
  },
  {
    id: "tinkerspace",
    title: "Regular at Tinkerspace Kochi",
    issuer: "Tinkerspace Kochi",
    kind: "event",
    body: "A regular at Tinkerspace Kochi, building and learning alongside people who like making things.",
  },
  {
    id: "talentime",
    title: "Talentime '39 Participant",
    issuer: "School of Management Studies, CUSAT",
    kind: "event",
    body: "Participated in South India's largest management fest, showcasing leadership and analytical skills.",
  },
];
