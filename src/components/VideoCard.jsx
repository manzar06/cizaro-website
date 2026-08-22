import { useRef } from 'react'
import { CATEGORIES } from '../data.js'

export default function VideoCard({ item, onOpen }) {
  const videoRef = useRef(null)
  const catLabel = CATEGORIES.find((c) => c.key === item.category)?.label ?? item.category

  const play = () => {
    const v = videoRef.current
    if (!v) return
    if (!v.src) v.src = item.src
    v.play().catch(() => {})
  }
  const stop = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <div
      className="video-card"
      onMouseEnter={play}
      onMouseLeave={stop}
      onClick={() => onOpen({ title: item.title, src: item.src })}
      data-cursor="View"
    >
      <img className="poster" src={item.poster} alt="" loading="lazy" />
      <video ref={videoRef} muted loop playsInline preload="none" />
      <div className="video-card-overlay">
        <span className="video-card-cat">{catLabel}</span>
        <span className="video-card-title">{item.title}</span>
      </div>
    </div>
  )
}
