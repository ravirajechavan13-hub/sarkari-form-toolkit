import type { ToolId } from './components/Artwork'

export interface ToolInfo {
  id: ToolId
  number: string
  name: string
  description: string
  label: string
  intro: string
}

export const tools: ToolInfo[] = [
  {
    id: 'resizer',
    number: '01',
    name: 'Photo & Sign Resizer',
    description: 'Get the exact photo and signature size for your exam application.',
    label: 'Resize image',
    intro: 'Your photo or signature, resized to the dimensions your application needs.',
  },
  {
    id: 'compressor',
    number: '02',
    name: 'PDF Compressor',
    description: 'Make marksheets and certificates smaller, without the hassle.',
    label: 'Compress PDF',
    intro: 'Make a lighter PDF for your application, without uploading your documents.',
  },
  {
    id: 'scanner',
    number: '03',
    name: 'Document Scanner',
    description: 'Remove shadows and turn phone photos into clean, crisp scans.',
    label: 'Scan document',
    intro: 'Turn a document photo into a clear black-and-white scan, right on your device.',
  },
  {
    id: 'age',
    number: '04',
    name: 'Age Calculator',
    description: 'Check your exact age and eligibility on any exam cut-off date.',
    label: 'Calculate age',
    intro: 'Find your exact age on the notification cut-off date and check the age requirement.',
  },
]

export const presets = [
  {
    name: 'SSC Photo',
    width: 413,
    height: 531,
    min: 20,
    max: 50,
    size: '3.5 x 4.5 cm',
    fit: 'cover',
  },
  { name: 'SSC Sign', width: 472, height: 236, min: 10, max: 20, size: '4 x 2 cm', fit: 'contain' },
  {
    name: 'IBPS Bank Photo',
    width: 200,
    height: 230,
    min: 20,
    max: 50,
    size: '200 x 230 px',
    fit: 'cover',
  },
  {
    name: 'IBPS Declaration',
    width: 800,
    height: 400,
    min: 50,
    max: 100,
    size: '800 x 400 px',
    fit: 'contain',
  },
  {
    name: 'MPSC Photo',
    width: 189,
    height: 246,
    min: 5,
    max: 20,
    size: '189 x 246 px',
    fit: 'cover',
  },
]

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Number((bytes / 1024).toFixed(1))} KB`
  return `${Number((bytes / (1024 * 1024)).toFixed(2))} MB`
}

export function downloadFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60000)
}

export function fileStem(name: string) {
  return name.replace(/\.[^.]+$/, '').slice(0, 100) || 'document'
}
