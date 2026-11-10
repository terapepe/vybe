import { useEffect, useState } from 'react'
import { accent, accent2 } from './config/chains'
import { Footer, Nav } from './components/ui'
import { Home } from './pages/Home'
import { Docs } from './pages/Docs'

const parse = () => {
  const [, page = '', section = ''] = (window.location.hash || '#/').replace(/^#/, '').split('/')
  return { page: page === 'docs' ? 'docs' : 'home', section } as const
}

export default function App() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useEffect(() => { if (route.page === 'home') window.scrollTo({ top: 0 }) }, [route.page])
  return (
    <div className="app" style={{ ['--accent' as string]: accent, ['--accent2' as string]: accent2 }}>
      <div className="aura" aria-hidden />
      <Nav page={route.page} />
      {route.page === 'docs' ? <Docs section={route.section} /> : <Home />}
      <Footer />
    </div>
  )
}
