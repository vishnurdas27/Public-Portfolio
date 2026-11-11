import { Command } from "cmdk";
import { ArrowUpRight, Bike, Bug, Volume2, Coffee, Compass, Copy, Download, FileText, Gamepad2, Hammer, Mail, Map, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { cupJokes, profile, projects } from "~/content";
import { scrollToId } from "../scroll";
import { setSoundEnabled, useSoundEnabled } from "../sound";
import { setPaletteOpen, showToast, usePaletteOpen } from "../store";

interface Entry {
  label: string;
  hint?: string;
  icon: ReactNode;
  keywords?: string[];
  run: () => void;
}

const SECTIONS: Array<{ id: string; label: string; icon: ReactNode; keywords: string[] }> = [
  { id: "top", label: "Start", icon: <Compass size={16} />, keywords: ["home", "top", "hero"] },
  { id: "about", label: "The short version", icon: <Sparkles size={16} />, keywords: ["about", "summary", "strengths", "tldr"] },
  { id: "story", label: "My story", icon: <Map size={16} />, keywords: ["navodaya", "cusat", "tinkerspace", "journey", "about"] },
  { id: "work", label: "Real work", icon: <Hammer size={16} />, keywords: ["saint-gobain", "sefpro", "experience", "apt", "prism"] },
  { id: "menu", label: "The menu", icon: <Coffee size={16} />, keywords: ["skills", "projects", "values"] },
  { id: "life", label: "Scrapbook", icon: <Bike size={16} />, keywords: ["bike", "volleyball", "photos", "batch", "travel", "off the clock"] },
  { id: "play", label: "Play games", icon: <Gamepad2 size={16} />, keywords: ["timepass", "coffee catch", "bug whack", "memory"] },
  { id: "contact", label: "Say hi", icon: <Mail size={16} />, keywords: ["email", "hire", "coffee"] },
];

const tellJoke = () => showToast(cupJokes[Math.floor(Math.random() * cupJokes.length)] ?? "Espresso yourself.", 4500);

// label prefix, then word prefix, then substring, then keywords. cmdk's fuzzy default can rank an unrelated item above an exact match
function scoreItem(value: string, search: string, keywords?: string[]) {
  const tokens = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 1;
  const label = value.toLowerCase();
  const words = label.split(/\s+/);
  const extra = (keywords ?? []).map((k) => k.toLowerCase());
  let total = 1;
  for (const token of tokens) {
    let score = 0;
    if (label.startsWith(token)) score = 1;
    else if (words.some((w) => w.startsWith(token))) score = 0.9;
    else if (label.includes(token)) score = 0.7;
    else if (extra.some((k) => k.startsWith(token))) score = 0.5;
    else if (extra.some((k) => k.includes(token))) score = 0.3;
    if (score === 0) return 0;
    total = Math.min(total, score);
  }
  return total;
}

export function Palette() {
  const open = usePaletteOpen();
  const navigate = useNavigate();
  const soundOn = useSoundEnabled();

  const act = (fn: () => void) => () => {
    setPaletteOpen(false);
    // let the dialog unmount and release its focus trap first
    window.setTimeout(fn, 140);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = profile.resumeUrl;
    a.download = "Vishnu_R_Das_Resume.pdf";
    a.click();
  };

  const groups: Array<{ heading: string; entries: Entry[] }> = [
    {
      heading: "Jump to",
      entries: SECTIONS.map((s) => ({ label: s.label, icon: s.icon, keywords: s.keywords, run: () => scrollToId(s.id) })),
    },
    {
      heading: "Projects",
      entries: projects.map((p) => ({
        label: p.title,
        hint: p.kind === "enterprise" ? "Enterprise" : "Personal",
        icon: <FileText size={16} />,
        keywords: [...p.stack, p.kind],
        run: () => void navigate(`/projects/${p.slug}`, { viewTransition: true }),
      })),
    },
    {
      heading: "Actions",
      entries: [
        { label: "Switch to recruiter view", hint: "/", icon: <ArrowUpRight size={16} />, keywords: ["professional", "resume", "cv"], run: () => void navigate("/", { viewTransition: true }) },
        { label: "Download résumé (PDF)", icon: <Download size={16} />, keywords: ["cv"], run: download },
        { label: "Copy email address", hint: profile.email, icon: <Copy size={16} />, run: () => void navigator.clipboard?.writeText(profile.email).then(() => showToast("Email copied ☕")) },
        { label: "Open GitHub", icon: <ArrowUpRight size={16} />, run: () => window.open(profile.github, "_blank", "noopener,noreferrer") },
        { label: "Open LinkedIn", icon: <ArrowUpRight size={16} />, run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer") },
        { label: soundOn ? "Turn sound off" : "Turn sound on", icon: <Volume2 size={16} />, keywords: ["sound", "mute", "audio", "noise"], run: () => setSoundEnabled(!soundOn) },
        { label: "Tell me a coffee joke", icon: <Sparkles size={16} />, keywords: ["funny", "fun"], run: tellJoke },
        { label: "Where is the bug?", icon: <Bug size={16} />, keywords: ["easter egg", "konami"], run: () => showToast("Wait a few seconds and watch the bottom of the screen. Squash it!", 4500) },
      ],
    },
  ];

  return (
    <Command.Dialog open={open} onOpenChange={setPaletteOpen} label="Menu" filter={scoreItem} loop>
      <Command.Input placeholder="Where to? Try “story”, “games” or “recruiter”" autoFocus />
      <Command.List>
        <Command.Empty>Nothing on that menu. Try “story”, “react” or “coffee”.</Command.Empty>
        {groups.map((group) => (
          <Command.Group key={group.heading} heading={group.heading}>
            {group.entries.map((entry) => (
              <Command.Item key={`${group.heading}-${entry.label}`} value={entry.label} keywords={entry.keywords} onSelect={act(entry.run)}>
                <span aria-hidden>{entry.icon}</span>
                <span className="flex-1">{entry.label}</span>
                {entry.hint && <span className="text-[0.76rem] font-medium text-muted">{entry.hint}</span>}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
