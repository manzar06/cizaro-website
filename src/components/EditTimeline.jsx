import { useEffect, useRef, useState, memo } from 'react'
import { motion } from 'framer-motion'

import { media } from '../data.js'

/* ---- real filmstrip assets (1600x90, tiled as background-repeat:repeat-x) ---- */
const BASE = media('/media/strips/')
const S = {
  mfm: { f: 'trailers__mfm-trailer.jpg', n: 'mfm_trailer.mp4' },
  onek: { f: 'trailers__1k-special.jpg', n: '1k_special.mp4' },
  vfx: { f: 'vfx__3d-phone-vfx.jpg', n: '3d_phone_vfx.mp4' },
  onepiece: { f: 'amv__one-piece.jpg', n: 'one_piece_amv.mp4' },
  solo: { f: 'amv__solo-leveling.jpg', n: 'solo_leveling.mp4' },
  jjk: { f: 'amv__jujutsu-kaisen.jpg', n: 'jjk_amv.mp4' },
  cod: { f: 'gaming__cod-montage-1.jpg', n: 'cod_montage_01.mp4' },
  destiny: { f: 'gaming__destiny-holy-smokes.jpg', n: 'destiny_hs.mp4' },
  wildrift: { f: 'gaming__wildrift-1.jpg', n: 'wildrift_01.mp4' },
  doc: { f: 'longform__documentary-style.jpg', n: 'documentary_v3.mp4' },
  gamingvid: { f: 'longform__gaming-video.jpg', n: 'gaming_long.mp4' },
  cashcow: { f: 'longform__cash-cow-style.jpg', n: 'cashcow.mp4' },
  zwiggo: { f: 'featured__zwiggo-top10-pokemon-romhacks.jpg', n: 'zwiggo_top10.mp4' },
  loos: { f: 'featured__loos-why-lazarus-failed.jpg', n: 'loos_lazarus.mp4' },
  freestyle: { f: 'shorts__freestyle-rap.jpg', n: 'freestyle_rap.mp4' },
  football: { f: 'shorts__football-trial.jpg', n: 'football.mp4' },
}

/* NLE-style muted label colors */
const LBL = {
  caribbean: '#3f9e8f',
  iris: '#6f6fc0',
  forest: '#4a7a4a',
  lavender: '#a58fc0',
  mango: '#c0913f',
  rose: '#b06a7a',
  cerulean: '#5a9bd4',
}

/* seeded PRNG so ragged widths/frames are stable across renders */
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const WIDTHS = [240, 320, 280, 400, 340, 460, 300, 500, 360, 420] // bigger clips → cleaner, less crowded
const GAP = 6
const TARGET = 3200 // per-set width; must exceed widest lane viewport so the -50% loop never gaps

function fmtDur(w) {
  const secs = Math.max(3, Math.round(w / 8))
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  return `00:${mm}:${ss}`
}

function buildVideoLane(strips, label, seed) {
  const rnd = mulberry32(seed)
  const clips = []
  let total = 0
  while (total < TARGET) {
    const w = WIDTHS[Math.floor(rnd() * WIDTHS.length)]
    const s = strips[Math.floor(rnd() * strips.length)]
    const offset = -Math.floor(rnd() * 240 + 30)
    clips.push({ w, file: BASE + s.f, name: s.n, offset, dur: fmtDur(w), label: LBL[label] })
    total += w + GAP
  }
  return clips
}

function wavePath(w, rnd) {
  const H = 42
  const cy = H / 2
  const step = 4
  const n = Math.floor(w / step)
  const top = []
  const bot = []
  for (let i = 0; i <= n; i++) {
    const x = i * step
    const env = 0.32 + 0.68 * Math.sin((i / n) * Math.PI) // loud middle, quiet ends
    const amp = env * (0.45 + rnd() * 0.95) * (H * 0.46)
    top.push(`${x},${(cy - amp).toFixed(1)}`)
    bot.push(`${x},${(cy + amp).toFixed(1)}`)
  }
  return `M${top.join(' L')} L${bot.reverse().join(' L')} Z`
}

const AUDIO_W = [320, 420, 520, 380, 560, 300, 460]
function buildAudioLane(label, seed) {
  const rnd = mulberry32(seed)
  const clips = []
  let total = 0
  while (total < TARGET) {
    const w = AUDIO_W[Math.floor(rnd() * AUDIO_W.length)]
    clips.push({ w, label: LBL[label], path: wavePath(w, rnd) })
    total += w + GAP
  }
  return clips
}

/* lane config, built ONCE at module scope. Large 5-video + 3-audio ribbon
   featuring only the HIGH-IMPACT work — Lazarus (loos), Zwiggo, the anime AMVs,
   gaming montages and hype trailers. Talking-head / weaker clips left out. */
