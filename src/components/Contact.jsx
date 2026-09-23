import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BorderBeam } from 'border-beam'
import { CONTACT } from '../data.js'

const EASE = [0.22, 1, 0.36, 1]

const GRAD = 'url(#cizGrad)'

/* one gradient def, referenced by every glyph via fill/stroke="url(#cizGrad)" */
function GradientDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="cizGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff3d2e" />
          <stop offset="55%" stopColor="#ff8a3d" />
          <stop offset="100%" stopColor="#ffc23d" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* --- brand glyphs used as the drifting background logo strips --- */
function MailGlyph() {
  return (
    <svg className="clg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4.5" width="20" height="15" rx="2.5" stroke={GRAD} strokeWidth="1.6" />
      <path d="M3 6.5l9 6.5 9-6.5" stroke={GRAD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function InstaGlyph() {
  return (
    <svg className="clg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke={GRAD} strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.6" stroke={GRAD} strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1.3" fill={GRAD} />
    </svg>
  )
}
function DiscordGlyph() {
  return (
    <svg className="clg" viewBox="0 0 24 24" fill={GRAD} aria-hidden="true">
      <path d="M20.317 4.3698a19.79 19.79 0 00-4.885-1.5152.074.074 0 00-.0785.037c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037A19.736 19.736 0 003.677 4.3698a.07.07 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.082.082 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.074.074 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.074.074 0 01.0785.0095c.1202.099.246.198.3728.2924a.077.077 0 01-.0066.1276 12.3 12.3 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  )
}

function LogoStrip({ reverse }) {
  // 8 repeats of the 3-glyph group; the marquee shifts -50%, so the first half
  // equals the second → seamless loop wide enough for ultrawide screens
  return (
    <div className={`contact-strip${reverse ? ' contact-strip--rev' : ''}`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <span className="contact-strip-group" key={i}>
          <MailGlyph />
          <InstaGlyph />
          <DiscordGlyph />
        </span>
      ))}
    </div>
  )
}

function ContactLink({ href, label, i, external }) {
  return (
    <motion.a
      className="contact-link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      data-cursor={external ? 'Open' : 'Email'}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: 0.08 * i, ease: EASE }}
    >
      <span className="cl-roll">
        <span className="cl-line">{label}</span>
        <span className="cl-line cl-line--dup" aria-hidden="true">{label}</span>
      </span>
      <span className="cl-arrow" aria-hidden="true">↗</span>
    </motion.a>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  // only animate the background logo strips while the section is on screen
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '160px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="section contact-wrap" id="contact" ref={ref}>
      <div className={`contact-bg${inView ? '' : ' contact-bg--paused'}`} aria-hidden="true">
        <GradientDefs />
        <LogoStrip />
        <LogoStrip reverse />
        <LogoStrip />
      </div>

      <div className="contact-inner">
        <div>
          <div className="eyebrow">Contact</div>
          <h2 className="contact-title" style={{ marginTop: 20 }}>
            LET&apos;S CUT<br />
            <span className="stroke">SOMETHING</span><br />
            <span className="accent">GREAT.</span>
          </h2>
        </div>

        <div className="contact-row">
          <div className="contact-links">
            <ContactLink i={0} href={`mailto:${CONTACT.email}`} label={CONTACT.email} />
            <ContactLink i={1} external href={CONTACT.instagram.href} label={`Instagram ${CONTACT.instagram.handle}`} />
            <ContactLink i={2} external href={CONTACT.discord.href} label={`Discord ${CONTACT.discord.handle}`} />
          </div>
          <BorderBeam size="pulse-inner" colorVariant="sunset" theme="dark" strength={0.9} staticColors duration={2.8} className="beam-card">
            <div className="avail-card">
              <div className="avail-status"><span className="dot" />{CONTACT.availability}</div>
              <dl className="avail-stats">
                {CONTACT.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd><b>{s.value}</b><span>{s.unit}</span></dd>
                  </div>
                ))}
              </dl>
            </div>
          </BorderBeam>
        </div>
      </div>
    </section>
  )
}
