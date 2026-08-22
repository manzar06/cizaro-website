import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const move = (e) => {
      const t = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      if (dotRef.current) dotRef.current.style.transform = t
      if (ringRef.current) ringRef.current.style.transform = t
    }

    const onOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (!target || !ringRef.current) return
      ringRef.current.classList.add('play')
      ringRef.current.textContent = target.getAttribute('data-cursor')
    }
    const onOut = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (!target || !ringRef.current) return
      ringRef.current.classList.remove('play')
      ringRef.current.textContent = ''
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
