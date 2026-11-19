import { canvasBlob, newCanvas } from './images'

export interface PdfResult {
  blob: Blob
  pages: number
  method: 'original' | 'lossless' | 'raster'
  preview: Blob | null
}
type Progress = (percent: number, label: string) => void

async function fitPage(source: HTMLCanvasElement, budget: number, signal: AbortSignal) {
  let active = source
  try {
    for (let pass = 0; pass < 4; pass++) {
      signal.throwIfAborted()
      const full = await canvasBlob(active, 'image/jpeg', 0.9)
      if (full.size <= budget) return full
      const low = await canvasBlob(active, 'image/jpeg', 0.34)
      if (low.size <= budget) {
        let best = low,
          lo = 0.34,
          hi = 0.9
        for (let i = 0; i < 5; i++) {
          signal.throwIfAborted()
          const quality = (lo + hi) / 2
          const candidate = await canvasBlob(active, 'image/jpeg', quality)
          if (candidate.size <= budget) {
            best = candidate
            lo = quality
          } else hi = quality
        }
        return best
      }
      const longest = Math.max(active.width, active.height)
      if (longest <= 780 || pass === 3) return low
      const scale = Math.max(760 / longest, Math.min(0.85, Math.sqrt(budget / low.size) * 0.94))
      const { canvas, ctx } = newCanvas(active.width * scale, active.height * scale)
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
      if (active !== source) {
        active.width = 1
        active.height = 1
      }
      active = canvas
    }
    return await canvasBlob(active, 'image/jpeg', 0.34)
  } finally {
    if (active !== source) {
      active.width = 1
      active.height = 1
    }
  }
}

export async function compressPdf(
  file: File,
  targetKb: number,
  progress: Progress,
  signal: AbortSignal,
): Promise<PdfResult> {
  const base = new URL(`${import.meta.env.BASE_URL}vendor/`, document.baseURI).href
  progress(4, 'Opening your PDF locally...')
  const lib: typeof import('pdf-lib') = await import(/* @vite-ignore */ `${base}pdf-lib.mjs`)
  const bytes = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  let original: import('pdf-lib').PDFDocument
  try {
    original = await lib.PDFDocument.load(bytes, { updateMetadata: false })
  } catch (error) {
    if (error instanceof Error && /encrypt|password/i.test(error.message))
      throw new Error('This PDF is password-protected. Please choose an unlocked copy.')
    throw new Error('This PDF could not be opened. It may be damaged. Please select a valid PDF.')
  }
  const pages = original.getPageCount()
  if (!pages) throw new Error('This PDF has no pages to compress.')
  const target = targetKb * 1024
  if (file.size < target) return { blob: file, pages, method: 'original', preview: null }
  if (pages > 100)
    throw new Error('For smooth browser processing, choose a document with 100 pages or fewer.')
  progress(9, 'Checking lossless compression...')
  const saved = await original.save({
    useObjectStreams: true,
    objectsPerTick: 30,
    updateFieldAppearances: false,
  })
  const lossless = new Blob([new Uint8Array(saved)], { type: 'application/pdf' })
  let best: PdfResult =
    lossless.size < file.size
      ? { blob: lossless, pages, method: 'lossless', preview: null }
      : { blob: file, pages, method: 'original', preview: null }
  if (best.blob.size < target) return best
  signal.throwIfAborted()
  const pdfjs: typeof import('pdfjs-dist') = await import(/* @vite-ignore */ `${base}pdf.mjs`)
  pdfjs.GlobalWorkerOptions.workerSrc = `${base}pdf.worker.mjs`
  const loading = pdfjs.getDocument({
    data: bytes,
    isEvalSupported: false,
    useSystemFonts: true,
    cMapUrl: `${base}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}standard_fonts/`,
  })
  const cancel = () => {
    void loading.destroy()
  }
  signal.addEventListener('abort', cancel, { once: true })
  try {
    const input = await loading.promise
    const output = await lib.PDFDocument.create()
    output.setTitle(file.name.replace(/\.pdf$/i, ''))
    output.setProducer('Sarkari Form ToolKit')
    output.setCreator('Sarkari Form ToolKit')
    let preview: Blob | null = null
    let remaining = Math.max(2048 * pages, target - 1200 - pages * 650)
    for (let n = 1; n <= pages; n++) {
      signal.throwIfAborted()
      progress(12 + Math.round(((n - 1) / pages) * 80), `Optimizing page ${n} of ${pages}...`)
      const page = await input.getPage(n)
      const natural = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({
        scale: Math.min(2.6, 1900 / Math.max(natural.width, natural.height)),
      })
      const { canvas, ctx } = newCanvas(viewport.width, viewport.height)
      try {
        await page.render({ canvasContext: ctx, viewport, background: '#ffffff' }).promise
        signal.throwIfAborted()
        const jpeg = await fitPage(canvas, Math.max(1600, remaining / (pages - n + 1)), signal)
        remaining -= jpeg.size
        if (n === 1) preview = jpeg
        const image = await output.embedJpg(await jpeg.arrayBuffer())
        const outputPage = output.addPage([natural.width, natural.height])
        outputPage.drawImage(image, { x: 0, y: 0, width: natural.width, height: natural.height })
      } finally {
        canvas.width = 1
        canvas.height = 1
        page.cleanup()
      }
    }
    signal.throwIfAborted()
    progress(96, 'Finishing your download...')
    const compressed = new Blob([new Uint8Array(await output.save({ useObjectStreams: true }))], {
      type: 'application/pdf',
    })
    if (compressed.size < best.blob.size)
      best = { blob: compressed, pages, method: 'raster', preview }
    return best
  } finally {
    signal.removeEventListener('abort', cancel)
    await loading.destroy()
  }
}
