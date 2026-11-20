import { canvasBlob, loadImage, newCanvas } from './images'

export type PaperSize = 'a4' | 'photo'
export type JpgPage = { number: number; blob: Blob; width: number; height: number }
type Progress = (percent: number, label: string) => void

const MB = 1024 * 1024
const vendor = () => new URL(`${import.meta.env.BASE_URL}vendor/`, document.baseURI).href

export function validatePhotoList(files: File[]) {
  if (!files.length) throw new Error('Please add at least one photo.')
  if (files.length > 20)
    throw new Error('Choose up to 20 photos per PDF. Remove a photo or create a second PDF.')
  if (files.reduce((sum, file) => sum + file.size, 0) > 60 * MB)
    throw new Error('The photos exceed the 60 MB total limit. Please add fewer or smaller photos.')
  for (const file of files) {
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
      !(!file.type && /\.(jpe?g|png|webp)$/i.test(file.name))
    )
      throw new Error(`Choose JPG, PNG, or WebP photos. "${file.name}" is not supported.`)
    if (!file.size || file.size > 25 * MB)
      throw new Error(`"${file.name}" must be a non-empty image of 25 MB or less.`)
  }
}

export async function photosToPdf(
  files: File[],
  paper: PaperSize,
  progress: Progress,
  signal: AbortSignal,
) {
  validatePhotoList(files)
  progress(1, 'Preparing your PDF...')
  const lib: typeof import('pdf-lib') = await import(/* @vite-ignore */ `${vendor()}pdf-lib.mjs`)
  signal.throwIfAborted()
  const pdf = await lib.PDFDocument.create()
  pdf.setTitle('Application documents')
  pdf.setCreator('Sarkari Form ToolKit')
  pdf.setProducer('Sarkari Form ToolKit')
  let cover: Blob | null = null
  for (const [i, file] of files.entries()) {
    signal.throwIfAborted()
    progress(Math.floor((i / files.length) * 90) + 3, `Adding photo ${i + 1} of ${files.length}...`)
    // Decode one photo at a time. Canvas respects phone orientation and removes EXIF metadata.
    const img = await loadImage(file)
    signal.throwIfAborted()
    const scale = Math.min(1, 2600 / Math.max(img.naturalWidth, img.naturalHeight))
    const { canvas, ctx } = newCanvas(img.naturalWidth * scale, img.naturalHeight * scale)
    try {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const encoded = await canvasBlob(canvas, 'image/jpeg', 0.93)
      const image = await pdf.embedJpg(await encoded.arrayBuffer())
      const landscape = image.width > image.height
      const [width, height] =
        paper === 'a4'
          ? landscape
            ? [841.89, 595.28]
            : [595.28, 841.89]
          : [image.width * 0.75, image.height * 0.75]
      const page = pdf.addPage([width, height])
      const margin = paper === 'a4' ? 24 : 0
      const ratio = Math.min(
        (width - 2 * margin) / image.width,
        (height - 2 * margin) / image.height,
      )
      const w = image.width * ratio,
        h = image.height * ratio
      page.drawImage(image, { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h })
      if (i === 0) {
        const zoom = Math.min(1, 550 / Math.max(width, height))
        const thumb = newCanvas(width * zoom, height * zoom)
        try {
          thumb.ctx.drawImage(
            canvas,
            ((width - w) / 2) * zoom,
            ((height - h) / 2) * zoom,
            w * zoom,
            h * zoom,
          )
          cover = await canvasBlob(thumb.canvas)
        } finally {
          thumb.canvas.width = thumb.canvas.height = 1
        }
      }
    } finally {
      canvas.width = canvas.height = 1
      img.removeAttribute('src')
    }
  }
  signal.throwIfAborted()
  progress(96, 'Saving the combined pages...')
  const blob = new Blob(
    [new Uint8Array(await pdf.save({ useObjectStreams: true, objectsPerTick: 20 }))],
    { type: 'application/pdf' },
  )
  signal.throwIfAborted()
  return { blob, pages: files.length, cover, paper }
}

