export function canvasBlob(
  canvas: HTMLCanvasElement,
  type = 'image/jpeg',
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('Your browser could not export this image. Try a smaller file.')),
      type,
      quality,
    ),
  )
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  const image = new Image()
  try {
    image.src = url
    await image.decode()
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('Invalid image')
    if (image.naturalWidth * image.naturalHeight > 64000000)
      throw new Error(
        'This photo is too large to process safely. Please use a photo under 64 megapixels.',
      )
    return image
  } catch (error) {
    if (error instanceof Error && error.message.includes('megapixels')) throw error
    throw new Error(
      'This image could not be opened. Please choose a valid JPG, PNG, or WebP photo.',
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function newCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true })
  if (!ctx)
    throw new Error('Canvas is not supported in this browser. Please use a current browser.')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  return { canvas, ctx }
}

async function setJpegProperties(blob: Blob, minBytes: number) {
  let bytes = new Uint8Array(await blob.arrayBuffer())
  // Store the actual print resolution, rather than the canvas default of 96 DPI.
  if (bytes[2] === 0xff && bytes[3] === 0xe0 && bytes[6] === 0x4a && bytes[7] === 0x46) {
    bytes.set([1, 1, 44, 1, 44], 13)
  } else {
    const header = new Uint8Array([255, 224, 0, 16, 74, 70, 73, 70, 0, 1, 1, 1, 1, 44, 1, 44, 0, 0])
    const updated = new Uint8Array(bytes.length + header.length)
    updated.set(bytes.subarray(0, 2))
    updated.set(header, 2)
    updated.set(bytes.subarray(2), 20)
    bytes = updated
  }
  const parts: BlobPart[] = [bytes.subarray(0, 20)]
  // Valid JPEG comment segments meet portal minimum sizes for very simple signatures.
  let missing = minBytes - bytes.length
  while (missing > 0) {
    const size = Math.min(65537, Math.max(4, missing))
    const comment = new Uint8Array(size).fill(32)
    comment.set([255, 254, (size - 2) >> 8, (size - 2) & 255])
    parts.push(comment)
    missing -= size
  }
  parts.push(bytes.subarray(20))
  return new Blob(parts, { type: 'image/jpeg' })
}

export async function resizeImage(
  file: File,
  width: number,
  height: number,
  maxKb: number,
  minKb: number,
  fit: 'cover' | 'contain',
  signal: AbortSignal,
) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 16 ||
    height < 16 ||
    width > 4096 ||
    height > 4096
  )
    throw new Error('Enter a whole-number width and height between 16 and 4096 pixels.')
  if (!Number.isFinite(maxKb) || maxKb < 1 || maxKb > 10000)
    throw new Error('Enter a maximum file size between 1 and 10,000 KB.')
  const image = await loadImage(file)
  signal.throwIfAborted()
  const { canvas, ctx } = newCanvas(width, height)
  try {
    const ratio = Math[fit === 'cover' ? 'max' : 'min'](width / image.width, height / image.height)
    const w = image.width * ratio,
      h = image.height * ratio
    ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h)
    const limit = Math.floor(maxKb * 1024) - 20
    let best = await canvasBlob(canvas, 'image/jpeg', 0.98)
    if (best.size > limit) {
      let lo = 0.035,
        hi = 0.98
      best = await canvasBlob(canvas, 'image/jpeg', lo)
      if (best.size > limit)
        throw new Error(
          'This size limit is too small for these dimensions. Increase the maximum KB or reduce the dimensions.',
        )
      for (let i = 0; i < 8; i++) {
        signal.throwIfAborted()
        const q = (lo + hi) / 2
        const candidate = await canvasBlob(canvas, 'image/jpeg', q)
        if (candidate.size <= limit) {
          best = candidate
          lo = q
        } else hi = q
      }
    }
    return await setJpegProperties(best, minKb * 1024)
  } finally {
    canvas.width = 1
    canvas.height = 1
  }
}

export async function cleanDocument(
  file: File,
  clean: boolean,
  rotation: number,
  signal: AbortSignal,
) {
  const image = await loadImage(file)
  signal.throwIfAborted()
  const scale = Math.min(1, 2400 / Math.max(image.width, image.height))
  const w = Math.round(image.width * scale),
    h = Math.round(image.height * scale)
  const sideways = rotation % 180 !== 0
  const { canvas, ctx } = newCanvas(sideways ? h : w, sideways ? w : h)
  try {
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(image, -w / 2, -h / 2, w, h)
    if (clean) {
      const width = canvas.width,
        height = canvas.height
      const pixels = ctx.getImageData(0, 0, width, height)
      const gray = new Uint8Array(width * height)
      const stride = width + 1
      const integral = new Uint32Array(stride * (height + 1))
      // A local background estimate removes uneven light instead of globally darkening the page.
      for (let y = 0; y < height; y++) {
        let row = 0
        for (let x = 0; x < width; x++) {
          const i = y * width + x,
            p = i * 4
          gray[i] = (pixels.data[p] * 77 + pixels.data[p + 1] * 150 + pixels.data[p + 2] * 29) >> 8
          row += gray[i]
          integral[(y + 1) * stride + x + 1] = integral[y * stride + x + 1] + row
        }
      }
      const radius = Math.max(10, Math.round(Math.min(width, height) * 0.025))
      for (let y = 0; y < height; y++) {
        if (y % 300 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0))
          signal.throwIfAborted()
        }
        const y1 = Math.max(0, y - radius),
          y2 = Math.min(height, y + radius + 1)
        for (let x = 0; x < width; x++) {
          const x1 = Math.max(0, x - radius),
            x2 = Math.min(width, x + radius + 1)
          const sum =
            integral[y2 * stride + x2] -
            integral[y1 * stride + x2] -
            integral[y2 * stride + x1] +
            integral[y1 * stride + x1]
          const threshold = (sum / ((x2 - x1) * (y2 - y1))) * 0.89
          const i = y * width + x,
            p = i * 4
          const value = gray[i] < Math.max(26, threshold) ? 0 : 255
          pixels.data[p] = pixels.data[p + 1] = pixels.data[p + 2] = value
        }
      }
      ctx.putImageData(pixels, 0, 0)
    }
    const blob = await canvasBlob(canvas, clean ? 'image/png' : 'image/jpeg', 0.93)
    return { blob, width: canvas.width, height: canvas.height }
  } finally {
    canvas.width = 1
    canvas.height = 1
  }
}
