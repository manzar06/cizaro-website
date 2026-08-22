import { useState } from 'react'
import { TESTIMONIALS } from '../data.js'

export default function Testimonials({ onOpen }) {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]
  const [paused, setPaused] = useState(false)

  return (
    <section className="section" id="reviews">
      <div className="section-head">
        <div>
          <div className="eyebrow">Reviews</div>
          <h2 className="section-title">Client Word</h2>
        </div>
        <p className="section-note">Screenshots straight from the DMs. Click one to read it in full.</p>
      </div>
      <div
        className="testimonial-track-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`testimonial-track${paused ? ' paused' : ''}`}>
          {doubled.map((t, i) => (
            <div
              className="testimonial-card"
              key={i}
              onClick={() => onOpen({ type: 'image', src: t.src, title: 'Client testimonial' })}
              data-cursor="Read"
            >
              <img src={t.src} alt="Client testimonial" loading="lazy" />
              <span className="testimonial-hint">Read ↗</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
