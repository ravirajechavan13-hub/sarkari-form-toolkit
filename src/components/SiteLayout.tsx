import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  FileDown,
  FileImage,
  Files,
  Image,
  LayoutGrid,
  LockKeyhole,
  Menu,
  MousePointer2,
  ScanLine,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'
import { BrandMark, HeroArtwork, ToolArtwork, type ToolId } from './Artwork'
import { tools } from '../data'
import { ApplicationGuide } from './ApplicationGuide'
import './additions.css'

const toolIcons = {
  resizer: Image,
  compressor: FileDown,
  scanner: ScanLine,
  age: CalendarDays,
  'jpg-to-pdf': Files,
  'pdf-to-jpg': FileImage,
}
export type InfoPage = 'privacy' | 'guide' | null

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <a
      className={`brand ${small ? 'brand-small' : ''}`}
      href="#home"
      aria-label="Sarkari Form ToolKit home"
    >
      <BrandMark small={small} />
      <span className="brand-type">
        Form<span>ToolKit</span>
        <small>SARKARI ESSENTIALS</small>
      </span>
    </a>
  )
}

export function Header({
  active,
  onInfo,
}: {
  active: ToolId | null
  onInfo: (info: InfoPage) => void
}) {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const close = () => {
    setOpen(false)
    setMobileOpen(false)
  }
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        menuButton.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    window.addEventListener('hashchange', close)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
      window.removeEventListener('hashchange', close)
    }
  }, [])
  const showInfo = (page: InfoPage) => {
    close()
    onInfo(page)
  }
  return (
    <header className="site-header">
      <div className="page-width header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a
            href="#home"
            className={`nav-link ${!active ? 'active' : ''}`}
            aria-current={!active ? 'page' : undefined}
          >
            Home
          </a>
          <div className="tools-menu" ref={menu}>
            <button
              ref={menuButton}
              className={`nav-link ${active ? 'active' : ''}`}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="tool-navigation"
            >
              All tools <ChevronDown size={14} className={open ? 'rotate-chevron' : ''} />
            </button>
            {open && (
              <div className="nav-dropdown" id="tool-navigation">
                <span className="dropdown-heading">YOUR WORKSPACE</span>
                {tools.map((tool) => {
                  const Icon = toolIcons[tool.id]
                  return (
                    <a
                      key={tool.id}
                      href={`#tool/${tool.id}`}
                      className={`dropdown-tool theme-${tool.id}`}
                      onClick={close}
                    >
                      <span className="dropdown-icon">
                        <Icon size={17} />
                      </span>
                      <span>{tool.name}</span>
                      <ArrowUpRight className="dropdown-arrow" size={14} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
          <button className="nav-link" onClick={() => showInfo('guide')}>
            How it works
          </button>
        </nav>
        <div className="header-actions">
          <button className="privacy-button" onClick={() => showInfo('privacy')}>
            <ShieldCheck size={16} strokeWidth={1.8} />
            <span>Privacy first</span>
          </button>
          <button
            className="mobile-menu-toggle"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
          <a href="#home" onClick={close}>
            <LayoutGrid size={17} />
            Home
          </a>
          {tools.map((tool) => {
            const Icon = toolIcons[tool.id]
            return (
              <a key={tool.id} href={`#tool/${tool.id}`} onClick={close}>
                <Icon size={17} />
                {tool.name}
              </a>
            )
          })}
          <button onClick={() => showInfo('guide')}>
            <MousePointer2 size={17} />
            How it works
          </button>
          <button onClick={() => showInfo('privacy')}>
            <ShieldCheck size={17} />
            Privacy promise
          </button>
        </nav>
      )}
    </header>
  )
}

export function Home({ onInfo }: { onInfo: (page: InfoPage) => void }) {
  return (
    <main id="main-content">
      <section className="hero blueprint">
        <div className="page-width hero-inner">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="eyebrow-line" />
              THE ASPIRANT'S COMPANION
            </div>
            <h1>
              Sarkari Form{' '}
              <span className="accent-word">
                ToolKit
                <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M4 8Q87-1 195 5M35 10q80-6 141-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="hero-subtitle">Ek Click me Photo, Sign &amp; PDF Ready.</p>
            <p className="hero-description">
              Your everyday essentials for government exam forms.
              <br className="desktop-break" /> Simple, free, and all right here in your browser.
            </p>
            <a
              className="primary-button hero-cta"
              href="#tools"
              onClick={() =>
                document
                  .getElementById('tools')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              <LayoutGrid size={17} />
              Explore tools
              <ArrowDown size={15} />
            </a>
          </div>
          <div className="hero-visual">
            <HeroArtwork />
          </div>
        </div>
      </section>
      <section className="toolbox page-width" id="tools" aria-labelledby="toolbox-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              <span className="eyebrow-line" />
              THE TOOLBOX
            </div>
            <h2 id="toolbox-title">Choose your tool</h2>
            <p>Six handy tools to get your application ready.</p>
          </div>
          <span className="tool-count">
            <LayoutGrid size={14} />
            {tools.length} tools
          </span>
        </div>
        <div className="tool-grid">
          {tools.map((tool, index) => (
            <a
              key={tool.id}
              className={`tool-card theme-${tool.id}`}
              href={`#tool/${tool.id}`}
              style={{ animationDelay: `${index * 65}ms` }}
              aria-label={`Open ${tool.name}`}
            >
              <div className="card-illustration">
                <span className="tool-number">TOOL {tool.number}</span>
                <ToolArtwork tool={tool.id} />
                <span className="illustration-corner" />
              </div>
              <div className="card-content">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="card-action">
                  <span>{tool.label}</span>
                  <ArrowRight size={17} />
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="privacy-note">
          <div className="privacy-note-icon">
            <ShieldCheck size={25} strokeWidth={1.65} />
          </div>
          <div className="privacy-note-copy">
            <h3>Your files stay yours.</h3>
            <p>Everything is processed on your device. No server uploads, no sign-up.</p>
          </div>
          <button onClick={() => onInfo('privacy')}>
            Our privacy promise <ArrowUpRight size={15} />
          </button>
        </div>
      </section>
      <ApplicationGuide />
    </main>
  )
}

export function Footer({ onInfo }: { onInfo: (page: InfoPage) => void }) {
  return (
    <footer className="site-footer">
      <div className="page-width footer-inner">
        <span className="footer-brand">
          <BrandMark small />
          FormToolKit
        </span>
        <p>An independent toolkit for every aspirant.</p>
        <button onClick={() => onInfo('privacy')}>Privacy</button>
        <span className="footer-dot" />
        <button onClick={() => onInfo('guide')}>Help &amp; guide</button>
      </div>
    </footer>
  )
}

export function InfoDialog({
  page,
  onClose,
}: {
  page: Exclude<InfoPage, null>
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const el = ref.current
    const trigger = document.activeElement as HTMLElement | null
    el?.showModal()
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      el?.close()
      document.body.style.overflow = old
      trigger?.focus()
    }
  }, [])
  const privacy = page === 'privacy'
  return (
    <dialog
      ref={ref}
      className="info-dialog"
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect()
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose()
        }
      }}
    >
      <button className="dialog-close icon-button" onClick={onClose} aria-label="Close dialog">
        <X size={19} />
      </button>
      <div className={`dialog-symbol ${privacy ? 'mint' : ''}`}>
        {privacy ? <ShieldCheck size={29} /> : <LayoutGrid size={27} />}
      </div>
      <div className="eyebrow">{privacy ? 'OUR PRIVACY PROMISE' : 'QUICK GUIDE'}</div>
      <h2 id="dialog-title">{privacy ? 'Your files stay yours.' : 'Ready in three steps.'}</h2>
      <p className="dialog-intro">
        {privacy
          ? "Personal documents belong on your device, not on someone else's server."
          : 'No account, no complicated settings. Just choose what you need.'}
      </p>
      {privacy ? (
        <ul className="privacy-list">
          <li>
            <Check />
            <div>
              <strong>Processed in your browser</strong>
              <p>Your photos, PDFs, and dates are never sent to a server.</p>
            </div>
          </li>
          <li>
            <Check />
            <div>
              <strong>No accounts or file storage</strong>
              <p>Files are held in memory while you work. Leaving a tool clears its workspace.</p>
            </div>
          </li>
          <li>
            <Check />
            <div>
              <strong>You control your downloads</strong>
              <p>
                Only the files you download are saved to your device. Your originals are never
                changed.
              </p>
            </div>
          </li>
        </ul>
      ) : (
        <ol className="guide-list">
          <li>
            <span>
              <MousePointer2 />
            </span>
            <div>
              <strong>01. Choose a tool</strong>
              <p>Resize, scan, compress, convert documents, or check your age eligibility.</p>
            </div>
          </li>
          <li>
            <span>
              <Upload />
            </span>
            <div>
              <strong>02. Add your details</strong>
              <p>Select a file and a preset, or enter your dates and age limits.</p>
            </div>
          </li>
          <li>
            <span>
              <FileDown />
            </span>
            <div>
              <strong>03. Check your result</strong>
              <p>
                Review the actual output size and download your file. Age results appear instantly.
              </p>
            </div>
          </li>
        </ol>
      )}
      <div className="dialog-footnote">
        <LockKeyhole size={14} />
        <span>
          {privacy
            ? 'No analytics, advertising, or third-party uploads.'
            : 'Always check the requirements in your exam notification.'}
        </span>
      </div>
      <button
        className="primary-button dialog-confirm"
        onClick={() => {
          onClose()
          if (!privacy) {
            window.location.hash = 'tools'
            document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }}
      >
        {privacy ? 'Got it' : 'Start exploring'}
        <ArrowRight size={16} />
      </button>
    </dialog>
  )
}
