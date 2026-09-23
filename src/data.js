export const BRAND = 'CIZARO'

/* Base URL for all /media assets. Empty in dev (served from /public/media by
   Vite); in production set VITE_MEDIA_BASE to the Cloudflare R2 public URL,
   e.g. VITE_MEDIA_BASE="https://media.cizaro.com" — then every clip, poster
   and filmstrip loads from R2 with a single config change. No trailing slash. */
export const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE ?? '').replace(/\/$/, '')
export const media = (path) => `${MEDIA_BASE}${path}`

export const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]

export const HERO = {
  kicker: 'Freelance video editor',
  lines: ['CUTS THAT', 'KEEP THEM', 'WATCHING'],
  sub: {
    name: 'Kunal',
    lead: '4+ years turning raw footage into videos people',
    punch: "can't scroll past.",
    niches: ['Gaming', 'Finance', 'Documentary', 'Faceless', 'Shorts'],
  },
  cta: { label: 'See the work', href: '#work' },
  cta2: { label: 'Book a slot', href: '#contact' },
}

export const STATS = [
  { value: 500, suffix: 'K+', label: 'TikTok views generated' },
  { value: 20, suffix: '%', label: 'Avg. Instagram follower growth' },
  { value: 4, suffix: '+', label: 'Years cutting professionally' },
  { value: 24, suffix: 'hr', label: 'Typical response time' },
]

export const NICHES = [
  'Gaming', 'Finance', 'Cash Cow', 'Faceless', 'Short-Form', 'Documentary',
]

export const TOOLS = [
  { name: 'Adobe Premiere Pro', tag: 'Editing' },
  { name: 'Adobe After Effects', tag: 'Motion & VFX' },
  { name: 'CapCut Pro', tag: 'Short-form' },
  { name: 'Filmora', tag: 'Editing' },
]

export const SERVICES = [
  {
    title: 'Editing & Transitions',
    desc: 'Clean cuts, pacing, sound design and transitions built to hold retention from frame one.',
    tag: '01',
    video: media('/media/gaming/cod-montage-1.mp4'),
    poster: media('/media/gaming/cod-montage-1.jpg'),
  },
  {
    title: 'Motion Graphics',
    desc: 'Kinetic titles, lower-thirds and animated overlays that make information pop.',
    tag: '02',
    video: media('/media/trailers/mfm-trailer.mp4'),
    poster: media('/media/trailers/mfm-trailer.jpg'),
  },
  {
    title: '3D Animation & VFX',
    desc: 'Custom 3D elements, particle effects and compositing for scroll-stopping moments.',
    tag: '03',
    video: media('/media/vfx/3d-phone-vfx.mp4'),
    poster: media('/media/vfx/3d-phone-vfx.jpg'),
  },
  {
    title: 'Color Correction & Grading',
    desc: 'Consistent, cinematic color that matches your brand across every deliverable.',
    tag: '04',
    video: media('/media/colorgrade/cc-1.mp4'),
    poster: media('/media/colorgrade/cc-1.jpg'),
  },
]

export const FEATURED = [
  {
    client: 'Zwiggo',
    niche: 'Gaming / Storytelling',
    blurb: '"The Top 10 Pokemon Rom Hacks And Fangames Of 2024." A countdown-style edit built around hooks, pacing and payoff, not just kills.',
    category: 'featured',
    slug: 'zwiggo-top10-pokemon-romhacks',
  },
  {
    client: 'Dan Limb',
    niche: 'Business Documentary',
    blurb: '"How They Did It: Patrick Bet-David." A business biography built on a host-led script, archival B-roll, kinetic captions and animated graphics that turn a life story into lessons.',
    category: 'longform',
    slug: 'documentary-style',
  },
  {
    client: 'Loos',
    niche: 'Documentary / Explainer',
    blurb: '"Why Lazarus Failed." Long-form video-essay editing with motion graphics, archival cutaways and a narrative that holds the whole runtime.',
    category: 'featured',
    slug: 'loos-why-lazarus-failed',
  },
]

