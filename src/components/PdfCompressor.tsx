import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownToLine,
  Check,
  CheckCircle2,
  Download,
  FileCheck2,
  FileDown,
  Info,
  LoaderCircle,
  Minimize2,
  X,
} from 'lucide-react'
import { downloadFile, fileStem, formatBytes } from '../data'
import { compressPdf, type PdfResult } from '../lib/pdf'
import { EmptyPreview, LocalNote, Notice, StepTitle, UploadBox, useBlobUrl } from './ToolUI'

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [target, setTarget] = useState(200)
  const [result, setResult] = useState<PdfResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const controller = useRef<AbortController | null>(null)
  const preview = useBlobUrl(result?.preview)
  const clear = () => {
    controller.current?.abort()
    setBusy(false)
    setError('')
    setResult(null)
    setProgress(0)
  }
  useEffect(() => () => controller.current?.abort(), [])
  const filename = `${fileStem(file?.name ?? 'document')}-compressed.pdf`
  const run = async () => {
    if (!file || busy) return
    clear()
    setBusy(true)
    const operation = new AbortController()
    controller.current = operation
    try {
      const output = await compressPdf(
        file,
        target,
        (n, text) => {
          if (!operation.signal.aborted) {
            setProgress(n)
            setMessage(text)
          }
        },
        operation.signal,
      )
      if (operation.signal.aborted) return
      setResult(output)
      setProgress(100)
      downloadFile(output.blob, filename)
    } catch (e) {
      if (!operation.signal.aborted)
        setError(
          e instanceof Error
            ? e.message
            : 'Unable to process the PDF. Please try a different document.',
        )
    } finally {
      if (!operation.signal.aborted) setBusy(false)
    }
  }
  const within = result && result.blob.size < target * 1024
  return (
    <div className="work-grid">
      <section className="settings-pane">
        <StepTitle step="01">Upload your PDF</StepTitle>
        <UploadBox
          mode="pdf"
          file={file}
          onChange={(f) => {
            clear()
            setFile(f)
          }}
          title="Upload PDF document"
        />
        <p className="field-caption">Marksheets, Aadhaar cards, caste certificates, and more.</p>
        <div className="settings-section">
          <StepTitle step="02">Choose compression level</StepTitle>
          <div className="compression-levels">
            {[200, 100].map((size) => (
              <button
                key={size}
                className={`compression-option ${target === size ? 'selected' : ''}`}
                onClick={() => {
                  if (target !== size) {
                    clear()
                    setTarget(size)
                  }
                }}
                aria-pressed={target === size}
              >
                <span className="radio-indicator">
                  {target === size && <Check size={10} strokeWidth={3} />}
                </span>
                <strong>{size === 200 ? 'Standard' : 'High compress'}</strong>
                <span>Under {size} KB</span>
              </button>
            ))}
          </div>
          <p className="field-caption">We aim for this size while keeping your pages readable.</p>
        </div>
        <button className="primary-button calculate-button" onClick={run} disabled={!file || busy}>
          {busy ? <LoaderCircle size={17} className="spinning" /> : <Minimize2 size={17} />}
          {busy ? 'Compressing PDF...' : 'Compress PDF'}
        </button>
        {error && <Notice>{error}</Notice>}
        <p className="help-note">
          <Info size={15} />
          <span>
            Keep your original. Image optimization can flatten selectable text, links, forms, and
            digital signatures. Your finished PDF downloads automatically.
          </span>
        </p>
      </section>
      <section className="preview-pane">
        <div className="pane-heading">
          <FileDown size={18} />
          <h2>Compression result</h2>
          <span>PDF</span>
        </div>
        {busy ? (
          <div className="pdf-progress" role="status">
            <FileDown size={42} strokeWidth={1.3} />
            <h3>{message}</h3>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Compression progress"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}%</span>
            <button className="secondary-button" onClick={clear}>
              <X size={14} />
              Cancel
            </button>
          </div>
        ) : result && file ? (
          <div className="pdf-result-body">
            <div className="pdf-success-art">
              {preview ? (
                <img src={preview} alt="First page of your compressed PDF" />
              ) : (
                <FileCheck2 size={65} strokeWidth={1.15} />
              )}
            </div>
            <h3>Your PDF is ready!</h3>
            <p className="download-hint">
              <ArrowDownToLine size={13} />
              Your download has been requested.
            </p>
            <div className="pdf-size-comparison">
              <div>
                <span>Original size</span>
                <strong>{formatBytes(file.size)}</strong>
              </div>
              <span className="size-arrow">&rarr;</span>
              <div>
                <span>Final size</span>
                <strong>{formatBytes(result.blob.size)}</strong>
              </div>
            </div>
            <Notice kind={within ? 'success' : 'info'}>
              {within
                ? result.method === 'original'
                  ? `Already under ${target} KB. No quality loss.`
                  : `Target reached: under ${target} KB.`
                : `Best readable result is ${formatBytes(result.blob.size)}, above the ${target} KB target.`}
            </Notice>
            <p className="pdf-detail">
              <CheckCircle2 size={13} />
              {result.pages} {result.pages === 1 ? 'page' : 'pages'} preserved<span>&middot;</span>
              {Math.round((1 - result.blob.size / file.size) * 100)}% smaller
            </p>
            <button
              className="primary-button download-button"
              onClick={() => downloadFile(result.blob, filename)}
            >
              <Download size={17} />
              Download PDF
            </button>
          </div>
        ) : (
          <EmptyPreview
            tool="compressor"
            title="Smaller file, ready to submit"
            text="Upload a PDF and select a compression level to see your before-and-after file sizes."
          />
        )}
        <LocalNote />
      </section>
    </div>
  )
}
