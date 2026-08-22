# Deploying Cizaro

The site is two independent pieces:

| Piece | Size | Where it goes |
|-------|------|---------------|
| **The app** (HTML/CSS/JS) | ~384 KB | Vercel / Netlify / Cloudflare Pages (free) |
| **The media** (33 videos + posters + filmstrips) | ~2.1 GB | **Cloudflare R2** (free tier: 10 GB storage, **zero egress**) |

The app loads every clip from `VITE_MEDIA_BASE`. Empty in dev (served from `/public/media`); set to your R2 URL in production. One env var flips the whole site over — no code edits.

---

## 1. (Optional) Compress the videos

R2's 10 GB free tier fits your 2.1 GB of **originals as-is, at full quality** — so you can skip this entirely.

The only reason to compress is faster loading for visitors (a 556 MB clip is slow to start even when hosting is free). `scripts/compress-media.ps1` does a **visually-lossless** re-encode (H.264 CRF 18 — imperceptible even side-by-side) and writes to `media-r2/`, leaving your originals untouched:

```bash
pwsh scripts/compress-media.ps1
```

If you want zero risk, skip this and upload `public/media` directly in step 3.

## 2. Create the R2 bucket

1. Cloudflare dashboard → **R2** → **Create bucket** (e.g. `cizaro-media`).
2. Bucket → **Settings** → **Public access** → enable the **r2.dev** managed URL (or connect a custom domain like `media.cizaro.com`).
3. Copy the public base URL — looks like `https://pub-xxxxxxxx.r2.dev`.

## 3. Upload the media

The dashboard drag-drop struggles with 2 GB / many files. Use **rclone** (S3-compatible, resumable). Create an R2 API token (R2 → Manage API Tokens), then:

```bash
rclone config create r2 s3 provider=Cloudflare \
  access_key_id=<KEY> secret_access_key=<SECRET> \
  endpoint=https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# upload originals (or media-r2 if you compressed) preserving folder structure:
rclone copy public/media r2:cizaro-media/media --progress
```

The folder layout under the bucket must stay `media/<category>/<file>` so URLs line up.

## 4. Point the app at R2

Set the env var (locally in `.env`, and in your host's dashboard for prod):

```
VITE_MEDIA_BASE=https://pub-xxxxxxxx.r2.dev
```

Now `https://pub-xxxxxxxx.r2.dev/media/gaming/cod-montage-1.mp4` resolves. Test locally:

```bash
npm run build && npm run preview
```

## 5. Deploy the app

Recommended: **Vercel** (zero-config Vite).

1. Push this repo to GitHub. `public/media` is gitignored, so only the ~384 KB app ships.
2. Vercel → New Project → import the repo (build command `npm run build`, output `dist` are auto-detected).
3. Add the env var **`VITE_MEDIA_BASE`** in Project → Settings → Environment Variables.
4. Deploy.

Netlify and Cloudflare Pages work identically (build `npm run build`, publish `dist`, same env var).

---

### Notes
- **CORS:** plain `<video>` / `<img>` / CSS-background loading from R2 needs no CORS config. Only add an R2 CORS rule if you later fetch media via JS.
- **Caching:** R2 public URLs are already CDN-cached by Cloudflare. Videos are content-hashed by filename, so long cache lifetimes are safe.
- **Custom domain:** pointing `media.cizaro.com` at the bucket (instead of `r2.dev`) is cleaner and lets you swap providers later without touching the app — just change `VITE_MEDIA_BASE`.
