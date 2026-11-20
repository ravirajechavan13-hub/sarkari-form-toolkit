import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  FileCheck2,
  FileImage,
  Files,
  FolderArchive,
  ImagePlus,
  LoaderCircle,
  Plus,
  UploadCloud,
  X,
} from 'lucide-react'
import { downloadFile, fileStem, formatBytes } from '../data'
import {
  photosToPdf,
  pdfToJpg,
  validatePhotoList,
  zipJpgs,
  type PaperSize,
} from '../lib/converters'
import { EmptyPreview, LocalNote, Notice, StepTitle, UploadBox, useBlobUrl } from './ToolUI'

type Reporter = (percent: number, message: string) => void
type Task<T> = (signal: AbortSignal, report: Reporter) => Promise<T>

function useConversion<T>() {
  const current = useRef<AbortController | null>(null)
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState<{ percent: number; message: string } | null>(null)
  useEffect(() => () => current.current?.abort(), [])
  const reset = () => {
    current.current?.abort()
    current.current = null
    setResult(null)
    setError('')
    setProgress(null)
  }
  const run = async (task: Task<T>) => {
    reset()
    const controller = new AbortController()
    current.current = controller
    const report: Reporter = (percent, message) => {
      if (!controller.signal.aborted) setProgress({ percent, message })
    }
    report(0, 'Getting ready...')
    try {
      const next = await task(controller.signal, report)
      if (!controller.signal.aborted) setResult(next)
    } catch (cause) {
      if (!controller.signal.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : 'Conversion failed. Please try a different file.',
        )
    } finally {
      if (!controller.signal.aborted) setProgress(null)
    }
  }
  return { result, progress, error, reset, run }
}

function ConversionProgress({
  progress,
  cancel,
}: {
  progress: { percent: number; message: string }
  cancel: () => void
}) {
  return (
    <div className="pdf-progress" role="status">
      <LoaderCircle className="spinning" size={31} strokeWidth={1.5} />
      <h3>{progress.message}</h3>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Conversion progress"
        aria-valuenow={progress.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ width: `${progress.percent}%` }} />
      </div>
      <button className="secondary-button" onClick={cancel}>
        <X size={14} />
        Cancel
      </button>
    </div>
  )
}

type PhotoItem = { key: number; file: File }

function PhotoRow({
  item,
  index,
  total,
  move,
  remove,
}: {
  item: PhotoItem
  index: number
  total: number
  move: (by: number) => void
  remove: () => void
}) {
  const url = useBlobUrl(item.file)
  return (
    <li className="converter-photo-row">
      <span className="converter-photo-index">{String(index + 1).padStart(2, '0')}</span>
      {url && <img className="converter-thumb" src={url} alt="" loading="lazy" />}
      <div className="selected-file-text">
        <strong title={item.file.name}>{item.file.name}</strong>
        <span>{formatBytes(item.file.size)}</span>
      </div>
      <div className="photo-row-actions">
        <button
          className="icon-button"
          disabled={index === 0}
          onClick={() => move(-1)}
          aria-label={`Move photo ${index + 1} up`}
          title="Move up"
        >
          <ChevronUp size={17} />
        </button>
        <button
          className="icon-button"
          disabled={index === total - 1}
          onClick={() => move(1)}
          aria-label={`Move photo ${index + 1} down`}
          title="Move down"
        >
          <ChevronDown size={17} />
        </button>
        <button
          className="icon-button"
          onClick={remove}
          aria-label={`Remove photo ${index + 1}`}
          title="Remove photo"
        >
          <X size={15} />
        </button>
      </div>
    </li>
  )
}

