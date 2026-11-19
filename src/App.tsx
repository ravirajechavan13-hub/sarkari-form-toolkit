import { useEffect, useState } from 'react'
import { Footer, Header, Home, InfoDialog, type InfoPage } from './components/SiteLayout'
import { Workbench } from './components/Workbench'
import { tools } from './data'

export default function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1))
  const [info, setInfo] = useState<InfoPage>(null)
  const current = tools.find((tool) => route === `tool/${tool.id}`)

  useEffect(() => {
    const navigate = () => {
      setRoute(window.location.hash.slice(1))
      setInfo(null)
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])

  useEffect(() => {
    document.title = current
      ? `${current.name} | Sarkari Form ToolKit`
      : 'Sarkari Form ToolKit | Your Application Companion'
    const frame = requestAnimationFrame(() => {
      if (route === 'tools')
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [route, current])

  return (
    <div id="home" className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          const main = document.getElementById('main-content')
          main?.setAttribute('tabindex', '-1')
          main?.focus()
        }}
      >
        Skip to content
      </a>
      <Header active={current?.id ?? null} onInfo={setInfo} />
      {current ? <Workbench key={current.id} tool={current} /> : <Home onInfo={setInfo} />}
      <Footer onInfo={setInfo} />
      {info && <InfoDialog page={info} onClose={() => setInfo(null)} />}
    </div>
  )
}
