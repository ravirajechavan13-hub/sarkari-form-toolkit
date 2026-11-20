import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { PDFDocument } from 'pdf-lib'

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const origin = (process.env.TEST_ORIGIN || 'http://localhost:4173').replace(/\/$/, '')
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage({
  viewport: { width: 1440, height: 950 },
  reducedMotion: 'reduce',
  acceptDownloads: true,
})
const errors = [],
  external = [],
  uploads = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('request', (r) => {
  if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== new URL(origin).origin)
    external.push(r.url())
  if (['POST', 'PUT'].includes(r.method())) uploads.push(r.url())
})
await fs.mkdir('.checks', { recursive: true })
const go = (route) => page.goto(`${origin}/#${route}`, { waitUntil: 'networkidle' })
const button = (name) => page.getByRole('button', { name, exact: true })
const download = async (name, path) => {
  const [file] = await Promise.all([page.waitForEvent('download'), button(name).click()])
  await file.saveAs(`.checks/${path}`)
  return fs.readFile(`.checks/${path}`)
}
try {
  await go('home')
  await page.evaluate(() => document.fonts.ready)
  assert.equal(await page.locator('.tool-card').count(), 6)
  await page.screenshot({
    path: '.checks/after-top.png',
    clip: { x: 0, y: 0, width: 1440, height: 441 },
  })
  await page.locator('.tool-card').first().screenshot({ path: '.checks/after-card.png' })
  await page.getByRole('link', { name: 'Open JPG to PDF', exact: true }).click()
  assert.equal(await button('Create PDF').isEnabled(), false)
  const input = page.locator('input[type=file]')
  const images = await page.evaluate(() =>
    [
      [420, 620, '#b51d2b', 'first'],
      [630, 360, '#234daa', 'second'],
      [440, 440, '#1c8136', 'third'],
    ].map(([w, h, color, name]) => {
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      ctx.fillStyle = color
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'white'
      ctx.font = '22px sans-serif'
      ctx.fillText(name, 30, 40)
      return { name: `${name}.jpg`, base64: c.toDataURL('image/jpeg', 0.92).split(',')[1] }
    }),
  )
  const files = images.map((img) => ({
    name: img.name,
    mimeType: 'image/jpeg',
    buffer: Buffer.from(img.base64, 'base64'),
  }))
  await input.setInputFiles({
    name: 'wrong.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Wrong type'),
  })
  assert.match(await page.getByRole('alert').innerText(), /not supported/)
  await input.setInputFiles(files)
  await button('Move photo 2 up').click()
  assert.deepEqual(await page.locator('.converter-photo-row strong').allTextContents(), [
    'second.jpg',
    'first.jpg',
    'third.jpg',
  ])
  await button('Fit to photo').click()
  await button('Create PDF').click()
  const merged = await download('Download PDF', 'merged-photos.pdf')
  const decoded = await PDFDocument.load(merged)
  assert.equal(decoded.getPageCount(), 3)
  assert.deepEqual(
    decoded.getPages().map((p) => p.getSize()),
    [
      { width: 472.5, height: 270 },
      { width: 315, height: 465 },
      { width: 330, height: 330 },
    ],
  )
  await button('A4 pages').click()
  assert.equal(await button('Download PDF').count(), 0)
  await button('Remove photo 3').click()
  await button('Create PDF').click()
  const a4 = await PDFDocument.load(await download('Download PDF', 'a4-photos.pdf'))
  assert.equal(a4.getPageCount(), 2)
  assert.deepEqual(a4.getPage(0).getSize(), { width: 841.89, height: 595.28 })
  console.log('PASS: multi-photo upload, order, removal, two page layouts, real multi-page PDF')

  await go('tool/pdf-to-jpg')
  await input.setInputFiles({ name: 'merged.pdf', mimeType: 'application/pdf', buffer: merged })
  await button('Convert to JPG').click()
  const jpg = await download('Download page 1 JPG', 'extracted-first.jpg')
  assert.equal(jpg.readUInt16BE(0), 0xffd8)
  const color = await page.locator('.image-stage img').evaluate(async (img) => {
    await img.decode()
    const c = document.createElement('canvas')
    c.width = 1
    c.height = 1
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0, 1, 1)
    return [...ctx.getImageData(0, 0, 1, 1).data]
  })
  assert.ok(
    color[2] > color[0] * 2 && color[2] > color[1],
    'First extracted page must be the blue image moved to the top',
  )
  await button('Next extracted page').click()
  await button('Download page 2 JPG').waitFor()
  const zip = await download('Download all 3 JPGs as ZIP', 'extracted-all.zip')
  assert.equal(zip.readUInt32LE(0), 0x04034b50)
  assert.equal(zip.readUInt16LE(zip.length - 12), 3)
  const start = 30 + zip.readUInt16LE(26) + zip.readUInt16LE(28)
  assert.deepEqual(zip.subarray(start, start + zip.readUInt32LE(18)), jpg)
  await button('Selected pages').click()
  await page.getByLabel('Page numbers').fill('3, 1, 1')
  await page.getByLabel('Image quality').selectOption('high')
  await button('Convert to JPG').click()
  await button('Next extracted page').click()
  await button('Download page 3 JPG').waitFor()
  await download('Download all 2 JPGs as ZIP', 'extracted-selected.zip')
  for (const invalid of ['0', '4', '2-1', '1,', 'abc', '']) {
    await page.getByLabel('Page numbers').fill(invalid)
    await button('Convert to JPG').click()
    await page.getByRole('alert').waitFor()
    assert.equal(await page.locator('.converter-pager').count(), 0)
  }
  await input.setInputFiles({
    name: 'damaged.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('not a pdf'),
  })
  await button('Convert to JPG').click()
  assert.match(await page.getByRole('alert').innerText(), /could not be opened/)
  console.log(
    'PASS: JPG pixel content, page order, page navigation, valid ZIPs, selected ranges, invalid inputs',
  )

  await go('home')
  const guide = page.locator('#application-guides')
  await guide.getByRole('button', { name: 'Vacancy', exact: true }).click()
  assert.equal(await guide.locator('.application-guide-row').count(), 1)
  await guide.locator('.application-guide-toggle').click()
  await guide.getByRole('button', { name: 'Documents & upload size', exact: true }).click()
  assert.match(await guide.locator('.guide-instructions').innerText(), /6 x 2 cm/)
  await guide.getByRole('button', { name: 'Eligibility & rules', exact: true }).click()
  assert.match(await guide.locator('.guide-instructions').innerText(), /Domicile/)
  await guide.getByRole('button', { name: 'Yojana', exact: true }).click()
  assert.equal(await guide.locator('.application-guide-row').count(), 2)
  for (const row of await guide.locator('.application-guide-row').all()) {
    await row.locator('.application-guide-toggle').click()
    for (const name of ['Kaise bharna hai', 'Documents & upload size', 'Eligibility & rules']) {
      await row.getByRole('button', { name, exact: true }).click()
      assert.ok((await row.locator('.guide-instructions li').count()) >= 3)
    }
  }
  await guide.getByRole('button', { name: 'All guides', exact: true }).click()
  const links = await guide
    .locator('a')
    .evaluateAll((anchors) => anchors.map((a) => ({ href: a.href, rel: a.rel, target: a.target })))
  assert.equal(links.length, 6)
  for (const a of links) {
    assert.match(new URL(a.href).hostname, /\.(gov|nic)\.in$/)
    assert.equal(new URL(a.href).protocol, 'https:')
    assert.equal(a.target, '_blank')
    assert.ok(a.rel.includes('noopener'))
  }
  await page.screenshot({ path: '.checks/updated-home.png', fullPage: true })
  await page.setViewportSize({ width: 320, height: 720 })
  await guide.locator('.application-guide-toggle').first().click()
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await go('tool/jpg-to-pdf')
  await input.setInputFiles(files)
  await button('Create PDF').click()
  await button('Download PDF').waitFor()
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: '.checks/converter-mobile.png', fullPage: true })
  assert.deepEqual(errors, [])
  assert.deepEqual(external, [])
  assert.deepEqual(uploads, [])
  console.log(
    'PASS: guide filters, all topics, official destinations, mobile populated controls, no uploads or third-party requests',
  )
} catch (error) {
  console.error('Visible errors:', await page.getByRole('alert').allTextContents())
  throw error
} finally {
  await browser.close()
}