const VIDEO_LANES = [
  { id: 'V5', depth: 'depth3', dur: '96s', delay: '-5s', reverse: false, clips: buildVideoLane([S.mfm, S.onek, S.vfx], 'mango', 41) },
  { id: 'V4', depth: 'depth3', dur: '88s', delay: '-12s', reverse: true, clips: buildVideoLane([S.onepiece, S.solo, S.jjk], 'iris', 42) },
  { id: 'V3', depth: 'depth2', dur: '78s', delay: '-7s', reverse: false, clips: buildVideoLane([S.cod, S.destiny, S.wildrift], 'cerulean', 43) },
  { id: 'V2', depth: 'depth1', dur: '70s', delay: '-14s', reverse: true, clips: buildVideoLane([S.zwiggo, S.loos], 'caribbean', 44) },
  { id: 'V1', depth: 'focus', dur: '60s', delay: '-3s', reverse: false, clips: buildVideoLane([S.loos, S.zwiggo, S.onepiece, S.cod], 'mango', 45) },
]
const AUDIO_LANES = [
  { id: 'A1', depth: 'focus', dur: '66s', delay: '0s', reverse: false, clips: buildAudioLane('lavender', 51) },
  { id: 'A2', depth: 'depth1', dur: '80s', delay: '-9s', reverse: true, clips: buildAudioLane('rose', 52) },
  { id: 'A3', depth: 'depth2', dur: '92s', delay: '-16s', reverse: false, clips: buildAudioLane('mango', 53) },
]

/* ruler ticks */
const TICKS = Array.from({ length: 68 }, (_, i) => {
  const major = i % 5 === 0
  const sec = (i / 5) * 4
  const mm = String(Math.floor(sec / 60)).padStart(2, '0')
  const ss = String(Math.round(sec % 60)).padStart(2, '0')
  return { major, tc: `00:${mm}:${ss}:00` }
})

function VideoLane({ lane }) {
  const doubled = [...lane.clips, ...lane.clips]
  return (
    <div className={`lane lane--video lane--${lane.depth}`} style={{ '--h': '84px' }}>
      <div
        className="lane-track"
        style={{ animationDuration: lane.dur, animationDelay: lane.delay, animationDirection: lane.reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((c, i) => (
          <div
            className="clip clip--video"
            key={i}
            style={{ '--w': `${c.w}px`, '--label': c.label, backgroundImage: `url(${c.file})`, backgroundPositionX: `${c.offset}px` }}
          >
            <span className="clip-strip-seams" />
            <span className="clip-name">{c.name}</span>
            <span className="clip-dur">{c.dur}</span>
          </div>
        ))}
      </div>
      <span className="lane-gutter">{lane.id}</span>
    </div>
  )
}

function AudioLane({ lane }) {
  const doubled = [...lane.clips, ...lane.clips]
  return (
    <div className={`lane lane--audio lane--${lane.depth}`} style={{ '--h': '58px' }}>
      <div
        className="lane-track"
        style={{ animationDuration: lane.dur, animationDelay: lane.delay, animationDirection: lane.reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((c, i) => (
          <div className="clip clip--audio" key={i} style={{ '--w': `${c.w}px`, '--label': c.label }}>
            <svg className="wf" viewBox={`0 0 ${c.w} 42`} preserveAspectRatio="none">
              <path d={c.path} />
            </svg>
          </div>
        ))}
      </div>
      <span className="lane-gutter">{lane.id}</span>
    </div>
  )
}

/* live timecode readout, isolated so its 24fps updates never re-render the heavy ribbon.
   `active` gates the interval so it stops ticking (and re-rendering) when off-screen. */
function RulerClock({ active }) {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => setFrame((f) => f + 1), 1000 / 24)
    return () => clearInterval(id)
  }, [active])
  const s = Math.floor(frame / 24)
  const tc = `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(frame % 24).padStart(2, '0')}`
  return <div className="ruler-readout">{tc}</div>
}

const Lanes = memo(function Lanes() {
  return (
    <div className="ribbon-lanes">
      {VIDEO_LANES.map((l) => (
        <VideoLane lane={l} key={l.id} />
      ))}
      <div className="lane-split" />
      {AUDIO_LANES.map((l) => (
        <AudioLane lane={l} key={l.id} />
      ))}
    </div>
  )
})

export default function EditTimeline() {
  const ref = useRef(null)
  const [inView, setInView] = useState(true)

  // pause the marquees + timecode when the hero is scrolled out of view, so the
  // heaviest animation on the page isn't burning the compositor off-screen
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      className={`ribbon${inView ? '' : ' ribbon--paused'}`}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
    >
      <div className="ribbon-plane">
        <div className="ribbon-ruler">
          {TICKS.map((t, i) =>
            t.major ? (
              <i className="tick tick--major" key={i}>
                <span>{t.tc}</span>
              </i>
            ) : (
              <i className="tick" key={i} />
            ),
          )}
          <RulerClock active={inView} />
        </div>
        <Lanes />
        <div className="ribbon-playhead" />
        <div className="ribbon-bloom" />
      </div>
      <div className="ribbon-orbs" />
      <div className="ribbon-grain" />
      <div className="ribbon-vignette" />
      <div className="ribbon-scrim" />
    </motion.div>
  )
}
