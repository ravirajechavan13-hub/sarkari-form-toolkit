import { useMemo, useState } from 'react'
import { Download, Eye, Info, RotateCw, Sparkles } from 'lucide-react'
import { cleanDocument } from '../lib/images'
import { downloadFile, fileStem, formatBytes } from '../data'
import {
  BusyPreview,
  EmptyPreview,
  LocalNote,
  Notice,
  StepTitle,
  UploadBox,
  useBlobUrl,
  useLocalTask,
} from './ToolUI'

export function DocumentScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [clean, setClean] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [original, setOriginal] = useState(false)
  const task = useMemo(
    () => (file ? (signal: AbortSignal) => cleanDocument(file, clean, rotation, signal) : null),
    [file, clean, rotation],
  )
  const { result, busy, error } = useLocalTask(task)
  const preview = useBlobUrl(result?.blob)
  const before = useBlobUrl(file)
  const pick = (next: File | null) => {
    setFile(next)
    setOriginal(false)
    setRotation(0)
  }
  return (
    <div className="work-grid">
      <section className="settings-pane">
        <StepTitle step="01">Add a document photo</StepTitle>
        <UploadBox file={file} onChange={pick} title="Upload document photo" />
        <p className="field-caption">
          Use a photo of your marksheet, certificate, or printed form.
        </p>
        <div className="settings-section">
          <StepTitle step="02">Choose scan settings</StepTitle>
          <div className="switch-setting">
            <span className="setting-symbol">
              <Sparkles size={20} />
            </span>
            <div>
              <strong>Magic Clean &amp; B/W Scan</strong>
              <p>Reduce shadows and darken the text.</p>
            </div>
            <button
              role="switch"
              aria-checked={clean}
              aria-label="Magic Clean & B/W Scan"
              className={`switch ${clean ? 'on' : ''}`}
              onClick={() => {
                setClean(!clean)
                setOriginal(false)
              }}
            >
              <span />
            </button>
          </div>
          <div className="rotate-setting">
            <span>Page orientation</span>
            <button
              className="secondary-button"
              disabled={!file}
              onClick={() => {
                setRotation((rotation + 90) % 360)
                setOriginal(false)
              }}
            >
              <RotateCw size={15} />
              Rotate 90&deg;
            </button>
          </div>
        </div>
        <p className="help-note">
          <Info size={15} />
          <span>
            For a clearer scan, photograph the document straight on, include all four corners, and
            avoid flash reflections.
          </span>
        </p>
      </section>
      <section className="preview-pane">
        <div className="pane-heading">
          <Eye size={17} />
          <h2>Scan preview</h2>
          <span>{clean ? 'PNG' : 'JPG'}</span>
        </div>
        {busy ? (
          <BusyPreview text="Cleaning your document..." />
        ) : error ? (
          <div className="error-preview">
            <Notice>{error}</Notice>
          </div>
        ) : result && preview ? (
          <>
            <div className="compare-tabs">
              <button
                className={original ? 'selected' : ''}
                aria-pressed={original}
                onClick={() => setOriginal(true)}
              >
                Original
              </button>
              <button
                className={!original ? 'selected' : ''}
                aria-pressed={!original}
                onClick={() => setOriginal(false)}
              >
                {clean ? 'Cleaned scan' : 'Output'}
              </button>
            </div>
            <div className="image-stage checkerboard">
              <img
                src={original ? before : preview}
                alt={original ? 'Original document photo' : 'Processed document scan'}
              />
            </div>
            <div className="result-body">
              <Notice kind="success">
                {clean ? 'Your clean document is ready.' : 'Your document is ready.'}
              </Notice>
              <div className="output-details">
                <span>
                  Dimensions
                  <strong>
                    {result.width} &times; {result.height} px
                  </strong>
                </span>
                <span>
                  Output file<strong>{formatBytes(result.blob.size)}</strong>
                </span>
              </div>
              <button
                className="primary-button download-button"
                onClick={() =>
                  downloadFile(
                    result.blob,
                    `${fileStem(file!.name)}-${clean ? 'clean-scan.png' : 'document.jpg'}`,
                  )
                }
              >
                <Download size={17} />
                Download {clean ? 'clean scan' : 'document'}
              </button>
            </div>
          </>
        ) : (
          <EmptyPreview
            tool="scanner"
            title="A cleaner page starts here"
            text="Add your document photo to compare the original with a shadow-cleaned scan."
          />
        )}
        <LocalNote />
      </section>
    </div>
  )
}
