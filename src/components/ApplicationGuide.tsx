import { useId, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  GraduationCap,
  ListOrdered,
  ShieldCheck,
  Sprout,
} from 'lucide-react'
import { applicationGuides, officialUrl, type GuideCategory } from '../lib/applicationGuides'

const topics = [
  { key: 'steps', label: 'Kaise bharna hai', icon: ListOrdered },
  { key: 'documents', label: 'Documents & upload size', icon: FileText },
  { key: 'rules', label: 'Eligibility & rules', icon: ShieldCheck },
] as const
type Topic = (typeof topics)[number]['key']

function GuideRow({
  guide,
  open,
  toggle,
}: {
  guide: (typeof applicationGuides)[number]
  open: boolean
  toggle: () => void
}) {
  const id = useId()
  const [topic, setTopic] = useState<Topic>('steps')
  const Icon =
    guide.id === 'ssc-gd' ? BriefcaseBusiness : guide.id === 'nsp' ? GraduationCap : Sprout
  return (
    <article className={`application-guide-row ${open ? 'is-open' : ''}`}>
      <h3>
        <button
          className="application-guide-toggle"
          id={`${id}-heading`}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={toggle}
        >
          <span className={`guide-topic-icon guide-topic-${guide.id}`}>
            <Icon size={21} strokeWidth={1.55} />
          </span>
          <span className="guide-name">
            <small>{guide.category === 'Vacancy' ? 'RECRUITMENT GUIDE' : 'SCHEME GUIDE'}</small>
            <strong>{guide.title}</strong>
          </span>
          <span className="guide-toggle-caption">{open ? 'Close guide' : 'Read guide'}</span>
          <ChevronDown className="guide-chevron" size={17} />
        </button>
      </h3>
      <div
        className="application-guide-body"
        id={`${id}-body`}
        role="region"
        aria-labelledby={`${id}-heading`}
        hidden={!open}
      >
        <p className="guide-intro">{guide.intro}</p>
        <div
          className="guide-topic-options"
          role="group"
          aria-label={`${guide.title} guide topics`}
        >
          {topics.map((item) => (
            <button
              key={item.key}
              className={`option-button ${topic === item.key ? 'selected' : ''}`}
              aria-pressed={topic === item.key}
              onClick={() => setTopic(item.key)}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
        <ol
          className="guide-instructions"
          aria-label={topics.find((item) => item.key === topic)?.label}
        >
          {guide[topic].map((part, index) => (
            <li key={part.title}>
              <span className="guide-step-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h4>{part.title}</h4>
                <p>{part.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="guide-sources">
          <a
            className="primary-button official-portal"
            href={officialUrl(guide.portal)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open official ${guide.title} portal in a new tab`}
          >
            <ShieldCheck size={16} />
            Official portal
            <ArrowUpRight size={15} />
          </a>
          <span className="official-host">{guide.host}</span>
          <a
            className="official-reference"
            href={officialUrl(guide.reference)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {guide.referenceLabel}
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </article>
  )
}

export function ApplicationGuide() {
  const [filter, setFilter] = useState<GuideCategory | 'All'>('All')
  const [expanded, setExpanded] = useState<string | null>(null)
  const visible = applicationGuides.filter((guide) => filter === 'All' || guide.category === filter)
  return (
    <section
      id="application-guides"
      className="application-guides page-width"
      aria-labelledby="application-guides-title"
    >
      <div className="section-heading">
        <div>
          <div className="eyebrow section-eyebrow">
            <span className="eyebrow-line" />
            THE FORM GUIDE
          </div>
          <h2 id="application-guides-title">Sarkari Yojana &amp; Vacancy Guide</h2>
          <p>Kaunsa document, kaunsa rule, aur kahan apply karein. Aasaan bhasha mein.</p>
        </div>
        <BookOpen className="guide-heading-icon" size={24} strokeWidth={1.4} />
      </div>
      <div className="guide-filters" role="group" aria-label="Guide category">
        {(['All', 'Yojana', 'Vacancy'] as const).map((item) => (
          <button
            key={item}
            aria-pressed={filter === item}
            className={filter === item ? 'selected' : ''}
            onClick={() => {
              setFilter(item)
              setExpanded(null)
            }}
          >
            {item === 'All' ? 'All guides' : item}
          </button>
        ))}
      </div>
      <div className="application-guide-list">
        {visible.map((guide) => (
          <GuideRow
            key={guide.id}
            guide={guide}
            open={expanded === guide.id}
            toggle={() => setExpanded(expanded === guide.id ? null : guide.id)}
          />
        ))}
      </div>
      <p className="guide-safety-note">
        <ShieldCheck size={15} />
        <span>
          Sirf official portals ke direct links. Apply karne se pehle latest notification,
          corrigendum aur last date zaroor dekhein. Yeh toolkit sarkari portal nahi hai.
        </span>
      </p>
    </section>
  )
}
