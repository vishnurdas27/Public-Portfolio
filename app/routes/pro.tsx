import { JsonLd } from "~/components/shared/json-ld";
import { AchievementsSection } from "~/components/pro/achievements";
import { ContactSection } from "~/components/pro/contact";
import { EducationSection } from "~/components/pro/education";
import { ExperienceSection } from "~/components/pro/experience";
import { FactStrip } from "~/components/pro/fact-strip";
import { ProFooter } from "~/components/pro/footer";
import { MobileActionBar, ProHeader } from "~/components/pro/header";
import { ProHero } from "~/components/pro/hero";
import { ProjectsSection } from "~/components/pro/projects";
import { SkillsSection } from "~/components/pro/skills";
import { SummarySection } from "~/components/pro/summary";
import { photos, profile } from "~/content";
import { buildMeta, personJsonLd } from "~/lib/seo";

export function links() {
  return [{ rel: "preload", as: "image", href: photos.pro.src, type: "image/webp", fetchPriority: "high" }];
}

export function meta() {
  return buildMeta({
    title: `${profile.name} | ${profile.title}, recruiter view`,
    description: profile.valueProp,
    path: "/",
    image: "pro",
  });
}

export default function Pro() {
  return (
    <>
      <ProHeader />
      <main id="main">
        <ProHero />
        <FactStrip />
        <SummarySection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <AchievementsSection />
        <ContactSection />
      </main>
      <ProFooter />
      <MobileActionBar />
      <JsonLd data={personJsonLd()} />
    </>
  );
}
