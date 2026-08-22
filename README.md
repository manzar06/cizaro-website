# Cizaro — Video Editor Portfolio

A cinematic, dark-themed portfolio site for **Kunal ("Cizaro")**, a freelance video editor.
Built with **Vite + React 19 + Framer Motion**. The signature piece is a full-bleed,
perspective-tilted "NLE timeline" hero (real filmstrips + animated audio waveforms),
plus an editorial accordion showcase, hover-to-play work grid, and a lightbox player.

> **Live media note:** the ~2 GB of video is **not** in this repo. It's hosted on
> **Cloudflare R2** and loaded at runtime via a single config URL (`VITE_MEDIA_BASE`).
> See [Media hosting](#media-hosting-cloudflare-r2).

---

## Tech stack

| | |
|---|---|
| Framework | React 19 |
| Bundler | Vite 8 |
| Animation | Framer Motion 12 |
| Lint | oxlint |
| Fonts | Anton (display), Inter (body), Space Mono (mono) |
| Media host | Cloudflare R2 (S3-compatible, zero egress) |
| App host | Vercel (or any static host) |

No CSS framework — all styling is hand-written design tokens in `src/styles.css`.

---

## Quick start (clone & run)

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone
git clone https://github.com/manzar06/cizaro-website.git
cd cizaro-website

# 2. Install
npm install

# 3. Point the app at the media (see note below), then run dev
npm run dev            # http://localhost:5173
```

### About media in dev

The video/image assets are on Cloudflare R2, not in the repo. `.env.production`
already contains the R2 URL, so **production builds work with no setup**. For the
**dev server** to show media, create a `.env` file with the same URL:

```bash
# .env  (git-ignored)
VITE_MEDIA_BASE=https://pub-28fdf413b1dd44c2996c09439f65b876.r2.dev
```

Without it, `npm run dev` runs fine but posters/videos 404 (it looks for them in
`/public/media`, which isn't shipped). Alternatively, drop your own media into
`public/media/<category>/<slug>.mp4` (+ `.jpg` posters) and leave `VITE_MEDIA_BASE` empty.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server (HMR) |
| `npm run build` | Production build → `dist/` (uses `.env.production`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

---

## Deploy to Vercel (step by step)

The app is a ~384 KB static build — it deploys anywhere. These steps use Vercel's
GitHub integration (media stays on R2, never uploaded to Vercel).

1. **Push to GitHub** (already done if you cloned this). `public/media` is git-ignored,
   so the repo stays tiny.
2. Go to **[vercel.com/new](https://vercel.com/new)** → **Import** this repository.
3. Vercel auto-detects the Vite preset:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - (leave these defaults)
4. **Environment variables:** none required — `VITE_MEDIA_BASE` is committed in
   `.env.production`. (If you prefer to set it in the dashboard instead, add
   `VITE_MEDIA_BASE` = your R2 URL and delete the committed `.env.production`.)
5. Click **Deploy**. Every push to the default branch auto-deploys.

**Netlify / Cloudflare Pages** are identical: build `npm run build`, publish `dist`.

`.vercelignore` ensures `public/media`, `media-r2`, and `dist` are never uploaded.

---

## Media hosting (Cloudflare R2)

Every media URL in the app is built through one helper so the host is swappable:

```js
// src/data.js
export const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE ?? '').replace(/\/$/, '')
export const media = (path) => `${MEDIA_BASE}${path}`   // media('/media/foo.mp4')
```

- **Empty base** (dev, no env) → served from `/public/media`.
- **Set base** (prod) → `https://<your-r2>.r2.dev/media/...`.

### Re-uploading / replacing media

The bucket layout must mirror `public/media/<category>/<file>`. Upload with
[rclone](https://rclone.org) (handles files >300 MB, which the R2 dashboard can't):

```bash
rclone config create r2 s3 provider=Cloudflare \
  access_key_id=<KEY> secret_access_key=<SECRET> \
  endpoint=https://<ACCOUNT_ID>.r2.cloudflarestorage.com no_check_bucket=true

rclone copy public/media r2:<bucket>/media --transfers 4 --progress
```

Create the R2 API token under **R2 → API Tokens → Object Read & Write**. Enable the
bucket's **Public Development URL** (Settings) to get the `r2.dev` URL, or attach a
custom domain for production. Full walkthrough in [`DEPLOY.md`](./DEPLOY.md).

### Optional: shrink videos

`scripts/compress-media.ps1` does a **visually-lossless** H.264 CRF-18 re-encode to
`media-r2/` (imperceptible quality loss, much smaller/faster). R2's 10 GB free tier
fits the originals as-is, so this is a speed optimization, not a requirement.

---

## Project structure

```
src/
  App.jsx                # composition + lightbox state
  data.js                # ALL content + the media() helper (edit content here)
  styles.css             # every style (design tokens + responsive at the bottom)
  components/
    Nav.jsx              # desktop nav + animated mobile hamburger menu
    Hero.jsx             # headline + ticking timecode
    EditTimeline.jsx     # the tilted NLE-ribbon hero background (perf-sensitive)
    Marquee.jsx          # niche ticker
    Featured.jsx         # selected-clients list (cursor-follow video preview)
    Showcase.jsx         # editorial accordion "vault" of categories
    VideoCard.jsx        # hover-autoplay clip card
    Services.jsx         # "What I Cut" hover-play cards
    Testimonials.jsx     # DM screenshots marquee / swipe carousel
    Contact.jsx          # links + drifting brand-logo background
    Lightbox.jsx         # full-screen video/image modal
    Cursor.jsx           # custom cursor (desktop only)
public/
  media/                 # NOT in git — lives on R2 (posters, clips, filmstrips)
  favicon.svg
```

Working on this with an AI agent? See **[`CLAUDE.md`](./CLAUDE.md)** for a codebase
map, conventions, and gotchas written for coding agents.

---

## License

Personal portfolio. Content © Kunal (Cizaro). Code provided as-is.