export function selectPages(input: string | null, total: number): number[] {
  if (!Number.isInteger(total) || total < 1) throw new Error('This PDF has no pages to extract.')
  if (input === null) {
    if (total > 50)
      throw new Error(
        `This PDF has ${total} pages. Choose "Selected pages" and export up to 50 at a time.`,
      )
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (!input.trim()) throw new Error('Enter the pages to extract, for example 1, 3-5.')
  if (input.length > 500)
    throw new Error('The page selection is too long. Use ranges such as 1-10.')
  const numbers = new Set<number>()
  for (const part of input.split(',')) {
    const range = /^(\d+)\s*(?:-\s*(\d+))?$/.exec(part.trim())
    if (!range)
      throw new Error('Use page numbers or ranges separated by commas, for example 1, 3-5.')
    const first = Number(range[1]),
      last = Number(range[2] ?? range[1])
    if (first < 1 || first > last || last > total)
      throw new Error(
        `This PDF has ${total} ${total === 1 ? 'page' : 'pages'}. Enter a valid range from 1 to ${total}.`,
      )
    if (last - first >= 50) throw new Error('Select up to 50 pages per export.')
    for (let n = first; n <= last; n++) numbers.add(n)
    if (numbers.size > 50) throw new Error('Select up to 50 pages per export.')
  }
  return [...numbers].sort((a, b) => a - b)
}

export async function pdfToJpg(
  file: File,
  selection: string | null,
  detail: boolean,
  progress: Progress,
  signal: AbortSignal,
) {
  if (!file.size || file.size > 40 * MB) throw new Error('Choose a non-empty PDF of 40 MB or less.')
  progress(2, 'Opening the PDF on your device...')
  const base = vendor()
  const js: typeof import('pdfjs-dist') = await import(/* @vite-ignore */ `${base}pdf.mjs`)
  js.GlobalWorkerOptions.workerSrc = `${base}pdf.worker.mjs`
  const bytes = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  const loading = js.getDocument({
    data: bytes,
    isEvalSupported: false,
    useSystemFonts: true,
    cMapUrl: `${base}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}standard_fonts/`,
  })
  let destroying: Promise<void> | undefined
  const dispose = () => (destroying ??= loading.destroy())
  const cancel = () => {
    void dispose().catch(() => {})
  }
  signal.addEventListener('abort', cancel, { once: true })
  try {
    let pdf: import('pdfjs-dist').PDFDocumentProxy
    try {
      pdf = await loading.promise
    } catch (error) {
      signal.throwIfAborted()
      if (
        error instanceof Error &&
        (error.name === 'PasswordException' || /password/i.test(error.message))
      )
        throw new Error(
          'This PDF is password-protected. Choose an unlocked copy that you have permission to use.',
        )
      throw new Error('This PDF could not be opened. Please choose a valid, undamaged PDF.')
    }
    const pageNumbers = selectPages(selection, pdf.numPages)
    const pages: JpgPage[] = []
    let size = 0
    for (const [i, number] of pageNumbers.entries()) {
      signal.throwIfAborted()
      progress(
        5 + Math.round((i / pageNumbers.length) * 90),
        `Converting page ${number} (${i + 1} of ${pageNumbers.length})...`,
      )
      const page = await pdf.getPage(number)
      const natural = page.getViewport({ scale: 1 })
      const scale = Math.min(
        detail ? 3 : 2,
        (detail ? 2800 : 1800) / Math.max(natural.width, natural.height),
      )
      const viewport = page.getViewport({ scale })
      const { canvas, ctx } = newCanvas(viewport.width, viewport.height)
      try {
        await page.render({ canvasContext: ctx, viewport, background: '#ffffff' }).promise
        const blob = await canvasBlob(canvas, 'image/jpeg', detail ? 0.95 : 0.88)
        size += blob.size
        if (size > 60 * MB)
          throw new Error('The output exceeds 60 MB. Choose fewer pages or use standard quality.')
        pages.push({ number, blob, width: canvas.width, height: canvas.height })
      } finally {
        canvas.width = canvas.height = 1
        page.cleanup()
      }
    }
    signal.throwIfAborted()
    return { pages, total: pdf.numPages, size }
  } finally {
    signal.removeEventListener('abort', cancel)
    await dispose()
  }
}

// JPEGs are already compressed. A standard stored ZIP avoids another runtime dependency.
export async function zipJpgs(pages: JpgPage[], signal: AbortSignal) {
  const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
    let c = index
    for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  const parts: BlobPart[] = [],
    directory: BlobPart[] = []
  let offset = 0,
    directorySize = 0
  for (const page of pages) {
    signal.throwIfAborted()
    const bytes = new Uint8Array(await page.blob.arrayBuffer())
    let crc = 0xffffffff
    for (const b of bytes) crc = crcTable[(crc ^ b) & 255] ^ (crc >>> 8)
    crc = (crc ^ 0xffffffff) >>> 0
    const name = new TextEncoder().encode(`page-${String(page.number).padStart(3, '0')}.jpg`)
    const local = new Uint8Array(30 + name.length),
      l = new DataView(local.buffer)
    l.setUint32(0, 0x04034b50, true)
    l.setUint16(4, 20, true)
    l.setUint16(12, 33, true)
    l.setUint32(14, crc, true)
    l.setUint32(18, bytes.length, true)
    l.setUint32(22, bytes.length, true)
    l.setUint16(26, name.length, true)
    local.set(name, 30)
    parts.push(local, page.blob)
    const central = new Uint8Array(46 + name.length),
      c = new DataView(central.buffer)
    c.setUint32(0, 0x02014b50, true)
    c.setUint16(4, 20, true)
    central.set(local.subarray(4, 30), 6)
    c.setUint32(42, offset, true)
    central.set(name, 46)
    directory.push(central)
    directorySize += central.length
    offset += local.length + bytes.length
  }
  signal.throwIfAborted()
  const end = new Uint8Array(22),
    e = new DataView(end.buffer)
  e.setUint32(0, 0x06054b50, true)
  e.setUint16(8, pages.length, true)
  e.setUint16(10, pages.length, true)
  e.setUint32(12, directorySize, true)
  e.setUint32(16, offset, true)
  return new Blob([...parts, ...directory, end], { type: 'application/zip' })
}
