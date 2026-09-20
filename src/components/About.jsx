import { useEffect, useRef, useState } from 'react'
import { motion, animate } from 'framer-motion'
import { BorderBeam } from 'border-beam'
import { STATS, TOOLS } from '../data.js'

/* software marks so the tools row reads as real logos, not plain text */
const LOGO = {
  'Adobe Premiere Pro': { mark: 'Pr', bg: '#2b0a3d', fg: '#e59cff' },
  'Adobe After Effects': { mark: 'Ae', bg: '#000a4d', fg: '#9a9dff' },
  'CapCut Pro': { mark: 'CC', bg: '#101014', fg: '#25f4ee' },
}

const EASE = [0.22, 1, 0.36, 1]

/* count-up that reliably fires on mobile too: plain IntersectionObserver +
   framer animate(), with a reduced-motion fallback that jumps to the value */
function Counter({ value }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let controls
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        if (reduce) {
          setDisplay(value)
          return
        }
        controls = animate(0, value, {
          duration: 1.5,
          ease: EASE,
          onUpdate: (v) => setDisplay(Math.round(v)),
        })
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      controls?.stop()
    }
  }, [value])

  return <span ref={ref}>{display}</span>
}

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
}

export default function About() {
  return (
    <section className="section" id="about">
      <div className="eyebrow">About</div>
      <div className="about-grid" style={{ marginTop: 28 }}>
        <div>
          <motion.h2 className="about-bio" {...reveal} transition={{ duration: 0.7, ease: EASE }}>
            Editing is <span className="muted">pacing.</span> I cut for the
            second-by-second decision to keep watching, not just the highlight reel.
          </motion.h2>
          <motion.p
            className="about-detail"
            {...reveal}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            Freelance video editor with 4+ years of experience turning raw footage
            into compelling visual narratives for YouTubers, brands and content
            creators across gaming, finance, cash cow, faceless, short-form and
            documentary formats.
          </motion.p>
          <div className="tools-row">
            {TOOLS.map((t, i) => {
              const l = LOGO[t.name] || { mark: t.name.slice(0, 2), bg: '#1b1b20', fg: '#f5f5f0' }
              return (
                <motion.span
                  className="tool-chip"
                  key={t.name}
                  {...reveal}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
                >
                  <span className="tool-logo" style={{ '--lb': l.bg, '--lf': l.fg }}>{l.mark}</span>
                  <b>{t.name}</b> · {t.tag}
                </motion.span>
              )
            })}
          </div>
        </div>

        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          {STATS.map((s) => (
            <BorderBeam
              key={s.label}
              size="pulse-inner"
              colorVariant="mono"
              theme="dark"
              strength={0.55}
              duration={3.4}
              className="beam-card"
            >
              <div className="stat-card">
                <div className="stat-value">
                  <Counter value={s.value} /><span className="accent">{s.suffix}</span>
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            </BorderBeam>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
