import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, BRAND, CONTACT } from '../data.js'

const EASE = [0.22, 1, 0.36, 1]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // never let the mobile overlay linger if the viewport grows to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}${open ? ' menu-open' : ''}`}>
        <a href="#top" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="dot" />
          {BRAND}
        </a>
        <ul className="nav-links">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="nav-cta">Let&apos;s talk</a>
        <button
          type="button"
          className={`nav-burger${open ? ' open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <motion.ul
              className="mm-list"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.14 } } }}
            >
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <a className="mm-link" href={item.href} onClick={() => setOpen(false)}>
                    <span className="mm-index">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="mm-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.42, duration: 0.4 }}
            >
              <a href={`mailto:${CONTACT.email}`} onClick={() => setOpen(false)}>Email</a>
              <a href={CONTACT.instagram.href} target="_blank" rel="noreferrer">Instagram</a>
              <a href={CONTACT.discord.href} target="_blank" rel="noreferrer">Discord</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
