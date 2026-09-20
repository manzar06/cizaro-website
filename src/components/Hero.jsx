import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BorderBeam } from 'border-beam'
import { ThinkingOrb } from 'thinking-orbs'
import { HERO } from '../data.js'
import EditTimeline from './EditTimeline.jsx'

function useTimecode() {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 1000 / 24)
    return () => clearInterval(id)
  }, [])
  const totalSeconds = Math.floor(frame / 24)
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const ss = String(totalSeconds % 60).padStart(2, '0')
  const ff = String(frame % 24).padStart(2, '0')
  return `${hh}:${mm}:${ss}:${ff}`
}

export default function Hero() {
  const timecode = useTimecode()

  return (
    <header className="hero" id="top">
      <div className="hero-bg" />
      <div className="hero-top">
        <span className="rec"><span className="dot" />Recording</span>
        <span>{HERO.kicker}</span>
        <span className="hero-tc">
          <ThinkingOrb state="working" size={20} theme="dark" aria-label="Editing in progress" />
          {timecode}
        </span>
      </div>

      <div className="hero-titles">
        {HERO.lines.map((line, i) => (
          <div className="hero-title-line" key={line}>
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.span>
          </div>
        ))}
      </div>

      <div className="hero-bottom">
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {HERO.sub}
        </motion.p>
        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          <BorderBeam size="pulse-outside" colorVariant="sunset" theme="dark" strength={0.9} staticColors duration={2.6} className="beam-wrap">
            <a href={HERO.cta.href} className="btn btn-solid">{HERO.cta.label}</a>
          </BorderBeam>
          <a href={HERO.cta2.href} className="btn btn-outline">{HERO.cta2.label}</a>
        </motion.div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <span className="line" />
      </div>

      <EditTimeline />
    </header>
  )
}
