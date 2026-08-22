import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES, VIDEOS } from '../data.js'
import VideoCard from './VideoCard.jsx'

// Group every category's clips once. Each category is one editorial accordion
// row with an oversized type header that expands to reveal its clips.
const GROUPS = CATEGORIES.map((c) => ({
  ...c,
  clips: VIDEOS.filter((v) => v.category === c.key),
})).filter((g) => g.clips.length > 0)

const EASE = [0.22, 1, 0.36, 1]

export default function Showcase({ onOpen }) {
  const [open, setOpen] = useState(null)

  return (
    <section className="section" id="work-grid" style={{ paddingTop: 0 }}>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <div>
          <div className="eyebrow">The Vault</div>
          <h2 className="section-title">Browse by Format</h2>
        </div>
        <p className="section-note">
          Every format is a drawer. Open one to play the clips inside.
        </p>
      </div>

      <div className="vault">
        {GROUPS.map((g, i) => {
          const isOpen = open === g.key
          const isVertical = g.key === 'shorts'
          return (
            <motion.div
              key={g.key}
              className={`vault-row${isOpen ? ' open' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
            >
              <button
                type="button"
                className="vault-head"
                onClick={() => setOpen(isOpen ? null : g.key)}
                data-cursor={isOpen ? 'Close' : 'Open'}
                aria-expanded={isOpen}
              >
                <img className="vault-bg" src={g.clips[0].poster} alt="" loading="lazy" />
                <span className="vault-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="vault-name">{g.label}</span>
                <span className="vault-count">{g.clips.length} clip{g.clips.length > 1 ? 's' : ''}</span>
                <span className="vault-toggle" aria-hidden="true">+</span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="clips"
                    className="vault-clips-wrap"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <div className={`vault-clips${isVertical ? ' is-vertical' : ''}`}>
                      {g.clips.map((clip) => (
                        <VideoCard key={`${clip.category}-${clip.slug}`} item={clip} onOpen={onOpen} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
