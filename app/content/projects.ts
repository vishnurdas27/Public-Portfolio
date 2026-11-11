import type { Project } from "./schema";

// copy comes from the résumé, the repository READMEs and the apps themselves, with no metrics or outcomes beyond what they state
export const projects: Project[] = [
  {
    slug: "action-plan-tracker",
    title: "Action Plan Tracker (APT)",
    kind: "enterprise",
    accent: "logic",
    tagline: "Meeting minutes in, accountable action items out.",
    summary:
      "A full-stack platform that turns meeting minutes into assigned, deadline-tracked action items. Organizers schedule meetings, a note-taker records the minutes, and every action point gets an owner who acknowledges it, plans it and closes it with evidence. Built and deployed for Saint-Gobain SEFPRO, where it replaced scattered spreadsheets and follow-up emails.",
    period: "May – Aug 2026",
    role: "Full Stack Developer (design, build, deploy)",
    stack: ["React", "Vite", "Node.js", "Express", "Prisma", "PostgreSQL", "Socket.IO", "Microsoft Graph API", "JWT"],
    highlights: [
      "Converts meeting minutes into assigned, deadline-tracked action items in one place.",
      "Microsoft 365 integration through the Graph API: calendar sync, Teams meeting creation, and notification emails sent from each organizer's own mailbox.",
      "Role-based dashboards (Admin, Manager, User) with live WebSocket updates and secure JWT authentication.",
      "Exportable PDF and Excel reports, plus automated surfacing of overdue items across personal and department views.",
      "An Action Master register that lists every action across meetings and recurring series, filterable by meeting, department and date.",
    ],
    screenshots: [
      {
        src: "/images/projects/action-plan-tracker/dashboard.webp",
        alt: "Organisation dashboard with action counts by status, by meeting and by department",
        caption: "Organisation dashboard: every action by status, meeting and department",
      },
      {
        src: "/images/projects/action-plan-tracker/action-master.webp",
        alt: "Action Master register listing action plans with owner, status and target date",
        caption: "Action Master: the register of every action point",
      },
      {
        src: "/images/projects/action-plan-tracker/my-actions.webp",
        alt: "My Actions page with counts to acknowledge, ongoing, overdue and completed, grouped by meeting",
        caption: "My Actions: acknowledge, start and close your own items",
      },
      {
        src: "/images/projects/action-plan-tracker/meetings.webp",
        alt: "My Meetings page showing meeting cards grouped by week",
        caption: "My Meetings, grouped by week",
      },
      {
        src: "/images/projects/action-plan-tracker/admin.webp",
        alt: "Administration page with the user list, bulk upload and export buttons",
        caption: "Administration: users, bulk upload, PDF and Excel export",
      },
      {
        src: "/images/projects/action-plan-tracker/login.webp",
        alt: "Sign-in page with the line Turn discussions into decisions",
        caption: "Sign-in",
      },
    ],
    case: {
      problem:
        "Action items agreed in meetings were scattered across spreadsheets and follow-up emails, so it was hard to see who owned what, by when, and what was already overdue.",
      approach:
        "One platform where minutes become owned, dated action items. Microsoft 365 sits behind it, so calendar, Teams and email stay in the tools people already use, while role-based dashboards give each level of the organisation the view it needs.",
      features: [
        {
          title: "Meetings and scheduling",
          body: "Admins and managers schedule one-off or recurring meetings with attendees, a note-taker, a place and a rich-text agenda. A scheduling assistant shows who is free on the chosen day, and a linked Microsoft Teams meeting can be created in the same step.",
        },
        {
          title: "Minutes that become actions",
          body: "The note-taker records discussion points and action points during the meeting, or imports them in bulk from an Excel template. Submitting the minutes notifies the attendees and creates an action plan for each action point.",
        },
        {
          title: "Action lifecycle",
          body: "Each owner acknowledges their item, sets a planned start and a target date, starts it, and closes it with remarks and attached files. Every step is its own validated API call, and overdue items are flagged automatically.",
        },
        {
          title: "Action Master",
          body: "A register of every action across meetings and recurring series, with status counts and filters for meeting, department and date. It is the one list to open when someone asks where a decision stands.",
        },
        {
          title: "Dashboards for each role",
          body: "A personal dashboard for every user, a department view for managers and an organisation-wide view for admins, each breaking actions down by status, meeting and department.",
        },
        {
          title: "Microsoft 365 via Graph API",
          body: "Calendar sync, Teams meeting creation, and notification emails that are sent from each organizer's own mailbox rather than a generic address. The app is also packaged as a Microsoft Teams app, so it opens as a tab inside Teams.",
        },
        {
          title: "Live updates",
          body: "Notifications and data refreshes are pushed over Socket.IO, so a newly assigned action shows up without a page reload.",
        },
        {
          title: "Reports and administration",
          body: "PDF and Excel exports for users, meetings and actions. Admins manage users one by one or by bulk upload, and maintain the lookup lists the app uses.",
        },
        {
          title: "Security",
          body: "JWT authentication with bcrypt password hashes, role guards on the API, request validation, Helmet headers and rate limiting.",
        },
      ],
      diagram: {
        nodes: [
          { id: "client", label: "React app", sub: "browser · PWA · Teams tab", group: "interface" },
          { id: "api", label: "Express API", sub: "JWT auth · role checks", group: "logic" },
          { id: "ws", label: "Socket.IO", sub: "live updates", group: "logic" },
          { id: "reports", label: "Reports", sub: "PDF · Excel", group: "logic" },
          { id: "db", label: "PostgreSQL", sub: "via Prisma", group: "data" },
          { id: "graph", label: "Microsoft Graph", sub: "calendar · Teams · mail", group: "external" },
        ],
        edges: [
          { from: "client", to: "api", label: "REST" },
          { from: "ws", to: "client", label: "live updates" },
          { from: "api", to: "ws" },
          { from: "api", to: "db", label: "Prisma" },
          { from: "api", to: "reports", label: "export" },
          { from: "api", to: "graph", label: "sync" },
        ],
      },
      notes:
        "Enterprise project. The screenshots are the real application running on a demo database with made-up people and meetings, and the company logo is hidden. The source code is private.",
    },
    links: {
      github: "https://github.com/vishnurdas27/Action-Plan-Tracker",
      // private for now; flip to true once the repo is public
      githubPublic: false,
    },
  },
  {
    slug: "prism-helpdesk",
    title: "PRISM",
    fullTitle: "PRISM: Platform for Requests, Issues, Support & Maintenance",
    kind: "enterprise",
    accent: "interface",
    tagline: "Every request, issue and fix in one place.",
    summary:
      "An internal ticketing and work-planning tool for the plant's IT and application-support team. Requesters raise tickets, engineers do the work and plan their day against it, and the team lead watches the load and steps in when work needs a new owner. Built and deployed for Saint-Gobain SEFPRO.",
    period: "May – Aug 2026",
    role: "Full Stack Developer (design, build, deploy)",
    stack: ["React", "Vite", "Node.js", "Express", "Prisma", "PostgreSQL", "JWT", "PWA", "Electron"],
    highlights: [
      "Full ticket lifecycle: raise, route, acknowledge, work, complete, validate and close, with rework and reallocation paths.",
      "Catalog-driven routing sends each ticket to the right team. Higher priorities need an impact reason, and overdue work raises alerts.",
      "Four roles (requester, member, lead, admin) enforced on every API route and in the UI.",
      "Planning built in: a weekly task board, a drag-and-drop calendar, timers and time logs.",
      "Lead views of team workload against daily capacity, with daily, weekly and monthly reports.",
      "A short, guided ticket form for non-technical users, with search, filters and Excel export on every list.",
    ],
    screenshots: [
      {
        src: "/images/projects/prism-helpdesk/lead-dashboard.webp",
        alt: "Team lead dashboard with counts of tickets not acknowledged, in progress and overdue, and tickets waiting for reallocation",
        caption: "Lead dashboard: the queue, overdue work and what needs a new owner",
      },
      {
        src: "/images/projects/prism-helpdesk/tickets.webp",
        alt: "Ticket list with type, description, priority, assignee and status columns and filter cards on top",
        caption: "Tickets: filter by status, priority, assignee and date",
      },
      {
        src: "/images/projects/prism-helpdesk/ticket-detail.webp",
        alt: "Ticket detail page showing requester, assignee, dates, impact reasons, estimate and the tasks planned on the ticket",
        caption: "Ticket detail: overview, estimate, time logged and its tasks",
      },
      {
        src: "/images/projects/prism-helpdesk/raise-ticket.webp",
        alt: "Raise ticket form in numbered steps: category, ticket type, application and page, assignee, priority and details",
        caption: "Raising a ticket: a guided form in six steps",
      },
      {
        src: "/images/projects/prism-helpdesk/my-tasks.webp",
        alt: "My Tasks board listing the week's tasks by day with status, priority, estimate and time log",
        caption: "My Tasks: the week as a board, with status and time logs",
      },
      {
        src: "/images/projects/prism-helpdesk/planning-calendar.webp",
        alt: "Planning calendar for the week with unplanned work on the left and scheduled task slots on the grid",
        caption: "Planning calendar: drag unplanned work into the day",
      },
      {
        src: "/images/projects/prism-helpdesk/team-workload.webp",
        alt: "Team page with hours planned today against capacity and a card for each developer",
        caption: "Team workload: who has room today and who is stretched",
      },
      {
        src: "/images/projects/prism-helpdesk/analytics.webp",
        alt: "Daily stand-up report comparing yesterday's planned and logged hours with today's plan for each person",
        caption: "Daily stand-up report: planned against logged hours",
      },
    ],
    case: {
      problem:
        "Plant support work arrived by email, phone and corridor conversation. Nobody could say what had been asked for and where it stood, who on the team was overloaded today, or whether work was delivered on time.",
      approach:
        "One tool for the whole loop. A requester raises a ticket through a short guided form, the catalog routes it to the right team, and the assigned engineer acknowledges it with an estimate and plans it into their day. Completing it hands it back to the requester to validate and rate. The lead sees the queue, the team's load and anything that needs a new owner.",
      features: [
        {
          title: "Raising a ticket",
          body: "A guided form: category, type, then application, module and page (or IT category), an assignee from the team it routes to, and a priority. Higher priorities need an impact reason. Attachments up to 15 MB are accepted, similar tickets are shown to avoid duplicates, and a lead can log a ticket on a requester's behalf.",
        },
        {
          title: "Catalog-driven routing",
          body: "The assignment group is resolved bottom-up: the deepest catalog node with a group wins, then its parents, then the category default. Admins set this up in a routing matrix and can preview the result.",
        },
        {
          title: "A lifecycle with rules",
          body: "Assigned, acknowledged, in progress, completed, validation and closed, plus parked and pending reallocation. Acknowledging needs an estimate and a start date, completing needs every task done with time logged, and every status change is recorded with who made it.",
        },
        {
          title: "Validation, ratings and rework",
          body: "The requester closes a ticket with a satisfaction answer and three ratings (quality, timeliness, communication), or asks for rework, which closes the original and opens a linked ticket for the same assignee.",
        },
        {
          title: "Planning and time tracking",
          body: "A weekly task board, a calendar where work is dragged into day slots or placed in the next free slot, one running timer per person plus manual entries, subtasks, recurring tasks, and split and carry forward for work that runs over.",
        },
        {
          title: "Lead views",
          body: "A dashboard of the queue, tickets waiting for reallocation and attention flags; team workload measured against each person's daily capacity; and a shared team calendar and task list.",
        },
        {
          title: "Reports",
          body: "A daily stand-up, weekly review and monthly review that compare planned with logged hours, and a monthly hours report with breakdowns by day, type, category and person. Reports export to CSV or print, and ticket and task lists export to Excel.",
        },
        {
          title: "Notifications and collaboration",
          body: "Thirteen kinds of in-app notification with an unread count, overdue alerts raised by a background job every 15 minutes, and optional emails with links back into the app. A member can invite a colleague onto a ticket or a task.",
        },
        {
          title: "Administration",
          body: "Admins manage the catalog (applications, modules, pages, IT categories), priorities and impact reasons, users (including bulk import from CSV or Excel), assignment groups and routing. Anything already in use is deactivated rather than deleted.",
        },
        {
          title: "Security and reliability",
          body: "JWT in an HTTP-only cookie with sliding sessions, a CSRF header on every state-changing request, rate limits on the API and on failed sign-ins, Helmet with a locked-down CSP, and per-record access checks on top of role checks. Operations that can race run in serializable transactions with retry.",
        },
        {
          title: "Delivery",
          body: "Routes are lazy-loaded so each role downloads only its own screens. The app installs as a PWA and has an Electron shell for Windows. In production it runs on IIS, which proxies to the Node process on localhost so the API is never directly reachable.",
        },
      ],
      diagram: {
        nodes: [
          { id: "client", label: "React app", sub: "browser · PWA · Electron", group: "interface" },
          { id: "iis", label: "IIS reverse proxy", sub: "URL Rewrite + ARR", group: "logic" },
          { id: "api", label: "Express API", sub: "role guards · services", group: "logic" },
          { id: "job", label: "Overdue job", sub: "alerts every 15 min", group: "logic" },
          { id: "db", label: "PostgreSQL", sub: "via Prisma", group: "data" },
          { id: "files", label: "Uploads folder", sub: "ticket attachments", group: "data" },
          { id: "mail", label: "SMTP relay", sub: "ticket emails", group: "external" },
        ],
        edges: [
          { from: "client", to: "iis", label: "HTTPS" },
          { from: "iis", to: "api", label: "localhost" },
          { from: "api", to: "db", label: "Prisma" },
          { from: "api", to: "files" },
          { from: "job", to: "db" },
          { from: "api", to: "mail", label: "email" },
        ],
      },
      notes:
        "Enterprise project. The screenshots are the real application running on a demo database with made-up people and tickets, and the company logo is hidden. The source code is private.",
    },
    links: {
      github: "https://github.com/vishnurdas27/PlantDesk-Ticketing-Tool",
      // private for now; flip to true once the repo is public
      githubPublic: false,
    },
  },
  {
    slug: "ai-wiki-quiz",
    title: "AI Wiki Quiz Generator",
    kind: "personal",
    accent: "cloud",
    tagline: "Paste a Wikipedia link, get a quiz.",
    summary:
      "An AI-powered tool that generates multiple-choice questions from any Wikipedia article using Google Gemini and LangChain, then stores every quiz so it can be revisited.",
    role: "Personal project (backend, AI pipeline, frontend)",
    stack: [
      "FastAPI",
      "React",
      "PostgreSQL",
      "LangChain",
      "Google Gemini",
      "BeautifulSoup",
      "SQLAlchemy",
      "Tailwind CSS",
    ],
    highlights: [
      "Generates 5–10 multiple-choice questions from a Wikipedia URL using Google Gemini and LangChain.",
      "FastAPI backend with BeautifulSoup to scrape and extract clean article text.",
      "PostgreSQL stores generated quizzes and user history.",
      "Interactive Tailwind UI with dark mode and instant scoring.",
    ],
    case: {
      problem:
        "Turning an article into a good set of quiz questions by hand is slow, and a raw LLM call alone does not give you clean source text or a place to keep the results.",
      approach:
        "A three-step pipeline: scrape and clean the article text, have Gemini (orchestrated with LangChain) write the questions, then persist the quiz so the history and individual quizzes can be reopened later.",
      features: [
        {
          title: "Scrape → generate → store",
          body: "BeautifulSoup extracts clean text, LangChain and Gemini produce the questions, and PostgreSQL persists them.",
        },
        {
          title: "REST API",
          body: "FastAPI endpoints to generate a quiz, list history and fetch a quiz by id.",
        },
        {
          title: "Interactive quiz mode",
          body: "A React UI where you can take a quiz and get instant scoring, with dark mode.",
        },
        {
          title: "History",
          body: "Previously generated quizzes are saved and can be reviewed at any time.",
        },
      ],
      diagram: {
        nodes: [
          { id: "client", label: "React UI", sub: "quiz · history · dark mode", group: "interface" },
          { id: "api", label: "FastAPI", sub: "generate · history · quiz by id", group: "logic" },
          { id: "scrape", label: "Scraper", sub: "BeautifulSoup", group: "logic" },
          { id: "db", label: "PostgreSQL", sub: "quizzes · history", group: "data" },
          { id: "llm", label: "LangChain → Gemini", sub: "question generation", group: "external" },
        ],
        edges: [
          { from: "client", to: "api", label: "URL" },
          { from: "api", to: "scrape", label: "fetch" },
          { from: "api", to: "llm", label: "prompt" },
          { from: "api", to: "db", label: "save" },
        ],
      },
    },
    links: {
      github: "https://github.com/vishnurdas27/AI-Wiki-Quiz-Generator",
      githubPublic: true,
      live: "https://tinyurl.com/ai-quiz-generator55",
      liveNote: "Hosted on a free tier, so the first load can take a moment to wake up.",
    },
  },
  {
    slug: "cinespot",
    title: "CineSpot",
    fullTitle: "CineSpot: Movie Booking",
    kind: "personal",
    accent: "logic",
    tagline: "Pick a film, pick your seats, pay, done.",
    summary:
      "A full-stack movie booking platform: browse movies, choose seats and book tickets, with real-time Stripe payments and background-job confirmations.",
    role: "Personal project (full stack)",
    stack: ["React", "Node.js", "Tailwind CSS", "Stripe", "Clerk", "Inngest"],
    highlights: [
      "Browse movies, select seats and book tickets in one flow.",
      "Stripe for secure real-time payments, with webhooks confirming payment status.",
      "Multi-session authentication (email, social, phone) through Clerk.",
      "Inngest background jobs to automate booking confirmations.",
    ],
    case: {
      problem:
        "A booking is only real once the money has actually moved, so the flow has to trust the payment provider's confirmation, not the browser.",
      approach:
        "The server confirms bookings from Stripe webhooks rather than from the client, authentication is delegated to Clerk, and confirmations run as Inngest background jobs so they do not block the request.",
      features: [
        {
          title: "Seat selection and booking",
          body: "Browse films, pick seats and book tickets seamlessly.",
        },
        {
          title: "Webhook-confirmed payments",
          body: "Stripe handles payment; webhooks confirm payment status on the server.",
        },
        {
          title: "Flexible sign-in",
          body: "Multi-session authentication with email, social and phone options via Clerk.",
        },
        {
          title: "Background confirmations",
          body: "Inngest schedules and runs booking-confirmation jobs outside the request cycle.",
        },
      ],
      diagram: {
        nodes: [
          { id: "client", label: "React + Tailwind", sub: "browse · seats · checkout", group: "interface" },
          { id: "api", label: "Node.js server", sub: "bookings · webhooks", group: "logic" },
          { id: "clerk", label: "Clerk", sub: "email · social · phone", group: "external" },
          { id: "stripe", label: "Stripe", sub: "payments · webhooks", group: "external" },
          { id: "inngest", label: "Inngest", sub: "background jobs", group: "external" },
        ],
        edges: [
          { from: "client", to: "clerk", label: "sign in" },
          { from: "client", to: "api", label: "book" },
          { from: "api", to: "stripe", label: "checkout" },
          { from: "stripe", to: "api", label: "webhook" },
          { from: "api", to: "inngest", label: "confirm" },
        ],
      },
    },
    links: {
      github: "https://github.com/vishnurdas27/CineSpot---Movie_Booking_Application",
      githubPublic: true,
      // no live demo yet: the deploy url in the repo returns 404 at its root
    },
  },
  {
    slug: "court-booking",
    title: "Badminton Court Booking System",
    kind: "personal",
    accent: "data",
    tagline: "Courts, coaches and equipment in one booking flow.",
    summary:
      "A full-stack application for managing court bookings, coach registration and equipment tracking, with dynamic pricing and an admin dashboard.",
    role: "Personal project (full stack)",
    stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "PostgreSQL", "Sequelize", "JWT"],
    highlights: [
      "Dynamic pricing rules based on court selection, time slots and demand.",
      "Admin dashboard to administer courts and pricing, alongside secure user authentication.",
      "Equipment availability management and coach assignment to specific sessions.",
      "Role-based access control with JWT authentication.",
    ],
    case: {
      problem:
        "A court booking is a combination of a court, a time slot, optionally a coach and optionally equipment, and the price depends on all of them.",
      approach:
        "A React front end talks to an Express API backed by PostgreSQL through Sequelize. Pricing is rule-driven (court, time slot, demand), and an admin dashboard manages courts, pricing, coaches and equipment.",
      features: [
        {
          title: "Dynamic pricing",
          body: "Pricing rules that depend on the court selected, the time slot and demand.",
        },
        {
          title: "Coaches and equipment",
          body: "Coach registration, assigning coaches to sessions, and tracking equipment availability.",
        },
        {
          title: "Admin dashboard",
          body: "Administer courts and pricing from a dedicated dashboard.",
        },
        {
          title: "Secure access",
          body: "JWT-based authentication with role-based access control.",
        },
      ],
      diagram: {
        nodes: [
          { id: "client", label: "React (Vite)", sub: "booking · admin dashboard", group: "interface" },
          { id: "api", label: "Express API", sub: "JWT · role-based access", group: "logic" },
          { id: "pricing", label: "Pricing rules", sub: "court · slot · demand", group: "logic" },
          { id: "db", label: "PostgreSQL", sub: "via Sequelize", group: "data" },
        ],
        edges: [
          { from: "client", to: "api", label: "REST" },
          { from: "api", to: "pricing" },
          { from: "api", to: "db", label: "Sequelize" },
        ],
      },
    },
    links: {
      github: "https://github.com/vishnurdas27/Sports-Court-Booking-Application",
      githubPublic: true,
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const enterpriseProjects = projects.filter((p) => p.kind === "enterprise");
export const personalProjects = projects.filter((p) => p.kind === "personal");
