import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let raf = null
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      const pct = max > 0 ? (scrollTop / max) * 100 : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`
      raf = null
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="scrub-rail" aria-hidden="true">
      <div className="scrub-fill" ref={barRef} />
    </div>
  )
}
