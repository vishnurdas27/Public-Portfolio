import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { Link } from "react-router";
import { GitHubIcon, LinkedInIcon } from "~/components/shared/icons";
import { photos, profile } from "~/content";
import { Bean, Star } from "../illustrations";
import { scrollToId } from "../scroll";
import { showToast } from "../store";

// with VITE_WEB3FORMS_KEY set the form posts to Web3Forms, otherwise it opens the visitor's mail app
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

type FormState = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<FormState>("idle");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      showToast("Email copied. Coffee is on the way ☕");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (!message) return;

    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Coffee chat${name ? ` with ${name}` : ""}`);
      const body = encodeURIComponent(`${message}\n\n${name ? `${name}\n` : ""}${email}`.trim());
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject: "Portfolio enquiry", name, email, message }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  const field =
    "w-full rounded-xl border-2 border-ink bg-cream px-4 py-3 text-[1rem] font-medium outline-none transition-colors placeholder:text-ink/45 focus:bg-white";

  return (
    <section id="contact" aria-labelledby="contact-title" className="story-wrap pb-12 pt-16 md:pt-24">
      <div className="sticker relative !rounded-[2rem] p-7 md:p-12" style={{ background: "var(--butter)", boxShadow: "10px 10px 0 var(--ink)" }}>
        <Star size={54} fill="var(--coral)" className="float absolute -left-5 -top-6" aria-hidden />
        <Bean size={44} className="float absolute -right-4 top-10 hidden sm:block" style={{ ["--d" as string]: "1s" }} aria-hidden />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          <div data-reveal>
            <p className="pill">Say hi</p>
            <h2 id="contact-title" className="display mt-5 text-[clamp(2.8rem,7.4vw,6rem)]">
              Let&apos;s grab a <span className="mark !text-ink">coffee.</span>
            </h2>
            <p className="mt-6 max-w-[30rem] text-[1.2rem] font-medium leading-relaxed">
              I'm looking for full-time Full Stack roles. If you're building something, I'd love to hear about it. The first coffee is on me.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={copyEmail} className="btn-ink">
                {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
                {copied ? "Copied!" : profile.email}
              </button>
              <a href={`mailto:${profile.email}`} className="btn-paper">
                <Mail size={18} aria-hidden /> Open mail
              </a>
            </div>

            <ul className="mt-7 flex flex-wrap gap-3">
              {[
                { href: profile.github, label: "GitHub", icon: <GitHubIcon size={17} /> },
                { href: profile.linkedin, label: "LinkedIn", icon: <LinkedInIcon size={17} /> },
                { href: profile.resumeUrl, label: "Résumé (PDF)", icon: <Download size={17} aria-hidden />, download: true },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.download ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}
                    className="pill !px-4 !py-2 text-[0.92rem] transition-colors hover:bg-ink hover:text-paper"
                  >
                    {link.icon}
                    {link.label}
                    {!link.download && <ArrowUpRight size={14} aria-hidden />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-20 lg:mt-8" data-reveal style={{ "--reveal-delay": "0.1s" } as CSSProperties}>
            {/* the selfie peeks over the card */}
            <img
              src={photos.peek.src}
              width={photos.peek.width}
              height={photos.peek.height}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute bottom-[calc(100%-1.4rem)] right-4 z-0 w-[clamp(9rem,17vw,13rem)] rotate-[-3deg] select-none"
              style={{ filter: "drop-shadow(5px 5px 0 var(--ink))" }}
            />
            <form onSubmit={submit} className="sticker relative z-10 grid gap-4 p-6 md:p-7" data-no-burst>
              <p className="hand text-[1.8rem] leading-none">or write a note</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-[0.88rem] font-bold">
                  Name
                  <input name="name" autoComplete="name" placeholder="Your name" className={field} />
                </label>
                <label className="grid gap-1.5 text-[0.88rem] font-bold">
                  Email
                  <input name="email" type="email" autoComplete="email" placeholder="you@company.com" className={field} />
                </label>
              </div>
              <label className="grid gap-1.5 text-[0.88rem] font-bold">
                Message
                <textarea name="message" required rows={4} placeholder="What are you building?" className={`${field} resize-none`} />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p aria-live="polite" className="text-[0.82rem] font-medium text-muted">
                  {state === "sent" ? "Thanks, message sent." : state === "error" ? "Could not send. Please email me directly." : WEB3FORMS_KEY ? "" : "Opens your mail app with the note filled in."}
                </p>
                <button type="submit" disabled={state === "sending"} className="btn-ink">
                  {state === "sending" ? "Sending…" : "Send note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 text-[0.92rem] font-semibold">
        <p>
          {profile.name} · Built by me with React and way too much coffee.
        </p>
        <div className="flex items-center gap-5">
          <Link to="/" viewTransition className="underline decoration-2 underline-offset-4 hover:bg-butter">
            Recruiter view
          </Link>
          <button type="button" onClick={() => scrollToId("top")} className="underline decoration-2 underline-offset-4 hover:bg-butter">
            Back to top ↑
          </button>
        </div>
      </footer>
    </section>
  );
}
