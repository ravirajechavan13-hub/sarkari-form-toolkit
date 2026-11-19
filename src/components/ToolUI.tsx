import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Image,
  LoaderCircle,
  LockKeyhole,
  UploadCloud,
  X,
} from 'lucide-react'
import { formatBytes } from '../data'
import { ToolArtwork, type ToolId } from './Artwork'

export function StepTitle({ step, children }: { step: string; children: ReactNode }) {
  return (
    <h2 className="step-title">
      <span>{step}</span>
      {children}
    </h2>
  )
}

export function Notice({
  children,
  kind = 'error',
}: {
  children: ReactNode
  kind?: 'error' | 'success' | 'info'
}) {
  return (
    <div className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {kind === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
      <div>{children}</div>
    </div>
  )
}

export function UploadBox({
  mode = 'image',
  file,
  onChange,
  title,
}: {
  mode?: 'image' | 'pdf'
  file: File | null
  onChange: (file: File | null) => void
  title: string
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const pdf = mode === 'pdf'
  const limit = pdf ? 40 : 25
  const select = (files: FileList | null) => {
    if (!files?.length) return
    if (files.length > 1) {
      setError('Please choose one file at a time.')
      return
    }
    const next = files[0]
    const supported = pdf
      ? next.type === 'application/pdf' || (!next.type && /\.pdf$/i.test(next.name))
      : ['image/jpeg', 'image/png', 'image/webp'].includes(next.type) ||
        (!next.type && /\.(jpe?g|png|webp)$/i.test(next.name))
    if (!supported) {
      setError(pdf ? 'Please choose a PDF document.' : 'Please choose a JPG, PNG, or WebP image.')
      return
    }
    if (!next.size) {
      setError('This file is empty. Please select another file.')
      return
    }
    if (next.size > limit * 1024 * 1024) {
      setError(`This file is too large. Please choose a file under ${limit} MB.`)
      return
    }
    setError('')
    onChange(next)
  }
  return (
    <div className="upload-control">
      <input
        id={id}
        type="file"
        ref={input}
        className="file-input"
        accept={
          pdf ? 'application/pdf,.pdf' : 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
        }
        aria-label={title}
        onChange={(event) => {
          select(event.target.files)
          event.target.value = ''
        }}
      />
      {!file ? (
        <label
          htmlFor={id}
          className={`upload-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            select(e.dataTransfer.files)
          }}
        >
          <span className="upload-symbol">
            <UploadCloud size={25} strokeWidth={1.6} />
          </span>
          <strong>{dragging ? 'Drop your file here' : title}</strong>
          <span className="upload-browse">
            Drag &amp; drop or <u>browse files</u>
          </span>
          <small>
            {pdf ? 'PDF' : 'JPG, PNG, WebP'}
            <i />
            Up to {limit} MB
          </small>
        </label>
      ) : (
        <div className="selected-file">
          <div className="selected-file-icon">
            {pdf ? <FileText size={23} /> : <Image size={23} />}
          </div>
          <div className="selected-file-text">
            <strong title={file.name}>{file.name}</strong>
            <span>
              {formatBytes(file.size)}
              <i /> <button onClick={() => input.current?.click()}>Change file</button>
            </span>
          </div>
          <button
            className="icon-button"
            onClick={() => {
              setError('')
              onChange(null)
            }}
            aria-label="Remove file"
          >
            <X size={17} />
          </button>
        </div>
      )}
      {error && <Notice>{error}</Notice>}
    </div>
  )
}

export function EmptyPreview({ tool, title, text }: { tool: ToolId; title: string; text: string }) {
  return (
    <div className="empty-preview">
      <ToolArtwork tool={tool} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

export function BusyPreview({ text = 'Preparing your preview...' }: { text?: string }) {
  return (
    <div className="busy-preview" role="status">
      <LoaderCircle className="spinning" size={30} strokeWidth={1.5} />
      <p>{text}</p>
    </div>
  )
}

export function LocalNote() {
  return (
    <p className="local-note">
      <LockKeyhole size={13} />
      Private by design. Your files never leave this device.
    </p>
  )
}

export function useBlobUrl(blob: Blob | null | undefined) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!blob) {
      setUrl('')
      return
    }
    const next = URL.createObjectURL(blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [blob])
  return url
}

export function useLocalTask<T>(task: ((signal: AbortSignal) => Promise<T>) | null) {
  const [state, setState] = useState<{ result: T | null; error: string; busy: boolean }>({
    result: null,
    error: '',
    busy: false,
  })
  useEffect(() => {
    if (!task) {
      setState({ result: null, error: '', busy: false })
      return
    }
    const controller = new AbortController()
    setState({ result: null, error: '', busy: true })
    const timer = window.setTimeout(async () => {
      try {
        const result = await task(controller.signal)
        if (!controller.signal.aborted) setState({ result, error: '', busy: false })
      } catch (error) {
        if (!controller.signal.aborted)
          setState({
            result: null,
            error: error instanceof Error ? error.message : 'This file could not be processed.',
            busy: false,
          })
      }
    }, 100)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [task])
  return state
}
