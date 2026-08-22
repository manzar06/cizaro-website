import { BRAND, CONTACT } from '../data.js'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <span>{BRAND} © {year}</span>
      <a className="back-top" href="#top" data-cursor="Top">Back to top ↑</a>
      <a href={CONTACT.instagram.href} target="_blank" rel="noreferrer">Instagram</a>
    </footer>
  )
}
