import { useState } from 'react'
import Cursor from './components/Cursor.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Featured from './components/Featured.jsx'
import Showcase from './components/Showcase.jsx'
import Lightbox from './components/Lightbox.jsx'
import Testimonials from './components/Testimonials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { NICHES } from './data.js'

function App() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <>
      <div className="grain" />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee items={NICHES} />
      <Featured onOpen={setLightbox} />
      <Showcase onOpen={setLightbox} />
      <About />
      <Services onOpen={setLightbox} />
      <Testimonials onOpen={setLightbox} />
      <Contact />
      <Footer />
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </>
  )
}

export default App
