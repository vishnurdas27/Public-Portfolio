# Vishnu R Das: portfolio

Two sides, one codebase.

| Route | What it is |
| --- | --- |
| `/` | Professional landing page. Profile and résumé actions, a framed studio portrait, full-width sections and project previews. Section navigation stays available on mobile, and it prints as a short résumé. |
| `/pro` | Backward-compatible recruiter view alias. It shares the homepage content and canonical URL. |
| `/story` | My story. Cream paper and black ink, a hero at a coffee counter, a road that walks through school, college and work, the Saint-Gobain projects with mock UIs, a skills menu, a scrapbook, and a few games. |
| `/projects/:slug` | A case study per project: delivery summary, role and stack, with jump links to the problem, approach, product screens (where available), architecture and features. |

Everything is prerendered to plain HTML at build time and hydrated in the browser. There is no server.

The professional homepage, recruiter alias and case studies default to **light mode**, regardless of the device theme. The theme toggle saves an explicit light/dark choice and keeps it across reloads and navigation. Missing, invalid or blocked storage falls back to light. `/story` always keeps its paper theme without replacing the saved recruiter theme. Navigation points to `/` for the professional view and `/story` for the creative version; the sitemap excludes the duplicate `/pro` alias.

## Stack

React 19, TypeScript, Vite, React Router (framework mode, static prerender), Tailwind CSS v4, cmdk for the ⌘K menu. Tests use Playwright and axe-core. There's no animation library: scrolling effects are `requestAnimationFrame`, the rest is CSS and the Web Animations API.

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # validate content, prerender, write 404/robots/sitemap, make social cards
npm run preview      # serve the build on http://localhost:4173
npm run typecheck
npm run lint
npm run test:e2e     # needs a build first, uses the installed Edge (PW_CHANNEL=chrome for Chrome)
npm run check:links  # internal links; add -- --external to request every outside URL too
```

## Project layout

```
app/
  routes/            home, pro (shared professional page), story, project, not-found
  components/
    story/           the "/story" side: sections/, ui/, games/, demos/, illustrations
    pro/             the professional homepage and "/pro" alias: one file per section
    shared/          used by both: diagram, header switch, theme toggle, project links
  content/           all copy and data (see below)
  styles/story/      the story stylesheet, split by area
  lib/               theme, seo, date formatting
assets/              photo sources and cutouts for the image scripts
scripts/             build helpers and the image scripts
tests/               Playwright specs
```

## Content

All text and data lives in `app/content` and feeds both sides, the ⌘K menu and the social cards.

| File | What's in it |
| --- | --- |
| `story.ts` | the story scenes, values, cup jokes, tape phrases and "the short version" |
| `life.ts` | the scrapbook: photos, captions and notes |
| `strengths.ts` | six strengths, shown as chips on `/story` and as cards on the professional homepage |
| `profile.ts`, `experience.ts`, `education.ts`, `achievements.ts`, `skills.ts` | the résumé sections |
| `projects.ts` | every project, including its architecture diagram as data |
| `slugs.ts` | slugs for the prerenderer (the build fails if it drifts from `projects.ts`) |

`npm run build` runs `scripts/validate-content.ts` first, so a missing field or a broken reference fails the build.

Ground rules: no invented numbers; enterprise screens are re-created with fake data and no company branding; a private repo shows "Private repo · walkthrough on request" instead of a dead link (`githubPublic: false`).

## Images

The pictures are generated from sources in `assets/`, so they can be redone.

```bash
npm run portraits    # assets/cutouts -> story stickers; assets/photos/headshot.jpg -> professional headshot
npm run scrapbook    # assets/photos + assets/cutouts/bike.png -> the scrapbook images
npm run icons        # favicon and touch icon
```

- `assets/cutouts` holds background-removed photos. They were cut out locally with `@imgly/background-removal-node`; nothing was uploaded anywhere.
- The story portraits are black-and-white die-cut stickers (white border, thin black outline, offset shadow added in CSS).
- The professional portrait keeps the original studio photo with a 5:6 head-and-shoulders crop, gentle tonal normalization and light sharpening. It is generated at 720x864, with a separate square crop for social previews; the source photo is unchanged.
- The scrapbook photos get a light warm grade so they sit on the paper. The bike is a sticker that rides in from the screen edge.
- Output is WebP without metadata, so no EXIF or location data is published.
- The enterprise case studies use real screenshots in `public/images/projects/<slug>/` (1440x900 WebP), listed under `screenshots` in `projects.ts`. They were captured from the apps running on throwaway demo databases with made-up people, with the company logo hidden. Re-capture them the same way; never from a database with real data.
- Several photos carry a "© Fenrir" credit. It's left visible wherever the crop includes it.

## Sound

The story side has a quiet soundscape, all synthesized with the Web Audio API (no audio files). It lives in `app/components/story`: `sound.ts` has the click and game sounds, `ambience.ts` has the background.

- **Music:** a slow generative piece in C major plays the whole time: a soft pad cycling through four chords (I, vi, IV, V), a wandering music-box melody on the pentatonic scale, and a gentle echo. It's made live, so it never loops the same way twice.
- **Breeze:** a soft, dark whoosh that swells as you scroll and fades out slowly when you stop. Slow reading scrolls stay silent.
- **Clicks and games:** buttons make small random cartoon sounds, and the games, the hero cups and the bug have their own. The bug scuttles in with a tiny sound.
- Browsers block audio until the visitor clicks, taps or presses a key, so nothing plays before that.
- The speaker button in the header turns everything off and the choice is remembered. The ⌘K menu has the same switch. Audio also pauses while the tab is hidden.
- The breeze is skipped when the visitor prefers reduced motion.
- To keep an element silent, give it `data-no-sound` (the games and cups do, because they play their own sounds).
- The music and breeze levels are `MUSIC` and `WIND` at the top of `ambience.ts`. Both sit well below the click sounds.

## Config

Copy `.env.example` to `.env`.

- `VITE_SITE_URL`: the final URL. Turns on canonical and Open Graph image URLs and writes `sitemap.xml`.
- `VITE_WEB3FORMS_KEY`: optional. With it the contact form delivers directly, without it the form opens the visitor's mail app.

## Deploying

The output is static files in `build/client`.

- Vercel: import the repo; `vercel.json` is set up.
- Netlify or Cloudflare Pages: build command `npm run build`, publish directory `build/client` (`public/_headers` is picked up).
- GitHub Pages: publish `build/client`; a `404.html` is generated.

## Still to fill in

- Rewrite the story and short-version copy in `app/content/story.ts` in your own words, and say what you did at Tinkerspace Kochi.
- Flip `githubPublic` for the two enterprise repos if they ever go public, and add a live URL for CineSpot.
- Your domain (`VITE_SITE_URL`), and decide whether `public/resume.pdf` should keep your phone number.
