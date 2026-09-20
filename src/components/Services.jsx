import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BorderBeam } from 'border-beam'
import { SERVICES } from '../data.js'

function ServiceCard({ s, i, onOpen }) {
  const videoRef = useRef(null)
  const [hover, setHover] = useState(false)

  const enter = () => {
    setHover(true)
    const v = videoRef.current
    if (!v) return
    if (!v.src) v.src = s.video // lazy-load the file only on first hover
    v.play().catch(() => {})
  }
  const leave = () => {
    setHover(false)
    const v = videoRef.current
    if (!v) return
    v.pause()
  }

  return (
    <BorderBeam
      size="md"
      colorVariant="sunset"
      theme="dark"
      strength={1}
      brightness={1.8}
      staticColors
      active={hover}
      className="beam-card"
    >
    <motion.div
      className="service-card"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={() => onOpen && onOpen({ title: s.title, src: s.video })}
      data-cursor="Watch"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' && onOpen) onOpen({ title: s.title, src: s.video }) }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
    >
      <div className="service-media">
        <img className="service-poster" src={s.poster} alt="" loading="lazy" />
        <video ref={videoRef} muted loop playsInline preload="none" poster={s.poster} />
        <div className="service-media-scrim" />
      </div>
      <span className="service-tag">{s.tag}</span>
      <div className="service-body">
        <h3 className="service-title">{s.title}</h3>
        <p className="service-desc">{s.desc}</p>
      </div>
    </motion.div>
    </BorderBeam>
  )
}

export default function Services({ onOpen }) {
  return (
    <section className="section" id="services">
      <div className="section-head">
        <div>
          <div className="eyebrow">Services</div>
          <h2 className="section-title">What I Cut</h2>
        </div>
        <p className="section-note">
          From a clean pass to a fully animated, color-graded package. Pick what
          your project needs. Hover any card to preview the work.
        </p>
      </div>
      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <ServiceCard s={s} i={i} key={s.title} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
