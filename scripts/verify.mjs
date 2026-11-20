import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { PDFDocument } from 'pdf-lib'

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const origin = process.env.TEST_ORIGIN || 'http://localhost:4173'
const out = '.checks'
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage({
  viewport: { width: 1440, height: 950 },
  acceptDownloads: true,
})
const errors = [],
  uploads = [],
  remote = [],
  requests = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('request', (request) => {
  const url = request.url()
  requests.push(url)
  if (request.method() === 'POST' || request.method() === 'PUT') uploads.push(url)
  if (/^https?:/.test(url) && !url.startsWith(origin)) remote.push(url)
})
const navigate = async (route) => {
  await page.goto(`${origin}/#${route || 'home'}`, { waitUntil: 'networkidle' })
}
const saveDownload = async (action, filename) => {
  const download = page.waitForEvent('download', { timeout: 45000 })
  await action()
  await (await download).saveAs(`${out}/${filename}`)
  return fs.readFile(`${out}/${filename}`)
}
const waitImage = async (width, height) =>
  page.waitForFunction(
    ([w, h]) => {
      const image = document.querySelector('.image-stage img')
      return image?.complete && image.naturalWidth === w && image.naturalHeight === h
    },
    [width, height],
  )

try {
  await navigate('home')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(750)
  assert.equal(await page.locator('.tool-card').count(), 6)
  assert.equal(
    requests.some((url) => url.includes('/vendor/')),
    false,
    'PDF engines should be lazy loaded',
  )
  await page.screenshot({ path: `${out}/home-desktop.png`, fullPage: true })
  await page.getByRole('button', { name: 'Privacy first' }).click()
  assert.equal(await page.locator('dialog[open]').count(), 1)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'How it works', exact: true }).click()
  assert.equal(await page.getByRole('heading', { name: 'Ready in three steps.' }).count(), 1)
  await page.getByRole('button', { name: 'Start exploring' }).click()
  await page.getByRole('button', { name: 'All tools', exact: true }).click()
  await page.locator('.nav-dropdown').getByRole('link', { name: 'Age Calculator' }).click()
  await page.getByLabel('Date of birth', { exact: true }).fill('2003-02-20')
  await page.getByRole('button', { name: 'Calculate age & eligibility' }).click()
  assert.deepEqual(await page.locator('.age-values strong').allTextContents(), ['23', '5', '12'])
  assert.match(await page.locator('.eligibility-status').innerText(), /Eligible for this age range/)
  await page.getByLabel('Maximum age (years)').fill('22')
  assert.equal(await page.locator('.age-values').count(), 0)
  await page.getByRole('button', { name: 'Calculate age & eligibility' }).click()
  assert.match(await page.locator('.eligibility-status').innerText(), /Outside this age range/)
  await page.getByLabel('Date of birth', { exact: true }).fill('2027-01-01')
  await page.getByRole('button', { name: 'Calculate age & eligibility' }).click()
  assert.match(await page.getByRole('alert').innerText(), /on or after/)
  console.log('PASS: navigation, dialogs, exact ages, eligibility, invalid dates')

  const imageBase64 = await page.evaluate(() => {
    const c = document.createElement('canvas')
    c.width = 960
    c.height = 1120
    const ctx = c.getContext('2d'),
      data = ctx.createImageData(c.width, c.height)
    let seed = 101
    for (let y = 0; y < c.height; y++)
      for (let x = 0; x < c.width; x++) {
        seed = (seed * 1664525 + 1013904223) >>> 0
        const value = Math.round(158 + (x / c.width) * 71 + (seed / 4294967296) * 20)
        const i = (y * c.width + x) * 4
        data.data.set([value, Math.min(255, value + 3), Math.min(255, value + 1), 255], i)
      }
    ctx.putImageData(data, 0, 0)
    ctx.fillStyle = '#263a50'
    ctx.font = 'bold 35px sans-serif'
    ctx.fillText('Sample certificate', 70, 95)
    ctx.font = '19px sans-serif'
    for (let i = 0; i < 28; i++)
      ctx.fillText(`Reference ${i + 1}: local processing test document.`, 72, 153 + i * 31)
    return c.toDataURL('image/png').split(',')[1]
  })
  const photo = Buffer.from(imageBase64, 'base64')
  const imageFile = { name: 'sample-document.png', mimeType: 'image/png', buffer: photo }
  await navigate('tool/resizer')
  await page.locator('input[type=file]').setInputFiles(imageFile)
  await waitImage(413, 531)
  const exported = await saveDownload(
    () => page.getByRole('button', { name: 'Download photo' }).click(),
    'ssc-photo.jpg',
  )
  assert.ok(exported.length >= 20480 && exported.length <= 51200)
  assert.equal(exported.readUInt16BE(14), 300)
  assert.equal(exported.readUInt16BE(16), 300)
  for (const [name, w, h, min, max] of [
    ['SSC Sign', 472, 236, 10, 20],
    ['IBPS Bank Photo', 200, 230, 20, 50],
    ['IBPS Declaration', 800, 400, 50, 100],
    ['MPSC Photo', 189, 246, 5, 20],
  ]) {
    await page.getByRole('button', { name, exact: true }).click()
    await waitImage(w, h)
    const size = await page
      .locator('.image-stage img')
      .evaluate(async (img) => (await (await fetch(img.src)).blob()).size)
    assert.ok(size >= min * 1024 && size <= max * 1024, `${name}: invalid file size ${size}`)
  }
  await page.getByRole('button', { name: 'Custom size', exact: true }).click()
  await page.getByLabel('Width (px)').fill('300')
  await page.getByLabel('Height (px)').fill('400')
  await page.getByLabel('Max size (KB)').fill('30')
  await waitImage(300, 400)
  await page.getByLabel('Max size (KB)').fill('0')
  await page.getByRole('alert').waitFor()
  assert.match(await page.getByRole('alert').innerText(), /maximum file size/)
  await page.getByRole('button', { name: 'Remove file' }).click()
  await page.locator('input[type=file]').setInputFiles({
    name: 'wrong.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  })
  assert.match(await page.getByRole('alert').innerText(), /JPG, PNG, or WebP/)
  console.log(
    'PASS: five exam presets, JPG downloads, exact dimensions, 300 DPI, KB ranges, custom settings, invalid files',
  )

  await navigate('tool/scanner')
  await page.locator('input[type=file]').setInputFiles(imageFile)
  await waitImage(960, 1120)
  const pixels = await page.locator('.image-stage img').evaluate((img) => {
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const { data } = ctx.getImageData(0, 0, c.width, c.height)
    let black = 0,
      white = 0,
      other = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === 0) black++
      else if (data[i] === 255) white++
      else other++
    }
    return { black, white, other }
  })
  assert.ok(pixels.black > 5000 && pixels.white > pixels.black * 5 && pixels.other === 0)
  const scan = await saveDownload(
    () => page.getByRole('button', { name: 'Download clean scan' }).click(),
    'clean-scan.png',
  )
  assert.equal(scan.toString('hex', 0, 8), '89504e470d0a1a0a')
  await page.getByRole('button', { name: 'Original', exact: true }).click()
  assert.equal(await page.getByAltText('Original document photo').count(), 1)
  await page.getByRole('button', { name: 'Rotate 90' }).click()
  await waitImage(1120, 960)
  await page.getByRole('switch').click()
  await page.getByRole('button', { name: 'Download document', exact: true }).waitFor()
  assert.equal(await page.getByRole('switch').getAttribute('aria-checked'), 'false')
  console.log(
    'PASS: adaptive shadow cleaning, original comparison, PNG download, rotation, filter toggle',
  )

  const inputPdf = await PDFDocument.create()
  const embed = await inputPdf.embedPng(photo)
  for (let n = 0; n < 2; n++) {
    const p = inputPdf.addPage([595, 842])
    p.drawImage(embed, { x: 0, y: 0, width: 595, height: 842 })
  }
  const pdfBytes = Buffer.from(await inputPdf.save())
  await fs.writeFile(`${out}/source-document.pdf`, pdfBytes)
  assert.ok(pdfBytes.length > 204800)
  await navigate('tool/compressor')
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'test-marksheet.pdf', mimeType: 'application/pdf', buffer: pdfBytes })
  for (const target of [200, 100]) {
    if (target === 100) await page.getByRole('button', { name: /High compress/ }).click()
    const output = await saveDownload(
      () => page.getByRole('button', { name: 'Compress PDF', exact: true }).click(),
      `compressed-${target}.pdf`,
    )
    assert.ok(
      output.length < pdfBytes.length && output.length < target * 1024,
      `Output ${output.length} exceeds ${target} KB`,
    )
    const decoded = await PDFDocument.load(output)
    assert.equal(decoded.getPageCount(), 2)
    assert.deepEqual(decoded.getPage(0).getSize(), { width: 595, height: 842 })
    console.log(
      `PASS: ${target} KB PDF target: ${(pdfBytes.length / 1024).toFixed(1)} KB to ${(output.length / 1024).toFixed(1)} KB; both pages preserved`,
    )
  }
  await page.screenshot({ path: `${out}/compressor-desktop.png`, fullPage: true })
  const small = await PDFDocument.create()
  small.addPage([100, 200])
  const smallPdf = Buffer.from(await small.save())
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'small.pdf', mimeType: 'application/pdf', buffer: smallPdf })
  const unchanged = await saveDownload(
    () => page.getByRole('button', { name: 'Compress PDF', exact: true }).click(),
    'already-small.pdf',
  )
  assert.deepEqual(unchanged, smallPdf)
  await page.locator('input[type=file]').setInputFiles({
    name: 'bad.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('not a PDF document'),
  })
  await page.getByRole('button', { name: 'Compress PDF', exact: true }).click()
  await page.getByRole('alert').waitFor()
  assert.match(await page.getByRole('alert').innerText(), /could not be opened/)
  console.log('PASS: small PDFs preserved unchanged and malformed PDFs handled')

  for (const width of [320, 390, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    for (const route of [
      'home',
      'tool/resizer',
      'tool/compressor',
      'tool/scanner',
      'tool/age',
      'tool/jpg-to-pdf',
      'tool/pdf-to-jpg',
    ]) {
      await navigate(route)
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `Overflow on ${route} at ${width}px`,
      )
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await navigate('home')
  await page.screenshot({ path: `${out}/home-mobile.png`, fullPage: true })
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page
    .locator('#mobile-navigation')
    .getByRole('link', { name: 'Photo & Sign Resizer' })
    .click()
  assert.equal(
    await page.getByRole('heading', { name: 'Photo & Sign Resizer', exact: true }).count(),
    1,
  )
  assert.equal(await page.locator('#mobile-navigation').count(), 0)
  await page.screenshot({ path: `${out}/resizer-mobile.png`, fullPage: true })
  assert.deepEqual(uploads, [], 'No files should leave the device')
  assert.deepEqual(remote, [], 'No third-party requests should be made')
  assert.deepEqual(errors, [], 'No uncaught browser errors')
  console.log(
    'PASS: all seven pages at six widths, mobile navigation, zero third-party requests, zero uploads, zero browser errors',
  )
} catch (error) {
  console.error('Visible errors:', await page.getByRole('alert').allTextContents())
  console.error('Browser errors:', errors)
  await page.screenshot({ path: `${out}/failure.png`, fullPage: true })
  throw error
} finally {
  await browser.close()
}
