# CLAUDE.md — guide for AI coding agents

Context for Claude Code (or any coding agent) working on this repo. Read this first.

## What this is
A single-page **Vite + React 19 + Framer Motion** portfolio for a video editor.
No router (anchor-scroll nav), no CSS framework, no backend. Content is data-driven.

## Run / build / verify
```bash
npm install
npm run dev       # dev server, HMR
npm run build     # production build -> dist/  (must stay green)
npm run preview   # serve the build
npm run lint      # oxlint (must stay clean)
```
Always run `npm run build` **and** `npm run lint` after edits; both must pass before
you consider a change done. There are no unit tests — verification is build + lint +
visual check in a browser.

> Windows note: the working folder name contains a space (`D:\cizaro website`). If a
> tool breaks on the space, a directory junction without a space is used for tooling
> (e.g. `D:\cizaro-web`), while source files stay at the spaced path.

## Where things live
- **`src/data.js`** — ALL content (hero copy, videos, services, featured, testimonials,
  contact, nav). Edit content here, not in components.
- **`src/styles.css`** — every style. Design tokens in `:root` at the top; responsive
  overrides in `@media` blocks at the **bottom**.
- **`src/components/*`** — one file per section. `App.jsx` composes them and owns the
  lightbox state (`onOpen`/`setLightbox`).

## Hard conventions (do not violate)
1. **No em-dashes (`—`) in any visible copy.** The owner considers them an "AI tell."
   Use periods, commas, or colons. This applies to all user-facing text you write.
2. **All media URLs go through the `media()` helper** in `data.js`
   (`media('/media/cat/slug.mp4')`). Never hardcode `/media/...` in a component —
   it must respect `VITE_MEDIA_BASE` (Cloudflare R2 in prod, `/public/media` in dev).
3. **Responsive tiers:** `>1024px` = desktop (tilted ribbon hero fills the hero);
   `≤1024px` = tablet + phone get the **stacked hero + fixed bottom timeline band**
   (the tilted ribbon only filled the top half at mid widths → dead gap, so it's
   swapped out below 1024). `≤720px` additionally = phone (hamburger menu, full-width
   CTAs). Keep desktop untouched when doing mobile work — gate with `@media`.
4. **Custom cursor is desktop-only** (`@media (hover:hover) and (pointer:fine)` +
   hidden `≤720`). Never assume a pointer on touch.

## Performance rules (the hero is the heavy part)
The `EditTimeline` ribbon is the most expensive thing on the page. Respect these or
you'll reintroduce frame drops:
- **Never animate `.ribbon-plane`'s transform** — it's the ancestor of ~90 clips under
  a `perspective` context; animating it recomposites the whole 3D subtree per frame.
  The tilt is static; only the individual `.lane-track` marquees animate (CSS
  `translateX 0 → -50%` with duplicated content for a seamless loop).
- **No `mix-blend-mode`** on any overlay above the animated lanes (or the fixed grain).
  Blend modes force per-frame recompositing against moving content. Use plain
  semi-transparent gradients.
- **Off-screen animations pause.** `EditTimeline` and `Contact`'s logo strips use an
  `IntersectionObserver` to add `.ribbon--paused` / `.contact-bg--paused`
  (`animation-play-state: paused`) and to stop the 24fps timecode interval when
  scrolled away. Keep this pattern for any new always-animating element.
- **No `blur()` on containers of animated tracks** — it re-rasterizes every frame. Use
  opacity + saturation + the perspective tilt for depth instead.

## Media architecture
`data.js` exports `MEDIA_BASE = import.meta.env.VITE_MEDIA_BASE` and `media(path)`.
The ~2 GB of video is **not in the repo** — it's on Cloudflare R2, keyed as
`media/<category>/<file>`. `.env.production` holds the public R2 URL so builds work
with zero setup. To re-upload media, use rclone (see `README.md` / `DEPLOY.md`);
files >300 MB can't go through the R2 dashboard.

## Deploying (skill)
1. `npm run build` and `npm run lint` — both green.
2. Push to GitHub (`public/media` is git-ignored; `.vercelignore` also excludes it).
3. Vercel → New Project → import the repo. Vite preset auto-detected
   (build `npm run build`, output `dist`). No env vars needed (`.env.production`).
4. Deploy. Pushes to the default branch auto-deploy.

## Editing content (skill)
- Add/replace a clip: add an entry to `VIDEOS` in `data.js` (`{category, slug, title}`);
  the `src`/`poster` are derived as `media('/media/<category>/<slug>.mp4|.jpg')`. Upload
  the matching files to R2 under the same key.
- Change contact info / featured clients / services: edit the corresponding export in
  `data.js`. Keep the no-em-dash rule.
