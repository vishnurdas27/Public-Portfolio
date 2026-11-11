import type { Strength } from "./schema";

// every line comes from the résumé. the story side shows the titles as chips, /pro shows the first four in full
export const strengths: Strength[] = [
  {
    title: "End-to-end delivery",
    body: "React front ends, Node/Express and FastAPI back ends, PostgreSQL and MongoDB, deployed to the cloud. I own a feature from the screen to the database.",
  },
  {
    title: "Enterprise integrations",
    body: "Microsoft 365 through the Graph API (calendar sync, Teams meetings, email from each organizer's own mailbox), plus Stripe payments with webhooks and Clerk authentication.",
  },
  {
    title: "Real-time and automation",
    body: "Live dashboards over WebSockets, background jobs with Inngest, automated overdue tracking, and exportable PDF and Excel reports.",
  },
  {
    title: "Secure by default",
    body: "JWT authentication and role-based access (Admin, Manager, User) so every person sees exactly what they should.",
  },
  {
    title: "Cloud-ready",
    body: "Hands-on with AWS (EC2, RDS, S3, Route 53, CloudFront) and IBM Cloud, so what I build is ready to ship.",
  },
  {
    title: "Quick to learn, quicker to apply",
    body: "Trained as a full-stack developer alongside a degree, and kept adding workshops on AWS, Generative AI and the Model Context Protocol.",
  },
];
