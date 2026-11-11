import { achievements } from "./achievements";
import { education } from "./education";
import type { Principle, ShortVersion, StoryScene } from "./schema";

// the story side, in the order it happened. facts come from the résumé; the wording is first person

const edu = (id: string) => education.find((e) => e.id === id);
const win = achievements.find((a) => a.id === "entrepreneurship-first");

export const storyScenes: StoryScene[] = [
  {
    id: "navodaya",
    years: "2020 – 2023",
    place: "Jawahar Navodaya Vidyalaya, Palakkad",
    title: "It started at Navodaya.",
    body: [
      "Class X and Class XII, both at Jawahar Navodaya Vidyalaya in Palakkad. This is where my story starts.",
      "School gave me the basics, and I still use them: show up, pay attention, finish what you start.",
    ],
    facts: [`Class X · ${edu("x")?.result}`, `Class XII · ${edu("xii")?.result}`],
    note: "where it all began",
    doodle: "school",
    tone: "butter",
  },
  {
    id: "cusat",
    years: "2023 – 2026",
    place: "Cochin University of Science and Technology, Kochi",
    title: "Then came Kochi.",
    body: [
      "In 2023 I joined CUSAT for my B.Voc. New city, new people, and a degree built around learning by doing, which suits me.",
      `I finished with a CGPA of ${edu("bvoc")?.result?.replace("CGPA ", "")}.`,
      "Off the lecture bench, I play volleyball for the university.",
    ],
    facts: ["B.Voc. · CUSAT", `${edu("bvoc")?.result}`, "University volleyball player"],
    note: "chai, chaos, code",
    doodle: "kochi",
    tone: "sky",
  },
  {
    id: "parallel",
    years: "Apr 2024 → now",
    place: "NxtWave, alongside the degree",
    title: "Two classrooms at once.",
    body: [
      "While the degree ran in one classroom, I started a full-stack development program in another. React, Node, MongoDB, SQL: same coffee, double the homework.",
      "That's where the MERN stack stopped being a list of words and turned into things I could ship.",
    ],
    facts: ["Full Stack Development · NxtWave", "React · Node.js · MongoDB"],
    note: "yes, at the same time",
    doodle: "parallel",
    tone: "coral",
  },
  {
    id: "events",
    years: "2024 – 2025",
    place: "Workshops & events",
    title: "I said yes to rooms with new ideas.",
    body: [
      "I took the workshops worth taking: AWS hands-on (EC2, RDS, S3, Route 53, CloudFront), Generative AI, and the Model Context Protocol.",
      `I coordinated the entrepreneurship event at CUSAT and came away with first place in its business idea competition (${win?.date}). I also showed up at Talentime '39, South India's largest management fest.`,
    ],
    facts: ["1st place · CUSAT Entrepreneurship Bootcamp", "AWS · GenAI · MCP workshops", "Talentime '39"],
    note: "first place, still smiling",
    doodle: "events",
    tone: "leaf",
  },
  {
    id: "tinkerspace",
    years: "Along the way",
    place: "Tinkerspace Kochi",
    title: "A regular at Tinkerspace.",
    body: [
      "Outside the classroom I was a regular at Tinkerspace Kochi, a place for people who like building things.",
      "It's the part of my story that doesn't fit on a résumé, so it goes here.",
    ],
    facts: ["Tinkerspace Kochi · regular"],
    note: "tinker first, ask later",
    doodle: "tinker",
    tone: "tangerine",
  },
];

export const principles: Principle[] = [
  {
    title: "Quality over quantity",
    body: "I'd rather ship one thing I'm proud of than five I have to apologise for.",
    icon: "diamond",
  },
  {
    title: "End to end",
    body: "The screen, the API, the database, the cloud. I like owning the whole thing.",
    icon: "layers",
  },
  {
    title: "Coffee first",
    body: "Debugging goes better with coffee. So does most of life.",
    icon: "coffee",
  },
  {
    title: "Confident in my skills",
    body: "I know what I can build, and I'd rather let the work do the talking.",
    icon: "spark",
  },
];

export const cupJokes = [
  "Fun fact: three out of four bugs are fixed by coffee. The fourth needs a second coffee.",
  "Decaf? I don't know her.",
  "Warning: may contain traces of React.",
  "It works on my machine. And, thankfully, in production.",
  "Espresso yourself.",
  "I turn coffee into code. Sometimes the other way around.",
  "My code has two states: working, and about to be working.",
  "This cup is bigger on the inside. Like my backlog.",
] as const;

export const tapePhrases = ["Quality over quantity", "Two platforms shipped", "Coffee → code", "Ship it", "Fresh from Palakkad"] as const;

export const shortVersion: ShortVersion = {
  kicker: "The short version",
  statement:
    "I build the whole product: the screen people touch, the API behind it, the database under it and the cloud it runs on. And I build it to be good, not just done.",
  lines: [
    "In 2026 I delivered two production platforms for Saint-Gobain SEFPRO, with Microsoft 365 integration, real-time dashboards and automated reporting.",
    "I trained as a full-stack developer alongside my degree, and I keep learning in rooms full of builders, from AWS and Generative AI workshops to Tinkerspace Kochi.",
    "I'm confident in what I can do, and I'd rather let the work prove it.",
  ],
};
