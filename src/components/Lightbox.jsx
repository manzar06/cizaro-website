import { useEffect } from 'react'

export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
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
          <video src={item.src} controls autoPlay playsInline />
        )}
        {item.title && <span className="lightbox-title">{item.title}</span>}
      </div>
    </div>
  )
}
