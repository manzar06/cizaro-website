import { useRef, useState } from 'react'
import { BorderBeam } from 'border-beam'
import { CATEGORIES } from '../data.js'

export default function VideoCard({ item, onOpen }) {
  const videoRef = useRef(null)
  const catLabel = CATEGORIES.find((c) => c.key === item.category)?.label ?? item.category

  const [hover, setHover] = useState(false)

  const play = () => {
    setHover(true)
    const v = videoRef.current
    if (!v) return
    if (!v.src) v.src = item.src
    v.play().catch(() => {})
  }
  const stop = () => {
    setHover(false)
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <BorderBeam
      size="line"
      colorVariant="sunset"
      theme="dark"
      strength={1}
      brightness={1.8}
      staticColors
      active={hover}
      className="beam-card beam-card--clip"
    >
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
    </BorderBeam>
  )
}
