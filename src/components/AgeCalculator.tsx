import { useState, type FormEvent } from 'react'
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Info,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react'
import { calculateAge, type AgeResult } from '../lib/age'
import { EmptyPreview, Notice, StepTitle } from './ToolUI'

const prettyDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))

export function AgeCalculator() {
  const [dob, setDob] = useState('')
  const [cutoff, setCutoff] = useState('2026-08-01')
  const [minAge, setMinAge] = useState('18')
  const [maxAge, setMaxAge] = useState('25')
  const [result, setResult] = useState<AgeResult | null>(null)
  const [error, setError] = useState('')
  const clear = () => {
    setResult(null)
    setError('')
  }
  const calculate = (event: FormEvent) => {
    event.preventDefault()
    clear()
    try {
      if (
        !minAge ||
        !maxAge ||
        !Number.isInteger(Number(minAge)) ||
        !Number.isInteger(Number(maxAge)) ||
        Number(minAge) < 0 ||
        Number(maxAge) > 150 ||
        Number(minAge) > Number(maxAge)
      )
        throw new Error(
          'Enter a valid age range from 0 to 150. The minimum must not exceed the maximum.',
        )
      setResult(calculateAge(dob, cutoff))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Please check the dates.')
    }
  }
  const eligible = result && result.years >= Number(minAge) && result.years <= Number(maxAge)
  const reset = () => {
    setDob('')
    setCutoff('2026-08-01')
    setMinAge('18')
    setMaxAge('25')
    clear()
  }
  return (
    <div className="work-grid">
      <form className="settings-pane" onSubmit={calculate}>
        <StepTitle step="01">Enter your dates</StepTitle>
        <div className="date-fields">
          <label htmlFor="birth-date">
            Date of birth
            <input
              id="birth-date"
              type="date"
              value={dob}
              min="1800-01-01"
              max="2200-12-31"
              required
              onChange={(e) => {
                clear()
                setDob(e.target.value)
              }}
            />
          </label>
          <label htmlFor="cutoff-date">
            Exam cut-off date
            <input
              id="cutoff-date"
              type="date"
              value={cutoff}
              min="1800-01-01"
              max="2200-12-31"
              required
              onChange={(e) => {
                clear()
                setCutoff(e.target.value)
              }}
            />
          </label>
        </div>
        <p className="field-caption">
          Use the cut-off date mentioned in the official notification.
        </p>
        <div className="settings-section">
          <StepTitle step="02">Set the exam age limits</StepTitle>
          <div className="age-range-fields">
            <label htmlFor="min-age">
              Minimum age (years)
              <input
                id="min-age"
                type="number"
                min="0"
                max="150"
                required
                value={minAge}
                onChange={(e) => {
                  clear()
                  setMinAge(e.target.value)
                }}
              />
            </label>
            <span>to</span>
            <label htmlFor="max-age">
              Maximum age (years)
              <input
                id="max-age"
                type="number"
                min="0"
                max="150"
                required
                value={maxAge}
                onChange={(e) => {
                  clear()
                  setMaxAge(e.target.value)
                }}
              />
            </label>
          </div>
          <p className="field-caption">Both limits are inclusive, using completed years.</p>
        </div>
        {error && <Notice>{error}</Notice>}
        <button className="primary-button calculate-button" type="submit">
          <CalendarDays size={17} />
          Calculate age &amp; eligibility
          <ArrowRight size={16} />
        </button>
        <p className="help-note">
          <Info size={15} />
          <span>
            This checks age only. Apply any category-based relaxation from your notification to the
            limits above.
          </span>
        </p>
      </form>
      <section className="preview-pane age-result-pane" aria-live="polite">
        <div className="pane-heading">
          <CalendarCheck2 size={18} />
          <h2>Eligibility result</h2>
        </div>
        {!result ? (
          <EmptyPreview
            tool="age"
            title="Know where you stand"
            text="Enter your dates and the exam's age limits to see your exact age and eligibility."
          />
        ) : (
          <div className="age-result">
            <div className="eyebrow">YOUR EXACT AGE</div>
            <div className="age-values">
              {(['years', 'months', 'days'] as const).map((unit) => (
                <div key={unit}>
                  <strong>{result[unit]}</strong>
                  <span>{unit}</span>
                </div>
              ))}
            </div>
            <p className="age-asof">As of {prettyDate(cutoff)}</p>
            <div className={`eligibility-status ${eligible ? 'eligible' : 'ineligible'}`}>
              {eligible ? <CheckCircle2 size={23} /> : <ShieldAlert size={23} />}
              <div>
                <strong>
                  {eligible ? 'Eligible for this age range' : 'Outside this age range'}
                </strong>
                <p>
                  {eligible ? 'You meet' : 'You do not meet'} the selected {minAge}-{maxAge} year
                  age requirement.
                </p>
              </div>
            </div>
            <div className="date-summary">
              <span>
                Date of birth<strong>{prettyDate(dob)}</strong>
              </span>
              <span>
                Cut-off date<strong>{prettyDate(cutoff)}</strong>
              </span>
            </div>
            <button className="secondary-button reset-age" onClick={reset}>
              <RotateCcw size={14} />
              Start a new calculation
            </button>
          </div>
        )}
        <p className="local-note">
          <CalendarDays size={13} />
          Calendar-accurate, including leap years.
        </p>
      </section>
    </div>
  )
}
