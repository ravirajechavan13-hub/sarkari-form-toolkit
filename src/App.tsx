import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Footer, Header, Home, InfoDialog, type InfoPage } from './components/SiteLayout'
import { Workbench } from './components/Workbench'
import { tools } from './data'
import { applySeo } from './utils/seo'

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const [info, setInfo] = useState<InfoPage>(null)

  const pathname = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '')
  const toolMatch = pathname.match(/^\/tool\/([^/]+)$/)
  const activeToolId = toolMatch ? decodeURIComponent(toolMatch[1]) : null
  const current = activeToolId ? tools.find((tool) => tool.id === activeToolId) : undefined

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.startsWith('#')) {
      const raw = hash.slice(1).replace(/^\/+/, '')
      if (raw === 'tools') {
        navigate('/tools', { replace: true })
      } else if (raw.startsWith('tool/')) {
        navigate(`/${raw}`, { replace: true })
      } else if (raw === 'guides' || raw === 'application-guides') {
        navigate('/guides', { replace: true })
      } else if (raw === 'home' || raw === '') {
        navigate('/', { replace: true })
      }
    }
  }, [navigate])

  useEffect(() => {
    setInfo(null)
  }, [pathname])

  useEffect(() => {
    if (current) {
      const toolPath = `/tool/${current.id}`
      applySeo({
        title: `${current.name} | Sarkari Form ToolKit`,
        description: `${current.description || `${current.name} free online tool for exam forms and official documents.`} Private browser-based tool by Sarkari Form ToolKit.`,
        path: toolPath,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: `${current.name} - Sarkari Form ToolKit`,
          url: `https://photokb.online${toolPath}`,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        },
      })
    } else if (pathname === '/guides') {
      applySeo({
        title: 'Sarkari Yojana & Official Portals Guide | Sarkari Form ToolKit',
        description: 'Step-by-step application guides, required documents, and official portals for government schemes and exam forms.',
        path: '/guides',
      })
    } else if (pathname === '/tools') {
      applySeo({
        title: 'All Form & Document Tools | Sarkari Form ToolKit',
        description: 'Photo resizer, signature cropper, PDF compressor, document scanner, age calculator, and JPG/PDF converters for sarkari forms.',
        path: '/tools',
      })
    } else {
      applySeo({
        title: 'Sarkari Form ToolKit | Free Photo Resizer, PDF Compressor & Age Calculator',
        description: 'Free, private tools for government job applications. Resize exam photos and signatures, compress PDFs, clean document scans, and check age eligibility.',
        path: '/',
      })
    }

    const frame = requestAnimationFrame(() => {
      if (pathname === '/tools') {
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (pathname === '/guides') {
        document.getElementById('application-guides')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, current])

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
      {current ? (
        <Workbench key={current.id} tool={current} />
      ) : (
        <Home onInfo={setInfo} />
      )}
      <Footer onInfo={setInfo} />
      {info && <InfoDialog page={info} onClose={() => setInfo(null)} />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  )
}
