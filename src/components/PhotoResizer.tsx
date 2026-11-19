import { useMemo, useState } from 'react'
import { Check, Download, Eye, Info, Ruler, SlidersHorizontal } from 'lucide-react'
import { downloadFile, fileStem, formatBytes, presets } from '../data'
import { resizeImage } from '../lib/images'
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

export function PhotoResizer() {
  const [file, setFile] = useState<File | null>(null)
  const [presetIndex, setPresetIndex] = useState(0)
  const [customWidth, setCustomWidth] = useState('413')
  const [customHeight, setCustomHeight] = useState('531')
  const [customKb, setCustomKb] = useState('50')
  const [fit, setFit] = useState<'cover' | 'contain'>('cover')
  const custom = presetIndex === -1
  const preset = presets[presetIndex] ?? presets[0]
  const width = custom ? Number(customWidth) : preset.width
  const height = custom ? Number(customHeight) : preset.height
  const max = custom ? Number(customKb) : preset.max,
    min = custom ? 0 : preset.min
  const task = useMemo(
    () =>
      file
        ? (signal: AbortSignal) => resizeImage(file, width, height, max, min, fit, signal)
        : null,
    [file, width, height, max, min, fit],
  )
  const { result, error, busy } = useLocalTask(task)
  const preview = useBlobUrl(result)
  const name = custom ? 'Custom size' : preset.name
  const select = (index: number) => {
    setPresetIndex(index)
    if (index >= 0) setFit(presets[index].fit as 'cover' | 'contain')
  }
  const sign = presetIndex === 1
  return (
    <div className="work-grid">
      <section className="settings-pane" aria-label="Image resize settings">
        <StepTitle step="01">Upload your image</StepTitle>
        <UploadBox file={file} onChange={setFile} title="Upload photo or signature" />
        <div className="settings-section">
          <StepTitle step="02">Choose an exam preset</StepTitle>
          <div className="preset-grid">
            {presets.map((p, index) => (
              <button
                className={`option-button ${presetIndex === index ? 'selected' : ''}`}
                aria-pressed={presetIndex === index}
                key={p.name}
                onClick={() => select(index)}
              >
                {presetIndex === index && <Check size={13} />}
                {p.name}
              </button>
            ))}
            <button
              className={`option-button ${custom ? 'selected' : ''}`}
              aria-pressed={custom}
              onClick={() => select(-1)}
            >
              <SlidersHorizontal size={13} />
              Custom size
            </button>
          </div>
          {custom ? (
            <div className="custom-fields">
              <label>
                Width (px)
                <input
                  type="number"
                  min="16"
                  max="4096"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                />
              </label>
              <label>
                Height (px)
                <input
                  type="number"
                  min="16"
                  max="4096"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                />
              </label>
              <label>
                Max size (KB)
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={customKb}
                  onChange={(e) => setCustomKb(e.target.value)}
                />
              </label>
            </div>
          ) : (
            <div className="preset-spec">
              <Ruler size={16} />
              <span>{preset.size}</span>
              <i />
              <span>
                {preset.min}-{preset.max} KB
              </span>
              <i />
              <span>JPG</span>
            </div>
          )}
          <div className="fit-field">
            <label htmlFor="photo-fit">Image fit</label>
            <select
              id="photo-fit"
              value={fit}
              onChange={(e) => setFit(e.target.value as 'cover' | 'contain')}
            >
              <option value="cover">Fill frame (center crop)</option>
              <option value="contain">Fit whole image</option>
            </select>
          </div>
        </div>
        <p className="help-note">
          <Info size={15} />
          <span>
            Presets are a starting point. Always match the dimensions and upload rules in your
            current exam notification.
          </span>
        </p>
      </section>
      <section className="preview-pane" aria-label="Resized photo preview">
        <div className="pane-heading">
          <Eye size={17} />
          <h2>Live preview</h2>
          <span>JPG</span>
        </div>
        {busy ? (
          <BusyPreview />
        ) : result && preview ? (
          <>
            <div className="image-stage checkerboard">
              <img src={preview} alt="Your resized image" />
            </div>
            <div className="result-body">
              <Notice kind="success">
                <strong>
                  {formatBytes(result.size)}. Ready for {custom ? 'your custom size' : name}.
                </strong>
                <p>Within your selected file-size limit.</p>
              </Notice>
              <div className="output-details">
                <span>
                  Dimensions
                  <strong>
                    {width} &times; {height} px
                  </strong>
                </span>
                <span>
                  Print resolution<strong>300 DPI</strong>
                </span>
              </div>
              <button
                className="primary-button download-button"
                onClick={() =>
                  downloadFile(
                    result,
                    `${fileStem(file!.name)}-${name.toLowerCase().replace(/ /g, '-')}.jpg`,
                  )
                }
              >
                <Download size={17} />
                Download {sign ? 'signature' : 'photo'}
              </button>
            </div>
          </>
        ) : error ? (
          <div className="error-preview">
            <Notice>{error}</Notice>
            <p>Adjust your settings or choose a different image.</p>
          </div>
        ) : (
          <EmptyPreview
            tool="resizer"
            title="Your preview goes here"
            text="Upload an image to see its exact dimensions and final file size."
          />
        )}
        <LocalNote />
      </section>
    </div>
  )
}
