import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FEATURED, media } from '../data.js'

export default function Featured({ onOpen }) {
  const [active, setActive] = useState(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const wrapRef = useRef(null)

  const handleMove = (e) => {
    setPos({ x: e.clientX + 24, y: e.clientY - 90 })
  }

  return (
    <section className="section" id="work" onMouseMove={handleMove} ref={wrapRef}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Featured Work</div>
          <h2 className="section-title">Selected Clients</h2>
        </div>
        <p className="section-note">
          Hover a name to preview. Click to watch it in full, right here. No drive links, no downloads.
        </p>
      </div>

      <div className="featured-list">
        {FEATURED.map((project, i) => (
          <motion.div
            className="featured-row"
            key={project.client}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onClick={() => onOpen({ title: project.client, src: media(`/media/${project.category}/${project.slug}.mp4`) })}
            data-cursor="Watch"
          >
            <span className="featured-index">0{i + 1}</span>
            <h3 className="featured-name">{project.client}</h3>
            <div className="featured-meta">
              <span className="featured-niche">{project.niche}</span>
              <span className="featured-blurb">{project.blurb}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {FEATURED.map((project, i) => (
        <div
          className={`featured-preview${active === i ? ' active' : ''}`}
          key={project.client}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        >
          {active === i && (
            <video
              src={media(`/media/${project.category}/${project.slug}.mp4`)}
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </div>
      ))}
    </section>
  )
}