export function JpgToPdf() {
  const inputId = useId()
  const [items, setItems] = useState<PhotoItem[]>([])
  const [paper, setPaper] = useState<PaperSize>('a4')
  const [dragging, setDragging] = useState(false)
  const [inputError, setInputError] = useState('')
  const key = useRef(0)
  const job = useConversion<Awaited<ReturnType<typeof photosToPdf>>>()
  const cover = useBlobUrl(job.result?.cover)
  const change = (next: PhotoItem[]) => {
    job.reset()
    setInputError('')
    setItems(next)
  }
  const add = (list: FileList | null) => {
    if (!list?.length) return
    try {
      const added = Array.from(list)
      validatePhotoList([...items.map((item) => item.file), ...added])
      change([...items, ...added.map((file) => ({ key: ++key.current, file }))])
    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Choose valid photos.')
    }
  }
  const move = (index: number, delta: number) => {
    const next = [...items],
      to = index + delta
    if (to < 0 || to >= next.length) return
    ;[next[index], next[to]] = [next[to], next[index]]
    change(next)
  }
  return (
    <div className="work-grid converter-workspace">
      <section className="settings-pane">
        <StepTitle step="01">Add your photos</StepTitle>
        <div className="upload-control">
          <input
            id={inputId}
            type="file"
            className="file-input"
            multiple
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            aria-label="Add photos"
            onChange={(e) => {
              add(e.target.files)
              e.target.value = ''
            }}
          />
          <label
            htmlFor={inputId}
            className={`upload-zone ${items.length ? 'compact-upload' : ''} ${dragging ? 'dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              add(e.dataTransfer.files)
            }}
          >
            <span className="upload-symbol">
              {items.length ? <Plus size={21} /> : <UploadCloud size={25} strokeWidth={1.6} />}
            </span>
            <strong>
              {dragging
                ? 'Drop your photos here'
                : items.length
                  ? 'Add more photos'
                  : 'Upload photos together'}
            </strong>
            {!items.length && (
              <>
                <span className="upload-browse">
                  Drag &amp; drop or <u>browse files</u>
                </span>
                <small>
                  JPG, PNG, WebP
                  <i />
                  Up to 20 photos
                </small>
              </>
            )}
          </label>
        </div>
        <p className="field-caption">One photo per page. Up to 25 MB per photo, 60 MB in total.</p>
        {inputError && <Notice>{inputError}</Notice>}
        {!!items.length && (
          <div className="converter-order">
            <div className="converter-list-heading">
              <strong>Page order</strong>
              <span>
                {items.length} {items.length === 1 ? 'photo' : 'photos'}
              </span>
            </div>
            <ol className="converter-photo-list">
              {items.map((item, index) => (
                <PhotoRow
                  key={item.key}
                  item={item}
                  index={index}
                  total={items.length}
                  move={(by) => move(index, by)}
                  remove={() => change(items.filter((photo) => photo.key !== item.key))}
                />
              ))}
            </ol>
            {items.length > 1 && (
              <p className="field-caption order-hint">
                <ArrowUp size={11} />
                <ArrowDown size={11} />
                Use the arrows to change page order.
              </p>
            )}
          </div>
        )}
        <div className="settings-section">
          <StepTitle step="02">Choose a page layout</StepTitle>
          <div className="conversion-options">
            {(['a4', 'photo'] as const).map((value) => (
              <button
                key={value}
                className={`option-button ${paper === value ? 'selected' : ''}`}
                aria-pressed={paper === value}
                onClick={() => {
                  if (paper !== value) {
                    job.reset()
                    setPaper(value)
                  }
                }}
              >
                {paper === value && <Check size={14} />}
                {value === 'a4' ? 'A4 pages' : 'Fit to photo'}
              </button>
            ))}
          </div>
          <p className="field-caption">
            {paper === 'a4'
              ? 'A4 with a small white margin. Page orientation follows each photo.'
              : 'Each page follows its photo proportions, without margins or cropping.'}
          </p>
        </div>
        <button
          className="primary-button calculate-button"
          disabled={!items.length || !!job.progress}
          onClick={() =>
            void job.run((signal, report) =>
              photosToPdf(
                items.map((item) => item.file),
                paper,
                report,
                signal,
              ),
            )
          }
        >
          <Files size={17} />
          {job.progress ? 'Creating PDF...' : 'Create PDF'}
        </button>
        {job.error && <Notice>{job.error}</Notice>}
      </section>
      <section className="preview-pane">
        <div className="pane-heading">
          <FileCheck2 size={17} />
          <h2>Combined PDF</h2>
          <span>PDF</span>
        </div>
        {job.progress ? (
          <ConversionProgress progress={job.progress} cancel={job.reset} />
        ) : job.result ? (
          <>
            <div className="image-stage checkerboard">
              {cover && <img src={cover} alt="First page of your combined PDF" />}
            </div>
            <div className="result-body">
              <Notice kind="success">Your {job.result.pages}-page PDF is ready.</Notice>
              <div className="output-details">
                <span>
                  File size<strong>{formatBytes(job.result.blob.size)}</strong>
                </span>
                <span>
                  Page layout<strong>{job.result.paper === 'a4' ? 'A4' : 'Fit to photo'}</strong>
                </span>
              </div>
              <button
                className="primary-button download-button"
                onClick={() => downloadFile(job.result!.blob, 'application-documents.pdf')}
              >
                <Download size={17} />
                Download PDF
              </button>
            </div>
          </>
        ) : (
          <EmptyPreview
            tool="jpg-to-pdf"
            title="Your photos, one document"
            text="Add photos in your preferred order, then create your PDF. Every photo gets its own page."
          />
        )}
        <LocalNote />
      </section>
    </div>
  )
}

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'all' | 'selected'>('all')
  const [range, setRange] = useState('')
  const [detail, setDetail] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [zipping, setZipping] = useState(false)
  const [zipError, setZipError] = useState('')
  const zipController = useRef<AbortController | null>(null)
  const job = useConversion<Awaited<ReturnType<typeof pdfToJpg>>>()
  useEffect(() => () => zipController.current?.abort(), [])
  const reset = () => {
    zipController.current?.abort()
    setZipping(false)
    setZipError('')
    job.reset()
    setPageIndex(0)
  }
  const pages = job.result?.pages ?? []
  const page = pages[pageIndex]
  const preview = useBlobUrl(page?.blob)
  const stem = fileStem(file?.name ?? 'document')
  const downloadAll = async () => {
    if (zipping || !pages.length) return
    const controller = new AbortController()
    zipController.current = controller
    setZipping(true)
    setZipError('')
    try {
      const blob = await zipJpgs(pages, controller.signal)
      if (!controller.signal.aborted) downloadFile(blob, `${stem}-pages.zip`)
    } catch (error) {
      if (!controller.signal.aborted)
        setZipError(
          error instanceof Error
            ? error.message
            : 'Could not create the ZIP. Download each JPG instead.',
        )
    } finally {
      if (!controller.signal.aborted) setZipping(false)
    }
  }
  return (
    <div className="work-grid converter-workspace">
      <section className="settings-pane">
        <StepTitle step="01">Upload your PDF</StepTitle>
        <UploadBox
          mode="pdf"
          file={file}
          title="Upload PDF to extract pages"
          onChange={(next) => {
            reset()
            setFile(next)
            setRange('')
          }}
        />
        <div className="settings-section">
          <StepTitle step="02">Choose your pages</StepTitle>
          <div className="conversion-options">
            {(['all', 'selected'] as const).map((value) => (
              <button
                key={value}
                className={`option-button ${mode === value ? 'selected' : ''}`}
                aria-pressed={mode === value}
                onClick={() => {
                  if (mode !== value) {
                    reset()
                    setMode(value)
                  }
                }}
              >
                {mode === value && <Check size={14} />}
                {value === 'all' ? 'All pages' : 'Selected pages'}
              </button>
            ))}
          </div>
          {mode === 'selected' && (
            <label className="converter-range">
              Page numbers
              <input
                value={range}
                maxLength={500}
                placeholder="For example: 1, 3-5"
                onChange={(e) => {
                  reset()
                  setRange(e.target.value)
                }}
              />
            </label>
          )}
          <p className="field-caption">
            Export up to 50 pages at a time, in the original page order.
          </p>
          <div className="fit-field">
            <label htmlFor="jpg-output-quality">Image quality</label>
            <select
              id="jpg-output-quality"
              value={detail ? 'high' : 'standard'}
              onChange={(e) => {
                reset()
                setDetail(e.target.value === 'high')
              }}
            >
              <option value="standard">Standard</option>
              <option value="high">High detail</option>
            </select>
          </div>
        </div>
        <button
          className="primary-button calculate-button"
          disabled={!file || !!job.progress}
          onClick={() => {
            reset()
            if (file)
              void job.run((signal, report) =>
                pdfToJpg(file, mode === 'all' ? null : range, detail, report, signal),
              )
          }}
        >
          <FileImage size={17} />
          {job.progress ? 'Extracting pages...' : 'Convert to JPG'}
        </button>
        {job.error && <Notice>{job.error}</Notice>}
      </section>
      <section className="preview-pane">
        <div className="pane-heading">
          <ImagePlus size={17} />
          <h2>Extracted pages</h2>
          <span>JPG</span>
        </div>
        {job.progress ? (
          <ConversionProgress progress={job.progress} cancel={job.reset} />
        ) : page && job.result ? (
          <>
            <div className="converter-pager">
              <button
                className="icon-button"
                aria-label="Previous extracted page"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((i) => i - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <span aria-live="polite">
                Page <strong>{page.number}</strong> of {job.result.total}
              </span>
              <button
                className="icon-button"
                aria-label="Next extracted page"
                disabled={pageIndex === pages.length - 1}
                onClick={() => setPageIndex((i) => i + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="image-stage checkerboard">
              {preview && <img src={preview} alt={`JPG preview of PDF page ${page.number}`} />}
            </div>
            <div className="result-body">
              <Notice kind="success">
                {pages.length}{' '}
                {pages.length === 1 ? 'page converted to JPG.' : 'pages converted to JPGs.'}
              </Notice>
              <div className="output-details">
                <span>
                  Dimensions
                  <strong>
                    {page.width} &times; {page.height} px
                  </strong>
                </span>
                <span>
                  This JPG<strong>{formatBytes(page.blob.size)}</strong>
                </span>
              </div>
              <button
                className="primary-button download-button"
                onClick={() =>
                  downloadFile(
                    page.blob,
                    `${stem}-page-${String(page.number).padStart(3, '0')}.jpg`,
                  )
                }
              >
                <Download size={16} />
                Download page {page.number} JPG
              </button>
              {pages.length > 1 && (
                <button
                  className="secondary-button converter-zip"
                  disabled={zipping}
                  onClick={() => void downloadAll()}
                >
                  {zipping ? (
                    <LoaderCircle size={16} className="spinning" />
                  ) : (
                    <FolderArchive size={16} />
                  )}
                  {zipping ? 'Preparing ZIP...' : `Download all ${pages.length} JPGs as ZIP`}
                </button>
              )}
              {zipError && <Notice>{zipError}</Notice>}
            </div>
          </>
        ) : (
          <EmptyPreview
            tool="pdf-to-jpg"
            title="Each page, its own image"
            text="Choose a PDF to extract all pages or a selection. Preview and download each JPG here."
          />
        )}
        <LocalNote />
      </section>
    </div>
  )
}
