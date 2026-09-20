import { useEffect, useState } from 'react'
import { ThinkingOrb } from 'thinking-orbs'
import { BorderBeam } from 'border-beam'

export default function Lightbox({ item, onClose }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!item) return
    setLoading(item.type !== 'image')
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div className="lightbox" onClick={onClose}>
      <div className={`lightbox-inner${item.type === 'image' ? ' is-image' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} data-cursor="Close">
          Close ✕
        </button>
        {item.type === 'image' ? (
          <img src={item.src} alt={item.title || ''} />
        ) : (
          <>
            <BorderBeam size="md" colorVariant="sunset" theme="dark" strength={0.75} staticColors className="beam-player">
              <video
                src={item.src}
                controls
                autoPlay
                playsInline
                onLoadedData={() => setLoading(false)}
                onWaiting={() => setLoading(true)}
                onPlaying={() => setLoading(false)}
              />
            </BorderBeam>
            {loading && (
              <div className="lightbox-loader" aria-live="polite">
                <ThinkingOrb state="working" size={64} theme="dark" aria-label="Loading the video" />
                <span>Loading</span>
              </div>
            )}
          </>
        )}
        {item.title && <span className="lightbox-title">{item.title}</span>}
      </div>
    </div>
  )
}
