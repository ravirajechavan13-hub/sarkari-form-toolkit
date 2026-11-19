# Sarkari Form ToolKit

A responsive, browser-only workspace for government exam applications. Built with React, TypeScript, Vite, and Tailwind CSS. Fonts, illustrations, and document-processing libraries are served locally. There are no accounts, analytics, file-upload endpoints, or external API keys.

## Run

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the complete `dist/` directory to a static web host. Keep `dist/vendor/` alongside `index.html`: the PDF engines, worker, character maps, and fallback fonts are loaded on demand. Hash-based navigation supports direct links to individual tools without server-side routing.

## Tools

- **Photo & Sign Resizer:** five exam presets, custom pixel dimensions and KB limits, crop or fit options, actual file-size preview, and downloadable 300-DPI JPEGs. The SSC photo preset is 413 x 531 pixels, approximately 3.5 x 4.5 cm at 300 DPI. JPEG quality is adjusted without changing the requested dimensions. For simple images below a preset's minimum size, a valid JPEG comment preserves quality while meeting the byte requirement.
- **PDF Compressor:** first checks the original and a lossless rewrite. If necessary, PDF.js renders pages locally and pdf-lib rebuilds a smaller PDF using adaptively encoded page images. Standard and high modes target 200 KB and 100 KB. The interface reports the measured result, including when a readable file cannot meet the target. Files already below the limit remain unchanged. Rasterized outputs can lose selectable text, links, interactive fields, and digital signatures; keep the original.
- **Document Scanner:** adaptive local thresholding reduces uneven lighting and shadows. Compare the original and processed image, rotate the page, and download a lossless black-and-white PNG or a color JPEG.
- **Age Calculator:** exact calendar differences, including leap years and end-of-month anniversaries, plus configurable inclusive age limits. Eligibility refers only to the selected range in completed years, not all requirements of a real exam.

Exam specifications can vary by notification. Presets are convenient starting points, not official or universal acceptance guarantees.

## Project Map

- `src/App.tsx`: application entry point and hash routing.
- `src/components/SiteLayout.tsx`: homepage, navigation, quick guide, and privacy dialog.
- `src/components/Artwork.tsx`: original SVG document illustrations.
- `src/components/Workbench.tsx`: shared tool workspace.
- `src/components/PhotoResizer.tsx`, `PdfCompressor.tsx`, `DocumentScanner.tsx`, and `AgeCalculator.tsx`: tool interfaces.
- `src/lib/`: image processing, PDF optimization, and calendar math.
- `src/data.ts`: tool metadata, editable exam presets, and download helpers.
- `public/vendor/`: local PDF library distributions and their licenses.

## Verification

Run `npx tsc --noEmit` to type-check the project. With a production preview running on port 4173, the browser smoke suite checks real downloads, exact dimensions, DPI metadata, size limits, PDF page counts, scanner output, eligibility states, navigation, privacy, and responsive layouts from 320 to 1440 pixels.

```sh
npm install --no-save playwright
npx playwright install --with-deps chromium
node scripts/verify.mjs
```

Set `TEST_ORIGIN` to test a different local deployment. `PLAYWRIGHT_MODULE` can point to an external Playwright installation. Generated test files and screenshots are stored in `.checks/`.
