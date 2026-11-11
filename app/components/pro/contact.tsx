import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";
import { useState } from "react";
import { profile } from "~/content";
import { GitHubIcon, LinkedInIcon } from "~/components/shared/icons";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="pro-section border-t border-line bg-accent-soft py-12 md:py-16">
      <div className="container-x">
        <p className="eyebrow">
          <span className="text-fg">07</span> · Contact
        </p>
        <h2
          id="contact-title"
          className="pro-contact-title mt-4 max-w-[16ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.045em]"
        >
          Get in <span className="font-serif font-normal italic text-accent">touch.</span>
        </h2>
        <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
          I'm looking for full-time Full Stack roles. Email is the quickest way to reach me.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="link-underline mt-8 inline-flex items-center gap-3 break-all text-[clamp(1.25rem,3.2vw,2.1rem)] font-medium tracking-tight"
        >
          {profile.email} <ArrowUpRight aria-hidden className="shrink-0" />
        </a>
        <div className="no-print mt-10 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="btn btn-primary">
            <Mail size={16} aria-hidden /> Send an email
          </a>
          <button type="button" onClick={copyEmail} className="btn btn-ghost">
            {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
            {copied ? "Copied" : "Copy email"}
          </button>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <LinkedInIcon size={16} /> LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <GitHubIcon size={16} /> GitHub
          </a>
          <a href={profile.resumeUrl} download className="btn btn-ghost">
            <Download size={16} aria-hidden /> Résumé (PDF)
          </a>
        </div>
        <p aria-live="polite" className="sr-only">
          {copied ? "Email address copied to clipboard" : ""}
        </p>
      </div>
    </section>
  );
}
