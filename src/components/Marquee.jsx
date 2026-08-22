export default function Marquee({ items, reverse = false, filled = false }) {
  const doubled = [...items, ...items]
  return (
    <div className={`marquee-strip${reverse ? ' reverse' : ''}`}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className={`marquee-item${filled ? ' filled' : ''}`} key={i}>
            {item}
            <span className="sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
