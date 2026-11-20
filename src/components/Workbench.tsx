import { ArrowLeft, ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react'
import { tools, type ToolInfo } from '../data'
import { ToolArtwork } from './Artwork'
import { PhotoResizer } from './PhotoResizer'
import { PdfCompressor } from './PdfCompressor'
import { DocumentScanner } from './DocumentScanner'
import { AgeCalculator } from './AgeCalculator'
import { JpgToPdf, PdfToJpg } from './FileConverters'
import './workbench.css'
import './touch.css'

export function Workbench({ tool }: { tool: ToolInfo }) {
  return (
    <main id="main-content" className={`workbench theme-${tool.id}`}>
      <section className="work-banner blueprint">
        <div className="page-width work-banner-inner">
          <div>
            <div className="breadcrumb">
              <a href="#tools">
                <ArrowLeft size={13} />
                All tools
              </a>
              <ChevronRight size={12} />
              <span>Tool {tool.number}</span>
            </div>
            <h1>{tool.name}</h1>
            <p>{tool.intro}</p>
          </div>
          <ToolArtwork tool={tool.id} />
        </div>
      </section>
      <div className="page-width work-content">
        {tool.id === 'resizer' ? (
          <PhotoResizer />
        ) : tool.id === 'compressor' ? (
          <PdfCompressor />
        ) : tool.id === 'scanner' ? (
          <DocumentScanner />
        ) : tool.id === 'jpg-to-pdf' ? (
          <JpgToPdf />
        ) : tool.id === 'pdf-to-jpg' ? (
          <PdfToJpg />
        ) : (
          <AgeCalculator />
        )}
        <div className="work-bottom">
          <a className="back-link" href="#tools">
            <ArrowLeft size={14} />
            Back to all tools
          </a>
          <span>
            <ShieldCheck size={14} />
            No sign-up. No uploads to a server.
          </span>
        </div>
        <div className="other-tools">
          <div className="eyebrow">ALSO IN YOUR TOOLKIT</div>
          <div>
            {tools
              .filter((other) => other.id !== tool.id)
              .map((other) => (
                <a href={`#tool/${other.id}`} className={`theme-${other.id}`} key={other.id}>
                  <span className="other-tool-number">{other.number}</span>
                  {other.name}
                  <ArrowRight size={15} />
                </a>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
