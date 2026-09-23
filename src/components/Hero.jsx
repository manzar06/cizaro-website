import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BorderBeam } from 'border-beam'
import { ThinkingOrb } from 'thinking-orbs'
import { HERO } from '../data.js'
import EditTimeline from './EditTimeline.jsx'

gsap.registerPlugin(SplitText, ScrollTrigger)

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

// Headline: letters assemble on load, hop on hover (fine pointers only), and the
// hero copy drifts up and fades as you scroll away. The CSS rise-in on
// .hero-titles is the no-JS fallback and is switched off once this runs.
function useHeadline(heroRef, titlesRef) {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hero = heroRef.current
    const titles = titlesRef.current
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const ctx = gsap.context(() => {
      titles.classList.add('is-split')
      titles.querySelectorAll('.hero-title-text').forEach((el, lineIdx) => {
        SplitText.create(el, {
          type: 'chars',
          charsClass: 'hero-char',
          autoSplit: true,
          onSplit(self) {
            // the gradient line: give each letter its slice of one shared gradient
            // (measured again after layout + fonts settle; a 0 width would hide the text)
            if (el.classList.contains('is-grad')) {
              const paint = () => {
                const w = el.getBoundingClientRect().width
                if (!w) return
                self.chars.forEach((c) => {
                  c.style.backgroundSize = `${w}px 100%`
                  c.style.backgroundPosition = `${-c.offsetLeft}px 0`
                })
              }
              paint()
              requestAnimationFrame(paint)
              document.fonts?.ready.then(paint)
            }
            if (canHover) {
              self.chars.forEach((c) => {
                const rest = getComputedStyle(c).color
                c.addEventListener('mouseenter', () => {
                  gsap.to(c, { y: -18, color: accent, webkitTextStrokeColor: accent, duration: 0.25, ease: 'power3.out', overwrite: 'auto' })
                })
                c.addEventListener('mouseleave', () => {
                  gsap.to(c, { y: 0, color: rest, webkitTextStrokeColor: '', duration: 1, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' })
                })
              })
            }
            return gsap.from(self.chars, {
              opacity: 0,
              yPercent: 70,
              rotateX: -80,
              transformOrigin: '50% 100%',
              duration: 0.9,
              ease: 'expo.out',
              stagger: 0.02,
              delay: 0.15 + lineIdx * 0.12,
            })
          },
        })
      })

      gsap.to(hero.querySelectorAll('.hero-top, .hero-titles, .hero-bottom'), {
        y: -90,
        opacity: 0.18,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, hero)

    return () => {
      ctx.revert()
      titles.classList.remove('is-split')
    }
  }, [heroRef, titlesRef])
}

export default function Hero() {
  const timecode = useTimecode()
  const heroRef = useRef(null)
  const titlesRef = useRef(null)
  useHeadline(heroRef, titlesRef)

  return (
    <header className="hero" id="top" ref={heroRef}>
      <div className="hero-bg" />
      <div className="hero-top">
        <span className="rec"><span className="dot" />Recording</span>
        <span>{HERO.kicker}</span>
        <span className="hero-tc">
          <ThinkingOrb state="working" size={20} theme="dark" aria-label="Editing in progress" />
          {timecode}
        </span>
      </div>

      <h1 className="hero-titles" ref={titlesRef} aria-label={HERO.lines.join(' ')}>
        {HERO.lines.map((line, i) => (
          <div className="hero-title-line" key={line} aria-hidden="true">
            <span className={`hero-title-text${i === 2 ? ' is-grad' : ''}`}>{line}</span>
          </div>
        ))}
      </h1>

      <div className="hero-bottom">
        <motion.div
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <p className="hs-intro">
            <span className="hs-hi">Hi, I&apos;m</span> <em className="hs-name">{HERO.sub.name}.</em>
          </p>
          <p className="hs-lead">
            {HERO.sub.lead} <em className="hs-punch">{HERO.sub.punch}</em>
          </p>
          <ul className="hs-niches">
            {HERO.sub.niches.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </motion.div>
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