export const CATEGORIES = [
  { key: 'longform', label: 'Long Form' },
  { key: 'shorts', label: 'Shorts & TikTok' },
  { key: 'gaming', label: 'Gaming Montages' },
  { key: 'trailers', label: 'Trailers & Hype' },
  { key: 'amv', label: 'AMV' },
  { key: 'anime', label: 'Anime' },
  { key: 'vfx', label: 'VFX' },
  { key: 'colorgrade', label: 'Color Grading' },
]

export const VIDEOS = [
  { category: 'longform', slug: 'documentary-style', title: 'How They Did It: Patrick Bet-David' },
  { category: 'longform', slug: 'gaming-video', title: 'Roblox Commentary' },
  { category: 'longform', slug: 'cash-cow-style', title: 'Faceless Explainer: Star Wars' },

  { category: 'shorts', slug: 'hype-teaser', title: 'Brand Hype Teaser' },
  { category: 'shorts', slug: 'freestyle-rap', title: 'Street Interview: Freestyle' },
  { category: 'shorts', slug: 'kobe-motivational', title: 'Kobe Bryant Motivational' },
  { category: 'shorts', slug: 'football-trial', title: 'Football Funny Moments' },
  { category: 'shorts', slug: 'roobet', title: 'Stream Clip' },

  { category: 'gaming', slug: 'cod-montage-1', title: 'Call of Duty: Montage 1' },
  { category: 'gaming', slug: 'cod-montage-2', title: 'Call of Duty: Montage 2' },
  { category: 'gaming', slug: 'destiny-holy-smokes', title: 'Destiny 2: Holy Smokes' },
  { category: 'gaming', slug: 'destiny-wtf-sxmpra', title: 'Destiny 2: WTF SXMPRA' },
  { category: 'gaming', slug: 'wildrift-1', title: 'Wild Rift' },

  { category: 'trailers', slug: 'mfm-trailer', title: 'My First Million Podcast Trailer' },
  { category: 'trailers', slug: '1k-special', title: '1K Subscriber Special' },
  { category: 'trailers', slug: 'ayinde-trailer', title: 'Podcast Clip: The Calum Johnson Show' },
  { category: 'trailers', slug: 'steve-will-do-it', title: 'Podcast Clip: Steve WillDoIt Show' },

  { category: 'amv', slug: 'one-piece', title: 'One Piece' },
  { category: 'amv', slug: 'solo-leveling', title: 'Solo Leveling' },
  { category: 'amv', slug: 'jujutsu-kaisen', title: 'Jujutsu Kaisen' },
  { category: 'amv', slug: 'vinland-saga', title: 'Vinland Saga' },
  { category: 'amv', slug: 'zenitsu', title: 'Zenitsu' },

  { category: 'anime', slug: 'best-anime-you-forgot', title: 'Video Essay: The Best Anime You Forgot' },
  { category: 'anime', slug: 'best-of-anime-2025', title: 'Best of Anime 2025 (40 min)' },

  { category: 'vfx', slug: '3d-phone-vfx', title: 'Screen Replacement VFX' },

  { category: 'colorgrade', slug: 'cc-1', title: 'Color Correction 1' },
  { category: 'colorgrade', slug: 'cc-2', title: 'Color Correction 2' },
  { category: 'colorgrade', slug: 'cc-3', title: 'Color Correction 3' },
].map((v) => ({
  ...v,
  src: media(`/media/${v.category}/${v.slug}.mp4`),
  poster: media(`/media/${v.category}/${v.slug}.jpg`),
}))

export const TESTIMONIALS = ['t1', 't2', 't3', 't4', 't5', 't6', 't7'].map((slug) => ({
  slug,
  src: media(`/media/testimonials/${slug}.jpg`),
}))

export const CONTACT = {
  email: 'cizaroamv@gmail.com',
  instagram: { handle: '@ig_cizaro', href: 'https://www.instagram.com/ig_cizaro/' },
  discord: { handle: 'cizaro', href: 'https://discord.com/users/443816307385696256' },
  rate: '$20/hr',
  turnaround: '~1 week turnaround',
  response: '24hr response time',
  availability: 'Open for new projects',
  stats: [
    { value: '$20', unit: '/hr', label: 'Rate' },
    { value: '~1', unit: 'wk', label: 'Turnaround' },
    { value: '24', unit: 'hr', label: 'Response' },
  ],
}
